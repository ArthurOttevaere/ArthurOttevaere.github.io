// =============================================================================
//  about.jsx — the story: the bio that fills in as you scroll (with the little
//  floating card for the CV and LinkedIn), the timeline you travel through,
//  the toolkit, and what I'm into.
// =============================================================================

const { useState, useEffect, useMemo, useRef } = React;

const MONTH = 30.44 * 864e5;

function About(){
  const ref    = useRef(null);
  const narrow = useMedia('(max-width: 860px)');
  useReveals(ref, [narrow]);
  return (
    <div className="page" ref={ref}>
      <AboutIntro narrow={narrow}/>
      <Timeline narrow={narrow}/>
      <Toolkit/>
      <Interests/>
      <AboutCta/>
    </div>
  );
}

/* ── Act 1 · the bio, filling in ───────────────────────────────────────── */
function AboutIntro({ narrow }){
  const P = PROFILE();
  const animated = !reduceMotion();
  const sceneRef = useRef(null);
  const bioRef   = useRef(null);
  const wordRefs = useRef([]);

  const paras = [P.bio && P.bio[0], P.bio && P.bio[1]].filter(Boolean).map(t => t.split(/\s+/).filter(Boolean));
  const offsets = []; { let acc = 0; paras.forEach(w => { offsets.push(acc); acc += w.length; }); }
  const total = offsets.length ? offsets[offsets.length - 1] + paras[paras.length - 1].length : 0;

  /* Two ways to measure the same gesture. On desktop the scene is pinned and
     its scroll runway IS the progress. On phones nothing is pinned — the block
     just scrolls by — so the fill tracks the bio's own travel up the screen.
     The branch has to be the breakpoint, not `runway > 0`: on a phone the
     scene is taller than the screen too, and that runway is only a couple of
     hundred pixels, so the words would all light up at once. */
  useScrollFrame(() => {
    const spans = wordRefs.current;
    if (!animated){ spans.forEach(s => { if (s) s.style.opacity = 1; }); return; }
    const scene = sceneRef.current; if (!scene) return;
    const vh = window.innerHeight;
    let p;
    if (narrow){
      // The bio is already on screen when the page loads, so a plain "crossing
      // a reading line" mapping would land mid-fill. Start where the block
      // actually is: at the top of the page if it begins above the line,
      // otherwise the moment it crosses it.
      const b = (bioRef.current || scene).getBoundingClientRect();
      const start = Math.max(0, b.top + window.scrollY - vh * .74);
      const range = Math.max(1, b.height * .6 + vh * .18);
      p = clamp((window.scrollY - start) / range, 0, 1);
    } else {
      const r = scene.getBoundingClientRect();
      const runway = r.height - vh;
      p = runway > 0 ? clamp(-r.top / runway, 0, 1) : clamp((vh - r.top) / vh, 0, 1);
    }
    const spread = 3.4, head = clamp(p / .78, 0, 1) * (total + spread);
    spans.forEach((s, i) => { if (s) s.style.opacity = (.16 + .84 * clamp((head - i) / spread, 0, 1)).toFixed(3); });
  }, [total, animated, narrow]);

  return (
    <section className={'ab-scene' + (animated ? ' is-animated' : '')} ref={sceneRef}>
      <div className="ab-sticky">
        <div className="shell">
          <div className="ab-grid">
            <div>
              {/* the page needs a heading of its own; the design's is the bio */}
              <h1 className="sr-only">About {P.name}</h1>
              <span className="eyebrow rv rv-fade">About</span>
              <div className="ab-bio" ref={bioRef} style={{ marginTop: 18 }}>
                {paras.map((wa, pi) => (
                  <p key={pi}>
                    {wa.map((w, wi) => {
                      const idx = offsets[pi] + wi;
                      return <span className="wd" key={wi} ref={el => { wordRefs.current[idx] = el; }}>{w}{wi < wa.length - 1 ? ' ' : ''}</span>;
                    })}
                  </p>
                ))}
              </div>
            </div>
            <IdCard/>
          </div>
        </div>
      </div>
    </section>
  );
}

