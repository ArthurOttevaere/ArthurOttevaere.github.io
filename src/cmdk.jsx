// Command palette — opened with ⌘K / Ctrl+K from anywhere on the site.

const { useState, useEffect, useMemo, useRef, useCallback } = React;

function CommandPalette({ go, theme, setTheme }) {
  const [open, setOpen]   = useState(false);
  const [q, setQ]         = useState('');
  const [sel, setSel]     = useState(0);
  const inputRef          = useRef(null);
  const listRef           = useRef(null);

  const D       = window.PORTFOLIO_DATA || {};
  const PROFILE = D.profile  || {};
  const PROJS   = D.projects || [];

  const commands = useMemo(() => [
    { id:'nav-home',    label:'Go to Home',     icon:'→', kbd:'H', group:'Navigate', run:()=>go('home')    },
    { id:'nav-work',    label:'Go to Projects', icon:'→', kbd:'P', group:'Navigate', run:()=>go('work')    },
    { id:'nav-about',   label:'Go to About',    icon:'→', kbd:'A', group:'Navigate', run:()=>go('about')   },
    { id:'nav-contact', label:'Go to Contact',  icon:'→', kbd:'C', group:'Navigate', run:()=>go('contact') },
    {
      id:'act-theme',
      label: theme==='dark' ? 'Switch to light mode' : 'Switch to dark mode',
      icon:'◐', group:'Actions',
      run:()=>setTheme(theme==='dark'?'light':'dark'),
    },
    { id:'act-cv',    label:'Download CV',    icon:'↓', group:'Actions', run:()=>{ if(PROFILE.cv&&PROFILE.cv!=='#') window.open(PROFILE.cv,'_blank'); } },
    { id:'act-email', label:'Send an email',  icon:'@', group:'Actions', run:()=>go('contact') },
    ...PROJS.map(p=>({
      id:'proj-'+p.id,
      label:'Open — '+p.title,
      icon:'◆',
      group:'Projects',
      run:()=>{ p.github&&p.github!=='#' ? window.open(p.github,'_blank','noopener,noreferrer') : go('work'); },
    })),
    { id:'ext-linkedin', label:'Open LinkedIn', icon:'in', group:'External', run:()=>{ if(PROFILE.linkedin&&PROFILE.linkedin!=='#') window.open(PROFILE.linkedin,'_blank','noopener,noreferrer'); } },
    { id:'ext-github',   label:'Open GitHub',   icon:'gh', group:'External', run:()=>{ if(PROFILE.github&&PROFILE.github!=='#')   window.open(PROFILE.github,  '_blank','noopener,noreferrer'); } },
  ], [go, theme, setTheme, PROJS, PROFILE]);

  const filtered = useMemo(()=>{
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter(c=>c.label.toLowerCase().includes(s)||c.group.toLowerCase().includes(s));
  }, [q, commands]);

  const close       = useCallback(()=>setOpen(false), []);
  const openPalette = useCallback(()=>setOpen(true),  []);

  useEffect(()=>{
    window.__openCmdk = openPalette;
    function onKey(e) {
      const k = e.key.toLowerCase();
      if ((e.metaKey||e.ctrlKey)&&k==='k') { e.preventDefault(); setOpen(o=>!o); }
      else if (e.key==='Escape') setOpen(o=>o?false:o);
    }
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  }, [openPalette]);

  useEffect(()=>{
    if (open) {
      setQ(''); setSel(0);
      setTimeout(()=>inputRef.current&&inputRef.current.focus(), 10);
    }
  }, [open]);

  useEffect(()=>{
    if (sel>=filtered.length) setSel(Math.max(0,filtered.length-1));
  }, [filtered.length, sel]);

  useEffect(()=>{
    if (!open||!listRef.current) return;
    const el = listRef.current.querySelector('.cmdk-mod-item.sel');
    if (el&&el.scrollIntoView) {
      const list=listRef.current, r=el.getBoundingClientRect(), lr=list.getBoundingClientRect();
      if (r.top<lr.top) list.scrollTop-=(lr.top-r.top)+8;
      else if (r.bottom>lr.bottom) list.scrollTop+=(r.bottom-lr.bottom)+8;
    }
  }, [sel, open]);

  function exec(c) { setOpen(false); setTimeout(()=>c.run&&c.run(), 60); }

  function onListKey(e) {
    if (e.key==='ArrowDown') { e.preventDefault(); setSel(s=>Math.min(filtered.length-1,s+1)); }
    else if (e.key==='ArrowUp') { e.preventDefault(); setSel(s=>Math.max(0,s-1)); }
    else if (e.key==='Enter') { e.preventDefault(); if (filtered[sel]) exec(filtered[sel]); }
    else if (e.key==='Escape') { e.preventDefault(); setOpen(false); }
  }

  if (!open) return null;
  return (
    <div className="cmdk-back" onMouseDown={close}>
      <div className="cmdk-modal" onMouseDown={(e)=>e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-mod-input"
          placeholder="Type a command, page or project…"
          value={q}
          onChange={(e)=>{ setQ(e.target.value); setSel(0); }}
          onKeyDown={onListKey}
        />
        <div className="cmdk-mod-list" ref={listRef}>
          {filtered.length===0
            ? <div className="cmdk-empty">No match for "{q}"</div>
            : filtered.map((c,i)=>(
                <div
                  key={c.id}
                  className={'cmdk-mod-item'+(i===sel?' sel':'')}
                  onMouseEnter={()=>setSel(i)}
                  onClick={()=>exec(c)}
                >
                  <span className="cmdk-mod-icon">{c.icon}</span>
                  <span className="cmdk-mod-label">{c.label}</span>
                  <span className="cmdk-mod-group">{c.group}</span>
                  {c.kbd&&<span className="cmdk-mod-kbd">{c.kbd}</span>}
                </div>
              ))
          }
        </div>
        <div className="cmdk-mod-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
          <span style={{marginLeft:'auto'}}><kbd>⌘</kbd><kbd>K</kbd></span>
        </div>
      </div>
    </div>
  );
}

function CmdkTrigger() {
  return (
    <button
      className="cmdk-trigger"
      onClick={()=>window.__openCmdk&&window.__openCmdk()}
      title="Open command palette"
      aria-label="Open command palette"
    >
      <span className="label">Search...</span>
      <kbd>⌘K</kbd>
    </button>
  );
}

Object.assign(window, { CommandPalette, CmdkTrigger });
