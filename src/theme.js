/* eslint-disable */
import { useState, useEffect } from "react";

// i18n (nouveau système)
import { useI18n, LANG_FLAGS, LANG_NAMES } from "./i18n";

// constantes (couleurs, plans, vouchers, etc.)
import { C, PRICING_PLANS, VOUCHERS, PLANS, THEMES_CONFIG } from "./constants";

// UI
import { Btn, Field, Input } from "./UI";


// ═══════════════════════════════════════════════════════════════
// THEME — Palette couleurs pro dark
// ═══════════════════════════════════════════════════════════════

const C = {
  dark:   "#0d0d14",
  mid:    "#13131e",
  card:   "#18182a",
  gold:   "#C9973A",
  gold2:  "#F0C97A",
  cream:  "#ffffff",
  light:  "#ffffff",
  muted:  "rgba(255,255,255,0.45)",
  red:    "#e05252",
  green:  "#27AE60",
  blue:   "#3b82f6",
  border: "rgba(201,151,58,0.18)",
};

// ═══════════════════════════════════════════════════════════════
// I18N — Langue liée au compte utilisateur
// ═══════════════════════════════════════════════════════════════

// Clé localStorage par user : tableMaitreLang_uid
// Avant connexion : tableMaitreLang (global)
function getLangKey(userId) {
  return userId ? 'tableMaitreLang_' + userId : 'tableMaitreLang';
}

function detectLang(userId) {
  // 1. Préférence sauvegardée pour cet utilisateur
  const userKey = getLangKey(userId);
  const saved = localStorage.getItem(userKey);
  if (saved && TRANSLATIONS[saved]) return saved;
  // 2. Fallback : préférence globale (migration anciens comptes)
  const global = localStorage.getItem('tableMaitreLang');
  if (global && TRANSLATIONS[global]) return global;
  // 3. Langue du navigateur
  const nav = navigator.language || navigator.languages?.[0] || 'fr';
  const code = nav.slice(0, 2).toLowerCase();
  return TRANSLATIONS[code] ? code : 'en';
}

// Hook principal — userId = fbUser.uid (undefined avant connexion)
function useI18n(userId) {
  const [lang, setLangState] = useState(() => detectLang(userId));

  // Recharger la langue quand l'utilisateur change (connexion / déconnexion)
  useEffect(() => {
    const saved = detectLang(userId);
    setLangState(saved);
    document.documentElement.lang = saved;
  }, [userId]);

  const setLang = (l) => {
    localStorage.setItem(getLangKey(userId), l);
    setLangState(l);
    document.documentElement.lang = l;
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return { t, lang, setLang };
}

// Drapeaux et noms pour le sélecteur
const LANG_FLAGS = { fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹' };
const LANG_NAMES = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', it: 'Italiano' };

export { C, detectLang, useI18n, LANG_FLAGS, LANG_NAMES };
