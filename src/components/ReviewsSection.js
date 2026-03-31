/* eslint-disable */
import { useState, useEffect } from "react";
import { C } from "../constants";
import { useI18n } from "../i18n";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

// ─────────────────────────────────────────────
// NPS WIDGET (vide pour l’instant)
// ─────────────────────────────────────────────
export function NPSWidget({ user, onClose }) {
  return null;
}

// ─────────────────────────────────────────────
// REVIEWS SECTION (Firebase v9 modulaire)
// ─────────────────────────────────────────────
export function ReviewsSection() {
  const { t } = useI18n();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function loadReviews() {
      try {
        const ref = collection(db, "reviews");

        const q = query(
          ref,
          where("approved", "==", true),
          orderBy("createdAt", "desc"),
          limit(9)
        );

        const snap = await getDocs(q);

        setReviews(
          snap.docs.map(d => ({
            id: d.id,
            ...d.data()
          }))
        );
      } catch (e) {
        console.error("Erreur chargement reviews:", e);
      }

      setLoading(false);
    }

    loadReviews();
  }, []);

  if (loading) return null;

  // Aucun avis
  if (reviews.length === 0) {
    return (
      <section style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 8px",
              fontFamily: "Georgia,serif"
            }}
          >
            {t.reviewsEmptyTitle}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            {t.reviewsEmptySubtitle}
          </p>
        </div>
      </section>
    );
  }

  // Stats
  const promoters = reviews.filter(r => r.score >= 9).length;
  const detractors = reviews.filter(r => r.score <= 6).length;
  const nps = Math.round(((promoters - detractors) / reviews.length) * 100);
  const avgScore = (
    reviews.reduce((s, r) => s + r.score, 0) / reviews.length
  ).toFixed(1);

  function scoreColor(s) {
    if (s >= 9) return "#27AE60";
    if (s >= 7) return "#C9973A";
    return "#e05252";
  }

  function scoreLabel(s) {
    if (s >= 9) return t.reviewPromoter;
    if (s >= 7) return t.reviewNeutral;
    return t.reviewDetractor;
  }

  return (
    <section
      style={{
        padding: "64px 24px",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              margin: "0 0 8px",
              color: "#ffffff",
              fontFamily: "Georgia,serif"
            }}
          >
            {t.reviewsTitle}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 24px"
            }}
          >
            {t.reviewsCount(reviews.length)}
          </p>

          {/* KPIs */}
          <div
            style={{
              display: "inline-flex",
              gap: 32,
              padding: "16px 32px",
              background: "#18182a",
              border: "1px solid rgba(201,151,58,0.15)",
              borderRadius: 14
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.gold
                }}
              >
                {avgScore}
                <span style={{ fontSize: 14 }}>/10</span>
              </div>
              <div
                style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
              >
                {t.reviewsAvg}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color:
                    nps >= 50
                      ? "#27AE60"
                      : nps >= 0
                      ? "#C9973A"
                      : "#e05252"
                }}
              >
                {nps >= 0 ? "+" : ""}
                {nps}
              </div>
              <div
                style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
              >
                {t.reviewsNps}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#27AE60"
                }}
              >
                {Math.round((promoters / reviews.length) * 100)}%
              </div>
              <div
                style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
              >
                {t.reviewsRecommend}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 16
          }}
        >
          {reviews.map(r => (
            <div
              key={r.id}
              style={{
                background: "#18182a",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "20px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: scoreColor(r.score) + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: scoreColor(r.score),
                    fontWeight: 800,
                    fontSize: 16
                  }}
                >
                  {r.score}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#ffffff"
                    }}
                  >
                    {r.userName || t.npsAnonymousUser}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: scoreColor(r.score)
                    }}
                  >
                    {scoreLabel(r.score)}
                  </div>
                </div>

                <div style={{ flex: 1 }} />
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.25)"
                  }}
                >
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : ""}
                </div>
              </div>

              {r.comment ? (
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.65,
                    margin: 0,
                    fontStyle: "italic"
                  }}
                >
                  "{r.comment}"
                </p>
              ) : (
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.25)",
                    margin: 0,
                    fontStyle: "italic"
                  }}
                >
                  {t.reviewNoComment}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
