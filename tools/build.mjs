/* =================================================================
   build.mjs — compiles the site and writes its share pages.

   WHAT IT DOES
     1. bundles src/*.jsx into dist/app.js (minified, no in-browser Babel);
     2. writes one small HTML file per address — /work/, /work/<id>/,
        /about/, /contact/, 404.html — each a copy of index.html with its
        own <title>, description and preview image, so a link shared in
        iMessage, WhatsApp or LinkedIn shows the right thing;
     3. regenerates sitemap.xml.

   HOW THE JSX FILES TALK TO EACH OTHER: they don't use ES imports, they
   share globals (window.Icon, window.PROFILE, …). Each file is therefore
   transpiled on its own and wrapped in an IIFE: collisions are avoided
   (each `const` stays file-local) while the window.* assignments and the
   bare cross-file references still resolve at runtime. Load order is
   preserved, exactly like the old <script> tags.

   USAGE
     npm run build      one-off build
     npm run watch      rebuild on save (dev)

   After editing anything in src/*.jsx, run `npm run build` and commit the
   updated dist/app.js. Editing data.js needs NO rebuild for the site to
   show the change — only the per-project share pages are generated here,
   so run the build again after adding or renaming a project.
   ================================================================= */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';

const SITE = 'https://arthurottevaere.github.io';

// Load order matters: the toolbox first, the shell last.
const FILES = [
  'src/icons.jsx',
  'src/covers.jsx',
  'src/lib.jsx',
  'src/home.jsx',
  'src/work.jsx',
  'src/about.jsx',
  'src/outside.jsx',
  'src/contact.jsx',
  'src/app.jsx',
];

const XFORM = {
  loader: 'jsx',
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  minify: true,
  target: 'es2019',
  legalComments: 'none',
};

/* ── 1 · the bundle ─────────────────────────────────────────────── */
async function bundle(){
  const parts = [];
  for (const file of FILES){
    const src = await readFile(file, 'utf8');
    const { code } = await transform(src, { ...XFORM, sourcefile: file });
    parts.push(`/* ${file} */\n(function(){\n${code}\n})();`);
  }
  const banner = '/* Bundled by tools/build.mjs — DO NOT EDIT. Edit src/*.jsx then run `npm run build`. */\n';
  const out = banner + parts.join('\n');
  await mkdir('dist', { recursive: true });
  await writeFile('dist/app.js', out);
  console.log(`✓ dist/app.js (${(out.length / 1024).toFixed(1)} KB)`);
}

/* ── 2 · the share pages ────────────────────────────────────────── */
// data.js is a plain browser script; run it in a sandbox to read its content.
async function loadData(){
  const code = await readFile('data.js', 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return ctx.window.PORTFOLIO_DATA || {};
}

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trim = (s, n) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, n - 1).replace(/[\s,.;:—-]+\S*$/, '') + '…';
};

function metaBlock({ title, description, path, image, imageAlt, type, noindex }){
  const url = SITE + path;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}"/>`,
    noindex ? `<meta name="robots" content="noindex"/>` : `<link rel="canonical" href="${esc(url)}"/>`,
    `<meta property="og:type" content="${esc(type || 'website')}"/>`,
    `<meta property="og:url" content="${esc(url)}"/>`,
    `<meta property="og:title" content="${esc(title)}"/>`,
    `<meta property="og:description" content="${esc(description)}"/>`,
    `<meta property="og:image" content="${esc(image)}"/>`,
    `<meta property="og:image:type" content="image/jpeg"/>`,
    `<meta property="og:image:width" content="1200"/>`,
    `<meta property="og:image:height" content="630"/>`,
    `<meta property="og:image:alt" content="${esc(imageAlt || title)}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${esc(title)}"/>`,
    `<meta name="twitter:description" content="${esc(description)}"/>`,
    `<meta name="twitter:image" content="${esc(image)}"/>`,
  ].join('\n');
}

// The opening marker in index.html carries a note after it, so match the
// marker itself and not a bare `<!-- META:START -->` — spelling it exactly is
// what silently turned every generated page into a copy of the home page.
const META_BLOCK = /<!-- META:START[\s\S]*?<!-- META:END -->/;

async function writePage(template, outPath, meta){
  if (!META_BLOCK.test(template)) throw new Error('index.html: no META:START … META:END block to fill');
  const html = template.replace(
    META_BLOCK,
    '<!-- META:START — generated by tools/build.mjs, do not edit here -->\n' + metaBlock(meta) + '\n<!-- META:END -->'
  );
  const dir = outPath.split('/').slice(0, -1).join('/');
  if (dir) await mkdir(dir, { recursive: true });
  await writeFile(outPath, html);
}

