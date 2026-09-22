import {allnrgSeo,type SeoResult} from './allnrg-seo';
export type Project = {
  slug: string; name: string; shortName: string; category: string; number: string;
  role: string; cover: string; color: string; ink: string; summary: string;
  statement: string; details: string; url?: string; concept?: boolean;
  externalSiteStatus?: 'live'|'in-development';
  seoResult?: SeoResult;
  images: { src: string; alt: string; caption: string }[];
};
const media = (name: string) => `/images/${name}.webp`;

const projectRecords: Project[] = [
  {
    slug: 'allnrg', name: 'Alliance Energy', shortName: 'Allnrg', number: '01',
    category: 'Engineering website', role: 'Design · Development · SEO',
    seoResult: allnrgSeo,
    cover: media('allnrg_home_mac'), color: '#e4e425', ink: '#171b15',
    summary: 'An engineering business, made visible. A website bringing industrial design, services and projects into one place.',
    statement: 'Structure for\ncomplex work.',
    details: 'A yellow-and-black visual system connects service categories, project imagery and contact actions. The pages move between large industrial photographs and compact information blocks.',
    url: 'https://allnrg.ru/',
    images: [
      { src: media('allnrg_home_mac'), alt: 'Alliance Energy homepage with industrial imagery, yellow accents and engineering service categories', caption: '01 — Homepage / services and project entry points' },
      { src: media('allnrg_two_windows_mac'), alt: 'Two Alliance Energy website layouts shown together', caption: '02 — A connected visual language across pages' },
      { src: media('allng-hero'), alt: 'Alliance Energy website opening screen', caption: '03 — Industrial imagery and a direct route to the work' },
    ],
  },
  {
    slug: 'legacy-rheumatology', name: 'Legacy Rheumatology', shortName: 'Legacy', number: '02',
    category: 'Healthcare website', role: 'Design · Frontend · Build',
    cover: media('legacy_hero_mac'), color: '#17372e', ink: '#f2eee3',
    summary: 'A digital presence for rheumatology care. Editorial typography, warm photography and a calm framework for medical information.',
    statement: 'A calmer first\nimpression.',
    details: 'Deep green and warm neutrals frame the clinical content. The interface gives appointments, the practice and its services distinct places in the navigation, with an editorial approach to the story of the practice.',
    url: 'https://legacy-rheumatology.vercel.app/',
    images: [
      { src: media('legacy_hero_mac'), alt: 'Legacy Rheumatology homepage with deep green panel and warm clinic interior', caption: '01 — The first impression / care, context and navigation' },
      { src: media('legacy_gallery_mac'), alt: 'Legacy Rheumatology website gallery layout', caption: '02 — The practice / a photographic view' },
      { src: media('legacy_legacy_section_mac'), alt: 'Legacy Rheumatology editorial section about the practice', caption: '03 — The story of the practice' },
      { src: media('legacy_timeline_mac'), alt: 'Legacy Rheumatology timeline design', caption: '04 — An editorial timeline' },
    ],
  },
  {
    slug: 'vpn-equipment', name: 'VPN Equipment Rental', shortName: 'VPN', number: '03',
    category: 'Equipment rental & sales', role: 'Design · Frontend · Build',
    cover: media('ooovpn_sale_mac'), color: '#c89755', ink: '#151714',
    summary: 'An equipment business with several directions. A website connecting machinery, rental, sales and modular buildings.',
    statement: 'Find the right\nequipment.',
    details: 'The visual system pairs dark surfaces with warm amber accents. Equipment categories, product images and contact actions carry the page hierarchy, with separate views for sales, the catalogue and modular buildings.',
    url: 'https://ooovpn.ru/',
    images: [
      { src: media('ooovpn_sale_mac'), alt: 'VPN equipment sales page with machinery, dark background and amber actions', caption: '01 — Sales / a clear overview of the offer' },
      { src: media('ooovpn_catalog_mac'), alt: 'VPN equipment catalogue page', caption: '02 — Catalogue / exploring equipment' },
      { src: media('ooovpn_bytovki_mac'), alt: 'VPN modular building product page', caption: '03 — Modular buildings / a dedicated product direction' },
      { src: media('ooovpn_directions_mac'), alt: 'VPN website business directions overview', caption: '04 — Bringing the business directions together' },
    ],
  },
  {
    slug: 'pdp', name: 'PDP', shortName: 'PDP', number: '04', externalSiteStatus:'in-development',
    category: 'Construction & engineering', role: 'Website project',
    cover: media('pdp-home'), color: '#f15225', ink: '#171a16',
    summary: 'A website for Povolzhskoye Delovoye Partnerstvo (ПДП), bringing construction project management, engineering services and a portfolio of completed work together.',
    statement: 'Architecture\nof possibility.',
    details: 'A structured, industrial visual language pairs oversized typography with an orange accent. Service pages and project collections give different parts of the business their own space, while the shared navigation keeps the site connected.',
    url: 'https://ooopdp.ru/',
    images: [
      { src: media('pdp-home'), alt: 'PDP homepage with industrial architecture, bold typography and orange calls to action', caption: '01 — Homepage / an industrial first impression' },
      { src: media('pdp-services'), alt: 'PDP engineering and construction services page', caption: '02 — Services / making complex disciplines navigable' },
      { src: media('pdp-projects'), alt: 'PDP projects and partners page', caption: '03 — Projects / a collection of completed work' },
    ],
  },
  {
    slug: 'khasaut-tour', name: 'Khasaut Tour', shortName: 'Khasaut', number: '05',
    category: 'Travel & excursions', role: 'Website project',
    cover: media('khasaut-home'), color: '#c4ccb1', ink: '#153c30',
    summary: 'A website for a North Caucasus tour team. Excursions and jeep tours from Kislovodsk and the Caucasian Mineral Waters region, brought together in an atmospheric travel experience.',
    statement: 'A way into\nthe mountains.',
    details: 'Layered landscape photographs, forest green and warm paper tones set the atmosphere. Beyond the opening scene, visitors can explore excursions and use a trip-price configurator to compare their options.',
    url: 'https://khasaut-kmv.ru/',
    images: [
      { src: media('khasaut-home'), alt: 'Khasaut Tour homepage with mountain landscapes and layered travel photographs', caption: '01 — Homepage / the feeling of a journey' },
      { src: media('khasaut-excursions'), alt: 'Khasaut Tour excursions and jeep tours catalogue', caption: '02 — Excursions / choosing a route through the Caucasus' },
      { src: media('khasaut-prices'), alt: 'Khasaut Tour trip pricing and configurator', caption: '03 — Planning / exploring trip costs' },
    ],
  },
  {
    slug: 'aurelia-atelier', name: 'Aurelia Atelier', shortName: 'Aurelia', number: '06',
    category: 'Interface concept', role: 'Design · Art direction · UI', concept: true,
    cover: media('cosmic_atelier_ui_in_browser_frame'), color: '#302d3b', ink: '#f4efe5',
    summary: 'An independent luxury interface concept. A visual exploration of atmosphere, scale and art direction for the web.',
    statement: 'An imagined\ndigital world.',
    details: 'This is a concept, not a launched client product. The study explores expressive imagery, atmosphere and interface composition.',
    images: [
      { src: media('cosmic_atelier_ui_in_browser_frame'), alt: 'Aurelia Atelier interface concept in a browser frame', caption: '01 — Interface concept / browser study' },
      { src: media('futuristic_luxury_website_mockup_design'), alt: 'Aurelia Atelier luxury website concept mockup', caption: '02 — Art direction / composition study' },
      { src: media('cosmic_interface_design_mockup'), alt: 'Aurelia Atelier alternative interface concept', caption: '03 — Visual exploration / alternate composition' },
    ],
  },
];
const projectOrder = ['allnrg', 'pdp', 'khasaut-tour', 'vpn-equipment', 'legacy-rheumatology', 'aurelia-atelier'];
export const projects: Project[] = projectOrder.map((slug, index) => ({ ...projectRecords.find(project => project.slug === slug)!, number: String(index + 1).padStart(2, '0') }));
export const featuredProjects = projects.slice(0, 3);
export const contact = { name: 'Vladislav Imanakov', email: 'exestination@yandex.ru', telegram: 'https://t.me/vimanakov', github: 'https://github.com/Vladislavim' };
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://imanakov.dev').origin;
