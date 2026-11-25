// =============================================================================
//  contact.jsx — "Let's talk": the same block closes the home page and fills
//  the /contact/ page. Messages go to the Formspree endpoint set in data.js;
//  with no endpoint it stays in demo mode and just confirms.
//
//  Send folds the card into a letter, seals it in a cream envelope, and the
//  seal flies off to become the full stop of the title (sendLetter, below).
//
//  The block borrows from a messaging app without turning into one: the dot
//  of the title opens now and then into a "typing…" bubble, a two-line thread
//  sits in the empty space under the lede, and the form reads as a message
//  being written (To, About, then From and the message in one composer).
// =============================================================================

const { useState, useRef, useEffect } = React;

// The dot of "Let's talk." opens into a typing bubble: once, shortly after the
// title has landed, then again on hover and every so often while it is on
// screen. The thread appears after that first beat.
function useTyping(dotRef, titleRef, onFirst){
  useEffect(() => {
    const dot = dotRef.current, title = titleRef.current;
    if (!dot || !title) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    let seen = false, started = false;

    const type = (ms) => {
      if (reduce || dot.classList.contains('typing') || dot.classList.contains('busy')) return;
      dot.classList.add('typing');
      later(() => dot.classList.remove('typing'), ms);
    };

    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (!seen || started) return;
      started = true;
      if (reduce){ onFirst(); return; }
      later(() => type(2400), 1100);
      later(onFirst, 3700);
    }, { threshold: 0.4 });
    io.observe(title);

    const every = setInterval(() => { if (seen && !document.hidden) type(2000); }, 11000);
    const hover = () => type(1800);
    title.addEventListener('mouseenter', hover);

    return () => {
      io.disconnect();
      clearInterval(every);
      timers.forEach(clearTimeout);
      title.removeEventListener('mouseenter', hover);
      dot.classList.remove('typing');
    };
  }, []);
}

// =============================================================================
//  The letter. Pressing Send turns the card into paper (it spreads from the
//  button), folds it in half, and a cream envelope rises into the space the
//  card leaves. The letter slips in, the flap closes, an orange wax seal with
//  the "a." lands on the tip. Once the message is really sent, the envelope
//  folds into the seal and the seal flies off to become the full stop of
//  "Let's talk.", which opens for a second into a "Sent" bubble.
//
//  It is plain DOM + Web Animations, built on top of the form and removed when
//  it is done. Every move of the first part is handed to the browser at once
//  with its own delay, so nothing waits on a JS timer and nothing can drift.
//  No SVG filters (WebKit paints filtered layers black for a frame): shadows
//  are offset copies of each shape.
// =============================================================================

const LT_IO = 'cubic-bezier(.65,0,.35,1)';
const LT_SPRING = 'linear(0,0.0893,0.2855,0.5079,0.7084,0.8646,0.9714,1.034,1.0624,1.0678,1.0597,1.0456,1.0306,1.0175,1.0075,1.0009,0.9971,0.9956,0.9954,0.9961,0.9971,0.9981,0.999,0.9996,1,1.0002,1.0003,1.0003,1.0003,1.0002,1.0001,1.0001,1)';
let ltUid = 0;

const ltEl = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const ltSvg = (w, h, inner, cls) => { const d = ltEl('div'); d.innerHTML = `<svg class="${cls}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${inner}</svg>`; return d.firstChild; };
const ltPos = (n, x, y, w, h) => { n.style.left = x + 'px'; n.style.top = y + 'px'; if (w != null) n.style.width = w + 'px'; if (h != null) n.style.height = h + 'px'; return n; };
const ltEsc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ltRel = (a, b) => { const r = a.getBoundingClientRect(), s = b.getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }; };
// fill forwards, and persist(): WebKit drops a finished, filling animation once a
// later one touches the same property, and the element jumps back
const ltA = (node, kf, o = {}) => {
  const a = node.animate(kf, { fill: 'forwards', easing: 'linear', duration: 300, ...o });
  if ((o.fill || 'forwards') !== 'none' && a.persist) a.persist();
  return a;
};

