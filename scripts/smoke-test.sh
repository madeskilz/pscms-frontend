#!/usr/bin/env bash
set -euo pipefail

BASE_API="http://localhost:3001"
BASE_WEB="http://localhost:3000"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
ROOT_DIR="/Applications/MAMP/htdocs/pscms-frontend"

function header(){ echo -e "\n==== $1 ====\n"; }
declare -a RESULTS=()
function check(){
  local name="$1"; shift
  local url="$1"; shift
  local expect_success="${3:-true}"
  echo "[GET] $url" >&2
  http_code=$(curl -s -o /tmp/resp.json -w '%{http_code}' "$url" || true)
  local status="FAIL"
  if [[ "$expect_success" == "true" ]]; then
    if [[ "$http_code" =~ ^2|3[0-9]{2}$ ]]; then status="PASS"; fi
  else
    if [[ ! "$http_code" =~ ^2|3[0-9]{2}$ ]]; then status="PASS"; fi
  fi
  echo "$status: $name ($http_code)"
  RESULTS+=("$name|$status|$http_code")
}

function start_backend(){
  header "Start Backend"
  pushd "$ROOT_DIR/$BACKEND_DIR" >/dev/null
  yarn dev > /tmp/backend.log 2>&1 &
  BACKEND_PID=$!
  popd >/dev/null
  sleep 3
  if ps -p "$BACKEND_PID" > /dev/null 2>&1; then echo "Backend started PID=$BACKEND_PID"; else echo "Backend failed"; fi
}
function start_frontend(){
  header "Start Frontend"
  pushd "$ROOT_DIR/$FRONTEND_DIR" >/dev/null
  yarn dev > /tmp/frontend.log 2>&1 &
  FRONTEND_PID=$!
  popd >/dev/null
  sleep 4
  if ps -p "$FRONTEND_PID" > /dev/null 2>&1; then echo "Frontend started PID=$FRONTEND_PID"; else echo "Frontend failed"; fi
}
function stop_all(){
  header "Shutdown"
  [[ -n "${FRONTEND_PID:-}" ]] && kill $FRONTEND_PID 2>/dev/null || true
  [[ -n "${BACKEND_PID:-}" ]] && kill $BACKEND_PID 2>/dev/null || true
}
trap stop_all EXIT

start_backend
start_frontend

header "API Health"
check "Health" "$BASE_API/health"

header "Settings (expect 404 if unset)"
check "Settings site_title (expect 404)" "$BASE_API/api/settings/site_title" false

header "Auth (login)"
login_resp=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"email":"admin@school.test","password":"ChangeMe123!"}' "$BASE_API/api/auth/login" || true)
if echo "$login_resp" | grep -q 'token'; then
  echo "PASS: Login returned token"
  token=$(echo "$login_resp" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
else
  echo "FAIL: Login no token"
  token=""
fi

if [[ -n "$token" ]]; then
  header "Auth Me"
  me_code=$(curl -s -o /tmp/me.json -w '%{http_code}' -H "Authorization: Bearer $token" "$BASE_API/api/auth/me")
  echo "Auth /me status: $me_code"
  RESULTS+=("AuthMe|$( [[ "$me_code" =~ ^2|3[0-9]{2}$ ]] && echo PASS || echo FAIL )|$me_code")
fi

header "Posts List"
check "Posts list" "$BASE_API/api/posts"

header "POST Create Draft"
if [[ -n "$token" ]]; then
  create_code=$(curl -s -o /tmp/postcreate.json -w '%{http_code}' -H "Authorization: Bearer $token" -H 'Content-Type: application/json' -d '{"title":"Smoke Test Post","slug":"smoke-test-post","content":"Temporary post.","status":"draft","type":"post"}' "$BASE_API/api/posts")
  RESULTS+=("CreatePost|$( [[ "$create_code" =~ ^2|3[0-9]{2}$ ]] && echo PASS || echo FAIL )|$create_code")
  echo "Create post status: $create_code"
fi

header "Web Pages"
check "Homepage" "$BASE_WEB/"
check "Admin Login Page" "$BASE_WEB/admin/login"

header "Summary"
grep -E '^(PASS|FAIL):' <(cat <<EOF
$(bash -lc 'typeset -f check >/dev/null')
EOF
) >/dev/null 2>&1 || true

# Simple overall exit status heuristic: if login failed, exit 1
if [[ -z "$token" ]]; then
  echo "Overall Status: DEGRADED (auth failed)"; exit 1
else
  echo "Overall Status: OK"; exit 0
fi
