/* eslint-disable */
import { useState } from "react";

var BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://tableplan-seven.vercel.app";

var DEFAULT_SUBJECT = function(evName) { return "Invitation — " + (evName || "Mon événement"); };

var DEFAULT_MESSAGE = function(evName, evDate) {
  return "Bonjour {{prenom}},\n\nVous êtes cordialement invité(e) à " + (evName||"notre événement") + (evDate ? " le " + evDate : "") + ".\n\nMerci de confirmer votre présence en cliquant sur le lien ci-dessous :\n{{lien_rsvp}}\n\nÀ très bientôt !";
};

function buildRsvpLink(ev, contact) {
  var userId  = ev && ev.ownerId ? ev.ownerId : "";
  var eventId = ev && ev.id      ? ev.id      : "";
  var base    = BASE_URL + "/join/" + userId + "___" + eventId;
  var params  = "?name=" + encodeURIComponent(contact.name || "");
  if (contact.email) params += "&email=" + encodeURIComponent(contact.email);
  return base + params;
}

function buildMessage(template, contact, ev) {
  var prenom   = (contact.name || "").split(" ")[0] || contact.name || "";
  var rsvpLink = buildRsvpLink(ev, contact);
  return template
    .replace(/{{prenom}}/g,    prenom)
    .replace(/{{nom}}/g,       contact.name || "")
    .replace(/{{evenement}}/g, ev && ev.name ? ev.name : "l'événement")
    .replace(/{{date}}/g,      ev && ev.date ? ev.date : "")
    .replace(/{{lien_rsvp}}/g, rsvpLink);
}

function buildMailto(contact, subject, body) {
  return "mailto:" + encodeURIComponent(contact.email)
    + "?subject=" + encodeURIComponent(subject)
    + "&body="    + encodeURIComponent(body);
}

