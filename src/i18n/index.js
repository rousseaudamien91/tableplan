/* eslint-disable */
import { useState } from "react";

/* -------------------------------------------------------------
   TRADUCTIONS — 5 LANGUES
------------------------------------------------------------- */

// 🇫🇷 Français
const TRANSLATIONS_FR = {
  appName: "TableMaître",
  logout: "Déconnexion",
  lightMode: "Passer en mode clair",
  darkMode: "Passer en mode sombre",
  codePromo: "🎟️ Code promo",
  myEvents: "Mes événements",
  welcome: "Bienvenue",
  searchPlaceholder: "Rechercher un événement ou un invité...",
  newEvent: "+ Nouvel événement",
  noEvents: "Aucun événement pour le moment",
  createFirst: "Créer mon premier événement",
  loginGoogle: "Se connecter avec Google",
  loginCta: "Commencer gratuitement",
  loginSubtitle: "Organiser. Placer. Impressionner.",
  loginHero: "La plateforme professionnelle d’organisation d’événements.",
  loginSub: "Créez vos plans de salle en quelques minutes.",
  loginDemo: "Essayer la démo",
  loginDemoWarning: "Mode démo : données non sauvegardées",
  loginFree: "100% gratuit pour commencer",
};

// 🇬🇧 English
const TRANSLATIONS_EN = {
  appName: "TableMaître",
  logout: "Sign out",
  lightMode: "Switch to light mode",
  darkMode: "Switch to dark mode",
  codePromo: "Promo code",
  myEvents: "My events",
  welcome: "Welcome",
  searchPlaceholder: "Search an event or a guest...",
  newEvent: "+ New event",
  noEvents: "No events yet",
  createFirst: "Create my first event",
  loginGoogle: "Sign in with Google",
  loginCta: "Start for free",
  loginSubtitle: "Organize. Place. Impress.",
  loginHero: "The professional event management platform.",
  loginSub: "Create your seating plans in minutes.",
  loginDemo: "Try demo",
  loginDemoWarning: "Demo mode: data not saved",
  loginFree: "100% free to start",
};

// 🇪🇸 Español
const TRANSLATIONS_ES = {
  appName: "TableMaître",
  logout: "Cerrar sesión",
  lightMode: "Modo claro",
  darkMode: "Modo oscuro",
  codePromo: "Código promocional",
  myEvents: "Mis eventos",
  welcome: "Bienvenido",
  searchPlaceholder: "Buscar evento o invitado...",
  newEvent: "+ Nuevo evento",
  noEvents: "Aún no hay eventos",
  createFirst: "Crear mi primer evento",
  loginGoogle: "Iniciar sesión con Google",
  loginCta: "Comenzar gratis",
  loginSubtitle: "Organizar. Colocar. Impresionar.",
  loginHero: "La plataforma profesional de gestión de eventos.",
  loginSub: "Crea tus planos de mesa en minutos.",
  loginDemo: "Probar demo",
  loginDemoWarning: "Modo demo: datos no guardados",
  loginFree: "100% gratis para empezar",
};

// 🇩🇪 Deutsch
const TRANSLATIONS_DE = {
  appName: "TableMaître",
  logout: "Abmelden",
  lightMode: "Heller Modus",
  darkMode: "Dunkler Modus",
  codePromo: "Aktionscode",
  myEvents: "Meine Veranstaltungen",
  welcome: "Willkommen",
  searchPlaceholder: "Veranstaltung oder Gast suchen...",
  newEvent: "+ Neue Veranstaltung",
  noEvents: "Keine Veranstaltungen",
  createFirst: "Mein erstes Event erstellen",
  loginGoogle: "Mit Google anmelden",
  loginCta: "Kostenlos starten",
  loginSubtitle: "Organisieren. Platzieren. Beeindrucken.",
  loginHero: "Die professionelle Event-Management-Plattform.",
  loginSub: "Erstellen Sie Sitzpläne in wenigen Minuten.",
  loginDemo: "Demo testen",
  loginDemoWarning: "Demo-Modus: Daten werden nicht gespeichert",
  loginFree: "100% kostenlos zum Start",
};

// 🇮🇹 Italiano
const TRANSLATIONS_IT = {
  appName: "TableMaître",
  logout: "Disconnettersi",
  lightMode: "Modalità chiara",
  darkMode: "Modalità scura",
  codePromo: "Codice promo",
  myEvents: "I miei eventi",
  welcome: "Benvenuto",
  searchPlaceholder: "Cerca evento o invitato...",
  newEvent: "+ Nuovo evento",
  noEvents: "Nessun evento",
  createFirst: "Crea il mio primo evento",
  loginGoogle: "Accedi con Google",
  loginCta: "Inizia gratis",
  loginSubtitle: "Organizzare. Posizionare. Impressionare.",
  loginHero: "La piattaforma professionale per eventi.",
  loginSub: "Crea i tuoi piani tavolo in pochi minuti.",
  loginDemo: "Prova demo",
  loginDemoWarning: "Modalità demo: dati non salvati",
  loginFree: "100% gratuito per iniziare",
};

/* -------------------------------------------------------------
   TABLE DES TRADUCTIONS
------------------------------------------------------------- */

export const TRANSLATIONS = {
  fr: TRANSLATIONS_FR,
  en: TRANSLATIONS_EN,
  es: TRANSLATIONS_ES,
  de: TRANSLATIONS_DE,
  it: TRANSLATIONS_IT,
};

/* -------------------------------------------------------------
   HOOK I18N
------------------------------------------------------------- */

function detectLang() {
  const saved = localStorage.getItem("tableMaitreLang");
  if (saved && TRANSLATIONS[saved]) return saved;

  const nav = navigator.language?.slice(0, 2).toLowerCase();
  return TRANSLATIONS[nav] ? nav : "en";
}

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

/* -------------------------------------------------------------
   CONSTANTES POUR LE SELECTEUR DE LANGUE
------------------------------------------------------------- */

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