// a closed polygon whose corners are rounded by r (a quadratic through the corner)
function ltRound(pts){
  const n = pts.length, cut = (P, Q, r) => {
    const dx = Q[0] - P[0], dy = Q[1] - P[1], k = Math.min(r / Math.hypot(dx, dy), .5);
    return (P[0] + dx * k).toFixed(2) + ',' + (P[1] + dy * k).toFixed(2);
  };
  return pts.map(([x, y, r], i) => {
    const m = i ? 'L' : 'M';
    if (!r) return m + x.toFixed(2) + ',' + y.toFixed(2);
    return m + cut([x, y], pts[(i - 1 + n) % n], r) + ` Q${x.toFixed(2)},${y.toFixed(2)} ` + cut([x, y], pts[(i + 1) % n], r);
  }).join('') + 'Z';
}

// the paper: the message set as a letter, cut into two panels that fold
function ltSheet(host, w, h, d){
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const body = top => `<div class="ltr" style="top:${top}px;height:${h}px">
      <div class="ltr-top"><span class="ltr-k">To</span>Arthur Ottevaere<span class="ltr-date">${date}</span></div>
      <div class="ltr-re"><span class="ltr-k">Re</span>${ltEsc(d.topic)}</div>
      <p class="ltr-body">${ltEsc(d.msg)}</p>
      <div class="ltr-sign"><span class="ltr-k">From</span>${ltEsc(d.email)}<i></i></div></div>`;
  const s = ltPos(ltEl('div', 'ltr-sheet'), 0, 0, w, h), inner = ltEl('div', 'ltr-in'), panels = [];
  [0, 1].forEach(i => {
    const p = ltEl('div', 'ltr-panel'); p.style.top = i * h / 2 + 'px'; p.style.height = h / 2 + 'px'; p.style.zIndex = i + 1;
    const back = ltEl('div', 'ltr-face ltr-fb', body(-i * h / 2)), front = ltEl('div', 'ltr-face ltr-fa', body(-i * h / 2)), shade = ltEl('i', 'ltr-shade');
    p.append(back, front, shade); inner.append(p); panels.push({ p, front, shade });
  });
  s.append(inner); host.append(s);
  return { s, inner, panels };
}

// a cream paper envelope: rounded flaps, square-ish corners at the hinge
function ltEnvelope(host, x, y, W, H){
  const id = 'lte' + (++ltUid), FH = Math.round(H * .6), R = 12, RT = 3;
  const box    = ltRound([[0, 0, RT], [W, 0, RT], [W, H, R], [0, H, R]]);
  const left   = ltRound([[-2, -2, 0], [W * .41, H * .5, 30], [-2, H + 2, 0]]);
  const right  = ltRound([[W + 2, -2, 0], [W * .59, H * .5, 30], [W + 2, H + 2, 0]]);
  const bottom = ltRound([[-2, H + 2, 0], [W * .3, H * .45, 34], [W * .7, H * .45, 34], [W + 2, H + 2, 0]]);
  const flapP  = ltRound([[0, 0, 0], [W, 0, 0], [W / 2, FH, W * .14]]);
  const shade = (d, dx, dy, o) => [[.45, 1], [1, .62], [1.8, .34], [2.8, .16]]
    .map(([k, a]) => `<path d="${d}" fill="#5C3F14" fill-opacity="${(o * a).toFixed(3)}" transform="translate(${(dx * k).toFixed(2)},${(dy * k).toFixed(2)})"/>`).join('');
  const lg = (n, a, b, dir = 'x1="0" y1="0" x2="0" y2="1"') => `<linearGradient id="${id}${n}" ${dir}><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const H2 = 'x1="0" y1="0" x2="1" y2="0"';
  const defs = `<defs>${lg('b', '#E2CBA4', '#EAD9BC')}${lg('h', 'rgba(92,63,20,.14)', 'rgba(92,63,20,0)')}
    ${lg('l', '#F7EEE2', '#F1E5D3', H2)}${lg('r', '#F2E6D5', '#EADBC4', H2)}${lg('m', '#EEDFCA', '#F6EDE0')}
    ${lg('i', '#E2CBA4', '#ECDBBD')}${lg('o', '#F4E9D9', '#ECDDC7')}<clipPath id="${id}c"><path d="${box}"/></clipPath></defs>`;
  const env = ltEl('div', 'ltr-env');
  const cast = ltPos(ltEl('div', 'ltr-cast'), x, y, W, H);
  const back = ltPos(ltSvg(W, H, `${defs}<path d="${box}" fill="url(#${id}b)"/>
      <rect width="${W}" height="10" fill="url(#${id}h)" clip-path="url(#${id}c)"/>`, 'ltr-back'), x, y);
  const front = ltPos(ltSvg(W, H, `<g clip-path="url(#${id}c)">
      ${shade(left, 2.4, .4, .075)}<path d="${left}" fill="url(#${id}l)"/>
      ${shade(right, -2.4, .4, .075)}<path d="${right}" fill="url(#${id}r)"/>
      <path d="${left}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".8"/>
      <path d="${right}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>
      ${shade(bottom, 0, -2.4, .085)}<path d="${bottom}" fill="url(#${id}m)"/>
      <path d="${bottom}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/></g>`, 'ltr-front'), x, y);
  const flap = ltPos(ltSvg(W, FH, `
      <g class="in" clip-path="url(#${id}c)"><path d="${flapP}" fill="url(#${id}i)"/>
        <path d="${ltRound([[W * .1, 0, 0], [W * .9, 0, 0], [W / 2, FH * .84, W * .12]])}" fill="#fff" fill-opacity=".12"/></g>
      <g class="out" clip-path="url(#${id}c)">${shade(flapP, 0, 2.6, .1)}<path d="${flapP}" fill="url(#${id}o)"/>
        <path d="${flapP}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".9"/></g>`, 'ltr-flap'), x, y);
  const pieces = [cast, back, front, flap];
  // drawn ahead as their own layers, not seen yet
  pieces.forEach(n => { n.style.opacity = .001; n.style.willChange = 'transform, opacity'; });
  env.append(...pieces); host.append(env);
  return { env, cast, back, front, flap, pieces, FH };
}

