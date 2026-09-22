import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import http from 'node:http';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://imanakov.dev').origin;
const errors = [], pages = [], resources = new Set(), links = new Map();
const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const index = await fetch(base + '/sitemap.xml');
if (index.status !== 200) errors.push('Sitemap index HTTP error');
const urls = [];
for (const chunk of locations(await index.text())) {
  if (new URL(chunk).origin !== origin) errors.push(`Wrong sitemap host: ${chunk}`);
  const response = await fetch(base + new URL(chunk).pathname);
  if (response.status !== 200) errors.push(`Sitemap chunk HTTP error: ${chunk}`);
  urls.push(...locations(await response.text()));
}
if (!urls.length || new Set(urls).size !== urls.length) errors.push('Empty/duplicate sitemap');
const browser = await chromium.launch();
const page = await browser.newPage({ javaScriptEnabled: false });
for (const url of urls) {
  const pathname = new URL(url).pathname;
  if (new URL(url).origin !== origin) errors.push(`Wrong canonical host: ${url}`);
  const response = await page.goto(base + pathname);
  const data = await page.evaluate(() => {
    const meta = selector => document.querySelector(selector)?.getAttribute('content');
    return {
      title: document.title, description: meta('meta[name="description"]'),
      canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(e => e.href),
      robots: meta('meta[name="robots"]'), h1: [...document.querySelectorAll('h1')].map(e => e.textContent),
      og: meta('meta[property="og:image"]'), ogUrl: meta('meta[property="og:url"]'),
      twitter: meta('meta[name="twitter:image"]'),
      schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(e => e.textContent),
      links: [...document.querySelectorAll('a[href]')].map(e => e.getAttribute('href')),
      missingAlt: [...document.querySelectorAll('main img:not([alt])')].length,
      mainCharacters: document.querySelector('main')?.textContent.trim().length || 0,
    };
  });
  const issues = [];
  if (response.status() !== 200) issues.push(`HTTP ${response.status()}`);
  if (!data.title || !data.description) issues.push('Missing title/description');
  if (data.canonicals.length !== 1 || data.canonicals[0] !== url) issues.push('Canonical mismatch');
  if (/noindex/i.test(data.robots || response.headers()['x-robots-tag'] || '')) issues.push('Indexable sitemap page has noindex');
  if (data.h1.length !== 1 || !data.h1[0].trim()) issues.push('Missing/duplicate H1');
  if (!data.og || !data.twitter || !data.ogUrl || new URL(data.ogUrl).href !== new URL(url).href) issues.push('Incomplete social metadata');
  if (data.missingAlt) issues.push('Images missing alt attribute');
  if (data.mainCharacters < 100) issues.push('Insufficient SSR content');
  for (const value of data.schemas) { try { JSON.parse(value); } catch { issues.push('Invalid JSON-LD'); } }
  if (!data.schemas.length) issues.push('Missing structured data');
  const internal = data.links.map(href => new URL(href, url)).filter(u => u.origin === origin).map(u => u.pathname);
  links.set(pathname, internal);
  for (const resource of [data.og, data.twitter]) if (resource) resources.add(new URL(resource).pathname);
  pages.push({ path: pathname, status: response.status(), title: data.title, description: data.description, issues });
  errors.push(...issues.map(issue => `${pathname}: ${issue}`));
}
await browser.close();
for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const p of pages) {
    if (seen.has(p[field])) errors.push(`Duplicate ${field}: ${seen.get(p[field])} and ${p.path}`);
    seen.set(p[field], p.path);
  }
}
const reachable = new Set(['/']), queue = ['/'];
while (queue.length) for (const path of links.get(queue.shift()) || []) if (!reachable.has(path)) { reachable.add(path); queue.push(path); }
for (const p of pages) if (!reachable.has(p.path)) errors.push(`Orphan sitemap page: ${p.path}`);
for (const path of new Set([...links.values()].flat().concat([...resources]))) {
  const response = await fetch(base + path, { redirect: 'manual' });
  if (response.status >= 400) errors.push(`Broken internal link/resource: ${path} (${response.status})`);
}
for (const path of ['/seo-missing-page', '/work/not-a-case', '/guides/not-a-guide', '/guides/page/999', '/sitemaps/missing']) {
  const response = await fetch(base + path);
  if (response.status !== 404) errors.push(`Soft 404: ${path} (${response.status})`);
}
for (const [from, to] of [['/play','/lab'],['/journal','/guides'],['/journal/form-error-messages','/guides/form-error-messages']]) {
  const r = await fetch(base + from, { redirect: 'manual' });
  if (![301,308].includes(r.status) || new URL(r.headers.get('location'),base).pathname !== to) errors.push(`Migration redirect: ${from}`);
}
// Node fetch ignores an overridden Host header; use the HTTP client for this local check.
if (new URL(base).protocol === 'http:') {
  const www = await new Promise((resolve,reject) => {
    http.get(base + '/about?from=check', {headers:{host:'www.imanakov.dev'}}, r => {r.resume();resolve({status:r.statusCode,location:r.headers.location});}).on('error',reject);
  });
  if (www.status !== 308 || www.location !== origin + '/about?from=check') errors.push('www redirect did not preserve path/query');
}
const robots = await (await fetch(base + '/robots.txt')).text();
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`) || /Disallow: \/\s*$/m.test(robots)) errors.push('Robots sitemap/allow rules');
const report = { checkedAt: new Date().toISOString(), base, canonicalOrigin: origin, pageCount: pages.length, pages, errors };
await mkdir('seo/reports', {recursive:true});
await writeFile('seo/reports/technical-qa.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pages:pages.length,errors},null,2));
if(errors.length) process.exitCode=1;
