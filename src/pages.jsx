// Pages — Landing, Projects, About, Contact
// Data is pulled from window.PORTFOLIO_DATA (set by data.js).

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ─── Data helpers ────────────────────────────────────────────────────────────
const DATA    = () => window.PORTFOLIO_DATA || {};
const PROFILE = () => DATA().profile   || {};
const PROJS   = () => DATA().projects  || [];

// Live age from an ISO date of birth ("YYYY-MM-DD"). Falls back to a static
// `age` field if `birth` is missing/invalid, so old data still renders.
function computeAge(birth){
  const d = new Date(birth);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}

// CV links. `profile.cv` may be a single string OR an object keyed by language
// ({ en, fr, nl }); the first available entry is the primary one.
//
// The language menu follows the PDFs you actually ship: every same-origin CV
// declared below is probed once (HEAD request), and a language whose file is
// missing from /assets/cv is dropped from the menu. So dropping in only an EN
// and an FR PDF leaves NL out on its own — no data.js edit needed. Probing
// fails open (network error, file:// preview) so a link is never hidden by
// accident, and external URLs are trusted as-is.
const CV_LANGS = [['en','English'],['fr','Français'],['nl','Nederlands']];

// Links as declared in data.js, before the availability check.
function cvDeclared(P){
  const cv = (P||{}).cv;
  if (!cv) return [];
  if (typeof cv === 'string') return (cv && cv!=='#') ? [{ lang:'en', label:'CV', href:cv }] : [];
  return CV_LANGS.map(([lang,label]) => (cv[lang] && cv[lang]!=='#') ? { lang, label, href:cv[lang] } : null).filter(Boolean);
}

const cvFound  = new Map();   // href -> true | false, once the probe answered
const cvProbes = new Map();   // href -> in-flight probe, so we ask only once
function cvProbe(href){
  if (cvProbes.has(href)) return cvProbes.get(href);
  const sameOrigin = !/^[a-z]+:\/\//i.test(href) && !href.startsWith('//');
  const canProbe   = sameOrigin
    && typeof fetch === 'function'
    && typeof location !== 'undefined' && location.protocol !== 'file:';
  const p = (canProbe
      ? fetch(href, { method:'HEAD' }).then(r=>r.ok).catch(()=>true)
      : Promise.resolve(true))
    .then(ok=>{ cvFound.set(href, ok); return ok; });
  cvProbes.set(href, p);
  return p;
}

// Sync view: everything declared minus what a finished probe proved missing.
function cvLinks(P){ return cvDeclared(P).filter(c => cvFound.get(c.href) !== false); }
// Async view: waits for the probes, so the result is final.
function cvLinksReady(P){
  const declared = cvDeclared(P);
  return Promise.all(declared.map(c=>cvProbe(c.href)))
    .then(ok => declared.filter((c,i)=>ok[i]));
}
function cvPrimary(P){ const l = cvLinks(P); return l.length ? l[0].href : null; }

