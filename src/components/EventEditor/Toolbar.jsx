/* eslint-disable */
import Btn from "../ui/Btn";

const TABS = [
  { id:"plan",     icon:"🗺️" },
  { id:"guests",   icon:"👥" },
  { id:"budget",   icon:"💰" },
  { id:"settings", icon:"⚙️" },
];

export default function Toolbar({ activeTab, setActiveTab, ev, onBack, onAddTable, onAddGuest, onToggleAI, showAI, savedAt, onUndo, onRedo, canUndo, canRedo, onFullscreen, fullscreen, t }) {
  var labels = {
    plan:     t && t.tabPlan     || "Plan",
    guests:   t && t.tabGuests   || "Invités",
    menu:     t && t.tabMenu     || "Menu",
    budget:   t && t.tabBudget   || "Budget",
    todo:     t && t.tabTodo     || "Checklist",
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

      {/* Indicateur sauvegarde */}
      {savedAt && (
        <div style={{ fontSize:10, color:"rgba(39,174,96,0.7)", display:"flex", alignItems:"center", gap:4, marginRight:8, flexShrink:0 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#27AE60", display:"inline-block" }}/>
          Sauvegardé
        </div>
      )}

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

      {/* Undo / Redo */}
      <button onClick={onUndo} disabled={!canUndo} title="Annuler (Ctrl+Z)" style={{ padding:"4px 8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.08)", background:"none", color:canUndo?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.15)", cursor:canUndo?"pointer":"not-allowed", fontSize:14 }}>↩</button>
      <button onClick={onRedo} disabled={!canRedo} title="Rétablir (Ctrl+Y)" style={{ padding:"4px 8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.08)", background:"none", color:canRedo?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.15)", cursor:canRedo?"pointer":"not-allowed", fontSize:14, marginRight:4 }}>↪</button>

      {/* Plein écran plan */}
      <button onClick={onFullscreen} title={fullscreen?"Quitter le plein écran":"Mode présentation"} style={{ padding:"4px 8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.08)", background:fullscreen?"rgba(201,151,58,0.15)":"none", color:fullscreen?"#F0C97A":"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13, marginRight:4 }}>
        {fullscreen ? "⊠" : "⊡"}
      </button>

      {/* Bouton IA */}
      <button onClick={onToggleAI} style={{
        padding:"5px 12px", borderRadius:8,
        background: showAI ? "linear-gradient(135deg,#C9973A,#F0C97A)" : "rgba(201,151,58,0.1)",
        border:"1px solid rgba(201,151,58,0.3)",
        color: showAI ? "#0d0d14" : "#F0C97A",
        cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700,
        display:"flex", alignItems:"center", gap:5,
        marginRight:4,
      }}>
        {showAI ? "x IA" : "IA"}
      </button>

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
