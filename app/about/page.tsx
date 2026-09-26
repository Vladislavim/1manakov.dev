import {pageMetadata} from '@/lib/metadata';
import {WebsiteSystem} from '@/components/WebsiteSystem';
import '@/styles/website-system.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { contact } from '@/data/projects';
import { CaseMotion } from '@/components/CaseMotion';
import { AboutPortrait } from '@/components/AboutPortrait';

export const metadata: Metadata = pageMetadata({
  title: 'About Vladislav Imanakov — Creative Developer & Product Designer',
  description: 'Vladislav Imanakov. Проектирование интерфейсов, разработка на Next.js и техническое SEO.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <CaseMotion>
        <section className="about-page">
          <div className="about-top" data-case-reveal>
            <span className="eyebrow">A LITTLE CONTEXT.</span>
            <span className="eyebrow">CREATIVE DEVELOPER & PRODUCT DESIGNER</span>
          </div>

          <h1>
            Vladislav<br />
            <span>Imanakov.</span>
          </h1>

          <div className="about-intro">
            <span className="about-mark" aria-hidden="true">i.</span>
            <AboutPortrait />
            <div className="about-intro-copy">
              <p className="large-copy">
                Проектирую и собираю сайты на Next.js.<br />
                Дизайн, чистый код и быстрая загрузка.
              </p>
              <p className="body-copy">
                Работаю один. Сам продумываю структуру, рисую интерфейс, пишу фронтенд и настраиваю поисковую оптимизацию. Без менеджеров и перекладывания задач: вы общаетесь напрямую с тем, кто делает проект от первой строки до боевого сервера.
              </p>
            </div>
          </div>

          <div className="about-system-layout">
            <span className="eyebrow">HOW I BUILD</span>
            <WebsiteSystem />
            <div className="about-system-copy">
              <div className="about-statement">
                <h2>A website<br />is a system.</h2>
                <p>
                  Хороший интерфейс решает задачу спокойно. Посетитель понимает суть предложения, видит реальные факты и за пару кликов делает заказ. Без навязчивых баннеров, тяжелых скриптов и визуального мусора.
                </p>
              </div>

              <div className="about-details">
                <div>
                  <span className="eyebrow">ПРАКТИКА</span>
                  <ul>
                    <li>Проектирование веб-сервисов и сайтов</li>
                    <li>Разработка на Next.js и TypeScript</li>
                    <li>Интерактивная анимация на GSAP</li>
                    <li>Оптимизация скорости и Core Web Vitals</li>
                    <li>Техническая настройка SEO</li>
                  </ul>
                </div>
                <div>
                  <span className="eyebrow">СВЯЗЬ</span>
                  <ul>
                    <li><a href={contact.telegram} target="_blank" rel="noreferrer">Telegram: @vimanakov ↗</a></li>
                    <li><a href={`mailto:${contact.email}`}>{contact.email} ↗</a></li>
                    <li><a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
                    <li><Link href="/#work">Избранные кейсы →</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </CaseMotion>
    </main>
  );
}
