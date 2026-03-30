/* eslint-disable */
import { useState } from "react";
import { C } from "../constants";
import { useI18n } from "../i18n";
import { VOUCHERS } from "../constants";

function PricingPage({ user, eventName, guestCount, onClose, onPlanSelected }) {
  const { t } = useI18n();

  const TIERS = [
    {
      id: "free",
      label: t.tierFree,
      price: 0,
      color: "#27AE60",
      icon: "🌱",
      range: t.tierFreeRange,
      features: t.tierFreeFeatures,
    },
    {
      id: "medium",
      label: t.tierMedium,
      price: 20,
      color: "#C9973A",
      icon: "⭐",
      range: t.tierMediumRange,
      popular: true,
      features: t.tierMediumFeatures,
    },
    {
      id: "full",
      label: t.tierFull,
      price: 39,
      color: "#e05252",
      icon: "🏆",
      range: t.tierFullRange,
      features: t.tierFullFeatures,
    },
  ];

  function getRecommended(n) {
    if (!n || n <= 10) return "free";
    if (n <= 50) return "medium";
    return "full";
  }

  function getPrice(n, voucher) {
    const tier = getRecommended(n);
    const base = TIERS.find(t => t.id === tier)?.price || 0;
    if (!voucher || base === 0) return base;
    const discount = voucher.discount || 0;
    return Math.round(base * (1 - discount / 100));
  }

  const [hovered, setHovered] = useState(null);
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  const paypalEmail = localStorage.getItem("tm_paypal_email") || "";
  const paypalName = paypalEmail ? paypalEmail.split("@")[0] : "";
  const recommended = getRecommended(guestCount);

  const applyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    const v = VOUCHERS[code];
    if (!v) {
      setVoucherError(t.voucherInvalid);
      setAppliedVoucher(null);
      return;
    }
    setAppliedVoucher({ code, ...v });
    setVoucherError("");
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    setVoucherError("");
  };

  const handlePay = (tier) => {
    if (tier.price === 0) {
      onPlanSelected?.("free", null, 0);
      return;
    }

    const finalPrice = appliedVoucher
      ? Math.round(tier.price * (1 - appliedVoucher.discount / 100))
      : tier.price;

    if (finalPrice === 0) {
      onPlanSelected?.("full", appliedVoucher?.code || null, 0);
      return;
    }

    if (paypalEmail && paypalName) {
      const link = `https://www.paypal.com/paypalme/${paypalName}/${finalPrice}EUR`;
      window.open(link, "_blank");
    } else {
      alert(t.paymentNotConfigured);
    }

    onPlanSelected?.(tier.id, appliedVoucher?.code || null, finalPrice);
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
      backdropFilter:"blur(10px)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24, overflowY:"auto",
    }}>
      <div style={{ maxWidth:880, width:"100%", margin:"auto" }}>

        {/* Close button */}
        {onClose && (
          <button onClick={onClose} style={{
            position:"fixed", top:24, right:24,
            background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)",
            color:"rgba(255,255,255,0.5)", fontSize:18, cursor:"pointer",
            width:36, height:36, borderRadius:"50%", display:"flex",
            alignItems:"center", justifyContent:"center",
          }}>✕</button>
        )}

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{
            fontSize:11, color:C.gold, letterSpacing:3,
            textTransform:"uppercase", marginBottom:10, fontWeight:700
          }}>
            {t.pricingTitle}
          </div>

          <h1 style={{
            fontSize:32, fontWeight:800, margin:"0 0 10px",
            color:"#ffffff", fontFamily:"Georgia,serif"
          }}>
            {eventName ? t.pricingActivate(eventName) : t.pricingChoosePlan}
          </h1>

          {guestCount !== undefined && (
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, margin:0 }}>
              {t.pricingYourEvent}{" "}
              <strong style={{color:"#ffffff"}}>
                {guestCount} {t.guestsLabel(guestCount)}
              </strong>{" "}
              →{" "}
              <strong style={{color:TIERS.find(t=>t.id===recommended)?.color}}>
                {TIERS.find(t=>t.id===recommended)?.label} {t.recommended}
              </strong>
            </p>
          )}
        </div>

        {/* Plans */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          gap:16, marginBottom:28
        }}>
          {TIERS.map(tier => {
            const isRec = tier.id === recommended;
            const finalPrice = appliedVoucher && tier.price > 0
              ? Math.round(tier.price * (1 - appliedVoucher.discount / 100))
              : tier.price;
            const discounted = finalPrice !== tier.price;

            return (
              <div key={tier.id}
                onMouseEnter={() => setHovered(tier.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isRec ? "#18182a" : "#13131e",
                  border: isRec ? `2px solid ${tier.color}` : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  padding: "28px 24px",
                  position: "relative",
                  transform: isRec ? "translateY(-6px)" : hovered===tier.id ? "translateY(-3px)" : "",
                  transition: "all .2s",
                  boxShadow: isRec ? `0 16px 48px ${tier.color}20` : "",
                }}>

                {isRec && (
                  <div style={{
                    position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)",
                    background:`linear-gradient(135deg,${tier.color},#F0C97A)`,
                    color:"#0d0d14", fontSize:10, fontWeight:800,
                    padding:"3px 14px", borderRadius:99, letterSpacing:1,
                    whiteSpace:"nowrap",
                  }}>
                    {t.recommendedTag}
                  </div>
                )}

                <div style={{ fontSize:32, marginBottom:10 }}>{tier.icon}</div>
                <div style={{ fontSize:18, fontWeight:800, color:tier.color, marginBottom:4 }}>
                  {tier.label}
                </div>
                <div style={{
                  fontSize:13, color:"rgba(255,255,255,0.4)",
                  marginBottom:16, fontStyle:"italic"
                }}>
                  {tier.range}
                </div>

                {/* Price */}
                <div style={{ marginBottom:20 }}>
                  {discounted && (
                    <div style={{
                      fontSize:14, color:"rgba(255,255,255,0.3)",
                      textDecoration:"line-through", marginBottom:2
                    }}>
                      {tier.price}€
                    </div>
                  )}

                  <span style={{
                    fontSize:38, fontWeight:800,
                    color: discounted ? C.green : "#ffffff"
                  }}>
                    {finalPrice === 0 ? t.free : finalPrice + "€"}
                  </span>

                  {finalPrice > 0 && (
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                      {" "}{t.perEvent}
                    </span>
                  )}

                  {discounted && (
                    <div style={{
                      fontSize:11, color:C.green, marginTop:2, fontWeight:700
                    }}>
                      -{appliedVoucher.discount}% {t.withCode(appliedVoucher.code)}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div style={{
                  display:"flex", flexDirection:"column",
                  gap:8, marginBottom:24
                }}>
                  {tier.features.map(f => (
                    <div key={f} style={{
                      display:"flex", gap:8, fontSize:12,
                      color:"rgba(255,255,255,0.65)"
                    }}>
                      <span style={{ color:tier.color, flexShrink:0, marginTop:1 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handlePay(tier)}
                  style={{
                    width:"100%", padding:"13px", border:"none",
                    borderRadius:10, cursor:"pointer",
                    background: isRec
                      ? `linear-gradient(135deg,${tier.color},#F0C97A)`
                      : tier.price === 0 ? "rgba(39,174,96,0.15)" : `${tier.color}18`,
                    color: isRec ? "#0d0d14" : tier.color,
                    fontWeight:800, fontSize:14,
                    transition:"all .15s",
                  }}
                >
                  {finalPrice === 0
                    ? t.startFree
                    : paypalEmail
                      ? t.payWithPaypal
                      : t.choosePlan}
                </button>
              </div>
            );
          })}
        </div>

        {/* Voucher */}
        <div style={{
          background:"#18182a", border:"1px solid rgba(201,151,58,0.2)",
          borderRadius:14, padding:"18px 20px", marginBottom:16,
          display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
        }}>
          <span style={{ fontSize:18 }}>🎟️</span>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            {t.voucherLabel}
          </span>

          {appliedVoucher ? (
            <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
              <div style={{
                padding:"6px 14px", background:"rgba(39,174,96,0.15)",
                border:"1px solid rgba(39,174,96,0.3)", borderRadius:8,
                fontSize:13
              }}>
                <span style={{
                  fontFamily:"monospace", color:C.green, fontWeight:700
                }}>
                  {appliedVoucher.code}
                </span>
                <span style={{ color:"rgba(255,255,255,0.5)", marginLeft:8 }}>
                  -{appliedVoucher.discount}%
                </span>
              </div>
              <button
                onClick={removeVoucher}
                style={{
                  background:"none", border:"none",
                  color:"rgba(255,255,255,0.3)", cursor:"pointer",
                  fontSize:16
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", gap:8, flex:1, minWidth:240 }}>
              <input
                value={voucherInput}
                onChange={e => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(""); }}
                onKeyDown={e => e.key === "Enter" && applyVoucher()}
                placeholder={t.voucherPlaceholder}
                style={{
                  flex:1, padding:"8px 12px", background:"#13131e",
                  border:`1px solid ${voucherError ? "#e05252" : "rgba(201,151,58,0.2)"}`,
                  borderRadius:8, color:"#ffffff", fontSize:13,
                  fontFamily:"monospace", outline:"none", letterSpacing:1,
                }}
              />
              <button
                onClick={applyVoucher}
                style={{
                  padding:"8px 16px", background:"rgba(201,151,58,0.15)",
                  border:"1px solid rgba(201,151,58,0.3)", borderRadius:8,
                  color:"#C9973A", cursor:"pointer", fontSize:13, fontWeight:700,
                }}
              >
                {t.apply}
              </button>
            </div>
          )}

          {voucherError && (
            <span style={{ fontSize:12, color:"#e05252", width:"100%" }}>
              {voucherError}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign:"center", fontSize:12,
          color:"rgba(255,255,255,0.25)"
        }}>
          {paypalEmail
            ? t.paypalFooter
            : t.paypalNotConfigured}
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
