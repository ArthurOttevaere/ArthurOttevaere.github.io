// =============================================================================
//  outside.jsx — the half of the person the portfolio doesn't cover: the races,
//  the map of where I've been, and the two teams I can't be objective about.
//
//  Everything here is driven by `profile.outside` in data.js and every field is
//  optional, because the content arrives in pieces — a race exists before its
//  photo does, and a race I've entered exists before it has a time. So no block
//  here renders a placeholder: a missing field removes its own line, and a race
//  with no photograph gets a typographic panel rather than a grey box.
// =============================================================================

const { useState, useEffect, useMemo, useRef } = React;

const OUTSIDE = () => PROFILE().outside || {};
// px² on the map below which a country cannot be aimed at as itself and needs
// its pointer target widened. Luxembourg is 1.4; Belgium, at 28, is fine.
const TINY = 20;
const countryName = c => (typeof c === 'string' ? c : (c && c.name) || '');

/* The continent each country belongs to — used only for the figure beside the
   map. It is deliberately fragile in the safe direction: if data.js names a
   country that is missing from this table, the continent count hides itself
   instead of quietly being wrong. Add a line when you add a country. */
const CONTINENT = {
  'Austria': 'Europe', 'Belgium': 'Europe', 'Czechia': 'Europe',
  'France': 'Europe', 'Germany': 'Europe', 'Greece': 'Europe',
  'Hungary': 'Europe', 'Italy': 'Europe', 'Luxembourg': 'Europe',
  'Netherlands': 'Europe', 'Russia': 'Europe', 'Slovenia': 'Europe',
  'Spain': 'Europe', 'Switzerland': 'Europe', 'United Kingdom': 'Europe',
  'Turkey': 'Europe',            // the Istanbul side — say 'Asia' if you'd rather
  'Mexico': 'America', 'United States of America': 'America',
};

/* ── Pace ──────────────────────────────────────────────────────────────────
   A time on its own is a fact; a time next to its pace is a performance you
   can actually picture. Since the pace follows from the distance and the
   clock, it is computed rather than typed — one less thing to keep true. */
const DISTANCES = { '5k': 5000, '10k': 10000, '10 miles': 16093.4, 'half marathon': 21097.5, 'marathon': 42195 };

function metres(label){
  const key = String(label || '').trim().toLowerCase();
  if (DISTANCES[key]) return DISTANCES[key];
  const km = key.match(/([\d.]+)\s*km/);
  if (km) return parseFloat(km[1]) * 1000;
  const k = key.match(/(?:^|[^\d])([\d.]+)\s*k$/);
  return k ? parseFloat(k[1]) * 1000 : 0;
}

function seconds(time){
  const parts = String(time || '').trim().split(':');
  if (!parts.length || parts.some(x => x === '' || isNaN(Number(x)))) return 0;
  return parts.reduce((acc, x) => acc * 60 + Number(x), 0);
}

function pace(distance, time){
  const m = metres(distance), s = seconds(time);
  if (!m || !s) return '';
  const per = s / (m / 1000);
  let mm = Math.floor(per / 60), ss = Math.round(per % 60);
  if (ss === 60){ mm += 1; ss = 0; }
  return mm + ':' + String(ss).padStart(2, '0');
}

function Outside(){
  const ref = useRef(null);
  const narrow = useMedia('(max-width: 720px)');
  useReveals(ref, [narrow]);
  return (
    <div className="page" ref={ref}>
      <OutsideIntro/>
      <Races/>
      <Atlas/>
      <Supports/>
      <div className="shell"><OutsideOut/></div>
    </div>
  );
}

/* ── The masthead ──────────────────────────────────────────────────────────
   The page's own name, one sentence, and then the records — which are on
   purpose the quietest thing here. A board of personal bests would make this
   a results page; a single hairline row makes them something you pass on the
   way to the races themselves. */
