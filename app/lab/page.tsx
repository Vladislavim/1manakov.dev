import type {Metadata} from 'next';
import {Lab} from '@/components/Lab';
import {Footer} from '@/components/Footer';
export const metadata:Metadata={title:'Lab — Interaction studies',description:'Five tactile studies in motion and interaction: cursor reveal, card physics, type morph, portal and grid shift.',alternates:{canonical:'/lab'}};
export default function LabPage(){return <main id="main" tabIndex={-1}><Lab/><Footer/></main>;}
