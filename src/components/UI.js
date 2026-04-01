/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { C } from "../theme";

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS — Composants de base réutilisables
// ═══════════════════════════════════════════════════════════════

function Btn({ children, onClick, variant = "primary", small, style = {}, disabled }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: small ? "5px 12px" : "9px 18px",
    borderRadius: 8,
    fontSize: small ? 12 : 13,
    fontWeight: 600,
    letterSpacing: 0.3,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "all .18s",
    fontFamily: "inherit",
    opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    primary: {
      background: hov
        ? "linear-gradient(135deg,#d4a035,#F0C97A)"
        : "linear-gradient(135deg,#C9973A,#e8b85a)",
      color: "#0d0d14",
      boxShadow: hov
        ? "0 4px 16px rgba(201,151,58,0.45)"
        : "0 2px 8px rgba(201,151,58,0.25)",
    },
    ghost: {
      background: hov ? "rgba(201,151,58,0.12)" : "transparent",
      color: hov ? "#F0C97A" : "#C9973A",
      border: "1px solid rgba(201,151,58,0.35)",
      boxShadow: "none",
    },
    danger: {
      background: hov ? "#c94040" : "rgba(224,82,82,0.12)",
      color: hov ? "#fff" : "#e05252",
      border: hov ? "none" : "1px solid rgba(224,82,82,0.35)",
    },
    secondary: {
      background: hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
      color: "rgba(255,255,255,0.8)",
      border: "1px solid rgba(255,255,255,0.12)",
    },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
    >
      {children}
    </button>
  );
}

function Badge({ children, color, style = {} }) {
  const col = color || "#C9973A";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        background: col + "22",
        color: col,
        border: `1px solid ${col}44`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Modal({ title, onClose, children, width = 520, open }) {
  if (open === false) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#18182a",
          border: "1px solid rgba(201,151,58,0.2)",
          borderRadius: 16,
          padding: "28px 32px",
          width: "90%",
          maxWidth: width,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 0.3,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              width: 30,
              height: 30,
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
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

function Field({ label, children, style = {} }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
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

function Input({ value, onChange, placeholder, type = "text", style = {} }) {
  const [foc, setFoc] = useState(false);
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      onFocus={() => setFoc(true)}
      onBlur={() => setFoc(false)}
      style={{
        width: "100%",
        padding: "9px 12px",
        background: "rgba(255,255,255,0.05)",
        border: foc
          ? "1px solid rgba(201,151,58,0.6)"
          : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        color: "#ffffff",
        fontSize: 14,
        outline: "none",
        transition: "border .15s",
        boxSizing: "border-box",
        fontFamily: "inherit",
        ...style,
      }}
    />
  );
}

function Select({ value, onChange, children, style = {} }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "9px 12px",
        background: "#18182a",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        color: "#ffffff",
        fontSize: 14,
        outline: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {children}
    </select>
  );
}

function useQRLib() {
  const [ready, setReady] = useState(
    typeof window !== "undefined" && !!window.QRCode
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.QRCode) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);

  return ready;
}

function QRCodeWidget({ value, size = 180 }) {
  const ref = useRef(null);
  const libReady = useQRLib();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!libReady || !ref.current || !window.QRCode) return;
    ref.current.innerHTML = "";
    // C.dark / C.cream / C.mid / C.muted doivent exister dans ta palette
    new window.QRCode(ref.current, {
      text: value,
      width: size,
      height: size,
      colorDark: C.dark,
      colorLight: C.cream,
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }, [libReady, value, size]);

  if (!libReady) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: C.mid,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.muted,
          fontSize: 12,
        }}
      >
        Chargement…
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ lineHeight: 0, borderRadius: 8, overflow: "hidden" }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOM SHAPE EDITOR (constants éventuellement utilisés ailleurs)
// ═══════════════════════════════════════════════════════════════

const CANVAS_W = 800;
const CANVAS_H = 560;

export {
  Btn,
  Badge,
  Modal,
  Field,
  Input,
  Select,
  useQRLib,
  QRCodeWidget,
  CANVAS_W,
  CANVAS_H,
};
