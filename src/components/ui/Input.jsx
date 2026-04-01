/* eslint-disable */
import { useEffect, useState } from "react";
import { useTheme } from "../../theme";

export default function Modal({
  title,
  onClose,
  children,
  width = 520,
  open = false,
}) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(open);

  // Animation d’apparition / disparition
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      // délai pour laisser l’animation se jouer
      setTimeout(() => setVisible(false), 180);
    }
  }, [open]);

  if (!open && !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: open
          ? "rgba(0,0,0,0.55)"
          : "rgba(0,0,0,0.0)",
        backdropFilter: open ? "blur(6px)" : "blur(0px)",
        transition: "all .25s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          padding: "28px 32px",
          width: "90%",
          maxWidth: width,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: theme.shadow,
          position: "relative",
          transform: open ? "translateY(0px)" : "translateY(20px)",
          opacity: open ? 1 : 0,
          transition: "all .25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
            paddingBottom: 16,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              letterSpacing: 0.3,
            }}
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              color: theme.textMuted,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.primary + "22";
              e.currentTarget.style.color = theme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = theme.textMuted;
            }}
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
