import {ClientOffers} from '@/components/ClientOffers';
import {defaultDescription,pageMetadata} from '@/lib/metadata';
import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Explore } from '@/components/Explore';
import { ProjectDeck } from '@/components/ProjectDeck';
import {SeoServices} from '@/components/SeoServices';
import { Lab } from '@/components/Lab';
import { Footer } from '@/components/Footer';
import { HomeChoreography } from '@/components/HomeChoreography';
export const metadata: Metadata = { ...pageMetadata({title:'Website design, frontend & SEO',description:defaultDescription,path:'/'}), title:{absolute:'IMANAKOV — Website design, frontend & SEO'} };
export default function Home() {
  return <main id="main" tabIndex={-1}><HomeChoreography>
    <div data-home-scene="hero"><Hero /></div>
    <div data-home-scene="explore"><Explore /></div>
    <div data-home-scene="work"><ProjectDeck /></div>
    <div data-home-scene="seo"><SeoServices /></div>
    <div data-home-scene="play"><Lab teaser /></div>
    <div data-home-scene="contact"><ClientOffers /><Footer /></div>
  </HomeChoreography></main>;
}