// The little floating card: who, where, and the two links people come for.
function IdCard(){
  const P   = PROFILE();
  const cvs = useCvLinks();
  const age = computeAge(P.birth);
  return (
    <aside className="idcard rv rv-up" aria-label="Card">
      {P.photo ? <span className="idcard-av"><img src={P.photo} alt="" decoding="async"/></span> : null}
      <span className="idcard-n">{P.name}</span>
      <span className="idcard-m">{P.location}{age ? ' · ' + age : ''}</span>
      {P.status ? <span className="idcard-s"><i/>{P.status}</span> : null}
      <span className="idcard-b">
        {cvs.map((c, i) => (
          <a key={c.lang} href={c.href} target="_blank" rel="noopener noreferrer"
             className={'btn btn-sm ' + (i === 0 ? 'btn-accent' : 'btn-line')}>
            CV{cvs.length > 1 ? ' · ' + c.lang.toUpperCase() : ''} <Icon.Download/>
          </a>
        ))}
        {P.linkedin && P.linkedin !== '#' ? (
          <a className="btn btn-sm btn-line" href={P.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn <Icon.ArrowUR/>
          </a>
        ) : null}
      </span>
    </aside>
  );
}

/* ── Act 2 · the timeline you travel through ──────────────────────────────
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
      <span className="eyebrow rv rv-fade">The path</span>
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
              <article key={'card' + i} className={'tl-card' + (e.upcoming ? ' up' : '')} ref={el => { cardRefs.current[i] = el; }}>
                <TimelineCardBody e={e}/>
              </article>
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
              <div className={'tl-card rv rv-up' + (e.upcoming ? ' up' : '')}>
                <TimelineCardBody e={e}/>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Act 3 · the toolkit ───────────────────────────────────────────────── */
function Toolkit(){
  const P = PROFILE();
  const groups = (P.toolGroups && P.toolGroups.length)
    ? P.toolGroups
    : [{ label: 'Toolkit', items: (P.tools || []).map(t => [t, t.slice(0, 2)]) }];
  const langs = P.languages || [];
  if (!groups.length) return null;
  return (
    <section className="ab-sec">
      <div className="shell">
        <span className="eyebrow rv rv-fade">The toolkit</span>
        <Words as="h2" className="sec-title" text="What I build with" dot/>
        <div className="tools-rows" style={{ marginTop: 'clamp(28px,3.5vw,48px)' }}>
          {groups.map((g, i) => (
            <div className="trow rv rv-up" key={i} style={{ '--d': (i * .05) + 's' }}>
              <span className="trow-k">{g.label}</span>
              <span className="trow-v">
                {(g.items || []).map((it, j) => (
                  <span className="titem" key={j}>
                    {it[2] ? <img className={it[3] ? 'is-mono' : undefined} src={it[2]} alt="" loading="lazy" decoding="async"/> : null}
                    {it[0]}
                  </span>
                ))}
              </span>
            </div>
          ))}
          {langs.length ? (
            <div className="trow rv rv-up" style={{ '--d': (groups.length * .05) + 's' }}>
              <span className="trow-k">Languages</span>
              <span className="trow-v">
                {langs.map((l, j) => (
                  <span className="titem" key={j}>
                    {l[2] ? <img className="lang-flag" src={l[2]} alt="" loading="lazy" decoding="async"/> : null}
                    {l[0]} <em>{l[1]}</em>
                  </span>
                ))}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ── Act 4 · what I'm into — two lines of moving type ──────────────────── */
function Interests(){
  const items = PROFILE().interests || [];
  if (!items.length) return null;
  return (
    <section className="ab-sec">
      <div className="shell">
        <header className="sec-head">
          <div>
            <span className="eyebrow rv rv-fade">Beyond the data</span>
            <Words as="h2" className="sec-title" text="What I'm into" dot/>
          </div>
          <Link to="/outside/" className="link-arrow rv rv-fade" style={{ '--d': '.12s' }}>
            The rest of it <Icon.ArrowUR/>
          </Link>
        </header>
      </div>
      <div style={{ marginTop: 'clamp(28px,3.5vw,50px)' }}>
        <MarqueeRow items={items} dir={-1} variant="wide"/>
        <MarqueeRow items={items.slice().reverse()} dir={1} variant="narrow"/>
      </div>
    </section>
  );
}

function MarqueeRow({ items, dir, variant }){
  const trackRef = useRef(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduceMotion()) return;
    let raf = 0, x = 0, half = 0, last = performance.now(), vel = 0, lastY = window.scrollY, alive = true;
    const measure = () => { half = track.scrollWidth / 2; };
    measure();
    function loop(){
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(64, now - last); last = now;
      const sy = window.scrollY, dy = sy - lastY; lastY = sy;
      vel = vel * .86 + dy * .14;
      const speed = .028 + Math.min(.26, Math.abs(vel) * .004);     // px per ms
      x += speed * dt;
      if (half > 0) x = x % half;
      track.style.transform = 'translate3d(' + (dir < 0 ? -x : x - half) + 'px,0,0)';
    }
    const io = new IntersectionObserver(es => {
      const on = es[0].isIntersecting;
      if (on && !raf){ last = performance.now(); lastY = window.scrollY; loop(); }
      if (!on && raf){ cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: '120px' });
    io.observe(track);
    window.addEventListener('resize', measure);
    return () => { alive = false; io.disconnect(); window.removeEventListener('resize', measure); if (raf) cancelAnimationFrame(raf); };
  }, [dir]);

  const row = dup => items.map((it, i) => {
    const Glyph = Icon[it.icon] || Icon.Dot;
    return (
      <span className="mq-item" key={dup + '-' + i}>
        <Glyph/>{it.label}<span className="mq-sep" aria-hidden="true"/>
      </span>
    );
  });

  return (
    <div className={'marquee ' + (variant || '')} aria-hidden={dir > 0 ? 'true' : undefined}>
      <div className="marquee-track" ref={trackRef}>{row(0)}{row(1)}</div>
    </div>
  );
}

function AboutCta(){
  return (
    <div className="shell">
      <div className="ab-cta">
        <p className="rv rv-up">{COPY('aboutCta', 'Got an internship, a project, or just a question?')}</p>
        <Link to="/contact/" className="btn btn-ink rv rv-up" style={{ '--d': '.08s' }}>Let's talk <Icon.ArrowUR/></Link>
      </div>
    </div>
  );
}

Object.assign(window, { About });
