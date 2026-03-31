import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import ReviewCard from "./ReviewCard";
import NPSWidget from "./NPSWidget";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setReviews(data);
      } catch (err) {
        console.error("Erreur Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const noReviewsFallback = [
    {
      id: "placeholder",
      author: "Coming soon",
      rating: 5,
      comment: "Les premiers retours arrivent très bientôt."
    }
  ];

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Avis & Retours</h2>

      <NPSWidget />

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div style={styles.list}>
          {(reviews.length > 0 ? reviews : noReviewsFallback).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
};

const styles = {
  section: {
    padding: "60px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "30px"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  }
};

export default ReviewsSection;
