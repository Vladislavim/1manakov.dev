import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('home, case portal, history and navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'IMANAKOV', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'WORK', exact: true }).click();
  await expect(page.locator('#work')).toBeInViewport();
  await page.getByRole('button', { name: 'Next project', exact: true }).click();
  await expect(page.locator('.position-0')).toHaveAttribute('data-project', 'legacy-rheumatology');
  await page.locator('.position-0').click();
  await expect(page).toHaveURL(/work\/legacy-rheumatology/);
  await expect(page.getByRole('heading', { name: 'Legacy Rheumatology', exact: true })).toBeVisible();
  await expect(page.locator('.route-portal')).toBeHidden();
  await page.goBack();
  await expect(page).toHaveURL(/\/#work/);
  await page.goForward();
  await expect(page).toHaveURL(/work\/legacy-rheumatology/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Legacy Rheumatology', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'ABOUT', exact: true }).first().click();
  await expect(page).toHaveURL(/about/);
  await expect(page.getByRole('heading', { name: /Vladislav/ })).toBeVisible();
  await page.getByRole('link', { name: 'PLAY', exact: true }).click();
  await expect(page).toHaveURL(/play/);
  expect(errors).toEqual([]);
});

test('five experiments, range controls and dialog keyboard dismissal', async ({ page }) => {
  await page.goto('/play');
  for (const name of ['Cursor reveal', 'Card physics', 'Type mask', 'Motion study', 'Portal']) {
    await page.getByRole('button', { name: new RegExp(name) }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name })).toBeVisible();
    if (await dialog.getByRole('slider').count()) { await dialog.getByRole('slider').focus(); await page.keyboard.press('ArrowRight'); await expect(dialog.locator('output')).toHaveText('51%'); }
    if (name === 'Motion study') await dialog.getByRole('button', { name: 'PLAY BOTH' }).click();
    if (name === 'Portal') { await dialog.getByRole('button', { name: 'OPEN THE PORTAL' }).click(); await expect(dialog.locator('.portal-demo-window')).toHaveClass(/is-open/); }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  }
});

test('responsive layouts and screenshots', async ({ page }, testInfo) => {
  test.setTimeout(120000);
  await mkdir('qa/screenshots', { recursive: true });
  const sizes = [[320,740],[360,800],[375,812],[390,844],[430,932],[768,1024],[1024,768],[1280,800],[1366,768],[1440,900],[1920,1080]];
  for (const [width,height] of sizes) {
    await page.setViewportSize({ width,height });
    await page.goto('/');
    await page.locator('#hero-title').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    await page.screenshot({ path: `qa/screenshots/${testInfo.project.name}-home-${width}x${height}.png` });
    if ([375,768,1440].includes(width)) {
      for (const scene of ['explore','work']) {
        await page.locator(`#${scene}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(350);
        await page.locator(`#${scene}`).screenshot({ path: `qa/screenshots/${testInfo.project.name}-${scene}-${width}.png` });
      }
      await page.goto('/play');
      await page.screenshot({ path: `qa/screenshots/${testInfo.project.name}-play-${width}.png`, fullPage: true });
      await page.goto('/work/allnrg');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      await page.screenshot({ path: `qa/screenshots/${testInfo.project.name}-case-${width}.png`, fullPage: true });
      await page.goto('/about');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      await page.screenshot({ path: `qa/screenshots/${testInfo.project.name}-about-${width}.png`, fullPage: true });
    }
  }
});

test('direct project routes, metadata and missing page', async ({ page }) => {
  for (const slug of ['allnrg','legacy-rheumatology','vpn-equipment','pdp','khasaut-tour','aurelia-atelier']) {
    const response = await page.goto(`/work/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://imanakov.website/work/${slug}`);
    const broken = await page.locator('.case-hero-image img').evaluateAll(imgs => imgs.some(img => (img as HTMLImageElement).complete && !(img as HTMLImageElement).naturalWidth));
    expect(broken).toBeFalsy();
  }
  const response = await page.goto('/work/missing-project');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /Nothing/ })).toBeVisible();
});

