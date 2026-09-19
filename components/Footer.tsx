import { contact } from '@/data/projects';
import Link from 'next/link';
import { indexableArticles } from '@/lib/editorial';
export function Footer() {
  return <footer className="footer">
    <div className="footer-top"><span className="eyebrow">Have something in mind?</span><a className="contact-title" href={`mailto:${contact.email}`}>Let’s talk<span aria-hidden="true">↗</span></a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} IMANAKOV</span><div><a href={contact.telegram} target="_blank" rel="noreferrer">TELEGRAM ↗</a><a href={contact.github} target="_blank" rel="noreferrer">GITHUB ↗</a><Link href="/about">ABOUT</Link>{indexableArticles().length > 0 && <Link href="/journal">JOURNAL</Link>}</div><span>Made to be explored.</span></div>
  </footer>;
}
