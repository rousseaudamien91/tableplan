/* eslint-disable */
import { useState } from "react";
import { Btn, Field, Input } from "../components/UI";
import { getFirebase } from "../firebase";

export default function NPSWidget({ user }) {
  const [open, setOpen] = useState(true);
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");

  if (!open) return null;

  const submit = async () => {
    if (score === null) return alert("Choisissez une note");

    const { db } = getFirebase();
    await db.collection("reviews").add({
      score,
      comment,
      userName: user?.name || "Anonyme",
      createdAt: Date.now(),
      approved: false
    });

    setOpen(false);
  };

  return (
    <div style={{
      position:"fixed",
      bottom:20,
      right:20,
      width:300,
      background:"#18182a",
      border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:12,
      padding:20,
      zIndex:9999
    }}>
      <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700}}>
        Votre avis compte ❤️
      </h3>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {Array.from({length:11}).map((_,i)=>(
          <button
            key={i}
            onClick={()=>setScore(i)}
            style={{
              width:28,height:28,
              borderRadius:6,
              border:"none",
              cursor:"pointer",
              background: score===i ? "#C9973A" : "#2a2a3d",
              color:"#fff",
              fontWeight:700
            }}
          >
            {i}
          </button>
        ))}
      </div>

      <Field label="Commentaire (optionnel)">
        <Input
          value={comment}
          onChange={e=>setComment(e.target.value)}
          placeholder="Dites-nous tout…"
        />
      </Field>

      <Btn onClick={submit} style={{marginTop:10}}>Envoyer</Btn>
    </div>
  );
}
