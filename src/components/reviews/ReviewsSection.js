// src/components/reviews/ReviewsSection.js
import React from "react";
import ReviewCard from "./ReviewCard";

const ReviewsSection = () => {
  const placeholderReviews = [
    {
      id: 1,
      author: "Coming soon",
      rating: 5,
      comment: "Les premiers avis arrivent très bientôt."
    }
  ];

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Avis & Retours</h2>

      <div style={styles.list}>
        {placeholderReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
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
