/* eslint-disable */
import { useState } from "react";
import { C, useI18n } from "../theme";
import { LANG_FLAGS, LANG_NAMES, THEMES_CONFIG, PLANS } from "../constants";
import { Btn, Badge, Modal, Field, Input, Select } from "./UI";
import { uid } from "../utils";
import VoucherModal from "./VoucherModal";
import PricingPage from "./PricingPage";

// ═══════════════════════════════════════════════════════════════
// DASHBOARD — Liste des événements
// ═══════════════════════════════════════════════════════════════

function Dashboard({ user, events, setEvents, onLogout, onOpenEvent, lightMode, onToggleTheme, t, lang, setLang }) {
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newEv, setNewEv] = useState({ name:"", date:"", type:"mariage" });

  const [globalSearch, setGlobalSearch] = useState("");
  var myEventsRaw = events.filter(function(ev2){ return ev2.ownerId === user.id; });
  var myEvents = !globalSearch ? myEventsRaw : myEventsRaw.filter(function(ev2){
    var q = globalSearch.toLowerCase();
    return ev2.name.toLowerCase().includes(q) ||
      (ev2.date||"").includes(q) ||
      (ev2.guests||[]).some(function(g2){ return g2.name.toLowerCase().includes(q) || (g2.email||"").toLowerCase().includes(q); });
  });

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  function createEvent() {
    if (!newEv.name) return;
    // Limite freemium : 1 événement sans voucher
    if (!appliedVoucher && myEvents.length >= 1) {
      setShowNew(false);
      setShowUpgrade(true);
      return;
    }
    const ev = {
      id: Date.now(), ownerId: user.id,
      name: newEv.name, date: newEv.date || new Date().toISOString().slice(0,10),
      type: newEv.type, plan: appliedVoucher ? "pro" : "free",
      roomShape:[{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables:[], guests:[], constraints:[], menu:null,
    };
    setEvents(prev=>[...prev,ev]);
    onOpenEvent(ev.id);
    setShowNew(false);
  }

  const handleApplyVoucher = (code, voucher) => {
    setAppliedVoucher({ code, ...voucher });
  };


  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 30%,#2a1a0e,${C.dark})`, fontFamily:"Georgia,serif", color:"#ffffff" }}>
      {/* Nav */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:"#C9973A", letterSpacing:1 }}>🪑 TableMaître</span>
        <div style={{flex:1}}/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}44` }}/>
          ) : (
            <div style={{ width:32,height:32,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:13,fontWeight:700 }}>
              {user.avatar}
            </div>
          )}
          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>{user.name.split(" ")[0]}</span>
          {/* Sélecteur de langue */}
          <div style={{ position:"relative" }}>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              aria-label="Language / Langue"
              style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13, padding:"6px 8px", fontFamily:"inherit", outline:"none" }}
            >
              {Object.entries(LANG_FLAGS).map(([code, flag]) => (
                <option key={code} value={code}>{flag} {LANG_NAMES[code]}</option>
              ))}
            </select>
          </div>
          <button onClick={onToggleTheme}
            title={lightMode?t.darkMode:t.lightMode}
            aria-label={lightMode?t.darkMode:t.lightMode}
            style={{ padding:"6px 10px", background:"none", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:16 }}>
            <span aria-hidden="true">{lightMode ? "🌙" : "☀️"}</span>
          </button>
          <button
            onClick={() => setShowVoucher(true)}
            style={{ padding:"6px 14px", background:"none", border:"1px solid rgba(201,151,58,0.4)", borderRadius:8, color:"#C9973A", cursor:"pointer", fontSize:12, fontFamily:"Georgia,serif", display:"flex", alignItems:"center", gap:6 }}
          >
            🎟️ Code promo{appliedVoucher && <span style={{background:"linear-gradient(135deg,#C9973A,#F0C97A)",color:C.dark,borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700}}>✓</span>}
          </button>
          <Btn variant="muted" small onClick={onLogout}>Déconnexion</Btn>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 20px" }}>
        {/* Hero */}
        <div style={{ marginBottom:48, textAlign:"center" }}>
          <h1 style={{ fontSize:36, fontWeight:400, margin:"0 0 8px", letterSpacing:1 }}>{t.myEvents}</h1>
          <p style={{ color:"rgba(255,255,255,0.45)", margin:0, fontSize:14 }}>{t.welcome}, {user.name}</p>
        </div>

        <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
      {/* ── BANDEAU SOUSCRIPTION ── */}
      {user && user.role !== "superadmin" && (()=>{
        const status = user.subscriptionStatus || "trial";
        const endDate = user.subscriptionEnd;
        const daysLeft = endDate ? Math.ceil((new Date(endDate)-new Date())/86400000) : null;
        if (status === "active") return null;
        return (
          <div style={{ margin:"0 0 20px", padding:"14px 20px", borderRadius:14,
            background:status==="expired"?"rgba(224,82,82,0.12)":"rgba(240,201,122,0.1)",
            border:`1px solid ${status==="expired"?"#e05252":"#F0C97A"}44`,
            display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <span style={{fontSize:22}}>{status==="expired"?"❌":"⏳"}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:status==="expired"?"#e05252":"#F0C97A"}}>
                {status==="expired" ? "Abonnement expiré" : `Période d'essai${daysLeft!==null?" — "+daysLeft+" jour"+(daysLeft>1?"s":"")+" restant"+(daysLeft>1?"s":""):""}`}
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>
                {status==="expired" ? "Renouvelez votre abonnement pour continuer" : "Passez à un plan payant pour débloquer toutes les fonctionnalités"}
              </div>
            </div>
            <button onClick={()=>setShowPricing(true)} style={{
              padding:"10px 24px",background:"linear-gradient(135deg,#C9973A,#F0C97A)",
              border:"none",borderRadius:99,cursor:"pointer",color:"#0d0d14",
              fontWeight:800,fontSize:13,fontFamily:"inherit",whiteSpace:"nowrap"}}>
              {status==="expired" ? "Renouveler" : "Voir les plans →"}
            </button>
          </div>
        );
      })()}

          <input
            value={globalSearch}
            onChange={e=>setGlobalSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            role="searchbox"
            style={{ flex:1, padding:"10px 16px", background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:12, color:"#ffffff", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }}
          />
          <Btn onClick={()=>setShowNew(true)}>{t.newEvent}</Btn>
        </div>

        {myEvents.length===0 && (
          <div style={{ textAlign:"center", padding:"80px 20px", color:"rgba(255,255,255,0.45)" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🪑</div>
            <p style={{ fontSize:18 }}>Aucun événement pour le moment</p>
            <Btn onClick={()=>setShowNew(true)} style={{ marginTop:20 }}>Créer mon premier événement</Btn>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {myEvents.map(ev=>{
            const theme=THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
            const unseated=ev.guests.filter(g=>!g.tableId).length;
            return (
              <div key={ev.id} onClick={()=>onOpenEvent(ev.id)} style={{
                background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:18, padding:24,
                cursor:"pointer", transition:"all .2s",
                boxShadow:`0 4px 20px ${theme.color}11`,
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=theme.color+"66";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
                {/* Theme color bar */}
                <div style={{ height:3, background:`linear-gradient(90deg,${theme.color},${theme.color}44)`, borderRadius:99, marginBottom:20 }}/>
                <div style={{ display:"flex", alignItems:"start", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:32 }}>{theme.icon}</span>
                  <Badge color={theme.color}>{theme.label}</Badge>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <h3 style={{ color:"#ffffff", margin:0, fontSize:18, fontWeight:400 }}>{ev.name}</h3>
                  <button onClick={e=>{e.stopPropagation();const copy={...ev,id:Date.now(),name:ev.name+" (copie)",ownerId:user.id};setEvents(prev=>[...prev,copy]);}}
                    title="Dupliquer cet événement"
                    aria-label={`Dupliquer l'événement ${ev.name}`}
                    style={{background:"none",border:"1px solid rgba(201,151,58,0.15)",borderRadius:8,color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:12,padding:"3px 8px",fontFamily:"inherit"}}>
                    <span aria-hidden="true">⧉</span>
                  </button>
                </div>
                <p style={{ color:"rgba(255,255,255,0.45)", margin:"0 0 16px", fontSize:12 }}>
                  {ev.date}
                  {(() => {
                    const days = Math.ceil((new Date(ev.date) - new Date()) / 86400000);
                    if (days < 0) return <span style={{color:"rgba(255,255,255,0.45)",marginLeft:8}}>— passé</span>;
                    if (days === 0) return <span style={{color:C.green,marginLeft:8,fontWeight:700}}>• Aujourd'hui !</span>;
                    if (days <= 7) return <span style={{color:C.red,marginLeft:8,fontWeight:700}}>• {t ? t.inDays : "In"} {days}{t ? t.days : "d"}</span>;
                    if (days <= 30) return <span style={{color:"#E8845A",marginLeft:8}}>• {t ? t.inDays : "In"} {days}{t ? t.days : "d"}</span>;
                    return <span style={{color:"rgba(255,255,255,0.45)",marginLeft:8}}>• {t ? t.inDays : "In"} {days}{t ? t.days : "d"}</span>;
                  })()}
                </p>
                <div style={{ display:"flex", gap:16, fontSize:12, color:"rgba(255,255,255,0.45)" }}>
                  <span>🪑 {ev.tables.length} {t.tables}</span>
                  <span>👤 {ev.guests.length} {t.guests}</span>
                  {unseated>0 && <span style={{ color:C.red }}>⚠ {unseated} {t.unseated}</span>}
                  {globalSearch && ev.guests.some(g3=>g3.name.toLowerCase().includes(globalSearch.toLowerCase())) && (
                    <span style={{color:"#C9973A"}}>✦ {ev.guests.filter(g3=>g3.name.toLowerCase().includes(globalSearch.toLowerCase())).length} invité(s) trouvé(s)</span>
                  )}
                </div>
                {ev.guests.length > 0 && (() => {
                  const placed = ev.guests.filter(g => g.tableId).length;
                  const pct = Math.round(placed / ev.guests.length * 100);
                  const barCol = pct === 100 ? C.green : pct > 50 ? C.gold : C.red;
                  return (
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.45)", marginBottom:4 }}>
                        <span>{t.placement}</span>
                        <span style={{color:barCol, fontWeight:700}}>{pct}%</span>
                      </div>
                      <div style={{ height:4, background:"#13131e", borderRadius:99 }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:barCol, borderRadius:99, transition:"width .4s" }}/>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {showPricing && (
        <PricingPage
          user={user}
          onClose={() => setShowPricing(false)}
          onPlanSelected={(planId) => { setShowPricing(false); }}
        />
      )}
      {showPricing && (
        <PricingPage
          user={user}
          onClose={()=>setShowPricing(false)}
          onPlanSelected={(planId)=>setShowPricing(false)}
        />
      )}
      {showVoucher && <VoucherModal onClose={() => setShowVoucher(false)} onApply={handleApplyVoucher} />}
      <div aria-live="polite" aria-atomic="true" style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:9999, pointerEvents:"none" }}>
        {saveToast && (
          <div style={{ background:"#1E1208", border:`1px solid ${C.green}`, borderRadius:10, padding:"10px 20px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(0,0,0,0.4)", fontSize:13, color:C.green }}>
            {t.savedCloud}
          </div>
        )}
      </div>
      {showUpgrade && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
          <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.4)", borderRadius:20, padding:40, width:400, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>⭐</div>
            <h2 style={{ color:"#C9973A", margin:"0 0 8px", fontSize:22, fontWeight:400 }}>Passez au plan Pro</h2>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:"0 0 20px", lineHeight:1.7 }}>
              Le plan gratuit est limité à <strong style={{color:"#ffffff"}}>1 événement</strong>.<br/>
              Activez un code promo ou passez Pro pour des événements illimités.
            </p>
            <div style={{ background:"#13131e", borderRadius:12, padding:"16px 20px", marginBottom:20, textAlign:"left" }}>
              {["Événements illimités","Invités illimités","Export CSV","QR codes","Chevalets imprimables"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:8, color:"#ffffff", fontSize:13, marginBottom:6 }}>
                  <span style={{color:C.green}}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowUpgrade(false)} style={{ flex:1, padding:"12px", background:"none", border:"1px solid rgba(201,151,58,0.15)", borderRadius:10, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13, fontFamily:"Georgia,serif" }}>
                Rester gratuit
              </button>
              <button onClick={() => { setShowUpgrade(false); setShowVoucher(true); }} style={{ flex:2, padding:"12px", background:`linear-gradient(135deg,${C.gold},${C.gold2})`, border:"none", borderRadius:10, color:C.dark, cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"Georgia,serif" }}>
                🎟️ Entrer un code promo
              </button>
            </div>
          </div>
        </div>
      )}
      {appliedVoucher && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#18182a", border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 20px", zIndex:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          <span style={{fontSize:18}}>🎟️</span>
          <div>
            <div style={{color:C.green, fontSize:12, fontWeight:700}}>Code appliqué : {appliedVoucher.code}</div>
            <div style={{color:"rgba(255,255,255,0.45)", fontSize:11}}>{appliedVoucher.description}</div>
          </div>
          <button onClick={() => setAppliedVoucher(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:16,padding:0}}>×</button>
        </div>
      )}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvel événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÉVÉNEMENT *"><Input value={newEv.name} onChange={e=>setNewEv({...newEv,name:e.target.value})} placeholder="Mariage Dupont × Martin"/></Field>
          <Field label={t.settingDate}><Input type="date" value={newEv.date} onChange={e=>setNewEv({...newEv,date:e.target.value})}/></Field>
          <Field label="TYPE D'ÉVÉNEMENT">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=>(
                <button key={k} onClick={()=>setNewEv({...newEv,type:k})} style={{
                  padding:"10px 8px", borderRadius:10, border:`2px solid ${newEv.type===k?v.color:C.border}`,
                  background:newEv.type===k?v.color+"22":C.mid, cursor:"pointer",
                  color:newEv.type===k?v.color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12, fontWeight:700,
                  display:"flex", alignItems:"center", gap:6,
                }}><span style={{fontSize:16}}>{v.icon}</span> {v.label}</button>
              ))}
            </div>
          </Field>
          <Btn onClick={createEvent} style={{marginTop:4}}>Créer l'événement</Btn>
        </div>
      {/* ── BANDEAU SOUSCRIPTION ── */}
      {user && user.role !== "superadmin" && (() => {
        const status = user.subscriptionStatus || "trial";
        const endDate = user.subscriptionEnd;
        const daysLeft = endDate ? Math.ceil((new Date(endDate) - new Date()) / 86400000) : null;
        if (status === "active") return null; // Actif → pas de bandeau
        return (
          <div style={{
            margin:"0 auto 24px", maxWidth:900, width:"100%",
            padding:"14px 20px", borderRadius:14,
            background: status==="expired" ? "rgba(224,82,82,0.12)" : "rgba(240,201,122,0.1)",
            border: `1px solid ${status==="expired" ? "#e05252" : "#F0C97A"}44`,
            display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
          }}>

      {/* Bandeau souscription */}
      {user && user.role !== "superadmin" && (user.subscriptionStatus === "trial" || user.subscriptionStatus === "expired") && (
        <div style={{
          margin:"0 0 20px",padding:"14px 20px",borderRadius:14,
          background:user.subscriptionStatus==="expired"?"rgba(224,82,82,0.1)":"rgba(240,201,122,0.08)",
          border:"1px solid "+(user.subscriptionStatus==="expired"?"#e0525244":"#F0C97A44"),
          display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",
        }}>
          <span style={{fontSize:20}}>{user.subscriptionStatus==="expired"?"❌":"⏳"}</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:user.subscriptionStatus==="expired"?"#e05252":"#F0C97A"}}>
              {user.subscriptionStatus==="expired"?"Abonnement expiré":"Période d'essai"}
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2}}>
              {user.subscriptionStatus==="expired"
                ?"Renouvelez votre abonnement pour continuer à utiliser TableMaître"
                :"Activez un événement pour débloquer toutes les fonctionnalités"}
            </div>
          </div>
          <button onClick={()=>setShowPricing(true)} style={{
            padding:"9px 22px",background:"linear-gradient(135deg,#C9973A,#F0C97A)",
            border:"none",borderRadius:99,cursor:"pointer",color:"#0d0d14",
            fontWeight:800,fontSize:13,fontFamily:"inherit",whiteSpace:"nowrap",
          }}>{user.subscriptionStatus==="expired"?"Renouveler":"Voir les formules →"}</button>
        </div>
      )}

            <span style={{ fontSize:22 }}>{status==="expired" ? "❌" : "⏳"}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color: status==="expired" ? "#e05252" : "#F0C97A" }}>
                {status==="expired" ? "Abonnement expiré" : `Période d'essai${daysLeft !== null ? ` — ${daysLeft} jour${daysLeft>1?"s":""} restant${daysLeft>1?"s":""}` : ""}`}
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:2 }}>
                {status==="expired" ? "Renouvelez votre abonnement pour continuer à utiliser TableMaître" : "Passez à un plan payant pour débloquer toutes les fonctionnalités"}
              </div>
            </div>
            <button onClick={() => setShowPricing(true)} style={{
              padding:"10px 24px", background:"linear-gradient(135deg,#C9973A,#F0C97A)",
              border:"none", borderRadius:99, cursor:"pointer", color:"#0d0d14",
              fontWeight:800, fontSize:13, fontFamily:"inherit", whiteSpace:"nowrap",
            }}>
              {status==="expired" ? "Renouveler" : "Voir les plans →"}
            </button>
          </div>
        );
      })()}


      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// FIREBASE HOOKS
// ═══════════════════════════════════════════════════════════════


export default Dashboard;
