/* eslint-disable */
import { useState } from "react";
import { useI18n } from "../i18n";
import { LANG_FLAGS, LANG_NAMES } from "../constants";

function LoginScreen({ onLogin, onGuestLogin, t: tProp }) {
  const { t: tHook, lang, setLang } = useI18n();
  const t = tProp || tHook;
  const [hovered, setHovered] = useState(null);

  const FEATURES = [
    { icon:"🗺️", title:t.loginF1,  desc:t.loginF1d },
    { icon:"💌", title:t.loginF2,  desc:t.loginF2d },
    { icon:"🖨️", title:t.loginF3,  desc:t.loginF3d },
    { icon:"🤖", title:t.loginF4,  desc:t.loginF4d },
  ];

  const TRUST = [
    t.loginTrust1,
    t.loginTrust2,
    t.loginTrust3,
    t.loginTrust4,
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d14", color:"#fff", fontFamily:"Inter, sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, height:64,
        display:"flex", alignItems:"center", padding:"0 40px",
        background:"rgba(13,13,20,0.9)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(201,151,58,0.2)", zIndex:100
      }}>
        <span style={{ fontSize:20, fontWeight:800, color:"#F0C97A" }}>
          {t.appName}
        </span>

        <div style={{ flex:1 }}/>

        {/* Lang selector */}
        <div style={{
          display:"flex", gap:4, marginRight:20,
          background:"rgba(255,255,255,0.08)", borderRadius:12,
          padding:"5px 8px", border:"1px solid rgba(255,255,255,0.12)"
        }}>
          {Object.entries(LANG_FLAGS).map(([lk, flag]) => (
            <button key={lk} onClick={()=>setLang(lk)} title={LANG_NAMES[lk]}
              style={{
                background: lang===lk ? "linear-gradient(135deg,#C9973A,#F0C97A)" : "transparent",
                border:"none", borderRadius:8, padding:"4px 10px",
                cursor:"pointer", fontSize:18,
                opacity: lang===lk ? 1 : 0.55,
                transform: lang===lk ? "scale(1.15)" : "scale(1)",
                transition:"all .2s"
              }}>
              {flag}
            </button>
          ))}
        </div>

        <button onClick={onLogin} style={{
          padding:"9px 22px", borderRadius:99, border:"none",
          background:"linear-gradient(135deg,#C9973A,#F0C97A)",
          color:"#0d0d14", fontWeight:800, fontSize:13
        }}>
          {t.loginGoogle}
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        justifyContent:"center", alignItems:"center",
        padding:"140px 24px 80px", textAlign:"center", position:"relative"
      }}>
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          width:800, height:800, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(201,151,58,0.15) 0%, transparent 70%)",
          pointerEvents:"none"
        }}/>

        <p style={{
          fontSize:14, letterSpacing:4, textTransform:"uppercase",
          color:"rgba(255,255,255,0.45)", marginBottom:12
        }}>
          {t.loginSubtitle}
        </p>

        <h1 style={{
          fontSize:"clamp(42px,6vw,78px)", fontWeight:800,
          fontFamily:"Georgia, serif", marginBottom:20
        }}>
          {t.loginHero}
        </h1>

        <p style={{
          maxWidth:520, fontSize:18, lineHeight:1.7,
          color:"rgba(255,255,255,0.65)", marginBottom:40
        }}>
          {t.loginSub}
        </p>

        {/* CTA Google */}
        <button onClick={onLogin} style={{
          padding:"18px 44px", borderRadius:99, border:"none",
          background:"linear-gradient(135deg,#C9973A,#F0C97A)",
          color:"#0d0d14", fontWeight:800, fontSize:17,
          boxShadow:"0 8px 40px rgba(201,151,58,0.4)",
          marginBottom:20
        }}>
          {t.loginCta}
        </button>

        {/* DEMO BUTTON */}
        <button
          onClick={onGuestLogin}
          style={{
            padding:"14px 36px",
            borderRadius:99,
            background:"rgba(201,151,58,0.12)",
            border:"1px solid rgba(201,151,58,0.55)",
            color:"#ffffff",
            fontWeight:600,
            backdropFilter:"blur(4px)",
            transition:"all .25s",
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.background="rgba(201,151,58,0.22)";
            e.currentTarget.style.borderColor="rgba(201,151,58,0.85)";
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.background="rgba(201,151,58,0.12)";
            e.currentTarget.style.borderColor="rgba(201,151,58,0.55)";
          }}
        >
          {t.loginDemo}
        </button>

        <p style={{ marginTop:10, fontSize:12, color:"rgba(255,255,255,0.35)" }}>
          {t.loginDemoWarning}
        </p>

        <p style={{ marginTop:20, fontSize:13, color:"rgba(255,255,255,0.45)" }}>
          {t.loginFree}
        </p>
      </section>

      {/* TRUST */}
      <section style={{ padding:"40px 24px", textAlign:"center" }}>
        <p style={{
          fontSize:12, letterSpacing:3, textTransform:"uppercase",
          color:"rgba(255,255,255,0.35)", marginBottom:20
        }}>
          {t.trustedFor}
        </p>

        <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
          {TRUST.map((label,i)=>(
            <span key={i} style={{
              padding:"8px 20px", borderRadius:99,
              border:"1px solid rgba(201,151,58,0.3)",
              color:"rgba(255,255,255,0.7)", fontSize:13
            }}>
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{
        padding:"80px 24px",
        background:"rgba(255,255,255,0.02)",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        borderBottom:"1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{
          maxWidth:1040, margin:"0 auto",
          display:"grid", gap:20,
          gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))"
        }}>
          {FEATURES.map((f,i)=>(
            <div key={i}
              onMouseEnter={()=>setHovered(i)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                padding:"28px 24px", borderRadius:16,
                background:hovered===i ? "rgba(201,151,58,0.1)" : "rgba(255,255,255,0.04)",
                border:hovered===i ? "1px solid rgba(201,151,58,0.5)" : "1px solid rgba(255,255,255,0.08)",
                transition:"all .25s"
              }}>
              <div style={{ fontSize:34, marginBottom:12 }}>{f.icon}</div>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{
        padding:"80px 24px", textAlign:"center",
        background:"rgba(255,255,255,0.02)",
        borderTop:"1px solid rgba(255,255,255,0.05)"
      }}>
        <h2 style={{
          fontSize:26, fontWeight:800,
          fontFamily:"Georgia, serif", marginBottom:12
        }}>
          {t.loginFooterTitle}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:15 }}>
          {t.loginReviewsSoon}
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <h2 style={{
            textAlign:"center", fontSize:28, fontWeight:800,
            marginBottom:40, fontFamily:"Georgia, serif"
          }}>
            FAQ
          </h2>

          {[
            { q:t.savedCloud, r:t.savedAuto },
            { q:t.voucherTitle, r:t.voucherApplied },
            { q:t.loading, r:t.skipToMain },
          ].map((faq,i)=>(
            <details key={i} style={{
              borderBottom:"1px solid rgba(255,255,255,0.08)",
              padding:"16px 0"
            }}>
              <summary style={{
                fontSize:15, fontWeight:600, cursor:"pointer",
                display:"flex", justifyContent:"space-between"
              }}>
                {faq.q} <span style={{ color:"#C9973A" }}>+</span>
              </summary>
              <p style={{
                fontSize:14, color:"rgba(255,255,255,0.6)",
                marginTop:12, lineHeight:1.6
              }}>
                {faq.r}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}

export default LoginScreen;
