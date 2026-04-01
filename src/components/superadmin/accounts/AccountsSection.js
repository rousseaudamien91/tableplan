/* eslint-disable */
import { useState } from "react";

// i18n (nouveau système)
import { useI18n, LANG_FLAGS, LANG_NAMES } from "../../i18n";

// constantes (couleurs, vouchers, plans)
import { C, VOUCHERS, PLANS } from "../../constants";

// UI
import { Btn } from "../../components/UI";

function AccountsSection({
  users,
  setUsers,
  enrichedUsers,
  stats,
  SUBSCRIPTION_PLANS,
  STATUS_COLORS,
  cardStyle,
}) {
  const { t } = useI18n();

  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showSubscription, setShowSubscription] = useState(null);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "admin",
    plan: "free",
    subscriptionStatus: "trial",
  });

  const filteredUsers = enrichedUsers.filter((u) => {
    if (filterPlan !== "all" && u.plan !== filterPlan) return false;
    if (filterStatus !== "all" && u.subscriptionStatus !== filterStatus)
      return false;
    if (
      search &&
      !u.name?.toLowerCase().includes(search.toLowerCase()) &&
      !u.email?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const soon = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(Date.now() + 7 * 86400000);
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSaveSubscription = () => {
    if (!showSubscription) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === showSubscription.id
          ? {
              ...u,
              plan: showSubscription.plan,
              subscriptionStatus: showSubscription.subscriptionStatus,
              subscriptionEnd: showSubscription.subscriptionEnd,
              stripeCustomerId: showSubscription.stripeCustomerId,
            }
          : u
      )
    );
    setShowSubscription(null);
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newUser,
        avatar: newUser.name.slice(0, 2).toUpperCase(),
        projectIds: [],
        subscriptionStart: new Date().toISOString().slice(0, 10),
        subscriptionEnd: new Date(
          Date.now() + 30 * 86400000
        )
          .toISOString()
          .slice(0, 10),
      },
    ]);
    setNewUser({
      name: "",
      email: "",
      role: "admin",
      plan: "free",
      subscriptionStatus: "trial",
    });
    setShowNewUser(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            {t("superadmin.accounts.title")}
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              margin: "4px 0 0",
              fontSize: 13,
            }}
          >
            {t("superadmin.accounts.subtitle", {
              count: filteredUsers.length,
              mrr: stats.mrr,
            })}
          </p>
        </div>
        <Btn onClick={() => setShowNewUser(true)}>
          {t("superadmin.accounts.newUser")}
        </Btn>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("superadmin.accounts.searchPlaceholder")}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "8px 14px",
            background: "#18182a",
            border: "1px solid rgba(201,151,58,0.15)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 13,
            outline: "none",
          }}
        />
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          style={{
            padding: "8px 14px",
            background: "#18182a",
            border: "1px solid rgba(201,151,58,0.15)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 13,
          }}
        >
          <option value="all">
            {t("superadmin.accounts.filter.allPlans")}
          </option>
          {Object.entries(SUBSCRIPTION_PLANS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 14px",
            background: "#18182a",
            border: "1px solid rgba(201,151,58,0.15)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 13,
          }}
        >
          <option value="all">
            {t("superadmin.accounts.filter.allStatuses")}
          </option>
          <option value="active">{t("superadmin.status.active")}</option>
          <option value="trial">{t("superadmin.status.trial")}</option>
          <option value="expired">{t("superadmin.status.expired")}</option>
          <option value="cancelled">
            {t("superadmin.status.cancelled")}
          </option>
        </select>
      </div>

      <div
        style={{
          background: "#18182a",
          border: "1px solid rgba(201,151,58,0.1)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto",
            gap: 12,
            padding: "12px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          <span>{t("superadmin.accounts.table.account")}</span>
          <span>{t("superadmin.accounts.table.plan")}</span>
          <span>{t("superadmin.accounts.table.status")}</span>
          <span>{t("superadmin.accounts.table.end")}</span>
          <span>{t("superadmin.accounts.table.projects")}</span>
          <span>{t("superadmin.accounts.table.guests")}</span>
          <span>{t("superadmin.accounts.table.actions")}</span>
        </div>
        {filteredUsers.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {t("superadmin.accounts.empty")}
          </div>
        )}
        {filteredUsers.map((u) => {
          const plan = SUBSCRIPTION_PLANS[u.plan] || SUBSCRIPTION_PLANS.free;
          const sColor =
            STATUS_COLORS[u.subscriptionStatus] || STATUS_COLORS.trial;
          const isSoon = soon(u.subscriptionEnd);

          return (
            <div
              key={u.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto",
                gap: 12,
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(255,255,255,0.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background:
                      u.role === "superadmin"
                        ? C.red + "33"
                        : C.gold + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      u.role === "superadmin"
                        ? C.red
                        : C.gold,
                    fontSize: 12,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {u.avatar || "?"}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {u.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {u.email}
                  </div>
                </div>
              </div>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: plan.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: plan.color,
                    fontWeight: 600,
                  }}
                >
                  {plan.label}
                </span>
              </span>

              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 99,
                  background: sColor + "22",
                  color: sColor,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {u.subscriptionStatus === "active"
                  ? t("superadmin.status.activeWithIcon")
                  : u.subscriptionStatus === "trial"
                  ? t("superadmin.status.trialWithIcon")
                  : u.subscriptionStatus === "expired"
                  ? t("superadmin.status.expiredWithIcon")
                  : t("superadmin.status.cancelledWithIcon")}
              </span>

              <span
                style={{
                  fontSize: 12,
                  color: isSoon
                    ? "#F0C97A"
                    : "rgba(255,255,255,0.4)",
                }}
              >
                {u.subscriptionEnd
                  ? (isSoon ? "⚠️ " : "") + u.subscriptionEnd
                  : "—"}
              </span>

              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {u.projectCount}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {u.guestCount}
              </span>

              <div style={{ display: "flex", gap: 6 }}>
                {u.role !== "superadmin" && (
                  <>
                    <Btn
                      small
                      variant="ghost"
                      onClick={() => setShowSubscription(u)}
                    >
                      ✏️
                    </Btn>
                    <Btn
                      small
                      variant="danger"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      ✕
                    </Btn>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginTop: 24,
        }}
      >
        {[
          {
            label: t("superadmin.accounts.stats.active"),
            val: stats.activeSubscriptions,
            color: STATUS_COLORS.active,
          },
          {
            label: t("superadmin.accounts.stats.trial"),
            val: stats.trialUsers,
            color: STATUS_COLORS.trial,
          },
          {
            label: t("superadmin.accounts.stats.paid"),
            val: stats.proUsers,
            color: C.gold,
          },
          {
            label: t("superadmin.accounts.stats.mrr"),
            val: stats.mrr + "€",
            color: C.gold,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{ ...cardStyle, textAlign: "center", padding: 16 }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: s.color,
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* TODO : modals (Souscription + Nouveau compte) à extraire dans /Modals si tu veux aller plus loin */}
    </>
  );
}

export default AccountsSection;
