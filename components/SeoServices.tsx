import Image from 'next/image';
import Link from 'next/link';
import {contact} from '@/data/projects';

const services=[
 ['Комплексный аудит','Проверяю техническое состояние, структуру, контент, скорость и пользовательские сценарии. Собираю проблемы в понятный план: что исправить сейчас, что сделать следующим.','Результат: аудит с приоритетами и планом исправлений.'],
 ['Семантическое ядро','Собираю запросы через Яндекс Wordstat, очищаю и группирую по смыслу и намерению пользователя. Распределяю кластеры по страницам, нахожу темы для новых посадочных.','Результат: семантика, кластеры и карта страниц.'],
 ['Индексация и работоспособность','Проверяю ответы сервера, редиректы, битые ссылки, robots.txt, sitemap и canonical. Сверяю доступность страниц для поиска через Search Console и Яндекс Вебмастер, проверяю формы и ключевые действия.','Результат: список ошибок, исправления и повторная проверка.'],
 ['Внешние площадки','Подбираю подходящие каталоги, карты и отраслевые площадки. Создаю и оформляю карточки компании, привожу контакты и ссылки к единому виду. Подтверждение владельца — с вашим участием.','Результат: оформленные профили и реестр размещений.'],
 ['Аналитика и измерение','Подключаю или проверяю Метрику, цели и события. Разделяю источники трафика, визиты и обращения, чтобы оценивать изменения по данным.','Результат: проверенные события и понятная точка отсчёта.'],
 ['Персональные данные / РКН','Проверяю формы, согласия, политику обработки данных, сторонние сервисы и сведения об операторе. Выявляю потенциальные риски нарушений и исправляю техническую часть сайта; правовые вопросы выношу на согласование с юристом.','Результат: карта рисков и устранение найденных технических проблем.'],
];
const tools=[['google.png','Google','/guides/website-redesign-diagnosis'],['wordstat.png','Wordstat','#seo-service-1'],['yandex.svg','Яндекс','#seo-service-2'],['metrika.png','Метрика','#seo-service-4'],['gsc.svg','Search Console','#seo-service-2'],['frog.png','Screaming Frog','#seo-service-0'],['rkn.png','РКН','#seo-service-5']];
export function SeoServices(){return <section id="seo" className="seo-services" aria-labelledby="seo-services-title">
 <header className="seo-services-top"><span>BEYOND THE INTERFACE</span><span>SEO & WEBSITE HEALTH / 02</span></header>
 <div className="seo-services-stage"><div className="seo-services-intro"><h2 id="seo-services-title">Made to<br/>be found<span>.</span></h2><p lang="ru">Сайт, который не просто выглядит.<br/>Работает. Находится. Измеряется.</p><a className="seo-audit-link" href={`mailto:${contact.email}?subject=${encodeURIComponent('SEO-аудит сайта')}`} lang="ru">Обсудить аудит <span aria-hidden="true">↗</span></a></div>
 <div className="seo-tools-field"><span className="seo-orbit-word" aria-hidden="true">SEO</span><ul aria-label="Инструменты и направления работы">{tools.map(([src,name,href],i)=><li key={src} className={`seo-tool seo-tool-${i}`}><a href={href} aria-label={`${name} — подробнее`}><span className="seo-logo-disc">{src==='gsc.svg'?<svg viewBox="0 0 40 40" role="img" aria-label="Search Console"><image href="/images/seo-tools/gsc.svg" width="278" height="40"/></svg>:<Image src={`/images/seo-tools/${src}`} alt={name} width={120} height={120} unoptimized/>}</span><span className="seo-logo-name">{name}</span></a></li>)}</ul><span className="seo-field-caption">A CONNECTED APPROACH ↗</span></div></div>
 <div className="seo-services-divider"><span>ОТ АУДИТА ДО ИСПРАВЛЕНИЙ</span><span>06 НАПРАВЛЕНИЙ</span></div>
 <div className="seo-service-grid" lang="ru">{services.map(([title,body],i)=><article id={`seo-service-${i}`} key={title}><span className="seo-service-index">0{i+1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
 <footer className="seo-services-bottom"><span>DESIGN. DEVELOPMENT. DISCOVERABILITY.</span><Link href="/work/allnrg"><span>ALLIANCE ENERGY / VERIFIED RESULT</span><strong>169 organic search visits ↗</strong></Link></footer>
 </section>;}
