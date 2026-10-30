/* eslint-disable */
import { useEffect, useState } from "react";
import { useTheme } from "../../theme";

export default function Modal({ title, onClose, children, width = 520, open = false }) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) { setVisible(true); }
    else { setTimeout(() => setVisible(false), 180); }
  }, [open]);

  if (!open && !visible) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        background: open ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.0)",
        backdropFilter: open ? "blur(6px)" : "blur(0px)",
        transition: "all .25s ease",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          padding: "clamp(16px, 3vw, 32px)",
          width: "100%",
          maxWidth: Math.min(width, window.innerWidth - 32) + "px",
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          boxShadow: theme.shadow,
          position: "relative",
          transform: open ? "translateY(0px) scale(1)" : "translateY(20px) scale(0.97)",
          opacity: open ? 1 : 0,
          transition: "all .25s ease",
          margin: "auto",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
          paddingBottom: 16,
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <h2 style={{ margin: 0, fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 700, color: theme.text, letterSpacing: 0.3 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: `1px solid ${theme.border}`,
              borderRadius: 8, width: 32, height: 32, cursor: "pointer",
              color: theme.textMuted, fontSize: 18, display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "all .2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.primary + "22"; e.currentTarget.style.color = theme.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted; }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
