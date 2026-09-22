import { test, expect } from '@playwright/test';

test('light routes, brand return and interruption leave navigation usable', async ({ page }) => {
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'ABOUT'}).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('h1')).toBeVisible();
  await page.getByRole('link',{name:'LAB',exact:true}).click();
  await expect(page).toHaveURL(/\/lab$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/about$/);
  await page.getByRole('link',{name:'Imanakov — home'}).click();
  await expect(page).toHaveURL('http://127.0.0.1:3000/');
  await expect(page.locator('.route-veil')).toBeHidden();
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.getByRole('link',{name:'Imanakov — home'}).dispatchEvent('click',{button:0,detail:1});
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(5);
  await page.getByRole('link',{name:'ABOUT',exact:true}).first().click();
  await expect(page).toHaveURL(/\/about$/);
  expect(errors).toEqual([]);
});

test('modal wheel does not move the page behind the experiment', async({page})=>{
  await page.goto('/lab');
  await page.getByRole('button',{name:/Card physics/}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const before=await page.evaluate(()=>scrollY);
  await page.getByRole('dialog').hover();
  await page.mouse.wheel(0,500);
  await page.waitForTimeout(300);
  expect(await page.evaluate(()=>scrollY)).toBe(before);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.mouse.wheel(0,400);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+20);
});

test('reduced motion and no-JS keep all scene content visible',async({browser})=>{
  for(const javaScriptEnabled of [true,false]){
    const context=await browser.newContext({reducedMotion:'reduce',javaScriptEnabled,viewport:{width:390,height:844}});
    const page=await context.newPage();
    await page.goto('/');
    for(const selector of ['#hero-title','#explore-title','#work-title','#play-title']){
      const element=page.locator(selector);
      await element.scrollIntoViewIfNeeded();
      await expect(element).toBeVisible();
      expect(await element.evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
    }
    await context.close();
  }
});


test('ordinary guide links use the shared transition and recover through history', async ({ page }) => {
  await page.goto('/guides');
  const link = page.locator('main a[href^="/guides/"]:not([data-route-transition])').first();
  const href = await link.getAttribute('href');
  await link.click();
  await expect(page.locator('.route-veil')).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator('.route-veil')).toBeHidden();
  await expect(page.locator('main h1')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/guides$/);
  await expect(page.locator('.route-veil')).toBeHidden();
});
