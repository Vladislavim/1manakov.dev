import {notFound} from 'next/navigation';
import {GuidesIndex} from '@/components/GuidesIndex';
import {publishedGuides,guideTopics,GUIDE_PAGE_SIZE} from '@/lib/guides';
type Props={params:Promise<{topic:string;page:string}>};
export const dynamicParams=false;
export function generateStaticParams(){const all=publishedGuides();return Object.keys(guideTopics).flatMap(topic=>Array.from({length:Math.max(0,Math.ceil(all.filter(g=>g.topic===topic).length/GUIDE_PAGE_SIZE)-1)},(_,i)=>({topic,page:String(i+2)})));}
export async function generateMetadata({params}:Props){const{topic,page}=await params;return{title:`${guideTopics[topic]}: страница ${page}`,alternates:{canonical:`/guides/topic/${topic}/page/${page}`}};}
export default async function Page({params}:Props){const{topic,page}=await params;const n=Number(page);if(!guideTopics[topic]||!Number.isInteger(n)||n<2||n>Math.ceil(publishedGuides().filter(g=>g.topic===topic).length/GUIDE_PAGE_SIZE))notFound();return <GuidesIndex topic={topic} page={n}/>;}
