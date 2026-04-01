/* eslint-disable */

// ═══════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════════

export const THEMES_CONFIG = {
  mariage: { label: "Mariage", icon: "💍", color: "#C9973A" },
  gala: { label: "Gala / Soirée", icon: "🥂", color: "#8B7EC8" },
  anniversaire: { label: "Anniversaire", icon: "🎂", color: "#E8845A" },
  conference: { label: "Conférence", icon: "🎤", color: "#4A9B7F" },
  autre: { label: "Autre", icon: "🎊", color: "#C9973A" },
};

// ═══════════════════════════════════════════════════════════════
// DIET OPTIONS
// ═══════════════════════════════════════════════════════════════

export const DIET_OPTIONS = [
  { id: "standard", label: "Standard", icon: "🍽️", color: C.muted },
  { id: "vegetarien", label: "Végétarien", icon: "🥗", color: "#4CAF50" },
  { id: "vegan", label: "Vegan", icon: "🌱", color: "#8BC34A" },
  { id: "sans-gluten", label: "Sans gluten", icon: "🌾", color: "#FF9800" },
];

// ═══════════════════════════════════════════════════════════════
// USERS / EVENTS
// ═══════════════════════════════════════════════════════════════

export const INITIAL_USERS = [];
export const INITIAL_EVENTS = [];

// ═══════════════════════════════════════════════════════════════
// PLANS
// ═══════════════════════════════════════════════════════════════

export const PLANS = {
  free: { label: "Gratuit", price: 0, maxEvents: 1, maxGuests: 30 },
  pro: { label: "Pro", price: 9.9, maxEvents: 999, maxGuests: 999 },
};

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
