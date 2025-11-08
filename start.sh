#!/usr/bin/env bash
# Quick Start Script for Static CMS

echo "🚀 Static CMS Quick Start"
echo "=========================="
echo ""

# Check if build exists
if [[ ! -d "build" ]]; then
  echo "📦 Building application..."
  ./build-static.sh
else
  echo "✅ Build directory exists"
fi

echo ""
echo "🌐 Starting local server on http://localhost:8080"
echo ""
echo "📝 Admin Login:"
echo "   Email: admin@school.test"
echo "   Password: ChangeMe123!"
echo ""
echo "🔗 Quick Links:"
echo "   Public Site: http://localhost:8080"
echo "   Admin Login: http://localhost:8080#/admin"
echo "   Posts: http://localhost:8080#/posts"
echo ""
echo "💾 Database: Stored in browser localStorage"
echo "   Export: Admin Dashboard → Export Database"
echo "   Import: Admin Dashboard → Import Database"
echo ""
echo "📁 Source Files: /public"
echo "📁 Build Output: /build"
echo ""
echo "🛑 Stop Server: Press Ctrl+C"
echo ""
echo "---"
echo ""

# Start server
cd build && python3 -m http.server 8080
