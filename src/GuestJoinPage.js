/* eslint-disable */
import { useState, useEffect } from "react";
import { C, useI18n } from "../theme";
import { Btn, Badge } from "./UI";
import { DIET_OPTIONS, THEMES_CONFIG } from "../constants";
import { dietInfo } from "../utils";

// ═══════════════════════════════════════════════════════════════
// GUEST JOIN PAGE — Page publique invité
// ═══════════════════════════════════════════════════════════════

function GuestJoinPage({ eventId }) {
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("view"); // view | rsvp | done
  const [form, setForm] = useState({ name:"", diet:"standard", allergies:[], notes:"" });
  const [found, setFound] = useState(null);

  useEffect(() => {
    // Charger l'événement public depuis Firestore
    async function loadEvent() {
      const fb = getFirebase();
      if (!fb) { setLoading(false); return; }
      try {
        // Format du join ID: "userId___eventId" ou juste "eventId"
        if (eventId.includes("___")) {
          // Nouveau format avec userId
          var parts = eventId.split("___");
          var userId = parts[0];
          var evId = parts[1];
          var doc = await fb.db.collection("users").doc(userId).collection("events").doc(evId).get();
          if (doc.exists) setEv(doc.data());
        } else {
          // Ancien format: collectionGroup (peut échouer si règles restrictives)
          try {
            var snap = await fb.db.collectionGroup("events").where("id","==",eventId).limit(1).get();
            if (!snap.empty) setEv(snap.docs[0].data());
          } catch(e2) {
            console.log("collectionGroup non disponible, essai lecture directe...");
          }
        }
      } catch(e) {
        console.error("Erreur chargement event public:", e);
      }
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#C9973A", fontSize:18 }}>🪑 Chargement…</div>
    </div>
  );

  if (!ev) return (
    <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", padding:20, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
      <h2 style={{ color:"#C9973A", fontWeight:400 }}>Événement introuvable</h2>
      <p style={{ color:"#8A7355", marginBottom:8 }}>Le lien est peut-être expiré ou invalide.</p>
      <p style={{ color:"#5a3a1a", fontSize:12 }}>Demandez à l'organisateur de partager le lien via le bouton "🔗 Partager" de l'application.</p>
      <a href="/" style={{ marginTop:24, color:"#C9973A", fontSize:14 }}>← Retour à TableMaître</a>
    </div>
  );

  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const myTable = found ? ev.tables?.find(t => t.id === found.tableId) : null;
  const seatedCount = (ev.guests||[]).filter(g => g.tableId).length;
  const totalGuests = (ev.guests||[]).length;

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, #120C08, #1a0e06)`, fontFamily:"Georgia,'Palatino Linotype',serif", padding:"20px 16px" }}>
      {/* Header */}
      <div style={{ maxWidth:480, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{theme.icon}</div>
          <h1 style={{ fontSize:28, fontWeight:400, color:"#C9973A", letterSpacing:2, margin:"0 0 8px" }}>{ev.name}</h1>
          <p style={{ color:"#8A7355", fontSize:14 }}>
            📅 {new Date(ev.date).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
          {ev.notes && <p style={{ color:"#A89060", fontSize:13, fontStyle:"italic", marginTop:8 }}>{ev.notes}</p>}
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:28 }}>
          {[
            { label:"Tables", val:ev.tables?.length||0, icon:"🪑" },
            { label:"Invités", val:totalGuests, icon:"👥" },
            { label:"Placés", val:seatedCount, icon:"✅" },
          ].map(s => (
            <div key={s.label} style={{ background:"#1E1208", border:"1px solid #3a2a1a", borderRadius:12, padding:"12px 20px", textAlign:"center", flex:1 }}>
              <div style={{ fontSize:20 }}>{s.icon}</div>
              <div style={{ color:"#C9973A", fontSize:20, fontWeight:700 }}>{s.val}</div>
              <div style={{ color:"#8A7355", fontSize:11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Rechercher sa place */}
        <div style={{ background:"#1E1208", border:"1px solid #3a2a1a", borderRadius:16, padding:24, marginBottom:20 }}>
          <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:16, marginBottom:16 }}>🔍 Trouver ma place</h3>
          <input
            placeholder="Votre prénom ou nom…"
            onChange={e => {
              const q = e.target.value.toLowerCase();
              if (!q) { setFound(null); return; }
              const match = (ev.guests||[]).find(g => g.name.toLowerCase().includes(q));
              setFound(match || false);
            }}
            style={{ width:"100%", padding:"12px 16px", background:"#2a1a0e", border:"1px solid #5a3a1a", borderRadius:10, color:"#F5EAD4", fontSize:15, fontFamily:"Georgia,serif", boxSizing:"border-box", outline:"none" }}
          />

          {found === false && (
            <div style={{ marginTop:12, color:"#E8845A", fontSize:13 }}>
              ❌ Prénom non trouvé dans la liste des invités
            </div>
          )}

          {found && (
            <div style={{ marginTop:16, background:"#0a2a0a", border:"1px solid #2a5a2a", borderRadius:12, padding:16 }}>
              <p style={{ color:"#81C784", fontWeight:700, fontSize:16, margin:"0 0 8px" }}>
                ✅ Bonjour {found.name}{found.role && found.role === "temoin" ? " 🎖 (Témoin)" : found.role === "marie1" || found.role === "marie2" ? " 💍 (Marié(e))" : ""} !
              </p>
              {myTable ? (
                <div>
                  <p style={{ color:"#A5D6A7", margin:"0 0 4px" }}>
                    Vous êtes à la <strong style={{ color:"#C9973A" }}>Table {myTable.number}{myTable.label ? ` — ${myTable.label}` : ""}</strong>
                  </p>
                  <p style={{ color:"#6a8a6a", fontSize:12, marginBottom:12 }}>
                    {(ev.guests||[]).filter(function(g){ return g.tableId === myTable.id; }).length} personnes à cette table
                  </p>
                </div>
              ) : (
                <p style={{ color:"#E8845A", fontSize:14, marginBottom:12 }}>Votre placement n'est pas encore défini</p>
              )}

              {/* Formulaire régime alimentaire */}
              <div style={{ borderTop:"1px solid #2a5a2a", paddingTop:12, marginTop:4 }}>
                <p style={{ color:"#A5D6A7", fontSize:13, marginBottom:8 }}>🍽 Votre régime alimentaire</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                  {["standard","vegetarien","vegan","sans-gluten","halal","casher","sans-lactose"].map(function(dietId){
                    var icons = {"standard":"🍽","vegetarien":"🥗","vegan":"🌱","sans-gluten":"🌾","halal":"☪️","casher":"✡️","sans-lactose":"🥛"};
                    var labels = {"standard":"Standard","vegetarien":"Végétarien","vegan":"Vegan","sans-gluten":"Sans gluten","halal":"Halal","casher":"Casher","sans-lactose":"Sans lactose"};
                    var isSelected = found.diet === dietId;
                    return (
                      <button key={dietId}
                        onClick={function(){
                          // Mettre à jour le state local immédiatement
                          var updatedGuests = (ev.guests||[]).map(function(g){ return g.id===found.id ? {...g, diet:dietId} : g; });
                          setEv(function(prev){ return {...prev, guests: updatedGuests}; });
                          setFound(function(prev){ return {...prev, diet: dietId}; });
                          // Sauvegarder dans Firestore
                          var fb = getFirebase();
                          if (fb && ev._ownerId && ev.id) {
                            fb.db.collection("users").doc(ev._ownerId).collection("events").doc(String(ev.id)).update({
                              guests: updatedGuests
                            }).catch(function(e){ console.error("Firestore write:", e); });
                          }
                        }}
                        style={{ background:isSelected?"#C9973A22":"#1a2a1a", border:"1px solid "+(isSelected?"#C9973A":"#2a5a2a"), borderRadius:99, padding:"6px 14px", cursor:"pointer", color:isSelected?"#C9973A":"#A5D6A7", fontSize:12, fontFamily:"Georgia,serif" }}
                      >{icons[dietId]} {labels[dietId]}</button>
                    );
                  })}
                </div>
                <textarea
                  placeholder="Notes spéciales (allergie sévère, handicap, siège bébé...)"
                  defaultValue={found.notes||""}
                  rows={2}
                  style={{ width:"100%", padding:"8px 12px", background:"#1a2a1a", border:"1px solid #2a5a2a", borderRadius:8, color:"#A5D6A7", fontSize:12, fontFamily:"Georgia,serif", resize:"vertical", boxSizing:"border-box" }}
                  onChange={function(e){
                    var notes = e.target.value;
                    setFound(function(prev){ return {...prev, notes: notes}; });
                  }}
                  onBlur={function(e){
                    var notes = e.target.value;
                    var updatedGuests = (ev.guests||[]).map(function(g){ return g.id===found.id ? {...g, notes:notes} : g; });
                    setEv(function(prev){ return {...prev, guests: updatedGuests}; });
                    var fb = getFirebase();
                    if (fb && ev._ownerId && ev.id) {
                      fb.db.collection("users").doc(ev._ownerId).collection("events").doc(String(ev.id)).update({
                        guests: updatedGuests
                      }).then(function(){ 
                        // Afficher confirmation
                      }).catch(function(e){ console.error("Firestore write:", e); });
                    }
                  }}
                />
                <p style={{ color:"#4a7a4a", fontSize:11, marginTop:6 }}>
                  {found.diet && found.diet !== "standard" ? "✅ Régime enregistré — " : ""}
                  Vos préférences seront transmises à l'organisateur
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plan par tables */}
        {(ev.tables||[]).length > 0 && (
          <div style={{ background:"#1E1208", border:"1px solid #3a2a1a", borderRadius:16, padding:24 }}>
            <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:16, marginBottom:16 }}>🪑 Plan de table</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(ev.tables||[]).map(tbl => {
                const tGuests = (ev.guests||[]).filter(g => g.tableId === tbl.id);
                return (
                  <div key={tbl.id} style={{ background:"#2a1a0e", borderRadius:10, overflow:"hidden", border:`1px solid ${tbl.color||"#5a3a1a"}44` }}>
                    <div style={{ background:(tbl.color||"#C9973A")+"22", padding:"8px 16px", display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:tbl.color||"#C9973A", fontWeight:700, fontSize:14 }}>
                        Table {tbl.number}{tbl.label ? ` — ${tbl.label}` : ""}
                      </span>
                      <span style={{ color:"#8A7355", fontSize:12 }}>{tGuests.length}/{tbl.capacity}</span>
                    </div>
                    <div style={{ padding:"8px 16px", display:"flex", flexWrap:"wrap", gap:6 }}>
                      {tGuests.length === 0 ? (
                        <span style={{ color:"#5a3a1a", fontSize:12, fontStyle:"italic" }}>— Vide —</span>
                      ) : tGuests.map(g => (
                        <span key={g.id} style={{
                          background: found && found.id === g.id ? "#C9973A22" : "#3a2a1a",
                          border: `1px solid ${found && found.id === g.id ? "#C9973A" : "#5a3a1a"}`,
                          borderRadius:99, padding:"3px 10px", fontSize:12,
                          color: found && found.id === g.id ? "#C9973A" : "#A89060",
                          fontWeight: found && found.id === g.id ? 700 : 400,
                        }}>{g.name}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", color:"#5a3a1a", fontSize:11, marginTop:24 }}>
          Propulsé par TableMaître 🪑
        </p>
      </div>
    </div>
  );
}



export default GuestJoinPage;
