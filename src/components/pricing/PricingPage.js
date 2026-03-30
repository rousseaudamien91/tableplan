/* eslint-disable */
import { useState } from "react";
import { Btn, Field, Input } from "../components/UI";
import { C } from "../constants";
import { VOUCHERS, PRICING_PLANS } from "../constants";

export default function PricingPage({ event, setEvents, paypalEmail }) {
  const [selectedPlan, setSelectedPlan] = useState(event.plan || "free");
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const plan = PRICING_PLANS[selectedPlan];

  const applyVoucher = () => {
    const v = VOUCHERS[voucher.toUpperCase()];
    if (!v) return alert("Code invalide");
    setDiscount(v.discount);
  };

  const price = Math.max(plan.price - (plan.price * discount) / 100, 0);

  const activate = () => {
    setEvents(prev =>
      prev.map(e =>
        e.id === event.id
          ? {
              ...e,
              plan: selectedPlan,
              status: "active",
              billing: {
                pricePaid: price,
                voucherCode: voucher || null,
                paymentMethod: "paypal",
                activatedAt: new Date().toISOString()
              }
            }
          : e
      )
    );
    alert("Événement activé !");
  };

  const paypalLink =
    "https://www.paypal.com/paypalme/" +
    paypalEmail.split("@")[0] +
    "/" +
    price +
    "EUR";

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Activer votre événement</h1>

      {/* PLANS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {Object.entries(PRICING_PLANS).map(([key, p]) => (
          <div
            key={key}
            onClick={() => setSelectedPlan(key)}
            style={{
              padding: 20,
              borderRadius: 12,
              border:
                selectedPlan === key
                  ? "2px solid " + C.gold
                  : "1px solid rgba(255,255,255,0.1)",
              background: "#18182a",
              cursor: "pointer"
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{p.label}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
              {p.description}
            </div>
            <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800 }}>
              {p.price === 0 ? "Gratuit" : p.price + "€"}
            </div>
          </div>
        ))}
      </div>

      {/* VOUCHER */}
      <div style={{ marginTop: 30 }}>
        <Field label="Code promo">
          <Input
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
            placeholder="PROMO10"
          />
        </Field>
        <Btn onClick={applyVoucher}>Appliquer</Btn>
      </div>

      {/* TOTAL */}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          background: "#13131e",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <div style={{ fontSize: 16, marginBottom: 6 }}>Total :</div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>
          {price === 0 ? "Gratuit" : price + "€"}
        </div>
      </div>

      {/* PAYPAL */}
      {price > 0 && (
        <div style={{ marginTop: 30 }}>
          <a href={paypalLink} target="_blank" rel="noreferrer">
            <Btn>💳 Payer avec PayPal</Btn>
          </a>
        </div>
      )}

      {/* ACTIVATE */}
      <div style={{ marginTop: 20 }}>
        <Btn onClick={activate}>Activer l’événement</Btn>
      </div>
    </div>
  );
}
