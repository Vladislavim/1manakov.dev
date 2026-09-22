import {pageMetadata} from '@/lib/metadata';
import {WebsiteSystem} from '@/components/WebsiteSystem';
import '@/styles/website-system.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { contact } from '@/data/projects';
import { CaseMotion } from '@/components/CaseMotion';
import {AboutPortrait} from '@/components/AboutPortrait';
export const metadata: Metadata = pageMetadata({title:'About Vladislav Imanakov',description:'Vladislav Imanakov — web design, interface design, frontend development and SEO. From the first idea to the final interaction.',path:'/about'});
export default function AboutPage() {
  return <main id="main" tabIndex={-1}>
    <CaseMotion><section className="about-page"><div className="about-top" data-case-reveal><span className="eyebrow">A LITTLE CONTEXT.</span><span className="eyebrow">DESIGN + FRONTEND + SEO</span></div>
      <h1>Vladislav<br /><span>Imanakov.</span></h1>
      <div className="about-intro"><span className="about-mark" aria-hidden="true">i.</span><AboutPortrait/><div className="about-intro-copy"><p className="large-copy">I design and build websites.<br />From the first idea to the final interaction.</p><p className="body-copy">My work brings together web design, interface design, frontend development, and SEO. I work on landing pages and multi-page websites, with attention to structure, visual clarity, search visibility, and how things feel in use.</p></div></div>
      <div className="about-system-layout"><span className="eyebrow">HOW I THINK</span><WebsiteSystem/><div className="about-system-copy"><div className="about-statement"><h2>A website<br />is a system.</h2><p>A strong website is an offer, a structure, a visual system, fast performance, and a clear path to action.</p></div>
      <div className="about-details"><div><span className="eyebrow">WHAT I DO</span><ul><li>Web & interface design</li><li>Frontend development</li><li>SEO & search structure</li><li>Landing pages</li><li>Multi-page websites</li></ul></div><div><span className="eyebrow">FIND ME HERE</span><ul><li><a href={`mailto:${contact.email}`}>Email ↗</a></li><li><a href={contact.telegram} target="_blank" rel="noreferrer">Telegram ↗</a></li><li><a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a></li><li><Link href="/#work">Selected work →</Link></li></ul></div></div>
    </div></div></section><Footer /></CaseMotion>
  </main>;
}
