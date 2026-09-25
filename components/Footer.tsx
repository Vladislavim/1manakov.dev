import { contact } from '@/data/projects';
import Link from 'next/link';
import { publishedGuides } from '@/lib/guides';
import { RouteLink } from './SiteShell';
export function Footer() {
  return <footer className="footer">
    <div className="footer-top"><span className="eyebrow">ЕСТЬ ЗАДАЧА ДЛЯ САЙТА?</span><a className="contact-title" href={contact.telegram} target="_blank" rel="noreferrer">Let’s talk<span aria-hidden="true">↗</span></a><p className="contact-help" lang="ru">Напишите в Telegram: ссылка на сайт и что хотите изменить.<br/>Удобнее почтой? <a href={`mailto:${contact.email}`}>{contact.email} ↗</a></p></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} IMANAKOV</span><div><a href={contact.telegram} target="_blank" rel="noreferrer">TELEGRAM ↗</a><a href={contact.github} target="_blank" rel="noreferrer">GITHUB ↗</a><RouteLink href="/about">ABOUT</RouteLink>{publishedGuides().length > 0 && <Link href="/guides">GUIDES</Link>}</div><span>Made to be explored.</span></div>
  </footer>;
}
