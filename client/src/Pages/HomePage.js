import { useState, useEffect, useRef } from "react";

// ── same palette as Login ──────────────────────────────────────────
// --bg-deep:       #0B0F19
// --bg-surface:    #151B2B
// --bg-elevated:   #1E2738
// --accent-cyan:   #00F0FF
// --accent-magenta:#FF0080
// --accent-violet: #8B5CF6
// --text-primary:  #F8FAFC
// --text-secondary:#94A3B8
// --text-tertiary: #64748B
// fonts: Outfit + JetBrains Mono
const userInfo=localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null;
const FEATURES = [
  { icon: "⚡", title: "Instant Status Checks",  desc: "Ping any endpoint and get live status, response time, and HTTP code in milliseconds.", col: "#00F0FF" },
  { icon: "📊", title: "Response Analytics",     desc: "Beautiful latency charts over time. Spot slowdowns before they become outages.", col: "#8B5CF6" },
  { icon: "🌍", title: "Multi-Region Checks",    desc: "Check from 12 global nodes simultaneously. See exactly where things break.", col: "#FF0080" },
  { icon: "📋", title: "Response Inspector",     desc: "Drill into headers, body, and status codes. Debug without leaving your dashboard.", col: "#00F0FF" },
  { icon: "🔁", title: "Scheduled Polling",      desc: "Automatic checks every 30s, 1m, or 5m — your schedule, your endpoints.", col: "#8B5CF6" },
  { icon: "🕓", title: "90-Day History",         desc: "Full uptime logs per endpoint. Know exactly when things went wrong and for how long.", col: "#FF0080" },
];

const STEPS = [
  { num: "01", icon: "🔗", title: "Paste Your URL",  desc: "Drop any API endpoint URL — REST, GraphQL, or anything that responds over HTTP." },
  { num: "02", icon: "⚡", title: "We Check It",     desc: "ApiFlux pings your endpoint from multiple global locations and captures every detail." },
  { num: "03", icon: "📊", title: "See Everything",  desc: "Status codes, response times, headers, uptime history — one clean dashboard." },
];

const ENDPOINTS = [
  { name: "Auth Service",    url: "/api/v2/auth/health",    ms: 38,  status: 200, up: true  },
  { name: "User API",        url: "/api/v2/users/status",   ms: 64,  status: 200, up: true  },
  { name: "Payment Gateway", url: "/api/v2/payments/ping",  ms: 0,   status: 503, up: false },
  { name: "Search Engine",   url: "/api/v2/search/health",  ms: 112, status: 200, up: true  },
  { name: "File Storage",    url: "/api/v2/storage/status", ms: 29,  status: 200, up: true  },
];

const BG_ICONS = [
  { x:7,  y:10, s:36, d:20, dl:0,  i:"⚡" }, { x:88, y:7,  s:26, d:24, dl:4,  i:"📊" },
  { x:3,  y:55, s:22, d:18, dl:7,  i:"🌍" }, { x:93, y:45, s:28, d:22, dl:2,  i:"🔗" },
  { x:45, y:3,  s:20, d:26, dl:10, i:"📋" }, { x:75, y:80, s:24, d:19, dl:5,  i:"🔁" },
  { x:20, y:82, s:18, d:23, dl:8,  i:"⚙️" }, { x:60, y:12, s:16, d:17, dl:13, i:"💻" },
  { x:92, y:72, s:20, d:21, dl:3,  i:"🕓" }, { x:30, y:25, s:14, d:28, dl:15, i:"🚀" },
  { x:55, y:90, s:18, d:16, dl:6,  i:"📡" }, { x:12, y:38, s:16, d:25, dl:11, i:"🔍" },
];

