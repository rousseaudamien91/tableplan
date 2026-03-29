/* eslint-disable */
import { useState } from "react";
import { C, useI18n } from "../theme";
import { LANG_FLAGS, LANG_NAMES } from "../constants";

function LoginScreen({ onLogin, onGuestLogin, t: tProp }) {
  const { t: tHook, lang, setLang } = useI18n();
  const t = tProp || tHook;
  const [hovered, setHovered] = useState(null);

  const FEATURES = [
    {
      icon: "@",
      title: t.loginF1 || "Plan de salle interactif",
      desc: t.loginF1d || "Glissez-déposez vos tables sur un canvas intuitif",
    },
    {
      icon: "@",
      title: t.loginF2 || "RSVP & invitations",
      desc: t.loginF2d || "Suivez les confirmations en temps réel",
    },
    {
      icon: "@",
      title: t.loginF3 || "Exports premium",
      desc: t.loginF3d || "PDF, chevalets imprimables, QR codes invités",
    },
    {
      icon: "@",
      title: t.loginF4 || "IA proactive",
      desc: t.loginF4d || "Un assistant qui analyse et guide votre événement",
    },
  ];

  const TRUST = [
    t.loginTrust1 || "Mariages",
    t.loginTrust2 || "Galas",
    t.loginTrust3 || "Conférences",
    t.loginTrust4 || "Corporate",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d14",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#ffffff",
        overflowX: "hidden",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          height: 64,
          background: "rgba(13, 13, 20,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,151,58,0.2)",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 0.5,
            color: "#F0C97A",
          }}
        >
          TableMaître
        </span>

        <div style={{ flex: 1 }} />

        {/* Sélecteur de langue */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginRight: 20,
            background: "rgba(255, 255, 255,0.08)",
            borderRadius: 12,
            padding: "5px 8px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {Object.entries(LANG_FLAGS).map(([lk, flag]) => (
            <button
              key={lk}
              onClick={() => setLang(lk)}
              title={LANG_NAMES[lk]}
              style={{
                background:
                  lang === lk
                    ? "linear-gradient(135deg, #C9973A, #F0C97A)"
                    : "transparent",
                border: "none",
                borderRadius: 8
