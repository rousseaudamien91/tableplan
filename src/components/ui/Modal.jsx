import React, { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  // Fermer avec ESC
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1a24",
          borderRadius: 14,
          padding: "24px 28px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 16,
              color: "#fff",
            }}
          >
            {title}
          </div>
        )}

        <div>{children}</div>

        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
