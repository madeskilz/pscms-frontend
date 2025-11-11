#!/bin/bash

# Static Site Development Server Script
# Builds the static site and starts the development server

echo "🚀 Starting static site development environment..."
echo ""

# Build the static site
./build-static.sh

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🌐 Starting development server on port 8080..."
echo "   Open: http://localhost:8080"
echo "   Press Ctrl+C to stop the server"
echo ""

# Change to dist directory and start server
cd dist && python3 -m http.server 8080
