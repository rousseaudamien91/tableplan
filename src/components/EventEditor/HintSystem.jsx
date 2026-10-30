/* eslint-disable */
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// HINT SYSTEM — Tooltips guidés premier usage
// ─────────────────────────────────────────────────────────────

var HINTS = [
  { id:"tables",    tab:"plan",     text:"Commencez par créer vos tables avec ⚡ + Table",       arrow:"top-right" },
  { id:"guests",    tab:"guests",   text:"Ajoutez vos invités et définissez leur rôle",            arrow:"top" },
  { id:"dragdrop",  tab:"plan",     text:"Glissez les invités du panneau droit vers une table",    arrow:"right" },
  { id:"rsvp",      tab:"guests",   text:"Suivez les réponses RSVP dans l'onglet 💌 RSVP",        arrow:"top" },
  { id:"budget",    tab:"budget",   text:"Suivez vos dépenses dans l'onglet Budget",               arrow:"top" },
  { id:"export",    tab:"settings", text:"Exportez votre plan en PDF dans les Paramètres",         arrow:"top" },
];

export default function HintSystem({ ev, activeTab, user }) {
  var storageKey = "tm_hints_" + (user && user.id ? user.id : "guest");
  var [dismissed, setDismissed] = useState(function() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch(e) { return []; }
  });
  var [current, setCurrent] = useState(null);

  useEffect(function() {
    var tables = ev.tables || [];
    var guests = ev.guests || [];

    // Déterminer quel hint montrer
    var hint = null;
    if (tables.length === 0 && !dismissed.includes("tables")) {
      hint = HINTS[0]; // tables vides → créer des tables
    } else if (tables.length > 0 && guests.length === 0 && !dismissed.includes("guests") && activeTab === "guests") {
      hint = HINTS[1]; // tables créées, pas d'invités
    } else if (tables.length > 0 && guests.length > 0 && guests.filter(function(g){ return !g.tableId; }).length > 0 && !dismissed.includes("dragdrop") && activeTab === "plan") {
      hint = HINTS[2]; // invités non placés
    } else if (guests.length > 3 && !dismissed.includes("rsvp") && activeTab === "guests") {
      hint = HINTS[3]; // RSVP
    }

    // Ne montrer que si on est dans le bon onglet
    if (hint && hint.tab === activeTab) {
      setCurrent(hint);
    } else {
      setCurrent(null);
    }
  }, [activeTab, ev.tables && ev.tables.length, ev.guests && ev.guests.length]);

  function dismiss(id) {
    var next = [...dismissed, id];
    setDismissed(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch(e) {}
    setCurrent(null);
  }

  function dismissAll() {
    var all = HINTS.map(function(h){ return h.id; });
    setDismissed(all);
    try { localStorage.setItem(storageKey, JSON.stringify(all)); } catch(e) {}
    setCurrent(null);
  }

  if (!current) return null;

  return (
    <div style={{
      position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
      zIndex:8000, maxWidth:420, width:"calc(100% - 48px)",
      background:"linear-gradient(135deg,#1a1228,#18182a)",
      border:"1px solid rgba(201,151,58,0.35)",
      borderRadius:16, padding:"14px 18px",
      boxShadow:"0 8px 40px rgba(0,0,0,0.6)",
      display:"flex", alignItems:"center", gap:12,
      animation:"slideUpHint .3s ease",
      fontFamily:"Georgia,serif",
    }}>
      <style>{`@keyframes slideUpHint { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>

      {/* Icône */}
      <div style={{ width:36, height:36, borderRadius:10, background:"rgba(201,151,58,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:18 }}>
        💡
      </div>

      {/* Texte */}
      <div style={{ flex:1, fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.5 }}>
        {current.text}
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
        <button onClick={function(){ dismiss(current.id); }} style={{ padding:"5px 12px", borderRadius:8, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.12)", color:"#F0C97A", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700 }}>
          OK
        </button>
        <button onClick={dismissAll} style={{ padding:"5px 8px", borderRadius:8, border:"none", background:"none", color:"rgba(255,255,255,0.25)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          Ne plus voir
        </button>
      </div>
    </div>
  );
}
