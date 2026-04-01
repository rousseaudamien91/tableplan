/* eslint-disable */
import { useState } from "react";
import { useTheme, EVENT_THEMES, C } from "../theme";

import PricingPage from "./pricing/PricingPage";
import OnboardingWizard from "./OnboardingWizard";
import VoucherModal from "./VoucherModal";

import Btn from "./ui/Btn";
import Modal from "./ui/Modal";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Badge from "./ui/Badge";

export default function Dashboard({
  user,
  events,
  setEvents,
  onLogout,
  onOpenEvent,
  t,
}) {
  const { theme } = useTheme();

  // 🔥 Protection user (évite le crash "reading myEvents")
  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#fff" }}>
        Chargement…
      </div>
    );
  }

  // 🔥 Protection events
  const safeEvents = Array.isArray(events) ? events : [];

  const [showNew, setShowNew] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const [newEv, setNewEv] = useState({
    name: "",
    date: "",
    type: "mariage",
  });

  function createEvent() {
    const ev = {
      id: Date.now(),
      ownerId: user.id,
      name: newEv.name,
      date: newEv.date,
      type: newEv.type,
      plan: "free",
      roomShape: "rectangle",
      tables: [],
      guests: [],
      constraints: [],
      menu: null,
    };
    setEvents((prev) => [...prev, ev]);
    setShowNew(false);
    onOpenEvent(ev.id);
  }

  function handleApplyVoucher(voucher) {
    setAppliedVoucher(voucher);
    setShowVoucher(false);
  }

  return (
    <div style={{ padding: 28, color: theme.text, transition: theme.transition }}>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30,
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          {t.myEvents}
        </h1>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setShowVoucher(true)}>
            {t.codePromo}
          </Btn>

          <Btn variant="secondary" onClick={onLogout}>
            {t.logout}
          </Btn>
        </div>
      </div>

      {/* LISTE DES ÉVÉNEMENTS */}
      <div style={{ marginBottom: 40 }}>
        {safeEvents.length === 0 ? (
          <div style={{ opacity: 0.6 }}>{t.noEvents}</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {safeEvents.map((ev) => {
              const evTheme = EVENT_THEMES[ev.type] || EVENT_THEMES.autre;

              return (
                <div
                  key={ev.id}
                  onClick={() => onOpenEvent(ev.id)}
                  style={{
                    padding: 18,
                    borderRadius: 14,
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                    cursor: "pointer",
                    transition: "all .22s ease",
                    boxShadow: theme.shadow,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = theme.shadow;
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{ev.name}</div>
                    <Badge soft color={evTheme.color}>
                      {evTheme.icon}
                    </Badge>
                  </div>

                  <div style={{ opacity: 0.6, fontSize: 13, marginTop: 6 }}>
                    {ev.date}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Btn size="lg" onClick={() => setShowNew(true)}>
        {t.newEvent}
      </Btn>

      {/* MODALS */}
      {showOnboarding && (
        <OnboardingWizard
          onSkip={() => {
            setShowOnboarding(false);
            setShowNew(true);
          }}
          onComplete={(wizardData) => {
            setShowOnboarding(false);
            const ev = {
              id: Date.now(),
              ownerId: user.id,
              name: wizardData.name,
              date: wizardData.date,
              type: wizardData.type,
              plan: "free",
              roomShape: wizardData.roomShape,
              tables: [],
              guests: [],
              constraints: [],
              menu: null,
            };
            setEvents((prev) => [...prev, ev]);
            onOpenEvent(ev.id);
          }}
        />
      )}

      {showPricing && (
        <PricingPage
          user={user}
          onClose={() => setShowPricing(false)}
          onPlanSelected={() => setShowPricing(false)}
        />
      )}

      {showVoucher && (
        <VoucherModal
          onClose={() => setShowVoucher(false)}
          onApply={handleApplyVoucher}
        />
      )}

      {/* TOAST SAUVEGARDE */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        {saveToast && (
          <div
            style={{
              background: theme.card,
              border: `1px solid ${C.green}`,
              borderRadius: 10,
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: theme.shadow,
              fontSize: 13,
              color: C.green,
            }}
          >
            {t.savedCloud}
          </div>
        )}
      </div>

      {/* TOAST VOUCHER */}
      {appliedVoucher && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: theme.card,
            border: `1px solid ${C.green}`,
            borderRadius: 12,
            padding: "12px 20px",
            zIndex: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: theme.shadow,
          }}
        >
          <span style={{ fontSize: 18 }}>🎟️</span>
          <div>
            <div style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>
              Code appliqué : {appliedVoucher.code}
            </div>
            <div style={{ color: theme.textMuted, fontSize: 11 }}>
              {appliedVoucher.description}
            </div>
          </div>
          <button
            onClick={() => setAppliedVoucher(null)}
            style={{
              background: "none",
              border: "none",
              color: theme.textMuted,
              cursor: "pointer",
              fontSize: 16,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* MODAL NOUVEL ÉVÉNEMENT */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nouvel événement">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Nom de l'événement *">
            <Input
              value={newEv.name}
              onChange={(e) => setNewEv({ ...newEv, name: e.target.value })}
              placeholder="Mariage Dupont × Martin"
            />
          </Field>

          <Field label={t.settingDate}>
            <Input
              type="date"
              value={newEv.date}
              onChange={(e) => setNewEv({ ...newEv, date: e.target.value })}
            />
          </Field>

          <Field label="Type d'événement">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
