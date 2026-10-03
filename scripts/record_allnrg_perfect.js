const { chromium } = require('C:/Users/viman/OneDrive/Рабочий стол/эльдар сайт/khasaut-tour/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function cleanPage(page) {
  await page.evaluate(() => {
    // Remove cookie banner
    document.querySelector('#ck-banner')?.remove();
    // Remove chat widget
    document.querySelector('.messenger-fab')?.remove();
    // Remove any modal backdrops
    document.querySelectorAll('.modal, .ck-modal, .ccm').forEach(el => el.remove());
    // Ensure scrolling is active
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  });
}

async function preloadImages(page, maxScroll = 6200) {
  for (let y = 0; y <= maxScroll; y += 800) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

async function recordDesktop() {
  console.log('--- Starting Desktop Recording ---');
  const tempDir = path.resolve('public/videos/temp_desktop_clean');
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 800 },
    recordVideo: {
      dir: tempDir,
      size: { width: 1440, height: 800 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to https://allnrg.ru (desktop)...');
  await page.goto('https://allnrg.ru', { waitUntil: 'networkidle', timeout: 35000 });
  await cleanPage(page);

  console.log('Preloading all images...');
  await preloadImages(page, 6200);
  await cleanPage(page);

  // 1. Initial Hero Pause (1.5 seconds)
  console.log('Hero showcase (1.5s)...');
  await page.waitForTimeout(1500);

  // 2. Smooth Step-Scroll over 12 seconds
  console.log('Smooth scrolling down to footer...');
  const totalScroll = 6000;
  const fps = 25;
  const scrollDurationSec = 11;
  const steps = fps * scrollDurationSec;

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    // Smooth ease-in-out curve
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const y = Math.round(ease * totalScroll);
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(1000 / fps);
  }

  // 3. Footer Pause (1.5 seconds)
  console.log('Footer showcase (1.5s)...');
  await page.waitForTimeout(1500);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const videoPath = await video.path();
  console.log('Desktop video recorded at:', videoPath);
  return videoPath;
}

async function recordMobile() {
  console.log('--- Starting Mobile (iPhone) Recording ---');
  const tempDir = path.resolve('public/videos/temp_mobile_clean');
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    recordVideo: {
      dir: tempDir,
      size: { width: 390, height: 844 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to https://allnrg.ru (mobile)...');
  await page.goto('https://allnrg.ru', { waitUntil: 'networkidle', timeout: 35000 });
  await cleanPage(page);

  const mobileMaxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  console.log('Mobile max scroll:', mobileMaxScroll);

  console.log('Preloading mobile images...');
  await preloadImages(page, mobileMaxScroll);
  await cleanPage(page);

  // 1. Hero Pause (1.5 seconds)
  console.log('Mobile hero showcase (1.5s)...');
  await page.waitForTimeout(1500);

  // 2. Smooth Step-Scroll over 11 seconds
  console.log('Mobile smooth scrolling...');
  const fps = 25;
  const scrollDurationSec = 11;
  const steps = fps * scrollDurationSec;
  const targetScroll = Math.min(mobileMaxScroll, 7500);

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const y = Math.round(ease * targetScroll);
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(1000 / fps);
  }

  // 3. Mobile Footer Pause (1.5 seconds)
  console.log('Mobile footer showcase (1.5s)...');
  await page.waitForTimeout(1500);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const videoPath = await video.path();
  console.log('Mobile video recorded at:', videoPath);
  return videoPath;
}

async function main() {
  const desktop = await recordDesktop();
  const mobile = await recordMobile();
  console.log('\n--- SUCCESS ---');
  console.log('Desktop raw video:', desktop);
  console.log('Mobile raw video:', mobile);
}

main().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
