import Link from 'next/link';
import { Footer } from './Footer';
import { ARTICLE_PAGE_SIZE, indexableArticles, topicNames, type Article } from '@/lib/editorial';

export function JournalIndex({ articles, page = 1, topic }: { articles: Article[]; page?: number; topic?: string }) {
  const pages = Math.ceil(articles.length / ARTICLE_PAGE_SIZE);
  const topics = [...new Set(indexableArticles().map(a => a.topic))];
  return <><main id="main" tabIndex={-1} lang="ru" className="journal-shell">
    <nav className="journal-breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span>{topic ? <><Link href="/journal">Журнал</Link><span>/</span><span>{topicNames[topic]}</span></> : <span>Журнал</span>}</nav>
    <header className="journal-heading"><span className="eyebrow">DESIGN NOTES / IMANAKOV</span><h1>{topic ? topicNames[topic] : 'Дизайн в деталях'}</h1></header>
    <nav className="journal-topics" aria-label="Темы журнала"><Link href="/journal">Все темы</Link>{topics.map(key => <Link key={key} href={`/journal/topic/${key}`} aria-current={key === topic ? 'page' : undefined}>{topicNames[key]}</Link>)}</nav>
    <div className="journal-list">{articles.slice((page-1)*ARTICLE_PAGE_SIZE,page*ARTICLE_PAGE_SIZE).map(article => <article key={article.slug}><span className="eyebrow">{topicNames[article.topic]}</span><h2><Link href={`/journal/${article.slug}`}>{article.h1}<span aria-hidden="true">↗</span></Link></h2><p>{article.description}</p></article>)}</div>
    {!articles.length && <p>Материалы готовятся к публикации.</p>}
    {pages > 1 && <nav className="journal-pagination" aria-label="Страницы журнала">{Array.from({ length:pages }, (_,i) => <Link key={i} aria-current={page === i+1 ? 'page' : undefined} href={topic ? `/journal/topic/${topic}${i===0?'':`/page/${i+1}`}` : i === 0 ? '/journal' : `/journal/page/${i+1}`}>{i+1}</Link>)}</nav>}
    <Link className="text-link" href="/feed.xml">RSS →</Link>
  </main><Footer /></>;
}
