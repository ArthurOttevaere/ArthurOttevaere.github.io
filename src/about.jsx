// =============================================================================
//  about.jsx — four acts: "A QUICK LOOK AT ME." on the width axis; about me
//  as a Mac desk (an iPhone home screen on phones) with the bio, languages,
//  CVs, folders and the toolkit as a dock; what I'm into as a wall of pills;
//  and the timeline you travel through.
// =============================================================================

const { useState, useEffect, useMemo, useRef } = React;

const MONTH = 30.44 * 864e5;

function About(){
  const ref    = useRef(null);
  const narrow = useMedia('(max-width: 860px)');
  useReveals(ref, [narrow]);
  return (
    <div className="page" ref={ref}>
      <AboutOpener/>
      <AboutMe narrow={narrow}/>
      <Passions/>
      <Timeline narrow={narrow}/>
    </div>
  );
}

/* ── Act 1 · A QUICK LOOK AT ME. ───────────────────────────────────────────
   The width axis breathes against itself: line one opens while line two
   closes, then ME. rises out of its mask and the dot lands last. Each line
   is sized once, at its WIDEST, to span the column (capped by the screen's
   height), so the scroll only ever moves the width axis — nothing reflows. */
const OP_LINES = [
  { a: 62,  b: 125 },   // A quick   — opens
  { a: 125, b: 62  },   // look at   — closes
  { a: 70,  b: 104 },   // Me.       — rises
];
function AboutOpener(){
  const P = PROFILE();
  const still = reduceMotion();
  const sceneRef = useRef(null), stageRef = useRef(null), dotRef = useRef(null), footRef = useRef(null);
  const lineRefs = useRef([]);

  function fit(){
    const stage = stageRef.current; if (!stage) return;
    const cs = getComputedStyle(stage);
    const W = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const H = stage.clientHeight;
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const L = OP_LINES[i];
      el.style.fontSize = '100px';
      el.style.fontVariationSettings = "'wdth' " + Math.max(L.a, L.b);
      el._w = null;                       // frame() must write the width again
      const w = el.scrollWidth || 1;
      el.style.fontSize = Math.min(100 * W / w * .985, H * (i === 2 ? .36 : .25)) + 'px';
    });
  }
  function frame(){
    const scene = sceneRef.current; if (!scene) return;
    const run = scene.offsetHeight - window.innerHeight;
    const p = (still || run <= 0) ? 1 : clamp(-scene.getBoundingClientRect().top / run, 0, 1);
    const seg = (a, b) => clamp((p - a) / (b - a), 0, 1);
    const t = [easeIO(seg(0, .42)), easeIO(seg(.08, .5)), easeIO(seg(.42, .68))];
    // whole steps of the axis, and only when one changes: every new width is
    // a fresh shaping of a very large line, so the fewer, the smoother
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const L = OP_LINES[i], v = Math.round(lerp(L.a, L.b, t[i]));
      if (el._w === v) return;
      el._w = v;
      el.style.fontVariationSettings = "'wdth' " + v;
    });
    const me = lineRefs.current[2];
    if (me) me.style.transform = 'translateY(' + ((1 - t[2]) * 105).toFixed(2) + '%)';
    // the dot lands with a small overshoot, then settles at 1
    const d = seg(.68, .78);
    if (dotRef.current) dotRef.current.style.transform = 'scale(' + (d >= 1 ? 1 : d * 1.18 - Math.max(0, d - .85) * 1.2).toFixed(3) + ')';
    if (footRef.current) footRef.current.style.opacity = seg(.74, .86).toFixed(3);
  }

  /* Refit only when the WIDTH changes. A phone fires `resize` every time its
     toolbars slide in or out while you scroll; refitting then (which resets
     the lines to 100px to measure them) is what made the opener stutter. */
  useEffect(() => {
    let alive = true, lastW = 0;
    const run = force => {
      if (!alive) return;
      const w = window.innerWidth;
      if (force === true || w !== lastW){ lastW = w; fit(); }
      frame();
    };
    run(true);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => run(true));
    window.addEventListener('resize', run);
    return () => { alive = false; window.removeEventListener('resize', run); };
  }, []);
  useScrollFrame(frame, []);

  const ln = i => el => { lineRefs.current[i] = el; };
  return (
    <section className={'ab-op' + (still ? ' is-still' : '')} ref={sceneRef}>
      <h1 className="sr-only">About {P.name}</h1>
      <div className="ab-op-stage" ref={stageRef}>
        <div className="ab-op-top"><span className="eyebrow">About</span><span className="eyebrow">01 — 04</span></div>
        <div className="ab-op-type" aria-hidden="true">
          <span className="ab-op-line l1" ref={ln(0)}>A<i className="sp"/>quick</span>
          <span className="ab-op-line l2" ref={ln(1)}>look<i className="sp"/>at</span>
          <span className="ab-op-mask"><span className="ab-op-line l3" ref={ln(2)}>Me<span className="dot" ref={dotRef}/></span></span>
        </div>
        <div className="ab-op-foot" ref={footRef}>
          <p className="ab-op-voice">{COPY('aboutVoice', 'A business engineer, a data person, and a Formula 1 nerd on weekends.')}</p>
          <span className="eyebrow" aria-hidden="true">Scroll</span>
        </div>
      </div>
    </section>
  );
}

/* ── Act 2 · about me — a Mac desk on computers, an iPhone on phones ───────
   The same things in both: the bio, the languages, the CVs and the folders
   from data.js (`desk`), and the toolkit as apps (`toolGroups`). */

// Turns true once, the first time `ref` is well on screen.
function useInView(ref, threshold){
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion() || !('IntersectionObserver' in window)){ setOn(true); return; }
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting){ setOn(true); io.disconnect(); }
    }, { threshold: threshold == null ? .3 : threshold });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return on;
}

