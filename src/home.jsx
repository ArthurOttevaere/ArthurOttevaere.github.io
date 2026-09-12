// =============================================================================
//  home.jsx — the landing: hero, the dot that becomes the intro, selected work.
//
//  THE SCROLL, IN ONE PARAGRAPH
//  The hero is pinned for the first three screens. As you start scrolling the
//  name tightens (Archivo's width axis), then the orange dot of "ARTHUR●" grows
//  into a full-screen page where the intro fills in word by word, and finally
//  that page contracts back into the dot of "Things I've built●" — which is the
//  heading of the projects grid. One gesture, three acts, native scroll only.
// =============================================================================

const { useState, useEffect, useMemo, useRef } = React;

function Home({ ready }){
  const rootRef = useRef(null);
  useReveals(rootRef, []);
  return (
    <div className="page page-home" ref={rootRef}>
      <NightSky/>
      <HeroScene ready={ready}/>
      <Featured/>
      <ContactBlock/>
    </div>
  );
}

/* ── Hero + intro veil ─────────────────────────────────────────────────── */
function HeroScene({ ready }){
  const P = PROFILE();
  const animated = !reduceMotion();
  const clock  = useClock();
  const narrow = useMedia('(max-width: 860px)');

  const sceneRef = useRef(null);
  const nameRef  = useRef(null);
  const dotRef   = useRef(null);
  const veilRef  = useRef(null);
  const innerRef = useRef(null);
  const footRef  = useRef(null);
  const wordRefs = useRef([]);

  const full  = (P.name || 'Arthur Ottevaere').trim().split(/\s+/);
  const first = (full.shift() || '').toUpperCase();
  const last  = full.join(' ').toUpperCase();
  const words = useMemo(() => fillWords(P.tagline || ''), [P.tagline]);
  const year  = new Date().getFullYear();

  // Letters are individual spans so each can carry its own width — that is
  // what lets the name breathe under the cursor and tighten on scroll.
  const letters = (word, key) => Array.from(word).map((c, i) => (
    <span className="v" key={key + i}>{c === ' ' ? ' ' : c}</span>
  ));

  useEffect(() => {
    const nameEl = nameRef.current, dot = dotRef.current, veil = veilRef.current;
    if (!nameEl) return;
    const groups = Array.prototype.slice.call(nameEl.querySelectorAll('.hero-word'));
    const fitEl  = nameEl.querySelector('.hero-fit');
    const hover  = window.matchMedia('(hover: hover)').matches && !reduceMotion();
    let mx = -1e5, my = -1e5, raf = 0;
    const narrow = () => window.innerWidth <= 860;

    // width of every letter: from its rest value to its scrolled value, plus
    // a bump for whatever the cursor is near (wide letters tighten, narrow
    // ones open — the contrast is the point).
    function paint(p, withHover){
      const t = smooth(clamp(p, 0, 1));
      const items = [];
      groups.forEach(g => {
        const w0 = +(narrow() ? g.dataset.m0 : g.dataset.w0);
        const w1 = +(narrow() ? g.dataset.m1 : g.dataset.w1);
        const base = lerp(w0, w1, t), wg = +g.dataset.wg;
        Array.prototype.forEach.call(g.children, s => items.push({ s, base, wg }));
      });
      const rects = withHover ? items.map(it => it.s.getBoundingClientRect()) : null;
      items.forEach((it, i) => {
        let k = 0;
        if (rects){
          const r = rects[i];
          k = smooth(1 - Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my) / 190);
        }
        const dir = it.base > 96 ? -1 : 1;
        const wd  = clamp(it.base + dir * k * 40, 62, 125);
        it.s.style.fontVariationSettings = "'wdth' " + wd.toFixed(1) + ", 'wght' " + Math.round(it.wg + k * 26);
      });
    }

    // The last name always spans the full width, whatever the screen.
    function fit(){
      if (!fitEl) return;
      paint(0, false);
      const avail = nameEl.clientWidth;
      if (!avail) return;
      nameEl.style.fontSize = '100px';
      const w = fitEl.getBoundingClientRect().width;
      if (w > 0) nameEl.style.fontSize = (100 * avail / w).toFixed(2) + 'px';
    }

    function frame(){
      raf = 0;
      const vh = window.innerHeight, vw = window.innerWidth, y = window.scrollY;
      const G0 = .18 * vh, G1 = .86 * vh, F0 = .95 * vh, F1 = 2.0 * vh;

      paint(y / G1, hover && mx > -1e4 && y < G1);
      if (!veil || !dot) return;

      const fd  = document.getElementById('featured-dot');
      const fdr = fd ? fd.getBoundingClientRect() : null;
      // scroll position at which the projects heading sits 30% down the screen
      const S1 = fdr ? (y + fdr.top + fdr.height / 2 - .30 * vh) : Infinity;
      const S0 = Math.max(F1 + .08 * vh, S1 - .8 * vh);

      const dr = dot.getBoundingClientRect();
      const c0 = { x: dr.left + dr.width / 2, y: dr.top + dr.height / 2, r: dr.width / 2 };

      let show = false, cx = 0, cy = 0, r = 0, t, fade = 1;
      if (y > G0 && y < G1){                       // the dot opens
        t = easeIO((y - G0) / (G1 - G0));
        show = true; cx = c0.x; cy = c0.y;
        r = lerp(c0.r, coverRadius(cx, cy, vw, vh), t);
      } else if (y >= G1 && y < S0){               // it holds the screen
        show = true; cx = c0.x; cy = c0.y; r = coverRadius(cx, cy, vw, vh);
      } else if (fdr && y >= S0 && y < S1){        // it closes into the next dot
        t = easeIO((y - S0) / (S1 - S0));
        cx = fdr.left + fdr.width / 2; cy = fdr.top + fdr.height / 2;
        show = true;
        r = lerp(coverRadius(cx, cy, vw, vh), fdr.width / 2, t);
        fade = 1 - clamp(t * 1.8, 0, 1);           // the words leave before the disc does
      }
      veil.style.visibility = show ? 'visible' : 'hidden';
      if (show) veil.style.clipPath = 'circle(' + r.toFixed(1) + 'px at ' + cx.toFixed(1) + 'px ' + cy.toFixed(1) + 'px)';
      if (innerRef.current) innerRef.current.style.opacity = fade.toFixed(3);

      // the intro fills in, word by word
      const f = clamp((y - F0) / (F1 - F0), 0, 1);
      const spans = wordRefs.current, spread = 3.4, head = f * (spans.length + spread);
      spans.forEach((s, i) => { if (s) s.style.opacity = (.2 + .8 * clamp((head - i) / spread, 0, 1)).toFixed(3); });
      if (footRef.current) footRef.current.classList.toggle('on', f > .72);
    }

    function schedule(){ if (!raf) raf = requestAnimationFrame(frame); }
    function onMove(e){ mx = e.clientX; my = e.clientY; schedule(); }
    function onLeave(){ mx = my = -1e5; schedule(); }
    function relayout(){ fit(); frame(); }

    fit();
    if (!animated){ paint(0, false); return; }
    frame();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', relayout);
    if (hover){
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerleave', onLeave);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    const t1 = setTimeout(relayout, 400);

    return () => {
      clearTimeout(t1);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', relayout);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [animated]);

  const note  = P.heroNote || '';
  const role  = P.role || 'Business Engineering — Analytics';
  const place = P.location || 'Tournai, BE';

  return (
    <>
      <section className={'hero-scene' + (animated ? ' is-animated' : '')} ref={sceneRef}>
        <div className="hero-sticky">
          <div className={'hero' + (ready ? ' in' : '')}>
            {/* Phones get one label up here, not two: the place and the clock
                move down to the foot, so the top of the screen is a single
                quiet line and the name has the whole middle to itself. */}
            <div className="hero-row hero-top">
              <span className="tag">{role}</span>
              {narrow ? null : <span className="tag">{place} · <b>{clock}</b></span>}
            </div>
            <span className="hero-lead" aria-hidden="true"/>

            <h1 className="hero-name" ref={nameRef} aria-label={P.name}>
              <span className="hero-l1">
                <span className="mask"><span className="mask-in" style={{ '--i': 0 }}>
                  <span className="hero-word" aria-hidden="true"
                        data-w0="62" data-w1="62" data-m0="62" data-m1="62" data-wg="850">{letters(first, 'a')}</span>
                </span></span>
                <span className="hero-dot" id="hero-dot" ref={dotRef}/>
                {P.heroPhoto ? <img className="hero-photo" src={P.heroPhoto} alt="" decoding="async"/> : null}
                {note && !narrow ? <span className="hero-note">{note}</span> : null}
              </span>
              <span className="hero-l2">
                <span className="mask"><span className="mask-in" style={{ '--i': 1 }}>
                  {/* The last name always spans the full width, so its resting
                      width axis is what sets the size of the whole name. Phones
                      hold it narrower than the desktop's 125 (m0) — same line
                      length, bigger type, more of the screen used. */}
                  <span className="hero-word hero-fit" aria-hidden="true"
                        data-w0="125" data-w1="72" data-m0="88" data-m1="72" data-wg="850">{letters(last, 'b')}</span>
                </span></span>
              </span>
            </h1>

            {/* The hairline closes the name on phones — the note that used to
                sit here says the same thing as the intro screen right after. */}
            <span className="hero-rule" aria-hidden="true"/>
            <span className="hero-tail" aria-hidden="true"/>

            <div className="hero-row hero-bottom">
              <span className="tag">{narrow ? <>{place} · <b>{clock}</b></> : <>©{year} — Portfolio</>}</span>
              <div className="hero-ctas">
                <Link to="/work/" className="btn btn-ink">View projects <Icon.ArrowUR/></Link>
                {narrow ? null : (
                  <a href="#contact" className="btn btn-line"
                     onClick={e => { e.preventDefault(); scrollToEl(document.getElementById('contact'), -60); }}>
                    Get in touch
                  </a>
                )}
              </div>
              <ScrollBadge/>
            </div>
          </div>
        </div>
      </section>

      {animated ? (
        <div className="veil" ref={veilRef} aria-hidden="false">
          <div className="veil-inner" ref={innerRef}>
            <span className="veil-eyebrow">Intro</span>
            <p className="veil-text">
              {words.map((o, i) => {
                const props = { key: i, className: 'wd', ref: el => { wordRefs.current[i] = el; } };
                return o.em ? <em {...props}>{o.w}{' '}</em> : <span {...props}>{o.w}{' '}</span>;
              })}
            </p>
            <div className="veil-foot" ref={footRef}>
              <IntroCta/>
            </div>
          </div>
        </div>
      ) : (
        <section className="intro-static">
          <div className="shell veil-inner">
            <span className="veil-eyebrow">Intro</span>
            <p className="veil-text">{emphasise(P.tagline || '')}</p>
            <div className="veil-foot on"><IntroCta/></div>
          </div>
        </section>
      )}
    </>
  );
}

/* ── The way out of the intro ──────────────────────────────────────────────
   The orange page is the one moment the whole screen belongs to a single
   idea, so it is also the best place to send people to the long version of
   the story. The link is a real button, not a footnote. */
function IntroCta(){
  return (
    <>
      <p className="veil-cta-note">{COPY('introCta', 'The rest of the story — the path, the toolkit, the person.')}</p>
      <Link to="/about/" className="veil-cta">
        <span>About me</span>
        <span className="veil-cta-i" aria-hidden="true"><Icon.ArrowUR/></span>
      </Link>
    </>
  );
}

/* ── Selected work — the featured grid ─────────────────────────────────── */
function Featured(){
  const all   = PROJS();
  const picks = DATA().homeDeck;
  const chosen = (Array.isArray(picks) && picks.length)
    ? picks.map(id => all.find(p => p.id === id)).filter(Boolean)
    : [...all].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const list = chosen.slice(0, 4);
  if (!list.length) return null;
  return (
    <section className="featured" id="work">
      <div className="shell">
        <header className="sec-head">
          <div>
            <span className="eyebrow rv rv-fade">Selected work</span>
            <Words as="h2" className="sec-title" text="Things I've built" dot dotId="featured-dot"/>
          </div>
          <Link to="/work/" className="link-arrow rv rv-fade" style={{ '--d': '.12s' }}>
            View all work <Icon.ArrowUR/>
          </Link>
        </header>
        <div className="feat-grid">
          {list.map((p, i) => <ProjectCard key={p.id} p={p} delay={(i % 2) * .09}/>)}
        </div>
      </div>
    </section>
  );
}

/* ── The night sky (dark theme only) ───────────────────────────────────────
   The top half of the site's arc — sky here, the fir forest in the footer as
   ground. Nothing animates on its own: only your scroll (parallax) and your
   cursor (the links between stars) move it, and the whole thing stops the
   moment you do. One viewport-sized fixed canvas, not a page-tall one, so an
   endless sky costs a fixed amount of memory. */
function NightSky(){
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const hover = window.matchMedia('(hover: hover)').matches;
    const LINK = 118, REACH = 210, PARALLAX = .55;
    let w = 0, h = 0, raf = 0, mx = -9999, my = -9999, stars = [];
    let night = true, fg = '#fafafa', accent = '#FF6E40', fade = 1, sy = 0;
    const wrap = (v, max) => ((v % max) + max) % max;

    function readTheme(){
      const cs = getComputedStyle(document.documentElement);
      fg     = (cs.getPropertyValue('--ink')    || '#ffffff').trim();
      accent = (cs.getPropertyValue('--accent') || '#FF6E40').trim();
      night  = document.documentElement.getAttribute('data-theme') === 'dark';
    }
    function populate(){
      if (!w || !h) return;
      const n = Math.round(Math.max(34, Math.min(105, (w * h) / 17000)));
      stars = Array.from({ length: n }, () => {
        const depth = Math.random();
        return { x: Math.random() * w, y: Math.random() * h, r: .5 + depth * 1.3, a: .13 + depth * .34, p: PARALLAX * (.3 + .7 * depth) };
      });
    }
    function resize(){
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
    }
    function skyFade(){
      const foot = document.querySelector('.foot');
      if (!foot) return 1;
      return clamp(foot.getBoundingClientRect().top / window.innerHeight, 0, 1);
    }
    function draw(){
      ctx.clearRect(0, 0, w, h);
      if (!night || fade <= .001) return;
      const pts = stars.map(s => ({ x: s.x, y: wrap(s.y - sy * s.p, h), r: s.r, a: s.a }));
      if (hover && mx > -9998){
        const near = pts.filter(p => Math.hypot(p.x - mx, p.y - my) < REACH);
        ctx.strokeStyle = accent; ctx.lineWidth = .7;
        for (let i = 0; i < near.length; i++){
          for (let j = i + 1; j < near.length; j++){
            const a = near[i], b = near[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d > LINK) continue;
            const mid = Math.hypot((a.x + b.x) / 2 - mx, (a.y + b.y) / 2 - my);
            ctx.globalAlpha = (1 - d / LINK) * (1 - mid / REACH) * .5 * fade;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts){
        const k = hover ? Math.max(0, 1 - Math.hypot(p.x - mx, p.y - my) / REACH) : 0;
        ctx.globalAlpha = Math.min(1, p.a + k * .42) * fade;
        ctx.fillStyle = k > .45 ? accent : fg;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + k * .5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function render(){ raf = 0; sy = window.scrollY; fade = skyFade(); draw(); }
    function schedule(){ if (!raf) raf = requestAnimationFrame(render); }
    function onMove(e){ mx = e.clientX; my = e.clientY; schedule(); }
    function onLeave(){ mx = my = -9999; schedule(); }
    function onResize(){ resize(); schedule(); }
    function onTheme(){ readTheme(); schedule(); }

    readTheme(); resize(); render();
    const obs = new MutationObserver(onTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} className="sky" aria-hidden="true"/>;
}

Object.assign(window, { Home });
