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
  await expect(page.locator('.position-0')).toHaveAttribute('aria-label', 'Open Legacy Rheumatology');
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
    await page.locator('.hero-wordmark').waitFor();
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
  for (const slug of ['allnrg','legacy-rheumatology','vpn-equipment','aurelia-atelier']) {
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
  await page.waitForTimeout(700);
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width * .5, y = box!.y + box!.height * .5;
  await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x-140,y+2,{ steps:12 }); await page.mouse.up();
  await expect(page).toHaveURL(/\/#work/);
  await expect(page.locator('.position-0')).toHaveAttribute('aria-label','Open Legacy Rheumatology');
});
