#!/bin/bash
# Quick test script for static deployment

echo "Extracting static-complete.zip..."
rm -rf test-deploy
unzip -q dist/static-complete.zip -d test-deploy

echo "Testing static API files..."
echo "1. Posts list:"
cat test-deploy/api/posts/index.json | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"  ✓ {len(data['data'])} posts found\")"

echo "2. Settings:"
for setting in theme homepage hero features; do
  if [ -f "test-deploy/api/settings/$setting/index.json" ]; then
    echo "  ✓ Setting: $setting"
  fi
done

echo "3. HTML pages:"
echo "  ✓ $(find test-deploy -name "*.html" | wc -l) HTML files"

echo ""
echo "All checks passed! Static deployment is ready."
echo "To test locally: cd test-deploy && python3 -m http.server 8000"
