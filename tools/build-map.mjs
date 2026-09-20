/* =================================================================
   build-map.mjs — draws the world once, so the browser never has to.

   WHY
     The Outside page shows the countries I've been to. Doing that
     honestly needs real borders, and real borders are a 107 KB
     TopoJSON of quantised integer deltas — not something to ship to
     a phone and decode at runtime just to paint eighteen shapes.

   WHAT IT DOES
     Reads tools/data/world-110m.json (Natural Earth 1:110m, public
     domain, via the world-atlas package), decodes the arcs, projects
     every ring through Robinson, and writes assets/map/world.js:

       window.WORLD_MAP = {
         w, h,                       the viewBox
         land:   "M…",               every country, one path
         shapes: { Belgium: "M…" },  only the ones visited
         areas:  { Belgium: 31 },    px², so the page can stack the
                                     small ones above the large ones
       }

     Only the visited countries get their own path, so the file stays
     small. That list comes from data.js — which means this has to be
     re-run when a country is added there. `npm run build` says so if
     it notices a country with no shape.

   USAGE
     npm run map

   PROJECTION
     Robinson. Not equal-area and not conformal — a compromise chosen
     because it is what an atlas looks like, and this page is printed
     furniture, not a GIS readout. Antarctica is dropped: it is a
     cartographic convention here, not an oversight.
   ================================================================= */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';

const SRC = 'tools/data/world-110m.json';
const OUT = 'assets/map/world.js';

const WIDTH = 1000;        // viewBox width; everything else follows from it
const MIN_AREA = 1.6;      // drop a background ring smaller than this many px²
const MIN_AREA_ON = 0.15;  // …but keep a visited country almost whatever its size
const EPS = 0.28;          // Douglas–Peucker tolerance, in px. Low, because the
                           // map is drawn as line work and a coastline that has
                           // been flattened into polygons shows immediately.

/* Natural Earth counts the overseas departments as France, so France's
   geometry includes French Guiana — which lights up South America on a map
   of where someone has been. For the countries listed here, only the rings
   whose centre falls inside the box are drawn as *visited*; the background
   land layer is never clipped, so French Guiana stays part of the world.
   [west, south, east, north], in degrees. One line per country that needs it. */
const CLIP = { 'France': [-20, 35, 20, 55] };
const PREC = 0;            // decimal places kept per coordinate

/* ── Robinson ──────────────────────────────────────────────────────
   The published table, at every 5° of latitude: AA is the length of
   the parallel relative to the equator, BB its distance from it.
   Between two rows we interpolate linearly — at 5° steps the kink
   that costs us is far below one pixel at this width. */
const AA = [1, .9986, .9954, .99, .9822, .973, .96, .9427, .9216, .8962,
            .8679, .835, .7986, .7597, .7186, .6732, .6213, .5722, .5322];
const BB = [0, .062, .124, .186, .248, .31, .372, .434, .4958, .5571,
            .6176, .6769, .7346, .7903, .8435, .8936, .9394, .9761, 1];

function robinson(lon, lat){
  const a = Math.min(Math.abs(lat), 90) / 5;
  const i = Math.min(17, Math.floor(a));
  const t = a - i;
  const aa = AA[i] + (AA[i + 1] - AA[i]) * t;
  const bb = BB[i] + (BB[i + 1] - BB[i]) * t;
  return [
    0.8487 * aa * (lon * Math.PI / 180),
    1.3523 * bb * (lat < 0 ? -1 : 1),
  ];
}

/* ── TopoJSON ──────────────────────────────────────────────────────
   Arcs are stored as quantised deltas against a shared transform.
   A geometry references them by index; a negative index means "that
   arc, backwards" — the encoding that lets two countries share one
   border without storing it twice. */
function decodeArcs(topo){
  const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;
  return topo.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * sx + tx, y * sy + ty];
    });
  });
}

function ringOf(arcs, indices){
  const pts = [];
  for (const idx of indices){
    const rev = idx < 0;
    const arc = arcs[rev ? ~idx : idx];
    const seq = rev ? arc.slice().reverse() : arc;
    // the first point repeats the previous arc's last one
    for (let i = pts.length ? 1 : 0; i < seq.length; i++) pts.push(seq[i]);
  }
  return pts;
}

function ringsOf(geom, arcs){
  let rings = [];
  if (geom.type === 'Polygon')      rings = geom.arcs.map(r => ringOf(arcs, r));
  if (geom.type === 'MultiPolygon') rings = geom.arcs.flatMap(p => p.map(r => ringOf(arcs, r)));
  return rings.flatMap(splitAtSeam);
}

/* ── The antimeridian ──────────────────────────────────────────────
   Russia and Fiji straddle ±180°. Projected naively, the step from
   +179 to −179 is drawn as a line all the way back across the map —
   a horizontal streak through the Pacific, and in Russia's case
   through its own fill. So cut every ring where it jumps more than
   180° of longitude, pin the cut to the edge it crossed, and let the
   pieces close along that edge: Chukotka ends up on the left of the
   map and the rest of Russia on the right, which is exactly where an
   atlas puts them. */
