/* eslint-disable */
import { useState, useRef, useEffect } from "react";
import { C } from "../../constants";

// ─────────────────────────────────────────────────────────────
// AI ASSISTANT — Widget flottant dans l'EventEditor
// Utilise l'API Anthropic via claude-sonnet-4-20250514
// ─────────────────────────────────────────────────────────────

var SYSTEM_PROMPT = function(ev) {
  var guests  = ev.guests  || [];
  var tables  = ev.tables  || [];
  var seated  = guests.filter(function(g){ return g.tableId; }).length;
  var constraints = ev.constraints || [];

  var tablesSummary = tables.map(function(t) {
    var tGuests = guests.filter(function(g){ return g.tableId === t.id; });
    return "Table " + t.number + " (" + tGuests.length + "/" + t.capacity + " places, " + t.shape + ")" +
      (tGuests.length ? " : " + tGuests.map(function(g){ return g.name; }).join(", ") : " : vide");
  }).join("\n");

  var guestsSummary = guests.map(function(g) {
    var tbl = tables.find(function(t){ return t.id === g.tableId; });
    return "- " + g.name +
      (g.rsvp ? " [RSVP: " + g.rsvp + "]" : "") +
      (g.diet && g.diet !== "standard" ? " [régime: " + g.diet + "]" : "") +
      (tbl ? " → Table " + tbl.number : " → non placé") +
      (g.notes ? " (notes: " + g.notes + ")" : "");
  }).join("\n");

  var constraintsSummary = constraints.length
    ? constraints.map(function(c) {
        var gA = guests.find(function(g){ return g.id === c.guestA; });
        var gB = guests.find(function(g){ return g.id === c.guestB; });
        return "- " + (c.type === "apart" ? "SÉPARER" : "ENSEMBLE") + " : " +
          (gA ? gA.name : "?") + " & " + (gB ? gB.name : "?") +
          (c.note ? " (" + c.note + ")" : "");
      }).join("\n")
    : "Aucune contrainte définie";

  return "Tu es l'assistant IA de TableMaître, un logiciel de gestion de plan de salle pour événements.\n\n" +
    "Tu aides l'organisateur à optimiser le placement des invités, suggérer des améliorations, " +
    "détecter des conflits, et répondre aux questions sur son événement.\n\n" +
    "=== ÉVÉNEMENT : " + ev.name + " ===\n" +
    "Date : " + (ev.date || "non définie") + "\n" +
    "Type : " + (ev.type || "non défini") + "\n\n" +
    "=== TABLES (" + tables.length + ") ===\n" + (tablesSummary || "Aucune table") + "\n\n" +
    "=== INVITÉS (" + guests.length + " dont " + seated + " placés) ===\n" + (guestsSummary || "Aucun invité") + "\n\n" +
    "=== CONTRAINTES ===\n" + constraintsSummary + "\n\n" +
    "Réponds de façon concise et pratique. Utilise des emojis pour rendre tes réponses plus lisibles. " +
    "Quand tu proposes un placement, sois précis (ex: 'Mets Alice et Bob ensemble à la Table 2'). " +
    "Réponds toujours en français.";
};

var SUGGESTIONS = [
  "Quels invités ne sont pas encore placés ?",
  "Y a-t-il des conflits dans le placement actuel ?",
  "Comment optimiser le placement par régime alimentaire ?",
  "Quelles tables ont encore des places libres ?",
  "Suggère un placement pour les invités non placés",
];

