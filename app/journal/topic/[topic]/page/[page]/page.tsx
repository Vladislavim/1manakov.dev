import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalIndex } from '@/components/JournalIndex';
import { ARTICLE_PAGE_SIZE,indexableArticles,topicNames } from '@/lib/editorial';
export const dynamicParams=false;
export function generateStaticParams(){const articles=indexableArticles();return [...new Set(articles.map(a=>a.topic))].flatMap(topic=>Array.from({length:Math.max(0,Math.ceil(articles.filter(a=>a.topic===topic).length/ARTICLE_PAGE_SIZE)-1)},(_,i)=>({topic,page:String(i+2)})));}
export async function generateMetadata({params}:{params:Promise<{topic:string;page:string}>}):Promise<Metadata>{const {topic,page}=await params;return{title:`${topicNames[topic]} — страница ${page}`,description:`Материалы по теме «${topicNames[topic]}» — страница ${page}.`,alternates:{canonical:`/journal/topic/${topic}/page/${page}`}};}
export default async function TopicPage({params}:{params:Promise<{topic:string;page:string}>}){const {topic,page}=await params;const number=Number(page);const articles=indexableArticles().filter(a=>a.topic===topic);if(!Number.isInteger(number)||number<2||number>Math.ceil(articles.length/ARTICLE_PAGE_SIZE))notFound();return <JournalIndex articles={articles} topic={topic} page={number}/>;}
