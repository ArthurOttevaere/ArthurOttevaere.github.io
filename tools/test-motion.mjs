import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const base = process.env.TEST_URL || 'http://localhost:4173';
try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({
      viewport: { width: mobile ? 390 : 1440, height: 900 },
      isMobile: mobile, hasTouch: mobile,
    });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base);
    await page.waitForSelector('#boot', { state: 'detached' });
    async function sceneAt(y) {
      await page.evaluate(y => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y), y);
      await page.waitForTimeout(80);
      return page.locator('.veil').evaluate(el => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, viewport: innerWidth,
          radius: parseFloat(el.style.clipPath.slice(7)), visible: getComputedStyle(el).visibility === 'visible' };
      });
    }
    const end = await page.locator('#featured-dot').evaluate(el => {
      const r = el.getBoundingClientRect();
      return scrollY + r.top + r.height / 2 - innerHeight * .3;
    });
    for (const y of [400, 1000, end - 50, end + 30, end - 50, 1000, 400, 0]) {
      const scene = await sceneAt(y);
      assert.ok(Math.abs(scene.y) < 1 && Math.abs(scene.x) < 1, 'Circle overlay stays anchored to viewport while scrolling');
      assert.equal(scene.height, 900, 'Circle overlay uses viewport height, not document height');
      assert.equal(scene.width, scene.viewport);
      assert.equal(scene.visible, y > 162 && y < end, 'Circle opens, closes and reverses at the intended positions');
      if (y === 400) assert.ok(scene.radius > 10 && scene.radius < 900, 'Circle is partially expanded');
      if (y === 1000) assert.ok(scene.radius > scene.viewport / 2, 'Circle expands to cover the intro');
    }
    await page.evaluate(() => window.__nav('/work/'));
    await page.waitForTimeout(400);
    if (!mobile) {
      async function slide(to) {
        return page.evaluate(async to => {
          const pill = document.querySelector('.nav-active');
          const link = document.querySelector(`.nav-link[href="${to}"]`);
          const start = pill.getBoundingClientRect().x;
          const target = link.getBoundingClientRect().x;
          link.click();
          const samples = [];
          const began = performance.now();
          await new Promise(resolve => {
            function frame(now) {
              samples.push(pill.getBoundingClientRect().x);
              if (now - began < 400) requestAnimationFrame(frame); else resolve();
            }
            requestAnimationFrame(frame);
          });
          return { start, target, samples };
        }, to);
      }
      for (const route of ['/contact/', '/about/', '/work/']) {
        const { start, target, samples } = await slide(route);
        assert.ok(samples.some(x => x > Math.min(start, target) + 2 && x < Math.max(start, target) - 2), 'Pill visibly travels between tabs rather than jumping');
        assert.ok(Math.abs(samples.at(-1) - target) < 1, 'Pill lands on the active tab');
      }
    }
    await page.evaluate(() => window.__nav('/'));
    await page.waitForSelector('.veil', { state: 'attached' });
    assert.equal((await sceneAt(1000)).y, 0, 'Returning home also preserves the viewport anchor');
    await page.screenshot({ path: `/tmp/hero-fixed-${mobile ? 'mobile' : 'desktop'}.png` });
    assert.deepEqual(errors, []);
    console.log(`${mobile ? 'Mobile' : 'Desktop'}: hero viewport anchoring, circle phases, reverse scrolling and return-home passed${mobile ? '' : '; pill intermediate movement passed'}`);
    await page.close();
  }
} finally { await browser.close(); }
