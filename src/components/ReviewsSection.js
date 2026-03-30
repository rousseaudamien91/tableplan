/* eslint-disable */
import { useState, useEffect } from "react";
import { C } from "../constants";
import { useI18n } from "../i18n";
import { getFirebase } from "../firebase";

// ─────────────────────────────────────────────
// NPS WIDGET
// ─────────────────────────────────────────────
export function NPSWidget({ user, onClose }) {
  const { t } = useI18n();

  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function labelFor(n) {
    if (n <= 3) return t.npsLabelBad;
    if (n <= 6) return t.npsLabelLow;
    if (n <= 8) return t.npsLabelGood;
    return t.npsLabelGreat;
  }

  async function submit() {
    if (score === null) return;
    setLoading(true);
    try {
      const fb = getFirebase();
      if (fb) {
        await fb.db.collection("reviews").add({
          userId: user?.id || "anonymous",
          userName: user?.name || t.npsAnonymousUser,
          score,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
          approved: false,
        });
      }
      setSubmitted(true);
      setTimeout(onClose, 3000);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div style={{
        position:"fixed", bottom:24, right:24, zIndex:1000,
        background:"#18182a", border:"1px solid rgba(39,174,96,0.4)",
        borderRadius:16, padding:"20px 24px", maxWidth:320,
        boxShadow:"0 8px 40px #00000066",
      }}>
        <div style={{ fontSize:24, marginBottom:8 }}>🙏</div>
        <div style={{ fontWeight:700, color:"#27AE60" }}>{t.npsThanks}</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:4 }}>
          {t.npsThanksSubtitle}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:1000,
      background:"#18182a", border:"1px solid rgba(201,151,58,0.2)",
      borderRadius:16, padding:"24px", maxWidth:360,
      boxShadow:"0 8px 40px #00000066",
      fontFamily:"'Inter','Segoe UI',sans-serif",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:"#ffffff" }}>{t.npsTitle}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:2 }}>
            {t.npsQuestion}
          </div>
        </div>
        <button onClick={onClose} style={{
          background:"none", border:"none", color:"rgba(255,255,255,0.3)",
          cursor:"pointer", fontSize:18, padding:0
        }}>✕</button>
      </div>

      {/* Scores */}
      <div style={{ display:"flex", gap:4, marginBottom:8, flexWrap:"wrap" }}>
        {Array.from({ length:11 }, (_, i) => (
          <button key={i} onClick={() => setScore(i)} style={{
            width:32, height:32, borderRadius:8, border:"none", cursor:"pointer",
            background: score === i
              ? (i >= 9 ? "#27AE60" : i >= 7 ? "#C9973A" : "#e05252")
              : "#13131e",
            color: score === i ? "#ffffff" : "rgba(255,255,255,0.5)",
            fontSize:12, fontWeight:700,
            transition:"all .15s",
          }}>{i}</button>
        ))}
      </div>

      {score !== null && (
        <div style={{
          fontSize:11,
          color: score >= 9 ? "#27AE60" : score >= 7 ? "#F0C97A" : "#e05252",
          marginBottom:12, fontWeight:600
        }}>
          {labelFor(score)} {score >= 9 ? "😊" : score >= 7 ? "🙂" : "😕"}
        </div>
      )}

      <div style={{
        fontSize:11, color:"rgba(255,255,255,0.4)",
        display:"flex", justifyContent:"space-between", marginBottom:12
      }}>
        <span>{t.npsScaleMin}</span>
        <span>{t.npsScaleMax}</span>
      </div>

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder={t.npsPlaceholder}
        rows={3}
        style={{
          width:"100%", padding:"10px 12px",
          background:"#13131e", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:8, color:"#ffffff", fontSize:12,
          resize:"vertical", outline:"none", marginBottom:12,
        }}
      />

      <button onClick={submit} disabled={score === null || loading} style={{
        width:"100%", padding:"10px", border:"none", borderRadius:8,
        cursor: score !== null ? "pointer" : "not-allowed",
        background: score !== null
          ? "linear-gradient(135deg,#C9973A,#F0C97A)"
          : "rgba(255,255,255,0.08)",
        color: score !== null ? "#0d0d14" : "rgba(255,255,255,0.3)",
        fontWeight:800, fontSize:13,
      }}>
        {loading ? t.npsSending : t.npsSubmit}
      </button>

      <div style={{
        fontSize:10, color:"rgba(255,255,255,0.2)",
        textAlign:"center", marginTop:8
      }}>
        {t.npsDisclaimer}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REVIEWS SECTION
