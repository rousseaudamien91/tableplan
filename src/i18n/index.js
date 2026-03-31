/* eslint-disable */
import { useState } from "react";

import fr from "./fr";
import en from "./en";
import es from "./es";
import de from "./de";
import it from "./it";

// Toutes les langues disponibles
export const TRANSLATIONS = { fr, en, es, de, it };

function detectLang() {
  const saved = localStorage.getItem("tableMaitreLang");
  if (saved && TRANSLATIONS[saved]) return saved;

  const nav = navigator.language?.slice(0, 2).toLowerCase();
  return TRANSLATIONS[nav] ? nav : "fr";
}

export function useI18n() {
  const [lang, setLangState] = useState(detectLang);

  const setLang = (l) => {
    localStorage.setItem("tableMaitreLang", l);
    setLangState(l);
    document.documentElement.lang = l;
  };

  const t = TRANSLATIONS[lang];
  return { t, lang, setLang };
}
