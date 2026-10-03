import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:3010';
const server = spawn(process.execPath, ['scripts/hosting/preview.mjs'], { stdio:'pipe' });
let browser;
const results=[];
try {
  await new Promise((resolve,reject)=>{
    server.stdout.once('data',resolve);
    server.once('error',reject);
    server.once('exit',code=>reject(new Error(`Preview exited: ${code}`)));
  });
  const sitemapPaths=['/sitemap.xml','/sitemaps/site','/sitemaps/guides-0'];
  const urls = new Set();
  for(const route of sitemapPaths){
    const response=await fetch(base+route);
    assert.equal(response.status,200,route);
    assert.match(response.headers.get('content-type'),/xml/);
    for(const match of (await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)) {
      const url=new URL(match[1]);
      assert.equal(url.origin,'https://imanakov.dev');
      if(!url.pathname.startsWith('/sitemaps/'))urls.add(url.pathname);
    }
  }
  assert.equal((await fetch(base+'/does-not-exist')).status,404);
  for(const [from,to] of [['/journal','/guides'],['/play','/lab']]){
    const response=await fetch(base+from,{redirect:'manual'});
    assert.equal(response.status,301);assert.equal(response.headers.get('location'),to);
  }
  for(const route of ['/robots.txt','/feed.xml'])assert.equal((await fetch(base+route)).status,200);
  browser=await chromium.launch({headless:true});
  for(const width of [390,1440]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    for(const route of urls){
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      assert.equal(response.status(),200,route);
      await page.locator('main').waitFor();
      const state=await page.evaluate(()=>({
        title:document.title,
        overflow:document.documentElement.scrollWidth>innerWidth+2,
        images:[...document.images].filter(i=>i.complete&&i.currentSrc&&!i.naturalWidth).map(i=>i.currentSrc),
        optimizer:[...document.images].some(i=>i.currentSrc.includes('/_next/image')),
      }));
      assert.ok(state.title,route);assert.equal(state.overflow,false,`${route} ${width}: overflow`);
      assert.deepEqual(state.images,[],route);assert.equal(state.optimizer,false,route);
      assert.deepEqual(errors,[],`${route} ${width}`);
      results.push({route,width,...state});
    }
    // Exercise the exported React navigation payload as well as direct HTML loads.
    await page.goto(base,{waitUntil:'networkidle'});
    await page.locator('a[href="/about"]').first().click();
    await page.waitForURL('**/about');
    await page.locator('main').waitFor();
    await page.reload({waitUntil:'networkidle'});
    assert.deepEqual(errors,[],'client navigation');
    await page.screenshot({path:`outputs/hosting/about-${width}.png`,fullPage:true});
    await page.close();
  }
  assert.ok(existsSync('out/.htaccess'));
  assert.ok(!readFileSync('out/index.html','utf8').includes('/_next/image?'));
  writeFileSync('outputs/hosting/qa.json',JSON.stringify({checkedAt:new Date().toISOString(),checks:results},null,2));
  console.log(`PASS: ${urls.size} sitemap pages × 2 viewports; direct loads, client navigation, 404, XML, redirects, no JS/HTTP/image errors.`);
} finally {
  await browser?.close();server.kill();
}
