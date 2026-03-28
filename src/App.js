/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from "react";

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// FIREBASE CONFIG
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

// Firebase chargÃÂÃÂ© via CDN dans public/index.html
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// CONSTANTS & DATA
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

// ÃÂÃÂchapper les caractÃÂÃÂ¨res HTML pour ÃÂÃÂ©viter les injections XSS
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// INTERNATIONALISATION (i18n)
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

const TRANSLATIONS = {
  fr: {
    // Navbar
    appName: "TableMaÃÂÃÂ®tre",
    logout: "DÃÂÃÂ©connexion",
    lightMode: "Passer en mode clair",
    darkMode: "Passer en mode sombre",
    codePromo: "ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Code promo",
    // Dashboard
    myEvents: "Mes ÃÂÃÂ©vÃÂÃÂ©nements",
    welcome: "Bienvenue",
    searchPlaceholder: "Rechercher un ÃÂÃÂ©vÃÂÃÂ©nement ou un invitÃÂÃÂ©...",
    newEvent: "+ Nouvel ÃÂÃÂ©vÃÂÃÂ©nement",
    noEvents: "Aucun ÃÂÃÂ©vÃÂÃÂ©nement pour le moment",
    createFirst: "CrÃÂÃÂ©er mon premier ÃÂÃÂ©vÃÂÃÂ©nement",
    tables: "tables",
    guests: "invitÃÂÃÂ©s",
    unseated: "non placÃÂÃÂ©s",
    placement: "Placement",
    guestsFound: "invitÃÂÃÂ©(s) trouvÃÂÃÂ©(s)",
    duplicate: "Dupliquer cet ÃÂÃÂ©vÃÂÃÂ©nement",
    daysAgo: "passÃÂÃÂ©",
    today: "Aujourd'hui !",
    inDays: "Dans",
    days: "j",
    // Event types
    mariage: "Mariage",
    gala: "Gala / SoirÃÂÃÂ©e",
    anniversaire: "Anniversaire",
    conference: "ConfÃÂÃÂ©rence",
    autre: "Autre",
    // Event Editor
    back: "ÃÂ¢ÃÂÃÂ Projets",
    autoPlace: "ÃÂ¢ÃÂÃÂ¨ Auto-placer",
    placeCards: "ÃÂ°ÃÂÃÂÃÂ¨ Chevalets",
    floorPlan: "ÃÂ°ÃÂÃÂÃÂ Plan PDF",
    qrCode: "QR Code",
    tabPlan: "ÃÂ°ÃÂÃÂÃÂº Plan",
    tabList: "ÃÂ°ÃÂÃÂÃÂ Liste",
    tabGuests: "ÃÂ°ÃÂÃÂÃÂ¥ InvitÃÂÃÂ©s",
    tabFood: "ÃÂ°ÃÂÃÂÃÂ½ Alimentation",
    tabConstraints: "ÃÂ¢ÃÂÃÂ Contraintes",
    tabRoom: "ÃÂ¢ÃÂ¬ÃÂ¡ Salle",
    addTable: "+ Table",
    addGuest: "+ InvitÃÂÃÂ©",
    dietSummary: "ÃÂ°ÃÂÃÂÃÂ RÃÂÃÂ©cap alimentaire",
    unseatedList: "ÃÂ¢ÃÂÃÂ  NON PLACÃÂÃÂS",
    seeAvailable: "ÃÂ°ÃÂÃÂÃÂ Voir places libres",
    tablesVisible: "ÃÂ¢ÃÂÃÂ Tables visibles",
    clickToPlace: "ÃÂ°ÃÂÃÂÃÂ Cliquez sur une table pour y placer",
    undo: "ÃÂ¢ÃÂÃÂ© Annuler",
    // Guests
    search: "Rechercher un invitÃÂÃÂ©ÃÂ¢ÃÂÃÂ¦",
    exportCSV: "ÃÂ¢ÃÂ¬ÃÂ Export CSV",
    importCSV: "ÃÂ¢ÃÂ¬ÃÂ Import CSV",
    // Table form
    tableNumber: "NUMÃÂÃÂRO",
    tableCapacity: "CAPACITÃÂÃÂ",
    tableShape: "FORME",
    tableLabel: "ÃÂÃÂTIQUETTE",
    tableColor: "COULEUR",
    createTable: "CrÃÂÃÂ©er la table",
    deleteTable: "Supprimer la table",
    round: "Ronde",
    rectangular: "Rectangulaire",
    // Guest form
    guestName: "NOM *",
    guestEmail: "EMAIL",
    guestDiet: "RÃÂÃÂGIME",
    guestAllergies: "ALLERGIES",
    guestTable: "TABLE",
    guestNotes: "NOTES",
    addGuestBtn: "Ajouter l'invitÃÂÃÂ©",
    noTable: "-- Non placÃÂÃÂ© --",
    // Login
    loginGoogle: "Se connecter avec Google",
    loginSubtitle: "GESTION DE PLANS DE TABLE",
    // Notifications
    savedCloud: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ SauvegardÃÂÃÂ© dans le cloud",
    savedAuto: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ SauvegardÃÂÃÂ© automatiquement",
    // Voucher
    voucherTitle: "Code promotionnel",
    voucherApplied: "ÃÂ¢ÃÂÃÂ Code appliquÃÂÃÂ© !",
    // Misc
    loading: "ChargementÃÂ¢ÃÂÃÂ¦",
    skipToMain: "Passer au contenu principal",
    note: "ÃÂ°ÃÂÃÂÃÂ",
    eventNotes: "LIEU / NOTES INTERNES",
    eventName: "NOM",
    eventDate: "DATE",
    eventType: "TYPE",
    // Stats bar
    statTables: "Tables",
    statGuests: "InvitÃÂÃÂ©s",
    statSeated: "PlacÃÂÃÂ©s",
    statWaiting: "En attente",
    statDiets: "RÃÂÃÂ©gimes spÃÂÃÂ©ciaux",
    // Countdown
    daysAgoLabel: "passÃÂÃÂ©",
    todayLabel: "Aujourd'hui !",
    // Form labels
    fieldName: "NOM *",
    fieldEmail: "EMAIL",
    fieldTable: "TABLE",
    fieldNotes: "NOTES",
    fieldDiet: "RÃÂÃÂGIME",
    fieldAllergies: "ALLERGIES",
    fieldNumber: "NUMÃÂÃÂRO",
    fieldCapacity: "CAPACITÃÂÃÂ",
    fieldShape: "FORME",
    fieldLabel: "ÃÂÃÂTIQUETTE",
    fieldColor: "COULEUR",
    shapeRound: "Ronde",
    shapeRect: "Rectangulaire",
    notSeated: "Non placÃÂÃÂ©",
    addGuestBtn: "Ajouter l'invitÃÂÃÂ©",
    createTableBtn: "CrÃÂÃÂ©er la table",
    deleteTableBtn: "Supprimer la table",
    settingName: "NOM",
    settingDate: "DATE",
    settingType: "TYPE",
  },

  en: {
    appName: "TableMaÃÂÃÂ®tre",
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
    back: "ÃÂ¢ÃÂÃÂ Projects",
    autoPlace: "ÃÂ¢ÃÂÃÂ¨ Auto-seat",
    placeCards: "ÃÂ°ÃÂÃÂÃÂ¨ Place cards",
    floorPlan: "ÃÂ°ÃÂÃÂÃÂ Floor plan PDF",
    qrCode: "QR Code",
    tabPlan: "ÃÂ°ÃÂÃÂÃÂº Plan",
    tabList: "ÃÂ°ÃÂÃÂÃÂ Liste",
    tabGuests: "ÃÂ°ÃÂÃÂÃÂ¥ Guests",
    tabFood: "ÃÂ°ÃÂÃÂÃÂ½ Dietary",
    tabConstraints: "ÃÂ¢ÃÂÃÂ Constraints",
    tabRoom: "ÃÂ¢ÃÂ¬ÃÂ¡ Room",
    addTable: "+ Table",
    addGuest: "+ Guest",
    dietSummary: "ÃÂ°ÃÂÃÂÃÂ Dietary summary",
    unseatedList: "ÃÂ¢ÃÂÃÂ  UNSEATED",
    seeAvailable: "ÃÂ°ÃÂÃÂÃÂ Show available seats",
    tablesVisible: "ÃÂ¢ÃÂÃÂ Tables highlighted",
    clickToPlace: "ÃÂ°ÃÂÃÂÃÂ Click a table to seat",
    undo: "ÃÂ¢ÃÂÃÂ© Undo",
    search: "Search a guestÃÂ¢ÃÂÃÂ¦",
    exportCSV: "ÃÂ¢ÃÂ¬ÃÂ Export CSV",
    importCSV: "ÃÂ¢ÃÂ¬ÃÂ Import CSV",
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
    savedCloud: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Saved to cloud",
    savedAuto: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Auto-saved",
    voucherTitle: "Promotional code",
    voucherApplied: "ÃÂ¢ÃÂÃÂ Code applied!",
    loading: "LoadingÃÂ¢ÃÂÃÂ¦",
    skipToMain: "Skip to main content",
    note: "ÃÂ°ÃÂÃÂÃÂ",
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
    appName: "TableMaÃÂÃÂ®tre",
    logout: "Cerrar sesiÃÂÃÂ³n",
    lightMode: "Cambiar a modo claro",
    darkMode: "Cambiar a modo oscuro",
    codePromo: "CÃÂÃÂ³digo promocional",
    myEvents: "Mis eventos",
    welcome: "Bienvenido",
    searchPlaceholder: "Buscar un evento o un invitado...",
    newEvent: "+ Nuevo evento",
    noEvents: "No hay eventos por el momento",
    createFirst: "Crear mi primer evento",
    tables: "mesas",
    guests: "invitados",
    unseated: "sin asiento",
    placement: "AsignaciÃÂÃÂ³n",
    guestsFound: "invitado(s) encontrado(s)",
    duplicate: "Duplicar este evento",
    daysAgo: "pasado",
    today: "ÃÂÃÂ¡Hoy!",
    inDays: "En",
    days: "d",
    mariage: "Boda",
    gala: "Gala / Fiesta",
    anniversaire: "CumpleaÃÂÃÂ±os",
    conference: "Conferencia",
    autre: "Otro",
    back: "ÃÂ¢ÃÂÃÂ Proyectos",
    autoPlace: "ÃÂ¢ÃÂÃÂ¨ Auto-sentar",
    placeCards: "ÃÂ°ÃÂÃÂÃÂ¨ Tarjetas",
    floorPlan: "ÃÂ°ÃÂÃÂÃÂ Plano PDF",
    qrCode: "CÃÂÃÂ³digo QR",
    tabPlan: "ÃÂ°ÃÂÃÂÃÂº Plano",
    tabGuests: "ÃÂ°ÃÂÃÂÃÂ¥ Invitados",
    tabFood: "ÃÂ°ÃÂÃÂÃÂ½ AlimentaciÃÂÃÂ³n",
    tabConstraints: "ÃÂ¢ÃÂÃÂ Restricciones",
    tabRoom: "ÃÂ¢ÃÂ¬ÃÂ¡ Sala",
    addTable: "+ Mesa",
    addGuest: "+ Invitado",
    dietSummary: "ÃÂ°ÃÂÃÂÃÂ Resumen dietÃÂÃÂ©tico",
    unseatedList: "ÃÂ¢ÃÂÃÂ  SIN ASIENTO",
    seeAvailable: "ÃÂ°ÃÂÃÂÃÂ Ver asientos libres",
    tablesVisible: "ÃÂ¢ÃÂÃÂ Mesas destacadas",
    clickToPlace: "ÃÂ°ÃÂÃÂÃÂ Haz clic en una mesa para sentar",
    undo: "ÃÂ¢ÃÂÃÂ© Deshacer",
    search: "Buscar un invitadoÃÂ¢ÃÂÃÂ¦",
    exportCSV: "ÃÂ¢ÃÂ¬ÃÂ Exportar CSV",
    importCSV: "ÃÂ¢ÃÂ¬ÃÂ Importar CSV",
    tableNumber: "NÃÂÃÂMERO",
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
    addGuestBtn: "AÃÂÃÂ±adir invitado",
    noTable: "-- Sin asignar --",
    loginGoogle: "Iniciar sesiÃÂÃÂ³n con Google",
    loginSubtitle: "GESTIÃÂÃÂN DE PLANES DE MESA",
    savedCloud: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Guardado en la nube",
    savedAuto: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Guardado automÃÂÃÂ¡ticamente",
    voucherTitle: "CÃÂÃÂ³digo promocional",
    voucherApplied: "ÃÂ¢ÃÂÃÂ ÃÂÃÂ¡CÃÂÃÂ³digo aplicado!",
    loading: "CargandoÃÂ¢ÃÂÃÂ¦",
    skipToMain: "Ir al contenido principal",
    note: "ÃÂ°ÃÂÃÂÃÂ",
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
    todayLabel: "ÃÂÃÂ¡Hoy!",
    fieldName: "NOMBRE *",
    fieldEmail: "EMAIL",
    fieldTable: "MESA",
    fieldNotes: "NOTAS",
    fieldDiet: "DIETA",
    fieldAllergies: "ALERGIAS",
    fieldNumber: "NÃÂÃÂMERO",
    fieldCapacity: "CAPACIDAD",
    fieldShape: "FORMA",
    fieldLabel: "ETIQUETA",
    fieldColor: "COLOR",
    shapeRound: "Redonda",
    shapeRect: "Rectangular",
    notSeated: "Sin asignar",
    addGuestBtn: "AÃÂÃÂ±adir invitado",
    createTableBtn: "Crear mesa",
    deleteTableBtn: "Eliminar mesa",
    settingName: "NOMBRE",
    settingDate: "FECHA",
    settingType: "TIPO",
  },

  de: {
    appName: "TableMaÃÂÃÂ®tre",
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
    guests: "GÃÂÃÂ¤ste",
    unseated: "ohne Platz",
    placement: "Platzierung",
    guestsFound: "Gast/GÃÂÃÂ¤ste gefunden",
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
    back: "ÃÂ¢ÃÂÃÂ Projekte",
    autoPlace: "ÃÂ¢ÃÂÃÂ¨ Auto-Platzierung",
    placeCards: "ÃÂ°ÃÂÃÂÃÂ¨ Tischkarten",
    floorPlan: "ÃÂ°ÃÂÃÂÃÂ Saalplan PDF",
    qrCode: "QR-Code",
    tabPlan: "ÃÂ°ÃÂÃÂÃÂº Plan",
    tabList: "ÃÂ°ÃÂÃÂÃÂ Liste",
    tabGuests: "ÃÂ°ÃÂÃÂÃÂ¥ GÃÂÃÂ¤ste",
    tabFood: "ÃÂ°ÃÂÃÂÃÂ½ ErnÃÂÃÂ¤hrung",
    tabConstraints: "ÃÂ¢ÃÂÃÂ EinschrÃÂÃÂ¤nkungen",
    tabRoom: "ÃÂ¢ÃÂ¬ÃÂ¡ Saal",
    addTable: "+ Tisch",
    addGuest: "+ Gast",
    dietSummary: "ÃÂ°ÃÂÃÂÃÂ ErnÃÂÃÂ¤hrungsÃÂÃÂ¼bersicht",
    unseatedList: "ÃÂ¢ÃÂÃÂ  OHNE PLATZ",
    seeAvailable: "ÃÂ°ÃÂÃÂÃÂ Freie PlÃÂÃÂ¤tze anzeigen",
    tablesVisible: "ÃÂ¢ÃÂÃÂ Tische hervorgehoben",
    clickToPlace: "ÃÂ°ÃÂÃÂÃÂ Klicke einen Tisch zum Platzieren",
    undo: "ÃÂ¢ÃÂÃÂ© RÃÂÃÂ¼ckgÃÂÃÂ¤ngig",
    search: "Gast suchenÃÂ¢ÃÂÃÂ¦",
    exportCSV: "ÃÂ¢ÃÂ¬ÃÂ CSV exportieren",
    importCSV: "ÃÂ¢ÃÂ¬ÃÂ CSV importieren",
    tableNumber: "NUMMER",
    tableCapacity: "KAPAZITÃÂÃÂT",
    tableShape: "FORM",
    tableLabel: "BEZEICHNUNG",
    tableColor: "FARBE",
    createTable: "Tisch erstellen",
    deleteTable: "Tisch lÃÂÃÂ¶schen",
    round: "Rund",
    rectangular: "Rechteckig",
    guestName: "NAME *",
    guestEmail: "E-MAIL",
    guestDiet: "ERNÃÂÃÂHRUNG",
    guestAllergies: "ALLERGIEN",
    guestTable: "TISCH",
    guestNotes: "NOTIZEN",
    addGuestBtn: "Gast hinzufÃÂÃÂ¼gen",
    noTable: "-- Nicht platziert --",
    loginGoogle: "Mit Google anmelden",
    loginSubtitle: "TISCHPLAN-VERWALTUNG",
    savedCloud: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ In der Cloud gespeichert",
    savedAuto: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Automatisch gespeichert",
    voucherTitle: "Aktionscode",
    voucherApplied: "ÃÂ¢ÃÂÃÂ Code angewendet!",
    loading: "Wird geladenÃÂ¢ÃÂÃÂ¦",
    skipToMain: "Zum Hauptinhalt springen",
    note: "ÃÂ°ÃÂÃÂÃÂ",
    eventNotes: "ORT / INTERNE NOTIZEN",
    eventName: "NAME",
    eventDate: "DATUM",
    eventType: "TYP",
    // Stats bar
    statTables: "Tische",
    statGuests: "GÃÂÃÂ¤ste",
    statSeated: "Platziert",
    statWaiting: "Wartend",
    statDiets: "SpezialdiÃÂÃÂ¤ten",
    daysAgoLabel: "vergangen",
    todayLabel: "Heute!",
    fieldName: "NAME *",
    fieldEmail: "E-MAIL",
    fieldTable: "TISCH",
    fieldNotes: "NOTIZEN",
    fieldDiet: "ERNÃÂÃÂHRUNG",
    fieldAllergies: "ALLERGIEN",
    fieldNumber: "NUMMER",
    fieldCapacity: "KAPAZITÃÂÃÂT",
    fieldShape: "FORM",
    fieldLabel: "BEZEICHNUNG",
    fieldColor: "FARBE",
    shapeRound: "Rund",
    shapeRect: "Rechteckig",
    notSeated: "Nicht platziert",
    addGuestBtn: "Gast hinzufÃÂÃÂ¼gen",
    createTableBtn: "Tisch erstellen",
    deleteTableBtn: "Tisch lÃÂÃÂ¶schen",
    settingName: "NAME",
    settingDate: "DATUM",
    settingType: "TYP",
  },

  it: {
    appName: "TableMaÃÂÃÂ®tre",
    logout: "Disconnetti",
    lightMode: "Passa alla modalitÃÂÃÂ  chiara",
    darkMode: "Passa alla modalitÃÂÃÂ  scura",
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
    back: "ÃÂ¢ÃÂÃÂ Progetti",
    autoPlace: "ÃÂ¢ÃÂÃÂ¨ Disponi automaticamente",
    placeCards: "ÃÂ°ÃÂÃÂÃÂ¨ Segnaposto",
    floorPlan: "ÃÂ°ÃÂÃÂÃÂ Piano PDF",
    qrCode: "Codice QR",
    tabPlan: "ÃÂ°ÃÂÃÂÃÂº Piano",
    tabGuests: "ÃÂ°ÃÂÃÂÃÂ¥ Ospiti",
    tabFood: "ÃÂ°ÃÂÃÂÃÂ½ Alimentazione",
    tabConstraints: "ÃÂ¢ÃÂÃÂ Vincoli",
    tabRoom: "ÃÂ¢ÃÂ¬ÃÂ¡ Sala",
    addTable: "+ Tavolo",
    addGuest: "+ Ospite",
    dietSummary: "ÃÂ°ÃÂÃÂÃÂ Riepilogo dietetico",
    unseatedList: "ÃÂ¢ÃÂÃÂ  SENZA POSTO",
    seeAvailable: "ÃÂ°ÃÂÃÂÃÂ Vedi posti liberi",
    tablesVisible: "ÃÂ¢ÃÂÃÂ Tavoli evidenziati",
    clickToPlace: "ÃÂ°ÃÂÃÂÃÂ Clicca un tavolo per sistemare",
    undo: "ÃÂ¢ÃÂÃÂ© Annulla",
    search: "Cerca un ospiteÃÂ¢ÃÂÃÂ¦",
    exportCSV: "ÃÂ¢ÃÂ¬ÃÂ Esporta CSV",
    importCSV: "ÃÂ¢ÃÂ¬ÃÂ Importa CSV",
    tableNumber: "NUMERO",
    tableCapacity: "CAPACITÃÂÃÂ",
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
    savedCloud: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Salvato nel cloud",
    savedAuto: "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Salvato automaticamente",
    voucherTitle: "Codice promozionale",
    voucherApplied: "ÃÂ¢ÃÂÃÂ Codice applicato!",
    loading: "CaricamentoÃÂ¢ÃÂÃÂ¦",
    skipToMain: "Vai al contenuto principale",
    note: "ÃÂ°ÃÂÃÂÃÂ",
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
    fieldCapacity: "CAPACITÃÂÃÂ",
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

// DÃÂÃÂ©tecter la langue du navigateur / pays
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

// Drapeaux pour le sÃÂÃÂ©lecteur
const LANG_FLAGS = { fr: 'ÃÂ°ÃÂÃÂÃÂ«ÃÂ°ÃÂÃÂÃÂ·', en: 'ÃÂ°ÃÂÃÂÃÂ¬ÃÂ°ÃÂÃÂÃÂ§', es: 'ÃÂ°ÃÂÃÂÃÂªÃÂ°ÃÂÃÂÃÂ¸', de: 'ÃÂ°ÃÂÃÂÃÂ©ÃÂ°ÃÂÃÂÃÂª', it: 'ÃÂ°ÃÂÃÂÃÂ®ÃÂ°ÃÂÃÂÃÂ¹' };
const LANG_NAMES = { fr: 'FranÃÂÃÂ§ais', en: 'English', es: 'EspaÃÂÃÂ±ol', de: 'Deutsch', it: 'Italiano' };




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
  mariage:      { label: "Mariage",        icon: "ÃÂ°ÃÂÃÂÃÂ", color: "#C9973A", bg: "linear-gradient(135deg,#1a0c08,#2a1a0e)" },
  gala:         { label: "Gala / SoirÃÂÃÂ©e",  icon: "ÃÂ°ÃÂÃÂ¥ÃÂ", color: "#8B7EC8", bg: "linear-gradient(135deg,#0d0a1a,#1a1530)" },
  anniversaire: { label: "Anniversaire",   icon: "ÃÂ°ÃÂÃÂÃÂ", color: "#E8845A", bg: "linear-gradient(135deg,#1a0e08,#2a1810)" },
  conference:   { label: "ConfÃÂÃÂ©rence",     icon: "ÃÂ°ÃÂÃÂÃÂ¤", color: "#4A9B7F", bg: "linear-gradient(135deg,#081a12,#0e2a1e)" },
  bapteme:      { label: "BaptÃÂÃÂªme",        icon: "ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ", color: "#7ABDE8", bg: "linear-gradient(135deg,#081218,#0e1e2a)" },
  loto:         { label: "Loto / Casino",  icon: "ÃÂ°ÃÂÃÂÃÂ°", color: "#E84A6A", bg: "linear-gradient(135deg,#1a0810,#2a0e18)" },
  autre:        { label: "Autre",          icon: "ÃÂ°ÃÂÃÂÃÂ", color: "#C9973A", bg: "linear-gradient(135deg,#120c08,#2a1a0e)" },
};

const DIET_OPTIONS = [
  { id: "standard",     label: "Standard",         icon: "ÃÂ°ÃÂÃÂÃÂ½ÃÂ¯ÃÂ¸ÃÂ", color: C.muted },
  { id: "vegetarien",   label: "VÃÂÃÂ©gÃÂÃÂ©tarien",        icon: "ÃÂ°ÃÂÃÂ¥ÃÂ", color: "#4CAF50" },
  { id: "vegan",        label: "Vegan",             icon: "ÃÂ°ÃÂÃÂÃÂ±", color: "#8BC34A" },
  { id: "sans-gluten",  label: "Sans gluten",       icon: "ÃÂ°ÃÂÃÂÃÂ¾", color: "#FF9800" },
  { id: "halal",        label: "Halal",             icon: "ÃÂ¢ÃÂÃÂªÃÂ¯ÃÂ¸ÃÂ", color: "#2196F3" },
  { id: "casher",       label: "Casher",            icon: "ÃÂ¢ÃÂÃÂ¡ÃÂ¯ÃÂ¸ÃÂ",  color: "#3F51B5" },
  { id: "sans-lactose", label: "Sans lactose",      icon: "ÃÂ°ÃÂÃÂ¥ÃÂ", color: "#9C27B0" },
  { id: "sans-noix",    label: "Allergie noix",     icon: "ÃÂ°ÃÂÃÂ¥ÃÂ", color: "#F44336" },
  { id: "sans-fruits-mer", label: "Allergie fruits de mer", icon: "ÃÂ°ÃÂÃÂ¦ÃÂ", color: "#E91E63" },
  { id: "diabetique",   label: "DiabÃÂÃÂ©tique",        icon: "ÃÂ°ÃÂÃÂÃÂ", color: "#607D8B" },
];

// Auth 100% Firebase Google ÃÂ¢ÃÂÃÂ aucun identifiant stockÃÂÃÂ© dans le code
const INITIAL_USERS = [];

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// PLANS & VOUCHERS
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

const PLANS = {
  free:   { label: "Gratuit", price: 0,    maxEvents: 1,   maxGuests: 30,  color: "#8A7355", icon: "ÃÂ°ÃÂÃÂÃÂ" },
  pro:    { label: "Pro",     price: 9.90, maxEvents: 999, maxGuests: 999, color: "#C9973A", icon: "ÃÂ¢ÃÂ­ÃÂ" },
  agence: { label: "Agence",  price: 29,   maxEvents: 999, maxGuests: 999, color: "#2A1A0e", icon: "ÃÂ°ÃÂÃÂÃÂ¢" },
};

const VOUCHERS = {
  "BIENVENUE":   { discount: 100, type: "percent", plan: "pro", description: "1 mois Pro offert ÃÂ°ÃÂÃÂÃÂ",    maxUses: 999 },
  "MARIAGE2026": { discount: 50,  type: "percent", plan: "pro", description: "-50% sur le plan Pro ÃÂ°ÃÂÃÂÃÂ", maxUses: 100 },
  "PARTENAIRE":  { discount: 30,  type: "percent", plan: "pro", description: "-30% partenaire ÃÂ°ÃÂÃÂ¤ÃÂ",      maxUses: 50  },
  "VIP100":      { discount: 100, type: "percent", plan: "pro", description: "AccÃÂÃÂ¨s VIP gratuit ÃÂ°ÃÂÃÂÃÂ",    maxUses: 10  },
};


const INITIAL_EVENTS = [
  {
    id: 1, ownerId: "u1",
    name: "Mariage Martin ÃÂÃÂ Dubois", date: "2025-09-14", type: "mariage", plan: "pro",
    roomShape: [
      { x: 60, y: 60 }, { x: 740, y: 60 }, { x: 740, y: 520 },
      { x: 450, y: 520 }, { x: 450, y: 380 }, { x: 60, y: 380 }
    ],
    tables: [
      { id: 1, number: 1, capacity: 8,  x: 160, y: 150, shape: "round",  label: "Famille" },
      { id: 2, number: 2, capacity: 10, x: 350, y: 150, shape: "round",  label: "Amis" },
      { id: 3, number: 3, capacity: 6,  x: 550, y: 150, shape: "round",  label: "CollÃÂÃÂ¨gues" },
      { id: 4, number: 4, capacity: 8,  x: 160, y: 290, shape: "round",  label: "Famille" },
    ],
    guests: [
      { id: 1, name: "Marie Martin",    email: "marie@test.com",  tableId: 1, diet: "vegetarien",   notes: "", allergies: [] },
      { id: 2, name: "Jean Dupont",     email: "jean@test.com",   tableId: 1, diet: "standard",     notes: "", allergies: [] },
      { id: 3, name: "Sophie Laurent",  email: "",                tableId: 2, diet: "vegan",         notes: "Allergie noix sÃÂÃÂ©vÃÂÃÂ¨re", allergies: ["sans-noix"] },
      { id: 4, name: "Pierre Moreau",   email: "",                tableId: 2, diet: "halal",         notes: "", allergies: [] },
      { id: 5, name: "Julie Petit",     email: "",                tableId: null, diet: "sans-gluten", notes: "", allergies: [] },
    ],
    constraints: [{ id: 1, a: 1, b: 2, type: "together" }],
    menu: { starter: "VeloutÃÂÃÂ© de butternut", main: "Filet de bÃÂÃÂuf Wellington", dessert: "PiÃÂÃÂ¨ce montÃÂÃÂ©e", vegOption: "Risotto aux champignons" },
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// UTILS
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function dietInfo(id) { return DIET_OPTIONS.find(function(ditem){ return ditem.id === id; }) || DIET_OPTIONS[0]; }

function uid() { return Date.now() + Math.random().toString(36).slice(2); }

function printFloorPlan(ev) {
  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const seated = ev.guests.filter(g => g.tableId);
  const tableRows = ev.tables.map(function(tbl) {
    const guestsSec = ev.guests.filter(g => g.tableId === t.id);
    return `
      <div class="table-block">
        <div class="table-title">Table ${escapeHtml(String(t.number))}${t.label ? ` ÃÂ¢ÃÂÃÂ ${escapeHtml(t.label)}` : ""}</div>
        <div class="table-count">${guestsSec.length}/${t.capacity} places</div>
        <ul class="guest-list">
          ${guestsSec.map(g => {
            const d = DIET_OPTIONS.find(function(ditem){ return ditem.id===g.diet; })||DIET_OPTIONS[0];
            return `<li>${escapeHtml(g.name)}${g.diet!=="standard"?` <span class="diet">${d.icon}</span>`:""}${g.notes?` <span class="note">${escapeHtml(g.notes)}</span>`:""}</li>`;
          }).join("")}
          ${guests.length === 0 ? '<li class="empty">ÃÂ¢ÃÂÃÂ Vide ÃÂ¢ÃÂÃÂ</li>' : ""}
        </ul>
      </div>`;
  }).join("");

  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
  <title>Plan de table ÃÂ¢ÃÂÃÂ ${escapeHtml(ev.name)}</title>
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
    <button onclick="window.print()" style="padding:10px 28px;background:${theme.color};border:none;border-radius:99px;font-family:Georgia;font-size:14px;cursor:pointer;font-weight:700;color:white;">ÃÂ°ÃÂÃÂÃÂ¨ Imprimer / Exporter PDF</button>
  </div>
  <div class="header">
    <h1>${escapeHtml(ev.name)}</h1>
    <p>${escapeHtml(ev.date)} ÃÂÃÂ· ${ev.tables.length} tables ÃÂÃÂ· ${ev.guests.length} invitÃÂÃÂ©s ÃÂÃÂ· ${seated.length} placÃÂÃÂ©s</p>
    ${ev.notes ? `<p style="margin-top:6px;font-style:italic">${escapeHtml(ev.notes)}</p>` : ""}
  </div>
  <div class="stats">
    <span>ÃÂ°ÃÂÃÂªÃÂ ${ev.tables.length} tables</span>
    <span>ÃÂ°ÃÂÃÂÃÂ¤ ${ev.guests.length} invitÃÂÃÂ©s</span>
    <span>ÃÂ¢ÃÂÃÂ ${seated.length} placÃÂÃÂ©s</span>
    <span>ÃÂ¢ÃÂÃÂ  ${ev.guests.length - seated.length} non placÃÂÃÂ©s</span>
  </div>
  <div class="grid">${tableRows}</div>
  <div class="footer">TableMaÃÂÃÂ®tre ÃÂÃÂ· Plan gÃÂÃÂ©nÃÂÃÂ©rÃÂÃÂ© le ${new Date().toLocaleDateString("fr-FR")}</div>
  </body></html>`);
  w.document.close();
}

function exportGuestsCSV(ev) {
  const headers = ["Nom", "Email", "Table", "RÃÂÃÂ©gime", "Allergies", "Notes"];
  const rows = ev.guests.map(g => {
    const table = ev.tables.find(function(tbl2){ return tbl2.id === g.tableId; });
    const diet = dietInfo(g.diet);
    return [
      g.name,
      g.email || "",
      table ? `Table ${table.number}${table.label ? " - " + table.label : ""}` : "Non placÃÂÃÂ©",
      diet.label,
      (g.allergies || []).map(a => dietInfo(a).label).join(" | "),
      g.notes || ""
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["ÃÂ¯ÃÂ»ÃÂ¿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.name.replace(/[^a-z0-9]/gi, "_")}_invitÃÂÃÂ©s.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// SHARED UI COMPONENTS
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

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
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>ÃÂ¢ÃÂÃÂ</button>
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// QR LIB
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

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
  if (!libReady) return <div style={{ width: size, height: size, background: C.mid, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 12 }}>ChargementÃÂ¢ÃÂÃÂ¦</div>;
  return <div ref={ref} style={{ lineHeight: 0, borderRadius: 8, overflow: "hidden" }} />;
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// ROOM SHAPE EDITOR
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

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
          {mode==="draw" ? "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Annuler dessin" : "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Dessiner"}
        </Btn>
        <Btn small variant={mode==="edit"?"primary":"ghost"} onClick={()=>setMode(mode==="edit"?"view":"edit")}>
          {mode==="edit" ? "ÃÂ¢ÃÂÃÂ Terminer" : "ÃÂ¢ÃÂ¦ÃÂ¿ Modifier points"}
        </Btn>
        <div style={{width:1,height:20,background:C.border}}/>
        <span style={{color:C.muted,fontSize:12}}>PrÃÂÃÂ©sets :</span>
        <Btn small variant="muted" onClick={presetRectangle}>ÃÂ¢ÃÂÃÂ­ Rect</Btn>
        <Btn small variant="muted" onClick={presetL}>ÃÂ¢ÃÂÃÂ L</Btn>
        <Btn small variant="muted" onClick={presetU}>U</Btn>
        <Btn small variant="muted" onClick={presetHex}>ÃÂ¢ÃÂ¬ÃÂ¡ Hex</Btn>
      </div>

      {mode === "draw" && (
        <div style={{background:C.gold+"18",border:`1px solid ${C.gold}44`,borderRadius:8,padding:"8px 14px",marginBottom:10,fontSize:12,color:C.gold}}>
          Cliquez pour ajouter des points ÃÂÃÂ· Cliquez prÃÂÃÂ¨s du premier point pour fermer la forme ({drawing.length} points placÃÂÃÂ©s)
        </div>
      )}
      {mode === "edit" && (
        <div style={{background:C.blue+"18",border:`1px solid ${C.blue}44`,borderRadius:8,padding:"8px 14px",marginBottom:10,fontSize:12,color:C.blue}}>
          Glissez les points dorÃÂÃÂ©s pour modifier la forme de la salle
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// INTERACTIVE FLOOR PLAN
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

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
      aria-label={`Plan de table de l'ÃÂÃÂ©vÃÂÃÂ©nement. ${ev.tables.length} tables, ${ev.guests.filter(g=>g.tableId).length} invitÃÂÃÂ©s placÃÂÃÂ©s sur ${ev.guests.length} au total.`}
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
            <title>{`Table ${tbl.number}${tbl.label ? " ÃÂ¢ÃÂÃÂ " + tbl.label : ""}
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// PLACE CARD (CHEVALET) PRINT
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

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
            <div class="ornament top">ÃÂ¢ÃÂÃÂ¦ ÃÂ¢ÃÂÃÂ¦ ÃÂ¢ÃÂÃÂ¦</div>
            <div class="event-name">${ev.name}</div>
            <div class="guest-name">${g.name}</div>
            ${g.diet !== "standard" ? `<div class="diet-badge">${diet.icon} ${diet.label}</div>` : ""}
            <div class="table-info">Table ${table?.number || "?"}</div>
            ${table?.label ? `<div class="table-label">${table.label}</div>` : ""}
            <div class="ornament bottom">ÃÂ¢ÃÂÃÂ ${ev.date} ÃÂ¢ÃÂÃÂ</div>
          </div>
          <!-- Back (pliÃÂÃÂ©) -->
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
  <title>Chevalets ÃÂ¢ÃÂÃÂ ${ev.name}</title>
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
    /* Le chevalet = carte A6 pliÃÂÃÂ©e en deux */
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
    <h1>Chevalets ÃÂ¢ÃÂÃÂ ${ev.name}</h1>
    <p>Imprimez cette page et dÃÂÃÂ©coupez les chevalets</p>
  </div>
  <div class="no-print stats">${guests.length} chevalets ÃÂÃÂ· ${ev.date}</div>
  <div class="no-print" style="text-align:center;margin-bottom:20px">
    <button onclick="window.print()" style="padding:10px 28px;background:${accentColor};border:none;border-radius:99px;font-family:Georgia;font-size:14px;cursor:pointer;font-weight:700">ÃÂ°ÃÂÃÂÃÂ¨ Imprimer</button>
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// DIET SUMMARY PRINT
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

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
          return `${g.name}${t ? ` (T.${t.number})` : ' (non placÃÂÃÂ©)'}`;
        }).join(", ")}</td>
      </tr>
    `;
  }).join("");

  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
    <title>Contraintes alimentaires ÃÂ¢ÃÂÃÂ ${ev.name}</title>
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
    <p>${ev.name} ÃÂÃÂ· ${ev.date} ÃÂÃÂ· ${ev.guests.length} invitÃÂÃÂ©s</p>
    <div style="margin-bottom:16px"><button onclick="window.print()" style="padding:8px 20px;background:#C9973A;border:none;border-radius:99px;cursor:pointer;font-family:Georgia">ÃÂ°ÃÂÃÂÃÂ¨ Imprimer</button></div>
    <table>
      <thead><tr><th>RÃÂÃÂ©gime</th><th>Nb</th><th>InvitÃÂÃÂ©s</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body></html>`);
  w.document.close();
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// LOGIN SCREEN
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function LoginScreen({ onLogin, t: tProp }) {
  const { t: tHook, lang, setLang } = useI18n();
  const t = tProp || tHook;
  const [hovered, setHovered] = useState(null);

  const FEATURES = [
    { icon:"ÃÂ°ÃÂÃÂÃÂº", title:"Plan de salle interactif", desc:"Glissez-dÃÂÃÂ©posez vos tables, zones et mobilier sur un canvas intuitif." },
    { icon:"ÃÂ°ÃÂÃÂÃÂ", title:"RSVP & invitations", desc:"Suivez les confirmations en temps rÃÂÃÂ©el. Lien de confirmation automatique." },
    { icon:"ÃÂ°ÃÂÃÂÃÂ°", title:"Suivi de budget", desc:"Estimez, comparez et maÃÂÃÂ®trisez chaque poste de dÃÂÃÂ©pense." },
    { icon:"ÃÂ°ÃÂÃÂ¤ÃÂ", title:"IA proactive", desc:"Un assistant contextuel qui analyse votre ÃÂÃÂ©vÃÂÃÂ©nement et vous guide." },
    { icon:"ÃÂ°ÃÂÃÂÃÂ", title:"RÃÂÃÂ©troplanning", desc:"TÃÂÃÂ¢ches, prioritÃÂÃÂ©s, responsables ÃÂ¢ÃÂÃÂ organisez chaque ÃÂÃÂ©tape du J-90 au Jour J." },
    { icon:"ÃÂ°ÃÂÃÂÃÂ¨", title:"Exports premium", desc:"Chevalets imprimables, PDF plan de table, QR code invitÃÂÃÂ©s." },
  ];

  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 10%, #2a1a0e 0%, ${C.dark} 60%)`, fontFamily:"Georgia,'Palatino Linotype',serif", color:C.cream, overflowX:"hidden" }}>
      {/* Orbes dÃÂÃÂ©co */}
      {[...Array(4)].map((_,i)=>(
        <div key={i} style={{ position:"fixed", borderRadius:"50%", border:`1px solid ${C.gold}${["12","0c","08","05"][i]}`, width:300+i*220, height:300+i*220, top:"30%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none", zIndex:0 }}/>
      ))}

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:C.card+"ee", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, padding:"0 40px", height:60, display:"flex", alignItems:"center" }}>
        <span style={{ fontSize:18, color:C.gold, letterSpacing:2, fontWeight:400 }}>ÃÂ°ÃÂÃÂªÃÂ TableMaÃÂÃÂ®tre</span>
        <div style={{ flex:1 }}/>
        {/* SÃÂ©lecteur de langue */}
        <div style={{ display:"flex", gap:4, marginRight:16 }}>
          {Object.entries(LANG_FLAGS).map(([lk, flag]) => (
            <button key={lk} onClick={()=>setLang(lk)} title={LANG_NAMES[lk]} style={{
              background: lang===lk ? C.gold+"33" : "transparent",
              border: lang===lk ? "1px solid "+C.gold : "1px solid transparent",
              borderRadius:6, padding:"2px 6px", cursor:"pointer", fontSize:16,
              transition:"all .2s",
            }}>
              {flag}
            </button>
          ))}
        </div>
        <button onClick={onLogin} style={{ padding:"8px 22px", background:C.gold, border:"none", borderRadius:99, cursor:"pointer", color:C.dark, fontWeight:700, fontSize:13, fontFamily:"inherit", letterSpacing:.5 }}>
          Se connecter ÃÂ¢ÃÂÃÂ
        </button>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", zIndex:1, maxWidth:800, margin:"0 auto", textAlign:"center", padding:"100px 24px 80px" }}>
        <div style={{ display:"inline-block", background:C.gold+"22", border:`1px solid ${C.gold}44`, borderRadius:99, padding:"6px 18px", fontSize:11, color:C.gold, letterSpacing:2, marginBottom:28 }}>
          ÃÂ¢ÃÂÃÂ¦ ORGANISEZ. PLACEZ. IMPRESSIONNEZ. ÃÂ¢ÃÂÃÂ¦
        </div>
        <h1 style={{ fontSize:"clamp(36px,6vw,72px)", fontWeight:400, margin:"0 0 24px", lineHeight:1.1, letterSpacing:1 }}>
          Le plan de table<br/>
          <span style={{ color:C.gold, fontStyle:"italic" }}>qui fait tout</span>
        </h1>
        <p style={{ fontSize:18, color:C.muted, maxWidth:520, margin:"0 auto 48px", lineHeight:1.7 }}>
          De l'invitation ÃÂÃÂ  la salle, gÃÂÃÂ©rez chaque dÃÂÃÂ©tail de votre ÃÂÃÂ©vÃÂÃÂ©nement depuis une seule application ÃÂÃÂ©lÃÂÃÂ©gante.
        </p>
        <button onClick={onLogin} style={{
          display:"inline-flex", alignItems:"center", gap:14, padding:"18px 40px",
          background:`linear-gradient(135deg, ${C.gold}, #E8C46A)`, border:"none", borderRadius:99,
          cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:700, color:C.dark, fontSize:16, letterSpacing:.5,
          boxShadow:`0 8px 32px ${C.gold}44`, transition:"transform .15s, box-shadow .15s",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 12px 40px ${C.gold}66`; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 8px 32px ${C.gold}44`; }}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#1a0e08" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" opacity=".4"/>
            <path fill="#1a0e08" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" opacity=".4"/>
            <path fill="#1a0e08" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.7 39.6 16.3 44 24 44z" opacity=".4"/>
            <path fill="#1a0e08" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.7l6.2 5.2C41.1 36.2 44 30.6 44 24c0-1.3-.1-2.6-.4-3.9z" opacity=".4"/>
          </svg>
          Commencer gratuitement avec Google
        </button>
        <p style={{ color:C.muted, fontSize:12, marginTop:16 }}>Gratuit ÃÂÃÂ· Sans carte bancaire ÃÂÃÂ· SynchronisÃÂÃÂ© cloud</p>
      </div>

      {/* FEATURES GRID */}
      <div style={{ maxWidth:960, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <h2 style={{ fontSize:28, fontWeight:400, letterSpacing:1, margin:"0 0 12px" }}>Tout ce dont vous avez besoin</h2>
          <p style={{ color:C.muted, fontSize:14 }}>De la liste d'invitÃÂÃÂ©s au plan de salle, en passant par le budget et les prestataires.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
          {FEATURES.map((f,i)=>(
            <div key={i}
              onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
              style={{ background:hovered===i?C.mid:C.card, border:`1px solid ${hovered===i?C.gold+"44":C.border}`, borderRadius:16, padding:"28px 24px", transition:"all .2s", cursor:"default" }}>
              <div style={{ fontSize:32, marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ color:hovered===i?C.gold:C.cream, fontSize:16, fontWeight:400, margin:"0 0 8px", transition:"color .2s" }}>{f.title}</h3>
              <p style={{ color:C.muted, fontSize:13, margin:0, lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials / stats */}
        <div style={{ marginTop:80, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, textAlign:"center" }}>
          {[["ÃÂ¢ÃÂÃÂ","ÃÂÃÂvÃÂÃÂ©nements supportÃÂÃÂ©s"],["5","Langues disponibles"],["ÃÂ°ÃÂÃÂ¤ÃÂ","IA intÃÂÃÂ©grÃÂÃÂ©e"]].map(([v,l])=>(
            <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"32px 20px" }}>
              <div style={{ fontSize:36, color:C.gold, fontWeight:700, marginBottom:8 }}>{v}</div>
              <div style={{ color:C.muted, fontSize:13 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div style={{ marginTop:80, textAlign:"center", background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:"60px 40px" }}>
          <h2 style={{ fontSize:28, fontWeight:400, margin:"0 0 16px" }}>PrÃÂÃÂªt ÃÂÃÂ  organiser votre ÃÂÃÂ©vÃÂÃÂ©nement ?</h2>
          <p style={{ color:C.muted, fontSize:14, marginBottom:36 }}>Rejoignez les organisateurs qui font confiance ÃÂÃÂ  TableMaÃÂÃÂ®tre.</p>
          <button onClick={onLogin} style={{
            display:"inline-flex", alignItems:"center", gap:12, padding:"16px 36px",
            background:`linear-gradient(135deg,${C.gold},#E8C46A)`, border:"none", borderRadius:99,
            cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:700, color:C.dark, fontSize:15,
            boxShadow:`0 8px 24px ${C.gold}44`,
          }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#1a0e08" opacity=".5" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/></svg>
            Se connecter avec Google ÃÂ¢ÃÂÃÂ c'est gratuit
          </button>
        </div>

        <p style={{ textAlign:"center", color:C.muted+"66", fontSize:11, marginTop:40 }}>
          ÃÂÃÂ© {new Date().getFullYear()} TableMaÃÂÃÂ®tre ÃÂÃÂ· PropulsÃÂÃÂ© par Anthropic Claude IA
        </p>
      </div>
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
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:C.cream }}>
      {/* Nav */}
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:20, color:C.gold, letterSpacing:1 }}>ÃÂ°ÃÂÃÂªÃÂ TableMaÃÂÃÂ®tre</span>
        <Badge color={C.red} style={{marginLeft:10}}>Super Admin</Badge>
        <div style={{flex:1}}/>
        {[["projects","ÃÂ°ÃÂÃÂÃÂ Projets"],["users","ÃÂ°ÃÂÃÂÃÂ¥ Utilisateurs"],["stats","ÃÂ°ÃÂÃÂÃÂ Stats"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            background:tab===t?C.gold+"22":"none", border:"none", color:tab===t?C.gold:C.muted,
            padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          }}>{l}</button>
        ))}
        <div style={{width:1,height:24,background:C.border,margin:"0 12px"}}/>
        <Btn variant="muted" small onClick={onLogout}>DÃÂÃÂ©connexion</Btn>
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
                      <span>ÃÂ°ÃÂÃÂªÃÂ {ev.tables.length} tables</span>
                      <span>ÃÂ°ÃÂÃÂÃÂ¤ {ev.guests.length} invitÃÂÃÂ©s</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:24,height:24,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:10,fontWeight:700 }}>
                        {owner?.avatar||"?"}
                      </div>
                      <span style={{ color:C.muted, fontSize:12 }}>{owner?.name||"Sans propriÃÂÃÂ©taire"}</span>
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
                { label:"Projets total", val:events.length, icon:"ÃÂ°ÃÂÃÂÃÂ", color:C.gold },
                { label:"Utilisateurs", val:users.length, icon:"ÃÂ°ÃÂÃÂÃÂ¥", color:C.blue },
                { label:"InvitÃÂÃÂ©s total", val:events.reduce((s,e)=>s+e.guests.length,0), icon:"ÃÂ°ÃÂÃÂÃÂ¤", color:C.green },
                { label:"Tables", val:events.reduce((s,e)=>s+e.tables.length,0), icon:"ÃÂ°ÃÂÃÂªÃÂ", color:C.gold },
                { label:"Projets Pro", val:events.filter(e=>e.plan==="pro").length, icon:"ÃÂ¢ÃÂ­ÃÂ", color:"#E8845A" },
                { label:"Projets Free", val:events.filter(e=>e.plan==="free").length, icon:"ÃÂ°ÃÂÃÂÃÂ", color:C.muted },
              ].map(s => (
                <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 24px" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <h3 style={{ color:C.gold, margin:"0 0 16px", fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Codes promotionnels actifs</h3>
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
      <Modal open={showNewProject} onClose={()=>setShowNewProject(false)} title="CrÃÂÃÂ©er un nouveau projet">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÃÂÃÂVÃÂÃÂNEMENT *">
            <Input value={newProject.name} onChange={e=>setNewProject({...newProject,name:e.target.value})} placeholder="Mariage Dupont ÃÂÃÂ Martin"/>
          </Field>
          <Field label={t.settingDate}>
            <Input type="date" value={newProject.date} onChange={e=>setNewProject({...newProject,date:e.target.value})}/>
          </Field>
          <Field label="TYPE D'ÃÂÃÂVÃÂÃÂNEMENT">
            <Select value={newProject.type} onChange={e=>setNewProject({...newProject,type:e.target.value})}>
              {Object.entries(THEMES_CONFIG).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </Select>
          </Field>
          <Field label="ASSIGNER ÃÂÃÂ UN ADMIN">
            <Select value={newProject.adminId} onChange={e=>setNewProject({...newProject,adminId:e.target.value})}>
              <option value="">ÃÂ¢ÃÂÃÂ Sans propriÃÂÃÂ©taire ÃÂ¢ÃÂÃÂ</option>
              {users.filter(u=>u.role==="admin").map(u=><option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </Select>
          </Field>
          <Btn onClick={createProject} style={{marginTop:8}}>CrÃÂÃÂ©er le projet</Btn>
        </div>
      </Modal>

      {/* Modal new user */}
      <Modal open={showNewUser} onClose={()=>setShowNewUser(false)} title="CrÃÂÃÂ©er un utilisateur">
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
          <Field label="RÃÂÃÂLE">
            <Select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
              <option value="admin">Admin Projet</option>
              <option value="superadmin">Super Admin</option>
            </Select>
          </Field>
          <Btn onClick={createUser} style={{marginTop:8}}>CrÃÂÃÂ©er l'utilisateur</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// GUEST FORM (QR landing)
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function GuestForm({ event, onBack }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", email:"", diet:"standard", notes:"", plus1:false, allergies:[] });
  const [done, setDone] = useState(false);

  const toggleAllergy = (id) => {
    setForm(f=>({ ...f, allergies: f.allergies.includes(id)?f.allergies.filter(x=>x!==id):[...f.allergies,id] }));
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:C.dark, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center", color:C.cream, padding:20 }}>
        <div style={{ fontSize:64 }}>ÃÂ°ÃÂÃÂÃÂ</div>
        <h2 style={{ fontFamily:"Georgia,serif", color:C.gold, fontSize:28, fontWeight:400 }}>Merci !</h2>
        <p style={{ color:C.muted }}>Vos prÃÂÃÂ©fÃÂÃÂ©rences ont ÃÂÃÂ©tÃÂÃÂ© enregistrÃÂÃÂ©es<br/>pour <strong style={{ color:C.cream }}>{event.name}</strong></p>
        <Btn onClick={onBack} style={{ marginTop:24 }}>Retour ÃÂÃÂ  l'accueil</Btn>
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
          <p style={{ color:C.muted, fontSize:13, margin:0 }}>Merci de renseigner vos prÃÂÃÂ©fÃÂÃÂ©rences</p>
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
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd` }} placeholder="PrÃÂÃÂ©nom Nom"/>
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
              Continuer ÃÂ¢ÃÂÃÂ
            </Btn>
          </div>
        )}

        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="RÃÂÃÂGIME ALIMENTAIRE">
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
            <Field label="ALLERGIES SPÃÂÃÂCIFIQUES">
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
            <Field label="NOTES / PRÃÂÃÂCISIONS">
              <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3}
                placeholder="MobilitÃÂÃÂ© rÃÂÃÂ©duite, allergie sÃÂÃÂ©vÃÂÃÂ¨re, poussette..."
                style={{ ...inputStyle, background:"#fff", color:C.dark, border:`1px solid #ddd`, resize:"vertical" }}/>
            </Field>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="muted" onClick={()=>setStep(0)} style={{ flex:1 }}>ÃÂ¢ÃÂÃÂ Retour</Btn>
              <Btn onClick={()=>setDone(true)} style={{ flex:2, padding:14 }}>Confirmer ÃÂ¢ÃÂÃÂ</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// EVENT EDITOR
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function EventEditor({ ev, onUpdate, onBack, saveToast, t: tProp }) {
  const { t: tHook } = useI18n();
  const t = tProp || tHook;
  const [tab, setTab] = useState("plan");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showAddFurniture, setShowAddFurniture] = useState(false);
  const [newZone, setNewZone] = useState({ label:"", icon:"ÃÂ°ÃÂÃÂÃÂ", color:"#C9973A" });
  const [newFurniture, setNewFurniture] = useState({ label:"", icon:"ÃÂ°ÃÂÃÂªÃÂ", color:"#8A7355", width:80, height:40 });
  const [planSubTab, setPlanSubTab] = useState("tables");
  const [showConstraint, setShowConstraint] = useState(false);
  // IA proactive
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [aiAssistMsg, setAiAssistMsg] = useState("");
  const [aiAssistHistory, setAiAssistHistory] = useState([]);
  const [aiAssistLoading, setAiAssistLoading] = useState(false);
  // Budget
  const BUDGET_CATEGORIES = [
    {id:"salle",label:"Salle / Lieu",icon:"ÃÂ°ÃÂÃÂÃÂ"},
    {id:"traiteur",label:"Traiteur",icon:"ÃÂ°ÃÂÃÂÃÂ½"},
    {id:"boissons",label:"Boissons",icon:"ÃÂ°ÃÂÃÂÃÂ·"},
    {id:"musique",label:"Musique / DJ",icon:"ÃÂ°ÃÂÃÂÃÂµ"},
    {id:"fleurs",label:"Fleurs / DÃÂÃÂ©co",icon:"ÃÂ°ÃÂÃÂÃÂ"},
    {id:"photo",label:"Photo / VidÃÂÃÂ©o",icon:"ÃÂ°ÃÂÃÂÃÂ¸"},
    {id:"transport",label:"Transport",icon:"ÃÂ°ÃÂÃÂÃÂ"},
    {id:"tenues",label:"Tenues",icon:"ÃÂ°ÃÂÃÂÃÂ"},
    {id:"invitations",label:"Invitations",icon:"ÃÂ°ÃÂÃÂÃÂ"},
    {id:"divers",label:"Divers",icon:"ÃÂ°ÃÂÃÂÃÂ¦"},
  ];
  const [newBudgetLine, setNewBudgetLine] = useState({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""});
  const [showAddBudget, setShowAddBudget] = useState(false);
  // Planning
  const [newTask, setNewTask] = useState({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});
  const [showAddTask, setShowAddTask] = useState(false);
  // Programme
  const [newProgramItem, setNewProgramItem] = useState({time:"",label:"",icon:"ÃÂ°ÃÂÃÂÃÂ¤",notes:""});
  const [showAddProgramItem, setShowAddProgramItem] = useState(false);
  const [newSupplier, setNewSupplier] = useState({name:"",role:"",phone:"",email:"",notes:""});
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newGuest, setNewGuest] = useState({ name:"", email:"", diet:"standard", notes:"", allergies:[] });
  const [newTable, setNewTable] = useState({ number:"", capacity:8, shape:"round", label:"" });
  // Auto-numÃÂÃÂ©rotation
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
InvitÃÂÃÂ©s: ${JSON.stringify(context.guests)}
Contraintes: ${JSON.stringify(context.constraints)}
Assigne chaque invitÃÂÃÂ© ÃÂÃÂ  une table en respectant la capacitÃÂÃÂ© max, les contraintes ensemble/sÃÂÃÂ©parÃÂÃÂ©s, et en regroupant les rÃÂÃÂ©gimes alimentaires similaires.
RÃÂÃÂ©ponds UNIQUEMENT en JSON valide avec ce format exact:
{"assignments": [{"guestId": "id_ici", "tableId": "id_table_ici"}], "explanation": "explication courte en franÃÂÃÂ§ais de tes choix"}`;
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
      setAiExplanation(result.explanation || "Placement optimisÃÂÃÂ© !");
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
    const context = `Tu es un assistant expert en organisation d'ÃÂÃÂ©vÃÂÃÂ©nements intÃÂÃÂ©grÃÂÃÂ© ÃÂÃÂ  l'app TableMaÃÂÃÂ®tre.
ÃÂÃÂvÃÂÃÂ©nement : "${ev.name}" (${ev.type}, le ${ev.date||"date non dÃÂÃÂ©finie"})${daysLeft!==null?`, dans ${daysLeft} jours`:""}
InvitÃÂÃÂ©s : ${ev.guests.length} total ÃÂ¢ÃÂÃÂ ${rsvpC} confirmÃÂÃÂ©s, ${rsvpP} en attente
Tables : ${ev.tables.length}, places assises : ${ev.guests.filter(g=>g.tableId).length}/${ev.guests.length}
Budget : estimÃÂÃÂ© ${budgTot}ÃÂ¢ÃÂÃÂ¬, rÃÂÃÂ©el ${budgReal}ÃÂ¢ÃÂÃÂ¬ (${(ev.budget||[]).length} postes)
Planning : ${planDone}/${planTot} tÃÂÃÂ¢ches faites
Prestataires : ${(ev.suppliers||[]).length}
Programme : ${(ev.programme||[]).length} ÃÂÃÂ©tapes
RÃÂÃÂ©ponds en franÃÂÃÂ§ais, de faÃÂÃÂ§on concrÃÂÃÂ¨te, bienveillante et proactive. Max 3 paragraphes courts.`;
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
      const reply = (data.content&&data.content[0]&&data.content[0].text)||"DÃÂÃÂ©solÃÂÃÂ©, je n'ai pas pu rÃÂÃÂ©pondre.";
      setAiAssistHistory(h=>[...h,{role:"assistant",content:reply}]);
    } catch(e) {
      setAiAssistHistory(h=>[...h,{role:"assistant",content:"ÃÂ¢ÃÂÃÂ IA temporairement indisponible."}]);
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
    {id:"plan",         icon:"ÃÂ°ÃÂÃÂÃÂº",  label: t ? t.tabPlan.replace(/^\S+\s/,"") : "Plan"},
    {id:"list",         icon:"ÃÂ°ÃÂÃÂÃÂ",  label:"Liste"},
    {id:"guests",       icon:"ÃÂ°ÃÂÃÂÃÂ¥",  label:`${t ? t.tabGuests.replace(/^\S+\s/,"") : "Guests"} (${ev.guests.length})`},
    {id:"rsvp",         icon:"ÃÂ°ÃÂÃÂÃÂ",  label:`RSVP${rsvpPending>0?" ("+rsvpPending+"ÃÂ¢ÃÂÃÂ³)":""}`},
    {id:"budget",       icon:"ÃÂ°ÃÂÃÂÃÂ°",  label:"Budget"},
    {id:"planning",     icon:"ÃÂ°ÃÂÃÂÃÂ",  label:`Planning${planningTotal>0?" ("+planningDone+"/"+planningTotal+")":""}`},
    {id:"programme",    icon:"ÃÂ°ÃÂÃÂÃÂµ",  label:"Programme"},
    {id:"diet",         icon:"ÃÂ°ÃÂÃÂÃÂ½ÃÂ¯ÃÂ¸ÃÂ",  label: t ? t.tabFood.replace(/^\S+\s/,"") : "Dietary"},
    {id:"constraints",  icon:"ÃÂ¢ÃÂÃÂ",  label: t ? t.tabConstraints.replace(/^\S+\s/,"") : "Constraints"},
    {id:"logistique",   icon:"ÃÂ°ÃÂÃÂÃÂ",  label:"Logistique"},
  ];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},#1a0e08)`, fontFamily:"Georgia,serif", color:C.cream }}>
      {/* Header ÃÂÃÂ©purÃÂÃÂ© */}
      <div style={{ background:C.card+"f8", backdropFilter:"blur(10px)", borderBottom:`1px solid ${C.border}`, padding:"0 20px", display:"flex", alignItems:"center", height:54, position:"sticky", top:0, zIndex:100, gap:10 }}>
        {/* Retour + titre */}
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,padding:"6px 0",whiteSpace:"nowrap" }}>
          ÃÂ¢ÃÂÃÂ <span style={{display:"none"}}>{t.back}</span>
        </button>
        <div style={{ width:1, height:24, background:C.border }}/>
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
          <div style={{ width:30,height:30,borderRadius:8,background:theme.color+"22",border:`1px solid ${theme.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{theme.icon}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ color:C.cream, fontSize:14, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.name}</div>
            <div style={{ color:theme.color, fontSize:10, letterSpacing:.5 }}>
              {theme.label}
              {ev.date && (() => {
                const d = Math.ceil((new Date(ev.date)-new Date())/86400000);
                return d>=0 ? <span style={{color:d<=7?C.red:d<=30?"#E8845A":C.muted, marginLeft:8}}>ÃÂÃÂ· JÃÂ¢ÃÂÃÂ{d}</span> : <span style={{color:C.muted,marginLeft:8}}>ÃÂÃÂ· passÃÂÃÂ©</span>;
              })()}
            </div>
          </div>
        </div>
        {/* Groupe Partage */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button onClick={()=>setShowQR(true)} style={{ background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:12,padding:"6px 10px",fontFamily:"inherit" }}>ÃÂ°ÃÂÃÂÃÂ± QR</button>
          <button onClick={()=>{ var fb=getFirebase(); var uid=fb&&fb.auth&&fb.auth.currentUser?fb.auth.currentUser.uid:""; var joinParam=uid?uid+"___"+ev.id:ev.id; var url=window.location.origin+"/?join="+joinParam; if(navigator.share){navigator.share({title:ev.name,url}).catch(()=>navigator.clipboard.writeText(url));}else{navigator.clipboard.writeText(url);} }}
            style={{ background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:12,padding:"6px 10px",fontFamily:"inherit" }}>ÃÂ°ÃÂÃÂÃÂ</button>
        </div>
        <div style={{ width:1, height:24, background:C.border }}/>
        {/* Groupe Actions */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button onClick={()=>printPlaceCards(ev)} style={{ background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:8,color:C.green,cursor:"pointer",fontSize:12,padding:"6px 12px",fontFamily:"inherit",fontWeight:600 }}>ÃÂ°ÃÂÃÂÃÂ¨ Chevalets</button>
          <button onClick={()=>printFloorPlan(ev)} style={{ background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:12,padding:"6px 10px",fontFamily:"inherit" }}>ÃÂ°ÃÂÃÂÃÂ PDF</button>
          <button onClick={autoPlace} disabled={aiPlacing} style={{ background:aiPlacing?"none":C.gold,border:`1px solid ${aiPlacing?C.border:C.gold}`,borderRadius:8,color:aiPlacing?C.muted:C.dark,cursor:"pointer",fontSize:12,padding:"6px 12px",fontFamily:"inherit",fontWeight:700,opacity:aiPlacing?.7:1 }}>
            {aiPlacing?"ÃÂ¢ÃÂÃÂ³ IAÃÂ¢ÃÂÃÂ¦":"ÃÂ¢ÃÂÃÂ¨ Auto-placer"}
          </button>
          <button onClick={()=>setAiAssistOpen(o=>!o)} style={{ background:aiAssistOpen?C.gold+"33":"none",border:`1px solid ${aiAssistOpen?C.gold:C.border}`,borderRadius:8,color:aiAssistOpen?C.gold:C.muted,cursor:"pointer",fontSize:12,padding:"6px 10px",fontFamily:"inherit" }}>ÃÂ°ÃÂÃÂ¤ÃÂ</button>
          <button onClick={()=>setShowSettings(true)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,padding:"6px" }}>ÃÂ¢ÃÂÃÂ</button>
        </div>
      </div>

      {/* Notes bar */}
      {ev.notes && (
        <div style={{ background:C.gold+"11", borderBottom:`1px solid ${C.gold}22`, padding:"6px 24px", fontSize:12, color:C.muted, fontStyle:"italic" }}>
          ÃÂ°ÃÂÃÂÃÂ {ev.notes}
        </div>
      )}
      {/* Stats bar ÃÂ¢ÃÂÃÂ KPIs */}
      <div style={{ background:C.mid+"44", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", gap:0, overflowX:"auto" }}>
        {[
          {label:t.statTables, val:ev.tables.length, color:C.gold, icon:"ÃÂ°ÃÂÃÂªÃÂ"},
          {label:t.statGuests, val:ev.guests.length, color:C.gold, icon:"ÃÂ°ÃÂÃÂÃÂ¥"},
          {label:t.statSeated, val:seated.length, color:C.green, icon:"ÃÂ¢ÃÂÃÂ"},
          {label:t.statWaiting, val:unseated.length, color:unseated.length>0?C.red:C.green, icon:unseated.length>0?"ÃÂ¢ÃÂÃÂ ":"ÃÂ¢ÃÂÃÂ"},
          {label:"RSVP ÃÂ¢ÃÂÃÂ", val:ev.guests.filter(g=>g.rsvp==="confirmed").length, color:C.green, icon:"ÃÂ°ÃÂÃÂÃÂ"},
          {label:t.statDiets, val:dietStats.reduce((s,d)=>s+d.count,0), color:C.blue, icon:"ÃÂ°ÃÂÃÂÃÂ½"},
        ].map(s=>(
          <div key={s.label} style={{ textAlign:"center", padding:"10px 20px", borderRight:`1px solid ${C.border}`, minWidth:80 }}>
            <div style={{ fontSize:17, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:9, color:C.muted, letterSpacing:.5, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
        {ev.date && (() => {
          const d = Math.ceil((new Date(ev.date)-new Date())/86400000);
          return (
            <div style={{ textAlign:"center", padding:"10px 20px", marginLeft:"auto" }}>
              <div style={{ fontSize:17, fontWeight:700, color:d<=0?C.muted:d<=7?C.red:d<=30?"#E8845A":C.gold }}>
                {d<=0?"PassÃÂÃÂ©":d===0?"Auj.":"JÃÂ¢ÃÂÃÂ"+d}
              </div>
              <div style={{ fontSize:9, color:C.muted, letterSpacing:.5, marginTop:2 }}>COMPTE ÃÂÃÂ REBOURS</div>
            </div>
          );
        })()}
      </div>

      {/* Tab bar */}
      <div style={{ background:C.card+"dd", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", gap:0, overflowX:"auto" }}>
        {TABS.map(tabItem=>(
          <button key={tabItem.id} onClick={()=>setTab(tabItem.id)} style={{
            background:"none", border:"none", borderBottom:`2px solid ${tab===tabItem.id?C.gold:"transparent"}`,
            color:tab===tabItem.id?C.gold:C.muted, padding:"14px 18px",
            cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:tab===tabItem.id?700:400, whiteSpace:"nowrap",
          }}>{tabItem.icon} {tabItem.label}</button>
        ))}
      </div>

      {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ AI ASSISTANT PANEL ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
      {aiAssistOpen && (
        <div style={{ position:"fixed", bottom:24, right:24, width:380, maxHeight:520, zIndex:200, display:"flex", flexDirection:"column", background:C.card, border:`1px solid ${C.gold}44`, borderRadius:20, boxShadow:"0 8px 40px #00000066", overflow:"hidden" }}>
          <div style={{ background:C.gold+"22", borderBottom:`1px solid ${C.gold}33`, padding:"14px 18px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>ÃÂ°ÃÂÃÂ¤ÃÂ</span>
            <div style={{ flex:1 }}>
              <div style={{ color:C.gold, fontSize:14, fontWeight:700 }}>Assistant IA</div>
              <div style={{ color:C.muted, fontSize:11 }}>Votre conseiller pour {ev.name}</div>
            </div>
            {aiAssistHistory.length===0 && (
              <button onClick={()=>sendAiAssist("Fais-moi un bilan rapide de l'ÃÂÃÂ©tat de mon ÃÂÃÂ©vÃÂÃÂ©nement et dis-moi ce qui est urgent.")}
                style={{ background:C.gold+"22", border:`1px solid ${C.gold}44`, borderRadius:8, padding:"4px 10px", cursor:"pointer", color:C.gold, fontSize:11, fontFamily:"inherit" }}>
                ÃÂ¢ÃÂÃÂ¨ Bilan auto
              </button>
            )}
            <button onClick={()=>setAiAssistOpen(false)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18 }}>ÃÂ¢ÃÂÃÂ</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, minHeight:200, maxHeight:340 }}>
            {aiAssistHistory.length===0 && (
              <div style={{ color:C.muted, fontSize:12, textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>ÃÂ°ÃÂÃÂÃÂ¬</div>
                Posez-moi une question sur votre ÃÂÃÂ©vÃÂÃÂ©nement ou demandez un bilan rapide !
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:14 }}>
                  {["Qu'est-ce qui est urgent ÃÂÃÂ  faire ?","Comment optimiser mon budget ?","Qui n'a pas encore rÃÂÃÂ©pondu ?","GÃÂÃÂ©nÃÂÃÂ¨re-moi un planning type"].map(q=>(
                    <button key={q} onClick={()=>sendAiAssist(q)} style={{
                      background:C.mid, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px",
                      color:C.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit", textAlign:"left",
                    }}>ÃÂ¢ÃÂÃÂ {q}</button>
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
                  padding:"8px 14px", maxWidth:"90%", fontSize:12, color:C.cream, lineHeight:1.6,
                  whiteSpace:"pre-wrap",
                }}>{msg.content}</div>
              </div>
            ))}
            {aiAssistLoading && (
              <div style={{ color:C.muted, fontSize:12, fontStyle:"italic" }}>ÃÂ°ÃÂÃÂ¤ÃÂ RÃÂÃÂ©flexion en coursÃÂ¢ÃÂÃÂ¦</div>
            )}
          </div>
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
            <input
              value={aiAssistMsg}
              onChange={e=>setAiAssistMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendAiAssist(aiAssistMsg); } }}
              placeholder="Posez une questionÃÂ¢ÃÂÃÂ¦"
              style={{ flex:1, padding:"8px 12px", background:C.mid, border:`1px solid ${C.border}`, borderRadius:10, color:C.cream, fontSize:12, fontFamily:"inherit" }}
            />
            <button onClick={()=>sendAiAssist(aiAssistMsg)} disabled={!aiAssistMsg.trim()||aiAssistLoading}
              style={{ background:C.gold, border:"none", borderRadius:10, padding:"8px 14px", cursor:"pointer", color:C.dark, fontWeight:700, fontSize:13, fontFamily:"inherit", opacity:!aiAssistMsg.trim()||aiAssistLoading?0.5:1 }}>
              ÃÂ¢ÃÂÃÂ
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ PLAN TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="plan" && (
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {/* Sous-onglets Plan */}
            <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:`1px solid ${C.border}` }}>
              {[
                {id:"tables", icon:"ÃÂ°ÃÂÃÂÃÂº", label:"Tables & Plan"},
                {id:"salle",  icon:"ÃÂ°ÃÂÃÂÃÂ", label:"ÃÂÃÂdition de salle"},
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
                <div style={{ marginTop:16, background:C.red+"11", border:`1px solid ${C.red}33`, borderRadius:12, padding:"12px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", marginBottom:8 }}>
                    <div style={{ color:C.red, fontSize:12, letterSpacing:.5, flex:1 }}>{t.unseatedList} ({unseated.length})</div>
                    <button onClick={()=>setHighlightTables(h=>!h)} style={{ background:highlightTables?C.gold:"none", border:`1px solid ${highlightTables?C.gold:C.border}`, borderRadius:6, color:highlightTables?C.dark:C.muted, fontSize:11, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit" }}>
                      {highlightTables ? "ÃÂ¢ÃÂÃÂ Tables visibles" : "ÃÂ°ÃÂÃÂÃÂ Voir places libres"}
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
                          borderRadius:99, padding:"3px 12px", color:C.cream, fontSize:12, cursor:"pointer",
                          fontWeight:selectedUnseatedGuest?.id===g.id?700:400
                        }}>
                        {selectedUnseatedGuest?.id===g.id ? "ÃÂ¢ÃÂÃÂ " : ""}{g.name}
                      </span>
                    ))}
                    {selectedUnseatedGuest && (
                      <div style={{width:"100%",marginTop:6,fontSize:11,color:C.gold}}>
                        ÃÂ°ÃÂÃÂÃÂ Cliquez sur une table pour y placer {selectedUnseatedGuest.name}
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
                  <button onClick={()=>setSelectedTable(null)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16 }}>ÃÂ¢ÃÂÃÂ</button>
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
                          style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13 }}>ÃÂ¢ÃÂÃÂ</button>
                      </div>
                    );
                  })}
                </div>

                {/* Add unseated */}
                {unseated.length>0 && tableGuests.length<tableSel.capacity && (
                  <div>
                    <div style={{ color:C.muted, fontSize:11, letterSpacing:.5, marginBottom:6 }}>AJOUTER ÃÂÃÂ CETTE TABLE</div>
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

            {/* Sous-onglet Salle */}
            {planSubTab==="salle" && (
              <div style={{ maxWidth:900 }}>
                <h3 style={{ fontWeight:400, fontSize:20, marginBottom:20 }}>Forme de la salle</h3>
                <div style={{ marginBottom:20 }}>
                  <h4 style={{ color:C.gold, fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>TEMPLATES RAPIDES</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {[
                      { name:"Rectangle", icon:"ÃÂ¢ÃÂ¬ÃÂ", pts:[{x:60,y:60},{x:900,y:60},{x:900,y:560},{x:60,y:560}] },
                      { name:"Forme L", icon:"ÃÂ°ÃÂÃÂÃÂ²", pts:[{x:60,y:60},{x:500,y:60},{x:500,y:300},{x:900,y:300},{x:900,y:560},{x:60,y:560}] },
                      { name:"Forme U", icon:"ÃÂ°ÃÂÃÂÃÂ³", pts:[{x:60,y:60},{x:300,y:60},{x:300,y:380},{x:640,y:380},{x:640,y:60},{x:900,y:60},{x:900,y:560},{x:60,y:560}] },
                      { name:"Hexagone", icon:"ÃÂ¢ÃÂ¬ÃÂ¡", pts:(function(){ var p=[]; for(var i=0;i<6;i++){var a=i*Math.PI*2/6-Math.PI/6;p.push({x:Math.round(480+280*Math.cos(a)),y:Math.round(310+220*Math.sin(a))});} return p; })() },
                      { name:"Rond", icon:"ÃÂ¢ÃÂ­ÃÂ", pts:(function(){ var p=[]; for(var i=0;i<16;i++){var a=i*Math.PI*2/16;p.push({x:Math.round(480+300*Math.cos(a)),y:Math.round(310+230*Math.sin(a))});} return p; })() },
                    ].map(function(tmpl){ return (
                      <button key={tmpl.name}
                        onClick={function(){
                          if (tmpl.pts && Array.isArray(tmpl.pts)) {
                            updateEv(function(evUp){ return {...evUp, roomShape: tmpl.pts.map(function(p){ return {x:p.x, y:p.y}; })}; });
                          }
                        }}
                        style={{ background:C.card, border:"1px solid "+C.border, borderRadius:8, padding:"8px 14px", cursor:"pointer", color:C.cream, fontFamily:"inherit", fontSize:12, display:"flex", alignItems:"center", gap:6 }}
                      >
                        <span>{tmpl.icon}</span><span>{tmpl.name}</span>
                      </button>
                    ); })}
                  </div>
                </div>
                <RoomShapeEditor shape={ev.roomShape||[]} onChange={shape=>updateEv(e=>({...e,roomShape:shape}))}/>

                {/* Zones spÃÂÃÂ©ciales */}
                <div style={{ marginTop:20 }}>
                  <h4 style={{ color:C.gold, fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>ZONES SPÃÂÃÂCIALES</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                    {(ev.zones||[]).map(function(zone, zi){ return (
                      <div key={zi} style={{ background:zone.color+"22", border:"1px solid "+zone.color+"66", borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>{zone.icon}</span>
                        <span style={{ color:zone.color, fontSize:13 }}>{zone.label}</span>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, zones:(evUp.zones||[]).filter(function(_,i){ return i!==zi; })}; }); }}
                          style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:14, padding:0 }}>ÃÂ¢ÃÂÃÂ</button>
                      </div>
                    ); })}
                    <button onClick={()=>setShowAddZone(true)}
                      style={{ background:C.card, border:"1px dashed "+C.border, borderRadius:8, padding:"6px 14px", cursor:"pointer", color:C.muted, fontFamily:"inherit", fontSize:12 }}>
                      + Ajouter une zone
                    </button>
                  </div>
                  <p style={{ color:C.muted, fontSize:11, fontStyle:"italic" }}>
                    Les zones apparaissent dans les exports PDF. Exemples : Estrade, ScÃÂÃÂ¨ne, Bar, Piste de danse, Photo Booth...
                  </p>
                </div>

                {/* Mobilier */}
                <div style={{ marginTop:24 }}>
                  <h4 style={{ color:C.gold, fontWeight:400, fontSize:13, letterSpacing:1, marginBottom:10 }}>MOBILIER</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                    {(ev.furniture||[]).map(function(item, fi){ return (
                      <div key={fi} style={{ background:item.color+"22", border:"1px solid "+item.color+"66", borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>{item.icon}</span>
                        <span style={{ color:item.color, fontSize:13 }}>{item.label}</span>
                        <span style={{ color:C.muted, fontSize:11 }}>{item.width}ÃÂÃÂ{item.height}</span>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, furniture:(evUp.furniture||[]).filter(function(_,i){ return i!==fi; })}; }); }}
                          style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:14, padding:0 }}>ÃÂ¢ÃÂÃÂ</button>
                      </div>
                    ); })}
                    <button onClick={()=>setShowAddFurniture(true)}
                      style={{ background:C.card, border:"1px dashed "+C.border, borderRadius:8, padding:"6px 14px", cursor:"pointer", color:C.muted, fontFamily:"inherit", fontSize:12 }}>
                      + Ajouter du mobilier
                    </button>
                  </div>
                  <p style={{ color:C.muted, fontSize:11, fontStyle:"italic" }}>
                    Exemples : ScÃÂÃÂ¨ne, Bar, Buffet, Photobooth, Podium, Piano...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ GUESTS TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        
        {tab==="list" && (
          <div style={{ padding:"0 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ color:C.gold, fontWeight:400, fontSize:18 }}>ÃÂ°ÃÂÃÂÃÂ Plan par tables</h3>
              <Btn small variant="ghost" onClick={function(){ exportGuestsCSV(ev); }}>ÃÂ¢ÃÂ¬ÃÂ Export CSV</Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {ev.tables.map(function(tbl) {
                var tblGuests = ev.guests.filter(function(g){ return g.tableId === tbl.id; });
                return (
                  <div key={tbl.id} style={{ background:C.card, border:"1px solid " + (tbl.color||C.border) + "44", borderRadius:14, overflow:"hidden" }}>
                    <div style={{ background:(tbl.color||C.gold)+"22", padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:tbl.color||C.gold, fontWeight:700, fontSize:15 }}>
                        Table {tbl.number}{tbl.label ? " ÃÂ¢ÃÂÃÂ " + tbl.label : ""}
                      </span>
                      <span style={{ color:C.muted, fontSize:12 }}>{tblGuests.length}/{tbl.capacity} places</span>
                    </div>
                    {tblGuests.length === 0 ? (
                      <p style={{ color:C.muted, fontSize:13, padding:"12px 20px", fontStyle:"italic" }}>ÃÂ¢ÃÂÃÂ Vide ÃÂ¢ÃÂÃÂ</p>
                    ) : (
                      <table style={{ width:"100%", borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ borderBottom:"1px solid " + C.border }}>
                            {["Nom","RÃÂÃÂ´le","RÃÂÃÂ©gime","Notes"].map(function(h){ return <th key={h} style={{ padding:"8px 20px", color:C.muted, fontSize:11, textAlign:"left", letterSpacing:1 }}>{h}</th>; })}
                          </tr>
                        </thead>
                        <tbody>
                          {tblGuests.map(function(g, idx) {
                            var dinfo = dietInfo(g.diet);
                            return (
                              <tr key={g.id} style={{ borderBottom:idx<tblGuests.length-1?"1px solid "+C.border+"33":"none", background:idx%2===0?"transparent":C.mid+"33" }}>
                                <td style={{ padding:"10px 20px", color:C.cream, fontSize:14 }}>
                                  {g.name}
                                  {g.role && <span style={{ marginLeft:6, background:C.gold+"22", border:"1px solid "+C.gold+"44", borderRadius:99, padding:"1px 8px", fontSize:10, color:C.gold }}>
                                    {{"marie1":"ÃÂ°ÃÂÃÂÃÂ","marie2":"ÃÂ°ÃÂÃÂÃÂ","temoin":"ÃÂ°ÃÂÃÂÃÂ","famille_proche":"ÃÂ°ÃÂÃÂÃÂ¨ÃÂ¢ÃÂÃÂÃÂ°ÃÂÃÂÃÂ©ÃÂ¢ÃÂÃÂÃÂ°ÃÂÃÂÃÂ§","ami_proche":"ÃÂ¢ÃÂ­ÃÂ","enfant":"ÃÂ°ÃÂÃÂ§ÃÂ","vip":"ÃÂ°ÃÂÃÂÃÂ","prestataire":"ÃÂ°ÃÂÃÂÃÂ§"}[g.role]||""} {{"marie1":"MariÃÂÃÂ©(e)","marie2":"MariÃÂÃÂ©(e)","temoin":"TÃÂÃÂ©moin","famille_proche":"Famille","ami_proche":"Ami proche","enfant":"Enfant","vip":"VIP","prestataire":"Prestataire"}[g.role]||g.role}
                                  </span>}
                                </td>
                                <td style={{ padding:"10px 20px", fontSize:13, color:dinfo.color }}>{dinfo.icon} {dinfo.label}</td>
                                <td style={{ padding:"10px 20px", color:C.muted, fontSize:12, fontStyle:"italic" }}>{g.notes||""}</td>
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
                <div style={{ background:C.red+"11", border:"1px solid "+C.red+"44", borderRadius:14, padding:"12px 20px" }}>
                  <p style={{ color:C.red, fontSize:13, fontWeight:700, marginBottom:8 }}>ÃÂ¢ÃÂÃÂ  Non placÃÂÃÂ©s ({ev.guests.filter(function(g){ return !g.tableId; }).length})</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {ev.guests.filter(function(g){ return !g.tableId; }).map(function(g){
                      return <span key={g.id} style={{ background:C.red+"22", borderRadius:99, padding:"4px 12px", fontSize:12, color:C.cream }}>{g.name}</span>;
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
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un invitÃÂÃÂ©ÃÂ¢ÃÂÃÂ¦"
                style={{ ...inputStyle, flex:1 }}/>
              <Btn variant="ghost" onClick={()=>exportGuestsCSV(ev)}>ÃÂ¢ÃÂ¬ÃÂ Export CSV</Btn>
              <Btn variant="ghost" onClick={()=>setShowImportCSV(true)}>ÃÂ¢ÃÂ¬ÃÂ Import CSV</Btn>
              <Btn onClick={()=>setShowAddGuest(true)}>+ InvitÃÂÃÂ©</Btn>
            </div>

            {/* Diet filter legend */}
            {dietStats.length>0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                {dietStats.map(d=>(
                  <span key={d.id} style={{ background:d.color+"22",border:`1px solid ${d.color}44`,color:d.color,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700 }}>
                    {d.icon} {d.label} ÃÂÃÂ {d.count}
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
                    {table ? <Badge color={C.gold}>Table {table.number}</Badge> : <Badge color={C.red}>Non placÃÂÃÂ©</Badge>}
                    <select value={g.tableId||""} onChange={function(evt){ var tid=evt.target.value?parseInt(evt.target.value):null; updateEv(function(evUp){ return {...evUp,guests:evUp.guests.map(function(x){ return x.id===g.id?{...x,tableId:tid}:x; })}; }); }}
                      style={{ background:C.mid,border:"1px solid "+C.border,borderRadius:8,color:C.cream,padding:"4px 8px",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
                      <option value="">ÃÂ¢ÃÂÃÂ Non placÃÂÃÂ© ÃÂ¢ÃÂÃÂ</option>
                      {ev.tables.map(function(tbl){return <option key={tbl.id} value={tbl.id}>Table {tbl.number}{tbl.label?" ("+tbl.label+")":""}</option>;})}
                    </select>
                    <button onClick={()=>updateEv(e=>({...e,guests:e.guests.filter(x=>x.id!==g.id)}))}
                      style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                  </div>
                );
              })}
              {filtered.length===0 && <p style={{ color:C.muted, textAlign:"center", padding:32 }}>Aucun invitÃÂÃÂ© trouvÃÂÃÂ©</p>}
            </div>
          </div>
        )}

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ DIET TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="diet" && (
          <div style={{ maxWidth:960, display:"flex", flexDirection:"column", gap:24 }}>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ HEADER ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <h3 style={{ margin:0, fontWeight:400, fontSize:20 }}>Gestion alimentaire</h3>
              <div style={{flex:1}}/>
              <Btn small onClick={function(){ printDietSummary(ev); }}>ÃÂ°ÃÂÃÂÃÂ¨ Imprimer rÃÂÃÂ©capitulatif</Btn>
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ COMPTEURS RÃÂÃÂGIMES ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:12 }}>
              {DIET_OPTIONS.map(function(dopt){
                var count = ev.guests.filter(function(g){ return g.diet===dopt.id || (g.allergies||[]).includes(dopt.id); }).length;
                return (
                  <div key={dopt.id} style={{ background:count>0?dopt.color+"22":C.card, border:"1px solid "+(count>0?dopt.color:C.border), borderRadius:12, padding:"14px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:28 }}>{dopt.icon}</div>
                    <div style={{ color:count>0?dopt.color:C.muted, fontSize:22, fontWeight:700 }}>{count}</div>
                    <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{dopt.label}</div>
                  </div>
                );
              })}
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ MENU MULTI-COURS ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ½ Menu de l'ÃÂÃÂ©vÃÂÃÂ©nement</h4>
                <Btn small variant="muted" onClick={function(e){
                  var btn = e.currentTarget;
                  btn.disabled = true;
                  btn.textContent = "ÃÂ¢ÃÂÃÂ³ GÃÂÃÂ©nÃÂÃÂ©ration...";
                  // IA gÃÂÃÂ©nÃÂÃÂ¨re le menu
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
                      btn.textContent = "ÃÂ¢ÃÂÃÂ Menu gÃÂÃÂ©nÃÂÃÂ©rÃÂÃÂ© !";
                      setTimeout(function(){ btn.textContent = "ÃÂ¢ÃÂÃÂ¨ GÃÂÃÂ©nÃÂÃÂ©rer avec l\'IA"; }, 3000);
                    } catch(e) {
                      console.error("Menu IA parse:", e);
                      btn.disabled = false;
                      btn.textContent = "ÃÂ¢ÃÂÃÂ¨ GÃÂÃÂ©nÃÂÃÂ©rer avec l\'IA";
                    }
                  }).catch(function(e){
                    console.error("Menu IA fetch:", e);
                    btn.disabled = false;
                    btn.textContent = "ÃÂ¢ÃÂÃÂ¨ GÃÂÃÂ©nÃÂÃÂ©rer avec l\'IA";
                    alert("GÃÂÃÂ©nÃÂÃÂ©ration IA indisponible depuis cette interface. Saisissez le menu manuellement.");
                  });
                }}>ÃÂ¢ÃÂÃÂ¨ GÃÂÃÂ©nÃÂÃÂ©rer avec l'IA</Btn>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
                {[
                  ["appetizer","ÃÂ°ÃÂÃÂ¥ÃÂ ApÃÂÃÂ©ritif","ex: Verrines saumon, mini-quiches"],
                  ["starter","ÃÂ°ÃÂÃÂ¥ÃÂ EntrÃÂÃÂ©e","ex: VeloutÃÂÃÂ© de butternut"],
                  ["main","ÃÂ°ÃÂÃÂÃÂ Plat principal","ex: Filet de bÃÂÃÂuf sauce bordelaise"],
                  ["cheese","ÃÂ°ÃÂÃÂ§ÃÂ Fromage","ex: Plateau affinÃÂÃÂ© (optionnel)"],
                  ["dessert","ÃÂ°ÃÂÃÂÃÂ° Dessert","ex: PiÃÂÃÂ¨ce montÃÂÃÂ©e"],
                  ["vegOption","ÃÂ°ÃÂÃÂÃÂ± Option vÃÂÃÂ©gÃÂÃÂ©tarienne","ex: Risotto aux champignons"],
                ].map(function(item){
                  var key = item[0]; var label = item[1]; var ph = item[2];
                  return (
                    <div key={key}>
                      <label style={{ color:C.muted, fontSize:11, letterSpacing:1, display:"block", marginBottom:6 }}>{label.toUpperCase()}</label>
                      <input
                        value={(ev.menu&&ev.menu[key])||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, menu:{...(ev2.menu||{}), [key]:v}}; }); }}
                        placeholder={ph}
                        style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:C.cream, fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
              {ev.menu&&ev.menu.note && (
                <div style={{ marginTop:14, background:C.gold+"11", border:"1px solid "+C.gold+"44", borderRadius:10, padding:"10px 16px", color:C.gold, fontSize:13, fontStyle:"italic" }}>
                  ÃÂ°ÃÂÃÂÃÂ¡ {ev.menu.note}
                </div>
              )}
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ BOISSONS ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <h4 style={{ margin:"0 0 16px", color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ· Boissons</h4>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
                {[
                  ["champagne","ÃÂ°ÃÂÃÂ¥ÃÂ Champagne/Prosecco","ex: Veuve Clicquot Brut"],
                  ["vin_blanc","ÃÂ°ÃÂÃÂÃÂ¾ Vin blanc","ex: Sancerre 2022"],
                  ["vin_rouge","ÃÂ°ÃÂÃÂÃÂ· Vin rouge","ex: Bordeaux Saint-ÃÂÃÂmilion"],
                  ["eau","ÃÂ°ÃÂÃÂÃÂ§ Eau","ex: ÃÂÃÂvian, San Pellegrino"],
                  ["softs","ÃÂ°ÃÂÃÂ¥ÃÂ¤ Softs / Jus","ex: Orange, Citron, Cola"],
                  ["cocktail","ÃÂ°ÃÂÃÂÃÂ¹ Cocktail de bienvenue","ex: Kir Royal"],
                  ["biere","ÃÂ°ÃÂÃÂÃÂº BiÃÂÃÂ¨re","ex: IPA artisanale"],
                  ["cafe","ÃÂ¢ÃÂÃÂ CafÃÂÃÂ© / ThÃÂÃÂ©","ex: Nespresso + ThÃÂÃÂ© Mariage FrÃÂÃÂ¨res"],
                ].map(function(item){
                  var key = item[0]; var label = item[1]; var ph = item[2];
                  return (
                    <div key={key}>
                      <label style={{ color:C.muted, fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>{label.toUpperCase()}</label>
                      <input
                        value={(ev.drinks&&ev.drinks[key])||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, drinks:{...(ev2.drinks||{}), [key]:v}}; }); }}
                        placeholder={ph}
                        style={{ width:"100%", padding:"7px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:12, fontFamily:"inherit", boxSizing:"border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:14 }}>
                <label style={{ color:C.muted, fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>NOTES BOISSONS</label>
                <input
                  value={(ev.drinks&&ev.drinks.notes)||""}
                  onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, drinks:{...(ev2.drinks||{}), notes:v}}; }); }}
                  placeholder="Ex: Pas d'alcool sur les tables enfants, service champagne ÃÂÃÂ  l'arrivÃÂÃÂ©e..."
                  style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:C.cream, fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                />
              </div>
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ SYNTHÃÂÃÂSE TRAITEUR ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ SynthÃÂÃÂ¨se traiteur</h4>
                <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
                  <Btn small variant="ghost" onClick={function(){
                    // Export CSV traiteur
                    var rows = ["Table,Nom,RÃÂÃÂ©gime,Allergies,Notes"];
                    ev.tables.forEach(function(tbl){
                      var tGuests = ev.guests.filter(function(g){ return g.tableId===tbl.id; });
                      tGuests.forEach(function(g){
                        var dinfo = dietInfo(g.diet);
                        rows.push(["Table "+tbl.number+(tbl.label?" - "+tbl.label:""), g.name, dinfo.label, (g.allergies||[]).join("+"), g.notes||""].map(function(v){ return '"'+String(v).replace(/"/g,'""')+'"'; }).join(","));
                      });
                    });
                    var blob = new Blob([rows.join("\n")], {type:"text/csv"});
                    var a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="synthese_traiteur.csv"; a.click();
                  }}>ÃÂ¢ÃÂ¬ÃÂ CSV Traiteur</Btn>
                  <Btn small variant="ghost" onClick={function(){ printDietSummary(ev); }}>ÃÂ°ÃÂÃÂÃÂ¨ PDF</Btn>
                </div>
              </div>

              {/* Par table */}
              <h5 style={{ color:C.muted, fontSize:12, letterSpacing:1, marginBottom:12 }}>PAR TABLE</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                {ev.tables.map(function(tbl){
                  var tGuests = ev.guests.filter(function(g){ return g.tableId===tbl.id; });
                  if (!tGuests.length) return null;
                  var specials = tGuests.filter(function(g){ return g.diet!=="standard" || (g.allergies||[]).length>0; });
                  return (
                    <div key={tbl.id} style={{ background:C.mid+"44", border:"1px solid "+C.border, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <span style={{ color:tbl.color||C.gold, fontWeight:700, minWidth:80 }}>Table {tbl.number}{tbl.label?" ÃÂ¢ÃÂÃÂ "+tbl.label:""}</span>
                      <span style={{ color:C.muted, fontSize:12 }}>{tGuests.length} couverts</span>
                      <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:6 }}>
                        {specials.length===0 ? (
                          <span style={{ color:C.muted, fontSize:12, fontStyle:"italic" }}>Tous standard</span>
                        ) : specials.map(function(g){
                          var dinfo = dietInfo(g.diet);
                          return (
                            <span key={g.id} style={{ background:dinfo.color+"22", border:"1px solid "+dinfo.color+"44", borderRadius:99, padding:"2px 10px", fontSize:11, color:dinfo.color }}>
                              {g.name} ÃÂ¢ÃÂÃÂ {dinfo.icon} {dinfo.label}{(g.allergies||[]).map(function(a){ var ai=dietInfo(a); return " +"+ai.icon; }).join("")}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>

              {/* Par rÃÂÃÂ©gime */}
              <h5 style={{ color:C.muted, fontSize:12, letterSpacing:1, marginBottom:12 }}>PAR RÃÂÃÂGIME</h5>
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
                            <span key={g.id} style={{ background:C.card, border:"1px solid "+C.border, borderRadius:99, padding:"2px 10px", fontSize:11, color:C.cream }}>
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

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ INVITÃÂÃÂS AVEC RÃÂÃÂGIME SPÃÂÃÂCIAL ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            {ev.guests.filter(function(g){ return g.diet!=="standard"||(g.allergies||[]).length>0; }).length > 0 && (
              <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
                <h4 style={{ margin:"0 0 16px", color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ¢ÃÂÃÂ  InvitÃÂÃÂ©s avec besoins spÃÂÃÂ©cifiques</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {ev.guests.filter(function(g){ return g.diet!=="standard"||(g.allergies||[]).length>0; }).map(function(g){
                    var dinfo = dietInfo(g.diet);
                    var tbl = ev.tables.find(function(tb){ return tb.id===g.tableId; });
                    return (
                      <div key={g.id} style={{ background:dinfo.color+"11", border:"1px solid "+dinfo.color+"33", borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ fontSize:22 }}>{dinfo.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ color:C.cream, fontWeight:600 }}>{g.name}</div>
                          <div style={{ color:C.muted, fontSize:12 }}>
                            {dinfo.label}
                            {(g.allergies||[]).map(function(a){ var ai=dietInfo(a); return " ÃÂÃÂ· "+ai.icon+" "+ai.label; }).join("")}
                            {g.notes ? " ÃÂÃÂ· "+g.notes : ""}
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

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
            ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ RSVP TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
        ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="rsvp" && (
          <div style={{ maxWidth:900 }}>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ SynthÃÂÃÂ¨se RSVP ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"ConfirmÃÂÃÂ©s",   val:rsvpConfirmed, color:C.green,  icon:"ÃÂ¢ÃÂÃÂ"},
                {label:"RefusÃÂÃÂ©s",     val:rsvpDeclined,  color:C.red,    icon:"ÃÂ¢ÃÂÃÂ"},
                {label:"En attente",  val:rsvpPending,   color:"#FF9800", icon:"ÃÂ¢ÃÂÃÂ³"},
                {label:"Total",       val:ev.guests.length, color:C.gold, icon:"ÃÂ°ÃÂÃÂÃÂ¥"},
              ].map(s=>(
                <div key={s.label} style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:30, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Barre progression ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            {ev.guests.length > 0 && (
              <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:C.muted, fontSize:12 }}>Taux de rÃÂÃÂ©ponse</span>
                  <span style={{ color:C.gold, fontSize:12, fontWeight:700 }}>
                    {Math.round((rsvpConfirmed+rsvpDeclined)/ev.guests.length*100)}%
                  </span>
                </div>
                <div style={{ height:8, background:C.mid, borderRadius:99, overflow:"hidden", display:"flex" }}>
                  <div style={{ width:`${rsvpConfirmed/ev.guests.length*100}%`, background:C.green, transition:"width .4s" }}/>
                  <div style={{ width:`${rsvpDeclined/ev.guests.length*100}%`, background:C.red, transition:"width .4s" }}/>
                </div>
                <div style={{ display:"flex", gap:16, marginTop:8, fontSize:11, color:C.muted }}>
                  <span style={{ color:C.green }}>ÃÂ¢ÃÂÃÂ  ConfirmÃÂÃÂ©s {rsvpConfirmed}</span>
                  <span style={{ color:C.red }}>ÃÂ¢ÃÂÃÂ  RefusÃÂÃÂ©s {rsvpDeclined}</span>
                  <span style={{ color:"#FF9800" }}>ÃÂ¢ÃÂÃÂ  En attente {rsvpPending}</span>
                </div>
              </div>
            )}

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Lien RSVP ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
              <h4 style={{ color:C.gold, fontWeight:400, fontSize:14, margin:"0 0 12px" }}>ÃÂ°ÃÂÃÂÃÂ Lien de confirmation invitÃÂÃÂ©s</h4>
              {(function(){
                var fb = null; try{fb=getFirebase();}catch(e){}
                var uid = fb&&fb.auth&&fb.auth.currentUser ? fb.auth.currentUser.uid : "";
                var joinParam = uid ? uid+"___"+ev.id : ev.id;
                var joinUrl = window.location.origin+"/?join="+joinParam;
                return (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input readOnly value={joinUrl}
                  style={{ flex:1, padding:"8px 12px", background:C.mid, border:"1px solid "+C.border, borderRadius:8, color:C.muted, fontSize:12, fontFamily:"monospace" }}/>
                <Btn small onClick={function(){ navigator.clipboard.writeText(joinUrl); }}>ÃÂ°ÃÂÃÂÃÂ Copier</Btn>
              </div>
                );
              })()}
              <p style={{ color:C.muted, fontSize:11, marginTop:8, fontStyle:"italic" }}>Partagez ce lien ÃÂ¢ÃÂÃÂ les invitÃÂÃÂ©s confirment leur prÃÂÃÂ©sence et rÃÂÃÂ©gime alimentaire directement.</p>
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Liste invitÃÂÃÂ©s avec statut RSVP ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <h4 style={{ color:C.gold, fontWeight:400, fontSize:14, margin:"0 0 16px" }}>ÃÂ°ÃÂÃÂÃÂ¥ Statut par invitÃÂÃÂ©</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ev.guests.length === 0 && <p style={{ color:C.muted, fontStyle:"italic" }}>Aucun invitÃÂÃÂ© ajoutÃÂÃÂ©.</p>}
                {ev.guests.map(function(g){
                  var rsvp = g.rsvp || "pending";
                  var rsvpColor = rsvp==="confirmed" ? C.green : rsvp==="declined" ? C.red : "#FF9800";
                  var rsvpIcon  = rsvp==="confirmed" ? "ÃÂ¢ÃÂÃÂ" : rsvp==="declined" ? "ÃÂ¢ÃÂÃÂ" : "ÃÂ¢ÃÂÃÂ³";
                  return (
                    <div key={g.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.mid+"44", borderRadius:10, border:"1px solid "+C.border+"33" }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:13,fontWeight:700 }}>{g.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ color:C.cream, fontSize:14 }}>{g.name}</div>
                        {g.email && <div style={{ color:C.muted, fontSize:11 }}>{g.email}</div>}
                      </div>
                      <span style={{ fontSize:18 }}>{rsvpIcon}</span>
                      <div style={{ display:"flex", gap:4 }}>
                        {["confirmed","declined","pending"].map(function(s){
                          var icons = {confirmed:"ÃÂ¢ÃÂÃÂ",declined:"ÃÂ¢ÃÂÃÂ",pending:"ÃÂ¢ÃÂÃÂ³"};
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

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
            ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ BUDGET TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
        ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="budget" && (
          <div style={{ maxWidth:900 }}>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ KPIs budget ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"Budget estimÃÂÃÂ©",  val:budgetTotal.toFixed(0)+"ÃÂ¢ÃÂÃÂ¬",  color:C.gold,  icon:"ÃÂ°ÃÂÃÂÃÂ"},
                {label:"DÃÂÃÂ©pensÃÂÃÂ©",        val:budgetSpent.toFixed(0)+"ÃÂ¢ÃÂÃÂ¬",  color:budgetSpent>budgetTotal?C.red:C.green, icon:"ÃÂ°ÃÂÃÂÃÂ³"},
                {label:"Restant",        val:(budgetTotal-budgetSpent).toFixed(0)+"ÃÂ¢ÃÂÃÂ¬", color:budgetTotal-budgetSpent<0?C.red:C.green, icon:"ÃÂ°ÃÂÃÂÃÂ¦"},
                {label:"CoÃÂÃÂ»t / invitÃÂÃÂ©",  val:ev.guests.length>0?(budgetSpent/ev.guests.length).toFixed(0)+"ÃÂ¢ÃÂÃÂ¬":"ÃÂ¢ÃÂÃÂ", color:C.blue, icon:"ÃÂ°ÃÂÃÂÃÂ¤"},
              ].map(s=>(
                <div key={s.label} style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Barre budget ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            {budgetTotal > 0 && (
              <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:C.muted, fontSize:12 }}>Consommation du budget</span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.gold, fontSize:12, fontWeight:700 }}>
                    {Math.round(budgetSpent/budgetTotal*100)}%
                  </span>
                </div>
                <div style={{ height:10, background:C.mid, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${Math.min(100,budgetSpent/budgetTotal*100)}%`, background:budgetSpent>budgetTotal?C.red:C.green, transition:"width .4s", height:"100%" }}/>
                </div>
              </div>
            )}

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Postes de dÃÂÃÂ©penses ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:C.gold, fontWeight:400, fontSize:14, margin:0 }}>ÃÂ°ÃÂÃÂÃÂ¼ Postes de dÃÂÃÂ©penses</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var cats = [
                    {cat:"Traiteur",     icon:"ÃÂ°ÃÂÃÂÃÂ½"},
                    {cat:"Salle",        icon:"ÃÂ°ÃÂÃÂÃÂ"},
                    {cat:"Musique/DJ",   icon:"ÃÂ°ÃÂÃÂÃÂµ"},
                    {cat:"Fleurs/DÃÂÃÂ©co",  icon:"ÃÂ°ÃÂÃÂÃÂ¸"},
                    {cat:"Photo/VidÃÂÃÂ©o",  icon:"ÃÂ°ÃÂÃÂÃÂ·"},
                    {cat:"Transport",    icon:"ÃÂ°ÃÂÃÂÃÂ"},
                    {cat:"Invitations",  icon:"ÃÂ°ÃÂÃÂÃÂ"},
                    {cat:"Tenue",        icon:"ÃÂ°ÃÂÃÂÃÂ"},
                    {cat:"Divers",       icon:"ÃÂ°ÃÂÃÂÃÂ¦"},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.budget||[]).map(function(b){ return b.category; });
                    var toAdd = cats.filter(function(c){ return !existing.includes(c.cat); })
                      .map(function(c){ return {id:Date.now()+Math.random(), category:c.cat, icon:c.icon, estimated:"", actual:"", notes:""}; });
                    return {...evUp, budget:[...(evUp.budget||[]), ...toAdd]};
                  });
                }}>ÃÂ¢ÃÂÃÂ¨ Remplir avec modÃÂÃÂ¨le</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, budget:[...(evUp.budget||[]), {id:Date.now(), category:"Nouveau poste", icon:"ÃÂ°ÃÂÃÂÃÂ¦", estimated:"", actual:"", notes:""}]};
                  });
                }}>+ Poste</Btn>
              </div>

              {(ev.budget||[]).length === 0 && (
                <p style={{ color:C.muted, fontStyle:"italic", textAlign:"center", padding:20 }}>Aucun poste. Cliquez sur "Remplir avec modÃÂÃÂ¨le" pour dÃÂÃÂ©marrer.</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.budget||[]).map(function(item, bi){
                  var pct = item.estimated && parseFloat(item.estimated) > 0 ? Math.min(100,parseFloat(item.actual||0)/parseFloat(item.estimated)*100) : 0;
                  var over = parseFloat(item.actual||0) > parseFloat(item.estimated||0) && parseFloat(item.estimated||0) > 0;
                  return (
                    <div key={item.id} style={{ background:C.mid+"44", border:"1px solid "+(over?C.red:C.border)+"44", borderRadius:12, padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontSize:18 }}>{item.icon||"ÃÂ°ÃÂÃÂÃÂ¦"}</span>
                        <input value={item.category} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],category:v}; return {...evUp,budget:b}; }); }}
                          style={{ flex:1, background:"none", border:"none", color:C.cream, fontSize:14, fontFamily:"inherit", outline:"none" }}/>
                        {over && <span style={{ color:C.red, fontSize:11, fontWeight:700 }}>ÃÂ¢ÃÂÃÂ  DÃÂÃÂ©passement</span>}
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, budget:(evUp.budget||[]).filter(function(_,i){ return i!==bi; })}; }); }}
                          style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:14 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <div style={{ flex:1, minWidth:120 }}>
                          <label style={{ color:C.muted, fontSize:10, letterSpacing:1 }}>ESTIMÃÂÃÂ (ÃÂ¢ÃÂÃÂ¬)</label>
                          <input type="number" value={item.estimated} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],estimated:v}; return {...evUp,budget:b}; }); }}
                            placeholder="0" style={{ width:"100%", padding:"6px 10px", background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                        <div style={{ flex:1, minWidth:120 }}>
                          <label style={{ color:C.muted, fontSize:10, letterSpacing:1 }}>RÃÂÃÂEL (ÃÂ¢ÃÂÃÂ¬)</label>
                          <input type="number" value={item.actual} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],actual:v}; return {...evUp,budget:b}; }); }}
                            placeholder="0" style={{ width:"100%", padding:"6px 10px", background:C.card, border:"1px solid "+(over?C.red:C.border), borderRadius:6, color:over?C.red:C.cream, fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                        <div style={{ flex:2, minWidth:160 }}>
                          <label style={{ color:C.muted, fontSize:10, letterSpacing:1 }}>NOTES</label>
                          <input value={item.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var b=[...(evUp.budget||[])]; b[bi]={...b[bi],notes:v}; return {...evUp,budget:b}; }); }}
                            placeholder="Prestataire, devis..." style={{ width:"100%", padding:"6px 10px", background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:13, fontFamily:"inherit" }}/>
                        </div>
                      </div>
                      {parseFloat(item.estimated||0) > 0 && (
                        <div style={{ marginTop:8, height:4, background:C.mid, borderRadius:99 }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:over?C.red:C.green, borderRadius:99, transition:"width .4s" }}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {(ev.budget||[]).length > 0 && (
                <div style={{ marginTop:16, padding:"14px 16px", background:C.gold+"11", border:"1px solid "+C.gold+"33", borderRadius:10, display:"flex", gap:24 }}>
                  <span style={{ color:C.gold, fontSize:14 }}>Total estimÃÂÃÂ© : <strong>{budgetTotal.toFixed(0)}ÃÂ¢ÃÂÃÂ¬</strong></span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.green, fontSize:14 }}>Total rÃÂÃÂ©el : <strong>{budgetSpent.toFixed(0)}ÃÂ¢ÃÂÃÂ¬</strong></span>
                  <span style={{ color:C.muted, fontSize:14 }}>ÃÂÃÂcart : <strong>{(budgetTotal-budgetSpent).toFixed(0)}ÃÂ¢ÃÂÃÂ¬</strong></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
            ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ PLANNING TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
        ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="planning" && (
          <div style={{ maxWidth:860 }}>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ KPIs planning ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
              {[
                {label:"TÃÂÃÂ¢ches totales", val:planningTotal, color:C.gold,  icon:"ÃÂ°ÃÂÃÂÃÂ"},
                {label:"TerminÃÂÃÂ©es",      val:planningDone,  color:C.green, icon:"ÃÂ¢ÃÂÃÂ"},
                {label:"Restantes",      val:planningTotal-planningDone, color:planningTotal-planningDone>0?"#FF9800":C.green, icon:"ÃÂ¢ÃÂÃÂ³"},
                {label:"Avancement",     val:planningTotal>0?Math.round(planningDone/planningTotal*100)+"%":"ÃÂ¢ÃÂÃÂ", color:C.blue, icon:"ÃÂ°ÃÂÃÂÃÂ"},
              ].map(s=>(
                <div key={s.label} style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Barre avancement ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            {planningTotal > 0 && (
              <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"14px 24px", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:C.muted, fontSize:12 }}>Progression globale</span>
                  <span style={{ color:C.gold, fontSize:12, fontWeight:700 }}>{Math.round(planningDone/planningTotal*100)}%</span>
                </div>
                <div style={{ height:8, background:C.mid, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:`${planningDone/planningTotal*100}%`, background:C.green, transition:"width .4s", height:"100%" }}/>
                </div>
              </div>
            )}

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Liste de tÃÂÃÂ¢ches ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:C.gold, fontWeight:400, fontSize:14, margin:0 }}>ÃÂ°ÃÂÃÂÃÂ RÃÂÃÂ©troplanning & tÃÂÃÂ¢ches</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var tpl = [
                    {label:"RÃÂÃÂ©server la salle",          icon:"ÃÂ°ÃÂÃÂÃÂ", deadline:"", priority:"high"},
                    {label:"Choisir le traiteur",         icon:"ÃÂ°ÃÂÃÂÃÂ½", deadline:"", priority:"high"},
                    {label:"Envoyer les faire-parts",     icon:"ÃÂ°ÃÂÃÂÃÂ", deadline:"", priority:"high"},
                    {label:"Confirmer le DJ / musiciens", icon:"ÃÂ°ÃÂÃÂÃÂµ", deadline:"", priority:"medium"},
                    {label:"Choisir les fleurs",          icon:"ÃÂ°ÃÂÃÂÃÂ¸", deadline:"", priority:"medium"},
                    {label:"RÃÂÃÂ©server le photographe",    icon:"ÃÂ°ÃÂÃÂÃÂ·", deadline:"", priority:"medium"},
                    {label:"Finaliser le menu",           icon:"ÃÂ°ÃÂÃÂÃÂ", deadline:"", priority:"medium"},
                    {label:"Relancer les non-rÃÂÃÂ©pondants", icon:"ÃÂ°ÃÂÃÂÃÂ", deadline:"", priority:"low"},
                    {label:"Valider le plan de table",    icon:"ÃÂ°ÃÂÃÂÃÂº", deadline:"", priority:"low"},
                    {label:"PrÃÂÃÂ©parer les chevalets",      icon:"ÃÂ°ÃÂÃÂÃÂ¨", deadline:"", priority:"low"},
                    {label:"Briefer les prestataires",    icon:"ÃÂ°ÃÂÃÂ¤ÃÂ", deadline:"", priority:"low"},
                    {label:"Jour J ÃÂ¢ÃÂÃÂ Accueil invitÃÂÃÂ©s",    icon:"ÃÂ°ÃÂÃÂÃÂ", deadline:"", priority:"low"},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.planning||[]).map(function(t){ return t.label; });
                    var toAdd = tpl.filter(function(t){ return !existing.includes(t.label); })
                      .map(function(t){ return {...t, id:Date.now()+Math.random(), done:false, notes:""}; });
                    return {...evUp, planning:[...(evUp.planning||[]), ...toAdd]};
                  });
                }}>ÃÂ¢ÃÂÃÂ¨ ModÃÂÃÂ¨le type</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, planning:[...(evUp.planning||[]), {id:Date.now(), label:"Nouvelle tÃÂÃÂ¢che", icon:"ÃÂ°ÃÂÃÂÃÂ", deadline:"", priority:"medium", done:false, notes:""}]};
                  });
                }}>+ TÃÂÃÂ¢che</Btn>
              </div>

              {(ev.planning||[]).length === 0 && (
                <p style={{ color:C.muted, fontStyle:"italic", textAlign:"center", padding:20 }}>Aucune tÃÂÃÂ¢che. Cliquez "ModÃÂÃÂ¨le type" pour dÃÂÃÂ©marrer.</p>
              )}

              {/* Grouper par prioritÃÂÃÂ© */}
              {["high","medium","low"].map(function(prio){
                var tasks = (ev.planning||[]).filter(function(t){ return (t.priority||"medium") === prio; });
                if (!tasks.length) return null;
                var prioLabel = {high:"ÃÂ°ÃÂÃÂÃÂ´ PrioritÃÂÃÂ© haute", medium:"ÃÂ°ÃÂÃÂÃÂ¡ PrioritÃÂÃÂ© moyenne", low:"ÃÂ°ÃÂÃÂÃÂ¢ PrioritÃÂÃÂ© faible"}[prio];
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
                              {task.done ? "ÃÂ¢ÃÂÃÂ" : ""}
                            </button>
                            <span style={{ fontSize:16 }}>{task.icon||"ÃÂ°ÃÂÃÂÃÂ"}</span>
                            <input value={task.label} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],label:v}; return {...evUp,planning:p}; }); }}
                              style={{ flex:1, background:"none", border:"none", color:task.done?C.muted:C.cream, fontSize:13, fontFamily:"inherit", outline:"none", textDecoration:task.done?"line-through":"none" }}/>
                            <input type="date" value={task.deadline||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],deadline:v}; return {...evUp,planning:p}; }); }}
                              style={{ background:C.card, border:"1px solid "+(isLate?C.red:C.border), borderRadius:6, color:isLate?C.red:C.muted, fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}/>
                            {isLate && <span style={{ color:C.red, fontSize:11, fontWeight:700 }}>EN RETARD</span>}
                            <select value={task.priority||"medium"} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.planning||[])]; p[ti]={...p[ti],priority:v}; return {...evUp,planning:p}; }); }}
                              style={{ background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.muted, fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}>
                              <option value="high">ÃÂ°ÃÂÃÂÃÂ´ Haute</option>
                              <option value="medium">ÃÂ°ÃÂÃÂÃÂ¡ Moyenne</option>
                              <option value="low">ÃÂ°ÃÂÃÂÃÂ¢ Faible</option>
                            </select>
                            <button onClick={function(){ updateEv(function(evUp){ return {...evUp, planning:(evUp.planning||[]).filter(function(_,i){ return i!==ti; })}; }); }}
                              style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>ÃÂ°ÃÂÃÂÃÂ</button>
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

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
            ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ PROGRAMME TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
        ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="programme" && (
          <div style={{ maxWidth:860 }}>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Programme de la journÃÂÃÂ©e ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:C.gold, fontWeight:400, fontSize:14, margin:0 }}>ÃÂ°ÃÂÃÂÃÂµ Programme de la journÃÂÃÂ©e</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={function(){
                  var tpl = [
                    {time:"10:00", label:"Accueil des invitÃÂÃÂ©s",      icon:"ÃÂ°ÃÂÃÂÃÂ", duration:30,  notes:""},
                    {time:"10:30", label:"CÃÂÃÂ©rÃÂÃÂ©monie",                icon:"ÃÂ°ÃÂÃÂÃÂ", duration:45,  notes:""},
                    {time:"11:30", label:"Vin d'honneur / Cocktail", icon:"ÃÂ°ÃÂÃÂ¥ÃÂ", duration:90,  notes:""},
                    {time:"13:00", label:"DÃÂÃÂ©jeuner",                  icon:"ÃÂ°ÃÂÃÂÃÂ½", duration:120, notes:""},
                    {time:"15:00", label:"Discours & animations",     icon:"ÃÂ°ÃÂÃÂÃÂ¤", duration:60,  notes:""},
                    {time:"16:00", label:"PiÃÂÃÂ¨ce montÃÂÃÂ©e",              icon:"ÃÂ°ÃÂÃÂÃÂ", duration:30,  notes:""},
                    {time:"17:00", label:"Ouverture de bal",          icon:"ÃÂ°ÃÂÃÂÃÂ", duration:30,  notes:""},
                    {time:"20:00", label:"DÃÂÃÂ®ner",                     icon:"ÃÂ°ÃÂÃÂÃÂ·", duration:120, notes:""},
                    {time:"22:00", label:"SoirÃÂÃÂ©e dansante",           icon:"ÃÂ°ÃÂÃÂÃÂ¶", duration:180, notes:""},
                  ];
                  updateEv(function(evUp){
                    var existing = (evUp.programme||[]).map(function(p){ return p.label; });
                    var toAdd = tpl.filter(function(p){ return !existing.includes(p.label); })
                      .map(function(p){ return {...p, id:Date.now()+Math.random()}; });
                    return {...evUp, programme:[...(evUp.programme||[]), ...toAdd]};
                  });
                }}>ÃÂ¢ÃÂÃÂ¨ ModÃÂÃÂ¨le mariage</Btn>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, programme:[...(evUp.programme||[]), {id:Date.now(), time:"", label:"Nouvelle ÃÂÃÂ©tape", icon:"ÃÂ°ÃÂÃÂÃÂ", duration:60, notes:""}]};
                  });
                }}>+ ÃÂÃÂtape</Btn>
              </div>

              {(ev.programme||[]).length === 0 && (
                <p style={{ color:C.muted, fontStyle:"italic", textAlign:"center", padding:20 }}>Aucune ÃÂÃÂ©tape. Cliquez "ModÃÂÃÂ¨le mariage" pour dÃÂÃÂ©marrer.</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {[...(ev.programme||[])].sort(function(a,b){ return (a.time||"").localeCompare(b.time||""); }).map(function(step, si){
                  var pi = (ev.programme||[]).findIndex(function(p){ return p.id === step.id; });
                  return (
                    <div key={step.id} style={{ display:"flex", gap:0 }}>
                      {/* Timeline line */}
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:16, flexShrink:0 }}>
                        <div style={{ width:12,height:12,borderRadius:"50%",background:C.gold,border:"2px solid "+C.gold,marginTop:18,flexShrink:0 }}/>
                        {si < (ev.programme||[]).length-1 && <div style={{ width:2,flex:1,background:C.border,minHeight:20 }}/>}
                      </div>
                      {/* Content */}
                      <div style={{ flex:1, background:C.mid+"44", border:"1px solid "+C.border+"33", borderRadius:12, padding:"12px 16px", marginBottom:8, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                        <input type="time" value={step.time||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],time:v}; return {...evUp,programme:p}; }); }}
                          style={{ background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.gold, fontSize:13, padding:"4px 8px", fontFamily:"inherit", fontWeight:700, minWidth:80 }}/>
                        <span style={{ fontSize:18 }}>{step.icon||"ÃÂ°ÃÂÃÂÃÂ"}</span>
                        <input value={step.label} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],label:v}; return {...evUp,programme:p}; }); }}
                          style={{ flex:1, background:"none", border:"none", color:C.cream, fontSize:14, fontFamily:"inherit", outline:"none", minWidth:120 }}/>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <input type="number" value={step.duration||60} onChange={function(e){ var v=parseInt(e.target.value)||60; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],duration:v}; return {...evUp,programme:p}; }); }}
                            style={{ width:56, background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.muted, fontSize:11, padding:"4px 6px", fontFamily:"inherit", textAlign:"center" }}/>
                          <span style={{ color:C.muted, fontSize:11 }}>min</span>
                        </div>
                        <input value={step.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var p=[...(evUp.programme||[])]; p[pi]={...p[pi],notes:v}; return {...evUp,programme:p}; }); }}
                          placeholder="Notes / responsableÃÂ¢ÃÂÃÂ¦" style={{ flex:1, background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.muted, fontSize:12, padding:"4px 10px", fontFamily:"inherit", minWidth:100 }}/>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, programme:(evUp.programme||[]).filter(function(_,i){ return i!==pi; })}; }); }}
                          style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Prestataires ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ color:C.gold, fontWeight:400, fontSize:14, margin:0 }}>ÃÂ°ÃÂÃÂ¤ÃÂ Prestataires</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="ghost" onClick={function(){
                  updateEv(function(evUp){
                    return {...evUp, suppliers:[...(evUp.suppliers||[]), {id:Date.now(), role:"", name:"", phone:"", email:"", status:"pending", notes:""}]};
                  });
                }}>+ Prestataire</Btn>
              </div>

              {(ev.suppliers||[]).length === 0 && (
                <p style={{ color:C.muted, fontStyle:"italic", textAlign:"center", padding:20 }}>Aucun prestataire. Ajoutez vos contacts clÃÂÃÂ©s (traiteur, DJ, photographeÃÂ¢ÃÂÃÂ¦).</p>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.suppliers||[]).map(function(sup, si){
                  var statusColor = {confirmed:C.green, pending:"#FF9800", cancelled:C.red}[sup.status||"pending"];
                  var statusIcon  = {confirmed:"ÃÂ¢ÃÂÃÂ", pending:"ÃÂ¢ÃÂÃÂ³", cancelled:"ÃÂ¢ÃÂÃÂ"}[sup.status||"pending"];
                  return (
                    <div key={sup.id} style={{ background:C.mid+"44", border:"1px solid "+C.border+"33", borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                        <select value={sup.role||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],role:v}; return {...evUp,suppliers:s}; }); }}
                          style={{ background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.gold, fontSize:12, padding:"4px 8px", fontFamily:"inherit" }}>
                          <option value="">ÃÂ¢ÃÂÃÂ RÃÂÃÂ´le ÃÂ¢ÃÂÃÂ</option>
                          <option value="Traiteur">ÃÂ°ÃÂÃÂÃÂ½ Traiteur</option>
                          <option value="DJ">ÃÂ°ÃÂÃÂÃÂµ DJ</option>
                          <option value="Musicien">ÃÂ°ÃÂÃÂÃÂ¹ Musicien</option>
                          <option value="Photographe">ÃÂ°ÃÂÃÂÃÂ· Photographe</option>
                          <option value="VidÃÂÃÂ©aste">ÃÂ°ÃÂÃÂÃÂ¬ VidÃÂÃÂ©aste</option>
                          <option value="Fleuriste">ÃÂ°ÃÂÃÂÃÂ¸ Fleuriste</option>
                          <option value="DÃÂÃÂ©corateur">ÃÂ°ÃÂÃÂÃÂ¨ DÃÂÃÂ©corateur</option>
                          <option value="Salle">ÃÂ°ÃÂÃÂÃÂ Salle</option>
                          <option value="Transport">ÃÂ°ÃÂÃÂÃÂ Transport</option>
                          <option value="Animation">ÃÂ°ÃÂÃÂÃÂ­ Animation</option>
                          <option value="Autre">ÃÂ°ÃÂÃÂÃÂ¦ Autre</option>
                        </select>
                        <input value={sup.name||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],name:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="Nom / sociÃÂÃÂ©tÃÂÃÂ©" style={{ flex:1, background:"none", border:"none", color:C.cream, fontSize:14, fontFamily:"inherit", outline:"none" }}/>
                        <span style={{ fontSize:16 }}>{statusIcon}</span>
                        <select value={sup.status||"pending"} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],status:v}; return {...evUp,suppliers:s}; }); }}
                          style={{ background:statusColor+"22", border:"1px solid "+statusColor+"66", borderRadius:6, color:statusColor, fontSize:11, padding:"4px 8px", fontFamily:"inherit" }}>
                          <option value="pending">ÃÂ¢ÃÂÃÂ³ En cours</option>
                          <option value="confirmed">ÃÂ¢ÃÂÃÂ ConfirmÃÂÃÂ©</option>
                          <option value="cancelled">ÃÂ¢ÃÂÃÂ AnnulÃÂÃÂ©</option>
                        </select>
                        <button onClick={function(){ updateEv(function(evUp){ return {...evUp, suppliers:(evUp.suppliers||[]).filter(function(_,i){ return i!==si; })}; }); }}
                          style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <input value={sup.phone||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],phone:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="ÃÂ°ÃÂÃÂÃÂ TÃÂÃÂ©lÃÂÃÂ©phone" style={{ flex:1, padding:"5px 10px", background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:12, fontFamily:"inherit", minWidth:120 }}/>
                        <input value={sup.email||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],email:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Email" style={{ flex:1, padding:"5px 10px", background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:12, fontFamily:"inherit", minWidth:120 }}/>
                        <input value={sup.notes||""} onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var s=[...(evUp.suppliers||[])]; s[si]={...s[si],notes:v}; return {...evUp,suppliers:s}; }); }}
                          placeholder="Notes, tarifs, contratÃÂ¢ÃÂÃÂ¦" style={{ flex:2, padding:"5px 10px", background:C.card, border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:12, fontFamily:"inherit", minWidth:160 }}/>
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
              {ev.constraints.length===0 && <p style={{ color:C.muted }}>Aucune contrainte dÃÂÃÂ©finie.</p>}
              {ev.constraints.map(c=>{
                const g1=ev.guests.find(g=>g.id===c.a)?.name||"?";
                const g2=ev.guests.find(g=>g.id===c.b)?.name||"?";
                return (
                  <div key={c.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,background:c.type==="together"?C.green+"18":C.red+"18",border:`1px solid ${c.type==="together"?C.green:C.red}44` }}>
                    <span style={{ fontSize:18 }}>{c.type==="together"?"ÃÂ°ÃÂÃÂ¤ÃÂ":"ÃÂ¢ÃÂÃÂ¡"}</span>
                    <strong style={{ color:C.cream }}>{g1}</strong>
                    <span style={{ color:C.muted }}>{c.type==="together"?"avec":"loin de"}</span>
                    <strong style={{ color:C.cream }}>{g2}</strong>
                    <div style={{flex:1}}/>
                    <button onClick={()=>updateEv(e=>({...e,constraints:e.constraints.filter(x=>x.id!==c.id)}))}
                      style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14 }}>ÃÂ¢ÃÂÃÂ</button>
                  </div>
                );
              })}
            </div>
            <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20 }}>
              <p style={{ color:C.muted, margin:0, fontSize:13, lineHeight:1.8 }}>
                <strong style={{ color:C.gold }}>ÃÂ°ÃÂÃÂ¤ÃÂ {t && t.lang === "fr" ? "Ensemble" : "Together"} :</strong> {t && t.lang === "fr" ? "ces invitÃÂÃÂ©s seront ÃÂÃÂ  la mÃÂÃÂªme table" : "these guests will be at the same table"}.<br/>
                <strong style={{ color:C.gold }}>ÃÂ¢ÃÂÃÂ¡ SÃÂÃÂ©parÃÂÃÂ©s :</strong> ces invitÃÂÃÂ©s seront ÃÂÃÂ  des tables diffÃÂÃÂ©rentes.<br/>
                Cliquez <strong style={{ color:C.gold }}>{t.autoPlace}</strong> pour appliquer automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ RSVP TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="rsvp" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Compteurs RSVP */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                {label:"ConfirmÃÂÃÂ©s",val:rsvpConfirmed,color:C.green,icon:"ÃÂ¢ÃÂÃÂ"},
                {label:"En attente",val:rsvpPending,color:C.gold,icon:"ÃÂ¢ÃÂÃÂ³"},
                {label:"DÃÂÃÂ©clinÃÂÃÂ©s",val:rsvpDeclined,color:C.red,icon:"ÃÂ¢ÃÂÃÂ"},
              ].map(s=>(
                <div key={s.label} style={{ background:C.card, border:`1px solid ${s.color}44`, borderRadius:14, padding:"20px 24px", textAlign:"center" }}>
                  <div style={{ fontSize:28 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, color:s.color, margin:"4px 0" }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ color:C.muted, fontSize:12 }}>Taux de rÃÂÃÂ©ponse</span>
                <span style={{ color:C.gold, fontSize:12, fontWeight:700 }}>{ev.guests.length>0?Math.round((rsvpConfirmed+rsvpDeclined)/ev.guests.length*100):0}%</span>
              </div>
              <div style={{ height:8, background:C.mid, borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${ev.guests.length>0?(rsvpConfirmed+rsvpDeclined)/ev.guests.length*100:0}%`, background:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99 }}/>
              </div>
            </div>
            {/* Liste invitÃÂÃÂ©s avec statut RSVP */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ Suivi par invitÃÂÃÂ©</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="muted" onClick={()=>{
                  updateEv(e=>({...e, guests:e.guests.map(g=>g.rsvp?g:{...g,rsvp:"pending"})}));
                }}>Marquer tous en attente</Btn>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ev.guests.map(g=>(
                  <div key={g.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.mid+"55", borderRadius:10 }}>
                    <div style={{ width:32,height:32,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:13,fontWeight:700 }}>{g.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:C.cream, fontSize:14 }}>{g.name}</div>
                      {g.email && <div style={{ color:C.muted, fontSize:11 }}>{g.email}</div>}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      {[["confirmed","ÃÂ¢ÃÂÃÂ","ConfirmÃÂÃÂ©",C.green],["pending","ÃÂ¢ÃÂÃÂ³","En attente",C.gold],["declined","ÃÂ¢ÃÂÃÂ","DÃÂÃÂ©clinÃÂÃÂ©",C.red]].map(([v,ic,lb,col])=>(
                        <button key={v} onClick={()=>updateEv(e=>({...e,guests:e.guests.map(x=>x.id===g.id?{...x,rsvp:v}:x)}))}
                          style={{ padding:"4px 10px", borderRadius:8, border:`1.5px solid ${(!g.rsvp&&v==="pending")||g.rsvp===v?col:C.border}`,
                            background:(!g.rsvp&&v==="pending")||g.rsvp===v?col+"22":"none",
                            color:(!g.rsvp&&v==="pending")||g.rsvp===v?col:C.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                          {ic} {lb}
                        </button>
                      ))}
                    </div>
                    {g.rsvpNote && <span style={{ color:C.muted, fontSize:11, fontStyle:"italic", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.rsvpNote}</span>}
                    <input
                      value={g.rsvpNote||""} onChange={e=>{const v=e.target.value; updateEv(ev2=>({...ev2,guests:ev2.guests.map(x=>x.id===g.id?{...x,rsvpNote:v}:x)}));}}
                      placeholder="NoteÃÂ¢ÃÂÃÂ¦"
                      style={{ width:120, padding:"4px 8px", background:"#fff1", border:`1px solid ${C.border}`, borderRadius:6, color:C.cream, fontSize:11, fontFamily:"inherit" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ BUDGET TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="budget" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* RÃÂÃÂ©sumÃÂÃÂ© */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                {label:"Budget estimÃÂÃÂ©",val:budgetTotal.toLocaleString("fr-FR",{minimumFractionDigits:0})+" ÃÂ¢ÃÂÃÂ¬",color:C.gold,icon:"ÃÂ°ÃÂÃÂÃÂ"},
                {label:"DÃÂÃÂ©penses rÃÂÃÂ©elles",val:budgetSpent.toLocaleString("fr-FR",{minimumFractionDigits:0})+" ÃÂ¢ÃÂÃÂ¬",color:budgetSpent>budgetTotal?C.red:C.green,icon:"ÃÂ°ÃÂÃÂÃÂ³"},
                {label:"ÃÂÃÂcart",val:(budgetTotal-budgetSpent>=0?"+":"")+((budgetTotal-budgetSpent).toLocaleString("fr-FR",{minimumFractionDigits:0}))+" ÃÂ¢ÃÂÃÂ¬",color:budgetTotal-budgetSpent>=0?C.green:C.red,icon:budgetTotal-budgetSpent>=0?"ÃÂ¢ÃÂÃÂ":"ÃÂ¢ÃÂÃÂ ÃÂ¯ÃÂ¸ÃÂ"},
              ].map(s=>(
                <div key={s.label} style={{ background:C.card, border:`1px solid ${s.color}44`, borderRadius:14, padding:"18px 22px" }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Barre de progression */}
            {budgetTotal>0 && (
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:C.muted, fontSize:12 }}>Consommation du budget</span>
                  <span style={{ color:budgetSpent>budgetTotal?C.red:C.gold, fontSize:12, fontWeight:700 }}>{Math.round(budgetSpent/budgetTotal*100)}%</span>
                </div>
                <div style={{ height:10, background:C.mid, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.min(budgetSpent/budgetTotal*100,100)}%`, background:budgetSpent>budgetTotal?C.red:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99, transition:"width .3s" }}/>
                </div>
              </div>
            )}
            {/* Lignes budget */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ Postes budgÃÂÃÂ©taires</h4>
                <div style={{ flex:1 }}/>
                <Btn small onClick={()=>setShowAddBudget(true)}>+ Ajouter un poste</Btn>
              </div>
              {(ev.budget||[]).length===0 && <p style={{ color:C.muted, fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucun poste budgÃÂÃÂ©taire. Ajoutez vos premiÃÂÃÂ¨res dÃÂÃÂ©penses !</p>}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(ev.budget||[]).map((b,bi)=>{
                  const cat = BUDGET_CATEGORIES.find(c=>c.id===b.category)||BUDGET_CATEGORIES[0];
                  const pct = b.estimated>0?Math.min(b.actual/b.estimated*100,100):0;
                  return (
                    <div key={bi} style={{ background:C.mid+"55", borderRadius:12, padding:"14px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:20 }}>{cat.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ color:C.cream, fontSize:14, fontWeight:600 }}>{b.label||cat.label}</div>
                          {b.notes && <div style={{ color:C.muted, fontSize:11, fontStyle:"italic" }}>{b.notes}</div>}
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ color:C.muted, fontSize:11 }}>EstimÃÂÃÂ© : <span style={{ color:C.gold }}>{(parseFloat(b.estimated)||0).toLocaleString("fr-FR")} ÃÂ¢ÃÂÃÂ¬</span></div>
                          <div style={{ color:C.muted, fontSize:11 }}>RÃÂÃÂ©el : <span style={{ color:(b.actual||0)>(b.estimated||0)?C.red:C.green }}>{(parseFloat(b.actual)||0).toLocaleString("fr-FR")} ÃÂ¢ÃÂÃÂ¬</span></div>
                        </div>
                        <span style={{ fontSize:18, cursor:"pointer", color:b.paid?"#4CAF50":C.muted }} title={b.paid?"PayÃÂÃÂ©":"Non payÃÂÃÂ©"}
                          onClick={()=>updateEv(ev2=>({...ev2,budget:ev2.budget.map((x,i)=>i===bi?{...x,paid:!x.paid}:x)}))}>
                          {b.paid?"ÃÂ¢ÃÂÃÂ":"ÃÂ°ÃÂÃÂÃÂ³"}
                        </span>
                        <button onClick={()=>updateEv(ev2=>({...ev2,budget:(ev2.budget||[]).filter((_,i)=>i!==bi)}))}
                          style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                      </div>
                      {b.estimated>0 && (
                        <div style={{ height:4, background:C.mid, borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:pct>=100?C.red:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99 }}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* RÃÂÃÂ©partition par catÃÂÃÂ©gorie */}
              {(ev.budget||[]).length>0 && (
                <div style={{ marginTop:20, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
                  <h5 style={{ color:C.muted, fontSize:12, letterSpacing:1, marginBottom:12 }}>RÃÂÃÂPARTITION PAR CATÃÂÃÂGORIE</h5>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {BUDGET_CATEGORIES.map(cat=>{
                      const total = (ev.budget||[]).filter(b=>b.category===cat.id).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
                      if (!total) return null;
                      return (
                        <div key={cat.id} style={{ background:C.mid, borderRadius:8, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
                          <span>{cat.icon}</span>
                          <span style={{ color:C.cream, fontSize:12 }}>{cat.label}</span>
                          <span style={{ color:C.gold, fontSize:12, fontWeight:700 }}>{total.toLocaleString("fr-FR")} ÃÂ¢ÃÂÃÂ¬</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ PLANNING TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="planning" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:20 }}>
            {/* Progress */}
            {planningTotal>0 && (
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:C.muted, fontSize:12 }}>TÃÂÃÂ¢ches complÃÂÃÂ©tÃÂÃÂ©es</span>
                  <span style={{ color:C.gold, fontSize:12, fontWeight:700 }}>{planningDone}/{planningTotal}</span>
                </div>
                <div style={{ height:8, background:C.mid, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${planningTotal>0?planningDone/planningTotal*100:0}%`, background:`linear-gradient(90deg,${C.green},${C.gold})`, borderRadius:99, transition:"width .3s" }}/>
                </div>
              </div>
            )}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ RÃÂÃÂ©troplanning</h4>
                <div style={{ flex:1 }}/>
                <Btn small variant="muted" onClick={()=>{
                  // GÃÂÃÂ©nÃÂÃÂ©rer un rÃÂÃÂ©troplanning IA
                  setAiAssistOpen(true);
                  sendAiAssist && setTimeout(()=>sendAiAssist("GÃÂÃÂ©nÃÂÃÂ¨re-moi un rÃÂÃÂ©troplanning type pour "+ev.name+" (type: "+ev.type+") avec des tÃÂÃÂ¢ches concrÃÂÃÂ¨tes J-90, J-60, J-30, J-14, J-7, J-1 et Jour J. Format : une tÃÂÃÂ¢che par ligne avec la date relative."),100);
                }}>ÃÂ¢ÃÂÃÂ¨ GÃÂÃÂ©nÃÂÃÂ©rer avec l'IA</Btn>
                <div style={{ width:8 }}/>
                <Btn small onClick={()=>setShowAddTask(true)}>+ TÃÂÃÂ¢che</Btn>
              </div>
              {(ev.planning||[]).length===0 && <p style={{ color:C.muted, fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucune tÃÂÃÂ¢che. Ajoutez vos premiÃÂÃÂ¨res ÃÂÃÂ©tapes ou demandez ÃÂÃÂ  l'IA de gÃÂÃÂ©nÃÂÃÂ©rer un rÃÂÃÂ©troplanning !</p>}
              {/* GroupÃÂÃÂ© par prioritÃÂÃÂ© / date */}
              {["high","medium","low"].map(prio=>{
                const tasks = (ev.planning||[]).filter(t=>t.priority===prio);
                if (!tasks.length) return null;
                const prioConfig = {high:{label:"ÃÂ°ÃÂÃÂÃÂ´ Urgent",color:C.red},medium:{label:"ÃÂ°ÃÂÃÂÃÂ¡ Normal",color:C.gold},low:{label:"ÃÂ°ÃÂÃÂÃÂ¢ Faible prioritÃÂÃÂ©",color:C.green}};
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
                              {task.done?"ÃÂ¢ÃÂÃÂ":"ÃÂ¢ÃÂ¬ÃÂ"}
                            </span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:task.done?C.muted:C.cream, fontSize:14, textDecoration:task.done?"line-through":"none" }}>{task.title}</div>
                              <div style={{ display:"flex", gap:12, marginTop:2 }}>
                                {task.dueDate && <span style={{ color:overdue?C.red:C.muted, fontSize:11 }}>ÃÂ°ÃÂÃÂÃÂ {task.dueDate}{overdue?" ÃÂ¢ÃÂÃÂ ÃÂ¯ÃÂ¸ÃÂ En retard":""}</span>}
                                {task.responsible && <span style={{ color:C.muted, fontSize:11 }}>ÃÂ°ÃÂÃÂÃÂ¤ {task.responsible}</span>}
                                {task.notes && <span style={{ color:C.muted, fontSize:11, fontStyle:"italic" }}>{task.notes}</span>}
                              </div>
                            </div>
                            <button onClick={()=>updateEv(ev2=>({...ev2,planning:(ev2.planning||[]).filter((_,i)=>i!==tIdx)}))}
                              style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14 }}>ÃÂ°ÃÂÃÂÃÂ</button>
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

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ PROGRAMME TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="programme" && (
          <div style={{ maxWidth:900, display:"flex", gap:24, flexWrap:"wrap", alignItems:"start" }}>
            {/* Programme / Timeline jour J */}
            <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂµ Programme du jour J</h4>
                  <div style={{ flex:1 }}/>
                  <Btn small onClick={()=>setShowAddProgramItem(true)}>+ ÃÂÃÂtape</Btn>
                </div>
                {(ev.programme||[]).length===0 && <p style={{ color:C.muted, fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucune ÃÂÃÂ©tape. Construisez le dÃÂÃÂ©roulÃÂÃÂ© de votre journÃÂÃÂ©e !</p>}
                <div style={{ display:"flex", flexDirection:"column", position:"relative" }}>
                  {(ev.programme||[]).sort((a,b)=>a.time.localeCompare(b.time)).map((item,ii)=>(
                    <div key={ii} style={{ display:"flex", gap:14, position:"relative", paddingBottom:16 }}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ width:36,height:36,borderRadius:"50%",background:C.gold+"33",border:`2px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,zIndex:1 }}>{item.icon}</div>
                        {ii<(ev.programme||[]).length-1 && <div style={{ width:2,flex:1,background:C.gold+"22",marginTop:4 }}/>}
                      </div>
                      <div style={{ flex:1, paddingTop:6 }}>
                        <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                          <span style={{ color:C.gold, fontSize:14, fontWeight:700, minWidth:50 }}>{item.time}</span>
                          <span style={{ color:C.cream, fontSize:14 }}>{item.label}</span>
                        </div>
                        {item.notes && <div style={{ color:C.muted, fontSize:12, fontStyle:"italic", marginTop:2 }}>{item.notes}</div>}
                      </div>
                      <button onClick={()=>updateEv(ev2=>({...ev2,programme:(ev2.programme||[]).filter((_,i)=>i!==ii)}))}
                        style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,alignSelf:"start",marginTop:6 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Prestataires */}
            <div style={{ flex:"1 1 340px", display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
                <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                  <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂ¤ÃÂ Prestataires</h4>
                  <div style={{ flex:1 }}/>
                  <Btn small onClick={()=>setShowAddSupplier(true)}>+ Prestataire</Btn>
                </div>
                {(ev.suppliers||[]).length===0 && <p style={{ color:C.muted, fontSize:13, fontStyle:"italic", textAlign:"center", padding:24 }}>Aucun prestataire. Ajoutez vos contacts clÃÂÃÂ©s !</p>}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {(ev.suppliers||[]).map((s,si)=>(
                    <div key={si} style={{ background:C.mid+"55", borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ display:"flex", alignItems:"start", gap:10 }}>
                        <div style={{ width:38,height:38,borderRadius:"50%",background:C.gold+"22",border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:16,fontWeight:700,flexShrink:0 }}>
                          {s.name[0]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ color:C.cream, fontSize:14, fontWeight:600 }}>{s.name}</div>
                          {s.role && <div style={{ color:C.gold, fontSize:11 }}>{s.role}</div>}
                          {s.phone && <a href={"tel:"+s.phone} style={{ color:C.muted, fontSize:12, display:"block", textDecoration:"none" }}>ÃÂ°ÃÂÃÂÃÂ {s.phone}</a>}
                          {s.email && <a href={"mailto:"+s.email} style={{ color:C.muted, fontSize:12, display:"block", textDecoration:"none" }}>ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ {s.email}</a>}
                          {s.notes && <div style={{ color:C.muted, fontSize:11, fontStyle:"italic", marginTop:4 }}>{s.notes}</div>}
                        </div>
                        <button onClick={()=>updateEv(ev2=>({...ev2,suppliers:(ev2.suppliers||[]).filter((_,i)=>i!==si)}))}
                          style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ ROOM TAB ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
        {tab==="logistique" && (
          <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:24 }}>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ LIEUX & ADRESSES ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <h4 style={{ margin:"0 0 16px", color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ Lieux & Rendez-vous</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {(ev.venues||[]).map(function(venue, vi){ return (
                  <div key={vi} style={{ background:C.mid+"44", border:"1px solid "+C.border, borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20 }}>{venue.icon||"ÃÂ°ÃÂÃÂÃÂ"}</span>
                      <input
                        value={venue.name||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],name:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Nom du lieu (ex: Mairie, ÃÂÃÂglise, Salle des fÃÂÃÂªtes...)"
                        style={{ flex:1, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:14, fontFamily:"inherit" }}
                      />
                      <button onClick={function(){ updateEv(function(evUp){ return {...evUp, venues:(evUp.venues||[]).filter(function(_,i){ return i!==vi; })}; }); }}
                        style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                    </div>
                    <input
                      value={venue.address||""}
                      onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],address:v}; return {...evUp,venues:vens}; }); }}
                      placeholder="Adresse complÃÂÃÂ¨te"
                      style={{ padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:13, fontFamily:"inherit" }}
                    />
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                      <input
                        value={venue.time||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],time:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Heure (ex: 14h00)"
                        style={{ width:120, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:12, fontFamily:"inherit" }}
                      />
                      <input
                        value={venue.notes||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var vens=[...(evUp.venues||[])]; vens[vi]={...vens[vi],notes:v}; return {...evUp,venues:vens}; }); }}
                        placeholder="Notes (parking, code entrÃÂÃÂ©e...)"
                        style={{ flex:1, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:12, fontFamily:"inherit" }}
                      />
                      {venue.address && (
                        <a href={"https://maps.google.com/?q="+encodeURIComponent(venue.address)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ background:C.gold+"22", border:"1px solid "+C.gold+"44", borderRadius:6, padding:"6px 12px", color:C.gold, fontSize:12, textDecoration:"none" }}>
                          ÃÂ°ÃÂÃÂÃÂº Voir sur Maps
                        </a>
                      )}
                    </div>
                  </div>
                ); })}
                <button onClick={function(){
                  var icons = ["ÃÂ¢ÃÂÃÂª","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ©","ÃÂ°ÃÂÃÂÃÂ¿","ÃÂ°ÃÂÃÂÃÂ ","ÃÂ°ÃÂÃÂÃÂ½","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ"];
                  updateEv(function(evUp){ return {...evUp, venues:[...(evUp.venues||[]), {name:"",address:"",time:"",notes:"",icon:icons[Math.floor(Math.random()*icons.length)]}]}; });
                }} style={{ background:C.card, border:"1px dashed "+C.border, borderRadius:10, padding:"12px", cursor:"pointer", color:C.muted, fontFamily:"inherit", fontSize:13 }}>
                  + Ajouter un lieu
                </button>
              </div>
            </div>

            {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ LISTE DE CADEAUX ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <h4 style={{ margin:0, color:C.gold, fontWeight:400, fontSize:16 }}>ÃÂ°ÃÂÃÂÃÂ Liste de cadeaux</h4>
                <div style={{ flex:1 }}/>
                <button onClick={function(){
                  var url = ev.giftList && ev.giftList.url;
                  if (url) { window.open(url, "_blank"); }
                }} style={{ background:C.gold+"22", border:"1px solid "+C.gold+"44", borderRadius:8, padding:"6px 14px", cursor:"pointer", color:C.gold, fontFamily:"inherit", fontSize:12, display:ev.giftList&&ev.giftList.url?"flex":"none", alignItems:"center", gap:6 }}>
                  ÃÂ°ÃÂÃÂÃÂ Voir la liste en ligne
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                  <label style={{ color:C.muted, fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>LIEN LISTE DE MARIAGE (Amazon, Marche de Mariage...)</label>
                  <input
                    value={(ev.giftList&&ev.giftList.url)||""}
                    onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, giftList:{...(ev2.giftList||{}), url:v}}; }); }}
                    placeholder="https://www.wishlist.fr/..."
                    style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:C.cream, fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color:C.muted, fontSize:11, letterSpacing:1, display:"block", marginBottom:4 }}>MESSAGE POUR LES INVITÃÂÃÂS</label>
                  <input
                    value={(ev.giftList&&ev.giftList.message)||""}
                    onChange={function(e){ var v=e.target.value; updateEv(function(ev2){ return {...ev2, giftList:{...(ev2.giftList||{}), message:v}}; }); }}
                    placeholder="Ex: Votre prÃÂÃÂ©sence est le plus beau cadeau. Si vous souhaitez nÃÂÃÂ©anmoins nous gÃÂÃÂ¢ter..."
                    style={{ width:"100%", padding:"8px 12px", background:"#fff1", border:"1px solid "+C.border, borderRadius:8, color:C.cream, fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color:C.muted, fontSize:11, letterSpacing:1, display:"block", marginBottom:8 }}>CADEAUX REÃÂÃÂUS</label>
                  {(ev.gifts||[]).map(function(gift, gi){ return (
                    <div key={gi} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"center" }}>
                      <span style={{ color:gift.received?"#4CAF50":C.muted, fontSize:18, cursor:"pointer" }}
                        onClick={function(){ updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],received:!gifts[gi].received}; return {...evUp,gifts}; }); }}>
                        {gift.received?"ÃÂ¢ÃÂÃÂ":"ÃÂ¢ÃÂ¬ÃÂ"}
                      </span>
                      <input
                        value={gift.name||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],name:v}; return {...evUp,gifts}; }); }}
                        placeholder="Nom du cadeau ou de l'expÃÂÃÂ©diteur"
                        style={{ flex:1, padding:"6px 10px", background:gift.received?"#0a2a0a":"#fff1", border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:13, fontFamily:"inherit", textDecoration:gift.received?"line-through":"none" }}
                      />
                      <input
                        value={gift.from||""}
                        onChange={function(e){ var v=e.target.value; updateEv(function(evUp){ var gifts=[...(evUp.gifts||[])]; gifts[gi]={...gifts[gi],from:v}; return {...evUp,gifts}; }); }}
                        placeholder="De la part de..."
                        style={{ width:150, padding:"6px 10px", background:"#fff1", border:"1px solid "+C.border, borderRadius:6, color:C.cream, fontSize:12, fontFamily:"inherit" }}
                      />
                      <button onClick={function(){ updateEv(function(evUp){ return {...evUp,gifts:(evUp.gifts||[]).filter(function(_,i){ return i!==gi; })}; }); }}
                        style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:14 }}>ÃÂ°ÃÂÃÂÃÂ</button>
                    </div>
                  ); })}
                  <button onClick={function(){
                    updateEv(function(evUp){ return {...evUp, gifts:[...(evUp.gifts||[]), {name:"",from:"",received:false}]}; });
                  }} style={{ background:C.card, border:"1px dashed "+C.border, borderRadius:6, padding:"6px 12px", cursor:"pointer", color:C.muted, fontFamily:"inherit", fontSize:12 }}>
                    + Ajouter un cadeau
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ MODALS ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
      <Modal open={showImportCSV} onClose={()=>setShowImportCSV(false)} title="Importer des invitÃÂÃÂ©s (CSV)" width={500}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:C.mid, borderRadius:10, padding:"12px 16px", fontSize:12, color:C.muted, lineHeight:1.8 }}>
            <strong style={{color:C.gold}}>Format attendu (1 invitÃÂÃÂ© par ligne) :</strong><br/>
            <code style={{color:C.cream}}>PrÃÂÃÂ©nom Nom, email@example.fr, standard</code><br/>
            RÃÂÃÂ©gimes : standard, vegetarien, vegan, sans-gluten, halal, casher, sans-lactose, sans-noix, diabetique
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
                name: parts[0] || "InvitÃÂÃÂ©",
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
            ÃÂ¢ÃÂ¬ÃÂ Importer {""} invitÃÂÃÂ©s
          </Btn>
        </div>
      </Modal>

      <Modal open={showAddGuest} onClose={()=>setShowAddGuest(false)} title="Ajouter un invitÃÂÃÂ©">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={t.fieldName}><Input value={newGuest.name} onChange={e=>setNewGuest({...newGuest,name:e.target.value})} placeholder="PrÃÂÃÂ©nom Nom"/></Field>
          <Field label={t.fieldEmail}><Input type="email" value={newGuest.email} onChange={e=>setNewGuest({...newGuest,email:e.target.value})} placeholder="email@example.fr"/></Field>
          <Field label="RÃÂÃÂGIME ALIMENTAIRE">
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
          <Field label="RÃÂÃÂLE / FONCTION">
            <select value={newGuest.role||""} onChange={e=>setNewGuest({...newGuest,role:e.target.value})}
              style={{ width:"100%", padding:"8px 12px", background:C.mid, border:"1px solid "+C.border, borderRadius:8, color:C.cream, fontSize:13, fontFamily:"inherit" }}>
              <option value="">ÃÂ¢ÃÂÃÂ Aucun rÃÂÃÂ´le spÃÂÃÂ©cial ÃÂ¢ÃÂÃÂ</option>
              <option value="marie1">ÃÂ°ÃÂÃÂÃÂ MariÃÂÃÂ©(e) 1</option>
              <option value="marie2">ÃÂ°ÃÂÃÂÃÂ MariÃÂÃÂ©(e) 2</option>
              <option value="temoin">ÃÂ°ÃÂÃÂÃÂ TÃÂÃÂ©moin</option>
              <option value="famille_proche">ÃÂ°ÃÂÃÂÃÂ¨ÃÂ¢ÃÂÃÂÃÂ°ÃÂÃÂÃÂ©ÃÂ¢ÃÂÃÂÃÂ°ÃÂÃÂÃÂ§ Famille proche</option>
              <option value="ami_proche">ÃÂ¢ÃÂ­ÃÂ Ami proche</option>
              <option value="enfant">ÃÂ°ÃÂÃÂ§ÃÂ Enfant</option>
              <option value="vip">ÃÂ°ÃÂÃÂÃÂ VIP</option>
              <option value="prestataire">ÃÂ°ÃÂÃÂÃÂ§ Prestataire</option>
            </select>
          </Field>
          <Field label="NOTES / ALLERGIES"><Input value={newGuest.notes} onChange={e=>setNewGuest({...newGuest,notes:e.target.value})} placeholder="Allergies, mobilitÃÂÃÂ© rÃÂÃÂ©duiteÃÂ¢ÃÂÃÂ¦"/></Field>
          <Btn onClick={addGuest} style={{marginTop:4}}>Ajouter l'invitÃÂÃÂ©</Btn>
        </div>
      </Modal>

      <Modal open={showAddTable} onClose={()=>setShowAddTable(false)} title="Ajouter une table">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={`${t.fieldNumber} (auto: ${nextTableNumber})`}><Input type="number" value={newTable.number} onChange={e=>setNewTable({...newTable,number:e.target.value})} placeholder={String(nextTableNumber)}/></Field>
          <Field label={t.fieldCapacity}><Input type="number" value={newTable.capacity} onChange={e=>setNewTable({...newTable,capacity:e.target.value})}/></Field>
          <Field label={t.fieldShape}>
            <div style={{ display:"flex", gap:8 }}>
              {[["round","ÃÂ¢ÃÂ¬ÃÂ¤ Ronde"],["rect","ÃÂ¢ÃÂÃÂ¬ Rectangle"]].map(([v,l])=>(
                <button key={v} onClick={()=>setNewTable({...newTable,shape:v})} style={{
                  flex:1, padding:"10px", borderRadius:10, border:`2px solid ${newTable.shape===v?C.gold:C.border}`,
                  background:newTable.shape===v?C.gold+"22":C.mid, cursor:"pointer", color:newTable.shape===v?C.gold:C.muted,
                  fontFamily:"inherit", fontSize:13, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label={`${t.fieldLabel} (optionnel)`}><Input value={newTable.label} onChange={e=>setNewTable({...newTable,label:e.target.value})} placeholder="ex: Famille, AmisÃÂ¢ÃÂÃÂ¦"/></Field>
          <Field label={`${t.fieldColor} (optionnel)`}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["#C9973A","#E84A6A","#4CAF50","#2196F3","#9C27B0","#FF9800","#8B7EC8","#E8845A"].map(col=>(
                <button key={col} onClick={()=>setNewTable({...newTable,color:col})} style={{
                  width:28, height:28, borderRadius:"50%", background:col, border:`3px solid ${newTable.color===col?"#fff":"transparent"}`,
                  cursor:"pointer", padding:0
                }}/>
              ))}
              <button onClick={()=>setNewTable({...newTable,color:undefined})} style={{width:28,height:28,borderRadius:"50%",background:"none",border:`2px solid ${C.border}`,cursor:"pointer",color:C.muted,fontSize:10}}>ÃÂ¢ÃÂÃÂ</button>
            </div>
          </Field>
          <Btn onClick={addTable} style={{marginTop:4}}>CrÃÂÃÂ©er la table</Btn>
        </div>
      </Modal>

      <Modal open={showAddZone} onClose={()=>{setShowAddZone(false);setNewZone({label:"",icon:"ÃÂ°ÃÂÃÂÃÂ",color:"#C9973A"});}} title="Ajouter une zone">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE LA ZONE *">
            <Input value={newZone.label} onChange={e=>setNewZone({...newZone,label:e.target.value})} placeholder="ex: Piste de danse, Bar, ScÃÂÃÂ¨ne, Photo BoothÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <Field label="ICÃÂÃÂNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ­","ÃÂ°ÃÂÃÂÃÂ¹","ÃÂ°ÃÂÃÂÃÂ¸","ÃÂ°ÃÂÃÂ§ÃÂ","ÃÂ°ÃÂÃÂÃÂ¿","ÃÂ°ÃÂÃÂÃÂ½","ÃÂ°ÃÂÃÂ¥ÃÂ","ÃÂ°ÃÂÃÂÃÂ¤","ÃÂ°ÃÂÃÂÃÂ°","ÃÂ¢ÃÂÃÂ²","ÃÂ°ÃÂÃÂªÃÂ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ"].map(ic=>(
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
            setNewZone({label:"",icon:"ÃÂ°ÃÂÃÂÃÂ",color:"#C9973A"});
            setShowAddZone(false);
          }} style={{marginTop:4}}>Ajouter la zone</Btn>
        </div>
      </Modal>

      <Modal open={showAddFurniture} onClose={()=>{setShowAddFurniture(false);setNewFurniture({label:"",icon:"ÃÂ°ÃÂÃÂªÃÂ",color:"#8A7355",width:80,height:40});}} title="Ajouter du mobilier">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM *">
            <Input value={newFurniture.label} onChange={e=>setNewFurniture({...newFurniture,label:e.target.value})} placeholder="ex: Buffet, Piano, Podium, Bar, ScÃÂÃÂ¨neÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <Field label="ICÃÂÃÂNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["ÃÂ°ÃÂÃÂªÃÂ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ¹","ÃÂ°ÃÂÃÂÃÂ¤","ÃÂ°ÃÂÃÂÃÂ½","ÃÂ°ÃÂÃÂÃÂ¹","ÃÂ°ÃÂÃÂÃÂ°","ÃÂ°ÃÂÃÂÃÂº","ÃÂ°ÃÂÃÂÃÂ¼","ÃÂ°ÃÂÃÂÃÂ¿","ÃÂ°ÃÂÃÂÃÂ¯","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ­","ÃÂ°ÃÂÃÂÃÂ²"].map(ic=>(
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
            setNewFurniture({label:"",icon:"ÃÂ°ÃÂÃÂªÃÂ",color:"#8A7355",width:80,height:40});
            setShowAddFurniture(false);
          }} style={{marginTop:4}}>Ajouter le mobilier</Btn>
        </div>
      </Modal>

      {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ MODAL BUDGET ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
      <Modal open={showAddBudget} onClose={()=>{setShowAddBudget(false);setNewBudgetLine({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""}); }} title="Ajouter un poste budgÃÂÃÂ©taire">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="CATÃÂÃÂGORIE">
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
          <Field label="LIBELLÃÂÃÂ (optionnel)">
            <Input value={newBudgetLine.label} onChange={e=>setNewBudgetLine({...newBudgetLine,label:e.target.value})} placeholder="ex: ChÃÂÃÂ¢teau de Vincennes, DJ MartinÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="MONTANT ESTIMÃÂÃÂ (ÃÂ¢ÃÂÃÂ¬)">
              <Input type="number" value={newBudgetLine.estimated} onChange={e=>setNewBudgetLine({...newBudgetLine,estimated:parseFloat(e.target.value)||0})} placeholder="0"/>
            </Field>
            <Field label="MONTANT RÃÂÃÂEL (ÃÂ¢ÃÂÃÂ¬)">
              <Input type="number" value={newBudgetLine.actual} onChange={e=>setNewBudgetLine({...newBudgetLine,actual:parseFloat(e.target.value)||0})} placeholder="0"/>
            </Field>
          </div>
          <Field label="NOTES">
            <Input value={newBudgetLine.notes} onChange={e=>setNewBudgetLine({...newBudgetLine,notes:e.target.value})} placeholder="Acompte versÃÂÃÂ©, devis reÃÂÃÂ§uÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <label style={{ display:"flex", gap:10, alignItems:"center", fontSize:13, color:C.muted, cursor:"pointer" }}>
            <input type="checkbox" checked={newBudgetLine.paid} onChange={e=>setNewBudgetLine({...newBudgetLine,paid:e.target.checked})} style={{ width:16,height:16 }}/>
            DÃÂÃÂ©jÃÂÃÂ  payÃÂÃÂ© ÃÂ¢ÃÂÃÂ
          </label>
          <Btn onClick={()=>{
            updateEv(ev2=>({...ev2, budget:[...(ev2.budget||[]), {...newBudgetLine}]}));
            setNewBudgetLine({category:"salle",label:"",estimated:0,actual:0,paid:false,notes:""});
            setShowAddBudget(false);
          }} style={{marginTop:4}}>Ajouter ce poste</Btn>
        </div>
      </Modal>

      {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ MODAL TÃÂÃÂCHE PLANNING ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
      <Modal open={showAddTask} onClose={()=>{setShowAddTask(false);setNewTask({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});}} title="Ajouter une tÃÂÃÂ¢che">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="TÃÂÃÂCHE *">
            <Input value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} placeholder="ex: Confirmer le traiteur, Envoyer les invitationsÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="DATE LIMITE">
              <Input type="date" value={newTask.dueDate} onChange={e=>setNewTask({...newTask,dueDate:e.target.value})}/>
            </Field>
            <Field label="RESPONSABLE">
              <Input value={newTask.responsible} onChange={e=>setNewTask({...newTask,responsible:e.target.value})} placeholder="ex: Marie, TraiteurÃÂ¢ÃÂÃÂ¦"/>
            </Field>
          </div>
          <Field label="PRIORITÃÂÃÂ">
            <div style={{ display:"flex", gap:8 }}>
              {[["high","ÃÂ°ÃÂÃÂÃÂ´ Urgent",C.red],["medium","ÃÂ°ÃÂÃÂÃÂ¡ Normal",C.gold],["low","ÃÂ°ÃÂÃÂÃÂ¢ Faible",C.green]].map(([v,l,col])=>(
                <button key={v} onClick={()=>setNewTask({...newTask,priority:v})} style={{
                  flex:1, padding:"9px 6px", borderRadius:10, border:`2px solid ${newTask.priority===v?col:C.border}`,
                  background:newTask.priority===v?col+"22":C.mid, cursor:"pointer", color:newTask.priority===v?col:C.muted,
                  fontFamily:"inherit", fontSize:12, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="NOTES (optionnel)">
            <Input value={newTask.notes} onChange={e=>setNewTask({...newTask,notes:e.target.value})} placeholder="PrÃÂÃÂ©cisionsÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <Btn disabled={!newTask.title.trim()} onClick={()=>{
            updateEv(ev2=>({...ev2, planning:[...(ev2.planning||[]), {...newTask}]}));
            setNewTask({title:"",dueDate:"",responsible:"",priority:"medium",done:false,notes:""});
            setShowAddTask(false);
          }} style={{marginTop:4}}>Ajouter la tÃÂÃÂ¢che</Btn>
        </div>
      </Modal>

      {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ MODAL PROGRAMME ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
      <Modal open={showAddProgramItem} onClose={()=>{setShowAddProgramItem(false);setNewProgramItem({time:"",label:"",icon:"ÃÂ°ÃÂÃÂÃÂ¤",notes:""}); }} title="Ajouter une ÃÂÃÂ©tape au programme">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="HEURE">
              <Input type="time" value={newProgramItem.time} onChange={e=>setNewProgramItem({...newProgramItem,time:e.target.value})}/>
            </Field>
            <Field label="ÃÂÃÂTAPE *">
              <Input value={newProgramItem.label} onChange={e=>setNewProgramItem({...newProgramItem,label:e.target.value})} placeholder="ex: Vin d'honneur, DÃÂÃÂ®ner, Ouverture de balÃÂ¢ÃÂÃÂ¦"/>
            </Field>
          </div>
          <Field label="ICÃÂÃÂNE">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["ÃÂ°ÃÂÃÂ¥ÃÂ","ÃÂ°ÃÂÃÂÃÂ½","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ¤","ÃÂ°ÃÂÃÂÃÂ¸","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ­","ÃÂ°ÃÂÃÂÃÂ»","ÃÂ°ÃÂÃÂÃÂµ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ","ÃÂ°ÃÂÃÂÃÂ"].map(ic=>(
                <button key={ic} onClick={()=>setNewProgramItem({...newProgramItem,icon:ic})} style={{
                  width:38,height:38,borderRadius:8,fontSize:20,background:newProgramItem.icon===ic?C.gold+"33":C.mid,
                  border:`2px solid ${newProgramItem.icon===ic?C.gold:C.border}`,cursor:"pointer",
                }}>{ic}</button>
              ))}
            </div>
          </Field>
          <Field label="NOTES (optionnel)">
            <Input value={newProgramItem.notes} onChange={e=>setNewProgramItem({...newProgramItem,notes:e.target.value})} placeholder="DurÃÂÃÂ©e, lieu, responsableÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <Btn disabled={!newProgramItem.label.trim()||!newProgramItem.time} onClick={()=>{
            updateEv(ev2=>({...ev2, programme:[...(ev2.programme||[]), {...newProgramItem}]}));
            setNewProgramItem({time:"",label:"",icon:"ÃÂ°ÃÂÃÂÃÂ¤",notes:""});
            setShowAddProgramItem(false);
          }} style={{marginTop:4}}>Ajouter l'ÃÂÃÂ©tape</Btn>
        </div>
      </Modal>

      {/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ MODAL PRESTATAIRE ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ */}
      <Modal open={showAddSupplier} onClose={()=>{setShowAddSupplier(false);setNewSupplier({name:"",role:"",phone:"",email:"",notes:""}); }} title="Ajouter un prestataire">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM / SOCIÃÂÃÂTÃÂÃÂ *">
            <Input value={newSupplier.name} onChange={e=>setNewSupplier({...newSupplier,name:e.target.value})} placeholder="ex: DJ Martin, Fleurs du Soleil, Photos by JulieÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <Field label="RÃÂÃÂLE / PRESTATION">
            <Input value={newSupplier.role} onChange={e=>setNewSupplier({...newSupplier,role:e.target.value})} placeholder="ex: DJ, Fleuriste, Photographe, TraiteurÃÂ¢ÃÂÃÂ¦"/>
          </Field>
          <div style={{ display:"flex", gap:12 }}>
            <Field label="TÃÂÃÂLÃÂÃÂPHONE">
              <Input type="tel" value={newSupplier.phone} onChange={e=>setNewSupplier({...newSupplier,phone:e.target.value})} placeholder="06 00 00 00 00"/>
            </Field>
            <Field label="EMAIL">
              <Input type="email" value={newSupplier.email} onChange={e=>setNewSupplier({...newSupplier,email:e.target.value})} placeholder="contact@prestataire.fr"/>
            </Field>
          </div>
          <Field label="NOTES (contrat, acompte, horairesÃÂ¢ÃÂÃÂ¦)">
            <Input value={newSupplier.notes} onChange={e=>setNewSupplier({...newSupplier,notes:e.target.value})} placeholder="Contrat signÃÂÃÂ©, acompte versÃÂÃÂ©, arrivÃÂÃÂ©e 14hÃÂ¢ÃÂÃÂ¦"/>
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
          <Field label="PREMIER INVITÃÂÃÂ">
            <Select value={constraint.a} onChange={e=>setConstraint({...constraint,a:parseInt(e.target.value)||e.target.value})}>
              <option value="">ÃÂ¢ÃÂÃÂ Choisir ÃÂ¢ÃÂÃÂ</option>
              {ev.guests.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
          </Field>
          <Field label={t.settingType}>
            <div style={{ display:"flex", gap:8 }}>
              {[["together","ÃÂ°ÃÂÃÂ¤ÃÂ Ensemble",C.green],["apart","ÃÂ¢ÃÂÃÂ¡ SÃÂÃÂ©parÃÂÃÂ©s",C.red]].map(([v,l,col])=>(
                <button key={v} onClick={()=>setConstraint({...constraint,type:v})} style={{
                  flex:1, padding:"10px", borderRadius:10, border:`2px solid ${constraint.type===v?col:C.border}`,
                  background:constraint.type===v?col+"22":C.mid, cursor:"pointer", color:constraint.type===v?col:C.muted,
                  fontFamily:"inherit", fontSize:13, fontWeight:700,
                }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="DEUXIÃÂÃÂME INVITÃÂÃÂ">
            <Select value={constraint.b} onChange={e=>setConstraint({...constraint,b:parseInt(e.target.value)||e.target.value})}>
              <option value="">ÃÂ¢ÃÂÃÂ Choisir ÃÂ¢ÃÂÃÂ</option>
              {ev.guests.filter(g=>g.id!==constraint.a).map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
          </Field>
          <Btn onClick={addConstraint} style={{marginTop:4}}>Ajouter</Btn>
        </div>
      </Modal>

      <Modal open={showQR} onClose={()=>setShowQR(false)} title={`QR Code ÃÂ¢ÃÂÃÂ ${ev.name}`} width={400}>
        <div style={{ textAlign:"center" }} id="qr-modal">
          <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Partagez ce QR code avec vos invitÃÂÃÂ©s pour qu'ils renseignent leurs prÃÂÃÂ©fÃÂÃÂ©rences.</p>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <div style={{ padding:16,background:C.cream,borderRadius:16,border:`2px solid ${C.border}`,display:"inline-block" }}>
              <QRCodeWidget value={`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`} size={180}/>
            </div>
          </div>
          <div style={{ background:C.mid,borderRadius:8,padding:"8px 16px",fontSize:12,color:C.muted,marginBottom:20,fontFamily:"monospace",cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}
            onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`);}} title="Cliquer pour copier">
            tableplan-seven.vercel.app/?join={ev.id} (ÃÂ°ÃÂÃÂÃÂ via Partager) <span style={{fontSize:10}}>ÃÂ°ÃÂÃÂÃÂ</span>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn small onClick={()=>{const c=document.querySelector("#qr-modal canvas");if(!c){alert("QR non disponible");return;}const l=document.createElement("a");l.download=`QR-${ev.name}.png`;l.href=c.toDataURL("image/png");l.click();}}>ÃÂ¢ÃÂ¬ÃÂ PNG</Btn>
            <Btn small variant="ghost" onClick={()=>{navigator.clipboard.writeText(`https://tableplan-seven.vercel.app/?join=${(window.firebase?.auth?.().currentUser?.uid||"")}___${ev.id}`).then(()=>alert("Lien copiÃÂÃÂ© !"))}}>ÃÂ°ÃÂÃÂÃÂ Copier le lien</Btn>
            <Btn small variant="muted" onClick={()=>setShowSettings(false)}>ÃÂ°ÃÂÃÂÃÂ¨ Imprimer</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={showSettings} onClose={()=>setShowSettings(false)} title="ParamÃÂÃÂ¨tres de l'ÃÂÃÂ©vÃÂÃÂ©nement">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label={t.settingName}><Input value={ev.name} onChange={e=>updateEv(evUp=>({...evUp,name:e.target.value}))}/></Field>
          <Field label={t.settingDate}><Input type="date" value={ev.date} onChange={e=>updateEv(evUp=>({...evUp,date:e.target.value}))}/></Field>
          <Field label={t.eventNotes}>
            <textarea value={ev.notes||""} onChange={e=>updateEv(evUp=>({...evUp,notes:e.target.value}))} rows={3}
              placeholder="Salle des fÃÂÃÂªtes, traiteur, prestataires..."
              style={{...inputStyle, resize:"vertical", lineHeight:1.6}}/>
          </Field>
          <Field label={t.settingType}>
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// VOUCHER MODAL
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function VoucherModal({ onClose, onApply }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleApply = () => {
    const v = VOUCHERS[code.trim().toUpperCase()];
    if (!v) {
      setMsg({ type: "error", text: "ÃÂ¢ÃÂÃÂ Code invalide ou expirÃÂÃÂ©" });
      return;
    }
    setSuccess(true);
    setMsg({ type: "success", text: `ÃÂ¢ÃÂÃÂ Code appliquÃÂÃÂ© : ${v.description}` });
    setTimeout(() => { onApply(code.trim().toUpperCase(), v); onClose(); }, 1800);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:40, width:380, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ</div>
        <h2 style={{ color:C.gold, margin:"0 0 8px", fontSize:22, fontWeight:400, letterSpacing:1 }}>Code promotionnel</h2>
        <p style={{ color:C.muted, fontSize:13, margin:"0 0 24px", lineHeight:1.6 }}>
          Entrez votre bon de rÃÂÃÂ©duction pour activer votre offre
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
            {success ? "ÃÂ¢ÃÂÃÂ AppliquÃÂÃÂ© !" : "Appliquer le code"}
          </button>
        </div>
        <div style={{ marginTop:20, fontSize:11, color:C.muted, lineHeight:1.8 }}>
          Codes actifs : <span style={{color:C.gold}}>BIENVENUE</span> ÃÂÃÂ· <span style={{color:C.gold}}>MARIAGE2026</span> ÃÂÃÂ· <span style={{color:C.gold}}>PARTENAIRE</span> ÃÂÃÂ· <span style={{color:C.gold}}>VIP100</span>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD (Admin view)
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function Dashboard({ user, events, setEvents, onLogout, onOpenEvent, lightMode, onToggleTheme, t, lang, setLang }) {
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newEv, setNewEv] = useState({ name:"", date:"", type:"mariage" });
  const [globalSearch, setGlobalSearch] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [toast, setToast] = useState(null); // {msg, type}
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({msg, type});
    setTimeout(()=>setToast(null), 3000);
  };

  var myEventsRaw = events.filter(function(ev2){ return ev2.ownerId === user.id; });
  var myEvents = !globalSearch ? myEventsRaw : myEventsRaw.filter(function(ev2){
    var q = globalSearch.toLowerCase();
    return ev2.name.toLowerCase().includes(q) ||
      (ev2.date||"").includes(q) ||
      (ev2.guests||[]).some(function(g2){ return g2.name.toLowerCase().includes(q) || (g2.email||"").toLowerCase().includes(q); });
  });

  function createEvent() {
    if (!newEv.name) return;
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
    showToast(`ÃÂ¢ÃÂÃÂ "${ev.name}" crÃÂÃÂ©ÃÂÃÂ© !`);
    onOpenEvent(ev.id);
    setShowNew(false);
  }

  const handleApplyVoucher = (code, voucher) => {
    setAppliedVoucher({ code, ...voucher });
    showToast(`ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Code "${code}" appliquÃÂÃÂ© !`);
  };

  // Calculs stats globales
  const totalGuests = myEventsRaw.reduce((s,e)=>s+(e.guests||[]).length,0);
  const totalTables = myEventsRaw.reduce((s,e)=>s+(e.tables||[]).length,0);
  const nextEvent = myEventsRaw.filter(e=>e.date && new Date(e.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];

  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 20% 0%, #2a1a0e 0%, ${C.dark} 55%)`, fontFamily:"Georgia,serif", color:C.cream }}>

      {/* Toast global */}
      {toast && (
        <div style={{
          position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
          zIndex:999, background:toast.type==="error"?C.red:C.card,
          border:`1px solid ${toast.type==="error"?C.red:C.gold}66`,
          borderRadius:12, padding:"12px 24px", fontSize:13, color:C.cream,
          boxShadow:"0 8px 32px #00000066",
          animation:"fadeInDown .25s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* NAV */}
      <div style={{ background:C.card+"ee", backdropFilter:"blur(8px)", borderBottom:`1px solid ${C.border}`, padding:"0 32px", display:"flex", alignItems:"center", height:60, position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:18, color:C.gold, letterSpacing:2, fontWeight:400 }}>ÃÂ°ÃÂÃÂªÃÂ TableMaÃÂÃÂ®tre</span>
        <div style={{flex:1}}/>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:"pointer", fontSize:12, padding:"5px 8px", fontFamily:"inherit", outline:"none" }}>
            {Object.entries(LANG_FLAGS).map(([code, flag]) => (<option key={code} value={code}>{flag} {LANG_NAMES[code]}</option>))}
          </select>
          <button onClick={onToggleTheme} style={{ padding:"6px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:"pointer", fontSize:15 }}>
            {lightMode ? "ÃÂ°ÃÂÃÂÃÂ" : "ÃÂ¢ÃÂÃÂÃÂ¯ÃÂ¸ÃÂ"}
          </button>
          <button onClick={()=>setShowVoucher(true)} style={{ padding:"6px 14px", background:"none", border:`1px solid ${C.gold}`, borderRadius:8, color:C.gold, cursor:"pointer", fontSize:12, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
            ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ Code promo{appliedVoucher && <span style={{background:C.gold,color:C.dark,borderRadius:4,padding:"1px 5px",fontSize:10,fontWeight:700}}>ÃÂ¢ÃÂÃÂ</span>}
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 10px", background:C.mid, borderRadius:99 }}>
            {user.photoURL
              ? <img src={user.photoURL} alt="" style={{ width:26,height:26,borderRadius:"50%",objectFit:"cover" }}/>
              : <div style={{ width:26,height:26,borderRadius:"50%",background:C.gold+"33",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontSize:11,fontWeight:700 }}>{user.avatar}</div>
            }
            <span style={{ color:C.muted, fontSize:12 }}>{user.name.split(" ")[0]}</span>
          </div>
          <button onClick={onLogout} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:"pointer", fontSize:12, padding:"6px 12px", fontFamily:"inherit" }}>DÃÂÃÂ©connexion</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 24px" }}>

        {/* HERO row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:40, flexWrap:"wrap", gap:20 }}>
          <div>
            <h1 style={{ fontSize:32, fontWeight:400, margin:"0 0 6px", letterSpacing:.5 }}>
              Bonjour, <span style={{ color:C.gold }}>{user.name.split(" ")[0]}</span> ÃÂ°ÃÂÃÂÃÂ
            </h1>
            <p style={{ color:C.muted, margin:0, fontSize:14 }}>
              {myEventsRaw.length === 0 ? "PrÃÂÃÂªt ÃÂÃÂ  crÃÂÃÂ©er votre premier ÃÂÃÂ©vÃÂÃÂ©nement ?" : `${myEventsRaw.length} ÃÂÃÂ©vÃÂÃÂ©nement${myEventsRaw.length>1?"s":""} ÃÂÃÂ· ${totalGuests} invitÃÂÃÂ©s ÃÂÃÂ· ${totalTables} tables`}
            </p>
          </div>
          <Btn onClick={()=>setShowNew(true)} style={{ fontSize:14, padding:"12px 28px" }}>+ Nouvel ÃÂÃÂ©vÃÂÃÂ©nement</Btn>
        </div>

        {/* KPI bar si on a des events */}
        {myEventsRaw.length > 0 && nextEvent && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 24px", marginBottom:32, display:"flex", gap:32, alignItems:"center", flexWrap:"wrap" }}>
            <div>
              <div style={{ color:C.muted, fontSize:11, letterSpacing:1, marginBottom:4 }}>PROCHAIN ÃÂÃÂVÃÂÃÂNEMENT</div>
              <div style={{ color:C.cream, fontSize:15, fontWeight:600 }}>{nextEvent.name}</div>
            </div>
            <div style={{ width:1, height:36, background:C.border }}/>
            {(() => {
              const days = Math.ceil((new Date(nextEvent.date)-new Date())/86400000);
              return (
                <div>
                  <div style={{ color:C.muted, fontSize:11, letterSpacing:1, marginBottom:4 }}>COMPTE ÃÂÃÂ REBOURS</div>
                  <div style={{ color:days<=7?C.red:days<=30?"#E8845A":C.gold, fontSize:22, fontWeight:700 }}>
                    {days===0?"Aujourd'hui !":days<0?"PassÃÂÃÂ©":`JÃÂ¢ÃÂÃÂ${days}`}
                  </div>
                </div>
              );
            })()}
            <div style={{ width:1, height:36, background:C.border }}/>
            <div>
              <div style={{ color:C.muted, fontSize:11, letterSpacing:1, marginBottom:4 }}>RSVP</div>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ color:C.green, fontSize:14, fontWeight:700 }}>ÃÂ¢ÃÂÃÂ {(nextEvent.guests||[]).filter(g=>g.rsvp==="confirmed").length}</span>
                <span style={{ color:C.gold, fontSize:14 }}>ÃÂ¢ÃÂÃÂ³ {(nextEvent.guests||[]).filter(g=>!g.rsvp||g.rsvp==="pending").length}</span>
                <span style={{ color:C.red, fontSize:14 }}>ÃÂ¢ÃÂÃÂ {(nextEvent.guests||[]).filter(g=>g.rsvp==="declined").length}</span>
              </div>
            </div>
            <div style={{ flex:1 }}/>
            <Btn small onClick={()=>onOpenEvent(nextEvent.id)}>Ouvrir ÃÂ¢ÃÂÃÂ</Btn>
          </div>
        )}

        {/* Search */}
        <div style={{ position:"relative", marginBottom:28 }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:C.muted, fontSize:16, pointerEvents:"none" }}>ÃÂ°ÃÂÃÂÃÂ</span>
          <input value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Rechercher un ÃÂÃÂ©vÃÂÃÂ©nement ou un invitÃÂÃÂ©ÃÂ¢ÃÂÃÂ¦"
            style={{ width:"100%", padding:"12px 16px 12px 44px", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, color:C.cream, fontSize:14, fontFamily:"Georgia,serif", outline:"none", boxSizing:"border-box" }}/>
          {globalSearch && <button onClick={()=>setGlobalSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:16 }}>ÃÂ¢ÃÂÃÂ</button>}
        </div>

        {/* ONBOARDING vide */}
        {myEvents.length === 0 && !globalSearch && (
          <div style={{ textAlign:"center", padding:"80px 20px" }}>
            <div style={{ fontSize:64, marginBottom:20 }}>ÃÂ°ÃÂÃÂÃÂ</div>
            <h2 style={{ fontSize:24, fontWeight:400, color:C.gold, marginBottom:12 }}>CrÃÂÃÂ©ez votre premier ÃÂÃÂ©vÃÂÃÂ©nement</h2>
            <p style={{ color:C.muted, fontSize:14, maxWidth:400, margin:"0 auto 32px", lineHeight:1.7 }}>
              Plan de table, invitÃÂÃÂ©s, budget, programmeÃÂ¢ÃÂÃÂ¦ tout est ici. Commencez en 30 secondes.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap", marginBottom:40 }}>
              {["1. CrÃÂÃÂ©ez votre ÃÂÃÂ©vÃÂÃÂ©nement","2. Ajoutez vos invitÃÂÃÂ©s","3. Placez-les sur le plan"].map((step,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 20px", fontSize:13, color:C.muted, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:24, height:24, borderRadius:"50%", background:C.gold+"22", color:C.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                  {step.replace(/^\d\. /,"")}
                </div>
              ))}
            </div>
            <Btn onClick={()=>setShowNew(true)} style={{ fontSize:15, padding:"14px 36px" }}>ÃÂ¢ÃÂÃÂ¨ CrÃÂÃÂ©er mon premier ÃÂÃÂ©vÃÂÃÂ©nement</Btn>
          </div>
        )}

        {myEvents.length === 0 && globalSearch && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:C.muted }}>
            <div style={{ fontSize:48, marginBottom:16 }}>ÃÂ°ÃÂÃÂÃÂ</div>
            <p>Aucun rÃÂÃÂ©sultat pour ÃÂÃÂ«&nbsp;{globalSearch}&nbsp;ÃÂÃÂ»</p>
          </div>
        )}

        {/* GRILLE ÃÂÃÂVÃÂÃÂNEMENTS */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {myEvents.map(ev=>{
            const theme = THEMES_CONFIG[ev.type]||THEMES_CONFIG.autre;
            const unseated = (ev.guests||[]).filter(g=>!g.tableId).length;
            const rsvpConf = (ev.guests||[]).filter(g=>g.rsvp==="confirmed").length;
            const rsvpPend = (ev.guests||[]).filter(g=>!g.rsvp||g.rsvp==="pending").length;
            const days = ev.date ? Math.ceil((new Date(ev.date)-new Date())/86400000) : null;
            const placementPct = ev.guests.length > 0 ? Math.round((ev.guests.filter(g=>g.tableId).length/ev.guests.length)*100) : 0;
            const budgetTotal = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.estimated)||0),0);
            const budgetSpent = (ev.budget||[]).reduce((s,b)=>s+(parseFloat(b.actual)||0),0);

            return (
              <div key={ev.id} onClick={()=>onOpenEvent(ev.id)}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 16px 40px ${theme.color}22`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 20px ${theme.color}0d`;}}
                style={{
                  background:C.card, borderRadius:20, overflow:"hidden", cursor:"pointer",
                  border:`1px solid ${C.border}`, transition:"all .2s",
                  boxShadow:`0 4px 20px ${theme.color}0d`,
                }}>
                {/* Cover band */}
                <div style={{ height:6, background:`linear-gradient(90deg,${theme.color},${theme.color}88,transparent)` }}/>

                <div style={{ padding:"20px 22px" }}>
                  {/* Top row */}
                  <div style={{ display:"flex", alignItems:"start", justifyContent:"space-between", marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:theme.color+"22", border:`1px solid ${theme.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                        {theme.icon}
                      </div>
                      <div>
                        <div style={{ color:C.cream, fontSize:16, fontWeight:600, marginBottom:1 }}>{ev.name}</div>
                        <div style={{ color:theme.color, fontSize:11, letterSpacing:.5 }}>{theme.label}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      {days !== null && (
                        <div style={{ background:days<=0?C.red+"22":days<=7?C.red+"22":days<=30?"#E8845A22":C.gold+"22", border:`1px solid ${days<=7?C.red:days<=30?"#E8845A":C.gold}44`, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:days<=7?C.red:days<=30?"#E8845A":C.gold }}>
                          {days<=0?"PassÃÂÃÂ©":days===0?"Auj.":"JÃÂ¢ÃÂÃÂ"+days}
                        </div>
                      )}
                      <button onClick={e=>{e.stopPropagation();const copy={...ev,id:Date.now(),name:ev.name+" (copie)",ownerId:user.id};setEvents(prev=>[...prev,copy]);showToast("ÃÂÃÂvÃÂÃÂ©nement dupliquÃÂÃÂ© !");}}
                        style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:13,padding:"4px 8px"}}>ÃÂ¢ÃÂ§ÃÂ</button>
                      <button onClick={e=>{e.stopPropagation();setDeleteConfirm(ev.id);}}
                        style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:13,padding:"4px 8px"}}>ÃÂ°ÃÂÃÂÃÂ</button>
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ color:C.muted, fontSize:12, marginBottom:16 }}>
                    ÃÂ°ÃÂÃÂÃÂ {ev.date || "Date non dÃÂÃÂ©finie"}
                  </div>

                  {/* Stats row */}
                  <div style={{ display:"flex", gap:16, marginBottom:14, flexWrap:"wrap" }}>
                    <span style={{ color:C.muted, fontSize:12 }}>ÃÂ°ÃÂÃÂªÃÂ {ev.tables.length} tables</span>
                    <span style={{ color:C.muted, fontSize:12 }}>ÃÂ°ÃÂÃÂÃÂ¤ {ev.guests.length} invitÃÂÃÂ©s</span>
                    {unseated>0 && <span style={{ color:C.red, fontSize:12 }}>ÃÂ¢ÃÂÃÂ  {unseated} non placÃÂÃÂ©s</span>}
                  </div>

                  {/* Placement bar */}
                  {ev.guests.length > 0 && (
                    <div style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ color:C.muted, fontSize:10, letterSpacing:.5 }}>PLACEMENT</span>
                        <span style={{ color:placementPct===100?C.green:C.gold, fontSize:10, fontWeight:700 }}>{placementPct}%</span>
                      </div>
                      <div style={{ height:4, background:C.mid, borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:placementPct+"%", background:placementPct===100?C.green:`linear-gradient(90deg,${theme.color},${theme.color}88)`, borderRadius:99, transition:"width .4s" }}/>
                      </div>
                    </div>
                  )}

                  {/* RSVP mini chips */}
                  {ev.guests.length > 0 && (
                    <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                      <span style={{ background:C.green+"22", border:`1px solid ${C.green}33`, borderRadius:6, padding:"3px 8px", fontSize:11, color:C.green }}>ÃÂ¢ÃÂÃÂ {rsvpConf}</span>
                      <span style={{ background:C.gold+"22", border:`1px solid ${C.gold}33`, borderRadius:6, padding:"3px 8px", fontSize:11, color:C.gold }}>ÃÂ¢ÃÂÃÂ³ {rsvpPend}</span>
                      {budgetTotal>0 && <span style={{ background:C.blue+"22", border:`1px solid ${C.blue}33`, borderRadius:6, padding:"3px 8px", fontSize:11, color:C.blue, marginLeft:"auto" }}>ÃÂ°ÃÂÃÂÃÂ° {budgetTotal.toLocaleString("fr-FR")} ÃÂ¢ÃÂÃÂ¬</span>}
                    </div>
                  )}

                  {/* RÃÂÃÂ©sultats de recherche */}
                  {globalSearch && ev.guests.some(g=>g.name.toLowerCase().includes(globalSearch.toLowerCase())) && (
                    <div style={{ background:C.gold+"11", border:`1px solid ${C.gold}22`, borderRadius:8, padding:"6px 10px", fontSize:11, color:C.gold }}>
                      ÃÂ°ÃÂÃÂÃÂ {ev.guests.filter(g=>g.name.toLowerCase().includes(globalSearch.toLowerCase())).map(g=>g.name).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal suppression */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setDeleteConfirm(null)}>
          <div style={{ background:C.card, border:`1px solid ${C.red}44`, borderRadius:20, padding:32, maxWidth:360, width:"90%", textAlign:"center" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:40, marginBottom:12 }}>ÃÂ°ÃÂÃÂÃÂ</div>
            <h3 style={{ color:C.cream, fontWeight:400, marginBottom:8 }}>Supprimer cet ÃÂÃÂ©vÃÂÃÂ©nement ?</h3>
            <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Cette action est irrÃÂÃÂ©versible. Toutes les donnÃÂÃÂ©es seront perdues.</p>
            <div style={{ display:"flex", gap:12 }}>
              <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:"10px", background:"none", border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>Annuler</button>
              <button onClick={()=>{setEvents(prev=>prev.filter(e=>e.id!==deleteConfirm));showToast("ÃÂÃÂvÃÂÃÂ©nement supprimÃÂÃÂ©","error");setDeleteConfirm(null);}}
                style={{ flex:1, padding:"10px", background:C.red, border:"none", borderRadius:10, color:"#fff", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700 }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showVoucher && <VoucherModal onClose={()=>setShowVoucher(false)} onApply={handleApplyVoucher} t={t}/>}
      {showUpgrade && (
        <Modal open={showUpgrade} onClose={()=>setShowUpgrade(false)} title="Passez Pro ÃÂ°ÃÂÃÂÃÂ">
          <p style={{color:C.muted,fontSize:14,lineHeight:1.7}}>Le plan gratuit est limitÃÂÃÂ© ÃÂÃÂ  1 ÃÂÃÂ©vÃÂÃÂ©nement. Entrez un code promo ou passez Pro pour accÃÂÃÂ¨s illimitÃÂÃÂ©.</p>
          <div style={{display:"flex",gap:10,marginTop:20}}>
            <Btn onClick={()=>{setShowUpgrade(false);setShowVoucher(true);}}>ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ J'ai un code promo</Btn>
            <Btn variant="muted" onClick={()=>setShowUpgrade(false)}>Plus tard</Btn>
          </div>
        </Modal>
      )}
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvel ÃÂÃÂ©vÃÂÃÂ©nement ÃÂ¢ÃÂÃÂ¨">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="NOM DE L'ÃÂÃÂVÃÂÃÂNEMENT *"><Input value={newEv.name} onChange={e=>setNewEv({...newEv,name:e.target.value})} placeholder="Mariage Dupont ÃÂÃÂ Martin"/></Field>
          <Field label={t.settingDate}><Input type="date" value={newEv.date} onChange={e=>setNewEv({...newEv,date:e.target.value})}/></Field>
          <Field label="TYPE D'ÃÂÃÂVÃÂÃÂNEMENT">
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
          <Btn onClick={createEvent} style={{marginTop:4}}>CrÃÂÃÂ©er l'ÃÂÃÂ©vÃÂÃÂ©nement ÃÂ¢ÃÂÃÂ</Btn>
        </div>
      </Modal>
    </div>
  );
}
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// ROOT APP
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// FIREBASE HOOKS
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function useFirebaseAuth() {
  const [fbUser, setFbUser] = useState(undefined); // undefined = chargement, null = dÃÂÃÂ©connectÃÂÃÂ©
  useEffect(() => {
    let unsub;
    // Attendre que Firebase soit disponible (scripts CDN chargÃÂÃÂ©s)
    const tryInit = () => {
      const fb = getFirebase();
      if (!fb) {
        // Firebase pas encore prÃÂÃÂªt, rÃÂÃÂ©essayer dans 200ms
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

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// LOADING SCREEN
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 30% 40%, #2a1a0e, #120C08)`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20 }}>
      <div style={{ position:"relative" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", border:`2px solid ${C.gold}22`, position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"pulse 2s ease-in-out infinite" }}/>
        <div style={{ width:60, height:60, borderRadius:"50%", border:`2px solid ${C.gold}44`, position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"pulse 2s ease-in-out infinite .3s" }}/>
        <div style={{ fontSize:40, position:"relative", zIndex:1 }}>ÃÂ°ÃÂÃÂªÃÂ</div>
      </div>
      <div style={{ color:C.gold, fontSize:20, letterSpacing:3, fontFamily:"Georgia,serif" }}>TableMaÃÂÃÂ®tre</div>
      <div style={{ display:"flex", gap:6 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.gold, opacity:.4, animation:`bounce 1s ease-in-out ${i*.15}s infinite` }}/>
        ))}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.3} 50%{transform:translate(-50%,-50%) scale(1.15);opacity:.7} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes fadeInDown { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// ROOT APP
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
// PAGE PUBLIQUE INVITÃÂÃÂ (?join=eventId)
// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
function GuestJoinPage({ eventId }) {
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("view"); // view | rsvp | done
  const [form, setForm] = useState({ name:"", diet:"standard", allergies:[], notes:"" });
  const [found, setFound] = useState(null);

  useEffect(() => {
    // Charger l'ÃÂÃÂ©vÃÂÃÂ©nement public depuis Firestore
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
          // Ancien format: collectionGroup (peut ÃÂÃÂ©chouer si rÃÂÃÂ¨gles restrictives)
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
      <div style={{ color:"#C9973A", fontSize:18 }}>ÃÂ°ÃÂÃÂªÃÂ ChargementÃÂ¢ÃÂÃÂ¦</div>
    </div>
  );

  if (!ev) return (
    <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", padding:20, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>ÃÂ°ÃÂÃÂÃÂ</div>
      <h2 style={{ color:"#C9973A", fontWeight:400 }}>ÃÂÃÂvÃÂÃÂ©nement introuvable</h2>
      <p style={{ color:"#8A7355", marginBottom:8 }}>Le lien est peut-ÃÂÃÂªtre expirÃÂÃÂ© ou invalide.</p>
      <p style={{ color:"#5a3a1a", fontSize:12 }}>Demandez ÃÂÃÂ  l'organisateur de partager le lien via le bouton "ÃÂ°ÃÂÃÂÃÂ Partager" de l'application.</p>
      <a href="/" style={{ marginTop:24, color:"#C9973A", fontSize:14 }}>ÃÂ¢ÃÂÃÂ Retour ÃÂÃÂ  TableMaÃÂÃÂ®tre</a>
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
            ÃÂ°ÃÂÃÂÃÂ {new Date(ev.date).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
          {ev.notes && <p style={{ color:"#A89060", fontSize:13, fontStyle:"italic", marginTop:8 }}>{ev.notes}</p>}
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:28 }}>
          {[
            { label:"Tables", val:ev.tables?.length||0, icon:"ÃÂ°ÃÂÃÂªÃÂ" },
            { label:"InvitÃÂÃÂ©s", val:totalGuests, icon:"ÃÂ°ÃÂÃÂÃÂ¥" },
            { label:"PlacÃÂÃÂ©s", val:seatedCount, icon:"ÃÂ¢ÃÂÃÂ" },
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
          <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:16, marginBottom:16 }}>ÃÂ°ÃÂÃÂÃÂ Trouver ma place</h3>
          <input
            placeholder="Votre prÃÂÃÂ©nom ou nomÃÂ¢ÃÂÃÂ¦"
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
              ÃÂ¢ÃÂÃÂ PrÃÂÃÂ©nom non trouvÃÂÃÂ© dans la liste des invitÃÂÃÂ©s
            </div>
          )}

          {found && (
            <div style={{ marginTop:16, background:"#0a2a0a", border:"1px solid #2a5a2a", borderRadius:12, padding:16 }}>
              <p style={{ color:"#81C784", fontWeight:700, fontSize:16, margin:"0 0 8px" }}>
                ÃÂ¢ÃÂÃÂ Bonjour {found.name}{found.role && found.role === "temoin" ? " ÃÂ°ÃÂÃÂÃÂ (TÃÂÃÂ©moin)" : found.role === "marie1" || found.role === "marie2" ? " ÃÂ°ÃÂÃÂÃÂ (MariÃÂÃÂ©(e))" : ""} !
              </p>
              {myTable ? (
                <div>
                  <p style={{ color:"#A5D6A7", margin:"0 0 4px" }}>
                    Vous ÃÂÃÂªtes ÃÂÃÂ  la <strong style={{ color:"#C9973A" }}>Table {myTable.number}{myTable.label ? ` ÃÂ¢ÃÂÃÂ ${myTable.label}` : ""}</strong>
                  </p>
                  <p style={{ color:"#6a8a6a", fontSize:12, marginBottom:12 }}>
                    {(ev.guests||[]).filter(function(g){ return g.tableId === myTable.id; }).length} personnes ÃÂÃÂ  cette table
                  </p>
                </div>
              ) : (
                <p style={{ color:"#E8845A", fontSize:14, marginBottom:12 }}>Votre placement n'est pas encore dÃÂÃÂ©fini</p>
              )}

              {/* Formulaire rÃÂÃÂ©gime alimentaire */}
              <div style={{ borderTop:"1px solid #2a5a2a", paddingTop:12, marginTop:4 }}>
                <p style={{ color:"#A5D6A7", fontSize:13, marginBottom:8 }}>ÃÂ°ÃÂÃÂÃÂ½ Votre rÃÂÃÂ©gime alimentaire</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                  {["standard","vegetarien","vegan","sans-gluten","halal","casher","sans-lactose"].map(function(dietId){
                    var icons = {"standard":"ÃÂ°ÃÂÃÂÃÂ½","vegetarien":"ÃÂ°ÃÂÃÂ¥ÃÂ","vegan":"ÃÂ°ÃÂÃÂÃÂ±","sans-gluten":"ÃÂ°ÃÂÃÂÃÂ¾","halal":"ÃÂ¢ÃÂÃÂªÃÂ¯ÃÂ¸ÃÂ","casher":"ÃÂ¢ÃÂÃÂ¡ÃÂ¯ÃÂ¸ÃÂ","sans-lactose":"ÃÂ°ÃÂÃÂ¥ÃÂ"};
                    var labels = {"standard":"Standard","vegetarien":"VÃÂÃÂ©gÃÂÃÂ©tarien","vegan":"Vegan","sans-gluten":"Sans gluten","halal":"Halal","casher":"Casher","sans-lactose":"Sans lactose"};
                    var isSelected = found.diet === dietId;
                    return (
                      <button key={dietId}
                        onClick={function(){
                          // Mettre ÃÂÃÂ  jour le state local immÃÂÃÂ©diatement
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
                  placeholder="Notes spÃÂÃÂ©ciales (allergie sÃÂÃÂ©vÃÂÃÂ¨re, handicap, siÃÂÃÂ¨ge bÃÂÃÂ©bÃÂÃÂ©...)"
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
                  {found.diet && found.diet !== "standard" ? "ÃÂ¢ÃÂÃÂ RÃÂÃÂ©gime enregistrÃÂÃÂ© ÃÂ¢ÃÂÃÂ " : ""}
                  Vos prÃÂÃÂ©fÃÂÃÂ©rences seront transmises ÃÂÃÂ  l'organisateur
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plan par tables */}
        {(ev.tables||[]).length > 0 && (
          <div style={{ background:"#1E1208", border:"1px solid #3a2a1a", borderRadius:16, padding:24 }}>
            <h3 style={{ color:"#C9973A", fontWeight:400, fontSize:16, marginBottom:16 }}>ÃÂ°ÃÂÃÂªÃÂ Plan de table</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(ev.tables||[]).map(tbl => {
                const tGuests = (ev.guests||[]).filter(g => g.tableId === tbl.id);
                return (
                  <div key={tbl.id} style={{ background:"#2a1a0e", borderRadius:10, overflow:"hidden", border:`1px solid ${tbl.color||"#5a3a1a"}44` }}>
                    <div style={{ background:(tbl.color||"#C9973A")+"22", padding:"8px 16px", display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:tbl.color||"#C9973A", fontWeight:700, fontSize:14 }}>
                        Table {tbl.number}{tbl.label ? ` ÃÂ¢ÃÂÃÂ ${tbl.label}` : ""}
                      </span>
                      <span style={{ color:"#8A7355", fontSize:12 }}>{tGuests.length}/{tbl.capacity}</span>
                    </div>
                    <div style={{ padding:"8px 16px", display:"flex", flexWrap:"wrap", gap:6 }}>
                      {tGuests.length === 0 ? (
                        <span style={{ color:"#5a3a1a", fontSize:12, fontStyle:"italic" }}>ÃÂ¢ÃÂÃÂ Vide ÃÂ¢ÃÂÃÂ</span>
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
          PropulsÃÂÃÂ© par TableMaÃÂÃÂ®tre ÃÂ°ÃÂÃÂªÃÂ
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

  // ThÃÂÃÂ¨me
  // Rappel J-7 ÃÂ¢ÃÂÃÂ notifications browser
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
            new Notification("ÃÂ°ÃÂÃÂªÃÂ TableMaÃÂÃÂ®tre ÃÂ¢ÃÂÃÂ " + ev.name, {
              body: diffDays === 1 ? "C'est demain ! Votre plan est-il prÃÂÃÂªt ?" : "Dans " + diffDays + " jours ÃÂ¢ÃÂÃÂ Finalisez votre plan de table.",
            });
          }
        }
      }
    });
  }, [events]);

  useEffect(() => {
    document.body.style.background = lightMode ? "#F5F0E8" : "#120C08";
    document.body.style.color = lightMode ? "#2A1A0E" : "#F5EAD4";
    // AccessibilitÃÂÃÂ© : focus visible pour navigation clavier
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

  // Chargement temps rÃÂÃÂ©el via Firestore onSnapshot
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
    // onSnapshot = temps rÃÂÃÂ©el ÃÂ¢ÃÂÃÂ se met ÃÂÃÂ  jour automatiquement
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

  // DÃÂÃÂ©connexion
  const handleLogout = async () => {
    const fb = getFirebase();
    if (fb) await fb.auth.signOut();
    setSelectedEventId(null);
    setView("dashboard");
    setEvents([]);
  };

  // Ouvrir un ÃÂÃÂ©vÃÂÃÂ©nement
  const handleOpenEvent = (id) => { setSelectedEventId(id); setView("event"); };

  // Mise ÃÂÃÂ  jour + sauvegarde auto Firestore
  const [editorSaveToast, setEditorSaveToast] = useState(false);
  const handleUpdateEvent = (updatedEv) => {
    setEvents(prev => prev.map(e => e.id === updatedEv.id ? updatedEv : e));
    if (fbUser) {
      saveEventToFirestore(fbUser.uid, updatedEv);
      setEditorSaveToast(true);
      setTimeout(() => setEditorSaveToast(false), 2000);
    }
  };

  // CrÃÂÃÂ©ation d'ÃÂÃÂ©vÃÂÃÂ©nement avec sauvegarde
  const handleSetEvents = (updater) => {
    setEvents(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Sauvegarder les nouveaux/modifiÃÂÃÂ©s
      if (fbUser) {
        const prevIds = new Set(prev.map(e => e.id));
        next.forEach(ev => {
          if (!prevIds.has(ev.id) || JSON.stringify(prev.find(e=>e.id===ev.id)) !== JSON.stringify(ev)) {
            saveEventToFirestore(fbUser.uid, ev);
          }
        });
        // Supprimer les supprimÃÂÃÂ©s
        const nextIds = new Set(next.map(e => e.id));
        prev.forEach(ev => {
          if (!nextIds.has(ev.id)) deleteEventFromFirestore(fbUser.uid, ev.id);
        });
        // sauvegarde cloud notifiÃÂÃÂ©e dans Dashboard
      }
      return next;
    });
  };

  // Construire l'objet user ÃÂÃÂ  partir de fbUser
  const user = fbUser ? {
    id: fbUser.uid,
    email: fbUser.email,
    name: fbUser.displayName || fbUser.email,
    avatar: (fbUser.displayName || fbUser.email || "?").slice(0,2).toUpperCase(),
    photoURL: fbUser.photoURL,
    role: fbUser.email === "admin@tablema.fr" ? "superadmin" : "admin",
    projectIds: events.map(e => e.id),
  } : null;

  // Page publique invitÃÂÃÂ© (?join=eventId) ÃÂ¢ÃÂÃÂ accessible sans connexion
  var joinId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("join") : null;
  if (joinId) return <GuestJoinPage eventId={joinId} />;

  // ÃÂÃÂtats de chargement
  if (fbUser === undefined) return <LoadingScreen />;

  // Non connectÃÂÃÂ© ÃÂ¢ÃÂÃÂ ÃÂÃÂ©cran de connexion Google
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
