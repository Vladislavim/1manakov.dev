import type { Metadata } from 'next';
import { PlayLab } from '@/components/PlayLab';
import { Footer } from '@/components/Footer';
export const metadata: Metadata = { title: 'Play — Interaction lab', description: 'Five hands-on studies in cursor reveal, card perspective, image typography, motion and portals.', alternates: { canonical: '/play' } };
export default function PlayPage() { return <main id="main" tabIndex={-1}><PlayLab /><Footer /></main>; }
