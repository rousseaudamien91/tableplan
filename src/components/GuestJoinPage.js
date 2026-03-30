/* eslint-disable */
import { getFirebase } from "../firebase";
import { useState, useEffect } from "react";
import { useI18n } from "../i18n";
import { C, DIET_OPTIONS, THEMES_CONFIG } from "../constants";
import { Btn, Badge } from "./UI";
import { dietInfo } from "../utils";

function GuestJoinPage({ eventId }) {
  const { t, lang } = useI18n();

  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("view");
  const [form, setForm] = useState({ name:"", diet:"standard", allergies:[], notes:"" });
  const [found, setFound] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      const fb = getFirebase();
      if (!fb) { setLoading(false); return; }

      try {
        if (eventId.includes("___")) {
          const [userId, evId] = eventId.split("___");
          const doc = await fb.db.collection("users").doc(userId).collection("events").doc(evId).get();
          if (doc.exists) setEv(doc.data());
        } else {
          try {
            const snap = await fb.db.collectionGroup("events").where("id","==",eventId).limit(1).get();
            if (!snap.empty) setEv(snap.docs[0].data());
          } catch(e2) {}
        }
      } catch(e) {
        console.error("Erreur chargement event public:", e);
      }

      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  // ─────────────────────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.dark, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:C.gold, fontSize:18 }}>🪑 {t.loading}</div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // EVENT NOT FOUND
  // ─────────────────────────────────────────────────────────────
  if (!ev) return (
    <div style={{
      minHeight:"100vh", background:C.dark,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"Georgia,serif", padding:20, textAlign:"center"
    }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
      <h2 style={{ color:C.gold, fontWeight:400 }}>{t.eventNotFound}</h2>
      <p style={{ color:C.muted, marginBottom:8 }}>{t.eventNotFoundDesc}</p>
      <p style={{ color:"#5a3a1a", fontSize:12 }}>{t.eventNotFoundHelp}</p>
      <a href="/" style={{ marginTop:24, color:C.gold, fontSize:14 }}>← {t.backHome}</a>
    </div>
  );

  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const myTable = found ? ev.tables?.find(t => t.id === found.tableId) : null;
  const seatedCount = (ev.guests||[]).filter(g => g.tableId).length;
  const totalGuests = (ev.guests||[]).length;

  // ─────────────────────────────────────────────────────────────
  // PAGE
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(135deg, ${C.dark}, #1a0e06)`,
      fontFamily:"Georgia,'Palatino Linotype',serif",
      padding:"20px 16px"
    }}>
      <div style={{ maxWidth:480, margin:"0 auto" }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{theme.icon}</div>
          <h1 style={{ fontSize:28, fontWeight:400, color:C.gold, letterSpacing:2, margin:"0 0 8px" }}>
            {ev.name}
          </h1>
          <p style={{ color:C.muted, fontSize:14 }}>
            📅 {new Date(ev.date).toLocaleDateString(lang, { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
          {ev.notes && (
            <p style={{ color:"#A89060", fontSize:13, fontStyle:"italic", marginTop:8 }}>
              {ev.notes}
            </p>
          )}
        </div>

        {/* STATS */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:28 }}>
          {[
            { label:t.tables, val:ev.tables?.length||0, icon:"🪑" },
            { label:t.guests, val:totalGuests, icon:"👥" },
            { label:t.placed, val:seatedCount, icon:"✅" },
          ].map(s => (
            <div key={s.label} style={{
              background:"#1E1208", border:"1px solid #3a2a1a",
              borderRadius:12, padding:"12px 20px", textAlign:"center", flex:1
            }}>
              <div style={{ fontSize:20 }}>{s.icon}</div>
              <div style={{ color:C.gold, fontSize:20, fontWeight:700 }}>{s.val}</div>
              <div style={{ color:C.muted, fontSize:11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div style={{
          background:"#1E1208", border:"1px solid #3a2a1a",
          borderRadius:16, padding:24, marginBottom:20
        }}>
          <h3 style={{ color:C.gold, fontWeight:400, fontSize:16, marginBottom:16 }}>
            🔍 {t.findMySeat}
          </h3>

          <input
            placeholder={t.searchNamePlaceholder}
            onChange={e => {
              const q = e.target.value.toLowerCase();
              if (!q) { setFound(null); return; }
              const match = (ev.guests||[]).find(g => g.name.toLowerCase().includes(q));
              setFound(match || false);
            }}
            style={{
              width:"100%", padding:"12px 16px",
              background:"#2a1a0e", border:"1px solid #5a3a1a",
              borderRadius:10, color:C.cream, fontSize:15,
              fontFamily:"Georgia,serif"
            }}
          />

          {found === false && (
            <div style={{ marginTop:12, color:"#E8845A", fontSize:13 }}>
              ❌ {t.nameNotFound}
            </div>
          )}

          {found && (
            <div style={{
              marginTop:16, background:"#0a2a0a",
              border:"1px solid #2a5a2a", borderRadius:12, padding:16
            }}>
              <p style={{
                color:"#81C784", fontWeight:700, fontSize:16, margin:"0 0 8px"
              }}>
                {t.hello(found)}
              </p>

              {myTable ? (
                <div>
                  <p style={{ color:"#A5D6A7", margin:"0 0 4px" }}>
                    {t.youAreAtTable(myTable)}
                  </p>
                  <p style={{ color:"#6a8a6a", fontSize:12, marginBottom:12 }}>
                    {(ev.guests||[]).filter(g => g.tableId === myTable.id).length} {t.peopleAtTable}
                  </p>
                </div>
              ) : (
                <p style={{ color:"#E8845A", fontSize:14, marginBottom:12 }}>
                  {t.notPlacedYet}
                </p>
              )}

              {/* DIET FORM */}
              <div style={{ borderTop:"1px solid #2a5a2a", paddingTop:12, marginTop:4 }}>
                <p style={{ color:"#A5D6A7", fontSize:13, marginBottom:8 }}>
                  🍽 {t.yourDiet}
                </p>

                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                  {DIET_OPTIONS.map(d => {
                    const isSelected = found.diet === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => {
                          const updatedGuests = (ev.guests||[]).map(g =>
                            g.id === found.id ? { ...g, diet:d.id } : g
                          );
                          setEv(prev => ({ ...prev, guests: updatedGuests }));
                          setFound(prev => ({ ...prev, diet:d.id }));

                          const fb = getFirebase();
                          if (fb && ev._ownerId && ev.id) {
                            fb.db.collection("users").doc(ev._ownerId)
                              .collection("events").doc(String(ev.id))
                              .update({ guests: updatedGuests })
                              .catch(e => console.error("Firestore write:", e));
                          }
                        }}
                        style={{
                          background:isSelected ? C.gold+"22" : "#1a2a1a",
                          border:"1px solid "+(isSelected ? C.gold : "#2a5a2a"),
                          borderRadius:99, padding:"6px 14px",
                          cursor:"pointer",
                          color:isSelected ? C.gold : "#A5D6A7",
                          fontSize:12, fontFamily:"Georgia,serif"
                        }}
                      >
                        {d.icon} {d.label}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  placeholder={t.notesPlaceholder}
                  defaultValue={found.notes||""}
                  rows={2}
                  style={{
                    width:"100%", padding:"8px 12px",
                    background:"#1a2a1a", border:"1px solid #2a5a2a",
                    borderRadius:8, color:"#A5D6A7",
                    fontSize:12, fontFamily:"Georgia,serif",
                    resize:"vertical"
                  }}
                  onChange={e => {
                    const notes = e.target.value;
                    setFound(prev => ({ ...prev, notes }));
                  }}
                  onBlur={e => {
                    const notes = e.target.value;
                    const updatedGuests = (ev.guests||[]).map(g =>
                      g.id === found.id ? { ...g, notes } : g
                    );
                    setEv(prev => ({ ...prev, guests: updatedGuests }));

                    const fb = getFirebase();
                    if (fb && ev._ownerId && ev.id) {
                      fb.db.collection("users").doc(ev._ownerId)
                        .collection("events").doc(String(ev.id))
                        .update({ guests: updatedGuests })
                        .catch(e => console.error("Firestore write:", e));
                    }
                  }}
                />

                <p style={{ color:"#4a7a4a", fontSize:11, marginTop:6 }}>
                  {found.diet !== "standard" ? "✓ " : ""}
                  {t.preferencesSent}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* TABLE LIST */}
        {(ev.tables||[]).length > 0 && (
          <div style={{
            background:"#1E1208", border:"1px solid #3a2a1a",
            borderRadius:16, padding:24
          }}>
            <h3 style={{ color:C.gold, fontWeight:400, fontSize:16, marginBottom:16 }}>
              🪑 {t.tablePlan}
            </h3>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(ev.tables||[]).map(tbl => {
                const tGuests = (ev.guests||[]).filter(g => g.tableId === tbl.id);
                return (
                  <div key={tbl.id} style={{
                    background:"#2a1a0e", borderRadius:10,
                    overflow:"hidden", border:`1px solid ${(tbl.color||C.gold)+"44"}`
                  }}>
                    <div style={{
                      background:(tbl.color||C.gold)+"22",
                      padding:"8px 16px",
                      display:"flex", justifyContent:"space-between"
                    }}>
                      <span style={{
                        color:tbl.color||C.gold,
                        fontWeight:700, fontSize:14
                      }}>
                        {t.tableLabel(tbl)}
                      </span>
                      <span style={{ color:C.muted, fontSize:12 }}>
                        {tGuests.length}/{tbl.capacity}
                      </span>
                    </div>

                    <div style={{
                      padding:"8px 16px",
                      display:"flex", flexWrap:"wrap", gap:6
                    }}>
                      {tGuests.length === 0 ? (
                        <span style={{
                          color:"#5a3a1a", fontSize:12, fontStyle:"italic"
                        }}>
                          {t.empty}
                        </span>
                      ) : tGuests.map(g => (
                        <span key={g.id} style={{
                          background: found && found.id === g.id ? C.gold+"22" : "#3a2a1a",
                          border:`1px solid ${found && found.id === g.id ? C.gold : "#5a3a1a"}`,
                          borderRadius:99, padding:"3px 10px",
                          fontSize:12,
                          color: found && found.id === g.id ? C.gold : "#A89060",
                          fontWeight: found && found.id === g.id ? 700 : 400
                        }}>
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", color:"#5a3a1a", fontSize:11, marginTop:24 }}>
          {t.poweredBy}
        </p>
      </div>
    </div>
  );
}

export default GuestJoinPage;