// the logo pressed into orange wax: an uneven rim, a ring, "a." debossed
function ltSeal(){
  const id = 'lts' + (++ltUid), pts = [];
  for (let i = 0; i < 96; i++){
    const t = i / 96 * Math.PI * 2, r = 27.4 + 1.5 * Math.sin(5 * t + 1) + Math.sin(9 * t + 2.3) + .6 * Math.sin(14 * t + .4);
    pts.push((32 + r * Math.cos(t)).toFixed(2) + ',' + (32 + r * Math.sin(t)).toFixed(2));
  }
  const blob = `M${pts.join('L')}Z`;
  const glyph = (dx, dy, fill, o) => `<g transform="translate(${dx},${dy})" fill="${fill}" fill-opacity="${o}">
      <text x="30.2" y="40.2" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="26" letter-spacing="-1">a</text>
      <circle cx="40.6" cy="37.8" r="2.7"/></g>`;
  return ltEl('div', 'ltr-seal', `<div class="ltr-si"><svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><defs>
      <radialGradient id="${id}g" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="#FF8F5C"/><stop offset=".5" stop-color="#F65316"/><stop offset="1" stop-color="#C83A08"/></radialGradient></defs>
    ${[[.6, .2], [1.4, .13], [2.4, .07]].map(([k, a]) => `<path d="${blob}" fill="#4A1C00" fill-opacity="${a}" transform="translate(0,${k})"/>`).join('')}
    <path d="${blob}" fill="url(#${id}g)"/>
    <circle cx="32" cy="32" r="20.5" fill="none" stroke="#A8300A" stroke-opacity=".5" stroke-width="1.3"/>
    <circle cx="32.5" cy="32.7" r="20.5" fill="none" stroke="#FFC9AC" stroke-opacity=".38" stroke-width=".8"/>
    ${glyph(.65, .65, '#FFC3A3', .55)}${glyph(-.55, -.55, '#8E2603', .6)}${glyph(0, 0, '#EC4A0F', 1)}
    <circle class="flat" cx="32" cy="32" r="27.6" style="fill:var(--accent)" opacity="0"/></svg></div>`);
}

