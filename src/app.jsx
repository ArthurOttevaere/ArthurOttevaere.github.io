// App shell — nav, footer, theme toggle, routing.

const { useState, useEffect, useCallback, useRef } = React;

const ROUTES = [
  { id:'home',    label:'home'    },
  { id:'work',    label:'work'    },
  { id:'about',   label:'about'   },
  { id:'contact', label:'contact' },
];

// Map the URL hash (#/work, #/about, …) to a known route id; unknown/empty → home.
// This makes every page shareable, refresh-safe, and wired to browser back/forward.
function routeFromHash() {
  const raw = (typeof window!=='undefined' ? window.location.hash : '').slice(1); // "/work"
  const id  = raw.replace(/^\//,'').split(/[/?#]/)[0].toLowerCase();
  return ROUTES.some(r=>r.id===id) ? id : 'home';
}
function hashForRoute(r){ return r==='home' ? '/' : '/'+r; }

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
const SCROLL_RESTORE_KEY = 'ao-scroll-restore';

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

// ─── Morphing sun ↔ moon icon ─────────────────────────────────────────────────
// One filled disc. In dark mode an offset "bite" circle (via mask) slides in
// from the upper-right to carve a crescent, while the eight sun rays retract to
// nothing. All motion is CSS-driven off the `.is-dark` class (see index.html).
function ThemeIcon({ dark }) {
  const rays = [
    'M12 1.6V4', 'M12 20v2.4', 'M1.6 12H4', 'M20 12h2.4',
    'M4.6 4.6 6.3 6.3', 'M17.7 17.7 19.4 19.4', 'M4.6 19.4 6.3 17.7', 'M17.7 6.3 19.4 4.6',
  ];
  return (
    <svg className={'theme-icon'+(dark?' is-dark':'')} viewBox="0 0 24 24"
         width="18" height="18" aria-hidden="true">
      <mask id="theme-moon-mask">
        <rect x="0" y="0" width="24" height="24" fill="#fff"/>
        <circle className="ti-bite" cx="12" cy="12" r="6" fill="#000"/>
      </mask>
      <circle className="ti-core" cx="12" cy="12" r="5"
              fill="currentColor" mask="url(#theme-moon-mask)"/>
      <g className="ti-rays" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        {rays.map((d,i)=><path key={i} d={d}/>)}
      </g>
    </svg>
  );
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
      // Remember the scroll position and hand off restoration to our own code
      // instead of the browser's native (and here, unreliable) auto-restore.
      sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.location.reload();
      return;
    }
    setTheme(next);
  };
  return (
    <button className="icon-btn" title={`Switch to ${next} mode`} aria-label={`Switch to ${next} mode`}
      onClick={handleClick}>
      <ThemeIcon dark={theme!=='light'}/>
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

// ─── Reading progress bar ─────────────────────────────────────────────────────
// A hairline accent bar pinned to the top edge, filled by scroll depth. Uses a
// scaleX transform (compositor-only) updated inside rAF so scrolling stays smooth.
function ReadingProgress() {
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      el.classList.toggle('at-top', window.scrollY < 8);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll);
    return ()=>{
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="read-progress at-top" ref={ref} aria-hidden="true"/>;
}

// ─── Back-to-top button ───────────────────────────────────────────────────────
// Appears once the reader is past the first screen; glides back to the top.
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(()=>{
    let raf = 0;
    const update = ()=>{ raf = 0; setShow(window.scrollY > window.innerHeight * 0.9); };
    const onScroll = ()=>{ if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive:true });
    return ()=>{ window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  const toTop = ()=>{
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top:0, behavior: smooth ? 'smooth' : 'instant' });
  };
  return (
    <button className={'to-top'+(show?' show':'')} onClick={toTop}
      aria-label="Back to top" title="Back to top" tabIndex={show?0:-1}>
      <Icon.ArrowDown/>
    </button>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav({ route, go, theme, setTheme }) {
  const P = (window.PORTFOLIO_DATA||{}).profile || {};
  const linksRef = useRef(null);
  const [ind, setInd] = useState({ x: 0, w: 0, ready: false });

  // Condense the pill once the reader leaves the very top: it tightens and its
  // glass grows a touch more opaque, so it reads as "settled" over content.
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    let raf = 0;
    const update = ()=>{ raf = 0; setScrolled(window.scrollY > 12); };
    const onScroll = ()=>{ if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive:true });
    return ()=>{ window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

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
    <header className={'nav'+(scrolled?' scrolled':'')}>
      <div className="shell nav-inner">
        <button className="brand" onClick={()=>go('home')} aria-label="Home">
          <Icon.Logo className="brand-mark"/>
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

// ─── Fir forest (footer decor) ──────────────────────────────────────────────
// Built once, deterministically, so it renders identically every load. Firs are
// drawn in currentColor (the footer accent) and layered front/back for depth.
function firSVG(seed, spruce) {
  const rnd = (s => () => (s = (s * 9301 + 49297) % 233280) / 233280)(seed);
  const h = (spruce ? 66 : 52) + Math.round(rnd() * 34);
  const w = Math.round(h * (spruce ? 0.5 : 0.62)), cx = w / 2;
  const trunk = Math.max(6, Math.round(h * 0.1)), body = h - trunk;
  const tiers = spruce ? 5 : 4, rise = body * (spruce ? 0.2 : 0.24);
  const tier = (apexY, botY, half) =>
    `<path d="M${cx} ${apexY.toFixed(1)} L${(cx - half).toFixed(1)} ${botY.toFixed(1)} Q${cx} ${(botY + 3).toFixed(1)} ${(cx + half).toFixed(1)} ${botY.toFixed(1)} Z"/>`;
  let paths = `<rect x="${(cx - trunk * 0.32).toFixed(1)}" y="${(h - trunk).toFixed(1)}" width="${(trunk * 0.64).toFixed(1)}" height="${trunk}"/>`;
  for (let i = 0; i < tiers; i++) {
    const botY = (h - trunk) - i * rise;
    const half = w * 0.5 * (1 - i * (0.66 / (tiers - 1)));
    paths += tier(i === tiers - 1 ? 2 : botY - body * 0.4, botY, half);
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="currentColor">${paths}</svg>`;
}
const FOOT_FOREST = Array.from({ length: 22 }, (_, i) =>
  `<span class="fir ${i % 2 ? 'fir-front' : 'fir-back'}">` +
  `<span class="fir-tree"><span class="fir-twig">${firSVG(i * 47 + 5, i % 3 === 0)}</span></span></span>`
).join('');

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

  // Mail tile copies the address to the clipboard with a little confirmation,
  // instead of forcing open a mail client. Falls back to mailto if the
  // clipboard API is unavailable (older/insecure contexts).
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  const copyMail = useCallback((e)=>{
    if (!hasMail) return;
    e.preventDefault();
    const done = ()=>{
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(()=>setCopied(false), 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(P.email).then(done).catch(()=>{
        window.location.href = 'mailto:'+P.email;
      });
    } else {
      window.location.href = 'mailto:'+P.email;
    }
  }, [hasMail, P.email]);
  useEffect(()=>()=>clearTimeout(copyTimer.current), []);

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
      <div className="foot-forest" aria-hidden="true"
           dangerouslySetInnerHTML={{ __html: `<div class="foot-forest-row">${FOOT_FOREST}</div>` }}/>
      <div className="foot-sheen" aria-hidden="true"/>
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
            const isMail = s.id==='mail' && !disabled;
            return (
              <a key={s.id}
                 className={'foot-tile'+(isMail && copied ? ' copied' : '')}
                 href={s.href}
                 aria-label={isMail ? 'Copy email address' : s.label}
                 style={{'--i': i}}
                 target={s.ext && !disabled ? '_blank' : undefined}
                 rel="noopener noreferrer"
                 onClick={e=>{
                   if (disabled) { e.preventDefault(); return; }
                   if (isMail) copyMail(e);
                 }}>
                {isMail && copied
                  ? <Icon.Check/>
                  : <Ico/>}
                {isMail && copied && <span className="foot-tile-toast">Copied ✓</span>}
              </a>
            );
          })}
        </div>

        <div className="foot-base">
          <span className="foot-brand">
            <Icon.Logo className="foot-mark"/>
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
  // The URL hash is the source of truth for the route, so a shared/refreshed
  // link opens the right page and browser back/forward work.
  const [route, setRoute] = useState(routeFromHash);
  // Count navigations: the first paint (0) is revealed by the boot splash fade,
  // so we skip the page-enter animation then and only animate once the user
  // actually navigates. Keeps the boot→home reveal clean (no double motion).
  const [navCount, setNavCount] = useState(0);

  // Apply a route to the view: swap page, re-enable the enter animation, top-scroll.
  const applyRoute = useCallback(r=>{
    setRoute(r);
    setNavCount(c=>c+1);   // any navigation re-enables the page-enter anim
    window.scrollTo({top:0,behavior:'instant'});
  }, []);

  // Navigation writes the hash; the hashchange listener below turns that into an
  // applyRoute. Clicking the current page (no hash change) still re-scrolls to top.
  const go = useCallback(r=>{
    const target = hashForRoute(r);
    if (window.location.hash.slice(1) !== target) {
      window.location.hash = target;
    } else {
      applyRoute(r);
    }
  }, [applyRoute]);

  useEffect(()=>{
    const onHash = ()=> applyRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash);
  }, [applyRoute]);

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

  // Restore the scroll position saved by the mobile theme-toggle reload (see
  // ThemeToggle). Applied immediately while the boot splash still covers the
  // page — so the jump is invisible — then reasserted once the splash lifts
  // (revealed) to correct for any late layout shift (images/fonts), before
  // handing scroll control back to native restoration for ordinary refreshes.
  useEffect(()=>{
    const saved = sessionStorage.getItem(SCROLL_RESTORE_KEY);
    if (saved == null) return;
    const y = parseInt(saved, 10);
    window.scrollTo({top:y, behavior:'instant'});
  }, []);
  useEffect(()=>{
    if (!revealed) return;
    const saved = sessionStorage.getItem(SCROLL_RESTORE_KEY);
    if (saved == null) return;
    sessionStorage.removeItem(SCROLL_RESTORE_KEY);
    const y = parseInt(saved, 10);
    const restore = ()=> window.scrollTo({top:y, behavior:'instant'});
    restore();
    const raf = requestAnimationFrame(()=>{
      restore();
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    });
    return ()=> cancelAnimationFrame(raf);
  }, [revealed]);

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
      <ReadingProgress key={route}/>
      <Nav route={route} go={go} theme={theme} setTheme={setTheme}/>
      <main key={route} style={{minHeight:'calc(100vh - 64px - 96px)'}}>
        {Page}
      </main>
      <Footer route={route}/>
      <CommandPalette go={go} theme={theme} setTheme={setTheme}/>
      <MobileNav route={route} go={go}/>
      <BackToTop/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
// Note: the boot splash is dismissed by App's reveal effect (see above), which
// keeps the page hidden until the splash has fully faded — preventing the
// splash + landing greetings from overlapping. The 12s safety-net in
// index.html still force-removes the splash if React never mounts.
