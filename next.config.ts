import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/play', destination: '/lab', permanent: true },
      { source: '/journal', destination: '/guides', permanent: true },
      { source: '/journal/:path*', destination: '/guides/:path*', permanent: true },
    ];
  },
  images: { formats: ['image/webp'], deviceSizes: [640,750,828,1080,1200,1440,1920] },
};
export default config;
