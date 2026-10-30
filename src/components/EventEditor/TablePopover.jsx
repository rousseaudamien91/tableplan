/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { C, DIET_OPTIONS } from "../../constants";

// ─────────────────────────────────────────────────────────────
// TABLE POPOVER — Menu contextuel au clic sur une table
// ─────────────────────────────────────────────────────────────

export default function TablePopover({ table, guests, ev, onClose, onUpdate, onEdit, position }) {
  var ref = useRef(null);
  var [editingNote, setEditingNote] = useState(false);
  var [noteVal, setNoteVal] = useState(table.notes||"");
  var tblGuests = guests.filter(function(g){ return g.tableId === table.id; });
  var unseated  = guests.filter(function(g){ return !g.tableId; });
  var isFull    = tblGuests.length >= table.capacity;

  useEffect(function() {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return function() { document.removeEventListener("mousedown", handleClick); };
  }, []);

  function removeGuest(guestId) {
    onUpdate({ ...ev, guests: guests.map(function(g){ return g.id === guestId ? {...g, tableId: null} : g; }) });
  }

  function assignGuest(guestId) {
    onUpdate({ ...ev, guests: guests.map(function(g){ return g.id === guestId ? {...g, tableId: table.id} : g; }) });
  }

  function clearTable() {
    onUpdate({ ...ev, guests: guests.map(function(g){ return g.tableId === table.id ? {...g, tableId: null} : g; }) });
    onClose();
  }

  function deleteTable() {
    if (!window.confirm("Supprimer Table " + table.number + " ?")) return;
    onUpdate({
      ...ev,
      tables: (ev.tables||[]).filter(function(t){ return t.id !== table.id; }),
      guests: guests.map(function(g){ return g.tableId === table.id ? {...g, tableId: null} : g; }),
    });
    onClose();
  }

  var pct = table.capacity > 0 ? Math.round(tblGuests.length / table.capacity * 100) : 0;
  var barCol = pct >= 100 ? C.green : pct > 60 ? C.gold : "#4CAF50";

  // Position du popover — rester dans la fenêtre
  var style = {
    position:"fixed", zIndex:7000,
    left: Math.min(position.x, window.innerWidth - 320) + "px",
    top:  Math.min(position.y, window.innerHeight - 400) + "px",
    width:280,
    background:"#18182a", border:"1px solid rgba(201,151,58,0.25)",
    borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,0.7)",
    fontFamily:"Georgia,serif", overflow:"hidden",
  };

  return (
    <div ref={ref} style={style}>
      {/* Header */}
      <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(201,151,58,0.06)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:"#fff" }}>
              Table {table.number}{table.label ? " — " + table.label : ""}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>
              {table.shape === "round" ? "⬤ Ronde" : "▬ Rectangle"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        {/* Barre de remplissage */}
        <div style={{ marginTop:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>
            <span>{tblGuests.length}/{table.capacity} places</span>
            <span style={{ color:barCol, fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:99 }}>
            <div style={{ height:"100%", width:pct+"%", background:barCol, borderRadius:99, transition:"width .3s" }}/>
          </div>
        </div>
      </div>

      {/* Invités assis */}
      {tblGuests.length > 0 && (
        <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Assis à cette table</div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {tblGuests.map(function(g) {
              var diet = DIET_OPTIONS.find(function(d){ return d.id===g.diet; });
              return (
                <div key={g.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0" }}>
                  <div style={{ width:24, height:24, borderRadius:6, background:"rgba(201,151,58,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"#C9973A", fontSize:11, fontWeight:800, flexShrink:0 }}>
                    {g.name[0]?.toUpperCase()}
                  </div>
                  <span style={{ flex:1, fontSize:12, color:"rgba(255,255,255,0.8)" }}>{g.name}</span>
                  {diet && diet.id !== "standard" && <span title={diet.label} style={{ fontSize:14 }}>{diet.icon}</span>}
                  <button onClick={function(){ removeGuest(g.id); }} title="Retirer de la table" style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:14, padding:0, flexShrink:0 }}>×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assigner un invité non placé */}
      {!isFull && unseated.length > 0 && (
        <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Assigner un invité</div>
          <div style={{ maxHeight:120, overflowY:"auto", display:"flex", flexDirection:"column", gap:3 }}>
            {unseated.map(function(g) {
              return (
                <button key={g.id} onClick={function(){ assignGuest(g.id); }}
                  style={{ padding:"5px 8px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:11, fontFamily:"inherit", textAlign:"left", display:"flex", alignItems:"center", gap:6, transition:"all .1s" }}>
                  <span style={{ width:20, height:20, borderRadius:4, background:"rgba(201,151,58,0.12)", display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#C9973A", fontSize:10, fontWeight:800 }}>{g.name[0]?.toUpperCase()}</span>
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {isFull && (
        <div style={{ padding:"8px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:11, color:C.green, textAlign:"center" }}>✅ Table complète</div>
      )}

      {/* Notes de table */}
      <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        {!editingNote ? (
          <div onClick={function(){ setEditingNote(true); }} style={{ fontSize:11, color:table.notes?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.2)", cursor:"pointer", fontStyle:table.notes?"normal":"italic", minHeight:20, lineHeight:1.5 }}>
            {table.notes ? "📝 "+table.notes : "Cliquez pour ajouter une note..."}
          </div>
        ) : (
          <div>
            <textarea
              value={noteVal}
              onChange={function(e){ setNoteVal(e.target.value); }}
              autoFocus
              rows={2}
              placeholder="Note sur cette table..."
              style={{ width:"100%", boxSizing:"border-box", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:6, color:"#fff", fontSize:11, fontFamily:"inherit", padding:"6px 8px", resize:"none", outline:"none" }}
            />
            <div style={{ display:"flex", gap:6, marginTop:6 }}>
              <button onClick={function(){
                var updTables = (ev.tables||[]).map(function(t){ return t.id===table.id?{...t,notes:noteVal}:t; });
                onUpdate({...ev, tables:updTables});
                setEditingNote(false);
              }} style={{ padding:"4px 10px", borderRadius:6, border:"none", background:"rgba(201,151,58,0.2)", color:"#F0C97A", cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:700 }}>
                ✓ OK
              </button>
              <button onClick={function(){ setEditingNote(false); setNoteVal(table.notes||""); }} style={{ padding:"4px 8px", borderRadius:6, border:"none", background:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding:"10px 16px", display:"flex", gap:6, flexWrap:"wrap" }}>
        <button onClick={clearTable} style={{ flex:1, padding:"7px 8px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          🔄 Vider
        </button>
        <button onClick={deleteTable} style={{ flex:1, padding:"7px 8px", borderRadius:8, border:"1px solid rgba(192,57,43,0.2)", background:"rgba(192,57,43,0.06)", color:C.red, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          🗑 Supprimer
        </button>
      </div>
    </div>
  );
}
