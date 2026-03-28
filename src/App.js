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
    codePromo: "🎟️ Code promo",
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
    tabList: "📋 Liste",
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
    loginTagline: "La plateforme pro de gestion d'événements",
    loginHero: "Organisez. Placez. Impressionnez.",
    loginSub: "De l'invitation à la salle, gérez chaque détail de votre événement depuis une seule application.",
    loginCta: "Commencer gratuitement avec Google",
    loginFree: "Gratuit · Sans carte bancaire · Synchronisé cloud",
    loginF1: "Plan de salle interactif",
    loginF1d: "Glissez-déposez vos tables sur un canvas intuitif",
    loginF2: "RSVP & invitations",
    loginF2d: "Suivez les confirmations en temps réel",
    loginF3: "Exports premium",
    loginF3d: "PDF, chevalets imprimables, QR codes invités",
    loginF4: "IA proactive",
    loginF4d: "Un assistant qui analyse et guide votre événement",
    loginTrust1: "Mariages",
    loginTrust2: "Galas",
    loginTrust3: "Conférences",
    loginTrust4: "Événements corporate",
    loginFooterTitle: "Prêt à sublimer vos événements ?",
    trustedFor: "Nos clients organisent",
    loginSubtitle: "GESTION DE PLANS DE TABLE",
    
    // Notifications
    savedCloud: "☁️ Sauvegardé dans le cloud",
    savedAuto: "☁️ Sauvegardé automatiquement",
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
    // Stats bar
    statTables: "Tables",
    statGuests: "Invités",
    statSeated: "Placés",
    statWaiting: "En attente",
    statDiets: "Régimes spéciaux",
    // Countdown
    daysAgoLabel: "passé",
    todayLabel: "Aujourd'hui !",
    // Form labels
    fieldName: "NOM *",
    fieldEmail: "EMAIL",
    fieldTable: "TABLE",
    fieldNotes: "NOTES",
    fieldDiet: "RÉGIME",
    fieldAllergies: "ALLERGIES",
    fieldNumber: "NUMÉRO",
    fieldCapacity: "CAPACITÉ",
    fieldShape: "FORME",
    fieldLabel: "ÉTIQUETTE",
    fieldColor: "COULEUR",
    shapeRound: "Ronde",
    shapeRect: "Rectangulaire",
    notSeated: "Non placé",
    addGuestBtn: "Ajouter l'invité",
    createTableBtn: "Créer la table",
    deleteTableBtn: "Supprimer la table",
    settingName: "NOM",
    settingDate: "DATE",
    settingType: "TYPE",
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
    tabList: "📋 Liste",
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
    loginTagline: "The professional event management platform",
    loginHero: "Organize. Place. Impress.",
    loginSub: "From invitations to seating, manage every detail of your event from one powerful application.",
    loginCta: "Get started free with Google",
    loginFree: "Free · No credit card · Cloud synced",
    loginF1: "Interactive floor plan",
    loginF1d: "Drag and drop tables on an intuitive canvas",
    loginF2: "RSVP & invitations",
    loginF2d: "Track confirmations in real time",
    loginF3: "Premium exports",
    loginF3d: "PDF, printable place cards, guest QR codes",
    loginF4: "Proactive AI",
    loginF4d: "An assistant that analyzes and guides your event",
    loginTrust1: "Weddings",
    loginTrust2: "Galas",
    loginTrust3: "Conferences",
    loginTrust4: "Corporate events",
    loginFooterTitle: "Ready to elevate your events?",
    trustedFor: "Our clients organize",
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
    // Stats bar
    statTables: "Tables",
    statGuests: "Guests",
    statSeated: "Seated",
    statWaiting: "Waiting",
    statDiets: "Special diets",
    // Countdown
    daysAgoLabel: "past",
    todayLabel: "Today!",
    // Form labels
    fieldName: "NAME *",
    fieldEmail: "EMAIL",
    fieldTable: "TABLE",
    fieldNotes: "NOTES",
    fieldDiet: "DIET",
    fieldAllergies: "ALLERGIES",
    fieldNumber: "NUMBER",
    fieldCapacity: "CAPACITY",
    fieldShape: "SHAPE",
    fieldLabel: "LABEL",
    fieldColor: "COLOR",
    shapeRound: "Round",
    shapeRect: "Rectangular",
    notSeated: "Not seated",
    addGuestBtn: "Add guest",
    createTableBtn: "Create table",
    deleteTableBtn: "Delete table",
    settingName: "NAME",
    settingDate: "DATE",
    settingType: "TYPE",
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
    loginTagline: "La plataforma profesional de gestión de eventos",
    loginHero: "Organiza. Coloca. Impresiona.",
    loginSub: "Desde las invitaciones hasta la sala, gestiona cada detalle desde una sola aplicación.",
    loginCta: "Comenzar gratis con Google",
    loginFree: "Gratis · Sin tarjeta · Sincronizado en la nube",
    loginF1: "Plano de sala interactivo",
    loginF1d: "Arrastra y suelta mesas en un canvas intuitivo",
    loginF2: "RSVP & invitaciones",
    loginF2d: "Sigue las confirmaciones en tiempo real",
    loginF3: "Exportaciones premium",
    loginF3d: "PDF, tarjetas imprimibles, códigos QR",
    loginF4: "IA proactiva",
    loginF4d: "Un asistente que analiza y guía tu evento",
    loginTrust1: "Bodas",
    loginTrust2: "Galas",
    loginTrust3: "Conferencias",
    loginTrust4: "Eventos corporativos",
    loginFooterTitle: "¿Listo para elevar sus eventos?",
    trustedFor: "Nuestros clientes organizan",
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
    // Stats bar
    statTables: "Mesas",
    statGuests: "Invitados",
    statSeated: "Sentados",
    statWaiting: "En espera",
    statDiets: "Dietas especiales",
    daysAgoLabel: "pasado",
    todayLabel: "¡Hoy!",
    fieldName: "NOMBRE *",
    fieldEmail: "EMAIL",
    fieldTable: "MESA",
    fieldNotes: "NOTAS",
    fieldDiet: "DIETA",
    fieldAllergies: "ALERGIAS",
    fieldNumber: "NÚMERO",
    fieldCapacity: "CAPACIDAD",
    fieldShape: "FORMA",
    fieldLabel: "ETIQUETA",
    fieldColor: "COLOR",
    shapeRound: "Redonda",
    shapeRect: "Rectangular",
    notSeated: "Sin asignar",
    addGuestBtn: "Añadir invitado",
    createTableBtn: "Crear mesa",
    deleteTableBtn: "Eliminar mesa",
    settingName: "NOMBRE",
    settingDate: "FECHA",
    settingType: "TIPO",
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
    tabList: "📋 Liste",
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
    loginTagline: "Die professionelle Event-Management-Plattform",
    loginHero: "Organisieren. Platzieren. Beeindrucken.",
    loginSub: "Von der Einladung bis zum Saal — verwalten Sie jedes Detail von einer Anwendung aus.",
    loginCta: "Kostenlos mit Google starten",
    loginFree: "Kostenlos · Keine Kreditkarte · Cloud-synchronisiert",
    loginF1: "Interaktiver Saalplan",
    loginF1d: "Tische per Drag & Drop",
    loginF2: "RSVP & Einladungen",
    loginF2d: "Bestätigungen in Echtzeit verfolgen",
    loginF3: "Premium-Exporte",
    loginF3d: "PDF, druckbare Tischkarten, QR-Codes",
    loginF4: "Proaktive KI",
    loginF4d: "Ein Assistent für Ihr Event",
    loginTrust1: "Hochzeiten",
    loginTrust2: "Galas",
    loginTrust3: "Konferenzen",
    loginTrust4: "Firmenevents",
    loginFooterTitle: "Bereit, Ihre Events zu perfektionieren?",
    trustedFor: "Unsere Kunden organisieren",
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
    // Stats bar
    statTables: "Tische",
    statGuests: "Gäste",
    statSeated: "Platziert",
    statWaiting: "Wartend",
    statDiets: "Spezialdiäten",
    daysAgoLabel: "vergangen",
    todayLabel: "Heute!",
    fieldName: "NAME *",
    fieldEmail: "E-MAIL",
    fieldTable: "TISCH",
    fieldNotes: "NOTIZEN",
    fieldDiet: "ERNÄHRUNG",
    fieldAllergies: "ALLERGIEN",
    fieldNumber: "NUMMER",
    fieldCapacity: "KAPAZITÄT",
    fieldShape: "FORM",
    fieldLabel: "BEZEICHNUNG",
    fieldColor: "FARBE",
    shapeRound: "Rund",
    shapeRect: "Rechteckig",
    notSeated: "Nicht platziert",
    addGuestBtn: "Gast hinzufügen",
    createTableBtn: "Tisch erstellen",
    deleteTableBtn: "Tisch löschen",
    settingName: "NAME",
    settingDate: "DATUM",
    settingType: "TYP",
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
    loginTagline: "La piattaforma professionale di gestione eventi",
    loginHero: "Organizza. Posiziona. Impressiona.",
    loginSub: "Dall'invito alla sala, gestisci ogni dettaglio da un'unica applicazione.",
    loginCta: "Inizia gratis con Google",
    loginFree: "Gratis · Senza carta · Sincronizzato nel cloud",
    loginF1: "Pianta della sala interattiva",
    loginF1d: "Trascina e rilascia i tavoli su una canvas",
    loginF2: "RSVP & inviti",
    loginF2d: "Monitora le conferme in tempo reale",
    loginF3: "Esportazioni premium",
    loginF3d: "PDF, segnaposto stampabili, QR code",
    loginF4: "IA proattiva",
    loginF4d: "Un assistente che guida il tuo evento",
    loginTrust1: "Matrimoni",
    loginTrust2: "Gala",
    loginTrust3: "Conferenze",
    loginTrust4: "Eventi aziendali",
    loginFooterTitle: "Pronti a elevare i vostri eventi?",
    trustedFor: "I nostri clienti organizzano",
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
  },    // Stats bar
    statTables: "Tavoli",
    statGuests: "Ospiti",
    statSeated: "Sistemati",
    statWaiting: "In attesa",
    statDiets: "Diete speciali",
    daysAgoLabel: "passato",
    todayLabel: "Oggi!",
    fieldName: "NOME *",
    fieldEmail: "EMAIL",
    fieldTable: "TAVOLO",
    fieldNotes: "NOTE",
    fieldDiet: "DIETA",
    fieldAllergies: "ALLERGIE",
    fieldNumber: "NUMERO",
    fieldCapacity: "CAPACITÀ",
    fieldShape: "FORMA",
    fieldLabel: "ETICHETTA",
    fieldColor: "COLORE",
    shapeRound: "Rotondo",
    shapeRect: "Rettangolare",
    notSeated: "Non assegnato",
    addGuestBtn: "Aggiungi ospite",
    createTableBtn: "Crea tavolo",
    deleteTableBtn: "Elimina tavolo",
    settingName: "NOME",
    settingDate: "DATA",
    settingType: "TIPO",

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
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return { t, lang, setLang };
}

