import React from "react";

export default function Input({ style, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.05)",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        ...style,
      }}
    />
  );
}
