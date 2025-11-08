#!/usr/bin/env bash
set -euo pipefail

BASE_API="http://localhost:3001"
BASE_WEB="http://localhost:3000"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
# Derive repo root from this script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

function header(){ echo -e "\n==== $1 ====\n"; }
declare -a RESULTS=()

function check(){
  local name="$1"; shift
  local url="$1"; shift
  local auth_needed="${3:-false}"
  local expect_success="${4:-true}"
  echo "[GET] $url" >&2
  if [[ "$auth_needed" == "true" && -n "${ACCESS_TOKEN:-}" ]]; then
    http_code=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" -o /tmp/resp.json -w '%{http_code}' "$url" || true)
  else
    http_code=$(curl -s -o /tmp/resp.json -w '%{http_code}' "$url" || true)
  fi
  local status="FAIL"
  if [[ "$expect_success" == "true" ]]; then
    if [[ "$http_code" =~ ^2|3[0-9]{2}$ ]]; then status="PASS"; fi
  else
    if [[ ! "$http_code" =~ ^2|3[0-9]{2}$ ]]; then status="PASS"; fi
  fi
  echo "$status: $name ($http_code)"
  RESULTS+=("$name|$status|$http_code")
}

function wait_for_service(){
  local url="$1"
  local name="$2"
  local max_attempts=30
  local attempt=1
  echo "Waiting for $name to be ready..."
  while [ $attempt -le $max_attempts ]; do
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|404"; then
      echo "$name is ready!"
      return 0
    fi
    echo "Attempt $attempt/$max_attempts - $name not ready yet..."
    sleep 1
    attempt=$((attempt + 1))
  done
  echo "$name failed to start within timeout"
  return 1
}

function kill_port(){
  local port="$1"
  local pid=$(lsof -ti:$port 2>/dev/null || true)
  if [[ -n "$pid" ]]; then
    echo "Killing process on port $port (PID: $pid)"
    kill -9 $pid 2>/dev/null || true
    sleep 1
  fi
}

function start_backend(){
  header "Start Backend"
  kill_port 3001
  pushd "$ROOT_DIR/$BACKEND_DIR" >/dev/null
  # Ensure Node 18+ is active
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm use 18 >/dev/null 2>&1 || true
  nohup yarn dev > /tmp/backend.log 2>&1 &
  BACKEND_PID=$!
  popd >/dev/null
  echo "Backend starting with PID=$BACKEND_PID"
  wait_for_service "$BASE_API/health" "Backend"
}

function start_frontend(){
  header "Start Frontend"
  kill_port 3000
  pushd "$ROOT_DIR/$FRONTEND_DIR" >/dev/null
  # Ensure Node 18+ is active
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm use 18 >/dev/null 2>&1 || true
  nohup yarn dev > /tmp/frontend.log 2>&1 &
  FRONTEND_PID=$!
  popd >/dev/null
  echo "Frontend starting with PID=$FRONTEND_PID"
  wait_for_service "$BASE_WEB/" "Frontend"
}

function stop_all(){
  header "Shutdown"
  [[ -n "${FRONTEND_PID:-}" ]] && kill $FRONTEND_PID 2>/dev/null || true
  [[ -n "${BACKEND_PID:-}" ]] && kill $BACKEND_PID 2>/dev/null || true
  kill_port 3000
  kill_port 3001
}
if [[ -z "${ATTACHED:-}" ]]; then
  trap stop_all EXIT
fi

if [[ -z "${ATTACHED:-}" ]]; then
  start_backend
  start_frontend
else
  echo "ATTACHED=1 set; skipping service start/stop"
fi

header "Backend Health"
check "Health Endpoint" "$BASE_API/health"

header "Auth"
login_resp=$(curl -s -X POST "$BASE_API/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@school.test","password":"ChangeMe123!"}')
echo "$login_resp" > /tmp/login.json
ACCESS_TOKEN=$(echo "$login_resp" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//g')

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "FAIL: Login (no accessToken)" >&2
  RESULTS+=("Login|FAIL|no_token")
else
  echo "PASS: Login (accessToken extracted)"
  RESULTS+=("Login|PASS|token_ok")
fi

header "Protected Routes"
if [[ -n "$ACCESS_TOKEN" ]]; then
  me_code=$(curl -s -o /tmp/me.json -w '%{http_code}' -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_API/api/auth/me")
  echo "Auth /me status: $me_code"
  RESULTS+=("Profile (/me)|$( [[ "$me_code" =~ ^2|3[0-9]{2}$ ]] && echo PASS || echo FAIL )|$me_code")
fi
check "Posts" "$BASE_API/api/posts" true true
if [[ -n "$ACCESS_TOKEN" ]]; then
  media_code=$(curl -s -o /tmp/media.json -w '%{http_code}' -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_API/api/media")
  echo "Media list status: $media_code"
  RESULTS+=("Media|$( [[ "$media_code" =~ ^2|3[0-9]{2}$ ]] && echo PASS || echo FAIL )|$media_code")
fi
# Root settings requires auth + manage_settings; treat 401 as PASS for non-admin smoke or remove entirely.
# For now remove root listing from smoke to prevent false failure.
# check "Settings" "$BASE_API/api/settings" true true

header "Settings Keys"
check "Setting theme" "$BASE_API/api/settings/theme" false true
check "Setting homepage" "$BASE_API/api/settings/homepage" false true
if [[ -n "$ACCESS_TOKEN" ]]; then
  settings_root_code=$(curl -s -o /tmp/settings_root.json -w '%{http_code}' -H "Authorization: Bearer $ACCESS_TOKEN" "$BASE_API/api/settings")
  echo "Settings root status: $settings_root_code"
  RESULTS+=("Settings Root|$( [[ "$settings_root_code" =~ ^2|3[0-9]{2}$ ]] && echo PASS || echo FAIL )|$settings_root_code")
fi

header "Frontend Pages"
check "Homepage" "$BASE_WEB/"
check "Posts Index" "$BASE_WEB/posts"
check "About" "$BASE_WEB/about"
check "Contact" "$BASE_WEB/contact"
check "Admin Login" "$BASE_WEB/admin/login"

header "Test Summary"
echo ""
printf "%-30s %-8s %-10s\n" "Test Name" "Status" "HTTP Code"
printf "%-30s %-8s %-10s\n" "------------------------------" "--------" "----------"
for res in "${RESULTS[@]}"; do
  IFS='|' read -r name status code <<< "$res"
  printf "%-30s %-8s %-10s\n" "$name" "$status" "$code"
done

pass_count=$(printf '%s\n' "${RESULTS[@]}" | grep -c '|PASS|' || true)
fail_count=$(printf '%s\n' "${RESULTS[@]}" | grep -c '|FAIL|' || true)
total_count=${#RESULTS[@]}

echo ""
echo "Results: $pass_count passed, $fail_count failed, $total_count total"
if [[ $fail_count -gt 0 ]]; then
  echo "SMOKE TEST FAILED"
  exit 1
else
  echo "SMOKE TEST PASSED"
fi
