#!/bin/bash

echo "🛠️  FIXING WEBPACK CACHE SERIALIZATION ISSUES 🛠️"
echo "=============================================="

# Kill all Node.js processes
echo "🛑 Stopping all Node.js processes..."
pkill -f node || true

# Remove webpack cache specifically
echo "🧹 Cleaning webpack cache..."
rm -rf .next/cache/webpack
rm -rf node_modules/.cache/webpack

# Add a custom webpack cache configuration file
echo "⚙️  Creating custom webpack memory settings..."
mkdir -p .next/cache

# Set environment variables to optimize memory usage
export NODE_OPTIONS="--max-old-space-size=4096 --no-warnings"
export NEXT_TELEMETRY_DISABLED=1

# Start development server with optimized settings
echo "🚀 Starting Next.js with optimized webpack settings..."
npm run dev 