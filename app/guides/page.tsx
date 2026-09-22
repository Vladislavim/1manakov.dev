import {guideIndexMetadata} from '@/lib/guide-metadata';
import {GuidesIndex} from '@/components/GuidesIndex';
export const metadata=guideIndexMetadata();
export default function Page(){return <GuidesIndex/>;}
