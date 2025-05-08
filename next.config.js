/** @type {import('next').NextConfig} */
const path = require('path');

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
  // Optimize webpack configuration to fix cache serialization issues
  webpack: (config, { dev, isServer }) => {
    // Fix for webpack cache serialization warnings
    config.infrastructureLogging = {
      level: 'error', // Only display errors, not warnings
    };

    if (dev && !isServer) {
      // Optimize caching for development
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
        maxMemoryGenerations: 1,
        compression: false, // Disable compression to avoid serialization issues
        name: dev ? 'development' : 'production',
        profile: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
