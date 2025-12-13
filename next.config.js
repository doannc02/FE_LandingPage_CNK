/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    
    // ✅ THÊM PHẦN NÀY
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fhan1-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fhan*.fna.fbcdn.net',
      },
      {
        protocol: 'http',
        hostname: '103.126.161.89',
      },
      {
        protocol: 'https',
        hostname: '103.126.161.89',
      },
      {
        protocol: 'https',
        hostname: 'connhikhuchadong.vn',
      },
      {
        protocol: 'https',
        hostname: '**.connhikhuchadong.vn',
      },
    ],
  },

  // Compression
  compress: true,

  // Production optimization
  productionBrowserSourceMaps: false,

  // Trailing slash preference (set to false for cleaner URLs)
  trailingSlash: false,

  // Power page optimization
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,

  // Experimental features for better performance
  experimental: {},
}

module.exports = nextConfig