// =============================================================================
//  world.jsx — the World page: a globe of where I've lived, studied, worked,
//  raced and been. Content comes from data.js (profile.world).
//
//  React draws the page once, as a skeleton; the globe itself is an imperative
//  engine (mountGlobe) that owns its SVG and the side panel's card. The
//  rotation redraws every path many times a second, which is exactly what
//  React state is not for. The engine returns a teardown, so leaving the page
//  stops its frame loop and lets go of every window listener.
//
//  The geography (d3-geo, topojson, Natural Earth) is NOT in the bundle: it
//  is fetched the first time this page opens — see tools/vendor-geo.mjs.
// =============================================================================

const { useState, useEffect, useRef } = React;

const WORLD = () => PROFILE().world || {};

/* The continent of each country, for the tally. Fragile in the safe
   direction: a country missing from this table is counted as "Elsewhere"
   rather than quietly put on the wrong continent. Add a line with a country. */
const W_CONTINENT = {
  'Austria':'Europe','Belgium':'Europe','Czechia':'Europe','France':'Europe','Germany':'Europe','Greece':'Europe',
  'Hungary':'Europe','Italy':'Europe','Luxembourg':'Europe','Netherlands':'Europe','Russia':'Europe','Slovenia':'Europe',
  'Spain':'Europe','Switzerland':'Europe','United Kingdom':'Europe','Portugal':'Europe','Norway':'Europe','Sweden':'Europe',
  'Denmark':'Europe','Poland':'Europe','Croatia':'Europe','Ireland':'Europe','Iceland':'Europe','Finland':'Europe',
  'Turkey':'Asia','Japan':'Asia','China':'Asia','Thailand':'Asia','Indonesia':'Asia','India':'Asia','Vietnam':'Asia',
  'Mexico':'America','United States of America':'America','Canada':'America','Brazil':'America','Argentina':'America',
  'Morocco':'Africa','Egypt':'Africa','South Africa':'Africa','Tunisia':'Africa','Australia':'Oceania','New Zealand':'Oceania',
};
/* Countries whose real shape would frame the wrong thing (overseas land, an
   antimeridian crossing): the camera frames this box instead.
   [[west, south], [east, north]]. W_GROUP is the smaller box used when the
   country is framed among others — European Russia, not Kamchatka. */
const W_FRAME = {
  'France':[[-5,42.2],[8.5,51.2]], 'United States of America':[[-125,24.5],[-67,49.5]],
  'Russia':[[27,41],[180,78]], 'Norway':[[4.5,57.8],[31,71.2]], 'Netherlands':[[3.3,50.7],[7.3,53.6]],
};
const W_GROUP = { 'Russia':[[28,43],[50,62]] };

const W_KINDS = [
  { id:'lived',   label:'Lived',   note:'Where home has been' },
  { id:'studied', label:'Studied', note:'Degrees and exchanges' },
  { id:'worked',  label:'Worked',  note:'Internships and jobs' },
  { id:'visited', label:'Visited', note:'Been there' },
];
const W_LABEL = { lived:'Lived', studied:'Studied', worked:'Worked', visited:'Visited', raced:'Raced' };
const STEP_S = 4.5;          // seconds per step of the journey

/* ── Loading the geography, once per visit ─────────────────────────────── */
let geoReady = null;
function loadGeo(){
  if (geoReady) return geoReady;
  const script = src => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  geoReady = (window.d3 && window.d3.geoOrthographic ? Promise.resolve() : script('/assets/vendor/geo.min.js'))
    .then(() => fetch('/assets/map/countries-110m.json'))
    .then(r => r.json())
    .catch(err => { geoReady = null; throw err; });
  return geoReady;
}
let hiRes = null;
const loadHiRes = () => hiRes || (hiRes = fetch('/assets/map/countries-50m.json').then(r => r.json()).catch(() => { hiRes = null; return null; }));

