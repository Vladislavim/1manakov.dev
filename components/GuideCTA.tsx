import type { Guide } from '@/lib/guides';
import { generateContextualCTA } from '@/lib/guide-cta';
export function GuideCTA({guide,placement}:{guide:Guide;placement:'inline'|'final'}){const cta=generateContextualCTA(guide,placement);return <aside className={`guide-cta guide-cta-${placement}`} data-cta-placement={placement}><span className="eyebrow">ОБСУДИТЬ ВАШ ИНТЕРФЕЙС</span><h2>{cta.headline}</h2><p>{cta.text}</p><a href={cta.destination} data-seo-event="seo_cta_click" data-cta-type="email" data-placement={placement}>{cta.buttonLabel} <span aria-hidden="true">↗</span></a></aside>;}
