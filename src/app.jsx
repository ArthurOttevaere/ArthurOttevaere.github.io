// =============================================================================
//  app.jsx — the shell around the pages: nav, footer, theme, routing, the
//  smooth-scroll engine, and the hand-off from the boot splash to the site.
//  Routing uses real paths (/work/f1/) through the History API, so every page
//  is shareable and previews correctly; tools/build.mjs writes a small HTML
//  file for each of them.
// =============================================================================

const { useState, useEffect, useCallback, useRef } = React;

const NAV = [
  { label: 'Work',    to: '/work/',    route: 'work' },
  { label: 'About',   to: '/about/',   route: 'about' },
  { label: 'Contact', to: '/contact/', route: 'contact' },
];
const THEME_KEY = 'ao-theme';

/* ── Theme ─────────────────────────────────────────────────────────────────
   Follows the system by default; the toggle overrides it for the session and
   also repaints <meta name="theme-color">, which is what the strip above the
   Dynamic Island reads. */
function useTheme(){
  const system = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const [theme, setTheme] = useState(() => {
    try { return sessionStorage.getItem(THEME_KEY) || system(); } catch (e) { return system(); }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0E0E11' : '#F6F4EF');
  }, [theme]);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = e => {
      try { if (sessionStorage.getItem(THEME_KEY)) return; } catch (_) {}
      setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const toggle = useCallback(() => {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      try { sessionStorage.setItem(THEME_KEY, next); } catch (e) {}
      return next;
    });
  }, []);
  return [theme, toggle];
}

function ThemeButton({ theme, toggle, className }){
  const next = theme === 'light' ? 'dark' : 'light';
  const Glyph = theme === 'light' ? Icon.Moon : Icon.Sun;
  return (
    <button type="button" className={className || 'nav-icon nav-theme'} onClick={toggle}
            title={'Switch to ' + next + ' mode'} aria-label={'Switch to ' + next + ' mode'}>
      <Glyph style={{ width: 17, height: 17 }}/>
    </button>
  );
}

/* ── CV button (one language → a direct download, several → a menu) ────── */
function CvButton(){
  const links = useCvLinks();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const down = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key  = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  if (!links.length) return null;
  if (links.length === 1) {
    return <a className="nav-cv" href={links[0].href} target="_blank" rel="noopener noreferrer">CV <Icon.Download/></a>;
  }
  return (
    <span className="nav-cv-wrap" ref={ref}>
      <button type="button" className="nav-cv" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        CV <Icon.Download/>
      </button>
      {open ? (
        <span className="cv-pop" role="menu">
          {links.map(c => (
            <a key={c.lang} href={c.href} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={() => setOpen(false)}>
              <span className="lang mono">{c.lang.toUpperCase()}</span><span>{c.label}</span>
            </a>
          ))}
        </span>
      ) : null}
    </span>
  );
}

/* ── Nav ───────────────────────────────────────────────────────────────── */
function Nav({ route, theme, toggle, menuOpen, setMenuOpen }){
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const down = y > lastY.current;
      lastY.current = y;
      setHidden(down && y > 320);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <header className={'nav' + (hidden && !menuOpen ? ' hidden' : '')}>
      <Link to="/" className="nav-logo" aria-label="Home"><Icon.Logo/></Link>
      <nav className="nav-links" aria-label="Primary">
        {NAV.map(n => (
          <Link key={n.route} to={n.to} className={'nav-link' + (route === n.route ? ' on' : '')}
                aria-current={route === n.route ? 'page' : undefined}>
            {n.label}
          </Link>
        ))}
      </nav>
      <span className="nav-right">
        <span className="nav-sep" aria-hidden="true"/>
        <ThemeButton theme={theme} toggle={toggle}/>
        <CvButton/>
        <button type="button" className="nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <Icon.Close/> : <Icon.Menu/>}
        </button>
      </span>
    </header>
  );
}

