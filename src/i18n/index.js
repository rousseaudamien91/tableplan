/* eslint-disable */
import { useState } from "react";

// Import des fichiers de langue
import fr from "./fr";
import en from "./en";
import es from "./es";
import de from "./de";
import it from "./it";

// Table des traductions
export const TRANSLATIONS = { fr, en, es, de, it };

// Détection automatique
function detectLang() {
  const saved = localStorage.getItem("tableMaitreLang");
  if (saved && TRANSLATIONS[saved]) return saved;

  const nav = navigator.language?.slice(0, 2).toLowerCase();
  return TRANSLATIONS[nav] ? nav : "en";
}

// Hook principal
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

// Flags et noms
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
