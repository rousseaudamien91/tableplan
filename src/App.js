/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// FIREBASE CONFIG
// ═══════════════════════════════════════════════════════════════

// Firebase chargé via CDN dans public/index.html
// Les variables firebase, db, auth sont globales (window.firebase...)

const firebaseConfig = {
  apiKey: "AIzaSyAtDeOELj6om9-9mEdKVRbXMPG-i13szSo",
  authDomain: "tableplan-c4a6b.firebaseapp.com",
  projectId: "tableplan-c4a6b",
  storageBucket: "tableplan-c4a6b.firebasestorage.app",
  messagingSenderId: "659977410619",
  appId: "1:659977410619:web:ae761fbf149f923990641e",
};

// Init Firebase (via CDN compat)
let _app, _auth, _db;
function getFirebase() {
  if (typeof window === "undefined" || !window.firebase) return null;
  if (!_app) {
    try {
      _app = window.firebase.apps.length ? window.firebase.apps[0] : window.firebase.initializeApp(firebaseConfig);
      _auth = window.firebase.auth();
      _db = window.firebase.firestore();
    } catch(e) { console.error("Firebase init error:", e); return null; }
  }
  return { auth: _auth, db: _db };
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════

// Échapper les caractères HTML pour éviter les injections XSS
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ═══════════════════════════════════════════════════════════════
// INTERNATIONALISATION (i18n)
// ═══════════════════════════════════════════════════════════════

const TRANSLATIONS = {
  fr: {
    // Navbar
    appName: "TableMaître",
    logout: "Déconnexion",
    lightMode: "Passer en mode clair",
    darkMode: "Passer en mode sombre",
    codePromo: "Code promo",
    // Dashboard
    myEvents: "Mes événements",
    welcome: "Bienvenue",
    searchPlaceholder: "Rechercher un événement ou un invité...",
    newEvent: "+ Nouvel événement",
    noEvents: "Aucun événement pour le moment",
    createFirst: "Créer mon premier événement",
    tables: "tables",
    guests: "invités",
    unseated: "non placés",
    placement: "Placement",
    guestsFound: "invité(s) trouvé(s)",
    duplicate: "Dupliquer cet événement",
    daysAgo: "passé",
    today: "Aujourd'hui !",
    inDays: "Dans",
    days: "j",
    // Event types
    mariage: "Mariage",
    gala: "Gala / Soirée",
    anniversaire: "Anniversaire",
    conference: "Conférence",
    autre: "Autre",
    // Event Editor
    back: "← Projets",
    autoPlace: "✨ Auto-placer",
    placeCards: "🖨 Chevalets",
    floorPlan: "📄 Plan PDF",
    qrCode: "QR Code",
    tabPlan: "🗺 Plan",
    tabGuests: "👥 Invités",
    tabFood: "🍽 Alimentation",
    tabConstraints: "⊘ Contraintes",
    tabRoom: "⬡ Salle",
    addTable: "+ Table",
    addGuest: "+ Invité",
    dietSummary: "📋 Récap alimentaire",
    unseatedList: "⚠ NON PLACÉS",
    seeAvailable: "👁 Voir places libres",
    tablesVisible: "✓ Tables visibles",
    clickToPlace: "👆 Cliquez sur une table pour y placer",
    undo: "↩ Annuler",
    // Guests
    search: "Rechercher un invité…",
    exportCSV: "⬇ Export CSV",
    importCSV: "⬆ Import CSV",
    // Table form
    tableNumber: "NUMÉRO",
    tableCapacity: "CAPACITÉ",
    tableShape: "FORME",
    tableLabel: "ÉTIQUETTE",
    tableColor: "COULEUR",
    createTable: "Créer la table",
    deleteTable: "Supprimer la table",
    round: "Ronde",
    rectangular: "Rectangulaire",
    // Guest form
    guestName: "NOM *",
    guestEmail: "EMAIL",
    guestDiet: "RÉGIME",
    guestAllergies: "ALLERGIES",
    guestTable: "TABLE",
    guestNotes: "NOTES",
    addGuestBtn: "Ajouter l'invité",
    noTable: "-- Non placé --",
    // Login
    loginGoogle: "Se connecter avec Google",
    loginSubtitle: "{t.loginSubtitle}",
    // Notifications
    savedCloud: "{t.savedCloud}",
    savedAuto: "{t.savedAuto}",
    // Voucher
    voucherTitle: "Code promotionnel",
    voucherApplied: "✓ Code appliqué !",
    // Misc
    loading: "Chargement…",
    skipToMain: "Passer au contenu principal",
    note: "📝",
    eventNotes: "LIEU / NOTES INTERNES",
    eventName: "NOM",
    eventDate: "DATE",
    eventType: "TYPE",
  },

  en: {
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
    tables: "tables",
    guests: "guests",
    unseated: "unseated",
    placement: "Seating",
    guestsFound: "guest(s) found",
    duplicate: "Duplicate this event",
    daysAgo: "past",
    today: "Today!",
    inDays: "In",
    days: "d",
    mariage: "Wedding",
    gala: "Gala / Party",
    anniversaire: "Birthday",
    conference: "Conference",
    autre: "Other",
    back: "← Projects",
    autoPlace: "✨ Auto-seat",
    placeCards: "🖨 Place cards",
    floorPlan: "📄 Floor plan PDF",
    qrCode: "QR Code",
    tabPlan: "🗺 Plan",
    tabGuests: "👥 Guests",
    tabFood: "🍽 Dietary",
    tabConstraints: "⊘ Constraints",
    tabRoom: "⬡ Room",
    addTable: "+ Table",
    addGuest: "+ Guest",
    dietSummary: "📋 Dietary summary",
    unseatedList: "⚠ UNSEATED",
    seeAvailable: "👁 Show available seats",
    tablesVisible: "✓ Tables highlighted",
    clickToPlace: "👆 Click a table to seat",
    undo: "↩ Undo",
    search: "Search a guest…",
    exportCSV: "⬇ Export CSV",
    importCSV: "⬆ Import CSV",
    tableNumber: "NUMBER",
    tableCapacity: "CAPACITY",
    tableShape: "SHAPE",
    tableLabel: "LABEL",
    tableColor: "COLOR",
    createTable: "Create table",
    deleteTable: "Delete table",
    round: "Round",
    rectangular: "Rectangular",
    guestName: "NAME *",
    guestEmail: "EMAIL",
    guestDiet: "DIET",
    guestAllergies: "ALLERGIES",
    guestTable: "TABLE",
    guestNotes: "NOTES",
    addGuestBtn: "Add guest",
    noTable: "-- Not seated --",
    loginGoogle: "Sign in with Google",
    loginSubtitle: "TABLE PLAN MANAGEMENT",
    savedCloud: "☁️ Saved to cloud",
    savedAuto: "☁️ Auto-saved",
    voucherTitle: "Promotional code",
    voucherApplied: "✓ Code applied!",
    loading: "Loading…",
    skipToMain: "Skip to main content",
    note: "📝",
    eventNotes: "VENUE / INTERNAL NOTES",
    eventName: "NAME",
    eventDate: "DATE",
    eventType: "TYPE",
  },

  es: {
    appName: "TableMaître",
    logout: "Cerrar sesión",
    lightMode: "Cambiar a modo claro",
    darkMode: "Cambiar a modo oscuro",
    codePromo: "Código promocional",
    myEvents: "Mis eventos",
    welcome: "Bienvenido",
    searchPlaceholder: "Buscar un evento o un invitado...",
    newEvent: "+ Nuevo evento",
    noEvents: "No hay eventos por el momento",
    createFirst: "Crear mi primer evento",
    tables: "mesas",
    guests: "invitados",
    unseated: "sin asiento",
    placement: "Asignación",
    guestsFound: "invitado(s) encontrado(s)",
    duplicate: "Duplicar este evento",
    daysAgo: "pasado",
    today: "¡Hoy!",
    inDays: "En",
    days: "d",
    mariage: "Boda",
    gala: "Gala / Fiesta",
    anniversaire: "Cumpleaños",
    conference: "Conferencia",
    autre: "Otro",
    back: "← Proyectos",
    autoPlace: "✨ Auto-sentar",
    placeCards: "🖨 Tarjetas",
    floorPlan: "📄 Plano PDF",
    qrCode: "Código QR",
    tabPlan: "🗺 Plano",
    tabGuests: "👥 Invitados",
    tabFood: "🍽 Alimentación",
    tabConstraints: "⊘ Restricciones",
    tabRoom: "⬡ Sala",
    addTable: "+ Mesa",
    addGuest: "+ Invitado",
    dietSummary: "📋 Resumen dietético",
    unseatedList: "⚠ SIN ASIENTO",
    seeAvailable: "👁 Ver asientos libres",
    tablesVisible: "✓ Mesas destacadas",
    clickToPlace: "👆 Haz clic en una mesa para sentar",
    undo: "↩ Deshacer",
    search: "Buscar un invitado…",
    exportCSV: "⬇ Exportar CSV",
    importCSV: "⬆ Importar CSV",
    tableNumber: "NÚMERO",
    tableCapacity: "CAPACIDAD",
    tableShape: "FORMA",
    tableLabel: "ETIQUETA",
    tableColor: "COLOR",
    createTable: "Crear mesa",
    deleteTable: "Eliminar mesa",
    round: "Redonda",
    rectangular: "Rectangular",
    guestName: "NOMBRE *",
    guestEmail: "EMAIL",
    guestDiet: "DIETA",
    guestAllergies: "ALERGIAS",
    guestTable: "MESA",
    guestNotes: "NOTAS",
    addGuestBtn: "Añadir invitado",
    noTable: "-- Sin asignar --",
    loginGoogle: "Iniciar sesión con Google",
    loginSubtitle: "GESTIÓN DE PLANES DE MESA",
    savedCloud: "☁️ Guardado en la nube",
    savedAuto: "☁️ Guardado automáticamente",
    voucherTitle: "Código promocional",
    voucherApplied: "✓ ¡Código aplicado!",
    loading: "Cargando…",
    skipToMain: "Ir al contenido principal",
    note: "📝",
    eventNotes: "LUGAR / NOTAS INTERNAS",
    eventName: "NOMBRE",
    eventDate: "FECHA",
    eventType: "TIPO",
  },

  de: {
    appName: "TableMaître",
    logout: "Abmelden",
    lightMode: "Zum hellen Modus wechseln",
    darkMode: "Zum dunklen Modus wechseln",
    codePromo: "Aktionscode",
    myEvents: "Meine Veranstaltungen",
    welcome: "Willkommen",
    searchPlaceholder: "Veranstaltung oder Gast suchen...",
    newEvent: "+ Neue Veranstaltung",
    noEvents: "Noch keine Veranstaltungen",
    createFirst: "Meine erste Veranstaltung erstellen",
    tables: "Tische",
    guests: "Gäste",
    unseated: "ohne Platz",
    placement: "Platzierung",
    guestsFound: "Gast/Gäste gefunden",
    duplicate: "Veranstaltung duplizieren",
    daysAgo: "vergangen",
    today: "Heute!",
    inDays: "In",
    days: "T",
    mariage: "Hochzeit",
    gala: "Gala / Party",
    anniversaire: "Geburtstag",
    conference: "Konferenz",
    autre: "Sonstiges",
    back: "← Projekte",
    autoPlace: "✨ Auto-Platzierung",
    placeCards: "🖨 Tischkarten",
    floorPlan: "📄 Saalplan PDF",
    qrCode: "QR-Code",
    tabPlan: "🗺 Plan",
    tabGuests: "👥 Gäste",
    tabFood: "🍽 Ernährung",
    tabConstraints: "⊘ Einschränkungen",
    tabRoom: "⬡ Saal",
    addTable: "+ Tisch",
    addGuest: "+ Gast",
    dietSummary: "📋 Ernährungsübersicht",
    unseatedList: "⚠ OHNE PLATZ",
    seeAvailable: "👁 Freie Plätze anzeigen",
    tablesVisible: "✓ Tische hervorgehoben",
    clickToPlace: "👆 Klicke einen Tisch zum Platzieren",
    undo: "↩ Rückgängig",
    search: "Gast suchen…",
    exportCSV: "⬇ CSV exportieren",
    importCSV: "⬆ CSV importieren",
    tableNumber: "NUMMER",
    tableCapacity: "KAPAZITÄT",
    tableShape: "FORM",
    tableLabel: "BEZEICHNUNG",
    tableColor: "FARBE",
    createTable: "Tisch erstellen",
    deleteTable: "Tisch löschen",
    round: "Rund",
    rectangular: "Rechteckig",
    guestName: "NAME *",
    guestEmail: "E-MAIL",
    guestDiet: "ERNÄHRUNG",
    guestAllergies: "ALLERGIEN",
    guestTable: "TISCH",
    guestNotes: "NOTIZEN",
    addGuestBtn: "Gast hinzufügen",
    noTable: "-- Nicht platziert --",
    loginGoogle: "Mit Google anmelden",
    loginSubtitle: "TISCHPLAN-VERWALTUNG",
    savedCloud: "☁️ In der Cloud gespeichert",
    savedAuto: "☁️ Automatisch gespeichert",
    voucherTitle: "Aktionscode",
    voucherApplied: "✓ Code angewendet!",
    loading: "Wird geladen…",
    skipToMain: "Zum Hauptinhalt springen",
    note: "📝",
    eventNotes: "ORT / INTERNE NOTIZEN",
    eventName: "NAME",
    eventDate: "DATUM",
    eventType: "TYP",
  },

  it: {
    appName: "TableMaître",
    logout: "Disconnetti",
    lightMode: "Passa alla modalità chiara",
    darkMode: "Passa alla modalità scura",
    codePromo: "Codice promozionale",
    myEvents: "I miei eventi",
    welcome: "Benvenuto",
    searchPlaceholder: "Cerca un evento o un ospite...",
    newEvent: "+ Nuovo evento",
    noEvents: "Nessun evento al momento",
    createFirst: "Crea il mio primo evento",
    tables: "tavoli",
    guests: "ospiti",
    unseated: "senza posto",
    placement: "Sistemazione",
    guestsFound: "ospite/i trovato/i",
    duplicate: "Duplica questo evento",
    daysAgo: "passato",
    today: "Oggi!",
    inDays: "Tra",
    days: "g",
    mariage: "Matrimonio",
    gala: "Gala / Serata",
    anniversaire: "Compleanno",
    conference: "Conferenza",
    autre: "Altro",
    back: "← Progetti",
    autoPlace: "✨ Disponi automaticamente",
    placeCards: "🖨 Segnaposto",
    floorPlan: "📄 Piano PDF",
    qrCode: "Codice QR",
    tabPlan: "🗺 Piano",
    tabGuests: "👥 Ospiti",
    tabFood: "🍽 Alimentazione",
    tabConstraints: "⊘ Vincoli",
    tabRoom: "⬡ Sala",
    addTable: "+ Tavolo",
    addGuest: "+ Ospite",
    dietSummary: "📋 Riepilogo dietetico",
    unseatedList: "⚠ SENZA POSTO",
    seeAvailable: "👁 Vedi posti liberi",
    tablesVisible: "✓ Tavoli evidenziati",
    clickToPlace: "👆 Clicca un tavolo per sistemare",
    undo: "↩ Annulla",
    search: "Cerca un ospite…",
    exportCSV: "⬇ Esporta CSV",
    importCSV: "⬆ Importa CSV",
    tableNumber: "NUMERO",
    tableCapacity: "CAPACITÀ",
    tableShape: "FORMA",
    tableLabel: "ETICHETTA",
    tableColor: "COLORE",
    createTable: "Crea tavolo",
    deleteTable: "Elimina tavolo",
    round: "Rotondo",
    rectangular: "Rettangolare",
    guestName: "NOME *",
    guestEmail: "EMAIL",
    guestDiet: "DIETA",
    guestAllergies: "ALLERGIE",
    guestTable: "TAVOLO",
    guestNotes: "NOTE",
    addGuestBtn: "Aggiungi ospite",
    noTable: "-- Non assegnato --",
    loginGoogle: "Accedi con Google",
    loginSubtitle: "GESTIONE PIANI TAVOLA",
    savedCloud: "☁️ Salvato nel cloud",
    savedAuto: "☁️ Salvato automaticamente",
    voucherTitle: "Codice promozionale",
    voucherApplied: "✓ Codice applicato!",
    loading: "Caricamento…",
    skipToMain: "Vai al contenuto principale",
    note: "📝",
    eventNotes: "LUOGO / NOTE INTERNE",
    eventName: "NOME",
    eventDate: "DATA",
    eventType: "TIPO",
  },
};

// Détecter la langue du navigateur / pays
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
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  return { t, lang, setLang };
}

