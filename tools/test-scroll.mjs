import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const base = process.env.TEST_URL || 'http://localhost:4173';
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base);
    await page.waitForSelector('#boot', { state: 'detached' });
    const move = async y => {
      await page.evaluate(y => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y), y);
      await page.waitForTimeout(60);
    };
    // the band never hides: it is on screen, at the top, wherever you are
    const hidden = () => page.locator('.nav').evaluate(el => {
      const r = el.getBoundingClientRect();
      return getComputedStyle(el).opacity === '0' || r.bottom <= 0;
    });
    const restLetters = await page.locator('.hero-word .v').evaluateAll(els => els.map(el => el.style.fontVariationSettings).join('|'));
    await move(450);
    assert.notEqual(await page.locator('.hero-word .v').evaluateAll(els => els.map(el => el.style.fontVariationSettings).join('|')), restLetters, 'Hero typography still animates');
    await move(0);
    for (const y of [700, 698, 675, 740, 0]) {
      await move(y);
      assert.equal(await hidden(), false, 'The nav band stays on screen while scrolling');
    }
    if (mobile) {
      await page.locator('.nav-burger').click();
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      assert.ok(await page.locator('.menu.open').count(), 'The burger opens the menu');
      await page.locator('.nav-burger').click();
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    } else {
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(600);
      assert.ok(await page.evaluate(() => scrollY > 500), 'Wheel scrolling progresses');
      await page.mouse.wheel(0, -500);
      await page.waitForTimeout(600);
      assert.ok(await page.evaluate(() => scrollY < 500), 'Wheel direction reversal responds');
    }
    for (const route of ['/', '/about/', '/work/', '/contact/']) {
      const immediatePath = await page.evaluate(route => { window.__nav(route); return location.pathname; }, route);
      assert.equal(immediatePath, route, 'Navigation changes immediately without a timer');
      await page.waitForTimeout(500);
      const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      for (const y of [max * .25, max * .6, max, max * .5, 0]) await move(y);
      assert.equal(await hidden(), false, 'Navigation visible at page top');
    }
    assert.deepEqual(errors, []);
    console.log(`${mobile ? 'Mobile' : 'Desktop'}: navbar thresholds, scroll reversal, routes and menu passed`);
    await context.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(base);
  await page.waitForSelector('#boot', { state: 'detached' });
  assert.equal(await page.evaluate(() => Boolean(window.__lenis)), false);
  console.log('Reduced motion: native scroll preserved');
} finally { await browser.close(); }
