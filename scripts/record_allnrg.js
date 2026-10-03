const { chromium } = require('C:/Users/viman/OneDrive/Рабочий стол/эльдар сайт/khasaut-tour/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function dismissAnnoyances(page) {
  try {
    await page.evaluate(() => {
      // 1. Remove or hide cookie banner
      const cookieButtons = Array.from(document.querySelectorAll('button, a')).filter(el => 
        el.innerText && (el.innerText.includes('Принять') || el.innerText.includes('Согласен'))
      );
      if (cookieButtons.length > 0) {
        cookieButtons[0].click();
      }

      // Hide any fixed popups / cookie containers
      const popups = document.querySelectorAll('[class*="cookie"], [id*="cookie"], [class*="chat"], [id*="chat"], [class*="jivo"], [id*="jivo"], [class*="b24-widget"]');
      popups.forEach(el => {
        el.style.display = 'none';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      });

      // Also ensure scroll is not blocked
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    });
  } catch (e) {
    console.warn('dismissAnnoyances error:', e.message);
  }
}

async function recordDesktop() {
  console.log('--- Starting Desktop Recording ---');
  const tempDir = path.resolve('public/videos/temp_desktop');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 800 },
    recordVideo: {
      dir: tempDir,
      size: { width: 1440, height: 800 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to https://allnrg.ru ...');
  await page.goto('https://allnrg.ru', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(1000);

  await dismissAnnoyances(page);
  await page.waitForTimeout(500);
  await dismissAnnoyances(page);

  // Pause at hero
  console.log('Hero preview pause (1.5s)...');
  await page.waitForTimeout(1500);

  // Smooth scroll down
  console.log('Smooth scrolling through allnrg.ru...');
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const duration = 12000; // 12 seconds
    const startTime = performance.now();

    await new Promise(resolve => {
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth easing: easeInOutCubic
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, ease * total);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  });

  // Pause at footer
  console.log('Footer pause (1.5s)...');
  await page.waitForTimeout(1500);

  // Close context to finish video
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const videoPath = await video.path();
  console.log('Desktop video saved to:', videoPath);
  return videoPath;
}

async function recordMobile() {
  console.log('--- Starting Mobile (iPhone) Recording ---');
  const tempDir = path.resolve('public/videos/temp_mobile');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  // Aspect ratio matches the iPhone screen mockup (315 / 713 = ~0.4418 -> 390 x 882)
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
  console.log('Navigating to https://allnrg.ru (mobile) ...');
  await page.goto('https://allnrg.ru', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(1000);

  await dismissAnnoyances(page);
  await page.waitForTimeout(500);
  await dismissAnnoyances(page);

  // Pause at hero
  console.log('Mobile hero preview pause (1.5s)...');
  await page.waitForTimeout(1500);

  // Smooth scroll down
  console.log('Mobile smooth scrolling through allnrg.ru...');
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const duration = 12000; // 12 seconds
    const startTime = performance.now();

    await new Promise(resolve => {
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, ease * total);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  });

  // Pause at footer
  console.log('Mobile footer pause (1.5s)...');
  await page.waitForTimeout(1500);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const videoPath = await video.path();
  console.log('Mobile video saved to:', videoPath);
  return videoPath;
}

async function main() {
  const desktopVideo = await recordDesktop();
  const mobileVideo = await recordMobile();
  console.log('\nBoth recordings complete!');
  console.log('Desktop:', desktopVideo);
  console.log('Mobile:', mobileVideo);
}

main().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