// Hook used by the nav button and the About page: renders what we know now,
// then re-renders once the missing-file check comes back.
function useCvLinks(){
  const P = PROFILE();
  const [links, setLinks] = useState(()=>cvLinks(P));
  useEffect(()=>{
    let alive = true;
    cvLinksReady(P).then(l=>{ if (alive) setLinks(l); });
    return ()=>{ alive = false; };
  }, []);
  return links;
}

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
    <span className="tag-pill" style={{
      display:'inline-flex',alignItems:'center',
      height:24,padding:'0 10px',borderRadius:6,
      fontFamily:'Geist Mono,monospace',fontSize:11,letterSpacing:'0.01em',
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
      {/* The sky runs the length of the page and fades into the footer forest.
          Fixed-position, so it lives out here for the same reason the spotlight
          does: .page-enter's transform would trap it. Dark theme only. */}
      <NightSky />
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


// ─── The night sky ───────────────────────────────────────────────────────────
// The top half of the site's arc: sky here, the fir forest in the footer as
// ground. It spans the whole landing and thins out as the footer comes up, so
// the sky hands over to the trees instead of stopping at the first screen.
// Stars wire themselves together in the accent wherever the cursor goes.
//
// DARK ONLY. A day version was built and dropped: on a cream background an ink
// cloud can only ever be haze, and the light hero is better bare. Light mode
// draws nothing at all.
//
// NOTHING ANIMATES ON ITS OWN. The stars are fixed to their sky; the only
// things that move them are your scroll (parallax) and your cursor (the links).
// An earlier version gave each star a slow drift, and the result was a
// background visibly crawling at all times — the one thing a sky must never do.
// So there is no rAF loop: frames are scheduled by events and stop when you do.
//
// FIXED, not absolute: the sky spans the whole page, and a canvas that tall
// would cost a fortune in memory at DPR 2. One viewport-sized canvas plus a
// scroll offset gives an endless sky for a fixed budget. Being fixed, it must
// live OUTSIDE .page-enter — that animation's transform would otherwise turn it
// into a clipped containing block (the same reason .spotlight-layer sits where
// it does). Styles are in index.html under "Landing · the night sky".
function NightSky() {
  const ref = useRef(null);
  useEffect(()=>{
    const cv=ref.current; if(!cv) return;
    const ctx=cv.getContext('2d'); if(!ctx) return;
    const hover = window.matchMedia('(hover: hover)').matches;
    const LINK=118, REACH=210;   // px: max link length · cursor influence radius
    // Scroll is the only thing that moves this sky, so it may as well move it
    // properly. The depth is NOT one shared speed: every star carries its own,
    // and a star's speed, size and brightness all come from the same `depth`
    // roll. Near stars are bigger, brighter and slide fast; far ones are faint
    // specks that barely budge. That spread is what reads as space — a field
    // moving at a single speed is a sheet of paper sliding past, however fast
    // you push it.
    const PARALLAX=0.55;         // the nearest stars; the farthest get ~0.16
    let w=0,h=0,raf=0,mx=-9999,my=-9999,stars=[];
    let night=true, fg='#fafafa', accent='#2563eb', fade=1, sy=0;

    const wrap=(v,max)=>((v%max)+max)%max;

    function readTheme(){
      const cs=getComputedStyle(document.documentElement);
      fg     =(cs.getPropertyValue('--fg')  ||'#ffffff').trim();
      accent =(cs.getPropertyValue('--blue')||'#2563eb').trim();
      night  = document.documentElement.getAttribute('data-theme')==='dark';
    }
    function populate(){
      if(!w||!h) return;
      // Density follows area, so a phone gets a sparse sky and not a swarm.
      const n=Math.round(Math.max(34, Math.min(105, (w*h)/17000)));
      stars=Array.from({length:n},()=>{
        const depth=Math.random();          // one roll drives size, light, speed
        return {
          x:Math.random()*w, y:Math.random()*h,
          r:0.5+depth*1.3,
          a:0.13+depth*0.34,
          p:PARALLAX*(0.3+0.7*depth),
        };
      });
    }
    function resize(){
      const dpr=Math.min(window.devicePixelRatio||1, 2);
      w=cv.clientWidth; h=cv.clientHeight;
      if(!w||!h) return;
      cv.width=Math.round(w*dpr); cv.height=Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      populate();
    }
    // How much sky is left. Full until the footer is one viewport away, gone by
    // the time it reaches the top edge — the sky hands over to the trees.
    function skyFade(){
      const foot=document.querySelector('.foot');
      if(!foot) return 1;
      return clamp(foot.getBoundingClientRect().top / window.innerHeight, 0, 1);
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      if(!night || fade<=0.001) return;
      // Each star's on-screen position depends on its own depth, so resolve the
      // whole field once here and let both passes below read from it.
      const pts=stars.map(s=>({ x:s.x, y:wrap(s.y - sy*s.p, h), r:s.r, a:s.a }));
      // Links first so the dots sit on top of their own threads. Only stars
      // within REACH of the cursor are considered, which keeps the O(n²) pass
      // over a handful of points instead of the whole field.
      if(hover && mx>-9998){
        const near=pts.filter(p=>Math.hypot(p.x-mx, p.y-my)<REACH);
        ctx.strokeStyle=accent; ctx.lineWidth=0.7;
        for(let i=0;i<near.length;i++){
          for(let j=i+1;j<near.length;j++){
            const a=near[i], b=near[j];
            const d=Math.hypot(a.x-b.x, a.y-b.y);
            if(d>LINK) continue;
            // Fade on both counts: long links are fainter, and so are links
            // whose midpoint sits far from the cursor.
            const mid=Math.hypot((a.x+b.x)/2-mx, (a.y+b.y)/2-my);
            ctx.globalAlpha=(1-d/LINK)*(1-mid/REACH)*0.5*fade;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      for(const p of pts){
        const k=hover ? Math.max(0, 1-Math.hypot(p.x-mx, p.y-my)/REACH) : 0;
        ctx.globalAlpha=Math.min(1, p.a + k*0.42)*fade;
        ctx.fillStyle  = k>0.45 ? accent : fg;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + k*0.5, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1;
    }

    // One frame per event at most, and none at all while you sit still.
    function render(){ raf=0; sy=window.scrollY; fade=skyFade(); draw(); }
    function schedule(){ if(!raf) raf=requestAnimationFrame(render); }

    function onMove(e){ mx=e.clientX; my=e.clientY; schedule(); }
    function onLeave(){ mx=my=-9999; schedule(); }
    function onResize(){ resize(); schedule(); }
    function onTheme(){ readTheme(); schedule(); }

    readTheme(); resize(); render();
    const themeObs=new MutationObserver(onTheme);
    themeObs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','style']});
    window.addEventListener('pointermove',onMove,{passive:true});
    window.addEventListener('pointerleave',onLeave);
    window.addEventListener('resize',onResize);
    window.addEventListener('scroll',schedule,{passive:true});
    return ()=>{
      themeObs.disconnect();
      window.removeEventListener('pointermove',onMove);
      window.removeEventListener('pointerleave',onLeave);
      window.removeEventListener('resize',onResize);
      window.removeEventListener('scroll',schedule);
      if(raf) cancelAnimationFrame(raf);
    };
  },[]);
  return <canvas ref={ref} className="sky-layer" aria-hidden="true"/>;
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
    let mobile=false, laneX=36;   // on phones the comet runs in a left margin lane

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
      // On phones the manifesto text is indented to the right, so the comet
      // travels straight down a narrow left lane — beside the text, not behind.
      mobile = W <= 640;
      laneX  = mobile ? 19 : Math.max(36, W*0.10);
      A1={ x:laneX, y:m.top-hb.top + m.height*0.5 };
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
      if(mobile){
        // Hold the left lane across the manifesto, then swing back to centre so
        // the comet finishes centred above the deck title (not stuck on the left).
        const lock = A2.y - Math.max(36, dotR*2.4);
        const holdEnd = lerp(A1.y, lock, 0.7);
        if(y<=holdEnd) return A1.x;
        return lerp(A1.x, A2.x, smooth(clamp((y-holdEnd)/Math.max(1, lock-holdEnd),0,1)));
      }
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
// Mobile gets a swipeable wallet-style stack (distinct from Work's list).
function DeckAct({ go }) {
  const all = PROJS();
  // Explicit pick from data.js (`homeDeck: ["id1","id2",...]`) wins when set;
  // otherwise fall back to the automatic pick (featured project first).
  const picks = DATA().homeDeck;
  const ordered = (Array.isArray(picks) && picks.length)
    ? picks.map(id=>all.find(p=>p.id===id)).filter(Boolean).slice(0,6)
    : [...all].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0)).slice(0,6);
  const cards = centerFirst(ordered);
  const [mobile, setMobile] = useState(()=>window.matchMedia('(max-width:640px)').matches);
  useEffect(()=>{
    const mq=window.matchMedia('(max-width:640px)');
    const h=e=>setMobile(e.matches);
    mq.addEventListener('change',h);
    return ()=>mq.removeEventListener('change',h);
  },[]);
  if(!cards.length) return null;
  return mobile ? <DeckMobile cards={ordered} go={go}/> : <DeckFan cards={cards} go={go}/>;
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
      {p.summary && <p className="pm-summary">{p.summary}</p>}
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

// A wallet-style pile: cards stacked with a peek; flick the top one sideways to
// send it to the back, tap it to open. Deliberately unlike Work's vertical list.
function DeckMobile({ cards, go }) {
  const n = cards.length;
  const [order, setOrder]   = useState(()=>cards.map((_,i)=>i));
  const [drag, setDrag]     = useState({x:0,active:false});
  const [flying, setFlying] = useState(null);   // {id,dir} card being flicked off
  const [pinned, setPinned] = useState(null);   // id reinserted at back (no anim 1 frame)
  const reduce   = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Live mirrors so the window-level gesture handlers (bound once) always see
  // fresh values without re-binding.
  const orderRef  = useRef(order);  orderRef.current  = order;
  const flyingRef = useRef(flying); flyingRef.current = flying;
  const gesture   = useRef(null);   // {sx,sy,dx,dir} while a finger is down
  const movedRef  = useRef(false);  // did this gesture move enough to suppress the tap→link?

  function advance(dir){
    if(flyingRef.current || n<2) return;
    const id = orderRef.current[0];
    setFlying({ id, dir });
    const after = ()=>{
      setOrder(o=>[...o.slice(1), o[0]]);
      setFlying(null);
      setPinned(id);
      requestAnimationFrame(()=>requestAnimationFrame(()=>setPinned(p=>p===id?null:p)));
    };
    reduce.current ? after() : setTimeout(after, 300);
  }
  const advanceRef = useRef(advance); advanceRef.current = advance;

  // Swipe on the cards themselves. We track the gesture on `window` and rely on
  // the touch pointer's implicit capture (rather than setPointerCapture, which is
  // unreliable on iOS Safari and can swallow pointermove or fire an early
  // pointercancel mid-swipe). We lock to an axis on the first move: a horizontal
  // drag flicks the deck, a vertical one is handed back to the browser so the
  // page still scrolls normally when a swipe starts on a card.
  useEffect(()=>{
    function move(e){
      const g = gesture.current; if(!g) return;
      const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
      if(!g.dir){
        if(Math.abs(dx) > 8 || Math.abs(dy) > 8){
          g.dir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
          if(g.dir === 'v'){ end(); return; }   // vertical → let the page scroll
        } else return;
      }
      if(g.dir !== 'h') return;
      g.dx = dx;
      if(Math.abs(dx) > 6) movedRef.current = true;
      setDrag({x:dx, active:true});
    }
    function end(){
      const g = gesture.current; if(!g) return;
      gesture.current = null;
      setDrag({x:0, active:false});
      if(g.dir === 'h' && Math.abs(g.dx) > 52) advanceRef.current(g.dx > 0 ? 1 : -1);
    }
    window.addEventListener('pointermove', move, {passive:true});
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return ()=>{
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  },[]);

  function down(e){
    if(flyingRef.current) return;
    movedRef.current = false;
    gesture.current = { sx:e.clientX, sy:e.clientY, dx:0, dir:null };
  }

  function cardStyle(id){
    if(flying && flying.id===id){
      return { transform:`translateX(${flying.dir*135}%) translateY(-14px) rotate(${flying.dir*15}deg)`,
               opacity:0, zIndex:n+1,
               transition:'transform .32s cubic-bezier(.4,.05,.25,1), opacity .32s ease' };
    }
    const depth = order.indexOf(id);
    const isFront = depth===0;
    const dx = isFront && drag.active ? drag.x : 0;
    const noAnim = pinned===id || (isFront && drag.active);
    return {
      transform:`translateX(${dx}px) translateY(${depth*15}px) scale(${(1-depth*0.05).toFixed(3)}) rotate(${(dx*0.035).toFixed(2)}deg)`,
      opacity: depth>2 ? 0 : 1,
      zIndex: n - depth,
      transition: noAnim ? 'none' : 'transform .36s cubic-bezier(.2,.7,.2,1), opacity .3s ease',
    };
  }

  return (
    <section className="shell" style={{paddingTop:8}}>
      <div className="lp-deck-head" data-thread="deck" style={{textAlign:'left',marginBottom:20}}>
        <div className="eyebrow">Selected work</div>
        <h2 className="h2" style={{marginTop:10}}>Things I've built.</h2>
      </div>

      <div className="deck-wallet-stage" onPointerDown={down}>
        {cards.map((p,i)=>{
          const href = p.github&&p.github!=='#' ? p.github : undefined;
          return (
            <a key={i}
               className="deck-wallet-card"
               style={cardStyle(i)}
               href={href||'#'}
               target={href?'_blank':undefined}
               rel={href?'noopener noreferrer':undefined}
               draggable={false}
               onClick={e=>{ if(movedRef.current || order.indexOf(i)!==0 || !href) e.preventDefault(); }}>
              <div className="pm-cover"><CoverImg cover={p.cover} title={p.title}/></div>
              <div className="pm-meta">
                <span className="pm-cat">{p.cat}</span>
                <span className="pm-title">{p.title}</span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="deck-wallet-foot">
        <div className="deck-wallet-dots" aria-hidden="true">
          {cards.map((_,i)=>(
            <span key={i} className={'deck-wallet-dot'+(order.indexOf(i)===0?' on':'')}/>
          ))}
        </div>
        <button type="button" className="deck-wallet-next" onClick={()=>advance(-1)} aria-label="Next project">
          Swipe or tap <Icon.Arrow/>
        </button>
      </div>

      <button onClick={()=>go('work')} className="btn-primary"
              style={{width:'100%',justifyContent:'center',marginTop:22}}>
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

function Projects({ go }) {
  const projects = PROJS();
  // ?? null: only falls back when find() returns undefined (no match).
  // A project with featured:false is falsy, but projects.find() never returns false —
  // it returns the object or undefined. So || would wrongly use projects[0] when
  // the only project has featured:false. ?? null gives correct behaviour.
  const featured = projects.find(p=>p.featured) ?? null;
  const cats      = useMemo(()=>['All',...[...new Set(projects.map(p=>p.cat))]], [projects]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort]     = useState('desc');   // 'desc' = newest first
  const [cols, setCols]     = useState(2);         // grid density (cards per row)

  // Opening a project is a real navigation to #/work/:id, which App renders as
  // a full ProjectPage. Shareable, refresh-safe, and Back returns to the grid.
  const openProject = useCallback(p=>{ if (p) go('work/'+p.id); }, [go]);

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
      {featured && showFeatured && <FeaturedCard p={featured} onOpen={openProject}/>}

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
              {rest.map(p=><ProjectCard key={p.id} p={p} onOpen={openProject}/>)}
            </div>
          )}
      </div>
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
  const ref = useRef(null);
  function open(){ onOpen && onOpen(p); }
  function onKey(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } }
  function handleMove(e){
    const c=ref.current; if(!c || reduceMotion()) return;
    const r=c.getBoundingClientRect();
    const x=e.clientX-r.left, y=e.clientY-r.top;
    c.style.transform=`perspective(900px) rotateX(${(((y/r.height)-0.5)*-3.5).toFixed(2)}deg) rotateY(${(((x/r.width)-0.5)*4.5).toFixed(2)}deg) translateY(-3px)`;
    c.style.setProperty('--sx',x+'px');
    c.style.setProperty('--sy',y+'px');
  }
  function handleLeave(){ const c=ref.current; if(c) c.style.transform=''; }
  return (
    <article ref={ref} className="proj-card is-tilting" role="button" tabIndex={0}
             onClick={open} onKeyDown={onKey}
             onPointerMove={handleMove} onPointerLeave={handleLeave}
             aria-label={'View details for '+p.title}>
      <div className="proj-cover">
        <CoverImg cover={p.cover} title={p.title}/>
        <span className="cat-pill">{p.cat}</span>
      </div>
      <div className="proj-body">
        <div className="proj-meta mono">{projDateLabel(p)}{p.role?' · '+p.role:''}</div>
        <h3 className="proj-title">{p.title}</h3>
        <p className="proj-sum">{p.summary}</p>
        <div className="proj-tags">{p.tags.slice(0,4).map(t=><Tag key={t}>{t}</Tag>)}</div>
        <div className="proj-foot">
          <span className="proj-details">Details <Icon.Arrow/></span>
          <ProjectLink url={p.github}/>
        </div>
      </div>
      <div className="proj-card-sheen"/>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECT PAGE — one dedicated page per project, at #/work/:id
// ═══════════════════════════════════════════════════════════════
// Everything here is driven by data.js and EVERY block is optional:
//   • no `sections` → falls back to `long` + `highlights`
//   • no `gallery`  → no carousel at all (one image → a plain figure)
//   • no `attachments` → no files block
//   • no `skills` / `metrics` → those blocks are skipped
// So a project you never enrich still gets a correct page, and adding a
// project to data.js adds its page with no other change.

function projById(id){ return PROJS().find(p=>p.id===id) || null; }

// Links shown in the top bar and the rail: the primary `github` field plus any
// extra `links: [{ label, url }]`. Placeholders ("#", empty) are dropped.
function projLinks(p){
  const out = [];
  if (p.github && p.github!=='#') out.push({ url:p.github, label:null });
  (Array.isArray(p.links) ? p.links : []).forEach(l=>{
    if (l && l.url && l.url!=='#') out.push({ url:l.url, label:l.label||null });
  });
  const seen = new Set();
  return out.filter(l=>{ if (seen.has(l.url)) return false; seen.add(l.url); return true; });
}

// Body sections. Projects without a `sections` array still read well: their
// `long` paragraph and `highlights` bullets are folded into the same layout.
function projSections(p){
  if (Array.isArray(p.sections) && p.sections.length) return p.sections;
  const out = [];
  const intro = p.long || p.summary;
  if (intro) out.push({ title:'Overview', body:[intro] });
  if (Array.isArray(p.highlights) && p.highlights.length)
    out.push({ title:'Key points', list:p.highlights });
  return out;
}

// `skills` accepts "Python" or { name:"Python", note:"what I did with it" }.
function projSkills(p){
  return (Array.isArray(p.skills) ? p.skills : [])
    .map(s => typeof s==='string' ? { name:s, note:'' } : s)
    .filter(s => s && s.name);
}
// `gallery` accepts "/path.png" or { src, caption }.
function projGallery(p){
  return (Array.isArray(p.gallery) ? p.gallery : [])
    .map(g => typeof g==='string' ? { src:g, caption:'' } : g)
    .filter(g => g && g.src);
}

// ─── Attachments ─────────────────────────────────────────────────────────────
// The files that ship with a project: report, slide deck, dataset, notebook…
// An entry is a plain path/URL, or { label, url, type, note }. `type` is
// optional — it is read off the file extension when missing, and it picks both
// the glyph and the small kind label on the right of the row.
const ATT_TYPES = {
  pdf:'PDF',   doc:'Doc',    docx:'Doc',   odt:'Doc',   rtf:'Doc',
  txt:'Doc',   md:'Doc',
  ppt:'Slides', pptx:'Slides', key:'Slides', odp:'Slides',
  xls:'Sheet', xlsx:'Sheet', ods:'Sheet',  csv:'Data',  json:'Data',
  zip:'Archive', rar:'Archive', '7z':'Archive', tar:'Archive', gz:'Archive',
  ipynb:'Notebook', py:'Code', r:'Code', sql:'Code',
  // Spelled-out `type:` values from data.js land here too, so
  // `type:"Slides"` works exactly like `type:"pptx"`.
  slides:'Slides', report:'Report', paper:'Report', sheet:'Sheet',
  data:'Data', dataset:'Data', code:'Code', notebook:'Notebook',
  archive:'Archive', poster:'Poster', video:'Video', link:'Link',
};
const ATT_ICONS = {
  PDF:'FileDoc',   Doc:'FileDoc',    Report:'FileDoc', Poster:'FileDoc',
  Slides:'FileSlides', Video:'FileSlides',
  Sheet:'FileSheet', Data:'FileSheet',
  Archive:'FileZip',
  Code:'FileCode', Notebook:'FileCode',
  Link:'FileLink',
};

function projAttachments(p){
  return (Array.isArray(p.attachments) ? p.attachments : [])
    .map(a => typeof a === 'string' ? { url:a } : a)
    .map(a => ({ ...a, url:(a && (a.url || a.file)) || '' }))
    .filter(a => a.url && a.url !== '#')
    .map(a => {
      const clean = a.url.split(/[?#]/)[0];
      const ext   = (clean.match(/\.([a-z0-9]+)$/i) || [])[1] || '';
      const key   = String(a.type || ext).toLowerCase();
      const kind  = ATT_TYPES[key] || (a.type ? a.type : 'Link');
      return {
        url:   a.url,
        // No label? The file name is a better fallback than a generic word.
        label: a.label || decodeURIComponent(clean.split('/').pop()) || kind,
        note:  a.note || '',
        kind,
        icon:  ATT_ICONS[kind] || 'FileLink',
        // Files hosted here download; anything remote opens in a new tab.
        local: !/^(https?:)?\/\//i.test(a.url),
      };
    });
}

// An image path, as opposed to a named SVG artwork key from covers.jsx.
function isImageCover(c){
  return !!c && (c.startsWith('http://') || c.startsWith('https://') || c.startsWith('/'));
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
// Fade + rise as a block scrolls in, once. The CSS describes the final state;
// `.pp-reveal` starts it hidden and `.in` releases it.
function useReveal(){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    if (reduceMotion()){ el.classList.add('in'); return; }
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:0.08, rootMargin:'0px 0px -6% 0px' });
    io.observe(el);
    return ()=>io.disconnect();
  },[]);
  return ref;
}

// NOTE ON TOOL ICONS: the rail lists tools as plain text, deliberately. Only a
// handful of tags (Python, Excel, PowerBI, Canva…) have a logo in
// profile.toolGroups, and several never will — "Optimization", "HTML
// Dashboard", "Gesture Recognition" aren't products. Badging some and not
// others read as an oversight, so it's all text or nothing.

// ─── Page root ────────────────────────────────────────────────────────────────
function ProjectPage({ id, go }){
  const p = projById(id);

  // The tab title follows the project, and is put back when you navigate away.
  useEffect(()=>{
    if (!p) return;
    const prev = document.title;
    document.title = p.title + ' · Arthur Ottevaere';
    return ()=>{ document.title = prev; };
  }, [p && p.id]);

  if (!p) return (
    <div className="page-enter shell" style={{padding:'120px 0',textAlign:'center'}}>
      <div className="eyebrow">Not found</div>
      <h2 className="h2" style={{marginTop:10}}>No project here<span style={{color:'var(--fg-faint)'}}>.</span></h2>
      <p className="sub" style={{marginTop:12}}>That link doesn't match any project.</p>
      <button type="button" className="btn-ghost-2" style={{marginTop:24}} onClick={()=>go('work')}>
        <Icon.Arrow style={{transform:'rotate(180deg)'}}/><span>Back to work</span>
      </button>
    </div>
  );

  const sections = projSections(p);
  const metrics  = (Array.isArray(p.metrics) ? p.metrics : []).filter(m=>m && m.value);
  const gallery  = projGallery(p);
  const files    = projAttachments(p);
  const skills   = projSkills(p);

  return (
    <article className="page-enter pp">
      <ProjectHero p={p} go={go}/>

      <div className="shell pp-main">
        <ProjectRail p={p}/>
        <div className="pp-content">
          {sections.map((s,i)=>(
            <React.Fragment key={i}>
              <ProjectSection s={s} n={i+1}/>
              {/* The numbers land right after the opening section — context,
                  then the scale of the thing, then the rest. */}
              {i===0 && metrics.length>0 && <ProjectMetrics items={metrics}/>}
            </React.Fragment>
          ))}
          {sections.length===0 && metrics.length>0 && <ProjectMetrics items={metrics}/>}
          {gallery.length>0 && (
            <ProjectGallery items={gallery} n={sections.length+1} title={p.galleryTitle}/>
          )}
          {/* Last block of the text column: you read the project, you looked at
              it, now you can take the files with you. */}
          {files.length>0 && (
            <ProjectAttachments items={files} title={p.attachmentsTitle}
                                n={sections.length + (gallery.length>0?1:0) + 1}/>
          )}
        </div>
      </div>

      {skills.length>0 && <ProjectSkills items={skills}/>}
      <ProjectOutro p={p} go={go}/>
    </article>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Split in two: the project's identity on the left, its cover on the right as a
// compact card. No tinted wash behind it — plain paper in both themes. Keeping
// the hero this short is what lets the first section peek above the fold, which
// is the actual invitation to scroll; the chevron below only confirms it.
function ProjectHero({ p, go }){
  const img   = isImageCover(p.cover);
  const chips = [p.role, p.duration, p.team].filter(Boolean);
  const links = projLinks(p);

  const toBody = ()=>{
    const el = document.querySelector('.pp-main');
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion() ? 'instant' : 'smooth', block:'start' });
  };

  return (
    <header className="pp-hero">
      <div className="shell pp-hero-inner">
        {/* Prominent and first in the reading order — leaving a project must
            never be a hunt. Repeated at the very bottom by ProjectOutro. */}
        <button type="button" className="pp-back" onClick={()=>go('work')}>
          <Icon.Arrow className="pp-back-ico"/><span>All projects</span>
        </button>

        <div className="pp-hero-grid">
          <div className="pp-hero-text">
            <div className="eyebrow">{p.cat} · {projDateLabel(p)}</div>
            <h1 className="pp-title">{p.title}</h1>
            {p.subtitle && <div className="pp-subtitle">{p.subtitle}</div>}
            <div className="pp-rule" aria-hidden="true"/>
            <p className="pp-lead">{p.summary}</p>
            {chips.length>0 && (
              <div className="pp-chips">
                {chips.map((c,i)=><span className="pp-chip" key={i}>{c}</span>)}
              </div>
            )}
            {links.length>0 && (
              <div className="pp-hero-actions">
                {links.map((l,i)=><ProjectLink key={i} url={l.url} label={l.label}/>)}
              </div>
            )}
          </div>

          <figure className="pp-shot">
            {img
              ? <img className="pp-shot-img" src={p.cover} alt={p.title} decoding="async"/>
              : <div className="pp-shot-art"><CoverImg cover={p.cover} title={p.title}/></div>}
          </figure>
        </div>

        <button type="button" className="pp-cue" onClick={toBody} aria-label="Read the project">
          <Icon.ArrowDown/>
        </button>
      </div>
    </header>
  );
}

// ─── Rail — the spec sheet, sticky beside the text ───────────────────────────
function ProjectRail({ p }){
  const ref  = useReveal();
  const rows = [
    ['Context',  p.context || p.cat],
    ['Role',     p.role],
    ['Team',     p.team],
    ['Duration', p.duration],
    ['Date',     projDateLabel(p)],
  ].filter(r=>r[1]);
  const tools = Array.isArray(p.tags) ? p.tags : [];
  const links = projLinks(p);

  return (
    <aside className="pp-rail pp-reveal" ref={ref}>
      <div className="pp-rail-inner">
        <dl className="pp-facts">
          {rows.map(([k,v])=>(
            <div className="pp-fact" key={k}>
              <dt className="mono">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        {tools.length>0 && (
          <div className="pp-rail-block">
            <div className="pp-rail-h mono">Built with</div>
            <ul className="pp-tools">
              {tools.map(t=><li className="pp-tool" key={t}>{t}</li>)}
            </ul>
          </div>
        )}

        {/* Hidden on mobile: the hero already carries these links as a button,
            and two GitHub buttons on one small screen is one too many. */}
        {links.length>0 && (
          <div className="pp-rail-block pp-rail-block-links">
            <div className="pp-rail-h mono">Links</div>
            <div className="pp-rail-links">
              {links.map((l,i)=><ProjectLink key={i} url={l.url} label={l.label}/>)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Body section ─────────────────────────────────────────────────────────────
// A `body` entry is a string (paragraph) or one of:
//   { h: "Sub-heading" } · { list: ["…","…"] } · { quote: "…" }
// which is what gives you real structure — titles, sub-titles, lists, pull
// quotes — without writing any HTML in data.js.
function ProjectSection({ s, n }){
  const ref  = useReveal();
  const body = Array.isArray(s.body) ? s.body : (s.body ? [s.body] : []);
  const list = Array.isArray(s.list) ? s.list : [];
  // Dashes, not ticks: a checkmark reads as "feature shipped" and, being an
  // accent-coloured icon, pulled more weight than the prose it illustrates.
  const bullets = items => (
    <ul className="pp-list">
      {items.map((t,j)=>(
        <li key={j}><span className="pp-li-mark" aria-hidden="true">—</span><span>{t}</span></li>
      ))}
    </ul>
  );
  return (
    <section className="pp-sec pp-reveal" ref={ref}>
      <div className="pp-sec-head">
        <div className="pp-sec-num mono">{String(n).padStart(2,'0')}</div>
        {s.title && <h2 className="pp-sec-title">{s.title}</h2>}
      </div>
      {body.map((b,i)=>{
        if (typeof b === 'string')       return <p className="pp-p" key={i}>{b}</p>;
        if (b && b.h)                    return <h3 className="pp-sub" key={i}>{b.h}</h3>;
        if (b && Array.isArray(b.list))  return <React.Fragment key={i}>{bullets(b.list)}</React.Fragment>;
        if (b && b.quote)                return <blockquote className="pp-quote" key={i}>{b.quote}</blockquote>;
        return null;
      })}
      {list.length>0 && bullets(list)}
    </section>
  );
}

// ─── Numbers band ─────────────────────────────────────────────────────────────
function ProjectMetrics({ items }){
  const ref = useReveal();
  return (
    <div className="pp-metrics" ref={ref}>
      {items.map((m,i)=>(
        <span className="pp-metric" key={i}>
          <span className="pp-metric-v">{m.value}</span>
          <span className="pp-metric-l">{m.label}</span>
        </span>
      ))}
    </div>
  );
}

// ─── Gallery — scroll-snap film strip ────────────────────────────────────────
// The active frame sits at full size and full opacity; its neighbours peek in
// from both sides, shrunk and dimmed. Native scroll — trackpad, touch swipe,
// arrows, dots and the keyboard all drive the same scroller. Clicking the
// active frame opens it full screen.
function ProjectGallery({ items, n, title }){
  const [i, setI]       = useState(0);
  const [zoom, setZoom] = useState(-1);
  const trackRef  = useRef(null);
  const slideRefs = useRef([]);
  const secRef    = useReveal();

  // Active slide = whichever centre sits closest to the track's centre. Measured
  // on scroll rather than with an IntersectionObserver: the active slide scales
  // up, which would feed straight back into an observer's ratio and oscillate.
  useEffect(()=>{
    const track = trackRef.current; if(!track) return;
    let raf = 0;
    const update = ()=>{
      raf = 0;
      const tr = track.getBoundingClientRect();
      const cx = tr.left + tr.width/2;
      let best = 0, bestD = Infinity;
      slideRefs.current.forEach((s,idx)=>{
        if(!s) return;
        const sr = s.getBoundingClientRect();
        const d  = Math.abs(sr.left + sr.width/2 - cx);
        if (d < bestD){ bestD = d; best = idx; }
      });
      setI(best);
    };
    const onScroll = ()=>{ if(!raf) raf = requestAnimationFrame(update); };
    update();
    track.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll);
    return ()=>{
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  // Scroll the track itself. scrollIntoView() would also drag the PAGE
  // vertically to bring the strip into view, which reads as a jump.
  const goTo = useCallback(idx=>{
    const track = trackRef.current, s = slideRefs.current[idx];
    if (!track || !s) return;
    track.scrollTo({
      left: s.offsetLeft - (track.clientWidth - s.clientWidth)/2,
      behavior: reduceMotion() ? 'instant' : 'smooth',
    });
  }, []);

  function onKey(e){
    if (e.key==='ArrowRight'){ e.preventDefault(); goTo(Math.min(i+1, items.length-1)); }
    if (e.key==='ArrowLeft' ){ e.preventDefault(); goTo(Math.max(i-1, 0)); }
  }

  const label = title || 'Results';

  return (
    <section className="pp-sec pp-gal pp-reveal" ref={secRef}>
      <div className="pp-sec-head">
        <div className="pp-sec-num mono">{String(n).padStart(2,'0')}</div>
        <h2 className="pp-sec-title">{label}</h2>
      </div>

      {items.length === 1 ? (
        /* A single image needs no carousel chrome. */
        <figure className="pp-single">
          <button type="button" className="pp-frame" onClick={()=>setZoom(0)} aria-label="Open image full screen">
            <img src={items[0].src} alt={items[0].caption||''} loading="lazy" decoding="async"/>
          </button>
          {items[0].caption && <figcaption className="pp-cap">{items[0].caption}</figcaption>}
        </figure>
      ) : (
        <div className="pp-gal-wrap">
          <div className="pp-gal-track" ref={trackRef} tabIndex={0} onKeyDown={onKey}
               role="group" aria-roledescription="carousel" aria-label={label+' gallery'}>
            {/* Flex spacers rather than padding: both resolve their percentage
                against the same box, so the first and last frames can actually
                reach the centre snap position. */}
            <div className="pp-gal-pad" aria-hidden="true"/>
            {items.map((g,idx)=>(
              <figure key={idx} ref={el=>{ slideRefs.current[idx]=el; }}
                      className={'pp-slide'+(idx===i?' is-active':'')}>
                <button type="button" className="pp-frame"
                        tabIndex={idx===i?0:-1}
                        onClick={()=> idx===i ? setZoom(idx) : goTo(idx)}
                        aria-label={idx===i ? 'Open image full screen' : 'Show image '+(idx+1)}>
                  {/* The first two are eager: the neighbour peeks into view
                      immediately, and a lazy one shows as an empty grey plate
                      until it loads. The rest stay lazy. */}
                  <img src={g.src} alt={g.caption||''} decoding="async"
                       loading={idx<2 ? 'eager' : 'lazy'}/>
                </button>
              </figure>
            ))}
            <div className="pp-gal-pad" aria-hidden="true"/>
          </div>

          <div className="pp-gal-bar">
            <button type="button" className="pp-gal-arrow" disabled={i===0}
                    onClick={()=>goTo(Math.max(i-1,0))} aria-label="Previous image">
              <Icon.Arrow style={{transform:'rotate(180deg)'}}/>
            </button>
            {/* keyed on `i` so the caption re-mounts and replays its fade-up */}
            <div className="pp-cap-slot">
              <span key={i} className="pp-cap">{items[i] && items[i].caption}</span>
            </div>
            <button type="button" className="pp-gal-arrow" disabled={i===items.length-1}
                    onClick={()=>goTo(Math.min(i+1,items.length-1))} aria-label="Next image">
              <Icon.Arrow/>
            </button>
          </div>

          <div className="pp-dots">
            {items.map((_,idx)=>(
              <button key={idx} type="button"
                className={'pp-dot'+(idx===i?' on':'')}
                onClick={()=>goTo(idx)}
                aria-label={'Go to image '+(idx+1)}
                aria-current={idx===i ? 'true' : undefined}/>
            ))}
          </div>
        </div>
      )}

      {zoom>=0 && (
        <Lightbox items={items} index={zoom} onIndex={setZoom} onClose={()=>setZoom(-1)}/>
      )}
    </section>
  );
}

// ─── Full-screen image viewer ────────────────────────────────────────────────
// Portalled to <body> so it escapes .page-enter's transform — a transformed
// ancestor captures position:fixed and the overlay would scroll with the page.
function Lightbox({ items, index, onIndex, onClose }){
  useEffect(()=>{
    function onKey(e){
      if (e.key==='Escape')     onClose();
      if (e.key==='ArrowRight') onIndex(Math.min(index+1, items.length-1));
      if (e.key==='ArrowLeft')  onIndex(Math.max(index-1, 0));
    }
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return ()=>{
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [index, items.length, onIndex, onClose]);

  const g = items[index];
  if (!g) return null;
  return ReactDOM.createPortal((
    <div className="pp-lb" role="dialog" aria-modal="true" aria-label={g.caption||'Image'}
         onMouseDown={onClose}>
      <button type="button" className="pp-lb-close" onClick={onClose} aria-label="Close">
        <Icon.Close/>
      </button>
      <figure className="pp-lb-fig" onMouseDown={e=>e.stopPropagation()}>
        <img src={g.src} alt={g.caption||''}/>
        {g.caption && <figcaption>{g.caption}</figcaption>}
      </figure>
      {items.length>1 && (
        <div className="pp-lb-nav" onMouseDown={e=>e.stopPropagation()}>
          <button type="button" disabled={index===0}
                  onClick={()=>onIndex(Math.max(index-1,0))} aria-label="Previous image">
            <Icon.Arrow style={{transform:'rotate(180deg)'}}/>
          </button>
          <span className="mono">{index+1} / {items.length}</span>
          <button type="button" disabled={index===items.length-1}
                  onClick={()=>onIndex(Math.min(index+1,items.length-1))} aria-label="Next image">
            <Icon.Arrow/>
          </button>
        </div>
      )}
    </div>
  ), document.body);
}

// ─── Attachments — the files that come with the project ──────────────────────
// A quiet list of rows rather than cards in a grid: these are things to open,
// not things to look at, and a row leaves space for a one-line note saying
// what the file actually is. Absent or empty `attachments` → no block at all.
function ProjectAttachments({ items, n, title }){
  const ref = useReveal();
  return (
    <section className="pp-sec pp-att pp-reveal" ref={ref}>
      <div className="pp-sec-head">
        <div className="pp-sec-num mono">{String(n).padStart(2,'0')}</div>
        <h2 className="pp-sec-title">{title || 'Attachments'}</h2>
      </div>
      <ul className="pp-att-list">
        {items.map((a,i)=>{
          const Glyph = Icon[a.icon] || Icon.FileLink;
          return (
            <li key={i}>
              <a className="pp-att-card" href={a.url}
                 target="_blank" rel="noopener noreferrer"
                 aria-label={(a.local?'Open ':'Open ')+a.label+' ('+a.kind+')'}>
                <span className="pp-att-ico" aria-hidden="true"><Glyph/></span>
                <span className="pp-att-text">
                  <span className="pp-att-label">{a.label}</span>
                  {a.note && <span className="pp-att-note">{a.note}</span>}
                </span>
                <span className="pp-att-kind mono">{a.kind}</span>
                {a.local
                  ? <Icon.Download className="pp-att-arrow is-dl"/>
                  : <Icon.ArrowUR className="pp-att-arrow"/>}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Takeaways — skill on the left, what it actually meant on the right ──────
function ProjectSkills({ items }){
  const ref = useReveal();
  return (
    <section className="pp-skills">
      <div className="shell">
        <div className="pp-skills-inner pp-reveal" ref={ref}>
          <div className="eyebrow">What I took away</div>
          <ul className="pp-skill-list">
            {items.map((s,i)=>(
              <li className="pp-skill" key={i} style={{'--i':i}}>
                <span className="pp-skill-name">{s.name}</span>
                <span className="pp-skill-note">{s.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Outro — the two ways out ────────────────────────────────────────────────
// Reaching the end means one of two things: keep going, or step back out. Both
// are offered side by side rather than making the reader scroll back up to the
// nav. "Next" follows the grid's newest-first order and wraps at the end.
function ProjectOutro({ p, go }){
  const all  = [...PROJS()].sort((a,b)=>projDateKey(b)-projDateKey(a));
  const idx  = all.findIndex(x=>x.id===p.id);
  const next = all.length > 1 ? all[(idx+1) % all.length] : null;
  const hasNext = next && next.id !== p.id;

  return (
    <section className="pp-outro">
      <div className="shell pp-outro-inner">
        <button type="button" className="pp-outro-all" onClick={()=>go('work')}>
          <Icon.Arrow className="pp-back-ico"/>
          <span className="pp-outro-all-text">
            <span className="eyebrow">Done here</span>
            <span className="pp-outro-all-title">All projects</span>
          </span>
        </button>

        {hasNext && (
          <button type="button" className="pp-next-card" onClick={()=>go('work/'+next.id)}
                  aria-label={'Next project: '+next.title}>
            <span className="pp-next-cover"><CoverImg cover={next.cover} title={next.title}/></span>
            <span className="pp-next-text">
              <span className="eyebrow">Want more</span>
              <span className="pp-next-title">{next.title}</span>
              <span className="pp-next-meta mono">{next.cat} · {projDateLabel(next)}</span>
            </span>
            <Icon.Arrow className="pp-next-ico"/>
          </button>
        )}
      </div>
    </section>
  );
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
          {p.role && <><span style={{color:'var(--fg-faint)'}}>·</span><span>{p.role}</span></>}
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
          will-change:transform;backface-visibility:hidden;
          -webkit-mask-image:-webkit-radial-gradient(white, black);
          transition:border-color 240ms ease,box-shadow 240ms ease,transform 240ms cubic-bezier(.2,.7,.2,1);
        }
        .featured:hover{
          border-color:var(--blue);
          box-shadow:0 24px 60px -24px color-mix(in oklab,var(--blue) 40%,transparent);
          transform:translateY(-2px);
        }
        .featured:focus-visible{outline:2px solid var(--blue);outline-offset:3px;}
        .featured-actions{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;}
        /* min-width:0 on both tracks: without it a grid item's automatic
           minimum size is its min-content width, so the 1.15fr/1fr ratio is
           only a suggestion and a long body can blow the columns past the
           card. The cover's 16/9 is a MINIMUM height (::before spacer) rather
           than an aspect-ratio, so a tall text column stretches the image
           instead of widening it — with aspect-ratio, a taller row fed back
           into a wider cover and the layout ran away. */
        .featured-cover{position:relative;min-width:0;overflow:hidden;border-right:1px solid var(--border);background:var(--bg-soft);}
        .featured-cover::before{content:'';display:block;padding-top:56.25%;}
        .featured-cover>img,.featured-cover>svg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
        .featured-body{min-width:0;padding:32px 36px 44px;display:flex;flex-direction:column;justify-content:center;}
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
// ABOUT — an immersive, scroll-driven story in four beats
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
// Only the first two bio paragraphs show here — bio[2]/bio[3] are unused.
function AboutIntro({ lite, go }) {
  const P = PROFILE();
  const cvs = useCvLinks();
  const paras = [P.bio?.[0], P.bio?.[1]].filter(Boolean).map(t=>t.split(/\s+/).filter(Boolean));
  const offsets = []; { let acc=0; paras.forEach(wa=>{ offsets.push(acc); acc+=wa.length; }); }
  const total = offsets.length ? offsets[offsets.length-1]+paras[paras.length-1].length : 0;
  const secRef = useRef(null), wordsRef = useRef([]), leadSceneRef = useRef(null);
  useEffect(()=>{
    const el=secRef.current; if(!el) return;
    const spans=wordsRef.current.filter(Boolean);
    if(reduceMotion()){ spans.forEach(s=>s.style.opacity=1); return; }
    const n=spans.length, spread=lite?5.5:3.2;
    let raf=0;
    function upd(){ raf=0;
      // On mobile the bio sits in its own sticky scene (.ab-lead-scene): it pins
      // centre-screen and de-greys as you scroll the scene's runway — exactly
      // like the home manifesto (the text freezes, it doesn't scroll past).
      // Desktop reveals against the whole intro section.
      const prog=clamp(sceneProgress((lite && leadSceneRef.current) || el),0,1);
      const head=prog*(n+spread);
      spans.forEach((s,i)=>{ const w=clamp((head-i)/spread,0,1); s.style.opacity=(0.14+0.86*w).toFixed(3); });
    }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[total,lite]);
  return (
    <section ref={secRef} className="ab-intro" style={{height:'178vh'}}>
      <div className="ab-intro-sticky shell">
        {/* Avatar lives INSIDE the pinned scene (with the lead paragraphs),
            not before it — on mobile the scene is its own separate sticky
            hold, and if the avatar sat outside it, it'd scroll away on its
            own before the text-reveal even starts (rise, then vanish, then
            unrelated text freezes into place). Keeping them in one wrapper
            means they rise together once and hold together the whole time. */}
        <div className="ab-lead-scene" ref={leadSceneRef}>
          <div className="ab-lead-sticky">
            <div className="ab-id">
              <Avatar/>
              <div>
                <div className="eyebrow">About</div>
                <div className="ab-id-name">{P.name}</div>
                <div className="ab-id-meta">{P.location}{(computeAge(P.birth) ?? P.age) ? ` · ${computeAge(P.birth) ?? P.age}` : ''}</div>
                {P.status && (
                  <div className="ab-status mono">
                    <span className="ab-status-dot" aria-hidden="true"/>
                    {P.status}
                  </div>
                )}
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
          </div>
        </div>
        <div className="ab-id-actions">
          {(()=>{ const multi=cvs.length>1; return cvs.map(c=>(
            <a key={c.lang} href={c.href} target="_blank" rel="noopener noreferrer" className="btn-ghost-2">
              <Icon.Download/> Resume{multi ? ' · '+c.lang.toUpperCase() : ''}
            </a>
          )); })()}
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
// `period` parts can be plain text ("Present", "Fall 2026") or dates
// ("2025", "2025-06", "2025-06-15") — dated parts render as "Jun 2025" /
// "15 Jun 2025", everything else passes through unchanged.
function formatPeriodPart(s){
  s=String(s).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)){
    return new Date(s+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  }
  if(/^\d{4}-\d{2}$/.test(s)){
    return new Date(s+'-01T00:00:00Z').toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'});
  }
  return s;
}
function formatPeriod(period){
  return String(period||'').split(/\s*—\s*/).map(formatPeriodPart).join(' — ');
}
// Sort key for a period's start (the part before " — "): resolves to a real
// timestamp when it's a date ("2025-01" / "2025-01-15"), else just the year
// found in free text ("Fall 2026"). Comparing by month (not just year) means
// same-year entries — e.g. a Jan–Feb internship vs. a Sept degree — land in
// the right order automatically, with no manual reordering in data.js.
function periodStartKey(period){
  const first=String(period||'').split(/\s*—\s*/)[0].trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(first)) return Date.parse(first+'T00:00:00Z');
  if(/^\d{4}-\d{2}$/.test(first))       return Date.parse(first+'-01T00:00:00Z');
  const m=first.match(/\d{4}/);
  return m ? Date.UTC(+m[0],0,1) : 0;
}
function EducationAct({ lite }) {
  // Travel oldest → newest, whatever order the data is in.
  const edu = [...(PROFILE().timeline || [])].sort((a,b)=>periodStartKey(a.period)-periodStartKey(b.period));
  const n = edu.length;
  const secRef=useRef(null), trackRef=useRef(null), cardRefs=useRef([]), railFillRef=useRef(null);
  useEffect(()=>{
    const el=secRef.current, track=trackRef.current; if(!el||!track||!n) return;
    const cards=cardRefs.current.filter(Boolean);
    const lerp=(a,b,t)=>a+(b-a)*t;
    // Gentle smoothstep: still magnetised toward each point, but the transit
    // between points is spread out so it reads slow and deliberate, not snappy.
    const smoother=t=>{ t=clamp(t,0,1); return t*t*(3-2*t); };
    // Per-segment dwell: the float position sits still at the milestone for
    // the first/last HOLD/2 of the segment's scroll range, and only transits
    // during the middle stretch — a real stop with zero velocity for a beat,
    // not just an instantaneous inflection point.
    const HOLD=0.46;
    const segEase=f=>{
      const h=HOLD/2;
      if(f<=h) return 0;
      if(f>=1-h) return 1;
      return smoother((f-h)/(1-HOLD));
    };
    if(reduceMotion()){
      track.style.transform='none';
      cards.forEach(c=>{ c.classList.add('lit'); c.style.setProperty('--litpct','100%'); });
      if(railFillRef.current) railFillRef.current.style.width='100%';
      return;
    }
    if(lite){
      // Mobile: vertical thread. Each node lights as a reveal line sweeps past it,
      // and the connector bar between nodes fills blue with the scroll.
      track.style.transform='none';
      const nodeY = c => c.getBoundingClientRect().top + 10;   // node centre offset
      function upd(){
        const L = window.innerHeight*0.6;   // reveal line
        cards.forEach((c,i)=>{
          c.classList.toggle('lit', nodeY(c) <= L);
          if(i<cards.length-1){
            const t = clamp((L - nodeY(c))/Math.max(1, nodeY(cards[i+1]) - nodeY(c)), 0, 1);
            c.style.setProperty('--litpct', (t*100).toFixed(1)+'%');
          }
        });
      }
      let raf=0; const s=()=>{ if(!raf) raf=requestAnimationFrame(()=>{raf=0;upd();}); };
      upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
      return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
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
      const f=segEase(fp-k);
      const target=n>1 ? lerp(nodes[k],nodes[k+1],f) : nodes[0];
      track.style.transform=`translateX(${(cx-target).toFixed(1)}px)`;
      // The fill lives INSIDE the track (moves with it), so its right edge —
      // sized to the same track-local x as `target` — always lands exactly
      // under the centred milestone once translateX is applied, same way the
      // node itself does. Reads as the colour travelling up to the point.
      if(railFillRef.current) railFillRef.current.style.width=Math.max(0,target).toFixed(1)+'px';
      const focusI=Math.round(fp);
      // A node turns blue exactly when the fill (continuous) reaches its
      // position — not a step earlier via rounding — so the dot lighting up
      // and the colour arriving under it always happen in the same instant.
      cards.forEach((c,i)=>{ c.classList.toggle('lit', nodes[i]<=target+0.5); c.classList.toggle('focus', i===focusI); });
    }
    let raf=0; function upd(){ raf=0; layout(); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); };
  },[n,lite]);
  if(!n) return null;
  return (
    <section ref={secRef} className="ab-edu" style={{height:(100+Math.max(1,n-1)*70)+'vh'}}>
      <div className="ab-edu-sticky">
        <div className="ab-head shell"><div className="eyebrow">The path</div><h3 className="ab-h">Where I've been<span className="dotted">.</span></h3></div>
        <div className="ab-edu-viewport">
          <div className="ab-edu-rail" aria-hidden="true"/>
          <div className="ab-edu-track" ref={trackRef}>
            <div className="ab-edu-rail-fill" ref={railFillRef} aria-hidden="true"/>
            {edu.map((e,i)=>{
              const upcoming = periodStartKey(e.period) > Date.now();
              return (
              <div key={i} className={'ab-edu-card'+(upcoming?' is-upcoming':'')} ref={el=>cardRefs.current[i]=el}>
                <span className="ab-edu-node"/>
                {(e.type || upcoming) && (
                  <div className="ab-edu-type mono">
                    {e.type}{upcoming && <span className="ab-edu-upcoming">Upcoming</span>}
                  </div>
                )}
                <div className="ab-edu-period mono">{formatPeriod(e.period)}</div>
                <div className="ab-edu-degree">{e.title}</div>
                <div className="ab-edu-school">{e.place}</div>
              </div>
              );
            })}
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
  const secRef=useRef(null), cardRefs=useRef([]), cloudRefs=useRef([]);
  useEffect(()=>{
    const el=secRef.current; if(!el||!flat.length) return;
    if(reduceMotion()){
      [...cardRefs.current, ...cloudRefs.current].filter(Boolean)
        .forEach(c=>{ c.style.opacity=1; c.style.transform='none'; });
      return;
    }
    if(lite){
      // Mobile: stagger the cloud chips in (rise + fade) as they scroll into
      // view — same gentle entrance as the passion tiles, for a consistent feel.
      const chips=cloudRefs.current.filter(Boolean);
      // Springy pop-in (scale + rise with a little overshoot) so the toolkit
      // feels like it snaps to life, not a timid fade. Replays every time the
      // chips scroll into view (and resets when they leave) rather than firing
      // just once, so scrolling up and back down re-triggers it.
      const HIDDEN='translateY(24px) scale(.8)';
      chips.forEach(c=>{
        c.style.transition='transform .6s cubic-bezier(.34,1.56,.64,1), opacity .4s ease';
        c.style.transform=HIDDEN;
      });
      const io=new IntersectionObserver(es=>{
        es.forEach(e=>{
          const i=chips.indexOf(e.target);
          if(e.isIntersecting){
            e.target.style.transitionDelay=(i*60)+'ms';
            e.target.style.opacity='1';
            e.target.style.transform='none';
          } else {
            e.target.style.transitionDelay='0ms';
            e.target.style.opacity='0';
            e.target.style.transform=HIDDEN;
          }
        });
      },{ threshold:0.15 });
      chips.forEach(c=>io.observe(c));
      return ()=>io.disconnect();
    }
    const cards=cardRefs.current.filter(Boolean);
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
              {/* Mobile: a light wrapped cloud of icon chips. Desktop: the full
                  skill cards (scroll-animated). */}
              {lite ? (
                <div className="ab-skill-cloud">
                  {(g.items||[]).map((it,ii)=>{
                    const fi=flat.findIndex(f=>f.gi===gi&&f.ii===ii);
                    const logo=it[2];
                    const builtin=SKILL_ICON[it[0].toLowerCase()];
                    const Glyph=builtin ? Icon[builtin] : null;
                    return (
                      <span key={ii} className="ab-cloud-chip" ref={el=>{ cloudRefs.current[fi]=el; }}>
                        <span className={'ab-cloud-ico'+(logo||Glyph?' has-logo':'')}>
                          {logo ? <img src={logo} alt={it[0]} loading="lazy"/> : Glyph ? <Glyph/> : (it[1]||it[0].slice(0,2))}
                        </span>
                        <span className="ab-cloud-name">{it[0]}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
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
              )}
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

// ─── Act 4 · Beyond the data (passions as pinned cards on a wall) ─────────────
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
    if(reduceMotion()){
      cards.forEach((c,i)=>{ c.style.opacity=1; c.style.transform = lite ? 'none' : `rotate(${tilt(i)}deg)`; });
      return;
    }
    if(lite){
      // Mobile compact tiles: each pops in with a springy overshoot, rising from
      // a small alternating tilt that settles straight — reads as playful and
      // alive rather than a barely-there fade. Replays every time the tiles
      // scroll into view (and resets when they leave), so scrolling up and back
      // down re-triggers it instead of firing only once.
      const hiddenFor = i => `translateY(28px) scale(.82) rotate(${i%2?4.5:-4.5}deg)`;
      cards.forEach((c,i)=>{
        c.style.transition='transform .66s cubic-bezier(.34,1.56,.64,1), opacity .42s ease';
        c.style.transform=hiddenFor(i);
      });
      const io=new IntersectionObserver(es=>{
        es.forEach(e=>{
          const i=cards.indexOf(e.target);
          if(e.isIntersecting){
            e.target.style.transitionDelay=(i*85)+'ms';
            e.target.style.opacity='1';
            e.target.style.transform='none';
          } else {
            e.target.style.transitionDelay='0ms';
            e.target.style.opacity='0';
            e.target.style.transform=hiddenFor(i);
          }
        });
      },{ threshold:0.2 });
      cards.forEach(c=>io.observe(c));
      return ()=>io.disconnect();
    }
    const hovered=new Set();
    let raf=0;
    function layout(p){
      const e=clamp(p,0,1), n=cards.length, start=0.12, stag=0.55/(n+2);
      cards.forEach((c,i)=>{
        if(hovered.has(i)) return;
        const cp=easeInOut(clamp((e-start-i*stag)/0.3,0,1));
        c.style.opacity=cp.toFixed(3);
        const rot=tilt(i)*cp + (1-cp)*-2;
        c.style.transform=`translateY(${((1-cp)*-70).toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${(0.92+0.08*cp).toFixed(3)})`;
      });
    }
    function upd(){ raf=0; layout(sceneProgress(el)); }
    function s(){ if(!raf) raf=requestAnimationFrame(upd); }
    const listeners=cards.map((c,i)=>{
      const r=tilt(i);
      let leaveTimer=0;
      function enter(){
        clearTimeout(leaveTimer);
        hovered.add(i);
        c.style.transition='transform .38s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease, border-color .3s ease';
        c.style.transform=`translateY(-16px) rotate(${(r*.4).toFixed(1)}deg) scale(1.09)`;
        c.style.boxShadow='0 28px 56px -14px rgba(0,0,0,.6)';
        c.style.borderColor='color-mix(in oklab,var(--blue) 55%,var(--border))';
        c.style.zIndex='10';
      }
      function leave(){
        c.style.transition='transform .5s cubic-bezier(.22,1,.36,1), box-shadow .4s ease, border-color .4s ease';
        c.style.transform=`translateY(0px) rotate(${r.toFixed(1)}deg) scale(1)`;
        c.style.boxShadow='';
        c.style.borderColor='';
        c.style.zIndex='';
        leaveTimer=setTimeout(()=>{ hovered.delete(i); c.style.transition=''; s(); },520);
      }
      c.addEventListener('mouseenter',enter);
      c.addEventListener('mouseleave',leave);
      return ()=>{ c.removeEventListener('mouseenter',enter); c.removeEventListener('mouseleave',leave); clearTimeout(leaveTimer); };
    });
    upd(); window.addEventListener('scroll',s,{passive:true}); window.addEventListener('resize',s);
    return ()=>{ window.removeEventListener('scroll',s); window.removeEventListener('resize',s); if(raf) cancelAnimationFrame(raf); listeners.forEach(fn=>fn()); };
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
                <span className="ab-pin-body">
                  <span className="ab-pin-ico"><Glyph/></span>
                  <span className="ab-pin-label">{it.label}</span>
                </span>
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
  const [launching, setLaunching] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSend    = validEmail && msg.trim().length>6;
  const endpoint   = P.formspree && P.formspree !== '#' ? P.formspree : null;

  async function send(e) {
    e.preventDefault();
    if (!canSend || sending || launching) return;
    setError(false);

    // Let the paper plane fly off before the button switches to its
    // "Sending…" state — a beat of feedback for the tap, not a delay tactic.
    if (!reduceMotion()) {
      setLaunching(true);
      await new Promise(r=>setTimeout(r, 650));
      setLaunching(false);
    }

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

        <button type="submit" disabled={!canSend||sent||sending||launching}
                className={'send'+(launching?' is-launching':'')}>
          {sent
            ? <><Icon.Check/> Sent — talk soon</>
            : sending
              ? <>Sending…</>
              : <><span className="send-label">Send</span> <Icon.Send className="send-plane"/></>}
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
        .send.is-launching:disabled{opacity:1;}
        .send:not(:disabled):hover{background:var(--blue);border-color:var(--blue);box-shadow:0 10px 30px -10px var(--blue);}
        .send:not(:disabled):hover svg{transform:translateX(4px);}
        .send:not(:disabled):active{transform:scale(0.985);}
        .send svg{width:14px;height:14px;transition:transform 220ms cubic-bezier(.2,.7,.2,1);}
        .send-label{transition:opacity 200ms ease,transform 200ms ease;}
        .send.is-launching .send-label{opacity:0;transform:translateX(-4px);transition-duration:160ms;}
        .send.is-launching .send-plane{animation:planeLaunch 650ms cubic-bezier(.3,.7,.3,1) forwards;}
        @keyframes planeLaunch{
          0%   {transform:translate(0,0) rotate(0deg) scale(1);opacity:1;}
          22%  {transform:translate(1px,1px) rotate(-6deg) scale(1.04);opacity:1;}
          100% {transform:translate(48px,-34px) rotate(38deg) scale(.35);opacity:0;}
        }
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

Object.assign(window, { Landing, Projects, ProjectPage, About, Contact, ULink, cvLinks, cvLinksReady, cvPrimary, useCvLinks });