const CHART_RAW = [0,8,3,15,7,22,12,6,19,4,24,11,18,5,14,9,21,3,17,8,25,6,13,19,4,22,10,16,2,20];
function toPath(pts, H=56) {
  const W=600, max=Math.max(...pts);
  const ys=pts.map(p=>H-(p/max)*(H-6));
  const step=W/(pts.length-1);
  let d=`M 0 ${ys[0]}`;
  for(let i=1;i<ys.length;i++){const cx=(i-.5)*step;d+=` C ${cx} ${ys[i-1]}, ${cx} ${ys[i]}, ${i*step} ${ys[i]}`;}
  return d;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [termLines, setTermLines] = useState([]);
  const termRef = useRef(null);
  const chartPath = toPath(CHART_RAW);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const lines = [
      { t:"$ apiflux check https://api.yourapp.com/health", type:"cmd",  ms:350  },
      { t:"→ Sending from 12 regions…",                    type:"info", ms:1000 },
      { t:"✓ US-East    200 OK   38ms",                    type:"ok",   ms:1700 },
      { t:"✓ EU-West    200 OK   54ms",                    type:"ok",   ms:2200 },
      { t:"✓ AP-South   200 OK   89ms",                    type:"ok",   ms:2700 },
      { t:"✓ All 12 regions passed",                       type:"ok",   ms:3300 },
      { t:"◉ Dashboard → app.apiflux.dev/d/xyz",           type:"brand",ms:4100 },
    ];
    lines.forEach(({t,type,ms})=>setTimeout(()=>setTermLines(p=>[...p,{t,type}]),ms));
  }, []);

  useEffect(()=>{
    if(termRef.current) termRef.current.scrollTop=termRef.current.scrollHeight;
  },[termLines]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg-deep:       #0B0F19;
          --bg-surface:    #151B2B;
          --bg-elevated:   #1E2738;
          --cyan:          #00F0FF;
          --magenta:       #FF0080;
          --violet:        #8B5CF6;
          --text-primary:  #F8FAFC;
          --text-secondary:#94A3B8;
          --text-tertiary: #64748B;
          --border:        rgba(148,163,184,0.1);
          --glow-cyan:     rgba(0,240,255,0.2);
          --glow-magenta:  rgba(255,0,128,0.15);
        }
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{font-family:'Outfit',sans-serif;background:var(--bg-deep);color:var(--text-primary);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
        ::selection{background:rgba(0,240,255,.2);color:#00F0FF;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(0,240,255,.25);border-radius:2px;}
        a{text-decoration:none;color:inherit;}

        /* ── Keyframes ── */
        @keyframes bgShift{0%,100%{transform:translate(0,0) rotate(0deg);}33%{transform:translate(4%,-4%) rotate(4deg);}66%{transform:translate(-4%,4%) rotate(-4deg);}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg);opacity:.055;}40%{transform:translateY(-20px) rotate(5deg);opacity:.10;}70%{transform:translateY(10px) rotate(-3deg);opacity:.065;}}
        @keyframes flowBorder{0%{background-position:0% 50%;}100%{background-position:300% 50%;}}
        @keyframes logoFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes glowPulse{0%,100%{box-shadow:0 8px 24px var(--glow-cyan),0 0 0 1px rgba(255,255,255,.08);}50%{box-shadow:0 12px 36px rgba(0,240,255,.4),0 0 0 1px rgba(255,255,255,.12);}}
        @keyframes cardIn{from{opacity:0;transform:translateY(28px) scale(.97);}to{opacity:1;transform:none;}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes dotPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.8);}}
        @keyframes scanH{0%{transform:translateX(-100%);}100%{transform:translateX(100vw);}}
        @keyframes spinFwd{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes spinRev{from{transform:rotate(0deg);}to{transform:rotate(-360deg);}}
        @keyframes shimmer{from{background-position:-400px 0;}to{background-position:400px 0;}}

        .s1{animation:fadeSlide .8s ease .05s both;}
        .s2{animation:fadeSlide .8s ease .2s  both;}
        .s3{animation:fadeSlide .8s ease .35s both;}
        .s4{animation:fadeSlide .8s ease .5s  both;}
        .s5{animation:fadeSlide .8s ease .65s both;}

        /* ── Nav link underline trick ── */
        .nav-lnk{font-size:14px;font-weight:500;color:var(--text-tertiary);position:relative;transition:color .2s;}
        .nav-lnk::after{content:'';position:absolute;bottom:-5px;left:0;right:0;height:1px;background:linear-gradient(90deg,var(--cyan),var(--magenta));transform:scaleX(0);transition:transform .25s;}
        .nav-lnk:hover{color:var(--text-primary);}.nav-lnk:hover::after{transform:scaleX(1);}

        /* ── Feature card ── */
        .fcard{background:var(--bg-surface);border:1px solid var(--border);border-radius:20px;padding:28px 24px;
          position:relative;overflow:hidden;transition:all .35s cubic-bezier(.4,0,.2,1);cursor:default;backdrop-filter:blur(12px);}
        .fcard:hover{transform:translateY(-6px);box-shadow:0 24px 56px rgba(0,0,0,.55);}
        .fcard-bar{position:absolute;top:0;left:0;right:0;height:1px;opacity:0;transition:opacity .3s;background:linear-gradient(90deg,transparent,var(--c),transparent);}
        .fcard:hover .fcard-bar{opacity:1;}
        .fcard:hover{border-color:rgba(var(--cr),0.22);}

        /* ── Step card ── */
        .scard{background:var(--bg-surface);border:1px solid var(--border);border-radius:20px;padding:34px 28px;
          position:relative;overflow:hidden;transition:all .3s;backdrop-filter:blur(12px);}
        .scard:hover{transform:translateY(-5px);border-color:rgba(0,240,255,.18);}

        /* ── Endpoint row ── */
        .ep-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;
          background:rgba(11,15,25,.7);border-radius:10px;border:1px solid var(--border);transition:all .25s;}
        .ep-row:hover{border-color:rgba(0,240,255,.14);background:rgba(0,240,255,.02);}

        /* ── Buttons (mirrors Login's submit-btn) ── */
        .btn-p{padding:13px 30px;border-radius:12px;border:none;
          background:linear-gradient(135deg,var(--cyan),var(--magenta));
          color:var(--bg-deep);font-size:15px;font-weight:600;font-family:'Outfit',sans-serif;
          cursor:pointer;display:inline-flex;align-items:center;gap:8px;
          box-shadow:0 4px 16px var(--glow-cyan);
          position:relative;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);}
        .btn-p::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);transition:left .5s;}
        .btn-p:hover{transform:translateY(-3px);box-shadow:0 8px 28px var(--glow-cyan);}
        .btn-p:hover::before{left:100%;}

        .btn-g{padding:13px 28px;border-radius:12px;border:1px solid var(--border);
          color:var(--text-secondary);font-size:15px;font-weight:500;font-family:'Outfit',sans-serif;
          background:transparent;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .3s;}
        .btn-g:hover{border-color:rgba(0,240,255,.28);color:var(--text-primary);}

        @media(max-width:768px){
          .d-nav,.d-cta{display:none!important;}
          .ham{display:flex!important;}
          .hero-ctas{flex-direction:column;align-items:stretch!important;}
          .hero-ctas .btn-p,.hero-ctas .btn-g{justify-content:center;}
          .stat-grid{grid-template-columns:repeat(2,1fr)!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .step-grid{grid-template-columns:1fr!important;}
          .dash-body{grid-template-columns:1fr!important;}
          .ft-inner{flex-direction:column!important;}
          .ft-cols{flex-wrap:wrap!important;gap:24px!important;}
        }
        @media(max-width:480px){
          .stat-grid{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      {/* ── Fixed bg: animated radial mesh (same as Login ::before) ── */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background:`radial-gradient(circle at 20% 30%, var(--glow-cyan, rgba(0,240,255,.2)) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, var(--glow-magenta, rgba(255,0,128,.15)) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(139,92,246,.1) 0%, transparent 50%)`,
        animation:"bgShift 20s ease-in-out infinite",
      }}/>
      {/* Grid overlay (same as Login ::after) */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:.3,
        backgroundImage:`linear-gradient(rgba(148,163,184,.1) 1px, transparent 1px),linear-gradient(90deg, rgba(148,163,184,.1) 1px, transparent 1px)`,
        backgroundSize:"50px 50px",
      }}/>

      {/* Spinning decorative rings */}
      <div style={{ position:"fixed",right:"-110px",top:"10%",zIndex:0,pointerEvents:"none",opacity:.05 }}>
        <div style={{ width:320,height:320,borderRadius:"50%",border:"1px solid #00F0FF",animation:"spinFwd 45s linear infinite" }}/>
        <div style={{ position:"absolute",inset:44,borderRadius:"50%",border:"1px dashed rgba(255,0,128,.6)",animation:"spinRev 28s linear infinite" }}/>
        <div style={{ position:"absolute",inset:88,borderRadius:"50%",border:"1px solid rgba(139,92,246,.5)",animation:"spinFwd 20s linear infinite" }}/>
      </div>
      <div style={{ position:"fixed",left:"-70px",bottom:"18%",zIndex:0,pointerEvents:"none",opacity:.04 }}>
        <div style={{ width:240,height:240,borderRadius:"50%",border:"1px dashed #8B5CF6",animation:"spinRev 38s linear infinite" }}/>
      </div>

      {/* Horizontal scan line */}
      <div style={{ position:"fixed",top:"32%",left:0,right:0,height:1,zIndex:0,pointerEvents:"none",
        background:"linear-gradient(90deg,transparent,rgba(0,240,255,.05) 50%,transparent)",
        animation:"scanH 14s linear infinite" }}/>

      {/* Floating bg icons */}
      <div style={{ position:"fixed",inset:0,zIndex:1,pointerEvents:"none",overflow:"hidden" }}>
        {BG_ICONS.map((b,i)=>(
          <div key={i} style={{ position:"absolute",left:`${b.x}%`,top:`${b.y}%`,fontSize:b.s,userSelect:"none",
            animation:`float ${b.d}s ease-in-out ${b.dl}s infinite`,filter:"blur(.4px)" }}>{b.i}</div>
        ))}
      </div>

      <div style={{ position:"relative",zIndex:2 }}>

        {/* ════════════════ NAVBAR ════════════════ */}
        <nav style={{
          position:"sticky",top:0,zIndex:200,
          background: scrolled ? "rgba(11,15,25,.92)" : "rgba(11,15,25,.55)",
          backdropFilter:"blur(20px)",
          borderBottom:`1px solid ${scrolled?"rgba(0,240,255,.1)":"rgba(148,163,184,.08)"}`,
          transition:"all .4s",
        }}>
          <div style={{ maxWidth:1140,margin:"0 auto",padding:"0 24px",height:68,display:"flex",alignItems:"center",justifyContent:"space-between" }}>

            {/* Logo — matches Login logo style */}
            <a href="/" style={{ display:"flex",alignItems:"center",gap:12 }}>
              <div style={{
                width:42,height:42,borderRadius:13,
                background:"linear-gradient(135deg,#00F0FF,#FF0080)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:20,fontFamily:"'JetBrains Mono',monospace",fontWeight:500,color:"#0B0F19",
                animation:"glowPulse 3s ease-in-out infinite,logoFloat 3s ease-in-out infinite",
                flexShrink:0,
              }}>⚡</div>
              <div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:20,letterSpacing:"-0.03em",
                  background:"linear-gradient(90deg,#00F0FF,#FF0080)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ApiFlux</div>
                <div style={{ fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#1E3A5F",letterSpacing:".1em",textTransform:"uppercase",lineHeight:1 }}>endpoint checker</div>
              </div>
            </a>

            <div className="d-nav" style={{ display:"flex",alignItems:"center",gap:36 }}>
              {["Features","How it works"].map(l=>(
                <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="nav-lnk">{l}</a>
              ))}
            </div>

            <div className="d-cta" style={{ display:"flex",alignItems:"center",gap:10 }}>
              <a href={userInfo?"/dashboard":"/login"}
                style={{ padding:"8px 18px",borderRadius:10,border:"1px solid rgba(148,163,184,.1)",color:"var(--text-tertiary)",fontSize:13,fontWeight:500,transition:"all .2s",cursor:"pointer",display:"inline-block" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,240,255,.28)";e.currentTarget.style.color="#00F0FF";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(148,163,184,.1)";e.currentTarget.style.color="var(--text-tertiary)";}}>
                {userInfo?"Dashboard":"Sign in"}
              </a>
              <a href={userInfo?"/dashboard":"/register"} className="btn-p" style={{ padding:"9px 22px",fontSize:14,borderRadius:11 }}>{userInfo?"Get Started":"Register"}</a>
            </div>

            <button className="ham" onClick={()=>setMenuOpen(!menuOpen)}
              style={{ display:"none",width:42,height:42,borderRadius:10,border:"1px solid rgba(148,163,184,.1)",
                background:"rgba(255,255,255,.03)",color:"#94A3B8",fontSize:18,cursor:"pointer",alignItems:"center",justifyContent:"center" }}>
              {menuOpen?"✕":"☰"}
            </button>
          </div>

          {menuOpen&&(
            <div style={{ padding:"16px 24px 20px",borderTop:"1px solid rgba(148,163,184,.07)",display:"flex",flexDirection:"column",gap:16 }}>
              {["Features","How it works","Docs"].map(l=>(
                <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} onClick={()=>setMenuOpen(false)}
                  style={{ color:"#94A3B8",fontSize:15,fontWeight:500 }}>{l}</a>
              ))}
              <div style={{ display:"flex",gap:10,marginTop:4 }}>
                <a href="/login" style={{ flex:1,textAlign:"center",padding:"10px",borderRadius:10,border:"1px solid rgba(148,163,184,.1)",color:"#64748B",fontSize:14 }}>Sign in</a>
                <a href="/register" className="btn-p" style={{ flex:1,justifyContent:"center",padding:"10px",borderRadius:10,fontSize:14 }}>Get Started</a>
              </div>
            </div>
          )}
        </nav>


        {/* ════════════════ HERO ════════════════ */}
        <section style={{ maxWidth:1140,margin:"0 auto",padding:"clamp(64px,11vw,128px) 24px 80px",textAlign:"center",position:"relative" }}>

          {/* Ambient glow blob */}
          <div style={{ position:"absolute",top:"-12%",left:"50%",transform:"translateX(-50%)",
            width:"70%",height:400,pointerEvents:"none",
            background:"radial-gradient(ellipse,rgba(0,240,255,.06) 0%,transparent 65%)",filter:"blur(40px)" }}/>

          {/* Badge — same pill style as login status */}
          <div className="s1" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"5px 18px 5px 8px",
            borderRadius:100,marginBottom:36,
            background:"rgba(0,240,255,.07)",border:"1px solid rgba(0,240,255,.18)",
            fontSize:12,fontFamily:"'JetBrains Mono',monospace" }}>
            <span style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:100,
              background:"rgba(0,240,255,.1)",color:"#00F0FF",fontWeight:500 }}>
              <span style={{ width:5,height:5,borderRadius:"50%",background:"#00F0FF",boxShadow:"0 0 8px #00F0FF",
                display:"inline-block",animation:"dotPulse 1.5s ease infinite" }}/>
              LIVE
            </span>
            <span style={{ color:"#64748B" }}>Checking from 12 global regions</span>
          </div>

          {/* Headline */}
          <h1 className="s2" style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,letterSpacing:"-0.04em",
            fontSize:"clamp(40px,8vw,84px)",lineHeight:1.02,marginBottom:28 }}>
            <span style={{ display:"block",color:"#F8FAFC" }}>Check every API</span>
            <span style={{ display:"block",
              background:"linear-gradient(135deg,#00F0FF 0%,#FF0080 50%,#8B5CF6 100%)",
              backgroundSize:"200% 200%",animation:"flowBorder 5s linear infinite",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>endpoint.</span>
            <span style={{ display:"block",color:"rgba(248,250,252,.45)",fontWeight:600,
              fontSize:"clamp(32px,6.5vw,68px)" }}>Know it's alive.</span>
          </h1>

          <p className="s3" style={{ fontSize:"clamp(15px,2vw,18px)",color:"#94A3B8",lineHeight:1.85,
            maxWidth:480,margin:"0 auto 48px",fontWeight:400 }}>
            Paste a URL. See the status, response time, and headers — from anywhere in the world. No code, no setup, no complexity.
          </p>

          <div className="s4 hero-ctas" style={{ display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap" }}>
            <a href="/register" className="btn-p" style={{ fontSize:16,padding:"15px 36px",borderRadius:13 }}>
              Start monitoring free <span style={{fontSize:18}}>→</span>
            </a>
            <a href="#how-it-works" className="btn-g" style={{ fontSize:16,padding:"15px 32px",borderRadius:13 }}>
              See how it works
            </a>
          </div>

          <p className="s5" style={{ marginTop:28,fontSize:12,color:"#334155",fontFamily:"'JetBrains Mono',monospace" }}>
            Free forever · No credit card · 60-second setup
          </p>

          {/* ── Dashboard preview ── */}
          <div className="s5" style={{ marginTop:72,position:"relative" }}>
            <div style={{ position:"absolute",inset:-48,borderRadius:48,pointerEvents:"none",zIndex:0,
              background:"radial-gradient(ellipse at 50% 50%,rgba(0,240,255,.055),transparent 60%)" }}/>

            {/* Card — mirrors Login auth-card style */}
            <div style={{ position:"relative",zIndex:1,
              background:"#151B2B",border:"1px solid rgba(148,163,184,.1)",
              borderRadius:24,overflow:"hidden",
              boxShadow:"0 40px 100px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.02),inset 0 1px 0 rgba(255,255,255,.03)" }}>

              {/* Rainbow top bar — same as auth-card ::before */}
              <div style={{ height:1,background:"linear-gradient(90deg,transparent,#00F0FF,#FF0080,transparent)",opacity:.5 }}/>
              {/* Flowing animated bar on top */}
              <div style={{ height:1,background:"linear-gradient(90deg,#00F0FF,#FF0080,#8B5CF6,#00F0FF)",
                backgroundSize:"200% 100%",animation:"flowBorder 3.5s linear infinite",opacity:.4 }}/>

              {/* Window chrome */}
              <div style={{ display:"flex",alignItems:"center",gap:7,padding:"13px 20px",
                borderBottom:"1px solid rgba(148,163,184,.08)",background:"rgba(21,27,43,.8)" }}>
                {["#FF5F57","#FFBD2E","#28CA41"].map((c,i)=><div key={i} style={{ width:11,height:11,borderRadius:"50%",background:c }}/>)}
                <div style={{ flex:1,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#334155" }}>
                  app.apiflux.dev · Dashboard
                </div>
                <div style={{ padding:"2px 10px",borderRadius:100,background:"rgba(0,240,255,.07)",border:"1px solid rgba(0,240,255,.18)",
                  fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#00F0FF",display:"flex",alignItems:"center",gap:5 }}>
                  <span style={{ width:5,height:5,borderRadius:"50%",background:"#00F0FF",display:"inline-block",animation:"dotPulse 1.5s ease infinite" }}/>
                  LIVE
                </div>
              </div>

              {/* Dashboard body */}
              <div className="dash-body" style={{ padding:"clamp(16px,3vw,26px)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>

                {/* Left: stats + endpoints */}
                <div>
                  <div className="stat-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9,marginBottom:13 }}>
                    {[
                      {l:"ONLINE",  v:"4", c:"#00F0FF"},
                      {l:"DOWN",    v:"1", c:"#FF0080"},
                      {l:"AVG RESP",v:"61ms",c:"#8B5CF6"},
                      {l:"TOTAL",   v:"5", c:"#94A3B8"},
                    ].map(s=>(
                      <div key={s.l} style={{ background:"#1E2738",border:"1px solid rgba(148,163,184,.08)",borderRadius:12,padding:"12px 13px" }}>
                        <div style={{ fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:"#334155",letterSpacing:".12em",marginBottom:6 }}>{s.l}</div>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontSize:"clamp(16px,2.5vw,24px)",fontWeight:800,color:s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    {ENDPOINTS.map((e,i)=>(
                      <div key={i} className="ep-row">
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <span style={{ width:7,height:7,borderRadius:"50%",flexShrink:0,
                            background:e.up?"#22D3EE":"#FF0080",
                            boxShadow:e.up?"0 0 8px rgba(34,211,238,.6)":"0 0 8px rgba(255,0,128,.6)",
                            animation:"dotPulse 2s ease infinite" }}/>
                          <div>
                            <div style={{ fontSize:"clamp(11px,1.4vw,13px)",fontWeight:500,color:"#F8FAFC" }}>{e.name}</div>
                            <div style={{ fontSize:"clamp(8px,1vw,10px)",fontFamily:"'JetBrains Mono',monospace",color:"#334155" }}>{e.url}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <span style={{ fontSize:"clamp(9px,1.1vw,11px)",fontFamily:"'JetBrains Mono',monospace",color:"#475569" }}>
                            {e.up?e.ms+"ms":"—"}
                          </span>
                          <span style={{ padding:"2px 9px",borderRadius:100,fontSize:"clamp(8px,1vw,10px)",fontWeight:700,
                            fontFamily:"'JetBrains Mono',monospace",
                            background:e.up?"rgba(0,240,255,.08)":"rgba(255,0,128,.08)",
                            border:`1px solid ${e.up?"rgba(0,240,255,.22)":"rgba(255,0,128,.22)"}`,
                            color:e.up?"#00F0FF":"#FF0080" }}>{e.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: chart + terminal */}
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  {/* Chart */}
                  <div style={{ background:"#1E2738",border:"1px solid rgba(148,163,184,.08)",borderRadius:14,padding:"14px 16px 8px",flex:1 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                      <span style={{ fontSize:11,color:"#64748B",fontWeight:600 }}>Response latency — 24h</span>
                      <span style={{ fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#00F0FF" }}>avg 61ms</span>
                    </div>
                    <svg viewBox="0 0 600 66" style={{ width:"100%",height:52 }} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00F0FF" stopOpacity=".2"/>
                          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0"/>
                        </linearGradient>
                        <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#00F0FF"/>
                          <stop offset="55%" stopColor="#FF0080"/>
                          <stop offset="100%" stopColor="#8B5CF6"/>
                        </linearGradient>
                      </defs>
                      {[16,33,50].map(y=><line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,.03)" strokeWidth="1"/>)}
                      <path d={`${chartPath} L600,66 L0,66 Z`} fill="url(#chartFill)"/>
                      <path d={chartPath} fill="none" stroke="url(#chartLine)" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="580" cy="28" r="4" fill="#00F0FF">
                        <animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="580" cy="28" r="4" fill="none" stroke="rgba(0,240,255,.35)" strokeWidth="1">
                        <animate attributeName="r" values="5;11;5" dur="1.4s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values=".6;0;.6" dur="1.4s" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  </div>

                  {/* Terminal */}
                  <div style={{ background:"#0B0F19",border:"1px solid rgba(0,240,255,.1)",borderRadius:14,overflow:"hidden" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 13px",
                      borderBottom:"1px solid rgba(148,163,184,.07)",background:"rgba(21,27,43,.8)" }}>
                      {["#FF5F57","#FFBD2E","#28CA41"].map((c,i)=><div key={i} style={{ width:9,height:9,borderRadius:"50%",background:c }}/>)}
                      <span style={{ fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#334155",marginLeft:6 }}>Terminal</span>
                    </div>
                    <div ref={termRef} style={{ padding:"11px 13px",fontFamily:"'JetBrains Mono',monospace",
                      fontSize:"clamp(9px,1.1vw,11px)",lineHeight:1.9,maxHeight:140,overflowY:"auto" }}>
                      {termLines.map((l,i)=>(
                        <div key={i} style={{ color:
                          l.type==="cmd"?"#94A3B8":
                          l.type==="ok"?"#00F0FF":
                          l.type==="brand"?"#FF0080":
                          "#64748B" }}>{l.t}</div>
                      ))}
                      {termLines.length<7&&<span style={{ color:"#00F0FF",animation:"dotPulse 1s infinite" }}>▋</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ════════════════ STATS ════════════════ */}
        <section style={{ maxWidth:1140,margin:"0 auto",padding:"0 24px 80px" }}>
          <div className="stat-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",
            background:"rgba(0,240,255,.03)",border:"1px solid rgba(0,240,255,.08)",borderRadius:20,overflow:"hidden" }}>
            {[{v:"99.9%",l:"Uptime SLA"},{v:"<30s",l:"Check Interval"},{v:"12+",l:"Global Regions"},{v:"2M+",l:"Checks / Day"}].map((s,i)=>(
              <div key={i} style={{ padding:"clamp(16px,3vw,26px) 14px",textAlign:"center",
                borderRight:i<3?"1px solid rgba(0,240,255,.06)":"none",
                transition:"background .25s",cursor:"default" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(0,240,255,.03)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(22px,4vw,40px)",letterSpacing:"-0.04em",
                  background:"linear-gradient(135deg,#00F0FF,#FF0080)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6 }}>{s.v}</div>
                <div style={{ fontSize:11,color:"#334155",fontFamily:"'JetBrains Mono',monospace" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ════════════════ FEATURES ════════════════ */}
        <section id="features" style={{ maxWidth:1140,margin:"0 auto",padding:"40px 24px 80px" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#00F0FF",letterSpacing:".14em",textTransform:"uppercase",marginBottom:14,opacity:.8 }}>// capabilities</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,letterSpacing:"-0.035em",
              fontSize:"clamp(26px,5vw,48px)",color:"#F8FAFC",marginBottom:14 }}>
              Everything you need.<br/>Nothing you don't.
            </h2>
            <p style={{ fontSize:15,color:"#64748B",maxWidth:420,margin:"0 auto",lineHeight:1.85 }}>
              Deep endpoint visibility without enterprise complexity or bloated dashboards.
            </p>
          </div>

          <div className="feat-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
            {FEATURES.map((f,i)=>(
              <FeatureCard key={i} f={f}/>
            ))}
          </div>
        </section>


        {/* ════════════════ HOW IT WORKS ════════════════ */}
        <section id="how-it-works" style={{ maxWidth:1140,margin:"0 auto",padding:"40px 24px 80px" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#FF0080",letterSpacing:".14em",textTransform:"uppercase",marginBottom:14,opacity:.8 }}>// how it works</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,letterSpacing:"-0.035em",
              fontSize:"clamp(26px,5vw,48px)",color:"#F8FAFC" }}>
              Live in 3 steps
            </h2>
          </div>

          <div className="step-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:16 }}>
            {STEPS.map((s,i)=>(
              <div key={i} className="scard">
                {/* watermark number */}
                <div style={{ position:"absolute",top:16,right:22,fontFamily:"'Outfit',sans-serif",fontWeight:800,
                  fontSize:88,lineHeight:1,letterSpacing:"-0.06em",color:"rgba(0,240,255,.025)",userSelect:"none",pointerEvents:"none" }}>{s.num}</div>

                <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:22 }}>
                  {/* icon box — same styling as login logo */}
                  <div style={{ width:52,height:52,borderRadius:14,flexShrink:0,
                    background:"linear-gradient(135deg,rgba(0,240,255,.1),rgba(255,0,128,.07))",
                    border:"1px solid rgba(0,240,255,.15)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#334155",letterSpacing:".08em" }}>STEP {s.num}</div>
                </div>

                <h3 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:21,color:"#F8FAFC",marginBottom:10,letterSpacing:"-0.02em" }}>{s.title}</h3>
                <p style={{ fontSize:14,color:"#64748B",lineHeight:1.85 }}>{s.desc}</p>

                {i<STEPS.length-1&&(
                  <div style={{ marginTop:24,display:"flex",alignItems:"center",gap:8,fontSize:12,
                    color:"rgba(0,240,255,.2)",fontFamily:"'JetBrains Mono',monospace" }}>
                    <div style={{ flex:1,height:1,background:"linear-gradient(90deg,rgba(0,240,255,.18),transparent)" }}/>
                    then
                    <div style={{ flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(0,240,255,.18))" }}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* ════════════════ CTA ════════════════ */}
        <section style={{ maxWidth:1140,margin:"0 auto",padding:"10px 24px 100px" }}>
          {/* mirrors auth-card exactly */}
          <div style={{ position:"relative",background:"#151B2B",border:"1px solid rgba(148,163,184,.1)",
            borderRadius:24,overflow:"hidden",
            padding:"clamp(50px,8vw,90px) clamp(24px,5vw,70px)",textAlign:"center",
            boxShadow:"0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.02),inset 0 1px 0 rgba(255,255,255,.03)" }}>

            {/* auth-card glow bar */}
            <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
              background:"linear-gradient(90deg,transparent,#00F0FF,#FF0080,transparent)",opacity:.5 }}/>
            <div style={{ position:"absolute",top:1,left:0,right:0,height:1,
              background:"linear-gradient(90deg,#00F0FF,#FF0080,#8B5CF6,#00F0FF)",
              backgroundSize:"200% 100%",animation:"flowBorder 3.5s linear infinite",opacity:.35 }}/>

            {/* Background glow */}
            <div style={{ position:"absolute",top:-60,left:"50%",transform:"translateX(-50%)",
              width:"70%",height:260,pointerEvents:"none",
              background:"radial-gradient(ellipse,rgba(0,240,255,.07),transparent 65%)",filter:"blur(30px)" }}/>

            {/* Floating icons */}
            {[{t:"8%",l:"3%",i:"⚡",s:32},{t:"65%",l:"2%",i:"📊",s:24},{t:"10%",l:"93%",i:"🌍",s:28},{t:"68%",l:"92%",i:"🔗",s:22}].map((p,k)=>(
              <div key={k} style={{ position:"absolute",top:p.t,left:p.l,fontSize:p.s,opacity:.07,pointerEvents:"none",
                animation:`float ${16+k*5}s ease-in-out ${k*4}s infinite` }}>{p.i}</div>
            ))}

            <div style={{ position:"relative",zIndex:1 }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#00F0FF",letterSpacing:".14em",textTransform:"uppercase",marginBottom:18,opacity:.8 }}>// get started</div>
              <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,
                fontSize:"clamp(26px,5vw,52px)",letterSpacing:"-0.04em",color:"#F8FAFC",marginBottom:16,lineHeight:1.07 }}>
                Your endpoints.<br/>Always in sight.
              </h2>
              <p style={{ fontSize:15,color:"#64748B",maxWidth:380,margin:"0 auto 40px",lineHeight:1.85 }}>
                Start checking any API endpoint right now. Free, no setup, no noise.
              </p>
              <div style={{ display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap" }}>
                <a href={userInfo?"/dashboard":"/register"} className="btn-p" style={{ fontSize:16,padding:"15px 38px",borderRadius:13 }}>
                {userInfo?"Start monitoring free":"Register now"} <span style={{fontSize:18}}>→</span>
                </a>
                <a href="#features" className="btn-g" style={{ fontSize:16,padding:"15px 30px",borderRadius:13 }}>
                  Explore features
                </a>
              </div>
              <p style={{ marginTop:24,fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#1E293B" }}>
                Free forever plan · 5 endpoints · No card required
              </p>
            </div>
          </div>
        </section>


        {/* ════════════════ FOOTER ════════════════ */}
        <footer style={{ borderTop:"1px solid rgba(148,163,184,.07)",padding:"52px 24px 34px" }}>
          <div style={{ maxWidth:1140,margin:"0 auto" }}>
            <div className="ft-inner" style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:44,marginBottom:52 }}>

              <div style={{ maxWidth:240 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
                  <div style={{ width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#00F0FF,#FF0080)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontFamily:"'JetBrains Mono',monospace",fontWeight:500,color:"#0B0F19" }}>⚡</div>
                  <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:19,letterSpacing:"-0.03em",
                    background:"linear-gradient(90deg,#00F0FF,#FF0080)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ApiFlux</span>
                </div>
                <p style={{ fontSize:13,color:"#334155",lineHeight:1.85 }}>
                  Simple, powerful API endpoint monitoring. Know what's alive — at a glance.
                </p>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginTop:18,fontSize:11,color:"#00F0FF",fontFamily:"'JetBrains Mono',monospace" }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:"#00F0FF",boxShadow:"0 0 8px rgba(0,240,255,.7)",display:"inline-block",animation:"dotPulse 2s ease infinite" }}/>
                  All systems operational
                </div>
              </div>

              <div className="ft-cols" style={{ display:"flex",gap:52 }}>
                {[
                  {title:"Product", links:["Features","Changelog","Roadmap","Status"]},
                  {title:"Docs",    links:["Getting started","API reference","Examples","Integrations"]},
                  {title:"Company", links:["About","Blog","Careers","Contact"]},
                ].map(col=>(
                  <div key={col.title}>
                    <div style={{ fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#334155",
                      letterSpacing:".12em",textTransform:"uppercase",marginBottom:18,fontWeight:500 }}>{col.title}</div>
                    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                      {col.links.map(l=><FLink key={l} l={l}/>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop:"1px solid rgba(148,163,184,.06)",paddingTop:22,
              display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
              <span style={{ fontSize:12,color:"#1E293B",fontFamily:"'JetBrains Mono',monospace" }}>© 2026 ApiFlux, Inc.</span>
              <span style={{ fontSize:12,color:"#1E293B" }}>Built for developers who ship ⚡</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function FeatureCard({ f }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="fcard"
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ "--c":f.col }}>
      <div className="fcard-bar"/>
      {/* icon box — styled like Login logo */}
      <div style={{ width:52,height:52,borderRadius:15,marginBottom:22,
        background: hov
          ? f.col==="var(--cyan)"||f.col==="#00F0FF" ? "rgba(0,240,255,.09)"
          : f.col==="#FF0080" ? "rgba(255,0,128,.09)"
          : "rgba(139,92,246,.09)"
          : "#1E2738",
        border:`1px solid ${hov
          ? f.col==="var(--cyan)"||f.col==="#00F0FF" ? "rgba(0,240,255,.22)"
          : f.col==="#FF0080" ? "rgba(255,0,128,.22)"
          : "rgba(139,92,246,.22)"
          : "rgba(148,163,184,.08)"}`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
        transition:"all .3s",
        boxShadow: hov
          ? f.col==="#00F0FF" ? "0 0 16px rgba(0,240,255,.2)"
          : f.col==="#FF0080" ? "0 0 16px rgba(255,0,128,.2)"
          : "0 0 16px rgba(139,92,246,.2)"
          : "none",
      }}>{f.icon}</div>
      <h3 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,color:"#F8FAFC",marginBottom:10,letterSpacing:"-0.02em" }}>{f.title}</h3>
      <p style={{ fontSize:14,color:"#64748B",lineHeight:1.85 }}>{f.desc}</p>
    </div>
  );
}

function FLink({ l }) {
  const [h,setH]=useState(false);
  return (
    <a href="#" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ fontSize:13,color:h?"#00F0FF":"#334155",transition:"color .2s,transform .2s",
        display:"inline-block",transform:h?"translateX(3px)":"none" }}>{l}</a>
  );
}