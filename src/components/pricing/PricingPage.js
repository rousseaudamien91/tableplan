/* eslint-disable */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// i18n (nouveau système)
import { useI18n, LANG_FLAGS, LANG_NAMES } from "../../i18n";

// constantes (plans, vouchers)
import { PRICING_PLANS, VOUCHERS } from "../../constants";

// UI
import { Btn, Field, Input } from "../UI";


export default function PricingPage({ events, setEvents, paypalEmail }) {
  const { t } = useI18n();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const event = events.find(e => e.id === eventId);
  const [selectedPlan, setSelectedPlan] = useState(event.plan || "free");
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  if (!event) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Événement introuvable</h2>
      </div>
    );
  }

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
                paymentMethod: price === 0 ? "free" : "paypal",
                activatedAt: new Date().toISOString()
              }
            }
          : e
      )
    );

    alert("Événement activé !");
    navigate(`/editor/${event.id}`);
  };

  const paypalLink =
    price > 0
      ? `https://www.paypal.com/paypalme/${paypalEmail.split("@")[0]}/${price}EUR`
      : null;

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>
        {t("pricing.title")}
      </h1>

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
                  ? "2px solid #C9973A"
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
              {p.price === 0 ? t("pricing.free") : p.price + "€"}
            </div>
          </div>
        ))}
      </div>

      {/* VOUCHER */}
      <div style={{ marginTop: 30 }}>
        <Field label={t("pricing.voucher")}>
          <Input
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
            placeholder="PROMO10"
          />
        </Field>
        <Btn onClick={applyVoucher}>{t("pricing.apply")}</Btn>
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
        <div style={{ fontSize: 16, marginBottom: 6 }}>
          {t("pricing.total")} :
        </div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>
          {price === 0 ? t("pricing.free") : price + "€"}
        </div>
      </div>

      {/* PAYPAL */}
      {price > 0 && (
        <div style={{ marginTop: 30 }}>
          <a href={paypalLink} target="_blank" rel="noreferrer">
            <Btn>💳 {t("pricing.payWithPaypal")}</Btn>
          </a>
        </div>
      )}

      {/* ACTIVATE */}
      <div style={{ marginTop: 20 }}>
        <Btn onClick={activate}>{t("pricing.activate")}</Btn>
      </div>
    </div>
  );
}