function splitAtSeam(ring){
  const cuts = [];
  for (let i = 1; i < ring.length; i++) if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) cuts.push(i);
  if (!cuts.length) return [ring];

  const pieces = [];
  let piece = [];
  for (let i = 0; i < ring.length; i++){
    if (cuts.includes(i)){
      const [x0, y0] = ring[i - 1], [x1, y1] = ring[i];
      const side = x0 > 0 ? 180 : -180;
      // unwrap the far point so the crossing latitude interpolates sanely
      const unwrapped = x1 + (x0 > 0 ? 360 : -360);
      const t = (side - x0) / (unwrapped - x0);
      const yc = y0 + (y1 - y0) * t;
      piece.push([side, yc]);
      pieces.push(piece);
      piece = [[-side, yc]];
    }
    piece.push(ring[i]);
  }
  // a ring is a loop: its tail belongs to whatever piece its head started
  if (pieces.length) pieces[0] = piece.concat(pieces[0]); else pieces.push(piece);
  return pieces.filter(p => p.length > 2);
}

/* ── Douglas–Peucker ───────────────────────────────────────────────
   Natural Earth's coastlines carry far more detail than a 1000px
   atlas can show. Dropping every point that sits within half a pixel
   of the line it lies on costs nothing visible and most of the file. */
function simplify(pts, eps){
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length){
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy);
    let far = -1, best = eps;
    for (let i = a + 1; i < b; i++){
      const [px, py] = pts[i];
      const d = len ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / len
                    : Math.hypot(px - ax, py - ay);
      if (d > best){ best = d; far = i; }
    }
    if (far > 0){ keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/* ── Geometry helpers ───────────────────────────────────────────── */
const signedArea = ring => {
  let a = 0;
  for (let i = 0, n = ring.length, j = n - 1; i < n; j = i++)
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return a / 2;
};

function centroid(ring){
  let a = 0, x = 0, y = 0;
  for (let i = 0, n = ring.length, j = n - 1; i < n; j = i++){
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    a += f;
    x += (ring[j][0] + ring[i][0]) * f;
    y += (ring[j][1] + ring[i][1]) * f;
  }
  a *= 3;
  return a ? [x / a, y / a] : ring[0];
}

/* ── data.js ───────────────────────────────────────────────────────
   Same trick build.mjs uses: the file is a plain assignment to
   window, so run it in a sandbox and read the object back out. */
async function visitedCountries(){
  const code = await readFile('data.js', 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  new vm.Script(code).runInContext(ctx);
  const out = (ctx.window.PORTFOLIO_DATA || {}).profile || {};
  const list = (out.outside || {}).countries || [];
  return list
    .map(c => (typeof c === 'string' ? { name: c } : c))
    .filter(c => c && c.name);
}

/* ── Build ─────────────────────────────────────────────────────── */
const round = n => +n.toFixed(PREC);
const toPath = rings => rings
  .map(r => 'M' + r.map(p => round(p[0]) + ' ' + round(p[1])).join('L') + 'Z')
  .join('');

async function main(){
  const topo = JSON.parse(await readFile(SRC, 'utf8'));
  const arcs = decodeArcs(topo);
  const geoms = topo.objects.countries.geometries
    .filter(g => g.properties.name !== 'Antarctica');

  // Project everything first, then size the viewBox to what we kept.
  const byName = new Map();
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const g of geoms){
    const name = g.properties.name;
    const box  = CLIP[name];
    const geo  = ringsOf(g, arcs);
    // decided in lon/lat, before the projection moves anything
    const own  = geo.map(r => {
      if (!box) return true;
      const [lon, lat] = centroid(r);
      return lon >= box[0] && lon <= box[2] && lat >= box[1] && lat <= box[3];
    });
    const rings = geo.map(r => r.map(([lon, lat]) => robinson(lon, lat)));
    for (const r of rings) for (const [x, y] of r){
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    byName.set(name, { rings, own });
  }

  const k = WIDTH / (maxX - minX);
  const HEIGHT = +((maxY - minY) * k).toFixed(1);
  // Robinson's y grows north; SVG's grows down.
  const place = ([x, y]) => [(x - minX) * k, (maxY - y) * k];

  const visited = await visitedCountries();
  const onMap = new Map(visited.map(c => [c.name, c]));
  const shapes = {}, areas = {}, missing = [];
  const landRings = [];

  for (const [name, entry] of byName){
    const screen = entry.rings.map(r => simplify(r.map(place), EPS));
    landRings.push(...screen.filter(r => r.length > 2 && Math.abs(signedArea(r)) >= MIN_AREA));
    const here = onMap.get(name);
    if (!here) continue;

    // A visited country keeps rings the background layer would drop —
    // Luxembourg is barely two pixels wide and still has to be there.
    const own = screen.filter((r, i) => entry.own[i] && r.length > 2 && Math.abs(signedArea(r)) >= MIN_AREA_ON);
    if (!own.length) continue;
    shapes[name] = toPath(own);
    // the page draws the largest first, so a small country is never buried
    // under a big neighbour's pointer target
    areas[name] = +own.reduce((sum, r) => sum + Math.abs(signedArea(r)), 0).toFixed(1);
  }
  for (const c of visited) if (!shapes[c.name]) missing.push(c.name);

  const body = 'window.WORLD_MAP = ' + JSON.stringify({
    w: WIDTH, h: HEIGHT,
    land: toPath(landRings),
    shapes, areas,
  }) + ';\n';

  await mkdir('assets/map', { recursive: true });
  await writeFile(OUT, '/* generated by tools/build-map.mjs — do not edit.\n'
    + '   Natural Earth 1:110m (public domain) via world-atlas. */\n' + body);

  const kb = (Buffer.byteLength(body) / 1024).toFixed(1);
  console.log(`✓ ${OUT} — ${WIDTH}×${HEIGHT}, ${Object.keys(shapes).length} countries drawn, ${kb} KB`);
  if (missing.length) console.warn(`⚠ no shape for: ${missing.join(', ')} — check the spelling against Natural Earth`);
}

main().catch(err => { console.error(err); process.exit(1); });