// Drapeaux pour le sélecteur
const LANG_FLAGS = { fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹' };
const LANG_NAMES = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', it: 'Italiano' };




const C = {
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

const THEMES_CONFIG = {
  mariage:      { label: "Mariage",        icon: "💍", color: "#C9973A", bg: "linear-gradient(135deg,#1a0c08,#2a1a0e)" },
  gala:         { label: "Gala / Soirée",  icon: "🥂", color: "#8B7EC8", bg: "linear-gradient(135deg,#0d0a1a,#1a1530)" },
  anniversaire: { label: "Anniversaire",   icon: "🎂", color: "#E8845A", bg: "linear-gradient(135deg,#1a0e08,#2a1810)" },
  conference:   { label: "Conférence",     icon: "🎤", color: "#4A9B7F", bg: "linear-gradient(135deg,#081a12,#0e2a1e)" },
  bapteme:      { label: "Baptême",        icon: "🕊️", color: "#7ABDE8", bg: "linear-gradient(135deg,#081218,#0e1e2a)" },
  loto:         { label: "Loto / Casino",  icon: "🎰", color: "#E84A6A", bg: "linear-gradient(135deg,#1a0810,#2a0e18)" },
  autre:        { label: "Autre",          icon: "🎊", color: "#C9973A", bg: "linear-gradient(135deg,#120c08,#2a1a0e)" },
};

const DIET_OPTIONS = [
  { id: "standard",     label: "Standard",         icon: "🍽️", color: C.muted },
  { id: "vegetarien",   label: "Végétarien",        icon: "🥗", color: "#4CAF50" },
  { id: "vegan",        label: "Vegan",             icon: "🌱", color: "#8BC34A" },
  { id: "sans-gluten",  label: "Sans gluten",       icon: "🌾", color: "#FF9800" },
  { id: "halal",        label: "Halal",             icon: "☪️", color: "#2196F3" },
  { id: "casher",       label: "Casher",            icon: "✡️",  color: "#3F51B5" },
  { id: "sans-lactose", label: "Sans lactose",      icon: "🥛", color: "#9C27B0" },
  { id: "sans-noix",    label: "Allergie noix",     icon: "🥜", color: "#F44336" },
  { id: "sans-fruits-mer", label: "Allergie fruits de mer", icon: "🦞", color: "#E91E63" },
  { id: "diabetique",   label: "Diabétique",        icon: "💊", color: "#607D8B" },
];

// Auth 100% Firebase Google — aucun identifiant stocké dans le code
const INITIAL_USERS = [];

// ═══════════════════════════════════════════════════════════════
// PLANS & VOUCHERS
// ═══════════════════════════════════════════════════════════════

const PLANS = {
  free:   { label: "Gratuit", price: 0,    maxEvents: 1,   maxGuests: 30,  color: "#8A7355", icon: "🆓" },
  pro:    { label: "Pro",     price: 9.90, maxEvents: 999, maxGuests: 999, color: "#C9973A", icon: "⭐" },
  agence: { label: "Agence",  price: 29,   maxEvents: 999, maxGuests: 999, color: "#2A1A0e", icon: "🏢" },
};

const VOUCHERS = {
  "BIENVENUE":   { discount: 100, type: "percent", plan: "pro", description: "1 mois Pro offert 🎁",    maxUses: 999 },
  "MARIAGE2026": { discount: 50,  type: "percent", plan: "pro", description: "-50% sur le plan Pro 💍", maxUses: 100 },
  "PARTENAIRE":  { discount: 30,  type: "percent", plan: "pro", description: "-30% partenaire 🤝",      maxUses: 50  },
  "VIP100":      { discount: 100, type: "percent", plan: "pro", description: "Accès VIP gratuit 👑",    maxUses: 10  },
};


const INITIAL_EVENTS = [
  {
    id: 1, ownerId: "u1",
    name: "Mariage Martin × Dubois", date: "2025-09-14", type: "mariage", plan: "pro",
    roomShape: [
      { x: 60, y: 60 }, { x: 740, y: 60 }, { x: 740, y: 520 },
      { x: 450, y: 520 }, { x: 450, y: 380 }, { x: 60, y: 380 }
    ],
    tables: [
      { id: 1, number: 1, capacity: 8,  x: 160, y: 150, shape: "round",  label: "Famille" },
      { id: 2, number: 2, capacity: 10, x: 350, y: 150, shape: "round",  label: "Amis" },
      { id: 3, number: 3, capacity: 6,  x: 550, y: 150, shape: "round",  label: "Collègues" },
      { id: 4, number: 4, capacity: 8,  x: 160, y: 290, shape: "round",  label: "Famille" },
    ],
    guests: [
      { id: 1, name: "Marie Martin",    email: "marie@test.com",  tableId: 1, diet: "vegetarien",   notes: "", allergies: [] },
      { id: 2, name: "Jean Dupont",     email: "jean@test.com",   tableId: 1, diet: "standard",     notes: "", allergies: [] },
      { id: 3, name: "Sophie Laurent",  email: "",                tableId: 2, diet: "vegan",         notes: "Allergie noix sévère", allergies: ["sans-noix"] },
      { id: 4, name: "Pierre Moreau",   email: "",                tableId: 2, diet: "halal",         notes: "", allergies: [] },
      { id: 5, name: "Julie Petit",     email: "",                tableId: null, diet: "sans-gluten", notes: "", allergies: [] },
    ],
    constraints: [{ id: 1, a: 1, b: 2, type: "together" }],
    menu: { starter: "Velouté de butternut", main: "Filet de bœuf Wellington", dessert: "Pièce montée", vegOption: "Risotto aux champignons" },
  },
  {
    id: 2, ownerId: "u2",
    name: "Loto Municipal Automne", date: "2025-11-02", type: "loto", plan: "free",
    roomShape: [
      { x: 60, y: 60 }, { x: 740, y: 60 }, { x: 740, y: 520 }, { x: 60, y: 520 }
    ],
    tables: [
      { id: 1, number: 1, capacity: 10, x: 200, y: 180, shape: "rect", label: "" },
      { id: 2, number: 2, capacity: 10, x: 420, y: 180, shape: "rect", label: "" },
      { id: 3, number: 3, capacity: 10, x: 620, y: 180, shape: "rect", label: "" },
    ],
    guests: [],
    constraints: [],
    menu: null,
  },
];

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════

function dietInfo(id) { return DIET_OPTIONS.find(function(ditem){ return ditem.id === id; }) || DIET_OPTIONS[0]; }

function uid() { return Date.now() + Math.random().toString(36).slice(2); }

function printFloorPlan(ev) {
  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const seated = ev.guests.filter(g => g.tableId);
  const tableRows = ev.tables.map(t => {
    const guestsSec = ev.guests.filter(g => g.tableId === t.id);
    return `
      <div class="table-block">
        <div class="table-title">Table ${escapeHtml(String(t.number))}${t.label ? ` — ${escapeHtml(t.label)}` : ""}</div>
        <div class="table-count">${guestsSec.length}/${t.capacity} places</div>
        <ul class="guest-list">
          ${guestsSec.map(g => {
            const d = DIET_OPTIONS.find(function(ditem){ return ditem.id===g.diet; })||DIET_OPTIONS[0];
            return `<li>${escapeHtml(g.name)}${g.diet!=="standard"?` <span class="diet">${d.icon}</span>`:""}${g.notes?` <span class="note">${escapeHtml(g.notes)}</span>`:""}</li>`;
          }).join("")}
          ${guests.length === 0 ? '<li class="empty">— Vide —</li>' : ""}
        </ul>
      </div>`;
  }).join("");

  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
  <title>Plan de table — ${escapeHtml(ev.name)}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; color: #1a0e08; background: white; }
    .header { text-align: center; border-bottom: 2px solid ${theme.color}; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { font-size: 24px; font-weight: 400; letter-spacing: 2px; color: #1a0e08; }
    .header p { color: #8a7355; font-size: 12px; margin-top: 4px; letter-spacing: 1px; }
    .stats { display: flex; gap: 24px; justify-content: center; margin-bottom: 20px; font-size: 12px; color: #8a7355; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .table-block { border: 1px solid ${theme.color}66; border-radius: 8px; padding: 12px; break-inside: avoid; }
    .table-title { font-size: 14px; font-weight: 700; color: ${theme.color}; margin-bottom: 2px; }
    .table-count { font-size: 10px; color: #8a7355; margin-bottom: 8px; }
    .guest-list { list-style: none; }
    .guest-list li { font-size: 11px; padding: 3px 0; border-bottom: 1px solid #f0e8d8; color: #2a1a0e; }
    .guest-list li:last-child { border-bottom: none; }
    .diet { font-size: 12px; }
    .note { color: #8a7355; font-style: italic; font-size: 10px; }
    .empty { color: #ccc; font-style: italic; }
    .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #ccc; border-top: 1px solid #eee; padding-top: 10px; }
    @media print { .no-print { display: none; } }
  </style></head><body>
  <div class="no-print" style="text-align:center;padding:16px;">
    <button onclick="window.print()" style="padding:10px 28px;background:${theme.color};border:none;border-radius:99px;font-family:Georgia;font-size:14px;cursor:pointer;font-weight:700;color:white;">🖨 Imprimer / Exporter PDF</button>
  </div>
  <div class="header">
    <h1>${escapeHtml(ev.name)}</h1>
    <p>${escapeHtml(ev.date)} · ${ev.tables.length} tables · ${ev.guests.length} invités · ${seated.length} placés</p>
    ${ev.notes ? `<p style="margin-top:6px;font-style:italic">${escapeHtml(ev.notes)}</p>` : ""}
  </div>
  <div class="stats">
    <span>🪑 ${ev.tables.length} tables</span>
    <span>👤 ${ev.guests.length} invités</span>
    <span>✓ ${seated.length} placés</span>
    <span>⚠ ${ev.guests.length - seated.length} non placés</span>
  </div>
  <div class="grid">${tableRows}</div>
  <div class="footer">TableMaître · Plan généré le ${new Date().toLocaleDateString("fr-FR")}</div>
  </body></html>`);
  w.document.close();
}

function exportGuestsCSV(ev) {
  const headers = ["Nom", "Email", "Table", "Régime", "Allergies", "Notes"];
  const rows = ev.guests.map(g => {
    const table = ev.tables.find(t => t.id === g.tableId);
    const diet = dietInfo(g.diet);
    return [
      g.name,
      g.email || "",
      table ? `Table ${table.number}${table.label ? " - " + table.label : ""}` : "Non placé",
      diet.label,
      (g.allergies || []).map(a => dietInfo(a).label).join(" | "),
      g.notes || ""
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.name.replace(/[^a-z0-9]/gi, "_")}_invités.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Btn({ children, onClick, variant = "primary", small, style: s, disabled }) {
  const base = {
    border: "none", borderRadius: 99, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", fontWeight: 700, transition: "all .15s",
    padding: small ? "6px 14px" : "10px 22px",
    fontSize: small ? 12 : 14, opacity: disabled ? .5 : 1,
  };
  const variants = {
    primary:  { background: `linear-gradient(135deg,${C.gold},${C.gold2})`, color: C.dark },
    ghost:    { background: "transparent", border: `1px solid ${C.border}`, color: C.gold },
    danger:   { background: C.red + "22", border: `1px solid ${C.red}55`, color: C.red },
    muted:    { background: "transparent", border: `1px solid ${C.muted}44`, color: C.muted },
    success:  { background: C.green + "22", border: `1px solid ${C.green}55`, color: C.green },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...s }}>{children}</button>;
}

function Badge({ children, color = C.gold }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700,
      letterSpacing: .8, textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Modal({ open, onClose, title, width = 520, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: C.card, borderRadius: 20, padding: 32, width: "100%", maxWidth: width,
        border: `1px solid ${C.border}`, boxShadow: `0 32px 80px #000a`,
        maxHeight: "90vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, color: C.cream, fontFamily: "Georgia,serif", fontSize: 18, fontWeight: 400 }}>{title}</h3>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 5, letterSpacing: .5 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{hint}</div>}
    </label>
  );
}

const inputStyle = {
  display: "block", width: "100%", padding: "10px 14px",
  background: C.mid, border: `1px solid ${C.border}`, borderRadius: 10,
  color: C.cream, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit",
  outline: "none",
};

function Input({ value, onChange, placeholder, type = "text", ...rest }) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} {...rest} />;
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange} style={{ ...inputStyle, cursor: "pointer" }}>
      {children}
    </select>
  );
}

// ═══════════════════════════════════════════════════════════════
// QR LIB
// ═══════════════════════════════════════════════════════════════

function useQRLib() {
  const [ready, setReady] = useState(typeof window !== "undefined" && !!window.QRCode);
  useEffect(() => {
    if (window.QRCode) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

function QRCodeWidget({ value, size = 180 }) {
  const ref = useRef(null);
  const libReady = useQRLib();
  useEffect(() => {
    if (!libReady || !ref.current || !window.QRCode) return;
    ref.current.innerHTML = "";
    new window.QRCode(ref.current, { text: value, width: size, height: size, colorDark: C.dark, colorLight: C.cream, correctLevel: window.QRCode.CorrectLevel.H });
  }, [libReady, value, size]);
  if (!libReady) return <div style={{ width: size, height: size, background: C.mid, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 12 }}>Chargement…</div>;
  return <div ref={ref} style={{ lineHeight: 0, borderRadius: 8, overflow: "hidden" }} />;
}

// ═══════════════════════════════════════════════════════════════
// ROOM SHAPE EDITOR
// ═══════════════════════════════════════════════════════════════

const CANVAS_W = 800;
const CANVAS_H = 560;

function RoomShapeEditor({ shape, onChange }) {
  const svgRef = useRef(null);
  const [mode, setMode] = useState("view"); // view | draw | edit
  const [drawing, setDrawing] = useState([]);
  const [dragging, setDragging] = useState(null); // index of point being dragged

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  }, []);

  const handleSVGClick = useCallback((e) => {
    if (mode !== "draw") return;
    const pt = getSVGPoint(e);
    // Close polygon if clicking near first point
    if (drawing.length >= 3) {
      const first = drawing[0];
      if (Math.abs(pt.x - first.x) < 20 && Math.abs(pt.y - first.y) < 20) {
        onChange(drawing);
        setDrawing([]);
        setMode("view");
        return;
      }
    }
    setDrawing(prev => [...prev, pt]);
  }, [mode, drawing, getSVGPoint, onChange]);

  const handlePointMouseDown = (e, idx) => {
    if (mode !== "edit") return;
    e.stopPropagation();
    setDragging(idx);
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;
    const pt = getSVGPoint(e);
    const newShape = shape.map((p, i) => i === dragging ? pt : p);
    onChange(newShape);
  }, [dragging, shape, getSVGPoint, onChange]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const polyPoints = (pts) => pts.map(p => `${p.x},${p.y}`).join(" ");

  const presetRectangle = () => {
    onChange([{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}]);
    setMode("view");
  };
  const presetL = () => {
    onChange([{x:60,y:60},{x:740,y:60},{x:740,y:300},{x:450,y:300},{x:450,y:520},{x:60,y:520}]);
    setMode("view");
  };
  const presetU = () => {
    onChange([{x:60,y:60},{x:280,y:60},{x:280,y:300},{x:520,y:300},{x:520,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}]);
    setMode("view");
  };
  const presetHex = () => {
    const cx=400, cy=290, r=230;
    const pts = Array.from({length:6},(_,i)=>{
      const a = (i*60-30)*Math.PI/180;
      return {x:Math.round(cx+r*Math.cos(a)), y:Math.round(cy+r*Math.sin(a))};
    });
    onChange(pts); setMode("view");
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{color:C.muted,fontSize:12,letterSpacing:.5}}>FORME DE LA SALLE</span>
        <div style={{flex:1}}/>
        <Btn small variant={mode==="draw"?"primary":"ghost"} onClick={()=>{setMode(mode==="draw"?"view":"draw");setDrawing([])}}>
          {mode==="draw" ? "✏️ Annuler dessin" : "✏️ Dessiner"}
        </Btn>
        <Btn small variant={mode==="edit"?"primary":"ghost"} onClick={()=>setMode(mode==="edit"?"view":"edit")}>
          {mode==="edit" ? "✔ Terminer" : "⦿ Modifier points"}
        </Btn>
        <div style={{width:1,height:20,background:C.border}}/>
        <span style={{color:C.muted,fontSize:12}}>Présets :</span>
        <Btn small variant="muted" onClick={presetRectangle}>▭ Rect</Btn>
        <Btn small variant="muted" onClick={presetL}>⌐ L</Btn>
        <Btn small variant="muted" onClick={presetU}>U</Btn>
        <Btn small variant="muted" onClick={presetHex}>⬡ Hex</Btn>
      </div>

      {mode === "draw" && (
        <div style={{background:C.gold+"18",border:`1px solid ${C.gold}44`,borderRadius:8,padding:"8px 14px",marginBottom:10,fontSize:12,color:C.gold}}>
          Cliquez pour ajouter des points · Cliquez près du premier point pour fermer la forme ({drawing.length} points placés)
        </div>
      )}
      {mode === "edit" && (
        <div style={{background:C.blue+"18",border:`1px solid ${C.blue}44`,borderRadius:8,padding:"8px 14px",marginBottom:10,fontSize:12,color:C.blue}}>
          Glissez les points dorés pour modifier la forme de la salle
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        style={{
          width:"100%", display:"block", background:"#0a0604",
          borderRadius:12, border:`1px solid ${C.border}`,
          cursor: mode==="draw" ? "crosshair" : mode==="edit" ? "default" : "default",
        }}
        onClick={handleSVGClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.muted} strokeWidth=".3" strokeOpacity=".2"/>
          </pattern>
        </defs>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" />

        {/* Room polygon */}
        {shape.length >= 3 && (
          <polygon
            points={polyPoints(shape)}
            fill={C.gold + "0e"}
            stroke={C.gold}
            strokeWidth="2"
            strokeDasharray={mode==="draw"?"6,3":"none"}
          />
        )}

        {/* Drawing preview */}
        {mode === "draw" && drawing.length > 0 && (
          <>
            <polyline points={polyPoints(drawing)} fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="6,3" strokeOpacity=".6"/>
            {drawing.map((p,i) => (
              <circle key={i} cx={p.x} cy={p.y} r="5" fill={i===0?C.gold:C.gold2} stroke={C.dark} strokeWidth="1.5"/>
            ))}
          </>
        )}

        {/* Edit handles */}
        {mode === "edit" && shape.map((p,i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" style={{cursor:"grab"}} onMouseDown={e=>handlePointMouseDown(e,i)}/>
            <circle cx={p.x} cy={p.y} r="6" fill={C.gold} stroke={C.dark} strokeWidth="2" style={{cursor:"grab", pointerEvents:"none"}}/>
          </g>
        ))}

        {shape.length >= 3 && mode === "view" && shape.map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={C.gold} opacity=".5"/>
        ))}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INTERACTIVE FLOOR PLAN
// ═══════════════════════════════════════════════════════════════

const TABLE_R = 44;
const TABLE_RECT_W = 80;
const TABLE_RECT_H = 44;

function FloorPlan({ ev, onUpdateTables, onSelectTable, selectedTable, highlightAvailable }) {
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null); // { tableId, offsetX, offsetY }

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }, []);

  const handleMouseDown = (e, tableId) => {
    e.stopPropagation();
    const pt = getSVGPoint(e);
    const table = ev.tables.find(t => t.id === tableId);
    setDragging({ tableId, offsetX: pt.x - table.x, offsetY: pt.y - table.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const pt = getSVGPoint(e);
    onUpdateTables(ev.tables.map(t =>
      t.id === dragging.tableId
        ? { ...t, x: Math.max(50, Math.min(CANVAS_W-50, pt.x - dragging.offsetX)), y: Math.max(50, Math.min(CANVAS_H-50, pt.y - dragging.offsetY)) }
        : t
    ));
  }, [dragging, ev.tables, getSVGPoint, onUpdateTables]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const polyPoints = (pts) => pts.map(p => `${p.x},${p.y}`).join(" ");
  var theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={`Plan de table de l'événement. ${ev.tables.length} tables, ${ev.guests.filter(g=>g.tableId).length} invités placés sur ${ev.guests.length} au total.`}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{ width:"100%", display:"block", background:"#0a0604", borderRadius:12, border:`1px solid ${C.border}`, cursor:"default", userSelect:"none" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <defs>
        <pattern id="fp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.muted} strokeWidth=".3" strokeOpacity=".15"/>
        </pattern>
      </defs>
      <rect width={CANVAS_W} height={CANVAS_H} fill="url(#fp-grid)" />

      {/* Room */}
      {ev.roomShape?.length >= 3 && (
        <polygon points={polyPoints(ev.roomShape)} fill={theme.color + "08"} stroke={theme.color} strokeWidth="2"/>
      )}

      {/* Tables */}
      {ev.tables.map(t => {
        const seated = ev.guests.filter(g => g.tableId === t.id);
        const full = seated.length >= t.capacity;
        const sel = selectedTable === t.id;
        const available = highlightAvailable && !full;
        const col = sel ? C.gold : full ? C.green : available ? "#4CAF50" : (t.color || theme.color);
        const glowStyle = available ? { filter:"drop-shadow(0 0 8px #4CAF5066)" } : {};
        const diets = seated.filter(g => g.diet !== "standard");

        return (
          <g key={t.id} style={{ cursor: "grab", ...glowStyle }} onMouseDown={e => handleMouseDown(e, t.id)} onClick={() => onSelectTable(t.id === selectedTable ? null : t.id)}>
            <title>{`Table ${t.number}${t.label ? " — " + t.label : ""}
${seated.map(g=>g.name).join(", ") || "Vide"}
${seated.length}/${t.capacity} places`}</title>
            {t.shape === "rect" ? (
              <rect
                x={t.x - TABLE_RECT_W/2} y={t.y - TABLE_RECT_H/2}
                width={TABLE_RECT_W} height={TABLE_RECT_H}
                rx="8" fill={col + "22"} stroke={col} strokeWidth={sel?3:1.5}
              />
            ) : (
              <circle cx={t.x} cy={t.y} r={TABLE_R} fill={col + "22"} stroke={col} strokeWidth={sel?3:1.5}/>
            )}
            {sel && <circle cx={t.x} cy={t.y} r={TABLE_R+8} fill="none" stroke={col} strokeWidth="1" strokeDasharray="4,3" opacity=".5"/>}

            {/* Arc de remplissage */}
            {(() => {
              const pct = t.capacity > 0 ? seated.length / t.capacity : 0;
              const r = TABLE_R + 6;
              const circ = 2 * Math.PI * r;
              const dash = pct * circ;
              const fillCol = pct >= 1 ? C.green : pct > 0.7 ? "#E8845A" : col;
              return t.shape !== "rect" && pct > 0 ? (
                <circle cx={t.x} cy={t.y} r={r} fill="none" stroke={fillCol} strokeWidth="3"
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={circ * 0.25}
                  strokeLinecap="round" opacity=".7" style={{pointerEvents:"none"}}/>
              ) : null;
            })()}
            <text x={t.x} y={t.y-4} textAnchor="middle" fill={col} fontSize="15" fontWeight="700" fontFamily="Georgia,serif" style={{pointerEvents:"none"}}>{t.number}</text>
            <text x={t.x} y={t.y+13} textAnchor="middle" fill={col} fontSize="10" fontFamily="Georgia,serif" opacity=".8" style={{pointerEvents:"none"}}>{seated.length}/{t.capacity}</text>
            {t.label && <text x={t.x} y={t.y+27} textAnchor="middle" fill={col} fontSize="9" fontFamily="Georgia,serif" opacity=".6" style={{pointerEvents:"none"}}>{t.label}</text>}

            {/* Diet dots */}
            {diets.slice(0,4).map((g,i) => {
              const d = dietInfo(g.diet);
              const a = (i/4)*2*Math.PI - Math.PI/2;
              return <circle key={g.id} cx={t.x + (TABLE_R+10)*Math.cos(a)} cy={t.y + (TABLE_R+10)*Math.sin(a)} r="5" fill={d.color} stroke={C.dark} strokeWidth="1"/>;
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLACE CARD (CHEVALET) PRINT
// ═══════════════════════════════════════════════════════════════

function printPlaceCards(ev) {
  const guests = ev.guests.filter(g => g.tableId);
  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const accentColor = theme.color;

  const cardsHTML = guests.map(g => {
    const table = ev.tables.find(t => t.id === g.tableId);
    const diet = dietInfo(g.diet);
    return `
      <div class="card">
        <div class="card-inner">
          <!-- Front -->
          <div class="face front">
            <div class="ornament top">✦ ✦ ✦</div>
            <div class="event-name">${ev.name}</div>
            <div class="guest-name">${g.name}</div>
            ${g.diet !== "standard" ? `<div class="diet-badge">${diet.icon} ${diet.label}</div>` : ""}
            <div class="table-info">Table ${table?.number || "?"}</div>
            ${table?.label ? `<div class="table-label">${table.label}</div>` : ""}
            <div class="ornament bottom">— ${ev.date} —</div>
          </div>
          <!-- Back (plié) -->
          <div class="face back">
            <div class="back-content">
              <div class="back-table">Table ${table?.number || "?"}</div>
              ${table?.label ? `<div class="back-label">${table.label}</div>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("\n");

  const w = window.open("", "_blank");
  w.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Chevalets — ${ev.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f5f0e8;
      font-family: 'Cormorant Garamond', Georgia, serif;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 16px;
      border-bottom: 1px solid ${accentColor}66;
    }
    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: #2a1a0e;
      font-weight: 400;
      letter-spacing: 2px;
    }
    .header p { color: #8a7355; font-size: 12px; margin-top: 4px; letter-spacing: 1px; }
    .stats {
      text-align: center;
      margin-bottom: 24px;
      font-size: 12px;
      color: #8a7355;
      letter-spacing: 1px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .card {
      break-inside: avoid;
      perspective: 600px;
    }
    .card-inner {
      width: 100%;
    }
    /* Le chevalet = carte A6 pliée en deux */
    .face {
      width: 100%;
      min-height: 110px;
      border: 1.5px solid ${accentColor}88;
      position: relative;
      overflow: hidden;
    }
    .front {
      background: white;
      padding: 14px 12px 10px;
      text-align: center;
      border-bottom: none;
    }
    .back {
      background: #fdf6ec;
      padding: 10px 12px;
      text-align: center;
      border-top: 1.5px dashed ${accentColor}44;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ornament.top {
      font-size: 9px;
      color: ${accentColor};
      letter-spacing: 4px;
      margin-bottom: 6px;
      opacity: .7;
    }
    .ornament.bottom {
      font-size: 9px;
      color: #8a7355;
      letter-spacing: 1px;
      margin-top: 6px;
      font-style: italic;
    }
    .event-name {
      font-size: 9px;
      color: #8a7355;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .guest-name {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      color: #1a0e08;
      font-weight: 400;
      letter-spacing: .5px;
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .diet-badge {
      font-size: 10px;
      color: ${accentColor};
      margin-bottom: 4px;
    }
    .table-info {
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      color: ${accentColor};
      font-weight: 700;
      letter-spacing: 1px;
    }
    .table-label {
      font-size: 10px;
      color: #8a7355;
      font-style: italic;
    }
    .back-table {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: ${accentColor};
      font-weight: 700;
    }
    .back-label {
      font-size: 10px;
      color: #8a7355;
      font-style: italic;
    }
    @media print {
      body { background: white; padding: 10px; }
      .no-print { display: none; }
      .card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="no-print header">
    <h1>Chevalets — ${ev.name}</h1>
    <p>Imprimez cette page et découpez les chevalets</p>
  </div>
  <div class="no-print stats">${guests.length} chevalets · ${ev.date}</div>
  <div class="no-print" style="text-align:center;margin-bottom:20px">
    <button onclick="window.print()" style="padding:10px 28px;background:${accentColor};border:none;border-radius:99px;font-family:Georgia;font-size:14px;cursor:pointer;font-weight:700">🖨 Imprimer</button>
  </div>
  <div class="grid">
    ${cardsHTML}
  </div>
  <script>
    // Auto-print
    window.onload = () => {
      // slight delay so fonts load
      setTimeout(() => {}, 500);
    }
  <\/script>
</body>
</html>
  `);
  w.document.close();
}

// ═══════════════════════════════════════════════════════════════
// DIET SUMMARY PRINT
// ═══════════════════════════════════════════════════════════════

function printDietSummary(ev) {
  const byDiet = {};
  ev.guests.forEach(g => {
    if (!byDiet[g.diet]) byDiet[g.diet] = [];
    byDiet[g.diet].push(g);
  });
  const rows = Object.entries(byDiet).map(([diet, guests]) => {
    const d = dietInfo(diet);
    return `
      <tr>
        <td>${d.icon} ${d.label}</td>
        <td style="font-weight:700;color:${d.color}">${guests.length}</td>
        <td>${guests.map(g => {
          const t = ev.tables.find(t => t.id === g.tableId);
          return `${g.name}${t ? ` (T.${t.number})` : ' (non placé)'}`;
        }).join(", ")}</td>
      </tr>
    `;
  }).join("");

  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
    <title>Contraintes alimentaires — ${ev.name}</title>
    <style>
      body { font-family: Georgia, serif; padding: 32px; max-width: 900px; margin: 0 auto; }
      h1 { font-size: 22px; font-weight: 400; margin-bottom: 4px; }
      p { color: #888; font-size: 13px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f5ead4; padding: 10px 14px; text-align: left; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
      td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
      td:first-child { font-weight: 600; white-space: nowrap; }
      @media print { button { display: none } }
    </style></head><body>
    <h1>Contraintes alimentaires</h1>
    <p>${ev.name} · ${ev.date} · ${ev.guests.length} invités</p>
    <div style="margin-bottom:16px"><button onclick="window.print()" style="padding:8px 20px;background:#C9973A;border:none;border-radius:99px;cursor:pointer;font-family:Georgia">🖨 Imprimer</button></div>
    <table>
      <thead><tr><th>Régime</th><th>Nb</th><th>Invités</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body></html>`);
  w.document.close();
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════

function LoginScreen({ onLogin, t: tProp }) {
  const { t: tHook } = useI18n();
  const t = tProp || tHook;

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(ellipse at 30% 40%, #2a1a0e 0%, ${C.dark} 70%)`,
      fontFamily:"Georgia, 'Palatino Linotype', serif",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20,
      position:"relative", overflow:"hidden",
    }}>
      {/* Decorative rings */}
      {[...Array(5)].map((_,i) => (
        <div key={i} style={{
          position:"absolute", borderRadius:"50%",
          border:`1px solid ${C.gold}${["18","12","0e","08","05"][i]}`,
          width:200+i*180, height:200+i*180,
          top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          pointerEvents:"none",
        }}/>
      ))}

      <div style={{ position:"relative", width:"100%", maxWidth:420, textAlign:"center" }}>
        {/* Logo */}
        <div style={{ fontSize:48, marginBottom:8 }}>🪑</div>
        <h1 style={{ fontSize:38, color:C.cream, margin:"0 0 4px", fontWeight:400, letterSpacing:3 }}>TableMaître</h1>
        <p style={{ color:C.gold, fontSize:12, letterSpacing:5, textTransform:"uppercase", margin:"0 0 36px" }}>
          Gestion de plans de table
        </p>

        {/* Card */}
        <div style={{ background:C.card, borderRadius:20, padding:32, border:`1px solid ${C.border}`, boxShadow:`0 32px 80px #000d` }}>
          {/* Tabs */}
          <div style={{ display:"flex", background:C.mid, borderRadius:99, padding:3, marginBottom:24 }}>
            {[["login","Connexion"],["register","Inscription"]].map(([v,l]) => (
              <button key={v} onClick={()=>{setAuthView(v);setError("")}} style={{
                flex:1, padding:"9px", borderRadius:99, border:"none", cursor:"pointer",
                background: authView===v ? `linear-gradient(135deg,${C.gold},${C.gold2})` : "transparent",
                color: authView===v ? C.dark : C.muted,
                fontWeight:700, fontSize:13, fontFamily:"inherit", transition:"all .2s",
              }}>{l}</button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {authView==="register" && (
              <Field label="NOM COMPLET">
                <Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Marie Dupont"/>
              </Field>
            )}
            <Field label="EMAIL">
              <Input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="vous@example.fr"/>
            </Field>
            <Field label="MOT DE PASSE">
              <Input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/>
            </Field>
            {error && <div style={{color:C.red,fontSize:12,textAlign:"center"}}>{error}</div>}
            <button onClick={onLogin} style={{
              marginTop:4, width:"100%", padding:"14px", fontSize:15, letterSpacing:1,
              background:"#fff", border:"none", borderRadius:12, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              fontFamily:"Georgia,serif", fontWeight:700, color:"#2A1A0E",
              boxShadow:"0 2px 8px rgba(0,0,0,0.3)"
            }}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.7l6.2 5.2C41.1 36.2 44 30.6 44 24c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              Se connecter avec Google
            </button>
          </div>
        </div>

        <div style={{ marginTop:24, display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
          {["💍 Mariage","🥂 Gala","🎂 Anniversaire","🎤 Conférence","Plan de salle libre","Chevalets imprimables","Contraintes alimentaires"].map(f=>(
            <span key={f} style={{ background:C.gold+"18", border:`1px solid ${C.gold}33`, color:C.gold, borderRadius:99, padding:"3px 12px", fontSize:11 }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUPER ADMIN PANEL
// ═══════════════════════════════════════════════════════════════

function SuperAdminPanel({ events, setEvents, users, setUsers, onLogout }) {
  const [tab, setTab] = useState("projects"); // projects | users
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newProject, setNewProject] = useState({ name:"", date:"", type:"mariage", adminId:"" });
  const [newUser, setNewUser] = useState({ name:"", email:"", password:"", role:"admin" });

  const createProject = () => {
    if (!newProject.name) return;
    const ev = {
      id: Date.now(), ownerId: newProject.adminId || "sa",
      name: newProject.name, date: newProject.date || new Date().toISOString().slice(0,10),
      type: newProject.type, plan: "pro",
      roomShape:[{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables:[], guests:[], constraints:[], menu:null,
    };
    setEvents(prev=>[...prev,ev]);
    if (newProject.adminId) {
      setUsers(prev=>prev.map(u=>u.id===newProject.adminId?{...u,projectIds:[...(u.projectIds||[]),ev.id]}:u));
    }
    setNewProject({name:"",date:"",type:"mariage",adminId:""});
    setShowNewProject(false);
  };

  const createUser = () => {
    if (!newUser.name||!newUser.email||!newUser.password) return;
    const u = { id:uid(), ...newUser, avatar:newUser.name.slice(0,2).toUpperCase(), projectIds:[] };
    setUsers(prev=>[...prev,u]);
    setNewUser({name:"",email:"",password:"",role:"admin"});
    setShowNewUser(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:C.cream }}>
      {/* Nav */}
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:C.gold, letterSpacing:1 }}>🪑 TableMaître</span>
        <Badge color={C.red} style={{marginLeft:10}}>Super Admin</Badge>
        <div style={{flex:1}}/>
        {[["projects","📁 Projets"],["users","👥 Utilisateurs"],["stats","📊 Stats"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            background:tab===t?C.gold+"22":"none", border:"none", color:tab===t?C.gold:C.muted,
            padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          }}>{l}</button>
        ))}
        <div style={{width:1,height:24,background:C.border,margin:"0 12px"}}/>
        <Btn variant="muted" small onClick={onLogout}>Déconnexion</Btn>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px" }}>
        {/* PROJECTS */}
        {tab==="projects" && (
          <>
            <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
              <div>
                <h2 style={{ margin:0, fontSize:26, fontWeight:400 }}>Tous les projets</h2>
                <p style={{ color:C.muted, margin:"4px 0 0", fontSize:13 }}>{events.length} projet{events.length>1?"s":""}</p>
              </div>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowNewProject(true)}>+ Nouveau projet</Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
              {events.map(ev=>{
                const owner = users.find(u=>u.id===ev.ownerId);
                const theme = THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
                return (
                  <div key={ev.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24, transition:"all .2s" }}>
                    <div style={{ display:"flex", alignItems:"start", gap:12, marginBottom:12 }}>
                      <span style={{ fontSize:28 }}>{theme.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{ color:C.cream, fontSize:16, marginBottom:2 }}>{ev.name}</div>
                        <div style={{ color:C.muted, fontSize:12 }}>{ev.date}</div>
                      </div>
                      <Badge color={theme.color}>{theme.label}</Badge>
                    </div>
                    <div style={{ display:"flex", gap:16, fontSize:12, color:C.muted, marginBottom:12 }}>
                      <span>🪑 {ev.tables.length} tables</span>
                      <span>👤 {ev.guests.length} invités</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:24,height:24,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:10,fontWeight:700 }}>
                        {owner?.avatar||"?"}
                      </div>
                      <span style={{ color:C.muted, fontSize:12 }}>{owner?.name||"Sans propriétaire"}</span>
                      <div style={{flex:1}}/>
                      <Btn small variant="danger" onClick={()=>setEvents(prev=>prev.filter(e=>e.id!==ev.id))}>Supprimer</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* STATS */}
        {tab==="stats" && (
          <div>
            <h2 style={{ margin:"0 0 28px", fontSize:26, fontWeight:400 }}>Tableau de bord</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
              {[
                { label:"Projets total", val:events.length, icon:"📁", color:C.gold },
                { label:"Utilisateurs", val:users.length, icon:"👥", color:C.blue },
                { label:"Invités total", val:events.reduce((s,e)=>s+e.guests.length,0), icon:"👤", color:C.green },
                { label:"Tables total", val:events.reduce((s,e)=>s+e.tables.length,0), icon:"🪑", color:C.gold },
                { label:"Projets Pro", val:events.filter(e=>e.plan==="pro").length, icon:"⭐", color:"#E8845A" },
                { label:"Projets Free", val:events.filter(e=>e.plan==="free").length, icon:"🆓", color:C.muted },
              ].map(s => (
                <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 24px" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <h3 style={{ color:C.gold, margin:"0 0 16px", fontWeight:400, fontSize:16 }}>🎟️ Codes promotionnels actifs</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {Object.entries(VOUCHERS).map(([code, v]) => (
                  <div key={code} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.mid, borderRadius:10 }}>
                    <span style={{ fontFamily:"monospace", color:C.gold, fontWeight:700, fontSize:14, minWidth:120 }}>{code}</span>
                    <span style={{ color:C.cream, fontSize:13, flex:1 }}>{v.description}</span>
                    <span style={{ color:C.muted, fontSize:12 }}>-{v.discount}%</span>
                    <span style={{ color:C.muted, fontSize:12 }}>max {v.maxUses} utilisations</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==="users" && (
          <>
            <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
              <div>
                <h2 style={{ margin:0, fontSize:26, fontWeight:400 }}>Utilisateurs</h2>
                <p style={{ color:C.muted, margin:"4px 0 0", fontSize:13 }}>{users.length} comptes</p>
              </div>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowNewUser(true)}>+ Nouvel utilisateur</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {users.map(u=>(
                <div key={u.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:42,height:42,borderRadius:"50%",background:u.role==="superadmin"?C.red+"33":C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:u.role==="superadmin"?C.red:C.gold,fontSize:15,fontWeight:700 }}>
                    {u.avatar}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{ color:C.cream, fontSize:15 }}>{u.name}</div>
                    <div style={{ color:C.muted, fontSize:12 }}>{u.email}</div>
                  </div>
                  <Badge color={u.role==="superadmin"?C.red:C.gold}>{u.role}</Badge>
                  <span style={{ color:C.muted, fontSize:12 }}>
                    {u.role!=="superadmin" && `${(u.projectIds||[]).length} projet${(u.projectIds||[]).length>1?"s":""}`}
                  </span>
                  {u.role!=="superadmin" && (
                    <Btn small variant="danger" onClick={()=>setUsers(prev=>prev.filter(x=>x.id!==u.id))}>Supprimer</Btn>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal new project */}
      <Modal open={showNewProject} onClose={()=>setShowNewProject(false)} title="Créer un nouveau projet">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÉVÉNEMENT *">
            <Input value={newProject.name} onChange={e=>setNewProject({...newProject,name:e.target.value})} placeholder="Mariage Dupont × Martin"/>
          </Field>
          <Field label="DATE">
            <Input type="date" value={newProject.date} onChange={e=>setNewProject({...newProject,date:e.target.value})}/>
          </Field>
          <Field label="TYPE D'ÉVÉNEMENT">
            <Select value={newProject.type} onChange={e=>setNewProject({...newProject,type:e.target.value})}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </Select>
          </Field>
          <Field label="ASSIGNER À UN ADMIN">
            <Select value={newProject.adminId} onChange={e=>setNewProject({...newProject,adminId:e.target.value})}>
              <option value="">— Sans propriétaire —</option>
              {users.filter(u=>u.role==="admin").map(u=><option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </Select>
          </Field>
          <Btn onClick={createProject} style={{marginTop:8}}>Créer le projet</Btn>
        </div>
      </Modal>

      {/* Modal new user */}
      <Modal open={showNewUser} onClose={()=>setShowNewUser(false)} title="Créer un utilisateur">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM COMPLET *">
            <Input value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})} placeholder="Marie Dupont"/>
          </Field>
          <Field label="EMAIL *">
            <Input type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} placeholder="marie@example.fr"/>
          </Field>
          <Field label="MOT DE PASSE *">
            <Input type="password" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} placeholder="Mot de passe temporaire"/>
          </Field>
          <Field label="RÔLE">
            <Select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
              <option value="admin">Admin Projet</option>
              <option value="superadmin">Super Admin</option>
            </Select>
          </Field>
          <Btn onClick={createUser} style={{marginTop:8}}>Créer l'utilisateur</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GUEST FORM (QR landing)
// ═══════════════════════════════════════════════════════════════

function GuestForm({ event, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", email:"", diet:"standard", notes:"", plus1:false, allergies:[] });
  const [done, setDone] = useState(false);

  const toggleAllergy = (id) => {
    setForm(f=>({ ...f, allergies: f.allergies.includes(id)?f.allergies.filter(x=>x!==id):[...f.allergies,id] }));
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:C.dark, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center", color:C.cream, padding:20 }}>
        <div style={{ fontSize:64 }}>🎉</div>
        <h2 style={{ fontFamily:"Georgia,serif", color:C.gold, fontSize:28, fontWeight:400 }}>Merci !</h2>
        <p style={{ color:C.muted }}>Vos préférences ont été enregistrées<br/>pour <strong style={{ color:C.cream }}>{event.name}</strong></p>
        <Btn onClick={onBack} style={{ marginTop:24 }}>Retour à l'accueil</Btn>
      </div>
    </div>
  );

  const theme = THEMES_CONFIG[event.type]||THEMES_CONFIG.autre;

  return (
    <div style={{ minHeight:"100vh", background:theme.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", padding:16 }}>
      <div style={{ width:"100%", maxWidth:420, background:C.cream, borderRadius:20, padding:36, boxShadow:`0 32px 80px #000a` }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:40 }}>{theme.icon}</div>
          <h2 style={{ color:C.dark, margin:"8px 0 4px", fontSize:22, fontWeight:400 }}>{event.name}</h2>
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Merci de renseigner vos préférences</p>
        </div>

        {/* Progress */}
        <div style={{ display:"flex", gap:4, marginBottom:24 }}>
          {[0,1].map(i=>(
            <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=step?theme.color:"#ddd" }}/>
          ))}
        </div>

        {step===0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="VOTRE NOM *">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd` }} placeholder="Prénom Nom"/>
            </Field>
            <Field label="EMAIL">
              <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd` }} type="email" placeholder="votre@email.fr"/>
            </Field>
            <label style={{ display:"flex", gap:10, alignItems:"center", fontSize:14, color:C.mid, cursor:"pointer" }}>
              <input type="checkbox" checked={form.plus1} onChange={e=>setForm({...form,plus1:e.target.checked})} style={{ width:16,height:16 }}/>
              Je viens avec un(e) accompagnant(e)
            </label>
            <Btn disabled={!form.name} onClick={()=>setStep(1)} style={{ width:"100%", padding:14, fontSize:15, marginTop:4 }}>
              Continuer →
            </Btn>
          </div>
        )}

        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="RÉGIME ALIMENTAIRE">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {DIET_OPTIONS.map(function(ditem){ return (
                  <button key={ditem.id} onClick={()=>setForm({...form,diet:ditem.id})} style={{
                    padding:"8px 10px", borderRadius:10, border:`2px solid ${form.diet===ditem.id?ditem.color:"#ddd"}`,
                    background:form.diet===ditem.id?ditem.color+"22":"#fff", cursor:"pointer",
                    fontSize:12, fontWeight:700, fontFamily:"inherit", color:form.diet===ditem.id?ditem.color:C.mid,
                    display:"flex", alignItems:"center", gap:6,
                  }}>
                    <span>{ditem.icon}</span><span>{ditem.label}</span>
                  </button>
                );})}
              </div>
            </Field>
            <Field label="ALLERGIES SPÉCIFIQUES">
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {DIET_OPTIONS.filter(function(ditem){ return ditem.id.startsWith("sans-")||ditem.id==="vegan"; }).map(function(ditem){ return (
                  <button key={ditem.id} onClick={()=>toggleAllergy(ditem.id)} style={{
                    padding:"4px 12px", borderRadius:99, border:`1px solid ${form.allergies.includes(ditem.id)?ditem.color:"#ddd"}`,
                    background:form.allergies.includes(ditem.id)?ditem.color+"22":"#fff",
                    cursor:"pointer", fontSize:11, fontFamily:"inherit", color:form.allergies.includes(ditem.id)?ditem.color:C.mid,
                  }}>{ditem.icon} {ditem.label}</button>
                );})}
              </div>
            </Field>
            <Field label="NOTES / PRÉCISIONS">
              <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3}
                placeholder="Mobilité réduite, allergie sévère, poussette..."
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd`, resize:"vertical" }}/>
            </Field>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="muted" onClick={()=>setStep(0)} style={{ flex:1 }}>← Retour</Btn>
              <Btn onClick={()=>setDone(true)} style={{ flex:2, padding:14 }}>Confirmer ✓</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EVENT EDITOR
// ═══════════════════════════════════════════════════════════════

function EventEditor({ ev, onUpdate, onBack, saveToast, t: tProp }) {
  const { t: tHook } = useI18n();
  const t = tProp || tHook;
  const [tab, setTab] = useState("plan");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showConstraint, setShowConstraint] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newGuest, setNewGuest] = useState({ name:"", email:"", diet:"standard", notes:"", allergies:[] });
  const [newTable, setNewTable] = useState({ number:"", capacity:8, shape:"round", label:"" });
  // Auto-numérotation
  const nextTableNumber = ev.tables.reduce((mx, tbl) => Math.max(mx, tbl.number), 0) + 1;
  const [constraint, setConstraint] = useState({ a:"", b:"", type:"together" });
  const [search, setSearch] = useState("");
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [highlightTables, setHighlightTables] = useState(false);
  const [selectedUnseatedGuest, setSelectedUnseatedGuest] = useState(null);
  const [tablesHistory, setTablesHistory] = useState([]);
  const pushHistory = (tables) => setTablesHistory(h => [...h.slice(-9), tables]);
  const undoTables = () => {
    if (tablesHistory.length === 0) return;
    const prev = tablesHistory[tablesHistory.length - 1];
    setTablesHistory(h => h.slice(0, -1));
    updateEv(e => ({ ...e, tables: prev }));
  };

  var theme = THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
  var seated = ev.guests.filter(function(gst){ return !!gst.tableId; });
  var unseated = ev.guests.filter(function(gst){ return !gst.tableId; });
  const tableSel = ev.tables.find(t=>t.id===selectedTable);
  var tableGuests = tableSel ? ev.guests.filter(function(gst){ return gst.tableId===selectedTable; }) : [];
  var filtered = ev.guests.filter(function(gst){ return gst.name.toLowerCase().includes(search.toLowerCase()); });

  // Diet stats
  var dietStats = DIET_OPTIONS.filter(function(dopt){ return dopt.id!=="standard"; }).map(function(dopt){
    return {...dopt, count: ev.guests.filter(function(gst){ return gst.diet===dopt.id || (gst.allergies||[]).includes(dopt.id); }).length};
  }).filter(function(dopt){ return dopt.count > 0; });

  function updateEv(fn) { onUpdate(fn(ev)); }
  function addGuest() {
    if (!newGuest.name.trim()) return;
    updateEv(e=>({ ...e, guests:[...e.guests,{id:Date.now(),...newGuest,tableId:selectedTable||null}] }));
    setNewGuest({name:"",email:"",diet:"standard",notes:"",allergies:[]});
    setShowAddGuest(false);
  }
  function addTable() {
    const n = newTable.number ? parseInt(newTable.number) : nextTableNumber;
    const x = 150 + (ev.tables.length % 5)*130;
    const y = 160 + Math.floor(ev.tables.length/5)*140;
    updateEv(e=>({ ...e, tables:[...e.tables,{id:Date.now(),number:n,capacity:parseInt(newTable.capacity),shape:newTable.shape,label:newTable.label,color:newTable.color,x,y}] }));
    setNewTable({number:"",capacity:8,shape:"round",label:"",color:undefined});
    setShowAddTable(false);
  }
  function addConstraint() {
    if (!constraint.a||!constraint.b||constraint.a===constraint.b) return;
    updateEv(e=>({ ...e, constraints:[...e.constraints,{id:Date.now(),...constraint}] }));
    setConstraint({a:"",b:"",type:"together"});
    setShowConstraint(false);
  }
  function autoPlace() {
    updateEv(e=>{
      const guests=[...e.guests];
      const tables=[...e.tables];
      const groups=[];
      e.constraints.filter(c=>c.type==="together").forEach(c=>{
        const ex=groups.find(g=>g.includes(c.a)||g.includes(c.b));
        if(ex){if(!ex.includes(c.a))ex.push(c.a);if(!ex.includes(c.b))ex.push(c.b);}
        else groups.push([c.a,c.b]);
      });
      const newG=guests.map(g=>({...g,tableId:null}));
      const assigned=new Set();
      let ti=0;
      groups.forEach(group=>{
        if(ti>=tables.length)return;
        group.forEach(gId=>{const g=newG.find(x=>x.id===gId);if(g){g.tableId=tables[ti].id;assigned.add(gId);}});
        ti++;
      });
      newG.filter(g=>!assigned.has(g.id)).forEach(g=>{
        while(ti<tables.length){
          const s=newG.filter(x=>x.tableId===tables[ti].id).length;
          if(s<tables[ti].capacity){g.tableId=tables[ti].id;break;}
          ti++;
        }
      });
      return {...e,guests:newG};
    });
  }

  const TABS = [
    {id:"plan",    icon:"🗺",  label:"Plan"},
    {id:"guests",  icon:"👥",  label:`Invités (${ev.guests.length})`},
    {id:"diet",    icon:"🍽️",  label:"Alimentation"},
    {id:"constraints",icon:"⚙",label:"Contraintes"},
    {id:"room",    icon:"📐",  label:"Salle"},
  ];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:C.cream }}>
      {/* Header */}
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", height:56, position:"sticky", top:0, zIndex:100, gap:12, flexWrap:"wrap" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>{t.back}</button>
        <span style={{ color:C.border }}>|</span>
        <span style={{ fontSize:20 }}>{theme.icon}</span>
        <span style={{ color:C.cream, fontSize:16, fontWeight:400 }}>{ev.name}</span>
        <Badge color={theme.color}>{theme.label}</Badge>
        <div style={{flex:1}}/>
        <Btn small variant="ghost" onClick={()=>setShowQR(true)}>📱 QR Code</Btn>
        <Btn small variant="success" onClick={()=>printPlaceCards(ev)}>{t.placeCards}</Btn>
        <Btn small variant="ghost" onClick={()=>printFloorPlan(ev)}>{t.floorPlan}</Btn>
        <Btn small onClick={autoPlace}>{t.autoPlace}</Btn>
        <button onClick={()=>setShowSettings(true)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18 }}>⚙</button>
      </div>

      {/* Notes bar */}
      {ev.notes && (
        <div style={{ background:C.gold+"11", borderBottom:`1px solid ${C.gold}22`, padding:"8px 24px", fontSize:12, color:C.muted, fontStyle:"italic" }}>
          {t.note} {ev.notes}
        </div>
      )}
      {/* Stats bar */}
      <div style={{ background:C.mid+"55", borderBottom:`1px solid ${C.border}`, padding:"10px 24px", display:"flex", gap:24, overflowX:"auto" }}>
        {[
          {label:"Tables",    val:ev.tables.length,  color:C.gold},
          {label:"Invités",   val:ev.guests.length,  color:C.gold},
          {label:"Placés",    val:seated.length,     color:C.green},
          {label:"En attente",val:unseated.length,   color:unseated.length>0?C.red:C.green},
          {label:"Régimes spéciaux", val:dietStats.reduce((s,d)=>s+d.count,0), color:C.blue},
        ].map(s=>(
          <div key={s.label} style={{ textAlign:"center", minWidth:80 }}>
            <div style={{ fontSize:20, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ background:C.card+"dd", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", gap:0, overflowX:"auto" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`,
            color:tab===t.id?C.gold:C.muted, padding:"14px 18px",
            cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:tab===t.id?700:400, whiteSpace:"nowrap",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>

        {/* ── PLAN TAB ── */}
        {tab==="plan" && (
          <div style={{ display:"flex", gap:20, alignItems:"start", flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 600px", minWidth:0 }}>
              <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                <Btn small variant="ghost" onClick={()=>setShowAddTable(true)}>{t.addTable}</Btn>
                <Btn small variant="muted" onClick={()=>setShowAddGuest(true)}>{t.addGuest}</Btn>
                {tablesHistory.length > 0 && <Btn small variant="muted" onClick={undoTables}>{t.undo}</Btn>}
                <div style={{flex:1}}/>
                <Btn small variant="ghost" onClick={()=>printDietSummary(ev)}>{t.dietSummary}</Btn>
              </div>
              <FloorPlan
                ev={ev}
                onUpdateTables={tables=>{pushHistory(ev.tables); updateEv(e=>({...e,tables}));}}
                onSelectTable={(tableId) => {
                  if (selectedUnseatedGuest && tableId) {
                    const t = ev.tables.find(x => x.id === tableId);
                    const seated = ev.guests.filter(g => g.tableId === tableId).length;
                    if (t && seated < t.capacity) {
                      updateEv(e => ({ ...e, guests: e.guests.map(g => g.id === selectedUnseatedGuest.id ? { ...g, tableId } : g) }));
                      setSelectedUnseatedGuest(null);
                      return;
                    }
                  }
                  setSelectedTable(tableId);
                }}
                selectedTable={selectedTable}
                highlightAvailable={highlightTables || !!selectedUnseatedGuest}
              />
              {unseated.length>0 && (
                <div style={{ marginTop:16, background:C.red+"11", border:`1px solid ${C.red}33`, borderRadius:12, padding:"12px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", marginBottom:8 }}>
                    <div style={{ color:C.red, fontSize:12, letterSpacing:.5, flex:1 }}>{t.unseatedList} ({unseated.length})</div>
                    <button onClick={()=>setHighlightTables(h=>!h)} style={{ background:highlightTables?C.gold:"none", border:`1px solid ${highlightTables?C.gold:C.border}`, borderRadius:6, color:highlightTables?C.dark:C.muted, fontSize:11, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit" }}>
                      {highlightTables ? "✓ Tables visibles" : "👁 Voir places libres"}
                    </button>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {unseated.map(g=>(
                      <span key={g.id}
                        onClick={()=>setSelectedUnseatedGuest(selectedUnseatedGuest?.id===g.id?null:g)}
                        style={{
                          background:selectedUnseatedGuest?.id===g.id?C.gold+"44":C.red+"22",
                          border:`1px solid ${selectedUnseatedGuest?.id===g.id?C.gold:C.red}44`,
                          borderRadius:99, padding:"3px 12px", color:C.cream, fontSize:12, cursor:"pointer",
                          fontWeight:selectedUnseatedGuest?.id===g.id?700:400
                        }}>
                        {selectedUnseatedGuest?.id===g.id ? "→ " : ""}{g.name}
                      </span>
                    ))}
                    {selectedUnseatedGuest && (
                      <div style={{width:"100%",marginTop:6,fontSize:11,color:C.gold}}>
                        👆 Cliquez sur une table pour y placer {selectedUnseatedGuest.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Side panel */}
            {tableSel && (
              <div style={{ width:260, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ color:C.gold, fontSize:16 }}>Table {tableSel.number}</div>
                    {tableSel.label && <div style={{ color:C.muted, fontSize:12 }}>{tableSel.label}</div>}
                    <div style={{ color:C.muted, fontSize:12 }}>{tableGuests.length}/{tableSel.capacity} places</div>
                  </div>
                  <div style={{flex:1}}/>
                  <button onClick={()=>setSelectedTable(null)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16 }}>✕</button>
                </div>

                {/* Seated guests */}
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
                  {tableGuests.map(g=>{
                    const d=dietInfo(g.diet);
                    return (
                      <div key={g.id} style={{ background:C.mid+"88",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ width:26,height:26,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:11,fontWeight:700 }}>
                          {g.name[0]}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{ color:C.cream, fontSize:12 }}>{g.name}</div>
                          {g.diet!=="standard" && <div style={{ color:d.color, fontSize:10 }}>{d.icon} {d.label}</div>}
                        </div>
                        <button onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,tableId:null}:x)}))}
                          style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13 }}>✕</button>
                      </div>
                    );
                  })}
                </div>

                {/* Add unseated */}
                {unseated.length>0 && tableGuests.length<tableSel.capacity && (
                  <div>
                    <div style={{ color:C.muted, fontSize:11, letterSpacing:.5, marginBottom:6 }}>AJOUTER À CETTE TABLE</div>
                    {unseated.map(g=>(
                      <button key={g.id} onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,tableId:selectedTable}:x)}))}
                        style={{ display:"block",width:"100%",marginBottom:5,padding:"7px 12px",textAlign:"left",background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>
                        + {g.name}
                      </button>
                    ))}
                  </div>
                )}

                <Btn small variant="danger" onClick={()=>{updateEv(e=>({...e,tables:e.tables.filter(t=>t.id!==selectedTable),guests:e.guests.map(g=>g.tableId===selectedTable?{...g,tableId:null}:g)}));setSelectedTable(null);}} style={{width:"100%",marginTop:12}}>
                  Supprimer la table
                </Btn>
              </div>
            )}
          </div>
        )}

        {/* ── GUESTS TAB ── */}
        {tab==="guests" && (
          <div style={{ maxWidth:860 }}>
            <div style={{ display:"flex", gap:12, marginBottom:20 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un invité…"
                style={{ ...inputStyle, flex:1 }}/>
              <Btn variant="ghost" onClick={()=>exportGuestsCSV(ev)}>⬇ Export CSV</Btn>
              <Btn variant="ghost" onClick={()=>setShowImportCSV(true)}>⬆ Import CSV</Btn>
              <Btn onClick={()=>setShowAddGuest(true)}>+ Invité</Btn>
            </div>

            {/* Diet filter legend */}
            {dietStats.length>0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                {dietStats.map(d=>(
                  <span key={d.id} style={{ background:d.color+"22",border:`1px solid ${d.color}44`,color:d.color,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700 }}>
                    {d.icon} {d.label} × {d.count}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {filtered.map(g=>{
                const table=ev.tables.find(t=>t.id===g.tableId);
                const d=dietInfo(g.diet);
                return (
                  <div key={g.id} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14 }}>
                    <div style={{ width:38,height:38,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:15,fontWeight:700 }}>
                      {g.name[0]}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{ color:C.cream, fontSize:15 }}>{g.name}</div>
                      {g.email && <div style={{ color:C.muted, fontSize:12 }}>{g.email}</div>}
                      {g.notes && <div style={{ color:C.muted, fontSize:12, fontStyle:"italic" }}>{g.notes}</div>}
                    </div>
                    {g.diet!=="standard" && <Badge color={d.color}>{d.icon} {d.label}</Badge>}
                    {g.allergies?.length>0 && (
                      <div style={{ display:"flex", gap:4 }}>
                        {g.allergies.map(a=>{const ai=dietInfo(a);return <span key={a} style={{ fontSize:14 }} title={ai.label}>{ai.icon}</span>;})}
                      </div>
                    )}
                    {table ? <Badge color={C.gold}>Table {table.number}</Badge> : <Badge color={C.red}>Non placé</Badge>}
                    <select value={g.tableId||""} onChange={evt=>{const tid=evt.target.value?parseInt(evt.target.value):null;updateEv(evUp=>({...evUp,guests:evUp.guests.map(x=>x.id===g.id?{...x,tableId:tid}:x)}))}}>
                      style={{ background:C.mid,border:`1px solid ${C.border}`,borderRadius:8,color:C.cream,padding:"4px 8px",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
                      <option value="">— Non placé —</option>
                      {ev.tables.map(t=><option key={t.id} value={t.id}>Table {t.number}{t.label?" ("+t.label+")":""}</option>)}
                    </select>
                    <button onClick={()=>updateEv(e=>({...e,guests:e.guests.filter(x=>x.id!==g.id)}))}
                      style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16 }}>🗑</button>
                  </div>
                );
              })}
              {filtered.length===0 && <p style={{ color:C.muted, textAlign:"center", padding:32 }}>Aucun invité trouvé</p>}
            </div>
          </div>
        )}

        {/* ── DIET TAB ── */}
        {tab==="diet" && (
          <div style={{ maxWidth:900 }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:24, gap:12 }}>
              <h3 style={{ margin:0, fontWeight:400, fontSize:20 }}>Gestion alimentaire</h3>
              <div style={{flex:1}}/>
              <Btn small onClick={()=>printDietSummary(ev)}>🖨 Imprimer récapitulatif</Btn>
            </div>

            {/* Summary cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:32 }}>
              {DIET_OPTIONS.map(function(ditem){
                const count=ev.guests.filter(function(gitem){ return gitem.diet===ditem.id||(gitem.allergies||[]).includes(ditem.id); }).length;
                return (
                  <div key={ditem.id} style={{ background:C.card,border:`1px solid ${count>0?ditem.color+"44":C.border}`,borderRadius:14,padding:"16px 18px",opacity:count===0?.4:1 }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{ditem.icon}</div>
                    <div style={{ color:count>0?ditem.color:C.muted, fontSize:22, fontWeight:700 }}>{count}</div>
                    <div style={{ color:C.muted, fontSize:11 }}>{ditem.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Menu editor */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <h4 style={{ color:C.gold, margin:"0 0 20px", fontWeight:400, fontSize:16 }}>🍽 Menu de l'événement</h4>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[["starter","Entrée"],["main","Plat principal"],["dessert","Dessert"],["vegOption","Option végétarienne"]].map(([k,l])=>(
                  <Field key={k} label={l.toUpperCase()}>
                    <Input value={ev.menu?.[k]||""} onChange={e=>updateEv(evUp=>({...evUp,menu:{...(evUp.menu||{}),starter:"",main:"",dessert:"",vegOption:"",...evUp.menu,[k]:e.target.value}}))} placeholder={`ex: ${l}`}/>
                  </Field>
                ))}
              </div>
            </div>

            {/* Guests with special diet */}
            {dietStats.length>0 && (
              <div style={{ marginTop:24 }}>
                <h4 style={{ color:C.muted, fontWeight:400, fontSize:14, marginBottom:16, letterSpacing:1 }}>INVITÉS AVEC RÉGIME SPÉCIAL</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {ev.guests.filter(g=>g.diet!=="standard"||g.allergies?.length>0).map(g=>{
                    const d=dietInfo(g.diet);
                    const table=ev.tables.find(t=>t.id===g.tableId);
                    return (
                      <div key={g.id} style={{ background:C.card,border:`1px solid ${d.color}33`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
                        <span style={{ fontSize:20 }}>{d.icon}</span>
                        <div style={{flex:1}}>
                          <span style={{ color:C.cream, fontSize:14 }}>{g.name}</span>
                          {g.notes && <span style={{ color:C.muted, fontSize:12, marginLeft:8 }}>— {g.notes}</span>}
                        </div>
                        <Badge color={d.color}>{d.label}</Badge>
                        {g.allergies?.map(a=>{const ai=dietInfo(a);return <Badge key={a} color={ai.color}>{ai.icon}</Badge>;})}
                        {table ? <Badge color={C.gold}>T.{table.number}</Badge> : <Badge color={C.red}>Non placé</Badge>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONSTRAINTS TAB ── */}
        {tab==="constraints" && (
          <div style={{ maxWidth:700 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <h3 style={{ margin:0, fontWeight:400, fontSize:20 }}>Contraintes de placement</h3>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowConstraint(true)}>+ Contrainte</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {ev.constraints.length===0 && <p style={{ color:C.muted }}>Aucune contrainte définie.</p>}
              {ev.constraints.map(c=>{
                const g1=ev.guests.find(g=>g.id===c.a)?.name||"?";
                const g2=ev.guests.find(g=>g.id===c.b)?.name||"?";
                return (
                  <div key={c.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,background:c.type==="together"?C.green+"18":C.red+"18",border:`1px solid ${c.type==="together"?C.green:C.red}44` }}>
                    <span style={{ fontSize:18 }}>{c.type==="together"?"🤝":"⚡"}</span>
                    <strong style={{ color:C.cream }}>{g1}</strong>
                    <span style={{ color:C.muted }}>{c.type==="together"?"avec":"loin de"}</span>
                    <strong style={{ color:C.cream }}>{g2}</strong>
                    <div style={{flex:1}}/>
                    <button onClick={()=>updateEv(e=>({...e,constraints:e.constraints.filter(x=>x.id!==c.id)}))}
                      style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14 }}>✕</button>
                  </div>
                );
              })}
            </div>
            <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20 }}>
              <p style={{ color:C.muted, margin:0, fontSize:13, lineHeight:1.8 }}>
                <strong style={{ color:C.gold }}>🤝 Ensemble :</strong> ces invités seront à la même table.<br/>
                <strong style={{ color:C.gold }}>⚡ Séparés :</strong> ces invités seront à des tables différentes.<br/>
                Cliquez <strong style={{ color:C.gold }}>{t.autoPlace}</strong> pour appliquer automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* ── ROOM TAB ── */}
        {tab==="room" && (
          <div style={{ maxWidth:900 }}>
            <h3 style={{ fontWeight:400, fontSize:20, marginBottom:20 }}>Forme de la salle</h3>
            <RoomShapeEditor shape={ev.roomShape||[]} onChange={shape=>updateEv(e=>({...e,roomShape:shape}))}/>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      <Modal open={showImportCSV} onClose={()=>setShowImportCSV(false)} title="Importer des invités (CSV)" width={500}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:C.mid, borderRadius:10, padding:"12px 16px", fontSize:12, color:C.muted, lineHeight:1.8 }}>
            <strong style={{color:C.gold}}>Format attendu (1 invité par ligne) :</strong><br/>
            <code style={{color:C.cream}}>Prénom Nom, email@example.fr, standard</code><br/>
            Régimes : standard, vegetarien, vegan, sans-gluten, halal, casher, sans-lactose, sans-noix, diabetique
          </div>
          <textarea
            rows={10}
            placeholder={"Marie Martin, marie@test.com, vegetarien\nJean Dupont, jean@test.com, standard\nSophie Laurent, , vegan"}
            id="csv-import-area"
            style={{ ...inputStyle, resize:"vertical", fontFamily:"monospace", fontSize:12, lineHeight:1.6 }}
          />
          <Btn onClick={() => {
            const raw = document.getElementById("csv-import-area").value;
            const lines = raw.split("\n").filter(l => l.trim());
            const newGuests = lines.map(line => {
              const parts = line.split(",").map(p => p.trim());
              const validDiets = ["standard","vegetarien","vegan","sans-gluten","halal","casher","sans-lactose","sans-noix","diabetique"];
              return {
                id: Date.now() + Math.random(),
                name: parts[0] || "Invité",
                email: parts[1] || "",
                diet: validDiets.includes(parts[2]) ? parts[2] : "standard",
                notes: parts[3] || "",
                allergies: [],
                tableId: null
              };
            }).filter(g => g.name);
            updateEv(e => ({ ...e, guests: [...e.guests, ...newGuests] }));
            setShowImportCSV(false);
          }} style={{marginTop:4}}>
            ⬆ Importer {""} invités
          </Btn>
        </div>
      </Modal>

      <Modal open={showAddGuest} onClose={()=>setShowAddGuest(false)} title="Ajouter un invité">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM *"><Input value={newGuest.name} onChange={e=>setNewGuest({...newGuest,name:e.target.value})} placeholder="Prénom Nom"/></Field>
          <Field label="EMAIL"><Input type="email" value={newGuest.email} onChange={e=>setNewGuest({...newGuest,email:e.target.value})} placeholder="email@example.fr"/></Field>
          <Field label="RÉGIME ALIMENTAIRE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {DIET_OPTIONS.map(function(ditem){ return (
                <button key={ditem.id} onClick={()=>setNewGuest({...newGuest,diet:ditem.id})} style={{
                  padding:"7px 10px", borderRadius:8, border:`2px solid ${newGuest.diet===ditem.id?ditem.color:C.border}`,
                  background:newGuest.diet===ditem.id?ditem.color+"22":C.mid, cursor:"pointer", fontSize:12,
                  fontWeight:700, fontFamily:"inherit", color:newGuest.diet===ditem.id?ditem.color:C.muted,
                  display:"flex", alignItems:"center", gap:6,
                }}>{ditem.icon} {ditem.label}</button>
              );})}
            </div>
          </Field>
          <Field label="NOTES / ALLERGIES"><Input value={newGuest.notes} onChange={e=>setNewGuest({...newGuest,notes:e.target.value})} placeholder="Allergies, mobilité réduite…"/></Field>
          <Btn onClick={addGuest} style={{marginTop:4}}>Ajouter l'invité</Btn>
        </div>
      </Modal>

      <Modal open={showAddTable} onClose={()=>setShowAddTable(false)} title="Ajouter une table">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={`NUMÉRO (auto: ${nextTableNumber})`}><Input type="number" value={newTable.number} onChange={e=>setNewTable({...newTable,number:e.target.value})} placeholder={String(nextTableNumber)}/></Field>
          <Field label="CAPACITÉ"><Input type="number" value={newTable.capacity} onChange={e=>setNewTable({...newTable,capacity:e.target.value})}/></Field>
          <Field label="FORME">
            <div style={{ display:"flex", gap:8 }}>
              {[["round","⬤ Ronde"],["rect","▬ Rectangle"]].map(([v,l])=>(
                <button key={v} onClick={()=>setNewTable({...newTable,shape:v})} style={{
                  flex:1, padding:"10px", borderRadius:10, border:`2px solid ${newTable.shape===v?C.gold:C.border}`,
                  background:newTable.shape===v?C.gold+"22":C.mid, cursor:"pointer", color:newTable.shape===v?C.gold:C.muted,
                  fontFamily:"inherit", fontSize:13, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="ÉTIQUETTE (optionnel)"><Input value={newTable.label} onChange={e=>setNewTable({...newTable,label:e.target.value})} placeholder="ex: Famille, Amis…"/></Field>
          <Field label="COULEUR (optionnel)">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#E8845A"].map(col=>(
                <button key={col} onClick={()=>setNewTable({...newTable,color:col})} style={{
                  width:28, height:28, borderRadius:"50%", background:col, border:`3px solid ${newTable.color===col?"#fff":"transparent"}`,
                  cursor:"pointer", padding:0
                }}/>
              ))}
              <button onClick={()=>setNewTable({...newTable,color:undefined})} style={{width:28,height:28,borderRadius:"50%",background:"none",border:`2px solid ${C.border}`,cursor:"pointer",color:C.muted,fontSize:10}}>✕</button>
            </div>
          </Field>
          <Btn onClick={addTable} style={{marginTop:4}}>Créer la table</Btn>
        </div>
      </Modal>

      <Modal open={showConstraint} onClose={()=>setShowConstraint(false)} title="Nouvelle contrainte">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="PREMIER INVITÉ">
            <Select value={constraint.a} onChange={e=>setConstraint({...constraint,a:parseInt(e.target.value)||e.target.value})}>
              <option value="">— Choisir —</option>
              {ev.guests.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
          </Field>
          <Field label="TYPE">
            <div style={{ display:"flex", gap:8 }}>
              {[["together","🤝 Ensemble",C.green],["apart","⚡ Séparés",C.red]].map(([v,l,col])=>(
                <button key={v} onClick={()=>setConstraint({...constraint,type:v})} style={{
                  flex:1, padding:"10px", borderRadius:10, border:`2px solid ${constraint.type===v?col:C.border}`,
                  background:constraint.type===v?col+"22":C.mid, cursor:"pointer", color:constraint.type===v?col:C.muted,
                  fontFamily:"inherit", fontSize:13, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="DEUXIÈME INVITÉ">
            <Select value={constraint.b} onChange={e=>setConstraint({...constraint,b:parseInt(e.target.value)||e.target.value})}>
              <option value="">— Choisir —</option>
              {ev.guests.filter(g=>g.id!==constraint.a).map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
          </Field>
          <Btn onClick={addConstraint} style={{marginTop:4}}>Ajouter</Btn>
        </div>
      </Modal>

      <Modal open={showQR} onClose={()=>setShowQR(false)} title={`QR Code — ${ev.name}`} width={400}>
        <div style={{ textAlign:"center" }} id="qr-modal">
          <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Partagez ce QR code avec vos invités pour qu'ils renseignent leurs préférences.</p>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <div style={{ padding:16,background:C.cream,borderRadius:16,border:`2px solid ${C.border}`,display:"inline-block" }}>
              <QRCodeWidget value={`https://tableplan-seven.vercel.app/?join=${ev.id}`} size={180}/>
            </div>
          </div>
          <div style={{ background:C.mid,borderRadius:8,padding:"8px 16px",fontSize:12,color:C.muted,marginBottom:20,fontFamily:"monospace",cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}
            onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${ev.id}`);}} title="Cliquer pour copier">
            tableplan-seven.vercel.app/?join={ev.id} <span style={{fontSize:10}}>📋</span>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn small onClick={()=>{const c=document.querySelector("#qr-modal canvas");if(!c){alert("QR non disponible");return;}const l=document.createElement("a");l.download=`QR-${ev.name}.png`;l.href=c.toDataURL("image/png");l.click();}}>⬇ PNG</Btn>
            <Btn small variant="ghost" onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${ev.id}`);alert("Lien copié !")}}>📋 Copier le lien</Btn>
            <Btn small variant="muted" onClick={()=>setShowSettings(false)}>🖨 Imprimer</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={showSettings} onClose={()=>setShowSettings(false)} title="Paramètres de l'événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM"><Input value={ev.name} onChange={e=>updateEv(evUp=>({...evUp,name:e.target.value}))}/></Field>
          <Field label="DATE"><Input type="date" value={ev.date} onChange={e=>updateEv(evUp=>({...evUp,date:e.target.value}))}/></Field>
          <Field label="LIEU / NOTES INTERNES">
            <textarea value={ev.notes||""} onChange={e=>updateEv(evUp=>({...evUp,notes:e.target.value}))} rows={3}
              placeholder="Salle des fêtes, traiteur, prestataires..."
              style={{...inputStyle, resize:"vertical", lineHeight:1.6}}/>
          </Field>
          <Field label="TYPE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=>(
                <button key={k} onClick={()=>updateEv(evUp=>({...evUp,type:k}))} style={{
                  padding:"8px 6px", borderRadius:10, border:`2px solid ${ev.type===k?v.color:C.border}`,
                  background:ev.type===k?v.color+"22":C.mid, cursor:"pointer",
                  color:ev.type===k?v.color:C.muted, fontFamily:"inherit", fontSize:11, fontWeight:700,
                }}>{v.icon} {v.label}</button>
              ))}
            </div>
          </Field>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// VOUCHER MODAL
// ═══════════════════════════════════════════════════════════════

function VoucherModal({ onClose, onApply }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleApply = () => {
    const v = VOUCHERS[code.trim().toUpperCase()];
    if (!v) {
      setMsg({ type: "error", text: "❌ Code invalide ou expiré" });
      return;
    }
    setSuccess(true);
    setMsg({ type: "success", text: `✅ Code appliqué : ${v.description}` });
    setTimeout(() => { onApply(code.trim().toUpperCase(), v); onClose(); }, 1800);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:40, width:380, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🎟️</div>
        <h2 style={{ color:C.gold, margin:"0 0 8px", fontSize:22, fontWeight:400, letterSpacing:1 }}>Code promotionnel</h2>
        <p style={{ color:C.muted, fontSize:13, margin:"0 0 24px", lineHeight:1.6 }}>
          Entrez votre bon de réduction pour activer votre offre
        </p>
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && !success && handleApply()}
          placeholder="EX: MARIAGE2026"
          autoFocus
          style={{
            width:"100%", padding:"14px 16px", background:C.mid,
            border:`1px solid ${success ? C.green : msg?.type==="error" ? C.red : C.border}`,
            borderRadius:10, color:C.cream, fontSize:18, letterSpacing:4,
            textAlign:"center", outline:"none", boxSizing:"border-box",
            fontFamily:"monospace", transition:"border-color 0.2s"
          }}
        />
        {msg && (
          <div style={{
            marginTop:12, padding:"10px 14px", borderRadius:8,
            background: msg.type==="error" ? C.red+"22" : C.green+"22",
            color: msg.type==="error" ? C.red : C.green,
            fontSize:13, fontWeight:500
          }}>
            {msg.text}
          </div>
        )}
        <div style={{ display:"flex", gap:12, marginTop:24 }}>
          <button
            onClick={onClose}
            style={{ flex:1, padding:"12px", background:"none", border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, cursor:"pointer", fontSize:14, fontFamily:"Georgia,serif" }}
          >
            Annuler
          </button>
          <button
            onClick={handleApply}
            disabled={!code || success}
            style={{
              flex:2, padding:"12px", background: success ? C.green : C.gold,
              border:"none", borderRadius:10, color:C.dark, cursor: !code||success ? "default" : "pointer",
              fontWeight:700, fontSize:14, fontFamily:"Georgia,serif",
              opacity: !code ? 0.5 : 1, transition:"all 0.2s"
            }}
          >
            {success ? "✓ Appliqué !" : "Appliquer le code"}
          </button>
        </div>
        <div style={{ marginTop:20, fontSize:11, color:C.muted, lineHeight:1.8 }}>
          Codes actifs : <span style={{color:C.gold}}>BIENVENUE</span> · <span style={{color:C.gold}}>MARIAGE2026</span> · <span style={{color:C.gold}}>PARTENAIRE</span> · <span style={{color:C.gold}}>VIP100</span>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD (Admin view)
// ═══════════════════════════════════════════════════════════════

function Dashboard({ user, events, setEvents, onLogout, onOpenEvent, lightMode, onToggleTheme, t, lang, setLang }) {
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newEv, setNewEv] = useState({ name:"", date:"", type:"mariage" });

  const [globalSearch, setGlobalSearch] = useState("");
  var myEventsRaw = events.filter(function(ev2){ return ev2.ownerId === user.id; });
  var myEvents = !globalSearch ? myEventsRaw : myEventsRaw.filter(function(ev2){
    var q = globalSearch.toLowerCase();
    return ev2.name.toLowerCase().includes(q) ||
      (ev2.date||"").includes(q) ||
      (ev2.guests||[]).some(function(g2){ return g2.name.toLowerCase().includes(q) || (g2.email||"").toLowerCase().includes(q); });
  });

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  function createEvent() {
    if (!newEv.name) return;
    // Limite freemium : 1 événement sans voucher
    if (!appliedVoucher && myEvents.length >= 1) {
      setShowNew(false);
      setShowUpgrade(true);
      return;
    }
    const ev = {
      id: Date.now(), ownerId: user.id,
      name: newEv.name, date: newEv.date || new Date().toISOString().slice(0,10),
      type: newEv.type, plan: appliedVoucher ? "pro" : "free",
      roomShape:[{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables:[], guests:[], constraints:[], menu:null,
    };
    setEvents(prev=>[...prev,ev]);
    onOpenEvent(ev.id);
    setShowNew(false);
  }

  const handleApplyVoucher = (code, voucher) => {
    setAppliedVoucher({ code, ...voucher });
  };


  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 30%,#2a1a0e,${C.dark})`, fontFamily:"Georgia,serif", color:C.cream }}>
      {/* Nav */}
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:C.gold, letterSpacing:1 }}>🪑 TableMaître</span>
        <div style={{flex:1}}/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}44` }}/>
          ) : (
            <div style={{ width:32,height:32,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:13,fontWeight:700 }}>
              {user.avatar}
            </div>
          )}
          <span style={{ color:C.muted, fontSize:13 }}>{user.name.split(" ")[0]}</span>
          {/* Sélecteur de langue */}
          <div style={{ position:"relative" }}>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              aria-label="Language / Langue"
              style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:"pointer", fontSize:13, padding:"6px 8px", fontFamily:"inherit", outline:"none" }}
            >
              {Object.entries(LANG_FLAGS).map(([code, flag]) => (
                <option key={code} value={code}>{flag} {LANG_NAMES[code]}</option>
              ))}
            </select>
          </div>
          <button onClick={onToggleTheme}
            title={lightMode?t.darkMode:t.lightMode}
            aria-label={lightMode?t.darkMode:t.lightMode}
            style={{ padding:"6px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:"pointer", fontSize:16 }}>
            <span aria-hidden="true">{lightMode ? "🌙" : "☀️"}</span>
          </button>
          <button
            onClick={() => setShowVoucher(true)}
            style={{ padding:"6px 14px", background:"none", border:`1px solid ${C.gold}`, borderRadius:8, color:C.gold, cursor:"pointer", fontSize:12, fontFamily:"Georgia,serif", display:"flex", alignItems:"center", gap:6 }}
          >
            🎟️ Code promo{appliedVoucher && <span style={{background:C.gold,color:C.dark,borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700}}>✓</span>}
          </button>
          <Btn variant="muted" small onClick={onLogout}>Déconnexion</Btn>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 20px" }}>
        {/* Hero */}
        <div style={{ marginBottom:48, textAlign:"center" }}>
          <h1 style={{ fontSize:36, fontWeight:400, margin:"0 0 8px", letterSpacing:1 }}>Mes événements</h1>
          <p style={{ color:C.muted, margin:0, fontSize:14 }}>Bienvenue, {user.name}</p>
        </div>

        <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
          <input
            value={globalSearch}
            onChange={e=>setGlobalSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            role="searchbox"
            style={{ flex:1, padding:"10px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, color:C.cream, fontSize:14, fontFamily:"Georgia,serif", outline:"none" }}
          />
          <Btn onClick={()=>setShowNew(true)}>{t.newEvent}</Btn>
        </div>

        {myEvents.length===0 && (
          <div style={{ textAlign:"center", padding:"80px 20px", color:C.muted }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🪑</div>
            <p style={{ fontSize:18 }}>Aucun événement pour le moment</p>
            <Btn onClick={()=>setShowNew(true)} style={{ marginTop:20 }}>Créer mon premier événement</Btn>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {myEvents.map(ev=>{
            const theme=THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
            const unseated=ev.guests.filter(g=>!g.tableId).length;
            return (
              <div key={ev.id} onClick={()=>onOpenEvent(ev.id)} style={{
                background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:24,
                cursor:"pointer", transition:"all .2s",
                boxShadow:`0 4px 20px ${theme.color}11`,
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=theme.color+"66";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
                {/* Theme color bar */}
                <div style={{ height:3, background:`linear-gradient(90deg,${theme.color},${theme.color}44)`, borderRadius:99, marginBottom:20 }}/>
                <div style={{ display:"flex", alignItems:"start", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:32 }}>{theme.icon}</span>
                  <Badge color={theme.color}>{theme.label}</Badge>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <h3 style={{ color:C.cream, margin:0, fontSize:18, fontWeight:400 }}>{ev.name}</h3>
                  <button onClick={e=>{e.stopPropagation();const copy={...ev,id:Date.now(),name:ev.name+" (copie)",ownerId:user.id};setEvents(prev=>[...prev,copy]);}}
                    title="Dupliquer cet événement"
                    aria-label={`Dupliquer l'événement ${ev.name}`}
                    style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:12,padding:"3px 8px",fontFamily:"inherit"}}>
                    <span aria-hidden="true">⧉</span>
                  </button>
                </div>
                <p style={{ color:C.muted, margin:"0 0 16px", fontSize:12 }}>
                  {ev.date}
                  {(() => {
                    const days = Math.ceil((new Date(ev.date) - new Date()) / 86400000);
                    if (days < 0) return <span style={{color:C.muted,marginLeft:8}}>— passé</span>;
                    if (days === 0) return <span style={{color:C.green,marginLeft:8,fontWeight:700}}>• Aujourd'hui !</span>;
                    if (days <= 7) return <span style={{color:C.red,marginLeft:8,fontWeight:700}}>• Dans {days}j</span>;
                    if (days <= 30) return <span style={{color:"#E8845A",marginLeft:8}}>• Dans {days}j</span>;
                    return <span style={{color:C.muted,marginLeft:8}}>• Dans {days}j</span>;
                  })()}
                </p>
                <div style={{ display:"flex", gap:16, fontSize:12, color:C.muted }}>
                  <span>🪑 {ev.tables.length} tables</span>
                  <span>👤 {ev.guests.length} invités</span>
                  {unseated>0 && <span style={{ color:C.red }}>⚠ {unseated} non placés</span>}
                  {globalSearch && ev.guests.some(g3=>g3.name.toLowerCase().includes(globalSearch.toLowerCase())) && (
                    <span style={{color:C.gold}}>✦ {ev.guests.filter(g3=>g3.name.toLowerCase().includes(globalSearch.toLowerCase())).length} invité(s) trouvé(s)</span>
                  )}
                </div>
                {ev.guests.length > 0 && (() => {
                  const placed = ev.guests.filter(g => g.tableId).length;
                  const pct = Math.round(placed / ev.guests.length * 100);
                  const barCol = pct === 100 ? C.green : pct > 50 ? C.gold : C.red;
                  return (
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.muted, marginBottom:4 }}>
                        <span>{t.placement}</span>
                        <span style={{color:barCol, fontWeight:700}}>{pct}%</span>
                      </div>
                      <div style={{ height:4, background:C.mid, borderRadius:99 }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:barCol, borderRadius:99, transition:"width .4s" }}/>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {showVoucher && <VoucherModal onClose={() => setShowVoucher(false)} onApply={handleApplyVoucher} />}
      <div aria-live="polite" aria-atomic="true" style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:9999, pointerEvents:"none" }}>
        {saveToast && (
          <div style={{ background:"#1E1208", border:`1px solid ${C.green}`, borderRadius:10, padding:"10px 20px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(0,0,0,0.4)", fontSize:13, color:C.green }}>
            {t.savedCloud}
          </div>
        )}
      </div>
      {showUpgrade && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
          <div style={{ background:C.card, border:`1px solid ${C.gold}`, borderRadius:20, padding:40, width:400, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>⭐</div>
            <h2 style={{ color:C.gold, margin:"0 0 8px", fontSize:22, fontWeight:400 }}>Passez au plan Pro</h2>
            <p style={{ color:C.muted, fontSize:13, margin:"0 0 20px", lineHeight:1.7 }}>
              Le plan gratuit est limité à <strong style={{color:C.cream}}>1 événement</strong>.<br/>
              Activez un code promo ou passez Pro pour des événements illimités.
            </p>
            <div style={{ background:C.mid, borderRadius:12, padding:"16px 20px", marginBottom:20, textAlign:"left" }}>
              {["Événements illimités","Invités illimités","Export CSV","QR codes","Chevalets imprimables"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:8, color:C.cream, fontSize:13, marginBottom:6 }}>
                  <span style={{color:C.green}}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowUpgrade(false)} style={{ flex:1, padding:"12px", background:"none", border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"Georgia,serif" }}>
                Rester gratuit
              </button>
              <button onClick={() => { setShowUpgrade(false); setShowVoucher(true); }} style={{ flex:2, padding:"12px", background:`linear-gradient(135deg,${C.gold},${C.gold2})`, border:"none", borderRadius:10, color:C.dark, cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"Georgia,serif" }}>
                🎟️ Entrer un code promo
              </button>
            </div>
          </div>
        </div>
      )}
      {appliedVoucher && (
        <div style={{ position:"fixed", bottom:24, right:24, background:C.card, border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 20px", zIndex:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          <span style={{fontSize:18}}>🎟️</span>
          <div>
            <div style={{color:C.green, fontSize:12, fontWeight:700}}>Code appliqué : {appliedVoucher.code}</div>
            <div style={{color:C.muted, fontSize:11}}>{appliedVoucher.description}</div>
          </div>
          <button onClick={() => setAppliedVoucher(null)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,padding:0}}>×</button>
        </div>
      )}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvel événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÉVÉNEMENT *"><Input value={newEv.name} onChange={e=>setNewEv({...newEv,name:e.target.value})} placeholder="Mariage Dupont × Martin"/></Field>
          <Field label="DATE"><Input type="date" value={newEv.date} onChange={e=>setNewEv({...newEv,date:e.target.value})}/></Field>
          <Field label="TYPE D'ÉVÉNEMENT">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=>(
                <button key={k} onClick={()=>setNewEv({...newEv,type:k})} style={{
                  padding:"10px 8px", borderRadius:10, border:`2px solid ${newEv.type===k?v.color:C.border}`,
                  background:newEv.type===k?v.color+"22":C.mid, cursor:"pointer",
                  color:newEv.type===k?v.color:C.muted, fontFamily:"inherit", fontSize:12, fontWeight:700,
                  display:"flex", alignItems:"center", gap:6,
                }}><span style={{fontSize:16}}>{v.icon}</span> {v.label}</button>
              ))}
            </div>
          </Field>
          <Btn onClick={createEvent} style={{marginTop:4}}>Créer l'événement</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// FIREBASE HOOKS
// ═══════════════════════════════════════════════════════════════

function useFirebaseAuth() {
  const [fbUser, setFbUser] = useState(undefined); // undefined = chargement, null = déconnecté
  useEffect(() => {
    let unsub;
    // Attendre que Firebase soit disponible (scripts CDN chargés)
    const tryInit = () => {
      const fb = getFirebase();
      if (!fb) {
        // Firebase pas encore prêt, réessayer dans 200ms
        setTimeout(tryInit, 200);
        return;
      }
      unsub = fb.auth.onAuthStateChanged(u => setFbUser(u ?? null));
    };
    tryInit();
    return () => { if (unsub) unsub(); };
  }, []);
  return fbUser;
}

async function saveEventToFirestore(userId, ev) {
  try {
    const fb = getFirebase();
    if (!fb) return;
    await fb.db.collection("users").doc(userId).collection("events").doc(String(ev.id)).set(ev);
  } catch(e) { console.error("Save error:", e); }
}

async function deleteEventFromFirestore(userId, evId) {
  try {
    const fb = getFirebase();
    if (!fb) return;
    await fb.db.collection("users").doc(userId).collection("events").doc(String(evId)).delete();
  } catch(e) { console.error("Delete error:", e); }
}

async function loadEventsFromFirestore(userId) {
  try {
    const fb = getFirebase();
    if (!fb) return [];
    const snap = await fb.db.collection("users").doc(userId).collection("events").get();
    return snap.docs.map(d => d.data());
  } catch(e) { console.error("Load error:", e); return []; }
}

// ═══════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════

function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 30% 40%, #2a1a0e, #120C08)`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:48 }}>🪑</div>
      <div style={{ color:"#C9973A", fontSize:18, letterSpacing:2, fontFamily:"Georgia,serif" }}>TableMaître</div>
      <div style={{ color:"#8A7355", fontSize:13 }}>Loading…</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const fbUser = useFirebaseAuth();
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [view, setView] = useState("dashboard");
  const [lightMode, setLightMode] = useState(false);
  const { t, lang, setLang } = useI18n();

  // Thème
  useEffect(() => {
    document.body.style.background = lightMode ? "#F5F0E8" : "#120C08";
    document.body.style.color = lightMode ? "#2A1A0E" : "#F5EAD4";
    // Accessibilité : focus visible pour navigation clavier
    const styleId = 'a11y-focus-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        *:focus-visible {
          outline: 3px solid #C9973A !important;
          outline-offset: 3px !important;
          border-radius: 4px;
        }
        button:focus-visible, a:focus-visible {
          outline: 3px solid #C9973A !important;
          outline-offset: 3px !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, [lightMode]);

  // Charger les événements depuis Firestore quand l'utilisateur se connecte
  useEffect(() => {
    if (!fbUser) { setEvents([]); setEventsLoaded(false); return; }
    setEventsLoaded(false);
    loadEventsFromFirestore(fbUser.uid).then(evs => {
      setEvents(evs.length > 0 ? evs : []);
      setEventsLoaded(true);
    });
  }, [fbUser]);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Connexion Google
  const handleGoogleLogin = async () => {
    const fb = getFirebase();
    if (!fb) { alert("Firebase non disponible"); return; }
    try {
      await fb.auth.signInWithPopup(new window.firebase.auth.GoogleAuthProvider());
    } catch(e) { console.error("Login error:", e); }
  };

  // Déconnexion
  const handleLogout = async () => {
    const fb = getFirebase();
    if (fb) await fb.auth.signOut();
    setSelectedEventId(null);
    setView("dashboard");
    setEvents([]);
  };

  // Ouvrir un événement
  const handleOpenEvent = (id) => { setSelectedEventId(id); setView("event"); };

  // Mise à jour + sauvegarde auto Firestore
  const [editorSaveToast, setEditorSaveToast] = useState(false);
  const handleUpdateEvent = (updatedEv) => {
    setEvents(prev => prev.map(e => e.id === updatedEv.id ? updatedEv : e));
    if (fbUser) {
      saveEventToFirestore(fbUser.uid, updatedEv);
      setEditorSaveToast(true);
      setTimeout(() => setEditorSaveToast(false), 2000);
    }
  };

  // Création d'événement avec sauvegarde
  const handleSetEvents = (updater) => {
    setEvents(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Sauvegarder les nouveaux/modifiés
      if (fbUser) {
        const prevIds = new Set(prev.map(e => e.id));
        next.forEach(ev => {
          if (!prevIds.has(ev.id) || JSON.stringify(prev.find(e=>e.id===ev.id)) !== JSON.stringify(ev)) {
            saveEventToFirestore(fbUser.uid, ev);
          }
        });
        // Supprimer les supprimés
        const nextIds = new Set(next.map(e => e.id));
        prev.forEach(ev => {
          if (!nextIds.has(ev.id)) deleteEventFromFirestore(fbUser.uid, ev.id);
        });
        // sauvegarde cloud notifiée dans Dashboard
      }
      return next;
    });
  };

  // Construire l'objet user à partir de fbUser
  const user = fbUser ? {
    id: fbUser.uid,
    email: fbUser.email,
    name: fbUser.displayName || fbUser.email,
    avatar: (fbUser.displayName || fbUser.email || "?").slice(0,2).toUpperCase(),
    photoURL: fbUser.photoURL,
    role: fbUser.email === "admin@tablema.fr" ? "superadmin" : "admin",
    projectIds: events.map(e => e.id),
  } : null;

  // États de chargement
  if (fbUser === undefined) return <LoadingScreen />;

  // Non connecté → écran de connexion Google
  if (!fbUser) return <LoginScreen onLogin={handleGoogleLogin} />;

  // Chargement des events en cours
  if (!eventsLoaded) return <LoadingScreen />;

  if (view === "guestForm" && selectedEvent) return (
    <GuestForm event={selectedEvent} onBack={() => setView("event")} />
  );

  if (view === "event" && selectedEvent) return (
    <EventEditor
      ev={selectedEvent}
      onUpdate={handleUpdateEvent}
      onBack={() => { setView("dashboard"); setSelectedEventId(null); }}
      saveToast={editorSaveToast}
      t={t}
    />
  );

  return (
    <Dashboard
      user={user}
      events={events}
      setEvents={handleSetEvents}
      onLogout={handleLogout}
      onOpenEvent={handleOpenEvent}
      lightMode={lightMode}
      onToggleTheme={() => setLightMode(l => !l)}
      t={t}
      lang={lang}
      setLang={setLang}
    />
  );
}
