/* eslint-disable */
import { useState } from "react";
import { TRANSLATIONS } from "./constants";

// ═══════════════════════════════════════════════════════════════
// THEME — Palette couleurs
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
// I18N — Détection langue + hook
// ═══════════════════════════════════════════════════════════════

function detectLang() {
  const saved = localStorage.getItem('tableMaitreLang');
  if (saved && TRANSLATIONS[saved]) return saved;
  const nav = navigator.language || navigator.languages?.[0] || 'fr';
  const code = nav.slice(0, 2).toLowerCase();
  return TRANSLATIONS[code] ? code : 'en';
}

// Hook i18n
function useI18n() {
  const [lang, setLangState] = useState(detectLang);
  const setLang = (l) => {
    localStorage.setItem('tableMaitreLang', l);
    setLangState(l);
    document.documentElement.lang = l;
  };
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return { t, lang, setLang };
}

// Drapeaux pour le sélecteur
const LANG_FLAGS = { fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹' };
const LANG_NAMES = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', it: 'Italiano' };




export { C, detectLang, useI18n };
