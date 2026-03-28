/* eslint-disable */
import { getFirebase } from "../firebase";
import { useState, useEffect, useRef, useCallback } from "react";
import { C, useI18n } from "../theme";
import { Btn, Badge, Modal, Field, Input, Select, useQRLib, QRCodeWidget } from "./UI";
import { DIET_OPTIONS, THEMES_CONFIG, PLANS, VOUCHERS } from "../constants";
import { uid, dietInfo, printFloorPlan, exportGuestsCSV, printPlaceCards, printDietSummary } from "../utils";
import { FloorPlan, RoomShapeEditor } from "./FloorPlan";
import GuestForm from "./GuestForm";

// ═══════════════════════════════════════════════════════════════
// EVENT EDITOR — Éditeur d'événement complet
// ═══════════════════════════════════════════════════════════════

function EventEditor({ ev, onUpdate, onBack, saveToast, t: tProp }) {
  const { t: tHook } = useI18n();
  const t = tProp || tHook;

  // Style partagé pour les inputs/textarea
  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const [tab, setTab] = useState("plan");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showAddFurniture, setShowAddFurniture] = useState(false);
  const [newZone, setNewZone] = useState({ label:"", icon:"📍", color:"#C9973A" });
  const [newFurniture, setNewFurniture] = useState({ label:"", icon:"🪑", color:"#8A7355", width:80, height:40 });
  const [planSubTab, setPlanSubTab] = useState("tables");
  const [showConstraint, setShowConstraint] = useState(false);
  // IA proactive
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [aiAssistMsg, setAiAssistMsg] = useState("");
  const [aiAssistHistory, setAiAssistHistory] = useState([]);
  const [aiAssistLoading, setAiAssistLoading] = useState(false);
  // Budget
  const BUDGET_CATEGORIES = [
    {id:"salle",label:"Salle / Lieu",icon:"🏛"},
    {id:"traiteur",label:"Traiteur",icon:"🍽"},
    {id:"boissons",label:"Boissons",icon:"🍷"},
    {id:"musique",label:"Musique / DJ",icon:"🎵"},
    {id:"fleurs",label:"Fleurs / Déco",icon:"💐"},
    {id:"photo",label:"Photo / Vidéo",icon:"📸"},
    {id:"transport",label:"Transport",icon:"🚌"},
    {id:"tenues",label:"Tenues",icon:"👗"},
    {id:"invitations",label:"Invitations",icon:"💌"},
    {id:"divers",label:"Divers",icon:"📦"},
  ];
  const [newBudgetLine, setNewBudgetLine] = useState({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""});
  const [showAddBudget, setShowAddBudget] = useState(false);
  // Planning
  const [newTask, setNewTask] = useState({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});
  const [showAddTask, setShowAddTask] = useState(false);
  // Programme
  const [newProgramItem, setNewProgramItem] = useState({time:"",label:"",icon:"🎤",notes:""});
  const [showAddProgramItem, setShowAddProgramItem] = useState(false);
  const [newSupplier, setNewSupplier] = useState({name:"",role:"",phone:"",email:"",notes:""});
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newGuest, setNewGuest] = useState({ name:"", email:"", diet:"standard", notes:"", allergies:[] });
  const [newTable, setNewTable] = useState({ number:"", capacity:8, shape:"round", label:"" });
  // Auto-numérotation
  const nextTableNumber = ev.tables.reduce((mx, tbl) => Math.max(mx, tbl.number), 0) + 1;
  const [constraint, setConstraint] = useState({ a:"", b:"", type:"together" });
  const [search, setSearch] = useState("");
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [highlightTables, setHighlightTables] = useState(false);
  const [selectedUnseatedGuest, setSelectedUnseatedGuest] = useState(null);
  const [tablesHistory, setTablesHistory] = useState([]);
  const pushHistory = (tables) => setTablesHistory(h => [...h.slice(-9), tables]);
  const undoTables = () => {
    if (tablesHistory.length === 0) return;
    const prev = tablesHistory[tablesHistory.length - 1];
    setTablesHistory(h => h.slice(0, -1));
    updateEv(e => ({ ...e, tables: prev }));
  };

  var theme = THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
  var seated = ev.guests.filter(function(gst){ return !!gst.tableId; });
  var unseated = ev.guests.filter(function(gst){ return !gst.tableId; });
  const tableSel = ev.tables.find(t=>t.id===selectedTable);
  var tableGuests = tableSel ? ev.guests.filter(function(gst){ return gst.tableId===selectedTable; }) : [];
  var filtered = ev.guests.filter(function(gst){ return gst.name.toLowerCase().includes(search.toLowerCase()); });

  // Diet stats
  var dietStats = DIET_OPTIONS.filter(function(dopt){ return dopt.id!=="standard"; }).map(function(dopt){
    return {...dopt, count: ev.guests.filter(function(gst){ return gst.diet===dopt.id || (gst.allergies||[]).includes(dopt.id); }).length};
  }).filter(function(dopt){ return dopt.count > 0; });

  function updateEv(fn) { onUpdate(fn(ev)); }
  function addGuest() {
    if (!newGuest.name.trim()) return;
    updateEv(e=>({ ...e, guests:[...e.guests,{id:Date.now(),...newGuest,tableId:selectedTable||null}] }));
    setNewGuest({name:"",email:"",diet:"standard",notes:"",allergies:[]});
    setShowAddGuest(false);
  }
  function addTable() {
    const n = newTable.number ? parseInt(newTable.number) : nextTableNumber;
    const x = 150 + (ev.tables.length % 5)*130;
    const y = 160 + Math.floor(ev.tables.length/5)*140;
    updateEv(e=>({ ...e, tables:[...e.tables,{id:Date.now(),number:n,capacity:parseInt(newTable.capacity),shape:newTable.shape,label:newTable.label,color:newTable.color,x,y}] }));
    setNewTable({number:"",capacity:8,shape:"round",label:"",color:undefined});
    setShowAddTable(false);
  }
  function addConstraint() {
    if (!constraint.a||!constraint.b||constraint.a===constraint.b) return;
    updateEv(e=>({ ...e, constraints:[...e.constraints,{id:Date.now(),...constraint}] }));
    setConstraint({a:"",b:"",type:"together"});
    setShowConstraint(false);
  }
  const [aiPlacing, setAiPlacing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  async function autoPlace() {
    if (ev.tables.length === 0 || ev.guests.length === 0) return;
    setAiPlacing(true);
    setAiExplanation("");
    try {
      const context = {
        tables: ev.tables.map(function(tbl){ return { id: tbl.id, number: tbl.number, capacity: tbl.capacity, label: tbl.label||"" }; }),
        guests: ev.guests.map(function(g){ return { id: g.id, name: g.name, diet: g.diet, allergies: g.allergies||[] }; }),
        constraints: ev.constraints || [],
      };
      const prompt = `Tu es un assistant de plans de table.
Tables disponibles: ${JSON.stringify(context.tables)}
Invités: ${JSON.stringify(context.guests)}
Contraintes: ${JSON.stringify(context.constraints)}
Assigne chaque invité à une table en respectant la capacité max, les contraintes ensemble/séparés, et en regroupant les régimes alimentaires similaires.
Réponds UNIQUEMENT en JSON valide avec ce format exact:
{"assignments": [{"guestId": "id_ici", "tableId": "id_table_ici"}], "explanation": "explication courte en français de tes choix"}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await response.json();
      const text = (data.content && data.content[0] && data.content[0].text) || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);
      const newGuests = ev.guests.map(function(g) {
        const assignment = result.assignments.find(function(a){ return String(a.guestId) === String(g.id); });
        return assignment ? { ...g, tableId: assignment.tableId } : g;
      });
      updateEv(function(evUp){ return { ...evUp, guests: newGuests }; });
      setAiExplanation(result.explanation || "Placement optimisé !");
    } catch (e) {
      // Fallback simple
      updateEv(function(evState){
        const newG = evState.guests.map(function(g){ return {...g, tableId:null}; });
        const tables = evState.tables;
        const groups = [];
        (evState.constraints||[]).filter(function(c){ return c.type==="together"; }).forEach(function(c){
          const ex = groups.find(function(g){ return g.includes(c.a)||g.includes(c.b); });
          if(ex){if(!ex.includes(c.a))ex.push(c.a);if(!ex.includes(c.b))ex.push(c.b);}
          else groups.push([c.a,c.b]);
        });
        const assigned = new Set();
        var ti = 0;
        groups.forEach(function(group){
          if(ti>=tables.length)return;
          group.forEach(function(gId){ const g=newG.find(function(x){ return x.id===gId; }); if(g){g.tableId=tables[ti].id;assigned.add(gId);} });
          ti++;
        });
        newG.filter(function(g){ return !assigned.has(g.id); }).forEach(function(g){
          while(ti<tables.length){ const s=newG.filter(function(x){ return x.tableId===tables[ti].id; }).length; if(s<tables[ti].capacity){g.tableId=tables[ti].id;break;} ti++; }
        });
        return {...evState, guests:newG};
      });
      setAiExplanation("Placement automatique (IA indisponible)");
    }
    setAiPlacing(false);
  }

  async function sendAiAssist(userMsg) {
    if (!userMsg.trim()) return;
    const newHistory = [...aiAssistHistory, {role:"user", content:userMsg}];
    setAiAssistHistory(newHistory);
    setAiAssistMsg("");
    setAiAssistLoading(true);
    const daysLeft = ev.date ? Math.round((new Date(ev.date)-new Date())/(1000*60*60*24)) : null;
    const rsvpC = ev.guests.filter(g=>g.rsvp==="confirmed").length;
    const rsvpP = ev.guests.filter(g=>!g.rsvp||g.rsvp==="pending").length;
    const budgTot = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
    const budgReal = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.actual)||0),0);
    const planDone = (ev.planning||[]).filter(p=>p.done).length;
    const planTot = (ev.planning||[]).length;
    const context = `Tu es un assistant expert en organisation d'événements intégré à l'app TableMaître.
Événement : "${ev.name}" (${ev.type}, le ${ev.date||"date non définie"})${daysLeft!==null?`, dans ${daysLeft} jours`:""}
Invités : ${ev.guests.length} total — ${rsvpC} confirmés, ${rsvpP} en attente
Tables : ${ev.tables.length}, places assises : ${ev.guests.filter(g=>g.tableId).length}/${ev.guests.length}
Budget : estimé ${budgTot}€, réel ${budgReal}€ (${(ev.budget||[]).length} postes)
Planning : ${planDone}/${planTot} tâches faites
Prestataires : ${(ev.suppliers||[]).length}
Programme : ${(ev.programme||[]).length} étapes
Réponds en français, de façon concrète, bienveillante et proactive. Max 3 paragraphes courts.`;
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:600,
          system: context,
          messages: newHistory,
        })
      });
      const data = await resp.json();
      const reply = (data.content&&data.content[0]&&data.content[0].text)||"Désolé, je n'ai pas pu répondre.";
      setAiAssistHistory(h=>[...h,{role:"assistant",content:reply}]);
    } catch(e) {
      setAiAssistHistory(h=>[...h,{role:"assistant",content:"❌ IA temporairement indisponible."}]);
    }
    setAiAssistLoading(false);
  }

  const rsvpConfirmed = ev.guests.filter(g=>g.rsvp==="confirmed").length;
  const rsvpDeclined  = ev.guests.filter(g=>g.rsvp==="declined").length;
  const rsvpPending   = ev.guests.filter(g=>!g.rsvp||g.rsvp==="pending").length;
  const budgetTotal   = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
  const budgetSpent   = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.actual)||0),0);
  const planningDone  = (ev.planning||[]).filter(p=>p.done).length;
  const planningTotal = (ev.planning||[]).length;

  const TABS = [
    {id:"plan",         icon:"🗺",  label: t.tabPlan || "Plan"},
    {id:"list",         icon:"📋",  label: t.tabList || "List"},
    {id:"guests",       icon:"👥",  label:`${t.tabGuests || "Guests"} (${ev.guests.length})`},
    {id:"rsvp",         icon:"💌",  label:`RSVP${rsvpPending>0?" ("+rsvpPending+"⏳)":""}`},
    {id:"budget",       icon:"💰",  label: t.tabBudget || "Budget"},
    {id:"planning",     icon:"🗓",  label:`${t.tabPlanning || "Planning"}${planningTotal>0?" ("+planningDone+"/"+planningTotal+")":""}`},
    {id:"programme",    icon:"🎵",  label: t.tabProgramme || "Programme"},
    {id:"diet",         icon:"🍽️",  label: t.tabFood || "Dietary"},
    {id:"constraints",  icon:"⚙",  label: t.tabConstraints || "Constraints"},
    {id:"logistique",   icon:"🗂",  label: t.tabLogistique || "Logistics"},
  ];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:"#ffffff" }}>
      {/* Header */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 24px", display:"flex", alignItems:"center", height:56, position:"sticky", top:0, zIndex:100, gap:12, flexWrap:"wrap" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>{t.back}</button>
        <span style={{ color:C.border }}>|</span>
        <span style={{ fontSize:20 }}>{theme.icon}</span>
        <span style={{ color:"#ffffff", fontSize:16, fontWeight:400 }}>{ev.name}</span>
        <Badge color={theme.color}>{theme.label}</Badge>
        <div style={{flex:1}}/>
        <Btn small variant="ghost" onClick={()=>setShowQR(true)}>📱 QR Code</Btn>
        <Btn small variant="ghost" onClick={() => {
          // Inclure userId dans l'URL pour permettre la lecture sans auth
          var fb = getFirebase();
          var uid = fb && fb.auth && fb.auth.currentUser ? fb.auth.currentUser.uid : "";
          var joinParam = uid ? uid + "___" + ev.id : ev.id;
          var url = window.location.origin + "/?join=" + joinParam;
          if (navigator.share) {
            navigator.share({ title: ev.name, url: url }).catch(function() {
              // User cancelled or share failed - fallback to clipboard
              navigator.clipboard.writeText(url).then(function(){ setEditorSaveToast(true); });
            });
          } else { 
            navigator.clipboard.writeText(url).then(function(){ setEditorSaveToast(true); }); 
          }
        }}>🔗 Partager</Btn>
        <Btn small variant="success" onClick={()=>printPlaceCards(ev)}>{t.placeCards}</Btn>
        <Btn small variant="ghost" onClick={()=>printFloorPlan(ev)}>{t.floorPlan}</Btn>
        <Btn small onClick={autoPlace} style={{opacity:aiPlacing?0.7:1}}>{aiPlacing?"🤖 IA en cours...":t.autoPlace}</Btn>
        <Btn small variant="ghost" onClick={()=>{setAiAssistOpen(o=>!o);}} style={{background:aiAssistOpen?C.gold+"33":"none",border:`1px solid ${aiAssistOpen?C.gold:C.border}`}}>🤖 Assistant IA</Btn>
        <button onClick={()=>setShowSettings(true)} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:18 }}>⚙</button>
      </div>

      {/* Notes bar */}
      {ev.notes && (
        <div style={{ background:C.gold+"11", borderBottom:`1px solid ${C.gold}22`, padding:"8px 24px", fontSize:12, color:"rgba(255,255,255,0.45)", fontStyle:"italic" }}>
          {t.note} {ev.notes}
        </div>
      )}
      {/* Stats bar */}
      <div style={{ background:C.mid+"55", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"10px 24px", display:"flex", gap:24, overflowX:"auto" }}>
        {[
          {label:t.statTables,    val:ev.tables.length,  color:"#C9973A"},
          {label:t.statGuests,   val:ev.guests.length,  color:"#C9973A"},
          {label:t.statSeated,    val:seated.length,     color:C.green},
          {label:t.statWaiting,val:unseated.length,   color:unseated.length>0?C.red:C.green},
          {label:t.statDiets, val:dietStats.reduce((s,d)=>s+d.count,0), color:C.blue},
        ].map(s=>(
          <div key={s.label} style={{ textAlign:"center", minWidth:80 }}>
            <div style={{ fontSize:20, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ background:"rgba(13,13,20,0.95)", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 24px", display:"flex", gap:0, overflowX:"auto" }}>
        {TABS.map(tabItem=>(
          <button key={tabItem.id} onClick={()=>setTab(tabItem.id)} style={{
            background:"none", border:"none", borderBottom:`2px solid ${tab===tabItem.id?C.gold:"transparent"}`,
            color:tab===tabItem.id?C.gold:C.muted, padding:"14px 18px",
            cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:tab===tabItem.id?700:400, whiteSpace:"nowrap",
          }}>{tabItem.icon} {tabItem.label}</button>
        ))}
      </div>

      {/* ── AI ASSISTANT PANEL ── */}
      {aiAssistOpen && (
        <div style={{ position:"fixed", bottom:24, right:24, width:380, maxHeight:520, zIndex:200, display:"flex", flexDirection:"column", background:"#18182a", border:`1px solid ${C.gold}44`, borderRadius:20, boxShadow:"0 8px 40px #00000066", overflow:"hidden" }}>
          <div style={{ background:C.gold+"22", borderBottom:`1px solid ${C.gold}33`, padding:"14px 18px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>🤖</span>
            <div style={{ flex:1 }}>
              <div style={{ color:"#C9973A", fontSize:14, fontWeight:700 }}>Assistant IA</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Votre conseiller pour {ev.name}</div>
            </div>
            {aiAssistHistory.length===0 && (
              <button onClick={()=>sendAiAssist("Fais-moi un bilan rapide de l'état de mon événement et dis-moi ce qui est urgent.")}
                style={{ background:C.gold+"22", border:`1px solid ${C.gold}44`, borderRadius:8, padding:"4px 10px", cursor:"pointer", color:"#C9973A", fontSize:11, fontFamily:"inherit" }}>
                ✨ Bilan auto
              </button>
            )}
            <button onClick={()=>setAiAssistOpen(false)} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:18 }}>✕</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, minHeight:200, maxHeight:340 }}>
            {aiAssistHistory.length===0 && (
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>💬</div>
                Posez-moi une question sur votre événement ou demandez un bilan rapide !
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:14 }}>
                  {["Qu'est-ce qui est urgent à faire ?","Comment optimiser mon budget ?","Qui n'a pas encore répondu ?","Génère-moi un planning type"].map(q=>(
                    <button key={q} onClick={()=>sendAiAssist(q)} style={{
                      background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, padding:"6px 12px",
                      color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:11, fontFamily:"inherit", textAlign:"left",
                    }}>→ {q}</button>
                  ))}
                </div>
              </div>
            )}
            {aiAssistHistory.map((msg,i)=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:msg.role==="user"?"flex-end":"flex-start" }}>
                <div style={{
                  background:msg.role==="user"?C.gold+"33":C.mid,
                  border:`1px solid ${msg.role==="user"?C.gold+"44":C.border}`,
                  borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                  padding:"8px 14px", maxWidth:"90%", fontSize:12, color:"#ffffff", lineHeight:1.6,
                  whiteSpace:"pre-wrap",
                }}>{msg.content}</div>
              </div>
            ))}
            {aiAssistLoading && (
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>🤖 Réflexion en cours…</div>
            )}
          </div>
          <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(201,151,58,0.12)", display:"flex", gap:8 }}>
            <input
              value={aiAssistMsg}
              onChange={e=>setAiAssistMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendAiAssist(aiAssistMsg); } }}
              placeholder="Posez une question…"
              style={{ flex:1, padding:"8px 12px", background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:10, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
            />
            <button onClick={()=>sendAiAssist(aiAssistMsg)} disabled={!aiAssistMsg.trim()||aiAssistLoading}
              style={{ background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:10, padding:"8px 14px", cursor:"pointer", color:C.dark, fontWeight:700, fontSize:13, fontFamily:"inherit", opacity:!aiAssistMsg.trim()||aiAssistLoading?0.5:1 }}>
              →
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>

        {/* ── PLAN TAB ── */}
        {tab==="plan" && (
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {/* Sous-onglets Plan */}
            <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"1px solid rgba(201,151,58,0.12)" }}>
              {[
                {id:"tables", icon:"🗺", label:"Tables & Plan"},
                {id:"salle",  icon:"📐", label:"Édition de salle"},
              ].map(sub=>(
                <button key={sub.id} onClick={()=>setPlanSubTab(sub.id)} style={{
                  background:"none", border:"none", borderBottom:`2px solid ${planSubTab===sub.id?C.gold:"transparent"}`,
                  color:planSubTab===sub.id?C.gold:C.muted, padding:"10px 20px",
                  cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:planSubTab===sub.id?700:400,
                  display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
                }}>{sub.icon} {sub.label}</button>
              ))}
            </div>

            {/* Sous-onglet Tables & Plan */}
            {planSubTab==="tables" && (
          <div style={{ display:"flex", gap:20, alignItems:"start", flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 600px", minWidth:0 }}>
              <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                <Btn small variant="ghost" onClick={()=>setShowAddTable(true)}>{t.addTable}</Btn>
                <Btn small variant="muted" onClick={()=>setShowAddGuest(true)}>{t.addGuest}</Btn>
                <Btn small variant="muted" onClick={()=>setShowAddZone(true)}>+ Zone</Btn>
                <Btn small variant="muted" onClick={()=>setShowAddFurniture(true)}>+ Mobilier</Btn>
                {tablesHistory.length > 0 && <Btn small variant="muted" onClick={undoTables}>{t.undo}</Btn>}
                <div style={{flex:1}}/>
                <Btn small variant="ghost" onClick={()=>printDietSummary(ev)}>{t.dietSummary}</Btn>
              </div>
              <FloorPlan
                ev={ev}
                onUpdateTables={tables=>{pushHistory(ev.tables); updateEv(e=>({...e,tables}));}}
                onSelectTable={(tableId) => {
                  if (selectedUnseatedGuest && tableId) {
                    const t = ev.tables.find(x => x.id === tableId);
                    const seated = ev.guests.filter(g => g.tableId === tableId).length;
                    if (t && seated < t.capacity) {
                      updateEv(e => ({ ...e, guests: e.guests.map(g => g.id === selectedUnseatedGuest.id ? { ...g, tableId } : g) }));
                      setSelectedUnseatedGuest(null);
                      return;
                    }
                  }
                  setSelectedTable(tableId);
                }}
                selectedTable={selectedTable}
                highlightAvailable={highlightTables || !!selectedUnseatedGuest}
              />
              {unseated.length>0 && (
                <div style={{ marginTop:16, background:C.red+"11", border:`1px solid ${C.red}33`, borderRadius:12, padding:"12px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", marginBottom:8 }}>
                    <div style={{ color:C.red, fontSize:12, letterSpacing:.5, flex:1 }}>{t.unseatedList} ({unseated.length})</div>
                    <button onClick={()=>setHighlightTables(h=>!h)} style={{ background:highlightTables?C.gold:"none", border:`1px solid ${highlightTables?C.gold:C.border}`, borderRadius:6, color:highlightTables?C.dark:C.muted, fontSize:11, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit" }}>
                      {highlightTables ? "✓ Tables visibles" : "👁 Voir places libres"}
                    </button>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {unseated.map(g=>(
                      <span key={g.id}
                        draggable={true}
                        onDragStart={function(e){ e.dataTransfer.setData("guestId", String(g.id)); e.dataTransfer.effectAllowed="move"; }}
                        title="Glisser vers une table sur le plan"
                        onClick={()=>setSelectedUnseatedGuest(selectedUnseatedGuest?.id===g.id?null:g)}
                        style={{
                          background:selectedUnseatedGuest?.id===g.id?C.gold+"44":C.red+"22",
                          border:`1px solid ${selectedUnseatedGuest?.id===g.id?C.gold:C.red}44`,
                          borderRadius:99, padding:"3px 12px", color:"#ffffff", fontSize:12, cursor:"pointer",
                          fontWeight:selectedUnseatedGuest?.id===g.id?700:400
                        }}>
                        {selectedUnseatedGuest?.id===g.id ? "→ " : ""}{g.name}
                      </span>
                    ))}
                    {selectedUnseatedGuest && (
                      <div style={{width:"100%",marginTop:6,fontSize:11,color:"#C9973A"}}>
                        👆 Cliquez sur une table pour y placer {selectedUnseatedGuest.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Side panel */}
            {tableSel && (
              <div style={{ width:260, background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:16, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ color:"#C9973A", fontSize:16 }}>Table {tableSel.number}</div>
                    {tableSel.label && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tableSel.label}</div>}
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tableGuests.length}/{tableSel.capacity} places</div>
                  </div>
                  <div style={{flex:1}}/>
                  <button onClick={()=>setSelectedTable(null)} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:16 }}>✕</button>
                </div>

                {/* Seated guests */}
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
                  {tableGuests.map(g=>{
                    const d=dietInfo(g.diet);
                    return (
                      <div key={g.id} style={{ background:C.mid+"88",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ width:26,height:26,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:11,fontWeight:700 }}>
                          {g.name[0]}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{ color:"#ffffff", fontSize:12 }}>{g.name}</div>
                          {g.diet!=="standard" && <div style={{ color:d.color, fontSize:10 }}>{d.icon} {d.label}</div>}
                        </div>
                        <button onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,tableId:null}:x)}))}
                          style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:13 }}>✕</button>
                      </div>
                    );
                  })}
                </div>

                {/* Add unseated */}
                {unseated.length>0 && tableGuests.length<tableSel.capacity && (
                  <div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:.5, marginBottom:6 }}>AJOUTER À CETTE TABLE</div>
                    {unseated.map(g=>(
                      <button key={g.id} onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,tableId:selectedTable}:x)}))}
                        style={{ display:"block",width:"100%",marginBottom:5,padding:"7px 12px",textAlign:"left",background:"none",border:"1px solid rgba(201,151,58,0.15)",borderRadius:8,color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>
                        + {g.name}
                      </button>
                    ))}
                  </div>
                )}

                <Btn small variant="danger" onClick={()=>{updateEv(e=>({...e,tables:e.tables.filter(t=>t.id!==selectedTable),guests:e.guests.map(g=>g.tableId===selectedTable?{...g,tableId:null}:g)}));setSelectedTable(null);}} style={{width:"100%",marginTop:12}}>
                  Supprimer la table
                </Btn>
              </div>
            )}
          </div>
            )}

            {/* Sous-onglet Salle */}
            {planSubTab==="salle" && (
              <div style={{ maxWidth:900 }}>
                <h3 style={{ fontWeight:400, fontSize:20, marginBottom:20 }}>Forme de la salle</h3>
                <div style={{ marginBottom:20 }}>
                  <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>TEMPLATES RAPIDES</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {[
                      { name:"Rectangle", icon:"⬛", pts:[{x:60,y:60},{x:900,y:60},{x:900,y:560},{x:60,y:560}] },
                      { name:"Forme L", icon:"🔲", pts:[{x:60,y:60},{x:500,y:60},{x:500,y:300},{x:900,y:300},{x:900,y:560},{x:60,y:560}] },
                      { name:"Forme U", icon:"🔳", pts:[{x:60,y:60},{x:300,y:60},{x:300,y:380},{x:640,y:380},{x:640,y:60},{x:900,y:60},{x:900,y:560},{x:60,y:560}] },
                      { name:"Hexagone", icon:"⬡", pts:(function(){ var p=[]; for(var i=0;i<6;i++){var a=i*Math.PI*2/6-Math.PI/6;p.push({x:Math.round(480+280*Math.cos(a)),y:Math.round(310+220*Math.sin(a))});} return p; })() },
                      { name:"Rond", icon:"⭕", pts:(function(){ var p=[]; for(var i=0;i<16;i++){var a=i*Math.PI*2/16;p.push({x:Math.round(480+300*Math.cos(a)),y:Math.round(310+230*Math.sin(a))});} return p; })() },
                    ].map(function(tmpl){ return (
                      <button key={tmpl.name}
                        onClick={function(){
                          if (tmpl.pts && Array.isArray(tmpl.pts)) {
                            updateEv(function(evUp){ return {...evUp, roomShape: tmpl.pts.map(function(p){ return {x:p.x, y:p.y}; })}; });
                          }
                        }}
                        style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:8, padding:"8px 14px", cursor:"pointer", color:"#ffffff", fontFamily:"inherit", fontSize:12, display:"flex", alignItems:"center", gap:6 }}
                      >
                        <span>{tmpl.icon}</span><span>{tmpl.name}</span>
                      </button>
                    ); })}
                  </div>
                </div>
                <RoomShapeEditor shape={ev.roomShape||[]} onChange={shape=>updateEv(e=>({...e,roomShape:shape}))}/>

                {/* Zones spéciales */}
                <div style={{ marginTop:20 }}>
                  <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>ZONES SPÉCIALES</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                    {(ev.zones||[]).map(function(zone, zi){ return (
                      <div key={zi} style={{ background:zone.color+"22", border:"1px solid "+zone.color+"66", borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>{zone.icon}</span>
                        <span style={{ color:zone.color, fontSize:13 }}>{zone.label}</span>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, zones:(evUp.zones||[]).filter(function(_,i){ return i!==zi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14, padding:0 }}>✕</button>
                      </div>
                    ); })}
                    <button onClick={()=>setShowAddZone(true)}
                      style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:8, padding:"6px 14px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12 }}>
                      + Ajouter une zone
                    </button>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>
                    Les zones apparaissent dans les exports PDF. Exemples : Estrade, Scène, Bar, Piste de danse, Photo Booth...
                  </p>
                </div>

                {/* Mobilier */}
                <div style={{ marginTop:24 }}>
                  <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>MOBILIER</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                    {(ev.furniture||[]).map(function(item, fi){ return (
                      <div key={fi} style={{ background:item.color+"22", border:"1px solid "+item.color+"66", borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>{item.icon}</span>
                        <span style={{ color:item.color, fontSize:13 }}>{item.label}</span>
                        <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{item.width}×{item.height}</span>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, furniture:(evUp.furniture||[]).filter(function(_,i){ return i!==fi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14, padding:0 }}>✕</button>
                      </div>
                    ); })}
                    <button onClick={()=>setShowAddFurniture(true)}
                      style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:8, padding:"6px 14px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12 }}>
                      + Ajouter du mobilier
                    </button>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>
                    Exemples : Scène, Bar, Buffet, Photobooth, Podium, Piano...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── GUESTS TAB ── */}
        
        {tab==="list" && (
          <div style={{ padding:"0 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:18 }}>📋 Plan par tables</h3>
              <Btn small variant="ghost" onClick={function(){ exportGuestsCSV(ev); }}>⬇ Export CSV</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {ev.tables.map(function(tbl) {
                var tblGuests = ev.guests.filter(function(g){ return g.tableId === tbl.id; });
                return (
                  <div key={tbl.id} style={{ background:"#18182a", border:"1px solid " + (tbl.color||C.border) + "44", borderRadius:14, overflow:"hidden" }}>
                    <div style={{ background:(tbl.color||C.gold)+"22", padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:tbl.color||C.gold, fontWeight:700, fontSize:15 }}>
                        Table {tbl.number}{tbl.label ? " — " + tbl.label : ""}
                      </span>
                      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tblGuests.length}/{tbl.capacity} places</span>
                    </div>
                    {tblGuests.length === 0 ? (
                      <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, padding:"12px 20px", fontStyle:"italic" }}>— Vide —</p>
                    ) : (
                      <table style={{ width:"100%", borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ borderBottom:"1px solid " + C.border }}>
                            {[t.guestName || "Name",t.guestRole || "Role",t.guestDiet || "Diet",t.guestNotes || "Notes"].map(function(h){ return <th key={h} style={{ padding:"8px 20px", color:"rgba(255,255,255,0.45)", fontSize:11, textAlign:"left", letterSpacing:1 }}>{h}</th>; })}
                          </tr>
                        </thead>
                        <tbody>
                          {tblGuests.map(function(g, idx) {
                            var dinfo = dietInfo(g.diet);
                            return (
                              <tr key={g.id} style={{ borderBottom:idx<tblGuests.length-1?"1px solid "+C.border+"33":"none", background:idx%2===0?"transparent":C.mid+"33" }}>
                                <td style={{ padding:"10px 20px", color:"#ffffff", fontSize:14 }}>
                                  {g.name}
                                  {g.role && <span style={{ marginLeft:6, background:C.gold+"22", border:"1px solid "+C.gold+"44", borderRadius:99, padding:"1px 8px", fontSize:10, color:"#C9973A" }}>
                                    {{"marie1":"💍","marie2":"💍","temoin":"🎖","famille_proche":"👨‍👩‍👧","ami_proche":"⭐","enfant":"🧒","vip":"🌟","prestataire":"🔧"}[g.role]||""} {{"marie1":"Marié(e)","marie2":"Marié(e)","temoin":"Témoin","famille_proche":"Famille","ami_proche":"Ami proche","enfant":"Enfant","vip":"VIP","prestataire":"Prestataire"}[g.role]||g.role}
                                  </span>}
                                </td>
                                <td style={{ padding:"10px 20px", fontSize:13, color:dinfo.color }}>{dinfo.icon} {dinfo.label}</td>
                                <td style={{ padding:"10px 20px", color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>{g.notes||""}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
              {ev.guests.filter(function(g){ return !g.tableId; }).length > 0 && (
                <div style={{ background:C.red+"11", border:"1px solid "+C.red+"44", borderRadius:14, padding:"12px 20px" }}>
                  <p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:8 }}>⚠ Non placés ({ev.guests.filter(function(g){ return !g.tableId; }).length})</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {ev.guests.filter(function(g){ return !g.tableId; }).map(function(g){
                      return <span key={g.id} style={{ background:C.red+"22", borderRadius:99, padding:"4px 12px", fontSize:12, color:"#ffffff" }}>{g.name}</span>;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab==="guests" && (
          <div style={{ maxWidth:860 }}>
            <div style={{ display:"flex", gap:12, marginBottom:20 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un invité…"
                style={{ ...inputStyle, flex:1 }}/>
              <Btn variant="ghost" onClick={()=>exportGuestsCSV(ev)}>⬇ Export CSV</Btn>
              <Btn variant="ghost" onClick={()=>setShowImportCSV(true)}>⬆ Import CSV</Btn>
              <Btn onClick={()=>setShowAddGuest(true)}>+ Invité</Btn>
            </div>

            {/* Diet filter legend */}
            {dietStats.length>0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                {dietStats.map(d=>(
                  <span key={d.id} style={{ background:d.color+"22",border:`1px solid ${d.color}44`,color:d.color,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700 }}>
                    {d.icon} {d.label} × {d.count}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {filtered.map(g=>{
                const table=ev.tables.find(t=>t.id===g.tableId);
                const d=dietInfo(g.diet);
                return (
                  <div key={g.id} style={{ background:"#18182a",border:"1px solid rgba(201,151,58,0.15)",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14 }}>
                    <div style={{ width:38,height:38,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:15,fontWeight:700 }}>
                      {g.name[0]}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{ color:"#ffffff", fontSize:15 }}>{g.name}</div>
                      {g.email && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{g.email}</div>}
                      {g.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>{g.notes}</div>}
                    </div>
                    {g.diet!=="standard" && <Badge color={d.color}>{d.icon} {d.label}</Badge>}
                    {g.allergies?.length>0 && (
                      <div style={{ display:"flex", gap:4 }}>
                        {g.allergies.map(a=>{const ai=dietInfo(a);return <span key={a} style={{ fontSize:14 }} title={ai.label}>{ai.icon}</span>;})}
                      </div>
                    )}
                    {table ? <Badge color={C.gold}>Table {table.number}</Badge> : <Badge color={C.red}>Non placé</Badge>}
                    <select value={g.tableId||""} onChange={function(evt){ var tid=evt.target.value?parseInt(evt.target.value):null; updateEv(function(evUp){ return {...evUp,guests:evUp.guests.map(function(x){ return x.id===g.id?{...x,tableId:tid}:x; })}; }); }}
                      style={{ background:"#13131e",border:"1px solid "+C.border,borderRadius:8,color:"#ffffff",padding:"4px 8px",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
                      <option value="">— Non placé —</option>
                      {ev.tables.map(function(tbl){return <option key={tbl.id} value={tbl.id}>Table {tbl.number}{tbl.label?" ("+tbl.label+")":""}</option>;})}
                    </select>
                    <button onClick={()=>updateEv(e=>({...e,guests:e.guests.filter(x=>x.id!==g.id)}))}
                      style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:16 }}>🗑</button>
                  </div>
                );
              })}
              {filtered.length===0 && <p style={{ color:"rgba(255,255,255,0.45)", textAlign:"center", padding:32 }}>Aucun invité trouvé</p>}
            </div>
          </div>
        )}

        {/* ── DIET TAB ── */}
        {tab==="diet" && (
          <div style={{ maxWidth:960, display:"flex", flexDirection:"column", gap:24 }}>

            {/* ── HEADER ── */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <h3 style={{ margin:0, fontWeight:400, fontSize:20 }}>Gestion alimentaire</h3>
              <div style={{flex:1}}/>
              <Btn small onClick={function(){ printDietSummary(ev); }}>🖨 Imprimer récapitulatif</Btn>
            </div>

            {/* ── COMPTEURS RÉGIMES ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:12 }}>
              {DIET_OPTIONS.map(function(dopt){
                var count = ev.guests.filter(function(g){ return g.diet===dopt.id || (g.allergies||[]).includes(dopt.id); }).length;
                return (
                  <div key={dopt.id} style={{ background:count>0?dopt.color+"22":C.card, border:"1px solid "+(count>0?dopt.color:C.border), borderRadius:12, padding:"14px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:28 }}>{dopt.icon}</div>
                    <div style={{ color:count>0?dopt.color:"rgba(255,255,255,0.45)", fontSize:22, fontWeight:700 }}>{count}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:2 }}>{dopt.label}</div>
                  </div>
                );
              })}
            </div>

            {/* ── MENU MULTI-COURS ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🍽 Menu de l'événement</h4>
                <Btn small variant="muted" onClick={function(e){
                  var btn = e.currentTarget;
                  btn.disabled = true;
                  btn.textContent = "⏳ Génération...";
                  // IA génère le menu
                  var diets = DIET_OPTIONS.filter(function(d){ return d.id!=="standard"; }).map(function(d){
                    var n = ev.guests.filter(function(g){ return g.diet===d.id || (g.allergies||[]).includes(d.id); }).length;
                    return n > 0 ? n+" "+d.label : null;
                  }).filter(Boolean);
                  var prompt = "Tu es un chef cuisinier expert. " +
                  "Genere un menu pour " + (ev.name||"un evenement") + " de type " + (ev.type||"mariage") + " avec " + ev.guests.length + " invites" + (diets.length ? " dont: " + diets.join(", ") : "") + ". " +
                  "Propose un aperitif, une entree, un plat principal, un fromage, un dessert et une option vegetarienne. " +
                  "Reponds UNIQUEMENT en JSON valide: {appetizer:\"..\",starter:\"..\",main:\"..\",cheese:\"..\",dessert:\"..\",vegOption:\"..\",note:\"conseil\"}";
                  fetch("https://api.anthropic.com/v1/messages", {
                    method:"POST", headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{role:"user",content:prompt}] })
                  }).then(function(r){ return r.json(); }).then(function(d){
                    var text = d.content&&d.content[0]&&d.content[0].text||"";
                    var clean = text.replace(/```json|```/g,"").trim();
                    try {
                      var menu = JSON.parse(clean);
                      updateEv(function(ev2){ return {...ev2, menu:{...ev2.menu, ...menu}}; });
                      btn.disabled = false;
                      btn.textContent = "✅ Menu généré !";
                      setTimeout(function(){ btn.textContent = "✨ Générer avec l\'IA"; }, 3000);
                    } catch(e) {
                      console.error("Menu IA parse:", e);
                      btn.disabled = false;
                      btn.textContent = "✨ Générer avec l\'IA";
                    }
                  }).catch(function(e){
                    console.error("Menu IA fetch:", e);
                    btn.disabled = false;
                    btn.textContent = "✨ Générer avec l\'IA";
                    alert("Génération IA indisponible depuis cette interface. Saisissez le menu manuellement.");
                  });
                }}>✨ Générer avec l'IA</Btn>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
                {[
                  ["appetizer","🥂 Apéritif","ex: Verrines saumon, mini-quiches"],
                  ["starter","🥗 Entrée","ex: Velouté de butternut"],
                  ["main","🍖 Plat principal","ex: Filet de bœuf sauce bordelaise"],
                  ["cheese","🧀 Fromage","ex: Plateau affiné (optionnel)"],
                  ["dessert","🍰 Dessert","ex: Pièce montée"],
                  ["vegOption","🌱 Option végétarienne","ex: Risotto aux champignons"],
                ].map(function(item){
                  var key = item[0]; var label = item[1]; var ph = item[2];
                  return (
                    <div key={key}>
                      <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:6 }}>{label.toUpperCase()}</label>
                      <input
                        value={(ev.menu&&ev.menu[key])||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, menu:{...(ev2.menu||{}), [key]:v}}; }); }}
                        placeholder={ph}
                        style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
              {ev.menu&&ev.menu.note && (
                <div style={{ marginTop:14, background:C.gold+"11", border:"1px solid "+C.gold+"44", borderRadius:10, padding:"10px 16px", color:"#C9973A", fontSize:13, fontStyle:"italic" }}>
                  💡 {ev.menu.note}
                </div>
              )}
            </div>

            {/* ── BOISSONS ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <h4 style={{ margin:"0 0 16px", color:"#C9973A", fontWeight:400, fontSize:16 }}>🍷 Boissons</h4>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
                {[
                  ["champagne","🥂 Champagne/Prosecco","ex: Veuve Clicquot Brut"],
                  ["vin_blanc","🍾 Vin blanc","ex: Sancerre 2022"],
                  ["vin_rouge","🍷 Vin rouge","ex: Bordeaux Saint-Émilion"],
                  ["eau","💧 Eau","ex: Évian, San Pellegrino"],
                  ["softs","🥤 Softs / Jus","ex: Orange, Citron, Cola"],
                  ["cocktail","🍹 Cocktail de bienvenue","ex: Kir Royal"],
                  ["biere","🍺 Bière","ex: IPA artisanale"],
                  ["cafe","☕ Café / Thé","ex: Nespresso + Thé Mariage Frères"],
                ].map(function(item){
                  var key = item[0]; var label = item[1]; var ph = item[2];
                  return (
                    <div key={key}>
                      <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>{label.toUpperCase()}</label>
                      <input
                        value={(ev.drinks&&ev.drinks[key])||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, drinks:{...(ev2.drinks||{}), [key]:v}}; }); }}
                        placeholder={ph}
                        style={{ width:"100%", padding:"7px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", boxSizing:"border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:14 }}>
                <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>NOTES BOISSONS</label>
                <input
                  value={(ev.drinks&&ev.drinks.notes)||""}
                  onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, drinks:{...(ev2.drinks||{}), notes:v}}; }); }}
                  placeholder="Ex: Pas d'alcool sur les tables enfants, service champagne à l'arrivée..."
                  style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                />
              </div>
            </div>

            {/* ── SYNTHÈSE TRAITEUR ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>📊 Synthèse traiteur</h4>
                <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
                  <Btn small variant="ghost" onClick={function(){
                    // Export CSV traiteur
                    var rows = ["Table,Nom,Régime,Allergies,Notes"];
                    ev.tables.forEach(function(tbl){
                      var tGuests = ev.guests.filter(function(g){ return g.tableId===tbl.id; });
                      tGuests.forEach(function(g){
                        var dinfo = dietInfo(g.diet);
                        rows.push(["Table "+tbl.number+(tbl.label?" - "+tbl.label:""), g.name, dinfo.label, (g.allergies||[]).join("+"), g.notes||""].map(function(v){ return '"'+String(v).replace(/"/g,'""')+'"'; }).join(","));
                      });
                    });
                    var blob = new Blob([rows.join("\n")], {type:"text/csv"});
                    var a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="synthese_traiteur.csv"; a.click();
                  }}>⬇ CSV Traiteur</Btn>
                  <Btn small variant="ghost" onClick={function(){ printDietSummary(ev); }}>🖨 PDF</Btn>
                </div>
              </div>

              {/* Par table */}
              <h5 style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:1, marginBottom:12 }}>PAR TABLE</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                {ev.tables.map(function(tbl){
                  var tGuests = ev.guests.filter(function(g){ return g.tableId===tbl.id; });
                  if (!tGuests.length) return null;
                  var specials = tGuests.filter(function(g){ return g.diet!=="standard" || (g.allergies||[]).length>0; });
                  return (
                    <div key={tbl.id} style={{ background:C.mid+"44", border:"1px solid "+C.border, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <span style={{ color:tbl.color||C.gold, fontWeight:700, minWidth:80 }}>Table {tbl.number}{tbl.label?" — "+tbl.label:""}</span>
                      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tGuests.length} couverts</span>
                      <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:6 }}>
                        {specials.length===0 ? (
                          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>Tous standard</span>
                        ) : specials.map(function(g){
                          var dinfo = dietInfo(g.diet);
                          return (
                            <span key={g.id} style={{ background:dinfo.color+"22", border:"1px solid "+dinfo.color+"44", borderRadius:99, padding:"2px 10px", fontSize:11, color:dinfo.color }}>
                              {g.name} — {dinfo.icon} {dinfo.label}{(g.allergies||[]).map(function(a){ var ai=dietInfo(a); return " +"+ai.icon; }).join("")}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>

              {/* Par régime */}
              <h5 style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:1, marginBottom:12 }}>PAR RÉGIME</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {DIET_OPTIONS.filter(function(d){ return d.id!=="standard"; }).map(function(dopt){
                  var concerned = ev.guests.filter(function(g){ return g.diet===dopt.id || (g.allergies||[]).includes(dopt.id); });
                  if (!concerned.length) return null;
                  return (
                    <div key={dopt.id} style={{ background:dopt.color+"11", border:"1px solid "+dopt.color+"33", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <span style={{ fontSize:20 }}>{dopt.icon}</span>
                      <span style={{ color:dopt.color, fontWeight:700, minWidth:120 }}>{dopt.label} ({concerned.length})</span>
                      <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:6 }}>
                        {concerned.map(function(g){
                          var tbl = ev.tables.find(function(tb){ return tb.id===g.tableId; });
                          return (
                            <span key={g.id} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:99, padding:"2px 10px", fontSize:11, color:"#ffffff" }}>
                              {g.name}{tbl?" (T."+tbl.number+")":""} 
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>

            {/* ── INVITÉS AVEC RÉGIME SPÉCIAL ── */}
            {ev.guests.filter(function(g){ return g.diet!=="standard"||(g.allergies||[]).length>0; }).length > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
                <h4 style={{ margin:"0 0 16px", color:"#C9973A", fontWeight:400, fontSize:16 }}>⚠ Invités avec besoins spécifiques</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {ev.guests.filter(function(g){ return g.diet!=="standard"||(g.allergies||[]).length>0; }).map(function(g){
                    var dinfo = dietInfo(g.diet);
                    var tbl = ev.tables.find(function(tb){ return tb.id===g.tableId; });
                    return (
                      <div key={g.id} style={{ background:dinfo.color+"11", border:"1px solid "+dinfo.color+"33", borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ fontSize:22 }}>{dinfo.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#ffffff", fontWeight:600 }}>{g.name}</div>
                          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>
                            {dinfo.label}
                            {(g.allergies||[]).map(function(a){ var ai=dietInfo(a); return " · "+ai.icon+" "+ai.label; }).join("")}
                            {g.notes ? " · "+g.notes : ""}
                          </div>
                        </div>
                        {tbl && <span style={{ color:tbl.color||C.gold, fontSize:12, fontWeight:700 }}>Table {tbl.number}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════
            ── RSVP TAB ──
        ══════════════════════════════════════════ */}
        {tab==="rsvp" && (
          <div style={{ maxWidth:900 }}>

            {/* ── Synthèse RSVP ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"Confirmés",   val:rsvpConfirmed, color:C.green,  icon:"✅"},
                {label:"Refusés",     val:rsvpDeclined,  color:C.red,    icon:"❌"},
                {label:"En attente",  val:rsvpPending,   color:"#FF9800", icon:"⏳"},
                {label:"Total",       val:ev.guests.length, color:"#C9973A", icon:"👥"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:30, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Barre progression ── */}
            {ev.guests.length > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Taux de réponse</span>
                  <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>
                    {Math.round((rsvpConfirmed+rsvpDeclined)/ev.guests.length*100)}%
                  </span>
                </div>
                <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden", display:"flex" }}>
                  <div style={{ width:`${rsvpConfirmed/ev.guests.length*100}%`, background:C.green, transition:"width .4s" }}/>
                  <div style={{ width:`${rsvpDeclined/ev.guests.length*100}%`, background:C.red, transition:"width .4s" }}/>
                </div>
                <div style={{ display:"flex", gap:16, marginTop:8, fontSize:11, color:"rgba(255,255,255,0.45)" }}>
                  <span style={{ color:C.green }}>■ Confirmés {rsvpConfirmed}</span>
                  <span style={{ color:C.red }}>■ Refusés {rsvpDeclined}</span>
                  <span style={{ color:"#FF9800" }}>■ En attente {rsvpPending}</span>
                </div>
              </div>
            )}

            {/* ── Lien RSVP ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
              <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:"0 0 12px" }}>🔗 Lien de confirmation invités</h4>
              {(function(){
                var fb = null; try{fb=getFirebase();}catch(e){}
                var uid = fb&&fb.auth&&fb.auth.currentUser ? fb.auth.currentUser.uid : "";
                var joinParam = uid ? uid+"___"+ev.id : ev.id;
                var joinUrl = window.location.origin+"/?join="+joinParam;
                return (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input readOnly value={joinUrl}
                  style={{ flex:1, padding:"8px 12px", background:"#13131e", border:"1px solid "+C.border, borderRadius:8, color:"rgba(255,255,255,0.45)", fontSize:12, fontFamily:"monospace" }}/>
                <Btn small onClick={function(){ navigator.clipboard.writeText(joinUrl); }}>📋 Copier</Btn>
              </div>
                );
              })()}
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:8, fontStyle:"italic" }}>Partagez ce lien — les invités confirment leur présence et régime alimentaire directement.</p>
            </div>

            {/* ── Liste invités avec statut RSVP ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:"0 0 16px" }}>👥 Statut par invité</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ev.guests.length === 0 && <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic" }}>Aucun invité ajouté.</p>}
                {ev.guests.map(function(g){
                  var rsvp = g.rsvp || "pending";
                  var rsvpColor = rsvp==="confirmed" ? C.green : rsvp==="declined" ? C.red : "#FF9800";
                  var rsvpIcon  = rsvp==="confirmed" ? "✅" : rsvp==="declined" ? "❌" : "⏳";
                  return (
                    <div key={g.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.mid+"44", borderRadius:10, border:"1px solid "+C.border+"33" }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:13,fontWeight:700 }}>{g.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ color:"#ffffff", fontSize:14 }}>{g.name}</div>
                        {g.email && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{g.email}</div>}
                      </div>
                      <span style={{ fontSize:18 }}>{rsvpIcon}</span>
                      <div style={{ display:"flex", gap:4 }}>
                        {["confirmed","declined","pending"].map(function(s){
                          var icons = {confirmed:"✅",declined:"❌",pending:"⏳"};
                          var labels = {confirmed:"Oui",declined:"Non",pending:"?"};
                          return (
                            <button key={s} onClick={function(){
                              updateEv(function(evUp){ return {...evUp, guests:evUp.guests.map(function(x){ return x.id===g.id?{...x,rsvp:s}:x; })}; });
                            }} style={{
                              padding:"3px 10px", borderRadius:99, fontSize:11, cursor:"pointer", fontFamily:"inherit",
                              background: rsvp===s ? (s==="confirmed"?C.green:s==="declined"?C.red:"#FF9800")+"33" : "none",
                              border: "1px solid "+(rsvp===s?(s==="confirmed"?C.green:s==="declined"?C.red:"#FF9800"):C.border)+"66",
                              color: rsvp===s ? (s==="confirmed"?C.green:s==="declined"?C.red:"#FF9800") : C.muted,
                              fontWeight: rsvp===s ? 700 : 400,
                            }}>{labels[s]}</button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ── BUDGET TAB ──
        ══════════════════════════════════════════ */}
        {tab==="budget" && (
          <div style={{ maxWidth:900 }}>

            {/* ── KPIs budget ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"Budget estimé",  val:budgetTotal.toFixed(0)+"€",  color:"#C9973A",  icon:"📋"},
                {label:"Dépensé",        val:budgetSpent.toFixed(0)+"€",  color:budgetSpent>budgetTotal?C.red:C.green, icon:"💳"},
                {label:"Restant",        val:(budgetTotal-budgetSpent).toFixed(0)+"€", color:budgetTotal-budgetSpent<0?C.red:C.green, icon:"🏦"},
                {label:"Coût / invité",  val:ev.guests.length>0?(budgetSpent/ev.guests.length).toFixed(0)+"€":"—", color:C.blue, icon:"👤"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Barre budget ── */}
            {budgetTotal > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Consommation du budget</span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.gold, fontSize:12, fontWeight:700 }}>
                    {Math.round(budgetSpent/budgetTotal*100)}%
                  </span>
                </div>
                <div style={{ height:10, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${Math.min(100,budgetSpent/budgetTotal*100)}%`, background:budgetSpent>budgetTotal?C.red:C.green, transition:"width .4s", height:"100%" }}/>
                </div>
              </div>
            )}

            {/* ── Postes de dépenses ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>💼 Postes de dépenses</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var cats = [
                    {cat:"Traiteur",     icon:"🍽"},
                    {cat:"Salle",        icon:"🏛"},
                    {cat:"Musique/DJ",   icon:"🎵"},
                    {cat:"Fleurs/Déco",  icon:"🌸"},
                    {cat:"Photo/Vidéo",  icon:"📷"},
                    {cat:"Transport",    icon:"🚗"},
                    {cat:"Invitations",  icon:"💌"},
                    {cat:"Tenue",        icon:"👗"},
                    {cat:"Divers",       icon:"📦"},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.budget||[]).map(function(b){ return b.category; });
                    var toAdd = cats.filter(function(c){ return !existing.includes(c.cat); })
                      .map(function(c){ return {id:Date.now()+Math.random(), category:c.cat, icon:c.icon, estimated:"", actual:"", notes:""}; });
                    return {...evUp, budget:[...(evUp.budget||[]), ...toAdd]};
                  });
                }}>✨ Remplir avec modèle</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, budget:[...(evUp.budget||[]), {id:Date.now(), category:"Nouveau poste", icon:"📦", estimated:"", actual:"", notes:""}]};
                  });
                }}>+ Poste</Btn>
              </div>

              {(ev.budget||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucun poste. Cliquez sur "Remplir avec modèle" pour démarrer.</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.budget||[]).map(function(item, bi){
                  var pct = item.estimated && parseFloat(item.estimated) > 0 ? Math.min(100,parseFloat(item.actual||0)/parseFloat(item.estimated)*100) : 0;
                  var over = parseFloat(item.actual||0) > parseFloat(item.estimated||0) && parseFloat(item.estimated||0) > 0;
                  return (
                    <div key={item.id} style={{ background:C.mid+"44", border:"1px solid "+(over?C.red:C.border)+"44", borderRadius:12, padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontSize:18 }}>{item.icon||"📦"}</span>
                        <input value={item.category} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],category:v}; return {...evUp,budget:b}; }); }}
                          style={{ flex:1, background:"none", border:"none", color:"#ffffff", fontSize:14, fontFamily:"inherit", outline:"none" }}/>
                        {over && <span style={{ color:C.red, fontSize:11, fontWeight:700 }}>⚠ Dépassement</span>}
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, budget:(evUp.budget||[]).filter(function(_,i){ return i!==bi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14 }}>🗑</button>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <div style={{ flex:1, minWidth:120 }}>
                          <label style={{ color:"rgba(255,255,255,0.45)", fontSize:10, letterSpacing:1 }}>ESTIMÉ (€)</label>
                          <input type="number" value={item.estimated} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],estimated:v}; return {...evUp,budget:b}; }); }}
                            placeholder="0" style={{ width:"100%", padding:"6px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                        <div style={{ flex:1, minWidth:120 }}>
                          <label style={{ color:"rgba(255,255,255,0.45)", fontSize:10, letterSpacing:1 }}>RÉEL (€)</label>
                          <input type="number" value={item.actual} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],actual:v}; return {...evUp,budget:b}; }); }}
                            placeholder="0" style={{ width:"100%", padding:"6px 10px", background:"#18182a", border:"1px solid "+(over?C.red:C.border), borderRadius:6, color:over?C.red:C.cream, fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                        <div style={{ flex:2, minWidth:160 }}>
                          <label style={{ color:"rgba(255,255,255,0.45)", fontSize:10, letterSpacing:1 }}>NOTES</label>
                          <input value={item.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],notes:v}; return {...evUp,budget:b}; }); }}
                            placeholder="Prestataire, devis..." style={{ width:"100%", padding:"6px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                      </div>
                      {parseFloat(item.estimated||0) > 0 && (
                        <div style={{ marginTop:8, height:4, background:"#13131e", borderRadius:99 }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:over?C.red:C.green, borderRadius:99, transition:"width .4s" }}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {(ev.budget||[]).length > 0 && (
                <div style={{ marginTop:16, padding:"14px 16px", background:C.gold+"11", border:"1px solid "+C.gold+"33", borderRadius:10, display:"flex", gap:24 }}>
                  <span style={{ color:"#C9973A", fontSize:14 }}>Total estimé : <strong>{budgetTotal.toFixed(0)}€</strong></span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.green, fontSize:14 }}>Total réel : <strong>{budgetSpent.toFixed(0)}€</strong></span>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:14 }}>Écart : <strong>{(budgetTotal-budgetSpent).toFixed(0)}€</strong></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ── PLANNING TAB ──
        ══════════════════════════════════════════ */}
        {tab==="planning" && (
          <div style={{ maxWidth:860 }}>

            {/* ── KPIs planning ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"Tâches totales", val:planningTotal, color:"#C9973A",  icon:"📋"},
                {label:"Terminées",      val:planningDone,  color:C.green, icon:"✅"},
                {label:"Restantes",      val:planningTotal-planningDone, color:planningTotal-planningDone>0?"#FF9800":C.green, icon:"⏳"},
                {label:"Avancement",     val:planningTotal>0?Math.round(planningDone/planningTotal*100)+"%":"—", color:C.blue, icon:"📈"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Barre avancement ── */}
            {planningTotal > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"14px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Progression globale</span>
                  <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{Math.round(planningDone/planningTotal*100)}%</span>
                </div>
                <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${planningDone/planningTotal*100}%`, background:C.green, transition:"width .4s", height:"100%" }}/>
                </div>
              </div>
            )}

            {/* ── Liste de tâches ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>🗓 Rétroplanning & tâches</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var tpl = [
                    {label:"Réserver la salle",          icon:"🏛", deadline:"", priority:"high"},
                    {label:"Choisir le traiteur",         icon:"🍽", deadline:"", priority:"high"},
                    {label:"Envoyer les faire-parts",     icon:"💌", deadline:"", priority:"high"},
                    {label:"Confirmer le DJ / musiciens", icon:"🎵", deadline:"", priority:"medium"},
                    {label:"Choisir les fleurs",          icon:"🌸", deadline:"", priority:"medium"},
                    {label:"Réserver le photographe",    icon:"📷", deadline:"", priority:"medium"},
                    {label:"Finaliser le menu",           icon:"📋", deadline:"", priority:"medium"},
                    {label:"Relancer les non-répondants", icon:"📞", deadline:"", priority:"low"},
                    {label:"Valider le plan de table",    icon:"🗺", deadline:"", priority:"low"},
                    {label:"Préparer les chevalets",      icon:"🖨", deadline:"", priority:"low"},
                    {label:"Briefer les prestataires",    icon:"🤝", deadline:"", priority:"low"},
                    {label:"Jour J — Accueil invités",    icon:"🎉", deadline:"", priority:"low"},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.planning||[]).map(function(t){ return t.label; });
                    var toAdd = tpl.filter(function(t){ return !existing.includes(t.label); })
                      .map(function(t){ return {...t, id:Date.now()+Math.random(), done:false, notes:""}; });
                    return {...evUp, planning:[...(evUp.planning||[]), ...toAdd]};
                  });
                }}>✨ Modèle type</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, planning:[...(evUp.planning||[]), {id:Date.now(), label:"Nouvelle tâche", icon:"📌", deadline:"", priority:"medium", done:false, notes:""}]};
                  });
                }}>+ Tâche</Btn>
              </div>

              {(ev.planning||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucune tâche. Cliquez "Modèle type" pour démarrer.</p>
              )}

              {/* Grouper par priorité */}
              {["high","medium","low"].map(function(prio){
                var tasks = (ev.planning||[]).filter(function(t){ return (t.priority||"medium") === prio; });
                if (!tasks.length) return null;
                var prioLabel = {high:"🔴 Priorité haute", medium:"🟡 Priorité moyenne", low:"🟢 Priorité faible"}[prio];
                var prioColor = {high:C.red, medium:"#FF9800", low:C.green}[prio];
                return (
                  <div key={prio} style={{ marginBottom:20 }}>
                    <div style={{ color:prioColor, fontSize:12, letterSpacing:1, fontWeight:700, marginBottom:8 }}>{prioLabel}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {tasks.map(function(task){
                        var ti = (ev.planning||[]).findIndex(function(t){ return t.id === task.id; });
                        var isLate = task.deadline && !task.done && new Date(task.deadline) < new Date();
                        return (
                          <div key={task.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:task.done?C.green+"11":isLate?C.red+"11":C.mid+"44", borderRadius:10, border:"1px solid "+(task.done?C.green:isLate?C.red:C.border)+"33" }}>
                            <button onClick={function(){ updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],done:!p[ti].done}; return {...evUp,planning:p}; }); }}
                              style={{ width:22,height:22,borderRadius:"50%",border:"2px solid "+(task.done?C.green:C.muted),background:task.done?C.green:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0 }}>
                              {task.done ? "✓" : ""}
                            </button>
                            <span style={{ fontSize:16 }}>{task.icon||"📌"}</span>
                            <input value={task.label} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],label:v}; return {...evUp,planning:p}; }); }}
                              style={{ flex:1, background:"none", border:"none", color:task.done?C.muted:C.cream, fontSize:13, fontFamily:"inherit", outline:"none", textDecoration:task.done?"line-through":"none" }}/>
                            <input type="date" value={task.deadline||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],deadline:v}; return {...evUp,planning:p}; }); }}
                              style={{ background:"#18182a", border:"1px solid "+(isLate?C.red:C.border), borderRadius:6, color:isLate?C.red:C.muted, fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}/>
                            {isLate && <span style={{ color:C.red, fontSize:11, fontWeight:700 }}>EN RETARD</span>}
                            <select value={task.priority||"medium"} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],priority:v}; return {...evUp,planning:p}; }); }}
                              style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"rgba(255,255,255,0.45)", fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}>
                              <option value="high">🔴 Haute</option>
                              <option value="medium">🟡 Moyenne</option>
                              <option value="low">🟢 Faible</option>
                            </select>
                            <button onClick={function(){ updateEv(function(evUp){ return {...evUp, planning:(evUp.planning||[]).filter(function(_,i){ return i!==ti; })}; }); }}
                              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13 }}>🗑</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ── PROGRAMME TAB ──
        ══════════════════════════════════════════ */}
        {tab==="programme" && (
          <div style={{ maxWidth:860 }}>

            {/* ── Programme de la journée ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>🎵 Programme de la journée</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var tpl = [
                    {time:"10:00", label:"Accueil des invités",      icon:"🎉", duration:30,  notes:""},
                    {time:"10:30", label:"Cérémonie",                icon:"💍", duration:45,  notes:""},
                    {time:"11:30", label:"Vin d'honneur / Cocktail", icon:"🥂", duration:90,  notes:""},
                    {time:"13:00", label:"Déjeuner",                  icon:"🍽", duration:120, notes:""},
                    {time:"15:00", label:"Discours & animations",     icon:"🎤", duration:60,  notes:""},
                    {time:"16:00", label:"Pièce montée",              icon:"🎂", duration:30,  notes:""},
                    {time:"17:00", label:"Ouverture de bal",          icon:"💃", duration:30,  notes:""},
                    {time:"20:00", label:"Dîner",                     icon:"🍷", duration:120, notes:""},
                    {time:"22:00", label:"Soirée dansante",           icon:"🎶", duration:180, notes:""},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.programme||[]).map(function(p){ return p.label; });
                    var toAdd = tpl.filter(function(p){ return !existing.includes(p.label); })
                      .map(function(p){ return {...p, id:Date.now()+Math.random()}; });
                    return {...evUp, programme:[...(evUp.programme||[]), ...toAdd]};
                  });
                }}>✨ Modèle mariage</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, programme:[...(evUp.programme||[]), {id:Date.now(), time:"", label:"Nouvelle étape", icon:"📌", duration:60, notes:""}]};
                  });
                }}>+ Étape</Btn>
              </div>

              {(ev.programme||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucune étape. Cliquez "Modèle mariage" pour démarrer.</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {[...(ev.programme||[])].sort(function(a,b){ return (a.time||"").localeCompare(b.time||""); }).map(function(step, si){
                  var pi = (ev.programme||[]).findIndex(function(p){ return p.id === step.id; });
                  return (
                    <div key={step.id} style={{ display:"flex", gap:0 }}>
                      {/* Timeline line */}
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:16, flexShrink:0 }}>
                        <div style={{ width:12,height:12,borderRadius:"50%",background:"linear-gradient(135deg,#C9973A,#F0C97A)",border:"2px solid "+C.gold,marginTop:18,flexShrink:0 }}/>
                        {si < (ev.programme||[]).length-1 && <div style={{ width:2,flex:1,background:C.border,minHeight:20 }}/>}
                      </div>
                      {/* Content */}
                      <div style={{ flex:1, background:C.mid+"44", border:"1px solid "+C.border+"33", borderRadius:12, padding:"12px 16px", marginBottom:8, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                        <input type="time" value={step.time||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],time:v}; return {...evUp,programme:p}; }); }}
                          style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#C9973A", fontSize:13, padding:"4px 8px", fontFamily:"inherit", fontWeight:700, minWidth:80 }}/>
                        <span style={{ fontSize:18 }}>{step.icon||"📌"}</span>
                        <input value={step.label} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],label:v}; return {...evUp,programme:p}; }); }}
                          style={{ flex:1, background:"none", border:"none", color:"#ffffff", fontSize:14, fontFamily:"inherit", outline:"none", minWidth:120 }}/>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <input type="number" value={step.duration||60} onChange={function(e){ var v=parseInt(e.target.value)||60; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],duration:v}; return {...evUp,programme:p}; }); }}
                            style={{ width:56, background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"rgba(255,255,255,0.45)", fontSize:11, padding:"4px 6px", fontFamily:"inherit", textAlign:"center" }}/>
                          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>min</span>
                        </div>
                        <input value={step.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],notes:v}; return {...evUp,programme:p}; }); }}
                          placeholder="Notes / responsable…" style={{ flex:1, background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"rgba(255,255,255,0.45)", fontSize:12, padding:"4px 10px", fontFamily:"inherit", minWidth:100 }}/>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, programme:(evUp.programme||[]).filter(function(_,i){ return i!==pi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13 }}>🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Prestataires ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>🤝 Prestataires</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, suppliers:[...(evUp.suppliers||[]), {id:Date.now(), role:"", name:"", phone:"", email:"", status:"pending", notes:""}]};
                  });
                }}>+ Prestataire</Btn>
              </div>

              {(ev.suppliers||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucun prestataire. Ajoutez vos contacts clés (traiteur, DJ, photographe…).</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.suppliers||[]).map(function(sup, si){
                  var statusColor = {confirmed:C.green, pending:"#FF9800", cancelled:C.red}[sup.status||"pending"];
                  var statusIcon  = {confirmed:"✅", pending:"⏳", cancelled:"❌"}[sup.status||"pending"];
                  return (
                    <div key={sup.id} style={{ background:C.mid+"44", border:"1px solid "+C.border+"33", borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                        <select value={sup.role||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],role:v}; return {...evUp,suppliers:s}; }); }}
                          style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#C9973A", fontSize:12, padding:"4px 8px", fontFamily:"inherit" }}>
                          <option value="">— Rôle —</option>
                          <option value="Traiteur">🍽 Traiteur</option>
                          <option value="DJ">🎵 DJ</option>
                          <option value="Musicien">🎹 Musicien</option>
                          <option value="Photographe">📷 Photographe</option>
                          <option value="Vidéaste">🎬 Vidéaste</option>
                          <option value="Fleuriste">🌸 Fleuriste</option>
                          <option value="Décorateur">🎨 Décorateur</option>
                          <option value="Salle">🏛 Salle</option>
                          <option value="Transport">🚗 Transport</option>
                          <option value="Animation">🎭 Animation</option>
                          <option value="Autre">📦 Autre</option>
                        </select>
                        <input value={sup.name||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],name:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="Nom / société" style={{ flex:1, background:"none", border:"none", color:"#ffffff", fontSize:14, fontFamily:"inherit", outline:"none" }}/>
                        <span style={{ fontSize:16 }}>{statusIcon}</span>
                        <select value={sup.status||"pending"} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],status:v}; return {...evUp,suppliers:s}; }); }}
                          style={{ background:statusColor+"22", border:"1px solid "+statusColor+"66", borderRadius:6, color:statusColor, fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}>
                          <option value="pending">⏳ En cours</option>
                          <option value="confirmed">✅ Confirmé</option>
                          <option value="cancelled">❌ Annulé</option>
                        </select>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, suppliers:(evUp.suppliers||[]).filter(function(_,i){ return i!==si; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13 }}>🗑</button>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <input value={sup.phone||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],phone:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="📞 Téléphone" style={{ flex:1, padding:"5px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", minWidth:120 }}/>
                        <input value={sup.email||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],email:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="✉️ Email" style={{ flex:1, padding:"5px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", minWidth:120 }}/>
                        <input value={sup.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],notes:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="Notes, tarifs, contrat…" style={{ flex:2, padding:"5px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", minWidth:160 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab==="constraints" && (
          <div style={{ maxWidth:700 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <h3 style={{ margin:0, fontWeight:400, fontSize:20 }}>Contraintes de placement</h3>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowConstraint(true)}>+ Contrainte</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {ev.constraints.length===0 && <p style={{ color:"rgba(255,255,255,0.45)" }}>Aucune contrainte définie.</p>}
              {ev.constraints.map(c=>{
                const g1=ev.guests.find(g=>g.id===c.a)?.name||"?";
                const g2=ev.guests.find(g=>g.id===c.b)?.name||"?";
                return (
                  <div key={c.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,background:c.type==="together"?C.green+"18":C.red+"18",border:`1px solid ${c.type==="together"?C.green:C.red}44` }}>
                    <span style={{ fontSize:18 }}>{c.type==="together"?"🤝":"⚡"}</span>
                    <strong style={{ color:"#ffffff" }}>{g1}</strong>
                    <span style={{ color:"rgba(255,255,255,0.45)" }}>{c.type==="together"?"avec":"loin de"}</span>
                    <strong style={{ color:"#ffffff" }}>{g2}</strong>
                    <div style={{flex:1}}/>
                    <button onClick={()=>updateEv(e=>({...e,constraints:e.constraints.filter(x=>x.id!==c.id)}))}
                      style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>✕</button>
                  </div>
                );
              })}
            </div>
            <div style={{ background:"#18182a",border:"1px solid rgba(201,151,58,0.15)",borderRadius:12,padding:20 }}>
              <p style={{ color:"rgba(255,255,255,0.45)", margin:0, fontSize:13, lineHeight:1.8 }}>
                <strong style={{ color:"#C9973A" }}>🤝 {t && t.lang === "fr" ? "Ensemble" : "Together"} :</strong> {t && t.lang === "fr" ? "ces invités seront à la même table" : "these guests will be at the same table"}.<br/>
                <strong style={{ color:"#C9973A" }}>⚡ Séparés :</strong> ces invités seront à des tables différentes.<br/>
                Cliquez <strong style={{ color:"#C9973A" }}>{t.autoPlace}</strong> pour appliquer automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* ── RSVP TAB ── */}
        {tab==="rsvp" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Compteurs RSVP */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                {label:"Confirmés",val:rsvpConfirmed,color:C.green,icon:"✅"},
                {label:"En attente",val:rsvpPending,color:"#C9973A",icon:"⏳"},
                {label:"Déclinés",val:rsvpDeclined,color:C.red,icon:"❌"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:`1px solid ${s.color}44`, borderRadius:14, padding:"20px 24px", textAlign:"center" }}>
                  <div style={{ fontSize:28 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color, margin:"4px 0" }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Taux de réponse</span>
                <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{ev.guests.length>0?Math.round((rsvpConfirmed+rsvpDeclined)/ev.guests.length*100):0}%</span>
              </div>
              <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${ev.guests.length>0?(rsvpConfirmed+rsvpDeclined)/ev.guests.length*100:0}%`, background:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99 }}/>
              </div>
            </div>
            {/* Liste invités avec statut RSVP */}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>💌 Suivi par invité</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="muted" onClick={()=>{
                  updateEv(e=>({...e, guests:e.guests.map(g=>g.rsvp?g:{...g,rsvp:"pending"})}));
                }}>Marquer tous en attente</Btn>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ev.guests.map(g=>(
                  <div key={g.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.mid+"55", borderRadius:10 }}>
                    <div style={{ width:32,height:32,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:13,fontWeight:700 }}>{g.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#ffffff", fontSize:14 }}>{g.name}</div>
                      {g.email && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{g.email}</div>}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      {[["confirmed","✅","Confirmé",C.green],["pending","⏳","En attente",C.gold],["declined","❌","Décliné",C.red]].map(([v,ic,lb,col])=>(
                        <button key={v} onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,rsvp:v}:x)}))}
                          style={{ padding:"4px 10px", borderRadius:8, border:`1.5px solid ${(!g.rsvp&&v==="pending")||g.rsvp===v?col:C.border}`,
                            background:(!g.rsvp&&v==="pending")||g.rsvp===v?col+"22":"none",
                            color:(!g.rsvp&&v==="pending")||g.rsvp===v?col:C.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                          {ic} {lb}
                        </button>
                      ))}
                    </div>
                    {g.rsvpNote && <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.rsvpNote}</span>}
                    <input
                      value={g.rsvpNote||""} onChange={e=>{const v=e.target.value; updateEv(ev2=>({...ev2,guests:ev2.guests.map(x=>x.id===g.id?{...x,rsvpNote:v}:x)}));}}
                      placeholder="Note…"
                      style={{ width:120, padding:"4px 8px", background:"#fff1", border:"1px solid rgba(201,151,58,0.15)", borderRadius:6, color:"#ffffff", fontSize:11, fontFamily:"inherit" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BUDGET TAB ── */}
        {tab==="budget" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Résumé */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                {label:"Budget estimé",val:budgetTotal.toLocaleString("fr-FR",{minimumFractionDigits:0})+" €",color:"#C9973A",icon:"📊"},
                {label:"Dépenses réelles",val:budgetSpent.toLocaleString("fr-FR",{minimumFractionDigits:0})+" €",color:budgetSpent>budgetTotal?C.red:C.green,icon:"💳"},
                {label:"Écart",val:(budgetTotal-budgetSpent>=0?"+":"")+((budgetTotal-budgetSpent).toLocaleString("fr-FR",{minimumFractionDigits:0}))+" €",color:budgetTotal-budgetSpent>=0?C.green:C.red,icon:budgetTotal-budgetSpent>=0?"✅":"⚠️"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:`1px solid ${s.color}44`, borderRadius:14, padding:"18px 22px" }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Barre de progression */}
            {budgetTotal>0 && (
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"16px 22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Consommation du budget</span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.gold, fontSize:12, fontWeight:700 }}>{Math.round(budgetSpent/budgetTotal*100)}%</span>
                </div>
                <div style={{ height:10, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.min(budgetSpent/budgetTotal*100,100)}%`, background:budgetSpent>budgetTotal?C.red:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99, transition:"width .3s" }}/>
                </div>
              </div>
            )}
            {/* Lignes budget */}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>📋 Postes budgétaires</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={()=>setShowAddBudget(true)}>+ Ajouter un poste</Btn>
              </div>
              {(ev.budget||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucun poste budgétaire. Ajoutez vos premières dépenses !</p>}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.budget||[]).map((b,bi)=>{
                  const cat = BUDGET_CATEGORIES.find(c=>c.id===b.category)||BUDGET_CATEGORIES[0];
                  const pct = b.estimated>0?Math.min(b.actual/b.estimated*100,100):0;
                  return (
                    <div key={bi} style={{ background:C.mid+"55", borderRadius:12, padding:"14px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:20 }}>{cat.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#ffffff", fontSize:14, fontWeight:600 }}>{b.label||cat.label}</div>
                          {b.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>{b.notes}</div>}
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Estimé : <span style={{ color:"#C9973A" }}>{(parseFloat(b.estimated)||0).toLocaleString("fr-FR")} €</span></div>
                          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Réel : <span style={{ color:(b.actual||0)>(b.estimated||0)?C.red:C.green }}>{(parseFloat(b.actual)||0).toLocaleString("fr-FR")} €</span></div>
                        </div>
                        <span style={{ fontSize:18, cursor:"pointer", color:b.paid?"#4CAF50":C.muted }} title={b.paid?"Payé":"Non payé"}
                          onClick={()=>updateEv(ev2=>({...ev2,budget:ev2.budget.map((x,i)=>i===bi?{...x,paid:!x.paid}:x)}))}>
                          {b.paid?"✅":"💳"}
                        </span>
                        <button onClick={()=>updateEv(ev2=>({...ev2,budget:(ev2.budget||[]).filter((_,i)=>i!==bi)}))}
                          style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>🗑</button>
                      </div>
                      {b.estimated>0 && (
                        <div style={{ height:4, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:pct>=100?C.red:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99 }}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Répartition par catégorie */}
              {(ev.budget||[]).length>0 && (
                <div style={{ marginTop:20, borderTop:"1px solid rgba(201,151,58,0.12)", paddingTop:16 }}>
                  <h5 style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:1, marginBottom:12 }}>RÉPARTITION PAR CATÉGORIE</h5>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {BUDGET_CATEGORIES.map(cat=>{
                      const total = (ev.budget||[]).filter(b=>b.category===cat.id).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
                      if (!total) return null;
                      return (
                        <div key={cat.id} style={{ background:"#13131e", borderRadius:8, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{cat.icon}</span>
                          <span style={{ color:"#ffffff", fontSize:12 }}>{cat.label}</span>
                          <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{total.toLocaleString("fr-FR")} €</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PLANNING TAB ── */}
        {tab==="planning" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Progress */}
            {planningTotal>0 && (
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"16px 22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Tâches complétées</span>
                  <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{planningDone}/{planningTotal}</span>
                </div>
                <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${planningTotal>0?planningDone/planningTotal*100:0}%`, background:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99, transition:"width .3s" }}/>
                </div>
              </div>
            )}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🗓 Rétroplanning</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="muted" onClick={()=>{
                  // Générer un rétroplanning IA
                  setAiAssistOpen(true);
                  sendAiAssist && setTimeout(()=>sendAiAssist("Génère-moi un rétroplanning type pour "+ev.name+" (type: "+ev.type+") avec des tâches concrètes J-90, J-60, J-30, J-14, J-7, J-1 et Jour J. Format : une tâche par ligne avec la date relative."),100);
                }}>✨ Générer avec l'IA</Btn>
                <div style={{ width:8 }}/>
                <Btn small onClick={()=>setShowAddTask(true)}>+ Tâche</Btn>
              </div>
              {(ev.planning||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucune tâche. Ajoutez vos premières étapes ou demandez à l'IA de générer un rétroplanning !</p>}
              {/* Groupé par priorité / date */}
              {["high","medium","low"].map(prio=>{
                const tasks = (ev.planning||[]).filter(t=>t.priority===prio);
                if (!tasks.length) return null;
                const prioConfig = {high:{label:"🔴 Urgent",color:C.red},medium:{label:"🟡 Normal",color:"#C9973A"},low:{label:"🟢 Faible priorité",color:C.green}};
                const pc = prioConfig[prio];
                return (
                  <div key={prio} style={{ marginBottom:16 }}>
                    <div style={{ color:pc.color, fontSize:12, letterSpacing:1, marginBottom:8, fontWeight:700 }}>{pc.label}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {tasks.map((task,ti)=>{
                        const tIdx = (ev.planning||[]).findIndex(x=>x===task);
                        const overdue = task.dueDate && !task.done && new Date(task.dueDate)<new Date();
                        return (
                          <div key={ti} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:task.done?"#0a2a0a":overdue?C.red+"11":C.mid+"55", borderRadius:10, border:`1px solid ${task.done?C.green+"44":overdue?C.red+"44":C.border}` }}>
                            <span style={{ fontSize:20, cursor:"pointer" }} onClick={()=>updateEv(ev2=>({...ev2,planning:ev2.planning.map((x,i)=>i===tIdx?{...x,done:!x.done}:x)}))}>
                              {task.done?"✅":"⬜"}
                            </span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:task.done?C.muted:C.cream, fontSize:14, textDecoration:task.done?"line-through":"none" }}>{task.title}</div>
                              <div style={{ display:"flex", gap:12, marginTop:2 }}>
                                {task.dueDate && <span style={{ color:overdue?C.red:C.muted, fontSize:11 }}>📅 {task.dueDate}{overdue?" ⚠️ En retard":""}</span>}
                                {task.responsible && <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>👤 {task.responsible}</span>}
                                {task.notes && <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>{task.notes}</span>}
                              </div>
                            </div>
                            <button onClick={()=>updateEv(ev2=>({...ev2,planning:(ev2.planning||[]).filter((_,i)=>i!==tIdx)}))}
                              style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>🗑</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PROGRAMME TAB ── */}
        {tab==="programme" && (
          <div style={{ maxWidth:900, display:"flex", gap:24, flexWrap:"wrap", alignItems:"start" }}>
            {/* Programme / Timeline jour J */}
            <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🎵 Programme du jour J</h4>
                  <div style={{ flex:1 }}/>
                  <Btn small onClick={()=>setShowAddProgramItem(true)}>+ Étape</Btn>
                </div>
                {(ev.programme||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucune étape. Construisez le déroulé de votre journée !</p>}
                <div style={{ display:"flex", flexDirection:"column", position:"relative" }}>
                  {(ev.programme||[]).sort((a,b)=>a.time.localeCompare(b.time)).map((item,ii)=>(
                    <div key={ii} style={{ display:"flex", gap:14, position:"relative", paddingBottom:16 }}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ width:36,height:36,borderRadius:"50%",background:C.gold+"33",border:`2px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,zIndex:1 }}>{item.icon}</div>
                        {ii<(ev.programme||[]).length-1 && <div style={{ width:2,flex:1,background:C.gold+"22",marginTop:4 }}/>}
                      </div>
                      <div style={{ flex:1, paddingTop:6 }}>
                        <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                          <span style={{ color:"#C9973A", fontSize:14, fontWeight:700, minWidth:50 }}>{item.time}</span>
                          <span style={{ color:"#ffffff", fontSize:14 }}>{item.label}</span>
                        </div>
                        {item.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic", marginTop:2 }}>{item.notes}</div>}
                      </div>
                      <button onClick={()=>updateEv(ev2=>({...ev2,programme:(ev2.programme||[]).filter((_,i)=>i!==ii)}))}
                        style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:13,alignSelf:"start",marginTop:6 }}>🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Prestataires */}
            <div style={{ flex:"1 1 340px", display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🤝 Prestataires</h4>
                  <div style={{ flex:1 }}/>
                  <Btn small onClick={()=>setShowAddSupplier(true)}>+ Prestataire</Btn>
                </div>
                {(ev.suppliers||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucun prestataire. Ajoutez vos contacts clés !</p>}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {(ev.suppliers||[]).map((s,si)=>(
                    <div key={si} style={{ background:C.mid+"55", borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ display:"flex", alignItems:"start", gap:10 }}>
                        <div style={{ width:38,height:38,borderRadius:"50%",background:C.gold+"22",border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:16,fontWeight:700,flexShrink:0 }}>
                          {s.name[0]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#ffffff", fontSize:14, fontWeight:600 }}>{s.name}</div>
                          {s.role && <div style={{ color:"#C9973A", fontSize:11 }}>{s.role}</div>}
                          {s.phone && <a href={"tel:"+s.phone} style={{ color:"rgba(255,255,255,0.45)", fontSize:12, display:"block", textDecoration:"none" }}>📞 {s.phone}</a>}
                          {s.email && <a href={"mailto:"+s.email} style={{ color:"rgba(255,255,255,0.45)", fontSize:12, display:"block", textDecoration:"none" }}>✉️ {s.email}</a>}
                          {s.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic", marginTop:4 }}>{s.notes}</div>}
                        </div>
                        <button onClick={()=>updateEv(ev2=>({...ev2,suppliers:(ev2.suppliers||[]).filter((_,i)=>i!==si)}))}
                          style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ROOM TAB ── */}
        {tab==="logistique" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:24 }}>

            {/* ── LIEUX & ADRESSES ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <h4 style={{ margin:"0 0 16px", color:"#C9973A", fontWeight:400, fontSize:16 }}>📍 Lieux & Rendez-vous</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {(ev.venues||[]).map(function(venue, vi){ return (
                  <div key={vi} style={{ background:C.mid+"44", border:"1px solid "+C.border, borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20 }}>{venue.icon||"📍"}</span>
                      <input
                        value={venue.name||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],name:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Nom du lieu (ex: Mairie, Église, Salle des fêtes...)"
                        style={{ flex:1, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:14, fontFamily:"inherit" }}
                      />
                      <button onClick={function(){ updateEv(function(evUp){ return {...evUp, venues:(evUp.venues||[]).filter(function(_,i){ return i!==vi; })}; }); }}
                        style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:16 }}>🗑</button>
                    </div>
                    <input
                      value={venue.address||""}
                      onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],address:v}; return {...evUp,venues:vens}; }); }}
                      placeholder="Adresse complète"
                      style={{ padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}
                    />
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                      <input
                        value={venue.time||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],time:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Heure (ex: 14h00)"
                        style={{ width:120, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
                      />
                      <input
                        value={venue.notes||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],notes:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Notes (parking, code entrée...)"
                        style={{ flex:1, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
                      />
                      {venue.address && (
                        <a href={"https://maps.google.com/?q="+encodeURIComponent(venue.address)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ background:C.gold+"22", border:"1px solid "+C.gold+"44", borderRadius:6, padding:"6px 12px", color:"#C9973A", fontSize:12, textDecoration:"none" }}>
                          🗺 Voir sur Maps
                        </a>
                      )}
                    </div>
                  </div>
                ); })}
                <button onClick={function(){
                  var icons = ["⛪","🏛","🏩","🌿","🏠","🍽","🎉","🏟","🌊","🌄"];
                  updateEv(function(evUp){ return {...evUp, venues:[...(evUp.venues||[]), {name:"",address:"",time:"",notes:"",icon:icons[Math.floor(Math.random()*icons.length)]}]}; });
                }} style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:10, padding:"12px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:13 }}>
                  + Ajouter un lieu
                </button>
              </div>
            </div>

            {/* ── LISTE DE CADEAUX ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🎁 Liste de cadeaux</h4>
                <div style={{ flex:1 }}/>
                <button onClick={function(){
                  var url = ev.giftList && ev.giftList.url;
                  if (url) { window.open(url, "_blank"); }
                }} style={{ background:C.gold+"22", border:"1px solid "+C.gold+"44", borderRadius:8, padding:"6px 14px", cursor:"pointer", color:"#C9973A", fontFamily:"inherit", fontSize:12, display:ev.giftList&&ev.giftList.url?"flex":"none", alignItems:"center", gap:6 }}>
                  🔗 Voir la liste en ligne
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                  <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>LIEN LISTE DE MARIAGE (Amazon, Marche de Mariage...)</label>
                  <input
                    value={(ev.giftList&&ev.giftList.url)||""}
                    onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, giftList:{...(ev2.giftList||{}), url:v}}; }); }}
                    placeholder="https://www.wishlist.fr/..."
                    style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>MESSAGE POUR LES INVITÉS</label>
                  <input
                    value={(ev.giftList&&ev.giftList.message)||""}
                    onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, giftList:{...(ev2.giftList||{}), message:v}}; }); }}
                    placeholder="Ex: Votre présence est le plus beau cadeau. Si vous souhaitez néanmoins nous gâter..."
                    style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:8 }}>CADEAUX REÇUS</label>
                  {(ev.gifts||[]).map(function(gift, gi){ return (
                    <div key={gi} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"center" }}>
                      <span style={{ color:gift.received?"#4CAF50":C.muted, fontSize:18, cursor:"pointer" }}
                        onClick={function(){ updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],received:!gifts[gi].received}; return {...evUp,gifts}; }); }}>
                        {gift.received?"✅":"⬜"}
                      </span>
                      <input
                        value={gift.name||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],name:v}; return {...evUp,gifts}; }); }}
                        placeholder="Nom du cadeau ou de l'expéditeur"
                        style={{ flex:1, padding:"6px 10px", background:gift.received?"#0a2a0a":"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit", textDecoration:gift.received?"line-through":"none" }}
                      />
                      <input
                        value={gift.from||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],from:v}; return {...evUp,gifts}; }); }}
                        placeholder="De la part de..."
                        style={{ width:150, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
                      />
                      <button onClick={function(){ updateEv(function(evUp){ return {...evUp,gifts:(evUp.gifts||[]).filter(function(_,i){ return i!==gi; })}; }); }}
                        style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14 }}>🗑</button>
                    </div>
                  ); })}
                  <button onClick={function(){
                    updateEv(function(evUp){ return {...evUp, gifts:[...(evUp.gifts||[]), {name:"",from:"",received:false}]}; });
                  }} style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:6, padding:"6px 12px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12 }}>
                    + Ajouter un cadeau
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── MODALS ── */}
      <Modal open={showImportCSV} onClose={()=>setShowImportCSV(false)} title="Importer des invités (CSV)" width={500}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"#13131e", borderRadius:10, padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
            <strong style={{color:"#C9973A"}}>Format attendu (1 invité par ligne) :</strong><br/>
            <code style={{color:"#ffffff"}}>Prénom Nom, email@example.fr, standard</code><br/>
            Régimes : standard, vegetarien, vegan, sans-gluten, halal, casher, sans-lactose, sans-noix, diabetique
          </div>
          <textarea
            rows={10}
            placeholder={"Marie Martin, marie@test.com, vegetarien\nJean Dupont, jean@test.com, standard\nSophie Laurent, , vegan"}
            id="csv-import-area"
            style={{ ...inputStyle, resize:"vertical", fontFamily:"monospace", fontSize:12, lineHeight:1.6 }}
          />
          <Btn onClick={() => {
            const raw = document.getElementById("csv-import-area").value;
            const lines = raw.split("\n").filter(l => l.trim());
            const newGuests = lines.map(line => {
              const parts = line.split(",").map(p => p.trim());
              const validDiets = ["standard","vegetarien","vegan","sans-gluten","halal","casher","sans-lactose","sans-noix","diabetique"];
              return {
                id: Date.now() + Math.random(),
                name: parts[0] || "Invité",
                email: parts[1] || "",
                diet: validDiets.includes(parts[2]) ? parts[2] : "standard",
                notes: parts[3] || "",
                allergies: [],
                tableId: null
              };
            }).filter(g => g.name);
            updateEv(e => ({ ...e, guests: [...e.guests, ...newGuests] }));
            setShowImportCSV(false);
          }} style={{marginTop:4}}>
            ⬆ Importer {""} invités
          </Btn>
        </div>
      </Modal>

      <Modal open={showAddGuest} onClose={()=>setShowAddGuest(false)} title="Ajouter un invité">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={t.fieldName}><Input value={newGuest.name} onChange={e=>setNewGuest({...newGuest,name:e.target.value})} placeholder="Prénom Nom"/></Field>
          <Field label={t.fieldEmail}><Input type="email" value={newGuest.email} onChange={e=>setNewGuest({...newGuest,email:e.target.value})} placeholder="email@example.fr"/></Field>
          <Field label="RÉGIME ALIMENTAIRE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {DIET_OPTIONS.map(function(ditem){ return (
                <button key={ditem.id} onClick={()=>setNewGuest({...newGuest,diet:ditem.id})} style={{
                  padding:"7px 10px", borderRadius:8, border:`2px solid ${newGuest.diet===ditem.id?ditem.color:C.border}`,
                  background:newGuest.diet===ditem.id?ditem.color+"22":C.mid, cursor:"pointer", fontSize:12,
                  fontWeight:700, fontFamily:"inherit", color:newGuest.diet===ditem.id?ditem.color:"rgba(255,255,255,0.45)",
                  display:"flex", alignItems:"center", gap:6,
                }}>{ditem.icon} {ditem.label}</button>
              );})}
            </div>
          </Field>
          <Field label="RÔLE / FONCTION">
            <select value={newGuest.role||""} onChange={e=>setNewGuest({...newGuest,role:e.target.value})}
              style={{ width:"100%", padding:"8px 12px", background:"#13131e", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}>
              <option value="">— Aucun rôle spécial —</option>
              <option value="marie1">💍 Marié(e) 1</option>
              <option value="marie2">💍 Marié(e) 2</option>
              <option value="temoin">🎖 Témoin</option>
              <option value="famille_proche">👨‍👩‍👧 Famille proche</option>
              <option value="ami_proche">⭐ Ami proche</option>
              <option value="enfant">🧒 Enfant</option>
              <option value="vip">🌟 VIP</option>
              <option value="prestataire">🔧 Prestataire</option>
            </select>
          </Field>
          <Field label="NOTES / ALLERGIES"><Input value={newGuest.notes} onChange={e=>setNewGuest({...newGuest,notes:e.target.value})} placeholder="Allergies, mobilité réduite…"/></Field>
          <Btn onClick={addGuest} style={{marginTop:4}}>Ajouter l'invité</Btn>
        </div>
      </Modal>

      <Modal open={showAddTable} onClose={()=>setShowAddTable(false)} title="Ajouter une table">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={`${t.fieldNumber} (auto: ${nextTableNumber})`}><Input type="number" value={newTable.number} onChange={e=>setNewTable({...newTable,number:e.target.value})} placeholder={String(nextTableNumber)}/></Field>
          <Field label={t.fieldCapacity}><Input type="number" value={newTable.capacity} onChange={e=>setNewTable({...newTable,capacity:e.target.value})}/></Field>
          <Field label={t.fieldShape}>
            <div style={{ display:"flex", gap:8 }}>
              {[["round","⬤ Ronde"],["rect","▬ Rectangle"]].map(([v,l])=>(
                <button key={v} onClick={()=>setNewTable({...newTable,shape:v})} style={{
                  flex:1, padding:"10px", borderRadius:10, border:`2px solid ${newTable.shape===v?C.gold:C.border}`,
                  background:newTable.shape===v?C.gold+"22":C.mid, cursor:"pointer", color:newTable.shape===v?C.gold:C.muted,
                  fontFamily:"inherit", fontSize:13, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label={`${t.fieldLabel} (optionnel)`}><Input value={newTable.label} onChange={e=>setNewTable({...newTable,label:e.target.value})} placeholder="ex: Famille, Amis…"/></Field>
          <Field label={`${t.fieldColor} (optionnel)`}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#E8845A"].map(col=>(
                <button key={col} onClick={()=>setNewTable({...newTable,color:col})} style={{
                  width:28, height:28, borderRadius:"50%", background:col, border:`3px solid ${newTable.color===col?"#fff":"transparent"}`,
                  cursor:"pointer", padding:0
                }}/>
              ))}
              <button onClick={()=>setNewTable({...newTable,color:undefined})} style={{width:28,height:28,borderRadius:"50%",background:"none",border:`2px solid ${C.border}`,cursor:"pointer",color:"rgba(255,255,255,0.45)",fontSize:10}}>✕</button>
            </div>
          </Field>
          <Btn onClick={addTable} style={{marginTop:4}}>Créer la table</Btn>
        </div>
      </Modal>

      <Modal open={showAddZone} onClose={()=>{setShowAddZone(false);setNewZone({label:"",icon:"📍",color:"#C9973A"});}} title="Ajouter une zone">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE LA ZONE *">
            <Input value={newZone.label} onChange={e=>setNewZone({...newZone,label:e.target.value})} placeholder="ex: Piste de danse, Bar, Scène, Photo Booth…"/>
          </Field>
          <Field label="ICÔNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["💃","🎭","🍹","📸","🧒","🌿","🍽","🥂","🎤","🎰","⛲","🪑","🎊","📍"].map(ic=>(
                <button key={ic} onClick={()=>setNewZone({...newZone,icon:ic})} style={{
                  width:38,height:38,borderRadius:8,fontSize:20,background:newZone.icon===ic?C.gold+"33":C.mid,
                  border:`2px solid ${newZone.icon===ic?C.gold:C.border}`,cursor:"pointer",
                }}>{ic}</button>
              ))}
            </div>
          </Field>
          <Field label="COULEUR">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#64B5F6","#E8845A","#81C784"].map(col=>(
                <button key={col} onClick={()=>setNewZone({...newZone,color:col})} style={{
                  width:28,height:28,borderRadius:"50%",background:col,border:`3px solid ${newZone.color===col?"#fff":"transparent"}`,cursor:"pointer",padding:0,
                }}/>
              ))}
            </div>
          </Field>
          <Btn disabled={!newZone.label.trim()} onClick={()=>{
            updateEv(function(evUp){ return {...evUp, zones:[...(evUp.zones||[]), {...newZone}]}; });
            setNewZone({label:"",icon:"📍",color:"#C9973A"});
            setShowAddZone(false);
          }} style={{marginTop:4}}>Ajouter la zone</Btn>
        </div>
      </Modal>

      <Modal open={showAddFurniture} onClose={()=>{setShowAddFurniture(false);setNewFurniture({label:"",icon:"🪑",color:"#8A7355",width:80,height:40});}} title="Ajouter du mobilier">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM *">
            <Input value={newFurniture.label} onChange={e=>setNewFurniture({...newFurniture,label:e.target.value})} placeholder="ex: Buffet, Piano, Podium, Bar, Scène…"/>
          </Field>
          <Field label="ICÔNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["🪑","🛋","🎹","🎤","🍽","🍹","🎰","📺","🖼","🌿","🕯","🎊","🎭","🔲"].map(ic=>(
                <button key={ic} onClick={()=>setNewFurniture({...newFurniture,icon:ic})} style={{
                  width:38,height:38,borderRadius:8,fontSize:20,background:newFurniture.icon===ic?C.gold+"33":C.mid,
                  border:`2px solid ${newFurniture.icon===ic?C.gold:C.border}`,cursor:"pointer",
                }}>{ic}</button>
              ))}
            </div>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="LARGEUR (cm)">
              <Input type="number" value={newFurniture.width} onChange={e=>setNewFurniture({...newFurniture,width:parseInt(e.target.value)||80})} placeholder="80"/>
            </Field>
            <Field label="HAUTEUR (cm)">
              <Input type="number" value={newFurniture.height} onChange={e=>setNewFurniture({...newFurniture,height:parseInt(e.target.value)||40})} placeholder="40"/>
            </Field>
          </div>
          <Field label="COULEUR">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#8A7355","#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8"].map(col=>(
                <button key={col} onClick={()=>setNewFurniture({...newFurniture,color:col})} style={{
                  width:28,height:28,borderRadius:"50%",background:col,border:`3px solid ${newFurniture.color===col?"#fff":"transparent"}`,cursor:"pointer",padding:0,
                }}/>
              ))}
            </div>
          </Field>
          <Btn disabled={!newFurniture.label.trim()} onClick={()=>{
            updateEv(function(evUp){ return {...evUp, furniture:[...(evUp.furniture||[]), {...newFurniture,id:Date.now(),x:200,y:200}]}; });
            setNewFurniture({label:"",icon:"🪑",color:"#8A7355",width:80,height:40});
            setShowAddFurniture(false);
          }} style={{marginTop:4}}>Ajouter le mobilier</Btn>
        </div>
      </Modal>

      {/* ── MODAL BUDGET ── */}
      <Modal open={showAddBudget} onClose={()=>{setShowAddBudget(false);setNewBudgetLine({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""}); }} title="Ajouter un poste budgétaire">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="CATÉGORIE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {BUDGET_CATEGORIES.map(cat=>(
                <button key={cat.id} onClick={()=>setNewBudgetLine({...newBudgetLine,category:cat.id})} style={{
                  padding:"8px 10px", borderRadius:8, border:`2px solid ${newBudgetLine.category===cat.id?C.gold:C.border}`,
                  background:newBudgetLine.category===cat.id?C.gold+"22":C.mid, cursor:"pointer",
                  color:newBudgetLine.category===cat.id?C.gold:C.muted, fontSize:12, fontFamily:"inherit",
                  display:"flex", alignItems:"center", gap:6,
                }}>{cat.icon} {cat.label}</button>
              ))}
            </div>
          </Field>
          <Field label="LIBELLÉ (optionnel)">
            <Input value={newBudgetLine.label} onChange={e=>setNewBudgetLine({...newBudgetLine,label:e.target.value})} placeholder="ex: Château de Vincennes, DJ Martin…"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="MONTANT ESTIMÉ (€)">
              <Input type="number" value={newBudgetLine.estimated} onChange={e=>setNewBudgetLine({...newBudgetLine,estimated:parseFloat(e.target.value)||0})} placeholder="0"/>
            </Field>
            <Field label="MONTANT RÉEL (€)">
              <Input type="number" value={newBudgetLine.actual} onChange={e=>setNewBudgetLine({...newBudgetLine,actual:parseFloat(e.target.value)||0})} placeholder="0"/>
            </Field>
          </div>
          <Field label="NOTES">
            <Input value={newBudgetLine.notes} onChange={e=>setNewBudgetLine({...newBudgetLine,notes:e.target.value})} placeholder="Acompte versé, devis reçu…"/>
          </Field>
          <label style={{ display:"flex", gap:10, alignItems:"center", fontSize:13, color:"rgba(255,255,255,0.45)", cursor:"pointer" }}>
            <input type="checkbox" checked={newBudgetLine.paid} onChange={e=>setNewBudgetLine({...newBudgetLine,paid:e.target.checked})} style={{ width:16,height:16 }}/>
            Déjà payé ✅
          </label>
          <Btn onClick={()=>{
            updateEv(ev2=>({...ev2, budget:[...(ev2.budget||[]), {...newBudgetLine}]}));
            setNewBudgetLine({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""});
            setShowAddBudget(false);
          }} style={{marginTop:4}}>Ajouter ce poste</Btn>
        </div>
      </Modal>

      {/* ── MODAL TÂCHE PLANNING ── */}
      <Modal open={showAddTask} onClose={()=>{setShowAddTask(false);setNewTask({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});}} title="Ajouter une tâche">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="TÂCHE *">
            <Input value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} placeholder="ex: Confirmer le traiteur, Envoyer les invitations…"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="DATE LIMITE">
              <Input type="date" value={newTask.dueDate} onChange={e=>setNewTask({...newTask,dueDate:e.target.value})}/>
            </Field>
            <Field label="RESPONSABLE">
              <Input value={newTask.responsible} onChange={e=>setNewTask({...newTask,responsible:e.target.value})} placeholder="ex: Marie, Traiteur…"/>
            </Field>
          </div>
          <Field label="PRIORITÉ">
            <div style={{ display:"flex", gap:8 }}>
              {[["high","🔴 Urgent",C.red],["medium","🟡 Normal",C.gold],["low","🟢 Faible",C.green]].map(([v,l,col])=>(
                <button key={v} onClick={()=>setNewTask({...newTask,priority:v})} style={{
                  flex:1, padding:"9px 6px", borderRadius:10, border:`2px solid ${newTask.priority===v?col:C.border}`,
                  background:newTask.priority===v?col+"22":C.mid, cursor:"pointer", color:newTask.priority===v?col:C.muted,
                  fontFamily:"inherit", fontSize:12, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="NOTES (optionnel)">
            <Input value={newTask.notes} onChange={e=>setNewTask({...newTask,notes:e.target.value})} placeholder="Précisions…"/>
          </Field>
          <Btn disabled={!newTask.title.trim()} onClick={()=>{
            updateEv(ev2=>({...ev2, planning:[...(ev2.planning||[]), {...newTask}]}));
            setNewTask({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});
            setShowAddTask(false);
          }} style={{marginTop:4}}>Ajouter la tâche</Btn>
        </div>
      </Modal>

      {/* ── MODAL PROGRAMME ── */}
      <Modal open={showAddProgramItem} onClose={()=>{setShowAddProgramItem(false);setNewProgramItem({time:"",label:"",icon:"🎤",notes:""}); }} title="Ajouter une étape au programme">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="HEURE">
              <Input type="time" value={newProgramItem.time} onChange={e=>setNewProgramItem({...newProgramItem,time:e.target.value})}/>
            </Field>
            <Field label="ÉTAPE *">
              <Input value={newProgramItem.label} onChange={e=>setNewProgramItem({...newProgramItem,label:e.target.value})} placeholder="ex: Vin d'honneur, Dîner, Ouverture de bal…"/>
            </Field>
          </div>
          <Field label="ICÔNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["🥂","🍽","💃","🎤","📸","🎂","💍","🎭","🎻","🎵","🎊","🌅","🚗","🏛"].map(ic=>(
                <button key={ic} onClick={()=>setNewProgramItem({...newProgramItem,icon:ic})} style={{
                  width:38,height:38,borderRadius:8,fontSize:20,background:newProgramItem.icon===ic?C.gold+"33":C.mid,
                  border:`2px solid ${newProgramItem.icon===ic?C.gold:C.border}`,cursor:"pointer",
                }}>{ic}</button>
              ))}
            </div>
          </Field>
          <Field label="NOTES (optionnel)">
            <Input value={newProgramItem.notes} onChange={e=>setNewProgramItem({...newProgramItem,notes:e.target.value})} placeholder="Durée, lieu, responsable…"/>
          </Field>
          <Btn disabled={!newProgramItem.label.trim()||!newProgramItem.time} onClick={()=>{
            updateEv(ev2=>({...ev2, programme:[...(ev2.programme||[]), {...newProgramItem}]}));
            setNewProgramItem({time:"",label:"",icon:"🎤",notes:""});
            setShowAddProgramItem(false);
          }} style={{marginTop:4}}>Ajouter l'étape</Btn>
        </div>
      </Modal>

      {/* ── MODAL PRESTATAIRE ── */}
      <Modal open={showAddSupplier} onClose={()=>{setShowAddSupplier(false);setNewSupplier({name:"",role:"",phone:"",email:"",notes:""}); }} title="Ajouter un prestataire">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM / SOCIÉTÉ *">
            <Input value={newSupplier.name} onChange={e=>setNewSupplier({...newSupplier,name:e.target.value})} placeholder="ex: DJ Martin, Fleurs du Soleil, Photos by Julie…"/>
          </Field>
          <Field label="RÔLE / PRESTATION">
            <Input value={newSupplier.role} onChange={e=>setNewSupplier({...newSupplier,role:e.target.value})} placeholder="ex: DJ, Fleuriste, Photographe, Traiteur…"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="TÉLÉPHONE">
              <Input type="tel" value={newSupplier.phone} onChange={e=>setNewSupplier({...newSupplier,phone:e.target.value})} placeholder="06 00 00 00 00"/>
            </Field>
            <Field label="EMAIL">
              <Input type="email" value={newSupplier.email} onChange={e=>setNewSupplier({...newSupplier,email:e.target.value})} placeholder="contact@prestataire.fr"/>
            </Field>
          </div>
          <Field label="NOTES (contrat, acompte, horaires…)">
            <Input value={newSupplier.notes} onChange={e=>setNewSupplier({...newSupplier,notes:e.target.value})} placeholder="Contrat signé, acompte versé, arrivée 14h…"/>
          </Field>
          <Btn disabled={!newSupplier.name.trim()} onClick={()=>{
            updateEv(ev2=>({...ev2, suppliers:[...(ev2.suppliers||[]), {...newSupplier,id:Date.now()}]}));
            setNewSupplier({name:"",role:"",phone:"",email:"",notes:""});
            setShowAddSupplier(false);
          }} style={{marginTop:4}}>Ajouter le prestataire</Btn>
        </div>
      </Modal>

      <Modal open={showConstraint} onClose={()=>setShowConstraint(false)} title="Nouvelle contrainte">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="PREMIER INVITÉ">
            <Select value={constraint.a} onChange={e=>setConstraint({...constraint,a:parseInt(e.target.value)||e.target.value})}>
              <option value="">— Choisir —</option>
              {ev.guests.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
          </Field>
          <Field label={t.settingType}>
            <div style={{ display:"flex", gap:8 }}>
              {[["together","🤝 Ensemble",C.green],["apart","⚡ Séparés",C.red]].map(([v,l,col])=>(
                <button key={v} onClick={()=>setConstraint({...constraint,type:v})} style={{
                  flex:1, padding:"10px", borderRadius:10, border:`2px solid ${constraint.type===v?col:C.border}`,
                  background:constraint.type===v?col+"22":C.mid, cursor:"pointer", color:constraint.type===v?col:C.muted,
                  fontFamily:"inherit", fontSize:13, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="DEUXIÈME INVITÉ">
            <Select value={constraint.b} onChange={e=>setConstraint({...constraint,b:parseInt(e.target.value)||e.target.value})}>
              <option value="">— Choisir —</option>
              {ev.guests.filter(g=>g.id!==constraint.a).map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
          </Field>
          <Btn onClick={addConstraint} style={{marginTop:4}}>Ajouter</Btn>
        </div>
      </Modal>

      <Modal open={showQR} onClose={()=>setShowQR(false)} title={`QR Code — ${ev.name}`} width={400}>
        <div style={{ textAlign:"center" }} id="qr-modal">
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:20 }}>Partagez ce QR code avec vos invités pour qu'ils renseignent leurs préférences.</p>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <div style={{ padding:16,background:C.cream,borderRadius:16,border:`2px solid ${C.border}`,display:"inline-block" }}>
              <QRCodeWidget value={`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`} size={180}/>
            </div>
          </div>
          <div style={{ background:"#13131e",borderRadius:8,padding:"8px 16px",fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:20,fontFamily:"monospace",cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}
            onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`);}} title="Cliquer pour copier">
            tableplan-seven.vercel.app/?join={ev.id} (🔗 via Partager) <span style={{fontSize:10}}>📋</span>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn small onClick={()=>{const c=document.querySelector("#qr-modal canvas");if(!c){alert("QR non disponible");return;}const l=document.createElement("a");l.download=`QR-${ev.name}.png`;l.href=c.toDataURL("image/png");l.click();}}>⬇ PNG</Btn>
            <Btn small variant="ghost" onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`).then(()=>alert("Lien copié !"))}}>📋 Copier le lien</Btn>
            <Btn small variant="muted" onClick={()=>setShowSettings(false)}>🖨 Imprimer</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={showSettings} onClose={()=>setShowSettings(false)} title="Paramètres de l'événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={t.settingName}><Input value={ev.name} onChange={e=>updateEv(evUp=>({...evUp,name:e.target.value}))}/></Field>
          <Field label={t.settingDate}><Input type="date" value={ev.date} onChange={e=>updateEv(evUp=>({...evUp,date:e.target.value}))}/></Field>
          <Field label={t.eventNotes}>
            <textarea value={ev.notes||""} onChange={e=>updateEv(evUp=>({...evUp,notes:e.target.value}))} rows={3}
              placeholder="Salle des fêtes, traiteur, prestataires..."
              style={{...inputStyle, resize:"vertical", lineHeight:1.6}}/>
          </Field>
          <Field label={t.settingType}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=>(
                <button key={k} onClick={()=>updateEv(evUp=>({...evUp,type:k}))} style={{
                  padding:"8px 6px", borderRadius:10, border:`2px solid ${ev.type===k?v.color:C.border}`,
                  background:ev.type===k?v.color+"22":C.mid, cursor:"pointer",
                  color:ev.type===k?v.color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:11, fontWeight:700,
                }}>{v.icon} {v.label}</button>
              ))}
            </div>
          </Field>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// VOUCHER MODAL
// ═══════════════════════════════════════════════════════════════


export default EventEditor;
