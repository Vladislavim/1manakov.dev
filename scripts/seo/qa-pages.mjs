import {chromium} from '@playwright/test';
import {getGuides} from '../../lib/guides.ts';
import {writeJSON} from './api.mjs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3000',browser=await chromium.launch(),errors=[],results=[];
const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
for(const g of getGuides().filter(g=>['indexable','noindex'].includes(g.status))){
 const response=await page.goto(base+g.canonical);const canonical=await page.locator('link[rel=canonical]').getAttribute('href'),robots=await page.locator('meta[name=robots]').getAttribute('content'),schemas=await page.locator('script[type="application/ld+json"]').allTextContents();
 const graph=schemas.flatMap(s=>{try{return JSON.parse(s);}catch{errors.push(`${g.slug}: invalid JSON-LD`);return[];}});
 const text=await page.locator('article').innerText();const issues=[];
 if(response.status()!==200)issues.push(`HTTP ${response.status()}`);
 if(await page.locator('h1').count()!==1)issues.push('H1 count');
 if(!canonical?.endsWith(g.canonical))issues.push('canonical');
 if(g.indexable===robots.includes('noindex'))issues.push('robots mismatch');
 if(!graph.some(s=>s['@type']==='Article')||!graph.some(s=>s['@type']==='BreadcrumbList'))issues.push('schema types');
 if(text.length<1300||!text.includes(g.directAnswer))issues.push('SSR content');
 const contacts=await page.locator('a[data-seo-event="seo_cta_click"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 if(contacts.length!==2||contacts.some(href=>!decodeURIComponent(href).includes(`clusterId: ${g.clusterId}`)))issues.push('CTA context');
 errors.push(...issues.map(i=>`${g.slug}: ${i}`));results.push({slug:g.slug,status:response.status(),canonical,robots,SSRCharacters:text.length,issues});
}
await context.close();
// Sitemap must enumerate exactly the approved corpus, never previews or the old route.
const index=await (await fetch(base+'/sitemap.xml')).text();
const chunks=[...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const locations=[];for(const path of chunks){const xml=await(await fetch(base+path)).text();locations.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));}
for(const g of getGuides())if(locations.some(url=>url.endsWith(g.canonical))!==g.indexable)errors.push(`${g.slug}: sitemap membership`);
if(!locations.some(u=>u.endsWith('/lab'))||locations.some(u=>u.endsWith('/play')))errors.push('LAB sitemap migration');
if(!(await(await fetch(base+'/robots.txt')).text()).includes('/sitemap.xml'))errors.push('robots sitemap');
for(const path of ['/guides/missing-draft','/guides/page/999','/sitemaps/missing.xml'])if((await fetch(base+path)).status!==404)errors.push(`${path}: should return 404`);
const visual=await browser.newPage();visual.on('pageerror',e=>errors.push(e.message));
await visual.addInitScript(()=>{window.__seoEvents=[];window.addEventListener('imanakov:analytics',e=>window.__seoEvents.push(e.detail));document.addEventListener('click',e=>{if(e.target.closest('[data-seo-event]'))e.preventDefault();},true);});
await visual.goto(base+'/guides/form-error-messages');
await visual.locator('.guide-form-demo button').click();
if(await visual.locator('#demo-email').getAttribute('aria-invalid')!=='true')errors.push('form invalid state');
await visual.locator('#demo-email').fill('reader@example.com');await visual.locator('.guide-form-demo button').click();
if(!(await visual.locator('#demo-feedback').innerText()).includes('Формат подходит'))errors.push('form success state');
await visual.locator('[data-seo-event="seo_cta_click"]').first().click();
await visual.locator('[data-seo-event="seo_related_page_click"]').first().click();
const firstEvents=await visual.evaluate(()=>window.__seoEvents);
for(const name of ['seo_page_view','seo_cta_view','seo_cta_click','seo_contact_click','seo_related_page_click'])if(!firstEvents.some(e=>e.event===name&&e.clusterId&&e.topic&&e.intent))errors.push(`Missing analytics event: ${name}`);
await visual.goto(base+'/guides/website-redesign-diagnosis');
await visual.locator('[data-seo-event="seo_case_click"]').first().click();
const events=await visual.evaluate(()=>window.__seoEvents);
if(!events.some(e=>e.event==='seo_case_click'&&e.clusterId&&e.topic&&e.intent))errors.push('case event context');
for(const width of [1440,390])for(const g of getGuides().filter(g=>g.golden)){
 await visual.setViewportSize({width,height:900});await visual.goto(base+g.canonical);await visual.evaluate(()=>document.fonts.ready);
 if(await visual.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push(`${g.slug}: overflow ${width}`);
 await visual.screenshot({path:`qa/seo-${g.slug}-${width}.png`});
}
await visual.goto(base+'/work/legacy-rheumatology');if(await visual.locator('.evidence-pair img').count()!==2)errors.push('Legacy comparison missing');await visual.locator('.evidence-pair').scrollIntoViewIfNeeded();await visual.screenshot({path:'qa/legacy-final.png'});
await browser.close();await writeJSON('seo/reports/route-qa.json',{checkedAt:new Date().toISOString(),results,errors});console.log({pages:results.length,errors});if(errors.length)process.exitCode=1;