test('hero stays centered through resize, scroll and route return', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(900);
  for (const [width, height] of [[1884,856], [1366,768], [1920,1080], [1440,900]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(150);
    const geometry = await page.locator('.hero').evaluate(hero => {
      const rect = hero.getBoundingClientRect();
      const title = hero.querySelector('#hero-title')!.getBoundingClientRect();
      const copy = hero.querySelector('.hero-type-inversion .hero-wordmark')!.getBoundingClientRect();
      const caption = hero.querySelector('.scene-bottom')!.getBoundingClientRect();
      const surface = hero.querySelector('.hero-world .project-image')!.getBoundingClientRect();
      return { center: (title.y + title.height / 2 - rect.y) / rect.height,
        alignment: Math.abs(title.y - copy.y), overlap: title.bottom > caption.top,
        covered: surface.left <= rect.left && surface.right >= rect.right };
    });
    expect(geometry.center).toBeCloseTo(.49, 2);
    expect(geometry.alignment).toBeLessThan(1);
    expect(geometry.overlap).toBeFalsy();
    expect(geometry.covered).toBeTruthy();
    await page.locator('#work').scrollIntoViewIfNeeded();
  }
  await page.goto('/about');
  await page.getByRole('link', { name: 'Imanakov — home', exact: true }).click();
  await page.waitForTimeout(900);
  const box = await page.locator('#hero-title').boundingBox();
  expect(box!.y + box!.height / 2).toBeCloseTo(900 * .49, 0);
});

test('reduced motion, keyboard and native no-JS content', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.locator('.lens-link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/work\//);
  await expect(page.locator('.route-portal')).toBeHidden();
  await context.close();
  const native = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await native.newPage();
  await staticPage.goto('/');
  await expect(staticPage.getByRole('heading', { name: 'IMANAKOV', exact: true })).toBeVisible();
  await staticPage.locator('.nojs-work a').first().click();
  await expect(staticPage).toHaveURL(/work\/allnrg/);
  await expect(staticPage.getByRole('heading', { name: 'Alliance Energy', exact: true })).toBeVisible();
  await native.close();
});

test('deck gesture changes project without accidental navigation', async ({ page }) => {
  await page.goto('/#work');
  const card = page.locator('.position-0');
  await expect(card).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width * .5, y = box!.y + box!.height * .5;
  await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x-140,y+2,{ steps:12 }); await page.mouse.up();
  await expect(page).toHaveURL(/\/#work/);
  await expect(page.locator('.position-0')).toHaveAttribute('data-project','legacy-rheumatology');
});

test('rapid route activation, resize and failed image recovery', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(700);
  await page.locator('.lens-link').dispatchEvent('click');
  await page.locator('.lens-link').dispatchEvent('click');
  await page.setViewportSize({ width: 430, height: 932 });
  await expect(page).toHaveURL(/work\/allnrg/);
  await expect(page.locator('.route-portal')).toBeHidden();
  await expect(page.locator('h1')).toBeVisible();
  await page.route('**/_next/image?*', route => route.abort());
  await page.goto('/work/vpn-equipment');
  await expect(page.locator('.case-hero-image .image-fallback')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'VPN Equipment Rental' })).toBeVisible();
});

test('native touch lens swipe, tap and vertical scrolling', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'Native touch dispatch uses Chromium CDP.');
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await page.goto('/');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'qa/screenshots/touch-home-375.png' });
  const lens = await page.locator('.lens-link').boundingBox();
  const x = lens!.x + lens!.width / 2, y = lens!.y + lens!.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 6; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - step * 15, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('.lens-link')).toHaveAttribute('data-project', 'legacy-rheumatology');
  await expect(page).toHaveURL('http://127.0.0.1:3000/');
  await page.waitForTimeout(400);
  await page.touchscreen.tap(x,y);
  await expect(page).toHaveURL(/work\/legacy-rheumatology/);
  await expect(page.locator('.route-portal')).toBeHidden();
  await page.goto('/#work');
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x:200, y:500 }] });
  for (let step = 1; step <= 8; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x:200, y:500-step*25 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 30);
  await context.close();
});
