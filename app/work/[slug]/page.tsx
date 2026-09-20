import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { projects, siteUrl } from '@/data/projects';
import { RouteLink } from '@/components/SiteShell';
import { Footer } from '@/components/Footer';
import { CaseMotion } from '@/components/CaseMotion';
import { DevicePresentation } from '@/components/DevicePresentation';
import { CaseEvidence } from '@/components/CaseEvidence';
import {SeoEvidence} from '@/components/SeoEvidence';
import {ExternalProject} from '@/components/ExternalProject';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const p = projects.find(p => p.slug === slug);
  if (!p) return {};
  return { title: p.name, description: p.summary, alternates: { canonical: `/work/${p.slug}` }, openGraph: { title: `${p.name} — IMANAKOV`, description: p.summary, images: [{ url: p.cover }], url: `/work/${p.slug}` } };
}
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex(p => p.slug === slug);
  if (index < 0) notFound();
  const p = projects[index]; const next = projects[(index + 1) % projects.length];
  return <main id="main" tabIndex={-1} className={`case-page case-${p.slug}`} style={{ '--project-color': p.color, '--project-ink': p.ink } as CSSProperties}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.name, description: p.summary, url: `${siteUrl}/work/${p.slug}`, creator: { '@type': 'Person', name: 'Vladislav Imanakov' } }).replace(/</g, '\\u003c') }} />
    <CaseMotion><section className="case-hero"><div className="case-topline"><RouteLink href="/#work" image={p.cover} className="back-link" data-cursor="BACK">← ALL WORK</RouteLink><span>{p.number} / {String(projects.length).padStart(2, '0')} — {p.concept ? 'INDEPENDENT CONCEPT' : p.category.toUpperCase()}</span></div>
      <h1>{p.name}</h1><div className="case-summary"><p>{p.summary}</p><div><span className="eyebrow">CONTRIBUTION</span><p>{p.role}</p></div></div>
      <div className="case-hero-image case-device-stage"><DevicePresentation slug={p.slug} src={p.cover} alt={p.images[0].alt} priority /></div>
    </section>
    <section className="case-story"><span className="eyebrow">THE WEBSITE</span><h2>{p.statement.split('\n').map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h2><div><p>{p.details}</p><ExternalProject project={p}/>{p.concept && <span className="concept-label">INDEPENDENT INTERFACE CONCEPT</span>}</div></section>
    <CaseEvidence slug={p.slug}/>{p.seoResult&&<SeoEvidence result={p.seoResult}/>}
    <RouteLink className="next-project" href={`/work/${next.slug}`} image={next.cover} data-cursor="VIEW"><span className="eyebrow">KEEP EXPLORING / NEXT WORK</span><span className="next-project-title">{next.shortName}<span aria-hidden="true">↗</span></span><span className="next-project-image"><DevicePresentation slug={next.slug} src={next.cover} alt="" compact /></span></RouteLink>
    <Footer /></CaseMotion>
  </main>;
}
