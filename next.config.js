/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  // Fix for Cloudflare Pages static generation
  experimental: {
    serverComponentsExternalPackages: ['recharts'],
  },
  // Disable static optimization for problematic pages
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
