// =============================================================================
//  contact.jsx — "Let's talk": the same block closes the home page and fills
//  the /contact/ page. Messages go to the Formspree endpoint set in data.js;
//  with no endpoint it stays in demo mode and just confirms.
// =============================================================================

const { useState, useRef } = React;

function ContactBlock({ page }){
  const P = PROFILE();
  const [topic, setTopic]     = useState('Internship');
  const [email, setEmail]     = useState('');
  const [msg, setMsg]         = useState('');
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState(false);
  const timer = useRef(null);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSend    = validEmail && msg.trim().length > 6;
  const endpoint   = P.formspree && P.formspree !== '#' ? P.formspree : null;
  const hasMail    = P.email && P.email !== '#';

  async function send(e){
    e.preventDefault();
    if (!canSend || sending) return;
    setError(false);
    const done = () => {
      setSent(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { setSent(false); setEmail(''); setMsg(''); }, 3600);
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

  return (
    <section className={'contact' + (page ? ' as-page' : '')} id="contact">
      <div className="shell">
        <div className="contact-grid">
          <div className="contact-l">
            <span className="eyebrow rv rv-fade">Get in touch</span>
            <Words as={page ? 'h1' : 'h2'} className="contact-title" text="Let's talk" dot/>
            <p className="rv rv-up" style={{ '--d': '.08s' }}>
              {COPY('contactLede', 'Internships, freelance, coffee chats — all welcome. Usually reply within a day.')}
            </p>
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

          <form className="form rv rv-up" style={{ '--d': '.1s' }} onSubmit={send}>
            <div className="topics" role="group" aria-label="What is it about?">
              {['Internship', 'Freelance', 'Coffee chat', 'Other'].map(t => (
                <button key={t} type="button" aria-pressed={topic === t}
                        className={'topic' + (topic === t ? ' on' : '')}
                        onClick={() => setTopic(t)}>{t}</button>
              ))}
            </div>

            <label className="field">
              <span className="field-label">Your email</span>
              <input className="input" type="email" required placeholder="you@somewhere.com"
                     value={email} onChange={e => setEmail(e.target.value)}/>
            </label>

            <label className="field">
              <span className="field-top">
                <span className="field-label">Message</span>
                <span className="count">{msg.length} / 600</span>
              </span>
              <textarea className="input" rows="5" maxLength={600} required
                        placeholder="Hey Arthur — we're looking for a summer analytics intern at..."
                        value={msg} onChange={e => setMsg(e.target.value)}/>
            </label>

            <button type="submit" className={'send' + (sent ? ' sent' : '')} disabled={!canSend || sent || sending}>
              {sent ? <><Icon.Check/> Sent — talk soon</> : sending ? 'Sending…' : <>Send <Icon.ArrowUR/></>}
            </button>

            {error ? (
              <p className="form-err">Something went wrong — email me directly at {P.email}.</p>
            ) : (
              <p className="form-note">No newsletter, no forwarding. Just me reading it.</p>
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
