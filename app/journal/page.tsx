import type { Metadata } from 'next';
import { JournalIndex } from '@/components/JournalIndex';
import { indexableArticles } from '@/lib/editorial';
export function generateMetadata(): Metadata {return { title:'Журнал о дизайне интерфейсов', description:'Практические материалы о дизайне, доступности, прототипировании и взаимодействии.', alternates:{canonical:'/journal'}, openGraph:{locale:'ru_RU',url:'/journal',title:'Журнал о дизайне интерфейсов'}, robots:{index:indexableArticles().length>0,follow:true} };}
export default function Journal() { return <JournalIndex articles={indexableArticles()} />; }
