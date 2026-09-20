import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Explore } from '@/components/Explore';
import { ProjectDeck } from '@/components/ProjectDeck';
import { Lab } from '@/components/Lab';
import { Footer } from '@/components/Footer';
import { HomeChoreography } from '@/components/HomeChoreography';
export const metadata: Metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return <main id="main" tabIndex={-1}><HomeChoreography>
    <div data-home-scene="hero"><Hero /></div>
    <div data-home-scene="explore"><Explore /></div>
    <div data-home-scene="work"><ProjectDeck /></div>
    <div data-home-scene="play"><Lab teaser /></div>
    <div data-home-scene="contact"><Footer /></div>
  </HomeChoreography></main>;
}
