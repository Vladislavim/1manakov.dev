import {sitemapGroups,escapeXML} from '@/lib/seo-sitemap';
import {siteUrl} from '@/data/projects';
export const dynamic='force-static';
export function GET(){return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(sitemapGroups()).map(id=>`<sitemap><loc>${escapeXML(`${siteUrl}/sitemaps/${id}`)}</loc></sitemap>`).join('')}</sitemapindex>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});}
