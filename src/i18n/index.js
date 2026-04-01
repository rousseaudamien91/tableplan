/* eslint-disable */
import { useState } from "react";

// Import corrects (depuis le même dossier)
import fr from "./fr.js";
import en from "./en.js";
import es from "./es.js";
import de from "./de.js";
import it from "./it.js";

// Toutes les traductions disponibles
export const TRANSLATIONS = { fr, en, es, de, it };

// Détection automatique de la langue
function detectLang() {
  const saved = localStorage.getItem("tableMaitreLang");
  if (saved && TRANSLATIONS[saved]) return saved;

  const nav = navigator.language?.slice(0, 2).toLowerCase();
  return TRANSLATIONS[nav] ? nav : "en";
}

// Hook principal i18n
export function useI18n() {
  const [lang, setLangState] = useState(detectLang);

  const setLang = (l) => {
    localStorage.setItem("tableMaitreLang", l);
    setLangState(l);
    document.documentElement.lang = l;
  };

  return {
    t: TRANSLATIONS[lang],
    lang,
    setLang,
  };
}

// Drapeaux et noms
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
