#!/bin/bash

echo "🧠 TARGETING SPECIFIC NEXT.JS CACHING ISSUES 🧠"
echo "==========================================="

# Kill all processes
echo "🛑 Killing all Node.js processes..."
pkill -f node || true

# Remove specific cache files that often cause issues
echo "🗑️  Removing problematic cache files..."
find .next -name "*.hot-update.*" -delete 2>/dev/null || true
find .next -name "cache" -type d -exec rm -rf {} + 2>/dev/null || true
rm -rf .next/cache/next-babel-loader/
rm -rf .next/static/chunks/pages
rm -rf .next/static/development

# Create a development-only Service Worker unregister script
echo "🔄 Creating cache busting script..."
mkdir -p public
cat > public/reset-cache.js << 'EOL'
// This script unregisters service workers and clears caches
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Service worker unregistered');
    }
  });
}

// Clear all caches
if ('caches' in window) {
  caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      caches.delete(cacheName);
      console.log('Cache deleted:', cacheName);
    });
  });
}

// Force reload from server
window.location.reload(true);
console.log('Reset cache script executed');
EOL

# Add a cache-busting timestamp to main CSS file
echo "⏱️  Adding timestamp to CSS files for cache-busting..."
find src -name "*.css" -exec sh -c 'echo "/* Cache-buster: $(date +%s) */" >> {}' \;

# Modify the app layout to include cache-busting meta tags
echo "📝 Adding cache-busting meta tags to layout..."
LAYOUT_FILE="src/app/layout.tsx"

if [ -f "$LAYOUT_FILE" ]; then
  # Add cache-busting meta tags if they don't exist
  if ! grep -q "cache-control" "$LAYOUT_FILE"; then
    sed -i.bak '/<head>/a\
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\
        <meta httpEquiv="Pragma" content="no-cache" />\
        <meta httpEquiv="Expires" content="0" />\
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />\
        <script src="/reset-cache.js?v='$(date +%s)'"></script>' "$LAYOUT_FILE"
    echo "✅ Added cache-busting meta tags to layout"
  else
    echo "ℹ️  Cache-busting meta tags already exist in layout"
  fi
else
  echo "⚠️  Layout file not found at $LAYOUT_FILE"
fi

# Start with special flags to ignore all caches
echo "🚀 Starting with clean caches..."
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--no-warnings --max-old-space-size=4096" npm run dev 