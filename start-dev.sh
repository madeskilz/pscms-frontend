#!/bin/bash

# K12 CMS Development Startup Script
echo "🚀 Starting K12 CMS Development Servers..."
echo ""

# Check if data directory exists
if [ ! -d "data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p data
fi

# Check if database exists
if [ ! -f "data/cms.sqlite" ]; then
    echo "🗄️  Setting up database..."
    cd backend
    yarn migrate
    yarn seed
    cd ..
    echo "✅ Database initialized"
    echo ""
fi

# Start backend in background
echo "🔧 Starting Backend (port 3001)..."
cd backend
yarn dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend (port 3000)..."
cd frontend
yarn dev

# Cleanup on exit
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID 2>/dev/null" EXIT
