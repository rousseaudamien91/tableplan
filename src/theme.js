/* eslint-disable */

import { useState, useEffect } from "react";
import { C, LANG_FLAGS, LANG_NAMES } from "./constants";

// ═══════════════════════════════════════════════════════════════
// THEMES CONFIG (light / dark UI)
// ═══════════════════════════════════════════════════════════════
export const THEMES_CONFIG = {
  light: {
    name:       "light",
    background: "#ffffff",
    text:       "#111111",
    primary:    "#1A73E8",
    accent:     "#FFB800",
  },
  dark: {
    name:       "dark",
    background: C.dark || "#0B0B0F",
    text:       "#ffffff",
    primary:    "#1A73E8",
    accent:     "#FFB800",
  },
};

// ═══════════════════════════════════════════════════════════════
// HOOK: useTheme
// ═══════════════════════════════════════════════════════════════
export function useTheme(initialMode = "dark") {
  const [mode, setMode] = useState(
    () => localStorage.getItem("tm_theme") || initialMode
  );
  const theme = THEMES_CONFIG[mode] || THEMES_CONFIG.dark;

  useEffect(() => {
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
    localStorage.setItem("tm_theme", mode);
  }, [mode, theme]);

  const toggleTheme = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  return { mode, theme, colors: C, toggleTheme };
}

// ═══════════════════════════════════════════════════════════════
// HOOK: useI18n — internationalisation basique
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  fr: {
    myEvents:        "Mes événements",
    welcome:         "Bienvenue",
    newEvent:        "Nouvel événement",
    tables:          "tables",
    guests:          "invités",
    unseated:        "non placés",
    placement:       "Placement",
    inDays:          "Dans",
    days:            "j",
    savedCloud:      "Sauvegardé ✓",
    searchPlaceholder: "Rechercher un événement ou un invité…",
    settingDate:     "Date",
    darkMode:        "Mode sombre",
    lightMode:       "Mode clair",
  },
  en: {
    myEvents:        "My events",
    welcome:         "Welcome",
    newEvent:        "New event",
    tables:          "tables",
    guests:          "guests",
    unseated:        "unseated",
    placement:       "Placement",
    inDays:          "In",
    days:            "d",
    savedCloud:      "Saved ✓",
    searchPlaceholder: "Search an event or guest…",
    settingDate:     "Date",
    darkMode:        "Dark mode",
    lightMode:       "Light mode",
  },
  es: {
    myEvents:        "Mis eventos",
    welcome:         "Bienvenido",
    newEvent:        "Nuevo evento",
    tables:          "mesas",
    guests:          "invitados",
    unseated:        "sin mesa",
    placement:       "Colocación",
    inDays:          "En",
    days:            "d",
    savedCloud:      "Guardado ✓",
    searchPlaceholder: "Buscar evento o invitado…",
    settingDate:     "Fecha",
    darkMode:        "Modo oscuro",
    lightMode:       "Modo claro",
  },
  de: {
    myEvents:        "Meine Veranstaltungen",
    welcome:         "Willkommen",
    newEvent:        "Neue Veranstaltung",
    tables:          "Tische",
    guests:          "Gäste",
    unseated:        "ohne Platz",
    placement:       "Platzierung",
    inDays:          "In",
    days:            "T",
    savedCloud:      "Gespeichert ✓",
    searchPlaceholder: "Veranstaltung oder Gast suchen…",
    settingDate:     "Datum",
    darkMode:        "Dunkelmodus",
    lightMode:       "Hellmodus",
  },
  it: {
    myEvents:        "I miei eventi",
    welcome:         "Benvenuto",
    newEvent:        "Nuovo evento",
    tables:          "tavoli",
    guests:          "ospiti",
    unseated:        "senza posto",
    placement:       "Disposizione",
    inDays:          "Fra",
    days:            "g",
    savedCloud:      "Salvato ✓",
    searchPlaceholder: "Cerca evento o ospite…",
    settingDate:     "Data",
    darkMode:        "Modalità scura",
    lightMode:       "Modalità chiara",
  },
};

export function useI18n(userId) {
  const storageKey = userId ? "tableMaitreLang_" + userId : "tableMaitreLang";
  const [lang, setLangState] = useState(
    () => localStorage.getItem(storageKey) || navigator.language?.slice(0, 2) || "fr"
  );

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem(storageKey, l);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  return { t, lang, setLang, LANG_FLAGS, LANG_NAMES };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════
export { C, LANG_FLAGS, LANG_NAMES };
