/* eslint-disable */
import { useTheme } from "../../theme";

export default function Select({ value, onChange, children, style = {} }) {
  const { theme } = useTheme();

  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        background: theme.card,
        border: `1px solid ${theme.border}`,
        color: theme.text,
        fontSize: 14,
        outline: "none",
        cursor: "pointer",
        transition: "all .22s ease",
        fontFamily: "inherit",
        appearance: "none",
        backgroundImage:
          "linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.4) 50%), linear-gradient(135deg, rgba(255,255,255,0.4) 50%, transparent 50%)",
        backgroundPosition:
          "calc(100% - 18px) calc(50% - 3px), calc(100% - 12px) calc(50% - 3px)",
        backgroundSize: "6px 6px, 6px 6px",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    >
      {children}
    </select>
  );
}
