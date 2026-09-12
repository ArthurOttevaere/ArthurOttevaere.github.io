// =============================================================================
//  generate-og.mjs — the images people see when a link is shared
// =============================================================================
//
//  WHAT THIS IS
//  ------------
//  Paste a link in iMessage, WhatsApp or LinkedIn and it shows a preview card.
//  This renders those cards from tools/og-template.html with a real browser, so
//  they use the site's own type and colours:
//
//      assets/og/site.jpg      the site card (home, work, about, contact)
//      assets/og/<id>.jpg      one per project — its title and its cover
//
//  HOW TO RUN
//      npm run og          (then npm run build, so the pages point at them)
//
//  Needs a Chromium: Playwright's own (npx playwright install chromium) or the
//  Google Chrome already on the machine — it tries both.
//
//  NOTE: messaging apps cache previews per URL. After deploying new images,
//  bump the ?v= number in tools/build.mjs (search `?v=` in imageFor/siteImage),
//  then run npm run build — otherwise WhatsApp and LinkedIn keep the old card.
// =============================================================================

import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const W = 1200, H = 630, SCALE = 2;
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const template = pathToFileURL(path.join(here, 'og-template.html')).href;
const outDir = path.join(root, 'assets', 'og');

async function loadData(){
  const code = await readFile(path.join(root, 'data.js'), 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return ctx.window.PORTFOLIO_DATA || {};
}
const dateLabel = p => {
  const s = String(p.date || '').trim();
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(s)){
    const d = new Date(s.length === 7 ? s + '-01' : s);
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  return p.year || '';
};

async function launch(){
  try { return await chromium.launch(); }
  catch (e) { return await chromium.launch({ channel: 'chrome' }); }
}

const D = await loadData();
const P = D.profile || {};
const projects = D.projects || [];
await mkdir(outDir, { recursive: true });

const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  const shrink = await browser.newPage({ viewport: { width: W, height: H } });
  await shrink.setContent(`<body style="margin:0"><canvas id="c" width="${W}" height="${H}"></canvas></body>`);

  // Render at 2× then downscale to an exact 1200×630 JPEG — crisper text, and
  // ~90 KB instead of ~500 KB, which is what WhatsApp and iMessage will fetch.
  async function shoot(file){
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(180);
    const hi = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
    const dataUrl = await shrink.evaluate(async ({ b64, w, h }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.getElementById('c'), ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#FF4A12'; ctx.fillRect(0, 0, w, h);   // the card's own field, so no cream edge survives a rounding
      ctx.drawImage(img, 0, 0, w, h);
      // A flat field compresses to almost nothing, so we can afford a high
      // quality here — below ~.9 JPEG rings around black type on saturated
      // orange. Still well under the ~300 KB that chat apps will fetch.
      return c.toDataURL('image/jpeg', .92);
    }, { b64: hi.toString('base64'), w: W, h: H });
    await writeFile(path.join(outDir, file), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('✓ assets/og/' + file);
  }

  await page.goto(template, { waitUntil: 'networkidle' });

  // 1 · the site card
  const parts = String(P.name || 'Arthur Ottevaere').trim().split(/\s+/);
  await page.evaluate(o => window.setCard(o), {
    mode: 'site',
    first: parts.shift(),
    last: parts.join(' '),
    kicker: P.location || '',
    tagline: (P.role || 'Business Engineering — Analytics'),
    foot: 'Portfolio',
  });
  await shoot('site.jpg');

  // 2 · one card per project
  for (const p of projects){
    if (!p || !p.id) continue;
    const cover = p.cover && p.cover.startsWith('/') && existsSync(path.join(root, p.cover.slice(1)))
      ? pathToFileURL(path.join(root, p.cover.slice(1))).href
      : (p.cover && /^https?:/.test(p.cover) ? p.cover : '');
    const dash = String(p.title).split(/\s+[—–]\s+/);
    await page.evaluate(o => window.setCard(o), {
      mode: 'project',
      title: dash[0],
      subtitle: dash.length > 1 ? dash.slice(1).join(' — ') : (p.subtitle || ''),
      kicker: [p.cat, dateLabel(p)].filter(Boolean).join(' · '),
      tagline: P.name || 'Arthur Ottevaere',
      foot: 'arthurottevaere.github.io/work',
      image: cover,
    });
    if (cover) await page.evaluate(() => { const i = document.getElementById('shot'); return i && i.complete ? null : new Promise(r => { i.onload = r; i.onerror = r; }); });
    await shoot(p.id + '.jpg');
  }
} finally {
  await browser.close();
}
