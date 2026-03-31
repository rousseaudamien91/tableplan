/* eslint-disable */
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS (FR + EN + ES + DE + IT)
// ═══════════════════════════════════════════════════════════════

import fr from "./fr";
import en from "./en";
import es from "./es";
import de from "./de";
import it from "./it";

export const TRANSLATIONS = { fr, en, es, de, it };

// ═══════════════════════════════════════════════════════════════
// LANG DETECTION + HOOK
// ═══════════════════════════════════════════════════════════════

function detectLang() {
  const saved = localStorage.getItem("tableMaitreLang");
  if (saved && TRANSLATIONS[saved]) return saved;

  const nav = navigator.language || navigator.languages?.[0] || "fr";
  const code = nav.slice(0, 2).toLowerCase();

  return TRANSLATIONS[code] ? code : "en";
}

export function useI18n() {
  const [lang, setLangState] = useState(detectLang);

  const setLang = (l) => {
    localStorage.setItem("tableMaitreLang", l);
    setLangState(l);
    document.documentElement.lang = l;
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return { t, lang, setLang };
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const LANG_FLAGS = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
  it: "🇮🇹",
};

export const LANG_NAMES = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
};

export const C = {
  dark: "#120C08",
  mid: "#2A1A0E",
  card: "#1E1208",
  gold: "#C9973A",
  gold2: "#E8C46A",
  cream: "#F5EAD4",
  light: "#EDD9A3",
  muted: "#8A7355",
  red: "#C0392B",
  green: "#27AE60",
  blue: "#2980B9",
  border: "rgba(201,151,58,0.2)",
};

export const THEMES_CONFIG = {
  mariage: { label: "Mariage", icon: "💍", color: "#C9973A" },
  gala: { label: "Gala / Soirée", icon: "🥂", color: "#8B7EC8" },
  anniversaire: { label: "Anniversaire", icon: "🎂", color: "#E8845A" },
  conference: { label: "Conférence", icon: "🎤", color: "#4A9B7F" },
  autre: { label: "Autre", icon: "🎊", color: "#C9973A" },
};

export const DIET_OPTIONS = [
  { id: "standard", label: "Standard", icon: "🍽️", color: C.muted },
  { id: "vegetarien", label: "Végétarien", icon: "🥗", color: "#4CAF50" },
  { id: "vegan", label: "Vegan", icon: "🌱", color: "#8BC34A" },
  { id: "sans-gluten", label: "Sans gluten", icon: "🌾", color: "#FF9800" },
];

export const INITIAL_USERS = [];

export const PLANS = {
  free: { label: "Gratuit", price: 0, maxEvents: 1, maxGuests: 30 },
  pro: { label: "Pro", price: 9.9, maxEvents: 999, maxGuests: 999 },
};

export const INITIAL_EVENTS = [];

// ═══════════════════════════════════════════════════════════════
// PRICING + VOUCHERS
// ═══════════════════════════════════════════════════════════════

export const PRICING_PLANS = {
  free: {
    label: "Plan Gratuit",
    price: 0,
    description: "Fonctionnalités de base",
  },
  medium: {
    label: "Plan Essentiel",
    price: 19,
    description: "Plus de tables, plus d'invités",
  },
  full: {
    label: "Plan Complet",
    price: 39,
    description: "Toutes les fonctionnalités",
  },
};

export const VOUCHERS = {
  PROMO10: { discount: 10, description: "Réduction de 10%", maxUses: 999 },
  PROMO20: { discount: 20, description: "Réduction de 20%", maxUses: 999 },
};
