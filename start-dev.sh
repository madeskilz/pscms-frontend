#!/bin/bash
set -e

# K12 CMS Development Startup Script (ensures Node 18 via nvm)
echo "🚀 Starting K12 CMS Development Servers..."
echo ""

# Ensure nvm + Node 18
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$HOME/.nvm/nvm.sh"
fi

if command -v nvm >/dev/null 2>&1; then
    if [ -f .nvmrc ]; then
        nvm use >/dev/null || true
    else
        nvm use 18 >/dev/null || true
    fi
fi

NODE_VERSION=$(node -v 2>/dev/null || echo "none")
REQUIRED_MAJOR=18
if [ "$NODE_VERSION" = "none" ]; then
    echo "❌ Node.js not found. Please install Node ${REQUIRED_MAJOR}."
    exit 1
fi
MAJOR=$(echo "$NODE_VERSION" | sed 's/v\([0-9]*\).*/\1/')
if [ "$MAJOR" -lt "$REQUIRED_MAJOR" ]; then
    echo "❌ Detected $NODE_VERSION. Node ${REQUIRED_MAJOR}+ required. Load nvm and retry: 'nvm install 18 && nvm use 18'"
    exit 1
fi
echo "✅ Using Node $NODE_VERSION"
echo ""

# Proactively free ports 3001 and 3000 to avoid EADDRINUSE
echo "🧹 Checking ports..."
if lsof -nP -iTCP:3001 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "   - Freeing port 3001"
    lsof -nP -iTCP:3001 -sTCP:LISTEN -t | xargs -r kill -TERM 2>/dev/null || true
    sleep 1
    lsof -nP -iTCP:3001 -sTCP:LISTEN -t | xargs -r kill -KILL 2>/dev/null || true
fi
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "   - Freeing port 3000"
    lsof -nP -iTCP:3000 -sTCP:LISTEN -t | xargs -r kill -TERM 2>/dev/null || true
    sleep 1
    lsof -nP -iTCP:3000 -sTCP:LISTEN -t | xargs -r kill -KILL 2>/dev/null || true
fi
echo ""

# Check if data directory exists
if [ ! -d "data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p data
fi

# Check if database exists
if [ ! -f "data/cms.sqlite" ]; then
    echo "🗄️  Setting up database..."
    (cd backend && yarn migrate && yarn seed)
    echo "✅ Database initialized"
    echo ""
else
    echo "🗄️  Existing database detected (data/cms.sqlite). Skipping migration/seed."
    echo ""
fi

# Start backend in background
echo "🔧 Starting Backend (port 3001)..."
(cd backend && yarn dev &) 
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend (port 3000)..."
cd frontend
if [ -z "$SKIP_THEME_SETUP" ]; then
    # Apply default kid-friendly theme and parent links if not present
    echo "🧩 Ensuring default theme and parent quick links..."
    TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@school.test","password":"ChangeMe123!"}' | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p') || true
    if [ -n "$TOKEN" ]; then
        CURRENT_THEME=$(curl -s http://localhost:3001/api/settings/theme | sed -n 's/.*"value":"\(.*\)".*/\1/p') || true
        # Fetch raw JSON storing theme active value
        RAW=$(curl -s http://localhost:3001/api/settings/theme | sed -n 's/.*"value":"\(.*\)".*/\1/p') || true
        APPLY_THEME_PAYLOAD='{"active":"colorlib-kids"}'
        curl -s -X PUT http://localhost:3001/api/settings/theme -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{\"value\":$APPLY_THEME_PAYLOAD}" >/dev/null || true
        # Parent quick links menu augmentation
        EXISTING_MENU=$(curl -s http://localhost:3001/api/menus/primary | sed -n 's/.*"items":\(.*\)}/\1/p') || true
        if [ -z "$EXISTING_MENU" ] || echo "$EXISTING_MENU" | grep -vq 'Parents'; then
            MENU_PAYLOAD='[{"label":"Home","href":"/"},{"label":"About","href":"/about"},{"label":"Admissions","href":"/posts/welcome-back"},{"label":"Calendar","href":"/posts/sports-day-highlights"},{"label":"PTA","href":"/posts"},{"label":"Parents","href":"/parents"},{"label":"Contact","href":"/contact"}]'
            curl -s -X PUT http://localhost:3001/api/menus/primary -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{\"items\":$MENU_PAYLOAD}" >/dev/null || true
        fi
    else
        echo "⚠️  Could not obtain admin token to set theme/menu automatically."
    fi
fi

yarn dev || {
    echo "❌ Frontend failed to start.";
    kill $BACKEND_PID 2>/dev/null || true;
    exit 1;
}

# Cleanup on exit
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID 2>/dev/null" EXIT