/* ── The page ──────────────────────────────────────────────────────────── */
function World(){
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  useReveals(ref, []);
  useEffect(() => {
    let off = null, dead = false;
    loadGeo().then(topo => { if (!dead && ref.current) off = mountGlobe(ref.current, WORLD(), topo); })
             .catch(() => { if (!dead) setFailed(true); });
    return () => { dead = true; if (off) off(); };
  }, []);

  return (
    <div className="page" ref={ref}>
      <section className="shell gl">
        <aside className="gl-side">
          <div className="gl-head">
            <h1 className="sr-only">Around the world</h1>
            <span className="eyebrow rv rv-fade">Around the world</span>
            <p className="gl-lede rv rv-up" style={{ '--d': '.08s' }}>
              {COPY('worldLede', "Where I grew up, studied and worked, and the places I've been. Turn it, or press play.")}
            </p>
          </div>

          <button className="gl-play rv rv-up" style={{ '--d': '.14s' }} type="button" data-act="play" disabled={failed}>
            <span className="gl-play-ic"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 0l11 6-11 6z"/></svg></span>
            Play the journey<span className="gl-play-t" data-slot="total"></span>
          </button>

          <section className="gl-card" data-slot="card" aria-live="polite"></section>

          <section className="gl-tally rv rv-up" style={{ '--d': '.2s' }} aria-label="Countries by continent">
            <p className="gl-tally-line"><b data-slot="nC">0</b> countries on <b data-slot="nK">0</b> continents<span className="gl-dot">.</span></p>
            <div className="gl-cbar" data-slot="cbar"></div>
            <ul className="gl-clist" data-slot="clist"></ul>
          </section>

          <div className="gl-legend-wrap rv rv-up" style={{ '--d': '.26s' }}>
            <ul className="gl-legend" data-slot="legend"></ul>
            <p className="gl-legend-hint">Tap a line to isolate it</p>
          </div>
        </aside>

        <div className="gl-stage-wrap rv rv-fade">
          <div className="gl-stage" data-slot="stage">
            <svg className="gl-sky" viewBox="-80 -80 960 960" aria-hidden="true"><g data-slot="sky"></g></svg>
            <svg className="gl-globe" data-slot="globe" viewBox="0 0 800 800" role="img"
                 aria-label="Globe showing the countries I have lived in, studied in, worked in and visited">
              <defs>
                <clipPath id="gl-lens"><circle cx="400" cy="400" r="292.5"/></clipPath>
                <path id="gl-arc-top"/><path id="gl-arc-bot"/>
              </defs>
              <g className="gl-ring" data-slot="ring"></g>
              {/* Zooming happens inside a fixed lens: the ring stays a frame. */}
              <g clipPath="url(#gl-lens)">
                <rect className="gl-sea" width="800" height="800"/>
                <g data-slot="lands"></g>
                <g data-slot="marks"></g>
                <g className="gl-pin" data-slot="pin" style={{ display: 'none' }}>
                  <circle className="gl-halo" r="6"/><circle r="4.5"/><text x="12" y="-10"></text>
                </g>
              </g>
              <circle className="gl-rim" cx="400" cy="400" r="292"/>
            </svg>
            <div className="gl-tip" data-slot="tip"></div>
            {failed ? <p className="gl-fail">The globe could not load. Check your connection and reload the page.</p> : null}
          </div>
          <div className="gl-under">
            <span className="gl-hint">Drag to turn · click a country</span>
            <div className="gl-ctrl">
              <button type="button" data-act="zoom-out" aria-label="Zoom out">−</button>
              <button type="button" data-act="zoom-in" aria-label="Zoom in">+</button>
              <button type="button" data-act="zoom-reset" aria-label="Back to the whole globe">○</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =============================================================================
   The engine. Everything below is plain DOM: it reads the data once, builds
   the SVG, and redraws only on frames where something moved.
   ============================================================================= */
function mountGlobe(root, W, topo){
  const d3 = window.d3, topojson = window.topojson;
  const slot = n => root.querySelector('[data-slot="' + n + '"]');
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs || {}) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const reduced = reduceMotion();
  const offs = [];
  const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); offs.push(() => target.removeEventListener(type, fn, opts)); };

  const PLACES = W.places || {}, VISITED = W.visited || [], RACES = (W.races || []).filter(r => r && r.at), TOUR = (W.tour || []).filter(Boolean);
  const C = 400, R = 292, KMAX = 60;
  const proj = d3.geoOrthographic().translate([C, C]).clipAngle(90).precision(.25);
  const path = d3.geoPath(proj);
  const state = { rot:[-15, -38, 0], k:1, sel:null, filter:null, spin:!reduced, pinAt:null };
  let dirty = true, flying = null, raf = 0, dead = false;

  const kindOf = n => PLACES[n] ? PLACES[n].as : (VISITED.includes(n) ? 'visited' : null);
  const tagsOf = n => { const p = PLACES[n]; if (!p) return VISITED.includes(n) ? ['visited'] : []; return [...new Set([p.as].concat((p.items || []).map(i => i.tag)))]; };
  const allNames = () => Object.keys(PLACES).concat(VISITED.filter(n => !PLACES[n]));
  const nice = n => n === 'United States of America' ? 'United States' : n;
  const contOf = n => W_CONTINENT[n] || 'Elsewhere';
  const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

  const card = slot('card'), svg = slot('globe'), stage = slot('stage'), tip = slot('tip');

  /* ── countries ─────────────────────────────────────────────── */
  const lands = [], byName = new Map();
  let hiOn = false;
  {
    const feats = topojson.feature(topo, topo.objects.countries).features.filter(f => f.properties.name !== 'Antarctica');
    feats.sort((a, b) => (!!kindOf(a.properties.name)) - (!!kindOf(b.properties.name)));
    const g = slot('lands');
    for (const f of feats){
      const name = f.properties.name, k = kindOf(name);
      const e = el('path', { class:'gl-land' + (k ? ' v k-' + k : '') }, g);
      const L = Object.assign({ name, el:e, lo:f, hi:null }, reach(f)); e.__L = L;
      lands.push(L); byName.set(name, L);
    }
    allNames().forEach(n => { if (!byName.has(n)) console.warn('[world] Natural Earth has no country called "' + n + '" — check the spelling in data.js'); });
  }
  /* A cheap bounding cap for culling: centre + angular radius. Shapes that
     cross the antimeridian or spread wide simply never get culled. */
  function reach(f){
    const b = d3.geoBounds(f);
    if (b[0][0] > b[1][0] || b[1][0] - b[0][0] > 150) return { c:[0, 0], r:Math.PI };
    const c = [(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2];
    return { c, r: Math.max(d3.geoDistance(c, b[0]), d3.geoDistance(c, b[1]), d3.geoDistance(c, [b[0][0], b[1][1]]), d3.geoDistance(c, [b[1][0], b[0][1]])) };
  }
  function wantHiRes(){
    if (hiOn) return; hiOn = true;
    loadHiRes().then(t => {
      if (!t || dead) return;
      for (const f of topojson.feature(t, t.objects.countries).features){ const L = byName.get(f.properties.name); if (L) L.hi = f; }
      dirty = true;
    });
  }

  /* ── the sky: a star chart, not a nebula ───────────────────────
     Seeded points (the same sky on every visit), kept clear of the globe
     and its title, and four constellations in the corners. */
  {
    const g = slot('sky');
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0, n = 0; i < 900 && n < 170; i++){
      const x = -80 + rnd() * 960, y = -80 + rnd() * 960;
      if (Math.hypot(x - C, y - C) <= R + 92) continue; n++;
      const big = rnd() > .9;
      el('circle', { class:'gl-st' + (rnd() > .8 ? ' tw' : ''), cx:x.toFixed(1), cy:y.toFixed(1), r: big ? 1.5 : (.5 + rnd() * .6),
        opacity:(big ? .45 : .12 + rnd() * .22).toFixed(2), style:'animation-delay:' + (-rnd() * 4).toFixed(2) + 's' }, g);
    }
    const CONST = [
      ['Cassiopeia', [24, 92], [[24,46],[52,70],[80,50],[106,74],[134,40]], [[0,1],[1,2],[2,3],[3,4]]],
      ['Ursa Major', [652, 92], [[640,30],[672,38],[700,52],[730,60],[738,94],[780,98],[786,62]], [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]]],
      ['Orion', [22, 788], [[34,680],[86,688],[52,722],[64,726],[76,730],[38,764],[90,770]], [[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]]],
      ['Cygnus', [700, 788], [[740,672],[740,716],[740,764],[700,708],[780,724]], [[0,1],[1,2],[3,1],[1,4]]],
    ];
    for (const [name, at, stars, lines] of CONST){
      const k = el('g', {}, g);
      for (const [a, b] of lines) el('line', { class:'gl-cl', x1:stars[a][0], y1:stars[a][1], x2:stars[b][0], y2:stars[b][1] }, k);
      stars.forEach(([x, y], i) => el('circle', { class:'gl-cs', cx:x, cy:y, r: i % 3 ? 1.6 : 2.2 }, k));
      el('text', { class:'gl-cn', x:at[0], y:at[1] }, k).textContent = name;
    }
  }

  /* ── the ring: title over the top, tally under, the dot in orbit ── */
  const arc = (r, top) => top ? `M ${C-r} ${C} A ${r} ${r} 0 0 1 ${C+r} ${C}` : `M ${C-r} ${C} A ${r} ${r} 0 0 0 ${C+r} ${C}`;
  const textOn = (parent, href, cls, txt) => {
    const t = el('text', { class:'gl-rt ' + cls }, parent);
    const tp = el('textPath', { href, startOffset:'50%', 'text-anchor':'middle' }, t);
    tp.textContent = txt; return tp;
  };
  let orb = null;
  function buildRing(){
    const ring = slot('ring'); ring.textContent = '';
    root.querySelector('#gl-arc-top').setAttribute('d', arc(R + 30, true));
    root.querySelector('#gl-arc-bot').setAttribute('d', arc(R + 42, false));
    el('tspan', { class:'gl-rt-dot' }, textOn(ring, '#gl-arc-top', 'gl-rt-a', 'Around the world')).textContent = '.';
    const names = allNames(), k = new Set(names.map(contOf)).size;
    textOn(ring, '#gl-arc-bot', 'gl-rt-sub', `${names.length} countries · ${k} continents · ${RACES.length} races`);
    el('circle', { class:'gl-orbit', cx:C, cy:C, r:R + 14 }, ring);
    orb = el('circle', { class:'gl-orb', r:5.5, cx:C, cy:C - R - 14 }, ring);
    dirty = true;
  }
  buildRing();

  /* ── markers: races, and every item with an `at` ───────────────
     Items sharing a spot and a kind become one marker with both labels. */
  const marks = [];
  {
    const list = RACES.map((r, i) => ({ kind:'raced', at:r.at, label:r.time || r.name, country:r.country, race:i, title:r.name }));
    for (const [country, p] of Object.entries(PLACES))
      for (const it of (p.items || [])) if (it.at){
        const lab = it.mark || it.where || it.what;
        const same = list.find(m => m.kind === it.tag && d3.geoDistance(m.at, it.at) < 1e-4);
        if (same){ if (!same.label.split(' · ').includes(lab)) same.label += ' · ' + lab; }
        else list.push({ kind:it.tag, at:it.at, label:lab, country, title:it.where || it.what });
      }
    const g = slot('marks');
    for (const m of list){
      const e = el('g', { class:'gl-mark k-' + m.kind, tabindex:0, role:'button', 'aria-label':m.title }, g);
      el('circle', { class:'gl-mdot', r:6.5 }, e); el('circle', { class:'gl-mcore', r:2.8 }, e);
      el('text', { x:11, y:4 }, e).textContent = m.label;
      const go = () => m.kind === 'raced' ? selectRace(m.race) : selectCountry(m.country, true);
      e.addEventListener('click', ev => { ev.stopPropagation(); go(); });
      e.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); go(); } });
      marks.push(Object.assign(m, { el:e }));
    }
  }
  // races by default; with a filter on, only that filter's own kind
  const markKind = () => state.filter || 'raced';

  /* ── legend = filter ───────────────────────────────────────── */
  const swatch = (id, w, h) => { w = w || 30; h = h || 20; return id === 'raced'
    ? `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><rect class="gl-sw-bg" width="${w}" height="${h}"/><circle cx="${w/2}" cy="${h/2}" r="${h*.26}" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="${w/2}" cy="${h/2}" r="${h*.11}" class="gl-sw-core"/></svg>`
    : `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><rect class="gl-sw k-${id}" width="${w}" height="${h}"/></svg>`; };
  const legend = slot('legend');
  {
    const count = id => allNames().filter(n => tagsOf(n).includes(id)).length;
    const row = (id, label, note, n) => `<li><button type="button" data-k="${id}" aria-pressed="false">${swatch(id)}
      <span class="gl-lbl">${label}<small>${note}</small></span><span class="gl-n">${String(n).padStart(2, '0')}</span></button></li>`;
    legend.innerHTML = W_KINDS.filter(k => count(k.id)).map(k => row(k.id, k.label, k.note, count(k.id))).join('')
      + (RACES.length ? row('raced', 'Raced', 'Races, with the time', RACES.length) : '');
  }
  const matches = (name, f) => f === 'raced' ? RACES.some(r => r.country === name) : tagsOf(name).includes(f);

  function setFilter(f, move){
    state.filter = f;
    legend.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === f));
    svg.classList.toggle('dim', !!f && f !== 'raced');
    lands.forEach(L => L.el.classList.toggle('match', !!f && f !== 'raced' && tagsOf(L.name).includes(f)));
    filterCard(); dirty = true;
    if (!move) return;
    if (!f){ if (!state.sel) flyTo({ center:viewCenter(), k:1 }); return; }
    // a country is open and has something of this kind: stay on it, filter it
    if (state.sel && matches(state.sel, f)) return;
    if (state.sel) closeCard();
    if (f === 'raced') return flyTo(frame(RACES.map(r => [r.at[0], r.at[1], .35]), .55));
    const names = allNames().filter(n => tagsOf(n).includes(f));
    if (names.length) flyTo(frameGroup(names));
  }

  /* ── the tally: a sentence, then the split by continent ────── */
  {
    const by = {};
    for (const n of allNames()) (by[contOf(n)] = by[contOf(n)] || []).push(n);
    const rows = Object.entries(by).sort((a, b) => b[1].length - a[1].length);
    countUp(slot('nC'), allNames().length); countUp(slot('nK'), rows.length);
    slot('cbar').innerHTML = rows.map(([c, ns], i) => `<button type="button" class="gl-c${Math.min(i, 3)}" style="flex:${ns.length}" data-c="${esc(c)}" aria-label="${esc(c)}, ${ns.length}"></button>`).join('');
    slot('clist').innerHTML = rows.map(([c, ns], i) => `<li><button type="button" data-c="${esc(c)}"><i class="gl-c${Math.min(i, 3)}"></i><span>${esc(c)}</span><span class="gl-n">${ns.length}</span></button></li>`).join('');
    const go = e => { const b = e.target.closest('[data-c]'); if (!b) return; closeCard(); flyTo(frameGroup(by[b.dataset.c])); };
    on(slot('cbar'), 'click', go); on(slot('clist'), 'click', go);
    slot('total').textContent = TOUR.length ? clock(TOUR.length * STEP_S) : '';
    if (!TOUR.length) root.querySelector('[data-act="play"]').hidden = true;
  }
  function countUp(node, to){
    if (reduced){ node.textContent = to; return; }
    const t0 = performance.now();
    const step = t => { if (dead) return; const p = Math.min(1, (t - t0) / 900); node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ── framing: what to look at, and how close ───────────────────
     The camera turns to the target, then zooms until the target fills a
     share of the lens — Belgium and Russia both land at a readable size. */
  function ringPts(f){
    const out = [], g = f.geometry, polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    for (const p of polys) for (const ring of p) for (const pt of ring) out.push(pt);
    return out;
  }
  const boxPts = ([[w, s], [e, n]]) => [[w,s],[e,s],[e,n],[w,n],[(w+e)/2,s],[(w+e)/2,n],[w,(s+n)/2],[e,(s+n)/2]];
  function geomOf(target, grouped){
    const list = Array.isArray(target) && typeof target[0] === 'number' ? [target] : (Array.isArray(target) ? target : [target]);
    const pts = [];
    for (const t of list){
      if (Array.isArray(t)) pts.push(...d3.geoCircle().center([t[0], t[1]]).radius(t[2])().coordinates[0]);
      else if (grouped && W_GROUP[t]) pts.push(...boxPts(W_GROUP[t]));
      else if (W_FRAME[t]) pts.push(...boxPts(W_FRAME[t]));
      else { const L = byName.get(t); if (L) pts.push(...ringPts(L.lo)); }
    }
    return { type:'MultiPoint', coordinates:pts };
  }
  function frame(target, fill, grouped){
    fill = fill || .5;
    const g = geomOf(target, grouped);
    if (!g.coordinates.length) return { center:viewCenter(), k:state.k };
    const b0 = d3.geoBounds(g);   // the box's centre: a jagged coast must not pull the camera
    const center = b0[0][0] <= b0[1][0] ? [(b0[0][0] + b0[1][0]) / 2, (b0[0][1] + b0[1][1]) / 2] : d3.geoCentroid(g);
    const saved = proj.rotate(), savedS = proj.scale();
    proj.rotate([-center[0], -center[1]]).scale(R);
    const b = path.bounds(g);
    proj.rotate(saved).scale(savedS);
    const size = Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1], 1);
    return { center, k: Math.max(1, Math.min(KMAX, (2 * R * fill) / size)) };
  }
  /* Several countries at once may not fit on one face of the earth (Visited
     runs from Mexico to Russia): frame the biggest cluster that does. */
  function frameGroup(names){
    const ctr = n => { const bx = W_GROUP[n] || W_FRAME[n]; if (bx) return [(bx[0][0] + bx[1][0]) / 2, (bx[0][1] + bx[1][1]) / 2];
      const L = byName.get(n); return !L ? [0, 0] : (L.r < Math.PI ? L.c : d3.geoCentroid(L.lo)); };
    let best = [];
    for (const a of names){ const near = names.filter(b => d3.geoDistance(ctr(a), ctr(b)) < .95); if (near.length > best.length) best = near; }
    return frame(best, best.length > 1 ? .78 : .5, true);
  }

  /* ── render ────────────────────────────────────────────────── */
  const viewCenter = () => [-state.rot[0], -state.rot[1]];
  const visible = ll => d3.geoDistance(ll, viewCenter()) < Math.PI / 2 - .02;
  const pin = slot('pin'), skyG = slot('sky');

  function render(){
    proj.rotate(state.rot).scale(R * state.k);
    if (state.k >= 2) wantHiRes();
    const view = state.k <= 1.45 ? Math.PI / 2 : Math.asin(1.45 / state.k);
    const hi = state.k >= 2.2, vc = viewCenter();
    for (const L of lands){
      if (L.r < Math.PI && d3.geoDistance(L.c, vc) - L.r > view + .03){ L.el.setAttribute('d', ''); continue; }
      L.el.setAttribute('d', path(hi && L.hi || L.lo) || '');
    }
    /* Markers, then their labels: each label takes the first side (right,
       left, above, below) that covers no dot and no label already placed. */
    const mk = markKind(), filtered = !!state.filter, boxes = [];
    const hit = b => boxes.some(o => b.x < o.x + o.w && b.x + b.w > o.x && b.y < o.y + o.h && b.y + b.h > o.y);
    const shown = marks.filter(m => m.kind === mk && visible(m.at) && state.k > (filtered ? 2 : 3));
    for (const m of marks) if (!shown.includes(m)) m.el.style.display = 'none';
    const pts = shown.map(m => proj(m.at));
    pts.forEach(([x, y]) => boxes.push({ x:x - 7, y:y - 7, w:14, h:14 }));
    shown.forEach((m, i) => {
      const [x, y] = pts[i]; m.el.style.display = '';
      m.el.setAttribute('transform', `translate(${x},${y})`);
      const t = m.el.querySelector('text'), lab = state.k > 9 || filtered;
      t.style.display = lab ? '' : 'none';
      if (!lab) return;
      const w = m.label.length * 6.9 + 4, h = 13;
      const tries = [[11,4,'start',x+11,y-8],[-11,4,'end',x-11-w,y-8],[0,-13,'middle',x-w/2,y-24],[0,21,'middle',x-w/2,y+9]];
      const pick = tries.find(([,,,bx,by]) => !hit({ x:bx, y:by, w, h })) || tries[0];
      t.setAttribute('x', pick[0]); t.setAttribute('y', pick[1]); t.setAttribute('text-anchor', pick[2]);
      boxes.push({ x:pick[3], y:pick[4], w, h });
    });
    if (state.pinAt && visible(state.pinAt)){ const [x, y] = proj(state.pinAt); pin.setAttribute('transform', `translate(${x},${y})`); pin.style.display = ''; }
    else pin.style.display = 'none';

    skyG.setAttribute('transform', `rotate(${(state.rot[0] * .06) % 360} ${C} ${C})`);
    const a = (tour.i >= 0 ? tourProgress() * 360 : state.rot[0] * 1.5) - 90, t = a * Math.PI / 180;
    orb.setAttribute('cx', C + (R + 14) * Math.cos(t)); orb.setAttribute('cy', C + (R + 14) * Math.sin(t));
  }

  function loop(now){
    if (dead) return;
    if (state.spin && !flying){ state.rot[0] += .07; dirty = true; }
    tourTick(now || performance.now());
    if (dirty){ render(); dirty = false; }
    raf = requestAnimationFrame(loop);
  }

  /* ── flight: a great circle, and a zoom (in log space) that backs off
     mid-flight in proportion to the distance, so a long hop shows the way. */
  function flyTo({ center, k }){
    state.spin = false;
    const from = viewCenter(), k0 = state.k;
    const interp = d3.geoInterpolate(from, center), dist = d3.geoDistance(from, center);
    const lk0 = Math.log(k0), lk1 = Math.log(k);
    const lmid = Math.log(Math.max(1, Math.min(k0, k) / (1 + dist * 5)));
    const dur = reduced ? 0 : Math.min(2200, 650 + dist * 900 + Math.abs(lk1 - lk0) * 160);
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const t0 = performance.now(), id = {}; flying = id;
    const step = now => {
      if (flying !== id || dead) return;
      const t = dur ? Math.min(1, (now - t0) / dur) : 1, e = ease(t);
      const c = interp(e); state.rot = [-c[0], -c[1], 0];
      const base = lk0 + (lk1 - lk0) * e, w = dist > .05 ? Math.sin(Math.PI * e) : 0;
      state.k = Math.exp(base + (Math.min(base, lmid) - base) * w);
      dirty = true;
      if (t < 1) requestAnimationFrame(step); else flying = null;
    };
    requestAnimationFrame(step);
  }

  /* ── cards ─────────────────────────────────────────────────── */
  const chip = id => `<span class="gl-tag" data-tag="${id}">${swatch(id, 16, 16)}${W_LABEL[id] || id}</span>`;
  const close = label => `<button class="gl-x" type="button" data-act="close" aria-label="${label}">×</button>`;
  const playBtn = root.querySelector('[data-act="play"]');
  function showCard(html, cls){ card.className = 'gl-card'; void card.offsetWidth; card.innerHTML = html; card.className = 'gl-card on' + (cls ? ' ' + cls : ''); }
  function closeCard(){
    tourStop(); card.className = 'gl-card'; card.innerHTML = ''; state.sel = null; state.pinAt = null;
    lands.forEach(L => L.el.classList.remove('sel')); playBtn.hidden = !TOUR.length; dirty = true;
  }
  const markSel = name => lands.forEach(L => L.el.classList.toggle('sel', L.name === name));
  // with a filter on, an open country card keeps only that kind's lines
  function filterCard(){
    const f = state.filter;
    card.querySelectorAll('.gl-items li').forEach(li => { li.hidden = !!f && li.dataset.tag !== f; });
    card.querySelectorAll('.gl-tags .gl-tag').forEach(t => t.classList.toggle('off', !!f && t.dataset.tag !== f));
  }

  function selectCountry(name, keepFilter){
    if (!kindOf(name)) return;
    tourStop(); playBtn.hidden = !TOUR.length;
    if (state.filter && !keepFilter && !matches(name, state.filter)) setFilter(null, false);
    state.sel = name; state.pinAt = null; markSel(name);
    flyTo(frame(name));
    const p = PLACES[name] || {}, races = RACES.filter(r => r.country === name);
    const items = (p.items || []).map(i => `<li data-tag="${i.tag}"><span class="gl-when">${esc(i.when || W_LABEL[i.tag] || '')}</span><div><b class="${i.next ? 'next' : ''}">${esc(i.what)}${i.next ? ' — next' : ''}</b>${i.where ? `<span>${esc(i.where)}</span>` : ''}</div></li>`)
      .concat(races.map(r => `<li data-tag="raced"><span class="gl-when">${esc(r.date || 'Race')}</span><div><b>${esc(r.name)}</b><span>${esc([r.time, r.distance].filter(Boolean).join(' · '))}</span></div></li>`));
    showCard(`<div class="gl-card-top"><span>${esc(contOf(name))}</span>${close('Close')}</div>
      <h2>${esc(nice(name))}</h2>${p.city ? `<p class="gl-place">${esc(p.city)}</p>` : ''}
      ${p.line ? `<p class="gl-line">${esc(p.line)}</p>` : ''}
      <div class="gl-tags">${tagsOf(name).concat(races.length ? ['raced'] : []).map(chip).join('')}</div>
      ${items.length ? `<ul class="gl-items">${items.join('')}</ul>` : `<p class="gl-none">Been there.</p>`}`);
    filterCard();
  }
  // the largest optimised copy that is still sensible for a side panel
  function photo(src){
    const m = (window.IMG_MANIFEST || {})[src];
    if (!m || !m.v || !m.v.length) return src;
    const pick = m.v.find(v => v[0] >= 720) || m.v[m.v.length - 1];
    return pick[1];
  }
  function selectRace(i){
    const r = RACES[i];
    tourStop(); playBtn.hidden = !TOUR.length; state.sel = null; state.pinAt = null; markSel(null);
    flyTo(frame([r.at[0], r.at[1], .45]));
    showCard(`<div class="gl-card-top"><span>${esc(r.date || 'Race')}</span>${close('Close')}</div>
      ${r.photo ? `<div class="gl-photo"><img src="${esc(photo(r.photo))}" alt="${esc(r.name)}" loading="lazy" decoding="async"/></div>` : ''}
      <h2>${esc(r.name)}</h2>${r.distance ? `<p class="gl-place">${esc(r.distance)}</p>` : ''}
      ${r.time ? `<p class="gl-time">${esc(r.time)}</p>` : ''}`);
  }

  /* ── the journey, as a player ──────────────────────────────────
     Steps are tracks: it plays on its own, pauses, skips; each chapter of
     the bar is a step you can jump to. A record turns while it plays. */
  const tour = { i:-1, playing:false, start:0, paused:0 };
  const ICON = {
    play:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 0l10 6-10 6z"/></svg>',
    pause:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 0h3v12h-3zM7.5 0h3v12h-3z"/></svg>',
    prev:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M0 0h2v12H0zM12 0v12L2.5 6z"/></svg>',
    next:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M10 0h2v12h-2zM0 0v12l9.5-6z"/></svg>',
    replay:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5V0L3 2.5 6 5V3.5a3.5 3.5 0 1 1-3.5 3.5h-2A5.5 5.5 0 1 0 6 1.5z"/></svg>',
  };
  const EQ = '<span class="gl-eq" aria-hidden="true"><i></i><i></i><i></i></span>';
  const q = s => card.querySelector(s);
  function tourOpen(){
    const n = TOUR.length;
    if (state.filter) setFilter(null, false);
    showCard(`<div class="gl-p-top"><span class="gl-now">${EQ}<span>The journey</span></span>${close('Stop the journey')}</div>
      <div class="gl-p-track">
        <div class="gl-disc" aria-hidden="true"><span data-p="num">01</span></div>
        <div class="gl-p-meta"><span class="gl-when" data-p="when"></span><h2 data-p="title"></h2><p class="gl-place" data-p="place"></p></div>
      </div>
      <p class="gl-p-body" data-p="body"></p>
      <div class="gl-chapters" data-p="ch">${TOUR.map((s, i) => `<button type="button" data-i="${i}" aria-label="Go to ${esc(s.title)}"><span><i></i></span></button>`).join('')}</div>
      <div class="gl-times"><span data-p="el">0:00</span><span>-<span data-p="left">${clock(n * STEP_S)}</span></span></div>
      <div class="gl-transport">
        <button type="button" data-act="prev" aria-label="Previous">${ICON.prev}</button>
        <button type="button" class="gl-pp" data-act="pp" aria-label="Pause">${ICON.pause}</button>
        <button type="button" data-act="next" aria-label="Next">${ICON.next}</button></div>
      <ol class="gl-tracks" data-p="tracks">${TOUR.map((s, i) => `<li><button type="button" data-i="${i}">
        <span class="gl-tn"><b>${String(i + 1).padStart(2, '0')}</b>${EQ}</span><span class="gl-tt">${esc(s.title)}</span><span class="gl-tw">${esc(s.when || '')}</span></button></li>`).join('')}</ol>`, 'gl-player');
  }
  const atEnd = () => tour.i === TOUR.length - 1 && !tour.playing && tourProgress() >= .999;
  function tourGo(i, play){
    const s = TOUR[i]; tour.i = i; tour.start = performance.now(); tour.paused = 0;
    if (play !== undefined) tour.playing = play;
    playBtn.hidden = true;
    state.sel = typeof s.fit === 'string' ? s.fit : null; markSel(state.sel);
    state.pinAt = s.pin || null;
    pin.querySelector('text').textContent = s.pin ? String(s.place || '').split(',')[0] : '';
    if (s.overview) flyTo({ center:s.at || [15, 38], k:1 });
    else if (s.fit) flyTo(frame(s.fit, typeof s.fit === 'string' ? .5 : .35));
    q('[data-p="num"]').textContent = String(i + 1).padStart(2, '0');
    q('[data-p="when"]').textContent = s.when || '';
    q('[data-p="title"]').textContent = s.title || '';
    q('[data-p="place"]').textContent = s.place || '';
    q('[data-p="body"]').innerHTML = (s.tag ? chip(s.tag) + ' ' : '') + esc(s.body || '');
    card.querySelectorAll('[data-p="tracks"] button').forEach(b => { const j = +b.dataset.i; b.classList.toggle('on', j === i); b.classList.toggle('past', j < i); });
    card.querySelectorAll('[data-p="ch"] button').forEach(b => b.classList.toggle('cur', +b.dataset.i === i));
    syncPP();
  }
  function tourPlay(){ tour.start = performance.now() - tour.paused; tour.playing = true; syncPP(); }
  function tourPause(){ tour.paused = performance.now() - tour.start; tour.playing = false; syncPP(); }
  function tourStop(){ tour.i = -1; tour.playing = false; }
  const stepFrac = () => Math.min(1, (tour.playing ? performance.now() - tour.start : tour.paused) / (STEP_S * 1000));
  const tourProgress = () => tour.i < 0 ? 0 : (tour.i + stepFrac()) / TOUR.length;
  function syncPP(){
    const pp = q('[data-act="pp"]'); if (!pp) return;
    const end = atEnd();
    pp.innerHTML = tour.playing ? ICON.pause : end ? ICON.replay : ICON.play;
    pp.setAttribute('aria-label', tour.playing ? 'Pause' : end ? 'Replay' : 'Play');
    card.classList.toggle('paused', !tour.playing);
  }
  function tourTick(now){
    if (tour.i < 0) return;
    if (tour.playing && now - tour.start >= STEP_S * 1000){
      if (tour.i < TOUR.length - 1) tourGo(tour.i + 1);
      else { tour.paused = STEP_S * 1000; tour.playing = false; syncPP(); }
    }
    const f = stepFrac();
    card.querySelectorAll('[data-p="ch"] i').forEach((x, j) => { x.style.width = (j < tour.i ? 100 : j === tour.i ? f * 100 : 0) + '%'; });
    const total = TOUR.length * STEP_S, elapsed = tourProgress() * total, a = q('[data-p="el"]');
    if (a){ a.textContent = clock(elapsed); q('[data-p="left"]').textContent = clock(total - elapsed); }
    dirty = true;     // the orbiting dot follows the journey
  }

  /* The play button and the player are one object: the pill grows into the
     card and the card folds back into the pill. A View Transition does the
     morph — the names are set only for its duration, so the site's own page
     transitions never pick these elements up. */
  function morph(fn){
    if (!document.startViewTransition || reduced){ fn(); return; }
    root.classList.add('gl-morphing');
    const vt = document.startViewTransition(fn);
    vt.finished.finally(() => root.classList.remove('gl-morphing'));
  }
  const openTour = () => morph(() => { tourOpen(); tourGo(0, true); });
  const closeTour = () => morph(() => closeCard());

  /* ── clicks, keys and the pointer ──────────────────────────── */
  on(root, 'click', e => {
    const a = e.target.closest('[data-act]');
    if (a){
      const act = a.dataset.act, n = TOUR.length;
      if (act === 'play') openTour();
      else if (act === 'close') tour.i >= 0 ? closeTour() : closeCard();
      else if (act === 'pp') tour.playing ? tourPause() : (atEnd() ? tourGo(0, true) : tourPlay());
      else if (act === 'prev') tourGo(Math.max(0, tour.i - 1), tour.playing);
      else if (act === 'next') tourGo(Math.min(n - 1, tour.i + 1), tour.playing);
      else if (act === 'zoom-in') flyTo({ center:viewCenter(), k:Math.min(KMAX, state.k * 2) });
      else if (act === 'zoom-out') flyTo({ center:viewCenter(), k:Math.max(1, state.k / 2) });
      else if (act === 'zoom-reset'){ closeCard(); setFilter(null, false); flyTo({ center:[15, 38], k:1 }); }
      return;
    }
    const k = e.target.closest('.gl-legend [data-k]');
    if (k) return setFilter(state.filter === k.dataset.k ? null : k.dataset.k, true);
    const t = e.target.closest('[data-p="tracks"] [data-i]');
    if (t) return tourGo(+t.dataset.i, true);
    const c = e.target.closest('[data-p="ch"] [data-i]');
    if (c) return tourGo(+c.dataset.i, tour.playing);
  });
  on(window, 'keydown', e => {
    if (e.target.closest && e.target.closest('input,textarea,[contenteditable]')) return;
    if (e.key === 'Escape'){ if (card.classList.contains('on')) (tour.i >= 0 ? closeTour : closeCard)(); return; }
    if (tour.i < 0) return;
    if (e.key === ' ' && !e.target.closest('button,a')){ e.preventDefault(); tour.playing ? tourPause() : (atEnd() ? tourGo(0, true) : tourPlay()); }
    if (e.key === 'ArrowRight') tourGo(Math.min(TOUR.length - 1, tour.i + 1), tour.playing);
    if (e.key === 'ArrowLeft') tourGo(Math.max(0, tour.i - 1), tour.playing);
  });

  let drag = null, hoverEl = null;
  on(svg, 'pointerdown', e => {
    if (e.target.closest('.gl-mark')) return;
    drag = { x:e.clientX, y:e.clientY, rot:state.rot.slice(), moved:false, id:e.pointerId };
  });
  on(window, 'pointermove', e => {
    if (drag && e.pointerId === drag.id){
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 4){
        drag.moved = true; stage.classList.add('dragging');
        try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        flying = null; state.spin = false; if (tour.playing) tourPause();
      }
      if (drag.moved){
        const s = 800 / svg.getBoundingClientRect().width;
        const deg = 180 / (Math.PI * R * state.k) * s;      // keeps the point under the finger
        state.rot = [drag.rot[0] + dx * deg, Math.max(-85, Math.min(85, drag.rot[1] - dy * deg)), 0];
        dirty = true;
      }
      tip.classList.remove('on'); return;
    }
    if (e.pointerType !== 'mouse') return;
    const t = e.target.closest && e.target.closest('.gl-land.v');
    if (hoverEl && hoverEl !== t) hoverEl.classList.remove('hover');
    if (t && svg.contains(t)){
      hoverEl = t; t.classList.add('hover');
      const n = t.__L.name, r = stage.getBoundingClientRect();
      tip.innerHTML = `${esc(nice(n))}<small>${tagsOf(n).map(x => W_LABEL[x]).join(' · ')}</small>`;
      tip.style.left = (e.clientX - r.left) + 'px'; tip.style.top = (e.clientY - r.top) + 'px'; tip.classList.add('on');
    } else { hoverEl = null; tip.classList.remove('on'); }
  });
  on(window, 'pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const was = drag; drag = null; stage.classList.remove('dragging');
    if (was.moved) return;
    const t = e.target.closest && e.target.closest('.gl-land.v');
    if (t) selectCountry(t.__L.name);
  });
  on(window, 'pointercancel', () => { drag = null; stage.classList.remove('dragging'); });
  on(svg, 'pointerleave', () => { tip.classList.remove('on'); if (hoverEl) hoverEl.classList.remove('hover'); });

  raf = requestAnimationFrame(loop);
  return () => { dead = true; flying = null; cancelAnimationFrame(raf); offs.forEach(f => f()); };
}

Object.assign(window, { World });
