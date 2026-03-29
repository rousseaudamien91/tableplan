/* eslint-disable */
import { useState } from "react";
import { C, useI18n } from "../theme";
import { LANG_FLAGS, LANG_NAMES } from "../constants";

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN — Page d'accueil / connexion
// ═══════════════════════════════════════════════════════════════

function LoginScreen({ onLogin, onGuestLogin, t: tProp }) {
  const { t: tHook, lang, setLang } = useI18n();
  const t = tProp || tHook;
  const [hovered, setHovered] = useState(null);

  const FEATURES = [
    { icon:"🗺️", title: t.loginF1 || "Plan de salle interactif", desc: t.loginF1d || "Glissez-déposez vos tables sur un canvas intuitif" },
    { icon:"💌", title: t.loginF2 || "RSVP & invitations", desc: t.loginF2d || "Suivez les confirmations en temps réel" },
    { icon:"🖨️", title: t.loginF3 || "Exports premium", desc: t.loginF3d || "PDF, chevalets imprimables, QR codes invités" },
    { icon:"🤖", title: t.loginF4 || "IA proactive", desc: t.loginF4d || "Un assistant qui analyse et guide votre événement" },
  ];

  const TRUST = [t.loginTrust1||"Mariages", t.loginTrust2||"Galas", t.loginTrust3||"Conférences", t.loginTrust4||"Corporate"];

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d14", fontFamily:"'Inter','Segoe UI',sans-serif", color:"#ffffff", overflowX:"hidden" }}>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", padding:"0 40px", height:64, background:"rgba(13,13,20,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(201,151,58,0.2)" }}>
        <span style={{ fontSize:20, fontWeight:800, letterSpacing:.5, color:"#F0C97A" }}>TableMaître</span>
        <div style={{ flex:1 }}/>
        {/* Sélecteur de langue — visible et accessible */}
        <div style={{ display:"flex", gap:4, marginRight:20, background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"5px 8px", border:"1px solid rgba(255,255,255,0.12)" }}>
          {Object.entries(LANG_FLAGS).map(([lk, flag]) => (
            <button key={lk} onClick={()=>setLang(lk)} title={LANG_NAMES[lk]} style={{
              background: lang===lk ? "linear-gradient(135deg,#C9973A,#F0C97A)" : "transparent",
              border:"none", borderRadius:8, padding:"4px 10px", cursor:"pointer",
              fontSize:18, transition:"all .2s",
              opacity: lang===lk ? 1 : 0.55,
              transform: lang===lk ? "scale(1.15)" : "scale(1)",
              lineHeight:1,
            }}>{flag}</button>
          ))}
        </div>
        <button onClick={onLogin} style={{ padding:"9px 22px", background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:99, cursor:"pointer", color:"#0d0d14", fontWeight:800, fontSize:13, letterSpacing:.5, whiteSpace:"nowrap" }}>
          {t.loginGoogle || "Se connecter avec Google"}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", textAlign:"center" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:700, background:"radial-gradient(ellipse, rgba(201,151,58,0.13) 0%, transparent 65%)", pointerEvents:"none", borderRadius:"50%" }}/>
        <div style={{ position:"relative", maxWidth:740, margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,151,58,0.12)", border:"1px solid rgba(201,151,58,0.4)", borderRadius:99, padding:"7px 20px", marginBottom:36, fontSize:12, color:"#F0C97A", letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#C9973A", display:"inline-block" }}/>
            {t.loginTagline || "La plateforme pro de gestion d'événements"}
          </div>
          <h1 style={{ fontSize:"clamp(40px,6vw,72px)", fontWeight:800, lineHeight:1.08, letterSpacing:-1.5, margin:"0 0 24px", color:"#ffffff", fontFamily:"Georgia,'Palatino Linotype',serif" }}>
            {t.loginHero || "Organisez. Placez. Impressionnez."}
          </h1>
          <p style={{ fontSize:18, color:"rgba(255,255,255,0.6)", maxWidth:520, margin:"0 auto 48px", lineHeight:1.75 }}>
            {t.loginSub || "De l'invitation à la salle, gérez chaque détail de votre événement depuis une seule application."}
          </p>
          <button onClick={onLogin} style={{ display:"inline-flex", alignItems:"center", gap:12, padding:"18px 44px", background:"linear-gradient(135deg,#C9973A 0%,#F0C97A 100%)", border:"none", borderRadius:99, cursor:"pointer", color:"#0d0d14", fontWeight:800, fontSize:17, letterSpacing:.3, boxShadow:"0 8px 40px rgba(201,151,58,0.4)", transition:"transform .2s, box-shadow .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 16px 56px rgba(201,151,58,0.55)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 8px 40px rgba(201,151,58,0.4)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {t.loginGoogle || "Se connecter avec Google"}
          </button>

          {/* Séparateur */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"8px 0", width:"100%", maxWidth:320, margin:"8px auto" }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", letterSpacing:1 }}>OU</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }}/>
          </div>

          {/* Bouton Guest */}
          <button onClick={onGuestLogin} style={{
            display:"inline-flex", alignItems:"center", gap:10,
            padding:"14px 36px", background:"transparent",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:99,
            cursor:"pointer", color:"rgba(255,255,255,0.7)",
            fontWeight:600, fontSize:15, fontFamily:"inherit",
            transition:"all .2s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
          >
            👤 Essayer en mode démo
          </button>
          <p style={{ marginTop:8, fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:.5 }}>
            ⚠️ Mode démo — 5 invités max · Aucune donnée sauvegardée
          </p>

        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"80px 24px", background:"rgba(255,255,255,0.025)", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:1040, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:20 }}>
          {FEATURES.map((f,i) => (
            <div key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)} style={{ background: hovered===i?"rgba(201,151,58,0.1)":"rgba(255,255,255,0.04)", border: hovered===i?"1px solid rgba(201,151,58,0.5)":"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"28px 24px", transition:"all .25s" }}>
              <div style={{ fontSize:34, marginBottom:14, lineHeight:1 }}>{f.icon}</div>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 8px", color: hovered===i?"#F0C97A":"#ffffff" }}>{f.title}</h3>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:"48px 24px", textAlign:"center", background:"rgba(201,151,58,0.03)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:800, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:32 }}>
          {[
            { val:"12 000+", label:"Événements organisés" },
            { val:"98%",     label:"Clients satisfaits" },
            { val:"2 min",   label:"Pour créer votre plan" },
          ].map(s=>(
            <div key={s.label}>
              <div style={{ fontSize:36, fontWeight:800, color:"#C9973A", fontFamily:"Georgia,serif" }}>{s.val}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>



      {/* TRUST */}
      <section style={{ padding:"56px 24px", textAlign:"center" }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:3, textTransform:"uppercase", marginBottom:20, fontWeight:600 }}>
          {t.trustedFor || "Nos clients organisent"}
        </p>
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10 }}>
          {TRUST.map((label,i) => (
            <span key={i} style={{ padding:"9px 22px", border:"1px solid rgba(201,151,58,0.3)", borderRadius:99, fontSize:13, color:"rgba(255,255,255,0.65)", letterSpacing:.5 }}>{label}</span>
          ))}
        </div>
      </section>

      <ReviewsSection />

      {/* FAQ */}
      <section style={{ padding:"64px 24px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <h2 style={{ textAlign:"center", fontSize:26, fontWeight:800, margin:"0 0 36px", color:"#ffffff", fontFamily:"Georgia,serif" }}>Questions fréquentes</h2>
          {[
            { q:"Mes données sont-elles sécurisées ?", r:"Oui. Toutes vos données sont chiffrées et sauvegardées sur Firebase (Google). Vous pouvez exporter ou supprimer vos données à tout moment." },
            { q:"Puis-je collaborer avec mon équipe ?", r:"Oui, la fonctionnalité multi-utilisateurs est disponible sur le plan Pro. Partagez l'accès à votre événement avec vos co-organisateurs." },
            { q:"Que se passe-t-il après le palier d'invités ?", r:"L'application vous propose simplement de choisir une formule adaptée. Vous pouvez continuer à utiliser TableMaître librement jusqu'à 10 invités." },
            { q:"Puis-je importer ma liste depuis Excel ?", r:"Oui ! TableMaître supporte l'import de fichiers .xlsx, .xls et .csv. Les colonnes (nom, email, régime...) sont détectées automatiquement." },
          ].map((faq,i)=>(
            <details key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"16px 0" }}>
              <summary style={{ fontSize:15, fontWeight:600, color:"#ffffff", cursor:"pointer", listStyle:"none", display:"flex", justifyContent:"space-between" }}>
                {faq.q} <span style={{ color:"#C9973A" }}>+</span>
              </summary>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.7, margin:"12px 0 0", paddingRight:20 }}>{faq.r}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