function Menu({ open, route, close, theme, toggle }){
  const P = PROFILE();
  useEffect(() => {
    if (!open) return;
    const key = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    };
  }, [open, close]);
  const items = [{ label: 'Home', to: '/', route: 'home' }].concat(NAV);
  return (
    <div className={'menu' + (open ? ' open' : '')} aria-hidden={!open}>
      {items.map((n, i) => (
        <Link key={n.route} to={n.to} className={'menu-link' + (route === n.route ? ' on' : '')}
              style={{ '--i': i }} tabIndex={open ? 0 : -1} onClick={close}>
          <span className="n">{String(i + 1).padStart(2, '0')}</span>{n.label}
        </Link>
      ))}
      <div className="menu-foot">
        <span className="menu-socials">
          {P.linkedin && P.linkedin !== '#' ? <a className="soc" href={P.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" tabIndex={open ? 0 : -1}><Icon.Linkedin/></a> : null}
          {P.github && P.github !== '#' ? <a className="soc" href={P.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" tabIndex={open ? 0 : -1}><Icon.Github/></a> : null}
          {P.email ? <a className="soc" href={'mailto:' + P.email} aria-label="Email" tabIndex={open ? 0 : -1}><Icon.Mail/></a> : null}
        </span>
        <ThemeButton theme={theme} toggle={toggle} className="soc"/>
      </div>
    </div>
  );
}

/* ── Reading progress + back to top ────────────────────────────────────── */
function Progress(){
  const ref = useRef(null);
  useScrollFrame(() => {
    const el = ref.current; if (!el) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    el.style.setProperty('--p', p.toFixed(4));
    el.classList.toggle('at-top', window.scrollY < 8);
  }, []);
  return <div className="progress at-top" ref={ref} aria-hidden="true"/>;
}

function ToTop(){
  const [show, setShow] = useState(false);
  useScrollFrame(() => { setShow(window.scrollY > window.innerHeight * 1.1); }, []);
  return (
    <button type="button" className={'to-top' + (show ? ' show' : '')} tabIndex={show ? 0 : -1}
            aria-label="Back to top" title="Back to top"
            onClick={() => {
              if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.1 });
              else window.scrollTo({ top: 0, behavior: reduceMotion() ? 'instant' : 'smooth' });
            }}>
      <Icon.ArrowDown/>
    </button>
  );
}

/* ── Footer — kept as it was: the forest, the note, the three big tiles ── */
function firSVG(seed, spruce){
  const rnd = (s => () => (s = (s * 9301 + 49297) % 233280) / 233280)(seed);
  const h = (spruce ? 66 : 52) + Math.round(rnd() * 34);
  const w = Math.round(h * (spruce ? .5 : .62)), cx = w / 2;
  const trunk = Math.max(6, Math.round(h * .1)), body = h - trunk;
  const tiers = spruce ? 5 : 4, rise = body * (spruce ? .2 : .24);
  const tier = (apexY, botY, half) =>
    `<path d="M${cx} ${apexY.toFixed(1)} L${(cx - half).toFixed(1)} ${botY.toFixed(1)} Q${cx} ${(botY + 3).toFixed(1)} ${(cx + half).toFixed(1)} ${botY.toFixed(1)} Z"/>`;
  let paths = `<rect x="${(cx - trunk * .32).toFixed(1)}" y="${(h - trunk).toFixed(1)}" width="${(trunk * .64).toFixed(1)}" height="${trunk}"/>`;
  for (let i = 0; i < tiers; i++){
    const botY = (h - trunk) - i * rise;
    const half = w * .5 * (1 - i * (.66 / (tiers - 1)));
    paths += tier(i === tiers - 1 ? 2 : botY - body * .4, botY, half);
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="currentColor">${paths}</svg>`;
}
const FOOT_FOREST = Array.from({ length: 22 }, (_, i) =>
  `<span class="fir ${i % 2 ? 'fir-front' : 'fir-back'}">` +
  `<span class="fir-tree"><span class="fir-twig">${firSVG(i * 47 + 5, i % 3 === 0)}</span></span></span>`
).join('');

function Footer(){
  const P = PROFILE();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Brussels' });
  const updated = new Date(document.lastModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const hasMail = P.email && P.email !== '#';

  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const copyMail = useCallback(e => {
    if (!hasMail) return;
    e.preventDefault();
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(P.email).then(done).catch(() => { window.location.href = 'mailto:' + P.email; });
    } else {
      window.location.href = 'mailto:' + P.email;
    }
  }, [hasMail, P.email]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const socials = [
    { id: 'mail',     icon: 'Mail',     label: 'Email',    href: hasMail ? 'mailto:' + P.email : '#', ext: false },
    { id: 'linkedin', icon: 'Linkedin', label: 'LinkedIn', href: P.linkedin && P.linkedin !== '#' ? P.linkedin : '#', ext: true },
    { id: 'github',   icon: 'Github',   label: 'GitHub',   href: P.github && P.github !== '#' ? P.github : '#', ext: true },
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
            Thanks for scrolling all the way down. If an idea, a question, or just a hello
            crossed your mind — {hasMail ? <a href={'mailto:' + P.email}>{P.email}</a> : <span>let's talk</span>}.
            I'd love to hear from you.
          </p>
        </div>

        <div className="foot-socials">
          {socials.map((s, i) => {
            const Glyph = Icon[s.icon];
            const disabled = s.href === '#';
            const isMail = s.id === 'mail' && !disabled;
            return (
              <a key={s.id}
                 className={'foot-tile' + (isMail && copied ? ' copied' : '')}
                 href={s.href}
                 style={{ '--i': i }}
                 aria-label={isMail ? 'Copy email address' : s.label}
                 target={s.ext && !disabled ? '_blank' : undefined}
                 rel="noopener noreferrer"
                 onClick={e => { if (disabled){ e.preventDefault(); return; } if (isMail) copyMail(e); }}>
                {isMail && copied ? <Icon.Check/> : <Glyph/>}
                {isMail && copied ? <span className="foot-tile-toast">Copied ✓</span> : null}
              </a>
            );
          })}
        </div>

        <div className="foot-base">
          <span className="foot-brand"><Icon.Logo/> {P.name}</span>
          <span className="foot-mid">© {new Date().getFullYear()} · {P.location || 'Tournai, BE'}</span>
        </div>
      </div>
    </footer>
  );
}

/* ── App ───────────────────────────────────────────────────────────────── */
function App(){
  const [theme, toggle] = useTheme();
  const [loc, setLoc]   = useState(() => parsePath(location.pathname));
  const [leaving, setLeaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const firstCount = useRef(true);

  const commit = useCallback((to, push) => {
    const url = new URL(to, location.origin);
    if (push) history.pushState({}, '', url.pathname + url.search + url.hash);
    setLoc(parsePath(url.pathname));
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    if (url.hash){
      setTimeout(() => { const el = document.querySelector(url.hash); if (el) scrollToEl(el, -60); }, 140);
    }
  }, []);

  const navigate = useCallback(to => {
    setMenuOpen(false);
    const url = new URL(to, location.origin);
    if (url.pathname === location.pathname){
      const el = url.hash ? document.querySelector(url.hash) : null;
      if (el) { scrollToEl(el, -60); return; }
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: reduceMotion() ? 'instant' : 'smooth' });
      return;
    }
    if (reduceMotion()){ commit(to, true); return; }
    setLeaving(true);
    setTimeout(() => { commit(to, true); setLeaving(false); }, 250);
  }, [commit]);

  useEffect(() => { window.__nav = navigate; }, [navigate]);

  useEffect(() => {
    const onPop = () => { setMenuOpen(false); commit(location.pathname + location.hash, false); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [commit]);

  // Smooth scroll — desktop pointers only, and never with reduced motion.
  useEffect(() => {
    if (reduceMotion() || !window.Lenis) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const lenis = new window.Lenis({
      duration: 1.05,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;
    let raf = 0;
    const loop = time => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);

  // Page title + analytics
  useEffect(() => {
    const P = PROFILE();
    const base = P.name || 'Arthur Ottevaere';
    let t = base + ' — Portfolio';
    if (loc.route === 'work' && loc.sub){ const p = projById(loc.sub); t = (p ? p.title : 'Project') + ' · ' + base; }
    else if (loc.route === 'work')    t = 'Projects · ' + base;
    else if (loc.route === 'about')   t = 'About · ' + base;
    else if (loc.route === 'contact') t = 'Contact · ' + base;
    else if (loc.route === '404')     t = 'Not found · ' + base;
    document.title = t;
    if (firstCount.current){ firstCount.current = false; return; }
    const gc = window.goatcounter;
    if (gc && gc.count) gc.count({ path: location.pathname, title: t });
  }, [loc]);

  /* The splash closes into the dot: the orange screen shrinks to exactly the
     dot of the name (or the logo's dot elsewhere), then the hero rises. */
  useEffect(() => {
    const boot = document.getElementById('boot');
    if (!boot){ setReady(true); return; }
    const start = window.__bootStart || performance.now();
    const MIN = 1500;
    let dead = false;
    const wait = ms => new Promise(r => setTimeout(r, ms));

    (async () => {
      try { await Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(2200)]); } catch (e) {}
      await wait(Math.max(0, MIN - (performance.now() - start)));
      if (dead) return;
      if (window.__bootStop) window.__bootStop();

      const finish = () => { boot.remove(); setReady(true); };
      const heroDot = document.getElementById('hero-dot');
      const inView = el => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.top > 0 && r.bottom < window.innerHeight;
      };
      const target = inView(heroDot) ? heroDot : document.querySelector('.nav-logo svg circle');

      if (reduceMotion() || !target || !('clipPath' in boot.style)){
        boot.classList.add('fade');
        setTimeout(finish, 450);
        return;
      }
      const r  = target.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const R  = coverRadius(cx, cy, window.innerWidth, window.innerHeight);
      boot.classList.add('leaving');
      boot.style.clipPath = 'circle(' + R.toFixed(0) + 'px at ' + cx.toFixed(0) + 'px ' + cy.toFixed(0) + 'px)';
      void boot.offsetWidth;                                  // commit the start state
      setTimeout(() => {
        boot.classList.add('closing');
        boot.style.clipPath = 'circle(' + Math.max(4, r.width / 2).toFixed(0) + 'px at ' + cx.toFixed(0) + 'px ' + cy.toFixed(0) + 'px)';
        setTimeout(() => setReady(true), 620);                 // the name rises as it lands
        setTimeout(finish, 1000);
      }, 170);
    })();

    return () => { dead = true; };
  }, []);

  let Page;
  if (loc.route === 'work')         Page = loc.sub ? <ProjectPage id={loc.sub}/> : <Projects/>;
  else if (loc.route === 'about')   Page = <About/>;
  else if (loc.route === 'contact') Page = <Contact/>;
  else if (loc.route === '404')     Page = <NotFound/>;
  else                              Page = <Home ready={ready}/>;

  return (
    <>
      <a className="sr-only" href="#main">Skip to content</a>
      <Progress/>
      <Nav route={loc.route} theme={theme} toggle={toggle} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      <Menu open={menuOpen} route={loc.route} close={() => setMenuOpen(false)} theme={theme} toggle={toggle}/>
      <main id="main" className={'page-wrap' + (leaving ? ' is-leaving' : '')} key={loc.route + '/' + loc.sub}>
        {Page}
      </main>
      <Footer/>
      <ToTop/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