// "/…" stays in the app, a PDF or "https://…" opens in a new tab.
function openHref(href){
  if (!href || href === '#') return;
  const internal = href.startsWith('/') && !/\.pdf(\?|#|$)/i.test(href);
  if (internal){ if (window.__nav) window.__nav(href); else window.location.href = href; return; }
  window.open(href, '_blank', 'noopener');
}

// The CVs (as PDF files) and the folders, in desk order.
function deskItems(cvs){
  const P = PROFILE();
  const docs = cvs.map(c => ({
    label: 'CV_' + c.lang.toUpperCase() + '.pdf', short: 'CV ' + c.lang.toUpperCase(),
    href: c.href, pdf: c.lang.toUpperCase(), icon: 'pdf',
    info: c.lang === 'fr' ? 'Mon CV, en français.' : 'My résumé, in ' + c.label + '.',
  }));
  const folders = (P.desk || []).filter(f => f && f.href && f.href !== '#');
  return docs.concat(folders);
}

// The toolkit, flat: { name, label, icon, logo, mono, group, sep }.
function toolApps(){
  const P = PROFILE();
  const groups = (P.toolGroups && P.toolGroups.length)
    ? P.toolGroups
    : [{ label: 'Toolkit', items: (P.tools || []).map(t => [t, t.slice(0, 2)]) }];
  const out = [];
  groups.forEach((g, gi) => (g.items || []).forEach((it, j) => out.push({
    name: it[0], mono: it[1], logo: it[2], flip: !!it[3], icon: it[4], label: it[5] || it[0], group: g.label, sep: gi > 0 && j === 0,
  })));
  return out;
}

// What a tool looks like as an app: its own icon, or its flat logo on a tile.
function AppGlyph({ app }){
  if (app.icon) return <img className="app-img" src={app.icon} alt="" draggable="false" loading="lazy" decoding="async"/>;
  return (
    <span className="app-tile">
      {app.logo ? <img className={app.flip ? 'is-mono' : undefined} src={app.logo} alt="" draggable="false"/> : <b>{app.mono}</b>}
    </span>
  );
}

const DESK_DOC_SLOTS    = [[3, 3], [20, 9], [37, 1]];
const DESK_FOLDER_SLOTS = [[76, 4], [1, 40], [80, 38], [7, 74], [72, 74]];

/* Two entrances: on computers the desk is shown inside a MacBook whose lid
   opens as you scroll in (and closes as you leave); on phones the iPhone
   unlocks with Face ID when it comes on screen. */
function AboutMe({ narrow }){
  const ref = useRef(null);
  const on = useInView(ref, narrow ? .12 : .3);
  if (!narrow) return <MacBook/>;
  return (
    <section className="ab-me" ref={ref}>
      <div className="shell">
        {narrow
          ? <React.Fragment><AboutText on={on}/><IPhone lock/></React.Fragment>
          : null}
      </div>
    </section>
  );
}

/* ── the MacBook ─────────────────────────────────────────────────────
   A pinned scene, worked out in lab/mac-open from Apple's own product films
   and stills. The laptop arrives shut, seen from 20° above; the scroll lifts
   the lid on its hinge while the camera comes down and in, on the curve
   measured on Apple's MacBook Pro film (slow start, fast middle, long soft
   tail), smoothed so a wheel notch glides instead of jumping. The screen is
   lit from the first crack (dimmed while it faces away) and its light falls
   on the keys. The desk inside is drawn at one design size (1280 × 800) and
   scaled to the panel, so it is the same desk at every width. */
const MAC_W = 1280, MAC_PERSP = 5200;
// the lid's proportions, as fractions of the laptop's width (see site.css)
const MAC_GEO = { side: .026, top: .023, chin: .036, base: .0222 };
const MAC_LID = (1 - 2 * MAC_GEO.side) * .625 + MAC_GEO.top + MAC_GEO.chin;
// the camera: how far above it starts (deg), its start scale, how far the
// shut laptop is lifted (× the lid's height)
const MAC_CAM = { e0: 20, s0: .84, lift: .46 };

/* CSS cubic-bezier, solved for x. Apple's MacBook Pro film, measured frame by
   frame: the lid on (.55,0,.12,1), the camera a touch ahead on (.45,0,.18,1). */
function bezierEase(x1, y1, x2, y2){
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => { x = clamp(x, 0, 1); let t = x; for (let i = 0; i < 6; i++){ const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; } return Y(clamp(t, 0, 1)); };
}
const macLidEase = bezierEase(.55, 0, .12, 1), macCamEase = bezierEase(.45, 0, .18, 1);

/* The keyboard, row by row, as on a MacBook: [label, width in key units,
   kind]. Every row adds up to 14.5 units, so the right edge is straight.
   kind: 'fn' a half-height function key · 'm' a modifier (small label,
   bottom-left) · 'mr' one with its label bottom-right · 'arrows' the
   inverted T. */
const MAC_KEYS = [
  [['esc', 1.5, 'fn'], ...['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'].map(k => [k, 1, 'fn']), ['', 1, 'fn id']],
  [['§', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['delete', 1.5, 'mr']],
  [['tab', 1.5, 'm'], ...'QWERTYUIOP'.split('').map(k => [k, 1]), ['[', 1], [']', 1], ['\\', 1]],
  [['caps lock', 1.8, 'm'], ...'ASDFGHJKL'.split('').map(k => [k, 1]), [';', 1], ["'", 1], ['return', 1.7, 'mr']],
  [['shift', 2.3, 'm'], ...'ZXCVBNM'.split('').map(k => [k, 1]), [',', 1], ['.', 1], ['/', 1], ['shift', 2.2, 'mr']],
  [['fn', 1, 'm'], ['control', 1, 'm'], ['option', 1, 'm'], ['command', 1.25, 'm'], ['', 5], ['command', 1.25, 'm'], ['option', 1, 'm'], ['', 3, 'arrows']],
];
function MacKeyboard(){
  return (
    <span className="mac-kb">
      {MAC_KEYS.map((row, ri) => (
        <span className={'mac-row' + (ri === 0 ? ' is-fn' : '')} key={ri}>
          {row.map(([label, w, kind], ki) => kind === 'arrows' ? (
            <span className="mac-arrows" key={ki} style={{ flexGrow: w }}>
              <i>◀</i><span><i>▲</i><i>▼</i></span><i>▶</i>
            </span>
          ) : (
            <i key={ki} className={kind ? 'k-' + kind.split(' ').join(' k-') : undefined} style={{ flexGrow: w }}>{label}</i>
          ))}
        </span>
      ))}
    </span>
  );
}

/* A rim — a rounded rectangle's edge, extruded (see .mac-rim in site.css): a
   straight run from r to W − r, and facets along each corner, each centred on the
   arc and turned to its tangent. 'lip' is the base's front edge, hanging
   from the deck's front; 'edge' the lid's free edge, standing back from the
   screen toward the lid's back face (its black glass 2px proud). */
// Every facet is a 3D layer: 14 per corner on the front edge (enough for a
// smooth end), 8 on the lid's edge (barely ever seen).
function MacRim({ kind }){
  const lip = kind === 'lip', pre = lip ? '' : 'translateZ(2px) ';
  const K = lip ? 14 : 8, STEP = 90 / K, SW = (2 * Math.sin(STEP / 2 * Math.PI / 180) * 1.6).toFixed(4);
  const facets = [];
  for (let i = 0; i < K; i++){
    const ph = (i + .5) * STEP, rad = ph * Math.PI / 180;
    const s = Math.sin(rad).toFixed(4), co = (1 - Math.cos(rad)).toFixed(4);
    const vars = {
      '--k': (Math.pow(ph / 90, 1.3) * (lip ? .8 : 1)).toFixed(3),
      '--hl': lip ? (Math.exp(-Math.pow((ph - 58) / 24, 2)) * .32).toFixed(3) : 0,
      '--cut': lip ? (40 * Math.pow(ph / 90, 2.2)).toFixed(2) + '%' : '0%',
      '--cutt': lip ? (14 * Math.pow(ph / 90, 3.2)).toFixed(2) + '%' : '0%',
    };
    for (const left of [true, false]){
      const turn = (lip === left ? 1 : -1) * ph;              // lip left +, lip right −, edge left −, edge right +
      facets.push(<span key={i + (left ? 'l' : 'r')} className={'mac-rim rim-' + kind} style={{
        ...vars,
        left: left ? `calc(var(--r) * (1 - ${s}) - var(--r) * ${SW} / 2)` : `calc(100% - var(--r) * (1 - ${s}) - var(--r) * ${SW} / 2)`,
        top: lip ? `calc(100% - var(--r) * ${co})` : `calc(var(--r) * ${co})`,
        width: `calc(var(--r) * ${SW})`,
        transform: pre + 'rotate(' + turn + 'deg) rotateX(-90deg)',
      }}/>);
    }
  }
  return (
    <React.Fragment>
      <span className={'mac-rim rim-' + kind + ' rim-c'} style={{ left: 'var(--r)', right: 'var(--r)', top: lip ? '100%' : 0, transform: pre + 'rotateX(-90deg)', '--k': 0 }}>
        {lip ? <React.Fragment><span className="mac-scoop"/><span className="mac-foot l"/><span className="mac-foot r"/></React.Fragment> : null}
      </span>
      {facets}
    </React.Fragment>
  );
}

/* Which face of the lid is turned to you. Safari ignores backface-visibility
   on a lid this full of layers, so the lid's corners are projected through
   the very transforms the browser applies (perspective about its origin, the
   laptop's transform about its bottom centre, the lid's about its own) and
   the winding of the projected triangle decides. Exact at every angle: the
   faces swap when the lid is seen edge-on, so the swap never shows. */
function macLidFaces(cam, mac, lid, eyeY, lift, tilt, s, angle){
  const P = new DOMMatrix(); P.m34 = -1 / MAC_PERSP;
  const pox = cam.clientWidth / 2;
  const C = new DOMMatrix().translate(pox, eyeY).multiply(P).translate(-pox, -eyeY);
  const mw = mac.offsetWidth, mh = mac.offsetHeight, lw = lid.offsetWidth, lh = lid.offsetHeight;
  const M = new DOMMatrix().translate(mac.offsetLeft + mw / 2, mac.offsetTop + mh).translate(0, lift).rotate(tilt, 0, 0).scale(s).translate(-mw / 2, -mh);
  const L = new DOMMatrix().translate(lid.offsetLeft + lw / 2, lid.offsetTop + lh).rotate(angle, 0, 0).translate(-lw / 2, -lh);
  const A = C.multiply(M).multiply(L);
  const pr = (x, y) => { const q = A.transformPoint(new DOMPoint(x, y, 0, 1)); return [q.x / q.w, q.y / q.w]; };
  const a = pr(0, 0), b = pr(lw, 0), c = pr(0, lh);
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0;
}

function MacBook(){
  const still = reduceMotion();
  const sceneRef = useRef(null), stageRef = useRef(null), camRef = useRef(null), macRef = useRef(null), lidRef = useRef(null);
  const dimRef = useRef(null), spillRef = useRef(null), floorRef = useRef(null), faceRef = useRef(null), sm = useRef({ o: 0, c: 0, raf: 0, last: 0 });
  const [awake, setAwake] = useState(still);

  function size(){
    const stage = stageRef.current, mac = macRef.current; if (!stage || !mac) return;
    const cs = getComputedStyle(stage);
    const availW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availH = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const mw = Math.max(560, Math.min(availW * .94, availH / (MAC_LID + MAC_GEO.base * 1.2 + .06), 1240));
    mac.style.setProperty('--mw', mw + 'px');
    mac.style.setProperty('--s', (mw * (1 - 2 * MAC_GEO.side) / MAC_W).toFixed(4));
    mac.style.setProperty('--lh', (mw * MAC_LID).toFixed(2) + 'px');
    mac._lh = mw * MAC_LID;
  }
  // where the scroll says the lid (o) and the camera (c) should be: open over
  // the first 40% of the scene, open while you read, shut over the last 20%
  function target(){
    const scene = sceneRef.current; if (!scene) return { o: 1, c: 1 };
    const run = scene.offsetHeight - window.innerHeight;
    const p = (still || run <= 0) ? 1 : clamp(-scene.getBoundingClientRect().top / run, 0, 1);
    const u = clamp(p / .4, 0, 1), out = 1 - easeIO(clamp((p - .8) / .2, 0, 1));
    return { o: macLidEase(u) * out, c: macCamEase(u) * out };
  }
  function pose(o, c){
    const cam = camRef.current, mac = macRef.current, lid = lidRef.current; if (!cam || !mac || !lid) return;
    // Never exactly flat. Open and level, the lid's and the laptop's transforms
    // would both turn into the identity; Safari then stops painting the screen
    // as a 3D layer and paints only the part it thinks is on screen — worked out
    // from the document position, which position:sticky has left behind — so the
    // desk went black while you read and came back once the lid moved. A
    // fiftieth of a degree keeps both 3D and is invisible.
    const angle = Math.min(-90 + 90 * o, -.02), tilt = Math.min(-MAC_CAM.e0 * (1 - c), -.02), s = MAC_CAM.s0 + (1 - MAC_CAM.s0) * c;
    const lh = lid.offsetHeight || mac._lh || 500, lift = -lh * MAC_CAM.lift * (1 - c);
    lid.style.transform = 'rotateX(' + angle.toFixed(2) + 'deg)';
    mac.style.transform = 'translateY(' + lift.toFixed(1) + 'px) rotateX(' + tilt.toFixed(2) + 'deg) scale(' + s.toFixed(4) + ')';
    // the eye at the hinge, level with the top of the base as in Apple's front
    // shots, 2px above the deck's plane rather than in it
    const eyeY = lh;
    cam.style.perspective = MAC_PERSP + 'px';
    cam.style.perspectiveOrigin = '50% ' + eyeY + 'px';
    lid.classList.toggle('is-back', !macLidFaces(cam, mac, lid, eyeY, lift, tilt, s, angle));
    // open and level, the deck is seen edge-on and what is drawn on it would
    // show as a dashed hairline under the screen: fade it out. A fade on a flat
    // wrapper, never a visibility switch on the pieces.
    // Once gone, it leaves the scene (display:none), one layer fewer.
    if (faceRef.current){
      const f = o < .9 ? 1 : clamp((Math.abs(tilt) - .1) / 1.4, 0, 1);
      faceRef.current.style.opacity = f.toFixed(3);
      faceRef.current.style.display = f <= 0 ? 'none' : '';
    }
    if (dimRef.current) dimRef.current.style.opacity = (.82 * Math.pow(1 - o, 1.4)).toFixed(3);
    if (spillRef.current) spillRef.current.style.opacity = clamp(Math.sin(Math.PI * o) * .9 + .18 * o, 0, 1).toFixed(3);
    if (floorRef.current){ floorRef.current.style.opacity = (.45 + .55 * o).toFixed(3); floorRef.current.style.transform = 'scaleX(' + (.92 + .08 * o).toFixed(3) + ')'; }
    if (o > .35) setAwake(true);                             // the desk wakes as the lid swings up
    // on the stage, not the section: React rewrites the section's className
    if (stageRef.current) stageRef.current.classList.toggle('is-live', still || o > .98);
  }
  // glide toward the scroll position (≈ 90 ms time constant)
  function step(now){
    const m = sm.current; m.raf = 0;
    const dt = Math.min(64, now - (m.last || now)); m.last = now;
    const t = target(), k = still ? 1 : 1 - Math.exp(-dt / 90);
    m.o += (t.o - m.o) * k; m.c += (t.c - m.c) * k;
    const settled = Math.abs(t.o - m.o) < .0005 && Math.abs(t.c - m.c) < .0005;
    if (settled){ m.o = t.o; m.c = t.c; }
    pose(m.o, m.c);
    if (!settled) m.raf = requestAnimationFrame(step); else m.last = 0;
  }
  function frame(){ const m = sm.current; if (!m.raf) m.raf = requestAnimationFrame(step); }
  useEffect(() => {
    const t = target(); sm.current.o = t.o; sm.current.c = t.c;
    const run = () => { size(); pose(sm.current.o, sm.current.c); };
    run();
    window.addEventListener('resize', run);
    return () => { window.removeEventListener('resize', run); cancelAnimationFrame(sm.current.raf); };
  }, []);
  useScrollFrame(frame, []);

  return (
    <section className={'ab-mac' + (still ? ' is-still' : '') + (awake ? ' is-awake' : '')} ref={sceneRef}>
      <div className="ab-mac-stage" ref={stageRef}>
        <div className="mac-cam" ref={camRef}>
          <div className="mac" ref={macRef}>
            <span className="mac-floor" ref={floorRef} aria-hidden="true"/>
            <div className="mac-lid" ref={lidRef}>
              <MacRim kind="edge"/>
              {/* the outside of the lid, shown while it is the face turned to you */}
              <span className="mac-back" aria-hidden="true"><span className="mac-mark">a<i/></span></span>
              <div className="mac-screen">
                <span className="mac-notch" aria-hidden="true"/>
                <div className="mac-display">
                  <div className="mac-fit"><Desk on={awake} inMac/></div>
                  <span className="mac-dim" ref={dimRef} aria-hidden="true"/>
                </div>
              </div>
            </div>
            {/* the keyboard half: a plane lying flat from the hinge toward you,
                its front edge hanging from the far side */}
            <div className="mac-deck" aria-hidden="true">
              <span className="mac-deck-face" ref={faceRef}>
                <span className="mac-grille l"/>
                <MacKeyboard/>
                <span className="mac-grille r"/>
                <span className="mac-pad"/>
                <span className="mac-spill" ref={spillRef}/>
              </span>
              <MacRim kind="lip"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// "about me", selected like a word in a text field; the bio; the languages.
function AboutText({ on }){
  const P = PROFILE();
  const paras = (P.bio || []).slice(0, 3);
  const langs = P.languages || [];
  return (
    <div className={'ab-text' + (on ? ' on' : '')}>
      <span className="eyebrow">02 — Who</span>
      <h2 className="ab-ttl">
        <span className="ab-sel"><i className="hdl hdl-a"/>about me<i className="hdl hdl-b"/></span><span className="ab-caret" aria-hidden="true"/><span className="dot"/>
      </h2>
      <div className="ab-bio">{paras.map((t, i) => <p key={i}>{t}</p>)}</div>
      {langs.length ? (
        <p className="ab-langs">
          <span className="eyebrow">Languages</span>
          {langs.map(([name, lvl, flag]) => (
            <span className="ab-lg" key={name} title={name + ' · ' + lvl}>
              {flag ? <img src={flag} alt="" loading="lazy" decoding="async"/> : null}
              <span className="sr-only">{name}: </span><b>{String(lvl || '').split(/\s+[—–]\s+/)[0]}</b>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

/* the two drawn icons of the desk */
function FolderIcon(){
  return (
    <svg className="dk-fold" viewBox="0 0 80 64" aria-hidden="true">
      <path d="M4 10a5 5 0 0 1 5-5h18l6 6h38a5 5 0 0 1 5 5v40a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="#E8440F"/>
      <path d="M2 22a5 5 0 0 1 5-5h66a5 5 0 0 1 5 5v35a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5z" fill="#FF6A2E"/>
      <path d="M7 18h66a4 4 0 0 1 4 4v1H3v-1a4 4 0 0 1 4-4z" fill="#FFB08C" opacity=".55"/>
    </svg>
  );
}
function PdfIcon({ lang }){
  const sys = '-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif';
  return (
    <svg className="dk-doc" viewBox="0 0 64 80" aria-hidden="true">
      <path d="M6 2h36l18 18v54a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill="#FFFFFF" stroke="#101014" strokeOpacity=".14"/>
      <path d="M42 2v14a4 4 0 0 0 4 4h14z" fill="#E9E7E2"/>
      <g fill="#101014" fillOpacity=".16">
        <rect x="10" y="14" width="18" height="3" rx="1.5"/><rect x="10" y="22" width="26" height="2" rx="1"/>
        <rect x="10" y="27" width="40" height="2" rx="1"/><rect x="10" y="32" width="34" height="2" rx="1"/><rect x="10" y="37" width="38" height="2" rx="1"/>
      </g>
      <rect x="2" y="48" width="60" height="16" fill="#E5322D"/>
      <text x="32" y="60.5" textAnchor="middle" fontFamily={sys} fontWeight="800" fontSize="11.5" fill="#fff" letterSpacing=".6">PDF</text>
      <text x="32" y="73" textAnchor="middle" fontFamily={sys} fontWeight="700" fontSize="7.5" fill="#101014" fillOpacity=".5">{lang}</text>
    </svg>
  );
}

function Desk({ on, inMac }){
  const P    = PROFILE();
  const cvs  = useCvLinks();
  const items = deskItems(cvs).slice(0, DESK_DOC_SLOTS.length + DESK_FOLDER_SLOTS.length);
  const age  = computeAge(P.birth);
  const bodyRef = useRef(null), scatterRef = useRef(null), itemRefs = useRef([]), drag = useRef({}), toastT = useRef(0);
  const [sel, setSel]     = useState(-1);
  const [menu, setMenu]   = useState(null);           // { i, x, y }
  const [toast, setToast] = useState('');
  const say = m => { setToast(m); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(''), 1900); };

  useEffect(() => {
    const off = e => {
      if (!e.target.closest('.dk-ctx')) setMenu(null);
      if (!e.target.closest('.dk-item')) setSel(-1);
    };
    document.addEventListener('pointerdown', off);
    return () => { document.removeEventListener('pointerdown', off); clearTimeout(toastT.current); };
  }, []);

  // where each item sits: CVs top left, folders around the memoji
  let d = 0, f = 0;
  const slots = items.map(it => it.pdf ? DESK_DOC_SLOTS[d++] : DESK_FOLDER_SLOTS[f++]).map(s => s || [50, 90]);

  function down(e, i){
    if (e.button !== 0) return;
    setSel(i);
    const el = itemRefs.current[i];
    const m = new DOMMatrix(getComputedStyle(el).transform);
    drag.current = { i, id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: m.m41, oy: m.m42, moved: false };
    el.setPointerCapture(e.pointerId);
  }
  function move(e){
    const g = drag.current; if (g.id !== e.pointerId) return;
    const el = itemRefs.current[g.i], body = bodyRef.current, sc = scatterRef.current;
    // in layout pixels: inside the MacBook the desk is drawn scaled down
    const k = (sc.getBoundingClientRect().width / sc.offsetWidth) || 1;
    const dx = (e.clientX - g.sx) / k, dy = (e.clientY - g.sy) / k;
    if (!g.moved && Math.hypot(dx, dy) < 4) return;
    g.moved = true; el.classList.add('drag');
    // keep it on the desk, and above the dock
    const baseL = sc.offsetLeft + el.offsetLeft, baseT = sc.offsetTop + el.offsetTop;
    const nx = clamp(g.ox + dx, 8 - baseL, body.clientWidth - el.offsetWidth - 8 - baseL);
    const ny = clamp(g.oy + dy, 8 - baseT, body.clientHeight - el.offsetHeight - 96 - baseT);
    el.style.transform = 'translate(' + nx + 'px,' + ny + 'px)';
  }
  function up(e){
    const g = drag.current; if (g.id !== e.pointerId) return;
    itemRefs.current[g.i].classList.remove('drag');
    drag.current = {};
  }
  function context(e, i){
    e.preventDefault(); setSel(i);
    const body = bodyRef.current, B = body.getBoundingClientRect(), k = (B.width / body.offsetWidth) || 1;
    setMenu({ i, x: Math.min((e.clientX - B.left) / k, body.offsetWidth - 196), y: (e.clientY - B.top) / k });
  }
  function act(kind){
    const i = menu.i, it = items[i], el = itemRefs.current[i];
    setMenu(null);
    if (kind === 'open') openHref(it.href);
    if (kind === 'info') say(it.info || it.label);
    if (kind === 'copy'){
      const url = new URL(it.href, window.location.href).href;
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => say('Link copied'), () => say(url));
      else say(url);
    }
    if (kind === 'trash'){
      el.classList.remove('nope'); void el.offsetWidth; el.classList.add('nope');
      say('Nice try. That one stays.');
    }
  }

  return (
    <div className={'dk' + (on ? ' on' : '') + (inMac ? ' in-mac' : '')}>
      <MenuBar say={say}/>
      <div className="dk-body" ref={bodyRef}>
        <div className="dk-scatter" ref={scatterRef}>
          <div className="dk-me">
            {P.photo ? <img src={P.photo} alt="" decoding="async"/> : null}
            <span className="dk-me-shadow"/>
            <span className="dk-me-tag">{P.location}{age ? ' · ' + age : ''}</span>
          </div>
          {items.map((it, i) => (
            <a key={it.label} href={it.href} ref={el => { itemRefs.current[i] = el; }}
               className={'dk-item' + (it.pdf ? ' is-doc' : '') + (sel === i ? ' sel' : '')}
               style={{ left: slots[i][0] + '%', top: slots[i][1] + '%', '--t': (.15 + i * .1) + 's' }}
               aria-label={it.label + (it.pdf ? '' : ' — folder')}
               draggable="false"
               onClick={e => e.preventDefault()}
               onDoubleClick={() => openHref(it.href)}
               onKeyDown={e => { if (e.key === 'Enter'){ e.preventDefault(); openHref(it.href); } }}
               onPointerDown={e => down(e, i)} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
               onContextMenu={e => context(e, i)}>
              {it.pdf ? <PdfIcon lang={it.pdf}/> : <FolderIcon/>}
              <span>{it.label}</span>
            </a>
          ))}
        </div>

        <AboutText on={on}/>

        {menu ? (
          <div className="dk-ctx" role="menu" style={{ left: menu.x, top: menu.y }}>
            <button role="menuitem" onClick={() => act('open')}>Open<kbd>⌘O</kbd></button>
            <button role="menuitem" onClick={() => act('copy')}>Copy link<kbd>⌘C</kbd></button>
            <button role="menuitem" onClick={() => act('info')}>Get Info<kbd>⌘I</kbd></button>
            <hr/>
            <button role="menuitem" onClick={() => act('trash')}>Move to Trash<kbd>⌘⌫</kbd></button>
          </div>
        ) : null}
        <div className={'dk-toast' + (toast ? ' on' : '')} role="status">{toast}</div>

        <div className="dk-dock-wrap">
          <span className="eyebrow">Toolkit — what's in my dock</span>
          <Dock say={say}/>
        </div>
      </div>
    </div>
  );
}

// The Mac menu bar: Finder's menus, the status icons, the input menu (the
// languages again, where macOS keeps them) and Brussels time.
function MenuBar({ say }){
  const P = PROFILE();
  const langs = P.languages || [];
  const time = useClock();
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const srcRef = useRef(null);
  const greet = { French: 'Bonjour', English: 'Hello', Dutch: 'Hallo' };
  const code  = { French: 'FR', English: 'EN', Dutch: 'NL' };
  let date = '';
  try { date = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Brussels' }).format(new Date()).replace(',', ''); } catch (e) {}
  useEffect(() => {
    if (!open) return;
    const off = e => { if (!e.target.closest('.mb-in-wrap')) setOpen(false); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);
  const cn = langs[cur] ? (code[langs[cur][0]] || langs[cur][0].slice(0, 2).toUpperCase()) : 'FR';
  return (
    <div className="mb">
      <div className="mb-l">
        <span className="mb-i mb-apple" aria-hidden="true">
          <svg viewBox="0 0 170 200"><path d="M150.4 172.8c-8.3 12.4-17 24.4-30.4 24.6-13.4.3-17.6-7.9-33-7.9-15.3 0-20.1 7.7-32.8 8.2-13 .5-23-13.4-31.4-25.7C5.7 147-7.5 101.5 10.2 70.9c8.8-15.2 24.4-24.8 41.3-25 12.9-.3 25 8.6 32.9 8.6 7.9 0 22.6-10.7 38.1-9.1 6.5.3 24.7 2.6 36.4 19.8-.9.6-21.7 12.7-21.5 38 .3 30.2 26.5 40.2 26.8 40.4-.2.7-4.2 14.4-13.8 28.2zM110.1 0c1.4 13.1-3.9 26.3-11.7 35.7C90.6 45.2 77.7 52.5 65 51.5c-1.7-12.8 4.6-26.2 11.8-34.5C84.8 7.6 98.3.6 110.1 0z"/></svg>
        </span>
        <span className="mb-i mb-app">Finder</span>
        {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map(m => <span className="mb-i mb-menu" key={m} aria-hidden="true">{m}</span>)}
      </div>
      <div className="mb-r">
        <span className="mb-i mb-ico" aria-hidden="true"><svg width="25" height="12" viewBox="0 0 25 12"><rect x=".6" y=".6" width="21" height="10.8" rx="3.2" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.1"/><rect x="2.3" y="2.3" width="15" height="7.4" rx="1.8"/><path d="M23.2 4.2v3.6c.8-.3 1.3-1 1.3-1.8s-.5-1.5-1.3-1.8z" fillOpacity=".45"/></svg></span>
        <span className="mb-i mb-ico" aria-hidden="true"><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.6 5.6 9.1a3.4 3.4 0 0 1 4.8 0zM3.6 7.1a6.2 6.2 0 0 1 8.8 0l-1.3 1.3a4.4 4.4 0 0 0-6.2 0zM1.5 5A9.2 9.2 0 0 1 14.5 5l-1.3 1.3a7.4 7.4 0 0 0-10.4 0zM-.6 2.9a12.2 12.2 0 0 1 17.2 0l-1.3 1.3a10.4 10.4 0 0 0-14.6 0z"/></svg></span>
        {langs.length ? (
          <span className="mb-in-wrap">
            <button type="button" ref={srcRef} className={'mb-i mb-in-btn' + (open ? ' open' : '')} aria-haspopup="menu" aria-expanded={open}
                    aria-label="Languages I speak" onClick={() => setOpen(o => !o)}>
              <span className="mb-in">{cn}</span>
            </button>
            {open ? (
              <div className="mb-menu-pop" role="menu">
                <div className="h">Languages I speak</div>
                {langs.map(([name, lvl, flag], i) => (
                  <button type="button" role="menuitemradio" aria-checked={i === cur} className="o" key={name}
                          onClick={() => { setCur(i); setOpen(false); say((greet[name] || name) + '!'); }}>
                    <i>{i === cur ? '✓' : ''}</i>{flag ? <img src={flag} alt=""/> : null}{name}<span>{String(lvl).split(/\s+[—–]\s+/)[0]}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </span>
        ) : null}
        <span className="mb-i mb-ico" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><circle cx="5.8" cy="5.8" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="m9.2 9.2 3.8 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></span>
        <span className="mb-i mb-ico" aria-hidden="true"><svg width="17" height="13" viewBox="0 0 17 13"><rect x=".7" y=".7" width="15.6" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="13.6" cy="3.2" r="1.6"/><rect x=".7" y="7.3" width="15.6" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="3.4" cy="9.8" r="1.6"/></svg></span>
        <span className="mb-i mb-time">{date ? date + ' ' : ''}{time}</span>
      </div>
    </div>
  );
}

// The dock: one icon per tool, a separator between groups, macOS magnification.
function Dock({ say }){
  const apps = useMemo(toolApps, []);
  const dockRef = useRef(null), appRefs = useRef([]);
  const [running, setRunning] = useState(() => new Set());
  const still = reduceMotion();
  function mag(x){
    appRefs.current.forEach(a => {
      if (!a) return;
      const r = a.getBoundingClientRect(), c = r.left + r.width / 2, dd = Math.abs(x - c);
      a.style.setProperty('--m', (1 + .55 * Math.exp(-(dd * dd) / (2 * 70 * 70))).toFixed(3));
    });
  }
  function launch(i, name){
    const a = appRefs.current[i];
    if (!still && a){ a.classList.remove('bounce'); void a.offsetWidth; a.classList.add('bounce'); }
    setTimeout(() => setRunning(s => new Set(s).add(name)), still ? 0 : 1500);
  }
  return (
    <div className="dk-dock" ref={dockRef} role="list" aria-label="Toolkit"
         onPointerMove={e => { if (!still && e.pointerType === 'mouse') mag(e.clientX); }}
         onPointerLeave={() => appRefs.current.forEach(a => a && a.style.removeProperty('--m'))}>
      {apps.map((a, i) => (
        <React.Fragment key={a.name}>
          {a.sep ? <i className="dk-sep" aria-hidden="true"/> : null}
          <button type="button" role="listitem" className={'dk-app' + (running.has(a.name) ? ' run' : '')}
                  ref={el => { appRefs.current[i] = el; }} onClick={() => launch(i, a.name)}
                  aria-label={a.label + ' · ' + a.group}>
            <AppGlyph app={a}/>
            <b aria-hidden="true">{a.label}</b>
          </button>
        </React.Fragment>
      ))}
      {/* the Trash, where macOS keeps it: last, after its own separator */}
      <i className="dk-sep" aria-hidden="true"/>
      <button type="button" role="listitem" className="dk-app dk-trash" ref={el => { appRefs.current[apps.length] = el; }}
              aria-label="Trash" onClick={() => say && say('The Trash is empty. I keep everything.')}>
        <img className="app-img" src="/assets/logos/dock/trash.svg" alt="" draggable="false" loading="lazy" decoding="async"/>
        <b aria-hidden="true">Trash</b>
      </button>
    </div>
  );
}

/* ── the iPhone (phones) ───────────────────────────────────────────────────
   A home screen: the profile as a medium widget, the first four tools beside
   a small widget (the `desk` entry that has a `widget`), the other tools,
   the Search pill, and a dock with the CVs and the links. */
function PhoneIcon({ kind, lang }){
  if (kind === 'pdf') return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <rect width="60" height="60" rx="13.5" fill="#fff"/>
      <rect x=".5" y=".5" width="59" height="59" rx="13" fill="none" stroke="#000" strokeOpacity=".08"/>
      <path d="M19 10h15l9 9v29a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" fill="#F4F3F0" stroke="#101014" strokeOpacity=".16"/>
      <path d="M34 10v7a2 2 0 0 0 2 2h7z" fill="#E2E0DA"/>
      <rect x="17" y="30" width="26" height="8" fill="#E5322D"/>
      <text x="30" y="36.4" textAnchor="middle" fontFamily="-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif" fontWeight="800" fontSize="6" fill="#fff">PDF</text>
      <text x="30" y="46" textAnchor="middle" fontFamily="-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif" fontWeight="700" fontSize="5.6" fill="#101014" fillOpacity=".55">{lang}</text>
    </svg>
  );
  if (kind === 'linkedin') return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <defs><linearGradient id="ip-li" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A7BD8"/><stop offset="1" stopColor="#0A5DB3"/></linearGradient></defs>
      <rect width="60" height="60" rx="13.5" fill="url(#ip-li)"/>
      <text x="30" y="41" textAnchor="middle" fontFamily="-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif" fontWeight="800" fontSize="29" fill="#fff" letterSpacing="-1">in</text>
    </svg>
  );
  if (kind === 'globe') return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <defs><linearGradient id="ip-gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A2A31"/><stop offset="1" stopColor="#101014"/></linearGradient></defs>
      <rect width="60" height="60" rx="13.5" fill="url(#ip-gl)"/>
      <g fill="none" stroke="#FF6A2E" strokeWidth="2"><circle cx="30" cy="30" r="15"/><ellipse cx="30" cy="30" rx="6.5" ry="15"/><path d="M15.6 25h28.8M15.6 35h28.8"/></g>
      <circle cx="37" cy="24" r="3" fill="#fff"/>
    </svg>
  );
  // folder
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <defs><linearGradient id="ip-fo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF7A45"/><stop offset="1" stopColor="#F0440F"/></linearGradient></defs>
      <rect width="60" height="60" rx="13.5" fill="url(#ip-fo)"/>
      <path d="M15 21a3 3 0 0 1 3-3h8l3 3h13a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z" fill="#fff" fillOpacity=".55"/>
      <path d="M14 26a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="#fff"/>
    </svg>
  );
}

function PhoneApp({ app, onTap, label }){
  const ref = useRef(null);
  const tap = () => {
    const el = ref.current;
    if (el && !reduceMotion()){ el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
    if (onTap) onTap();
  };
  return (
    <button type="button" className="ip-app" ref={ref} onClick={tap} aria-label={app.short || app.label}>
      <span className="ip-ico">{app.tool ? <AppGlyph app={app.tool}/>
        : app.appIcon ? <AppGlyph app={{ icon: app.appIcon }}/>
        : <PhoneIcon kind={app.icon} lang={app.pdf}/>}</span>
      {label === false ? null : <span className="ip-lbl" aria-hidden="true">{app.short || app.label}</span>}
    </button>
  );
}

function IPhone({ lock }){
  const P     = PROFILE();
  const cvs   = useCvLinks();
  const time  = useClock();
  const age   = computeAge(P.birth);
  const items = deskItems(cvs);
  const tools = toolApps();
  const toolLabels = new Set(tools.map(t => t.label));
  const byLabel = new Map(items.map(it => [it.label, it]));
  const widget = items.find(it => it.widget);
  // a folder that is also a tool (GitHub) lives on the tool's icon instead;
  // the CVs sit on the home screen, labelled, where they read as CVs; the
  // links go in the dock
  const links = items.filter(it => !it.widget && !it.pdf && !toolLabels.has(it.label));
  const docs  = items.filter(it => it.pdf);
  const dock  = links.slice(0, 4), extra = links.slice(4);
  const asTool = t => ({ label: t.label, tool: t, href: (byLabel.get(t.label) || {}).href });
  // the CVs open the grid, beside the small widget: the first thing you read
  const apps  = docs.concat(tools.map(asTool), extra);
  const quad  = widget ? apps.slice(0, 4) : [];
  const rest  = widget ? apps.slice(4) : apps;

  /* Face ID. Locked until the phone is well on screen (or tapped):
     the island widens to show the padlock and the scan, the padlock opens,
     the lock screen slides away and the home screen settles in. */
  const ipRef = useRef(null);
  const [st, setSt] = useState(() => (lock && !reduceMotion()) ? 'locked' : 'home');
  const started = useRef(false);
  function unlock(){
    if (started.current || st === 'home') return;
    started.current = true;
    setSt('scan');
    setTimeout(() => setSt('open'), 1000);
    setTimeout(() => setSt('home'), 1450);
  }
  useEffect(() => {
    if (st !== 'locked') return;
    const el = ipRef.current; if (!el) return;
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ io.disconnect(); setTimeout(unlock, 350); } }, { threshold: .55 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  let today = '';
  try { today = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Brussels' }).format(new Date()).replace(',', ''); } catch (e) {}

  return (
    <div className={'ip' + (lock ? ' is-lockable is-' + st : '')} ref={ipRef} aria-label="My phone's home screen"
         onClick={lock && st === 'locked' ? unlock : undefined}>
      <div className="ip-screen">
        <div className="ip-status" aria-hidden="true">
          <span className="ip-time">{time}</span>
          <span className="ip-island">
            {lock ? (
              <React.Fragment>
                <svg className="ip-pad" viewBox="0 0 14 18"><path className="shk" d="M3.5 8V5.5a3.5 3.5 0 0 1 7 0V8" fill="none" stroke="currentColor" strokeWidth="1.8"/><rect x="1" y="8" width="12" height="9" rx="2.2"/></svg>
                <svg className="ip-scan" viewBox="0 0 24 24"><defs><linearGradient id="ip-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7DE2FF"/><stop offset="1" stopColor="#2E7BFF"/></linearGradient></defs><circle cx="12" cy="12" r="9" fill="none" stroke="url(#ip-ring)" strokeWidth="3" strokeDasharray="44 13" strokeLinecap="round"/></svg>
              </React.Fragment>
            ) : null}
          </span>
          <span className="ip-sys">
            <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.5" width="3" height="8.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/></svg>
            <svg width="16" height="11" viewBox="0 0 16 12"><path d="M8 11.6 5.6 9.1a3.4 3.4 0 0 1 4.8 0zM3.6 7.1a6.2 6.2 0 0 1 8.8 0l-1.3 1.3a4.4 4.4 0 0 0-6.2 0zM1.5 5A9.2 9.2 0 0 1 14.5 5l-1.3 1.3a7.4 7.4 0 0 0-10.4 0zM-.6 2.9a12.2 12.2 0 0 1 17.2 0l-1.3 1.3a10.4 10.4 0 0 0-14.6 0z"/></svg>
            <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".6" y=".6" width="22" height="10.8" rx="3.4" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.1"/><rect x="2.2" y="2.2" width="16" height="7.6" rx="2"/><path d="M24 4.2v3.6c.8-.3 1.3-1 1.3-1.8s-.5-1.5-1.3-1.8z" fillOpacity=".4"/></svg>
          </span>
        </div>

        <div className="ip-home">
          <div className="ip-w ip-w-m">
            <div className="ip-card ip-me">
              <div className="ip-me-top">
                {P.photo ? <span className="ip-av"><img src={P.photo} alt="" decoding="async"/></span> : null}
                <span className="ip-me-k">About</span>
              </div>
              <div className="ip-me-n">{P.name}</div>
              <div className="ip-me-m">{P.location}{age ? ' · ' + age : ''}</div>
              {P.status ? <div className="ip-me-s"><i/>{P.status}</div> : null}
            </div>
            <span className="ip-lbl">Profile</span>
          </div>

          {widget ? (
            <div className="ip-split">
              <div className="ip-quad">
                {quad.map(a => <PhoneApp key={a.label} app={a} onTap={() => openHref(a.href)}/>)}
              </div>
              <div className="ip-w ip-w-s">
                <button type="button" className="ip-card ip-small" onClick={() => openHref(widget.href)}>
                  <span className="ip-small-top">
                    <span className="ip-art" aria-hidden="true">
                      <svg viewBox="0 0 40 40"><rect width="40" height="40" rx="7" fill="#101014"/>
                        <g fill="#fff">{[0,1,2,3].map(r => [0,1,2,3].map(c => (r + c) % 2 ? null : <rect key={r + '-' + c} x={8 + c * 6} y={8 + r * 6} width="6" height="6"/>))}</g>
                        <rect x="7" y="7" width="26" height="26" fill="none" stroke="#fff" strokeOpacity=".5"/></svg>
                    </span>
                    <span className="ip-small-k" aria-hidden="true">●</span>
                  </span>
                  <span className="ip-small-sub">{widget.widget.sub || widget.label}</span>
                  <span className="ip-small-t">{widget.widget.title || widget.label}</span>
                  <span className="ip-play"><svg viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z"/></svg>{widget.widget.cta || 'Open'}</span>
                </button>
                <span className="ip-lbl">{widget.label}</span>
              </div>
            </div>
          ) : null}

          <div className="ip-grid">
            {rest.map(a => <PhoneApp key={a.label} app={a} onTap={() => openHref(a.href)}/>)}
          </div>
        </div>

        <div className="ip-search" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 14 14"><circle cx="5.8" cy="5.8" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="m9.2 9.2 3.8 3.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>Search
        </div>
        <div className="ip-dock">
          {dock.map(a => <PhoneApp key={a.label} app={a} label={false} onTap={() => openHref(a.href)}/>)}
        </div>
        {lock ? (
          <div className="ip-lock" aria-hidden="true">
            <span className="ip-lock-date">{today}</span>
            <span className="ip-lock-time">{time}</span>
            <span className="ip-lock-hint">{st === 'locked' ? 'Look at me to unlock' : ''}</span>
            <span className="ip-lock-btns">
              <i><svg viewBox="0 0 24 24"><path d="M8 2h8v5l-2 3v12h-4V10L8 7z" fill="currentColor"/></svg></i>
              <i><svg viewBox="0 0 24 24"><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="currentColor"/><circle cx="12" cy="13" r="3.6" fill="#fff" fillOpacity=".9"/></svg></i>
            </span>
          </div>
        ) : null}
        <span className="ip-home-bar" aria-hidden="true"/>
      </div>
    </div>
  );
}

/* ── Act 4 · the timeline you travel through ──────────────────────────────
   The axis is real time: a year is always the same number of pixels, every
   step is a bar of its actual length, and "Today" sits where today is. The
   orange dot stays put while time slides past it — scrolling moves you, not
   the dot. Cards open when you reach them and dim once they are behind you.
   On phones (and with reduced motion) the same content becomes a plain
   vertical list with the dot descending it. */
function Timeline({ narrow }){
  const entries = useMemo(() => timelineEntries(), []);
  const animated = !reduceMotion() && !narrow;
  if (!entries.length) return null;
  return animated ? <TimelineTravel entries={entries}/> : <TimelineList entries={entries}/>;
}

function TimelineHead(){
  return (
    <div className="shell tl-head">
      <span className="eyebrow rv rv-fade">04 — The path</span>
      <Words as="h2" className="sec-title" text="Where I've been" dot/>
    </div>
  );
}

/* What a step card says, wherever it is shown. The school's or company's
   logo rides in the corner of the label row: desaturated and quiet while you
   are elsewhere on the axis, in its own colours on the step you are on. It
   sits on negative margins so it never makes the card any taller. */
function TimelineCardBody({ e }){
  return (
    <>
      <span className="tl-type">
        {e.type || 'Step'}
        {e.upcoming ? <span className="pill-up">Upcoming</span> : null}
        {e.logo ? <img className="tl-logo" src={e.logo} alt="" loading="lazy" decoding="async"/> : null}
      </span>
      <span className="tl-title">{e.title}</span>
      <span className="tl-date">{formatPeriod(e.period)}</span>
      {e.place ? <span className="tl-place">{e.place}</span> : null}
    </>
  );
}

/* ── The back of a card ────────────────────────────────────────────────
   Click a step and it turns over, like a profile page: the place in the
   banner, the school's or company's mark in a round avatar biting into it,
   then the name, a handle-like line and what I did there. Every field is
   optional in data.js; a step without a photo gets a paper plate with the
   city set in the serif and its coordinates. */
function fmtCoords(at){
  if (!at || at.length < 2) return '';
  const [lon, lat] = at;
  return Math.abs(lat).toFixed(3) + '°' + (lat >= 0 ? 'N' : 'S') + ' · ' + Math.abs(lon).toFixed(3) + '°' + (lon >= 0 ? 'E' : 'W');
}

function TimelineCardBack({ e }){
  const org = e.org || String(e.place || e.title || '').split(' · ')[0];
  const town = e.city ? e.city.split(',')[0] : '';
  const sub = [e.handle, e.city].filter(Boolean).join(' · ');
  const about = Array.isArray(e.about) ? e.about.slice(0, 3) : (e.about ? [e.about] : []);
  return (
    <div className="tl-back">
      <div className={'tl-b-banner' + (e.banner ? ' has-photo' : '')}>
        {e.banner
          ? <img src={e.banner} alt="" loading="lazy" decoding="async" style={e.bannerPos ? { objectPosition: e.bannerPos } : null}/>
          : <span className="tl-b-plate">
              {town ? <em>{town}</em> : null}
              {e.at ? <span className="tl-b-coords tabular">{fmtCoords(e.at)}</span> : null}
            </span>}
        {e.banner && e.credit ? <span className="tl-b-credit">{e.credit}</span> : null}
        <span className="tl-b-x" aria-hidden="true">
          <svg viewBox="0 0 12 12" width="10" height="10"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </span>
      </div>
      <div className="tl-b-head">
        <span className="tl-b-av">{e.logo ? <img src={e.logo} alt="" loading="lazy" decoding="async"/> : <b>{org.slice(0, 1)}</b>}</span>
        <span className={'tl-b-pill' + (e.upcoming ? ' up' : '')}>{e.upcoming ? 'Upcoming' : formatPeriod(e.period)}</span>
      </div>
      <div className="tl-b-body">
        <span className="tl-b-name">{org}<i aria-hidden="true"/></span>
        {sub ? <span className="tl-b-handle">{sub}</span> : null}
        {about.length ? <ul className="tl-b-list">{about.map((t, k) => <li key={k}>{t}</li>)}</ul> : null}
      </div>
    </div>
  );
}

/* Turning a card over is done on the DOM, not in React state: the travelling
   timeline repaints its cards every frame and must not re-render for this.
   The face you are not looking at is made inert so it is neither focusable
   nor read out. In the vertical list the card also grows to the height of
   its back; on the travelling stage it keeps its footprint (the layout
   measures it) and the back simply reaches further away from the axis. */
function flipCard(card, on){
  if (!card) return;
  const was = card.classList.contains('is-flipped');
  if (on == null) on = !was;
  if (on === was) return;
  const front = card.querySelector('.tl-front'), back = card.querySelector('.tl-back');
  card.classList.toggle('is-flipped', on);
  card.setAttribute('aria-pressed', on ? 'true' : 'false');
  if (front) front.inert = on;
  if (back) back.inert = !on;
  if (!front || !back) return;
  if (card.dataset.mode === 'list'){
    front.style.minHeight = on ? back.offsetHeight + 'px' : '';
    return;
  }
  // on the stage: if the back would leave the screen, tighten it, and if
  // that is still not enough, keep only its first line
  back.classList.remove('is-compact', 'is-min');
  if (!on) return;
  const stage = card.closest('.tl-stage');
  if (!stage) return;
  const top = card.offsetTop, room = card.dataset.grow === 'up' ? top + card.offsetHeight - 8 : stage.clientHeight - top - 8;
  if (back.offsetHeight > room) back.classList.add('is-compact');
  if (back.offsetHeight > room) back.classList.add('is-min');
}

function FlipCard({ e, cardRef, mode, className }){
  const onKey = ev => {
    if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); flipCard(ev.currentTarget); }
    else if (ev.key === 'Escape') flipCard(ev.currentTarget, false);
  };
  return (
    <article ref={cardRef} data-mode={mode} data-grow="down"
             className={'tl-card' + (e.upcoming ? ' up' : '') + (className ? ' ' + className : '')}
             role="button" tabIndex={0} aria-pressed="false"
             aria-label={e.title + (e.place ? ', ' + e.place : '') + ' — turn the card over'}
             onClick={ev => flipCard(ev.currentTarget)} onKeyDown={onKey}>
      <div className="tl-flip">
        <div className="tl-front"><TimelineCardBody e={e}/></div>
        <TimelineCardBack e={e}/>
      </div>
    </article>
  );
}

/* The travelling version. Three ideas hold it together:
   · the axis is real time — a month is always the same number of pixels;
   · you never move: the whole of time slides past a dot fixed at 30% of the
     screen, and the scroll only decides *when* you are;
   · scroll speed follows what is happening. Rather than stopping on each
     date, time slows down around every start and end (a smooth speed curve,
     integrated once and inverted) and hurries through empty years — so the
     travel never stutters and never drags.
   Cards live above the axis, one row per Gantt lane, and only one card at a
   time per row: the next one starts arriving exactly as the previous one
   finishes leaving, so nothing ever crowds. */
function TimelineTravel({ entries }){
  const sceneRef = useRef(null), headRef = useRef(null);
  const stageRef = useRef(null), trackRef = useRef(null);
  const cardRefs = useRef([]), stemRefs = useRef([]), barRefs = useRef([]), markRefs = useRef([]);
  const readRef = useRef(null), curRef = useRef(null), pastRef = useRef(null), todayRef = useRef(null);
  const topRef = useRef(null);

  const now  = Date.now();
  const t0   = entries[0].start - 3 * MONTH;
  const tEnd = Math.max.apply(null, entries.map(e => e.end).concat([now])) + 4 * MONTH;

  // The ruler: a label on every January, a notch on every quarter, so the
  // speed of the travel stays readable even between two steps.
  const marks = useMemo(() => {
    const out = [];
    const y0 = new Date(t0).getUTCFullYear(), y1 = new Date(tEnd).getUTCFullYear();
    for (let y = y0; y <= y1; y++){
      for (let m = 0; m < 12; m += 3){
        const t = Date.UTC(y, m, 1);
        if (t >= t0 && t <= tEnd) out.push({ t, year: m === 0 ? y : 0 });
      }
    }
    return out;
  }, [t0, tEnd]);

  // Lanes: two steps that run at the same time never share a row.
  const lanes = useMemo(() => {
    const ends = [];
    return entries.map(e => {
      let lane = ends.findIndex(end => e.start >= end);
      if (lane < 0) lane = ends.length;
      ends[lane] = e.end;
      return lane;
    });
  }, [entries]);
  const laneCount = Math.max.apply(null, lanes.map(l => l + 1));

  // When each card arrives (A) and when it is gone (D). A card leaves exactly
  // when the next one on its row starts arriving: one card per row, always.
  const win = useMemo(() => {
    const A = [], D = [], last = {};
    entries.forEach((e, i) => {
      const p = last[lanes[i]];
      A[i] = e.start - (p == null ? 3 * MONTH : clamp(.45 * (e.start - entries[p].end), .6 * MONTH, 3 * MONTH));
      D[i] = Infinity;
      if (p != null) D[p] = A[i];
      last[lanes[i]] = i;
    });
    return { A, D };
  }, [entries, lanes]);

  useEffect(() => {
    const scene = sceneRef.current, stage = stageRef.current, track = trackRef.current;
    if (!scene || !stage || !track) return;
    let raf = 0, geo = { x: () => 0, cursorX: 0, axis: 0, SW: 1, cardW: 320 };

    /* ── how a scroll position becomes a date ─────────────────────────────
       w(t) is how much scroll one month of that date deserves: a lot around
       a start, some around an end, a little while a step runs, almost none
       in empty years. Integrating w gives a monotone curve; inverting it
       gives the date. Continuous, so the motion never jumps. */
    const N = 720, step = (tEnd - t0) / N, cum = new Float64Array(N + 1);
    for (let i = 0; i < N; i++){
      const t = t0 + (i + .5) * step;
      let w = .22;
      for (let k = 0; k < entries.length; k++){
        const e = entries[k];
        const a = (t - e.start) / (1.9 * MONTH), b = (t - e.end) / (1.5 * MONTH);
        w += 4.0 * Math.exp(-a * a) + 1.2 * Math.exp(-b * b);
        if (t > e.start && t < e.end) w += .30;
      }
      cum[i + 1] = cum[i] + w;
    }
    const total = cum[N] || 1;
    function timeAt(p){
      const target = clamp(p, 0, 1) * total;
      let lo = 1, hi = N;
      while (lo < hi){ const mid = (lo + hi) >> 1; if (cum[mid] < target) lo = mid + 1; else hi = mid; }
      const seg = cum[lo] - cum[lo - 1] || 1;
      return t0 + (lo - 1 + (target - cum[lo - 1]) / seg) * step;
    }
    const fmt = t => new Date(t).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();

    /* ── where everything sits ───────────────────────────────────────────
       The ruler (bars + years) is one band just under the axis. Cards take
       the space left on either side of it: lane 0 above, lane 1 below, and
       any further lane stacks outwards. The whole assembly is then centred
       in the stage, so nothing is ever cut off at the top or the bottom. */
    const GAP_UP = 58, RULER_GAP = 26, ROWGAP = 16, PITCH = 13;
    function layout(){
      const SW = stage.clientWidth, SH = stage.clientHeight;
      if (!SW || !SH) return;
      const ppm = clamp(SW / 11, 52, 92);                 // ~11 months on screen
      const x = t => ((t - t0) / MONTH) * ppm;
      const cursorX = Math.round(SW * .3);

      const ruler  = 44 + laneCount * PITCH + 34;         // readout, bars, years
      const rowsUp = Math.ceil(laneCount / 2), rowsDn = laneCount - rowsUp;

      // Two passes: measure the cards, and if the screen is too short for them
      // switch to the compact card and give back some of the breathing room —
      // a card is never allowed to run off the top or the bottom of the stage.
      let rowH = 0, cardW = 320, gapUp = GAP_UP, rulerGap = RULER_GAP;
      const measure = () => {
        rowH = 0;
        cardRefs.current.forEach(c => { if (c){ rowH = Math.max(rowH, c.offsetHeight); cardW = c.offsetWidth; } });
        return GAP_UP + rowsUp * rowH + (rowsUp - 1) * ROWGAP
             + ruler + (rowsDn ? RULER_GAP + rowsDn * rowH + (rowsDn - 1) * ROWGAP : 0);
      };
      stage.classList.remove('is-tight');
      let need = measure();
      if (need > SH){ stage.classList.add('is-tight'); need = measure(); }
      if (need > SH){
        const slack = (GAP_UP - 24) + (rowsDn ? RULER_GAP - 14 : 0);
        const k = Math.min(1, (need - SH) / Math.max(1, slack));
        gapUp   = GAP_UP - (GAP_UP - 24) * k;
        rulerGap = RULER_GAP - (RULER_GAP - 14) * k;
        need -= slack * k;
      }

      const needUp   = gapUp + rowsUp * rowH + (rowsUp - 1) * ROWGAP;
      const axis = Math.round(needUp + Math.max(0, SH - need) / 2);
      const depth = l => Math.floor(l / 2);
      // above the axis the row is defined by its foot, below it by its head:
      // either way the cards line up on the edge that faces the axis.
      const rowEdge = l => l % 2 === 0
        ? axis - gapUp - depth(l) * (rowH + ROWGAP)
        : axis + ruler + rulerGap + depth(l) * (rowH + ROWGAP);
      geo = { x, cursorX, axis, SW, cardW };

      track.style.width = x(tEnd) + 'px';
      stage.style.setProperty('--axis', axis + 'px');
      track.style.setProperty('--axis', axis + 'px');

      const barsBottom = axis + 44 + laneCount * PITCH;
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const e = entries[i];
        bar.style.left  = x(e.start) + 'px';
        bar.style.width = Math.max(8, x(e.end) - x(e.start)) + 'px';
        bar.style.top   = (axis + 44 + lanes[i] * PITCH) + 'px';
      });
      markRefs.current.forEach(el => {
        if (!el) return;
        el.style.left = x(+el.dataset.t) + 'px';
        if (el.classList.contains('tl-year')) el.style.top = (barsBottom + 12) + 'px';
      });
      if (todayRef.current) todayRef.current.style.left = x(now) + 'px';
      if (pastRef.current) pastRef.current.style.width = x(tEnd) + 'px';

      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const up = lanes[i] % 2 === 0, b = rowEdge(lanes[i]);
        c.style.left = (x(entries[i].start) - 24) + 'px';
        c.style.top  = (up ? b - c.offsetHeight : b) + 'px';
        c.dataset.grow = up ? 'up' : 'down';
        // Above the axis the thread runs down to the line itself; below it, the
        // bar already sits right on top of the card, so a short tick is enough.
        const s = stemRefs.current[i];
        if (s){
          s.style.left = x(entries[i].start) + 'px';
          s.style.top = (up ? b : axis + ruler) + 'px';
          s.style.height = (up ? axis - b : rulerGap) + 'px';
          s.classList.toggle('is-down', !up);
        }
      });

      if (curRef.current){ curRef.current.style.left = cursorX + 'px'; curRef.current.style.top = axis + 'px'; }
      if (readRef.current){ readRef.current.style.left = cursorX + 'px'; readRef.current.style.top = (axis + 14) + 'px'; }
      if (pastRef.current) pastRef.current.style.top = axis + 'px';
    }

    /* ── one frame ─────────────────────────────────────────────────────── */
    const FADE = 1.15 * MONTH;
    function frame(){
      raf = 0;
      const head = headRef.current ? headRef.current.offsetHeight : 0;
      const r = scene.getBoundingClientRect();
      const runway = r.height - head - window.innerHeight;
      const p = runway > 0 ? clamp((-r.top - head) / runway, 0, 1) : 0;
      // the small context line only takes over once the real title has left
      if (topRef.current) topRef.current.style.opacity = clamp(-r.top / Math.max(1, head) * 1.7 - .7, 0, 1).toFixed(3);
      const T = timeAt(p);
      const { x, cursorX, SW, cardW } = geo;
      const shift = cursorX - x(T);

      track.style.transform = 'translate3d(' + shift.toFixed(1) + 'px,0,0)';
      if (readRef.current) readRef.current.textContent = fmt(T);
      if (pastRef.current) pastRef.current.style.transform = 'scaleX(' + clamp(x(T) / x(tEnd), 0, 1).toFixed(4) + ')';

      barRefs.current.forEach((bar, i) => {
        const fill = bar && bar.firstChild;
        if (fill) fill.style.transform = 'scaleX(' + clamp((T - entries[i].start) / Math.max(1, entries[i].end - entries[i].start), 0, 1).toFixed(4) + ')';
      });

      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const e = entries[i], A = win.A[i], D = win.D[i], up = lanes[i] % 2 === 0;
        const f    = Math.max(.3 * MONTH, Math.min(FADE, (D - A) / 3));
        const inK  = smooth((T - A) / f);
        const outK = D === Infinity ? 0 : smooth((T - (D - f)) / f);
        // Inside its period the card travels with you; after it, it stays at
        // its end date and drifts away like everything you have passed —
        // dissolving as it reaches the left edge rather than sliding under it.
        const dx = x(clamp(T, e.start, e.end)) - x(e.start);
        const sx = shift + x(e.start) + dx - 24;
        const a  = inK * (1 - outK)
                 * (1 - .5 * smooth((T - e.end) / (2.4 * MONTH)))
                 * smooth((sx + cardW) / (.26 * SW));
        const tr = 'translate3d(' + dx.toFixed(1) + 'px,' + ((1 - inK) * (up ? 14 : -14)).toFixed(1) + 'px,0)';
        c.style.opacity = a.toFixed(3);
        c.style.visibility = a < .008 ? 'hidden' : 'visible';
        if (a < .05) flipCard(c, false);
        c.style.transform = tr;
        c.classList.toggle('now', T >= e.start && T <= e.end);
        const s = stemRefs.current[i];
        if (s){
          s.style.opacity = (a * inK).toFixed(3);
          s.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,0,0)';
        }
      });
    }

    function schedule(){ if (!raf) raf = requestAnimationFrame(frame); }
    function relayout(){ layout(); frame(); }

    relayout();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    const t = setTimeout(relayout, 350);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', relayout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [entries, lanes, laneCount, win, t0, tEnd, now]);

  const y0 = new Date(entries[0].start).getUTCFullYear();
  const y1 = new Date(tEnd).getUTCFullYear();

  return (
    <section className="tl-scene ab-sec" ref={sceneRef} style={{ height: (96 + entries.length * 42) + 'vh' }}>
      <div ref={headRef}><TimelineHead/></div>
      <div className="tl-sticky">
        <div className="tl-top shell" ref={topRef}>
          <span>The path</span>
          <span className="tabular">{y0} — {y1}</span>
        </div>
        <div className="tl-stage" ref={stageRef}>
          <div className="tl-track" ref={trackRef}>
            <div className="tl-axis"/>
            <div className="tl-axis tl-past" ref={pastRef}/>
            {marks.map((m, i) => (
              <React.Fragment key={m.t}>
                <span className={'tl-tick' + (m.year ? ' is-year' : '')} data-t={m.t}
                      ref={el => { markRefs.current[i * 2] = el; }}/>
                {m.year ? (
                  <span className="tl-year" data-t={m.t} ref={el => { markRefs.current[i * 2 + 1] = el; }}>{m.year}</span>
                ) : null}
              </React.Fragment>
            ))}
            {entries.map((e, i) => (
              <span key={'bar' + i} className={'tl-bar' + (e.upcoming ? ' up' : '')} ref={el => { barRefs.current[i] = el; }}>
                <span className="tl-bar-fill"/>
              </span>
            ))}
            {entries.map((e, i) => (
              <span key={'stem' + i} className="tl-stem" ref={el => { stemRefs.current[i] = el; }}/>
            ))}
            <span className="tl-today" ref={todayRef}><i/><span>Today</span></span>
            {entries.map((e, i) => (
              <FlipCard key={'card' + i} e={e} mode="stage" cardRef={el => { cardRefs.current[i] = el; }}/>
            ))}
          </div>
          <span className="tl-readout" ref={readRef}/>
          <span className="tl-cursor" ref={curRef}/>
        </div>
      </div>
    </section>
  );
}


// Phones + reduced motion: the same steps, stacked, with the dot coming down.
function TimelineList({ entries }){
  const rootRef = useRef(null), fillRef = useRef(null), itemRefs = useRef([]);
  useScrollFrame(() => {
    const root = rootRef.current; if (!root) return;
    const line = window.innerHeight * .62;
    itemRefs.current.forEach(el => {
      if (!el) return;
      el.classList.toggle('lit', el.getBoundingClientRect().top + 22 <= line);
    });
    const r = root.getBoundingClientRect();
    if (fillRef.current) fillRef.current.style.height = (clamp((line - r.top) / Math.max(1, r.height), 0, 1) * 100).toFixed(1) + '%';
  }, []);
  return (
    <section className="ab-sec">
      <TimelineHead/>
      <div className="shell" style={{ marginTop: 28 }}>
        <ol className="tl-v" ref={rootRef}>
          <span className="tl-v-axis" aria-hidden="true"><span className="tl-v-fill" ref={fillRef}/></span>
          {entries.map((e, i) => (
            <li className="tl-v-item" key={i} ref={el => { itemRefs.current[i] = el; }}>
              <span className="tl-v-node" aria-hidden="true"/>
              <FlipCard e={e} mode="list" className="rv rv-up"/>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Act 3 · what I'm into — a wall of pills ───────────────────────────────
   Four rows drift with the scroll, in alternating directions, and never on
   their own. The filled pills lead somewhere (an `href` in data.js); picking
   one says where, picking the others says honestly that nothing came of it
   yet. Each row repeats the list three times so its ends are never seen;
   only one copy is offered to keyboards and screen readers. */
function PillNote({ text, href }){
  const parts = String(text || '').split(/\[([^\]]+)\]/);
  return parts.map((t, i) => i % 2
    ? <Link key={i} to={href}>{t}</Link>
    : <React.Fragment key={i}>{t}</React.Fragment>);
}

function Passions(){
  const items = PROFILE().interests || [];
  const [pick, setPick] = useState(null);
  const wallRef = useRef(null);
  const rows = useMemo(() => {
    const n = items.length;
    return [0, 3, 5, 1].map(k => {
      const r = items.slice(k % n).concat(items.slice(0, k % n));
      return r.concat(r, r);
    });
  }, [items]);

  useScrollFrame(() => {
    const wall = wallRef.current; if (!wall) return;
    const vh = window.innerHeight, r = wall.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    const p = (vh - r.top) / (vh + r.height);
    Array.from(wall.children).forEach((row, i) => {
      const span = row.scrollWidth / 3, dir = i % 2 ? 1 : -1, base = -span * (.35 + i * .07);
      const x = reduceMotion() ? base : base + dir * (p - .5) * Math.min(520, span * .5);
      row.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    });
  }, [rows]);

  if (!items.length) return null;
  const picked = items.find(it => it.label === pick);
  const n = items.length;
  return (
    <section className="ab-sec ab-pass">
      <div className="shell">
        <header className="sec-head">
          <div>
            <span className="eyebrow rv rv-fade">03 — Off the clock</span>
            <Words as="h2" className="sec-title" text="What I'm into" dot/>
          </div>
          <p className="ab-pass-note rv rv-fade" style={{ '--d': '.12s' }}>Some of them turned into projects. Pick one.</p>
        </header>
      </div>
      <div className="ab-wall" ref={wallRef}>
        {rows.map((row, ri) => (
          <div className="ab-row" key={ri}>
            {row.map((it, i) => {
              const live = ri === 0 && i >= n && i < 2 * n;   // the one copy keyboards get
              const cls = 'ab-pill' + (it.href ? ' solid' : ((i + ri) % 5 === 3 ? ' ghost' : '')) + (pick === it.label ? ' on' : '');
              return (
                <button type="button" key={i} className={cls}
                        tabIndex={live ? 0 : -1} aria-hidden={live ? undefined : 'true'} aria-pressed={live ? pick === it.label : undefined}
                        onClick={() => setPick(it.label)}>
                  {it.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="shell">
        <div className="ab-pick" aria-live="polite">
          <span className="k">{picked ? picked.label : 'Pick a pill'}</span>
          <p>{picked
            ? (picked.note ? <PillNote text={picked.note} href={picked.href}/> : 'No project out of this one yet. Just something I love.')
            : 'The filled ones lead somewhere on the site.'}</p>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { About });
