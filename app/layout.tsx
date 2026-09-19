import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SiteShell } from '@/components/SiteShell';
import { contact, siteUrl } from '@/data/projects';
import '@/styles/globals.css';
import '@/styles/scenes.css';
import '@/styles/pages.css';
import '@/styles/editorial.css';

const geist = localFont({ src: '../public/fonts/Geist.ttf', variable: '--font-geist', display: 'swap', weight: '100 900' });
export const viewport: Viewport = { themeColor: '#f4f2ed', width: 'device-width', initialScale: 1 };
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'IMANAKOV — Product designer', template: '%s — IMANAKOV' },
  description: 'Vladislav Imanakov. Design, frontend and digital experiences. Explore selected websites, interface concepts and interaction studies.',
  openGraph: { type: 'website', siteName: 'IMANAKOV', locale: 'en_US', images: [{ url: '/og.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable}><body>
    <noscript><style>{'.readiness{display:none}'}</style></noscript>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: contact.name, url: siteUrl, sameAs: [contact.telegram, contact.github] }).replace(/</g, '\\u003c') }} />
    <SiteShell>{children}</SiteShell>
  </body></html>;
}
