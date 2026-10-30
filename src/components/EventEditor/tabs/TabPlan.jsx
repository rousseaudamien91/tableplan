/* eslint-disable */
import { useState } from "react";
import { FloorPlan, RoomShapeEditor } from "../../FloorPlan";
import Btn from "../../ui/Btn";
import AddTableModal    from "../Modals/AddTableModal";
import QuickTablesModal from "../Modals/QuickTablesModal";
import ConstraintModal  from "../Modals/ConstraintModal";
import QRModal          from "../Modals/QRModal";
import { C }            from "../../../constants";
import { uid }          from "../../../utils";

// ─────────────────────────────────────────────
// Sous-onglets du Plan
// ─────────────────────────────────────────────
var PLAN_TABS = [
  { id:"floor",  icon:"🗺️", label:"Plan de salle" },
  { id:"list",   icon:"📋", label:"Liste des tables" },
  { id:"room",   icon:"📐", label:"Forme de la salle" },
];

export default function TabPlan({ ev, onUpdate, showAddTable, setShowAddTable, onTableClick, t }) {
  var [subTab,              setSubTab]              = useState("floor");
  var [selectedTable,       setSelectedTable]       = useState(null);
  var [highlightAvailable,  setHighlightAvailable]  = useState(false);
  var [showConstraint,      setShowConstraint]       = useState(false);
  var [showQuick,        setShowQuick]        = useState(false);
  var [showGuestPanel,   setShowGuestPanel]   = useState(false);
  var [dragGuestId,      setDragGuestId]      = useState(null);
  var [conflictTables,   setConflictTables]   = useState([]);
  var [showNames,        setShowNames]        = useState(false);
  var [sortBy,           setSortBy]           = useState("number");
  var [zoom,             setZoom]             = useState(1);
  var [showQR,              setShowQR]               = useState(false);

  var [newTable, setNewTable] = useState({ label:"", shape:"round", capacity:8, color:"", notes:"" });
  var [newConstraint, setNewConstraint] = useState({ type:"apart", guestA:"", guestB:"", note:"" });

  var tables   = ev.tables  || [];
  var guests   = ev.guests  || [];
  var seated   = guests.filter(function(g){ return g.tableId; }).length;
  var unseated = guests.length - seated;
  var pct      = guests.length > 0 ? Math.round(seated / guests.length * 100) : 0;
  var barColor = pct === 100 ? C.green : pct > 50 ? C.gold : C.red;
  var nextNum  = tables.length + 1;

  // Détecter conflits de contraintes
  var constraints = ev.constraints || [];
  var conflictTableIds = new Set();
  constraints.forEach(function(c) {
    if (c.type !== "apart") return;
    var gA = guests.find(function(g){ return g.id === c.guestA; });
    var gB = guests.find(function(g){ return g.id === c.guestB; });
    if (gA && gB && gA.tableId && gA.tableId === gB.tableId) {
      conflictTableIds.add(gA.tableId);
    }
  });

  function handleQuickGenerate(newTables) {
    onUpdate({ ...ev, tables: [...tables, ...newTables] });
  }

  function addTable() {
    if (!newTable.capacity) return;
    var tbl = {
      id: uid(), number: nextNum,
      label: newTable.label || "",
      shape: newTable.shape || "round",
      capacity: parseInt(newTable.capacity) || 8,
      color: newTable.color || "",
      x: 200 + (nextNum % 4) * 140,
      y: 200 + Math.floor((nextNum - 1) / 4) * 140,
      guests: [],
    };
    onUpdate({ ...ev, tables: [...tables, tbl] });
    setShowAddTable(false);
    setNewTable({ label:"", shape:"round", capacity:8, color:"", notes:"" });
  }

  function removeTable(id) {
    onUpdate({
      ...ev,
      tables: tables.filter(function(t){ return t.id !== id; }),
      guests: guests.map(function(g){ return g.tableId === id ? {...g, tableId:null} : g; }),
    });
  }

  function addConstraint() {
    if (!newConstraint.guestA || !newConstraint.guestB) return;
    onUpdate({ ...ev, constraints: [...(ev.constraints||[]), { id:uid(), ...newConstraint }] });
    setShowConstraint(false);
    setNewConstraint({ type:"apart", guestA:"", guestB:"", note:"" });
  }

  function dropGuest(guestId, tableId) {
    onUpdate({ ...ev, guests: guests.map(function(g){ return g.id===guestId ? {...g,tableId} : g; }) });
  }

  function updateTables(newTables)   { onUpdate({ ...ev, tables: newTables }); }
  function updateRoomShape(shape)    { onUpdate({ ...ev, roomShape: shape }); }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>

      {/* ── Barre stats + actions ─────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 24px", background:"rgba(0,0,0,0.2)", borderBottom:"1px solid rgba(201,151,58,0.08)", flexWrap:"wrap" }}>

        {/* Stats */}
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ background:C.card, borderRadius:8, padding:"6px 14px", fontSize:12, border:"1px solid rgba(201,151,58,0.12)", display:"flex", alignItems:"center", gap:6 }}>
            🪑 <b style={{color:"#F0C97A"}}>{tables.length}</b>
            <span style={{color:"rgba(255,255,255,0.35)"}}>{t&&t.tables||"tables"}</span>
          </div>
          <div style={{ background:C.card, borderRadius:8, padding:"6px 14px", fontSize:12, border:"1px solid rgba(201,151,58,0.12)", display:"flex", alignItems:"center", gap:6 }}>
            👤 <b style={{color:"#F0C97A"}}>{seated}</b>
            <span style={{color:"rgba(255,255,255,0.35)"}}>/ {guests.length}</span>
          </div>
          {unseated > 0 && (
            <div style={{ background:"rgba(192,57,43,0.12)", borderRadius:8, padding:"6px 14px", fontSize:12, border:"1px solid rgba(192,57,43,0.25)", color:"#e07070", display:"flex", alignItems:"center", gap:6 }}>
              ⚠ <b>{unseated}</b> {t&&t.unseated||"non placés"}
            </div>
          )}
        </div>

        {/* Barre placement */}
        {guests.length > 0 && (
          <div style={{ flex:1, minWidth:100, maxWidth:200 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:3 }}>
              <span>{t&&t.placement||"Placement"}</span>
              <span style={{color:barColor, fontWeight:700}}>{pct}%</span>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:99 }}>
              <div style={{ height:"100%", width:pct+"%", background:barColor, borderRadius:99, transition:"width .4s" }}/>
            </div>
          </div>
        )}

        <div style={{ flex:1 }}/>

        {/* Boutons actions */}
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={function(){ setShowConstraint(true); }} style={{ padding:"6px 12px", background:"none", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            🔗 {t&&t.constraints||"Contraintes"}
          </button>
          <button onClick={function(){ setShowQR(true); }} style={{ padding:"6px 12px", background:"none", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            📱 QR
          </button>
          <button onClick={function(){ setHighlightAvailable(function(v){ return !v; }); }} style={{ padding:"6px 12px", background: highlightAvailable?"rgba(201,151,58,0.15)":"none", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color: highlightAvailable?"#F0C97A":"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            ✨ {t&&t.seeAvailable||"Places libres"}
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:3, border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, overflow:"hidden" }}>
            <button onClick={function(){ setZoom(function(z){ return Math.max(0.5,+(z-0.1).toFixed(1)); }); }} style={{ padding:"5px 8px", background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:14 }} title="Zoom -">−</button>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)", minWidth:32, textAlign:"center" }}>{Math.round(zoom*100)}%</span>
            <button onClick={function(){ setZoom(function(z){ return Math.min(2,+(z+0.1).toFixed(1)); }); }} style={{ padding:"5px 8px", background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:14 }} title="Zoom +">+</button>
            <button onClick={function(){ setZoom(1); }} style={{ padding:"5px 8px", background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:10 }} title="Réinitialiser">⊙</button>
          </div>
          <button onClick={function(){ setShowNames(function(v){ return !v; }); }} style={{ padding:"6px 12px", background:showNames?"rgba(201,151,58,0.15)":"none", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:showNames?"#F0C97A":"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            👤 Noms
          </button>
          <button onClick={function(){ setShowQuick(true); }} style={{ padding:"6px 16px", background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:8, color:"#0d0d14", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:800, display:"flex", alignItems:"center", gap:5 }}>
            ⚡ + {t&&t.addTable||"Table"}
          </button>
        </div>
      </div>

      {/* ── Sous-onglets ─────────────────────────────────────── */}
      <div style={{ display:"flex", gap:2, padding:"0 24px", background:"rgba(0,0,0,0.15)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        {PLAN_TABS.map(function(tab) {
          var active = subTab === tab.id;
          return (
            <button key={tab.id} onClick={function(){ setSubTab(tab.id); }} style={{
              padding:"8px 16px", background:"none", border:"none", cursor:"pointer",
              color: active ? "#F0C97A" : "rgba(255,255,255,0.4)",
              fontSize:12, fontFamily:"Georgia,serif", fontWeight: active ? 700 : 400,
              borderBottom: active ? "2px solid #C9973A" : "2px solid transparent",
              transition:"all .15s",
            }}>
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Contenu sous-onglet ───────────────────────────────── */}
      <div style={{ flex:1, overflow:"auto" }}>

        {/* FLOOR PLAN */}
        {subTab === "floor" && (
          <div style={{ padding:"20px 24px", display:"flex", gap:16 }}>
            {/* Plan */}
            <div style={{ flex:1, minWidth:0, position:"relative", overflow:"hidden" }}
              onWheel={function(e) {
                if (!e.ctrlKey && !e.metaKey) return;
                e.preventDefault();
                setZoom(function(z){ return Math.max(0.5, Math.min(2, +(z + (e.deltaY < 0 ? 0.1 : -0.1)).toFixed(1))); });
              }}>
              <div style={{ transform:"scale("+zoom+")", transformOrigin:"top left", transition:"transform .15s" }}>
              {tables.length === 0 && (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:10, pointerEvents:"none" }}>
                  <div style={{ fontSize:48, marginBottom:12, opacity:.4 }}>🪑</div>
                  <div style={{ fontSize:15, color:"rgba(255,255,255,0.3)", marginBottom:6 }}>Plan vide</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.2)", marginBottom:16 }}>Cliquez sur ⚡ + Table pour commencer</div>
                </div>
              )}
              <FloorPlan
                ev={ev}
                selectedTable={selectedTable}
                onSelectTable={setSelectedTable}
                onUpdateTables={updateTables}
                highlightAvailable={highlightAvailable}
                onDropGuestToTable={dropGuest}
                onTableClick={onTableClick}
                conflictTableIds={conflictTableIds}
                showNames={showNames}
              />
              </div>
            </div>

            {/* Panneau invités non placés */}
            <div style={{ width:200, flexShrink:0, display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", paddingBottom:6, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                👤 Non placés ({unseated})
              </div>
              {unseated === 0 ? (
                <div style={{ fontSize:11, color:C.green, textAlign:"center", padding:"20px 8px" }}>✅ Tous placés !</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:4, overflowY:"auto", maxHeight:460 }}>
                  {guests.filter(function(g){ return !g.tableId; }).map(function(g) {
                    return (
                      <div
                        key={g.id}
                        draggable="true"
                        onDragStart={function(e){ e.dataTransfer.setData("guestId", g.id); setDragGuestId(g.id); }}
                        onDragEnd={function(){ setDragGuestId(null); }}
                        style={{
                          padding:"7px 10px", borderRadius:8, background: dragGuestId===g.id ? "rgba(201,151,58,0.2)" : "rgba(255,255,255,0.04)",
                          border:"1px solid "+(dragGuestId===g.id?"rgba(201,151,58,0.4)":"rgba(255,255,255,0.06)"),
                          cursor:"grab", fontSize:12, color:"rgba(255,255,255,0.75)",
                          transition:"all .15s",
                        }}
                      >
                        <div style={{ fontWeight:600 }}>{g.name}</div>
                        {g.diet && g.diet !== "standard" && (
                          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{g.diet}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", textAlign:"center", marginTop:4, lineHeight:1.4 }}>
                Glissez un invité sur une table
              </div>
            </div>
          </div>
        )}

        {/* LISTE DES TABLES */}
        {subTab === "list" && (
          <div style={{ padding:"20px 24px" }}>
            {tables.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,0.25)" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🪑</div>
                <div style={{ fontSize:14 }}>Aucune table — cliquez "+ Table" pour en ajouter</div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
                {tables.map(function(tbl) {
                  var tblGuests = guests.filter(function(g){ return g.tableId === tbl.id; });
                  var tblPct    = tbl.capacity > 0 ? Math.round(tblGuests.length / tbl.capacity * 100) : 0;
                  var tblColor  = tbl.color || C.gold;
                  return (
                    <div key={tbl.id} style={{ background:C.card, border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"16px 18px", position:"relative" }}>
                      {/* Barre couleur */}
                      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, borderRadius:"14px 14px 0 0", background:tblColor }}/>

                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                        <div>
                          <div style={{ fontWeight:800, fontSize:15, color:"#ffffff" }}>
                            Table {tbl.number}{tbl.label ? " — "+tbl.label : ""}
                          </div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>
                            {tbl.shape === "round" ? "⬤ Ronde" : "▬ Rectangle"} · {tbl.capacity} places
                          </div>
                        </div>
                        <button onClick={function(){ removeTable(tbl.id); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:16, padding:0 }}>×</button>
                      </div>

                      {/* Progression */}
                      <div style={{ marginBottom:8 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:4 }}>
                          <span>{tblGuests.length}/{tbl.capacity} placés</span>
                          <span style={{ color: tblPct===100?C.green:tblPct>50?C.gold:C.muted, fontWeight:700 }}>{tblPct}%</span>
                        </div>
                        <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:99 }}>
                          <div style={{ height:"100%", width:tblPct+"%", background: tblPct===100?C.green:tblPct>50?C.gold:C.muted, borderRadius:99, transition:"width .3s" }}/>
                        </div>
                      </div>

                      {/* Invités */}
                      {tblGuests.length > 0 && (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
                          {tblGuests.map(function(g) {
                            return (
                              <div key={g.id} style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, padding:"3px 8px", fontSize:11, color:"rgba(255,255,255,0.65)" }}>
                                {g.name}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* FORME DE LA SALLE */}
        {subTab === "room" && (
          <div style={{ padding:"20px 24px" }}>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>
                Dessinez ou choisissez un préset pour définir la forme de votre salle
              </div>
            </div>
            <RoomShapeEditor shape={ev.roomShape || []} onChange={updateRoomShape} />
          </div>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      <QuickTablesModal
        open={showQuick}
        onClose={function(){ setShowQuick(false); }}
        onGenerate={handleQuickGenerate}
        onAddSingle={function(){ setShowAddTable(true); }}
        existingCount={tables.length}
      />
      <AddTableModal
        open={showAddTable}
        onClose={function(){ setShowAddTable(false); }}
        newTable={newTable}
        setNewTable={setNewTable}
        nextTableNumber={nextNum}
        addTable={addTable}
        t={t}
      />
      <ConstraintModal
        open={showConstraint}
        onClose={function(){ setShowConstraint(false); }}
        newConstraint={newConstraint}
        setNewConstraint={setNewConstraint}
        updateEv={addConstraint}
        ev={ev}
        t={t}
      />
      <QRModal
        open={showQR}
        onClose={function(){ setShowQR(false); }}
        eventId={ev.id}
      />
    </div>
  );
}
