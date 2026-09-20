import {test,expect} from '@playwright/test';

test('signature transition reveals a real case and cleans up through history',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 await page.locator('.hero-select button').first().focus();await page.keyboard.press('Enter');
 await page.locator('.lens-link').dispatchEvent('click',{button:0,detail:1,clientX:900,clientY:400});
 await expect(page).toHaveURL(/\/work\/allnrg$/);
 await expect(page.locator('.route-portal')).toBeHidden();
 await expect(page.locator('.portal-outgoing')).toBeEmpty();
 await expect(page.locator('main h1')).toHaveText('Alliance Energy');
 await page.locator('.next-project').click();
 await expect(page).toHaveURL(/\/work\/pdp$/);
 await expect(page.locator('.route-portal')).toBeHidden();
 await page.goBack();await expect(page).toHaveURL(/\/work\/allnrg$/);
 await page.goForward();await expect(page).toHaveURL(/\/work\/pdp$/);
 await expect(page.locator('.route-portal')).toBeHidden();expect(errors).toEqual([]);
});

test('prepared evidence keeps project mapping and responsive boundaries',async({page})=>{
 test.setTimeout(120000);
 const sizes=[[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844],[375,812]];
 for(const slug of ['allnrg','pdp','vpn-equipment','khasaut-tour','legacy-rheumatology']){
  for(const [width,height]of sizes){
   await page.setViewportSize({width,height});await page.goto(`/work/${slug}`);
   await expect(page.locator('.case-hero-image [data-device=prepared]')).toBeVisible();
   const sources=await page.locator('.evidence-pair img').evaluateAll(es=>es.map(e=>decodeURIComponent((e as HTMLImageElement).src)));
   expect(sources[0]).toContain(`${slug==='legacy-rheumatology'?'legacy':slug}-previous.webp`);expect(sources[1]).toContain(`${slug==='legacy-rheumatology'?'legacy':slug}-current.webp`);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   await page.locator('.case-evidence').scrollIntoViewIfNeeded();
   if([1366,1440,1920,390].includes(width))await page.screenshot({path:`qa/priority-${slug}-${width}.png`});
  }
 }
});

test('reduced motion and touch leave no stuck transition layers',async({browser,browserName})=>{
 for(const reducedMotion of ['reduce','no-preference'] as const){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:browserName!=='firefox',reducedMotion});const page=await context.newPage();
  await page.goto('/work/pdp');await page.locator('.next-project').tap();
  await expect(page).toHaveURL(/\/work\/khasaut-tour$/);await expect(page.locator('.route-portal')).toBeHidden();
  await context.close();
 }
});