function parseContacts(text, existingGuests) {
  var lines   = text.trim().split("\n").filter(function(l){ return l.trim(); });
  var results = [];
  var emails  = new Set(existingGuests.map(function(g){ return (g.email||"").toLowerCase(); }));
  lines.forEach(function(line) {
    var parts = line.split(/[,;\t]/).map(function(p){ return p.trim().replace(/^["']|["']$/g, ""); });
    var name  = "";
    var email = "";
    var phone = "";
    parts.forEach(function(p) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p)) { email = p; }
      else if (/^\+?[\d\s\-().]{7,20}$/.test(p)) { phone = p; }
      else if (p.length > 1)                       { name  = p; }
    });
    if (!name && email) name = email.split("@")[0];
    if (email || phone) {
      var isDup = email && emails.has(email.toLowerCase());
      results.push({ name, email, phone, duplicate: isDup });
      if (email) emails.add(email.toLowerCase());
    }
  });
  return results;
}

export default function InviteModal({ open, onClose, ev, user }) {
  var [tab,      setTab]      = useState("compose");
  var [subject,  setSubject]  = useState(DEFAULT_SUBJECT(ev && ev.name));
  var [message,  setMessage]  = useState(DEFAULT_MESSAGE(ev && ev.name, ev && ev.date));
  var [rawText,  setRawText]  = useState("");
  var [parsed,   setParsed]   = useState([]);
  var [sent,     setSent]     = useState([]);
  var [copied,   setCopied]   = useState(null);

  if (!open) return null;

  var guests     = ev && ev.guests ? ev.guests : [];
  var withEmail  = guests.filter(function(g){ return g.email; });

  // ── Analyser les contacts collés ──
  function handleParse() {
    var results = parseContacts(rawText, guests);
    setParsed(results);
    if (results.length > 0) setTab("send");
  }

  // ── Utiliser les invités existants ──
  function useExistingGuests() {
    var results = withEmail.map(function(g) {
      return { name: g.name, email: g.email, phone: g.phone||"", duplicate: false };
    });
    setParsed(results);
    setTab("send");
  }

  // ── Copier le lien RSVP ──
  function copyLink(contact, idx) {
    var link = buildRsvpLink(ev, contact);
    if (navigator.clipboard) navigator.clipboard.writeText(link);
    setCopied(idx);
    setTimeout(function(){ setCopied(null); }, 2000);
  }

  // ── Ouvrir mailto pour un contact ──
  function openMailto(contact) {
    var body = buildMessage(message, contact, ev);
    var href = buildMailto(contact, subject, body);
    window.open(href);
    setSent(function(prev){ return prev.includes(contact.email) ? prev : [...prev, contact.email]; });
  }

  // ── Ouvrir mailto pour tous (groupé — 1 email par destinataire) ──
  function openAllMailto() {
    var toSend = parsed.filter(function(c){ return c.email && !c.duplicate; });
    toSend.forEach(function(contact, i) {
      setTimeout(function() {
        openMailto(contact);
      }, i * 400);
    });
  }

  // Aperçu du message avec Alice en exemple
  var preview = message
    .replace(/{{prenom}}/g,    "Alice")
    .replace(/{{nom}}/g,       "Alice Martin")
    .replace(/{{evenement}}/g, ev && ev.name ? ev.name : "Mon événement")
    .replace(/{{date}}/g,      ev && ev.date ? ev.date : "01/06/2026")
    .replace(/{{lien_rsvp}}/g, BASE_URL + "/join/userId___eventId?name=Alice%20Martin");

  var toSend     = parsed.filter(function(c){ return c.email && !c.duplicate; });
  var duplicates = parsed.filter(function(c){ return c.duplicate; });

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"Georgia,serif" }}>
      <div style={{ width:"100%", maxWidth:640, maxHeight:"92vh", overflow:"auto", background:"#18182a", borderRadius:20, border:"1px solid rgba(201,151,58,0.2)" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 0" }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#fff" }}>💌 Envoyer des invitations</h2>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{ev && ev.name}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", padding:"12px 24px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          {[
            { id:"compose", label:"✏️ Message" },
            { id:"import",  label:"📋 Contacts" },
            { id:"send",    label:"🚀 Envoyer" + (parsed.length>0 ? " ("+parsed.length+")" : "") },
          ].map(function(t) {
            var active = tab === t.id;
            return (
              <button key={t.id} onClick={function(){ setTab(t.id); }} style={{
                padding:"8px 18px", background:"none", border:"none", cursor:"pointer",
                color: active?"#F0C97A":"rgba(255,255,255,0.4)",
                fontSize:12, fontFamily:"inherit", fontWeight:active?700:400,
                borderBottom: active?"2px solid #C9973A":"2px solid transparent",
              }}>{t.label}</button>
            );
          })}
        </div>

        <div style={{ padding:"20px 24px 28px" }}>

          {/* ══ COMPOSE ══ */}
          {tab === "compose" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:6 }}>OBJET DU MAIL</label>
                <input value={subject} onChange={function(e){ setSubject(e.target.value); }}
                  style={{ width:"100%", boxSizing:"border-box", padding:"10px 14px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:13, fontFamily:"inherit", outline:"none" }}
                />
              </div>
              <div>
                <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:4 }}>CORPS DU MESSAGE</label>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:8, lineHeight:1.6 }}>
                  Variables : <span style={{color:"#F0C97A"}}>{"{{prenom}}"}</span> <span style={{color:"#F0C97A"}}>{"{{nom}}"}</span> <span style={{color:"#F0C97A"}}>{"{{evenement}}"}</span> <span style={{color:"#F0C97A"}}>{"{{date}}"}</span> <span style={{color:"#F0C97A"}}>{"{{lien_rsvp}}"}</span>
                </div>
                <textarea value={message} onChange={function(e){ setMessage(e.target.value); }}
                  rows={9}
                  style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical", lineHeight:1.7 }}
                />
              </div>
              {/* Aperçu */}
              <div style={{ background:"rgba(201,151,58,0.05)", border:"1px solid rgba(201,151,58,0.12)", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:10, color:"rgba(201,151,58,0.6)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Aperçu</div>
                <pre style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.8, margin:0, whiteSpace:"pre-wrap", fontFamily:"inherit" }}>{preview}</pre>
              </div>
              <button onClick={function(){ setTab("import"); }} style={{ padding:"11px", background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:10, color:"#0d0d14", cursor:"pointer", fontWeight:800, fontSize:13, fontFamily:"inherit" }}>
                Continuer → Ajouter des contacts
              </button>
            </div>
          )}

          {/* ══ IMPORT CONTACTS ══ */}
          {tab === "import" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Invités existants avec email */}
              {withEmail.length > 0 && (
                <div style={{ background:"rgba(39,174,96,0.06)", border:"1px solid rgba(39,174,96,0.2)", borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#27AE60", marginBottom:8 }}>
                    ✅ {withEmail.length} invité{withEmail.length>1?"s":""} ont déjà un email dans cet événement
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginBottom:10 }}>
                    {withEmail.slice(0,4).map(function(g){ return g.name; }).join(", ")}
                    {withEmail.length > 4 ? " +" + (withEmail.length-4) + " autres" : ""}
                  </div>
                  <button onClick={useExistingGuests} style={{ padding:"7px 14px", background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", borderRadius:8, color:"#27AE60", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700 }}>
                    Utiliser ces invités →
                  </button>
                </div>
              )}

              {/* Ou coller des contacts */}
              <div>
                <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:6 }}>
                  OU COLLER UNE LISTE DE CONTACTS
                </label>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:8, lineHeight:1.7 }}>
                  Un contact par ligne, format libre :<br/>
                  <span style={{color:"rgba(255,255,255,0.5)"}}>Alice Martin, alice@mail.fr</span><br/>
                  <span style={{color:"rgba(255,255,255,0.5)"}}>bob@mail.fr</span><br/>
                  <span style={{color:"rgba(255,255,255,0.5)"}}>Claire Simon, +33612345678, claire@mail.fr</span>
                </div>
                <textarea value={rawText} onChange={function(e){ setRawText(e.target.value); setParsed([]); }}
                  rows={7} placeholder={"Alice Martin, alice@mail.fr\nBob Dupont, bob@mail.fr\n+33612345678, claire@mail.fr"}
                  style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"monospace", outline:"none", resize:"vertical" }}
                />
              </div>
              <button onClick={handleParse} disabled={!rawText.trim()}
                style={{ padding:"11px", background:rawText.trim()?"linear-gradient(135deg,#C9973A,#F0C97A)":"rgba(255,255,255,0.08)", border:"none", borderRadius:10, color:rawText.trim()?"#0d0d14":"rgba(255,255,255,0.3)", cursor:rawText.trim()?"pointer":"not-allowed", fontWeight:800, fontSize:13, fontFamily:"inherit" }}>
                Analyser {rawText.trim().split("\n").filter(function(l){return l.trim();}).length} lignes →
              </button>
            </div>
          )}

          {/* ══ ENVOYER ══ */}
          {tab === "send" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Comment ça marche */}
              <div style={{ background:"rgba(201,151,58,0.07)", border:"1px solid rgba(201,151,58,0.15)", borderRadius:10, padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>
                <b style={{color:"#F0C97A"}}>Comment ça fonctionne :</b><br/>
                Chaque clic ouvre votre application mail (Gmail, Outlook…) avec le message pré-rempli. Vous n'avez qu'à cliquer "Envoyer" depuis votre propre boite mail.
              </div>

              {/* Stats */}
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ flex:1, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"12px", textAlign:"center", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize:22, fontWeight:800, color:"#F0C97A" }}>{toSend.length}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:3 }}>À envoyer</div>
                </div>
                <div style={{ flex:1, background:"rgba(39,174,96,0.08)", borderRadius:10, padding:"12px", textAlign:"center", border:"1px solid rgba(39,174,96,0.2)" }}>
                  <div style={{ fontSize:22, fontWeight:800, color:"#27AE60" }}>{sent.length}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:3 }}>Ouverts</div>
                </div>
                {duplicates.length > 0 && (
                  <div style={{ flex:1, background:"rgba(232,132,90,0.08)", borderRadius:10, padding:"12px", textAlign:"center", border:"1px solid rgba(232,132,90,0.2)" }}>
                    <div style={{ fontSize:22, fontWeight:800, color:"#E8845A" }}>{duplicates.length}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:3 }}>Doublons ignorés</div>
                  </div>
                )}
              </div>

              {/* Bouton tout ouvrir */}
              {toSend.length > 1 && (
                <button onClick={openAllMailto} style={{ padding:"12px", background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:10, color:"#0d0d14", cursor:"pointer", fontWeight:800, fontSize:13, fontFamily:"inherit" }}>
                  📨 Ouvrir les {toSend.length} mails dans mon application mail
                </button>
              )}

              {/* Liste des contacts */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {parsed.map(function(c, i) {
                  var isSent = sent.includes(c.email);
                  return (
                    <div key={i} style={{ background:c.duplicate?"rgba(232,132,90,0.05)":"rgba(255,255,255,0.03)", border:"1px solid "+(c.duplicate?"rgba(232,132,90,0.15)":"rgba(255,255,255,0.06)"), borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
                      {/* Avatar */}
                      <div style={{ width:32, height:32, borderRadius:8, background:"rgba(201,151,58,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"#C9973A", fontWeight:800, fontSize:13, flexShrink:0 }}>
                        {(c.name||c.email||"?")[0].toUpperCase()}
                      </div>
                      {/* Infos */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:13, color:c.duplicate?"rgba(255,255,255,0.35)":"#fff" }}>{c.name || "—"}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:1 }}>
                          {c.email && <span style={{marginRight:8}}>✉ {c.email}</span>}
                          {c.phone && <span>📱 {c.phone}</span>}
                          {c.duplicate && <span style={{color:"#E8845A"}}> · doublon ignoré</span>}
                        </div>
                      </div>
                      {/* Actions */}
                      {!c.duplicate && (
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          {/* Copier lien RSVP */}
                          <button onClick={function(){ copyLink(c, i); }} style={{ padding:"5px 10px", background:copied===i?"rgba(39,174,96,0.15)":"rgba(255,255,255,0.05)", border:"1px solid "+(copied===i?"rgba(39,174,96,0.3)":"rgba(255,255,255,0.1)"), borderRadius:6, color:copied===i?"#27AE60":"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                            {copied===i ? "✅ Copié" : "🔗 Lien"}
                          </button>
                          {/* Ouvrir mail */}
                          {c.email && (
                            <button onClick={function(){ openMailto(c); }} style={{ padding:"5px 12px", background:isSent?"rgba(39,174,96,0.12)":"rgba(201,151,58,0.12)", border:"1px solid "+(isSent?"rgba(39,174,96,0.3)":"rgba(201,151,58,0.3)"), borderRadius:6, color:isSent?"#27AE60":"#F0C97A", cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:700 }}>
                              {isSent ? "✅ Ouvert" : "📨 Envoyer"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {parsed.length === 0 && (
                <div style={{ textAlign:"center", padding:"30px 20px", color:"rgba(255,255,255,0.25)" }}>
                  <div style={{fontSize:32,marginBottom:8}}>📋</div>
                  <div style={{fontSize:13}}>Aucun contact — revenez à l'onglet Contacts</div>
                  <button onClick={function(){ setTab("import"); }} style={{ marginTop:12, padding:"8px 16px", background:"rgba(201,151,58,0.1)", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, color:"#F0C97A", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                    ← Ajouter des contacts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
