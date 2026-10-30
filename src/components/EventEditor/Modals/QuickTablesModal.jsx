/* eslint-disable */
import { useState } from "react";

// Calcule les positions optimales pour N tables dans le canvas
function autoPlaceTables(count, canvasW, canvasH) {
  var W = (canvasW || 800);
  var H = (canvasH || 560);
  var TABLE_R = 50; // rayon table + marge de securite
  var margin = TABLE_R + 20;
  var innerW = W - margin * 2;
  var innerH = H - margin * 2;

  // Nombre de colonnes optimal selon le ratio largeur/hauteur
  var cols = Math.max(1, Math.round(Math.sqrt(count * innerW / innerH)));
  cols = Math.min(cols, count);
  var rows = Math.ceil(count / cols);

  // Ajuster cols si rows est trop petit (evite les lignes surchargees)
  while (cols > 1 && Math.ceil(count / (cols - 1)) <= rows + 1) {
    var newCols = cols - 1;
    var newRows = Math.ceil(count / newCols);
    var newMaxPerRow = newCols;
    var oldMaxPerRow = cols;
    // Garder si ca reduit le desequilibre
    if (newMaxPerRow - (count - newCols * (newRows - 1)) <= oldMaxPerRow - (count - cols * (rows - 1))) break;
    cols = newCols;
    rows = newRows;
  }

  var positions = [];
  var idx = 0;

  for (var row = 0; row < rows; row++) {
    // Nombre de tables dans cette rangee
    var remaining = count - idx;
    var tablesInRow = row < rows - 1 ? cols : remaining;

    for (var col = 0; col < tablesInRow; col++) {
      // Espacement horizontal : distribuer uniformement dans innerW
      var x, y;
      if (tablesInRow === 1) {
        x = W / 2;
      } else {
        x = margin + col * innerW / (tablesInRow - 1);
      }
      // Espacement vertical : distribuer uniformement dans innerH
      if (rows === 1) {
        y = H / 2;
      } else {
        y = margin + row * innerH / (rows - 1);
      }
      // Bornes strictes
      x = Math.max(margin, Math.min(W - margin, Math.round(x)));
      y = Math.max(margin, Math.min(H - margin, Math.round(y)));
      positions.push({ x: x, y: y });
      idx++;
    }
  }
  return positions;
}

