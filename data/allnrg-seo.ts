export type SeoResult = {
  period: string; exactPeriod: string; visits: number; organicVisits: number;
  organicShare: number; visitors: number; pageviews: number; source: string;
  counterId: string; sourceImages: string[]; sourcePdf: string; copy: string;
  earlyStage?: {period:string;counterId:string;pageviews:number;newVisitors:number;returningVisitors:number;sourceImages:string[];sourcePdf:string};
  highlightedPages: {title: string; pageviews: number}[];
};
export const allnrgSeo: SeoResult = {
  period: 'Nov 2025 — Mar 2026', exactPeriod: '01.11.2025 — 31.03.2026',
  visits: 2285, organicVisits: 563, organicShare: 24.6, visitors: 1633, pageviews: 6076,
  source: 'Yandex Metrica', counterId: '103632796',
  sourceImages: [1,2,3].map(page=>`/images/evidence/allnrg/metrica-nov-2025-mar-2026-${page}.png`),
  sourcePdf: '/images/evidence/allnrg/metrica-nov-2025-mar-2026.pdf',
  copy: 'Design, development, search structure, indexation and measurement were part of one implementation. During the first five months after launch, 24.6% of all visits came from organic search.',
  earlyStage: {period:'01.11.2025 — 31.05.2026',counterId:'103632796',pageviews:8264,newVisitors:2513,returningVisitors:111,sourceImages:[1,2].map(page=>`/images/evidence/allnrg/metrica-nov-2025-may-2026-${page}.png`),sourcePdf:'/images/evidence/allnrg/metrica-nov-2025-may-2026.pdf'},
  highlightedPages: [
    {title: 'Проектирование зданий и сооружений в Волгограде | Альянс Энерджи', pageviews: 856},
    {title: 'Проектирование зданий и сооружений по России | Альянс Энерджи', pageviews: 172},
  ],
};
