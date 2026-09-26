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
    category: 'Инженерные услуги', role: 'Дизайн · Разработка · SEO',
    seoResult: allnrgSeo,
    cover: media('allnrg_home_mac'), color: '#e4e425', ink: '#171b15',
    summary: 'Платформа для компании промышленного инжиниринга: увязал 4 сложных направления услуг в единый каталог с прямым выходом на инженеров и добился 25% органического поиска.',
    statement: 'Архитектура b2b-продаж\nбез шума.',
    details: 'Строгая контрастная графика, оцифровка сложных инженерных процессов и чистая подача крупных промышленных объектов. Вместо абстрактных текстов — конкретные решения и спецификации, готовые к коммерческому поисковому спросу.',
    url: 'https://allnrg.ru/',
    images: [
      { src: media('allnrg_home_mac'), alt: 'Главная страница Alliance Energy', caption: '01 — Главная: услуги и переходы к проектам' },
      { src: media('allnrg_two_windows_mac'), alt: 'Страницы сайта Alliance Energy', caption: '02 — Единый визуальный язык страниц' },
      { src: media('allng-hero'), alt: 'Первый экран Alliance Energy', caption: '03 — Промышленные фотографии и переход к работам' },
    ],
  },
  {
    slug: 'legacy-rheumatology', name: 'Legacy Rheumatology', shortName: 'Legacy', number: '02',
    category: 'Сайт клиники', role: 'Дизайн · Frontend · Сборка',
    cover: media('legacy_hero_mac'), color: '#17372e', ink: '#f2eee3',
    summary: 'Медицинский интерфейс специализированной клиники с фокусом на доверие, путь пациента и мобильную запись на приём за два касания.',
    statement: 'Медицинский интерфейс\nвысокого доверия.',
    details: 'Выверенная типографика и спокойная колористика без агрессивного визуального мусора. Запись к врачам, диагностическая база и протоколы лечения разложены по полочкам, понятным пациенту в стрессовой ситуации.',
    url: 'https://legacy-rheumatology.vercel.app/',
    images: [
      { src: media('legacy_hero_mac'), alt: 'Главная страница Legacy Rheumatology', caption: '01 — Первый экран: клиника и навигация' },
      { src: media('legacy_gallery_mac'), alt: 'Фотогалерея клиники Legacy Rheumatology', caption: '02 — Клиника в фотографиях' },
      { src: media('legacy_legacy_section_mac'), alt: 'История клиники Legacy Rheumatology', caption: '03 — История клиники' },
      { src: media('legacy_timeline_mac'), alt: 'Хронология клиники Legacy Rheumatology', caption: '04 — Хронология' },
    ],
  },
  {
    slug: 'vpn-equipment', name: 'VPN Equipment Rental', shortName: 'VPN', number: '03',
    category: 'Аренда и продажа техники', role: 'Дизайн · Frontend · Сборка',
    cover: media('ooovpn_sale_mac'), color: '#c89755', ink: '#151714',
    summary: 'Каталог тяжелой техники и модульных зданий: быстрая фильтрация по характеристикам и бронебойная посадочная под коммерческий трафик.',
    statement: 'Тяжелый каталог\nс быстрым откликом.',
    details: 'Парк спецтехники и оборудования разбит на чёткие товарные кластеры. Интуитивные фильтры параметров, мгновенная подгрузка спецификаций и прямой контакт с отделом аренды без лишних барьеров.',
    url: 'https://ooovpn.ru/',
    images: [
      { src: media('ooovpn_sale_mac'), alt: 'Продажа техники VPN', caption: '01 — Продажа: обзор предложения' },
      { src: media('ooovpn_catalog_mac'), alt: 'Каталог оборудования VPN', caption: '02 — Каталог оборудования' },
      { src: media('ooovpn_bytovki_mac'), alt: 'Модульные здания VPN', caption: '03 — Модульные здания' },
      { src: media('ooovpn_directions_mac'), alt: 'Направления компании VPN', caption: '04 — Направления бизнеса' },
    ],
  },
  {
    slug: 'pdp', name: 'PDP', shortName: 'PDP', number: '04', externalSiteStatus:'in-development',
    category: 'Строительство и инжиниринг', role: 'Разработка сайта',
    cover: media('pdp-home'), color: '#f15225', ink: '#171a16',
    summary: 'Цифровое представительство строительно-инжиниринговой группы: управление масштабными объектами и портфолио для корпоративных заказчиков.',
    statement: 'Масштаб объектов\nи контроль рисков.',
    details: 'Индустриальная эстетика, крупная сетка и акцент на сданных объектах капитального строительства. Структура выстроена под лиц, принимающих решения: тендерный отдел, девелоперов и генподрядчиков.',
    url: 'https://ooopdp.ru/',
    images: [
      { src: media('pdp-home'), alt: 'Главная страница ПДП', caption: '01 — Главная: промышленный характер' },
      { src: media('pdp-services'), alt: 'Инженерные и строительные услуги ПДП', caption: '02 — Навигация по инженерным и строительным услугам' },
      { src: media('pdp-projects'), alt: 'Проекты и партнёры ПДП', caption: '03 — Выполненные проекты' },
    ],
  },
  {
    slug: 'khasaut-tour', name: 'Khasaut Tour', shortName: 'Khasaut', number: '05',
    category: 'Туры и экскурсии', role: 'Разработка сайта',
    cover: media('khasaut-home'), color: '#c4ccb1', ink: '#153c30',
    summary: 'Автономная система бронирования горных экспедиций по Северному Кавказу: 31 посадочная страница, микроразметка Schema.org и конверсия напрямую в мессенджеры.',
    statement: 'Автономная машина\nгорных туров.',
    details: 'Каждый перевал и ущелье упакованы в отдельную SEO-посадочную с пререндерингом на React. Интерактивный подбор маршрутов, FAQ-микроразметка для выдачи Яндекса и прямая конверсия в WhatsApp в обход агрегаторов.',
    url: 'https://khasaut-kmv.ru/',
    images: [
      { src: media('khasaut-home'), alt: 'Главная страница Khasaut Tour', caption: '01 — Главная: атмосфера путешествия' },
      { src: media('khasaut-excursions'), alt: 'Экскурсии и джип-туры Khasaut Tour', caption: '02 — Экскурсии: выбор маршрута по Кавказу' },
      { src: media('khasaut-prices'), alt: 'Конфигуратор стоимости Khasaut Tour', caption: '03 — Планирование стоимости поездки' },
    ],
  },
  {
    slug: 'aurelia-atelier', name: 'Aurelia Atelier', shortName: 'Aurelia', number: '06',
    category: 'Концепция интерфейса', role: 'Дизайн · Арт-дирекшн · Интерфейс', concept: true,
    cover: media('cosmic_atelier_ui_in_browser_frame'), color: '#302d3b', ink: '#f4efe5',
    summary: 'Концепция премиального цифрового интерфейса: исследование пространственной глубины, нестандартной сетки и арт-дирекшна.',
    statement: 'Глубина пространства\nи чистая эстетика.',
    details: 'Экспериментальная работа на стыке высокой моды и интерактивного дизайна. Проектирование нестандартной типографики, кинематографичной динамики и премиального пользовательского опыта без оглядки на шаблонные сетки.',
    images: [
      { src: media('cosmic_atelier_ui_in_browser_frame'), alt: 'Концепция Aurelia Atelier в браузере', caption: '01 — Концепция интерфейса в браузере' },
      { src: media('futuristic_luxury_website_mockup_design'), alt: 'Макет сайта Aurelia Atelier', caption: '02 — Арт-дирекшн: композиция' },
      { src: media('cosmic_interface_design_mockup'), alt: 'Альтернативный интерфейс Aurelia Atelier', caption: '03 — Альтернативная композиция' },
    ],
  },
];
const projectOrder = ['allnrg', 'pdp', 'khasaut-tour', 'vpn-equipment', 'legacy-rheumatology', 'aurelia-atelier'];
export const projects: Project[] = projectOrder.map((slug, index) => ({ ...projectRecords.find(project => project.slug === slug)!, number: String(index + 1).padStart(2, '0') }));
export const featuredProjects = projects.slice(0, 3);
export const contact = { name: 'Vladislav Imanakov', email: 'exestination@yandex.ru', telegram: 'https://t.me/vimanakov', github: 'https://github.com/Vladislavim' };
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://imanakov.dev').origin;
