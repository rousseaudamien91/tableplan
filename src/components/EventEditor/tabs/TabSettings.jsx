/* eslint-disable */
import { exportPlanPDF, exportPlaceCardsPDF } from "../PDFExport";
import { useState } from "react";
import SettingsModal from "../Modals/SettingsModal";
import { C, THEMES_CONFIG } from "../../../constants";

export default function TabSettings({ ev, onUpdate, t }) {
  const [showModal, setShowModal] = useState(false);
  const [settings,  setSettings]  = useState({
    notes:  ev.notes  || "",
    date:   ev.date   || "",
    venue:  ev.venue  || "",
    budget: ev.budgetTotal || 0,
  });

  function saveSettings() {
    onUpdate({ ...ev, ...settings, budgetTotal: settings.budget });
    setShowModal(false);
  }

  var theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;

  return (
    <div style={{ padding:"20px 24px" }}>
      <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:20, alignItems:"start" }}>

      {/* Carte événement */}
      <div style={{ background:C.card, borderRadius:16, padding:24, border:"1px solid rgba(201,151,58,0.15)", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <div style={{ fontSize:40 }}>{theme.icon}</div>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:"#ffffff" }}>{ev.name}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:2 }}>{ev.date} · {theme.label}</div>
          </div>
          <div style={{ flex:1 }}/>
          <button onClick={function(){ setShowModal(true); }} style={{
            padding:"8px 18px", borderRadius:10, border:"1px solid rgba(201,151,58,0.3)",
            background:"rgba(201,151,58,0.1)", color:"#F0C97A", cursor:"pointer",
            fontSize:13, fontFamily:"Georgia,serif",
          }}>
            ✏️ {t&&t.edit||"Modifier"}
          </button>
        </div>

        {/* Infos */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { label:t&&t.settingDate||"Date",    value:ev.date     || "—" },
            { label:"Lieu",                       value:ev.venue    || "—" },
            { label:t&&t.tables||"Tables",        value:(ev.tables||[]).length },
            { label:t&&t.guests||"Invités",       value:(ev.guests||[]).length },
          ].map(function(item, i) {
            return (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"12px 16px", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#ffffff" }}>{item.value}</div>
              </div>
            );
          })}
        </div>

        {ev.notes && (
          <div style={{ marginTop:16, padding:"12px 16px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Notes</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>{ev.notes}</div>
          </div>
        )}
      </div>

      {/* Stats enrichies */}
      {(function() {
        var guests   = ev.guests  || [];
        var tables   = ev.tables  || [];
        var budget   = ev.budget  || [];
        var placed   = guests.filter(function(g){ return g.tableId; }).length;
        var confirmed= guests.filter(function(g){ return g.rsvp==="confirmed"; }).length;
        var placePct = guests.length > 0 ? Math.round(placed/guests.length*100) : 0;
        var rsvpPct  = guests.length > 0 ? Math.round(confirmed/guests.length*100) : 0;
        var totalBudget = budget.reduce(function(s,l){ return s+(parseFloat(l.amount)||0); }, 0);
        var costPerGuest = guests.length > 0 && totalBudget > 0 ? Math.round(totalBudget/guests.length) : null;
        var capacity = tables.reduce(function(s,t){ return s+t.capacity; }, 0);
        // Compte à rebours
        var daysLeft = null;
        if (ev.date) {
          var diff = Math.ceil((new Date(ev.date) - new Date()) / 86400000);
          daysLeft = diff;
        }
        return (
          <div style={{ background:C.card, borderRadius:16, padding:24, border:"1px solid rgba(255,255,255,0.06)", marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>
              Statistiques
            </div>
            {/* Compte à rebours */}
            {daysLeft !== null && (
              <div style={{ textAlign:"center", padding:"16px", background:daysLeft < 0?"rgba(192,57,43,0.08)":daysLeft < 7?"rgba(232,132,90,0.08)":"rgba(201,151,58,0.06)", borderRadius:12, border:"1px solid "+(daysLeft<0?"rgba(192,57,43,0.2)":daysLeft<7?"rgba(232,132,90,0.2)":"rgba(201,151,58,0.15)"), marginBottom:16 }}>
                <div style={{ fontSize:36, fontWeight:800, color:daysLeft<0?C.red:daysLeft<7?"#E8845A":"#F0C97A" }}>
                  {daysLeft < 0 ? "Passé" : daysLeft === 0 ? "Aujourd'hui !" : daysLeft + " j"}
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>
                  {daysLeft < 0 ? "Événement passé" : daysLeft === 0 ? "C'est le grand jour !" : "avant l'événement"}
                </div>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {[
                { label:"Invités",    value:guests.length,      color:"#F0C97A",  sub:confirmed+" confirmés" },
                { label:"Placés",     value:placed+"/"+guests.length, color:placePct===100?"#27AE60":"#E8845A", sub:placePct+"% placés" },
                { label:"RSVP",       value:rsvpPct+"%",        color:rsvpPct>70?"#27AE60":"#C9973A", sub:confirmed+" oui · "+(guests.length-confirmed)+" restants" },
                { label:"Tables",     value:tables.length,      color:"#C9973A",  sub:capacity+" places au total" },
                { label:"Budget",     value:totalBudget>0?totalBudget+"€":"—", color:"#8B7EC8", sub:costPerGuest?costPerGuest+"€/invité":"non renseigné" },
                { label:"Capacité",   value:capacity,           color:"rgba(255,255,255,0.6)", sub:capacity-guests.length+" places libres" },
              ].map(function(s, i) {
                return (
                  <div key={i} style={{ textAlign:"center", padding:"12px 8px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:2, fontWeight:700 }}>{s.label}</div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", marginTop:2 }}>{s.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      </div>
      <SettingsModal
        open={showModal}
        onClose={function(){ setShowModal(false); }}
        settings={settings}
        setSettings={setSettings}
        updateEv={saveSettings}
        t={t}
      />

      {/* ── Exports ──────────────────────────────────── */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"20px 24px", marginTop:16 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>EXPORTS & IMPRESSION</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button onClick={function(){ exportPlanPDF(ev); }} style={{ padding:"10px 16px", background:"rgba(201,151,58,0.1)", border:"1px solid rgba(201,151,58,0.25)", borderRadius:10, color:"#F0C97A", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
            🖨️ Plan de table PDF
          </button>
          <button onClick={function(){ exportPlaceCardsPDF(ev); }} style={{ padding:"10px 16px", background:"rgba(201,151,58,0.1)", border:"1px solid rgba(201,151,58,0.25)", borderRadius:10, color:"#F0C97A", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
            🪑 Cartons de placement PDF
          </button>
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:10 }}>
          S'ouvre dans un nouvel onglet · Compatible avec tous les navigateurs
        </div>
      </div>
    </div>
  );
}