function OutsideIntro(){
  const pbs = (OUTSIDE().pbs || []).filter(p => p && p.distance && p.time);
  return (
    <section className="shell">
      <header className="page-head">
        <span className="eyebrow rv rv-fade">Off the clock</span>
        <Words as="h1" className="page-title" text="Outside" dot/>
        <p className="lede rv rv-up" style={{ '--d': '.1s' }}>
          {COPY('outsideLede', "Away from the spreadsheets. The races I've run, the places I've been, and the two teams I can't be objective about.")}
        </p>
      </header>

      {pbs.length ? (
        <div className="pbs rv rv-up" style={{ '--d': '.18s', '--pbn': pbs.length }}>
          <span className="pbs-k">Personal bests</span>
          <dl className="pbs-list">
            {pbs.map((p, i) => {
              const per = pace(p.distance, p.time);
              return (
                <div className="pb" key={i}>
                  <dt>{p.distance}</dt>
                  <dd>
                    <span className="pb-t tabular">{p.time}</span>
                    {per ? <span className="pb-p"><span className="tabular">{per}</span> /km</span> : null}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ) : null}
    </section>
  );
}

/* ── The races ─────────────────────────────────────────────────────────────
   Newest first — but only for the ones that have a date. Anything still
   waiting for one keeps the order it has in data.js and sits after the dated
   ones, so filling a date in is all it takes to move a card into place. */
const raceTime = r => { const d = parseProjDate(r.date); return d ? d.getTime() : null; };

function sortRaces(list){
  const dated = [], undated = [];
  list.forEach(r => (raceTime(r) === null ? undated : dated).push(r));
  dated.sort((a, b) => raceTime(b) - raceTime(a));
  return dated.concat(undated);
}

function Races(){
  const races = useMemo(() => sortRaces((OUTSIDE().races || []).filter(r => r && r.name)), []);
  if (!races.length) return null;
  return (
    <section className="ot-sec">
      <div className="shell">
        <header className="sec-head">
          <div>
            <span className="eyebrow rv rv-fade">Running</span>
            <Words as="h2" className="sec-title" text="Races so far" dot/>
          </div>
        </header>
        <div className="race-grid">
          {races.map((r, i) => <RaceCard key={i} r={r} i={i}/>)}
        </div>
      </div>
    </section>
  );
}

// Two grid columns wide, so the browser only ever needs a half-width copy.
const RACE_SIZES = '(max-width:720px) calc(100vw - 2 * clamp(24px,4.6vw,48px)), (max-width:1360px) 46vw, 576px';

function RaceCard({ r, i }){
  const date  = projDateLabel(r);
  const delay = (i % 2) * .09;
  const per   = pace(r.distance, r.time);

  /* What the box holds, in order of preference: the photograph; or the time,
     set huge — which is what the photograph was only ever framing; or, failing
     both, the distance. With none of the three there is no box at all, because
     an empty panel is a placeholder and this site does not ship those. */
  const box = r.photo ? 'photo' : (r.time ? 'time' : (r.distance ? 'distance' : null));
  const meta = (r.distance && box !== 'distance') || date;

  return (
    <article className={'race' + (box ? '' : ' bare')}>
      {box ? (
        <div className="race-media rv rv-media" style={{ '--d': delay + 's' }}>
          {box === 'photo'
            ? <Img src={r.photo} alt={r.name} sizes={RACE_SIZES} eager={i < 2}/>
            : (
              <span className="race-blank">
                {box === 'time' ? <span className="race-blank-t tabular">{r.time}</span>
                                : <span className="race-blank-d">{r.distance}</span>}
                {box === 'time' && per ? <span className="race-blank-p"><span className="tabular">{per}</span> /km</span> : null}
              </span>
            )}
        </div>
      ) : null}

      <div className="race-text rv rv-up" style={{ '--d': (delay + .08) + 's' }}>
        {meta ? (
          <div className="race-meta">
            {r.distance && box !== 'distance' ? <span>{r.distance}</span> : null}
            {date ? <span className="race-date">{date}</span> : null}
          </div>
        ) : null}
        <h3 className="race-n">{r.name}</h3>
        {r.place ? <p className="race-p voice">{r.place}</p> : null}
        {r.note ? <p className="race-note">{r.note}</p> : null}
        {/* the time lands here only when the photograph took the box above,
            with the pace against it — the same pairing as the records row */}
        {box === 'photo' && r.time ? (
          <p className="race-t">
            <span className="tabular">{r.time}</span>
            {per ? <span className="race-pace"><span className="tabular">{per}</span> /km</span> : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/* ── The map ───────────────────────────────────────────────────────────────
   The world is 54 KB of path data — worth it on this page, wasted on every
   other one. So it is not in the bundle: the script is fetched the first time
   this section mounts, and until it lands the frame simply holds its shape. */
function useWorldMap(){
  const [map, setMap] = useState(() => window.WORLD_MAP || null);
  useEffect(() => {
    if (window.WORLD_MAP){ setMap(window.WORLD_MAP); return; }
    let tag = document.getElementById('world-map-src');
    if (!tag){
      tag = document.createElement('script');
      tag.id = 'world-map-src';
      tag.src = '/assets/map/world.js';
      tag.async = true;
      document.head.appendChild(tag);
    }
    const done = () => setMap(window.WORLD_MAP || null);
    tag.addEventListener('load', done);
    return () => tag.removeEventListener('load', done);
  }, []);
  return map;
}

function Atlas(){
  const map = useWorldMap();
  const names = (OUTSIDE().countries || []).map(countryName).filter(Boolean);
  if (!names.length) return null;

  const known = names.every(n => CONTINENT[n]);
  const continents = new Set(names.map(n => CONTINENT[n]).filter(Boolean)).size;

  /* Drawn largest first. Each country carries a transparent twin that is its
     pointer target; for most of them the target is the country's own outline,
     which is exactly right. Only the ones too small to aim at get a widened
     one — a halo on every country would quietly steal the edges of its
     neighbours. Painting small last puts them on top, so where a rescued
     country's halo does cross a border, the one that needed the help wins. */
  const areas = (map && map.areas) || {};
  const drawn = names.filter(n => map && map.shapes[n])
    .sort((a, b) => (areas[b] || 0) - (areas[a] || 0));

  return (
    <section className="ot-sec">
      <div className="shell">
        <header className="sec-head">
          <div>
            <span className="eyebrow rv rv-fade">Where I've been</span>
            <Words as="h2" className="sec-title" text="On the map" dot/>
          </div>
          <dl className="tally rv rv-fade" style={{ '--d': '.12s' }}>
            <div>
              <dt>Countries</dt>
              <dd className="tabular">{names.length}</dd>
            </div>
            {known ? (
              <div>
                <dt>Continents</dt>
                <dd className="tabular">{continents}</dd>
              </div>
            ) : null}
          </dl>
        </header>
      </div>

      {/* The map breaks out of the shell: it is a spread, not a block inside a
          column. Below the shell's own width the formula collapses back to the
          gutter, so a phone still gets its margins. */}
      <figure className="atlas rv rv-up" style={{ aspectRatio: map ? map.w + ' / ' + map.h : '1000 / 423' }}>
        {map ? (
          <svg className="atlas-svg" viewBox={'0 0 ' + map.w + ' ' + map.h}
               role="img" aria-label={'World map, with ' + names.length + ' countries marked'}>
            <path className="atlas-land" d={map.land} fillRule="evenodd"
                  vectorEffect="non-scaling-stroke"/>
            {/* Each country is drawn twice: once painted, once as an invisible
                pointer target wider than the country itself. Repeating the
                outline costs 11 KB of markup across all eighteen — cheap
                enough that it is not worth the <defs>/<use> indirection that
                would save it, and both layers stay plain elements a class can
                style. The target layer must declare a fill: an SVG path
                without one paints black. */}
            {drawn.map(n => {
              const tiny = (areas[n] || 0) < TINY;
              return (
                <g className="atlas-c" key={n}>
                  <title>{n}</title>
                  <path className={'atlas-on' + (tiny ? ' tiny' : '')} d={map.shapes[n]}
                        fillRule="evenodd" vectorEffect="non-scaling-stroke"/>
                  <path className={'atlas-hit' + (tiny ? ' wide' : '')} d={map.shapes[n]}
                        fillRule="evenodd" vectorEffect="non-scaling-stroke"/>
                </g>
              );
            })}
          </svg>
        ) : null}
        <figcaption className="sr-only">{names.join(', ')}.</figcaption>
      </figure>
    </section>
  );
}

/* ── The allegiances ───────────────────────────────────────────────────────
   A list, read as a list. Two entries do not need two sections. */
/* `fit` picks between filling the circle and sitting whole inside it. Only
   "cover" means fill — anything else means fit — rather than matching the word
   "contain" exactly, so a near miss in data.js ("fit", "whole") lands on the
   behaviour a crest wants instead of silently cropping it. */
function Supports(){
  const items = (OUTSIDE().supports || []).filter(s => s && s.name);
  if (!items.length) return null;
  return (
    <section className="ot-sec">
      <div className="shell">
        <header className="sec-head">
          <div>
            <span className="eyebrow rv rv-fade">Not objective about</span>
            <Words as="h2" className="sec-title" text="Who I support" dot/>
          </div>
        </header>
        <div className="rows sup-rows rv rv-up" style={{ '--d': '.08s' }}>
          {items.map((s, i) => {
            const Glyph = Icon[s.icon] || Icon.Dot;
            return (
              <div className="row" key={i}>
                {s.image
                  ? <span className={'sup-av' + (s.fit && s.fit !== 'cover' ? ' mark' : '')}>
                      <Img src={s.image} alt={s.name} sizes="64px"/>
                    </span>
                  : <span className="row-ico"><Glyph/></span>}
                <span className="row-text">
                  <span className="row-label">{s.name}</span>
                  {s.note ? <span className="row-note">{s.note}</span> : null}
                </span>
                {s.kind ? <span className="row-kind">{s.kind}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// The way out of a page is a real destination, not a footnote.
function OutsideOut(){
  return (
    <Link to="/about/" className="all-work rv rv-up">
      <span className="all-work-text">
        <span className="all-work-k">Back to the day job</span>
        <span className="all-work-t">The path, the toolkit, the person</span>
      </span>
      <span className="all-work-go" aria-hidden="true"><Icon.ArrowUR/></span>
    </Link>
  );
}

Object.assign(window, { Outside });