export default function AiAssistant({ ev, open, onClose }) {
  var [messages,  setMessages]  = useState([]);
  var [input,     setInput]     = useState("");
  var [loading,   setLoading]   = useState(false);
  var [showSugg,  setShowSugg]  = useState(true);
  var messagesEndRef = useRef(null);
  var inputRef       = useRef(null);

  useEffect(function() {
    if (open && messages.length === 0) {
      // Message de bienvenue automatique
      var guests  = (ev.guests  || []).length;
      var tables  = (ev.tables  || []).length;
      var seated  = (ev.guests  || []).filter(function(g){ return g.tableId; }).length;
      var unseat  = guests - seated;
      var welcome = "Bonjour ! Je suis votre assistant IA pour **" + ev.name + "**. 🎉\n\n" +
        "Voici un résumé rapide :\n" +
        "• **" + tables + "** table" + (tables>1?"s":"") + " configurée" + (tables>1?"s":"") + "\n" +
        "• **" + guests + "** invité" + (guests>1?"s":"") + " au total\n" +
        "• **" + seated + "** placé" + (seated>1?"s":"") + (unseat>0 ? " · **⚠ " + unseat + "** non placé" + (unseat>1?"s":"") : " · ✅ tous placés") + "\n\n" +
        "Comment puis-je vous aider ?";
      setMessages([{ role:"assistant", content:welcome }]);
    }
    if (open && inputRef.current) {
      setTimeout(function(){ inputRef.current && inputRef.current.focus(); }, 100);
    }
  }, [open]);

  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior:"smooth" });
    }
  }, [messages]);

  async function sendMessage(text) {
    var userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    setShowSugg(false);
    setLoading(true);

    var newMessages = [...messages, { role:"user", content:userMsg }];
    setMessages(newMessages);

    try {
      var response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT(ev),
          messages: newMessages.map(function(m) {
            return { role: m.role, content: m.content };
          }),
        }),
      });

      var data = await response.json();
      var reply = data.content && data.content[0] && data.content[0].text
        ? data.content[0].text
        : "Désolé, je n'ai pas pu générer une réponse.";

      setMessages(function(prev){ return [...prev, { role:"assistant", content:reply }]; });
    } catch(e) {
      setMessages(function(prev){ return [...prev, { role:"assistant", content:"❌ Erreur de connexion à l'IA. Vérifiez votre connexion internet." }]; });
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
    setShowSugg(true);
    setTimeout(function() {
      var guests  = (ev.guests  || []).length;
      var tables  = (ev.tables  || []).length;
      var seated  = (ev.guests  || []).filter(function(g){ return g.tableId; }).length;
      var unseat  = guests - seated;
      var welcome = "Chat réinitialisé ! 🔄\n\n" +
        "• **" + tables + "** table" + (tables>1?"s":"") + "\n" +
        "• **" + guests + "** invité" + (guests>1?"s":"") +
        (unseat > 0 ? " · ⚠ **" + unseat + "** non placé" + (unseat>1?"s":"") : " · ✅ tous placés") + "\n\nComment puis-je vous aider ?";
      setMessages([{ role:"assistant", content:welcome }]);
    }, 50);
  }

  // Rendu du texte markdown simplifié (bold + listes)
  function renderText(text) {
    var lines = text.split("\n");
    return lines.map(function(line, i) {
      // Bold **text**
      var parts = line.split(/\*\*([^*]+)\*\*/g);
      var rendered = parts.map(function(part, j) {
        return j % 2 === 1
          ? <strong key={j} style={{color:"#F0C97A"}}>{part}</strong>
          : part;
      });
      return <div key={i} style={{minHeight:line ? "auto" : "8px"}}>{rendered}</div>;
    });
  }

  if (!open) return null;

  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:9998,
      width:380, height:560, maxHeight:"85vh",
      background:"#18182a", border:"1px solid rgba(201,151,58,0.25)",
      borderRadius:20, display:"flex", flexDirection:"column",
      boxShadow:"0 20px 60px rgba(0,0,0,0.7)", fontFamily:"Georgia,serif",
      animation:"slideUp .25s ease",
    }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <div style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#C9973A,#F0C97A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
          🤖
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:13, color:"#fff" }}>Assistant IA</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Optimisation de placement</div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          <button onClick={clearChat} title="Nouveau chat" style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:14, padding:"4px 8px" }}>↺</button>
          <button onClick={onClose} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:14, padding:"4px 8px" }}>✕</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
        {messages.map(function(msg, i) {
          var isUser = msg.role === "user";
          return (
            <div key={i} style={{ display:"flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth:"85%", padding:"10px 14px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: isUser ? "linear-gradient(135deg,#C9973A,#F0C97A)" : "#13131e",
                color: isUser ? "#0d0d14" : "rgba(255,255,255,0.85)",
                fontSize:12, lineHeight:1.6,
                border: isUser ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}>
                {isUser ? msg.content : renderText(msg.content)}
              </div>
            </div>
          );
        })}

        {/* Loading */}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start" }}>
            <div style={{ background:"#13131e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px 16px 16px 4px", padding:"10px 14px", display:"flex", gap:4, alignItems:"center" }}>
              {[0,1,2].map(function(j) {
                return <div key={j} style={{ width:6, height:6, borderRadius:"50%", background:"#C9973A", animation:"bounce 1.2s "+j*0.2+"s infinite" }}/>;
              })}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSugg && messages.length <= 1 && !loading && (
          <div style={{ marginTop:8 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Suggestions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {SUGGESTIONS.map(function(s, i) {
                return (
                  <button key={i} onClick={function(){ sendMessage(s); }} style={{
                    background:"rgba(201,151,58,0.06)", border:"1px solid rgba(201,151,58,0.15)",
                    borderRadius:10, padding:"8px 12px", color:"rgba(255,255,255,0.6)",
                    cursor:"pointer", fontSize:11, fontFamily:"inherit", textAlign:"left",
                    transition:"all .15s",
                  }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef}/>
      </div>

      {/* Input */}
      <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={function(e){ setInput(e.target.value); }}
            onKeyDown={handleKey}
            placeholder="Posez une question sur votre événement…"
            rows={1}
            style={{
              flex:1, padding:"9px 12px", background:"#13131e",
              border:"1px solid rgba(201,151,58,0.2)", borderRadius:10,
              color:"#fff", fontSize:12, fontFamily:"inherit",
              outline:"none", resize:"none", lineHeight:1.5,
              maxHeight:80, overflowY:"auto",
            }}
          />
          <button onClick={function(){ sendMessage(); }} disabled={!input.trim() || loading} style={{
            width:36, height:36, borderRadius:10, border:"none", flexShrink:0,
            background: input.trim() && !loading ? "linear-gradient(135deg,#C9973A,#F0C97A)" : "rgba(255,255,255,0.08)",
            color: input.trim() && !loading ? "#0d0d14" : "rgba(255,255,255,0.2)",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
          }}>➤</button>
        </div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.2)", textAlign:"center", marginTop:6 }}>
          Entrée pour envoyer · Shift+Entrée pour saut de ligne
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,80%,100% { transform:scale(0.7); opacity:.5; } 40% { transform:scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}
