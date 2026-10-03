import type { MetadataRoute } from 'next';
import { siteUrl } from '@/data/projects';
export const dynamic = 'force-static';
const privatePreview = process.env.SEO_NOINDEX === 'true';
export default function robots(): MetadataRoute.Robots {
  return privatePreview
    ? { rules: { userAgent: '*', disallow: '/' } }
    : { rules: { userAgent: '*', allow: '/' }, sitemap: `${siteUrl}/sitemap.xml` };
}
