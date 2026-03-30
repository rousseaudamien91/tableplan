/* eslint-disable */
import { useState } from "react";
import { useI18n } from "../i18n";
import { LANG_FLAGS, LANG_NAMES } from "../i18n/langMeta";
import { C, THEMES_CONFIG, PLANS } from "../constants";

import { Btn, Badge, Modal, Field, Input, Select } from "./UI";
import { uid } from "../utils";
import VoucherModal from "./VoucherModal";
import PricingPage from "./PricingPage";
import OnboardingWizard from "./OnboardingWizard";

function Dashboard({ user, events, setEvents, onLogout, onOpenEvent, lightMode, onToggleTheme, guestMode }) {
  const { t, lang, setLang } = useI18n();

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const [newEv, setNewEv] = useState({ name:"", date:"", type:"mariage" });
  const [globalSearch, setGlobalSearch] = useState("");
  const [saveToast, setSaveToast] = useState(false);

  const myEventsRaw = events.filter(ev => ev.ownerId === user.id);
  const myEvents = !globalSearch
    ? myEventsRaw
    : myEventsRaw.filter(ev => {
        const q = globalSearch.toLowerCase();
        return (
          ev.name.toLowerCase().includes(q) ||
          (ev.date || "").includes(q) ||
          (ev.guests || []).some(g =>
            g.name.toLowerCase().includes(q) ||
            (g.email || "").toLowerCase().includes(q)
          )
        );
      });

  function createEvent() {
    if (!newEv.name) return;

    const ev = {
      id: Date.now(),
      ownerId: user.id,
      name: newEv.name,
      date: newEv.date || new Date().toISOString().slice(0, 10),
      type: newEv.type,
      plan: appliedVoucher ? "pro" : "free",
      roomShape: [
        { x: 60, y: 60 },
        { x: 740, y: 60 },
        { x: 740, y: 520 },
        { x: 60, y: 520 }
      ],
      tables: [],
      guests: [],
      constraints: [],
      menu: null
    };

    setEvents(prev => [...prev, ev]);
    onOpenEvent(ev.id);
    setShowNew(false);
  }

  const handleApplyVoucher = (code, voucher) => {
    setAppliedVoucher({ code, ...voucher });
  };

  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 30%,#2a1a0e,${C.dark})`, fontFamily:"Georgia,serif", color:"#ffffff" }}>

      {/* NAV */}
      <div style={{
        background:"#18182a",
        borderBottom:"1px solid rgba(201,151,58,0.12)",
        padding:"0 32px",
        display:"flex",
        alignItems:"center",
        height:60,
        position:"sticky",
        top:0,
        zIndex:100
      }}>
        <span style={{ fontSize:20, color:"#C9973A", letterSpacing:1 }}>🪑 TableMaître</span>

        <div style={{ flex:1 }} />

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>

          {/* Avatar */}
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} style={{
              width:32, height:32, borderRadius:"50%",
              objectFit:"cover", border:`2px solid ${C.gold}44`
            }}/>
          ) : (
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background:C.gold+"33",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#C9973A", fontSize:13, fontWeight:700
            }}>
              {user.avatar}
            </div>
          )}

          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>
            {user.name.split(" ")[0]}
          </span>

          {/* LANG SELECTOR */}
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            style={{
              background:"#18182a",
              border:"1px solid rgba(201,151,58,0.15)",
              borderRadius:8,
              color:"rgba(255,255,255,0.45)",
              cursor:"pointer",
              fontSize:13,
              padding:"6px 8px",
              fontFamily:"inherit"
            }}
          >
            {Object.entries(LANG_FLAGS).map(([code, flag]) => (
              <option key={code} value={code}>
                {flag} {LANG_NAMES[code]}
              </option>
            ))}
          </select>

          {/* THEME TOGGLE */}
          <button
            onClick={onToggleTheme}
            title={lightMode ? t.darkMode : t.lightMode}
            style={{
              padding:"6px 10px",
              background:"none",
              border:"1px solid rgba(201,151,58,0.15)",
              borderRadius:8,
              color:"rgba(255,255,255,0.45)",
              cursor:"pointer",
              fontSize:16
            }}
          >
            {lightMode ? "🌙" : "☀️"}
          </button>

          {/* VOUCHER */}
          <button
            onClick={() => setShowVoucher(true)}
            style={{
              padding:"6px 14px",
              background:"none",
              border:"1px solid rgba(201,151,58,0.4)",
              borderRadius:8,
              color:"#C9973A",
              cursor:"pointer",
              fontSize:12,
              fontFamily:"Georgia,serif",
              display:"flex",
              alignItems:"center",
              gap:6
            }}
          >
            🎟️ {t.codePromo}
            {appliedVoucher && (
              <span style={{
                background:"linear-gradient(135deg,#C9973A,#F0C97A)",
                color:C.dark,
                borderRadius:4,
                padding:"1px 6px",
                fontSize:11,
                fontWeight:700
              }}>
                ✓
              </span>
            )}
          </button>

          <Btn variant="muted" small onClick={onLogout}>
            {t.logout}
          </Btn>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 20px" }}>

        {/* HERO */}
        <div style={{ marginBottom:48, textAlign:"center" }}>
          <h1 style={{ fontSize:36, fontWeight:400, margin:"0 0 8px", letterSpacing:1 }}>
            {t.myEvents}
          </h1>
          <p style={{ color:"rgba(255,255,255,0.45)", margin:0, fontSize:14 }}>
            {t.welcome}, {user.name}
          </p>
        </div>

        {/* SEARCH + NEW */}
        <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
          <input
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              flex:1,
              padding:"10px 16px",
              background:"#18182a",
              border:"1px solid rgba(201,151,58,0.15)",
              borderRadius:12,
              color:"#ffffff",
              fontSize:14,
              fontFamily:"Georgia,serif"
            }}
          />
          <Btn onClick={() => setShowNew(true)}>{t.newEvent}</Btn>
        </div>

        {/* EMPTY STATE */}
        {myEvents.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 20px", color:"rgba(255,255,255,0.45)" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🪑</div>
            <p style={{ fontSize:18 }}>{t.noEvents}</p>
            <Btn onClick={() => setShowNew(true)} style={{ marginTop:20 }}>
              {t.createFirst}
            </Btn>
          </div>
        )}

        {/* EVENTS GRID */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
          gap:20
        }}>
          {myEvents.map(ev => {
            const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
            const unseated = ev.guests.filter(g => !g.tableId).length;

            return (
              <div
                key={ev.id}
                onClick={() => onOpenEvent(ev.id)}
                style={{
                  background:"#18182a",
                  border:"1px solid rgba(201,151,58,0.15)",
                  borderRadius:18,
                  padding:24,
                  cursor:"pointer",
                  transition:"all .2s",
                  boxShadow:`0 4px 20px ${theme.color}11`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = theme.color + "66";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* COLOR BAR */}
                <div style={{
                  height:3,
                  background:`linear-gradient(90deg,${theme.color},${theme.color}44)`,
                  borderRadius:99,
                  marginBottom:20
                }}/>

                {/* HEADER */}
                <div style={{
                  display:"flex",
                  alignItems:"start",
                  justifyContent:"space-between",
                  marginBottom:12
                }}>
                  <span style={{ fontSize:32 }}>{theme.icon}</span>
                  <Badge color={theme.color}>{theme.label}</Badge>
                </div>

                {/* NAME + DUPLICATE */}
                <div style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  marginBottom:4
                }}>
                  <h3 style={{ color:"#ffffff", margin:0, fontSize:18, fontWeight:400 }}>
                    {ev.name}
                  </h3>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const copy = {
                        ...ev,
                        id: Date.now(),
                        name: ev.name + " (copie)",
                        ownerId: user.id
                      };
                      setEvents(prev => [...prev, copy]);
                    }}
                    title={t.duplicate}
                    style={{
                      background:"none",
                      border:"1px solid rgba(201,151,58,0.15)",
                      borderRadius:8,
                      color:"rgba(255,255,255,0.45)",
                      cursor:"pointer",
                      fontSize:12,
                      padding:"3px 8px"
                    }}
                  >
                    ⧉
                  </button>
                </div>

                {/* DATE */}
                <p style={{
                  color:"rgba(255,255,255,0.45)",
                  margin:"0 0 16px",
                  fontSize:12
                }}>
                  {ev.date}
                </p>

                {/* STATS */}
                <div style={{
                  display:"flex",
                  gap:16,
                  fontSize:12,
                  color:"rgba(255,255,255,0.45)"
                }}>
                  <span>🪑 {ev.tables.length} {t.tables}</span>
                  <span>👤 {ev.guests.length} {t.guests}</span>
                  {unseated > 0 && (
                    <span style={{ color:C.red }}>
                      ⚠ {unseated} {t.unseated}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ONBOARDING */}
      {showOnboarding && (
        <OnboardingWizard
          onSkip={() => { setShowOnboarding(false); setShowNew(true); }}
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
              menu: null
            };
            setEvents(prev => [...prev, ev]);
            onOpenEvent(ev.id);
          }}
        />
      )}

      {/* PRICING */}
      {showPricing && (
        <PricingPage
          user={user}
          onClose={() => setShowPricing(false)}
          onPlanSelected={() => setShowPricing(false)}
        />
      )}

      {/* VOUCHER */}
      {showVoucher && (
        <VoucherModal
          onClose={() => setShowVoucher(false)}
          onApply={handleApplyVoucher}
        />
      )}

      {/* TOAST */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position:"fixed",
          bottom:24,
          left:"50%",
          transform:"translateX(-50%)",
          zIndex:9999,
          pointerEvents:"none"
        }}
      >
        {saveToast && (
          <div style={{
            background:"#1E1208",
            border:`1px solid ${C.green}`,
            borderRadius:10,
            padding:"10px 20px",
            display:"flex",
            alignItems:"center",
            gap:8,
            boxShadow:"0 4px 20px rgba(0,0,0,0.4)",
            fontSize:13,
            color:C.green
          }}>
            {t.savedCloud}
          </div>
        )}
      </div>

      {/* APPLIED VOUCHER */}
      {appliedVoucher && (
        <div style={{
          position:"fixed",
          bottom:24,
          right:24,
          background:"#18182a",
          border:`1px solid ${C.green}`,
          borderRadius:12,
          padding:"12px 20px",
          zIndex:500,
          display:"flex",
          alignItems:"center",
          gap:10,
          boxShadow:"0 4px 20px rgba(0,0,0,0.4)"
        }}>
          <span style={{ fontSize:18 }}>🎟️</span>
          <div>
            <div style={{ color:C.green, fontSize:12, fontWeight:700 }}>
              {t.voucherApplied} : {appliedVoucher.code}
            </div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>
              {appliedVoucher.description}
            </div>
          </div>
          <button
            onClick={() => setAppliedVoucher(null)}
            style={{
              background:"none",
              border:"none",
              color:"rgba(255,255,255,0.45)",
              cursor:"pointer",
              fontSize:16,
              padding:0
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* NEW EVENT MODAL */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title={t.newEvent}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={t.eventName}>
            <Input
              value={newEv.name}
