import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { defaultDescription, pageMetadata, personId, websiteId } from '@/lib/metadata';
import { SiteAnalytics } from '@/components/SiteAnalytics';
import { preventIndexing } from '@/lib/metadata';
import { SiteShell } from '@/components/SiteShell';
import { contact, siteUrl } from '@/data/projects';
import '@/styles/globals.css';
import '@/styles/scenes.css';
import '@/styles/pages.css';
import '@/styles/editorial.css';
import '@/styles/case-motion.css';
import '@/styles/navigation.css';
import '@/styles/choreography.css';
import '@/styles/case-upgrade.css';
import '@/styles/guides.css';
import '@/styles/lab.css';
import '@/styles/guide-workbench.css';
import '@/styles/seo-evidence.css';
import '@/styles/seo-services.css';

const geist = localFont({ src: '../public/fonts/Geist.ttf', variable: '--font-geist', display: 'swap', weight: '100 900' });
export const viewport: Viewport = { themeColor: '#f4f2ed', width: 'device-width', initialScale: 1 };
export const metadata: Metadata = {
  ...pageMetadata({ title: 'Website design, frontend & SEO', description: defaultDescription, path: '/' }),
  metadataBase: new URL(siteUrl),
  title: { default: 'IMANAKOV — Website design, frontend & SEO', template: '%s — IMANAKOV' },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, yandex: process.env.YANDEX_SITE_VERIFICATION || undefined },
  alternates: { types: { 'application/rss+xml': `${siteUrl}/feed.xml` } },
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable}><body>
    <noscript><style>{'.readiness{display:none}'}</style></noscript>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'Person', '@id': personId, name: contact.name, url: `${siteUrl}/about`, sameAs: [contact.telegram, contact.github] }, { '@type': 'WebSite', '@id': websiteId, name: 'IMANAKOV', url: siteUrl, publisher: { '@id': personId }, inLanguage: ['en', 'ru'] }] }).replace(/</g, '\\u003c') }} />
    <SiteShell>{children}<SiteAnalytics hostname={new URL(siteUrl).hostname} production={!preventIndexing} /></SiteShell>
  </body></html>;
}
