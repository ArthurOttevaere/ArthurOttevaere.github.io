// =============================================================================
//  app.jsx — the shell around the pages: nav, footer, theme, routing, the
//  smooth-scroll engine, and the hand-off from the boot splash to the site.
//  Routing uses real paths (/work/f1/) through the History API, so every page
//  is shareable and previews correctly; tools/build.mjs writes a small HTML
//  file for each of them.
// =============================================================================

const { useState, useEffect, useLayoutEffect, useCallback, useRef } = React;

const NAV = [
  { label: 'Work',    to: '/work/',    route: 'work' },
  { label: 'About',   to: '/about/',   route: 'about' },
  { label: 'Outside', to: '/outside/', route: 'outside' },
  { label: 'Contact', to: '/contact/', route: 'contact' },
];
// what the nav band shows: Home is a tab of its own, the mark stays the mark
const TABS = [{ label: 'Home', to: '/', route: 'home' }].concat(NAV);
const THEME_KEY = 'ao-theme';

/* ── The strip above the Dynamic Island ────────────────────────────────────
   iOS cannot put page content under the island: it paints that strip with
   <meta name="theme-color">. So the meta follows whatever is actually at the
   top of the screen — orange while the splash or the intro page covers it,
   paper the rest of the time — and the colour runs under the island instead
   of stopping at a rectangle of the wrong colour. */
const TOP_COLOR = { light: ['#F6F4EF', '#FF4A12'], dark: ['#0E0E11', '#FF6E40'] };
let topAccent = !!window.__splash;          // what the top of the screen shows
let topLocked = !!window.__splash;          // …and the splash owns it until it leaves

function paintTop(){
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = TOP_COLOR[dark ? 'dark' : 'light'][topAccent ? 1 : 0];
  if (meta.getAttribute('content') !== next) meta.setAttribute('content', next);
}
// The home scene calls this on every frame; it is ignored until the splash
// lets go, otherwise the first frame at scroll 0 would paint the strip paper
// while the whole screen is still orange.
window.__topAccent = on => { if (!topLocked && !!on !== topAccent){ topAccent = !!on; paintTop(); } };
window.__topUnlock = () => { topLocked = false; topAccent = true; window.__topAccent(false); };

/* ── Theme ─────────────────────────────────────────────────────────────────
   Follows the system by default; the toggle overrides it for the session. */
function useTheme(){
  const system = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const [theme, setTheme] = useState(() => {
    try { return sessionStorage.getItem(THEME_KEY) || system(); } catch (e) { return system(); }
  });
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    paintTop();
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
  // The whole page crossfades as one piece. Left alone, the body would flip at
  // once while the nav took its own .3s to follow.
  const toggle = useCallback(() => {
    const flip = () => setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      try { sessionStorage.setItem(THEME_KEY, next); } catch (e) {}
      return next;
    });
    if (!document.startViewTransition || reduceMotion()){ flip(); return; }
    const root = document.documentElement;
    root.classList.add('theme-shift');
    const vt = document.startViewTransition(() => ReactDOM.flushSync(flip));
    vt.ready.catch(() => {});
    vt.finished.catch(() => {}).then(() => root.classList.remove('theme-shift'));
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
      <span className={'cv-pop' + (open ? ' open' : '')} role="menu" aria-hidden={!open}>
        {links.map(c => (
          <a key={c.lang} href={c.href} target="_blank" rel="noopener noreferrer" role="menuitem"
             tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            <span className="lang mono">{c.lang.toUpperCase()}</span><span>{c.label}</span>
          </a>
        ))}
      </span>
    </span>
  );
}

