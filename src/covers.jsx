// Cover artwork library — abstract, minimal 320×180 SVGs.
// Usage in data.js:  cover: "F1"   (named key)
//                    cover: "https://…"  (image URL — also supported)
//
// ─── Full catalogue ───────────────────────────────────────────────────────────
//
//  DATA / ANALYTICS          TOOLS / TECH            DOMAIN
//  ─────────────────         ─────────────           ──────────────
//  Dashboard  — bar + line   Python    — wave code   Finance   — candlesticks
//  Scatter    — dots + fit   SQL       — table grid  HR        — people dots
//  TimeSeries — wavy line    API       — brackets    Marketing — funnel
//  Heatmap    — color grid   Excel     — cell grid   Network   — graph nodes
//  Clustering — blob groups  PowerBI   — donut       Supply    — flow arrows
//  Regression — line + cloud ML        — neuron net  Climate   — wave rings
//
//  MISC
//  ──────────────────────────
//  F1       — checkered flag         (original)
//  Netflix  — catalogue grid         (original)
//  Layoffs  — falling bars + line    (original)
//  Generic  — dot grid + accent      (original)
//  Report   — document lines
//  Survey   — horizontal bars
//  Startup  — hockey-stick curve
//  Map      — geographic dots
//  Academia — paper & rule lines
//
// ─────────────────────────────────────────────────────────────────────────────