export default function QuickTablesModal({ open, onClose, onGenerate, onAddSingle, existingCount }) {
  var [count,    setCount]    = useState(10);
  var [capacity, setCapacity] = useState(8);
  var [shape,    setShape]    = useState("round");
  var [preview,  setPreview]  = useState(false);

  if (!open) return null;

  function handleGenerate() {
    var positions = autoPlaceTables(count, 800, 560);
    var tables = positions.map(function(pos, i) {
      return {
        id: Date.now() + i,
        number: existingCount + i + 1,
        label: "",
        shape: shape,
        capacity: capacity,
        color: "",
        x: pos.x,
        y: pos.y,
        guests: [],
      };
    });
    onGenerate(tables);
    onClose();
  }

  // Aperçu miniature du placement
  var previewPositions = autoPlaceTables(count, 300, 180);
  var tR = shape === "round" ? 12 : null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"Georgia,serif" }}>
      <div style={{ width:"100%", maxWidth:480, background:"#18182a", borderRadius:20, border:"1px solid rgba(201,151,58,0.2)", padding:"28px 28px 24px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#fff" }}>⚡ Génération rapide</h2>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>Crée et place les tables automatiquement</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        {/* Formulaire */}
        <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>

          {/* Nombre de tables */}
          <div>
            <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>
              NOMBRE DE TABLES
            </label>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={function(){ setCount(function(c){ return Math.max(1,c-1); }); }}
                style={{ width:36, height:36, borderRadius:8, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.08)", color:"#F0C97A", cursor:"pointer", fontSize:18, fontWeight:700 }}>−</button>
              <input type="number" value={count} min="1" max="50"
                onChange={function(e){ var v=parseInt(e.target.value); if(!isNaN(v)) setCount(Math.max(1,Math.min(50,v))); }}
                onFocus={function(e){ e.target.select(); }}
                onBlur={function(e){ if(!e.target.value||parseInt(e.target.value)<1) setCount(1); }}
                style={{ width:70, textAlign:"center", padding:"8px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:20, fontWeight:800, fontFamily:"inherit", outline:"none", colorScheme:"dark", MozAppearance:"textfield" }}
              />
              <button onClick={function(){ setCount(function(c){ return Math.min(50,c+1); }); }}
                style={{ width:36, height:36, borderRadius:8, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.08)", color:"#F0C97A", cursor:"pointer", fontSize:18, fontWeight:700 }}>+</button>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>tables (max 50)</span>
            </div>
          </div>

          {/* Places par table */}
          <div>
            <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>
              PLACES PAR TABLE
            </label>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={function(){ setCapacity(function(c){ return Math.max(1,c-1); }); }}
                style={{ width:36, height:36, borderRadius:8, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.08)", color:"#F0C97A", cursor:"pointer", fontSize:18, fontWeight:700 }}>−</button>
              <input type="number" value={capacity} min="1" max="30"
                onChange={function(e){ var v=parseInt(e.target.value); if(!isNaN(v)) setCapacity(Math.max(1,Math.min(30,v))); }}
                onFocus={function(e){ e.target.select(); }}
                onBlur={function(e){ if(!e.target.value||parseInt(e.target.value)<1) setCapacity(1); }}
                style={{ width:70, textAlign:"center", padding:"8px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:20, fontWeight:800, fontFamily:"inherit", outline:"none", colorScheme:"dark", MozAppearance:"textfield" }}
              />
              <button onClick={function(){ setCapacity(function(c){ return Math.min(30,c+1); }); }}
                style={{ width:36, height:36, borderRadius:8, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.08)", color:"#F0C97A", cursor:"pointer", fontSize:18, fontWeight:700 }}>+</button>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>places · {count * capacity} total</span>
            </div>
          </div>

          {/* Forme */}
          <div>
            <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>FORME DES TABLES</label>
            <div style={{ display:"flex", gap:8 }}>
              {[
                { id:"round", label:"⬤ Ronde" },
                { id:"rect",  label:"▬ Rectangle" },
              ].map(function(s) {
                var active = shape === s.id;
                return (
                  <button key={s.id} onClick={function(){ setShape(s.id); }} style={{
                    flex:1, padding:"10px 14px", borderRadius:10,
                    border:"2px solid "+(active?"#C9973A":"rgba(255,255,255,0.08)"),
                    background:active?"rgba(201,151,58,0.15)":"rgba(255,255,255,0.03)",
                    color:active?"#F0C97A":"rgba(255,255,255,0.45)",
                    cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:active?700:400,
                  }}>{s.label}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Aperçu miniature */}
        <div style={{ background:"#0a0604", borderRadius:12, border:"1px solid rgba(201,151,58,0.12)", padding:8, marginBottom:20 }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:6, textAlign:"center", letterSpacing:1, textTransform:"uppercase" }}>Aperçu du placement</div>
          <svg viewBox="0 0 300 180" style={{ width:"100%", display:"block" }}>
            <rect width="300" height="180" fill="#0a0604"/>
            {/* Grille légère */}
            <defs>
              <pattern id="qg" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="300" height="180" fill="url(#qg)"/>
            {/* Tables */}
            {previewPositions.map(function(pos, i) {
              return shape === "round"
                ? <circle key={i} cx={pos.x} cy={pos.y} r={tR} fill="rgba(201,151,58,0.15)" stroke="#C9973A" strokeWidth="1"/>
                : <rect key={i} x={pos.x-16} y={pos.y-9} width={32} height={18} rx="3" fill="rgba(201,151,58,0.15)" stroke="#C9973A" strokeWidth="1"/>;
            })}
          </svg>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:4 }}>
            {count} tables · {count * capacity} places au total
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"11px", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, background:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
            Annuler
          </button>
          <button onClick={handleGenerate} style={{ flex:2, padding:"11px", border:"none", borderRadius:10, background:"linear-gradient(135deg,#C9973A,#F0C97A)", color:"#0d0d14", cursor:"pointer", fontWeight:800, fontSize:13, fontFamily:"inherit" }}>
            ⚡ Générer {count} tables
          </button>
        </div>
        {onAddSingle && (
          <div style={{ textAlign:"center", marginTop:10 }}>
            <button onClick={function(){ onClose(); onAddSingle(); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:11, fontFamily:"inherit", textDecoration:"underline" }}>
              Ajouter une seule table manuellement →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
