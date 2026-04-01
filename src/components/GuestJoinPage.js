/* eslint-disable */
import { useState, useEffect } from "react";

// i18n
import { useI18n } from "../i18n";

// constantes
import { C, DIET_OPTIONS, THEMES_CONFIG } from "../constants";

// UI premium
import Btn from "./ui/Btn";
import Badge from "./ui/Badge";

// utils
import { dietInfo } from "../utils";

// thème
import { useTheme } from "../theme";

// firebase
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collectionGroup,
  query,
  where,
  limit,
  getDocs
} from "firebase/firestore";

function GuestJoinPage({ eventId }) {
  const { t, lang } = useI18n();
  const { theme } = useTheme();

  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(null);

  // LOAD EVENT
  useEffect(() => {
    async function loadEvent() {
      try {
        let eventData = null;

        if (eventId.includes("___")) {
          const [userId, evId] = eventId.split("___");
          const ref = doc(db, "users", userId, "events", evId);
          const snap = await getDoc(ref);
          if (snap.exists()) eventData = snap.data();
        } else {
          const q = query(
            collectionGroup(db, "events"),
            where("id", "==", eventId),
            limit(1)
          );
          const snap = await getDocs(q);
          if (!snap.empty) eventData = snap.docs[0].data();
        }

        setEv(eventData);
      } catch (e) {
        console.error("Erreur chargement event public:", e);
      }

      setLoading(false);
    }

    loadEvent();
  }, [eventId]);

  // LOADING
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ color: theme.primary, fontSize: 18 }}>
          🪑 {t.loading}
        </div>
      </div>
    );

  // EVENT NOT FOUND
  if (!ev)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.background,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: theme.primary }}>{t.eventNotFound}</h2>
        <p style={{ color: theme.textMuted }}>{t.eventNotFoundDesc}</p>
        <p style={{ color: theme.textMuted, fontSize: 12 }}>
          {t.eventNotFoundHelp}
        </p>
        <a
          href="/"
          style={{ marginTop: 24, color: theme.primary, fontSize: 14 }}
        >
          ← {t.backHome}
        </a>
      </div>
    );

  const themeCfg = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const myTable = found ? ev.tables?.find((t) => t.id === found.tableId) : null;
  const seatedCount = (ev.guests || []).filter((g) => g.tableId).length;
  const totalGuests = (ev.guests || []).length;

  // FIRESTORE UPDATE
  async function saveGuests(updatedGuests) {
    try {
      if (!ev._ownerId || !ev.id) return;
      const ref = doc(db, "users", ev._ownerId, "events", String(ev.id));
      await updateDoc(ref, { guests: updatedGuests });
    } catch (e) {
      console.error("Firestore write:", e);
    }
  }

  // PAGE UI
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        padding: "20px 16px",
        color: theme.text
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{themeCfg.icon}</div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: theme.primary,
              marginBottom: 8
            }}
          >
            {ev.name}
          </h1>
          <p style={{ color: theme.textMuted, fontSize: 14 }}>
            📅{" "}
            {new Date(ev.date).toLocaleDateString(lang, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </p>
          {ev.notes && (
            <p
              style={{
                color: theme.textMuted,
                fontSize: 13,
                fontStyle: "italic",
                marginTop: 8
              }}
            >
              {ev.notes}
            </p>
          )}
        </div>

        {/* STATS */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 28
          }}
        >
          {[
            { label: t.tables, val: ev.tables?.length || 0, icon: "🪑" },
            { label: t.guests, val: totalGuests, icon: "👥" },
            { label: t.placed, val: seatedCount, icon: "✅" }
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: "12px 20px",
                textAlign: "center",
                flex: 1
              }}
            >
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div
                style={{
                  color: theme.primary,
                  fontSize: 20,
                  fontWeight: 700
                }}
              >
                {s.val}
              </div>
              <div style={{ color: theme.textMuted, fontSize: 11 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: 24,
            marginBottom: 20
          }}
        >
          <h3
            style={{
              color: theme.primary,
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 16
            }}
          >
            🔍 {t.findMySeat}
          </h3>

          <input
            placeholder={t.searchNamePlaceholder}
            onChange={(e) => {
              const q = e.target.value.toLowerCase();
              if (!q) {
                setFound(null);
                return;
              }
              const match = (ev.guests || []).find((g) =>
                g.name.toLowerCase().includes(q)
              );
              setFound(match || false);
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: theme.input,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              color: theme.text,
              fontSize: 15
            }}
          />

          {found === false && (
            <div style={{ marginTop: 12, color: "#E8845A", fontSize: 13 }}>
              ❌ {t.nameNotFound}
            </div>
          )}

          {found && (
            <div
              style={{
                marginTop: 16,
                background: theme.successBg,
                border: `1px solid ${theme.successBorder}`,
                borderRadius: 12,
                padding: 16
              }}
            >
              <p
                style={{
                  color: theme.success,
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 8
                }}
              >
                {t.hello(found)}
              </p>

              {myTable ? (
                <>
                  <p style={{ color: theme.success }}>{t.youAreAtTable(myTable)}</p>
                  <p style={{ color: theme.textMuted, fontSize: 12 }}>
                    {(ev.guests || []).filter((g) => g.tableId === myTable.id)
                      .length}{" "}
                    {t.peopleAtTable}
                  </p>
                </>
              ) : (
                <p style={{ color: "#E8845A", fontSize: 14 }}>
                  {t.notPlacedYet}
                </p>
              )}

              {/* DIET FORM */}
              <div
                style={{
                  borderTop: `1px solid ${theme.successBorder}`,
                  paddingTop: 12,
                  marginTop: 8
                }}
              >
                <p style={{ color: theme.success, fontSize: 13, marginBottom: 8 }}>
                  🍽 {t.yourDiet}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 12
                  }}
                >
                  {DIET_OPTIONS.map((d) => {
                    const isSelected = found.diet === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={async () => {
                          const updatedGuests = (ev.guests || []).map((g) =>
                            g.id === found.id ? { ...g, diet: d.id } : g
                          );
                          setEv((prev) => ({ ...prev, guests: updatedGuests }));
                          setFound((prev) => ({ ...prev, diet: d.id }));
                          await saveGuests(updatedGuests);
                        }}
                        style={{
                          background: isSelected ? theme.primary + "22" : theme.card,
                          border: `1px solid ${
                            isSelected ? theme.primary : theme.border
                          }`,
                          borderRadius: 99,
                          padding: "6px 14px",
                          cursor: "pointer",
                          color: isSelected ? theme.primary : theme.textMuted,
                          fontSize: 12
                        }}
                      >
                        {d.icon} {d.label}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  placeholder={t.notesPlaceholder}
                  defaultValue={found.notes || ""}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                    color: theme.text,
                    fontSize: 12,
                    resize: "vertical"
                  }}
                  onChange={(e) => {
                    const notes = e.target.value;
                    setFound((prev) => ({ ...prev, notes }));
                  }}
                  onBlur={async (e) => {
                    const notes = e.target.value;
                    const updatedGuests = (ev.guests || []).map((g) =>
                      g.id === found.id ? { ...g, notes } : g
                    );
                    setEv((prev) => ({ ...prev, guests: updatedGuests }));
                    await saveGuests(updatedGuests);
                  }}
                />

                <p style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }}>
                  {found.diet !== "standard" ? "✓ " : ""}
                  {t.preferencesSent}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* TABLE LIST */}
        {(ev.tables || []).length > 0 && (
          <div
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: 24
            }}
          >
            <h3
              style={{
                color: theme.primary,
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 16
              }}
            >
              🪑 {t.tablePlan}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(ev.tables || []).map((tbl) => {
                const tGuests = (ev.guests || []).filter(
                  (g) => g.tableId === tbl.id
                );
                return (
                  <div
                    key={tbl.id}
                    style={{
                      background: theme.card,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: `1px solid ${(tbl.color || theme.primary) + "44"}`
                    }}
                  >
                    <div
                      style={{
                        background: (tbl.color || theme.primary) + "22",
                        padding: "8px 16px",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span
                        style={{
                          color: tbl.color || theme.primary,
                          fontWeight: 700,
                          fontSize: 14
                        }}
                      >
                        {t.tableLabel(tbl)}
                      </span>
                      <span style={{ color: theme.textMuted, fontSize: 12 }}>
                        {tGuests.length}/{tbl.capacity}
                      </span>
                    </div>

                    <div
                      style={{
                        padding: "8px 16px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6
                      }}
                    >
                      {tGuests.length === 0 ? (
                        <span
                          style={{
                            color: theme.textMuted,
                            fontSize: 12,
                            fontStyle: "italic"
                          }}
                        >
                          {t.empty}
                        </span>
                      ) : (
                        tGuests.map((g) => (
                          <span
                            key={g.id}
                            style={{
                              background:
                                found && found.id === g.id
                                  ? theme.primary + "22"
                                  : theme.card,
                              border: `1px solid ${
                                found && found.id === g.id
                                  ? theme.primary
                                  : theme.border
                              }`,
                              borderRadius: 99,
                              padding: "3px 10px",
                              fontSize: 12,
                              color:
                                found && found.id === g.id
                                  ? theme.primary
                                  : theme.textMuted,
                              fontWeight:
                                found && found.id === g.id ? 700 : 400
                            }}
                          >
                            {g.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            color: theme.textMuted,
            fontSize: 11,
            marginTop: 24
          }}
        >
          {t.poweredBy}
        </p>
      </div>
    </div>
  );
}

export default GuestJoinPage;
