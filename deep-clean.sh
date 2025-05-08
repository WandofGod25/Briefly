#!/bin/bash

echo "🧨 PERFORMING DEEP CLEAN OF NEXT.JS PROJECT 🧨"
echo "==========================================="

# Kill all Node.js processes
echo "🛑 Killing all Node.js processes..."
pkill -f node || true

# Remove all cache directories
echo "🗑️  Removing all cache and build directories..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf public/sw.js
rm -rf public/workbox-*.js
rm -rf .turbo
rm -rf .vercel/output
find . -name ".DS_Store" -delete

# Clear npm cache
echo "🧹 Clearing NPM cache..."
npm cache clean --force

# Create a completely new temporary directory and copy everything there
echo "📂 Creating clean project copy..."
TEMP_DIR="/tmp/briefly-clean-$(date +%s)"
mkdir -p "$TEMP_DIR"
rsync -av --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude '.turbo' ./ "$TEMP_DIR/"

# Switch to the temp directory
echo "🔄 Switching to clean directory at $TEMP_DIR"
cd "$TEMP_DIR"

# Install fresh dependencies
echo "📦 Installing fresh dependencies..."
npm install

# Build for production to ensure everything compiles
echo "🏗️  Building project to verify integrity..."
npm run build

# Start in development mode
echo "🚀 Starting development server with clean state..."
npm run dev 