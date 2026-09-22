import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return process.env.VERCEL_ENV === 'preview' || process.env.SEO_NOINDEX === 'true'
      ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] }]
      : [];
  },
  async redirects() {
    return [
      ...['www.imanakov.dev'].map(host => ({
        source: '/:path*', has: [{ type: 'host' as const, value: host }],
        destination: 'https://imanakov.dev/:path*', permanent: true,
      })),
      { source: '/play', destination: '/lab', permanent: true },
      { source: '/journal', destination: '/guides', permanent: true },
      { source: '/journal/:path*', destination: '/guides/:path*', permanent: true },
    ];
  },
  images: { formats: ['image/webp'], deviceSizes: [640,750,828,1080,1200,1440,1920] },
};
export default config;
