// Pages — Landing, Projects, About, Contact
// Data is pulled from window.PORTFOLIO_DATA (set by data.js).

const { useState, useEffect, useMemo, useRef } = React;

// ─── Data helpers ────────────────────────────────────────────────────────────
const DATA    = () => window.PORTFOLIO_DATA || {};
const PROFILE = () => DATA().profile   || {};
const PROJS   = () => DATA().projects  || [];

// ─── Scroll-scene helpers ────────────────────────────────────────────────────
// Native scroll only — no hijacking. sceneProgress() returns 0→1 for how far a
// tall section has travelled through the viewport, so its sticky inner content
// can be animated imperatively (refs + rAF, no React re-render) at 60fps.
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const easeInOut = t => (t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2);
function sceneProgress(el){
  const r = el.getBoundingClientRect();
  const runway = r.height - window.innerHeight;
  if (runway <= 0) return clamp((window.innerHeight - r.top)/window.innerHeight, 0, 1);
  return clamp(-r.top/runway, 0, 1);
}

// ─── 01 · Spotlight hero name ────────────────────────────────────────────────
// Letters (and the accent dot) nearest the cursor rise straight up; the letters
// also swell in weight and tint accent. Proximity is distance-based and the
// letter nodes are queried live each frame, so it engages reliably on every
// load. As you scroll from the top the dot cross-fades into the scroll-thread
// comet, so the point in the name IS the point that flies down the page.
function HeroName({ name }) {
  const nameRef = useRef(null);
  const dotRef  = useRef(null);
  useEffect(()=>{
    const el=nameRef.current; if(!el) return;
    if(!window.matchMedia('(hover: hover)').matches) return;
    let raf=0, mx=-9999, my=-9999;
    // Spotlight: whatever the cursor is near rises straight up; letters also
    // gain weight + accent tint. Distance-based; the letter nodes are queried
    // live each frame so a re-render that swaps them can never stale us out.
    const prox=node=>{ const r=node.getBoundingClientRect(); return Math.max(0, 1 - Math.hypot(r.left+r.width/2-mx, r.top+r.height/2-my)/250); };
    function apply(){
      raf=0;
      el.querySelectorAll('.vh-l').forEach(s=>{
        const k=prox(s);
        s.style.fontWeight=Math.round(600+k*300);
        s.style.transform=`translateY(${(-k*12).toFixed(2)}px)`;
        s.style.color=k>0.5?'var(--blue)':'';
      });
      const dot=dotRef.current;
      if(dot) dot.style.transform=`translateY(${(-prox(dot)*12).toFixed(2)}px)`;
    }
    function onMove(e){ mx=e.clientX; my=e.clientY; if(!raf) raf=requestAnimationFrame(apply); }
    window.addEventListener('pointermove',onMove,{passive:true});
    return ()=>{ window.removeEventListener('pointermove',onMove); if(raf) cancelAnimationFrame(raf); };
  },[name]);
  // Dot → comet hand-off: the name dot fades out over the first bit of scroll
  // as the comet fades in (ScrollThread), so it reads as the dot lifting away.
  useEffect(()=>{
    const dot=dotRef.current; if(!dot) return;
    let raf=0;
    function upd(){ raf=0; dot.style.opacity=clamp(1-window.scrollY/64,0,1).toFixed(2); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true});
    return ()=>{ window.removeEventListener('scroll',s); if(raf) cancelAnimationFrame(raf); };
  },[]);
  const parts=(name||'').trim().split(/\s+/);
  const first=parts.shift()||'';
  const last =parts.join(' ');
  // Plain helper (not a component) → the letter spans are stable host nodes that
  // React reuses across re-renders, so the spotlight effect never loses them.
  const letters=(w,key)=>Array.from(w).map((c,i)=>(<span key={key+i} className="vh-l">{c}</span>));
  return (
    <h1 className="h1 hero-name" ref={nameRef}>
      <span className="vh-word">{letters(first,'a')}</span>
      <span className="hero-dot" id="thread-start" ref={dotRef} aria-hidden="true"></span>
      <span className="vh-word">{letters(last,'b')}</span>
    </h1>
  );
}

// ─── 11 · Polyglot greeting ──────────────────────────────────────────────────
const HELLOS = [
  { lang:'en', text:"Hello, I'm" },
  { lang:'fr', text:"Bonjour, je suis" },
  { lang:'nl', text:"Hallo, ik ben" },
  { lang:'es', text:"Hola, soy" },
  { lang:'it', text:"Ciao, sono" },
  { lang:'ja', text:"こんにちは、僕は" },
];
function PolyglotHello() {
  const [i, setI]       = useState(0);
  const [phase, setPhase] = useState('in');
  useEffect(()=>{
    let mounted=true;
    const id=setInterval(()=>{
      if(!mounted) return;
      setPhase('out');
      setTimeout(()=>{
        if(!mounted) return;
        setI(prev=>(prev+1)%HELLOS.length);
        setPhase('in');
      },320);
    },2400);
    return ()=>{ mounted=false; clearInterval(id); };
  },[]);
  return (
    <div className="polyglot-hello" aria-label="Greeting">
      <span key={i} className={'lang '+(phase==='out'?'swap-out':'')} lang={HELLOS[i].lang}>
        {HELLOS[i].text}
      </span>
    </div>
  );
}

// ─── 12 · Drawn SVG underline link ──────────────────────────────────────────
const ULINK_PATHS = [
  'M2 5 Q 30 1 60 5 T 120 5 T 198 5',
  'M2 5 Q 50 2 100 5 T 198 5',
  'M2 5 Q 25 8 50 4 Q 100 1 150 6 T 198 4',
  'M2 6 Q 40 2 80 5 T 160 5 T 198 5',
];
function ULink({ href='#', children, onClick, style, seed=0, ...rest }) {
  const path=ULINK_PATHS[seed%ULINK_PATHS.length];
  return (
    <a href={href} className="ulink" style={style}
       onClick={onClick||(e=>e.preventDefault())} {...rest}>
      <span>{children}</span>
      <svg className="ulink-svg" viewBox="0 0 200 10" preserveAspectRatio="none">
        <path d={path}/>
      </svg>
    </a>
  );
}

// ─── Tech tag pill ────────────────────────────────────────────────────────────
function Tag({ children }) {
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',
      height:24,padding:'0 10px',borderRadius:6,
      background:'var(--tag-bg)',border:'1px solid var(--border)',
      fontFamily:'Geist Mono,monospace',fontSize:11,letterSpacing:'0.01em',
      color:'var(--fg)',
    }}>{children}</span>
  );
}