/* ── Nav ───────────────────────────────────────────────────────────────── */
// A detached band that stays put: the tabs on the left, the mark in the
// middle, the CV on the right. The selection is drawn with Archivo's width
// axis — the page you are on is set wide, the one under the pointer opens,
// the rest stay condensed — so the nav speaks the same type as the hero.
// On a phone the tabs give way to the orange dot, which floods the screen
// into the menu (Menu below).
function Nav({ route, theme, toggle, menuOpen, setMenuOpen }){
  const toggleMenu = e => {
    // the flood grows out of the burger, so the menu needs to know where it is
    // and how far it has to reach to cover the farthest corner
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const far = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
    const s = document.documentElement.style;
    s.setProperty('--dot-x', cx.toFixed(1) + 'px');
    s.setProperty('--dot-y', cy.toFixed(1) + 'px');
    s.setProperty('--flood', (far / 20 * 1.04).toFixed(2));
    setMenuOpen(o => !o);
  };
  return (
    <header className={'nav' + (menuOpen ? ' menu-on' : '')}>
      <nav className="nav-links" aria-label="Primary">
        {TABS.map(n => (
          <Link key={n.route} to={n.to} className={'nav-link' + (route === n.route ? ' on' : '')}
                aria-current={route === n.route ? 'page' : undefined}>
            {n.label}
          </Link>
        ))}
      </nav>
      <Link to="/" className="nav-logo" aria-label="Home"><Icon.Logo/></Link>
      <span className="nav-right">
        <ThemeButton theme={theme} toggle={toggle}/>
        <CvButton/>
        <button type="button" className="nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen} onClick={toggleMenu}>
          {/* three bars: each one's outer span slides, its inner one turns,
              so the closing and the opening can run in two beats */}
          <span className="ln" aria-hidden="true"><i/></span>
          <span className="ln" aria-hidden="true"><i/></span>
          <span className="ln" aria-hidden="true"><i/></span>
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
    // the screen turns orange, so the strip under the Dynamic Island does too
    const was = topAccent;
    topAccent = true; paintTop();
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
      topAccent = was; paintTop();
    };
  }, [open, close]);
  return (
    <div className={'menu' + (open ? ' open' : '')} aria-hidden={!open}>
      <span className="menu-flood" aria-hidden="true"/>
      <div className="menu-body">
      {TABS.map((n, i) => (
        <Link key={n.route} to={n.to} className={'menu-link' + (route === n.route ? ' on' : '')}
              style={{ '--i': i }} tabIndex={open ? 0 : -1} onClick={close}
              aria-current={route === n.route ? 'page' : undefined}>
          <span className="n">{String(i + 1).padStart(2, '0')}</span><span className="lbl">{n.label}</span>
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
                {isMail && copied ? <Icon.Check className="draw"/> : <Glyph/>}
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
// The addresses already seen since this page load. A page stages itself in
// full once; after that it only has to show up (see `.is-again`, `.is-back`).
const seen = new Set();

// Where you were on each history entry, so going back puts you there again. It
// lives in memory on purpose: a reload forgets it and starts at the top, where
// the splash needs the dot of the name to be.
const scrollAt = new Map();
const newEntry = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
let entry = (history.state && history.state.id) || newEntry();
history.replaceState(Object.assign({}, history.state, { id: entry }), '');
let here = location.pathname;

const coverOf = path => document.querySelector('a.pcard[href="' + path + '"] .pcard-media');

function App(){
  const [theme, toggle] = useTheme();
  const [loc, setLoc]   = useState(() => { seen.add(location.pathname); return parsePath(location.pathname); });
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const firstCount = useRef(true);

  const commit = useCallback((to, push, grown) => {
    const url = new URL(to, location.origin);
    scrollAt.set(entry, window.scrollY);
    if (push){
      entry = newEntry();
      history.pushState({ id: entry }, '', url.pathname + url.search + url.hash);
    } else {
      entry = (history.state && history.state.id) || newEntry();
    }
    here = url.pathname;
    const visit = !push ? 'back' : seen.has(url.pathname) ? 'again' : '';
    const saved = push ? 0 : scrollAt.get(entry) || 0;
    seen.add(url.pathname);
    setLoc(Object.assign(parsePath(url.pathname), { visit, saved, grown }));
    if (push){
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    if (url.hash && !saved){
      setTimeout(() => { const el = document.querySelector(url.hash); if (el) scrollToEl(el, -60); }, 140);
    }
  }, []);

  // Back where you were, before the page paints. A page that measures itself
  // after mounting (About's timeline) is not tall enough yet on the first try.
  useLayoutEffect(() => {
    if (loc.visit !== 'back') return;
    jumpTo(loc.saved);
    let tries = 0, raf = 0;
    const settle = () => {
      if (Math.abs(window.scrollY - loc.saved) < 2 || ++tries > 40) return;
      jumpTo(loc.saved);
      raf = requestAnimationFrame(settle);
    };
    raf = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(raf);
  }, [loc]);

  const navigate = useCallback((to, card) => {
    setMenuOpen(false);
    const url = new URL(to, location.origin);
    if (url.pathname === location.pathname){
      const el = url.hash ? document.querySelector(url.hash) : null;
      if (el) { scrollToEl(el, -60); return; }
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: reduceMotion() ? 'instant' : 'smooth' });
      return;
    }
    // Mount the destination on the click; CSS animates it into place. A card
    // goes further: its cover grows into the project's.
    const media = card ? card.querySelector('.pcard-media') : null;
    fly(() => commit(to, true, !!media), media, () => document.querySelector('.pp-cover'));
  }, [commit]);

  useEffect(() => { window.__nav = navigate; }, [navigate]);

  // index.html asks the browser not to restore the old scroll position on a
  // reload; this is the safety net for the ones that do it anyway. It runs
  // before the smooth-scroll engine is built, so nothing fights over it.
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const onPop = e => {
      setMenuOpen(false);
      const left = here;
      const update = () => commit(location.pathname + location.hash, false);
      // A swipe back on iOS has already slid the page across under the finger,
      // and playing a morph on top of it would show the same move twice.
      const native = e.hasUAVisualTransition === undefined
        ? window.matchMedia('(pointer: coarse)').matches
        : e.hasUAVisualTransition;
      if (native || location.pathname === left){ update(); return; }
      const from = document.querySelector('.pp-cover') || coverOf(location.pathname);
      fly(update, from, () => coverOf(left) || document.querySelector('.pp-cover'));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [commit]);

  // Smooth scroll — desktop pointers only, and never with reduced motion.
  useEffect(() => {
    if (reduceMotion() || !window.Lenis) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const lenis = new window.Lenis({
      lerp: .14,
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
    else if (loc.route === 'outside') t = 'Outside · ' + base;
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
    if (!boot){ setReady(true); window.__topUnlock(); return; }
    const start = window.__bootStart || performance.now();
    // The greeting sequence is the point of the splash, so it always plays in
    // full — a fast load waits for it rather than cutting it in half.
    const MIN = window.__bootHold || 600;
    let dead = false;
    const wait = ms => new Promise(r => setTimeout(r, ms));

    (async () => {
      try { await Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(900)]); } catch (e) {}
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
        window.__topUnlock();
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
        window.__topUnlock();                 // the top of the screen turns to paper
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
  else if (loc.route === 'outside') Page = <Outside/>;
  else if (loc.route === 'contact') Page = <Contact/>;
  else if (loc.route === '404')     Page = <NotFound/>;
  else                              Page = <Home ready={ready}/>;

  return (
    <>
      <a className="sr-only" href="#main">Skip to content</a>
      <Progress/>
      <Nav route={loc.route} theme={theme} toggle={toggle} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      <Menu open={menuOpen} route={loc.route} close={() => setMenuOpen(false)} theme={theme} toggle={toggle}/>
      <main id="main" className={'page-wrap' + (loc.route === 'home' ? ' page-home' : '') + (loc.visit ? ' is-' + loc.visit : '') + (loc.grown ? ' is-grown' : '')} key={loc.route + '/' + loc.sub}>
        {Page}
      </main>
      <Footer/>
      <ToTop/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
