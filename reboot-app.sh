#!/bin/bash

echo "🔄 Rebooting Briefly app and clearing all caches..."

# Stop any running Next.js processes
echo "📋 Stopping any running Next.js servers..."
pkill -f next || true
kill $(lsof -t -i:3000) 2>/dev/null || true
kill $(lsof -t -i:3001) 2>/dev/null || true

# Clean Next.js cache and build
echo "🧹 Cleaning Next.js cache and build files..."
rm -rf .next
rm -rf node_modules/.cache

# Clear browser cache hint
echo "⚠️  Remember to clear your browser cache with Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)"

# Reinstall packages if needed
if [ "$1" == "--full" ]; then
  echo "📦 Reinstalling dependencies (--full option detected)..."
  rm -rf node_modules
  npm install
fi

# Add cache-busting for development mode
echo "📝 Updating next.config.js with stronger cache prevention..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
  // Disable font optimization to avoid cache issues with custom fonts
  optimizeFonts: false,
  // Ensure browser doesn't cache CSS/JS during development
  headers: async () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return isDevelopment ? [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ] : [];
  },
  // Add version timestamp to force reloading of assets
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;
EOL

# Start Next.js in development mode
echo "🚀 Starting Next.js in development mode..."
npm run dev 