// ─────────────────────────────────────────────
export function ReviewsSection() {
  const { t } = useI18n();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const fb = getFirebase();
    if (!fb) { setLoading(false); return; }

    fb.db.collection("reviews")
      .where("approved", "==", true)
      .orderBy("createdAt", "desc")
      .limit(9)
      .get()
      .then(snap => {
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  // Aucun avis
  if (reviews.length === 0) {
    return (
      <section style={{ padding:"48px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>💬</div>
          <h2 style={{
            fontSize:22, fontWeight:800, color:"#ffffff",
            margin:"0 0 8px", fontFamily:"Georgia,serif"
          }}>
            {t.reviewsEmptyTitle}
          </h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)" }}>
            {t.reviewsEmptySubtitle}
          </p>
        </div>
      </section>
    );
  }

  // Stats
  const promoters = reviews.filter(r => r.score >= 9).length;
  const detractors = reviews.filter(r => r.score <= 6).length;
  const nps = Math.round((promoters - detractors) / reviews.length * 100);
  const avgScore = (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1);

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
    <section style={{ padding:"64px 24px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h2 style={{
            fontSize:26, fontWeight:800, margin:"0 0 8px",
            color:"#ffffff", fontFamily:"Georgia,serif"
          }}>
            {t.reviewsTitle}
          </h2>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", margin:"0 0 24px" }}>
            {t.reviewsCount(reviews.length)}
          </p>

          {/* KPIs */}
          <div style={{
            display:"inline-flex", gap:32, padding:"16px 32px",
            background:"#18182a", border:"1px solid rgba(201,151,58,0.15)",
            borderRadius:14
          }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:C.gold }}>
                {avgScore}<span style={{ fontSize:14 }}>/10</span>
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>
                {t.reviewsAvg}
              </div>
            </div>

            <div style={{ textAlign:"center" }}>
              <div style={{
                fontSize:28, fontWeight:800,
                color: nps >= 50 ? "#27AE60" : nps >= 0 ? "#C9973A" : "#e05252"
              }}>
                {nps >= 0 ? "+" : ""}{nps}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>
                {t.reviewsNps}
              </div>
            </div>

            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:"#27AE60" }}>
                {Math.round(promoters / reviews.length * 100)}%
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>
                {t.reviewsRecommend}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
          gap:16
        }}>
          {reviews.map(r => (
            <div key={r.id} style={{
              background:"#18182a",
              border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:14, padding:"20px"
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{
                  width:36, height:36, borderRadius:10,
                  background: scoreColor(r.score) + "22",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: scoreColor(r.score), fontWeight:800, fontSize:16,
                }}>{r.score}</div>

                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#ffffff" }}>
                    {r.userName || t.npsAnonymousUser}
                  </div>
                  <div style={{ fontSize:11, color: scoreColor(r.score) }}>
                    {scoreLabel(r.score)}
                  </div>
                </div>

                <div style={{ flex:1 }}/>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                </div>
              </div>

              {r.comment ? (
                <p style={{
                  fontSize:13, color:"rgba(255,255,255,0.6)",
                  lineHeight:1.65, margin:0, fontStyle:"italic"
                }}>
                  "{r.comment}"
                </p>
              ) : (
                <p style={{
                  fontSize:12, color:"rgba(255,255,255,0.25)",
                  margin:0, fontStyle:"italic"
                }}>
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