// Plays the whole thing. `sent` is the request, resolving to true or false: the
// envelope waits for it, sealed, before it leaves. Resolves to that same answer
// once the form is back. stop() cuts it short (unmount).
function sendLetter({ wrap, form, send, dot, data, sent }){
  let alive = true;
  const added = [];
  const keep = n => (added.push(n), n);
  const cleanup = () => {
    added.forEach(n => n.remove());
    form.style.visibility = '';
    dot.style.visibility = '';
    dot.classList.remove('busy', 'sent');
  };
  const done = (async () => {
    dot.classList.remove('typing');
    dot.classList.add('busy');
    const W = form.offsetWidth, H = form.offsetHeight;
    const EW = Math.min(440, Math.round(W * .84)), sc = (EW * .86) / W, hl = (H / 2) * sc;
    const EH = Math.round(Math.max(EW / 1.82, hl + 42));
    const ex = (W - EW) / 2, ey = Math.max(H - EH - 8, H / 2 + 16);   // clear of the folded half
    const sb = ltRel(send, form);

    const { s, inner, panels } = ltSheet(wrap, W, H, data); keep(s);
    const E = ltEnvelope(wrap, ex, ey, EW, EH); keep(E.env);

    // 1 · paper. It spreads from the button, then folds while it is still spreading.
    const T = { fold: 440, rise: 820, entry: 1160 }, ENTRY = 1000;
    T.flap = T.entry + ENTRY * .6;
    const cx = sb.x + sb.w / 2, cy0 = sb.y + sb.h / 2;
    const R = Math.hypot(Math.max(cx, W - cx), Math.max(cy0, H - cy0)) + 4;
    const wipe = ltA(s, [{ clipPath: `circle(0px at ${cx}px ${cy0}px)` }, { clipPath: `circle(${R}px at ${cx}px ${cy0}px)` }], { duration: 560, easing: LT_IO });
    wipe.finished.then(() => { s.style.clipPath = 'none'; wipe.cancel(); if (alive) form.style.visibility = 'hidden'; });
    const { p, front, shade } = panels[1];
    p.style.transformOrigin = '50% 0';
    const fo = { duration: 860, delay: T.fold, easing: LT_IO };
    ltA(front, [{ opacity: 1 }, { opacity: 1, offset: .5 }, { opacity: 0, offset: .5 }, { opacity: 0 }], fo);
    ltA(shade, [{ opacity: 0 }, { opacity: .32, offset: .5 }, { opacity: .05 }], fo);
    ltA(p, [{ transform: 'perspective(1800px) rotateX(0deg)' }, { transform: 'perspective(1800px) rotateX(179.9deg)' }], fo);

    // 2 · the envelope rises from just below. The pieces fade fast, before they
    // overlap anything; the shadow on the page comes in after them.
    const fades = [E.back, E.front, E.flap].map(n => ltA(n, [{ opacity: .001 }, { opacity: 1 }], { duration: 220, delay: T.rise, easing: 'ease-out', fill: 'both' }));
    const castIn = ltA(E.cast, [{ opacity: .001 }, { opacity: 1 }], { duration: 600, delay: T.rise + 160, easing: 'ease-out', fill: 'both' });
    const RISE = { duration: 1000, delay: T.rise, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' };
    const ups = [[E.cast, ''], [E.back, ''], [E.front, ''], [E.flap, ' perspective(1000px) rotateX(180deg)']]
      .map(([n, tf]) => ltA(n, [{ transform: `translateY(46px)${tf}` }, { transform: `translateY(0px)${tf}` }], RISE));
    Promise.all([...fades, ...ups, castIn].map(a => a.finished)).then(() => {
      E.pieces.forEach(n => { n.style.opacity = ''; n.style.willChange = 'auto'; });
      [...fades, ...ups, castIn].forEach(a => a.cancel());
    });

    // 3 · the letter glides in: it shrinks early on one layer (narrower than the
    // envelope before it reaches the opening) and travels on the other
    inner.style.transformOrigin = '50% 25%';
    const inside = ey + EH - 12 - hl / 2 - H / 4;
    ltA(inner, [{ transform: 'none' }, { transform: `scale(${sc})` }], { duration: ENTRY * .8, delay: T.entry, easing: 'cubic-bezier(.25,.6,.2,1)' });
    ltA(s, [{ transform: 'none' }, { transform: `translateY(${inside}px)` }], { duration: ENTRY, delay: T.entry, easing: 'cubic-bezier(.45,0,.25,1)' });

    // 4 · the flap closes while the letter is still settling
    const fl = { duration: 640, delay: T.flap, easing: LT_IO };
    ltA(E.flap.querySelector('.in'), [{ opacity: 1 }, { opacity: 1, offset: .5 }, { opacity: 0, offset: .5 }, { opacity: 0 }], fl);
    ltA(E.flap.querySelector('.out'), [{ opacity: 0 }, { opacity: 0, offset: .5 }, { opacity: 1, offset: .5 }, { opacity: 1 }], fl);
    await ltA(E.flap, [
      { transform: 'perspective(1000px) rotateX(180deg)', zIndex: 0 },
      { zIndex: 0, offset: .5 }, { zIndex: 5, offset: .5 },
      { transform: 'perspective(1000px) rotateX(0deg)', zIndex: 5 }], fl).finished;
    if (!alive) return false;
    s.style.visibility = 'hidden';

    // 5 · the seal drops onto the tip and gives a little
    const seal = keep(ltSeal()), scx = ex + EW / 2, scy = ey + E.FH - 6;
    ltPos(seal, scx - 32, scy - 32); wrap.append(seal);
    await ltA(seal, [
      { opacity: 0, transform: 'translateY(-22px) scale(1.55)', easing: 'cubic-bezier(.55,0,1,.45)' },
      { opacity: 1, transform: 'scale(.9,.84)', offset: .5, easing: 'cubic-bezier(.2,.7,.3,1)' },
      { opacity: 1, transform: 'scale(1.04,1.03)', offset: .78, easing: 'ease-in-out' },
      { opacity: 1, transform: 'none' }], { duration: 560 }).finished;
    ltA(E.env, [{ transform: 'none' }, { transform: 'translateY(1.5px)' }, { transform: 'none' }], { duration: 260, easing: 'ease-out', fill: 'none' });

    // sealed: now it waits for the real answer
    const [ok] = await Promise.all([sent, new Promise(r => setTimeout(r, 480))]);
    if (!alive) return false;

    if (!ok){
      // not sent: the envelope fades, the form comes back with the message intact
      ltA(seal, [{ opacity: 1 }, { opacity: 0 }], { duration: 260 });
      await ltA(E.env, [{ opacity: 1 }, { opacity: 0 }], { duration: 260 }).finished;
      cleanup();
      return false;
    }

    // 6 · the envelope folds into the seal, which stays put and swells a little…
    const si = seal.querySelector('.ltr-si'), flat = seal.querySelector('.flat');
    E.env.style.transformOrigin = `${scx}px ${scy}px`;
    ltA(si, [{ transform: 'none' }, { transform: 'scale(1.1)', offset: .7 }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(.4,0,.4,1)', fill: 'none' });
    await ltA(E.env, [
      { transform: 'none', opacity: 1 },
      { transform: 'scale(.18)', opacity: 1, offset: .78 },
      { transform: 'scale(.04)', opacity: 0 }], { duration: 560, easing: 'cubic-bezier(.6,0,.4,1)' }).finished;
    if (!alive) return true;

    // 7 · …then flies alone to the full stop. X and Y on two nested layers, each
    // with its own easing: one continuous curve, landing on the dot from above.
    // If the title is off screen (a phone scrolled down), it just pops instead.
    const dr = ltRel(dot, wrap), vr = dot.getBoundingClientRect();
    const onScreen = vr.bottom > 0 && vr.top < window.innerHeight;
    if (onScreen){
      const tx = dr.x + dr.w / 2 - scx, ty = dr.y + dr.h / 2 - scy, k = dr.w / 55.2, F = 820;
      dot.style.visibility = 'hidden';
      ltA(seal, [{ transform: 'none' }, { transform: `translateX(${tx}px)` }], { duration: F, easing: 'cubic-bezier(.45,0,.3,1)' });
      ltA(flat, [{ opacity: 0 }, { opacity: 0, offset: .45 }, { opacity: 1 }], { duration: F, easing: 'ease-in' });
      await ltA(si, [{ transform: 'none' }, { transform: `translateY(${ty}px) scale(${k})` }], { duration: F, easing: 'cubic-bezier(.3,0,.25,1.16)' }).finished;
      if (!alive) return true;
      seal.style.visibility = 'hidden';
      dot.style.visibility = '';
      await ltA(dot, [{ transform: 'scale(1.16,.86)' }, { transform: 'none' }], { duration: 420, easing: LT_SPRING, fill: 'none' }).finished;
      dot.classList.add('sent');
      await new Promise(r => setTimeout(r, 1700));
      dot.classList.remove('sent');
    } else {
      await ltA(si, [{ transform: 'none' }, { transform: 'scale(1.15)', offset: .3 }, { transform: 'scale(0)' }], { duration: 420, easing: 'cubic-bezier(.4,0,.6,1)' }).finished;
    }
    if (!alive) return true;
    cleanup();
    form.classList.add('again');
    form.addEventListener('animationend', () => form.classList.remove('again'), { once: true });
    return true;
  })();
  return { done, stop(){ alive = false; cleanup(); } };
}

function ContactBlock({ page }){
  const P = PROFILE();
  const [topic, setTopic]     = useState('Internship');
  const [email, setEmail]     = useState('');
  const [msg, setMsg]         = useState('');
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState(false);
  const [left, setLeft]       = useState(false);   // the email field has been left once
  const [tried, setTried]     = useState(false);   // Send was pressed too early
  const [thread, setThread]   = useState(false);   // the little conversation is shown
  const timer    = useRef(null);
  const emailRef = useRef(null);
  const msgRef   = useRef(null);
  const dotRef   = useRef(null);
  const titleRef = useRef(null);
  const formRef  = useRef(null);
  const wrapRef  = useRef(null);
  const sendRef  = useRef(null);
  const letter   = useRef(null);
  useEffect(() => () => letter.current && letter.current.stop(), []);

  useTyping(dotRef, titleRef, () => setThread(true));

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSend    = validEmail && msg.trim().length > 6;
  const endpoint   = P.formspree && P.formspree !== '#' ? P.formspree : null;
  const hasMail    = P.email && P.email !== '#';

  // What stands between this form and being sent, in one sentence. Send never
  // just refuses: an email is judged once you have left the field, and the rest
  // when you press the button.
  const badEmail = !!email && !validEmail && (left || tried);
  const hint = badEmail ? 'That email looks incomplete.'
    : !tried || canSend ? null
    : !email ? 'Add your email so I can reply.'
    : 'Add a few more words first.';

  async function send(e){
    e.preventDefault();
    if (sending) return;
    if (!canSend){
      setTried(true);
      (validEmail ? msgRef : emailRef).current.focus();
      return;
    }
    setError(false);
    const post = () => endpoint
      ? fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email, topic, message: msg, _subject: 'Portfolio · ' + topic + ' — ' + email }),
        }).then(r => r.ok, () => false)
      : Promise.resolve(true);                  // demo mode

    // The letter: everything but reduced motion. The request leaves at once; the
    // sealed envelope waits for its answer before it flies off.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && wrapRef.current && dotRef.current && formRef.current.animate){
      setSending(true);
      setTried(false);
      if (document.activeElement) document.activeElement.blur();   // the phone keyboard goes away
      letter.current = sendLetter({
        wrap: wrapRef.current, form: formRef.current, send: sendRef.current, dot: dotRef.current,
        data: { topic, email, msg }, sent: post(),
      });
      const ok = await letter.current.done;
      letter.current = null;
      setSending(false);
      if (ok){ setEmail(''); setMsg(''); setLeft(false); } else setError(true);
      return;
    }

    const done = () => {
      setSent(true);
      setTried(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { setSent(false); setEmail(''); setMsg(''); setLeft(false); }, 3600);
    };
    if (!endpoint){ done(); return; }          // demo mode
    setSending(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, topic, message: msg, _subject: 'Portfolio · ' + topic + ' — ' + email }),
      });
      setSending(false);
      if (res.ok) done(); else setError(true);
    } catch (_){
      setSending(false);
      setError(true);
    }
  }

  const socials = [
    { id: 'linkedin', label: 'LinkedIn', href: P.linkedin, ext: true,  Glyph: Icon.Linkedin },
    { id: 'github',   label: 'GitHub',   href: P.github,   ext: true,  Glyph: Icon.Github },
    { id: 'mail',     label: 'Email',    href: hasMail ? 'mailto:' + P.email : null, ext: false, Glyph: Icon.Mail },
  ].filter(s => s.href && s.href !== '#');

  const typingDots = <><span className="ty" aria-hidden="true"><i/><i/><i/></span><span className="snt" aria-hidden="true">Sent</span></>;

  return (
    <section className={'contact' + (page ? ' as-page' : '')} id="contact">
      <div className="shell">
        <div className="contact-grid">
          <div className="contact-l">
            <span className="eyebrow rv rv-fade">Get in touch</span>
            <div ref={titleRef}>
              <Words as={page ? 'h1' : 'h2'} className="contact-title" text="Let's talk" dot
                     dotRef={dotRef} dotKids={typingDots}/>
            </div>
            <p className="rv rv-up" style={{ '--d': '.08s' }}>
              {COPY('contactLede', 'Internships, freelance, coffee chats — all welcome. Usually reply within a day.')}
            </p>

            <div className={'thread' + (thread ? ' on' : '')} aria-hidden="true">
              <span className="bub bub-in"  style={{ '--t': '0s' }}>Hey Arthur, free for a coffee next week?</span>
              <span className="bub bub-out" style={{ '--t': '.55s' }}>Always. Tuesday?</span>
              <span className="bub-read"    style={{ '--t': '.95s' }}><b>Read</b> 09:41</span>
            </div>

            <div className="socials rv rv-up" style={{ '--d': '.14s' }}>
              {socials.map(s => (
                <a key={s.id} className="soc" href={s.href} aria-label={s.label} title={s.label}
                   target={s.ext ? '_blank' : undefined} rel={s.ext ? 'noopener noreferrer' : undefined}>
                  <s.Glyph/>
                </a>
              ))}
            </div>
            {hasMail ? <a className="contact-mail rv rv-fade" href={'mailto:' + P.email}>{P.email}</a> : null}
          </div>

          <div className="form-wrap rv rv-up" style={{ '--d': '.1s' }} ref={wrapRef}>
          <form className="form" onSubmit={send} noValidate ref={formRef}>
            <div className="f-head">
              <span className="f-av" aria-hidden="true">a<i/></span>
              <span className="f-to"><span className="f-k">To</span>{P.name || 'Arthur Ottevaere'}</span>
            </div>

            <div className="f-row">
              <span className="f-k" aria-hidden="true">About</span>
              <div className="topics" role="group" aria-label="What is it about?">
                {['Internship', 'Freelance', 'Coffee chat', 'Other'].map(t => (
                  <button key={t} type="button" aria-pressed={topic === t}
                          className={'topic' + (topic === t ? ' on' : '')}
                          onClick={() => setTopic(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="compose">
              <label className="c-from">
                <span className="f-k">From</span>
                <input className="c-in" type="email" name="email" required placeholder="you@somewhere.com"
                       aria-label="Your email"
                       ref={emailRef} autoComplete="email" autoCapitalize="none" autoCorrect="off"
                       spellCheck={false} enterKeyHint="next" aria-invalid={badEmail || undefined}
                       value={email} onChange={e => { setEmail(e.target.value); setTried(false); }}
                       onBlur={() => setLeft(!!email)}
                       onKeyDown={e => {
                         if (e.key !== 'Enter') return;
                         e.preventDefault();
                         if (validEmail) msgRef.current.focus(); else setLeft(true);
                       }}/>
              </label>
              <textarea className="c-msg" name="message" rows="5" maxLength={600} required ref={msgRef}
                        aria-label="Message"
                        placeholder="Hey Arthur, we're looking for a summer analytics intern at..."
                        value={msg} onChange={e => { setMsg(e.target.value); setTried(false); }}/>
              <div className="c-foot">
                <span className={'count' + (msg.length > 520 ? ' near' : '')}>{msg.length} / 600</span>
                <button type="submit" ref={sendRef} className={'send' + (sent ? ' sent' : canSend ? ' ready' : '')}
                        disabled={sent || sending}
                        aria-disabled={!canSend && !sent ? 'true' : undefined}>
                  <span className="send-label" key={sent ? 'sent' : sending ? 'sending' : 'send'}>
                    {sent ? <><Icon.Check className="draw"/> Sent — talk soon</> : sending ? 'Sending…' : <>Send <Icon.ArrowUR/></>}
                  </span>
                </button>
              </div>
            </div>

            {error ? (
              <p className="form-err" role="alert">Something went wrong — email me directly at {P.email}.</p>
            ) : (
              <p className={'form-note' + (hint ? ' is-hint' : '')} role="status">
                {hint || 'No newsletter, no forwarding. Just me reading it.'}
              </p>
            )}
          </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact(){
  const ref = useRef(null);
  useReveals(ref, []);
  return <div className="page" ref={ref}><ContactBlock page/></div>;
}

Object.assign(window, { ContactBlock, Contact });
