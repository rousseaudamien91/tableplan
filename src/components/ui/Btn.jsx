import React from "react";

export default function Btn({ children, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "none",
        background: "linear-gradient(135deg,#C9973A,#F0C97A)",
        color: "#0d0d14",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 14,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
