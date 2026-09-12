// =============================================================================
//  generate-icons.mjs — the favicon / touch-icon files
// =============================================================================
//
//  Writes real icon FILES (not an inline data-URI) because Safari renders and
//  caches data-URI SVG favicons unreliably. Outputs into assets/icons/:
//      favicon.svg            modern SVG favicon (orange tile, the "a." mark)
//      favicon-32.png         32×32 raster fallback
//      apple-touch-icon.png   180×180 full-bleed (iOS home screen)
//
//  The mark is the same outline the site uses (Archivo, width 125 / weight
//  900) — see Icon.Logo in src/icons.jsx. On the icon it is set in ink on the
//  signature orange, i.e. the boot splash held still: that orange square is
//  what a tab, a bookmark bar and an iOS home screen recognise the site by.
//
//  HOW TO RUN
//      npm run icons
// =============================================================================

import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, '..', 'assets', 'icons');

const INK = '#101014', ACCENT = '#FF4A12';
const GLYPH = 'M240 552Q189 552 145 545Q101 538 68.5 520.5Q36 503 18 472.5Q0 442 0 394Q0 331 33.5 294.5Q67 258 129 240.5Q191 223 276.5 218Q362 213 467 213V202Q467 175 453 158.5Q439 142 413.5 134.5Q388 127 353 127Q332 127 306 130.5Q280 134 261 143.5Q242 153 242 172V176H14Q13 172 13 169.5Q13 167 13 163Q13 116 52.5 79Q92 42 170 21Q248 0 362 0Q467 0 540.5 17.5Q614 35 652.5 73Q691 111 691 175V372Q691 388 699 399.5Q707 411 723 411H778V532Q760 539 725.5 545.5Q691 552 653 552Q599 552 565 542.5Q531 533 513 517Q495 501 487 482H479Q450 503 414.5 519Q379 535 336 543.5Q293 552 240 552ZM307 426Q322 426 348 422.5Q374 419 401.5 410Q429 401 448 386Q467 371 467 347V314Q380 314 325.5 322.5Q271 331 246 346Q221 361 221 382Q221 401 233.5 410.5Q246 420 266 423Q286 426 307 426Z';

// The mark, scaled to sit centred on a 100×100 tile (logo box is 1098×552).
const S = 84 / 1098;
const MARK =
  `<g transform="translate(8,${(100 - 552 * S) / 2}) scale(${S.toFixed(5)})">` +
    `<path d="${GLYPH}" fill="${INK}"/>` +
    `<circle cx="963" cy="405" r="135" fill="${INK}"/>` +
  `</g>`;

const tile = rx =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
  `<rect width="100" height="100" rx="${rx}" fill="${ACCENT}"/>${MARK}</svg>`;

const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
try {
  await writeFile(path.join(outDir, 'favicon.svg'), tile(22) + '\n');

  async function png(svg, size, file){
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 4 });
    await page.setContent(`<body style="margin:0"><div style="width:${size}px;height:${size}px">` +
      svg.replace('<svg ', `<svg width="${size}" height="${size}" `) + `</div></body>`);
    // omitBackground, or the rounded corners come back filled white — which
    // shows as four white notches on a dark tab strip.
    const hi = await page.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
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
    await writeFile(path.join(outDir, file), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log(`✓ ${file} (${size}×${size})`);
  }

  await png(tile(22), 32, 'favicon-32.png');
  await png(tile(0), 180, 'apple-touch-icon.png');
  console.log('✓ favicon.svg');
} finally {
  await browser.close();
}
