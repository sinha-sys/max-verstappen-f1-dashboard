/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export to avoid prerender issues
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  // Cloudflare Pages optimizations
  experimental: {
    // Optimize for smaller builds
  },
  // Exclude API routes from static generation
  generateBuildId: () => 'build',
  // Optimize bundle size and reduce cache
  webpack: (config, { isServer, dev }) => {
    // Only disable cache in production to avoid large files
    if (!dev) {
      config.cache = {
        type: 'memory', // Use memory cache instead of filesystem
      };
      // Optimize chunk sizes
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 20000000, // 20MB max chunk size
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