const Cover = {

  /* ── ORIGINALS ─────────────────────────────────────────────────────────── */

  F1: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="f1bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1a1a"/><stop offset="1" stopColor="#3a3a3a"/>
        </linearGradient>
        <pattern id="f1chk" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#0a0a0a"/>
          <rect width="7" height="7" fill="#ededed"/>
          <rect x="7" y="7" width="7" height="7" fill="#ededed"/>
        </pattern>
      </defs>
      <rect width="320" height="180" fill="url(#f1bg)"/>
      <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1">
        {Array.from({length:18}).map((_,i)=><line key={i} x1={-40+i*22} y1="0" x2={i*22} y2="180"/>)}
      </g>
      <rect x="0" y="138" width="320" height="14" fill="url(#f1chk)" opacity="0.9"/>
      <circle cx="240" cy="70" r="50" fill="#dc2626" opacity="0.18"/>
      <circle cx="240" cy="70" r="22" fill="#dc2626" opacity="0.55"/>
      <text x="20" y="44" fill="#ffffff" fontFamily="Geist Mono,monospace" fontSize="10" letterSpacing="2" opacity="0.7">SEASON · 2025</text>
      <text x="20" y="116" fill="#ffffff" fontFamily="Geist,sans-serif" fontWeight="600" fontSize="34" letterSpacing="-1.2">F1 Tracker</text>
    </svg>
  ),

  Dashboard: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="dshbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef3c7"/><stop offset="1" stopColor="#fde68a"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#dshbg)"/>
      <g stroke="#a16207" strokeOpacity="0.12">
        {Array.from({length:8}).map((_,i)=><line key={i} x1="0" y1={i*22+8} x2="320" y2={i*22+8}/>)}
      </g>
      {[60,90,45,110,70,130,95,150,80].map((h,i)=>(
        <rect key={i} x={18+i*16} y={170-h} width="10" height={h} rx="2" fill={i%3===0?'#92400e':'#b45309'}/>
      ))}
      <polyline fill="none" stroke="#7c2d12" strokeWidth="2"
        points="20,120 50,100 80,108 110,80 140,86 170,60 200,68 230,48 260,40 290,30"/>
      {[120,100,108,80,86,60,68,48,40,30].map((y,i)=>(
        <circle key={i} cx={20+i*30} cy={y} r="2.4" fill="#7c2d12"/>
      ))}
      <text x="20" y="34" fill="#7c2d12" fontFamily="Geist Mono,monospace" fontSize="10" letterSpacing="2" opacity="0.85">Q4 · INSIGHTS</text>
    </svg>
  ),

  Netflix: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="nfbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a0a0a"/><stop offset="1" stopColor="#1a0606"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#nfbg)"/>
      {Array.from({length:5}).map((_,r)=>
        Array.from({length:9}).map((_,c)=>(
          <rect key={r+'-'+c} x={20+c*34} y={20+r*30} width="28" height="22" rx="2"
            fill="#ef4444" opacity={0.06+((r*9+c)%5)*0.06}/>
        ))
      )}
      <rect x="156" y="80" width="28" height="22" rx="2" fill="#ef4444"/>
      <text x="20" y="170" fill="#fafafa" fontFamily="Geist Mono,monospace" fontSize="10" letterSpacing="2" opacity="0.7">SELECT * FROM titles</text>
    </svg>
  ),

  Layoffs: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="lobg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1f5f9"/><stop offset="1" stopColor="#e2e8f0"/>
        </linearGradient>
        <linearGradient id="lobar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e293b"/><stop offset="1" stopColor="#475569"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#lobg)"/>
      {[30,50,45,75,70,95,80,110,100,130,120,145].map((h,i)=>(
        <rect key={i} x={16+i*24} y="40" width="16" height={h} rx="1.5" fill="url(#lobar)"/>
      ))}
      <polyline fill="none" stroke="#dc2626" strokeWidth="2"
        points="24,50 48,70 72,62 96,92 120,84 144,110 168,98 192,124 216,118 240,142 264,134 288,154"/>
      <text x="20" y="28" fill="#0f172a" fontFamily="Geist Mono,monospace" fontSize="10" letterSpacing="2" opacity="0.7">2020 — 2025 · MONTHLY</text>
    </svg>
  ),

  Generic: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="genbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f172a"/><stop offset="1" stopColor="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#genbg)"/>
      {Array.from({length:10}).map((_,r)=>
        Array.from({length:18}).map((_,c)=>(
          <circle key={r+'-'+c} cx={18+c*17} cy={16+r*17} r="1.2" fill="#ffffff" opacity="0.12"/>
        ))
      )}
      <line x1="20" y1="140" x2="260" y2="60" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.6"/>
      <circle cx="260" cy="60" r="4" fill="#60a5fa" opacity="0.8"/>
      <text x="20" y="170" fill="#94a3b8" fontFamily="Geist Mono,monospace" fontSize="10" letterSpacing="2">PROJECT · {new Date().getFullYear()}</text>
    </svg>
  ),

  /* ── DATA & ANALYTICS ──────────────────────────────────────────────────── */

  // Scatter plot with a regression line
  Scatter: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="scbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f172a"/><stop offset="1" stopColor="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#scbg)"/>
      {/* axis lines */}
      <line x1="28" y1="20" x2="28" y2="158" stroke="#334155" strokeWidth="1"/>
      <line x1="28" y1="158" x2="300" y2="158" stroke="#334155" strokeWidth="1"/>
      {/* regression line */}
      <line x1="30" y1="145" x2="298" y2="38" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="6 3"/>
      {/* scattered dots */}
      {[
        [45,140],[70,125],[90,118],[55,132],[115,108],[130,100],[100,112],
        [160,90],[180,78],[200,72],[155,95],[220,65],[240,55],[260,48],[280,42],
        [170,85],[250,60],[85,120],[145,98],[210,70],
      ].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3.5" fill="#60a5fa"
          opacity={0.5+Math.sin(i)*0.3}/>
      ))}
      <text x="36" y="16" fill="#94a3b8" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2" opacity="0.8">REGRESSION ANALYSIS</text>
    </svg>
  ),

  // Time-series: smooth sinusoidal wave
  TimeSeries: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="tsbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020617"/><stop offset="1" stopColor="#0f172a"/>
        </linearGradient>
        <linearGradient id="tsfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.3"/>
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#tsbg)"/>
      {/* grid */}
      {[40,80,120].map(y=><line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#1e3a5f" strokeWidth="1" strokeOpacity="0.6"/>)}
      {/* fill area */}
      <path d="M0,130 C30,110 50,70 80,85 S120,55 150,60 S200,100 230,75 S280,40 320,55 L320,180 L0,180 Z"
        fill="url(#tsfill)"/>
      {/* main line */}
      <path d="M0,130 C30,110 50,70 80,85 S120,55 150,60 S200,100 230,75 S280,40 320,55"
        fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
      {/* secondary muted line */}
      <path d="M0,150 C40,135 70,118 100,125 S140,110 170,115 S220,130 260,120 S290,112 320,108"
        fill="none" stroke="#475569" strokeWidth="1.2" strokeLinecap="round"/>
      <text x="20" y="172" fill="#64748b" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">TIME SERIES · TREND</text>
    </svg>
  ),

  // Heatmap grid with colour gradient
  Heatmap: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <rect width="320" height="180" fill="#0f172a"/>
      {/* 10 cols × 6 rows */}
      {Array.from({length:6}).map((_,r)=>
        Array.from({length:10}).map((_,c)=>{
          const val = Math.abs(Math.sin(r*2.1+c*1.3+1.4));
          const blue = Math.round(val*220);
          const red  = Math.round((1-val)*180);
          return <rect key={r+'-'+c}
            x={20+c*28} y={24+r*24} width="24" height="20" rx="3"
            fill={`rgb(${red},${Math.round(val*60)},${blue})`} opacity="0.85"/>;
        })
      )}
      <text x="20" y="175" fill="#64748b" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">CORRELATION MATRIX</text>
    </svg>
  ),

  // Clustering — coloured blob groups
  Clustering: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <radialGradient id="cl1" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.35"/>
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cl2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#a855f7" stopOpacity="0.35"/>
          <stop offset="1" stopColor="#a855f7" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cl3" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#10b981" stopOpacity="0.35"/>
          <stop offset="1" stopColor="#10b981" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="#0a0a0a"/>
      {/* cluster blobs */}
      <ellipse cx="90" cy="80" rx="60" ry="48" fill="url(#cl1)"/>
      <ellipse cx="215" cy="65" rx="55" ry="44" fill="url(#cl2)"/>
      <ellipse cx="170" cy="138" rx="65" ry="36" fill="url(#cl3)"/>
      {/* cluster A dots */}
      {[[75,72],[90,60],[105,82],[80,95],[95,75],[115,68],[70,85]].map(([x,y],i)=>(
        <circle key={'a'+i} cx={x} cy={y} r="3.5" fill="#60a5fa" opacity="0.9"/>
      ))}
      {/* cluster B dots */}
      {[[205,55],[220,70],[230,52],[200,78],[215,42],[240,68],[195,60]].map(([x,y],i)=>(
        <circle key={'b'+i} cx={x} cy={y} r="3.5" fill="#c084fc" opacity="0.9"/>
      ))}
      {/* cluster C dots */}
      {[[158,132],[172,148],[185,136],[155,146],[175,128],[200,140],[165,155]].map(([x,y],i)=>(
        <circle key={'c'+i} cx={x} cy={y} r="3.5" fill="#34d399" opacity="0.9"/>
      ))}
      <text x="20" y="172" fill="#52525b" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">K-MEANS CLUSTERING</text>
    </svg>
  ),

  // Regression: scatter with a fitted line and confidence band
  Regression: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="rgbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8fafc"/><stop offset="1" stopColor="#f1f5f9"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#rgbg)"/>
      {/* axes */}
      <line x1="28" y1="158" x2="300" y2="158" stroke="#cbd5e1" strokeWidth="1"/>
      <line x1="28" y1="20" x2="28" y2="158" stroke="#cbd5e1" strokeWidth="1"/>
      {/* confidence band */}
      <path d="M30,150 C80,118 160,88 298,52 L298,70 C160,108 80,138 30,166 Z"
        fill="#3b82f6" opacity="0.1"/>
      {/* regression line */}
      <line x1="30" y1="150" x2="298" y2="52" stroke="#2563eb" strokeWidth="2" strokeOpacity="0.8"/>
      {/* dots */}
      {[
        [45,144],[80,128],[60,138],[110,115],[95,120],[140,104],[130,110],
        [175,90],[160,96],[200,78],[220,68],[240,62],[255,55],[280,50],
      ].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3" fill="#1d4ed8" opacity="0.7"/>
      ))}
      <text x="36" y="16" fill="#64748b" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2" opacity="0.8">LINEAR REGRESSION · R²</text>
    </svg>
  ),

  /* ── TOOLS & TECH ──────────────────────────────────────────────────────── */

  // Python — wave-like code curves, dark bg with python yellow/blue
  Python: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="pybg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1a2e"/><stop offset="1" stopColor="#16213e"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#pybg)"/>
      {/* wavy code lines */}
      {[40,60,80,100,120,140].map((y,i)=>(
        <path key={i}
          d={`M${20+i*8},${y} C${70+i*4},${y-12} ${130-i*4},${y+12} ${180+i*3},${y} S${250+i*2},${y-10} ${308},${y-6}`}
          fill="none" stroke={i%2===0?"#3b82f6":"#fbbf24"} strokeWidth="1.2"
          strokeOpacity={0.25+i*0.07} strokeLinecap="round"/>
      ))}
      {/* Python logo – two interlocked snake-head shapes */}
      <path d="M148,60 C148,52 154,46 162,46 L178,46 C186,46 192,52 192,60 L192,74 C192,82 186,88 178,88 L162,88 C154,88 148,82 148,74 Z"
        fill="#3b82f6" opacity="0.85"/>
      <path d="M148,74 L162,74 L162,88" fill="none" stroke="#1e3a5f" strokeWidth="1.5"/>
      <circle cx="162" cy="60" r="3" fill="#fafafa" opacity="0.9"/>
      <path d="M172,92 C172,100 166,106 158,106 L142,106 C134,106 128,100 128,92 L128,78 C128,70 134,64 142,64 L158,64 C166,64 172,70 172,78 Z"
        fill="#fbbf24" opacity="0.85"/>
      <path d="M172,78 L158,78 L158,64" fill="none" stroke="#78350f" strokeWidth="1.5"/>
      <circle cx="158" cy="92" r="3" fill="#fafafa" opacity="0.9"/>
      <text x="20" y="168" fill="#475569" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">PYTHON · pandas · numpy</text>
    </svg>
  ),

  // SQL — table rows with highlighted cell
  SQL: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="sqlbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f172a"/><stop offset="1" stopColor="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#sqlbg)"/>
      {/* table header */}
      <rect x="20" y="28" width="280" height="22" rx="4" fill="#1e3a5f" opacity="0.9"/>
      {/* column labels */}
      {['id','name','value','date','status'].map((col,i)=>(
        <text key={i} x={32+i*54} y="43" fill="#60a5fa" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="1">{col}</text>
      ))}
      {/* rows */}
      {[0,1,2,3,4].map(r=>(
        <g key={r}>
          <rect x="20" y={55+r*22} width="280" height="20" rx="2"
            fill={r===2?"#1e3a5f":"transparent"} opacity={r===2?0.7:1}/>
          <line x1="20" y1={75+r*22} x2="300" y2={75+r*22} stroke="#1e3a5f" strokeWidth="1" opacity="0.5"/>
          {[0,1,2,3,4].map(c=>(
            <rect key={c} x={26+c*54} y={58+r*22} width={46} height="12" rx="2"
              fill={r===2&&c===2?"#3b82f6":"#334155"} opacity={r===2&&c===2?0.95:0.4}/>
          ))}
        </g>
      ))}
      <text x="20" y="172" fill="#475569" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">SELECT · JOIN · GROUP BY</text>
    </svg>
  ),

  // API — JSON-bracket aesthetic
  API: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <rect width="320" height="180" fill="#0a0a0a"/>
      {/* bracket left */}
      <path d="M30,20 L20,20 L20,160 L30,160" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      {/* bracket right */}
      <path d="M290,20 L300,20 L300,160 L290,160" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      {/* JSON lines */}
      {[
        {x:44, y:38,  color:'#60a5fa', w:60,  label:'"endpoint"'},
        {x:44, y:55,  color:'#a78bfa', w:90,  label:'"method"'},
        {x:44, y:72,  color:'#60a5fa', w:48,  label:'"auth"'},
        {x:44, y:89,  color:'#34d399', w:120, label:'"response"'},
        {x:56, y:106, color:'#94a3b8', w:80,  label:'"status"'},
        {x:56, y:122, color:'#94a3b8', w:100, label:'"data"'},
        {x:56, y:138, color:'#fbbf24', w:70,  label:'"code"'},
        {x:44, y:155, color:'#60a5fa', w:40,  label:'"ts"'},
      ].map(({x,y,color,w,label},i)=>(
        <g key={i}>
          <text x={x} y={y} fill={color} fontFamily="Geist Mono,monospace" fontSize="9" opacity="0.85">{label}:</text>
          <rect x={x+72} y={y-9} width={w} height="10" rx="2" fill={color} opacity="0.18"/>
        </g>
      ))}
    </svg>
  ),

  // Excel — cell grid with formulas
  Excel: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="xlbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#052e16"/><stop offset="1" stopColor="#14532d"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#xlbg)"/>
      {/* column headers A B C … */}
      {['A','B','C','D','E','F'].map((l,i)=>(
        <text key={i} x={28+i*46} y="22" fill="#86efac" fontFamily="Geist Mono,monospace" fontSize="10" opacity="0.6">{l}</text>
      ))}
      {/* row numbers */}
      {[1,2,3,4,5,6].map((n,i)=>(
        <text key={i} x="10" y={40+i*24} fill="#86efac" fontFamily="Geist Mono,monospace" fontSize="9" opacity="0.4">{n}</text>
      ))}
      {/* grid lines */}
      {Array.from({length:7}).map((_,i)=>(
        <line key={'v'+i} x1={22+i*46} y1="26" x2={22+i*46} y2="170" stroke="#16a34a" strokeWidth="0.5" opacity="0.35"/>
      ))}
      {Array.from({length:7}).map((_,i)=>(
        <line key={'h'+i} x1="22" y1={26+i*24} x2="308" y2={26+i*24} stroke="#16a34a" strokeWidth="0.5" opacity="0.35"/>
      ))}
      {/* highlighted cells */}
      <rect x="22" y="26" width="46" height="24" fill="#16a34a" opacity="0.25"/>
      <rect x="68" y="26" width="46" height="24" fill="#16a34a" opacity="0.25"/>
      <rect x="22" y="98" width="138" height="24" fill="#15803d" opacity="0.3"/>
      {/* formula bar text */}
      <text x="30" y="108" fill="#4ade80" fontFamily="Geist Mono,monospace" fontSize="9" opacity="0.9">=SUMIF(A:A,B2,C:C)</text>
      <text x="10" y="174" fill="#166534" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">SPREADSHEET · MODELS</text>
    </svg>
  ),

  // PowerBI — donut chart
  PowerBI: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="pbibg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef9c3"/><stop offset="1" stopColor="#fef3c7"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#pbibg)"/>
      {/* donut slices — manual arcs */}
      {/* 35% orange */}
      <path d="M160,90 L160,34 A56,56 0 0,1 208,62 Z" fill="#f97316" opacity="0.9"/>
      {/* 25% yellow */}
      <path d="M160,90 L208,62 A56,56 0 0,1 203,130 Z" fill="#fbbf24" opacity="0.9"/>
      {/* 20% amber */}
      <path d="M160,90 L203,130 A56,56 0 0,1 128,144 Z" fill="#d97706" opacity="0.9"/>
      {/* 20% dark */}
      <path d="M160,90 L128,144 A56,56 0 0,1 160,34 Z" fill="#92400e" opacity="0.85"/>
      {/* inner hole */}
      <circle cx="160" cy="90" r="30" fill="#fef9c3"/>
      <text x="150" y="95" fill="#92400e" fontFamily="Geist Mono,monospace" fontSize="10" fontWeight="600">BI</text>
      {/* legend */}
      {[['#f97316','35%','Revenue'],[' #fbbf24','25%','OPEX'],['#d97706','20%','Margin'],['#92400e','20%','Other']].map(([c,p,l],i)=>(
        <g key={i}>
          <rect x="26" y={42+i*26} width="10" height="10" rx="2" fill={c.trim()}/>
          <text x="42" y={52+i*26} fill="#78350f" fontFamily="Geist Mono,monospace" fontSize="9">{p} {l}</text>
        </g>
      ))}
    </svg>
  ),

  // ML — neural network layers
  ML: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <rect width="320" height="180" fill="#050510"/>
      {/* connections */}
      {/* input → hidden1 */}
      {[40,70,100,130,160].map(y1=>
        [50,80,110,140].map(y2=>(
          <line key={y1+'-'+y2} x1="60" y1={y1} x2="140" y2={y2}
            stroke="#6366f1" strokeWidth="0.5" opacity="0.2"/>
        ))
      )}
      {/* hidden1 → hidden2 */}
      {[50,80,110,140].map(y1=>
        [60,90,120].map(y2=>(
          <line key={'h'+y1+'-'+y2} x1="140" y1={y1} x2="210" y2={y2}
            stroke="#8b5cf6" strokeWidth="0.6" opacity="0.25"/>
        ))
      )}
      {/* hidden2 → output */}
      {[60,90,120].map(y1=>
        [80,120].map(y2=>(
          <line key={'o'+y1+'-'+y2} x1="210" y1={y1} x2="270" y2={y2}
            stroke="#a78bfa" strokeWidth="0.7" opacity="0.35"/>
        ))
      )}
      {/* nodes */}
      {[40,70,100,130,160].map((y,i)=>(
        <circle key={'i'+i} cx="60" cy={y} r="7" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5"/>
      ))}
      {[50,80,110,140].map((y,i)=>(
        <circle key={'h1'+i} cx="140" cy={y} r="8" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5"/>
      ))}
      {[60,90,120].map((y,i)=>(
        <circle key={'h2'+i} cx="210" cy={y} r="8" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5"/>
      ))}
      {[80,120].map((y,i)=>(
        <circle key={'o'+i} cx="270" cy={y} r="9" fill="#4c1d95" stroke="#a78bfa" strokeWidth="2"/>
      ))}
      {/* active node highlight */}
      <circle cx="140" cy="80" r="8" fill="#6366f1" opacity="0.6"/>
      <text x="18" y="174" fill="#4338ca" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">NEURAL NETWORK · DEEP LEARNING</text>
    </svg>
  ),

  /* ── DOMAIN ────────────────────────────────────────────────────────────── */

  // Finance — candlestick chart
  Finance: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="fibg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0a0a"/><stop offset="1" stopColor="#0f1623"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#fibg)"/>
      {/* grid lines */}
      {[40,80,120].map(y=><line key={y} x1="20" y1={y} x2="300" y2={y} stroke="#1e293b" strokeWidth="1"/>)}
      {/* candles */}
      {[
        {x:28,  hi:28,  lo:100, op:42,  cl:80,  green:true},
        {x:52,  hi:38,  lo:90,  op:75,  cl:50,  green:true},
        {x:76,  hi:45,  lo:115, op:56,  cl:100, green:false},
        {x:100, hi:60,  lo:130, op:105, cl:72,  green:true},
        {x:124, hi:55,  lo:108, op:68,  cl:58,  green:true},
        {x:148, hi:48,  lo:95,  op:55,  cl:88,  green:false},
        {x:172, hi:60,  lo:110, op:95,  cl:65,  green:true},
        {x:196, hi:50,  lo:88,  op:60,  cl:52,  green:true},
        {x:220, hi:42,  lo:95,  op:50,  cl:85,  green:false},
        {x:244, hi:35,  lo:78,  op:72,  cl:40,  green:true},
        {x:268, hi:28,  lo:68,  op:36,  cl:62,  green:false},
      ].map(({x,hi,lo,op,cl,green},i)=>{
        const color=green?'#22c55e':'#ef4444';
        const body = {y:Math.min(op,cl), h:Math.abs(op-cl)};
        return (
          <g key={i}>
            <line x1={x+8} y1={hi} x2={x+8} y2={lo} stroke={color} strokeWidth="1.2" opacity="0.7"/>
            <rect x={x} y={body.y} width="16" height={Math.max(body.h,2)} rx="1.5" fill={color} opacity="0.9"/>
          </g>
        );
      })}
      <text x="20" y="168" fill="#334155" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">OHLC · MARKET DATA</text>
    </svg>
  ),

  // HR — people dots arranged in an org tree
  HR: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="hrbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf2f8"/><stop offset="1" stopColor="#fce7f3"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#hrbg)"/>
      {/* tree lines */}
      <line x1="160" y1="46" x2="160" y2="68" stroke="#db2777" strokeWidth="1.5" opacity="0.4"/>
      {[80,160,240].map(x=>(
        <g key={x}>
          <line x1="160" y1="68" x2={x} y2="68" stroke="#db2777" strokeWidth="1.5" opacity="0.4"/>
          <line x1={x} y1="68" x2={x} y2="90" stroke="#db2777" strokeWidth="1.5" opacity="0.4"/>
        </g>
      ))}
      {[50,110,135,185,210,270].map(x=>(
        <g key={x}>
          <line x1={x<160?80:x<200?160:240} y1="106" x2={x} y2="106" stroke="#db2777" strokeWidth="1" opacity="0.3"/>
          <line x1={x} y1="106" x2={x} y2="125" stroke="#db2777" strokeWidth="1" opacity="0.3"/>
        </g>
      ))}
      {/* people — head + body silhouettes */}
      {[
        [160,28,'#be185d',14],
        [80,78,'#ec4899',11],[160,78,'#ec4899',11],[240,78,'#ec4899',11],
        [50,113,'#f9a8d4',9],[110,113,'#f9a8d4',9],[135,113,'#f9a8d4',9],
        [185,113,'#f9a8d4',9],[210,113,'#f9a8d4',9],[270,113,'#f9a8d4',9],
      ].map(([x,y,c,r],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={c} opacity="0.9"/>
          <ellipse cx={x} cy={y+r+9} rx={r*1.2} ry={r*0.7} fill={c} opacity="0.5"/>
        </g>
      ))}
      <text x="20" y="174" fill="#9d174d" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">HUMAN RESOURCES · ORG</text>
    </svg>
  ),

  // Marketing — funnel shape
  Marketing: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="mkbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6b35"/><stop offset="1" stopColor="#f7c59f"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="#fff7ed"/>
      {/* funnel layers */}
      {[
        {y:20, w:280, h:32, fill:'#ea580c', label:'AWARENESS', n:'10 000'},
        {y:58, w:200, h:28, fill:'#f97316', label:'INTEREST',  n:'4 200'},
        {y:92, w:136, h:26, fill:'#fb923c', label:'DESIRE',    n:'1 800'},
        {y:124,w: 80, h:24, fill:'#fdba74', label:'ACTION',    n:'620'},
        {y:154,w: 44, h:20, fill:'#fed7aa', label:'CONVERT',  n:'180'},
      ].map(({y,w,h,fill,label,n})=>(
        <g key={label}>
          <rect x={(320-w)/2} y={y} width={w} height={h} rx="4" fill={fill} opacity="0.88"/>
          <text x="166" y={y+h/2+4} fill="#fff7ed" fontFamily="Geist Mono,monospace" fontSize="9" textAnchor="middle" letterSpacing="1">{label}</text>
          <text x={300} y={y+h/2+4} fill="#c2410c" fontFamily="Geist Mono,monospace" fontSize="9" textAnchor="end">{n}</text>
        </g>
      ))}
    </svg>
  ),

  // Network — graph nodes and edges
  Network: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <rect width="320" height="180" fill="#09090b"/>
      {/* edges */}
      {([
        [160,90, 80,50],[160,90,240,50],[160,90,100,140],[160,90,220,140],
        [160,90, 60,90],[160,90,260,90],
        [ 80,50, 60,90],[ 80,50,100,140],[240,50,260,90],[240,50,220,140],
        [ 60,90,100,140],[260,90,220,140],
      ]).map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3f3f46" strokeWidth="1.5"/>
      ))}
      {/* nodes */}
      {([
        [160,90,'#a855f7',14,'HUB'],
        [ 80,50,'#6366f1',9, ''],
        [240,50,'#6366f1',9, ''],
        [100,140,'#6366f1',9,''],
        [220,140,'#6366f1',9,''],
        [ 60,90,'#8b5cf6',7, ''],
        [260,90,'#8b5cf6',7, ''],
      ]).map(([x,y,c,r,label],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r={r+3} fill={c} opacity="0.15"/>
          <circle cx={x} cy={y} r={r} fill={c} opacity="0.9"/>
          {label&&<text x={x} y={y+3} fill="#fafafa" fontFamily="Geist Mono,monospace" fontSize="7" textAnchor="middle">{label}</text>}
        </g>
      ))}
      <text x="20" y="173" fill="#3f3f46" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">GRAPH · NETWORK ANALYSIS</text>
    </svg>
  ),

  // Supply chain — horizontal flow arrows
  Supply: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="scbg2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ecfdf5"/><stop offset="1" stopColor="#d1fae5"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#scbg2)"/>
      {/* flow line */}
      <line x1="30" y1="90" x2="290" y2="90" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="6 3"/>
      {/* nodes with arrows */}
      {['SUPPLIER','FACTORY','DIST.','RETAIL','CUSTOMER'].map((label,i)=>{
        const x=30+i*66;
        return (
          <g key={i}>
            <rect x={x-22} y="72" width="44" height="36" rx="6"
              fill={['#059669','#10b981','#34d399','#6ee7b7','#a7f3d0'][i]} opacity="0.9"/>
            <text x={x} y="94" fill={i<2?"#fff":"#065f46"} fontFamily="Geist Mono,monospace"
              fontSize="7" textAnchor="middle" letterSpacing="0.5">{label}</text>
            {i<4&&<path d={`M${x+25},90 L${x+34},86 L${x+34},94 Z`} fill="#059669" opacity="0.5"/>}
          </g>
        );
      })}
      {/* top labels: volume bars */}
      {[45,110,176,242,308].map((x,i)=>(
        <rect key={i} x={x-14} y={50-[30,45,38,22,12][i]} width="28" height={[30,45,38,22,12][i]}
          rx="2" fill="#059669" opacity="0.2"/>
      ))}
      <text x="20" y="148" fill="#065f46" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">SUPPLY CHAIN · LOGISTICS</text>
    </svg>
  ),

  // Climate — concentric ring waves
  Climate: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="clmbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c4a6e"/><stop offset="1" stopColor="#0a3352"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#clmbg)"/>
      {/* temperature anomaly rings */}
      {[70,58,46,34,22,12].map((r,i)=>(
        <ellipse key={i} cx="200" cy="96" rx={r*2.4} ry={r*1.3}
          stroke={['#ef4444','#f97316','#fbbf24','#34d399','#38bdf8','#818cf8'][i]}
          strokeWidth="1.5" fill="none" opacity={0.2+i*0.12}/>
      ))}
      {/* bar chart on the left */}
      {[8,14,12,20,28,35,42,50,60].map((h,i)=>(
        <rect key={i} x={20+i*14} y={140-h} width="10" height={h} rx="1.5"
          fill={h>35?'#ef4444':'#38bdf8'} opacity="0.8"/>
      ))}
      <line x1="20" y1="140" x2="145" y2="140" stroke="#0369a1" strokeWidth="1"/>
      <text x="20" y="163" fill="#0369a1" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">CLIMATE · ESG DATA</text>
    </svg>
  ),

  /* ── MISC ──────────────────────────────────────────────────────────────── */

  // Report — document with lines and a chart inset
  Report: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <rect width="320" height="180" fill="#f8fafc"/>
      {/* paper shadow */}
      <rect x="45" y="18" width="230" height="150" rx="6" fill="#e2e8f0"/>
      {/* paper */}
      <rect x="40" y="14" width="230" height="150" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1"/>
      {/* title line */}
      <rect x="56" y="28" width="140" height="8" rx="2" fill="#1e293b" opacity="0.9"/>
      {/* subtitle */}
      <rect x="56" y="42" width="90"  height="5" rx="1.5" fill="#94a3b8" opacity="0.7"/>
      {/* text lines */}
      {[60,68,76,84,92].map(y=>(
        <rect key={y} x="56" y={y+48} width={180-y%30} height="4" rx="1.5" fill="#cbd5e1" opacity="0.8"/>
      ))}
      {/* mini bar chart inset */}
      <rect x="150" y="84" width="108" height="68" rx="4" fill="#f1f5f9"/>
      {[18,30,22,42,35,48,40].map((h,i)=>(
        <rect key={i} x={158+i*14} y={144-h} width="10" height={h} rx="1.5" fill="#3b82f6" opacity="0.7"/>
      ))}
      <text x="48" y="176" fill="#94a3b8" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">REPORT · ANALYSIS</text>
    </svg>
  ),

  // Survey — horizontal percentage bars
  Survey: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <rect width="320" height="180" fill="#fafaf9"/>
      {/* question rows */}
      {[
        {label:'Strongly agree',   pct:62, color:'#2563eb'},
        {label:'Agree',            pct:21, color:'#60a5fa'},
        {label:'Neutral',          pct: 9, color:'#94a3b8'},
        {label:'Disagree',         pct: 6, color:'#f97316'},
        {label:'Strongly disagree',pct: 2, color:'#ef4444'},
      ].map(({label,pct,color},i)=>(
        <g key={i}>
          <text x="20" y={30+i*30} fill="#374151" fontFamily="Geist Mono,monospace" fontSize="9">{label}</text>
          <rect x="20" y={35+i*30} width="256" height="11" rx="999" fill="#e5e7eb"/>
          <rect x="20" y={35+i*30} width={2.56*pct} height="11" rx="999" fill={color} opacity="0.85"/>
          <text x={280} y={45+i*30} fill={color} fontFamily="Geist Mono,monospace" fontSize="9" textAnchor="end">{pct}%</text>
        </g>
      ))}
      <text x="20" y="172" fill="#9ca3af" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">SURVEY · N=1 240</text>
    </svg>
  ),

  // Startup — hockey-stick growth curve
  Startup: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="stbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f172a"/><stop offset="1" stopColor="#1e293b"/>
        </linearGradient>
        <linearGradient id="stfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22c55e" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#22c55e" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#stbg)"/>
      {/* hockey stick fill */}
      <path d="M20,150 C60,148 100,145 130,140 C155,136 170,130 190,110 C210,88 230,55 280,20 L280,160 L20,160 Z"
        fill="url(#stfill)"/>
      {/* hockey stick line */}
      <path d="M20,150 C60,148 100,145 130,140 C155,136 170,130 190,110 C210,88 230,55 280,20"
        fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
      {/* milestone dots */}
      {[[130,140],[190,110],[280,20]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#22c55e" opacity="0.3"/>
          <circle cx={x} cy={y} r="3" fill="#22c55e"/>
        </g>
      ))}
      {/* x axis */}
      <line x1="20" y1="160" x2="300" y2="160" stroke="#334155" strokeWidth="1"/>
      <text x="20" y="175" fill="#334155" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">GROWTH · STARTUP METRICS</text>
    </svg>
  ),

  // Map — geographic dot scatter on grid
  Map: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eff6ff"/><stop offset="1" stopColor="#dbeafe"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#mapbg)"/>
      {/* lat/lon grid */}
      {Array.from({length:7}).map((_,i)=>(
        <line key={'v'+i} x1={20+i*44} y1="16" x2={20+i*44} y2="168" stroke="#bfdbfe" strokeWidth="0.8"/>
      ))}
      {Array.from({length:5}).map((_,i)=>(
        <line key={'h'+i} x1="20" y1={26+i*36} x2="300" y2={26+i*36} stroke="#bfdbfe" strokeWidth="0.8"/>
      ))}
      {/* city dots with size = population */}
      {([
        [160,72,18,'#1d4ed8'],  // major hub
        [ 80,55,11,'#3b82f6'],
        [220,88,14,'#2563eb'],
        [110,120, 8,'#60a5fa'],
        [250,60, 9,'#60a5fa'],
        [ 55,90, 7,'#93c5fd'],
        [195,130,10,'#3b82f6'],
        [280,110, 6,'#93c5fd'],
        [140,48, 7,'#60a5fa'],
        [300,150, 5,'#bfdbfe'],
      ]).map(([x,y,r,c],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r={r+4} fill={c} opacity="0.15"/>
          <circle cx={x} cy={y} r={r} fill={c} opacity="0.85"/>
        </g>
      ))}
      {/* connection lines between major hubs */}
      {[[160,72,80,55],[160,72,220,88],[80,55,110,120],[220,88,250,60]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 3"/>
      ))}
      <text x="20" y="176" fill="#93c5fd" fontFamily="Geist Mono,monospace" fontSize="9" letterSpacing="2">GEO · SPATIAL ANALYSIS</text>
    </svg>
  ),

  // Academia — paper lines, citation brackets
  Academia: () => (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display:'block',width:'100%',height:'100%'}}>
      <rect width="320" height="180" fill="#fafaf9"/>
      {/* ruled lines */}
      {Array.from({length:10}).map((_,i)=>(
        <line key={i} x1="20" y1={24+i*16} x2="300" y2={24+i*16} stroke="#e7e5e4" strokeWidth="1"/>
      ))}
      {/* text content representation */}
      <rect x="20" y="16" width="200" height="7" rx="1.5" fill="#1c1917" opacity="0.8"/>
      {[120,200,180,220,160,140,200,180,100,190].map((w,i)=>(
        <rect key={i} x="20" y={28+i*16} width={w} height="5" rx="1.5" fill="#78716c" opacity={0.3+i%3*0.1}/>
      ))}
      {/* citation bracket */}
      <path d="M232,48 L222,48 L222,96 L232,96" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="236" y="62" width="52" height="20" rx="3" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1"/>
      <text x="262" y="76" fill="#dc2626" fontFamily="Geist Mono,monospace" fontSize="8" textAnchor="middle">[1] key</text>
      {/* formula */}
      <text x="20" y="174" fill="#d6d3d1" fontFamily="Geist Mono,monospace" fontSize="9">μ = (1/n)Σxᵢ   ·   σ² = E[(X−μ)²]</text>
    </svg>
  ),

};

window.Cover = Cover;
