import {pageMetadata,personId} from '@/lib/metadata';
import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getGuides,publishedGuides,guideTopics,guideProblems} from '@/lib/guides';
import {projects,siteUrl} from '@/data/projects';
import {ArticleBody} from '@/components/ArticleBody';
import {GuideCTA} from '@/components/GuideCTA';
import {GuideVisual} from '@/components/GuideVisual';
import {GuideTracking} from '@/components/GuideTracking';
import FormFeedbackDemo from '@/components/FormFeedbackDemo';
import GuideWorkbench from '@/components/GuideWorkbench';
import {guideTools} from '@/data/guide-tools';
import {Footer} from '@/components/Footer';
type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
const visible=()=>getGuides().filter(g=>['indexable','noindex'].includes(g.status)&&guideProblems(g).length===0);
export function generateStaticParams(){return visible().map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const g=visible().find(g=>g.slug===slug);if(!g)return{};return pageMetadata({title:g.title,description:g.description,path:g.canonical,index:g.indexable,locale:'ru_RU',article:{publishedTime:g.publishedAt,modifiedTime:g.updatedAt}});}
export default async function Page({params}:Props){const{slug}=await params;const g=visible().find(g=>g.slug===slug);if(!g)notFound();const related=publishedGuides().filter(p=>g.relatedPages.includes(p.slug));const cases=projects.filter(p=>g.relatedCases.includes(p.slug));const blocks=g.body.split(/\n(?=## )/);const structured=[{'@context':'https://schema.org','@type':'Article',headline:g.h1,image:`${siteUrl}/og.png`,publisher:{'@id':personId},description:g.description,inLanguage:'ru',datePublished:g.publishedAt,dateModified:g.updatedAt,author:{'@type':'Person','@id':personId,name:g.author,url:`${siteUrl}/about`},mainEntityOfPage:`${siteUrl}${g.canonical}`},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'Главная',item:siteUrl},{name:'Практика',item:`${siteUrl}/guides`},{name:g.h1,item:`${siteUrl}${g.canonical}`}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))}];
 return <main id="main" tabIndex={-1} lang="ru" data-guide-page data-page-type={g.pageType}><GuideTracking context={{slug:g.slug,clusterId:g.clusterId,intent:g.intent,topic:g.topic,primaryKeyword:g.primaryKeyword}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/><article className="journal-shell article-shell guide-shell"><nav className="journal-breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/guides">Практика</Link><span>/</span><Link href={`/guides/topic/${g.topic}`}>{guideTopics[g.topic]}</Link></nav><header className="journal-heading"><span className="eyebrow">{guideTopics[g.topic]}</span><h1>{g.h1}</h1><p className="guide-direct-answer">{g.directAnswer}</p><div className="guide-byline"><Link href="/about">{g.author}</Link><span>Обновлено {g.updatedAt}</span><Link href="/guides/editorial-policy">Редакционный подход</Link></div></header><GuideVisual guide={g}/>{g.visualValue==='interactive'&&<FormFeedbackDemo/>}<ArticleBody body={blocks[0]}/>{guideTools[slug]&&<GuideWorkbench tool={guideTools[slug]} slug={slug}/>}<GuideCTA guide={g} placement="inline"/><ArticleBody body={blocks.slice(1).join('\n')}/><section className="article-sources"><h2>Источники и границы рекомендаций</h2><ul>{g.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> — {s.publisher}. {s.supports.join(' ')}</li>)}</ul></section>{cases.length>0&&<section className="article-related"><h2>В портфолио</h2>{cases.map(p=><Link key={p.slug} href={`/work/${p.slug}`} data-seo-event="seo_case_click">{p.name} · {p.category} ↗</Link>)}</section>}<GuideCTA guide={g} placement="final"/><section className="article-related"><h2>Следующий вопрос</h2>{related.map(p=><Link key={p.slug} href={p.canonical} data-seo-event="seo_related_page_click">{p.h1} ↗</Link>)}</section></article><Footer/></main>;
}
