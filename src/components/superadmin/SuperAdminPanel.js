/* eslint-disable */
import { useMemo, useState } from "react";
import { C, useI18n } from "../theme";
import { Btn, Badge } from "../components/UI";
import { THEMES_CONFIG, VOUCHERS } from "../constants";
import { uid } from "../utils";

import AccountsSection from "./accounts/AccountsSection";
// (Les autres viendront ensuite)
// import ProjectsSection from "./projects/ProjectsSection";
// import StatsSection from "./stats/StatsSection";
// import PaymentsSection from "./payments/PaymentsSection";
// import ReviewsAdminSection from "./reviews/ReviewsAdminSection";

const SUBSCRIPTION_PLANS = {
  free:       { label: "Free",       color: "#8A7355",  price: 0,   maxEvents: 1,   maxGuests: 50   },
  starter:    { label: "Starter",    color: "#3b82f6",  price: 9,   maxEvents: 3,   maxGuests: 200  },
  pro:        { label: "Pro",        color: "#C9973A",  price: 29,  maxEvents: 20,  maxGuests: 999  },
  enterprise: { label: "Enterprise", color: "#e05252",  price: 99,  maxEvents: 999, maxGuests: 9999 },
};

const STATUS_COLORS = {
  active:   "#27AE60",
  trial:    "#F0C97A",
  expired:  "#e05252",
  cancelled:"#8A7355",
};

const TABS = [
  { id: "accounts", labelKey: "superadmin.tabs.accounts", icon: "👥" },
  { id: "projects", labelKey: "superadmin.tabs.projects", icon: "📁" },
  { id: "stats",    labelKey: "superadmin.tabs.stats",    icon: "📊" },
  { id: "stripe",   labelKey: "superadmin.tabs.payments", icon: "💳" },
  { id: "reviews",  labelKey: "superadmin.tabs.reviews",  icon: "⭐" },
];

function SuperAdminPanel({ events, setEvents, users, setUsers, onLogout }) {
  const { t } = useI18n();
  const [tab, setTab] = useState("accounts");

  // Ces états seront utilisés par d'autres sections plus tard
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewUser, setShowNewUser]       = useState(false);
  const [showSubscription, setShowSubscription] = useState(null);
  const [showStripeSetup, setShowStripeSetup]   = useState(false);

  const [stripeKey,       setStripeKey]       = useState(localStorage.getItem("tm_stripe_pk") || "");
  const [paypalEmail,     setPaypalEmail]     = useState(localStorage.getItem("tm_paypal_email") || "");
  const [paypalClientId,  setPaypalClientId]  = useState(localStorage.getItem("tm_paypal_client_id") || "");
  const [stripeSecret,    setStripeSecret]    = useState(localStorage.getItem("tm_stripe_sk") || "");

  // Enrichissement des users (comme avant)
  const enrichedUsers = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        plan: u.plan || "free",
        subscriptionStatus:
          u.subscriptionStatus || (u.role === "superadmin" ? "active" : "trial"),
        subscriptionStart:
          u.subscriptionStart ||
          new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
        subscriptionEnd:
          u.subscriptionEnd ||
          new Date(Date.now() + 23 * 86400000).toISOString().slice(0, 10),
        stripeCustomerId: u.stripeCustomerId || "",
        projectCount: events.filter((e) => e.ownerId === u.id).length,
        guestCount: events
          .filter((e) => e.ownerId === u.id)
          .reduce((s, e) => s + (e.guests || []).length, 0),
      })),
    [users, events]
  );

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      activeSubscriptions: enrichedUsers.filter(
        (u) => u.subscriptionStatus === "active"
      ).length,
      trialUsers: enrichedUsers.filter(
        (u) => u.subscriptionStatus === "trial"
      ).length,
      proUsers: enrichedUsers.filter(
        (u) => u.plan === "pro" || u.plan === "enterprise"
      ).length,
      mrr: enrichedUsers.reduce(
        (s, u) => s + (SUBSCRIPTION_PLANS[u.plan]?.price || 0),
        0
      ),
    }),
    [users, enrichedUsers]
  );

  const cardStyle = {
    background: "#18182a",
    border: "1px solid rgba(201,151,58,0.15)",
    borderRadius: 14,
    padding: "20px 24px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.dark,
        fontFamily: "'Inter','Segoe UI',sans-serif",
        color: "#ffffff",
      }}
    >
      {/* NAV */}
      <div
        style={{
          background: "#18182a",
          borderBottom: "1px solid rgba(201,151,58,0.12)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
          gap: 4,
        }}
      >
        <span style={{ fontSize: 18, color: "#C9973A", fontWeight: 800 }}>
          🪑 TableMaître
        </span>
        <Badge color={C.red} style={{ marginLeft: 8, fontSize: 10 }}>
          {t("superadmin.badge")}
        </Badge>
        <div style={{ flex: 1 }} />
        {TABS.map((tabDef) => (
          <button
            key={tabDef.id}
            onClick={() => setTab(tabDef.id)}
            style={{
              background: tab === tabDef.id ? C.gold + "22" : "none",
              border: "none",
              color:
                tab === tabDef.id
                  ? C.gold
                  : "rgba(255,255,255,0.5)",
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            {tabDef.icon} {t(tabDef.labelKey)}
          </button>
        ))}
        <div
          style={{
            width: 1,
            height: 24,
            background: C.border,
            margin: "0 12px",
          }}
        />
        <Btn variant="muted" small onClick={onLogout}>
          {t("superadmin.logout")}
        </Btn>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* ACCOUNTS */}
        {tab === "accounts" && (
          <AccountsSection
            users={users}
            setUsers={setUsers}
            enrichedUsers={enrichedUsers}
            stats={stats}
            SUBSCRIPTION_PLANS={SUBSCRIPTION_PLANS}
            STATUS_COLORS={STATUS_COLORS}
            cardStyle={cardStyle}
          />
        )}

        {/* Les autres onglets seront branchés ensuite */}
        {/* {tab === "projects" && (
          <ProjectsSection
            events={events}
            setEvents={setEvents}
            users={users}
            cardStyle={cardStyle}
          />
        )}

        {tab === "stats" && (
          <StatsSection
            events={events}
            users={users}
            enrichedUsers={enrichedUsers}
            stats={stats}
            SUBSCRIPTION_PLANS={SUBSCRIPTION_PLANS}
            VOUCHERS={VOUCHERS}
            cardStyle={cardStyle}
          />
        )}

        {tab === "stripe" && (
          <PaymentsSection
            stripeKey={stripeKey}
            setStripeKey={setStripeKey}
            stripeSecret={stripeSecret}
            setStripeSecret={setStripeSecret}
            paypalEmail={paypalEmail}
            setPaypalEmail={setPaypalEmail}
            paypalClientId={paypalClientId}
            setPaypalClientId={setPaypalClientId}
            SUBSCRIPTION_PLANS={SUBSCRIPTION_PLANS}
            cardStyle={cardStyle}
            showStripeSetup={showStripeSetup}
            setShowStripeSetup={setShowStripeSetup}
          />
        )}

        {tab === "reviews" && (
          <ReviewsAdminSection cardStyle={cardStyle} />
        )} */}
      </div>
    </div>
  );
}

export default SuperAdminPanel;
