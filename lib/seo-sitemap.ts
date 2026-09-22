import {clientGuides} from '../data/client-guides';
import {publishedGuides,GUIDE_PAGE_SIZE} from './guides';
import {projects,siteUrl} from '../data/projects';
export const SITEMAP_CHUNK_SIZE=500;
export const escapeXML=(value:string)=>value.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export function sitemapGroups(){
 const guides=publishedGuides(),topics=[...new Set(guides.map(g=>g.topic))];
 const pages=(base:string,count:number)=>Array.from({length:Math.max(0,Math.ceil(count/GUIDE_PAGE_SIZE)-1)},(_,i)=>`${base}/page/${i+2}`);
 const paths=['/','/about','/lab',...clientGuides.map(g=>`/for-business/${g.slug}`),...projects.map(p=>`/work/${p.slug}`),...(guides.length?['/guides','/guides/editorial-policy',...pages('/guides',guides.length),...topics.flatMap(t=>[`/guides/topic/${t}`,...pages(`/guides/topic/${t}`,guides.filter(g=>g.topic===t).length)])]:[])];
 const groups:Record<string,{url:string;updatedAt?:string}[]>={site:paths.map(p=>({url:siteUrl+p}))};
 for(let i=0;i<guides.length;i+=SITEMAP_CHUNK_SIZE)groups[`guides-${i/SITEMAP_CHUNK_SIZE}`]=guides.slice(i,i+SITEMAP_CHUNK_SIZE).map(g=>({url:siteUrl+g.canonical,updatedAt:g.updatedAt}));
 return groups;
}
export const sitemapXML=(rows:{url:string;updatedAt?:string}[])=>`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${rows.map(r=>`<url><loc>${escapeXML(r.url)}</loc>${r.updatedAt?`<lastmod>${escapeXML(r.updatedAt)}</lastmod>`:''}</url>`).join('')}</urlset>`;
