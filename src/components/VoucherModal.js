/* eslint-disable */
import { useState } from "react";

// i18n (nouveau système)
import { useI18n, LANG_FLAGS, LANG_NAMES } from "../i18n";

// constantes (couleurs, plans, vouchers)
import { C, VOUCHERS, PLANS } from "../constants";

// UI + utils
import { Btn, Modal, Field, Input } from "./UI";


// ═══════════════════════════════════════════════════════════════
// VOUCHER MODAL — Code promotionnel
// ═══════════════════════════════════════════════════════════════

function VoucherModal({ onClose, onApply }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleApply = () => {
    const v = VOUCHERS[code.trim().toUpperCase()];
    if (!v) {
      setMsg({ type: "error", text: "❌ Code invalide ou expiré" });
      return;
    }
    setSuccess(true);
    setMsg({ type: "success", text: `✅ Code appliqué : ${v.description}` });
    setTimeout(() => { onApply(code.trim().toUpperCase(), v); onClose(); }, 1800);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
      <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:20, padding:40, width:380, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🎟️</div>
        <h2 style={{ color:"#C9973A", margin:"0 0 8px", fontSize:22, fontWeight:400, letterSpacing:1 }}>Code promotionnel</h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:"0 0 24px", lineHeight:1.6 }}>
          Entrez votre bon de réduction pour activer votre offre
        </p>
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && !success && handleApply()}
          placeholder="EX: MARIAGE2026"
          autoFocus
          style={{
            width:"100%", padding:"14px 16px", background:"#13131e",
            border:`1px solid ${success ? C.green : msg?.type==="error" ? C.red : C.border}`,
            borderRadius:10, color:"#ffffff", fontSize:18, letterSpacing:4,
            textAlign:"center", outline:"none", boxSizing:"border-box",
            fontFamily:"monospace", transition:"border-color 0.2s"
          }}
        />
        {msg && (
          <div style={{
            marginTop:12, padding:"10px 14px", borderRadius:8,
            background: msg.type==="error" ? C.red+"22" : C.green+"22",
            color: msg.type==="error" ? C.red : C.green,
            fontSize:13, fontWeight:500
          }}>
            {msg.text}
          </div>
        )}
        <div style={{ display:"flex", gap:12, marginTop:24 }}>
          <button
            onClick={onClose}
            style={{ flex:1, padding:"12px", background:"none", border:"1px solid rgba(201,151,58,0.15)", borderRadius:10, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14, fontFamily:"Georgia,serif" }}
          >
            Annuler
          </button>
          <button
            onClick={handleApply}
            disabled={!code || success}
            style={{
              flex:2, padding:"12px", background: success ? C.green : C.gold,
              border:"none", borderRadius:10, color:C.dark, cursor: !code||success ? "default" : "pointer",
              fontWeight:700, fontSize:14, fontFamily:"Georgia,serif",
              opacity: !code ? 0.5 : 1, transition:"all 0.2s"
            }}
          >
            {success ? "✓ Appliqué !" : "Appliquer le code"}
          </button>
        </div>
        <div style={{ marginTop:20, fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD (Admin view)
// ═══════════════════════════════════════════════════════════════


export default VoucherModal;
