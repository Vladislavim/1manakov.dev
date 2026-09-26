import {pageMetadata,personId} from '@/lib/metadata';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { contact, projects, siteUrl } from '@/data/projects';
import { RouteLink } from '@/components/SiteShell';
import { Footer } from '@/components/Footer';
import { CaseMotion } from '@/components/CaseMotion';
import { DevicePresentation } from '@/components/DevicePresentation';
import { CaseEvidence } from '@/components/CaseEvidence';
import {SeoEvidence} from '@/components/SeoEvidence';
import {ExternalProject} from '@/components/ExternalProject';
import Link from 'next/link';
import {projectDecisions} from '@/data/project-decisions';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const p = projects.find(p => p.slug === slug);
  if (!p) return {};
  return pageMetadata({title:p.name,description:p.summary,path:`/work/${p.slug}`,image:p.cover});
}
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex(p => p.slug === slug);
  if (index < 0) notFound();
  const p = projects[index]; const next = projects[(index + 1) % projects.length];
  return <main lang="ru" id="main" tabIndex={-1} className={`case-page case-${p.slug}`} style={{ '--project-color': p.color, '--project-ink': p.ink } as CSSProperties}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.name, description: p.summary, image: `${siteUrl}${p.cover}`, inLanguage: 'ru', url: `${siteUrl}/work/${p.slug}`, creator: { '@type': 'Person', '@id': personId, name: 'Vladislav Imanakov' } }).replace(/</g, '\\u003c') }} />
    <CaseMotion><section className="case-hero"><div className="case-topline"><RouteLink href="/#work" image={p.cover} className="back-link" data-cursor="BACK">← ВСЕ РАБОТЫ</RouteLink><span>{p.number} / {String(projects.length).padStart(2, '0')} — {p.concept ? 'САМОСТОЯТЕЛЬНАЯ КОНЦЕПЦИЯ' : p.category.toUpperCase()}</span></div>
      <h1>{p.name}</h1><div className="case-summary"><p>{p.summary}</p><div><span className="eyebrow">МОЯ РОЛЬ</span><p>{p.role}</p></div></div>
      <div className="case-hero-image case-device-stage"><DevicePresentation slug={p.slug} src={p.cover} alt={p.images[0].alt} priority /></div>
    </section>
    <section className="case-story"><span className="eyebrow">О ПРОЕКТЕ</span><h2>{p.statement.split('\n').map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h2><div><p>{p.details}</p><ExternalProject project={p}/>{p.concept && <span className="concept-label">САМОСТОЯТЕЛЬНАЯ КОНЦЕПЦИЯ ИНТЕРФЕЙСА</span>}</div></section>
    <section id="decision" className="case-decision" lang="ru"><div><span className="eyebrow">ОДНО РЕШЕНИЕ / {p.shortName}</span><h2>{projectDecisions[p.slug].question}</h2></div><div><p>{projectDecisions[p.slug].answer}</p><Link href={`/guides/${projectDecisions[p.slug].guide}`}>Как проверить похожую задачу у себя ↗</Link><a href="#case-evidence">Посмотреть материалы проекта ↓</a></div></section>
    <div id="case-evidence"><CaseEvidence slug={p.slug}/>{p.seoResult&&<SeoEvidence result={p.seoResult}/>}</div>
    <div className="case-contact" lang="ru"><a href={`mailto:${contact.email}?subject=${encodeURIComponent(`Похожая задача — ${p.shortName}`)}&body=${encodeURIComponent(`Здравствуйте, Владислав! Посмотрел проект ${p.name}.\n\nУ меня похожая задача:\nМой сайт (если уже есть):\nЖелаемый срок:\n\nКейс: ${siteUrl}/work/${p.slug}`)}`} data-seo-event="seo_cta_click" data-cta-type="email" data-placement="case-evidence">У меня похожая задача ↗</a><p>Пришлите ссылку и опишите, что хотите изменить. Сначала согласуем объём и стоимость.</p></div>
    <RouteLink className="next-project" href={`/work/${next.slug}`} image={next.cover} data-cursor="VIEW"><span className="eyebrow">СЛЕДУЮЩИЙ ПРОЕКТ</span><span className="next-project-title"><span className="next-project-name">{next.shortName}</span><span aria-hidden="true">↗</span></span><span className="next-project-image"><DevicePresentation slug={next.slug} src={next.cover} alt="" compact /></span></RouteLink>
    <Footer /></CaseMotion>
  </main>;
}
