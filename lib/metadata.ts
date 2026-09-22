import type { Metadata } from 'next';
import { siteUrl } from '@/data/projects';

export const preventIndexing = process.env.VERCEL_ENV === 'preview' || process.env.SEO_NOINDEX === 'true';
export const defaultDescription = 'Vladislav Imanakov — website and interface design, frontend development, technical SEO and measurement. Selected projects and practical design guides.';

// Nested Next metadata is replaced, not deep-merged. Supply complete social fields.
export function pageMetadata({ title, description, path, locale = 'en_US', image = '/og.png', article, index = true }: {
  title: string; description: string; path: string; locale?: string; image?: string;
  article?: { publishedTime: string; modifiedTime: string }; index?: boolean;
}): Metadata {
  const socialTitle = `${title} — IMANAKOV`;
  return {
    title, description,
    alternates: { canonical: path, types: { 'application/rss+xml': `${siteUrl}/feed.xml` } },
    robots: { index: index && !preventIndexing, follow: true, 'max-image-preview': 'large' },
    openGraph: { type: article ? 'article' : 'website', siteName: 'IMANAKOV', locale, title: socialTitle, description, url: path, images: [{ url: image, alt: socialTitle }], ...article },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [image] },
  };
}
export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;
