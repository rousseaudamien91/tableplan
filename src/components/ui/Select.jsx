/* eslint-disable */
import { useTheme } from "../../theme";

export default function Select({ value, onChange, children, style = {}, disabled = false }) {
  const { theme } = useTheme();
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 14px",
        background: theme.background || "#13131e",
        border: `1px solid ${theme.border || "rgba(201,151,58,0.2)"}`,
        borderRadius: 8,
        color: theme.text || "#ffffff",
        fontSize: 14,
        fontFamily: "inherit",
        outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </select>
  );
}
