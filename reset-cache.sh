#!/bin/bash

# Stop running Next.js server if any
echo "Stopping any running Next.js servers..."
kill $(lsof -t -i:3000) 2>/dev/null || kill $(lsof -t -i:3001) 2>/dev/null || true

# Remove Next.js cache
echo "Removing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# Clear npm cache (if needed)
echo "Clearing npm cache..."
npm cache clean --force

# Reinstall node modules (optional, uncomment if needed)
# echo "Reinstalling node modules..."
# rm -rf node_modules
# npm install

# Start Next.js
echo "Starting Next.js..."
npm run dev 