import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleBody } from '@/components/ArticleBody';
import { Footer } from '@/components/Footer';
import { getArticles, topicNames, articleProblems } from '@/lib/editorial';
import { siteUrl, contact } from '@/data/projects';
export const dynamicParams = false;
export function generateStaticParams() { return getArticles().filter(a => a.status !== 'draft').map(a => ({slug:a.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug} = await params; const a = getArticles().find(a => a.slug === slug && a.status !== 'draft');
  if (!a) return {robots:{index:false,follow:false}};
  return {title:a.title,description:a.description,alternates:{canonical:`/journal/${slug}`},robots:{index:a.status==='indexable'&&articleProblems(a).length===0,follow:true},openGraph:{type:'article',locale:'ru_RU',title:a.title,description:a.description,url:`/journal/${slug}`,publishedTime:a.publishedAt,modifiedTime:a.updatedAt,images:[{url:'/og.png',width:1200,height:630,alt:a.h1}]},twitter:{card:'summary_large_image',title:a.title,description:a.description,images:['/og.png']}};
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params; const articles = getArticles(); const a = articles.find(a => a.slug === slug && a.status !== 'draft'); if(!a) notFound();
  const related = articles.filter(item => a.related.includes(item.slug) && item.status==='indexable' && articleProblems(item).length===0);
  const url = `${siteUrl}/journal/${slug}`;
  const schema = [{'@context':'https://schema.org','@type':'Article',headline:a.h1,description:a.description,datePublished:a.publishedAt,dateModified:a.updatedAt,inLanguage:'ru-RU',mainEntityOfPage:url,url,author:{'@type':'Person',name:contact.name,url:`${siteUrl}/about`},image:`${siteUrl}/og.png`,citation:a.sources.map(s=>s.url)}, {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Главная',item:siteUrl},{'@type':'ListItem',position:2,name:'Журнал',item:`${siteUrl}/journal`},{'@type':'ListItem',position:3,name:a.h1,item:url}]}];
  return <><main id="main" tabIndex={-1} lang="ru" className="journal-shell article-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} />
    <nav className="journal-breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/journal">Журнал</Link><span>/</span><Link href={`/journal/topic/${a.topic}`}>{topicNames[a.topic]}</Link></nav>
    <article><header className="journal-heading"><span className="eyebrow">{topicNames[a.topic]} / <time dateTime={a.updatedAt}>{a.updatedAt}</time></span><h1>{a.h1}</h1><p>{a.description}</p></header><ArticleBody body={a.body} />
      <aside className="article-sources" aria-label="Источники"><h2>Источники</h2><ul>{a.sources.map(s=><li key={s.url}><a href={s.url}>{s.title}</a></li>)}</ul></aside>
    </article>
    {related.length > 0 && <aside className="article-related"><h2>По теме</h2>{related.map(item=><Link key={item.slug} href={`/journal/${item.slug}`}>{item.h1} ↗</Link>)}</aside>}
  </main><Footer /></>;
}
