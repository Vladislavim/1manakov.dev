import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Explore } from '@/components/Explore';
import { ProjectDeck } from '@/components/ProjectDeck';
import { PlayLab } from '@/components/PlayLab';
import { Footer } from '@/components/Footer';
export const metadata: Metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return <main id="main" tabIndex={-1}><Hero /><Explore /><ProjectDeck /><PlayLab teaser /><Footer /></main>;
}
