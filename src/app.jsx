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
// Follows the OS appearance (prefers-color-scheme): the site's day/night mode
// matches the user's device and updates live when the system flips. The toggle
// button still allows a manual override for the current session.
const THEME_OVERRIDE_KEY = 'ao-theme-override';

function useTheme() {
  const systemTheme = () =>
    (typeof window!=='undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  // A mobile manual toggle persists its choice (see ThemeToggle) and reloads the
  // page to work around an iOS rendering glitch above the Dynamic Island; on
  // load we honor that stored override instead of the raw system theme.
  const initialTheme = () => {
    const stored = typeof window!=='undefined' && sessionStorage.getItem(THEME_OVERRIDE_KEY);
    return stored || systemTheme();
  };
  const [theme, setTheme] = useState(initialTheme);

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    // Refresh time-of-day accent after theme change
    if (window.__refreshAccent) window.__refreshAccent();
  }, [theme]);

  // Live-follow the system: when the OS switches light/dark, the site follows.
  useEffect(()=>{
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e)=> setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return ()=> mq.removeEventListener('change', onChange);
  }, []);

  return [theme, setTheme];
}

// ─── Theme toggle button ──────────────────────────────────────────────────────
function ThemeToggle({ theme, setTheme }) {
  const next = theme==='light'?'dark':'light';
  const handleClick = () => {
    // On mobile, Safari sometimes leaves the section above the Dynamic Island
    // stuck in the old theme after a live re-render. Force a full reload there;
    // desktop keeps the instant in-place toggle.
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    if (isMobile) {
      sessionStorage.setItem(THEME_OVERRIDE_KEY, next);
      window.location.reload();
      return;
    }
    setTheme(next);
  };
  return (
    <button className="icon-btn" title={`Switch to ${next} mode`} aria-label={`Switch to ${next} mode`}
      onClick={handleClick}>
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

  function isMobileDevice() {
    return window.matchMedia('(max-width: 640px)').matches
      || /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
  }

  function pick(id) {
    setAccentRaw(id);
    localStorage.setItem('ao-accent-manual', id);
    setOpen(false);
    // On mobile devices, the top-of-page accent glow can get stuck on the old
    // colour until a reload. The accent is persisted in localStorage and
    // re-applied by the inline script on boot, so a quick reload cleanly
    // repaints everything.
    if (isMobileDevice()) {
      location.reload();
      return;
    }
    // Desktop: re-run the shared applyAccent so --blue updates immediately.
    window.__refreshAccent && window.__refreshAccent();
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
    <div className="accent-wrap" style={{position:'relative'}} ref={ref}>
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
              >
                {a.id==='auto' && <Icon.AutoTheme/>}
              </button>
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

  // Sliding indicator
  useEffect(()=>{
    function measure() {
      const container = linksRef.current;
      if (!container) return;
      const btn = container.querySelector('.nav-link.active');
      if (!btn) { setInd(s=>({...s, ready:false})); return; }
      const cr = container.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
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

        {/* Right-side controls. On mobile (page links live in the bottom bar)
            only the theme toggle + CV remain — cmdk & accent are desktop-only. */}
        <div className="nav-right">
          <CmdkTrigger/>
          <AccentPicker/>
          <ThemeToggle theme={theme} setTheme={setTheme}/>
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

  // Live local clock for "Currently" — Brussels time, ticks every 30s.
  const [now, setNow] = useState(()=>new Date());
  useEffect(()=>{
    const id = setInterval(()=>setNow(new Date()), 30000);
    return ()=>clearInterval(id);
  }, []);
  const tz = 'Europe/Brussels';
  const time = now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', timeZone:tz });
  const hour = +now.toLocaleString('en-GB', { hour:'2-digit', hour12:false, timeZone:tz });
  const isNight = hour < 7 || hour >= 20;

  // "Last updated" tracks the page file itself — document.lastModified is the
  // HTML's modified date, so it refreshes automatically on every deploy.
  const updated = new Date(document.lastModified)
    .toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

  const hasMail = P.email && P.email!=='#';
  const socials = [
    { id:'mail',     icon:'Mail',     label:'Email',
      href: hasMail ? 'mailto:'+P.email : '#', ext:false },
    { id:'linkedin', icon:'Linkedin', label:'LinkedIn',
      href: P.linkedin&&P.linkedin!=='#' ? P.linkedin : '#', ext:true },
    { id:'github',   icon:'Github',   label:'GitHub',
      href: P.github&&P.github!=='#' ? P.github : '#', ext:true },
  ];

  return (
    <footer className="foot">
      <div className="shell foot-inner">
        <div className="foot-meta">
          <div className="foot-col">
            <span className="foot-eyebrow">Last updated</span>
            <span className="foot-meta-val">{updated}</span>
          </div>
          <div className="foot-col foot-col-right">
            <span className="foot-eyebrow">Currently</span>
            <span className="foot-meta-val">Tournai · {time}</span>
          </div>
        </div>

        <div className="foot-note">
          <span className="foot-note-label">A note from Arthur</span>
          <p className="foot-note-text">
            Thanks for scrolling all the way down. If an idea, a question,
            or just a hello crossed your mind — {hasMail
              ? <a href={'mailto:'+P.email}>{P.email}</a>
              : <span>let's talk</span>}. I'd love to hear from you.
          </p>
        </div>

        <div className="foot-socials">
          {socials.map((s,i)=>{
            const Ico = Icon[s.icon];
            const disabled = s.href==='#';
            return (
              <a key={s.id}
                 className="foot-tile"
                 href={s.href}
                 aria-label={s.label}
                 style={{'--i': i}}
                 target={s.ext && !disabled ? '_blank' : undefined}
                 rel="noopener noreferrer"
                 onClick={e=>{ if(disabled) e.preventDefault(); }}>
                <Ico/>
              </a>
            );
          })}
        </div>

        <div className="foot-base">
          <span className="foot-brand">
            <span className="foot-dot"/>
            Arthur Ottevaere
          </span>
          <span className="foot-mid mono">© {new Date().getFullYear()} · Tournai, BE</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Mobile bottom navigation ────────────────────────────────────────────────
function MobileNav({ route, go }) {
  return (
    <nav className="mobile-nav" aria-label="Navigation mobile">
      {ROUTES.map(r=>(
        <button key={r.id}
          className={'mobile-nav-btn'+(route===r.id?' on':'')}
          onClick={()=>go(r.id)}
          aria-current={route===r.id?'page':undefined}>
          {r.label}
        </button>
      ))}
    </nav>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useTheme();
  const [route, setRoute] = useState('home');
  // Count navigations: the first paint (0) is revealed by the boot splash fade,
  // so we skip the page-enter animation then and only animate once the user
  // actually navigates. Keeps the boot→home reveal clean (no double motion).
  const [navCount, setNavCount] = useState(0);

  const go = useCallback(r=>{
    setRoute(r);
    setNavCount(c=>c+1);   // any user navigation re-enables the page-enter anim
    window.scrollTo({top:0,behavior:'instant'});
  }, []);

  // Expose for in-prose links
  useEffect(()=>{ window.__go = go; }, [go]);

  // Boot → landing handoff. The page stays hidden while the splash fades out,
  // and only fades in once the splash is fully gone — so the splash greeting
  // and the landing greeting never overlap (no double "Bonjour" mid-fade).
  const [revealed, setRevealed] = useState(false);
  useEffect(()=>{
    const bl = document.getElementById('boot-loader');
    const start = window.__bootStart || performance.now();
    const MIN_MS = 1700;          // minimum splash time (greetings read as intro)
    const FADE_MS = 500;          // splash fade-out duration (matches CSS)
    const wait = Math.max(0, MIN_MS - (performance.now() - start));
    let t2;
    const t1 = setTimeout(()=>{
      if (bl) bl.classList.add('boot-done');   // splash fades out
      // Reveal the page the moment the splash is fully transparent.
      t2 = setTimeout(()=>{ if (bl) bl.remove(); setRevealed(true); }, FADE_MS);
    }, wait);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); };
  }, []);

  let Page;
  switch(route) {
    case 'work':    Page = <Projects/>; break;
    case 'about':   Page = <About go={go}/>; break;
    case 'contact': Page = <Contact/>; break;
    default:        Page = <Landing go={go}/>;
  }

  return (
    <div className={navCount===0 ? 'app-no-enter' : ''}
         style={{ opacity: revealed ? 1 : 0,
                  transition: 'opacity 560ms cubic-bezier(.4,0,.2,1)' }}>
      <Nav route={route} go={go} theme={theme} setTheme={setTheme}/>
      <main key={route} style={{minHeight:'calc(100vh - 64px - 96px)'}}>
        {Page}
      </main>
      <Footer route={route}/>
      <CommandPalette go={go} theme={theme} setTheme={setTheme}/>
      <MobileNav route={route} go={go}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
// Note: the boot splash is dismissed by App's reveal effect (see above), which
// keeps the page hidden until the splash has fully faded — preventing the
// splash + landing greetings from overlapping. The 12s safety-net in
// index.html still force-removes the splash if React never mounts.
