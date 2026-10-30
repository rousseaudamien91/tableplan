/* eslint-disable */
import { useState } from "react";
import { useTheme } from "../../theme";

export default function Input({
  value, onChange, placeholder, type = "text",
  disabled = false, onKeyDown, style = {}, autoFocus = false,
}) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 14px",
        background: theme.background || "#13131e",
        border: `1px solid ${focused ? (theme.primary || "#C9973A") : (theme.border || "rgba(201,151,58,0.2)")}`,
        borderRadius: 8,
        color: theme.text || "#ffffff",
        fontSize: 14,
        fontFamily: "inherit",
        outline: "none",
        transition: "border .2s",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "text",
        colorScheme: "dark",
        ...style,
      }}
    />
  );
}
