// =============================================================================
//  work.jsx — the projects index (/work/) and one page per project
//  (/work/<id>/). Everything on a project page is optional: a project with
//  only the required fields in data.js still gets a complete page, and each
//  block simply disappears when its field is empty.
// =============================================================================

const { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } = React;

/* ── Index ─────────────────────────────────────────────────────────────── */
function Projects(){
  const projects = PROJS();
  const rootRef  = useRef(null);
  const cats = useMemo(() => ['All'].concat(Array.from(new Set(projects.map(p => p.cat)))), [projects]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort]     = useState('desc');

  const list = useMemo(() => {
    const l = (filter === 'All' ? projects.slice() : projects.filter(p => p.cat === filter));
    l.sort((a, b) => sort === 'desc' ? projDateKey(b) - projDateKey(a) : projDateKey(a) - projDateKey(b));
    // The pinned project leads the default order; asking for oldest first is
    // asking for a date order, so it stops jumping the queue then.
    if (sort === 'desc'){
      const fi = l.findIndex(p => p.featured);
      if (fi > 0) l.unshift(l.splice(fi, 1)[0]);
    }
    return l;
  }, [filter, sort, projects]);

  // A filter is pressed again and again, so it does not stage anything: the
  // cards stay in place, keep their images, and the grid only fades across.
  const gridRef = useRef(null);
  const filtered = useRef(false);
  useLayoutEffect(() => {
    if (!filtered.current){ filtered.current = true; return; }
    const grid = gridRef.current;
    if (!grid) return;
    settleReveals(grid);
    grid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
  }, [filter, sort]);

  useReveals(rootRef, [filter, sort]);

  // The dot belongs to the row, not to a filter, so it can travel between them
  // the way the nav's pill does. It takes its place before it learns to move.
  const filtersRef = useRef(null);
  const dotRef = useRef(null);
  useLayoutEffect(() => {
    const box = filtersRef.current, dot = dotRef.current;
    if (!box || !dot) return;
    const place = () => {
      const on = box.querySelector('.filter.on');
      if (on) dot.style.transform = 'translate(' + on.offsetLeft + 'px,' + (on.offsetTop + on.offsetHeight / 2) + 'px)';
    };
    place();
    const ro = new ResizeObserver(place);           // a wrap, or the font landing
    box.querySelectorAll('.filter').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, [filter]);
  useEffect(() => {
    const id = requestAnimationFrame(() => { if (dotRef.current) dotRef.current.classList.add('live'); });
    return () => cancelAnimationFrame(id);
  }, []);

  const count = c => c === 'All' ? projects.length : projects.filter(p => p.cat === c).length;

  return (
    <div className="page" ref={rootRef}>
      <div className="shell">
        <header className="page-head">
          <span className="eyebrow rv rv-fade">Selected work · {projectYears()}</span>
          <Words as="h1" className="page-title" text="Projects" dot/>
          <p className="lede rv rv-up" style={{ '--d': '.1s' }}>{COPY('workLede', 'A mix of coursework and weekend builds. Each one is a small bet on a tool I wanted to get fluent in.')}</p>
        </header>

        <div className="work-bar">
          <div className="filters" ref={filtersRef}>
            <span className="filter-dot" ref={dotRef} aria-hidden="true"/>
            {cats.map(c => (
              <button key={c} type="button" aria-pressed={filter === c}
                      className={'filter' + (filter === c ? ' on' : '')}
                      onClick={() => setFilter(c)}>
                {c} <span className="n">{count(c)}</span>
              </button>
            ))}
          </div>
          <button type="button" className={'sort' + (sort === 'asc' ? ' asc' : '')}
                  onClick={() => setSort(s => s === 'desc' ? 'asc' : 'desc')}
                  aria-label={sort === 'desc' ? 'Sorted newest first — switch to oldest first' : 'Sorted oldest first — switch to newest first'}>
            {sort === 'desc' ? 'Newest first' : 'Oldest first'} <Icon.ArrowDown/>
          </button>
        </div>

        {list.length === 0
          ? <p className="empty">Nothing in this bucket yet.</p>
          : (
            <div className="work-grid" ref={gridRef}>
              {list.map((p, i) => (
                <ProjectCard key={p.id} p={p} size="sm" delay={(i % 3) * .07} flag={p.featured} eager={i < 3}/>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

/* ── One project ───────────────────────────────────────────────────────── */
function ProjectPage({ id }){
  const p = projById(id);
  const rootRef = useRef(null);
  useReveals(rootRef, [id]);
  if (!p) return <NotFound/>;

  const sections = projSections(p);
  const gallery  = projGallery(p);
  const files    = projAttachments(p);
  const skills   = projSkills(p);
  const links    = projLinks(p);

  return (
    <article className="page" ref={rootRef}>
      <header className="shell pp-head">
        <Link to="/work/" className="back"><Icon.Arrow/> All projects</Link>
        <div className="pp-eyebrow"><span className="eyebrow rv rv-fade">{p.cat} · {projDateLabel(p)}</span></div>
        <Words as="h1" className="pp-title" text={p.title} dot/>
        {p.subtitle ? <p className="pp-sub rv rv-up">{p.subtitle}</p> : null}

        <div className="pp-intro">
          <p className="pp-lead rv rv-up">{p.summary}</p>
          {links.length ? (
            <div className="pp-links rv rv-up" style={{ '--d': '.08s' }}>
              {links.map((l, i) => <ProjectLink key={i} url={l.url} label={l.label} btn/>)}
            </div>
          ) : null}
        </div>

        <div className="pp-cover rv rv-media">
          <CoverArt cover={p.cover} title={p.title} eager priority
                    sizes="(max-width:1376px) calc(100vw - 2 * clamp(24px,4.6vw,48px)), 1184px"/>
        </div>
      </header>

      <div className="shell pp-body">
        <Rail p={p}/>
        <div className="pp-content">
          {sections.map((s, i) => <Section key={i} s={s} n={i + 1}/>)}
          {gallery.length ? <Gallery items={gallery} n={sections.length + 1} title={p.galleryTitle}/> : null}
          {files.length ? (
            <Attachments items={files} title={p.attachmentsTitle}
                         n={sections.length + (gallery.length ? 1 : 0) + 1}/>
          ) : null}
        </div>
      </div>

      {skills.length ? <Takeaways items={skills}/> : null}
      <Outro p={p}/>
    </article>
  );
}

// Small link that knows what it points at (GitHub, Notion, anything else).
function ProjectLink({ url, label, btn }){
  const k = linkKind(url);
  if (!k) return null;
  const Glyph = Icon[k.icon] || Icon.ArrowUR;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className={btn ? 'btn btn-line btn-sm' : 'link-arrow'}
       onClick={e => e.stopPropagation()}>
      <Glyph/> <span>{label || k.label}</span>
    </a>
  );
}

// The spec sheet, sticky beside the text.
function Rail({ p }){
  const rows = [
    ['Context',  p.context || p.cat],
    ['Role',     p.role],
    ['Team',     p.team],
    ['Duration', p.duration],
    ['Date',     projDateLabel(p)],
  ].filter(r => r[1]);
  const tools = Array.isArray(p.tags) ? p.tags : [];
  const links = projLinks(p);
  return (
    <aside className="rail rv rv-fade">
      <dl className="facts">
        {rows.map(([k, v]) => (
          <div className="fact" key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      {tools.length ? (
        <div className="rail-block">
          <div className="rail-h">Built with</div>
          <ul className="tools">{tools.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      ) : null}
      {links.length ? (
        <div className="rail-block">
          <div className="rail-h">Links</div>
          <div className="rail-links">{links.map((l, i) => <ProjectLink key={i} url={l.url} label={l.label} btn/>)}</div>
        </div>
      ) : null}
    </aside>
  );
}

// A body section. `body` entries are a string (paragraph) or one of
// { h: "…" } · { list: […] } · { quote: "…" } — real structure, no HTML in data.js.
function Section({ s, n }){
  const body = Array.isArray(s.body) ? s.body : (s.body ? [s.body] : []);
  const list = Array.isArray(s.list) ? s.list : [];
  const bullets = (items, key) => (
    <ul key={key}>{items.map((t, j) => <li key={j}><span>{t}</span></li>)}</ul>
  );
  return (
    <section className="sec rv rv-up">
      <div className="sec-n">{String(n).padStart(2, '0')}</div>
      {s.title ? <h2 className="sec-h">{s.title}</h2> : null}
      <div className="prose">
        {body.map((b, i) => {
          if (typeof b === 'string')      return <p key={i}>{b}</p>;
          if (b && b.h)                   return <h3 key={i}>{b.h}</h3>;
          if (b && Array.isArray(b.list)) return bullets(b.list, i);
          if (b && b.quote)               return <blockquote className="quote" key={i}>{b.quote}</blockquote>;
          return null;
        })}
        {list.length ? bullets(list, 'l') : null}
      </div>
    </section>
  );
}

/* ── Gallery — the images, stacked and big; click one to open it full screen
   No carousel: nothing is hidden behind an arrow, and the page reads as one
   column of evidence under the text. Portrait shots keep a sane width. ─── */
function Gallery({ items, n, title }){
  const [zoom, setZoom] = useState(-1);
  const [thumb, setThumb] = useState(null);
  const closing = useRef(false);
  const fit = e => {
    const img = e.currentTarget, fig = img.closest('.shot');
    if (fig && img.naturalHeight > img.naturalWidth * 1.02) fig.classList.add('is-tall');
  };
  const frame = i => document.querySelectorAll('.shot-frame')[i];
  // The screenshot on the page opens into the lightbox, and is shown behind the
  // full-size file until that lands, so the picture never goes blank mid-gesture.
  const open = (i, e) => {
    const img = e.currentTarget.querySelector('img');
    closing.current = false;
    morph(() => { setThumb({ i, src: img.currentSrc || img.src }); setZoom(i); },
          e.currentTarget, () => document.querySelector('.lb img'));
  };
  // …and closes onto the one you ended on, wherever that is on the page.
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    morph(() => setZoom(-1), document.querySelector('.lb img'), () => {
      const el = frame(zoom);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) jumpTo(window.scrollY + r.top - (window.innerHeight - r.height) / 2);
      return el;
    });
  }, [zoom]);
  return (
    <section className="sec rv rv-up">
      <div className="sec-n">{String(n).padStart(2, '0')}</div>
      <h2 className="sec-h">{title || 'Results'}</h2>
      <div className="shots">
        {items.map((g, i) => (
          <figure className="shot" key={i}>
            <button type="button" className="shot-frame" onClick={e => open(i, e)}
                    aria-label={'Open image ' + (i + 1) + ' full screen'}>
              <Img src={g.src} alt={g.caption || ''} onLoad={fit} eager={i < 2}
                   sizes="(max-width:900px) calc(100vw - 2 * clamp(24px,4.6vw,48px)), 860px"/>
            </button>
            <figcaption className="shot-cap">
              <span className="shot-n">{String(i + 1).padStart(2, '0')}</span>
              {g.caption ? <span>{g.caption}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
      {zoom >= 0 ? <Lightbox items={items} index={zoom} thumb={thumb} onIndex={setZoom} onClose={close}/> : null}
    </section>
  );
}

/* A finger on the lightbox: sideways changes the picture, down puts it away.
   It works on the element directly, a frame at a time, with no React in the
   loop. A quick flick counts as much as a long drag (velocity in px/ms, Emil
   Kowalski's .11), the first and last pictures resist instead of stopping dead,
   and a second finger or a zoomed page hands the gesture back to the browser. */
function useLightboxGestures(rootRef, figRef, scrimRef, { index, count, onIndex, onClose }){
  useEffect(() => {
    const lb = rootRef.current, fig = figRef.current, scrim = scrimRef.current;
    if (!lb || !fig) return;
    let id = null, axis = '', x0 = 0, y0 = 0, t0 = 0, dx = 0, dy = 0, busy = false;
    const settle = (transform, ms, then) => {
      fig.style.transition = reduceMotion() ? 'none' : 'transform ' + ms + 'ms var(--ease-pill)';
      fig.style.transform = transform;
      if (then) setTimeout(then, reduceMotion() ? 0 : ms);
    };
    const release = () => { settle('', 280); scrim.style.transition = ''; scrim.style.opacity = ''; };
    const down = e => {
      if (e.pointerType === 'mouse' || id !== null || busy || e.target.closest('button')) return;
      if (window.visualViewport && window.visualViewport.scale > 1.01) return;
      id = e.pointerId; axis = ''; dx = dy = 0;
      x0 = e.clientX; y0 = e.clientY; t0 = performance.now();
      fig.style.transition = scrim.style.transition = 'none';       // the finger leads
    };
    const move = e => {
      if (e.pointerId !== id) return;
      dx = e.clientX - x0; dy = e.clientY - y0;
      if (!axis){
        if (Math.hypot(dx, dy) < 8) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        lb.setPointerCapture(id);
      }
      if (axis === 'x'){
        const edge = (dx > 0 && index === 0) || (dx < 0 && index === count - 1);
        fig.style.transform = 'translateX(' + (edge ? dx * .25 : dx) + 'px)';
      } else {
        const d = dy > 0 ? dy : dy * .25, pull = Math.max(d, 0);
        fig.style.transform = 'translateY(' + d + 'px) scale(' + (1 - Math.min(pull / 1600, .12)) + ')';
        scrim.style.opacity = 1 - Math.min(pull / 420, .7);
      }
    };
    const up = e => {
      if (e.pointerId !== id) return;
      id = null;
      if (!axis) return;
      const moved = axis === 'x' ? dx : dy;
      const fast = Math.abs(moved) / Math.max(1, performance.now() - t0) > .11;
      if (e.type === 'pointercancel'){ release(); return; }
      if (axis === 'y'){
        if (dy > 0 && (dy > 120 || fast)) onClose(); else release();
        return;
      }
      const dir = dx < 0 ? 1 : -1, next = index + dir, w = lb.clientWidth;
      if (next < 0 || next >= count || !(Math.abs(dx) > w * .25 || fast)){ release(); return; }
      busy = true;
      settle('translateX(' + (-dir * w) + 'px)', 180, () => {
        fig.style.transition = 'none';
        fig.style.transform = 'translateX(' + (dir * w * .3) + 'px)';
        ReactDOM.flushSync(() => onIndex(next));
        void fig.offsetWidth;                                  // commit the start state
        settle('', 280);
      });
    };
    lb.addEventListener('pointerdown', down);
    lb.addEventListener('pointermove', move);
    lb.addEventListener('pointerup', up);
    lb.addEventListener('pointercancel', up);
    return () => {
      lb.removeEventListener('pointerdown', down);
      lb.removeEventListener('pointermove', move);
      lb.removeEventListener('pointerup', up);
      lb.removeEventListener('pointercancel', up);
    };
  }, [index, count, onIndex, onClose]);
}

// Portalled to <body> so it escapes any transformed ancestor.
function Lightbox({ items, index, thumb, onIndex, onClose }){
  const rootRef = useRef(null), figRef = useRef(null), scrimRef = useRef(null), closeRef = useRef(null);
  useLightboxGestures(rootRef, figRef, scrimRef, { index, count: items.length, onIndex, onClose });

  // A dialog takes the focus with it and gives it back. preventScroll, because
  // the page underneath must not move: the close already handles where it lands.
  useEffect(() => {
    const before = document.activeElement;
    closeRef.current.focus({ preventScroll: true });
    return () => { if (before && before.focus) before.focus({ preventScroll: true }); };
  }, []);

  // The neighbours are fetched ahead, so a swipe lands on a picture.
  useEffect(() => {
    [index - 1, index + 1].forEach(i => {
      const g = items[i], set = g ? imgSet(g.src) : null;
      if (!g) return;
      const next = new Image();
      next.sizes = '100vw';
      if (set) next.srcset = set.srcset;
      next.src = g.src;
    });
  }, [index, items]);

  useEffect(() => {
    function onKey(e){
      if (e.key === 'Escape')     onClose();
      if (e.key === 'Tab'){
        // the page behind is out of reach while this is open
        const stops = Array.from(rootRef.current.querySelectorAll('button:not(:disabled)'));
        const at = stops.indexOf(document.activeElement);
        e.preventDefault();
        stops[(at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
      }
      if (e.key === 'ArrowRight') onIndex(Math.min(index + 1, items.length - 1));
      if (e.key === 'ArrowLeft')  onIndex(Math.max(index - 1, 0));
    }
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (window.__lenis) window.__lenis.start();
    };
  }, [index, items.length, onIndex, onClose]);

  const g = items[index];
  if (!g) return null;
  return ReactDOM.createPortal((
    <div className="lb" ref={rootRef} role="dialog" aria-modal="true" aria-label={g.caption || 'Image'} onMouseDown={onClose}>
      <div className="lb-scrim" ref={scrimRef} aria-hidden="true"/>
      <button type="button" className="lb-close" ref={closeRef} onClick={onClose} aria-label="Close"><Icon.Close/></button>
      <figure ref={figRef} onMouseDown={e => e.stopPropagation()}>
        <Img key={g.src} src={g.src} alt={g.caption || ''} eager priority sizes="100vw"
             style={thumb && thumb.i === index ? { background: 'center / cover url("' + thumb.src + '")' } : undefined}/>
        {g.caption ? <figcaption>{g.caption}</figcaption> : null}
      </figure>
      {items.length > 1 ? (
        <div className="lb-nav" onMouseDown={e => e.stopPropagation()}>
          <button type="button" disabled={index === 0} onClick={() => onIndex(Math.max(index - 1, 0))} aria-label="Previous image">
            <Icon.Arrow style={{ transform: 'rotate(180deg)' }}/>
          </button>
          <span className="mono">{index + 1} / {items.length}</span>
          <button type="button" disabled={index === items.length - 1} onClick={() => onIndex(Math.min(index + 1, items.length - 1))} aria-label="Next image">
            <Icon.Arrow/>
          </button>
        </div>
      ) : null}
    </div>
  ), document.body);
}

/* ── The files that come with the project ──────────────────────────────── */
function Attachments({ items, n, title }){
  return (
    <section className="sec rv rv-up">
      <div className="sec-n">{String(n).padStart(2, '0')}</div>
      <h2 className="sec-h">{title || 'Attachments'}</h2>
      <div className="rows">
        {items.map((a, i) => {
          const Glyph = Icon[a.icon] || Icon.FileLink;
          return (
            <a className="row" key={i} href={a.url} target="_blank" rel="noopener noreferrer"
               aria-label={'Open ' + a.label + ' (' + a.kind + ')'}>
              <span className="row-ico"><Glyph/></span>
              <span className="row-text">
                <span className="row-label">{a.label}</span>
                {a.note ? <span className="row-note">{a.note}</span> : null}
              </span>
              <span className="row-kind">{a.kind}</span>
              {a.local ? <Icon.Download className="row-go dl"/> : <Icon.ArrowUR className="row-go"/>}
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* ── What I took away — the last piece of content, in its own panel so it
   never reads as part of the navigation that follows it. ──────────────── */
function Takeaways({ items }){
  return (
    <section className="takeaways">
      <div className="shell">
        <div className="take-panel rv rv-up">
          <h2 className="take-h">What I took away<span className="dot"/></h2>
          <div className="take-grid">
            {items.map((s, i) => (
              <div className="take" key={i}>
                <span className="take-name">{s.name}</span>
                {s.note ? <span className="take-note">{s.note}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── The way out — pure navigation: a quiet way back, and one big invitation
   to the next project. Nothing here is content, and it should look it. ── */
function Outro({ p }){
  const all  = PROJS().slice().sort((a, b) => projDateKey(b) - projDateKey(a));
  const idx  = all.findIndex(x => x.id === p.id);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  return (
    <section className="shell">
      <nav className="pnav" aria-label="More projects">
        <Link to="/work/" className="pnav-back"><Icon.Arrow/> All projects</Link>
        {next && next.id !== p.id ? (
          <Link to={projectPath(next.id)} className="pnav-next" aria-label={'Next project: ' + next.title}>
            <span className="pnav-media"><CoverArt cover={next.cover} title={next.title} sizes="148px"/></span>
            <span className="pnav-text">
              <span className="eyebrow">Next project</span>
              <span className="pnav-t">{splitTitle(next)[0]}</span>
              <span className="pnav-m">{next.cat} · {projDateLabel(next)}</span>
            </span>
            <span className="pnav-go" aria-hidden="true"><Icon.Arrow/></span>
          </Link>
        ) : null}
      </nav>
    </section>
  );
}

/* ── Nothing here ──────────────────────────────────────────────────────── */
function NotFound(){
  return (
    <div className="page nf">
      <div className="nf-in shell">
        <span className="eyebrow">404</span>
        <h1 className="sec-title">Nothing at this address<span className="dot"/></h1>
        <p className="lede" style={{ margin: '0 auto' }}>The link is broken, or the page moved. The projects are all still there.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <Link to="/" className="btn btn-ink">Home <Icon.Arrow/></Link>
          <Link to="/work/" className="btn btn-line">See the work</Link>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Projects, ProjectPage, ProjectLink, NotFound });
