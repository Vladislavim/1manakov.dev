export type SeoResult = {
  period: string; exactPeriod: string; visits: number; organicVisits: number;
  organicShare: number; visitors: number; pageviews: number; source: string;
  counterId: string; sourceImages: string[]; sourcePdf: string; copy: string;
  highlightedPages: {title: string; pageviews: number}[];
};
export const allnrgSeo: SeoResult = {
  period: 'Jun — Aug 2026', exactPeriod: '01.06.2026 — 01.09.2026',
  visits: 1107, organicVisits: 169, organicShare: 15.3, visitors: 996, pageviews: 1716,
  source: 'Yandex Metrica', counterId: '109573051',
  sourceImages: [1,2,3].map(page=>`/images/evidence/allnrg/metrica-jun-aug-2026-${page}.png`),
  sourcePdf: '/images/evidence/allnrg/metrica-jun-aug-2026.pdf',
  copy: 'Search visibility was part of the implementation: site architecture, page structure and search-oriented landing pages. From June to August 2026, Yandex Metrica recorded 169 visits from search engines — 15.3% of all visits in the report.',
  highlightedPages: [
    {title: 'Проектирование зданий и сооружений в Волгограде | Альянс Энерджи', pageviews: 856},
    {title: 'Проектирование зданий и сооружений по России | Альянс Энерджи', pageviews: 172},
  ],
};