// ─── Sliding pill segmented control ─────────────────────────────────────────
function SlidingPills({ items, value, onChange, getCount, lead, ariaLabel, getAria, className, style }) {
  const groupRef  = useRef(null);
  const sliderRef = useRef(null);
  const btnsRef   = useRef([]);
  useEffect(()=>{
    function update(){
      const idx=items.indexOf(value);
      const btn=btnsRef.current[idx], group=groupRef.current, slider=sliderRef.current;
      if(!btn||!group||!slider) return;
      const gr=group.getBoundingClientRect(), br=btn.getBoundingClientRect();
      slider.style.width    = br.width+'px';
      slider.style.transform= `translateX(${br.left-gr.left}px)`;
      slider.classList.remove('idle');
    }
    update();
    const ro=new ResizeObserver(update);
    if(groupRef.current) ro.observe(groupRef.current);
    window.addEventListener('resize',update);
    return ()=>{ ro.disconnect(); window.removeEventListener('resize',update); };
  },[value,items]);
  return (
    <div className={'pill-group'+(className?' '+className:'')} ref={groupRef} style={style} role={ariaLabel?'group':undefined} aria-label={ariaLabel}>
      {lead && <span className="pill-lead">{lead}</span>}
      <div className="pill-slider idle" ref={sliderRef}/>
      {items.map((it,i)=>(
        <button type="button" key={it} ref={el=>btnsRef.current[i]=el}
          onClick={()=>onChange(it)}
          aria-pressed={getAria?value===it:undefined}
          aria-label={getAria?getAria(it):undefined}
          className={'pill '+(value===it?'pill-on':'')}>
          {it}
          {getCount&&<span className="pill-count">{getCount(it)}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Avatar (photo or initials) ──────────────────────────────────────────────
function Avatar() {
  const P = PROFILE();
  if (P.photo) {
    // Accent-tinted disc behind the (transparent) photo, like the initials avatar.
    return (
      <div style={{
        width:72,height:72,borderRadius:'50%',flexShrink:0,overflow:'hidden',
        background:'color-mix(in oklab, var(--blue) 35%, var(--bg-elev))',
        border:'2px solid color-mix(in oklab, var(--blue) 45%, transparent)',
      }}>
        <img src={P.photo} alt={P.name}
          style={{width:'82%',height:'82%',margin:'9% auto 0',objectFit:'contain',display:'block'}}/>
      </div>
    );
  }
  // Initials fallback
  const initials = (P.name||'AO').split(' ').map(w=>w[0]).slice(0,2).join('');
  return (
    <div style={{
      width:72,height:72,borderRadius:'50%',flexShrink:0,
      background:'var(--blue-soft)',
      border:'2px solid color-mix(in oklab, var(--blue) 40%, transparent)',
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:22,fontWeight:600,color:'var(--blue)',
      letterSpacing:'-0.02em',userSelect:'none',
    }}>
      {initials}
    </div>
  );
}

// ─── Cover renderer — SVG artwork or image URL ───────────────────────────────
// In data.js, set cover to a named key ("F1", "Dashboard", "Generic" …)
// OR any image URL ("https://…" or "/assets/cover.jpg").
function CoverImg({ cover, title }) {
  const isUrl = cover && (
    cover.startsWith('http://') ||
    cover.startsWith('https://') ||
    cover.startsWith('/')
  );
  if (isUrl) {
    return (
      <img src={cover} alt={title||''} loading="lazy" decoding="async"
        style={{display:'block',width:'100%',height:'100%',objectFit:'cover'}}/>
    );
  }
  const Comp = Cover[cover] || Cover.Generic;
  return <Comp/>;
}

// ═══════════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════════
// The landing is a 3-act scroll narrative (all native scroll — no hijacking):
//   1 · Hero      — name + greeting, fills the first screen, with a scroll cue.
//   2 · Manifesto — a short line that de-greys word-by-word as you scroll past.
//   3 · Deck      — project cards that fan out of a neat pile as you scroll.
// Acts 2 & 3 are tall sections with a sticky inner stage, so the content holds
// centre-screen while the section's height acts as the scroll "runway".
function Landing({ go }) {
  const P = PROFILE();
  const spotRef = useRef(null);
  useEffect(()=>{
    const el=spotRef.current;
    if(!el) return;
    // Spotlight is a fixed, full-viewport layer → viewport coords (clientX/Y),
    // so the glow is only ever clipped by the screen edge, never by a box.
    // Works for both mouse and touch: pointerdown lights it at the touch point,
    // pointermove follows the finger/cursor as it drags or scrolls.
    function onMove(e){
      el.style.setProperty('--mx',e.clientX+'px');
      el.style.setProperty('--my',e.clientY+'px');
      if(!el.classList.contains('live')) el.classList.add('live');
    }
    function onLeave(){ el.classList.remove('live'); }
    window.addEventListener('pointerdown',onMove);
    window.addEventListener('pointermove',onMove);
    window.addEventListener('pointerleave',onLeave);
    return ()=>{ window.removeEventListener('pointerdown',onMove); window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerleave',onLeave); };
  },[]);

  return (
    <>
      {/* Fixed cursor-glow layer — kept OUTSIDE .page-enter so its transform
          doesn't turn position:fixed into a clipped containing block. */}
      <div ref={spotRef} className="spotlight-layer" aria-hidden="true"/>
      <div className="page-enter hero-spotlight">
        {/* The thread: an accent comet that descends a curve linking the 3 acts.
            Sits behind the content; anchors are queried from the DOM by id. */}
        <ScrollThread />
        <HeroAct go={go} profile={P} />
        <ManifestoAct text={P.tagline||''} />
        <DeckAct go={go} />
      </div>
    </>
  );
}

// ─── Act 1 · Hero (FIRST ● LAST, editorial corner labels) ─────────────────────
function HeroAct({ go, profile }) {
  const cueRef = useRef(null);
  // The scroll cue fades out the moment the user starts scrolling.
  useEffect(()=>{
    const el=cueRef.current; if(!el) return;
    let raf=0;
    function upd(){ raf=0; el.style.opacity = clamp(1 - window.scrollY/200, 0, 1).toFixed(2); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true});
    return ()=>{ window.removeEventListener('scroll',s); if(raf) cancelAnimationFrame(raf); };
  },[]);
  const role     = profile.role     || 'Business Engineering · Analytics';
  const location = profile.location || 'Tournai, Belgium';
  return (
    <section className="lp-hero shell">
      <div className="hero-frame">
        <div className="hero-tags">
          <span className="hero-tag mono">{role}</span>
        </div>
        <HeroName name={profile.name||'Arthur Ottevaere'} />
        <div className="hero-sub">
          <span className="hero-tag mono"><LiveLocation location={location} /></span>
        </div>
      </div>
      <div className="hero-cta">
        <button onClick={()=>go('work')} className="btn-primary">
          View projects <Icon.Arrow/>
        </button>
        <button onClick={()=>go('contact')} className="btn-ghost">
          Get in touch
        </button>
      </div>
      <div ref={cueRef} className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v13M18 12l-6 6-6-6"/></svg>
      </div>
    </section>
  );
}

// Live local clock for the hero location label (Europe/Brussels), ticking each
// half-minute — a small sign of life, like the reference's "11:54 GMT+2".
function LiveLocation({ location }) {
  const [now, setNow] = useState(()=>heroClock());
  useEffect(()=>{
    const id=setInterval(()=>setNow(heroClock()), 30000);
    return ()=>clearInterval(id);
  },[]);
  return <>{location} · {now}</>;
}
function heroClock(){
  try {
    return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Europe/Brussels'}).format(new Date());
  } catch(e){
    return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
  }
}

// ─── The scroll thread · a modern accent comet linking the three acts ─────────
// Lives BEHIND the content (z-index 0) so it never obstructs text. As you
// scroll, the comet head holds a fixed viewport band and sweeps DOWN the page,
// its x gliding along an S-curve through three anchors (name dot → manifesto →
// deck heading). Behind it a soft gradient streak fades out (no ghost balls),
// and a faint continuity line marks the whole travelled path. When it reaches
// the deck heading it LOCKS just above the title and stays there (tracking the
// sticky heading live) while the deck fans open. Trail is rebuilt per-frame as a
// short Bézier string — no arc-length sampling — so the live lock is exact.
function ScrollThread() {
  const wrapRef  = useRef(null);
  const trailRef = useRef(null);   // faint continuity line  (A0 → head)
  const glowRef  = useRef(null);   // wide blurred halo along the comet tail
  const tailRef  = useRef(null);   // crisp gradient core of the comet tail
  const gradRef  = useRef(null);   // the tail's gradient endpoints
  const haloRef  = useRef(null);   // soft glow behind the head
  const coreRef  = useRef(null);   // crisp head dot
  useEffect(()=>{
    const wrap=wrapRef.current; if(!wrap) return;
    const host=wrap.parentElement;                       // .hero-spotlight box
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let A0=null, A1=null, A2=null, dotR=13, hb=null, raf=0;

    const lerp=(a,b,t)=>a+(b-a)*t;
    const smooth=t=>{ t=clamp(t,0,1); return t*t*(3-2*t); };
    const cubicV=(p,q)=>{ const m=(p.y+q.y)/2; return `C ${p.x.toFixed(1)} ${m.toFixed(1)}, ${q.x.toFixed(1)} ${m.toFixed(1)}, ${q.x.toFixed(1)} ${q.y.toFixed(1)} `; };

    // A0 (name dot) and A1 (manifesto runway) sit in normal flow → constant.
    function measure(){
      hb=host.getBoundingClientRect();
      const W=host.clientWidth, H=host.scrollHeight;
      wrap.setAttribute('viewBox',`0 0 ${W} ${H}`);
      wrap.style.height=H+'px';
      const start=document.querySelector('#thread-start');
      const mani =document.querySelector('.lp-manifesto');
      if(!start||!mani) return false;
      const s=start.getBoundingClientRect();
      dotR=Math.max(8, Math.min(17, s.width/2));
      A0={ x:s.left-hb.left+s.width/2, y:s.top-hb.top+s.height/2 };
      const m=mani.getBoundingClientRect();
      A1={ x:Math.max(36, W*0.10), y:m.top-hb.top + m.height*0.5 };   // left gutter, runway mid
      return true;
    }
    // A2 (deck heading) is sticky → measured LIVE each frame.
    function deckAnchor(){
      const d=document.querySelector('[data-thread="deck"]'); if(!d) return null;
      const r=d.getBoundingClientRect();
      return { x:r.left-hb.left+r.width/2, y:r.top-hb.top, vTop:r.top };
    }
    function curveXAtY(y){
      if(y<=A1.y) return lerp(A0.x, A1.x, smooth((y-A0.y)/Math.max(1,A1.y-A0.y)));
      return lerp(A1.x, A2.x, smooth((y-A1.y)/Math.max(1,A2.y-A1.y)));
    }

    function place(headX, headY){
      // faint continuity line: A0 → (A1 if passed) → head — links the acts.
      let d=`M ${A0.x.toFixed(1)} ${A0.y.toFixed(1)} `;
      if(headY>A1.y) d += cubicV(A0,A1) + cubicV(A1,{x:headX,y:headY});
      else           d += cubicV(A0,{x:headX,y:headY});
      trailRef.current.setAttribute('d', d);
      // Comet tail: a long, smooth ribbon that follows the curve and fades out
      // behind the head (gradient + soft glow). Sampled as a short polyline so
      // it hugs the curve even when it spans the bend at A1.
      const tailLen=Math.max(120, window.innerHeight*0.22);
      const backY=Math.max(A0.y, headY-tailLen);
      const steps=10; let dt='';
      for(let i=0;i<=steps;i++){ const yy=backY+(headY-backY)*i/steps; const xx=curveXAtY(yy); dt+=(i?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1)+' '; }
      tailRef.current.setAttribute('d', dt);
      glowRef.current.setAttribute('d', dt);
      const g=gradRef.current;
      g.setAttribute('x1',curveXAtY(backY).toFixed(1)); g.setAttribute('y1',backY.toFixed(1));
      g.setAttribute('x2',headX.toFixed(1));            g.setAttribute('y2',headY.toFixed(1));
      // head: soft halo + crisp core
      haloRef.current.setAttribute('cx',headX.toFixed(1)); haloRef.current.setAttribute('cy',headY.toFixed(1)); haloRef.current.setAttribute('r',(dotR*2.2).toFixed(1));
      coreRef.current.setAttribute('cx',headX.toFixed(1)); coreRef.current.setAttribute('cy',headY.toFixed(1)); coreRef.current.setAttribute('r',dotR.toFixed(1));
    }

    function frame(){
      raf=0;
      hb=host.getBoundingClientRect();
      const vh=window.innerHeight;
      const a2=deckAnchor(); if(!a2) return; A2=a2;
      const band=0.46, lockGap=Math.max(36, dotR*2.4);
      // transit at a fixed viewport band, then never sink below "just above the
      // title" — so on arrival the head locks above the (live, sticky) heading.
      const cometVY=Math.min(band*vh, a2.vTop - lockGap);
      let headY=clamp(cometVY - hb.top, A0.y, a2.y - lockGap);
      // Fade the whole comet in over the first slice of scroll, so at the very
      // top only the name's own dot shows and the two cross-fade on hand-off.
      wrap.style.opacity = clamp(window.scrollY/64, 0, 1).toFixed(3);
      place(curveXAtY(headY), headY);
    }

    function render(){ if(!raf) raf=requestAnimationFrame(frame); }
    function relayout(){ if(measure()) frame(); }

    const t=setTimeout(()=>{
      if(!measure()) return;
      const a2=deckAnchor(); if(a2) A2=a2;
      if(reduced){
        // static: trail + head resting just above the deck heading
        wrap.style.opacity = 1;
        const headY=A2 ? A2.y-Math.max(36,dotR*2.4) : A1.y;
        place(curveXAtY(clamp(headY,A0.y,headY)), headY);
        return;
      }
      frame();
      window.addEventListener('scroll',render,{passive:true});
      window.addEventListener('resize',relayout);
      window.addEventListener('load',relayout);
      if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ if(wrapRef.current) relayout(); });
    }, 120);

    return ()=>{ clearTimeout(t); window.removeEventListener('scroll',render); window.removeEventListener('resize',relayout); window.removeEventListener('load',relayout); if(raf) cancelAnimationFrame(raf); };
  },[]);

  return (
    <svg ref={wrapRef} className="thread-svg" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient ref={gradRef} id="cometTail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1">
          <stop className="cg0" offset="0"/>
          <stop className="cg1" offset="0.55"/>
          <stop className="cg2" offset="1"/>
        </linearGradient>
        <filter id="cometGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="7"/>
        </filter>
      </defs>
      <path   ref={trailRef} className="thread-trail" fill="none"/>
      <path   ref={glowRef}  className="thread-glow"  fill="none" stroke="url(#cometTail)"/>
      <path   ref={tailRef}  className="thread-tail"  fill="none" stroke="url(#cometTail)"/>
      <circle ref={haloRef}  className="thread-halo"  r="0"/>
      <circle ref={coreRef}  className="thread-core"  r="0"/>
    </svg>
  );
}

// ─── Act 2 · De-greying manifesto ─────────────────────────────────────────────
// Each word starts faint and fills to full ink as the scroll head sweeps across
// it, left→right. Opacity-only (so it's theme-agnostic) and driven imperatively.
function ManifestoAct({ text }) {
  const secRef   = useRef(null);
  const wordsRef = useRef([]);
  const words = (text||'').split(/\s+/).filter(Boolean);
  useEffect(()=>{
    const el=secRef.current; if(!el) return;
    const spans=wordsRef.current.filter(Boolean);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      spans.forEach(s=>s.style.opacity=1); return;
    }
    const n=spans.length, spread=2.4;   // ~2-3 words lighting up at once = soft wipe
    let raf=0;
    function upd(){
      raf=0;
      // Fill a touch early (×0.92 runway) so the line is fully lit just before
      // it leaves the screen, rather than completing right at the very edge.
      const head = clamp(sceneProgress(el)/0.92, 0, 1) * (n + spread);
      spans.forEach((s,i)=>{
        const w = clamp((head - i)/spread, 0, 1);
        s.style.opacity = (0.15 + 0.85*w).toFixed(3);
      });
    }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd();
    window.addEventListener('scroll',s,{passive:true});
    window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[text]);
  return (
    <section ref={secRef} className="lp-manifesto" style={{height:'168vh'}}>
      <div className="lp-manifesto-sticky">
        <p className="lp-manifesto-text" data-thread="manifesto">
          {words.map((w,i)=>(
            <span key={i} className="lp-word" ref={el=>wordsRef.current[i]=el}>
              {w}{i<words.length-1?' ':''}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

// ─── Act 3 · Fanning project deck ─────────────────────────────────────────────
// Picks the strongest few projects, centres the featured one, then fans them
// from a neat pile into a hand-of-cards spread as the section scrolls past.
// Mobile gets a simpler staggered reveal (no fan, no captured scroll).
function DeckAct({ go }) {
  const all = PROJS();
  const ordered = [...all].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0)).slice(0,6);
  const cards = centerFirst(ordered);
  const [mobile, setMobile] = useState(()=>window.matchMedia('(max-width:640px)').matches);
  useEffect(()=>{
    const mq=window.matchMedia('(max-width:640px)');
    const h=e=>setMobile(e.matches);
    mq.addEventListener('change',h);
    return ()=>mq.removeEventListener('change',h);
  },[]);
  if(!cards.length) return null;
  return mobile ? <DeckMobile cards={cards} go={go}/> : <DeckFan cards={cards} go={go}/>;
}

// Re-orders so the first (featured) item lands in the visual centre of the fan,
// with the rest filling outward from the middle.
function centerFirst(items){
  const n=items.length; if(n<2) return items;
  const mid=Math.round((n-1)/2);
  const slots=new Array(n);
  slots[mid]=items[0];
  let l=mid-1, r=mid+1, k=1;
  while(k<n){
    if(r<n){ slots[r++]=items[k++]; }
    if(k<n && l>=0){ slots[l--]=items[k++]; }
  }
  return slots;
}

function DeckCardInner({ p }){
  const href = p.github&&p.github!=='#' ? p.github : undefined;
  return (
    <a href={href||'#'}
       target={href?'_blank':undefined}
       rel={href?'noopener noreferrer':undefined}
       onClick={e=>{ if(!href) e.preventDefault(); }}
       className="deck-card-inner">
      <div className="pm-cover"><CoverImg cover={p.cover} title={p.title}/></div>
      <div className="pm-meta">
        <span className="pm-cat">{p.cat}</span>
        <span className="pm-title">{p.title}</span>
      </div>
    </a>
  );
}

function DeckFan({ cards, go }) {
  const secRef   = useRef(null);
  const cardRefs = useRef([]);
  const n = cards.length;
  const center = (n-1)/2;
  useEffect(()=>{
    const el=secRef.current; if(!el) return;
    const els=cardRefs.current.filter(Boolean);
    const stage = el.querySelector('.lp-deck-stage');
    function layout(p){
      const e=easeInOut(clamp(p,0,1));
      // Bigger amplitude: a tight, slightly-shrunk pile blooms into a wide,
      // strongly-rotated hand of cards. Responsive spread keeps it on-screen.
      const stageW = stage ? stage.clientWidth : 1120;
      const spreadX = Math.min(178, Math.max(72, (stageW - 300) / Math.max(1, n-1)));
      const fanRot  = spreadX < 120 ? 7 : 10;
      els.forEach((c,i)=>{
        const off=i-center;
        // pile (e=0): tight, shrunk stack; fan (e=1): wide, arced hand of cards
        const x = off*( 6 + (spreadX-6)*e );
        const y = Math.abs(off)*( 1 + (24-1)*e ) - 14*e;   // arc + a slight overall rise
        const r = off*( 1.2 + (fanRot-1.2)*e );
        const s = 0.90 + 0.10*e;
        c.style.transform = `translate(-50%,-50%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
        c.style.zIndex = String(100 - Math.round(Math.abs(off)*10));
      });
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){ layout(1); return; }
    let raf=0;
    function upd(){ raf=0; layout(sceneProgress(el)); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd();
    window.addEventListener('scroll',s,{passive:true});
    window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[n]);
  return (
    <section ref={secRef} className="lp-deck-section" style={{height:'160vh'}}>
      <div className="lp-deck-sticky">
        <div className="lp-deck-head" data-thread="deck">
          <div className="eyebrow">Selected work</div>
          <h2 className="h2" style={{marginTop:10}}>Things I've built.</h2>
        </div>
        <div className="lp-deck-stage" aria-label="Project previews">
          {cards.map((p,i)=>(
            <div key={i} className="deck-card" ref={el=>cardRefs.current[i]=el}>
              <DeckCardInner p={p}/>
            </div>
          ))}
        </div>
        <button onClick={()=>go('work')} className="btn-primary deck-cta">
          View all projects <Icon.Arrow/>
        </button>
      </div>
    </section>
  );
}

function DeckMobile({ cards, go }) {
  const listRef = useRef(null);
  useEffect(()=>{
    const root=listRef.current; if(!root) return;
    const items=Array.from(root.querySelectorAll('.lp-reveal-card'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      items.forEach(i=>i.classList.add('in')); return;
    }
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{ threshold:0.2 });
    items.forEach(i=>io.observe(i));
    return ()=>io.disconnect();
  },[]);
  return (
    <section className="shell" style={{paddingTop:8}}>
      <div className="lp-deck-head" data-thread="deck" style={{textAlign:'left',marginBottom:20}}>
        <div className="eyebrow">Selected work</div>
        <h2 className="h2" style={{marginTop:10}}>Things I've built.</h2>
      </div>
      <div ref={listRef} className="lp-reveal-list">
        {cards.map((p,i)=>{
          const href = p.github&&p.github!=='#' ? p.github : undefined;
          return (
            <a key={i}
               href={href||'#'}
               target={href?'_blank':undefined}
               rel={href?'noopener noreferrer':undefined}
               onClick={e=>{ if(!href) e.preventDefault(); }}
               className="pm-card lp-reveal-card">
              <div className="pm-cover"><CoverImg cover={p.cover} title={p.title}/></div>
              <div className="pm-meta">
                <span className="pm-cat">{p.cat}</span>
                <span className="pm-title">{p.title}</span>
              </div>
            </a>
          );
        })}
      </div>
      <button onClick={()=>go('work')} className="btn-primary"
              style={{width:'100%',justifyContent:'center',marginTop:24}}>
        View all projects <Icon.Arrow/>
      </button>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════

// Optional precise completion date. `date` in data.js can be "YYYY-MM-DD" or
// "YYYY-MM"; we fall back to the looser `year` field when it's absent.
function parseProjDate(s){
  if(!s) return null;
  let str=String(s).trim();
  if(/^\d{4}-\d{2}$/.test(str)) str+='-01';      // month-only → first of month
  const t=Date.parse(str);
  return isNaN(t) ? null : new Date(t);
}
// Human label shown on cards/popup: "15 Jun 2026", "Jun 2026", or just the year.
function projDateLabel(p){
  const d=parseProjDate(p.date);
  if(d){
    const hasDay=/^\d{4}-\d{2}-\d{2}/.test(String(p.date).trim());
    return d.toLocaleDateString('en-GB',{
      day: hasDay ? 'numeric' : undefined,
      month:'short', year:'numeric', timeZone:'UTC',
    });
  }
  return p.year || '';
}
// Sort key: exact date when given, else the latest year mentioned (ranges like
// "2024-2025" rank by when the work ended).
function projDateKey(p){
  const d=parseProjDate(p.date);
  if(d) return d.getTime();
  const yrs=String(p.year||'').match(/\d{4}/g);
  const y=yrs ? Math.max(...yrs.map(Number)) : 0;
  return y ? Date.UTC(y,11,31) : 0;
}

function Projects() {
  const projects = PROJS();
  // ?? null: only falls back when find() returns undefined (no match).
  // A project with featured:false is falsy, but projects.find() never returns false —
  // it returns the object or undefined. So || would wrongly use projects[0] when
  // the only project has featured:false. ?? null gives correct behaviour.
  const featured = projects.find(p=>p.featured) ?? null;
  const cats      = useMemo(()=>['All',...[...new Set(projects.map(p=>p.cat))]], [projects]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort]     = useState('desc');   // 'desc' = newest first
  const [active, setActive] = useState(null);      // project shown in the detail popup
  const [cols, setCols]     = useState(2);         // grid density (cards per row)

  const rest = useMemo(()=>{
    const list = projects.filter(p=>p.id!==featured?.id);
    const filtered = filter==='All' ? list : list.filter(p=>p.cat===filter);
    return [...filtered].sort((a,b)=>
      sort==='desc' ? projDateKey(b)-projDateKey(a) : projDateKey(a)-projDateKey(b)
    );
  },[filter,sort,projects,featured]);

  const showFeatured = filter==='All'||filter===featured?.cat;

  return (
    <div className="page-enter shell" style={{paddingTop:64}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'end',justifyContent:'space-between',gap:24,flexWrap:'wrap',marginBottom:32}}>
        <div>
          <div className="eyebrow">Selected work · 2024 — 2026</div>
          <h2 className="h2" style={{marginTop:10}}>Projects<span style={{color:'var(--fg-faint)'}}>.</span></h2>
          <p className="sub" style={{marginTop:10,maxWidth:560}}>
            A mix of coursework and weekend builds. Each one is a small bet on a tool I wanted to get fluent in.
          </p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <SlidingPills
            items={cats}
            value={filter}
            onChange={setFilter}
            getCount={f=>f==='All'?projects.length:projects.filter(p=>p.cat===f).length}
          />
          <button
            type="button"
            className="sort-btn"
            onClick={()=>setSort(s=>s==='desc'?'asc':'desc')}
            title={sort==='desc'?'Sorted by newest — click for oldest first':'Sorted by oldest — click for newest first'}
            aria-label="Toggle date sort order">
            <span>Date</span>
            <Icon.ArrowDown className={'sort-arrow'+(sort==='asc'?' asc':'')}/>
          </button>
          <SlidingPills
            items={[2,3,4]}
            value={cols}
            onChange={setCols}
            lead={<Icon.Columns/>}
            ariaLabel="Grid density"
            getAria={n=>n+' columns'}
            className="pill-group-cols"
          />
        </div>
      </div>

      {/* Featured card */}
      {featured && showFeatured && <FeaturedCard p={featured} onOpen={setActive}/>}

      {/* Card grid */}
      <div style={{marginTop: featured && showFeatured ? 44 : 0}}>
        <div className="eyebrow" style={{marginBottom:16}}>
          {filter==='All'?'More work':filter} · {rest.length}
        </div>
        {rest.length===0
          ? (
            <div style={{padding:'48px 0',textAlign:'center',color:'var(--fg-muted)',fontSize:14}}>
              Nothing in this bucket yet.
            </div>
          )
          : (
            <div className="proj-grid" style={{'--cols': cols}}>
              {rest.map(p=><ProjectCard key={p.id} p={p} onOpen={setActive}/>)}
            </div>
          )}
      </div>

      <ProjectModal p={active} onClose={()=>setActive(null)}/>
    </div>
  );
}

// ─── Project link kind ────────────────────────────────────────────────────────
// Reads a project's link and works out which logo to show: GitHub, Notion, or a
// generic arrow. Returns null when there's no public link yet ("#" / empty), so
// the link button is simply omitted.
function linkKind(url){
  if(!url || url==='#') return null;
  if(/notion\./i.test(url))  return { icon:'Notion', label:'Notion' };
  if(/github\./i.test(url))  return { icon:'Github', label:'GitHub' };
  return { icon:'ArrowUR', label:'Link' };
}

// Small link button (GitHub / Notion). stopPropagation so clicking it opens the
// repo directly instead of bubbling up to the card's "open details" handler.
function ProjectLink({ url, label }){
  const k = linkKind(url);
  if(!k) return null;
  const Glyph = Icon[k.icon] || Icon.ArrowUR;
  const text = label ? label : k.label;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className="proj-link" onClick={e=>e.stopPropagation()}
       title={'Open on '+k.label} aria-label={'Open on '+k.label}>
      <Glyph/><span>{text}</span>
    </a>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────
// Cover on top, text below. The whole card opens the detail popup; the inner
// link button jumps straight to GitHub/Notion.
function ProjectCard({ p, onOpen }){
  function open(){ onOpen && onOpen(p); }
  function onKey(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } }
  return (
    <article className="proj-card" role="button" tabIndex={0}
             onClick={open} onKeyDown={onKey}
             aria-label={'View details for '+p.title}>
      <div className="proj-cover">
        <CoverImg cover={p.cover} title={p.title}/>
        <span className="cat-pill">{p.cat}</span>
      </div>
      <div className="proj-body">
        <div className="proj-meta mono">{projDateLabel(p)}</div>
        <h3 className="proj-title">{p.title}</h3>
        <p className="proj-sum">{p.summary}</p>
        <div className="proj-tags">{p.tags.slice(0,4).map(t=><Tag key={t}>{t}</Tag>)}</div>
        <div className="proj-foot">
          <span className="proj-details">Details <Icon.Arrow/></span>
          <ProjectLink url={p.github}/>
        </div>
      </div>
    </article>
  );
}

// ─── Detail popup ─────────────────────────────────────────────────────────────
// Rich modal: cover, meta, full description, key-point bullets, skills and the
// link button. Escape / click-outside close it; body scroll is locked while open.
function ProjectModal({ p, onClose }){
  useEffect(()=>{
    if(!p) return;
    function onKey(e){ if(e.key==='Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return ()=>{ window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  },[p, onClose]);

  if(!p) return null;
  const k = linkKind(p.github);
  const Glyph = k ? (Icon[k.icon] || Icon.ArrowUR) : null;
  const points = Array.isArray(p.highlights) ? p.highlights : [];

  // Rendered into <body> via a portal so it escapes .page-enter's transform —
  // a transformed ancestor would otherwise capture position:fixed and the modal
  // would scroll with the page instead of staying centred in the viewport.
  return ReactDOM.createPortal((
    <div className="pj-back" onMouseDown={onClose}>
      <div className="pj-modal" role="dialog" aria-modal="true" aria-label={p.title}
           onMouseDown={e=>e.stopPropagation()}>
        <div className="pj-cover">
          <CoverImg cover={p.cover} title={p.title}/>
          <span className="cat-pill">{p.cat}</span>
          <button className="pj-close" onClick={onClose} aria-label="Close" type="button">
            <Icon.Close/>
          </button>
        </div>
        <div className="pj-body">
          <div className="pj-meta">
            <span className="mono">{projDateLabel(p)}</span>
            <span style={{color:'var(--fg-faint)'}}>·</span>
            <span>{p.cat}</span>
          </div>
          <h3 className="pj-title">{p.title}</h3>
          <p className="pj-long">{p.long || p.summary}</p>
          {points.length>0 && (
            <>
              <div className="pj-h">Key points</div>
              <ul className="pj-list">
                {points.map((h,i)=>(<li key={i}><Icon.Check/><span>{h}</span></li>))}
              </ul>
            </>
          )}
          <div className="pj-tags">{p.tags.map(t=><Tag key={t}>{t}</Tag>)}</div>
          {k && Glyph && (
            <div className="pj-actions">
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="proj-link">
                <Glyph/><span>View on {k.label}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  ), document.body);
}

function FeaturedCard({ p, onOpen }) {
  const ref = useRef(null);
  function handleMove(e) {
    const c=ref.current; if(!c) return;
    const r=c.getBoundingClientRect();
    const x=e.clientX-r.left, y=e.clientY-r.top;
    c.style.transform=`perspective(1200px) rotateX(${(((y/r.height)-0.5)*-5).toFixed(2)}deg) rotateY(${(((x/r.width)-0.5)*7).toFixed(2)}deg) translateY(-2px)`;
    c.style.setProperty('--sx',x+'px');
    c.style.setProperty('--sy',y+'px');
  }
  function handleLeave() { const c=ref.current; if(c) c.style.transform=''; }
  function open(){ onOpen && onOpen(p); }
  function onKey(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } }

  return (
    <div ref={ref} role="button" tabIndex={0}
       onClick={open} onKeyDown={onKey}
       onPointerMove={handleMove} onPointerLeave={handleLeave}
       aria-label={'View details for '+p.title}
       className="featured is-tilting">
      <div className="featured-cover">
        <CoverImg cover={p.cover} title={p.title}/>
        <span className="cat-pill">{p.cat}</span>
        <span className="featured-flag">
          <Icon.Dot style={{width:8,height:8,color:'var(--available)'}}/> Featured
        </span>
      </div>
      <div className="featured-body">
        <div style={{display:'flex',alignItems:'center',gap:10,color:'var(--fg-muted)',fontSize:13}}>
          <span className="mono">{projDateLabel(p)}</span>
          <span style={{color:'var(--fg-faint)'}}>·</span>
          <span>{p.cat}</span>
        </div>
        <h3 style={{margin:'10px 0 12px',fontSize:30,lineHeight:1.1,letterSpacing:'-0.02em',fontWeight:500}}>{p.title}</h3>
        <p className="sub" style={{margin:0,maxWidth:560}}>{p.long}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:22}}>
          {p.tags.map(t=><Tag key={t}>{t}</Tag>)}
        </div>
        <div className="featured-actions" style={{marginTop:28}}>
          <span className="see-more-cta">
            <span>See details</span>
            <Icon.ArrowUR/>
          </span>
          <ProjectLink url={p.github}/>
        </div>
      </div>
      <div className="featured-sheen"/>
      <style>{`
        .featured{
          display:grid;grid-template-columns:1.15fr 1fr;gap:0;
          border:1px solid var(--border);border-radius:16px;
          background:var(--bg-elev);overflow:hidden;cursor:pointer;
          text-decoration:none;color:inherit;
          box-shadow:var(--shadow);
          transition:border-color 240ms ease,box-shadow 240ms ease,transform 240ms cubic-bezier(.2,.7,.2,1);
        }
        .featured:hover{
          border-color:var(--blue);
          box-shadow:0 24px 60px -24px color-mix(in oklab,var(--blue) 40%,transparent);
          transform:translateY(-2px);
        }
        .featured:focus-visible{outline:2px solid var(--blue);outline-offset:3px;}
        .featured-actions{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;}
        .featured-cover{position:relative;aspect-ratio:16/9;border-right:1px solid var(--border);background:var(--bg-soft);}
        .featured-body{padding:32px 36px 44px;display:flex;flex-direction:column;justify-content:center;}
        .featured-flag{
          position:absolute;top:14px;right:14px;
          display:inline-flex;align-items:center;gap:6px;
          font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;
          background:rgba(10,10,10,0.7);color:#fafafa;
          padding:4px 10px;border-radius:6px;backdrop-filter:blur(8px);
        }
        @media(max-width:780px){
          .featured{grid-template-columns:1fr;}
          .featured-cover{border-right:0;border-bottom:1px solid var(--border);}
          .featured-body{padding:24px 24px 32px;}
        }
        /* ── "See more" CTA ──────────────────────────────────────── */
        .see-more-cta{
          display:inline-flex;align-items:center;gap:7px;
          font-size:14px;font-weight:500;
          color:var(--fg-muted);
          position:relative;padding-bottom:2px;
          transition:color 220ms ease,gap 260ms cubic-bezier(.2,.7,.2,1);
        }
        /* underline that draws in from left */
        .see-more-cta::after{
          content:'';position:absolute;bottom:0;left:0;width:100%;height:1.5px;
          background:var(--blue);border-radius:999px;
          transform:scaleX(0);transform-origin:left;
          transition:transform 420ms cubic-bezier(.2,.7,.2,1);
        }
        .featured:hover .see-more-cta{color:var(--blue-fg);gap:11px;}
        .featured:hover .see-more-cta::after{transform:scaleX(1);}
        .featured:hover .see-more-cta svg{transform:translate(3px,-3px) rotate(6deg);}
        .see-more-cta svg{
          width:13px;height:13px;flex-shrink:0;
          transition:transform 300ms cubic-bezier(.2,.7,.2,1);
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// ABOUT — an immersive, scroll-driven story in five beats
// ═══════════════════════════════════════════════════════════════
// Reuses the home's native-scroll engine: every act is a tall section with a
// sticky inner stage animated by sceneProgress() (0→1 as it crosses the
// viewport). The CSS describes each element's FINAL (visible) state; the JS
// paints the hidden→shown animation by writing inline styles each frame. On
// small screens / reduced-motion the JS bails to the final state immediately
// and a media query unsticks the sections into a plain scrollable column.

function reduceMotion(){ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
function useMedia(query){
  const [match,setMatch]=useState(()=>window.matchMedia(query).matches);
  useEffect(()=>{
    const mq=window.matchMedia(query);
    const h=e=>setMatch(e.matches);
    mq.addEventListener('change',h);
    return ()=>mq.removeEventListener('change',h);
  },[query]);
  return match;
}

function About({ go }) {
  const lite = useMedia('(max-width:640px)');
  return (
    <div className="page-enter about-story">
      <AboutIntro lite={lite} go={go}/>
      <EducationAct lite={lite}/>
      <SkillsAct lite={lite}/>
      <PassionsAct lite={lite} go={go}/>
    </div>
  );
}

// ─── Act 1 · Who I am (de-greying lead, like the home manifesto) ──────────────
function AboutIntro({ lite, go }) {
  const P = PROFILE();
  const paras = [P.bio?.[0], P.bio?.[1]].filter(Boolean).map(t=>t.split(/\s+/).filter(Boolean));
  const offsets = []; { let acc=0; paras.forEach(wa=>{ offsets.push(acc); acc+=wa.length; }); }
  const total = offsets.length ? offsets[offsets.length-1]+paras[paras.length-1].length : 0;
  const secRef = useRef(null), wordsRef = useRef([]);
  useEffect(()=>{
    const el=secRef.current; if(!el) return;
    const spans=wordsRef.current.filter(Boolean);
    if(lite||reduceMotion()){ spans.forEach(s=>s.style.opacity=1); return; }
    const n=spans.length, spread=3.2;
    let raf=0;
    function upd(){ raf=0;
      // Spread the reveal across the whole runway so it's slower and finishes
      // right as the act ends (no dead lit-text zone before the timeline).
      const head=clamp(sceneProgress(el),0,1)*(n+spread);
      spans.forEach((s,i)=>{ const w=clamp((head-i)/spread,0,1); s.style.opacity=(0.14+0.86*w).toFixed(3); });
    }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[total,lite]);
  return (
    <section ref={secRef} className="ab-intro" style={{height:'178vh'}}>
      <div className="ab-intro-sticky shell">
        <div className="ab-id">
          <Avatar/>
          <div>
            <div className="eyebrow">About</div>
            <div className="ab-id-name">{P.name}</div>
            <div className="ab-id-meta">{P.location} · {P.age}</div>
          </div>
        </div>
        <div className="ab-lead-group">
          {paras.map((wa,pi)=>(
            <p key={pi} className="ab-lead">
              {wa.map((w,wi)=>{ const idx=offsets[pi]+wi; return (
                <span key={wi} className="lp-word" ref={el=>wordsRef.current[idx]=el}>{w}{wi<wa.length-1?' ':''}</span>
              );})}
            </p>
          ))}
        </div>
        <div className="ab-id-actions">
          {P.cv && <a href={P.cv} target="_blank" rel="noopener noreferrer" className="btn-ghost-2"><Icon.Download/> Resume</a>}
          {P.linkedin && <a href={P.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost-2"><Icon.Linkedin style={{width:14,height:14}}/> LinkedIn</a>}
        </div>
        <LanguagesMini/>
        <div className="ab-cue" aria-hidden="true">
          <span>Scroll the story</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v13M18 12l-6 6-6-6"/></svg>
        </div>
      </div>
    </section>
  );
}

// ─── Act 2 · The path (a timeline you travel through) ─────────────────────────
// The milestones glide horizontally past the viewport centre as you scroll:
// whichever one is centred is in focus (scaled, lit), the ones behind stay lit,
// the ones ahead are faint — so it reads like moving along a route. Mobile /
// reduced-motion just stacks them, all lit.
function EducationAct({ lite }) {
  // Travel oldest → newest, whatever order the data is in.
  const yearOf = e => { const m=String(e.period||'').match(/\d{4}/); return m?+m[0]:0; };
  const edu = [...(PROFILE().education || [])].sort((a,b)=>yearOf(a)-yearOf(b));
  const n = edu.length;
  const secRef=useRef(null), trackRef=useRef(null), cardRefs=useRef([]);
  useEffect(()=>{
    const el=secRef.current, track=trackRef.current; if(!el||!track||!n) return;
    const cards=cardRefs.current.filter(Boolean);
    const lerp=(a,b,t)=>a+(b-a)*t;
    // Gentle smoothstep: still magnetised toward each point, but the transit
    // between points is spread out so it reads slow and deliberate, not snappy.
    const smoother=t=>{ t=clamp(t,0,1); return t*t*(3-2*t); };
    if(lite||reduceMotion()){
      track.style.transform='none';
      cards.forEach((c,i)=>{ c.classList.add('lit'); c.classList.toggle('focus', i===0); });
      return;
    }
    function layout(){
      const r=el.getBoundingClientRect();
      const pinP=clamp((-r.top)/Math.max(1,(r.height-window.innerHeight)),0,1);
      const cx=track.parentElement.clientWidth/2;
      const nodes=cards.map(c=>c.offsetLeft+c.offsetWidth/2);
      // Magnetised travel: float position 0..n-1, but eased PER SEGMENT with a
      // smootherstep so the timeline lingers ON each milestone and slides quickly
      // between them — it feels snapped, not free.
      const fp=pinP*(n-1);
      const k=clamp(Math.floor(fp),0,Math.max(0,n-2));
      const f=smoother(fp-k);
      const target=n>1 ? lerp(nodes[k],nodes[k+1],f) : nodes[0];
      track.style.transform=`translateX(${(cx-target).toFixed(1)}px)`;
      const focusI=Math.round(fp);
      cards.forEach((c,i)=>{ c.classList.toggle('lit', i<=focusI); c.classList.toggle('focus', i===focusI); });
    }
    let raf=0; function upd(){ raf=0; layout(); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[n,lite]);
  if(!n) return null;
  return (
    <section ref={secRef} className="ab-edu" style={{height:'175vh'}}>
      <div className="ab-edu-sticky">
        <div className="ab-head shell"><div className="eyebrow">The path</div><h3 className="ab-h">Where I've studied<span className="dotted">.</span></h3></div>
        <div className="ab-edu-viewport">
          <div className="ab-edu-rail" aria-hidden="true"/>
          <div className="ab-edu-track" ref={trackRef}>
            {edu.map((e,i)=>(
              <div key={i} className="ab-edu-card" ref={el=>cardRefs.current[i]=el}>
                <span className="ab-edu-node"/>
                <div className="ab-edu-period mono">{e.period}</div>
                <div className="ab-edu-degree">{e.degree}</div>
                <div className="ab-edu-school">{e.school}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Act 3 · The toolkit (a workbench of skill cards, by category) ────────────
// Falls back to a single group built from the flat `tools` list if `toolGroups`
// isn't set in data.js. Tools we already ship a real glyph for render it.
const SKILL_ICON = { notion:'Notion', git:'Github', github:'Github' };
function SkillsAct({ lite }) {
  const P = PROFILE();
  const groups = (P.toolGroups && P.toolGroups.length)
    ? P.toolGroups
    : [{ label:'Toolkit', items:(P.tools||[]).map(t=>[t, t.slice(0,2)]) }];
  const flat = [];
  groups.forEach((g,gi)=> (g.items||[]).forEach((it,ii)=> flat.push({gi,ii,name:it[0],mono:it[1]||it[0].slice(0,2)})));
  const secRef=useRef(null), cardRefs=useRef([]);
  useEffect(()=>{
    const el=secRef.current; if(!el||!flat.length) return;
    const cards=cardRefs.current.filter(Boolean);
    function setFinal(){ cards.forEach(c=>{ c.style.opacity=1; c.style.transform='none'; }); }
    if(lite||reduceMotion()){ setFinal(); return; }
    function layout(p){
      const e=clamp(p,0,1), n=cards.length, start=0.12, stag=0.55/(n+2);
      cards.forEach((c,i)=>{
        const cp=easeInOut(clamp((e-start-i*stag)/0.3,0,1));
        c.style.opacity=cp.toFixed(3);
        c.style.transform=`translateY(${((1-cp)*46).toFixed(1)}px) scale(${(0.9+0.1*cp).toFixed(3)})`;
      });
    }
    let raf=0; function upd(){ raf=0; layout(sceneProgress(el)); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[lite,flat.length]);
  if(!flat.length) return null;
  return (
    <section ref={secRef} className="ab-tools">
      <div className="ab-tools-inner shell">
        <div className="ab-head"><div className="eyebrow">The toolkit</div><h3 className="ab-h">What I build with<span className="dotted">.</span></h3></div>
        <div className="ab-skill-groups">
          {groups.map((g,gi)=>(
            <div key={gi} className="ab-skill-group">
              <div className="ab-skill-label mono">{g.label}</div>
              <div className="ab-skill-cards">
                {(g.items||[]).map((it,ii)=>{
                  const fi=flat.findIndex(f=>f.gi===gi&&f.ii===ii);
                  const logo=it[2];
                  // Real glyph for tools we already ship an icon for.
                  const builtin=SKILL_ICON[it[0].toLowerCase()];
                  const Glyph=builtin ? Icon[builtin] : null;
                  return (
                    <div key={ii} className="ab-skill-card" ref={el=>{ cardRefs.current[fi]=el; }}>
                      <span className={'ab-skill-badge'+(logo||Glyph?' has-logo':' mono')}>
                        {logo ? <img src={logo} alt={it[0]} loading="lazy"/> : Glyph ? <Glyph/> : (it[1]||it[0].slice(0,2))}
                      </span>
                      <span className="ab-skill-name">{it[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Languages · compact block shown inside the intro (not a full-width act) ──
function levelRatio(lvl){ const s=String(lvl).toLowerCase();
  if(s.includes('native')) return 1;
  if(s.includes('c2')) return 0.95;
  if(s.includes('c1')||s.includes('fluent')) return 0.82;
  if(s.includes('b2')) return 0.62;
  if(s.includes('b1')) return 0.48;
  return 0.4;
}
function LanguagesMini() {
  const langs = PROFILE().languages || [];
  const ref = useRef(null);
  useEffect(()=>{
    const root=ref.current; if(!root||!langs.length) return;
    const fills=[...root.querySelectorAll('.ab-lang-fill')];
    const fill=()=>fills.forEach(f=>{ f.style.width=f.dataset.w+'%'; });
    if(reduceMotion()){ fill(); return; }
    // Drive the fill from scroll position so the bars grow as the block travels
    // up through the viewport; they settle once it's comfortably in view.
    function upd(){
      const r=root.getBoundingClientRect(), vh=window.innerHeight;
      const p=clamp((vh*0.92 - r.top)/(vh*0.5), 0, 1);
      fills.forEach(f=>{ f.style.width=(p*(+f.dataset.w)).toFixed(1)+'%'; });
    }
    let raf=0; const s=()=>{ if(!raf) raf=requestAnimationFrame(()=>{ raf=0; upd(); }); };
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[langs.length]);
  if(!langs.length) return null;
  return (
    <div className="ab-langs-mini" ref={ref}>
      <div className="eyebrow">Languages</div>
      <div className="ab-langs-row">
        {langs.map(([l,lvl])=>(
          <div key={l} className="ab-lang-chip">
            <div className="ab-lang-chip-top"><span className="ab-lang-name">{l}</span><span className="ab-lang-level mono">{lvl}</span></div>
            <div className="ab-lang-bar"><span className="ab-lang-fill" data-w={(levelRatio(lvl)*100).toFixed(0)} style={{width:0}}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Act 5 · Beyond the data (passions as pinned cards on a wall) ─────────────
// Each passion is a slightly-tilted card pinned to a board; they drop into place
// (from above, settling into their resting tilt) as the act scrolls past.
function PassionsAct({ lite, go }) {
  const interests = PROFILE().interests || [];
  const secRef=useRef(null), cardRefs=useRef([]);
  // Deterministic resting tilt per card so the layout is stable across renders.
  const tilt = i => ((i*37)%2 ? 1 : -1) * (3 + (i*53)%4);
  useEffect(()=>{
    const el=secRef.current; if(!el||!interests.length) return;
    const cards=cardRefs.current.filter(Boolean);
    function setFinal(){ cards.forEach((c,i)=>{ c.style.opacity=1; c.style.transform=`rotate(${tilt(i)}deg)`; }); }
    if(lite||reduceMotion()){ setFinal(); return; }
    function layout(p){
      const e=clamp(p,0,1), n=cards.length, start=0.12, stag=0.55/(n+2);
      cards.forEach((c,i)=>{
        const cp=easeInOut(clamp((e-start-i*stag)/0.3,0,1));
        c.style.opacity=cp.toFixed(3);
        const rot=tilt(i)*cp + (1-cp)*-2;
        c.style.transform=`translateY(${((1-cp)*-70).toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${(0.92+0.08*cp).toFixed(3)})`;
      });
    }
    let raf=0; function upd(){ raf=0; layout(sceneProgress(el)); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[interests,lite]);
  if(!interests.length) return null;
  return (
    <section ref={secRef} className="ab-pack">
      <div className="ab-pack-inner shell">
        <div className="ab-head"><div className="eyebrow">Beyond the data</div><h3 className="ab-h">What I'm into<span className="dotted">.</span></h3></div>
        <div className="ab-board">
          {interests.map((it,i)=>{
            const Glyph=Icon[it.icon]||Icon.Dot;
            return (
              <div key={i} className="ab-pin-card" ref={el=>cardRefs.current[i]=el}>
                <span className="ab-pin"/>
                <span className="ab-pin-ico"><Glyph/></span>
                <span className="ab-pin-label">{it.label}</span>
              </div>
            );
          })}
        </div>
        <div className="ab-pack-cta">
          <button onClick={()=>go&&go('contact')} className="btn-primary">Let's talk <Icon.Arrow/></button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════
function Contact() {
  const P = PROFILE();
  const [email, setEmail]     = useState('');
  const [msg, setMsg]         = useState('');
  const [topic, setTopic]     = useState('Internship');
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSend    = validEmail && msg.trim().length>6;
  const endpoint   = P.formspree && P.formspree !== '#' ? P.formspree : null;

  async function send(e) {
    e.preventDefault();
    if (!canSend || sending) return;
    setError(false);

    // No Formspree endpoint configured → keep the optimistic demo behaviour.
    if (!endpoint) {
      setSent(true);
      setTimeout(()=>{ setSent(false); setEmail(''); setMsg(''); }, 3200);
      return;
    }

    setSending(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify({ email, topic, message: msg, _subject: `Portfolio · ${topic} — ${email}` }),
      });
      setSending(false);
      if (res.ok) {
        setSent(true);
        setTimeout(()=>{ setSent(false); setEmail(''); setMsg(''); }, 3200);
      } else {
        setError(true);
      }
    } catch (_) {
      setSending(false);
      setError(true);
    }
  }

  return (
    <div className="page-enter shell" style={{paddingTop:64,maxWidth:720}}>
      <div style={{textAlign:'center'}}>
        <div className="eyebrow">Get in touch</div>
        <h2 className="h2" style={{marginTop:10}}>Let's talk<span style={{color:'var(--fg-faint)'}}>.</span></h2>
        <p className="sub" style={{marginTop:14}}>
          Internships, freelance, coffee chats — all welcome. Usually reply within a day.
        </p>
      </div>

      <form onSubmit={send} style={{marginTop:48,display:'grid',gap:14}}>
        <SlidingPills
          items={['Internship','Freelance','Coffee chat','Other']}
          value={topic}
          onChange={setTopic}
          style={{alignSelf:'center'}}
        />

        <label className="field" style={{marginTop:14}}>
          <span className="field-label">Your email</span>
          <input type="email" required
            placeholder="you@somewhere.com"
            value={email} onChange={e=>setEmail(e.target.value)}
            className="input"/>
        </label>

        <label className="field">
          <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between'}}>
            <span className="field-label">Message</span>
            <span className="mono" style={{fontSize:11,color:'var(--fg-faint)'}}>{msg.length} / 600</span>
          </div>
          <textarea rows="6" maxLength={600} required
            placeholder={`Hey Arthur — we're looking for a summer analytics intern at...`}
            value={msg} onChange={e=>setMsg(e.target.value)}
            className="input" style={{resize:'vertical',minHeight:140}}/>
        </label>

        <button type="submit" disabled={!canSend||sent||sending} className="send">
          {sent
            ? <><Icon.Check/> Sent — talk soon</>
            : sending
              ? <>Sending…</>
              : <>Send <Icon.Arrow/></>}
        </button>
        {error && (
          <p className="mono" style={{margin:'2px 0 0',fontSize:12,color:'#dc2626',textAlign:'center'}}>
            Something went wrong — please email me directly at {P.email}.
          </p>
        )}
      </form>

      {/* Social links */}
      <div style={{marginTop:56,paddingTop:28,borderTop:'1px solid var(--border)',
        display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
        {[
          { name:'LinkedIn', icon:<Icon.Linkedin style={{width:14,height:14}}/>, href:P.linkedin },
          { name:'GitHub',   icon:<Icon.Github   style={{width:14,height:14}}/>, href:P.github },
          { name:'Email',    icon:<Icon.Mail/>,                                  href:P.email?`mailto:${P.email}`:null },
        ].map(s=>(
          <a key={s.name}
             href={s.href&&s.href!=='#'?s.href:'#'}
             target={s.href&&s.href!=='#'&&!s.href.startsWith('mailto')? '_blank':undefined}
             rel="noopener noreferrer"
             onClick={e=>{ if(!s.href||s.href==='#') e.preventDefault(); }}
             className="social">
            {s.icon}<span>{s.name}</span>
          </a>
        ))}
      </div>

      <style>{`
        .field{display:grid;gap:8px;}
        .field-label{font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--fg-muted);}
        .input{
          width:100%;padding:14px 16px;
          background:var(--bg-elev);border:1px solid var(--border);
          border-radius:10px;color:var(--fg);
          font-family:inherit;font-size:15px;letter-spacing:-0.005em;outline:none;
          transition:border-color 140ms ease,box-shadow 140ms ease,background 140ms ease;
        }
        .input::placeholder{color:var(--fg-faint);}
        .input:focus{border-color:var(--blue);box-shadow:0 0 0 4px color-mix(in oklab,var(--blue) 18%,transparent);}
        .send{
          position:relative;overflow:hidden;margin-top:6px;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          height:50px;padding:0 22px;border-radius:10px;
          background:var(--accent);color:var(--accent-fg);border:1px solid var(--accent);
          font-family:inherit;font-size:15px;font-weight:500;cursor:pointer;
          box-shadow:0 0 0 0 var(--blue);
          transition:transform 140ms ease,background 240ms ease,border-color 240ms ease,box-shadow 240ms ease;
        }
        .send:disabled{opacity:0.35;cursor:not-allowed;}
        .send:not(:disabled):hover{background:var(--blue);border-color:var(--blue);box-shadow:0 10px 30px -10px var(--blue);}
        .send:not(:disabled):hover svg{transform:translateX(4px);}
        .send:not(:disabled):active{transform:scale(0.985);}
        .send svg{width:14px;height:14px;transition:transform 220ms cubic-bezier(.2,.7,.2,1);}
        .social{
          display:inline-flex;align-items:center;gap:8px;
          padding:8px 14px;border-radius:999px;
          font-size:13px;color:var(--fg-muted);text-decoration:none;
          transition:color 200ms ease,background 200ms ease;
        }
        .social:hover{color:var(--blue);background:var(--blue-soft);}
        .social svg{width:14px;height:14px;}
      `}</style>
    </div>
  );
}

Object.assign(window, { Landing, Projects, About, Contact, ULink });
