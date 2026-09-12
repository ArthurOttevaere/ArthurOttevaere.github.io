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
    const hidden = () => page.locator('.nav').evaluate(el => el.classList.contains('hidden'));
    const restLetters = await page.locator('.hero-word .v').evaluateAll(els => els.map(el => el.style.fontVariationSettings).join('|'));
    await move(450);
    assert.notEqual(await page.locator('.hero-word .v').evaluateAll(els => els.map(el => el.style.fontVariationSettings).join('|')), restLetters, 'Hero typography still animates');
    await move(0);
    await move(700);
    assert.equal(await hidden(), true, 'Downward scrolling hides navigation');
    await move(698);
    assert.equal(await hidden(), true, 'Tiny reversal does not flicker navigation');
    await move(675);
    assert.equal(await hidden(), false, 'Intentional upward scrolling reveals navigation');
    await move(678);
    assert.equal(await hidden(), false, 'Tiny downward movement keeps navigation visible');
    await move(740);
    assert.equal(await hidden(), true);
    await move(0);
    assert.equal(await hidden(), false);
    if (mobile) {
      await page.locator('.nav-burger').click();
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
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
      await page.evaluate(route => window.__nav(route), route);
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
