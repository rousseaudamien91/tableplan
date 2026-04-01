/* eslint-disable */
import { useTheme } from "../../theme";

export default function Field({ label, children, style = {} }) {
  const { theme } = useTheme();

  return (
    <div style={{ marginBottom: 18, ...style }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 12,
            fontWeight: 600,
            color: theme.textMuted,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
