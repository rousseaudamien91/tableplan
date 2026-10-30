/* eslint-disable */
import { useState } from "react";
import { C } from "../../../constants";
import { uid } from "../../../utils";

var TODO_CATEGORIES = [
  { id:"venue",      icon:"🏛️", label:"Lieu",          color:"#8B7EC8" },
  { id:"food",       icon:"🍽️", label:"Traiteur",       color:"#E8845A" },
  { id:"music",      icon:"🎵", label:"Musique",         color:"#F0C97A" },
  { id:"deco",       icon:"💐", label:"Décoration",      color:"#4CAF50" },
  { id:"guests",     icon:"👤", label:"Invités",         color:"#29B6F6" },
  { id:"admin",      icon:"📄", label:"Administratif",   color:"#C9973A" },
  { id:"photo",      icon:"📷", label:"Photo / Vidéo",   color:"#AB47BC" },
  { id:"other",      icon:"📌", label:"Autre",           color:"rgba(255,255,255,0.4)" },
];

var PRIORITY_STYLES = {
  high:   { label:"Urgent",  color:"#e05252", bg:"rgba(224,82,82,0.1)"    },
  medium: { label:"Moyen",   color:"#F0C97A", bg:"rgba(240,201,122,0.1)"  },
  low:    { label:"Faible",  color:"rgba(255,255,255,0.35)", bg:"rgba(255,255,255,0.03)" },
};

var WEDDING_TODOS = [
  { category:"venue",   label:"Confirmer la réservation du lieu",       priority:"high"   },
  { category:"food",    label:"Finaliser le menu avec le traiteur",      priority:"high"   },
  { category:"food",    label:"Confirmer le nombre de couverts",         priority:"high"   },
  { category:"music",   label:"Rencontrer le DJ / orchestre",            priority:"medium" },
  { category:"deco",    label:"Commander les fleurs",                    priority:"medium" },
  { category:"guests",  label:"Envoyer les invitations",                 priority:"high"   },
  { category:"guests",  label:"Relancer les RSVP en attente",            priority:"medium" },
  { category:"photo",   label:"Briefer le photographe sur le programme", priority:"medium" },
  { category:"admin",   label:"Signer le contrat mairie / cérémonie",   priority:"high"   },
  { category:"admin",   label:"Souscrire une assurance événement",       priority:"low"    },
  { category:"other",   label:"Préparer le plan de table final",         priority:"high"   },
  { category:"other",   label:"Préparer les cartons de placement",       priority:"medium" },
];

