import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const NPSWidget = () => {
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submitNPS = async () => {
    if (score === null) return;

    await addDoc(collection(db, "nps"), {
      score,
      createdAt: serverTimestamp()
    });

    setSubmitted(true);
  };

  if (submitted) {
    return <p style={styles.thanks}>Merci pour votre retour !</p>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Votre avis compte</h3>
      <p style={styles.subtitle}>Sur une échelle de 0 à 10</p>

      <div style={styles.scores}>
        {[...Array(11).keys()].map((n) => (
          <button
            key={n}
            style={{
              ...styles.scoreButton,
              background: score === n ? "#222" : "#eee",
              color: score === n ? "#fff" : "#000"
            }}
            onClick={() => setScore(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <button style={styles.submit} onClick={submitNPS}>
        Envoyer
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    borderRadius: "12px",
    background: "#fafafa",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: "40px"
  },
  title: { fontSize: "1.4rem", marginBottom: "10px" },
  subtitle: { opacity: 0.7, marginBottom: "20px" },
  scores: { display: "flex", gap: "8px", flexWrap: "wrap" },
  scoreButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem"
  },
  submit: {
    marginTop: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#222",
    color: "#fff",
    cursor: "pointer"
  },
  thanks: {
    padding: "20px",
    background: "#e8ffe8",
    borderRadius: "10px",
    textAlign: "center"
  }
};

export default NPSWidget;
