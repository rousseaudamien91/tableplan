/* eslint-disable */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// i18n
import { useI18n } from "../../i18n";

// constantes
import { PRICING_PLANS, VOUCHERS } from "../../constants";

// UI premium
import Btn from "../ui/Btn";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

// thème
import { useTheme } from "../../theme";

export default function PricingPage({ events, setEvents, paypalEmail }) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === eventId);

  const [selectedPlan, setSelectedPlan] = useState(event?.plan || "free");
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
  const price = Math.max(plan.price - (plan.price * discount) / 100, 0);

  const applyVoucher = () => {
    const v = VOUCHERS[voucher.toUpperCase()];
    if (!v) return alert("Code invalide");
    setDiscount(v.discount);
  };

  const activate = () => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              plan: selectedPlan,
              status: "active",
              billing: {
                pricePaid: price,
                voucherCode: voucher || null,
                paymentMethod: price === 0 ? "free" : "paypal",
                activatedAt: new Date().toISOString(),
              },
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
    <Modal open={true} onClose={() => navigate(-1)} title={t("pricing.title")}>
      <div style={{ padding: "4px 2px" }}>
        {/* PLANS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 30,
          }}
        >
          {Object.entries(PRICING_PLANS).map(([key, p]) => (
            <div
              key={key}
              onClick={() => setSelectedPlan(key)}
              style={{
                padding: 20,
                borderRadius: 14,
                background: theme.card,
                border:
                  selectedPlan === key
                    ? `2px solid ${theme.primary}`
                    : `1px solid ${theme.border}`,
                cursor: "pointer",
                transition: "all .22s ease",
                boxShadow: theme.shadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = theme.shadow;
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700 }}>{p.label}</div>
              <div style={{ opacity: 0.6, marginTop: 4 }}>{p.description}</div>
              <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800 }}>
                {p.price === 0 ? t("pricing.free") : p.price + "€"}
              </div>
            </div>
          ))}
        </div>

        {/* VOUCHER */}
        <Field label={t("pricing.voucher")}>
          <Input
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
            placeholder="PROMO10"
          />
        </Field>
        <Btn onClick={applyVoucher}>{t("pricing.apply")}</Btn>

        {/* TOTAL */}
        <div
          style={{
            marginTop: 30,
            padding: 20,
            background: theme.card,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
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
              <Btn size="md">💳 {t("pricing.payWithPaypal")}</Btn>
            </a>
          </div>
        )}

        {/* ACTIVATE */}
        <div style={{ marginTop: 20 }}>
          <Btn size="lg" onClick={activate}>
            {t("pricing.activate")}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}
