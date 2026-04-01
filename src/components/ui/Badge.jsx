/* eslint-disable */
import { useTheme } from "../../theme";

export default function Badge({
  children,
  color,
  style = {},
  soft = false,
}) {
  const { theme } = useTheme();

  const baseColor = color || theme.primary;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        background: soft ? baseColor + "22" : baseColor,
        color: soft ? baseColor : theme.background,
        border: soft ? `1px solid ${baseColor}55` : "none",
        transition: "all .22s ease",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
