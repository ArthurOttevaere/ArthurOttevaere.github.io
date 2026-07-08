// =============================================================================
//  generate-og.mjs  —  Build the social "link preview" image (Open Graph image)
// =============================================================================
//
//  WHAT THIS IS
//  ------------
//  When you paste your site link into iMessage, WhatsApp, LinkedIn, Discord, …
//  those apps show a preview card with an image. That image is
//      assets/images/og-image.jpg
//  and this script renders it from tools/og-template.html using a headless
//  browser — so it uses the *real* "a." logo and the site's own Geist fonts,
//  and looks pixel-identical to the site.
//
//  HOW TO RUN
//  ----------
//      node tools/generate-og.mjs
//
//  Needs Playwright's chromium (already used by this repo's tooling). If it's
//  missing:  npx playwright install chromium
//
//  WANT A COMPLETELY CUSTOM IMAGE INSTEAD?
//  --------------------------------------
//  You can ignore this script and just drop your own 1200×630 PNG/JPG at
//  assets/images/og-image.jpg. To tweak text/colours, edit og-template.html.
//
//  NOTE: messaging apps cache previews per-URL. After deploying a new image an
//  old preview can stick around — bump the ?v= number on the og:image URL in
//  index.html, or use LinkedIn's Post Inspector to force a refresh.
// =============================================================================

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const W = 1200, H = 630, SCALE = 2;   // render at 2× then downscale for crisp text
const here = path.dirname(fileURLToPath(import.meta.url));
const template = pathToFileURL(path.join(here, 'og-template.html')).href;
// JPEG keeps the file ~60 KB (vs ~420 KB as PNG) — small enough that WhatsApp /
// iMessage reliably fetch it, and visually identical at preview size.
const output = path.join(here, '..', 'assets', 'images', 'og-image.jpg');

const browser = await chromium.launch();
try {
  // 1. Render the template at 2× resolution.
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  await page.goto(template, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const hi = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });

  // 2. Downscale the 2× shot to an exact 1200×630 JPEG (crisper than a 1× render).
  const shot = await browser.newPage({ viewport: { width: W, height: H } });
  await shot.setContent('<body style="margin:0"><canvas id="c" width="' + W + '" height="' + H + '"></canvas></body>');
  const dataUrl = await shot.evaluate(async ({ b64, w, h }) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#ffffff';               // flatten (JPEG has no alpha)
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return c.toDataURL('image/jpeg', 0.92);
  }, { b64: hi.toString('base64'), w: W, h: H });

  const { writeFile } = await import('fs/promises');
  await writeFile(output, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('✓ Wrote', path.normalize(output), `(${W}x${H})`);
} finally {
  await browser.close();
}
