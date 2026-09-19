import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ARTICLE_PAGE_SIZE = 18;
export type Review = { passed: boolean; reviewedAt: string; contentHash: string; reviewer: string };
export type Article = {
  slug: string; title: string; description: string; h1: string; topic: string;
  format: 'guide' | 'how-to' | 'comparison' | 'definition' | 'teardown' | 'checklist' | 'answer';
  status: 'draft' | 'reviewed' | 'indexable'; language: 'ru';
  primaryQuery: string; secondaryQueries: string[]; intentKey: string; readerQuestion: string;
  publishedAt: string; updatedAt: string; related: string[];
  sources: { title: string; url: string; accessedAt: string }[];
  reviews?: { seo?: Review; human?: Review };
  body: string;
};
export const topicNames: Record<string, string> = {
  'product-design': 'Продуктовый дизайн', ux: 'UX', ui: 'UI', 'web-design': 'Веб-дизайн',
  mobile: 'Мобильные интерфейсы', 'design-systems': 'Дизайн-системы', redesign: 'Редизайн',
  portfolio: 'Портфолио и кейсы', interaction: 'Взаимодействие', motion: 'Анимация',
  'ai-design': 'AI и дизайн', research: 'Исследования', prototyping: 'Прототипирование',
  accessibility: 'Доступность',
};
export function contentHash(article: Article): string {
  const { reviews: _reviews, status: _status, ...content } = article;
  void _reviews; void _status;
  return createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(content).sort(([a],[b])=>a.localeCompare(b))))).digest('hex');
}
export function getArticles(): Article[] {
  const folder = join(process.cwd(), 'content/articles');
  if (!existsSync(folder)) return [];
  return readdirSync(folder).filter(name => name.endsWith('.json')).sort().map(name => {
    const metadata = JSON.parse(readFileSync(join(folder, name), 'utf8'));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug) || name !== `${metadata.slug}.json`) throw new Error(`Invalid article filename: ${name}`);
    return { ...metadata, body: readFileSync(join(folder, `${metadata.slug}.mdx`), 'utf8').trim() };
  });
}
export function indexableArticles(): Article[] { return getArticles().filter(a => a.status === 'indexable' && articleProblems(a).length === 0).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug)); }
export function articleProblems(article: Article): string[] {
  const problems: string[] = [];
  for (const field of ['title','description','h1','primaryQuery','intentKey','readerQuestion','publishedAt','updatedAt'] as const) {
    if (typeof article[field] !== 'string' || !article[field].trim()) problems.push(`Missing ${field}`);
  }
  if (!['draft','reviewed','indexable'].includes(article.status)) problems.push('Invalid status');
  if (!topicNames[article.topic]) problems.push('Unknown topic');
  if (article.language !== 'ru') problems.push('Unsupported language');
  if (!['guide','how-to','comparison','definition','teardown','checklist','answer'].includes(article.format)) problems.push('Unknown format');
  if (!Array.isArray(article.related) || !Array.isArray(article.secondaryQueries) || !Array.isArray(article.sources)) problems.push('Missing structured fields');
  if (/^# |^\s*(import |export )|<\/?[a-zA-Z][^>]*>/m.test(article.body)) problems.push('Only safe Markdown subset is supported; no H1, JSX, imports or HTML');
  if (article.status === 'indexable') {
    if (article.body.split(/\s+/).length < (['answer','definition'].includes(article.format) ? 250 : 450)) problems.push('Thin-content review required');
    if ((article.body.match(/^## /gm) || []).length < 2) problems.push('Missing useful section structure');
    if (article.sources.length < 1 || article.sources.some(s => !/^https:\/\//.test(s.url) || !s.title || !/^\d{4}-\d{2}-\d{2}$/.test(s.accessedAt))) problems.push('Missing source provenance');
    if (!article.related.length) problems.push('Missing contextual related articles');
    for (const name of ['seo','human'] as const) {
      const review = article.reviews?.[name];
      if (!review?.passed || !review.reviewer || !review.reviewedAt || review.contentHash !== contentHash(article)) problems.push(`Missing or stale ${name} review`);
    }
    if (article.description.length < 70 || article.description.length > 220) problems.push('Description needs review');
    if (article.title.length > 100) problems.push('Title too long');
    if ([article.publishedAt, article.updatedAt].some(date => !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)))) problems.push('Invalid date');
  }
  return problems;
}
