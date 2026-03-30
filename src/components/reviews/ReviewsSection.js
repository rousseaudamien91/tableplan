/* eslint-disable */
import { useEffect, useState } from "react";
import { getFirebase } from "../firebase";
import { C } from "../constants";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const { db } = getFirebase();
    return db.collection("reviews")
      .where("approved", "==", true)
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setReviews(list);
      });
  }, []);

  return (
    <div style={{padding:"40px 20px",maxWidth:800,margin:"0 auto"}}>
      <h2 style={{marginBottom:20,fontSize:28,fontWeight:800}}>
        Ils nous recommandent ⭐
      </h2>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {reviews.map(r => (
          <div key={r.id} style={{
            background:"#18182a",
            border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:12,
            padding:"20px 24px"
          }}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{
                width:36,height:36,borderRadius:10,
                background:
                  r.score >= 9 ? "rgba(39,174,96,0.2)" :
                  r.score >= 7 ? "rgba(201,151,58,0.2)" :
                                 "rgba(224,82,82,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:
                  r.score >= 9 ? "#27AE60" :
                  r.score >= 7 ? "#C9973A" :
                                 "#e05252",
                fontWeight:800,fontSize:18
              }}>
                {r.score}
              </div>

              <div>
                <div style={{fontWeight:700,fontSize:14}}>{r.userName}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>
                  {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>

            {r.comment && (
              <p style={{
                fontSize:14,
                color:"rgba(255,255,255,0.7)",
                margin:"6px 0 0",
                fontStyle:"italic"
              }}>
                “{r.comment}”
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
