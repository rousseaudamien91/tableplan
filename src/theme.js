/* eslint-disable */

// ------------------------------------------------------------
// THEME SYSTEM (light / dark) based on palette C from constants.js
// ------------------------------------------------------------

import { useState, useEffect } from "react";
import { C } from "./constants";

// ------------------------------------------------------------
// THEMES CONFIG
// ------------------------------------------------------------

export const THEMES_CONFIG = {
  light: {
    name: "light",
    background: "#ffffff",
    text: C.darkText || "#111111",
    primary: C.primary || "#1A73E8",
    accent: C.accent || "#FFB800",
  },
  dark: {
    name: "dark",
    background: C.dark || "#0B0B0F",
    text: "#ffffff",
    primary: C.primary || "#1A73E8",
    accent: C.accent || "#FFB800",
  },
};

// ------------------------------------------------------------
// HOOK: useTheme
// ------------------------------------------------------------

export function useTheme(initialMode = "light") {
  const [mode, setMode] = useState(initialMode);

  const theme = THEMES_CONFIG[mode] || THEMES_CONFIG.light;

  useEffect(() => {
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
  }, [theme]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    mode,
    theme,
    colors: C,
    toggleTheme,
  };
}

// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------

export { C };
