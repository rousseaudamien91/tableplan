/* eslint-disable */
import { useState } from "react";
import AddGuestModal  from "../Modals/AddGuestModal";
import GuestEditModal from "../Modals/GuestEditModal";
import QRModal       from "../Modals/QRModal";
import InviteModal   from "../Modals/InviteModal";
import { C, DIET_OPTIONS } from "../../../constants";
import { uid, exportGuestsCSV } from "../../../utils";

var RSVP_COLOR = { confirmed:C.green, declined:C.red, pending:"rgba(255,255,255,0.35)" };
var RSVP_ICON  = { confirmed:"✅", declined:"❌", pending:"⏳" };

export default function TabGuests({ ev, onUpdate, showAddGuest, setShowAddGuest, t }) {
  var [subTab,   setSubTab]   = useState("list");
  var [search,   setSearch]   = useState("");
  var [filter,   setFilter]   = useState("all");
  var [showQR,   setShowQR]   = useState(false);
  var [showInvite, setShowInvite] = useState(false);
  var [showImport, setShowImport] = useState(false);
  var [editGuest,  setEditGuest]  = useState(null);
  var [importText, setImportText] = useState("");
  var [importPreview, setImportPreview] = useState(null);
  var [sortBy, setSortBy] = useState("name");

  var [newGuest, setNewGuest] = useState({
    name:"", email:"", diet:"standard", rsvp:"pending", notes:"", tableId:null,
  });

  var guests   = ev.guests  || [];
  var tables   = ev.tables  || [];
  var confirmed = guests.filter(function(g){ return g.rsvp==="confirmed"; }).length;
  var declined  = guests.filter(function(g){ return g.rsvp==="declined";  }).length;
  var pending   = guests.filter(function(g){ return g.rsvp==="pending" || !g.rsvp; }).length;
  var unseated  = guests.filter(function(g){ return !g.tableId; }).length;
  var seated    = guests.length - unseated;

  function saveGuest(updatedGuest) {
    onUpdate({ ...ev, guests: guests.map(function(g){ return g.id===updatedGuest.id ? updatedGuest : g; }) });
  }

  function deleteGuest(id) {
    onUpdate({
      ...ev,
      guests: guests.filter(function(g){ return g.id!==id; }),
      tables: tables.map(function(tbl){
        return { ...tbl, guests: (tbl.guests||[]).filter(function(gid){ return gid!==id; }) };
      }),
    });
  }

  function addGuest() {
    if (!newGuest.name.trim()) return;
    onUpdate({ ...ev, guests: [...guests, { id:uid(), ...newGuest }] });
    setShowAddGuest(false);
    setNewGuest({ name:"", email:"", diet:"standard", rsvp:"pending", notes:"", tableId:null });
  }

  function removeGuest(id) {
    onUpdate({
      ...ev,
      guests: guests.filter(function(g){ return g.id!==id; }),
      tables: tables.map(function(tbl){
        return { ...tbl, guests: (tbl.guests||[]).filter(function(gid){ return gid!==id; }) };
      }),
    });
  }

  function updateRsvp(id, rsvp) {
    onUpdate({ ...ev, guests: guests.map(function(g){ return g.id===id ? {...g,rsvp} : g; }) });
  }

  // ─── Import CSV ───────────────────────────────────────
  function parseImport(text) {
    var lines = text.trim().split('\n').filter(function(l){ return l.trim(); });
    if (!lines.length) return [];
    var parsed = [];
    lines.forEach(function(line) {
      var parts = line.split(/[,;	]/).map(function(p){ return p.trim().replace(/^"|"$/g,''); });
      var name = parts[0] || '';
      var email = parts[1] || '';
      if (name && !guests.find(function(g){ return g.name.toLowerCase()===name.toLowerCase(); })) {
        parsed.push({ id:uid(), name, email, diet:'standard', rsvp:'pending', notes:'', tableId:null });
      }
    });
    return parsed;
  }

  function handleImportPreview() {
    var rows = parseImport(importText);
    setImportPreview(rows);
  }

  function confirmImport() {
    if (!importPreview || !importPreview.length) return;
    onUpdate({ ...ev, guests: [...guests, ...importPreview] });
    setShowImport(false);
    setImportText('');
    setImportPreview(null);
  }

  // ─── Filtrage liste ────────────────────────────────────
  var filtered = guests.filter(function(g) {
    var matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || (g.email||'').toLowerCase().includes(search.toLowerCase());
    var matchFilter = filter==='all'
      || (filter==='confirmed' && g.rsvp==='confirmed')
      || (filter==='declined'  && g.rsvp==='declined')
      || (filter==='pending'   && (!g.rsvp||g.rsvp==='pending'))
      || (filter==='unseated'  && !g.tableId);
    return matchSearch && matchFilter;
  });

  // ─── Tri ──────────────────────────────────────────────
  filtered = [...filtered].sort(function(a, b) {
    if (sortBy === "name")   return a.name.localeCompare(b.name);
    if (sortBy === "rsvp")   return (a.rsvp||"pending").localeCompare(b.rsvp||"pending");
    if (sortBy === "table")  return ((a.tableId?0:1) - (b.tableId?0:1));
    if (sortBy === "role")   return (a.role||"").localeCompare(b.role||"");
    return 0;
  });

  // ─── Export PDF liste invités ──────────────────────────
  function exportGuestsPDF() {
    var rows = (ev.guests||[]).map(function(g) {
      var tbl = tables.find(function(t){ return t.id===g.tableId; });
      var rsvpLabel = {confirmed:"✅ Oui", declined:"❌ Non", pending:"⏳ En attente"}[g.rsvp]||"⏳";
      return "<tr>" +
        "<td style='padding:7px 12px;border-bottom:1px solid #eee'>" + g.name + "</td>" +
        "<td style='padding:7px 12px;border-bottom:1px solid #eee;color:#666'>" + (g.role||"—") + "</td>" +
        "<td style='padding:7px 12px;border-bottom:1px solid #eee'>" + rsvpLabel + "</td>" +
        "<td style='padding:7px 12px;border-bottom:1px solid #eee;color:#666'>" + (g.diet!=="standard"?g.diet:"—") + "</td>" +
        "<td style='padding:7px 12px;border-bottom:1px solid #eee;color:#666'>" + (tbl?"Table "+tbl.number:"Non placé") + "</td>" +
        "</tr>";
    }).join("");
    var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Invités — " + ev.name + "</title>" +
      "<style>body{font-family:Georgia,serif;margin:40px;color:#1a1a1a}h1{font-size:22px;margin-bottom:4px}h2{font-size:13px;color:#666;font-weight:400;margin:0 0 24px}table{width:100%;border-collapse:collapse}th{background:#f8f4ee;padding:9px 12px;text-align:left;font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:#555;border-bottom:2px solid #C9973A}</style>" +
      "</head><body><h1>👤 Invités — " + ev.name + "</h1>" +
      "<h2>" + (ev.guests||[]).length + " invités · " + (ev.date||"") + "</h2>" +
      "<table><thead><tr><th>Nom</th><th>Rôle</th><th>RSVP</th><th>Régime</th><th>Table</th></tr></thead><tbody>" +
      rows + "</tbody></table></body></html>";
    var win = window.open("","_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(function(){ win.print(); }, 400);
  }

  // ─── Stats RSVP pour le sous-onglet ───────────────────
  var rsvpPct = guests.length > 0 ? Math.round((confirmed + declined) / guests.length * 100) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column" }}>

      {/* ── Barre stats ────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 24px", background:"rgba(0,0,0,0.2)", borderBottom:"1px solid rgba(201,151,58,0.08)", flexWrap:"wrap" }}>
        {[
          { label:t&&t.guests||"Invités",      value:guests.length,  color:"#F0C97A" },
          { label:t&&t.rsvpConfirmed||"Confirmés", value:confirmed,  color:C.green  },
          { label:t&&t.rsvpPending||"En attente",  value:pending,    color:"rgba(255,255,255,0.45)" },
          { label:t&&t.rsvpDeclined||"Déclinés",   value:declined,   color:C.red    },
          { label:t&&t.unseated||"Non placés",     value:unseated,   color:"#E8845A" },
        ].map(function(s, i) {
          return (
            <div key={i} style={{ background:C.card, borderRadius:8, padding:"5px 12px", fontSize:12, border:"1px solid rgba(201,151,58,0.1)", display:"flex", alignItems:"center", gap:5 }}>
              <b style={{color:s.color}}>{s.value}</b>
              <span style={{color:"rgba(255,255,255,0.35)"}}>{s.label}</span>
            </div>
          );
        })}
        <div style={{ flex:1 }}/>
        {/* Actions */}
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={function(){ exportGuestsCSV(ev); }} style={{ padding:"5px 12px", background:"none", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            ⬇ Export CSV
          </button>
          <button onClick={function(){ setShowImport(true); }} style={{ padding:"5px 12px", background:"none", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            ⬆ Import CSV
          </button>
          <button onClick={exportGuestsPDF} style={{ padding:"6px 12px", background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            🖨️ PDF
          </button>
          <button onClick={function(){ setShowQR(true); }} style={{ padding:"5px 12px", background:"none", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            📱 QR Invités
          </button>
          <button onClick={function(){ setShowInvite(true); }} style={{ padding:"5px 12px", background:"rgba(201,151,58,0.12)", border:"1px solid rgba(201,151,58,0.35)", borderRadius:8, color:"#F0C97A", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700 }}>
            💌 Invitations
          </button>
          <button onClick={function(){ setShowAddGuest(true); }} style={{ padding:"5px 14px", background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:8, color:"#0d0d14", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:800 }}>
            + {t&&t.addGuest||"Invité"}
          </button>
        </div>
      </div>

      {/* ── Sous-onglets ────────────────────────────────── */}
      <div style={{ display:"flex", gap:0, padding:"0 24px", background:"rgba(0,0,0,0.15)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        {[
          { id:"list", label:`👥 ${t&&t.tabGuests||"Invités"} (${guests.length})` },
          { id:"rsvp", label:`💌 RSVP${pending>0?" ("+pending+"⏳)":""}` },
          { id:"diet", label:`🥗 Régimes` },
        ].map(function(tab) {
          var active = subTab===tab.id;
          return (
            <button key={tab.id} onClick={function(){ setSubTab(tab.id); }} style={{
              padding:"8px 18px", background:"none", border:"none", cursor:"pointer",
              color: active?"#F0C97A":"rgba(255,255,255,0.4)",
              fontSize:12, fontFamily:"Georgia,serif", fontWeight:active?700:400,
              borderBottom: active?"2px solid #C9973A":"2px solid transparent",
              transition:"all .15s",
            }}>{tab.label}</button>
          );
        })}
      </div>

      {/* ── Contenu ─────────────────────────────────────── */}
      <div style={{ padding:"16px 24px" }}>

        {/* ══ LISTE INVITÉS ══ */}
        {subTab==="list" && (
          <div>
            {/* Filtres + recherche */}
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              {[
                {id:"all",       label:"Tous",        count:guests.length},
                {id:"confirmed", label:"✅ Confirmés", count:confirmed},
                {id:"pending",   label:"⏳ En attente",count:pending},
                {id:"unseated",  label:"⚠ Non placés",count:unseated},
              ].map(function(f) {
                return (
                  <button key={f.id} onClick={function(){ setFilter(f.id); }} style={{
                    padding:"5px 12px", borderRadius:8, border:"none", cursor:"pointer",
                    background: filter===f.id?"rgba(201,151,58,0.15)":"rgba(255,255,255,0.04)",
                    borderBottom: filter===f.id?"2px solid #C9973A":"2px solid transparent",
                    color: filter===f.id?"#F0C97A":"rgba(255,255,255,0.4)",
                    fontSize:11, fontFamily:"Georgia,serif", fontWeight:filter===f.id?700:400,
                  }}>
                    {f.label} <b style={{marginLeft:4}}>{f.count}</b>
                  </button>
                );
              })}
              <div style={{ flex:1 }}/>
              <input value={search} onChange={function(e){ setSearch(e.target.value); }}
                placeholder={t&&t.search||"Rechercher un invité…"}
                style={{ padding:"6px 12px", borderRadius:8, background:"#13131e", border:"1px solid rgba(201,151,58,0.15)", color:"#fff", fontSize:12, fontFamily:"inherit", outline:"none", width:200 }}
              />
            </div>

            {/* Liste */}
            {filtered.length===0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,0.25)" }}>
                <div style={{fontSize:40,marginBottom:12}}>👥</div>
                <div style={{fontSize:14}}>{search ? "Aucun résultat" : (t&&t.noGuests||"Aucun invité pour le moment")}</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {filtered.map(function(g) {
                  var table  = tables.find(function(tbl){ return tbl.id===g.tableId; });
                  var diet   = DIET_OPTIONS.find(function(d){ return d.id===g.diet; }) || DIET_OPTIONS[0];
                  var rsvpC  = RSVP_COLOR[g.rsvp||"pending"];
                  return (
                    <div key={g.id} style={{ background:C.card, border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
                      {/* Avatar — clic pour éditer */}
                      <div onClick={function(e){ e.stopPropagation(); setEditGuest(g); }} style={{ width:34,height:34,borderRadius:9,background:"rgba(201,151,58,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontWeight:800,fontSize:14,flexShrink:0,cursor:"pointer" }}>
                        {g.name[0]?.toUpperCase()}
                      </div>
                      {/* Infos — clic pour éditer */}
                      <div onClick={function(e){ e.stopPropagation(); setEditGuest(g); }} style={{ flex:1, minWidth:0, cursor:"pointer" }}>
                        <div style={{ fontWeight:700, fontSize:13, color:"#fff", display:"flex", alignItems:"center", gap:6 }}>
                          {g.name}
                          {g.role && (function(){
                            var roleColors = {marie1:"#F0C97A",marie2:"#F0C97A",temoin1:"#C9973A",temoin2:"#C9973A",vip:"#FFD700",famille_marie1:"#8B7EC8",famille_marie2:"#E8845A",ami_proche:"#4CAF50",enfant:"#29B6F6",intervenant:"#F0C97A",moderateur:"#C9973A",fete:"#F0C97A",prestataire:"rgba(255,255,255,0.35)",staff:"rgba(255,255,255,0.35)"};
                            var roleLabels = {marie1:"💍 Marié(e) 1",marie2:"💍 Marié(e) 2",temoin1:"🎖 Témoin 1",temoin2:"🎖 Témoin 2",vip:"🌟 VIP",famille_marie1:"👨‍👩‍👧 Famille M1",famille_marie2:"👨‍👩‍👧 Famille M2",ami_proche:"⭐ Ami proche",enfant:"🧒 Enfant",intervenant:"🎤 Intervenant",moderateur:"🎯 Modérateur",fete:"🎂 Fêté(e)",prestataire:"🔧 Prestataire",staff:"🔧 Staff"};
                            var col = roleColors[g.role] || "#F0C97A";
                            var lbl = roleLabels[g.role] || g.role;
                            return <span style={{ fontSize:10, color:col, border:"1px solid "+col+"55", borderRadius:4, padding:"1px 5px", fontWeight:700 }}>{lbl}</span>;
                          })()}
                        </div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", display:"flex", gap:8, marginTop:2 }}>
                          {g.email && <span>{g.email}</span>}
                          {g.phone && <span>{g.phone}</span>}
                          {g.diet !== "standard" && <span>{diet.icon} {diet.label}</span>}
                        </div>
                      </div>
                      {/* Table */}
                      <div style={{ fontSize:11, color:table?"#F0C97A":"rgba(255,255,255,0.25)", flexShrink:0 }}>
                        {table ? "Table "+table.number : (t&&t.unseated||"Non placé")}
                      </div>
                      {/* RSVP */}
                      <select value={g.rsvp||"pending"} onChange={function(e){ updateRsvp(g.id,e.target.value); }}
                        style={{ background:"#13131e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, color:rsvpC, fontSize:11, padding:"3px 7px", fontFamily:"inherit", cursor:"pointer" }}>
                        <option value="confirmed">✅ Confirmé</option>
                        <option value="pending">⏳ En attente</option>
                        <option value="declined">❌ Décliné</option>
                      </select>
                      {/* Supprimer */}
                      <button onClick={function(){ removeGuest(g.id); }} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:16,padding:0,flexShrink:0 }}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ RSVP ══ */}
        {subTab==="rsvp" && (
          <div>
            {/* Progression */}
            <div style={{ background:C.card, borderRadius:14, padding:"20px 24px", marginBottom:20, border:"1px solid rgba(201,151,58,0.1)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>Taux de réponse</span>
                <span style={{ fontSize:20, fontWeight:800, color:"#F0C97A" }}>{rsvpPct}%</span>
              </div>
              <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:99, marginBottom:16 }}>
                <div style={{ height:"100%", width:rsvpPct+"%", background:"linear-gradient(90deg,#C9973A,#F0C97A)", borderRadius:99, transition:"width .4s" }}/>
              </div>
              <div style={{ display:"flex", gap:16 }}>
                {[
                  {label:"Confirmés", value:confirmed, color:C.green,  icon:"✅"},
                  {label:"En attente",value:pending,   color:"#F0C97A", icon:"⏳"},
                  {label:"Déclinés",  value:declined,  color:C.red,    icon:"❌"},
                ].map(function(s,i) {
                  return (
                    <div key={i} style={{ flex:1, textAlign:"center", background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"12px 8px", border:"1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
                      <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Liste en attente */}
            {pending > 0 && (
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>
                  En attente de réponse ({pending})
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {guests.filter(function(g){ return !g.rsvp||g.rsvp==="pending"; }).map(function(g) {
                    return (
                      <div key={g.id} style={{ background:C.card, border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:32,height:32,borderRadius:8,background:"rgba(255,200,50,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#F0C97A",fontWeight:800,fontSize:13,flexShrink:0 }}>
                          {g.name[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{g.name}</div>
                          {g.email && <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{g.email}</div>}
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={function(){ updateRsvp(g.id,"confirmed"); }} style={{ padding:"4px 12px", border:"none", borderRadius:6, background:"rgba(39,174,96,0.15)", color:C.green, cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:700 }}>✅</button>
                          <button onClick={function(){ updateRsvp(g.id,"declined");  }} style={{ padding:"4px 12px", border:"none", borderRadius:6, background:"rgba(192,57,43,0.15)",  color:C.red,   cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:700 }}>❌</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pending===0 && guests.length>0 && (
              <div style={{ textAlign:"center", padding:"40px 20px", color:C.green }}>
                <div style={{fontSize:40,marginBottom:8}}>🎉</div>
                <div style={{fontSize:14,fontWeight:700}}>Tous les invités ont répondu !</div>
              </div>
            )}
          </div>
        )}

        {/* ══ RÉGIMES ALIMENTAIRES ══ */}
        {subTab==="diet" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
              {DIET_OPTIONS.map(function(diet) {
                var dietGuests = guests.filter(function(g){ return g.diet===diet.id; });
                if (dietGuests.length===0) return null;
                return (
                  <div key={diet.id} style={{ background:C.card, border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <span style={{fontSize:22}}>{diet.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:"#fff" }}>{diet.label}</div>
                        <div style={{ fontSize:11, color:diet.color, fontWeight:700 }}>{dietGuests.length} invité{dietGuests.length>1?"s":""}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      {dietGuests.map(function(g) {
                        var table = tables.find(function(tbl){ return tbl.id===g.tableId; });
                        return (
                          <div key={g.id} style={{ fontSize:12, color:"rgba(255,255,255,0.6)", display:"flex", justifyContent:"space-between" }}>
                            <span>{g.name}</span>
                            <span style={{color:"rgba(255,255,255,0.3)"}}>{table?"T."+table.number:"—"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
              {guests.every(function(g){ return g.diet==="standard"; }) && (
                <div style={{ textAlign:"center", padding:"40px 20px", color:"rgba(255,255,255,0.25)", gridColumn:"1/-1" }}>
                  <div style={{fontSize:32,marginBottom:8}}>🥗</div>
                  <div style={{fontSize:13}}>Aucun régime spécifique renseigné</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══ MODAL IMPORT CSV ══ */}
      {showImport && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
          <div style={{ width:520,background:"#18182a",borderRadius:18,padding:28,border:"1px solid rgba(201,151,58,0.2)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h3 style={{margin:0,fontSize:16,fontWeight:800,color:"#fff"}}>⬆ Import CSV / Coller une liste</h3>
              <button onClick={function(){ setShowImport(false); setImportPreview(null); setImportText(''); }} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:12,lineHeight:1.6 }}>
              Collez une liste d'invités : <b>Prénom Nom, email@exemple.fr</b><br/>
              Un invité par ligne. Les doublons seront ignorés.
            </div>
            <textarea value={importText} onChange={function(e){ setImportText(e.target.value); setImportPreview(null); }}
              rows={6} placeholder={"Alice Martin, alice@mail.fr\nBob Dupont\nClaire Simon, claire@mail.fr"}
              style={{ width:"100%",boxSizing:"border-box",padding:"10px 12px",background:"#13131e",border:"1px solid rgba(201,151,58,0.15)",borderRadius:8,color:"#fff",fontSize:12,fontFamily:"monospace",resize:"vertical",outline:"none",marginBottom:12 }}
            />
            {/* Aperçu */}
            {importPreview && (
              <div style={{ background:"rgba(39,174,96,0.08)",border:"1px solid rgba(39,174,96,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:12 }}>
                <div style={{ color:C.green,fontWeight:700,marginBottom:6 }}>✅ {importPreview.length} invité{importPreview.length>1?"s":""} à importer</div>
                {importPreview.slice(0,5).map(function(g){ return <div key={g.id} style={{color:"rgba(255,255,255,0.6)"}}>{g.name}{g.email?" — "+g.email:""}</div>; })}
                {importPreview.length>5 && <div style={{color:"rgba(255,255,255,0.35)"}}>+{importPreview.length-5} autres…</div>}
              </div>
            )}
            <div style={{ display:"flex",gap:8 }}>
              {!importPreview ? (
                <button onClick={handleImportPreview} disabled={!importText.trim()} style={{ flex:1,padding:"10px",border:"none",borderRadius:8,background:importText.trim()?"linear-gradient(135deg,#C9973A,#F0C97A)":"rgba(255,255,255,0.08)",color:importText.trim()?"#0d0d14":"rgba(255,255,255,0.3)",cursor:importText.trim()?"pointer":"not-allowed",fontWeight:800,fontSize:13,fontFamily:"inherit" }}>
                  Aperçu →
                </button>
              ) : (
                <button onClick={confirmImport} style={{ flex:1,padding:"10px",border:"none",borderRadius:8,background:"linear-gradient(135deg,#27AE60,#2ecc71)",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:13,fontFamily:"inherit" }}>
                  ✅ Importer {importPreview.length} invité{importPreview.length>1?"s":""}
                </button>
              )}
              <button onClick={function(){ setShowImport(false); setImportPreview(null); setImportText(''); }} style={{ padding:"10px 18px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,background:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODALS ══ */}
      <AddGuestModal
        open={showAddGuest}
        onClose={function(){ setShowAddGuest(false); }}
        newGuest={newGuest}
        setNewGuest={setNewGuest}
        addGuest={addGuest}
        t={t}
        evType={ev&&ev.type}
      />
      <QRModal
        open={showQR}
        onClose={function(){ setShowQR(false); }}
        eventId={ev.id}
      />
      {editGuest && (
        <GuestEditModal
          guest={editGuest}
          onClose={function(){ setEditGuest(null); }}
          onSave={saveGuest}
          onDelete={deleteGuest}
          tables={tables}
          evType={ev&&ev.type}
        />
      )}

      {showInvite && (
        <InviteModal
          open={showInvite}
          onClose={function(){ setShowInvite(false); }}
          ev={ev}
          user={null}
        />
      )}
    </div>
  );
}
