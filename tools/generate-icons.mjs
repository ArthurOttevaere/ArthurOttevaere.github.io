// =============================================================================
//  generate-icons.mjs  —  Build the favicon / touch-icon files
// =============================================================================
//
//  Writes real icon FILES (not an inline data-URI) because Safari renders and
//  caches data-URI SVG favicons unreliably. Outputs:
//      favicon.svg            — modern SVG favicon (rounded blue "a." tile)
//      favicon-32.png         — 32×32 raster fallback (older browsers)
//      apple-touch-icon.png   — 180×180 full-bleed (iOS home screen / Safari)
//
//  HOW TO RUN
//      node tools/generate-icons.mjs      (or: npm run icons)
//
//  Needs Playwright's chromium (npm install pulls it in).
// =============================================================================

import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const ACCENT = '#2563eb';

// The "a." monogram in white, placed + scaled to sit centred on a 100×100 tile.
const MARK =
  '<g transform="translate(-1.782,-12.095) scale(0.29217)" fill="#fff">' +
    '<g transform="matrix(1,0,0,1,59,17)">' +
      '<path transform="translate(0.817517,276.85898)" d="M 85.203125 -166.125 C 98.578125 -166.125 110.195312 -164.050781 120.0625 -159.90625 C 129.9375 -155.757812 137.570312 -149.507812 142.96875 -141.15625 C 148.363281 -132.8125 151.0625 -122.414062 151.0625 -109.96875 L 151.0625 0 L 109.96875 0 L 109.96875 -16.875 C 100.195312 -9.039062 91.066406 -3.691406 82.578125 -0.828125 C 74.097656 2.023438 66.03125 3.453125 58.375 3.453125 C 48.132812 3.453125 39.234375 1.652344 31.671875 -1.9375 C 24.109375 -5.53125 18.253906 -10.738281 14.109375 -17.5625 C 9.960938 -24.382812 7.890625 -32.59375 7.890625 -42.1875 C 7.890625 -50.125 9.316406 -57.066406 12.171875 -63.015625 C 15.035156 -68.960938 19.046875 -74.144531 24.203125 -78.5625 C 29.367188 -82.988281 35.457031 -86.816406 42.46875 -90.046875 C 49.476562 -93.273438 57.085938 -96.046875 65.296875 -98.359375 L 109.96875 -111.078125 C 109.601562 -117.628906 107.132812 -122.632812 102.5625 -126.09375 C 98 -129.550781 91.753906 -131.28125 83.828125 -131.28125 C 77.648438 -131.28125 71.351562 -130.3125 64.9375 -128.375 C 58.53125 -126.4375 52.375 -123.804688 46.46875 -120.484375 C 40.570312 -117.160156 35.363281 -113.378906 30.84375 -109.140625 L 10.921875 -139.984375 C 22.171875 -149.117188 34.160156 -155.757812 46.890625 -159.90625 C 59.617188 -164.050781 72.390625 -166.125 85.203125 -166.125 Z M 71.9375 -29.46875 C 78.382812 -29.46875 84.789062 -31.101562 91.15625 -34.375 C 97.519531 -37.644531 103.789062 -41.957031 109.96875 -47.3125 L 109.96875 -77.734375 L 76.359375 -66.953125 C 68.796875 -64.554688 63.171875 -61.789062 59.484375 -58.65625 C 55.796875 -55.519531 53.953125 -51.226562 53.953125 -45.78125 C 53.953125 -40.707031 55.539062 -36.71875 58.71875 -33.8125 C 61.90625 -30.914062 66.3125 -29.46875 71.9375 -29.46875 Z"/>' +
      '<path transform="translate(149.319859,276.85898)" d="M 28.5 0 L 28.5 -50.359375 L 78.4375 -50.359375 L 78.4375 0 Z"/>' +
    '</g>' +
  '</g>';

// rx = corner radius (22 = rounded tile for the tab favicon; 0 = full-bleed for
// apple-touch, since iOS applies its own rounded mask).
const tile = (rx) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" rx="${rx}" fill="${ACCENT}"/>${MARK}</svg>`;

const browser = await chromium.launch();
try {
  // Modern SVG favicon — a real file, referenced with type="image/svg+xml".
  await writeFile(path.join(root, 'favicon.svg'), tile(22) + '\n');

  // Raster the PNG variants (render big, downscale for crisp edges).
  async function png(svg, size, file) {
    const scale = 4;
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: scale });
    await page.setContent(
      `<body style="margin:0"><div style="width:${size}px;height:${size}px">` +
      svg.replace('<svg ', `<svg width="${size}" height="${size}" `) +
      `</div></body>`);
    const hi = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: size, height: size } });
    await page.close();

    const shot = await browser.newPage({ viewport: { width: size, height: size } });
    await shot.setContent(`<body style="margin:0"><canvas id="c" width="${size}" height="${size}"></canvas></body>`);
    const dataUrl = await shot.evaluate(async ({ b64, s }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.getElementById('c'), ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, s, s);
      return c.toDataURL('image/png');
    }, { b64: hi.toString('base64'), s: size });
    await shot.close();
    await writeFile(path.join(root, file), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('✓ Wrote', file, `(${size}×${size})`);
  }

  await png(tile(22), 32, 'favicon-32.png');
  await png(tile(0), 180, 'apple-touch-icon.png');
  console.log('✓ Wrote favicon.svg');
} finally {
  await browser.close();
}
