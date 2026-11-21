// =============================================================================
//  contact.jsx — "Let's talk": the same block closes the home page and fills
//  the /contact/ page. Messages go to the Formspree endpoint set in data.js;
//  with no endpoint it stays in demo mode and just confirms.
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
      if (reduce || dot.classList.contains('typing')) return;
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

  const typingDots = <span className="ty" aria-hidden="true"><i/><i/><i/></span>;

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

          <form className="form rv rv-up" style={{ '--d': '.1s' }} onSubmit={send} noValidate>
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
                <button type="submit" className={'send' + (sent ? ' sent' : canSend ? ' ready' : '')}
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
    </section>
  );
}

function Contact(){
  const ref = useRef(null);
  useReveals(ref, []);
  return <div className="page" ref={ref}><ContactBlock page/></div>;
}

Object.assign(window, { ContactBlock, Contact });
