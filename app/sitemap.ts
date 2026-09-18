import type { MetadataRoute } from 'next';
import { projects, siteUrl } from '@/data/projects';
export default function sitemap(): MetadataRoute.Sitemap { return ['/', '/about', '/play', ...projects.map(p => `/work/${p.slug}`)].map(path => ({ url: `${siteUrl}${path}` })); }
