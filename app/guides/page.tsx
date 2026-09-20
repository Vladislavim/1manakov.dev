import type {Metadata} from 'next';
import {GuidesIndex} from '@/components/GuidesIndex';
export const metadata:Metadata={title:'Практика дизайна интерфейсов',description:'Прикладные разборы форм, навигации, доступности и структуры сайта с примерами и проверками.',alternates:{canonical:'/guides'},openGraph:{locale:'ru_RU',url:'/guides'}};
export default function Page(){return <GuidesIndex/>;}
