import { publishedGuides } from '@/lib/guides';
import { siteUrl } from '@/data/projects';
export const dynamic='force-static';
const xml=(value:string)=>value.replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]!));
export function GET(){const items=publishedGuides().sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,50).map(a=>`<item><title>${xml(a.h1)}</title><link>${siteUrl}/guides/${a.slug}</link><guid isPermaLink="true">${siteUrl}/guides/${a.slug}</guid><description>${xml(a.description)}</description><pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate></item>`).join('');return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>IMANAKOV — Материалы о дизайне</title><link>${siteUrl}/guides</link><description>Дизайн интерфейсов в деталях</description><language>ru-ru</language>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});}
