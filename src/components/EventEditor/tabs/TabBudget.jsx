/* eslint-disable */
import { useState } from "react";
import { C, BUDGET_CATEGORIES } from "../../../constants";
import { uid } from "../../../utils";

var WEDDING_TEMPLATES = [
  { category:"lieu",        label:"Location du lieu",      amount:5000 },
  { category:"traiteur",    label:"Traiteur / Repas",       amount:8000 },
  { category:"traiteur",    label:"Boissons",               amount:1500 },
  { category:"decoration",  label:"Fleurs & décoration",    amount:2000 },
  { category:"musique",     label:"DJ / Orchestre",         amount:1800 },
  { category:"photo",       label:"Photographe",            amount:2500 },
  { category:"photo",       label:"Vidéaste",               amount:1500 },
  { category:"tenues",      label:"Robe de mariée",         amount:2000 },
  { category:"tenues",      label:"Costume marié",          amount:800  },
  { category:"transport",   label:"Voiture cortège",        amount:600  },
  { category:"papeterie",   label:"Invitations / faire-part", amount:400 },
  { category:"divers",      label:"Animation & cadeaux",    amount:1000 },
];

export default function TabBudget({ ev, onUpdate, t }) {
  var [showAdd,    setShowAdd]    = useState(false);
  var [showTemplates, setShowTemplates] = useState(false);
  var [sortBy,     setSortBy]     = useState("category");
  var [editId,     setEditId]     = useState(null);
  var [newLine, setNewLine] = useState({ category:"traiteur", label:"", amount:"", paid:false, notes:"" });

  var budget    = ev.budget || [];
  var total     = budget.reduce(function(s,l){ return s+(parseFloat(l.amount)||0); }, 0);
  var totalPaid = budget.reduce(function(s,l){ return s+(l.paid?(parseFloat(l.amount)||0):0); }, 0);
  var pct       = total>0 ? Math.round(totalPaid/total*100) : 0;
  var nbGuests  = (ev.guests||[]).length;
  var costPer   = nbGuests>0 && total>0 ? Math.round(total/nbGuests) : null;

  function addLine() {
    if (!newLine.label || !newLine.amount) return;
    var line = { id:uid(), ...newLine, amount:parseFloat(newLine.amount)||0 };
    onUpdate({ ...ev, budget:[...budget, line] });
    setShowAdd(false);
    setNewLine({ category:"traiteur", label:"", amount:"", paid:false, notes:"" });
  }

  function togglePaid(id) {
    onUpdate({ ...ev, budget:budget.map(function(l){ return l.id===id?{...l,paid:!l.paid}:l; }) });
  }

  function removeLine(id) {
    onUpdate({ ...ev, budget:budget.filter(function(l){ return l.id!==id; }) });
  }

  function addTemplate(tpl) {
    var line = { id:uid(), ...tpl, paid:false, notes:"" };
    onUpdate({ ...ev, budget:[...budget, line] });
  }

  function addAllTemplates() {
    var existing = budget.map(function(l){ return l.label.toLowerCase(); });
    var toAdd = WEDDING_TEMPLATES
      .filter(function(t){ return !existing.includes(t.label.toLowerCase()); })
      .map(function(t){ return { id:uid(), ...t, paid:false, notes:"" }; });
    onUpdate({ ...ev, budget:[...budget, ...toAdd] });
    setShowTemplates(false);
  }

  // Grouper par catégorie
  var byCategory = {};
  budget.forEach(function(l) {
    if (!byCategory[l.category]) byCategory[l.category]=[];
    byCategory[l.category].push(l);
  });

  // Données graphique
  var chartData = Object.entries(byCategory).map(function([cat, lines]) {
    var catInfo = BUDGET_CATEGORIES.find(function(c){ return c.id===cat; }) || { label:cat, icon:"📦", color:"#C9973A" };
    var catTotal = lines.reduce(function(s,l){ return s+(parseFloat(l.amount)||0); }, 0);
    var catPaid  = lines.reduce(function(s,l){ return s+(l.paid?(parseFloat(l.amount)||0):0); }, 0);
    return { cat, label:catInfo.label, icon:catInfo.icon, color:catInfo.color||"#C9973A", total:catTotal, paid:catPaid };
  }).sort(function(a,b){ return b.total-a.total; });
  var maxVal = chartData.length>0 ? Math.max(...chartData.map(function(d){ return d.total; })) : 1;

  return (
    <div style={{ padding:"20px 24px", maxWidth:900, fontFamily:"Georgia,serif" }}>

      {/* ── KPIs ─────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
        {[
          { label:"Budget total",  value:total.toLocaleString("fr-FR")+" €",    color:"#F0C97A", sub: costPer ? costPer+"€/invité" : "" },
          { label:"Payé",          value:totalPaid.toLocaleString("fr-FR")+" €", color:"#27AE60", sub:pct+"% réglé" },
          { label:"Restant",       value:(total-totalPaid).toLocaleString("fr-FR")+" €", color:total-totalPaid>0?"#E8845A":"rgba(255,255,255,0.3)", sub:"à payer" },
          { label:"Postes",        value:budget.length,                           color:"rgba(255,255,255,0.6)", sub:Object.keys(byCategory).length+" catégories" },
        ].map(function(s,i) {
          return (
            <div key={i} style={{ background:C.card, borderRadius:12, padding:"14px 18px", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
              {s.sub && <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:2 }}>{s.sub}</div>}
            </div>
          );
        })}
      </div>

      {/* ── Barre de progression ─────────────────────────── */}
      {total > 0 && (
        <div style={{ marginBottom:24, background:C.card, borderRadius:12, padding:"14px 18px", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>
            <span>Progression du paiement</span>
            <span style={{ color:"#27AE60", fontWeight:700 }}>{pct}% réglé</span>
          </div>
          <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:99 }}>
            <div style={{ height:"100%", width:pct+"%", background:"linear-gradient(90deg,#27AE60,#2ecc71)", borderRadius:99, transition:"width .5s" }}/>
          </div>
        </div>
      )}

      {/* ── Graphique barres par catégorie ───────────────── */}
      {chartData.length > 0 && (
        <div style={{ background:C.card, borderRadius:12, padding:"16px 20px", border:"1px solid rgba(255,255,255,0.06)", marginBottom:24 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>Répartition par poste</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {chartData.map(function(d) {
              var pctBar = maxVal>0 ? (d.total/maxVal*100) : 0;
              var pctPaid = d.total>0 ? (d.paid/d.total*100) : 0;
              return (
                <div key={d.cat} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:24, textAlign:"center", fontSize:14, flexShrink:0 }}>{d.icon}</div>
                  <div style={{ width:100, fontSize:11, color:"rgba(255,255,255,0.6)", flexShrink:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.label}</div>
                  <div style={{ flex:1, height:14, background:"rgba(255,255,255,0.04)", borderRadius:99, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:pctBar+"%", background:d.color+"33", borderRadius:99 }}/>
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:(pctBar*pctPaid/100)+"%", background:d.color, borderRadius:99, transition:"width .5s" }}/>
                  </div>
                  <div style={{ width:80, textAlign:"right", fontSize:12, fontWeight:700, color:"#F0C97A", flexShrink:0 }}>{d.total.toLocaleString("fr-FR")} €</div>
                  {d.paid>0 && <div style={{ width:60, textAlign:"right", fontSize:10, color:"#27AE60", flexShrink:0 }}>✓ {d.paid.toLocaleString("fr-FR")}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────── */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={function(){ setShowAdd(true); }} style={{ padding:"9px 18px", borderRadius:10, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.1)", color:"#F0C97A", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:700 }}>
          + Ajouter une dépense
        </button>
        <button onClick={function(){ setShowTemplates(function(v){ return !v; }); }} style={{ padding:"9px 18px", borderRadius:10, border:"1px solid rgba(201,151,58,0.2)", background:showTemplates?"rgba(201,151,58,0.1)":"none", color:"rgba(255,255,255,0.55)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
          ✨ Modèle mariage
        </button>
      </div>

      {/* ── Modèle mariage ───────────────────────────────── */}
      {showTemplates && (
        <div style={{ background:"rgba(201,151,58,0.05)", border:"1px solid rgba(201,151,58,0.15)", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#F0C97A" }}>💍 Postes typiques d un mariage</div>
            <button onClick={addAllTemplates} style={{ padding:"6px 14px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#C9973A,#F0C97A)", color:"#0d0d14", cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:800 }}>
              Tout ajouter
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:6 }}>
            {WEDDING_TEMPLATES.map(function(tpl, i) {
              var already = budget.find(function(l){ return l.label.toLowerCase()===tpl.label.toLowerCase(); });
              return (
                <button key={i} onClick={function(){ if(!already) addTemplate(tpl); }} style={{
                  padding:"7px 10px", borderRadius:8, textAlign:"left", fontFamily:"inherit",
                  border:"1px solid "+(already?"rgba(39,174,96,0.3)":"rgba(255,255,255,0.06)"),
                  background:already?"rgba(39,174,96,0.08)":"rgba(255,255,255,0.02)",
                  color:already?"#27AE60":"rgba(255,255,255,0.6)", cursor:already?"default":"pointer",
                  fontSize:11,
                }}>
                  <div style={{ fontWeight:600 }}>{tpl.label}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{already?"✓ Ajouté":tpl.amount.toLocaleString("fr-FR")+" € estimé"}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Formulaire ajout inline ───────────────────────── */}
      {showAdd && (
        <div style={{ background:C.card, border:"1px solid rgba(201,151,58,0.2)", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Nouvelle dépense</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Catégorie</div>
              <select value={newLine.category} onChange={function(e){ setNewLine({...newLine,category:e.target.value}); }}
                style={{ width:"100%", padding:"8px 10px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", colorScheme:"dark" }}>
                {BUDGET_CATEGORIES.map(function(c){ return <option key={c.id} value={c.id}>{c.icon} {c.label}</option>; })}
              </select>
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Montant (€)</div>
              <input type="number" value={newLine.amount} onChange={function(e){ setNewLine({...newLine,amount:e.target.value}); }}
                placeholder="0" onFocus={function(e){ e.target.select(); }}
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 10px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", colorScheme:"dark" }}/>
            </div>
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Libellé *</div>
            <input value={newLine.label} onChange={function(e){ setNewLine({...newLine,label:e.target.value}); }}
              placeholder="Ex: Traiteur Dupont" onKeyDown={function(e){ if(e.key==="Enter") addLine(); }}
              style={{ width:"100%", boxSizing:"border-box", padding:"8px 10px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none" }}/>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>Notes</div>
            <input value={newLine.notes} onChange={function(e){ setNewLine({...newLine,notes:e.target.value}); }}
              placeholder="Optionnel..."
              style={{ width:"100%", boxSizing:"border-box", padding:"8px 10px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none" }}/>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={function(){ setShowAdd(false); }} style={{ padding:"8px 14px", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, background:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Annuler</button>
            <button onClick={addLine} disabled={!newLine.label||!newLine.amount} style={{ padding:"8px 18px", border:"none", borderRadius:8, background:newLine.label&&newLine.amount?"linear-gradient(135deg,#C9973A,#F0C97A)":"rgba(255,255,255,0.05)", color:newLine.label&&newLine.amount?"#0d0d14":"rgba(255,255,255,0.2)", cursor:newLine.label&&newLine.amount?"pointer":"not-allowed", fontWeight:800, fontSize:12, fontFamily:"inherit" }}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* ── Liste vide ───────────────────────────────────── */}
      {budget.length === 0 && !showAdd && !showTemplates && (
        <div style={{ textAlign:"center", padding:"48px 20px", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>💰</div>
          <div style={{ fontSize:15, marginBottom:8, color:"rgba(255,255,255,0.4)" }}>Aucune dépense enregistrée</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.25)", marginBottom:20 }}>Commencez par ajouter vos postes budgétaires</div>
          <button onClick={function(){ setShowTemplates(true); }} style={{ padding:"9px 20px", borderRadius:10, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.1)", color:"#F0C97A", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
            ✨ Utiliser le modèle mariage
          </button>
        </div>
      )}

      {/* ── Liste par catégorie ──────────────────────────── */}
      {Object.entries(byCategory).map(function([cat, lines]) {
        var catInfo = BUDGET_CATEGORIES.find(function(c){ return c.id===cat; }) || { label:cat, icon:"📦", color:"#C9973A" };
        var catTotal = lines.reduce(function(s,l){ return s+(parseFloat(l.amount)||0); }, 0);
        var catPaid  = lines.reduce(function(s,l){ return s+(l.paid?(parseFloat(l.amount)||0):0); }, 0);
        return (
          <div key={cat} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, textTransform:"uppercase", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>{catInfo.icon} {catInfo.label}</span>
              <span style={{ color:"#F0C97A" }}>{catTotal.toLocaleString("fr-FR")} € <span style={{ color:"rgba(255,255,255,0.25)", fontWeight:400, fontSize:10 }}>({Math.round(catTotal/total*100)}%)</span></span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {lines.map(function(line) {
                return (
                  <div key={line.id} style={{ background:C.card, border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"11px 16px", display:"flex", alignItems:"center", gap:12, opacity:line.paid?0.65:1 }}>
                    <button onClick={function(){ togglePaid(line.id); }} style={{ width:22, height:22, borderRadius:6, border:"2px solid", borderColor:line.paid?"#27AE60":"rgba(255,255,255,0.2)", background:line.paid?"#27AE60":"transparent", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {line.paid && <span style={{ color:"#fff", fontSize:10 }}>✓</span>}
                    </button>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#fff", textDecoration:line.paid?"line-through":"none" }}>{line.label}</div>
                      {line.notes && <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{line.notes}</div>}
                    </div>
                    <div style={{ fontSize:16, fontWeight:800, color:line.paid?"#27AE60":"#F0C97A", flexShrink:0 }}>{parseFloat(line.amount).toLocaleString("fr-FR")} €</div>
                    <button onClick={function(){ removeLine(line.id); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.15)", cursor:"pointer", fontSize:18, padding:0, flexShrink:0 }}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
