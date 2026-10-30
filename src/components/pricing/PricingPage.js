/* eslint-disable */
import { useState } from "react";
import { PRICING_PLANS, VOUCHERS } from "../../constants";
import { C } from "../../theme";

export default function PricingPage({ events, setEvents, paypalEmail, onClose, eventId }) {
  // Support double usage : React Router (eventId via prop) ou modal directe
  const evId   = eventId;
  const event  = events && events.find(e => String(e.id) === String(evId));

  const [selectedPlan, setSelectedPlan] = useState(event?.plan || "free");
  const [voucher,      setVoucher]      = useState("");
  const [discount,     setDiscount]     = useState(0);
  const [applied,      setApplied]      = useState(false);

  if (!event && evId) return (
    <div style={{ padding:40, color:"#fff" }}>
      <h2>Événement introuvable</h2>
      {onClose && <button onClick={onClose} style={{marginTop:16,padding:"8px 16px",background:"none",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"rgba(255,255,255,0.5)",cursor:"pointer"}}>Fermer</button>}
    </div>
  );

  const plan  = PRICING_PLANS[selectedPlan] || PRICING_PLANS.free;
  const price = Math.max(plan.price - (plan.price * discount) / 100, 0);

  const applyVoucher = () => {
    const v = VOUCHERS[voucher.toUpperCase()];
    if (!v) { alert("Code invalide"); return; }
    setDiscount(v.discount);
    setApplied(true);
  };

  const activate = () => {
    if (setEvents && event) {
      setEvents(prev => prev.map(e =>
        String(e.id) === String(evId) ? {
          ...e, plan: selectedPlan, status: "active",
          billing: { pricePaid: price, voucherCode: voucher||null, paymentMethod: price===0?"free":"paypal", activatedAt: new Date().toISOString() }
        } : e
      ));
    }
    if (onClose) onClose();
  };

  const paypalName = paypalEmail ? paypalEmail.split("@")[0] : "";
  const paypalLink = price > 0 && paypalName ? `https://www.paypal.com/paypalme/${paypalName}/${price}EUR` : null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, fontFamily:"Georgia,serif" }}>
      <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.2)", borderRadius:20, padding:"36px 32px", width:440, maxWidth:"90vw", maxHeight:"90vh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <h2 style={{ margin:0, fontSize:20, fontWeight:400, color:"#fff" }}>💳 Choisir votre formule</h2>
          {onClose && <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:22 }}>✕</button>}
        </div>

        {/* Plans */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
          {Object.entries(PRICING_PLANS).map(([key, p]) => (
            <div key={key} onClick={() => setSelectedPlan(key)} style={{
              padding:"16px 20px", borderRadius:14,
              background: selectedPlan===key ? "rgba(201,151,58,0.12)" : "#13131e",
              border: selectedPlan===key ? "2px solid #C9973A" : "1px solid rgba(255,255,255,0.07)",
              cursor:"pointer", transition:"all .15s",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:selectedPlan===key?"#C9973A":"#fff" }}>{p.label}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{p.description}</div>
                </div>
                <div style={{ fontSize:22, fontWeight:800, color:selectedPlan===key?"#C9973A":"rgba(255,255,255,0.7)" }}>
                  {p.price === 0 ? "Gratuit" : p.price+"€"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Code promo */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>CODE PROMO</label>
          <div style={{ display:"flex", gap:8 }}>
            <input value={voucher} onChange={e => setVoucher(e.target.value)}
              placeholder="Ex : PROMO10"
              style={{ flex:1, padding:"10px 14px", background:"#13131e", border:"1px solid rgba(201,151,58,0.2)", borderRadius:10, color:"#fff", fontSize:13, fontFamily:"inherit", outline:"none" }}
            />
            <button onClick={applyVoucher} style={{ padding:"10px 16px", background:"rgba(201,151,58,0.2)", border:"1px solid rgba(201,151,58,0.4)", borderRadius:10, color:"#C9973A", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700 }}>
              Appliquer
            </button>
          </div>
          {applied && <div style={{ color:"#27AE60", fontSize:12, marginTop:6 }}>✅ Code appliqué — {discount}% de réduction</div>}
        </div>

        {/* Total */}
        <div style={{ padding:"16px 20px", background:"#13131e", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", marginBottom:20 }}>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Total</div>
          <div style={{ fontSize:28, fontWeight:800, color: price===0?"#27AE60":"#C9973A" }}>
            {price === 0 ? "Gratuit 🎉" : price+"€"}
          </div>
        </div>

        {/* Boutons */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {paypalLink && (
            <a href={paypalLink} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
              <button style={{ width:"100%", padding:"13px", background:"#0070BA", border:"none", borderRadius:12, color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
                💳 Payer via PayPal — {price}€
              </button>
            </a>
          )}
          <button onClick={activate} style={{
            padding:"13px", background: price===0 ? "linear-gradient(135deg,#27AE60,#2ECC71)" : "linear-gradient(135deg,#C9973A,#F0C97A)",
            border:"none", borderRadius:12, color: price===0?"#fff":"#0d0d14",
            fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit",
          }}>
            {price === 0 ? "✅ Activer gratuitement" : "✅ J'ai payé — Activer"}
          </button>
          {onClose && <button onClick={onClose} style={{ padding:"10px", background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>Annuler</button>}
        </div>
      </div>
    </div>
  );
}
