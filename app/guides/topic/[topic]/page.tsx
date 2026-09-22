import {guideIndexMetadata} from '@/lib/guide-metadata';
import {notFound} from 'next/navigation';
import {GuidesIndex} from '@/components/GuidesIndex';
import {publishedGuides,guideTopics} from '@/lib/guides';
type Props={params:Promise<{topic:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [...new Set(publishedGuides().map(g=>g.topic))].map(topic=>({topic}));}
export async function generateMetadata({params}:Props){const{topic}=await params;return guideIndexMetadata(topic);}
export default async function Page({params}:Props){const{topic}=await params;if(!guideTopics[topic]||!publishedGuides().some(g=>g.topic===topic))notFound();return <GuidesIndex topic={topic}/>;}
