/* eslint-disable */
import { useState } from "react";
import { C } from "../../../constants";
import { uid } from "../../../utils";

var COURSES = [
  { id:"appetizer", icon:"🥗", label:"Entrée" },
  { id:"main",      icon:"🍽️", label:"Plat principal" },
  { id:"dessert",   icon:"🍰", label:"Dessert" },
  { id:"drinks",    icon:"🥂", label:"Boissons" },
];

var DIET_COLORS = {
  standard:"rgba(255,255,255,0.5)", vegetarian:"#4CAF50", vegan:"#8BC34A",
  glutenfree:"#FF9800", halal:"#2196F3", kosher:"#9C27B0", lactosefree:"#00BCD4",
};

export default function TabMenu({ ev, onUpdate, t }) {
  var [activeTab, setActiveTab] = useState("global");
  var [showAdd,   setShowAdd]   = useState(false);
  var [newItem,   setNewItem]   = useState({ course:"main", label:"", description:"", diets:["standard"] });

  var menu   = ev.menu   || { items:[], perGuest:{} };
  var guests = ev.guests || [];
  var items  = menu.items || [];

  function addItem() {
    if (!newItem.label.trim()) return;
    var item = { id:uid(), ...newItem };
    onUpdate({ ...ev, menu:{ ...menu, items:[...items, item] } });
    setShowAdd(false);
    setNewItem({ course:"main", label:"", description:"", diets:["standard"] });
  }

  function removeItem(id) {
    onUpdate({ ...ev, menu:{ ...menu, items:items.filter(function(i){ return i.id!==id; }) } });
  }

  function setGuestChoice(guestId, courseId, choiceLabel) {
    var perGuest = { ...(menu.perGuest||{}) };
    if (!perGuest[guestId]) perGuest[guestId] = {};
    perGuest[guestId][courseId] = choiceLabel;
    onUpdate({ ...ev, menu:{ ...menu, perGuest } });
  }

  function exportMenuPDF() {
    var rows = guests.map(function(g) {
      var tbl = (ev.tables||[]).find(function(t){ return t.id===g.tableId; });
      var choices = (menu.perGuest||{})[g.id] || {};
      var cols = COURSES.map(function(c) {
        return "<td style='padding:6px 10px;border-bottom:1px solid #eee;font-size:12px'>" + (choices[c.id]||"—") + "</td>";
      }).join("");
      return "<tr><td style='padding:6px 10px;border-bottom:1px solid #eee;font-weight:600'>" + g.name + "</td>" +
        "<td style='padding:6px 10px;border-bottom:1px solid #eee;color:#666;font-size:11px'>" + (tbl?"Table "+tbl.number:"—") + "</td>" +
        cols + "</tr>";
    }).join("");
    var headers = COURSES.map(function(c){ return "<th style='padding:8px 10px;background:#f8f4ee;text-align:left;font-size:11px;border-bottom:2px solid #C9973A'>" + c.icon + " " + c.label + "</th>"; }).join("");
    var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Menu — " + ev.name + "</title>" +
      "<style>body{font-family:Georgia,serif;margin:32px;color:#1a1a1a}h1{font-size:20px;margin-bottom:20px}table{width:100%;border-collapse:collapse}</style>" +
      "</head><body><h1>🍽️ Plan repas — " + ev.name + "</h1>" +
      "<table><thead><tr><th style='padding:8px 10px;background:#f8f4ee;text-align:left;font-size:11px;border-bottom:2px solid #C9973A'>Invité</th>" +
      "<th style='padding:8px 10px;background:#f8f4ee;text-align:left;font-size:11px;border-bottom:2px solid #C9973A'>Table</th>" +
      headers + "</tr></thead><tbody>" + rows + "</tbody></table></body></html>";
    var win = window.open("","_blank"); win.document.write(html); win.document.close();
    setTimeout(function(){ win.print(); }, 400);
  }

  // Grouper items par service
  var byCourse = {};
  COURSES.forEach(function(c){ byCourse[c.id] = []; });
  items.forEach(function(i){ if (!byCourse[i.course]) byCourse[i.course]=[]; byCourse[i.course].push(i); });

  return (
    <div style={{ padding:"20px 24px", maxWidth:900, fontFamily:"Georgia,serif" }}>

      {/* Header + onglets */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#fff" }}>🍽️ Menu & Plan de repas</h2>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>Définissez le menu et les choix par invité</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {guests.length > 0 && (
            <button onClick={exportMenuPDF} style={{ padding:"8px 14px", border:"1px solid rgba(201,151,58,0.3)", borderRadius:8, background:"rgba(201,151,58,0.08)", color:"#F0C97A", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700 }}>
              🖨️ PDF traiteur
            </button>
          )}
        </div>
      </div>

      {/* Tabs global / par invité */}
      <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        {[{id:"global",label:"📋 Menu global"},{id:"guests",label:"👤 Par invité"}].map(function(tab) {
          var active = activeTab===tab.id;
          return (
            <button key={tab.id} onClick={function(){ setActiveTab(tab.id); }} style={{
              padding:"9px 20px", background:"none", border:"none",
              borderBottom:"2px solid "+(active?"#C9973A":"transparent"),
              color:active?"#F0C97A":"rgba(255,255,255,0.4)",
              cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:active?700:400,
            }}>{tab.label}</button>
          );
        })}
      </div>

      {/* ── MENU GLOBAL ─────────────────────────────── */}
      {activeTab === "global" && (
        <div>
          {/* Services */}
          {COURSES.map(function(course) {
            var courseItems = byCourse[course.id] || [];
            return (
              <div key={course.id} style={{ marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{course.icon} {course.label}</div>
                  <button onClick={function(){ setNewItem({...newItem,course:course.id}); setShowAdd(true); }}
                    style={{ padding:"4px 10px", border:"1px solid rgba(201,151,58,0.2)", borderRadius:6, background:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                    + Ajouter
                  </button>
                </div>
                {courseItems.length === 0 ? (
                  <div style={{ padding:"14px 16px", background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px dashed rgba(255,255,255,0.06)", fontSize:12, color:"rgba(255,255,255,0.2)", textAlign:"center" }}>
                    Aucun plat défini pour ce service
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {courseItems.map(function(item) {
                      return (
                        <div key={item.id} style={{ background:C.card, border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{item.label}</div>
                            {item.description && <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{item.description}</div>}
                            <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                              {(item.diets||["standard"]).map(function(d) {
                                return <span key={d} style={{ fontSize:10, color:DIET_COLORS[d]||"#fff", border:"1px solid "+(DIET_COLORS[d]||"#fff")+"44", borderRadius:4, padding:"1px 6px" }}>{d}</span>;
                              })}
                            </div>
                          </div>
                          <button onClick={function(){ removeItem(item.id); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:18 }}>×</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Formulaire ajout */}
          {showAdd && (
            <div style={{ background:C.card, border:"1px solid rgba(201,151,58,0.2)", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>Nouveau plat</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase" }}>Service</div>
                  <select value={newItem.course} onChange={function(e){ setNewItem({...newItem,course:e.target.value}); }}
                    style={{ width:"100%", padding:"8px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", colorScheme:"dark" }}>
                    {COURSES.map(function(c){ return <option key={c.id} value={c.id}>{c.icon} {c.label}</option>; })}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase" }}>Régimes concernés</div>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                    {["standard","vegetarian","vegan","glutenfree","halal"].map(function(d) {
                      var sel = (newItem.diets||[]).includes(d);
                      return (
                        <button key={d} onClick={function(){
                          var next = sel ? newItem.diets.filter(function(x){return x!==d;}) : [...(newItem.diets||[]),d];
                          setNewItem({...newItem,diets:next});
                        }} style={{ padding:"3px 8px", borderRadius:5, border:"1px solid "+(sel?DIET_COLORS[d]:"rgba(255,255,255,0.08)"), background:sel?DIET_COLORS[d]+"22":"none", color:sel?DIET_COLORS[d]:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <input value={newItem.label} onChange={function(e){ setNewItem({...newItem,label:e.target.value}); }}
                placeholder="Nom du plat *" onKeyDown={function(e){ if(e.key==="Enter") addItem(); }}
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 10px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", marginBottom:8 }}/>
              <input value={newItem.description} onChange={function(e){ setNewItem({...newItem,description:e.target.value}); }}
                placeholder="Description (optionnel)"
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 10px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", marginBottom:10 }}/>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={function(){ setShowAdd(false); }} style={{ padding:"7px 14px", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, background:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Annuler</button>
                <button onClick={addItem} style={{ padding:"7px 18px", border:"none", borderRadius:8, background:"linear-gradient(135deg,#C9973A,#F0C97A)", color:"#0d0d14", cursor:"pointer", fontWeight:800, fontSize:12, fontFamily:"inherit" }}>Ajouter</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MENU PAR INVITÉ ──────────────────────────── */}
      {activeTab === "guests" && (
        <div>
          {guests.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 20px", color:"rgba(255,255,255,0.25)" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>👤</div>
              <div>Aucun invité — ajoutez des invités dans l'onglet Invités</div>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 20px", color:"rgba(255,255,255,0.25)" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
              <div>Définissez d'abord votre menu dans l'onglet Menu global</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {/* Header colonnes */}
              <div style={{ display:"grid", gridTemplateColumns:"200px repeat("+COURSES.length+",1fr)", gap:8, padding:"6px 12px" }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1 }}>Invité</div>
                {COURSES.map(function(c){ return <div key={c.id} style={{ fontSize:10, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1 }}>{c.icon} {c.label}</div>; })}
              </div>
              {guests.map(function(g) {
                var tbl = (ev.tables||[]).find(function(t){ return t.id===g.tableId; });
                var choices = (menu.perGuest||{})[g.id] || {};
                return (
                  <div key={g.id} style={{ display:"grid", gridTemplateColumns:"200px repeat("+COURSES.length+",1fr)", gap:8, background:C.card, border:"1px solid rgba(255,255,255,0.05)", borderRadius:10, padding:"10px 12px", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{g.name}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{tbl?"Table "+tbl.number:"Non placé"} {g.diet&&g.diet!=="standard"?"· "+g.diet:""}</div>
                    </div>
                    {COURSES.map(function(course) {
                      var courseItems = (byCourse[course.id]||[]);
                      var relevantItems = courseItems.filter(function(i){ return !i.diets||i.diets.includes("standard")||i.diets.includes(g.diet||"standard"); });
                      var choice = choices[course.id] || "";
                      return (
                        <select key={course.id} value={choice} onChange={function(e){ setGuestChoice(g.id, course.id, e.target.value); }}
                          style={{ width:"100%", padding:"5px 7px", background:"#13131e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, color:choice?"#fff":"rgba(255,255,255,0.3)", fontSize:11, fontFamily:"inherit", outline:"none", colorScheme:"dark" }}>
                          <option value="">— Choisir</option>
                          {relevantItems.map(function(i){ return <option key={i.id} value={i.label}>{i.label}</option>; })}
                          {courseItems.length === 0 && <option disabled>Aucun plat défini</option>}
                        </select>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
