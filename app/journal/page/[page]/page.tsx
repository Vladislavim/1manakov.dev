import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalIndex } from '@/components/JournalIndex';
import { ARTICLE_PAGE_SIZE,indexableArticles } from '@/lib/editorial';
export const dynamicParams=false;
export function generateStaticParams(){return Array.from({length:Math.max(0,Math.ceil(indexableArticles().length/ARTICLE_PAGE_SIZE)-1)},(_,i)=>({page:String(i+2)}));}
export async function generateMetadata({params}:{params:Promise<{page:string}>}):Promise<Metadata>{const {page}=await params;return{title:`Журнал — страница ${page}`,description:`Материалы о дизайне интерфейсов — страница ${page}.`,alternates:{canonical:`/journal/page/${page}`}};}
export default async function JournalPage({params}:{params:Promise<{page:string}>}){const {page}=await params;const number=Number(page);const articles=indexableArticles();if(!Number.isInteger(number)||number<2||number>Math.ceil(articles.length/ARTICLE_PAGE_SIZE))notFound();return <JournalIndex articles={articles} page={number}/>;}
