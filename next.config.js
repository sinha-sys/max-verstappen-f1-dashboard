/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  // Cloudflare Pages compatibility
  experimental: {
    // Remove serverComponentsExternalPackages to avoid conflicts
  },
};

module.exports = nextConfig;