async function pages(){
  const D = await loadData();
  const P = D.profile || {};
  const projects = D.projects || [];
  const copy = D.copy || {};
  const name = P.name || 'Arthur Ottevaere';
  const template = await readFile('index.html', 'utf8');
  const siteImage = SITE + '/assets/og/site.jpg?v=2';

  // A project's preview: its generated card if `npm run og` has been run,
  // otherwise its cover image, otherwise the site card.
  const imageFor = p => {
    if (existsSync(`assets/og/${p.id}.jpg`)) return `${SITE}/assets/og/${p.id}.jpg?v=2`;
    if (p.cover && p.cover.startsWith('/'))  return SITE + p.cover;
    if (p.cover && /^https?:/.test(p.cover)) return p.cover;
    return siteImage;
  };

  const bio = Array.isArray(P.bio) ? P.bio[0] : '';
  const list = [
    { out: 'work/index.html', meta: {
      title: 'Projects · ' + name, path: '/work/',
      description: trim(copy.workLede || 'A mix of coursework and weekend builds — dashboards, models, optimisation and the occasional Formula 1 side project.', 180),
      image: siteImage, imageAlt: name + ' — projects' } },
    { out: 'about/index.html', meta: {
      title: 'About · ' + name, path: '/about/',
      description: trim(bio || 'Business Engineering student in Business Analytics.', 180),
      image: siteImage, imageAlt: 'About ' + name } },
    { out: 'outside/index.html', meta: {
      title: 'Outside · ' + name, path: '/outside/',
      description: trim(copy.outsideLede || "Away from the spreadsheets — the races I've run and the places I've been.", 180),
      image: siteImage, imageAlt: name + ' — outside the portfolio' } },
    { out: 'contact/index.html', meta: {
      title: 'Contact · ' + name, path: '/contact/',
      description: trim(copy.contactLede || 'Internships, freelance, coffee chats — all welcome. Usually reply within a day.', 180),
      image: siteImage, imageAlt: 'Contact ' + name } },
    { out: '404.html', meta: {
      title: 'Not found · ' + name, path: '/404',
      description: 'That link does not point at anything on this site.',
      image: siteImage, noindex: true } },
  ];

  for (const p of projects){
    if (!p || !p.id) continue;
    list.push({ out: `work/${p.id}/index.html`, meta: {
      title: p.title + ' · ' + name,
      path: `/work/${p.id}/`,
      description: trim(p.summary || p.long || '', 200),
      image: imageFor(p),
      imageAlt: p.title,
      type: 'article',
    }});
  }

  for (const item of list) await writePage(template, item.out, item.meta);
  console.log(`✓ ${list.length} share pages (work, about, outside, contact, 404, ${projects.length} projects)`);

  // sitemap
  const today = new Date().toISOString().slice(0, 10);
  const urls = ['/', '/work/', '/about/', '/outside/', '/contact/'].concat(projects.map(p => `/work/${p.id}/`));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')
    + '\n</urlset>\n';
  await writeFile('sitemap.xml', xml);
  console.log(`✓ sitemap.xml (${urls.length} urls)`);
}

// Version local scripts and styles by their bytes so deployments cannot mix
// a new page with a cached bundle or stylesheet from an earlier release.
async function versionAssets(){
  let html = await readFile('index.html', 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="(\/(?!\/)[^"?]+\.(?:js|css))(?:\?[^" ]*)?"/g)];
  for (const match of refs){
    const bytes = await readFile(match[1].slice(1));
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    html = html.replace(match[0], match[0].split('=')[0] + '="' + match[1] + '?v=' + hash + '"');
  }
  await writeFile('index.html', html);
}

/* ── 3 · the map's freshness ────────────────────────────────────
   assets/map/world.js is generated separately, from the country list
   in data.js. Adding a country there and forgetting `npm run map`
   would drop it from the map silently — the page would simply not
   draw a shape it cannot find. So say so here, where it is noticed. */
async function checkMap(D){
  const wanted = (((D.profile || {}).outside || {}).countries || [])
    .map(c => (typeof c === 'string' ? c : c && c.name)).filter(Boolean);
  if (!wanted.length) return;

  if (!existsSync('assets/map/world.js')){
    console.warn('⚠ assets/map/world.js is missing — run `npm run map`');
    return;
  }
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(await readFile('assets/map/world.js', 'utf8'), ctx);
  const drawn = (ctx.window.WORLD_MAP || {}).shapes || {};
  const missing = wanted.filter(n => !drawn[n]);
  if (missing.length) console.warn(`⚠ the map has no shape for ${missing.join(', ')} — run \`npm run map\``);
  else console.log(`✓ map covers all ${wanted.length} countries`);
}

export async function build(){
  await bundle();
  await versionAssets();
  await pages();
  await checkMap(await loadData());
}

build().catch(err => { console.error(err); process.exit(1); });
