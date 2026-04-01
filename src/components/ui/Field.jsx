import React from "react";

export default function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
