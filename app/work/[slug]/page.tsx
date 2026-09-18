import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { projects, siteUrl } from '@/data/projects';
import { ProjectImage } from '@/components/ProjectImage';
import { RouteLink } from '@/components/SiteShell';
import { Footer } from '@/components/Footer';

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
    <section className="case-hero"><div className="case-topline"><RouteLink href="/" image={p.cover} className="back-link" data-cursor="BACK">← ALL WORK</RouteLink><span>{p.number} / 04 — {p.concept ? 'INDEPENDENT CONCEPT' : p.category.toUpperCase()}</span></div>
      <h1>{p.name}</h1><div className="case-summary"><p>{p.summary}</p><div><span className="eyebrow">CONTRIBUTION</span><p>{p.role}</p></div></div>
      <div className="case-hero-image"><ProjectImage src={p.cover} alt={p.images[0].alt} priority sizes="(max-width: 768px) 100vw, 90vw" /></div>
    </section>
    <section className="case-story"><span className="eyebrow">THE WEBSITE</span><h2>{p.statement.split('\n').map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h2><div><p>{p.details}</p>{p.url && <a className="text-link" href={p.url} target="_blank" rel="noreferrer">VISIT PROJECT ↗</a>}{p.concept && <span className="concept-label">INDEPENDENT INTERFACE CONCEPT</span>}</div></section>
    <section className="case-gallery" aria-label={`${p.name} design details`}>{p.images.slice(1).map((img, i) => <figure key={img.src} className={`case-figure figure-${i}`}><div className="case-image"><ProjectImage src={img.src} alt={img.alt} sizes="(max-width: 767px) 100vw, 85vw" /></div><figcaption>{img.caption}</figcaption></figure>)}</section>
    <div className="case-note"><span className="eyebrow">PROJECT ARCHIVE</span><p>{p.concept ? 'Original interface concept studies.' : 'Selected website screens from the original portfolio. The linked website may have changed since these images were made.'}</p></div>
    <RouteLink className="next-project" href={`/work/${next.slug}`} image={next.cover} data-cursor="VIEW"><span className="eyebrow">KEEP EXPLORING / NEXT WORK</span><span className="next-project-title">{next.shortName}<span aria-hidden="true">↗</span></span><span className="next-project-image"><ProjectImage src={next.cover} alt="" sizes="350px" /></span></RouteLink>
    <Footer />
  </main>;
}
