import {pageMetadata} from '@/lib/metadata';
import {WebsiteSystem} from '@/components/WebsiteSystem';
import '@/styles/website-system.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { contact } from '@/data/projects';
import { CaseMotion } from '@/components/CaseMotion';
import {AboutPortrait} from '@/components/AboutPortrait';
export const metadata: Metadata = pageMetadata({title:'About Vladislav Imanakov',description:'Vladislav Imanakov — web design, interface design, frontend development and SEO. От первой идеи до работающего интерфейса.',path:'/about'});
export default function AboutPage() {
  return <main id="main" tabIndex={-1}>
    <CaseMotion><section className="about-page"><div className="about-top" data-case-reveal><span className="eyebrow">A LITTLE CONTEXT.</span><span className="eyebrow">DESIGN + FRONTEND + SEO</span></div>
      <h1>Vladislav<br /><span>Imanakov.</span></h1>
      <div className="about-intro"><span className="about-mark" aria-hidden="true">i.</span><AboutPortrait/><div className="about-intro-copy"><p className="large-copy">Проектирую и разрабатываю сайты.<br />От первой идеи до работающего интерфейса.</p><p className="body-copy">Объединяю дизайн, frontend, тексты и SEO. Создаю лендинги и многостраничные сайты: продумываю структуру, объясняю предложение, разрабатываю интерфейс и готовлю страницы к поиску.</p></div></div>
      <div className="about-system-layout"><span className="eyebrow">HOW I THINK</span><WebsiteSystem/><div className="about-system-copy"><div className="about-statement"><h2>A website<br />is a system.</h2><p>Сильный сайт — это понятное предложение, структура, цельный дизайн, быстрая загрузка и ясный путь к обращению.</p></div>
      <div className="about-details"><div><span className="eyebrow">WHAT I DO</span><ul><li>Дизайн сайтов и интерфейсов</li><li>Frontend-разработка</li><li>SEO и структура для поиска</li><li>Лендинги</li><li>Многостраничные сайты</li></ul></div><div><span className="eyebrow">FIND ME HERE</span><ul><li><a href={`mailto:${contact.email}`}>Email ↗</a></li><li><a href={contact.telegram} target="_blank" rel="noreferrer">Telegram ↗</a></li><li><a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a></li><li><Link href="/#work">Избранные проекты →</Link></li></ul></div></div>
    </div></div></section><Footer /></CaseMotion>
  </main>;
}
