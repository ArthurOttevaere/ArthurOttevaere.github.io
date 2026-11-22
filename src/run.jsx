// =============================================================================
//  run.jsx — the dot goes for a run.
//
//  Three things live here, all built on the one orange dot:
//   · RunGame     — a one-button runner: the dot sprints down a track and
//                   clears athletics hurdles. Distance in km, pace per km,
//                   a personal best kept in this browser.
//   · RunOverlay  — the game full-screen, from anywhere: type "run", the
//                   Konami code, or window.dispatchEvent(new Event('ao:run')).
//   · useRunaway  — click the dot of ARTHUR● five times and it leaves for a
//                   run, then comes back out of breath (home.jsx wires it).
//  The 404 page embeds the game in attract mode (the dot plays itself).
// =============================================================================

const { useState: useStateR, useEffect: useEffectR, useRef: useRefR } = React;

const RUN_PB_KEY = 'ao-run-pb';
const readPB  = () => { try { return +(localStorage.getItem(RUN_PB_KEY) || 0) || 0; } catch (e) { return 0; } };
const writePB = m  => { try { localStorage.setItem(RUN_PB_KEY, String(Math.round(m))); } catch (e) {} };

const fmtKm   = m => m < 1000 ? Math.floor(m) + ' m' : (m / 1000).toFixed(2) + ' km';
function fmtPace(speedMs){                        // m/s → "4:32 /km"
  if (!(speedMs > 0)) return '–:–– /km';
  const s = Math.round(1000 / speedMs);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' /km';
}
function fmtTime(sec){
  const s = Math.round(sec);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

/* ── The game ──────────────────────────────────────────────────────────── */
// The world is in CSS pixels and 1 px = 1 cm, so 330 px/s is 3.3 m/s — a
// 5:03 /km jog — and the cap of 760 px/s is a 2:12 /km sprint.
const G        = 2700;      // gravity, px/s²
const JUMP_V   = 780;       // take-off speed
const HOLD_G   = .42;       // gravity while the button is held on the way up
const HOLD_MAX = .2;        // s of hold that still counts
const V0 = 330, V_MAX = 760, V_ACC = 11;   // px/s, px/s², per second of race

function RunGame({ attract = false, autoFocus = false, onFirstPlay }){
  const wrapRef   = useRefR(null);
  const canvasRef = useRefR(null);
  const [hud, setHud]   = useStateR({ state: attract ? 'attract' : 'ready', m: 0, pace: V0 / 100, pb: readPB(), split: null, newPb: false, t: 0 });
  const firstPlay = useRefR(onFirstPlay);
  firstPlay.current = onFirstPlay;

  useEffectR(() => {
    const wrap = wrapRef.current, cv = canvasRef.current;
    if (!wrap || !cv) return;
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, ground = 0, dpr = 1, raf = 0, last = 0, alive = true, visible = true;
    let col = {};

    function colours(){
      const cs = getComputedStyle(document.documentElement);
      const v = n => cs.getPropertyValue(n).trim();
      col = { ink: v('--ink'), accent: v('--accent'), muted: v('--muted'), faint: v('--faint'), rule: v('--rule-2'), mono: v('--f-mono') || 'monospace' };
    }
    function size(){
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(280, Math.round(r.width)); H = Math.round(r.height);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ground = H - Math.max(34, Math.round(H * .2));
    }
    colours(); size();

    // ── state
    const R = 10;                                     // dot radius
    let S;                                            // the run in progress
    function fresh(mode){
      S = {
        mode,                                         // 'attract' | 'ready' | 'run' | 'over'
        x: Math.round(Math.min(110, W * .16)), y: 0, vy: 0,
        onGround: true, held: false, holdT: 0, squash: 0, gait: 0,
        speed: V0, dist: 0, time: 0, obs: [], nextGap: 520,
        nextSplit: 400, shake: 0, crashAt: null,
      };
    }
    fresh(attract ? 'attract' : 'ready');
    let pb = readPB();
    let hudT = 0;
    const pushHud = (extra) => setHud(h => ({ ...h, state: S.mode, m: S.mode === 'attract' ? 0 : S.dist, pace: S.speed / 100, pb, t: S.time, ...extra }));

    // ── obstacles: athletics hurdles, a tall barrier, and pairs
    function spawn(){
      const v = S.speed, k = clamp((v - V0) / (V_MAX - V0), 0, 1);
      const r = Math.random();
      const x = W + 30;
      if (r < .16 + k * .14 && S.dist > 120){         // a pair, cleared in one jump
        const h = 22 + Math.random() * 6;
        S.obs.push({ x, w: 16, h, kind: 'hurdle' }, { x: x + 30, w: 16, h, kind: 'hurdle' });
      } else if (r < .42){                            // the barrier
        S.obs.push({ x, w: 12, h: 40 + Math.random() * (10 + k * 10), kind: 'wall' });
      } else {
        S.obs.push({ x, w: 18, h: 24 + Math.random() * 14, kind: 'hurdle' });
      }
      // room to land and take off again, shrinking a little as you speed up
      const air = 2 * JUMP_V / G;
      S.nextGap = v * (air + .32) + Math.random() * v * (1.05 - k * .45) + 40;
    }

    // ── input
    function press(){
      if (S.mode === 'attract' || S.mode === 'ready' || S.mode === 'over'){
        if (S.mode === 'over' && performance.now() - S.crashAt < 450) return;   // no instant restarts by accident
        fresh('run'); pushHud({ split: null, newPb: false });
        if (firstPlay.current) firstPlay.current();
      }
      if (S.onGround){ S.vy = -JUMP_V; S.onGround = false; S.squash = -.35; S.holdT = 0; }
      S.held = true;
    }
    function release(){ S.held = false; }

    const isTyping = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    const onKey = e => {
      if (!visible || isTyping(document.activeElement)) return;
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W'){
        e.preventDefault();
        if (e.type === 'keydown'){ if (!e.repeat) press(); } else release();
      }
    };
    const onDown = e => { e.preventDefault(); press(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    wrap.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);

    // ── the attract mode jumps for itself, a beat before each obstacle
    function autopilot(){
      const o = S.obs.find(o => o.x + o.w > S.x - R);
      if (!o) { S.held = false; return; }
      const lead = o.x - (S.x + R);
      const want = o.kind === 'wall' || o.h > 34;
      if (S.onGround && lead > 0 && lead < S.speed * (want ? .17 : .13)){
        S.vy = -JUMP_V; S.onGround = false; S.squash = -.35; S.holdT = 0; S.held = want;
      }
      if (!S.onGround && S.vy > 0) S.held = false;
    }

    function hit(o){
      const cx = S.x, cy = ground - R - S.y;
      const rx = o.x + 2, ry = ground - o.h + 2, rw = o.w - 4, rh = o.h - 2;
      const nx = clamp(cx, rx, rx + rw), ny = clamp(cy, ry, ry + rh);
      return (cx - nx) ** 2 + (cy - ny) ** 2 < (R - 1.5) ** 2;
    }

    function step(dt){
      if (S.mode === 'over' || S.mode === 'ready'){ S.shake = Math.max(0, S.shake - dt); S.squash *= Math.pow(.001, dt); return; }
      if (S.mode === 'attract') autopilot();
      S.time += dt;
      if (S.mode === 'run') S.speed = Math.min(V_MAX, V0 + V_ACC * S.time);
      else S.speed = 360;
      const dx = S.speed * dt;
      S.dist += dx / 100;

      // vertical
      if (!S.onGround){
        const holding = S.held && S.vy < 0 && S.holdT < HOLD_MAX;
        if (holding) S.holdT += dt;
        S.vy += G * (holding ? HOLD_G : 1) * dt;
        S.y -= S.vy * dt;
        if (S.y <= 0){ S.y = 0; S.vy = 0; S.onGround = true; S.squash = .45; }
      }
      S.squash *= Math.pow(.002, dt);
      if (S.onGround) S.gait += dt * S.speed / 34;

      // obstacles
      S.nextGap -= dx;
      if (S.nextGap <= 0) spawn();
      S.obs.forEach(o => { o.x -= dx; });
      S.obs = S.obs.filter(o => o.x + o.w > -20);
      if (S.obs.some(hit)){
        if (S.mode === 'attract'){ S.obs = []; S.nextGap = 300; return; }   // the demo never loses
        S.mode = 'over'; S.crashAt = performance.now(); S.shake = .18; S.squash = .6;
        const newPb = S.dist > pb + .5 && S.dist >= 50;   // 10 m is not a record
        if (S.dist > pb){ pb = S.dist; writePB(pb); }
        pushHud({ newPb });
        return;
      }

      // splits
      if (S.mode === 'run' && S.dist >= S.nextSplit){
        pushHud({ split: { lap: S.nextSplit / 400, time: fmtTime(S.time), at: performance.now() } });
        S.nextSplit += 400;                         // one lap of a track
      }
      hudT += dt;
      if (hudT > .1){ hudT = 0; pushHud({}); }
    }

    // ── drawing
    function draw(){
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (S.shake > 0) ctx.translate((Math.random() - .5) * 6 * (S.shake / .18), 0);

      // the track: one line, a tick every metre, a numbered marker every 10 m
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, ground + .75); ctx.lineTo(W, ground + .75); ctx.stroke();
      const offPx = (S.dist * 100);
      ctx.strokeStyle = col.rule; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -(offPx % 100); x < W; x += 100){ ctx.moveTo(x, ground + 6); ctx.lineTo(x, ground + 10); }
      ctx.stroke();
      ctx.fillStyle = col.muted; ctx.font = '10.5px ' + col.mono; ctx.textBaseline = 'top';
      const first = Math.floor(offPx / 1000);
      for (let i = first; i < first + Math.ceil(W / 1000) + 2; i++){
        const x = i * 1000 - offPx + S.x;
        if (x < -60 || x > W + 60 || i <= 0) continue;
        ctx.fillRect(x, ground + 4, 1, 12);
        ctx.fillText((i * 10) + ' m', x + 5, ground + 9);
      }

      // hurdles: two legs, a top bar; the barrier is a solid block
      S.obs.forEach(o => {
        const top = ground - o.h;
        ctx.fillStyle = col.ink;
        if (o.kind === 'wall'){
          ctx.fillRect(o.x, top, o.w, o.h);
        } else {
          ctx.fillRect(o.x, top, o.w, 4);             // the bar
          ctx.fillRect(o.x + o.w - 2.5, top, 2.5, o.h);   // the leg you see
          ctx.fillRect(o.x + o.w - 6, ground - 1.5, 9, 1.5);  // its foot
        }
      });

      // the dot: a little bounce on every stride, stretched in the air,
      // squashed when it lands
      let sx = 1, sy = 1, lift = 0;
      if (S.mode === 'over'){
        sx = 1.25; sy = .78;
      } else if (S.onGround){
        const b = Math.abs(Math.sin(S.gait));
        lift = (S.mode === 'ready') ? 0 : b * 3.2;
        const q = S.squash + (S.mode === 'ready' ? 0 : (1 - b) * .08);
        sx = 1 + q * .5; sy = 1 - q * .5;
      } else {
        const st = clamp(Math.abs(S.vy) / JUMP_V, 0, 1) * .16;
        sx = 1 - st; sy = 1 + st;
      }
      const cy = ground - S.y - lift - R * sy;
      ctx.fillStyle = col.accent;
      ctx.beginPath();
      ctx.ellipse(S.x, cy, R * sx, R * sy, 0, 0, Math.PI * 2);
      ctx.fill();
      // its shadow, shrinking as it rises
      if (S.y > 1){
        const k = clamp(1 - S.y / 150, .25, 1);
        ctx.fillStyle = col.faint; ctx.globalAlpha = .45 * k;
        ctx.beginPath(); ctx.ellipse(S.x, ground - .5, R * k, 1.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function loop(now){
      raf = 0;
      if (!alive) return;
      const dt = Math.min(1 / 30, (now - (last || now)) / 1000);
      last = now;
      step(dt); draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    }
    const kick = () => { if (!raf && alive && visible && !document.hidden){ last = 0; raf = requestAnimationFrame(loop); } };
    kick();

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(wrap);
    const onVis = () => { if (!document.hidden) kick(); else if (S.mode === 'run') { /* a hidden tab pauses the race */ } };
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(wrap);
    const mo = new MutationObserver(() => { colours(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (autoFocus) wrap.focus({ preventScroll: true });

    return () => {
      alive = false; cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect(); mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      wrap.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, [attract]);

  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const go = coarse ? 'Tap' : 'Space';
  const splitOn = hud.split && hud.state === 'run' && performance.now() - hud.split.at < 2200;

  return (
    <div className="rg">
      <div className="rg-hud">
        <span className="rg-dist">{fmtKm(hud.m)}</span>
        <span className="rg-pace">{hud.state === 'run' ? fmtPace(hud.pace) : ''}</span>
        <span className="rg-pb">{hud.pb > 0 ? 'PB ' + fmtKm(hud.pb) : 'No PB yet'}</span>
      </div>
      <div className="rg-stage" ref={wrapRef} tabIndex={-1} role="application"
           aria-label={'Running game. Press ' + go + ' to jump; hold it to jump higher.'}>
        <canvas ref={canvasRef} aria-hidden="true"/>
        <div className={'rg-msg' + (hud.state === 'run' && !splitOn ? '' : ' on')} aria-live="polite">
          {hud.state === 'attract' ? <><b>{go}</b> to race the dot</> : null}
          {hud.state === 'ready'   ? <><b>{go}</b> to start · hold to jump higher</> : null}
          {hud.state === 'run' && splitOn ? <>Lap {hud.split.lap} · <b>{hud.split.time}</b></> : null}
          {hud.state === 'over' ? (
            <>{hud.newPb ? <span className="rg-new">New PB</span> : <span className="rg-dnf">DNF</span>}
              {' '}{fmtKm(hud.m)} in {fmtTime(hud.t)} · <b>{go}</b> to go again</>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ── Full-screen, from anywhere ────────────────────────────────────────── */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

function RunOverlay(){
  const [open, setOpen] = useStateR(false);
  const closeRef = useRefR(null);

  useEffectR(() => {
    let typed = '', kon = 0;
    const isTyping = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    const onKey = e => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      kon = (k === KONAMI[kon]) ? kon + 1 : (k === KONAMI[0] ? 1 : 0);
      if (kon === KONAMI.length){ kon = 0; setOpen(true); return; }
      if (e.key.length === 1){
        typed = (typed + k).slice(-3);
        if (typed === 'run' && location.pathname !== '/404' && !document.querySelector('.nf .rg')) { typed = ''; setOpen(true); }
      }
    };
    const onEvt = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('ao:run', onEvt);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('ao:run', onEvt); };
  }, []);

  useEffectR(() => {
    if (!open) return;
    const back = document.activeElement;
    const key = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
      if (back && back.focus) back.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="ro" role="dialog" aria-modal="true" aria-label="The dot run">
      <div className="ro-top shell">
        <span className="tag">The dot run<span className="dot"/></span>
        <button className="ro-close" ref={closeRef} onClick={() => setOpen(false)} aria-label="Close the game">
          <span className="tag">Esc</span><Icon.Close/>
        </button>
      </div>
      <div className="ro-mid shell">
        <h2 className="ro-title">Race the dot<span className="dot"/></h2>
        <p className="ro-sub">One button. Clear the hurdles, hold to jump higher. It only gets faster.</p>
        <RunGame autoFocus/>
      </div>
    </div>
  );
}

/* ── Five clicks and it's gone ─────────────────────────────────────────── */
// The real dot never moves: the scroll scene measures it every frame. A
// clone takes its place on its own layer, and only transforms are animated,
// so the whole escape runs on the compositor.
function useRunaway(dotRef){
  useEffectR(() => {
    const dot = dotRef.current;
    if (!dot) return;
    let n = 0, resetT = 0, busy = false;

    const anim = (el, frames, opt) => el.animate(frames, { fill: 'forwards', ...opt }).finished.catch(() => {});
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function escape(){
      busy = true;
      const r  = dot.getBoundingClientRect();
      const vw = window.innerWidth;
      const d  = r.width;
      const startY = window.scrollY;

      const run  = document.createElement('div');  run.className = 'runaway';
      const body = document.createElement('div');  body.className = 'runaway-b';
      run.appendChild(body);
      run.style.cssText = `left:${r.left}px;top:${r.top}px;width:${d}px;height:${d}px`;
      const cap = document.createElement('div');   cap.className = 'runaway-cap tag';
      cap.style.left = clamp(r.left + d / 2 - 90, 12, vw - 232) + 'px';
      cap.style.bottom = (window.innerHeight - r.top + Math.max(24, d * 1.7)) + 'px';   // grows upward, never over the dot
      document.body.append(run, cap);
      dot.style.visibility = 'hidden';

      let aborted = false;
      const onScroll = () => { if (Math.abs(window.scrollY - startY) > 30) aborted = true; };
      window.addEventListener('scroll', onScroll, { passive: true });
      const done = () => {
        window.removeEventListener('scroll', onScroll);
        dot.style.visibility = '';
        run.remove(); cap.remove(); busy = false;
      };
      const say = async (html, hold) => {
        cap.innerHTML = html;
        await anim(cap, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
        if (hold) await sleep(hold);
      };
      const hush = () => anim(cap, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });

      if (reduceMotion()){
        await anim(body, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
        await say('brb · out for a run', 1600);
        await hush();
        await anim(body, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
        await say('back · 40,075 km · new PB', 2400);
        await hush(); done(); return;
      }

      // 1 · it swells, looks left, looks right
      await anim(body, [
        { transform: 'scale(1)' },
        { transform: 'scale(1.5)', offset: .35 },
        { transform: 'translateX(-14%) scale(1.5,1.42)', offset: .55 },
        { transform: 'translateX(14%) scale(1.5,1.42)', offset: .78 },
        { transform: 'scale(1.5)' },
      ], { duration: 820, easing: 'ease-in-out' });
      if (aborted) return done();
      // 2 · crouch
      await anim(body, [{ transform: 'scale(1.5)' }, { transform: 'translateY(18%) scale(1.85,1.1)' }], { duration: 150, easing: 'ease-in' });
      // 3 · off it goes, to the right, a hop on every stride
      const out = vw - r.left + d * 2;
      const strides = Math.max(5, Math.round(out / 120));
      const hop = d * 1.1;
      run.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${out}px)` }],
                  { duration: 260 + out * .55, easing: 'cubic-bezier(.45,0,.9,.6)', fill: 'forwards' });
      await anim(body, Array.from({ length: strides * 2 + 1 }, (_, i) => ({
        transform: i % 2 ? `translateY(${-hop}px) scale(.9,1.12)` : 'translateY(0) scale(1.12,.88)',
      })), { duration: 260 + out * .55, easing: 'linear' });
      if (aborted) return done();

      await say('brb · out for a run', 1500);
      await hush();
      if (aborted) return done();

      // 4 · one lap of the planet later, it comes back from the other side —
      // slower, smaller hops, and it stops a little short before trotting in
      const back = r.left + d * 2;
      run.getAnimations().forEach(a => a.cancel());
      body.getAnimations().forEach(a => a.cancel());
      const dur = 700 + back * 1.6;
      run.animate([{ transform: `translateX(${-back}px)` }, { transform: 'translateX(0)' }],
                  { duration: dur, easing: 'cubic-bezier(.15,.6,.35,1)', fill: 'forwards' });
      const s2 = Math.max(5, Math.round(back / 90));
      await anim(body, Array.from({ length: s2 * 2 + 1 }, (_, i) => {
        const k = 1 - i / (s2 * 2);                 // hops fade as it slows
        return { transform: i % 2 ? `translateY(${-hop * .55 * k}px) scale(.95,1.06)` : 'translateY(0) scale(1.06,.95)' };
      }), { duration: dur, easing: 'cubic-bezier(.15,.6,.35,1)' });
      if (aborted) return done();

      // 5 · out of breath
      anim(body, [
        { transform: 'scale(1)' }, { transform: 'scale(1.16,1.1)' },
        { transform: 'scale(1)' }, { transform: 'scale(1.13,1.08)' },
        { transform: 'scale(1)' }, { transform: 'scale(1.08,1.05)' }, { transform: 'scale(1)' },
      ], { duration: 1700, easing: 'ease-in-out' });
      await say('back · 40,075 km · new PB', 0);
      const race = document.createElement('button');
      race.className = 'runaway-go'; race.type = 'button';
      race.textContent = 'Race it →';
      race.addEventListener('click', () => { window.dispatchEvent(new Event('ao:run')); });
      cap.appendChild(race);
      await sleep(4200);
      await hush(); done();
    }

    const onClick = () => {
      if (busy || window.scrollY > 40) return;
      // not while the splash is closing or the name is still rising
      if (document.getElementById('boot') || !dot.closest('.hero.in')) return;
      if (dot.getAnimations().length && n === 0) return;
      clearTimeout(resetT);
      resetT = setTimeout(() => { n = 0; }, 1400);   // five in a row, not five in a day
      n += 1;
      if (n >= 5){ n = 0; escape(); return; }
      // each click it gets a little more restless
      const s = 1 + n * .1;
      dot.animate([
        { transform: 'scale(1)' },
        { transform: `scale(${s + .14},${s - .06})`, offset: .3 },
        { transform: `scale(${s - .04},${s + .1})`, offset: .6 },
        { transform: 'scale(1)' },
      ], { duration: 360 + n * 40, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    };
    dot.addEventListener('click', onClick);
    return () => { dot.removeEventListener('click', onClick); clearTimeout(resetT); };
  }, []);
}

Object.assign(window, { RunGame, RunOverlay, useRunaway });
