/* eslint-disable */
import Btn from "../ui/Btn";

const TABS = [
  { id:"plan",     icon:"🗺️" },
  { id:"guests",   icon:"👥" },
  { id:"budget",   icon:"💰" },
  { id:"settings", icon:"⚙️" },
];

export default function Toolbar({ activeTab, setActiveTab, ev, onBack, onAddTable, onAddGuest, t }) {
  var labels = {
    plan:     t && t.tabPlan     || "Plan",
    guests:   t && t.tabGuests   || "Invités",
    budget:   t && t.tabBudget   || "Budget",
    settings: t && t.tabSettings || "Paramètres",
  };

  return (
    <div style={{
      position:"sticky", top:0, zIndex:50,
      background:"rgba(18,12,8,0.97)", backdropFilter:"blur(12px)",
      borderBottom:"1px solid rgba(201,151,58,0.15)",
      padding:"0 24px", display:"flex", alignItems:"center",
      gap:8, height:56, fontFamily:"Georgia,serif",
    }}>
      {/* Retour */}
      <button onClick={onBack} style={{
        background:"none", border:"1px solid rgba(201,151,58,0.2)",
        borderRadius:8, color:"rgba(255,255,255,0.5)", cursor:"pointer",
        fontSize:13, padding:"5px 10px", fontFamily:"inherit",
        marginRight:8, display:"flex", alignItems:"center", gap:4,
      }}>← {t && t.back || "Retour"}</button>

      {/* Nom événement */}
      <span style={{ color:"#F0C97A", fontWeight:700, fontSize:14, marginRight:12, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {ev && ev.name}
      </span>

      {/* Onglets */}
      <div style={{ display:"flex", gap:2 }}>
        {TABS.map(function(tab) {
          var active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={function(){ setActiveTab(tab.id); }} style={{
              padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
              background: active ? "rgba(201,151,58,0.18)" : "transparent",
              color: active ? "#F0C97A" : "rgba(255,255,255,0.45)",
              fontSize:13, fontFamily:"inherit", fontWeight: active ? 700 : 400,
              borderBottom: active ? "2px solid #C9973A" : "2px solid transparent",
              transition:"all .18s",
            }}>
              {tab.icon} {labels[tab.id]}
            </button>
          );
        })}
      </div>

      <div style={{ flex:1 }}/>

      {/* Actions contextuelles */}
      {activeTab === "plan" && (
        <Btn size="sm" onClick={onAddTable}>
          + {t && t.addTable || "Table"}
        </Btn>
      )}
      {activeTab === "guests" && (
        <Btn size="sm" onClick={onAddGuest}>
          + {t && t.addGuest || "Invité"}
        </Btn>
      )}
    </div>
  );
}
