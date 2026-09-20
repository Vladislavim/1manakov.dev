import { test, expect } from '@playwright/test';

test('wordmark and both explore lines stay centered after scroll and resize', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const width of [1878, 1024, 390]) {
    await page.setViewportSize({width, height:900});
    await page.evaluate(() => window.scrollTo(0, 0));
    const word = await page.locator('#hero-title').boundingBox();
    expect(word!.x).toBeGreaterThanOrEqual(0);
    expect(word!.x + word!.width).toBeLessThanOrEqual(width);
    await expect(page.locator('.lens-link')).toHaveCSS('opacity', '1');
    await page.locator('#explore').evaluate(el => window.scrollTo(0, (el as HTMLElement).offsetTop));
    await page.waitForTimeout(300);
    const scene = await page.locator('#explore').boundingBox();
    const title = await page.locator('#explore-title').boundingBox();
    expect(Math.abs((title!.y + title!.height / 2 - scene!.y) / scene!.height - (width < 768 ? .46 : .49))).toBeLessThan(.02);
    expect(title!.y + title!.height).toBeLessThan(scene!.y + scene!.height - 60);
  }
});

test('all six cases are selectable in the lens and linked from letters', async ({page}) => {
  await page.goto('/');
  const slugs = ['allnrg','pdp','khasaut-tour','vpn-equipment','legacy-rheumatology','aurelia-atelier'];
  await expect(page.locator('.hero-select button')).toHaveCount(6);
  await expect(page.locator('.hero-caption')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  // Every lens image must be ready even before its case is selected.
  await expect.poll(() => page.locator('.hero-world img').evaluateAll((images:HTMLImageElement[]) => images.every(img => img.loading === 'eager' && img.complete && img.naturalWidth > 0 && !img.currentSrc.includes('/_next/image')))).toBe(true);
  for (const [index, slug] of slugs.entries()) {
    await page.locator('.hero-select button').nth(index).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.lens-link')).toHaveAttribute('href', `/work/${slug}`);
    await expect(page.locator('.hero-world.is-active')).toHaveAttribute('data-case', slug);
    await expect.poll(() => page.locator('.hero-world.is-active img').evaluate((img:HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.locator('#explore').scrollIntoViewIfNeeded();
  for (const [index, slug] of slugs.entries()) {
    await page.locator('.scene-index button').nth(index).click();
    await expect(page.locator('.image-letter').first()).toHaveAttribute('href', `/work/${slug}`);
  }
});
