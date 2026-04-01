/* eslint-disable */

import { C } from "./palette";

export const THEMES = {
  dark: {
    name: "dark",
    background: C.dark,
    card: C.card,
    text: C.cream,
    textMuted: "rgba(255,255,255,0.55)",
    primary: C.gold,
    accent: C.gold2,
    border: C.border,
    shadow: "0 8px 32px rgba(0,0,0,0.45)",
    transition: "all .25s ease",
  },

  light: {
    name: "light",
    background: "#faf7f2",
    card: "#ffffff",
    text: "#1a1a1a",
    textMuted: "#6b6b6b",
    primary: C.gold,
    accent: C.gold2,
    border: "rgba(0,0,0,0.1)",
    shadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all .25s ease",
  },

  gold: {
    name: "gold",
    background: "#F5EAD4",
    card: "#ffffff",
    text: "#3a2a1a",
    textMuted: "#7a6a55",
    primary: C.gold,
    accent: C.gold2,
    border: "rgba(201,151,58,0.35)",
    shadow: "0 6px 28px rgba(201,151,58,0.25)",
    transition: "all .25s ease",
  },

  noir: {
    name: "noir",
    background: "#0B0B0F",
    card: "#14141c",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.45)",
    primary: "#E8C46A",
    accent: "#C9973A",
    border: "rgba(255,255,255,0.08)",
    shadow: "0 10px 40px rgba(0,0,0,0.6)",
    transition: "all .25s ease",
  },
};
