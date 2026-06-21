// Pages — Landing, Projects, About, Contact
// Data is pulled from window.PORTFOLIO_DATA (set by data.js).

const { useState, useEffect, useMemo, useRef } = React;

// ─── Data helpers ────────────────────────────────────────────────────────────
const DATA    = () => window.PORTFOLIO_DATA || {};
const PROFILE = () => DATA().profile   || {};
const PROJS   = () => DATA().projects  || [];

// ─── 01 · Variable-weight headline ──────────────────────────────────────────
function VariableHeadline({ text }) {
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current;
    if (!el) return;
    // Cursor-driven weight/colour is a pointer affordance only. On touch
    // devices (no real hover) it would leave letters stuck blue after a tap,
    // so we skip it entirely there.
    if (!window.matchMedia('(hover: hover)').matches) return;
    const spans = Array.from(el.querySelectorAll('.vh-l'));
    let raf=0, target={x:-9999,y:-9999};
    function apply() {
      raf=0;
      spans.forEach(s=>{
        const r=s.getBoundingClientRect();
        const d=Math.hypot(r.left+r.width/2-target.x, r.top+r.height/2-target.y);
        const k=Math.max(0,1-d/220);
        s.style.fontWeight = Math.round(380+k*520);
        s.style.transform  = `translateY(${(-k*9).toFixed(2)}px)`;
        s.style.color      = k>0.55?'var(--blue)':'';
      });
    }
    function onMove(e){ target.x=e.clientX; target.y=e.clientY; if(!raf) raf=requestAnimationFrame(apply); }
    function onLeave(){ target={x:-9999,y:-9999}; if(!raf) raf=requestAnimationFrame(apply); }
    window.addEventListener('pointermove',onMove);
    window.addEventListener('pointerleave',onLeave);
    return ()=>{ window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerleave',onLeave); if(raf) cancelAnimationFrame(raf); };
  },[text]);
  // Group letters into words so each word stays on one line (and the whole
  // name can stack first-name-over-last-name on mobile). The trailing dot
  // rides along with the last word so it never lands on its own line.
  const words = text.split(' ');
  return (
    <h1 className="h1 vh-name" ref={ref} style={{maxWidth:980}}>
      {words.map((w,wi)=>(
        <React.Fragment key={wi}>
          {wi>0 && <span className="vh-space"> </span>}
          <span className="vh-word">
            {Array.from(w).map((c,i)=>(
              <span key={i} className="vh-l">{c}</span>
            ))}
            {wi===words.length-1 && <span className="vh-l vh-dot" style={{color:'var(--fg-faint)'}}>.</span>}
          </span>
        </React.Fragment>
      ))}
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
function SlidingPills({ items, value, onChange, getCount, style }) {
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
    <div className="pill-group" ref={groupRef} style={style}>
      <div className="pill-slider idle" ref={sliderRef}/>
      {items.map((it,i)=>(
        <button type="button" key={it} ref={el=>btnsRef.current[i]=el}
          onClick={()=>onChange(it)}
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
    return (
      <img src={P.photo} alt={P.name}
        style={{width:72,height:72,borderRadius:'50%',objectFit:'cover',
          border:'1px solid var(--border)',flexShrink:0,display:'block'}}
      />
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

// ─── Open project (GitHub) ───────────────────────────────────────────────────
function openGithub(e, github) {
  if (!github || github === '#') { e.preventDefault(); return; }
  // href handles it natively — just let the default run
}

// ═══════════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════════
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
      <div className="page-enter hero-spotlight" style={{paddingTop:72}}>
      <div className="shell" style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>

        {/* Polyglot greeting + variable headline */}
        <PolyglotHello />
        <VariableHeadline text={P.name||'Arthur Ottevaere'} />

        <p className="sub" style={{marginTop:22,fontSize:19,maxWidth:620}}>
          {P.tagline || ''}
        </p>

        <div style={{display:'flex',gap:10,marginTop:36}}>
          <button onClick={()=>go('work')} className="btn-primary">
            View projects <Icon.Arrow/>
          </button>
          <button onClick={()=>go('contact')} className="btn-ghost">
            Get in touch
          </button>
        </div>

      </div>

      {/* Looping project carousel — full-bleed liquid glass marquee */}
      <ProjectMarquee go={go} />
      </div>
    </>
  );
}

// ─── Landing · looping project carousel ──────────────────────────────────────
// A continuously scrolling, liquid-glass strip of project previews. The list is
// rendered twice back-to-back and translated -50% so the loop is seamless. It
// pauses on hover (pointer devices) so a card can be read/clicked.
function ProjectMarquee({ go }) {
  const projects = PROJS();
  if (!projects.length) return null;
  // Featured first, then the rest, so the strongest cover leads the strip.
  const ordered = [...projects].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
  const loop = [...ordered, ...ordered];

  return (
    <div className="pm-wrap" aria-label="Project previews">
      <div className="pm-track">
        {loop.map((p,i)=>{
          const href = p.github&&p.github!=='#' ? p.github : undefined;
          return (
            <a key={i}
               href={href||'#'}
               target={href?'_blank':undefined}
               rel={href?'noopener noreferrer':undefined}
               onClick={e=>{ if(!href) e.preventDefault(); }}
               className="pm-card"
               aria-hidden={i>=ordered.length}
               tabIndex={i>=ordered.length?-1:0}>
              <div className="pm-cover"><CoverImg cover={p.cover} title={p.title}/></div>
              <div className="pm-meta">
                <span className="pm-cat">{p.cat}</span>
                <span className="pm-title">{p.title}</span>
              </div>
            </a>
          );
        })}
      </div>
      {/* Soft edge fade so cards dissolve into the page on both sides */}
      <div className="pm-fade pm-fade-l"/>
      <div className="pm-fade pm-fade-r"/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════
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

  // Year can be "2025" or a range like "2024-2025" — sort on the latest year
  // mentioned so ranges rank by when the work ended.
  const yearKey = (p)=>{
    const yrs = String(p.year||'').match(/\d{4}/g);
    return yrs ? Math.max(...yrs.map(Number)) : 0;
  };

  const rest = useMemo(()=>{
    const list = projects.filter(p=>p.id!==featured?.id);
    const filtered = filter==='All' ? list : list.filter(p=>p.cat===filter);
    return [...filtered].sort((a,b)=>
      sort==='desc' ? yearKey(b)-yearKey(a) : yearKey(a)-yearKey(b)
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
        </div>
      </div>

      {/* Featured card */}
      {featured && showFeatured && <FeaturedCard p={featured}/>}

      {/* Rich list */}
      <div style={{marginTop:32}}>
        <div className="eyebrow" style={{marginBottom:12}}>
          {filter==='All'?'More work':filter} · {rest.length}
        </div>
        <div style={{borderTop:'1px solid var(--border)'}}>
          {rest.map(p=><ListRow key={p.id} p={p}/>)}
          {rest.length===0&&(
            <div style={{padding:'48px 0',textAlign:'center',color:'var(--fg-muted)',fontSize:14}}>
              Nothing in this bucket yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ p }) {
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

  const href = p.github&&p.github!=='#' ? p.github : undefined;

  return (
    <a href={href||'#'} ref={ref}
       target={href?'_blank':undefined} rel={href?'noopener noreferrer':undefined}
       onClick={e=>openGithub(e,p.github)}
       onPointerMove={handleMove} onPointerLeave={handleLeave}
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
          <span className="mono">{p.year}</span>
          <span style={{color:'var(--fg-faint)'}}>·</span>
          <span>{p.cat}</span>
        </div>
        <h3 style={{margin:'10px 0 12px',fontSize:30,lineHeight:1.1,letterSpacing:'-0.02em',fontWeight:500}}>{p.title}</h3>
        <p className="sub" style={{margin:0,maxWidth:560}}>{p.long}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:22}}>
          {p.tags.map(t=><Tag key={t}>{t}</Tag>)}
        </div>
        <div className="see-more-cta" style={{marginTop:28}}>
          <span>See more</span>
          <Icon.ArrowUR/>
        </div>
      </div>
      <div className="featured-sheen"/>
      <style>{`
        .featured{
          display:grid;grid-template-columns:1.15fr 1fr;gap:0;
          border:1px solid var(--border);border-radius:16px;
          background:var(--bg-elev);overflow:hidden;
          text-decoration:none;color:inherit;
          box-shadow:var(--shadow);
          transition:border-color 240ms ease,box-shadow 240ms ease,transform 240ms cubic-bezier(.2,.7,.2,1);
        }
        .featured:hover{
          border-color:var(--blue);
          box-shadow:0 24px 60px -24px color-mix(in oklab,var(--blue) 40%,transparent);
          transform:translateY(-2px);
        }
        .featured-cover{position:relative;aspect-ratio:16/9;border-right:1px solid var(--border);background:var(--bg-soft);}
        .featured-body{padding:32px 36px;display:flex;flex-direction:column;justify-content:center;}
        .cat-pill{
          position:absolute;top:14px;left:14px;
          font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;
          background:rgba(255,255,255,0.92);color:#0a0a0a;
          padding:4px 8px;border-radius:6px;backdrop-filter:blur(8px);
        }
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
          .featured-body{padding:24px;}
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
    </a>
  );
}

function ListRow({ p }) {
  const href = p.github&&p.github!=='#' ? p.github : undefined;
  return (
    <a href={href||'#'}
       target={href?'_blank':undefined} rel={href?'noopener noreferrer':undefined}
       onClick={e=>openGithub(e,p.github)}
       className="row">
      <div className="row-meta mono">{p.year}</div>
      <div className="row-thumb"><CoverImg cover={p.cover} title={p.title}/></div>
      <div className="row-mid">
        <div className="row-head">
          <span className="row-cat">{p.cat}</span>
          <h4 className="row-title">{p.title}</h4>
        </div>
        <p className="row-sum">{p.summary}</p>
      </div>
      <div className="row-tags">{p.tags.slice(0,3).map(t=><Tag key={t}>{t}</Tag>)}</div>
      <div className="row-arrow"><Icon.ArrowUR/></div>
      <style>{`
        .row{
          display:grid;grid-template-columns:64px 120px 1fr auto 28px;
          gap:20px;align-items:center;
          padding:18px 4px;border-bottom:1px solid var(--border);
          text-decoration:none;color:inherit;
          transition:background 200ms ease,padding 220ms cubic-bezier(.2,.7,.2,1),color 200ms ease;
        }
        .row:hover{background:var(--blue-soft);padding-left:14px;padding-right:14px;}
        html[data-theme="dark"] .row:hover{background:color-mix(in oklab,var(--blue) 12%,var(--bg));}
        .row:hover h4{color:var(--blue-fg);}
        .row-meta{font-size:12px;color:var(--fg-muted);}
        .row-thumb{aspect-ratio:16/9;width:120px;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:var(--bg-soft);}
        .row-head{display:flex;align-items:center;gap:8px;}
        .row-title{margin:0;font-size:17px;font-weight:500;letter-spacing:-0.01em;}
        .row-cat{
          font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;
          color:var(--fg-muted);padding:2px 7px;border-radius:4px;
          background:var(--tag-bg);border:1px solid var(--border);
        }
        .row-sum{margin:6px 0 0;font-size:14px;color:var(--fg-muted);line-height:1.5;max-width:540px;}
        .row-tags{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:240px;}
        .row-arrow{
          width:28px;height:28px;border-radius:7px;
          display:flex;align-items:center;justify-content:center;
          color:var(--fg-faint);
          transition:background 220ms ease,color 220ms ease,transform 240ms cubic-bezier(.2,.7,.2,1);
        }
        .row:hover .row-arrow{background:var(--blue);color:#ffffff;transform:translate(3px,-3px) rotate(-3deg);}
        .row-arrow svg{width:14px;height:14px;}
        @media(min-width:641px) and (max-width:880px){
          .row{grid-template-columns:80px 1fr 28px;}
          .row-thumb,.row-tags{display:none;}
        }
        @media(max-width:640px){
          /* Top-align so the (short) 16:9 thumb sits level with the title
             instead of floating in the middle of a tall text block. */
          .row{
            grid-template-columns: 88px 1fr 22px;
            gap: 12px;
            padding: 14px 2px;
            align-items: start;
          }
          .row-thumb{
            width: 88px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .row-meta{ display: none; }
          .row-tags{ display: none; }
          /* Clamp title + summary to keep every row a uniform height. */
          .row-head{ align-items: flex-start; }
          .row-title{
            font-size: 15px; line-height: 1.25;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .row-cat{ margin-top: 1px; }
          .row-sum{
            font-size: 12px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-top: 4px;
          }
          .row-arrow{ margin-top: 2px; }
          .row:hover{ padding-left: 8px; padding-right: 8px; }
          .row-arrow{ width: 22px; height: 22px; }
          .row-arrow svg{ width: 13px; height: 13px; }
        }
      `}</style>
    </a>
  );
}

// ─── About · looping interests band ──────────────────────────────────────────
// A continuously scrolling row of icon chips ("What I'm into"). Rendered twice
// and translated -50% for a seamless loop; pauses on hover (pointer devices).
function InterestsBand() {
  const interests = PROFILE().interests || [];
  if (!interests.length) return null;
  const loop = [...interests, ...interests];
  return (
    <section className="interests">
      <div className="eyebrow">What I'm into</div>
      <h3 className="interests-title">Beyond the data<span style={{color:'var(--fg-faint)'}}>.</span></h3>
      <div className="ib-wrap" aria-label="Interests">
        <div className="ib-track">
          {loop.map((it,i)=>{
            const Glyph = Icon[it.icon] || Icon.Dot;
            return (
              <div key={i} className="ib-chip" aria-hidden={i>=interests.length?true:undefined}>
                <span className="ib-ico"><Glyph/></span>
                <span className="ib-label">{it.label}</span>
              </div>
            );
          })}
        </div>
        <div className="ib-fade ib-fade-l"/>
        <div className="ib-fade ib-fade-r"/>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════════
function About({ go }) {
  const P = PROFILE();

  return (
    <div className="page-enter shell" style={{paddingTop:64,maxWidth:920}}>
      <div className="eyebrow">About</div>
      <h2 className="h2" style={{marginTop:10}}>The short version<span style={{color:'var(--fg-faint)'}}>.</span></h2>

      <div className="about-layout" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,marginTop:40}}>
        {/* Left — bio */}
        <div className="prose">
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28}}>
            <Avatar/>
            <div>
              <div style={{fontSize:15,fontWeight:500,letterSpacing:'-0.01em'}}>{P.name}</div>
              <div style={{fontSize:13,color:'var(--fg-muted)',marginTop:2}}>{P.location} · {P.age}</div>
            </div>
          </div>

          {(P.bio||[]).map((para,i)=>(
            i===2 ? (
              <p key={i}>
                {para.split('projects page')[0]}
                <ULink seed={0} onClick={(e)=>{ e.preventDefault(); go&&go('work'); }}>projects page</ULink>
                {para.split('projects page')[1]||''}
              </p>
            ) : <p key={i}>{para}</p>
          ))}

          <div style={{display:'flex',gap:10,marginTop:28,flexWrap:'wrap'}}>
            {P.cv && (
              <a href={P.cv} target="_blank" rel="noopener noreferrer" className="btn-ghost-2">
                <Icon.Download/> Resume
              </a>
            )}
            {P.linkedin && (
              <a href={P.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost-2">
                <Icon.Linkedin style={{width:14,height:14}}/> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Right — sidebar */}
        <aside style={{display:'flex',flexDirection:'column',gap:32}}>
          {P.education && (
            <section>
              <div className="eyebrow">Education</div>
              <ul style={{listStyle:'none',padding:0,margin:'14px 0 0',display:'grid',gap:20}}>
                {P.education.map((e,i)=>(
                  <li key={i}>
                    <div style={{fontSize:12,color:'var(--fg-muted)'}} className="mono">{e.period}</div>
                    <div style={{marginTop:4,fontSize:15,fontWeight:500,letterSpacing:'-0.01em'}}>{e.degree}</div>
                    <div style={{fontSize:13,color:'var(--fg-muted)'}}>{e.school}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {P.tools && (
            <section>
              <div className="eyebrow">Toolkit</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:14}}>
                {P.tools.map(t=><Tag key={t}>{t}</Tag>)}
              </div>
            </section>
          )}

          {P.languages && (
            <section>
              <div className="eyebrow">Languages</div>
              <ul style={{listStyle:'none',padding:0,margin:'14px 0 0',display:'grid',gap:8}}>
                {P.languages.map(([l,lvl])=>(
                  <li key={l} style={{display:'flex',justifyContent:'space-between',fontSize:14}}>
                    <span>{l}</span>
                    <span style={{color:'var(--fg-muted)'}}>{lvl}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {/* H — What I'm into (looping interest band) */}
      <InterestsBand />

      <style>{`
        .prose p{font-size:16px;line-height:1.7;color:var(--fg);letter-spacing:-0.005em;margin:0 0 16px;}
        .prose p:last-of-type{margin-bottom:0;}
        .btn-ghost-2{
          display:inline-flex;align-items:center;gap:8px;
          height:36px;padding:0 14px;border-radius:8px;
          border:1px solid var(--border);background:var(--bg-elev);
          font-size:13px;color:var(--fg);text-decoration:none;
          transition:background 200ms ease,border-color 200ms ease,color 200ms ease,transform 140ms ease;
        }
        .btn-ghost-2:hover{background:var(--blue-soft);border-color:var(--blue);color:var(--blue-fg);}
        .btn-ghost-2:hover svg{transform:translate(2px,-2px);}
        .btn-ghost-2:active{transform:scale(0.97);}
        .btn-ghost-2 svg{width:14px;height:14px;transition:transform 220ms cubic-bezier(.2,.7,.2,1);}
        @media(max-width:780px){
          .page-enter .prose+aside{grid-column:1/-1;}
        }
      `}</style>
    </div>
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
