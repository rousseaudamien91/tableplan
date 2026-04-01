/* eslint-disable */

// ═══════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════
export const C = {
  dark:   "#120C08",
  mid:    "#2A1A0E",
  card:   "#1E1208",
  gold:   "#C9973A",
  gold2:  "#E8C46A",
  cream:  "#F5EAD4",
  light:  "#EDD9A3",
  muted:  "#8A7355",
  red:    "#C0392B",
  green:  "#27AE60",
  blue:   "#2980B9",
  border: "rgba(201,151,58,0.2)",
};

// ═══════════════════════════════════════════════════════════════
// THEMES / TYPES D'ÉVÉNEMENT
// ═══════════════════════════════════════════════════════════════
export const THEMES_CONFIG = {
  mariage:      { label: "Mariage",      icon: "💍", color: "#C9973A" },
  gala:         { label: "Gala / Soirée",icon: "🥂", color: "#8B7EC8" },
  anniversaire: { label: "Anniversaire", icon: "🎂", color: "#E8845A" },
  conference:   { label: "Conférence",   icon: "🎤", color: "#4A9B7F" },
  autre:        { label: "Autre",        icon: "🎊", color: "#C9973A" },
};

// ═══════════════════════════════════════════════════════════════
// LANGUAGES
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

// ═══════════════════════════════════════════════════════════════
// DIET OPTIONS
// ═══════════════════════════════════════════════════════════════
export const DIET_OPTIONS = [
  { id: "standard",    label: "Standard",     icon: "🍽️", color: C.muted },
  { id: "vegetarien",  label: "Végétarien",   icon: "🥗",  color: "#4CAF50" },
  { id: "vegan",       label: "Vegan",        icon: "🌱",  color: "#8BC34A" },
  { id: "sans-gluten", label: "Sans gluten",  icon: "🌾",  color: "#FF9800" },
  { id: "halal",       label: "Halal",        icon: "☪️",  color: "#2196F3" },
  { id: "kasher",      label: "Kasher",       icon: "✡️",  color: "#9C27B0" },
];

// ═══════════════════════════════════════════════════════════════
// BUDGET CATEGORIES
// ═══════════════════════════════════════════════════════════════
export const BUDGET_CATEGORIES = [
  { id: "traiteur",    label: "Traiteur",     icon: "🍽️" },
  { id: "salle",       label: "Salle",        icon: "🏛️" },
  { id: "musique",     label: "Musique / DJ", icon: "🎵" },
  { id: "fleurs",      label: "Fleurs / Déco",icon: "🌸" },
  { id: "photo",       label: "Photo / Vidéo",icon: "📷" },
  { id: "transport",   label: "Transport",    icon: "🚗" },
  { id: "invitations", label: "Invitations",  icon: "💌" },
  { id: "tenue",       label: "Tenue",        icon: "👗" },
  { id: "divers",      label: "Divers",       icon: "📦" },
];

// ═══════════════════════════════════════════════════════════════
// USERS / EVENTS
// ═══════════════════════════════════════════════════════════════
export const INITIAL_USERS  = [];
export const INITIAL_EVENTS = [];

// ═══════════════════════════════════════════════════════════════
// PLANS
// ═══════════════════════════════════════════════════════════════
export const PLANS = {
  free: { label: "Gratuit",  price: 0,    maxEvents: 999, maxGuests: 10  },
  pro:  { label: "Pro",      price: 20,   maxEvents: 999, maxGuests: 50  },
  full: { label: "Complet",  price: 39,   maxEvents: 999, maxGuests: 999 },
};

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTION PLANS (SuperAdmin)
// ═══════════════════════════════════════════════════════════════
export const SUBSCRIPTION_PLANS = {
  free:       { label: "Gratuit",    price: 0,   color: "#8A7355" },
  starter:    { label: "Starter",    price: 9,   color: "#2980B9" },
  pro:        { label: "Pro",        price: 20,  color: "#C9973A" },
  enterprise: { label: "Enterprise", price: 39,  color: "#27AE60" },
};

// ═══════════════════════════════════════════════════════════════
// PRICING + VOUCHERS
// ═══════════════════════════════════════════════════════════════
export const PRICING_PLANS = {
  free:   { label: "Plan Gratuit",    price: 0,  description: "Jusqu'à 10 invités" },
  medium: { label: "Plan Essentiel",  price: 20, description: "Jusqu'à 50 invités" },
  full:   { label: "Plan Complet",    price: 39, description: "Invités illimités"   },
};

export const VOUCHERS = {
  PROMO10:  { discount: 10,  description: "Réduction de 10%",    maxUses: 999 },
  PROMO20:  { discount: 20,  description: "Réduction de 20%",    maxUses: 999 },
  FULL100:  { discount: 100, description: "Accès complet gratuit",maxUses: 10  },
};
