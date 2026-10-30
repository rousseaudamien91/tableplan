/* eslint-disable */
import { useState, useEffect } from "react";
import { C } from "../theme";
import { useI18n, LANG_FLAGS, LANG_NAMES } from "../i18n";
import { THEMES_CONFIG, PLANS } from "../constants";
import { Btn, Badge, Modal, Field, Input, Select } from "./UI";
import { uid } from "../utils";
import VoucherModal from "./VoucherModal";
import PricingPage from "./PricingPage";
import OnboardingWizard from "./OnboardingWizard";
import NPSWidget from "./reviews/NPSWidget";

// ═══════════════════════════════════════════════════════════════
// DASHBOARD — Liste des événements
// ═══════════════════════════════════════════════════════════════

function Dashboard({ user, events, setEvents, onLogout, onOpenEvent, lightMode, onToggleTheme, t, lang, setLang, guestMode, entitlement, offre, onSaveEvent, onDeleteEvent }) {
  const [showCorbeille, setShowCorbeille] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const sauver = function(ev){ if (onSaveEvent) onSaveEvent(ev); };
  const [showVoucher, setShowVoucher] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newEv, setNewEv] = useState({ name:"", date:"", type:"mariage" });

  const [globalSearch, setGlobalSearch] = useState("");
  var myEventsRaw = events.filter(function(ev2){ return ev2.ownerId === user.id && !ev2.deleted; });
  // Corbeille : un événement supprimé reste restaurable ; la suppression définitive est une action à part
  var corbeille = events.filter(function(ev2){ return ev2.ownerId === user.id && ev2.deleted; });
  function mettreACorbeille(ev) {
    if (!window.confirm("Mettre « " + ev.name + " » à la corbeille ? Vous pourrez le restaurer.")) return;
    var maj = { ...ev, deleted: true, deletedAt: new Date().toISOString() };
    setEvents(function(prev){ return prev.map(function(e){ return e.id === ev.id ? maj : e; }); });
    sauver(maj);
  }
  function restaurer(ev) {
    var maj = { ...ev, deleted: false, deletedAt: null };
    setEvents(function(prev){ return prev.map(function(e){ return e.id === ev.id ? maj : e; }); });
    sauver(maj);
  }
  function supprimerDefinitivement(ev) {
    if (!window.confirm("Supprimer définitivement « " + ev.name + " » ? Cette action est irréversible.")) return;
    if (onDeleteEvent) onDeleteEvent(ev);
  }
  var myEvents = !globalSearch ? myEventsRaw : myEventsRaw.filter(function(ev2){
    var q = globalSearch.toLowerCase();
    return ev2.name.toLowerCase().includes(q) ||
      (ev2.date||"").includes(q) ||
      (ev2.guests||[]).some(function(g2){ return g2.name.toLowerCase().includes(q) || (g2.email||"").toLowerCase().includes(q); });
  });

  const [showPricing, setShowPricing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // NPS — afficher après 2 jours d'utilisation et au moins 1 event
  var npsKey = "tm_nps_" + (user && user.id);
  var firstSeenKey = "tm_first_" + (user && user.id);
  if (!localStorage.getItem(firstSeenKey)) {
    localStorage.setItem(firstSeenKey, Date.now().toString());
  }
  var firstSeen   = parseInt(localStorage.getItem(firstSeenKey) || "0");
  var daysSince   = (Date.now() - firstSeen) / (1000 * 60 * 60 * 24);
  var showNPS     = !guestMode
    && !localStorage.getItem(npsKey)
    && daysSince >= 2
    && myEventsRaw.length >= 1;

  // Guard : user peut être undefined pendant le chargement Firebase
  if (!user) return (
    <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>⏳ Chargement...</div>
    </div>
  );

  function highlight(text, query) {
    if (!query || !text) return text;
    var idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx) + "**" + text.slice(idx, idx+query.length) + "**" + text.slice(idx+query.length);
  }

  function createEvent() {
    if (!newEv.name) return;
    // Pas de limite sur le nombre d'événements — accès libre
    const ev = {
      id: Date.now(), ownerId: user.id,
      name: newEv.name, date: newEv.date || new Date().toISOString().slice(0,10),
      type: newEv.type,
      roomShape:[{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables:[], guests:[], constraints:[], menu:null,
    };
    setEvents(prev=>[...prev,ev]);
    sauver(ev);
    onOpenEvent(ev.id);
    setShowNew(false);
  }

  const handleCodeUtilise = (plan) => {
    var o = { full: "Complet", medium: "Essentiel" }[plan] || plan;
    setCodeMessage("Code accepté : formule " + o + " activée sur votre compte.");
    setTimeout(function(){ setCodeMessage(""); }, 6000);
  };


  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 30%,#2a1a0e,${C.dark})`, fontFamily:"Georgia,serif", color:"#ffffff" }}>
      {/* Nav */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:"#C9973A", letterSpacing:1 }}>🪑 TableMaître</span>
        <div style={{flex:1}}/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {(user && user.photoURL) ? (
            <img src={user.photoURL} alt={user && user.name || ""} style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}44` }}/>
          ) : (
            <div style={{ width:32,height:32,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:13,fontWeight:700 }}>
              {user && user.avatar || "?"}
            </div>
          )}
          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>{user && user.name ? user.name.split(" ")[0] : ""}</span>
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
            🎟️ {entitlement && entitlement.plan !== "free"
              ? <span>Formule {offre ? offre.label : ""} <span style={{background:"linear-gradient(135deg,#C9973A,#F0C97A)",color:C.dark,borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700}}>✓</span></span>
              : <span>Code promo · {offre ? offre.label + " (" + offre.maxGuests + " invités)" : ""}</span>}
          </button>
          <Btn variant="muted" small onClick={onLogout}>Déconnexion</Btn>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 20px" }}>
        {/* Hero */}
        <div style={{ marginBottom:48, textAlign:"center" }}>
          <h1 style={{ fontSize:36, fontWeight:400, margin:"0 0 8px", letterSpacing:1 }}>{t.myEvents}</h1>
          <p style={{ color:"rgba(255,255,255,0.45)", margin:0, fontSize:14 }}>{t.welcome}, {user && user.name || ""}</p>
        </div>

        <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
      {/* ── BANDEAU SOUSCRIPTION ── */}

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
            <p style={{ fontSize:18 }}>{t.noEvents || t.noEvents || "Aucun événement pour le moment"}</p>
            <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:20}}><Btn onClick={()=>setShowOnboarding(true)}>🚀 {t.createFirst||"Créer mon premier événement"}</Btn></div>
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
                  <h3 style={{ color:"#ffffff", margin:0, fontSize:18, fontWeight:400, display:"flex", alignItems:"center", gap:8 }}>
                    {globalSearch ? (function(){
                        var idx = ev.name.toLowerCase().indexOf(globalSearch.toLowerCase());
                        if (idx === -1) return ev.name;
                        return [
                          ev.name.slice(0, idx),
                          <mark key="m" style={{background:"rgba(201,151,58,0.4)",color:"#fff",borderRadius:2,padding:"0 1px"}}>{ev.name.slice(idx,idx+globalSearch.length)}</mark>,
                          ev.name.slice(idx+globalSearch.length)
                        ];
                      })() : ev.name}
                    {(ev.guests||[]).length > 0 && (ev.guests||[]).every(function(g){ return g.tableId; }) && (
                      <span style={{ fontSize:11, background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", color:"#27AE60", borderRadius:6, padding:"1px 7px", fontWeight:700 }}>✅ Complet</span>
                    )}
                  </h3>
                  <button onClick={e=>{e.stopPropagation();const copy={...ev,id:Date.now(),name:ev.name+" (copie)",ownerId:user.id};setEvents(prev=>[...prev,copy]);sauver(copy);}}
                    title={t.duplicateEvent || "Dupliquer cet événement"}
                    aria-label={t.duplicateEvent ? `${t.duplicateEvent}: ${ev.name}` : `Dupliquer l'événement ${ev.name}`}
                    style={{background:"none",border:"1px solid rgba(201,151,58,0.15)",borderRadius:8,color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:12,padding:"3px 8px",fontFamily:"inherit"}}>
                    <span aria-hidden="true">⧉</span>
                  </button>
                  {!guestMode && (
                    <button onClick={e=>{e.stopPropagation();mettreACorbeille(ev);}}
                      title="Mettre à la corbeille"
                      aria-label={"Mettre à la corbeille : " + ev.name}
                      style={{background:"none",border:"1px solid rgba(224,82,82,0.25)",borderRadius:8,color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:12,padding:"3px 8px",fontFamily:"inherit",marginLeft:6}}>
                      <span aria-hidden="true">🗑</span>
                    </button>
                  )}
                </div>
                <p style={{ color:"rgba(255,255,255,0.45)", margin:"0 0 16px", fontSize:12 }}>
                  {ev.date}
                  {(() => {
                    const days = Math.ceil((new Date(ev.date) - new Date()) / 86400000);
                    if (days < 0) return <span style={{color:"rgba(255,255,255,0.45)",marginLeft:8}}>{t.past || "passé"}</span>;
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

        {corbeille.length > 0 && (
          <div style={{ marginTop:32 }}>
            <button onClick={() => setShowCorbeille(v => !v)}
              style={{ background:"none", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, color:"rgba(255,255,255,0.55)", cursor:"pointer", fontSize:13, padding:"6px 14px", fontFamily:"inherit" }}>
              🗑 Corbeille ({corbeille.length}) {showCorbeille ? "▲" : "▼"}
            </button>
            {showCorbeille && (
              <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
                {corbeille.map(ev => (
                  <div key={ev.id} style={{ display:"flex", alignItems:"center", gap:12, background:"#18182a", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 14px" }}>
                    <span style={{ flex:1, color:"rgba(255,255,255,0.7)", fontSize:14 }}>{ev.name}</span>
                    <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>{ev.deletedAt ? "supprimé le " + ev.deletedAt.slice(0,10) : ""}</span>
                    <Btn variant="muted" small onClick={() => restaurer(ev)}>Restaurer</Btn>
                    <Btn variant="muted" small onClick={() => supprimerDefinitivement(ev)}>Supprimer définitivement</Btn>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* NPS WIDGET — après 2 jours + 1 event */}
      {showNPS && (
        <NPSWidget
          user={user}
          onClose={function(){ localStorage.setItem(npsKey, "1"); }}
          t={t}
        />
      )}

      {showOnboarding && (
        <OnboardingWizard
          onSkip={() => { setShowOnboarding(false); setShowNew(true); }}
          onComplete={(wizardData) => {
            setShowOnboarding(false);
            const ev = {
              id: Date.now(), ownerId: user.id,
              name: wizardData.name, date: wizardData.date,
              type: wizardData.type,
              roomShape: wizardData.roomShape,
              tables: [], guests: [], constraints: [], menu: null,
            };
            setEvents(prev => [...prev, ev]);
            sauver(ev);
            onOpenEvent(ev.id);
          }}
        />
      )}
      {showPricing && (
        <PricingPage
          user={user}
          onClose={() => setShowPricing(false)}
          onPlanSelected={(planId) => { setShowPricing(false); }}
        />
      )}
      
      
      {showVoucher && <VoucherModal user={user} entitlement={entitlement} onClose={() => setShowVoucher(false)} onApply={handleCodeUtilise} />}
      <div aria-live="polite" aria-atomic="true" style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:9999, pointerEvents:"none" }}>
        {saveToast && (
          <div style={{ background:"#1E1208", border:`1px solid ${C.green}`, borderRadius:10, padding:"10px 20px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(0,0,0,0.4)", fontSize:13, color:C.green }}>
            {t.savedCloud}
          </div>
        )}
      </div>

      {codeMessage && (
        <div role="status" style={{ position:"fixed", bottom:24, right:24, background:"#18182a", border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 20px", zIndex:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          <span style={{fontSize:18}}>🎟️</span>
          <div style={{color:C.green, fontSize:13, fontWeight:700}}>{codeMessage}</div>
        </div>
      )}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvel événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={t.eventName ? t.eventName.toUpperCase()+" *" : "NOM DE L'ÉVÉNEMENT *"}><Input value={newEv.name} onChange={e=>setNewEv({...newEv,name:e.target.value})} placeholder={t.onboardingPlaceholder || "Mariage Dupont × Martin"}/></Field>
          <Field label={t.settingDate}><Input type="date" value={newEv.date} onChange={e=>setNewEv({...newEv,date:e.target.value})}/></Field>
          <Field label={t.eventType ? t.eventType.toUpperCase() : "TYPE D'ÉVÉNEMENT"}>
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
          <Btn onClick={createEvent} style={{marginTop:4}}>{t.createEvent || "Créer l'événement"}</Btn>
        </div>
      {/* ── BANDEAU SOUSCRIPTION ── */}


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
