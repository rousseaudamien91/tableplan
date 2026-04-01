/* eslint-disable */
import { useEffect, useState } from "react";
import { C } from "../../../constants";
import { Btn } from "../../UI";
import { getFirebase } from "../../../firebase";

// Traductions inline (sans dépendance à i18n externe)
const LABELS = {
  title:     "Avis en attente de modération",
  none:      "✅ Aucun avis en attente",
  anonymous: "Anonyme",
  approve:   "✅ Approuver",
  reject:    "🗑 Rejeter",
};

export default function ReviewsAdminSection({ cardStyle }) {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded]   = useState(false);

  useEffect(() => {
    const { db } = getFirebase();
    const unsub = db.collection("reviews")
      .where("approved", "==", false)
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setPendingReviews(list);
        setReviewsLoaded(true);
      });
    return unsub;
  }, []);

  const approveReview = async (id) => {
    const { db } = getFirebase();
    await db.collection("reviews").doc(id).update({ approved: true });
  };

  const rejectReview = async (id) => {
    const { db } = getFirebase();
    await db.collection("reviews").doc(id).delete();
  };

  return (
    <div style={{ padding: "24px 0" }}>
      <h3 style={{ color: C.gold, margin: "0 0 20px", fontWeight: 600, fontSize: 16 }}>
        ⭐ {LABELS.title}
        {pendingReviews.length > 0 && (
          <span style={{ marginLeft:8, background:"#e05252", color:"#fff", borderRadius:99, padding:"2px 8px", fontSize:12 }}>
            {pendingReviews.length}
          </span>
        )}
      </h3>

      {reviewsLoaded && pendingReviews.length === 0 && (
        <div style={{ color:"rgba(255,255,255,0.4)", fontStyle:"italic", padding:"32px 0", textAlign:"center" }}>
          {LABELS.none}
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {pendingReviews.map((r) => (
          <div key={r.id} style={{ background:"#18182a", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom: r.comment ? 8 : 12 }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background: r.score >= 9 ? "rgba(39,174,96,0.2)" : r.score >= 7 ? "rgba(201,151,58,0.2)" : "rgba(224,82,82,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color: r.score >= 9 ? "#27AE60" : r.score >= 7 ? "#C9973A" : "#e05252",
                fontWeight:800, fontSize:18,
              }}>
                {r.score}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"#ffffff" }}>
                  {r.userName || LABELS.anonymous}
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : ""}
                </div>
              </div>
            </div>

            {r.comment && (
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:"0 0 12px", fontStyle:"italic" }}>
                "{r.comment}"
              </p>
            )}

            <div style={{ display:"flex", gap:8 }}>
              <button
                onClick={() => approveReview(r.id)}
                style={{ padding:"6px 16px", border:"none", borderRadius:8, cursor:"pointer", background:"rgba(39,174,96,0.2)", color:"#27AE60", fontFamily:"inherit", fontSize:12, fontWeight:700 }}
              >
                {LABELS.approve}
              </button>
              <button
                onClick={() => rejectReview(r.id)}
                style={{ padding:"6px 16px", border:"none", borderRadius:8, cursor:"pointer", background:"rgba(224,82,82,0.15)", color:"#e05252", fontFamily:"inherit", fontSize:12, fontWeight:700 }}
              >
                {LABELS.reject}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
