/* eslint-disable */
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const C = {
  gold:    "#C9973A",
  gold2:   "#F0C97A",
  dark:    "#0d0d14",
  card:    "rgba(255,255,255,0.04)",
  border:  "rgba(201,151,58,0.2)",
  muted:   "rgba(255,255,255,0.45)",
};

function StarRating({ score }) {
  // NPS 0-10 → convertir en étoiles 1-5
  var stars = Math.round((score / 10) * 5);
  return (
    <div style={{ display:"flex", gap:3 }}>
      {[1,2,3,4,5].map(function(i) {
        return (
          <span key={i} style={{ fontSize:14, color: i<=stars ? C.gold : "rgba(255,255,255,0.15)" }}>★</span>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  var initials = (review.userName || "?")[0].toUpperCase();
  var scoreColor = review.score >= 9 ? "#27AE60" : review.score >= 7 ? C.gold : "#e05252";
  var date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("fr-FR", { month:"long", year:"numeric" }) : "";

  return (
    <div style={{
      background: C.card,
      border: "1px solid " + C.border,
      borderRadius: 16,
      padding: "24px",
      textAlign: "left",
      transition: "border-color .2s",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Accent bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background: "linear-gradient(90deg," + scoreColor + "," + scoreColor + "00)" }}/>

      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
        {/* Avatar */}
        <div style={{
          width:42, height:42, borderRadius:12,
          background: "linear-gradient(135deg," + C.gold + "33," + C.gold2 + "22)",
          border: "1px solid " + C.border,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16, fontWeight:800, color: C.gold,
        }}>
          {initials}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:"#ffffff" }}>
            {review.userName || "Utilisateur"}
          </div>
          <div style={{ fontSize:11, color: C.muted, marginTop:2 }}>
            {date}
          </div>
        </div>
        {/* Score badge */}
        <div style={{
          background: scoreColor + "22",
          border: "1px solid " + scoreColor + "44",
          borderRadius:8,
          padding:"4px 10px",
          fontSize:13, fontWeight:800, color: scoreColor,
        }}>
          {review.score}/10
        </div>
      </div>

      <StarRating score={review.score} />

      {review.comment && (
        <p style={{
          fontSize:14, color:"rgba(255,255,255,0.7)",
          lineHeight:1.65, marginTop:12, marginBottom:0,
          fontStyle:"italic",
        }}>
          "{review.comment}"
        </p>
      )}
    </div>
  );
}

function EmptyState({ t }) {
  return (
    <div style={{
      padding: "60px 24px",
      textAlign: "center",
      border: "1px dashed rgba(201,151,58,0.2)",
      borderRadius: 16,
      background: "rgba(201,151,58,0.03)",
    }}>
      <div style={{ fontSize:40, marginBottom:16 }}>⭐</div>
      <div style={{ fontWeight:700, fontSize:16, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>
        {t && t.reviewsEmptyTitle || "Aucun avis pour le moment"}
      </div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)" }}>
        {t && t.reviewsEmptySubtitle || "Les premiers avis apparaîtront bientôt."}
      </div>
    </div>
  );
}

var ReviewsSection = function(props) {
  var t = props.t;
  var [reviews, setReviews] = useState([]);
  var [loading, setLoading] = useState(true);
  var [stats, setStats] = useState(null);

  useEffect(function() {
    var load = async function() {
      try {
        var ref = collection(db, "reviews");
        var q = query(ref, where("approved", "==", true), orderBy("createdAt", "desc"));
        var snap = await getDocs(q);
        var data = snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); });
        setReviews(data);

        if (data.length > 0) {
          var total = data.reduce(function(sum, r) { return sum + (r.score || 0); }, 0);
          var avg = (total / data.length).toFixed(1);
          var promoters = data.filter(function(r) { return r.score >= 9; }).length;
          var detractors = data.filter(function(r) { return r.score <= 6; }).length;
          var nps = Math.round(((promoters - detractors) / data.length) * 100);
          setStats({ avg, nps, count: data.length });
        }
      } catch(e) {
        console.warn("ReviewsSection:", e.code);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section style={{
      padding: "80px 24px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(255,255,255,0.02)",
    }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <p style={{ fontSize:12, letterSpacing:4, textTransform:"uppercase", color: C.muted, marginBottom:12 }}>
            {t && t.reviewsTitle || "Avis des utilisateurs"}
          </p>
          <h2 style={{
            fontSize:"clamp(28px,4vw,42px)", fontWeight:800,
            fontFamily:"Georgia, serif", marginBottom:0, lineHeight:1.2,
          }}>
            {t && t.reviewsSubtitle || "Ce qu'ils en pensent"}
          </h2>
        </div>

        {/* Stats — uniquement si des avis existent */}
        {stats && (
          <div style={{
            display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap",
            marginBottom:48, padding:"24px",
            background: C.card,
            border: "1px solid " + C.border,
            borderRadius:16,
          }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:800, color: C.gold }}>{stats.avg}</div>
              <div style={{ fontSize:11, color: C.muted, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>
                {t && t.reviewsAvg || "Note moyenne"} / 10
              </div>
            </div>
            <div style={{ width:1, background: C.border }}/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:800, color: stats.nps >= 50 ? "#27AE60" : C.gold }}>
                {stats.nps > 0 ? "+" : ""}{stats.nps}
              </div>
              <div style={{ fontSize:11, color: C.muted, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>
                {t && t.reviewsNps || "Score NPS"}
              </div>
            </div>
            <div style={{ width:1, background: C.border }}/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:800, color:"#ffffff" }}>{stats.count}</div>
              <div style={{ fontSize:11, color: C.muted, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>
                {t && t.reviewsCount ? (typeof t.reviewsCount === "function" ? t.reviewsCount(stats.count) : t.reviewsCount) : "avis"}
              </div>
            </div>
          </div>
        )}

        {/* Liste ou empty state */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"40px 0", color: C.muted, fontSize:14 }}>
            ⏳ {t && t.loading || "Chargement…"}
          </div>
        ) : reviews.length > 0 ? (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
            gap:20,
          }}>
            {reviews.map(function(r) {
              return <ReviewCard key={r.id} review={r} />;
            })}
          </div>
        ) : (
          <EmptyState t={t} />
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
