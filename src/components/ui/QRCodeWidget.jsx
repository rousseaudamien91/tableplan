/* eslint-disable */
import { useEffect, useRef } from "react";
import { useTheme } from "../../theme";
import { useQRLib } from "./useQRLib"; // si tu l'as séparé, sinon adapte le chemin

export default function QRCodeWidget({ value, size = 180 }) {
  const ref = useRef(null);
  const libReady = useQRLib();
  const { theme, colors: C } = useTheme();

  useEffect(() => {
    if (!libReady || !ref.current || !window.QRCode) return;

    ref.current.innerHTML = "";

    new window.QRCode(ref.current, {
      text: value,
      width: size,
      height: size,
      colorDark: theme.text,
      colorLight: theme.card,
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }, [libReady, value, size, theme]);

  if (!libReady) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: theme.card,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.textMuted,
          fontSize: 12,
          border: `1px solid ${theme.border}`,
        }}
      >
        Chargement…
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        lineHeight: 0,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        padding: 6,
        background: theme.card,
      }}
    />
  );
}
