// App shell — nav, footer, theme toggle, routing.

const { useState, useEffect, useCallback, useRef } = React;

const ROUTES = [
  { id:'home',    label:'home'    },
  { id:'work',    label:'work'    },
  { id:'about',   label:'about'   },
  { id:'contact', label:'contact' },
];

// Accent colour options. 'auto' = time-of-day palette (existing behaviour).
const ACCENTS = [
  { id:'auto',    label:'Auto',    swatch:null,      cls:'accent-swatch-auto' },
  { id:'blue',    label:'Blue',    swatch:'#2563eb', cls:'' },
  { id:'violet',  label:'Violet',  swatch:'#7c3aed', cls:'' },
  { id:'rose',    label:'Rose',    swatch:'#e11d48', cls:'' },
  { id:'amber',   label:'Amber',   swatch:'#d97706', cls:'' },
  { id:'emerald', label:'Emerald', swatch:'#059669', cls:'' },
  { id:'cyan',    label:'Cyan',    swatch:'#0891b2', cls:'' },
];

// ─── Theme hook ───────────────────────────────────────────────────────────────
// Respects system preference on first visit; localStorage overrides on return.
function useTheme() {
  const [theme, setTheme] = useState(()=>{
    if (typeof window==='undefined') return 'light';
    const saved = localStorage.getItem('ao-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ao-theme', theme);
    // Refresh time-of-day accent after theme change
    if (window.__refreshAccent) window.__refreshAccent();
  }, [theme]);
  return [theme, setTheme];
}

// ─── Theme toggle button ──────────────────────────────────────────────────────
function ThemeToggle({ theme, setTheme }) {
  const next = theme==='light'?'dark':'light';
  return (
    <button className="icon-btn" title={`Switch to ${next} mode`} aria-label={`Switch to ${next} mode`}
      onClick={()=>setTheme(next)}>
      <span style={{
        display:'inline-flex',alignItems:'center',justifyContent:'center',
        transition:'transform 320ms ease,opacity 200ms ease',
        transform:theme==='light'?'rotate(0deg)':'rotate(-40deg)',
      }}>
        {theme==='light' ? <Icon.Sun/> : <Icon.Moon/>}
      </span>
    </button>
  );
}

