import {sitemapGroups,sitemapXML} from '@/lib/seo-sitemap';
export const dynamic='force-static';
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(sitemapGroups()).map(id=>({id}));}
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const{id}=await params;const group=sitemapGroups()[id];if(!group)return new Response('Not found',{status:404});return new Response(sitemapXML(group),{headers:{'Content-Type':'application/xml; charset=utf-8'}});}