// Drapeaux pour le sélecteur
const LANG_FLAGS = { fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹' };
const LANG_NAMES = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', it: 'Italiano' };




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
  const tableRows = ev.tables.map(function(tbl) {
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
    const table = ev.tables.find(function(tbl2){ return tbl2.id === g.tableId; });
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

function Btn({ children, onClick, variant="primary", small, style={}, disabled }) {
  const [hov, setHov] = useState(false);
  const base = {
    display:"inline-flex", alignItems:"center", gap:6,
    padding: small ? "5px 12px" : "9px 18px",
    borderRadius:8,
    fontSize: small ? 12 : 13,
    fontWeight:600, letterSpacing:.3,
    cursor: disabled ? "not-allowed" : "pointer",
    border:"none",
    transition:"all .18s",
    fontFamily:"inherit",
    opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    primary: {
      background: hov ? "linear-gradient(135deg,#d4a035,#F0C97A)" : "linear-gradient(135deg,#C9973A,#e8b85a)",
      color:"#0d0d14",
      boxShadow: hov ? "0 4px 16px rgba(201,151,58,0.45)" : "0 2px 8px rgba(201,151,58,0.25)",
    },
    ghost: {
      background: hov ? "rgba(201,151,58,0.12)" : "transparent",
      color: hov ? "#F0C97A" : "#C9973A",
      border:"1px solid rgba(201,151,58,0.35)",
      boxShadow:"none",
    },
    danger: {
      background: hov ? "#c94040" : "rgba(224,82,82,0.12)",
      color: hov ? "#fff" : "#e05252",
      border: hov ? "none" : "1px solid rgba(224,82,82,0.35)",
    },
    secondary: {
      background: hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
      color:"rgba(255,255,255,0.8)",
      border:"1px solid rgba(255,255,255,0.12)",
    },
  };
  return (
    <button onClick={disabled?undefined:onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{...base, ...(variants[variant]||variants.primary), ...style}}>
      {children}
    </button>
  );
}

function Badge({ children, color, style={} }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      padding:"3px 9px", borderRadius:99,
      fontSize:10, fontWeight:700, letterSpacing:.8, textTransform:"uppercase",
      background: (color||"#C9973A")+"22",
      color: color||"#C9973A",
      border:`1px solid ${(color||"#C9973A")}44`,
      ...style
    }}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children, width=520 }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.2)", borderRadius:16, padding:"28px 32px", width:"90%", maxWidth:width, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.6)", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, paddingBottom:16, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <h2 style={{ margin:0, fontSize:17, fontWeight:700, color:"#ffffff", letterSpacing:.3 }}>{title}</h2>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, width:30, height:30, cursor:"pointer", color:"rgba(255,255,255,0.5)", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, style={} }) {
  return (
    <div style={{ marginBottom:16, ...style }}>
      {label && <label style={{ display:"block", marginBottom:6, fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)", letterSpacing:.8, textTransform:"uppercase" }}>{label}</label>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type="text", style={} }) {
  const [foc, setFoc] = useState(false);
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type}
      onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
      style={{ width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.05)", border: foc ? "1px solid rgba(201,151,58,0.6)" : "1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#ffffff", fontSize:14, outline:"none", transition:"border .15s", boxSizing:"border-box", fontFamily:"inherit", ...style }}
    />
  );
}

function Select({ value, onChange, children, style={} }) {
  return (
    <select value={value} onChange={onChange}
      style={{ width:"100%", padding:"9px 12px", background:"#18182a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#ffffff", fontSize:14, outline:"none", cursor:"pointer", fontFamily:"inherit", ...style }}>
      {children}
    </select>
  );
}

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
        <span style={{color:"rgba(255,255,255,0.45)",fontSize:12,letterSpacing:.5}}>FORME DE LA SALLE</span>
        <div style={{flex:1}}/>
        <Btn small variant={mode==="draw"?"primary":"ghost"} onClick={()=>{setMode(mode==="draw"?"view":"draw");setDrawing([])}}>
          {mode==="draw" ? "✏️ Annuler dessin" : "✏️ Dessiner"}
        </Btn>
        <Btn small variant={mode==="edit"?"primary":"ghost"} onClick={()=>setMode(mode==="edit"?"view":"edit")}>
          {mode==="edit" ? "✔ Terminer" : "⦿ Modifier points"}
        </Btn>
        <div style={{width:1,height:20,background:C.border}}/>
        <span style={{color:"rgba(255,255,255,0.45)",fontSize:12}}>Présets :</span>
        <Btn small variant="muted" onClick={presetRectangle}>▭ Rect</Btn>
        <Btn small variant="muted" onClick={presetL}>⌐ L</Btn>
        <Btn small variant="muted" onClick={presetU}>U</Btn>
        <Btn small variant="muted" onClick={presetHex}>⬡ Hex</Btn>
      </div>

      {mode === "draw" && (
        <div style={{background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"18",border:`1px solid ${C.gold}44`,borderRadius:8,padding:"8px 14px",marginBottom:10,fontSize:12,color:"#C9973A"}}>
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
          borderRadius:12, border:"1px solid rgba(201,151,58,0.15)",
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

function FloorPlan({ ev, onUpdateTables, onSelectTable, selectedTable, highlightAvailable, onDropGuestToTable }) {
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
    const table = ev.tables.find(function(tbl2){ return tbl2.id === tableId; });
    setDragging({ tableId, offsetX: pt.x - table.x, offsetY: pt.y - table.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const pt = getSVGPoint(e);
    onUpdateTables(ev.tables.map(function(tbl){
      if (tbl.id === dragging.tableId) {
        return { ...tbl, x: Math.max(50, Math.min(CANVAS_W-50, pt.x - dragging.offsetX)), y: Math.max(50, Math.min(CANVAS_H-50, pt.y - dragging.offsetY)) };
      }
      return tbl;
    }));
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
      style={{ width:"100%", display:"block", background:"#0a0604", borderRadius:12, border:"1px solid rgba(201,151,58,0.15)", cursor:"default", userSelect:"none" }}
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
      {ev.tables.map(function(tbl) {
        const seated = ev.guests.filter(g => g.tableId === tbl.id);
        const full = seated.length >= tbl.capacity;
        const sel = selectedTable === tbl.id;
        const available = highlightAvailable && !full;
        const col = sel ? C.gold : full ? C.green : available ? "#4CAF50" : (tbl.color || theme.color);
        const glowStyle = available ? { filter:"drop-shadow(0 0 8px #4CAF5066)" } : {};
        const diets = seated.filter(g => g.diet !== "standard");

        return (
          <g key={tbl.id} style={{ cursor: "grab", ...glowStyle }} onMouseDown={e => handleMouseDown(e, tbl.id)} onClick={() => onSelectTable(tbl.id === selectedTable ? null : tbl.id)}
            onDragOver={function(e){ e.preventDefault(); e.currentTarget.style.filter="drop-shadow(0 0 12px #C9973A88)"; }}
            onDragLeave={function(e){ e.currentTarget.style.filter=""; }}
            onDrop={function(e){ e.preventDefault(); e.currentTarget.style.filter=""; var gId=e.dataTransfer.getData("guestId"); if(gId && onDropGuestToTable) onDropGuestToTable(gId, tbl.id); }}>
            <title>{`Table ${tbl.number}${tbl.label ? " — " + tbl.label : ""}
${seated.map(g=>g.name).join(", ") || "Vide"}
${seated.length}/${tbl.capacity} places`}</title>
            {tbl.shape === "rect" ? (
              <rect
                x={tbl.x - TABLE_RECT_W/2} y={tbl.y - TABLE_RECT_H/2}
                width={TABLE_RECT_W} height={TABLE_RECT_H}
                rx="8" fill={col + "22"} stroke={col} strokeWidth={sel?3:1.5}
              />
            ) : (
              <circle cx={tbl.x} cy={tbl.y} r={TABLE_R} fill={col + "22"} stroke={col} strokeWidth={sel?3:1.5}/>
            )}
            {sel && <circle cx={tbl.x} cy={tbl.y} r={TABLE_R+8} fill="none" stroke={col} strokeWidth="1" strokeDasharray="4,3" opacity=".5"/>}

            {/* Arc de remplissage */}
            {(() => {
              const pct = tbl.capacity > 0 ? seated.length / tbl.capacity : 0;
              const r = TABLE_R + 6;
              const circ = 2 * Math.PI * r;
              const dash = pct * circ;
              const fillCol = pct >= 1 ? C.green : pct > 0.7 ? "#E8845A" : col;
              return tbl.shape !== "rect" && pct > 0 ? (
                <circle cx={tbl.x} cy={tbl.y} r={r} fill="none" stroke={fillCol} strokeWidth="3"
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={circ * 0.25}
                  strokeLinecap="round" opacity=".7" style={{pointerEvents:"none"}}/>
              ) : null;
            })()}
            <text x={tbl.x} y={tbl.y-4} textAnchor="middle" fill={col} fontSize="15" fontWeight="700" fontFamily="Georgia,serif" style={{pointerEvents:"none"}}>{tbl.number}</text>
            <text x={tbl.x} y={tbl.y+13} textAnchor="middle" fill={col} fontSize="10" fontFamily="Georgia,serif" opacity=".8" style={{pointerEvents:"none"}}>{seated.length}/{tbl.capacity}</text>
            {tbl.label && <text x={tbl.x} y={tbl.y+27} textAnchor="middle" fill={col} fontSize="9" fontFamily="Georgia,serif" opacity=".6" style={{pointerEvents:"none"}}>{tbl.label}</text>}

            {/* Diet dots */}
            {diets.slice(0,4).map((g,i) => {
              const d = dietInfo(g.diet);
              const a = (i/4)*2*Math.PI - Math.PI/2;
              return <circle key={g.id} cx={tbl.x + (TABLE_R+10)*Math.cos(a)} cy={tbl.y + (TABLE_R+10)*Math.sin(a)} r="5" fill={d.color} stroke={C.dark} strokeWidth="1"/>;
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
    const table = ev.tables.find(function(tbl2){ return tbl2.id === g.tableId; });
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
  const { t: tHook, lang, setLang } = useI18n();
  const t = tProp || tHook;
  const [hovered, setHovered] = useState(null);

  const FEATURES = [
    { icon:"🗺️", title: t.loginF1 || "Plan de salle interactif", desc: t.loginF1d || "Glissez-déposez vos tables sur un canvas intuitif" },
    { icon:"💌", title: t.loginF2 || "RSVP & invitations", desc: t.loginF2d || "Suivez les confirmations en temps réel" },
    { icon:"🖨️", title: t.loginF3 || "Exports premium", desc: t.loginF3d || "PDF, chevalets imprimables, QR codes invités" },
    { icon:"🤖", title: t.loginF4 || "IA proactive", desc: t.loginF4d || "Un assistant qui analyse et guide votre événement" },
  ];

  const TRUST = [t.loginTrust1||"Mariages", t.loginTrust2||"Galas", t.loginTrust3||"Conférences", t.loginTrust4||"Corporate"];

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d14", fontFamily:"'Inter','Segoe UI',sans-serif", color:"#ffffff", overflowX:"hidden" }}>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", padding:"0 40px", height:64, background:"rgba(13,13,20,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(201,151,58,0.2)" }}>
        <span style={{ fontSize:20, fontWeight:800, letterSpacing:.5, color:"#F0C97A" }}>TableMaître</span>
        <div style={{ flex:1 }}/>
        {/* Sélecteur de langue — visible et accessible */}
        <div style={{ display:"flex", gap:4, marginRight:20, background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"5px 8px", border:"1px solid rgba(255,255,255,0.12)" }}>
          {Object.entries(LANG_FLAGS).map(([lk, flag]) => (
            <button key={lk} onClick={()=>setLang(lk)} title={LANG_NAMES[lk]} style={{
              background: lang===lk ? "linear-gradient(135deg,#C9973A,#F0C97A)" : "transparent",
              border:"none", borderRadius:8, padding:"4px 10px", cursor:"pointer",
              fontSize:18, transition:"all .2s",
              opacity: lang===lk ? 1 : 0.55,
              transform: lang===lk ? "scale(1.15)" : "scale(1)",
              lineHeight:1,
            }}>{flag}</button>
          ))}
        </div>
        <button onClick={onLogin} style={{ padding:"9px 22px", background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:99, cursor:"pointer", color:"#0d0d14", fontWeight:800, fontSize:13, letterSpacing:.5, whiteSpace:"nowrap" }}>
          {t.loginGoogle || "Se connecter avec Google"}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", textAlign:"center" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:700, background:"radial-gradient(ellipse, rgba(201,151,58,0.13) 0%, transparent 65%)", pointerEvents:"none", borderRadius:"50%" }}/>
        <div style={{ position:"relative", maxWidth:740, margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,151,58,0.12)", border:"1px solid rgba(201,151,58,0.4)", borderRadius:99, padding:"7px 20px", marginBottom:36, fontSize:12, color:"#F0C97A", letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#C9973A", display:"inline-block" }}/>
            {t.loginTagline || "La plateforme pro de gestion d'événements"}
          </div>
          <h1 style={{ fontSize:"clamp(40px,6vw,72px)", fontWeight:800, lineHeight:1.08, letterSpacing:-1.5, margin:"0 0 24px", color:"#ffffff", fontFamily:"Georgia,'Palatino Linotype',serif" }}>
            {t.loginHero || "Organisez. Placez. Impressionnez."}
          </h1>
          <p style={{ fontSize:18, color:"rgba(255,255,255,0.6)", maxWidth:520, margin:"0 auto 48px", lineHeight:1.75 }}>
            {t.loginSub || "De l'invitation à la salle, gérez chaque détail de votre événement depuis une seule application."}
          </p>
          <button onClick={onLogin} style={{ display:"inline-flex", alignItems:"center", gap:12, padding:"18px 44px", background:"linear-gradient(135deg,#C9973A 0%,#F0C97A 100%)", border:"none", borderRadius:99, cursor:"pointer", color:"#0d0d14", fontWeight:800, fontSize:17, letterSpacing:.3, boxShadow:"0 8px 40px rgba(201,151,58,0.4)", transition:"transform .2s, box-shadow .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 16px 56px rgba(201,151,58,0.55)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 8px 40px rgba(201,151,58,0.4)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {t.loginCta || "Commencer gratuitement avec Google"}
          </button>
          <p style={{ marginTop:14, fontSize:12, color:"rgba(255,255,255,0.35)", letterSpacing:1 }}>
            {t.loginFree || "Gratuit · Sans carte bancaire · Synchronisé cloud"}
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"80px 24px", background:"rgba(255,255,255,0.025)", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:1040, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:20 }}>
          {FEATURES.map((f,i) => (
            <div key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)} style={{ background: hovered===i?"rgba(201,151,58,0.1)":"rgba(255,255,255,0.04)", border: hovered===i?"1px solid rgba(201,151,58,0.5)":"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"28px 24px", transition:"all .25s" }}>
              <div style={{ fontSize:34, marginBottom:14, lineHeight:1 }}>{f.icon}</div>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 8px", color: hovered===i?"#F0C97A":"#ffffff" }}>{f.title}</h3>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding:"56px 24px", textAlign:"center" }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:3, textTransform:"uppercase", marginBottom:20, fontWeight:600 }}>
          {t.trustedFor || "Nos clients organisent"}
        </p>
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10 }}>
          {TRUST.map((label,i) => (
            <span key={i} style={{ padding:"9px 22px", border:"1px solid rgba(201,151,58,0.3)", borderRadius:99, fontSize:13, color:"rgba(255,255,255,0.65)", letterSpacing:.5 }}>{label}</span>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding:"80px 24px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.07)", background:"rgba(201,151,58,0.04)" }}>
        <h2 style={{ fontSize:34, fontWeight:800, fontFamily:"Georgia,serif", margin:"0 0 14px", color:"#ffffff" }}>
          {t.loginFooterTitle || "Prêt à sublimer vos événements ?"}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:36, fontSize:15 }}>
          {t.loginFree || "Gratuit · Sans carte bancaire · Synchronisé cloud"}
        </p>
        <button onClick={onLogin} style={{ padding:"17px 40px", background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:99, cursor:"pointer", color:"#0d0d14", fontWeight:800, fontSize:16, boxShadow:"0 8px 40px rgba(201,151,58,0.35)", display:"inline-flex", alignItems:"center", gap:10 }}>
          {t.loginCta || "Commencer gratuitement avec Google"}
        </button>
      </section>
    </div>
  );
}

function SuperAdminPanel({ events, setEvents, users, setUsers, onLogout }) {
  const { t } = useI18n();
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
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:"#ffffff" }}>
      {/* Nav */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:"#C9973A", letterSpacing:1 }}>🪑 TableMaître</span>
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
                <p style={{ color:"rgba(255,255,255,0.45)", margin:"4px 0 0", fontSize:13 }}>{events.length} projet{events.length>1?"s":""}</p>
              </div>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowNewProject(true)}>+ Nouveau projet</Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
              {events.map(ev=>{
                const owner = users.find(u=>u.id===ev.ownerId);
                const theme = THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
                return (
                  <div key={ev.id} style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:16, padding:24, transition:"all .2s" }}>
                    <div style={{ display:"flex", alignItems:"start", gap:12, marginBottom:12 }}>
                      <span style={{ fontSize:28 }}>{theme.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{ color:"#ffffff", fontSize:16, marginBottom:2 }}>{ev.name}</div>
                        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{ev.date}</div>
                      </div>
                      <Badge color={theme.color}>{theme.label}</Badge>
                    </div>
                    <div style={{ display:"flex", gap:16, fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:12 }}>
                      <span>🪑 {ev.tables.length} tables</span>
                      <span>👤 {ev.guests.length} invités</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:24,height:24,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:10,fontWeight:700 }}>
                        {owner?.avatar||"?"}
                      </div>
                      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{owner?.name||"Sans propriétaire"}</span>
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
                { label:"Projets total", val:events.length, icon:"📁", color:"#C9973A" },
                { label:"Utilisateurs", val:users.length, icon:"👥", color:C.blue },
                { label:"Invités total", val:events.reduce((s,e)=>s+e.guests.length,0), icon:"👤", color:C.green },
                { label:"Tables", val:events.reduce((s,e)=>s+e.tables.length,0), icon:"🪑", color:"#C9973A" },
                { label:"Projets Pro", val:events.filter(e=>e.plan==="pro").length, icon:"⭐", color:"#E8845A" },
                { label:"Projets Free", val:events.filter(e=>e.plan==="free").length, icon:"🆓", color:"rgba(255,255,255,0.45)" },
              ].map(s => (
                <div key={s.label} style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"20px 24px" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:16, padding:24 }}>
              <h3 style={{ color:"#C9973A", margin:"0 0 16px", fontWeight:400, fontSize:16 }}>🎟️ Codes promotionnels actifs</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {Object.entries(VOUCHERS).map(([code, v]) => (
                  <div key={code} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#13131e", borderRadius:10 }}>
                    <span style={{ fontFamily:"monospace", color:"#C9973A", fontWeight:700, fontSize:14, minWidth:120 }}>{code}</span>
                    <span style={{ color:"#ffffff", fontSize:13, flex:1 }}>{v.description}</span>
                    <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>-{v.discount}%</span>
                    <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>max {v.maxUses} utilisations</span>
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
                <p style={{ color:"rgba(255,255,255,0.45)", margin:"4px 0 0", fontSize:13 }}>{users.length} comptes</p>
              </div>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowNewUser(true)}>+ Nouvel utilisateur</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {users.map(u=>(
                <div key={u.id} style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:42,height:42,borderRadius:"50%",background:u.role==="superadmin"?C.red+"33":C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:u.role==="superadmin"?C.red:C.gold,fontSize:15,fontWeight:700 }}>
                    {u.avatar}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{ color:"#ffffff", fontSize:15 }}>{u.name}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{u.email}</div>
                  </div>
                  <Badge color={u.role==="superadmin"?C.red:C.gold}>{u.role}</Badge>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>
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
          <Field label={t.settingDate}>
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
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", email:"", diet:"standard", notes:"", plus1:false, allergies:[] });
  const [done, setDone] = useState(false);

  const toggleAllergy = (id) => {
    setForm(f=>({ ...f, allergies: f.allergies.includes(id)?f.allergies.filter(x=>x!==id):[...f.allergies,id] }));
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0d0d14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center", color:"#ffffff", padding:20 }}>
        <div style={{ fontSize:64 }}>🎉</div>
        <h2 style={{ fontFamily:"Georgia,serif", color:"#C9973A", fontSize:28, fontWeight:400 }}>Merci !</h2>
        <p style={{ color:"rgba(255,255,255,0.45)" }}>Vos préférences ont été enregistrées<br/>pour <strong style={{ color:"#ffffff" }}>{event.name}</strong></p>
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
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:0 }}>Merci de renseigner vos préférences</p>
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
            <Field label={t.fieldEmail}>
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
  const [showAddZone, setShowAddZone] = useState(false);
  const [showAddFurniture, setShowAddFurniture] = useState(false);
  const [newZone, setNewZone] = useState({ label:"", icon:"📍", color:"#C9973A" });
  const [newFurniture, setNewFurniture] = useState({ label:"", icon:"🪑", color:"#8A7355", width:80, height:40 });
  const [planSubTab, setPlanSubTab] = useState("tables");
  const [showConstraint, setShowConstraint] = useState(false);
  // IA proactive
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [aiAssistMsg, setAiAssistMsg] = useState("");
  const [aiAssistHistory, setAiAssistHistory] = useState([]);
  const [aiAssistLoading, setAiAssistLoading] = useState(false);
  // Budget
  const BUDGET_CATEGORIES = [
    {id:"salle",label:"Salle / Lieu",icon:"🏛"},
    {id:"traiteur",label:"Traiteur",icon:"🍽"},
    {id:"boissons",label:"Boissons",icon:"🍷"},
    {id:"musique",label:"Musique / DJ",icon:"🎵"},
    {id:"fleurs",label:"Fleurs / Déco",icon:"💐"},
    {id:"photo",label:"Photo / Vidéo",icon:"📸"},
    {id:"transport",label:"Transport",icon:"🚌"},
    {id:"tenues",label:"Tenues",icon:"👗"},
    {id:"invitations",label:"Invitations",icon:"💌"},
    {id:"divers",label:"Divers",icon:"📦"},
  ];
  const [newBudgetLine, setNewBudgetLine] = useState({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""});
  const [showAddBudget, setShowAddBudget] = useState(false);
  // Planning
  const [newTask, setNewTask] = useState({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});
  const [showAddTask, setShowAddTask] = useState(false);
  // Programme
  const [newProgramItem, setNewProgramItem] = useState({time:"",label:"",icon:"🎤",notes:""});
  const [showAddProgramItem, setShowAddProgramItem] = useState(false);
  const [newSupplier, setNewSupplier] = useState({name:"",role:"",phone:"",email:"",notes:""});
  const [showAddSupplier, setShowAddSupplier] = useState(false);
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
  const [aiPlacing, setAiPlacing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  async function autoPlace() {
    if (ev.tables.length === 0 || ev.guests.length === 0) return;
    setAiPlacing(true);
    setAiExplanation("");
    try {
      const context = {
        tables: ev.tables.map(function(tbl){ return { id: tbl.id, number: tbl.number, capacity: tbl.capacity, label: tbl.label||"" }; }),
        guests: ev.guests.map(function(g){ return { id: g.id, name: g.name, diet: g.diet, allergies: g.allergies||[] }; }),
        constraints: ev.constraints || [],
      };
      const prompt = `Tu es un assistant de plans de table.
Tables disponibles: ${JSON.stringify(context.tables)}
Invités: ${JSON.stringify(context.guests)}
Contraintes: ${JSON.stringify(context.constraints)}
Assigne chaque invité à une table en respectant la capacité max, les contraintes ensemble/séparés, et en regroupant les régimes alimentaires similaires.
Réponds UNIQUEMENT en JSON valide avec ce format exact:
{"assignments": [{"guestId": "id_ici", "tableId": "id_table_ici"}], "explanation": "explication courte en français de tes choix"}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await response.json();
      const text = (data.content && data.content[0] && data.content[0].text) || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);
      const newGuests = ev.guests.map(function(g) {
        const assignment = result.assignments.find(function(a){ return String(a.guestId) === String(g.id); });
        return assignment ? { ...g, tableId: assignment.tableId } : g;
      });
      updateEv(function(evUp){ return { ...evUp, guests: newGuests }; });
      setAiExplanation(result.explanation || "Placement optimisé !");
    } catch (e) {
      // Fallback simple
      updateEv(function(evState){
        const newG = evState.guests.map(function(g){ return {...g, tableId:null}; });
        const tables = evState.tables;
        const groups = [];
        (evState.constraints||[]).filter(function(c){ return c.type==="together"; }).forEach(function(c){
          const ex = groups.find(function(g){ return g.includes(c.a)||g.includes(c.b); });
          if(ex){if(!ex.includes(c.a))ex.push(c.a);if(!ex.includes(c.b))ex.push(c.b);}
          else groups.push([c.a,c.b]);
        });
        const assigned = new Set();
        var ti = 0;
        groups.forEach(function(group){
          if(ti>=tables.length)return;
          group.forEach(function(gId){ const g=newG.find(function(x){ return x.id===gId; }); if(g){g.tableId=tables[ti].id;assigned.add(gId);} });
          ti++;
        });
        newG.filter(function(g){ return !assigned.has(g.id); }).forEach(function(g){
          while(ti<tables.length){ const s=newG.filter(function(x){ return x.tableId===tables[ti].id; }).length; if(s<tables[ti].capacity){g.tableId=tables[ti].id;break;} ti++; }
        });
        return {...evState, guests:newG};
      });
      setAiExplanation("Placement automatique (IA indisponible)");
    }
    setAiPlacing(false);
  }

  async function sendAiAssist(userMsg) {
    if (!userMsg.trim()) return;
    const newHistory = [...aiAssistHistory, {role:"user", content:userMsg}];
    setAiAssistHistory(newHistory);
    setAiAssistMsg("");
    setAiAssistLoading(true);
    const daysLeft = ev.date ? Math.round((new Date(ev.date)-new Date())/(1000*60*60*24)) : null;
    const rsvpC = ev.guests.filter(g=>g.rsvp==="confirmed").length;
    const rsvpP = ev.guests.filter(g=>!g.rsvp||g.rsvp==="pending").length;
    const budgTot = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
    const budgReal = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.actual)||0),0);
    const planDone = (ev.planning||[]).filter(p=>p.done).length;
    const planTot = (ev.planning||[]).length;
    const context = `Tu es un assistant expert en organisation d'événements intégré à l'app TableMaître.
Événement : "${ev.name}" (${ev.type}, le ${ev.date||"date non définie"})${daysLeft!==null?`, dans ${daysLeft} jours`:""}
Invités : ${ev.guests.length} total — ${rsvpC} confirmés, ${rsvpP} en attente
Tables : ${ev.tables.length}, places assises : ${ev.guests.filter(g=>g.tableId).length}/${ev.guests.length}
Budget : estimé ${budgTot}€, réel ${budgReal}€ (${(ev.budget||[]).length} postes)
Planning : ${planDone}/${planTot} tâches faites
Prestataires : ${(ev.suppliers||[]).length}
Programme : ${(ev.programme||[]).length} étapes
Réponds en français, de façon concrète, bienveillante et proactive. Max 3 paragraphes courts.`;
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:600,
          system: context,
          messages: newHistory,
        })
      });
      const data = await resp.json();
      const reply = (data.content&&data.content[0]&&data.content[0].text)||"Désolé, je n'ai pas pu répondre.";
      setAiAssistHistory(h=>[...h,{role:"assistant",content:reply}]);
    } catch(e) {
      setAiAssistHistory(h=>[...h,{role:"assistant",content:"❌ IA temporairement indisponible."}]);
    }
    setAiAssistLoading(false);
  }

  const rsvpConfirmed = ev.guests.filter(g=>g.rsvp==="confirmed").length;
  const rsvpDeclined  = ev.guests.filter(g=>g.rsvp==="declined").length;
  const rsvpPending   = ev.guests.filter(g=>!g.rsvp||g.rsvp==="pending").length;
  const budgetTotal   = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
  const budgetSpent   = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.actual)||0),0);
  const planningDone  = (ev.planning||[]).filter(p=>p.done).length;
  const planningTotal = (ev.planning||[]).length;

  const TABS = [
    {id:"plan",         icon:"🗺",  label: t ? t.tabPlan.replace(/^\S+\s/,"") : "Plan"},
    {id:"list",         icon:"📋",  label:"Liste"},
    {id:"guests",       icon:"👥",  label:`${t ? t.tabGuests.replace(/^\S+\s/,"") : "Guests"} (${ev.guests.length})`},
    {id:"rsvp",         icon:"💌",  label:`RSVP${rsvpPending>0?" ("+rsvpPending+"⏳)":""}`},
    {id:"budget",       icon:"💰",  label:"Budget"},
    {id:"planning",     icon:"🗓",  label:`Planning${planningTotal>0?" ("+planningDone+"/"+planningTotal+")":""}`},
    {id:"programme",    icon:"🎵",  label:"Programme"},
    {id:"diet",         icon:"🍽️",  label: t ? t.tabFood.replace(/^\S+\s/,"") : "Dietary"},
    {id:"constraints",  icon:"⚙",  label: t ? t.tabConstraints.replace(/^\S+\s/,"") : "Constraints"},
    {id:"logistique",   icon:"🗂",  label:"Logistique"},
  ];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:"#ffffff" }}>
      {/* Header */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 24px", display:"flex", alignItems:"center", height:56, position:"sticky", top:0, zIndex:100, gap:12, flexWrap:"wrap" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>{t.back}</button>
        <span style={{ color:C.border }}>|</span>
        <span style={{ fontSize:20 }}>{theme.icon}</span>
        <span style={{ color:"#ffffff", fontSize:16, fontWeight:400 }}>{ev.name}</span>
        <Badge color={theme.color}>{theme.label}</Badge>
        <div style={{flex:1}}/>
        <Btn small variant="ghost" onClick={()=>setShowQR(true)}>📱 QR Code</Btn>
        <Btn small variant="ghost" onClick={() => {
          // Inclure userId dans l'URL pour permettre la lecture sans auth
          var fb = getFirebase();
          var uid = fb && fb.auth && fb.auth.currentUser ? fb.auth.currentUser.uid : "";
          var joinParam = uid ? uid + "___" + ev.id : ev.id;
          var url = window.location.origin + "/?join=" + joinParam;
          if (navigator.share) {
            navigator.share({ title: ev.name, url: url }).catch(function() {
              // User cancelled or share failed - fallback to clipboard
              navigator.clipboard.writeText(url).then(function(){ setEditorSaveToast(true); });
            });
          } else { 
            navigator.clipboard.writeText(url).then(function(){ setEditorSaveToast(true); }); 
          }
        }}>🔗 Partager</Btn>
        <Btn small variant="success" onClick={()=>printPlaceCards(ev)}>{t.placeCards}</Btn>
        <Btn small variant="ghost" onClick={()=>printFloorPlan(ev)}>{t.floorPlan}</Btn>
        <Btn small onClick={autoPlace} style={{opacity:aiPlacing?0.7:1}}>{aiPlacing?"🤖 IA en cours...":t.autoPlace}</Btn>
        <Btn small variant="ghost" onClick={()=>{setAiAssistOpen(o=>!o);}} style={{background:aiAssistOpen?C.gold+"33":"none",border:`1px solid ${aiAssistOpen?C.gold:C.border}`}}>🤖 Assistant IA</Btn>
        <button onClick={()=>setShowSettings(true)} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:18 }}>⚙</button>
      </div>

      {/* Notes bar */}
      {ev.notes && (
        <div style={{ background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"11", borderBottom:`1px solid ${C.gold}22`, padding:"8px 24px", fontSize:12, color:"rgba(255,255,255,0.45)", fontStyle:"italic" }}>
          {t.note} {ev.notes}
        </div>
      )}
      {/* Stats bar */}
      <div style={{ background:C.mid+"55", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"10px 24px", display:"flex", gap:24, overflowX:"auto" }}>
        {[
          {label:t.statTables,    val:ev.tables.length,  color:"#C9973A"},
          {label:t.statGuests,   val:ev.guests.length,  color:"#C9973A"},
          {label:t.statSeated,    val:seated.length,     color:C.green},
          {label:t.statWaiting,val:unseated.length,   color:unseated.length>0?C.red:C.green},
          {label:t.statDiets, val:dietStats.reduce((s,d)=>s+d.count,0), color:C.blue},
        ].map(s=>(
          <div key={s.label} style={{ textAlign:"center", minWidth:80 }}>
            <div style={{ fontSize:20, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ background:"rgba(13,13,20,0.95)", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 24px", display:"flex", gap:0, overflowX:"auto" }}>
        {TABS.map(tabItem=>(
          <button key={tabItem.id} onClick={()=>setTab(tabItem.id)} style={{
            background:"none", border:"none", borderBottom:`2px solid ${tab===tabItem.id?C.gold:"transparent"}`,
            color:tab===tabItem.id?C.gold:C.muted, padding:"14px 18px",
            cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:tab===tabItem.id?700:400, whiteSpace:"nowrap",
          }}>{tabItem.icon} {tabItem.label}</button>
        ))}
      </div>

      {/* ── AI ASSISTANT PANEL ── */}
      {aiAssistOpen && (
        <div style={{ position:"fixed", bottom:24, right:24, width:380, maxHeight:520, zIndex:200, display:"flex", flexDirection:"column", background:"#18182a", border:`1px solid ${C.gold}44`, borderRadius:20, boxShadow:"0 8px 40px #00000066", overflow:"hidden" }}>
          <div style={{ background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"22", borderBottom:`1px solid ${C.gold}33`, padding:"14px 18px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>🤖</span>
            <div style={{ flex:1 }}>
              <div style={{ color:"#C9973A", fontSize:14, fontWeight:700 }}>Assistant IA</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Votre conseiller pour {ev.name}</div>
            </div>
            {aiAssistHistory.length===0 && (
              <button onClick={()=>sendAiAssist("Fais-moi un bilan rapide de l'état de mon événement et dis-moi ce qui est urgent.")}
                style={{ background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"22", border:`1px solid ${C.gold}44`, borderRadius:8, padding:"4px 10px", cursor:"pointer", color:"#C9973A", fontSize:11, fontFamily:"inherit" }}>
                ✨ Bilan auto
              </button>
            )}
            <button onClick={()=>setAiAssistOpen(false)} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:18 }}>✕</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, minHeight:200, maxHeight:340 }}>
            {aiAssistHistory.length===0 && (
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>💬</div>
                Posez-moi une question sur votre événement ou demandez un bilan rapide !
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:14 }}>
                  {["Qu'est-ce qui est urgent à faire ?","Comment optimiser mon budget ?","Qui n'a pas encore répondu ?","Génère-moi un planning type"].map(q=>(
                    <button key={q} onClick={()=>sendAiAssist(q)} style={{
                      background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, padding:"6px 12px",
                      color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:11, fontFamily:"inherit", textAlign:"left",
                    }}>→ {q}</button>
                  ))}
                </div>
              </div>
            )}
            {aiAssistHistory.map((msg,i)=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:msg.role==="user"?"flex-end":"flex-start" }}>
                <div style={{
                  background:msg.role==="user"?C.gold+"33":C.mid,
                  border:`1px solid ${msg.role==="user"?C.gold+"44":C.border}`,
                  borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                  padding:"8px 14px", maxWidth:"90%", fontSize:12, color:"#ffffff", lineHeight:1.6,
                  whiteSpace:"pre-wrap",
                }}>{msg.content}</div>
              </div>
            ))}
            {aiAssistLoading && (
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>🤖 Réflexion en cours…</div>
            )}
          </div>
          <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(201,151,58,0.12)", display:"flex", gap:8 }}>
            <input
              value={aiAssistMsg}
              onChange={e=>setAiAssistMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendAiAssist(aiAssistMsg); } }}
              placeholder="Posez une question…"
              style={{ flex:1, padding:"8px 12px", background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:10, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
            />
            <button onClick={()=>sendAiAssist(aiAssistMsg)} disabled={!aiAssistMsg.trim()||aiAssistLoading}
              style={{ background:"linear-gradient(135deg,#C9973A,#F0C97A)", border:"none", borderRadius:10, padding:"8px 14px", cursor:"pointer", color:C.dark, fontWeight:700, fontSize:13, fontFamily:"inherit", opacity:!aiAssistMsg.trim()||aiAssistLoading?0.5:1 }}>
              →
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>

        {/* ── PLAN TAB ── */}
        {tab==="plan" && (
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {/* Sous-onglets Plan */}
            <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"1px solid rgba(201,151,58,0.12)" }}>
              {[
                {id:"tables", icon:"🗺", label:"Tables & Plan"},
                {id:"salle",  icon:"📐", label:"Édition de salle"},
              ].map(sub=>(
                <button key={sub.id} onClick={()=>setPlanSubTab(sub.id)} style={{
                  background:"none", border:"none", borderBottom:`2px solid ${planSubTab===sub.id?C.gold:"transparent"}`,
                  color:planSubTab===sub.id?C.gold:C.muted, padding:"10px 20px",
                  cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:planSubTab===sub.id?700:400,
                  display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
                }}>{sub.icon} {sub.label}</button>
              ))}
            </div>

            {/* Sous-onglet Tables & Plan */}
            {planSubTab==="tables" && (
          <div style={{ display:"flex", gap:20, alignItems:"start", flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 600px", minWidth:0 }}>
              <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                <Btn small variant="ghost" onClick={()=>setShowAddTable(true)}>{t.addTable}</Btn>
                <Btn small variant="muted" onClick={()=>setShowAddGuest(true)}>{t.addGuest}</Btn>
                <Btn small variant="muted" onClick={()=>setShowAddZone(true)}>+ Zone</Btn>
                <Btn small variant="muted" onClick={()=>setShowAddFurniture(true)}>+ Mobilier</Btn>
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
                <div style={{ marginTop:16, background:"#e05252"+"11", border:`1px solid ${C.red}33`, borderRadius:12, padding:"12px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", marginBottom:8 }}>
                    <div style={{ color:C.red, fontSize:12, letterSpacing:.5, flex:1 }}>{t.unseatedList} ({unseated.length})</div>
                    <button onClick={()=>setHighlightTables(h=>!h)} style={{ background:highlightTables?C.gold:"none", border:`1px solid ${highlightTables?C.gold:C.border}`, borderRadius:6, color:highlightTables?C.dark:C.muted, fontSize:11, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit" }}>
                      {highlightTables ? "✓ Tables visibles" : "👁 Voir places libres"}
                    </button>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {unseated.map(g=>(
                      <span key={g.id}
                        draggable={true}
                        onDragStart={function(e){ e.dataTransfer.setData("guestId", String(g.id)); e.dataTransfer.effectAllowed="move"; }}
                        title="Glisser vers une table sur le plan"
                        onClick={()=>setSelectedUnseatedGuest(selectedUnseatedGuest?.id===g.id?null:g)}
                        style={{
                          background:selectedUnseatedGuest?.id===g.id?C.gold+"44":C.red+"22",
                          border:`1px solid ${selectedUnseatedGuest?.id===g.id?C.gold:C.red}44`,
                          borderRadius:99, padding:"3px 12px", color:"#ffffff", fontSize:12, cursor:"pointer",
                          fontWeight:selectedUnseatedGuest?.id===g.id?700:400
                        }}>
                        {selectedUnseatedGuest?.id===g.id ? "→ " : ""}{g.name}
                      </span>
                    ))}
                    {selectedUnseatedGuest && (
                      <div style={{width:"100%",marginTop:6,fontSize:11,color:"#C9973A"}}>
                        👆 Cliquez sur une table pour y placer {selectedUnseatedGuest.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Side panel */}
            {tableSel && (
              <div style={{ width:260, background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:16, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ color:"#C9973A", fontSize:16 }}>Table {tableSel.number}</div>
                    {tableSel.label && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tableSel.label}</div>}
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tableGuests.length}/{tableSel.capacity} places</div>
                  </div>
                  <div style={{flex:1}}/>
                  <button onClick={()=>setSelectedTable(null)} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:16 }}>✕</button>
                </div>

                {/* Seated guests */}
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
                  {tableGuests.map(g=>{
                    const d=dietInfo(g.diet);
                    return (
                      <div key={g.id} style={{ background:C.mid+"88",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ width:26,height:26,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:11,fontWeight:700 }}>
                          {g.name[0]}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{ color:"#ffffff", fontSize:12 }}>{g.name}</div>
                          {g.diet!=="standard" && <div style={{ color:d.color, fontSize:10 }}>{d.icon} {d.label}</div>}
                        </div>
                        <button onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,tableId:null}:x)}))}
                          style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:13 }}>✕</button>
                      </div>
                    );
                  })}
                </div>

                {/* Add unseated */}
                {unseated.length>0 && tableGuests.length<tableSel.capacity && (
                  <div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:.5, marginBottom:6 }}>AJOUTER À CETTE TABLE</div>
                    {unseated.map(g=>(
                      <button key={g.id} onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,tableId:selectedTable}:x)}))}
                        style={{ display:"block",width:"100%",marginBottom:5,padding:"7px 12px",textAlign:"left",background:"none",border:"1px solid rgba(201,151,58,0.15)",borderRadius:8,color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>
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

            {/* Sous-onglet Salle */}
            {planSubTab==="salle" && (
              <div style={{ maxWidth:900 }}>
                <h3 style={{ fontWeight:400, fontSize:20, marginBottom:20 }}>Forme de la salle</h3>
                <div style={{ marginBottom:20 }}>
                  <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>TEMPLATES RAPIDES</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {[
                      { name:"Rectangle", icon:"⬛", pts:[{x:60,y:60},{x:900,y:60},{x:900,y:560},{x:60,y:560}] },
                      { name:"Forme L", icon:"🔲", pts:[{x:60,y:60},{x:500,y:60},{x:500,y:300},{x:900,y:300},{x:900,y:560},{x:60,y:560}] },
                      { name:"Forme U", icon:"🔳", pts:[{x:60,y:60},{x:300,y:60},{x:300,y:380},{x:640,y:380},{x:640,y:60},{x:900,y:60},{x:900,y:560},{x:60,y:560}] },
                      { name:"Hexagone", icon:"⬡", pts:(function(){ var p=[]; for(var i=0;i<6;i++){var a=i*Math.PI*2/6-Math.PI/6;p.push({x:Math.round(480+280*Math.cos(a)),y:Math.round(310+220*Math.sin(a))});} return p; })() },
                      { name:"Rond", icon:"⭕", pts:(function(){ var p=[]; for(var i=0;i<16;i++){var a=i*Math.PI*2/16;p.push({x:Math.round(480+300*Math.cos(a)),y:Math.round(310+230*Math.sin(a))});} return p; })() },
                    ].map(function(tmpl){ return (
                      <button key={tmpl.name}
                        onClick={function(){
                          if (tmpl.pts && Array.isArray(tmpl.pts)) {
                            updateEv(function(evUp){ return {...evUp, roomShape: tmpl.pts.map(function(p){ return {x:p.x, y:p.y}; })}; });
                          }
                        }}
                        style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:8, padding:"8px 14px", cursor:"pointer", color:"#ffffff", fontFamily:"inherit", fontSize:12, display:"flex", alignItems:"center", gap:6 }}
                      >
                        <span>{tmpl.icon}</span><span>{tmpl.name}</span>
                      </button>
                    ); })}
                  </div>
                </div>
                <RoomShapeEditor shape={ev.roomShape||[]} onChange={shape=>updateEv(e=>({...e,roomShape:shape}))}/>

                {/* Zones spéciales */}
                <div style={{ marginTop:20 }}>
                  <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>ZONES SPÉCIALES</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                    {(ev.zones||[]).map(function(zone, zi){ return (
                      <div key={zi} style={{ background:zone.color+"22", border:"1px solid "+zone.color+"66", borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>{zone.icon}</span>
                        <span style={{ color:zone.color, fontSize:13 }}>{zone.label}</span>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, zones:(evUp.zones||[]).filter(function(_,i){ return i!==zi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14, padding:0 }}>✕</button>
                      </div>
                    ); })}
                    <button onClick={()=>setShowAddZone(true)}
                      style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:8, padding:"6px 14px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12 }}>
                      + Ajouter une zone
                    </button>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>
                    Les zones apparaissent dans les exports PDF. Exemples : Estrade, Scène, Bar, Piste de danse, Photo Booth...
                  </p>
                </div>

                {/* Mobilier */}
                <div style={{ marginTop:24 }}>
                  <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>MOBILIER</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                    {(ev.furniture||[]).map(function(item, fi){ return (
                      <div key={fi} style={{ background:item.color+"22", border:"1px solid "+item.color+"66", borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>{item.icon}</span>
                        <span style={{ color:item.color, fontSize:13 }}>{item.label}</span>
                        <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{item.width}×{item.height}</span>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, furniture:(evUp.furniture||[]).filter(function(_,i){ return i!==fi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14, padding:0 }}>✕</button>
                      </div>
                    ); })}
                    <button onClick={()=>setShowAddFurniture(true)}
                      style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:8, padding:"6px 14px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12 }}>
                      + Ajouter du mobilier
                    </button>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>
                    Exemples : Scène, Bar, Buffet, Photobooth, Podium, Piano...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── GUESTS TAB ── */}
        
        {tab==="list" && (
          <div style={{ padding:"0 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:18 }}>📋 Plan par tables</h3>
              <Btn small variant="ghost" onClick={function(){ exportGuestsCSV(ev); }}>⬇ Export CSV</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {ev.tables.map(function(tbl) {
                var tblGuests = ev.guests.filter(function(g){ return g.tableId === tbl.id; });
                return (
                  <div key={tbl.id} style={{ background:"#18182a", border:"1px solid " + (tbl.color||C.border) + "44", borderRadius:14, overflow:"hidden" }}>
                    <div style={{ background:(tbl.color||C.gold)+"22", padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:tbl.color||C.gold, fontWeight:700, fontSize:15 }}>
                        Table {tbl.number}{tbl.label ? " — " + tbl.label : ""}
                      </span>
                      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tblGuests.length}/{tbl.capacity} places</span>
                    </div>
                    {tblGuests.length === 0 ? (
                      <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, padding:"12px 20px", fontStyle:"italic" }}>— Vide —</p>
                    ) : (
                      <table style={{ width:"100%", borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ borderBottom:"1px solid " + C.border }}>
                            {["Nom","Rôle","Régime","Notes"].map(function(h){ return <th key={h} style={{ padding:"8px 20px", color:"rgba(255,255,255,0.45)", fontSize:11, textAlign:"left", letterSpacing:1 }}>{h}</th>; })}
                          </tr>
                        </thead>
                        <tbody>
                          {tblGuests.map(function(g, idx) {
                            var dinfo = dietInfo(g.diet);
                            return (
                              <tr key={g.id} style={{ borderBottom:idx<tblGuests.length-1?"1px solid "+C.border+"33":"none", background:idx%2===0?"transparent":C.mid+"33" }}>
                                <td style={{ padding:"10px 20px", color:"#ffffff", fontSize:14 }}>
                                  {g.name}
                                  {g.role && <span style={{ marginLeft:6, background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"22", border:"1px solid "+C.gold+"44", borderRadius:99, padding:"1px 8px", fontSize:10, color:"#C9973A" }}>
                                    {{"marie1":"💍","marie2":"💍","temoin":"🎖","famille_proche":"👨‍👩‍👧","ami_proche":"⭐","enfant":"🧒","vip":"🌟","prestataire":"🔧"}[g.role]||""} {{"marie1":"Marié(e)","marie2":"Marié(e)","temoin":"Témoin","famille_proche":"Famille","ami_proche":"Ami proche","enfant":"Enfant","vip":"VIP","prestataire":"Prestataire"}[g.role]||g.role}
                                  </span>}
                                </td>
                                <td style={{ padding:"10px 20px", fontSize:13, color:dinfo.color }}>{dinfo.icon} {dinfo.label}</td>
                                <td style={{ padding:"10px 20px", color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>{g.notes||""}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
              {ev.guests.filter(function(g){ return !g.tableId; }).length > 0 && (
                <div style={{ background:"#e05252"+"11", border:"1px solid "+C.red+"44", borderRadius:14, padding:"12px 20px" }}>
                  <p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:8 }}>⚠ Non placés ({ev.guests.filter(function(g){ return !g.tableId; }).length})</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {ev.guests.filter(function(g){ return !g.tableId; }).map(function(g){
                      return <span key={g.id} style={{ background:"#e05252"+"22", borderRadius:99, padding:"4px 12px", fontSize:12, color:"#ffffff" }}>{g.name}</span>;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                  <div key={g.id} style={{ background:"#18182a",border:"1px solid rgba(201,151,58,0.15)",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14 }}>
                    <div style={{ width:38,height:38,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:15,fontWeight:700 }}>
                      {g.name[0]}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{ color:"#ffffff", fontSize:15 }}>{g.name}</div>
                      {g.email && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{g.email}</div>}
                      {g.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>{g.notes}</div>}
                    </div>
                    {g.diet!=="standard" && <Badge color={d.color}>{d.icon} {d.label}</Badge>}
                    {g.allergies?.length>0 && (
                      <div style={{ display:"flex", gap:4 }}>
                        {g.allergies.map(a=>{const ai=dietInfo(a);return <span key={a} style={{ fontSize:14 }} title={ai.label}>{ai.icon}</span>;})}
                      </div>
                    )}
                    {table ? <Badge color={C.gold}>Table {table.number}</Badge> : <Badge color={C.red}>Non placé</Badge>}
                    <select value={g.tableId||""} onChange={function(evt){ var tid=evt.target.value?parseInt(evt.target.value):null; updateEv(function(evUp){ return {...evUp,guests:evUp.guests.map(function(x){ return x.id===g.id?{...x,tableId:tid}:x; })}; }); }}
                      style={{ background:"#13131e",border:"1px solid "+C.border,borderRadius:8,color:"#ffffff",padding:"4px 8px",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
                      <option value="">— Non placé —</option>
                      {ev.tables.map(function(tbl){return <option key={tbl.id} value={tbl.id}>Table {tbl.number}{tbl.label?" ("+tbl.label+")":""}</option>;})}
                    </select>
                    <button onClick={()=>updateEv(e=>({...e,guests:e.guests.filter(x=>x.id!==g.id)}))}
                      style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:16 }}>🗑</button>
                  </div>
                );
              })}
              {filtered.length===0 && <p style={{ color:"rgba(255,255,255,0.45)", textAlign:"center", padding:32 }}>Aucun invité trouvé</p>}
            </div>
          </div>
        )}

        {/* ── DIET TAB ── */}
        {tab==="diet" && (
          <div style={{ maxWidth:960, display:"flex", flexDirection:"column", gap:24 }}>

            {/* ── HEADER ── */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <h3 style={{ margin:0, fontWeight:400, fontSize:20 }}>Gestion alimentaire</h3>
              <div style={{flex:1}}/>
              <Btn small onClick={function(){ printDietSummary(ev); }}>🖨 Imprimer récapitulatif</Btn>
            </div>

            {/* ── COMPTEURS RÉGIMES ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:12 }}>
              {DIET_OPTIONS.map(function(dopt){
                var count = ev.guests.filter(function(g){ return g.diet===dopt.id || (g.allergies||[]).includes(dopt.id); }).length;
                return (
                  <div key={dopt.id} style={{ background:count>0?dopt.color+"22":C.card, border:"1px solid "+(count>0?dopt.color:C.border), borderRadius:12, padding:"14px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:28 }}>{dopt.icon}</div>
                    <div style={{ color:count>0?dopt.color:"rgba(255,255,255,0.45)", fontSize:22, fontWeight:700 }}>{count}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:2 }}>{dopt.label}</div>
                  </div>
                );
              })}
            </div>

            {/* ── MENU MULTI-COURS ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🍽 Menu de l'événement</h4>
                <Btn small variant="muted" onClick={function(e){
                  var btn = e.currentTarget;
                  btn.disabled = true;
                  btn.textContent = "⏳ Génération...";
                  // IA génère le menu
                  var diets = DIET_OPTIONS.filter(function(d){ return d.id!=="standard"; }).map(function(d){
                    var n = ev.guests.filter(function(g){ return g.diet===d.id || (g.allergies||[]).includes(d.id); }).length;
                    return n > 0 ? n+" "+d.label : null;
                  }).filter(Boolean);
                  var prompt = "Tu es un chef cuisinier expert. " +
                  "Genere un menu pour " + (ev.name||"un evenement") + " de type " + (ev.type||"mariage") + " avec " + ev.guests.length + " invites" + (diets.length ? " dont: " + diets.join(", ") : "") + ". " +
                  "Propose un aperitif, une entree, un plat principal, un fromage, un dessert et une option vegetarienne. " +
                  "Reponds UNIQUEMENT en JSON valide: {appetizer:\"..\",starter:\"..\",main:\"..\",cheese:\"..\",dessert:\"..\",vegOption:\"..\",note:\"conseil\"}";
                  fetch("https://api.anthropic.com/v1/messages", {
                    method:"POST", headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{role:"user",content:prompt}] })
                  }).then(function(r){ return r.json(); }).then(function(d){
                    var text = d.content&&d.content[0]&&d.content[0].text||"";
                    var clean = text.replace(/```json|```/g,"").trim();
                    try {
                      var menu = JSON.parse(clean);
                      updateEv(function(ev2){ return {...ev2, menu:{...ev2.menu, ...menu}}; });
                      btn.disabled = false;
                      btn.textContent = "✅ Menu généré !";
                      setTimeout(function(){ btn.textContent = "✨ Générer avec l\'IA"; }, 3000);
                    } catch(e) {
                      console.error("Menu IA parse:", e);
                      btn.disabled = false;
                      btn.textContent = "✨ Générer avec l\'IA";
                    }
                  }).catch(function(e){
                    console.error("Menu IA fetch:", e);
                    btn.disabled = false;
                    btn.textContent = "✨ Générer avec l\'IA";
                    alert("Génération IA indisponible depuis cette interface. Saisissez le menu manuellement.");
                  });
                }}>✨ Générer avec l'IA</Btn>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
                {[
                  ["appetizer","🥂 Apéritif","ex: Verrines saumon, mini-quiches"],
                  ["starter","🥗 Entrée","ex: Velouté de butternut"],
                  ["main","🍖 Plat principal","ex: Filet de bœuf sauce bordelaise"],
                  ["cheese","🧀 Fromage","ex: Plateau affiné (optionnel)"],
                  ["dessert","🍰 Dessert","ex: Pièce montée"],
                  ["vegOption","🌱 Option végétarienne","ex: Risotto aux champignons"],
                ].map(function(item){
                  var key = item[0]; var label = item[1]; var ph = item[2];
                  return (
                    <div key={key}>
                      <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:6 }}>{label.toUpperCase()}</label>
                      <input
                        value={(ev.menu&&ev.menu[key])||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, menu:{...(ev2.menu||{}), [key]:v}}; }); }}
                        placeholder={ph}
                        style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
              {ev.menu&&ev.menu.note && (
                <div style={{ marginTop:14, background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"11", border:"1px solid "+C.gold+"44", borderRadius:10, padding:"10px 16px", color:"#C9973A", fontSize:13, fontStyle:"italic" }}>
                  💡 {ev.menu.note}
                </div>
              )}
            </div>

            {/* ── BOISSONS ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <h4 style={{ margin:"0 0 16px", color:"#C9973A", fontWeight:400, fontSize:16 }}>🍷 Boissons</h4>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
                {[
                  ["champagne","🥂 Champagne/Prosecco","ex: Veuve Clicquot Brut"],
                  ["vin_blanc","🍾 Vin blanc","ex: Sancerre 2022"],
                  ["vin_rouge","🍷 Vin rouge","ex: Bordeaux Saint-Émilion"],
                  ["eau","💧 Eau","ex: Évian, San Pellegrino"],
                  ["softs","🥤 Softs / Jus","ex: Orange, Citron, Cola"],
                  ["cocktail","🍹 Cocktail de bienvenue","ex: Kir Royal"],
                  ["biere","🍺 Bière","ex: IPA artisanale"],
                  ["cafe","☕ Café / Thé","ex: Nespresso + Thé Mariage Frères"],
                ].map(function(item){
                  var key = item[0]; var label = item[1]; var ph = item[2];
                  return (
                    <div key={key}>
                      <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>{label.toUpperCase()}</label>
                      <input
                        value={(ev.drinks&&ev.drinks[key])||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, drinks:{...(ev2.drinks||{}), [key]:v}}; }); }}
                        placeholder={ph}
                        style={{ width:"100%", padding:"7px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", boxSizing:"border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:14 }}>
                <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>NOTES BOISSONS</label>
                <input
                  value={(ev.drinks&&ev.drinks.notes)||""}
                  onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, drinks:{...(ev2.drinks||{}), notes:v}}; }); }}
                  placeholder="Ex: Pas d'alcool sur les tables enfants, service champagne à l'arrivée..."
                  style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                />
              </div>
            </div>

            {/* ── SYNTHÈSE TRAITEUR ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>📊 Synthèse traiteur</h4>
                <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
                  <Btn small variant="ghost" onClick={function(){
                    // Export CSV traiteur
                    var rows = ["Table,Nom,Régime,Allergies,Notes"];
                    ev.tables.forEach(function(tbl){
                      var tGuests = ev.guests.filter(function(g){ return g.tableId===tbl.id; });
                      tGuests.forEach(function(g){
                        var dinfo = dietInfo(g.diet);
                        rows.push(["Table "+tbl.number+(tbl.label?" - "+tbl.label:""), g.name, dinfo.label, (g.allergies||[]).join("+"), g.notes||""].map(function(v){ return '"'+String(v).replace(/"/g,'""')+'"'; }).join(","));
                      });
                    });
                    var blob = new Blob([rows.join("\n")], {type:"text/csv"});
                    var a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="synthese_traiteur.csv"; a.click();
                  }}>⬇ CSV Traiteur</Btn>
                  <Btn small variant="ghost" onClick={function(){ printDietSummary(ev); }}>🖨 PDF</Btn>
                </div>
              </div>

              {/* Par table */}
              <h5 style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:1, marginBottom:12 }}>PAR TABLE</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                {ev.tables.map(function(tbl){
                  var tGuests = ev.guests.filter(function(g){ return g.tableId===tbl.id; });
                  if (!tGuests.length) return null;
                  var specials = tGuests.filter(function(g){ return g.diet!=="standard" || (g.allergies||[]).length>0; });
                  return (
                    <div key={tbl.id} style={{ background:C.mid+"44", border:"1px solid "+C.border, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <span style={{ color:tbl.color||C.gold, fontWeight:700, minWidth:80 }}>Table {tbl.number}{tbl.label?" — "+tbl.label:""}</span>
                      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{tGuests.length} couverts</span>
                      <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:6 }}>
                        {specials.length===0 ? (
                          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic" }}>Tous standard</span>
                        ) : specials.map(function(g){
                          var dinfo = dietInfo(g.diet);
                          return (
                            <span key={g.id} style={{ background:dinfo.color+"22", border:"1px solid "+dinfo.color+"44", borderRadius:99, padding:"2px 10px", fontSize:11, color:dinfo.color }}>
                              {g.name} — {dinfo.icon} {dinfo.label}{(g.allergies||[]).map(function(a){ var ai=dietInfo(a); return " +"+ai.icon; }).join("")}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>

              {/* Par régime */}
              <h5 style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:1, marginBottom:12 }}>PAR RÉGIME</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {DIET_OPTIONS.filter(function(d){ return d.id!=="standard"; }).map(function(dopt){
                  var concerned = ev.guests.filter(function(g){ return g.diet===dopt.id || (g.allergies||[]).includes(dopt.id); });
                  if (!concerned.length) return null;
                  return (
                    <div key={dopt.id} style={{ background:dopt.color+"11", border:"1px solid "+dopt.color+"33", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <span style={{ fontSize:20 }}>{dopt.icon}</span>
                      <span style={{ color:dopt.color, fontWeight:700, minWidth:120 }}>{dopt.label} ({concerned.length})</span>
                      <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:6 }}>
                        {concerned.map(function(g){
                          var tbl = ev.tables.find(function(tb){ return tb.id===g.tableId; });
                          return (
                            <span key={g.id} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:99, padding:"2px 10px", fontSize:11, color:"#ffffff" }}>
                              {g.name}{tbl?" (T."+tbl.number+")":""} 
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>

            {/* ── INVITÉS AVEC RÉGIME SPÉCIAL ── */}
            {ev.guests.filter(function(g){ return g.diet!=="standard"||(g.allergies||[]).length>0; }).length > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
                <h4 style={{ margin:"0 0 16px", color:"#C9973A", fontWeight:400, fontSize:16 }}>⚠ Invités avec besoins spécifiques</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {ev.guests.filter(function(g){ return g.diet!=="standard"||(g.allergies||[]).length>0; }).map(function(g){
                    var dinfo = dietInfo(g.diet);
                    var tbl = ev.tables.find(function(tb){ return tb.id===g.tableId; });
                    return (
                      <div key={g.id} style={{ background:dinfo.color+"11", border:"1px solid "+dinfo.color+"33", borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ fontSize:22 }}>{dinfo.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#ffffff", fontWeight:600 }}>{g.name}</div>
                          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>
                            {dinfo.label}
                            {(g.allergies||[]).map(function(a){ var ai=dietInfo(a); return " · "+ai.icon+" "+ai.label; }).join("")}
                            {g.notes ? " · "+g.notes : ""}
                          </div>
                        </div>
                        {tbl && <span style={{ color:tbl.color||C.gold, fontSize:12, fontWeight:700 }}>Table {tbl.number}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════
            ── RSVP TAB ──
        ══════════════════════════════════════════ */}
        {tab==="rsvp" && (
          <div style={{ maxWidth:900 }}>

            {/* ── Synthèse RSVP ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"Confirmés",   val:rsvpConfirmed, color:C.green,  icon:"✅"},
                {label:"Refusés",     val:rsvpDeclined,  color:C.red,    icon:"❌"},
                {label:"En attente",  val:rsvpPending,   color:"#FF9800", icon:"⏳"},
                {label:"Total",       val:ev.guests.length, color:"#C9973A", icon:"👥"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:30, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Barre progression ── */}
            {ev.guests.length > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Taux de réponse</span>
                  <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>
                    {Math.round((rsvpConfirmed+rsvpDeclined)/ev.guests.length*100)}%
                  </span>
                </div>
                <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden", display:"flex" }}>
                  <div style={{ width:`${rsvpConfirmed/ev.guests.length*100}%`, background:"#27AE60", transition:"width .4s" }}/>
                  <div style={{ width:`${rsvpDeclined/ev.guests.length*100}%`, background:"#e05252", transition:"width .4s" }}/>
                </div>
                <div style={{ display:"flex", gap:16, marginTop:8, fontSize:11, color:"rgba(255,255,255,0.45)" }}>
                  <span style={{ color:C.green }}>■ Confirmés {rsvpConfirmed}</span>
                  <span style={{ color:C.red }}>■ Refusés {rsvpDeclined}</span>
                  <span style={{ color:"#FF9800" }}>■ En attente {rsvpPending}</span>
                </div>
              </div>
            )}

            {/* ── Lien RSVP ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
              <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:"0 0 12px" }}>🔗 Lien de confirmation invités</h4>
              {(function(){
                var fb = null; try{fb=getFirebase();}catch(e){}
                var uid = fb&&fb.auth&&fb.auth.currentUser ? fb.auth.currentUser.uid : "";
                var joinParam = uid ? uid+"___"+ev.id : ev.id;
                var joinUrl = window.location.origin+"/?join="+joinParam;
                return (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input readOnly value={joinUrl}
                  style={{ flex:1, padding:"8px 12px", background:"#13131e", border:"1px solid "+C.border, borderRadius:8, color:"rgba(255,255,255,0.45)", fontSize:12, fontFamily:"monospace" }}/>
                <Btn small onClick={function(){ navigator.clipboard.writeText(joinUrl); }}>📋 Copier</Btn>
              </div>
                );
              })()}
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:8, fontStyle:"italic" }}>Partagez ce lien — les invités confirment leur présence et régime alimentaire directement.</p>
            </div>

            {/* ── Liste invités avec statut RSVP ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:"0 0 16px" }}>👥 Statut par invité</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ev.guests.length === 0 && <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic" }}>Aucun invité ajouté.</p>}
                {ev.guests.map(function(g){
                  var rsvp = g.rsvp || "pending";
                  var rsvpColor = rsvp==="confirmed" ? C.green : rsvp==="declined" ? C.red : "#FF9800";
                  var rsvpIcon  = rsvp==="confirmed" ? "✅" : rsvp==="declined" ? "❌" : "⏳";
                  return (
                    <div key={g.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.mid+"44", borderRadius:10, border:"1px solid "+C.border+"33" }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:13,fontWeight:700 }}>{g.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ color:"#ffffff", fontSize:14 }}>{g.name}</div>
                        {g.email && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{g.email}</div>}
                      </div>
                      <span style={{ fontSize:18 }}>{rsvpIcon}</span>
                      <div style={{ display:"flex", gap:4 }}>
                        {["confirmed","declined","pending"].map(function(s){
                          var icons = {confirmed:"✅",declined:"❌",pending:"⏳"};
                          var labels = {confirmed:"Oui",declined:"Non",pending:"?"};
                          return (
                            <button key={s} onClick={function(){
                              updateEv(function(evUp){ return {...evUp, guests:evUp.guests.map(function(x){ return x.id===g.id?{...x,rsvp:s}:x; })}; });
                            }} style={{
                              padding:"3px 10px", borderRadius:99, fontSize:11, cursor:"pointer", fontFamily:"inherit",
                              background: rsvp===s ? (s==="confirmed"?C.green:s==="declined"?C.red:"#FF9800")+"33" : "none",
                              border: "1px solid "+(rsvp===s?(s==="confirmed"?C.green:s==="declined"?C.red:"#FF9800"):C.border)+"66",
                              color: rsvp===s ? (s==="confirmed"?C.green:s==="declined"?C.red:"#FF9800") : C.muted,
                              fontWeight: rsvp===s ? 700 : 400,
                            }}>{labels[s]}</button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ── BUDGET TAB ──
        ══════════════════════════════════════════ */}
        {tab==="budget" && (
          <div style={{ maxWidth:900 }}>

            {/* ── KPIs budget ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"Budget estimé",  val:budgetTotal.toFixed(0)+"€",  color:"#C9973A",  icon:"📋"},
                {label:"Dépensé",        val:budgetSpent.toFixed(0)+"€",  color:budgetSpent>budgetTotal?C.red:C.green, icon:"💳"},
                {label:"Restant",        val:(budgetTotal-budgetSpent).toFixed(0)+"€", color:budgetTotal-budgetSpent<0?C.red:C.green, icon:"🏦"},
                {label:"Coût / invité",  val:ev.guests.length>0?(budgetSpent/ev.guests.length).toFixed(0)+"€":"—", color:C.blue, icon:"👤"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Barre budget ── */}
            {budgetTotal > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Consommation du budget</span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.gold, fontSize:12, fontWeight:700 }}>
                    {Math.round(budgetSpent/budgetTotal*100)}%
                  </span>
                </div>
                <div style={{ height:10, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${Math.min(100,budgetSpent/budgetTotal*100)}%`, background:budgetSpent>budgetTotal?C.red:C.green, transition:"width .4s", height:"100%" }}/>
                </div>
              </div>
            )}

            {/* ── Postes de dépenses ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>💼 Postes de dépenses</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var cats = [
                    {cat:"Traiteur",     icon:"🍽"},
                    {cat:"Salle",        icon:"🏛"},
                    {cat:"Musique/DJ",   icon:"🎵"},
                    {cat:"Fleurs/Déco",  icon:"🌸"},
                    {cat:"Photo/Vidéo",  icon:"📷"},
                    {cat:"Transport",    icon:"🚗"},
                    {cat:"Invitations",  icon:"💌"},
                    {cat:"Tenue",        icon:"👗"},
                    {cat:"Divers",       icon:"📦"},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.budget||[]).map(function(b){ return b.category; });
                    var toAdd = cats.filter(function(c){ return !existing.includes(c.cat); })
                      .map(function(c){ return {id:Date.now()+Math.random(), category:c.cat, icon:c.icon, estimated:"", actual:"", notes:""}; });
                    return {...evUp, budget:[...(evUp.budget||[]), ...toAdd]};
                  });
                }}>✨ Remplir avec modèle</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, budget:[...(evUp.budget||[]), {id:Date.now(), category:"Nouveau poste", icon:"📦", estimated:"", actual:"", notes:""}]};
                  });
                }}>+ Poste</Btn>
              </div>

              {(ev.budget||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucun poste. Cliquez sur "Remplir avec modèle" pour démarrer.</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.budget||[]).map(function(item, bi){
                  var pct = item.estimated && parseFloat(item.estimated) > 0 ? Math.min(100,parseFloat(item.actual||0)/parseFloat(item.estimated)*100) : 0;
                  var over = parseFloat(item.actual||0) > parseFloat(item.estimated||0) && parseFloat(item.estimated||0) > 0;
                  return (
                    <div key={item.id} style={{ background:C.mid+"44", border:"1px solid "+(over?C.red:C.border)+"44", borderRadius:12, padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontSize:18 }}>{item.icon||"📦"}</span>
                        <input value={item.category} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],category:v}; return {...evUp,budget:b}; }); }}
                          style={{ flex:1, background:"none", border:"none", color:"#ffffff", fontSize:14, fontFamily:"inherit", outline:"none" }}/>
                        {over && <span style={{ color:C.red, fontSize:11, fontWeight:700 }}>⚠ Dépassement</span>}
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, budget:(evUp.budget||[]).filter(function(_,i){ return i!==bi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14 }}>🗑</button>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <div style={{ flex:1, minWidth:120 }}>
                          <label style={{ color:"rgba(255,255,255,0.45)", fontSize:10, letterSpacing:1 }}>ESTIMÉ (€)</label>
                          <input type="number" value={item.estimated} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],estimated:v}; return {...evUp,budget:b}; }); }}
                            placeholder="0" style={{ width:"100%", padding:"6px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                        <div style={{ flex:1, minWidth:120 }}>
                          <label style={{ color:"rgba(255,255,255,0.45)", fontSize:10, letterSpacing:1 }}>RÉEL (€)</label>
                          <input type="number" value={item.actual} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],actual:v}; return {...evUp,budget:b}; }); }}
                            placeholder="0" style={{ width:"100%", padding:"6px 10px", background:"#18182a", border:"1px solid "+(over?C.red:C.border), borderRadius:6, color:over?C.red:C.cream, fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                        <div style={{ flex:2, minWidth:160 }}>
                          <label style={{ color:"rgba(255,255,255,0.45)", fontSize:10, letterSpacing:1 }}>NOTES</label>
                          <input value={item.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],notes:v}; return {...evUp,budget:b}; }); }}
                            placeholder="Prestataire, devis..." style={{ width:"100%", padding:"6px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                      </div>
                      {parseFloat(item.estimated||0) > 0 && (
                        <div style={{ marginTop:8, height:4, background:"#13131e", borderRadius:99 }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:over?C.red:C.green, borderRadius:99, transition:"width .4s" }}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {(ev.budget||[]).length > 0 && (
                <div style={{ marginTop:16, padding:"14px 16px", background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"11", border:"1px solid "+C.gold+"33", borderRadius:10, display:"flex", gap:24 }}>
                  <span style={{ color:"#C9973A", fontSize:14 }}>Total estimé : <strong>{budgetTotal.toFixed(0)}€</strong></span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.green, fontSize:14 }}>Total réel : <strong>{budgetSpent.toFixed(0)}€</strong></span>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:14 }}>Écart : <strong>{(budgetTotal-budgetSpent).toFixed(0)}€</strong></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ── PLANNING TAB ──
        ══════════════════════════════════════════ */}
        {tab==="planning" && (
          <div style={{ maxWidth:860 }}>

            {/* ── KPIs planning ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"Tâches totales", val:planningTotal, color:"#C9973A",  icon:"📋"},
                {label:"Terminées",      val:planningDone,  color:C.green, icon:"✅"},
                {label:"Restantes",      val:planningTotal-planningDone, color:planningTotal-planningDone>0?"#FF9800":C.green, icon:"⏳"},
                {label:"Avancement",     val:planningTotal>0?Math.round(planningDone/planningTotal*100)+"%":"—", color:C.blue, icon:"📈"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Barre avancement ── */}
            {planningTotal > 0 && (
              <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"14px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Progression globale</span>
                  <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{Math.round(planningDone/planningTotal*100)}%</span>
                </div>
                <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${planningDone/planningTotal*100}%`, background:"#27AE60", transition:"width .4s", height:"100%" }}/>
                </div>
              </div>
            )}

            {/* ── Liste de tâches ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>🗓 Rétroplanning & tâches</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var tpl = [
                    {label:"Réserver la salle",          icon:"🏛", deadline:"", priority:"high"},
                    {label:"Choisir le traiteur",         icon:"🍽", deadline:"", priority:"high"},
                    {label:"Envoyer les faire-parts",     icon:"💌", deadline:"", priority:"high"},
                    {label:"Confirmer le DJ / musiciens", icon:"🎵", deadline:"", priority:"medium"},
                    {label:"Choisir les fleurs",          icon:"🌸", deadline:"", priority:"medium"},
                    {label:"Réserver le photographe",    icon:"📷", deadline:"", priority:"medium"},
                    {label:"Finaliser le menu",           icon:"📋", deadline:"", priority:"medium"},
                    {label:"Relancer les non-répondants", icon:"📞", deadline:"", priority:"low"},
                    {label:"Valider le plan de table",    icon:"🗺", deadline:"", priority:"low"},
                    {label:"Préparer les chevalets",      icon:"🖨", deadline:"", priority:"low"},
                    {label:"Briefer les prestataires",    icon:"🤝", deadline:"", priority:"low"},
                    {label:"Jour J — Accueil invités",    icon:"🎉", deadline:"", priority:"low"},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.planning||[]).map(function(t){ return t.label; });
                    var toAdd = tpl.filter(function(t){ return !existing.includes(t.label); })
                      .map(function(t){ return {...t, id:Date.now()+Math.random(), done:false, notes:""}; });
                    return {...evUp, planning:[...(evUp.planning||[]), ...toAdd]};
                  });
                }}>✨ Modèle type</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, planning:[...(evUp.planning||[]), {id:Date.now(), label:"Nouvelle tâche", icon:"📌", deadline:"", priority:"medium", done:false, notes:""}]};
                  });
                }}>+ Tâche</Btn>
              </div>

              {(ev.planning||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucune tâche. Cliquez "Modèle type" pour démarrer.</p>
              )}

              {/* Grouper par priorité */}
              {["high","medium","low"].map(function(prio){
                var tasks = (ev.planning||[]).filter(function(t){ return (t.priority||"medium") === prio; });
                if (!tasks.length) return null;
                var prioLabel = {high:"🔴 Priorité haute", medium:"🟡 Priorité moyenne", low:"🟢 Priorité faible"}[prio];
                var prioColor = {high:C.red, medium:"#FF9800", low:C.green}[prio];
                return (
                  <div key={prio} style={{ marginBottom:20 }}>
                    <div style={{ color:prioColor, fontSize:12, letterSpacing:1, fontWeight:700, marginBottom:8 }}>{prioLabel}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {tasks.map(function(task){
                        var ti = (ev.planning||[]).findIndex(function(t){ return t.id === task.id; });
                        var isLate = task.deadline && !task.done && new Date(task.deadline) < new Date();
                        return (
                          <div key={task.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:task.done?C.green+"11":isLate?C.red+"11":C.mid+"44", borderRadius:10, border:"1px solid "+(task.done?C.green:isLate?C.red:C.border)+"33" }}>
                            <button onClick={function(){ updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],done:!p[ti].done}; return {...evUp,planning:p}; }); }}
                              style={{ width:22,height:22,borderRadius:"50%",border:"2px solid "+(task.done?C.green:C.muted),background:task.done?C.green:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0 }}>
                              {task.done ? "✓" : ""}
                            </button>
                            <span style={{ fontSize:16 }}>{task.icon||"📌"}</span>
                            <input value={task.label} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],label:v}; return {...evUp,planning:p}; }); }}
                              style={{ flex:1, background:"none", border:"none", color:task.done?C.muted:C.cream, fontSize:13, fontFamily:"inherit", outline:"none", textDecoration:task.done?"line-through":"none" }}/>
                            <input type="date" value={task.deadline||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],deadline:v}; return {...evUp,planning:p}; }); }}
                              style={{ background:"#18182a", border:"1px solid "+(isLate?C.red:C.border), borderRadius:6, color:isLate?C.red:C.muted, fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}/>
                            {isLate && <span style={{ color:C.red, fontSize:11, fontWeight:700 }}>EN RETARD</span>}
                            <select value={task.priority||"medium"} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],priority:v}; return {...evUp,planning:p}; }); }}
                              style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"rgba(255,255,255,0.45)", fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}>
                              <option value="high">🔴 Haute</option>
                              <option value="medium">🟡 Moyenne</option>
                              <option value="low">🟢 Faible</option>
                            </select>
                            <button onClick={function(){ updateEv(function(evUp){ return {...evUp, planning:(evUp.planning||[]).filter(function(_,i){ return i!==ti; })}; }); }}
                              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13 }}>🗑</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ── PROGRAMME TAB ──
        ══════════════════════════════════════════ */}
        {tab==="programme" && (
          <div style={{ maxWidth:860 }}>

            {/* ── Programme de la journée ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>🎵 Programme de la journée</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var tpl = [
                    {time:"10:00", label:"Accueil des invités",      icon:"🎉", duration:30,  notes:""},
                    {time:"10:30", label:"Cérémonie",                icon:"💍", duration:45,  notes:""},
                    {time:"11:30", label:"Vin d'honneur / Cocktail", icon:"🥂", duration:90,  notes:""},
                    {time:"13:00", label:"Déjeuner",                  icon:"🍽", duration:120, notes:""},
                    {time:"15:00", label:"Discours & animations",     icon:"🎤", duration:60,  notes:""},
                    {time:"16:00", label:"Pièce montée",              icon:"🎂", duration:30,  notes:""},
                    {time:"17:00", label:"Ouverture de bal",          icon:"💃", duration:30,  notes:""},
                    {time:"20:00", label:"Dîner",                     icon:"🍷", duration:120, notes:""},
                    {time:"22:00", label:"Soirée dansante",           icon:"🎶", duration:180, notes:""},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.programme||[]).map(function(p){ return p.label; });
                    var toAdd = tpl.filter(function(p){ return !existing.includes(p.label); })
                      .map(function(p){ return {...p, id:Date.now()+Math.random()}; });
                    return {...evUp, programme:[...(evUp.programme||[]), ...toAdd]};
                  });
                }}>✨ Modèle mariage</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, programme:[...(evUp.programme||[]), {id:Date.now(), time:"", label:"Nouvelle étape", icon:"📌", duration:60, notes:""}]};
                  });
                }}>+ Étape</Btn>
              </div>

              {(ev.programme||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucune étape. Cliquez "Modèle mariage" pour démarrer.</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {[...(ev.programme||[])].sort(function(a,b){ return (a.time||"").localeCompare(b.time||""); }).map(function(step, si){
                  var pi = (ev.programme||[]).findIndex(function(p){ return p.id === step.id; });
                  return (
                    <div key={step.id} style={{ display:"flex", gap:0 }}>
                      {/* Timeline line */}
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:16, flexShrink:0 }}>
                        <div style={{ width:12,height:12,borderRadius:"50%",background:"linear-gradient(135deg,#C9973A,#F0C97A)",border:"2px solid "+C.gold,marginTop:18,flexShrink:0 }}/>
                        {si < (ev.programme||[]).length-1 && <div style={{ width:2,flex:1,background:C.border,minHeight:20 }}/>}
                      </div>
                      {/* Content */}
                      <div style={{ flex:1, background:C.mid+"44", border:"1px solid "+C.border+"33", borderRadius:12, padding:"12px 16px", marginBottom:8, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                        <input type="time" value={step.time||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],time:v}; return {...evUp,programme:p}; }); }}
                          style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#C9973A", fontSize:13, padding:"4px 8px", fontFamily:"inherit", fontWeight:700, minWidth:80 }}/>
                        <span style={{ fontSize:18 }}>{step.icon||"📌"}</span>
                        <input value={step.label} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],label:v}; return {...evUp,programme:p}; }); }}
                          style={{ flex:1, background:"none", border:"none", color:"#ffffff", fontSize:14, fontFamily:"inherit", outline:"none", minWidth:120 }}/>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <input type="number" value={step.duration||60} onChange={function(e){ var v=parseInt(e.target.value)||60; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],duration:v}; return {...evUp,programme:p}; }); }}
                            style={{ width:56, background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"rgba(255,255,255,0.45)", fontSize:11, padding:"4px 6px", fontFamily:"inherit", textAlign:"center" }}/>
                          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>min</span>
                        </div>
                        <input value={step.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],notes:v}; return {...evUp,programme:p}; }); }}
                          placeholder="Notes / responsable…" style={{ flex:1, background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"rgba(255,255,255,0.45)", fontSize:12, padding:"4px 10px", fontFamily:"inherit", minWidth:100 }}/>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, programme:(evUp.programme||[]).filter(function(_,i){ return i!==pi; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13 }}>🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Prestataires ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:"#C9973A", fontWeight:400, fontSize:14, margin:0 }}>🤝 Prestataires</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, suppliers:[...(evUp.suppliers||[]), {id:Date.now(), role:"", name:"", phone:"", email:"", status:"pending", notes:""}]};
                  });
                }}>+ Prestataire</Btn>
              </div>

              {(ev.suppliers||[]).length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.45)", fontStyle:"italic", textAlign:"center", padding:20 }}>Aucun prestataire. Ajoutez vos contacts clés (traiteur, DJ, photographe…).</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.suppliers||[]).map(function(sup, si){
                  var statusColor = {confirmed:C.green, pending:"#FF9800", cancelled:C.red}[sup.status||"pending"];
                  var statusIcon  = {confirmed:"✅", pending:"⏳", cancelled:"❌"}[sup.status||"pending"];
                  return (
                    <div key={sup.id} style={{ background:C.mid+"44", border:"1px solid "+C.border+"33", borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                        <select value={sup.role||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],role:v}; return {...evUp,suppliers:s}; }); }}
                          style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#C9973A", fontSize:12, padding:"4px 8px", fontFamily:"inherit" }}>
                          <option value="">— Rôle —</option>
                          <option value="Traiteur">🍽 Traiteur</option>
                          <option value="DJ">🎵 DJ</option>
                          <option value="Musicien">🎹 Musicien</option>
                          <option value="Photographe">📷 Photographe</option>
                          <option value="Vidéaste">🎬 Vidéaste</option>
                          <option value="Fleuriste">🌸 Fleuriste</option>
                          <option value="Décorateur">🎨 Décorateur</option>
                          <option value="Salle">🏛 Salle</option>
                          <option value="Transport">🚗 Transport</option>
                          <option value="Animation">🎭 Animation</option>
                          <option value="Autre">📦 Autre</option>
                        </select>
                        <input value={sup.name||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],name:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="Nom / société" style={{ flex:1, background:"none", border:"none", color:"#ffffff", fontSize:14, fontFamily:"inherit", outline:"none" }}/>
                        <span style={{ fontSize:16 }}>{statusIcon}</span>
                        <select value={sup.status||"pending"} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],status:v}; return {...evUp,suppliers:s}; }); }}
                          style={{ background:statusColor+"22", border:"1px solid "+statusColor+"66", borderRadius:6, color:statusColor, fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}>
                          <option value="pending">⏳ En cours</option>
                          <option value="confirmed">✅ Confirmé</option>
                          <option value="cancelled">❌ Annulé</option>
                        </select>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, suppliers:(evUp.suppliers||[]).filter(function(_,i){ return i!==si; })}; }); }}
                          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13 }}>🗑</button>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <input value={sup.phone||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],phone:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="📞 Téléphone" style={{ flex:1, padding:"5px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", minWidth:120 }}/>
                        <input value={sup.email||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],email:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="✉️ Email" style={{ flex:1, padding:"5px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", minWidth:120 }}/>
                        <input value={sup.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],notes:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="Notes, tarifs, contrat…" style={{ flex:2, padding:"5px 10px", background:"#18182a", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit", minWidth:160 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab==="constraints" && (
          <div style={{ maxWidth:700 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <h3 style={{ margin:0, fontWeight:400, fontSize:20 }}>Contraintes de placement</h3>
              <div style={{flex:1}}/>
              <Btn onClick={()=>setShowConstraint(true)}>+ Contrainte</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {ev.constraints.length===0 && <p style={{ color:"rgba(255,255,255,0.45)" }}>Aucune contrainte définie.</p>}
              {ev.constraints.map(c=>{
                const g1=ev.guests.find(g=>g.id===c.a)?.name||"?";
                const g2=ev.guests.find(g=>g.id===c.b)?.name||"?";
                return (
                  <div key={c.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,background:c.type==="together"?C.green+"18":C.red+"18",border:`1px solid ${c.type==="together"?C.green:C.red}44` }}>
                    <span style={{ fontSize:18 }}>{c.type==="together"?"🤝":"⚡"}</span>
                    <strong style={{ color:"#ffffff" }}>{g1}</strong>
                    <span style={{ color:"rgba(255,255,255,0.45)" }}>{c.type==="together"?"avec":"loin de"}</span>
                    <strong style={{ color:"#ffffff" }}>{g2}</strong>
                    <div style={{flex:1}}/>
                    <button onClick={()=>updateEv(e=>({...e,constraints:e.constraints.filter(x=>x.id!==c.id)}))}
                      style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>✕</button>
                  </div>
                );
              })}
            </div>
            <div style={{ background:"#18182a",border:"1px solid rgba(201,151,58,0.15)",borderRadius:12,padding:20 }}>
              <p style={{ color:"rgba(255,255,255,0.45)", margin:0, fontSize:13, lineHeight:1.8 }}>
                <strong style={{ color:"#C9973A" }}>🤝 {t && t.lang === "fr" ? "Ensemble" : "Together"} :</strong> {t && t.lang === "fr" ? "ces invités seront à la même table" : "these guests will be at the same table"}.<br/>
                <strong style={{ color:"#C9973A" }}>⚡ Séparés :</strong> ces invités seront à des tables différentes.<br/>
                Cliquez <strong style={{ color:"#C9973A" }}>{t.autoPlace}</strong> pour appliquer automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* ── RSVP TAB ── */}
        {tab==="rsvp" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Compteurs RSVP */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                {label:"Confirmés",val:rsvpConfirmed,color:C.green,icon:"✅"},
                {label:"En attente",val:rsvpPending,color:"#C9973A",icon:"⏳"},
                {label:"Déclinés",val:rsvpDeclined,color:C.red,icon:"❌"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:`1px solid ${s.color}44`, borderRadius:14, padding:"20px 24px", textAlign:"center" }}>
                  <div style={{ fontSize:28 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color, margin:"4px 0" }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Taux de réponse</span>
                <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{ev.guests.length>0?Math.round((rsvpConfirmed+rsvpDeclined)/ev.guests.length*100):0}%</span>
              </div>
              <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${ev.guests.length>0?(rsvpConfirmed+rsvpDeclined)/ev.guests.length*100:0}%`, background:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99 }}/>
              </div>
            </div>
            {/* Liste invités avec statut RSVP */}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>💌 Suivi par invité</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="muted" onClick={()=>{
                  updateEv(e=>({...e, guests:e.guests.map(g=>g.rsvp?g:{...g,rsvp:"pending"})}));
                }}>Marquer tous en attente</Btn>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ev.guests.map(g=>(
                  <div key={g.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.mid+"55", borderRadius:10 }}>
                    <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:13,fontWeight:700 }}>{g.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#ffffff", fontSize:14 }}>{g.name}</div>
                      {g.email && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{g.email}</div>}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      {[["confirmed","✅","Confirmé",C.green],["pending","⏳","En attente",C.gold],["declined","❌","Décliné",C.red]].map(([v,ic,lb,col])=>(
                        <button key={v} onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,rsvp:v}:x)}))}
                          style={{ padding:"4px 10px", borderRadius:8, border:`1.5px solid ${(!g.rsvp&&v==="pending")||g.rsvp===v?col:C.border}`,
                            background:(!g.rsvp&&v==="pending")||g.rsvp===v?col+"22":"none",
                            color:(!g.rsvp&&v==="pending")||g.rsvp===v?col:C.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                          {ic} {lb}
                        </button>
                      ))}
                    </div>
                    {g.rsvpNote && <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.rsvpNote}</span>}
                    <input
                      value={g.rsvpNote||""} onChange={e=>{const v=e.target.value; updateEv(ev2=>({...ev2,guests:ev2.guests.map(x=>x.id===g.id?{...x,rsvpNote:v}:x)}));}}
                      placeholder="Note…"
                      style={{ width:120, padding:"4px 8px", background:"#fff1", border:"1px solid rgba(201,151,58,0.15)", borderRadius:6, color:"#ffffff", fontSize:11, fontFamily:"inherit" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BUDGET TAB ── */}
        {tab==="budget" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Résumé */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                {label:"Budget estimé",val:budgetTotal.toLocaleString("fr-FR",{minimumFractionDigits:0})+" €",color:"#C9973A",icon:"📊"},
                {label:"Dépenses réelles",val:budgetSpent.toLocaleString("fr-FR",{minimumFractionDigits:0})+" €",color:budgetSpent>budgetTotal?C.red:C.green,icon:"💳"},
                {label:"Écart",val:(budgetTotal-budgetSpent>=0?"+":"")+((budgetTotal-budgetSpent).toLocaleString("fr-FR",{minimumFractionDigits:0}))+" €",color:budgetTotal-budgetSpent>=0?C.green:C.red,icon:budgetTotal-budgetSpent>=0?"✅":"⚠️"},
              ].map(s=>(
                <div key={s.label} style={{ background:"#18182a", border:`1px solid ${s.color}44`, borderRadius:14, padding:"18px 22px" }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Barre de progression */}
            {budgetTotal>0 && (
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"16px 22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Consommation du budget</span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.gold, fontSize:12, fontWeight:700 }}>{Math.round(budgetSpent/budgetTotal*100)}%</span>
                </div>
                <div style={{ height:10, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.min(budgetSpent/budgetTotal*100,100)}%`, background:budgetSpent>budgetTotal?C.red:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99, transition:"width .3s" }}/>
                </div>
              </div>
            )}
            {/* Lignes budget */}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>📋 Postes budgétaires</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={()=>setShowAddBudget(true)}>+ Ajouter un poste</Btn>
              </div>
              {(ev.budget||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucun poste budgétaire. Ajoutez vos premières dépenses !</p>}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.budget||[]).map((b,bi)=>{
                  const cat = BUDGET_CATEGORIES.find(c=>c.id===b.category)||BUDGET_CATEGORIES[0];
                  const pct = b.estimated>0?Math.min(b.actual/b.estimated*100,100):0;
                  return (
                    <div key={bi} style={{ background:C.mid+"55", borderRadius:12, padding:"14px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:20 }}>{cat.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#ffffff", fontSize:14, fontWeight:600 }}>{b.label||cat.label}</div>
                          {b.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>{b.notes}</div>}
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Estimé : <span style={{ color:"#C9973A" }}>{(parseFloat(b.estimated)||0).toLocaleString("fr-FR")} €</span></div>
                          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Réel : <span style={{ color:(b.actual||0)>(b.estimated||0)?C.red:C.green }}>{(parseFloat(b.actual)||0).toLocaleString("fr-FR")} €</span></div>
                        </div>
                        <span style={{ fontSize:18, cursor:"pointer", color:b.paid?"#4CAF50":C.muted }} title={b.paid?"Payé":"Non payé"}
                          onClick={()=>updateEv(ev2=>({...ev2,budget:ev2.budget.map((x,i)=>i===bi?{...x,paid:!x.paid}:x)}))}>
                          {b.paid?"✅":"💳"}
                        </span>
                        <button onClick={()=>updateEv(ev2=>({...ev2,budget:(ev2.budget||[]).filter((_,i)=>i!==bi)}))}
                          style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>🗑</button>
                      </div>
                      {b.estimated>0 && (
                        <div style={{ height:4, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:pct>=100?C.red:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99 }}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Répartition par catégorie */}
              {(ev.budget||[]).length>0 && (
                <div style={{ marginTop:20, borderTop:"1px solid rgba(201,151,58,0.12)", paddingTop:16 }}>
                  <h5 style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:1, marginBottom:12 }}>RÉPARTITION PAR CATÉGORIE</h5>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {BUDGET_CATEGORIES.map(cat=>{
                      const total = (ev.budget||[]).filter(b=>b.category===cat.id).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
                      if (!total) return null;
                      return (
                        <div key={cat.id} style={{ background:"#13131e", borderRadius:8, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{cat.icon}</span>
                          <span style={{ color:"#ffffff", fontSize:12 }}>{cat.label}</span>
                          <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{total.toLocaleString("fr-FR")} €</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PLANNING TAB ── */}
        {tab==="planning" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Progress */}
            {planningTotal>0 && (
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:"16px 22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>Tâches complétées</span>
                  <span style={{ color:"#C9973A", fontSize:12, fontWeight:700 }}>{planningDone}/{planningTotal}</span>
                </div>
                <div style={{ height:8, background:"#13131e", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${planningTotal>0?planningDone/planningTotal*100:0}%`, background:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99, transition:"width .3s" }}/>
                </div>
              </div>
            )}
            <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🗓 Rétroplanning</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="muted" onClick={()=>{
                  // Générer un rétroplanning IA
                  setAiAssistOpen(true);
                  sendAiAssist && setTimeout(()=>sendAiAssist("Génère-moi un rétroplanning type pour "+ev.name+" (type: "+ev.type+") avec des tâches concrètes J-90, J-60, J-30, J-14, J-7, J-1 et Jour J. Format : une tâche par ligne avec la date relative."),100);
                }}>✨ Générer avec l'IA</Btn>
                <div style={{ width:8 }}/>
                <Btn small onClick={()=>setShowAddTask(true)}>+ Tâche</Btn>
              </div>
              {(ev.planning||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucune tâche. Ajoutez vos premières étapes ou demandez à l'IA de générer un rétroplanning !</p>}
              {/* Groupé par priorité / date */}
              {["high","medium","low"].map(prio=>{
                const tasks = (ev.planning||[]).filter(t=>t.priority===prio);
                if (!tasks.length) return null;
                const prioConfig = {high:{label:"🔴 Urgent",color:C.red},medium:{label:"🟡 Normal",color:"#C9973A"},low:{label:"🟢 Faible priorité",color:C.green}};
                const pc = prioConfig[prio];
                return (
                  <div key={prio} style={{ marginBottom:16 }}>
                    <div style={{ color:pc.color, fontSize:12, letterSpacing:1, marginBottom:8, fontWeight:700 }}>{pc.label}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {tasks.map((task,ti)=>{
                        const tIdx = (ev.planning||[]).findIndex(x=>x===task);
                        const overdue = task.dueDate && !task.done && new Date(task.dueDate)<new Date();
                        return (
                          <div key={ti} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:task.done?"#0a2a0a":overdue?C.red+"11":C.mid+"55", borderRadius:10, border:`1px solid ${task.done?C.green+"44":overdue?C.red+"44":C.border}` }}>
                            <span style={{ fontSize:20, cursor:"pointer" }} onClick={()=>updateEv(ev2=>({...ev2,planning:ev2.planning.map((x,i)=>i===tIdx?{...x,done:!x.done}:x)}))}>
                              {task.done?"✅":"⬜"}
                            </span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:task.done?C.muted:C.cream, fontSize:14, textDecoration:task.done?"line-through":"none" }}>{task.title}</div>
                              <div style={{ display:"flex", gap:12, marginTop:2 }}>
                                {task.dueDate && <span style={{ color:overdue?C.red:C.muted, fontSize:11 }}>📅 {task.dueDate}{overdue?" ⚠️ En retard":""}</span>}
                                {task.responsible && <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>👤 {task.responsible}</span>}
                                {task.notes && <span style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic" }}>{task.notes}</span>}
                              </div>
                            </div>
                            <button onClick={()=>updateEv(ev2=>({...ev2,planning:(ev2.planning||[]).filter((_,i)=>i!==tIdx)}))}
                              style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>🗑</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PROGRAMME TAB ── */}
        {tab==="programme" && (
          <div style={{ maxWidth:900, display:"flex", gap:24, flexWrap:"wrap", alignItems:"start" }}>
            {/* Programme / Timeline jour J */}
            <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🎵 Programme du jour J</h4>
                  <div style={{ flex:1 }}/>
                  <Btn small onClick={()=>setShowAddProgramItem(true)}>+ Étape</Btn>
                </div>
                {(ev.programme||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucune étape. Construisez le déroulé de votre journée !</p>}
                <div style={{ display:"flex", flexDirection:"column", position:"relative" }}>
                  {(ev.programme||[]).sort((a,b)=>a.time.localeCompare(b.time)).map((item,ii)=>(
                    <div key={ii} style={{ display:"flex", gap:14, position:"relative", paddingBottom:16 }}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"33",border:`2px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,zIndex:1 }}>{item.icon}</div>
                        {ii<(ev.programme||[]).length-1 && <div style={{ width:2,flex:1,background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"22",marginTop:4 }}/>}
                      </div>
                      <div style={{ flex:1, paddingTop:6 }}>
                        <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                          <span style={{ color:"#C9973A", fontSize:14, fontWeight:700, minWidth:50 }}>{item.time}</span>
                          <span style={{ color:"#ffffff", fontSize:14 }}>{item.label}</span>
                        </div>
                        {item.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, fontStyle:"italic", marginTop:2 }}>{item.notes}</div>}
                      </div>
                      <button onClick={()=>updateEv(ev2=>({...ev2,programme:(ev2.programme||[]).filter((_,i)=>i!==ii)}))}
                        style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:13,alignSelf:"start",marginTop:6 }}>🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Prestataires */}
            <div style={{ flex:"1 1 340px", display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:14, padding:24 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🤝 Prestataires</h4>
                  <div style={{ flex:1 }}/>
                  <Btn small onClick={()=>setShowAddSupplier(true)}>+ Prestataire</Btn>
                </div>
                {(ev.suppliers||[]).length===0 && <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucun prestataire. Ajoutez vos contacts clés !</p>}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {(ev.suppliers||[]).map((s,si)=>(
                    <div key={si} style={{ background:C.mid+"55", borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ display:"flex", alignItems:"start", gap:10 }}>
                        <div style={{ width:38,height:38,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"22",border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:16,fontWeight:700,flexShrink:0 }}>
                          {s.name[0]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#ffffff", fontSize:14, fontWeight:600 }}>{s.name}</div>
                          {s.role && <div style={{ color:"#C9973A", fontSize:11 }}>{s.role}</div>}
                          {s.phone && <a href={"tel:"+s.phone} style={{ color:"rgba(255,255,255,0.45)", fontSize:12, display:"block", textDecoration:"none" }}>📞 {s.phone}</a>}
                          {s.email && <a href={"mailto:"+s.email} style={{ color:"rgba(255,255,255,0.45)", fontSize:12, display:"block", textDecoration:"none" }}>✉️ {s.email}</a>}
                          {s.notes && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontStyle:"italic", marginTop:4 }}>{s.notes}</div>}
                        </div>
                        <button onClick={()=>updateEv(ev2=>({...ev2,suppliers:(ev2.suppliers||[]).filter((_,i)=>i!==si)}))}
                          style={{ background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:14 }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ROOM TAB ── */}
        {tab==="logistique" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:24 }}>

            {/* ── LIEUX & ADRESSES ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <h4 style={{ margin:"0 0 16px", color:"#C9973A", fontWeight:400, fontSize:16 }}>📍 Lieux & Rendez-vous</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {(ev.venues||[]).map(function(venue, vi){ return (
                  <div key={vi} style={{ background:C.mid+"44", border:"1px solid "+C.border, borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20 }}>{venue.icon||"📍"}</span>
                      <input
                        value={venue.name||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],name:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Nom du lieu (ex: Mairie, Église, Salle des fêtes...)"
                        style={{ flex:1, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:14, fontFamily:"inherit" }}
                      />
                      <button onClick={function(){ updateEv(function(evUp){ return {...evUp, venues:(evUp.venues||[]).filter(function(_,i){ return i!==vi; })}; }); }}
                        style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:16 }}>🗑</button>
                    </div>
                    <input
                      value={venue.address||""}
                      onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],address:v}; return {...evUp,venues:vens}; }); }}
                      placeholder="Adresse complète"
                      style={{ padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}
                    />
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                      <input
                        value={venue.time||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],time:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Heure (ex: 14h00)"
                        style={{ width:120, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
                      />
                      <input
                        value={venue.notes||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],notes:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Notes (parking, code entrée...)"
                        style={{ flex:1, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
                      />
                      {venue.address && (
                        <a href={"https://maps.google.com/?q="+encodeURIComponent(venue.address)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"22", border:"1px solid "+C.gold+"44", borderRadius:6, padding:"6px 12px", color:"#C9973A", fontSize:12, textDecoration:"none" }}>
                          🗺 Voir sur Maps
                        </a>
                      )}
                    </div>
                  </div>
                ); })}
                <button onClick={function(){
                  var icons = ["⛪","🏛","🏩","🌿","🏠","🍽","🎉","🏟","🌊","🌄"];
                  updateEv(function(evUp){ return {...evUp, venues:[...(evUp.venues||[]), {name:"",address:"",time:"",notes:"",icon:icons[Math.floor(Math.random()*icons.length)]}]}; });
                }} style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:10, padding:"12px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:13 }}>
                  + Ajouter un lieu
                </button>
              </div>
            </div>

            {/* ── LISTE DE CADEAUX ── */}
            <div style={{ background:"#18182a", border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ margin:0, color:"#C9973A", fontWeight:400, fontSize:16 }}>🎁 Liste de cadeaux</h4>
                <div style={{ flex:1 }}/>
                <button onClick={function(){
                  var url = ev.giftList && ev.giftList.url;
                  if (url) { window.open(url, "_blank"); }
                }} style={{ background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"22", border:"1px solid "+C.gold+"44", borderRadius:8, padding:"6px 14px", cursor:"pointer", color:"#C9973A", fontFamily:"inherit", fontSize:12, display:ev.giftList&&ev.giftList.url?"flex":"none", alignItems:"center", gap:6 }}>
                  🔗 Voir la liste en ligne
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                  <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>LIEN LISTE DE MARIAGE (Amazon, Marche de Mariage...)</label>
                  <input
                    value={(ev.giftList&&ev.giftList.url)||""}
                    onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, giftList:{...(ev2.giftList||{}), url:v}}; }); }}
                    placeholder="https://www.wishlist.fr/..."
                    style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>MESSAGE POUR LES INVITÉS</label>
                  <input
                    value={(ev.giftList&&ev.giftList.message)||""}
                    onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, giftList:{...(ev2.giftList||{}), message:v}}; }); }}
                    placeholder="Ex: Votre présence est le plus beau cadeau. Si vous souhaitez néanmoins nous gâter..."
                    style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color:"rgba(255,255,255,0.45)", fontSize:11, letterSpacing:1, display:"block", marginBottom:8 }}>CADEAUX REÇUS</label>
                  {(ev.gifts||[]).map(function(gift, gi){ return (
                    <div key={gi} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"center" }}>
                      <span style={{ color:gift.received?"#4CAF50":C.muted, fontSize:18, cursor:"pointer" }}
                        onClick={function(){ updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],received:!gifts[gi].received}; return {...evUp,gifts}; }); }}>
                        {gift.received?"✅":"⬜"}
                      </span>
                      <input
                        value={gift.name||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],name:v}; return {...evUp,gifts}; }); }}
                        placeholder="Nom du cadeau ou de l'expéditeur"
                        style={{ flex:1, padding:"6px 10px", background:gift.received?"#0a2a0a":"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:13, fontFamily:"inherit", textDecoration:gift.received?"line-through":"none" }}
                      />
                      <input
                        value={gift.from||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],from:v}; return {...evUp,gifts}; }); }}
                        placeholder="De la part de..."
                        style={{ width:150, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:"#ffffff", fontSize:12, fontFamily:"inherit" }}
                      />
                      <button onClick={function(){ updateEv(function(evUp){ return {...evUp,gifts:(evUp.gifts||[]).filter(function(_,i){ return i!==gi; })}; }); }}
                        style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14 }}>🗑</button>
                    </div>
                  ); })}
                  <button onClick={function(){
                    updateEv(function(evUp){ return {...evUp, gifts:[...(evUp.gifts||[]), {name:"",from:"",received:false}]}; });
                  }} style={{ background:"#18182a", border:"1px dashed "+C.border, borderRadius:6, padding:"6px 12px", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12 }}>
                    + Ajouter un cadeau
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── MODALS ── */}
      <Modal open={showImportCSV} onClose={()=>setShowImportCSV(false)} title="Importer des invités (CSV)" width={500}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"#13131e", borderRadius:10, padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
            <strong style={{color:"#C9973A"}}>Format attendu (1 invité par ligne) :</strong><br/>
            <code style={{color:"#ffffff"}}>Prénom Nom, email@example.fr, standard</code><br/>
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
          <Field label={t.fieldName}><Input value={newGuest.name} onChange={e=>setNewGuest({...newGuest,name:e.target.value})} placeholder="Prénom Nom"/></Field>
          <Field label={t.fieldEmail}><Input type="email" value={newGuest.email} onChange={e=>setNewGuest({...newGuest,email:e.target.value})} placeholder="email@example.fr"/></Field>
          <Field label="RÉGIME ALIMENTAIRE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {DIET_OPTIONS.map(function(ditem){ return (
                <button key={ditem.id} onClick={()=>setNewGuest({...newGuest,diet:ditem.id})} style={{
                  padding:"7px 10px", borderRadius:8, border:`2px solid ${newGuest.diet===ditem.id?ditem.color:C.border}`,
                  background:newGuest.diet===ditem.id?ditem.color+"22":C.mid, cursor:"pointer", fontSize:12,
                  fontWeight:700, fontFamily:"inherit", color:newGuest.diet===ditem.id?ditem.color:"rgba(255,255,255,0.45)",
                  display:"flex", alignItems:"center", gap:6,
                }}>{ditem.icon} {ditem.label}</button>
              );})}
            </div>
          </Field>
          <Field label="RÔLE / FONCTION">
            <select value={newGuest.role||""} onChange={e=>setNewGuest({...newGuest,role:e.target.value})}
              style={{ width:"100%", padding:"8px 12px", background:"#13131e", border:"1px solid "+C.border, borderRadius:8, color:"#ffffff", fontSize:13, fontFamily:"inherit" }}>
              <option value="">— Aucun rôle spécial —</option>
              <option value="marie1">💍 Marié(e) 1</option>
              <option value="marie2">💍 Marié(e) 2</option>
              <option value="temoin">🎖 Témoin</option>
              <option value="famille_proche">👨‍👩‍👧 Famille proche</option>
              <option value="ami_proche">⭐ Ami proche</option>
              <option value="enfant">🧒 Enfant</option>
              <option value="vip">🌟 VIP</option>
              <option value="prestataire">🔧 Prestataire</option>
            </select>
          </Field>
          <Field label="NOTES / ALLERGIES"><Input value={newGuest.notes} onChange={e=>setNewGuest({...newGuest,notes:e.target.value})} placeholder="Allergies, mobilité réduite…"/></Field>
          <Btn onClick={addGuest} style={{marginTop:4}}>Ajouter l'invité</Btn>
        </div>
      </Modal>

      <Modal open={showAddTable} onClose={()=>setShowAddTable(false)} title="Ajouter une table">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={`${t.fieldNumber} (auto: ${nextTableNumber})`}><Input type="number" value={newTable.number} onChange={e=>setNewTable({...newTable,number:e.target.value})} placeholder={String(nextTableNumber)}/></Field>
          <Field label={t.fieldCapacity}><Input type="number" value={newTable.capacity} onChange={e=>setNewTable({...newTable,capacity:e.target.value})}/></Field>
          <Field label={t.fieldShape}>
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
          <Field label={`${t.fieldLabel} (optionnel)`}><Input value={newTable.label} onChange={e=>setNewTable({...newTable,label:e.target.value})} placeholder="ex: Famille, Amis…"/></Field>
          <Field label={`${t.fieldColor} (optionnel)`}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#E8845A"].map(col=>(
                <button key={col} onClick={()=>setNewTable({...newTable,color:col})} style={{
                  width:28, height:28, borderRadius:"50%", background:col, border:`3px solid ${newTable.color===col?"#fff":"transparent"}`,
                  cursor:"pointer", padding:0
                }}/>
              ))}
              <button onClick={()=>setNewTable({...newTable,color:undefined})} style={{width:28,height:28,borderRadius:"50%",background:"none",border:`2px solid ${C.border}`,cursor:"pointer",color:"rgba(255,255,255,0.45)",fontSize:10}}>✕</button>
            </div>
          </Field>
          <Btn onClick={addTable} style={{marginTop:4}}>Créer la table</Btn>
        </div>
      </Modal>

      <Modal open={showAddZone} onClose={()=>{setShowAddZone(false);setNewZone({label:"",icon:"📍",color:"#C9973A"});}} title="Ajouter une zone">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE LA ZONE *">
            <Input value={newZone.label} onChange={e=>setNewZone({...newZone,label:e.target.value})} placeholder="ex: Piste de danse, Bar, Scène, Photo Booth…"/>
          </Field>
          <Field label="ICÔNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["💃","🎭","🍹","📸","🧒","🌿","🍽","🥂","🎤","🎰","⛲","🪑","🎊","📍"].map(ic=>(
                <button key={ic} onClick={()=>setNewZone({...newZone,icon:ic})} style={{
                  width:38,height:38,borderRadius:8,fontSize:20,background:newZone.icon===ic?C.gold+"33":C.mid,
                  border:`2px solid ${newZone.icon===ic?C.gold:C.border}`,cursor:"pointer",
                }}>{ic}</button>
              ))}
            </div>
          </Field>
          <Field label="COULEUR">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#64B5F6","#E8845A","#81C784"].map(col=>(
                <button key={col} onClick={()=>setNewZone({...newZone,color:col})} style={{
                  width:28,height:28,borderRadius:"50%",background:col,border:`3px solid ${newZone.color===col?"#fff":"transparent"}`,cursor:"pointer",padding:0,
                }}/>
              ))}
            </div>
          </Field>
          <Btn disabled={!newZone.label.trim()} onClick={()=>{
            updateEv(function(evUp){ return {...evUp, zones:[...(evUp.zones||[]), {...newZone}]}; });
            setNewZone({label:"",icon:"📍",color:"#C9973A"});
            setShowAddZone(false);
          }} style={{marginTop:4}}>Ajouter la zone</Btn>
        </div>
      </Modal>

      <Modal open={showAddFurniture} onClose={()=>{setShowAddFurniture(false);setNewFurniture({label:"",icon:"🪑",color:"#8A7355",width:80,height:40});}} title="Ajouter du mobilier">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM *">
            <Input value={newFurniture.label} onChange={e=>setNewFurniture({...newFurniture,label:e.target.value})} placeholder="ex: Buffet, Piano, Podium, Bar, Scène…"/>
          </Field>
          <Field label="ICÔNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["🪑","🛋","🎹","🎤","🍽","🍹","🎰","📺","🖼","🌿","🕯","🎊","🎭","🔲"].map(ic=>(
                <button key={ic} onClick={()=>setNewFurniture({...newFurniture,icon:ic})} style={{
                  width:38,height:38,borderRadius:8,fontSize:20,background:newFurniture.icon===ic?C.gold+"33":C.mid,
                  border:`2px solid ${newFurniture.icon===ic?C.gold:C.border}`,cursor:"pointer",
                }}>{ic}</button>
              ))}
            </div>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="LARGEUR (cm)">
              <Input type="number" value={newFurniture.width} onChange={e=>setNewFurniture({...newFurniture,width:parseInt(e.target.value)||80})} placeholder="80"/>
            </Field>
            <Field label="HAUTEUR (cm)">
              <Input type="number" value={newFurniture.height} onChange={e=>setNewFurniture({...newFurniture,height:parseInt(e.target.value)||40})} placeholder="40"/>
            </Field>
          </div>
          <Field label="COULEUR">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#8A7355","#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8"].map(col=>(
                <button key={col} onClick={()=>setNewFurniture({...newFurniture,color:col})} style={{
                  width:28,height:28,borderRadius:"50%",background:col,border:`3px solid ${newFurniture.color===col?"#fff":"transparent"}`,cursor:"pointer",padding:0,
                }}/>
              ))}
            </div>
          </Field>
          <Btn disabled={!newFurniture.label.trim()} onClick={()=>{
            updateEv(function(evUp){ return {...evUp, furniture:[...(evUp.furniture||[]), {...newFurniture,id:Date.now(),x:200,y:200}]}; });
            setNewFurniture({label:"",icon:"🪑",color:"#8A7355",width:80,height:40});
            setShowAddFurniture(false);
          }} style={{marginTop:4}}>Ajouter le mobilier</Btn>
        </div>
      </Modal>

      {/* ── MODAL BUDGET ── */}
      <Modal open={showAddBudget} onClose={()=>{setShowAddBudget(false);setNewBudgetLine({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""}); }} title="Ajouter un poste budgétaire">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="CATÉGORIE">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {BUDGET_CATEGORIES.map(cat=>(
                <button key={cat.id} onClick={()=>setNewBudgetLine({...newBudgetLine,category:cat.id})} style={{
                  padding:"8px 10px", borderRadius:8, border:`2px solid ${newBudgetLine.category===cat.id?C.gold:C.border}`,
                  background:newBudgetLine.category===cat.id?C.gold+"22":C.mid, cursor:"pointer",
                  color:newBudgetLine.category===cat.id?C.gold:C.muted, fontSize:12, fontFamily:"inherit",
                  display:"flex", alignItems:"center", gap:6,
                }}>{cat.icon} {cat.label}</button>
              ))}
            </div>
          </Field>
          <Field label="LIBELLÉ (optionnel)">
            <Input value={newBudgetLine.label} onChange={e=>setNewBudgetLine({...newBudgetLine,label:e.target.value})} placeholder="ex: Château de Vincennes, DJ Martin…"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="MONTANT ESTIMÉ (€)">
              <Input type="number" value={newBudgetLine.estimated} onChange={e=>setNewBudgetLine({...newBudgetLine,estimated:parseFloat(e.target.value)||0})} placeholder="0"/>
            </Field>
            <Field label="MONTANT RÉEL (€)">
              <Input type="number" value={newBudgetLine.actual} onChange={e=>setNewBudgetLine({...newBudgetLine,actual:parseFloat(e.target.value)||0})} placeholder="0"/>
            </Field>
          </div>
          <Field label="NOTES">
            <Input value={newBudgetLine.notes} onChange={e=>setNewBudgetLine({...newBudgetLine,notes:e.target.value})} placeholder="Acompte versé, devis reçu…"/>
          </Field>
          <label style={{ display:"flex", gap:10, alignItems:"center", fontSize:13, color:"rgba(255,255,255,0.45)", cursor:"pointer" }}>
            <input type="checkbox" checked={newBudgetLine.paid} onChange={e=>setNewBudgetLine({...newBudgetLine,paid:e.target.checked})} style={{ width:16,height:16 }}/>
            Déjà payé ✅
          </label>
          <Btn onClick={()=>{
            updateEv(ev2=>({...ev2, budget:[...(ev2.budget||[]), {...newBudgetLine}]}));
            setNewBudgetLine({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""});
            setShowAddBudget(false);
          }} style={{marginTop:4}}>Ajouter ce poste</Btn>
        </div>
      </Modal>

      {/* ── MODAL TÂCHE PLANNING ── */}
      <Modal open={showAddTask} onClose={()=>{setShowAddTask(false);setNewTask({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});}} title="Ajouter une tâche">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="TÂCHE *">
            <Input value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} placeholder="ex: Confirmer le traiteur, Envoyer les invitations…"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="DATE LIMITE">
              <Input type="date" value={newTask.dueDate} onChange={e=>setNewTask({...newTask,dueDate:e.target.value})}/>
            </Field>
            <Field label="RESPONSABLE">
              <Input value={newTask.responsible} onChange={e=>setNewTask({...newTask,responsible:e.target.value})} placeholder="ex: Marie, Traiteur…"/>
            </Field>
          </div>
          <Field label="PRIORITÉ">
            <div style={{ display:"flex", gap:8 }}>
              {[["high","🔴 Urgent",C.red],["medium","🟡 Normal",C.gold],["low","🟢 Faible",C.green]].map(([v,l,col])=>(
                <button key={v} onClick={()=>setNewTask({...newTask,priority:v})} style={{
                  flex:1, padding:"9px 6px", borderRadius:10, border:`2px solid ${newTask.priority===v?col:C.border}`,
                  background:newTask.priority===v?col+"22":C.mid, cursor:"pointer", color:newTask.priority===v?col:C.muted,
                  fontFamily:"inherit", fontSize:12, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="NOTES (optionnel)">
            <Input value={newTask.notes} onChange={e=>setNewTask({...newTask,notes:e.target.value})} placeholder="Précisions…"/>
          </Field>
          <Btn disabled={!newTask.title.trim()} onClick={()=>{
            updateEv(ev2=>({...ev2, planning:[...(ev2.planning||[]), {...newTask}]}));
            setNewTask({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});
            setShowAddTask(false);
          }} style={{marginTop:4}}>Ajouter la tâche</Btn>
        </div>
      </Modal>

      {/* ── MODAL PROGRAMME ── */}
      <Modal open={showAddProgramItem} onClose={()=>{setShowAddProgramItem(false);setNewProgramItem({time:"",label:"",icon:"🎤",notes:""}); }} title="Ajouter une étape au programme">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="HEURE">
              <Input type="time" value={newProgramItem.time} onChange={e=>setNewProgramItem({...newProgramItem,time:e.target.value})}/>
            </Field>
            <Field label="ÉTAPE *">
              <Input value={newProgramItem.label} onChange={e=>setNewProgramItem({...newProgramItem,label:e.target.value})} placeholder="ex: Vin d'honneur, Dîner, Ouverture de bal…"/>
            </Field>
          </div>
          <Field label="ICÔNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["🥂","🍽","💃","🎤","📸","🎂","💍","🎭","🎻","🎵","🎊","🌅","🚗","🏛"].map(ic=>(
                <button key={ic} onClick={()=>setNewProgramItem({...newProgramItem,icon:ic})} style={{
                  width:38,height:38,borderRadius:8,fontSize:20,background:newProgramItem.icon===ic?C.gold+"33":C.mid,
                  border:`2px solid ${newProgramItem.icon===ic?C.gold:C.border}`,cursor:"pointer",
                }}>{ic}</button>
              ))}
            </div>
          </Field>
          <Field label="NOTES (optionnel)">
            <Input value={newProgramItem.notes} onChange={e=>setNewProgramItem({...newProgramItem,notes:e.target.value})} placeholder="Durée, lieu, responsable…"/>
          </Field>
          <Btn disabled={!newProgramItem.label.trim()||!newProgramItem.time} onClick={()=>{
            updateEv(ev2=>({...ev2, programme:[...(ev2.programme||[]), {...newProgramItem}]}));
            setNewProgramItem({time:"",label:"",icon:"🎤",notes:""});
            setShowAddProgramItem(false);
          }} style={{marginTop:4}}>Ajouter l'étape</Btn>
        </div>
      </Modal>

      {/* ── MODAL PRESTATAIRE ── */}
      <Modal open={showAddSupplier} onClose={()=>{setShowAddSupplier(false);setNewSupplier({name:"",role:"",phone:"",email:"",notes:""}); }} title="Ajouter un prestataire">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM / SOCIÉTÉ *">
            <Input value={newSupplier.name} onChange={e=>setNewSupplier({...newSupplier,name:e.target.value})} placeholder="ex: DJ Martin, Fleurs du Soleil, Photos by Julie…"/>
          </Field>
          <Field label="RÔLE / PRESTATION">
            <Input value={newSupplier.role} onChange={e=>setNewSupplier({...newSupplier,role:e.target.value})} placeholder="ex: DJ, Fleuriste, Photographe, Traiteur…"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="TÉLÉPHONE">
              <Input type="tel" value={newSupplier.phone} onChange={e=>setNewSupplier({...newSupplier,phone:e.target.value})} placeholder="06 00 00 00 00"/>
            </Field>
            <Field label="EMAIL">
              <Input type="email" value={newSupplier.email} onChange={e=>setNewSupplier({...newSupplier,email:e.target.value})} placeholder="contact@prestataire.fr"/>
            </Field>
          </div>
          <Field label="NOTES (contrat, acompte, horaires…)">
            <Input value={newSupplier.notes} onChange={e=>setNewSupplier({...newSupplier,notes:e.target.value})} placeholder="Contrat signé, acompte versé, arrivée 14h…"/>
          </Field>
          <Btn disabled={!newSupplier.name.trim()} onClick={()=>{
            updateEv(ev2=>({...ev2, suppliers:[...(ev2.suppliers||[]), {...newSupplier,id:Date.now()}]}));
            setNewSupplier({name:"",role:"",phone:"",email:"",notes:""});
            setShowAddSupplier(false);
          }} style={{marginTop:4}}>Ajouter le prestataire</Btn>
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
          <Field label={t.settingType}>
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
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:20 }}>Partagez ce QR code avec vos invités pour qu'ils renseignent leurs préférences.</p>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <div style={{ padding:16,background:C.cream,borderRadius:16,border:`2px solid ${C.border}`,display:"inline-block" }}>
              <QRCodeWidget value={`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`} size={180}/>
            </div>
          </div>
          <div style={{ background:"#13131e",borderRadius:8,padding:"8px 16px",fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:20,fontFamily:"monospace",cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}
            onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`);}} title="Cliquer pour copier">
            tableplan-seven.vercel.app/?join={ev.id} (🔗 via Partager) <span style={{fontSize:10}}>📋</span>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn small onClick={()=>{const c=document.querySelector("#qr-modal canvas");if(!c){alert("QR non disponible");return;}const l=document.createElement("a");l.download=`QR-${ev.name}.png`;l.href=c.toDataURL("image/png");l.click();}}>⬇ PNG</Btn>
            <Btn small variant="ghost" onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`).then(()=>alert("Lien copié !"))}}>📋 Copier le lien</Btn>
            <Btn small variant="muted" onClick={()=>setShowSettings(false)}>🖨 Imprimer</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={showSettings} onClose={()=>setShowSettings(false)} title="Paramètres de l'événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={t.settingName}><Input value={ev.name} onChange={e=>updateEv(evUp=>({...evUp,name:e.target.value}))}/></Field>
          <Field label={t.settingDate}><Input type="date" value={ev.date} onChange={e=>updateEv(evUp=>({...evUp,date:e.target.value}))}/></Field>
          <Field label={t.eventNotes}>
            <textarea value={ev.notes||""} onChange={e=>updateEv(evUp=>({...evUp,notes:e.target.value}))} rows={3}
              placeholder="Salle des fêtes, traiteur, prestataires..."
              style={{...inputStyle, resize:"vertical", lineHeight:1.6}}/>
          </Field>
          <Field label={t.settingType}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=>(
                <button key={k} onClick={()=>updateEv(evUp=>({...evUp,type:k}))} style={{
                  padding:"8px 6px", borderRadius:10, border:`2px solid ${ev.type===k?v.color:C.border}`,
                  background:ev.type===k?v.color+"22":C.mid, cursor:"pointer",
                  color:ev.type===k?v.color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:11, fontWeight:700,
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
      <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:20, padding:40, width:380, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🎟️</div>
        <h2 style={{ color:"#C9973A", margin:"0 0 8px", fontSize:22, fontWeight:400, letterSpacing:1 }}>Code promotionnel</h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:"0 0 24px", lineHeight:1.6 }}>
          Entrez votre bon de réduction pour activer votre offre
        </p>
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && !success && handleApply()}
          placeholder="EX: MARIAGE2026"
          autoFocus
          style={{
            width:"100%", padding:"14px 16px", background:"#13131e",
            border:`1px solid ${success ? C.green : msg?.type==="error" ? C.red : C.border}`,
            borderRadius:10, color:"#ffffff", fontSize:18, letterSpacing:4,
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
            style={{ flex:1, padding:"12px", background:"none", border:"1px solid rgba(201,151,58,0.15)", borderRadius:10, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:14, fontFamily:"Georgia,serif" }}
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
        <div style={{ marginTop:20, fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
          Codes actifs : <span style={{color:"#C9973A"}}>BIENVENUE</span> · <span style={{color:"#C9973A"}}>MARIAGE2026</span> · <span style={{color:"#C9973A"}}>PARTENAIRE</span> · <span style={{color:"#C9973A"}}>VIP100</span>
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
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 30%,#2a1a0e,${C.dark})`, fontFamily:"Georgia,serif", color:"#ffffff" }}>
      {/* Nav */}
      <div style={{ background:"#18182a", borderBottom:"1px solid rgba(201,151,58,0.12)", padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:"#C9973A", letterSpacing:1 }}>🪑 TableMaître</span>
        <div style={{flex:1}}/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}44` }}/>
          ) : (
            <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(90deg,#C9973A,#F0C97A)"+"33",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9973A",fontSize:13,fontWeight:700 }}>
              {user.avatar}
            </div>
          )}
          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>{user.name.split(" ")[0]}</span>
          {/* Sélecteur de langue */}
          <div style={{ position:"relative" }}>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              aria-label="Language / Langue"
              style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13, padding:"6px 8px", fontFamily:"inherit", outline:"none" }}
            >
              {Object.entries(LANG_FLAGS).map(([code, flag]) => (
                <option key={code} value={code}>{flag} {LANG_NAMES[code]}</option>
              ))}
            </select>
          </div>
          <button onClick={onToggleTheme}
            title={lightMode?t.darkMode:t.lightMode}
            aria-label={lightMode?t.darkMode:t.lightMode}
            style={{ padding:"6px 10px", background:"none", border:"1px solid rgba(201,151,58,0.15)", borderRadius:8, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:16 }}>
            <span aria-hidden="true">{lightMode ? "🌙" : "☀️"}</span>
          </button>
          <button
            onClick={() => setShowVoucher(true)}
            style={{ padding:"6px 14px", background:"none", border:"1px solid rgba(201,151,58,0.4)", borderRadius:8, color:"#C9973A", cursor:"pointer", fontSize:12, fontFamily:"Georgia,serif", display:"flex", alignItems:"center", gap:6 }}
          >
            🎟️ Code promo{appliedVoucher && <span style={{background:"linear-gradient(135deg,#C9973A,#F0C97A)",color:C.dark,borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700}}>✓</span>}
          </button>
          <Btn variant="muted" small onClick={onLogout}>Déconnexion</Btn>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 20px" }}>
        {/* Hero */}
        <div style={{ marginBottom:48, textAlign:"center" }}>
          <h1 style={{ fontSize:36, fontWeight:400, margin:"0 0 8px", letterSpacing:1 }}>{t.myEvents}</h1>
          <p style={{ color:"rgba(255,255,255,0.45)", margin:0, fontSize:14 }}>{t.welcome}, {user.name}</p>
        </div>

        <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
          <input
            value={globalSearch}
            onChange={e=>setGlobalSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            role="searchbox"
            style={{ flex:1, padding:"10px 16px", background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:12, color:"#ffffff", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }}
          />
          <Btn onClick={()=>setShowNew(true)}>{t.newEvent}</Btn>
        </div>

        {myEvents.length===0 && (
          <div style={{ textAlign:"center", padding:"80px 20px", color:"rgba(255,255,255,0.45)" }}>
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
                background:"#18182a", border:"1px solid rgba(201,151,58,0.15)", borderRadius:18, padding:24,
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
                  <h3 style={{ color:"#ffffff", margin:0, fontSize:18, fontWeight:400 }}>{ev.name}</h3>
                  <button onClick={e=>{e.stopPropagation();const copy={...ev,id:Date.now(),name:ev.name+" (copie)",ownerId:user.id};setEvents(prev=>[...prev,copy]);}}
                    title="Dupliquer cet événement"
                    aria-label={`Dupliquer l'événement ${ev.name}`}
                    style={{background:"none",border:"1px solid rgba(201,151,58,0.15)",borderRadius:8,color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:12,padding:"3px 8px",fontFamily:"inherit"}}>
                    <span aria-hidden="true">⧉</span>
                  </button>
                </div>
                <p style={{ color:"rgba(255,255,255,0.45)", margin:"0 0 16px", fontSize:12 }}>
                  {ev.date}
                  {(() => {
                    const days = Math.ceil((new Date(ev.date) - new Date()) / 86400000);
                    if (days < 0) return <span style={{color:"rgba(255,255,255,0.45)",marginLeft:8}}>— passé</span>;
                    if (days === 0) return <span style={{color:C.green,marginLeft:8,fontWeight:700}}>• Aujourd'hui !</span>;
                    if (days <= 7) return <span style={{color:C.red,marginLeft:8,fontWeight:700}}>• {t ? t.inDays : "In"} {days}{t ? t.days : "d"}</span>;
                    if (days <= 30) return <span style={{color:"#E8845A",marginLeft:8}}>• {t ? t.inDays : "In"} {days}{t ? t.days : "d"}</span>;
                    return <span style={{color:"rgba(255,255,255,0.45)",marginLeft:8}}>• {t ? t.inDays : "In"} {days}{t ? t.days : "d"}</span>;
                  })()}
                </p>
                <div style={{ display:"flex", gap:16, fontSize:12, color:"rgba(255,255,255,0.45)" }}>
                  <span>🪑 {ev.tables.length} {t.tables}</span>
                  <span>👤 {ev.guests.length} {t.guests}</span>
                  {unseated>0 && <span style={{ color:C.red }}>⚠ {unseated} {t.unseated}</span>}
                  {globalSearch && ev.guests.some(g3=>g3.name.toLowerCase().includes(globalSearch.toLowerCase())) && (
                    <span style={{color:"#C9973A"}}>✦ {ev.guests.filter(g3=>g3.name.toLowerCase().includes(globalSearch.toLowerCase())).length} invité(s) trouvé(s)</span>
                  )}
                </div>
                {ev.guests.length > 0 && (() => {
                  const placed = ev.guests.filter(g => g.tableId).length;
                  const pct = Math.round(placed / ev.guests.length * 100);
                  const barCol = pct === 100 ? C.green : pct > 50 ? C.gold : C.red;
                  return (
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.45)", marginBottom:4 }}>
                        <span>{t.placement}</span>
                        <span style={{color:barCol, fontWeight:700}}>{pct}%</span>
                      </div>
                      <div style={{ height:4, background:"#13131e", borderRadius:99 }}>
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
          <div style={{ background:"#18182a", border:"1px solid rgba(201,151,58,0.4)", borderRadius:20, padding:40, width:400, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>⭐</div>
            <h2 style={{ color:"#C9973A", margin:"0 0 8px", fontSize:22, fontWeight:400 }}>Passez au plan Pro</h2>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:"0 0 20px", lineHeight:1.7 }}>
              Le plan gratuit est limité à <strong style={{color:"#ffffff"}}>1 événement</strong>.<br/>
              Activez un code promo ou passez Pro pour des événements illimités.
            </p>
            <div style={{ background:"#13131e", borderRadius:12, padding:"16px 20px", marginBottom:20, textAlign:"left" }}>
              {["Événements illimités","Invités illimités","Export CSV","QR codes","Chevalets imprimables"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:8, color:"#ffffff", fontSize:13, marginBottom:6 }}>
                  <span style={{color:C.green}}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowUpgrade(false)} style={{ flex:1, padding:"12px", background:"none", border:"1px solid rgba(201,151,58,0.15)", borderRadius:10, color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13, fontFamily:"Georgia,serif" }}>
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
        <div style={{ position:"fixed", bottom:24, right:24, background:"#18182a", border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 20px", zIndex:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          <span style={{fontSize:18}}>🎟️</span>
          <div>
            <div style={{color:C.green, fontSize:12, fontWeight:700}}>Code appliqué : {appliedVoucher.code}</div>
            <div style={{color:"rgba(255,255,255,0.45)", fontSize:11}}>{appliedVoucher.description}</div>
          </div>
          <button onClick={() => setAppliedVoucher(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:16,padding:0}}>×</button>
        </div>
      )}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvel événement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÉVÉNEMENT *"><Input value={newEv.name} onChange={e=>setNewEv({...newEv,name:e.target.value})} placeholder="Mariage Dupont × Martin"/></Field>
          <Field label={t.settingDate}><Input type="date" value={newEv.date} onChange={e=>setNewEv({...newEv,date:e.target.value})}/></Field>
          <Field label="TYPE D'ÉVÉNEMENT">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=>(
                <button key={k} onClick={()=>setNewEv({...newEv,type:k})} style={{
                  padding:"10px 8px", borderRadius:10, border:`2px solid ${newEv.type===k?v.color:C.border}`,
                  background:newEv.type===k?v.color+"22":C.mid, cursor:"pointer",
                  color:newEv.type===k?v.color:"rgba(255,255,255,0.45)", fontFamily:"inherit", fontSize:12, fontWeight:700,
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

// ═══════════════════════════════════════════════════════════════
// PAGE PUBLIQUE INVITÉ (?join=eventId)
// ═══════════════════════════════════════════════════════════════
function GuestJoinPage({ eventId }) {
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("view"); // view | rsvp | done
  const [form, setForm] = useState({ name:"", diet:"standard", allergies:[], notes:"" });
  const [found, setFound] = useState(null);

  useEffect(() => {
    // Charger l'événement public depuis Firestore
    async function loadEvent() {
      const fb = getFirebase();
      if (!fb) { setLoading(false); return; }
      try {
        // Format du join ID: "userId___eventId" ou juste "eventId"
        if (eventId.includes("___")) {
          // Nouveau format avec userId
          var parts = eventId.split("___");
          var userId = parts[0];
          var evId = parts[1];
          var doc = await fb.db.collection("users").doc(userId).collection("events").doc(evId).get();
          if (doc.exists) setEv(doc.data());
        } else {
          // Ancien format: collectionGroup (peut échouer si règles restrictives)
          try {
            var snap = await fb.db.collectionGroup("events").where("id","==",eventId).limit(1).get();
            if (!snap.empty) setEv(snap.docs[0].data());
          } catch(e2) {
            console.log("collectionGroup non disponible, essai lecture directe...");
          }
        }
      } catch(e) {
        console.error("Erreur chargement event public:", e);
      }
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#C9973A", fontSize:18 }}>🪑 Chargement…</div>
    </div>
  );

  if (!ev) return (
    <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", padding:20, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
      <h2 style={{ color:"#C9973A", fontWeight:400 }}>Événement introuvable</h2>
      <p style={{ color:"#8A7355", marginBottom:8 }}>Le lien est peut-être expiré ou invalide.</p>
      <p style={{ color:"#5a3a1a", fontSize:12 }}>Demandez à l'organisateur de partager le lien via le bouton "🔗 Partager" de l'application.</p>
      <a href="/" style={{ marginTop:24, color:"#C9973A", fontSize:14 }}>← Retour à TableMaître</a>
    </div>
  );

  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const myTable = found ? ev.tables?.find(t => t.id === found.tableId) : null;
  const seatedCount = (ev.guests||[]).filter(g => g.tableId).length;
  const totalGuests = (ev.guests||[]).length;

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, #120C08, #1a0e06)`, fontFamily:"Georgia,'Palatino Linotype',serif", padding:"20px 16px" }}>
      {/* Header */}
      <div style={{ maxWidth:480, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{theme.icon}</div>
          <h1 style={{ fontSize:28, fontWeight:400, color:"#C9973A", letterSpacing:2, margin:"0 0 8px" }}>{ev.name}</h1>
          <p style={{ color:"#8A7355", fontSize:14 }}>
            📅 {new Date(ev.date).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
          {ev.notes && <p style={{ color:"#A89060", fontSize:13, fontStyle:"italic", marginTop:8 }}>{ev.notes}</p>}
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:28 }}>
          {[
            { label:"Tables", val:ev.tables?.length||0, icon:"🪑" },
            { label:"Invités", val:totalGuests, icon:"👥" },
            { label:"Placés", val:seatedCount, icon:"✅" },
          ].map(s => (
            <div key={s.label} style={{ background:"#1E1208", border:"1px solid #3a2a1a", borderRadius:12, padding:"12px 20px", textAlign:"center", flex:1 }}>
              <div style={{ fontSize:20 }}>{s.icon}</div>
              <div style={{ color:"#C9973A", fontSize:20, fontWeight:700 }}>{s.val}</div>
              <div style={{ color:"#8A7355", fontSize:11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Rechercher sa place */}
        <div style={{ background:"#1E1208", border:"1px solid #3a2a1a", borderRadius:16, padding:24, marginBottom:20 }}>
          <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:16, marginBottom:16 }}>🔍 Trouver ma place</h3>
          <input
            placeholder="Votre prénom ou nom…"
            onChange={e => {
              const q = e.target.value.toLowerCase();
              if (!q) { setFound(null); return; }
              const match = (ev.guests||[]).find(g => g.name.toLowerCase().includes(q));
              setFound(match || false);
            }}
            style={{ width:"100%", padding:"12px 16px", background:"#2a1a0e", border:"1px solid #5a3a1a", borderRadius:10, color:"#F5EAD4", fontSize:15, fontFamily:"Georgia,serif", boxSizing:"border-box", outline:"none" }}
          />

          {found === false && (
            <div style={{ marginTop:12, color:"#E8845A", fontSize:13 }}>
              ❌ Prénom non trouvé dans la liste des invités
            </div>
          )}

          {found && (
            <div style={{ marginTop:16, background:"#0a2a0a", border:"1px solid #2a5a2a", borderRadius:12, padding:16 }}>
              <p style={{ color:"#81C784", fontWeight:700, fontSize:16, margin:"0 0 8px" }}>
                ✅ Bonjour {found.name}{found.role && found.role === "temoin" ? " 🎖 (Témoin)" : found.role === "marie1" || found.role === "marie2" ? " 💍 (Marié(e))" : ""} !
              </p>
              {myTable ? (
                <div>
                  <p style={{ color:"#A5D6A7", margin:"0 0 4px" }}>
                    Vous êtes à la <strong style={{ color:"#C9973A" }}>Table {myTable.number}{myTable.label ? ` — ${myTable.label}` : ""}</strong>
                  </p>
                  <p style={{ color:"#6a8a6a", fontSize:12, marginBottom:12 }}>
                    {(ev.guests||[]).filter(function(g){ return g.tableId === myTable.id; }).length} personnes à cette table
                  </p>
                </div>
              ) : (
                <p style={{ color:"#E8845A", fontSize:14, marginBottom:12 }}>Votre placement n'est pas encore défini</p>
              )}

              {/* Formulaire régime alimentaire */}
              <div style={{ borderTop:"1px solid #2a5a2a", paddingTop:12, marginTop:4 }}>
                <p style={{ color:"#A5D6A7", fontSize:13, marginBottom:8 }}>🍽 Votre régime alimentaire</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                  {["standard","vegetarien","vegan","sans-gluten","halal","casher","sans-lactose"].map(function(dietId){
                    var icons = {"standard":"🍽","vegetarien":"🥗","vegan":"🌱","sans-gluten":"🌾","halal":"☪️","casher":"✡️","sans-lactose":"🥛"};
                    var labels = {"standard":"Standard","vegetarien":"Végétarien","vegan":"Vegan","sans-gluten":"Sans gluten","halal":"Halal","casher":"Casher","sans-lactose":"Sans lactose"};
                    var isSelected = found.diet === dietId;
                    return (
                      <button key={dietId}
                        onClick={function(){
                          // Mettre à jour le state local immédiatement
                          var updatedGuests = (ev.guests||[]).map(function(g){ return g.id===found.id ? {...g, diet:dietId} : g; });
                          setEv(function(prev){ return {...prev, guests: updatedGuests}; });
                          setFound(function(prev){ return {...prev, diet: dietId}; });
                          // Sauvegarder dans Firestore
                          var fb = getFirebase();
                          if (fb && ev._ownerId && ev.id) {
                            fb.db.collection("users").doc(ev._ownerId).collection("events").doc(String(ev.id)).update({
                              guests: updatedGuests
                            }).catch(function(e){ console.error("Firestore write:", e); });
                          }
                        }}
                        style={{ background:isSelected?"#C9973A22":"#1a2a1a", border:"1px solid "+(isSelected?"#C9973A":"#2a5a2a"), borderRadius:99, padding:"6px 14px", cursor:"pointer", color:isSelected?"#C9973A":"#A5D6A7", fontSize:12, fontFamily:"Georgia,serif" }}
                      >{icons[dietId]} {labels[dietId]}</button>
                    );
                  })}
                </div>
                <textarea
                  placeholder="Notes spéciales (allergie sévère, handicap, siège bébé...)"
                  defaultValue={found.notes||""}
                  rows={2}
                  style={{ width:"100%", padding:"8px 12px", background:"#1a2a1a", border:"1px solid #2a5a2a", borderRadius:8, color:"#A5D6A7", fontSize:12, fontFamily:"Georgia,serif", resize:"vertical", boxSizing:"border-box" }}
                  onChange={function(e){
                    var notes = e.target.value;
                    setFound(function(prev){ return {...prev, notes: notes}; });
                  }}
                  onBlur={function(e){
                    var notes = e.target.value;
                    var updatedGuests = (ev.guests||[]).map(function(g){ return g.id===found.id ? {...g, notes:notes} : g; });
                    setEv(function(prev){ return {...prev, guests: updatedGuests}; });
                    var fb = getFirebase();
                    if (fb && ev._ownerId && ev.id) {
                      fb.db.collection("users").doc(ev._ownerId).collection("events").doc(String(ev.id)).update({
                        guests: updatedGuests
                      }).then(function(){ 
                        // Afficher confirmation
                      }).catch(function(e){ console.error("Firestore write:", e); });
                    }
                  }}
                />
                <p style={{ color:"#4a7a4a", fontSize:11, marginTop:6 }}>
                  {found.diet && found.diet !== "standard" ? "✅ Régime enregistré — " : ""}
                  Vos préférences seront transmises à l'organisateur
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plan par tables */}
        {(ev.tables||[]).length > 0 && (
          <div style={{ background:"#1E1208", border:"1px solid #3a2a1a", borderRadius:16, padding:24 }}>
            <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:16, marginBottom:16 }}>🪑 Plan de table</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(ev.tables||[]).map(tbl => {
                const tGuests = (ev.guests||[]).filter(g => g.tableId === tbl.id);
                return (
                  <div key={tbl.id} style={{ background:"#2a1a0e", borderRadius:10, overflow:"hidden", border:`1px solid ${tbl.color||"#5a3a1a"}44` }}>
                    <div style={{ background:(tbl.color||"#C9973A")+"22", padding:"8px 16px", display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:tbl.color||"#C9973A", fontWeight:700, fontSize:14 }}>
                        Table {tbl.number}{tbl.label ? ` — ${tbl.label}` : ""}
                      </span>
                      <span style={{ color:"#8A7355", fontSize:12 }}>{tGuests.length}/{tbl.capacity}</span>
                    </div>
                    <div style={{ padding:"8px 16px", display:"flex", flexWrap:"wrap", gap:6 }}>
                      {tGuests.length === 0 ? (
                        <span style={{ color:"#5a3a1a", fontSize:12, fontStyle:"italic" }}>— Vide —</span>
                      ) : tGuests.map(g => (
                        <span key={g.id} style={{
                          background: found && found.id === g.id ? "#C9973A22" : "#3a2a1a",
                          border: `1px solid ${found && found.id === g.id ? "#C9973A" : "#5a3a1a"}`,
                          borderRadius:99, padding:"3px 10px", fontSize:12,
                          color: found && found.id === g.id ? "#C9973A" : "#A89060",
                          fontWeight: found && found.id === g.id ? 700 : 400,
                        }}>{g.name}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", color:"#5a3a1a", fontSize:11, marginTop:24 }}>
          Propulsé par TableMaître 🪑
        </p>
      </div>
    </div>
  );
}


export default function App() {
  const fbUser = useFirebaseAuth();
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [view, setView] = useState("dashboard");
  const [lightMode, setLightMode] = useState(false);

  // PWA Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  const { t, lang, setLang } = useI18n();

  // Thème
  // Rappel J-7 — notifications browser
  useEffect(() => {
    if (!events || !events.length) return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") Notification.requestPermission();
    var today = new Date();
    events.forEach(function(ev) {
      if (!ev.date) return;
      var diffDays = Math.round((new Date(ev.date) - today) / (1000*60*60*24));
      if (diffDays === 7 || diffDays === 3 || diffDays === 1) {
        var key = "notif_" + ev.id + "_d" + diffDays;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, "1");
          if (Notification.permission === "granted") {
            new Notification("🪑 TableMaître — " + ev.name, {
              body: diffDays === 1 ? "C'est demain ! Votre plan est-il prêt ?" : "Dans " + diffDays + " jours — Finalisez votre plan de table.",
            });
          }
        }
      }
    });
  }, [events]);

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

  // Chargement temps réel via Firestore onSnapshot
  useEffect(() => {
    if (!fbUser) { setEvents([]); setEventsLoaded(false); return; }
    setEventsLoaded(false);
    const fb = getFirebase();
    if (!fb) {
      loadEventsFromFirestore(fbUser.uid).then(evs => {
        setEvents(evs.length > 0 ? evs : []);
        setEventsLoaded(true);
      });
      return;
    }
    // onSnapshot = temps réel — se met à jour automatiquement
    const unsub = fb.db
      .collection("users").doc(fbUser.uid).collection("events")
      .onSnapshot(function(snap) {
        const evs = snap.docs.map(function(d){ return d.data(); });
        setEvents(evs);
        setEventsLoaded(true);
      }, function(err) {
        console.error("Snapshot error:", err);
        setEventsLoaded(true);
      });
    return function(){ unsub && unsub(); };
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

  // Page publique invité (?join=eventId) — accessible sans connexion
  var joinId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("join") : null;
  if (joinId) return <GuestJoinPage eventId={joinId} />;

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
