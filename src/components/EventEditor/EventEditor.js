/* eslint-disable */
import { useState, useEffect } from "react";
import { useI18n }   from "../../i18n";
import { useTheme }  from "../../theme";

import Toolbar       from "./Toolbar";
import AiAssistant   from "./AiAssistant";
import HintSystem    from "./HintSystem";
import TablePopover  from "./TablePopover";
import TabPlan       from "./tabs/TabPlan";
import TabGuests     from "./tabs/TabGuests";
import TabBudget     from "./tabs/TabBudget";
import TabSettings   from "./tabs/TabSettings";
import TabMenu       from "./tabs/TabMenu";
import TabTodo       from "./tabs/TabTodo";

export default function EventEditor({ ev, onUpdate, onBack, user, guestMode }) {
  const { t }     = useI18n();
  const { theme } = useTheme();

  // ── États ────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState("plan");
  const [showAddTable, setShowAddTable] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAI,       setShowAI]       = useState(false);
  const [savedAt,      setSavedAt]      = useState(null);
  const [history,      setHistory]      = useState([]);
  const [redoStack,    setRedoStack]    = useState([]);
  const [tablePopover, setTablePopover] = useState(null);
  const [fullscreen,   setFullscreen]   = useState(false);

  // ── Sauvegarde avec historique ────────────────────────────
  function handleUpdate(updatedEv) {
    setHistory(function(prev){ return [...prev.slice(-19), ev]; });
    setRedoStack([]);
    onUpdate(updatedEv);
    setSavedAt(new Date());
    setTimeout(function(){ setSavedAt(null); }, 3000);
  }

  function handleUndo() {
    if (history.length === 0) return;
    var prev = history[history.length - 1];
    setRedoStack(function(r){ return [...r, ev]; });
    setHistory(function(h){ return h.slice(0, -1); });
    onUpdate(prev);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    var next = redoStack[redoStack.length - 1];
    setHistory(function(h){ return [...h, ev]; });
    setRedoStack(function(r){ return r.slice(0, -1); });
    onUpdate(next);
  }

  // ── Raccourcis clavier Ctrl+Z / Ctrl+Y ───────────────────
  useEffect(function() {
    function handler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault(); handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault(); handleRedo();
      }
    }
    window.addEventListener("keydown", handler);
    return function() { window.removeEventListener("keydown", handler); };
  }, [history, redoStack, ev]);

  // ── Guard chargement ─────────────────────────────────────
  if (!ev) return (
    <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>⏳ Chargement…</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#120C08", color:"#ffffff", fontFamily:"Georgia,serif", position:"relative" }}>

      {/* Mode présentation plein écran */}
      {fullscreen && activeTab === "plan" && (
        <div style={{ position:"fixed", inset:0, zIndex:6000, background:"#120C08", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 16px", background:"rgba(18,12,8,0.95)", borderBottom:"1px solid rgba(201,151,58,0.15)" }}>
            <span style={{ color:"#F0C97A", fontWeight:800, fontSize:14 }}>🪑 {ev.name} — Mode présentation</span>
            <button onClick={function(){ setFullscreen(false); }} style={{ padding:"5px 12px", border:"1px solid rgba(201,151,58,0.3)", borderRadius:8, background:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"Georgia,serif" }}>
              ⊠ Quitter
            </button>
          </div>
          <div style={{ flex:1, overflow:"auto" }}>
            <TabPlan ev={ev} onUpdate={handleUpdate} showAddTable={showAddTable} setShowAddTable={setShowAddTable} onTableClick={function(table,pos){ setTablePopover({table,position:pos}); }} t={t} />
          </div>
        </div>
      )}

      {/* Toolbar */}
      <Toolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ev={ev}
        onBack={function(){ if(history.length>0){ if(!window.confirm("Quitter ? Les modifications non sauvegardées seront perdues.")) return; } onBack(); }}
        onToggleAI={function(){ setShowAI(function(v){ return !v; }); }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onFullscreen={function(){ setFullscreen(function(v){ return !v; }); }}
        fullscreen={fullscreen}
        savedAt={savedAt}
        showAI={showAI}
        onAddTable={function(){ setActiveTab("plan");   setShowAddTable(true); }}
        onAddGuest={function(){ setActiveTab("guests"); setShowAddGuest(true); }}
        t={t}
      />

      {/* Onglets */}
      {activeTab === "plan" && (
        <TabPlan ev={ev} onUpdate={handleUpdate} showAddTable={showAddTable} setShowAddTable={setShowAddTable}
          onTableClick={function(table,pos){ setTablePopover({table,position:pos}); }} t={t} />
      )}
      {activeTab === "guests" && (
        <TabGuests ev={ev} onUpdate={handleUpdate} showAddGuest={showAddGuest} setShowAddGuest={setShowAddGuest} t={t} />
      )}
      {activeTab === "budget"   && <TabBudget   ev={ev} onUpdate={handleUpdate} t={t} />}
      {activeTab === "menu"     && <TabMenu     ev={ev} onUpdate={handleUpdate} t={t} />}
      {activeTab === "todo"     && <TabTodo     ev={ev} onUpdate={handleUpdate} t={t} />}
      {activeTab === "settings" && <TabSettings ev={ev} onUpdate={handleUpdate} t={t} />}

      {/* Popover table */}
      {tablePopover && (
        <TablePopover
          table={tablePopover.table}
          guests={ev.guests||[]}
          ev={ev}
          position={tablePopover.position}
          onClose={function(){ setTablePopover(null); }}
          onUpdate={handleUpdate}
        />
      )}

      {/* Hints */}
      <HintSystem ev={ev} activeTab={activeTab} user={user} />

      {/* Agent IA */}
      <AiAssistant ev={ev} open={showAI} onClose={function(){ setShowAI(false); }} />
    </div>
  );
}