// ─── Accent colour picker ─────────────────────────────────────────────────────
function AccentPicker() {
  const [accent, setAccentRaw] = useState(()=> localStorage.getItem('ao-accent-manual') || 'auto');
  const [open, setOpen]        = useState(false);
  const ref = useRef(null);

  function pick(id) {
    setAccentRaw(id);
    localStorage.setItem('ao-accent-manual', id);
    // Re-run the shared applyAccent function so --blue updates immediately.
    window.__refreshAccent && window.__refreshAccent();
    setOpen(false);
  }

  // Close on outside click
  useEffect(()=>{
    if (!open) return;
    function onDown(e){ if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDown);
    return ()=> document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Close on Escape
  useEffect(()=>{
    if (!open) return;
    function onKey(e){ if (e.key==='Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  }, [open]);

  // Keep local state in sync when another tab changes the accent
  useEffect(()=>{
    function onStorage(e){
      if (e.key==='ao-accent-manual') setAccentRaw(e.newValue || 'auto');
    }
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  }, []);

  const current = ACCENTS.find(a=>a.id===accent) || ACCENTS[0];

  return (
    <div style={{position:'relative'}} ref={ref}>
      {/* Button — shows the current accent as a live dot */}
      <button
        className="accent-btn"
        title={`Accent colour: ${current.label}`}
        aria-label="Change accent colour"
        aria-expanded={open}
        onClick={()=>setOpen(o=>!o)}
      >
        <span className="accent-btn-dot"/>
      </button>

      {/* Glass popover */}
      {open && (
        <div className="accent-pop" role="dialog" aria-label="Accent colour picker">
          <div className="accent-swatches">
            {ACCENTS.map(a=>(
              <button
                key={a.id}
                className={['accent-swatch', a.cls, accent===a.id?'on':''].filter(Boolean).join(' ')}
                title={a.label}
                aria-pressed={accent===a.id}
                onClick={()=>pick(a.id)}
                style={a.swatch ? { background:a.swatch, '--swatch':a.swatch } : undefined}
              />
            ))}
          </div>
          <div className="accent-label">{current.label}</div>
        </div>
      )}
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav({ route, go, theme, setTheme }) {
  const P = (window.PORTFOLIO_DATA||{}).profile || {};
  const linksRef = useRef(null);
  const [ind, setInd] = useState({ x: 0, w: 0, ready: false });

  // Measure active button position and slide the indicator to it.
  // useLayoutEffect runs synchronously after paint — no visible flash.
  useEffect(()=>{
    function measure() {
      const container = linksRef.current;
      if (!container) return;
      const btn = container.querySelector('.nav-link.active');
      if (!btn) { setInd(s=>({...s, ready:false})); return; }
      const cr = container.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      // 12px = left/right button padding — underline sits inside the padding
      setInd({ x: br.left - cr.left + 12, w: br.width - 24, ready: true });
    }
    measure();
    window.addEventListener('resize', measure);
    return ()=> window.removeEventListener('resize', measure);
  }, [route]);

  return (
    <header className="nav">
      <div className="shell nav-inner">
        <button className="brand" onClick={()=>go('home')} aria-label="Home">
          <span className="brand-dot"/>
          <span>Arthur O.</span>
        </button>

        <nav className="nav-links" ref={linksRef} aria-label="Primary">
          {/* Single sliding underline — glides from link to link */}
          <span className={'nav-indicator'+(ind.ready?'':' hidden')}
            style={{ left: ind.x, width: ind.w }}/>
          {ROUTES.map(r=>(
            <button key={r.id}
              className={'nav-link '+(route===r.id?'active':'')}
              onClick={()=>go(r.id)}>
              {r.label}
            </button>
          ))}
        </nav>

        <div className="nav-right">
          <CmdkTrigger/>
          <ThemeToggle theme={theme} setTheme={setTheme}/>
          <AccentPicker/>
          <a href={P.cv&&P.cv!=='#'?P.cv:'#'}
             target={P.cv&&P.cv!=='#'?'_blank':undefined}
             rel="noopener noreferrer"
             onClick={e=>{ if(!P.cv||P.cv==='#') e.preventDefault(); }}
             className="cv-btn" title="Download CV">
            <span>CV</span> <Icon.Download/>
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ route }) {
  const P = (window.PORTFOLIO_DATA||{}).profile || {};
  return (
    <footer className="foot">
      <div className="shell foot-inner">
        <span style={{fontSize:12,fontWeight:500,letterSpacing:'-0.01em'}}>Arthur Ottevaere</span>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <ULink href={P.linkedin&&P.linkedin!=='#'?P.linkedin:'#'}
                 target={P.linkedin&&P.linkedin!=='#'?'_blank':undefined}
                 rel="noopener noreferrer"
                 onClick={e=>{ if(!P.linkedin||P.linkedin==='#') e.preventDefault(); }}
                 seed={1}>LinkedIn</ULink>
          <ULink href={P.github&&P.github!=='#'?P.github:'#'}
                 target={P.github&&P.github!=='#'?'_blank':undefined}
                 rel="noopener noreferrer"
                 onClick={e=>{ if(!P.github||P.github==='#') e.preventDefault(); }}
                 seed={2}>GitHub</ULink>
          <span className="mono" style={{color:'var(--fg-faint)'}}>v1.0</span>
        </div>
      </div>
    </footer>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useTheme();
  const [route, setRoute] = useState('home');

  const go = useCallback(r=>{ setRoute(r); window.scrollTo({top:0,behavior:'instant'}); }, []);

  // Expose for in-prose links
  useEffect(()=>{ window.__go = go; }, [go]);

  let Page;
  switch(route) {
    case 'work':    Page = <Projects/>; break;
    case 'about':   Page = <About go={go}/>; break;
    case 'contact': Page = <Contact/>; break;
    default:        Page = <Landing go={go}/>;
  }

  return (
    <div>
      <Nav route={route} go={go} theme={theme} setTheme={setTheme}/>
      <main key={route} style={{minHeight:'calc(100vh - 64px - 96px)'}}>
        {Page}
      </main>
      <Footer route={route}/>
      <CommandPalette go={go} theme={theme} setTheme={setTheme}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
