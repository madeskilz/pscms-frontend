#!/usr/bin/env bash
set -euo pipefail

BASE_API="http://localhost:3001"
BASE_WEB="http://localhost:3000"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

THEMES=(
  classic
  modern
  vibrant
  colorlib-fresh
  colorlib-kids
  colorlib-education
)

function header(){ echo -e "\n==== $1 ====\n"; }
function kill_port(){ local p="$1"; local pid=$(lsof -ti:$p 2>/dev/null || true); [[ -n "$pid" ]] && kill -9 $pid 2>/dev/null || true; }
function wait_for(){ local url="$1"; local name="$2"; for i in {1..30}; do code=$(curl -s -o /dev/null -w '%{http_code}' "$url" || true); if [[ "$code" == "200" || "$code" == "404" ]]; then echo "$name ready"; return 0; fi; sleep 1; done; echo "$name not ready"; return 1; }

if [[ -z "${ATTACHED:-}" ]]; then
  header "Start services"
  kill_port 3001; kill_port 3000
  pushd "$ROOT_DIR/$BACKEND_DIR" >/dev/null
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 18 >/dev/null 2>&1 || true
  nohup yarn dev > /tmp/backend.theme.log 2>&1 & BPID=$!
  popd >/dev/null
  wait_for "$BASE_API/health" "Backend"
  pushd "$ROOT_DIR/$FRONTEND_DIR" >/dev/null
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 18 >/dev/null 2>&1 || true
  nohup yarn dev > /tmp/frontend.theme.log 2>&1 & FPID=$!
  popd >/dev/null
  wait_for "$BASE_WEB/" "Frontend"
else
  echo "ATTACHED=1 set; assuming services already running"
fi

header "Login"
LOGIN=$(curl -s -X POST "$BASE_API/api/auth/login" -H 'Content-Type: application/json' -d '{"email":"admin@school.test","password":"ChangeMe123!"}')
TOKEN=$(echo "$LOGIN" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
if [[ -z "$TOKEN" ]]; then echo "Login failed"; exit 1; fi

header "Test themes"
declare -a RESULTS=()
for t in "${THEMES[@]}"; do
  echo "Switching theme -> $t"
  code=$(curl -s -o /dev/null -w '%{http_code}' -X PUT "$BASE_API/api/settings/theme" \
    -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" \
    -d "{\"value\": { \"active\": \"$t\" }}")
  echo "Update theme status: $code"
  sleep 1
  page_code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE_WEB/")
  echo "Homepage status: $page_code"
  status="FAIL"; [[ "$page_code" =~ ^2|3[0-9]{2}$ ]] && status="PASS"
  RESULTS+=("$t|$status|$page_code|theme:$code")
  sleep 1
 done

header "Summary"
printf "%-20s %-8s %-6s %-10s\n" "Theme" "Status" "Page" "API"
printf "%-20s %-8s %-6s %-10s\n" "--------------------" "--------" "------" "----------"
fail=0; pass=0
for r in "${RESULTS[@]}"; do IFS='|' read -r theme status page api <<< "$r"; printf "%-20s %-8s %-6s %-10s\n" "$theme" "$status" "$page" "$api"; [[ "$status" == "PASS" ]] && ((pass++)) || ((fail++)); done

echo ""; echo "Themes: $pass passed, $fail failed"

if [[ -z "${ATTACHED:-}" ]]; then
  header "Shutdown"
  kill $FPID 2>/dev/null || true; kill $BPID 2>/dev/null || true; kill_port 3000; kill_port 3001
else
  echo "Skip shutdown (attached mode)"
fi
