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
    // The scale on the disc that lives inside the projects heading. The
    // overlay lets go of the last 56px of the collapse and that disc — its
    // own compositing layer, travelling with the page — finishes it, because
    // a fixed overlay both lags a touch scroll and smears when it is
    // repainted that small while the page moves. 0 means it is off.
    const catchAt = () => page.locator('#featured-dot').evaluate(el =>
      parseFloat(el.style.getPropertyValue('--catch') || '0') || 0);
    for (const y of [400, 1000, end - 50, end + 30, end - 50, 1000, 400, 0]) {
      const scene = await sceneAt(y);
      const scale = await catchAt();
      assert.ok(Math.abs(scene.y) < 1 && Math.abs(scene.x) < 1, 'Circle overlay stays anchored to viewport while scrolling');
      assert.equal(scene.height, 900, 'Circle overlay uses viewport height, not document height');
      assert.equal(scene.width, scene.viewport);
      if (y <= 162 || y >= end) {
        assert.equal(scene.visible, false, 'Circle is gone outside the scene');
        assert.equal(scale, 0, 'Nothing is drawn around the dot outside the scene');
      } else {
        assert.ok(scene.visible || scale > 0, 'Either the overlay or the disc is carrying the collapse');
      }
      if (y === 400) assert.ok(scene.radius > 10 && scene.radius < 900, 'Circle is partially expanded');
      if (y === 1000) assert.ok(scene.radius > scene.viewport / 2, 'Circle expands to cover the intro');
      if (y === end - 50) {
        assert.equal(scene.visible, false, 'The overlay hands the end of the collapse to the disc');
        assert.ok(scale > 0 && scale <= 1, 'The disc draws the last of the orange, never upscaled');
      }
      if (scene.visible && y > 1000) {
        assert.ok(scene.radius >= 50, 'The overlay never shrinks to dot size — that is what smeared');
      }
    }
    await page.evaluate(() => window.__nav('/work/'));
    await page.waitForTimeout(400);
    if (!mobile) {
      // the selection is the width axis: the active tab widens through
      // in-between values (it eases, it does not snap) and ends fully wide
      for (const route of ['/contact/', '/about/', '/work/']) {
        const { samples, end } = await page.evaluate(async to => {
          const link = document.querySelector(`.nav-link[href="${to}"]`);
          const wdth = () => parseFloat((getComputedStyle(link).fontVariationSettings.match(/"wdth"\s+([\d.]+)/) || [])[1] || 100);
          link.click();
          const samples = [];
          const began = performance.now();
          await new Promise(resolve => {
            function frame(now) {
              samples.push(wdth());
              if (now - began < 700) requestAnimationFrame(frame); else resolve();
            }
            requestAnimationFrame(frame);
          });
          return { samples, end: wdth() };
        }, route);
        assert.ok(samples.some(w => w > 74 && w < 123), 'The active tab widens through in-between values');
        assert.ok(Math.abs(end - 125) < .5, 'The active tab ends fully wide');
      }
    }
    await page.evaluate(() => window.__nav('/'));
    await page.waitForSelector('.veil', { state: 'attached' });
    assert.equal((await sceneAt(1000)).y, 0, 'Returning home also preserves the viewport anchor');
    await page.screenshot({ path: `/tmp/hero-fixed-${mobile ? 'mobile' : 'desktop'}.png` });
    assert.deepEqual(errors, []);
    console.log(`${mobile ? 'Mobile' : 'Desktop'}: hero viewport anchoring, circle phases, reverse scrolling and return-home passed${mobile ? '' : '; nav width-axis selection passed'}`);
    await page.close();
  }
} finally { await browser.close(); }
