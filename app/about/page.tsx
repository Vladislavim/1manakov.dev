import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { contact } from '@/data/projects';
export const metadata: Metadata = { title: 'About', description: 'Vladislav Imanakov — web design, UI, frontend and complete website builds. Get in touch.', alternates: { canonical: '/about' } };
export default function AboutPage() {
  return <main id="main" tabIndex={-1}>
    <section className="about-page"><div className="about-top"><span className="eyebrow">A LITTLE CONTEXT.</span><span className="eyebrow">DESIGN + FRONTEND</span></div>
      <h1>Vladislav<br /><span>Imanakov.</span></h1>
      <div className="about-intro"><span className="about-mark" aria-hidden="true">i.</span><div><p className="large-copy">I design and build websites.<br />From the first idea to the final interaction.</p><p className="body-copy">My work brings together web design, interface design and frontend development. I work on landing pages and multi-page websites, with attention to structure, visual clarity and how things feel in use.</p></div></div>
      <div className="about-statement"><span className="eyebrow">HOW I THINK</span><h2>A website<br />is a system.</h2><p>A strong website is an offer, a structure, a visual system, fast performance, and a clear path to action.</p></div>
      <div className="about-details"><div><span className="eyebrow">WHAT I DO</span><ul><li>Web & interface design</li><li>Frontend development</li><li>Landing pages</li><li>Multi-page websites</li></ul></div><div><span className="eyebrow">FIND ME HERE</span><ul><li><a href={`mailto:${contact.email}`}>Email ↗</a></li><li><a href={contact.telegram} target="_blank" rel="noreferrer">Telegram ↗</a></li><li><a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a></li><li><Link href="/#work">Selected work →</Link></li></ul></div></div>
    </section><Footer />
  </main>;
}
