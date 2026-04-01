/* eslint-disable */
import { useState } from "react";
import { useTheme } from "../../theme";

export default function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  style = {},
}) {
  const { theme } = useTheme();
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const sizes = {
    sm: { padding: "6px 12px", fontSize: 12 },
    md: { padding: "9px 18px", fontSize: 14 },
    lg: { padding: "12px 22px", fontSize: 15 },
  };

  const variants = {
    primary: {
      background: hover
        ? `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`
        : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
      color: theme.background,
      boxShadow: press
        ? "0 2px 6px rgba(0,0,0,0.25)"
        : theme.shadow,
    },

    ghost: {
      background: hover ? theme.primary + "22" : "transparent",
      color: theme.primary,
      border: `1px solid ${theme.primary}55`,
      boxShadow: "none",
    },

    soft: {
      background: hover ? theme.card : theme.background,
      color: theme.text,
      border: `1px solid ${theme.border}`,
      boxShadow: hover ? theme.shadow : "none",
    },

    danger: {
      background: hover ? "#c94040" : "rgba(224,82,82,0.12)",
      color: hover ? "#fff" : "#e05252",
      border: hover ? "none" : "1px solid rgba(224,82,82,0.35)",
      boxShadow: hover ? "0 4px 16px rgba(224,82,82,0.35)" : "none",
    },
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    fontWeight: 600,
    letterSpacing: 0.3,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .22s ease",
    opacity: disabled ? 0.45 : 1,
    border: "none",
    transform: press ? "scale(0.97)" : "scale(1)",
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  return (
    <button
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPress(false);
      }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={base}
    >
      {children}
    </button>
  );
}
