#!/usr/bin/env bash
# Post-deployment smoke test.
# Usage: ./scripts/verify-deployment.sh <frontend-url> [backend-url]
# Example: ./scripts/verify-deployment.sh https://work-spark-website-weld.vercel.app https://your-api.onrender.com
set -u
FRONT="${1:?usage: verify-deployment.sh <frontend-url> [backend-url]}"
API="${2:-}"
FAIL=0
ok()   { echo "  PASS  $1"; }
bad()  { echo "  FAIL  $1"; FAIL=1; }

echo "Frontend: $FRONT"
code=$(curl -s -o /tmp/ws_front.html -w '%{http_code}' -L --max-time 20 "$FRONT")
[ "$code" = "200" ] && ok "returns HTTP 200" || bad "expected 200, got $code"
grep -qi "<title>.*WorkSpark" /tmp/ws_front.html && ok "page title contains WorkSpark" || bad "title missing"
grep -q 'id="app"' /tmp/ws_front.html && ok "app mount point present" || bad "app mount point missing"
curl -sI -L --max-time 20 "$FRONT" | grep -qi '^strict-transport-security' && ok "HSTS header present" || echo "  WARN  no HSTS header"

if [ -n "$API" ]; then
  echo "Backend: $API"
  curl -fsS --max-time 20 "$API/actuator/health" | grep -q '"status":"UP"' && ok "health endpoint is UP" || bad "health endpoint not UP"
  curl -fsS --max-time 20 "$API/api/jobs?page=0&size=5" | grep -q '"content"' && ok "jobs endpoint is paginated" || bad "jobs endpoint not paginated"
  c=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$API/h2-console")
  { [ "$c" = "403" ] || [ "$c" = "404" ]; } && ok "H2 console blocked ($c)" || bad "H2 console reachable ($c)"
  c=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$API/api/admin/jobs")
  { [ "$c" = "401" ] || [ "$c" = "403" ]; } && ok "admin API protected ($c)" || bad "admin API open ($c)"
fi

[ "$FAIL" = 0 ] && echo "All checks passed" || { echo "Some checks failed"; exit 1; }
