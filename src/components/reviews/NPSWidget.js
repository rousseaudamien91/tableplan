/* eslint-disable */
import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NPSWidget({ user, onClose, t }) {
  const [score, setScore]       = useState(null);
  const [comment, setComment]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  var labels = t && t.npsLabels ? t.npsLabels : ["Pas du tout", "", "", "", "", "", "Neutre", "", "", "", "Certainement"];

  async function submit() {
    if (score === null) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        userId:    user && user.id || "anonymous",
        userName:  user && user.name || "Utilisateur",
        score,
        comment:   comment.trim(),
        createdAt: new Date().toISOString(),
        approved:  false,
      });
      setSubmitted(true);
      var key = user && user.id ? "tm_nps_" + user.id : "tm_nps";
      localStorage.setItem(key, "1");
      setTimeout(onClose, 2500);
    } catch(e) {
      console.error("NPS error:", e);
    }
    setLoading(false);
  }

  if (submitted) return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:1000, background:"#18182a", border:"1px solid rgba(39,174,96,0.4)", borderRadius:16, padding:"20px 24px", maxWidth:320, boxShadow:"0 8px 40px rgba(0,0,0,0.5)", fontFamily:"Inter,sans-serif" }}>
      <div style={{ fontSize:28, marginBottom:8 }}>🙏</div>
      <div style={{ fontWeight:700, color:"#27AE60", fontSize:15 }}>
        {t && t.npsThanks || "Merci pour votre avis !"}
      </div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:4 }}>
        {t && t.npsHelps || "Votre retour nous aide à améliorer TableMaître."}
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:1000, background:"#18182a", border:"1px solid rgba(201,151,58,0.25)", borderRadius:16, padding:"24px", maxWidth:340, boxShadow:"0 8px 40px rgba(0,0,0,0.5)", fontFamily:"Inter,sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:"#ffffff" }}>
            {t && t.npsQuestion || "Recommanderiez-vous TableMaître ?"}
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 }}>
            {t && t.npsScale || "0 = Pas du tout · 10 = Certainement"}
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:18, padding:0, lineHeight:1 }}>✕</button>
      </div>

      {/* Score 0-10 */}
      <div style={{ display:"flex", gap:4, marginBottom:16, flexWrap:"wrap" }}>
        {Array.from({length:11}, function(_,i) { return (
          <button key={i} onClick={function(){setScore(i);}} style={{
            width:34, height:34, borderRadius:8, border:"none", cursor:"pointer",
            background: score===i ? (i>=9?"#27AE60":i>=7?"#C9973A":"#e05252") : "#13131e",
            color: score===i ? "#ffffff" : "rgba(255,255,255,0.5)",
            fontSize:12, fontWeight:700, fontFamily:"inherit", transition:"all .15s",
          }}>{i}</button>
        ); })}
      </div>

      {score !== null && (
        <div style={{ fontSize:11, color: score>=9?"#27AE60":score>=7?"#F0C97A":"#e05252", marginBottom:12, fontWeight:600 }}>
          {score>=9 ? "😊 " : score>=7 ? "🙂 " : "😕 "}{labels[score] || ""}
        </div>
      )}

      <textarea
        value={comment}
        onChange={function(e){setComment(e.target.value);}}
        placeholder={t && t.npsCommentPlaceholder || "Qu'est-ce qu'on pourrait améliorer ? (optionnel)"}
        rows={3}
        style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", background:"#13131e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, color:"#ffffff", fontSize:12, fontFamily:"inherit", resize:"vertical", outline:"none", marginBottom:12 }}
      />

      <button onClick={submit} disabled={score===null||loading} style={{
        width:"100%", padding:"10px", border:"none", borderRadius:8,
        cursor: score!==null ? "pointer" : "not-allowed",
        background: score!==null ? "linear-gradient(135deg,#C9973A,#F0C97A)" : "rgba(255,255,255,0.08)",
        color: score!==null ? "#0d0d14" : "rgba(255,255,255,0.3)",
        fontWeight:800, fontSize:13, fontFamily:"inherit",
      }}>
        {loading ? "…" : (t && t.npsSend || "Envoyer mon avis →")}
      </button>

      <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", textAlign:"center", marginTop:8 }}>
        {t && t.npsDisclaimer || "Anonymisé · Modéré avant publication"}
      </div>
    </div>
  );
}
