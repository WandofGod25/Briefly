#!/bin/bash

echo "🚀 FORCING PRODUCTION BUILD AND START 🚀"
echo "====================================="

# Kill all Node.js processes
echo "🛑 Stopping all Node.js processes..."
pkill -f node || true

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Enforce latest Next.js configuration
echo "⚙️  Setting up production Next.js config..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
  // Force no caching
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
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
    ];
  },
};

module.exports = nextConfig;
EOL

# Build the app in production mode
echo "🏗️  Building app in production mode..."
npm run build

# Start in production mode on a different port
echo "🌐 Starting app in production mode on port 3001..."
PORT=3001 npm run start 