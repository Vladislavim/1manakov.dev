import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalIndex } from '@/components/JournalIndex';
import { indexableArticles,topicNames } from '@/lib/editorial';
export function generateStaticParams(){return [...new Set(indexableArticles().map(a=>a.topic))].map(topic=>({topic}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{topic:string}>}):Promise<Metadata>{const {topic}=await params;return{title:`${topicNames[topic]||'Тема'} — журнал`,description:`Практические материалы по теме «${topicNames[topic]||'Дизайн'}».`,alternates:{canonical:`/journal/topic/${topic}`}};}
export default async function TopicPage({params}:{params:Promise<{topic:string}>}){const {topic}=await params;const articles=indexableArticles().filter(a=>a.topic===topic);if(!articles.length)notFound();return <JournalIndex articles={articles} topic={topic}/>;}