export default function TabTodo({ ev, onUpdate, t }) {
  var [showAdd,   setShowAdd]   = useState(false);
  var [filterCat, setFilterCat] = useState("all");
  var [filterDone, setFilterDone] = useState(false);
  var [newTodo, setNewTodo] = useState({ label:"", category:"other", priority:"medium", deadline:"", notes:"" });
  var [showTemplates, setShowTemplates] = useState(false);

  var todos = ev.todos || [];
  var done  = todos.filter(function(t){ return t.done; }).length;
  var pct   = todos.length > 0 ? Math.round(done / todos.length * 100) : 0;

  function addTodo() {
    if (!newTodo.label.trim()) return;
    onUpdate({ ...ev, todos:[...todos, { id:uid(), done:false, ...newTodo }] });
    setShowAdd(false);
    setNewTodo({ label:"", category:"other", priority:"medium", deadline:"", notes:"" });
  }

  function toggleDone(id) {
    onUpdate({ ...ev, todos:todos.map(function(t){ return t.id===id?{...t,done:!t.done}:t; }) });
  }

  function removeTodo(id) {
    onUpdate({ ...ev, todos:todos.filter(function(t){ return t.id!==id; }) });
  }

  function addTemplates() {
    var existing = todos.map(function(t){ return t.label.toLowerCase(); });
    var toAdd = WEDDING_TODOS
      .filter(function(t){ return !existing.includes(t.label.toLowerCase()); })
      .map(function(t){ return { id:uid(), done:false, notes:"", deadline:"", ...t }; });
    onUpdate({ ...ev, todos:[...todos, ...toAdd] });
    setShowTemplates(false);
  }

  var filtered = todos.filter(function(todo) {
    if (filterDone && todo.done) return false;
    if (filterCat !== "all" && todo.category !== filterCat) return false;
    return true;
  }).sort(function(a,b) {
    if (a.done !== b.done) return a.done ? 1 : -1;
    var prio = {high:0,medium:1,low:2};
    return (prio[a.priority]||1) - (prio[b.priority]||1);
  });

  return (
    <div style={{ padding:"20px 24px", maxWidth:860, fontFamily:"Georgia,serif" }}>

      {/* Header + stats */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#fff" }}>✅ Checklist organisateur</h2>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>
            {done}/{todos.length} tâches complétées · {pct}%
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={function(){ setShowTemplates(function(v){ return !v; }); }} style={{ padding:"7px 14px", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, background:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            ✨ Modèle mariage
          </button>
          <button onClick={function(){ setShowAdd(true); }} style={{ padding:"7px 16px", border:"none", borderRadius:8, background:"linear-gradient(135deg,#C9973A,#F0C97A)", color:"#0d0d14", cursor:"pointer", fontWeight:800, fontSize:12, fontFamily:"inherit" }}>
            + Tâche
          </button>
        </div>
      </div>

      {/* Barre de progression */}
      {todos.length > 0 && (
        <div style={{ marginBottom:20, background:C.card, borderRadius:12, padding:"12px 16px", border:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:6 }}>
            <span>Avancement</span>
            <span style={{ color:pct===100?"#27AE60":"#F0C97A", fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:99 }}>
            <div style={{ height:"100%", width:pct+"%", background:pct===100?"linear-gradient(90deg,#27AE60,#2ecc71)":"linear-gradient(90deg,#C9973A,#F0C97A)", borderRadius:99, transition:"width .4s" }}/>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:10, flexWrap:"wrap" }}>
            {["high","medium","low"].map(function(p) {
              var count = todos.filter(function(t){ return t.priority===p&&!t.done; }).length;
              if (!count) return null;
              var ps = PRIORITY_STYLES[p];
              return <span key={p} style={{ fontSize:11, color:ps.color }}>{count} {ps.label.toLowerCase()}</span>;
            })}
          </div>
        </div>
      )}

      {/* Modèle mariage */}
      {showTemplates && (
        <div style={{ background:"rgba(201,151,58,0.05)", border:"1px solid rgba(201,151,58,0.15)", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#F0C97A" }}>💍 Checklist typique d'un mariage</div>
            <button onClick={addTemplates} style={{ padding:"6px 14px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#C9973A,#F0C97A)", color:"#0d0d14", cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:800 }}>
              Tout ajouter
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:5 }}>
            {WEDDING_TODOS.map(function(tpl, i) {
              var already = todos.find(function(t){ return t.label.toLowerCase()===tpl.label.toLowerCase(); });
              var cat = TODO_CATEGORIES.find(function(c){ return c.id===tpl.category; })||{icon:"📌",color:"#fff"};
              var ps = PRIORITY_STYLES[tpl.priority];
              return (
                <div key={i} style={{ padding:"7px 10px", borderRadius:8, border:"1px solid "+(already?"rgba(39,174,96,0.2)":"rgba(255,255,255,0.05)"), background:already?"rgba(39,174,96,0.05)":"rgba(255,255,255,0.02)", fontSize:11 }}>
                  <div style={{ color:already?"#27AE60":"rgba(255,255,255,0.6)", fontWeight:600 }}>{cat.icon} {tpl.label}</div>
                  <div style={{ fontSize:10, color:ps.color, marginTop:2 }}>{ps.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulaire ajout */}
      {showAdd && (
        <div style={{ background:C.card, border:"1px solid rgba(201,151,58,0.2)", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>Nouvelle tâche</div>
          <input value={newTodo.label} onChange={function(e){ setNewTodo({...newTodo,label:e.target.value}); }}
            placeholder="Libellé de la tâche *" autoFocus
            onKeyDown={function(e){ if(e.key==="Enter") addTodo(); }}
            style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:13, fontFamily:"inherit", outline:"none", marginBottom:10 }}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase" }}>Catégorie</div>
              <select value={newTodo.category} onChange={function(e){ setNewTodo({...newTodo,category:e.target.value}); }}
                style={{ width:"100%", padding:"7px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", colorScheme:"dark" }}>
                {TODO_CATEGORIES.map(function(c){ return <option key={c.id} value={c.id}>{c.icon} {c.label}</option>; })}
              </select>
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase" }}>Priorité</div>
              <select value={newTodo.priority} onChange={function(e){ setNewTodo({...newTodo,priority:e.target.value}); }}
                style={{ width:"100%", padding:"7px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", colorScheme:"dark" }}>
                <option value="high">🔴 Urgent</option>
                <option value="medium">🟡 Moyen</option>
                <option value="low">⚪ Faible</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase" }}>Échéance</div>
              <input type="date" value={newTodo.deadline} onChange={function(e){ setNewTodo({...newTodo,deadline:e.target.value}); }}
                style={{ width:"100%", boxSizing:"border-box", padding:"7px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", colorScheme:"dark" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={function(){ setShowAdd(false); }} style={{ padding:"7px 14px", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, background:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Annuler</button>
            <button onClick={addTodo} style={{ padding:"7px 18px", border:"none", borderRadius:8, background:"linear-gradient(135deg,#C9973A,#F0C97A)", color:"#0d0d14", cursor:"pointer", fontWeight:800, fontSize:12, fontFamily:"inherit" }}>Ajouter</button>
          </div>
        </div>
      )}

      {/* Filtres */}
      {todos.length > 0 && (
        <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
          <button onClick={function(){ setFilterDone(function(v){ return !v; }); }} style={{ padding:"4px 10px", borderRadius:6, border:"1px solid "+(filterDone?"rgba(201,151,58,0.4)":"rgba(255,255,255,0.06)"), background:filterDone?"rgba(201,151,58,0.1)":"none", color:filterDone?"#F0C97A":"rgba(255,255,255,0.35)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
            Masquer faites
          </button>
          <button onClick={function(){ setFilterCat("all"); }} style={{ padding:"4px 10px", borderRadius:6, border:"1px solid "+(filterCat==="all"?"rgba(201,151,58,0.4)":"rgba(255,255,255,0.06)"), background:filterCat==="all"?"rgba(201,151,58,0.1)":"none", color:filterCat==="all"?"#F0C97A":"rgba(255,255,255,0.35)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
            Toutes
          </button>
          {TODO_CATEGORIES.filter(function(cat){ return todos.some(function(t){ return t.category===cat.id; }); }).map(function(cat) {
            return (
              <button key={cat.id} onClick={function(){ setFilterCat(cat.id); }} style={{ padding:"4px 10px", borderRadius:6, border:"1px solid "+(filterCat===cat.id?cat.color:"rgba(255,255,255,0.06)"), background:filterCat===cat.id?cat.color+"22":"none", color:filterCat===cat.id?cat.color:"rgba(255,255,255,0.35)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Liste vide */}
      {todos.length === 0 && !showAdd && (
        <div style={{ textAlign:"center", padding:"48px 20px", color:"rgba(255,255,255,0.25)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
          <div style={{ fontSize:15, marginBottom:6, color:"rgba(255,255,255,0.4)" }}>Aucune tâche pour le moment</div>
          <button onClick={function(){ setShowTemplates(true); }} style={{ padding:"9px 20px", borderRadius:10, border:"1px solid rgba(201,151,58,0.3)", background:"rgba(201,151,58,0.1)", color:"#F0C97A", cursor:"pointer", fontSize:13, fontFamily:"inherit", marginTop:12 }}>
            ✨ Utiliser la checklist mariage
          </button>
        </div>
      )}

      {/* Liste des tâches */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {filtered.map(function(todo) {
          var cat = TODO_CATEGORIES.find(function(c){ return c.id===todo.category; })||{icon:"📌",color:"#fff"};
          var ps  = PRIORITY_STYLES[todo.priority]||PRIORITY_STYLES.medium;
          var isOverdue = todo.deadline && !todo.done && new Date(todo.deadline) < new Date();
          return (
            <div key={todo.id} style={{ background:C.card, border:"1px solid "+(isOverdue?"rgba(224,82,82,0.25)":todo.done?"rgba(39,174,96,0.1)":"rgba(255,255,255,0.05)"), borderRadius:10, padding:"11px 16px", display:"flex", alignItems:"center", gap:12, opacity:todo.done?0.55:1 }}>
              {/* Checkbox */}
              <button onClick={function(){ toggleDone(todo.id); }} style={{ width:22, height:22, borderRadius:6, border:"2px solid", borderColor:todo.done?"#27AE60":cat.color+"66", background:todo.done?"#27AE60":"transparent", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
                {todo.done && <span style={{ color:"#fff", fontSize:10, fontWeight:800 }}>✓</span>}
              </button>
              {/* Priorité dot */}
              <div style={{ width:6, height:6, borderRadius:"50%", background:ps.color, flexShrink:0 }}/>
              {/* Contenu */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff", textDecoration:todo.done?"line-through":"none" }}>{todo.label}</div>
                <div style={{ display:"flex", gap:8, marginTop:3, flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, color:cat.color }}>{cat.icon} {cat.label}</span>
                  {todo.deadline && (
                    <span style={{ fontSize:10, color:isOverdue?"#e05252":"rgba(255,255,255,0.3)" }}>
                      {isOverdue?"⚠ ":"📅 "}{todo.deadline}
                    </span>
                  )}
                  {todo.notes && <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>📝 {todo.notes}</span>}
                </div>
              </div>
              <button onClick={function(){ removeTodo(todo.id); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.15)", cursor:"pointer", fontSize:18, flexShrink:0 }}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
