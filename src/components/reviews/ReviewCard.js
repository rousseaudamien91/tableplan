import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <strong>{review.author}</strong>
        <span style={styles.rating}>{"⭐".repeat(review.rating)}</span>
      </div>
      <p style={styles.comment}>{review.comment}</p>
    </div>
  );
};

const styles = {
  card: {
    padding: "20px",
    borderRadius: "12px",
    background: "#f8f8f8",
    textAlign: "left",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },
  rating: {
    color: "#f5b50a"
  },
  comment: {
    margin: 0,
    opacity: 0.85
  }
};

export default ReviewCard;
