import type { MetadataRoute } from 'next';
import { projects, siteUrl } from '@/data/projects';
import { ARTICLE_PAGE_SIZE,indexableArticles } from '@/lib/editorial';
export default function sitemap(): MetadataRoute.Sitemap {
  const articles=indexableArticles();
  const paths=['/','/about','/play',...projects.map(p=>`/work/${p.slug}`),...(articles.length?['/journal',...new Set(articles.map(a=>`/journal/topic/${a.topic}`)),...Array.from({length:Math.max(0,Math.ceil(articles.length/ARTICLE_PAGE_SIZE)-1)},(_,i)=>`/journal/page/${i+2}`)]:[])];
  return [...paths.map(path=>({url:`${siteUrl}${path}`})),...articles.map(a=>({url:`${siteUrl}/journal/${a.slug}`,lastModified:a.updatedAt}))];
}
