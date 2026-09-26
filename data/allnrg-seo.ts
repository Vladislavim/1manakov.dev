export type SeoResult = {
  period: string; exactPeriod: string; visits: number; organicVisits: number;
  organicShare: number; visitors: number; pageviews: number; source: string;
  counterId: string; sourceImages: string[]; sourcePdf: string; copy: string;
  earlyStage?: {period:string;counterId:string;pageviews:number;newVisitors:number;returningVisitors:number;sourceImages:string[];sourcePdf:string};
  highlightedPages: {title: string; pageviews: number}[];
};
export const allnrgSeo: SeoResult = {
  period: 'Ноябрь 2025 — март 2026', exactPeriod: '01.11.2025 — 31.03.2026',
  visits: 2285, organicVisits: 563, organicShare: 24.6, visitors: 1633, pageviews: 6076,
  source: 'Яндекс Метрика', counterId: '103632796',
  sourceImages: [1,2,3].map(page=>`/images/evidence/allnrg/metrica-nov-2025-mar-2026-${page}.png`),
  sourcePdf: '/images/evidence/allnrg/metrica-nov-2025-mar-2026.pdf',
  copy: 'Дизайн, разработка, структура для поиска, индексация и аналитика были частью одной работы. За первые пять месяцев после запуска 24,6% визитов пришли из органического поиска.',
  earlyStage: {period:'01.11.2025 — 31.05.2026',counterId:'103632796',pageviews:8264,newVisitors:2513,returningVisitors:111,sourceImages:[1,2].map(page=>`/images/evidence/allnrg/metrica-nov-2025-may-2026-${page}.png`),sourcePdf:'/images/evidence/allnrg/metrica-nov-2025-may-2026.pdf'},
  highlightedPages: [
    {title: 'Проектирование зданий и сооружений в Волгограде | Альянс Энерджи', pageviews: 856},
    {title: 'Проектирование зданий и сооружений по России | Альянс Энерджи', pageviews: 172},
  ],
};
