import {guideIndexMetadata} from '@/lib/guide-metadata';
import {notFound} from 'next/navigation';
import {GuidesIndex} from '@/components/GuidesIndex';
import {publishedGuides,GUIDE_PAGE_SIZE} from '@/lib/guides';
type Props={params:Promise<{page:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return Array.from({length:Math.max(0,Math.ceil(publishedGuides().length/GUIDE_PAGE_SIZE)-1)},(_,i)=>({page:String(i+2)}));}
export async function generateMetadata({params}:Props){const{page}=await params;return guideIndexMetadata(undefined, Number(page));}
export default async function Page({params}:Props){const{page}=await params;const n=Number(page);if(!Number.isInteger(n)||n<2||n>Math.ceil(publishedGuides().length/GUIDE_PAGE_SIZE))notFound();return <GuidesIndex page={n}/>;}
