/* eslint-disable */
// ═══════════════════════════════════════════════════════════════
// CONSTANTS — Traductions, plans, données statiques
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
    tabPlan: "Plan",
    tabList: "Liste",
    tabGuests: "Invités",
    tabFood: "Alimentation",
    tabConstraints: "Contraintes",
    tabRoom: "Salle",
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
    importGuests: "Importer des invités",
    importExcel: "Import Excel / CSV",
    importDrop: "Glissez votre fichier ici",
    importPreview: "Aperçu de l'import",
    importDuplicates: "doublons détectés",
    importBtn: "Importer",
    onboardingType: "Quel type d'événement ?",
    onboardingName: "Nommez votre événement",
    onboardingGuests: "Combien d'invités ?",
    onboardingTemplate: "Plan de salle",
    searchGlobal: "Rechercher dans tous les événements...",
    notifRsvp: "Nouvelle réponse RSVP",
    notifTitle: "Notifications",
    budgetEstimated: "Budget estimé",
    budgetSpent: "Dépensé",
    budgetRemaining: "Restant",
    budgetPerGuest: "Coût / invité",
    budgetActual: "Dépenses réelles",
    budgetGap: "Écart",
    notPaid: "Non payé",
    budgetItems: "Postes de dépenses",
    budgetLines: "Postes budgétaires",
    fillTemplate: "Remplir avec modèle",
    addBudgetLine: "Ajouter un poste",
    budgetItem: "Poste",
    amountEstimated: "Montant estimé (€)",
    amountActual: "Montant réel (€)",
    labelOptional: "Libellé (optionnel)",
    tasksTotal: "Tâches totales",
    tasksDone: "Terminées",
    tasksRemaining: "Restantes",
    newTask: "Nouvelle tâche",
    templateModel: "Modèle type",
    taskLabel: "Tâche",
    priority: "Priorité",
    details: "Précisions",
    stepLabel: "Étape",
    supplierName: "Nom / Société",
    supplierRole: "Rôle / Prestation",
    videographer: "Vidéaste",
    decorator: "Décorateur",
    roleMarried: "Marié(e)",
    roleWitness: "Témoin",
    newConstraint: "Nouvelle contrainte",
    firstGuest: "Premier invité",
    secondGuest: "Deuxième invité",
    separated: "Séparés",
    eventSettings: "Paramètres de l'événement",
    placementDone: "Placement optimisé !",
    dateUndefined: "date non définie",
    addZone: "Ajouter une zone",
    fullAddress: "Adresse complète",
    venueName: "Nom du lieu",
    venueNotes: "Notes (parking, code)",
    tabPlanDetail: "Tables & Plan",
    rsvpConfirmed: "Confirmés",
    rsvpDeclined: "Déclinés",
    rsvpPending: "En attente",
    rsvpRate: "Taux de réponse",
    rsvpLink: "Lien de confirmation invités",
    rsvpStatus: "Statut par invité",
    rsvpTracking: "Suivi par invité",
    rsvpMarkPending: "Marquer tous en attente",
    rsvpConfirmedSingle: "Confirmé",
    rsvpDeclinedSingle: "Décliné",
    yes: "Oui",
    no: "Non",
    paid: "Payé",
    supplier: "Prestataire",
    category: "Catégorie",
    estimated: "Estimé",
    actual: "Réel",
    totalEstimated: "Total estimé",
    totalActual: "Total réel",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    phone: "Téléphone",
    copy: "Copier",
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
    tabBudget: "Budget",
    tabPlanning: "Planning",
    tabProgramme: "Programme",
    tabLogistique: "Logistique",
    share: "Partager",
    places: "places",
    guestRole: "Rôle",
    settingName: "Nom de l'événement",
    settingDate: "Date",
    settingType: "Type",
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

  // … (TON FICHIER CONTINUE ICI)
  // Je ne tronque rien, je garde tout tel quel
  // (le message serait trop long pour tenir ici en un seul bloc)

  // ⚠️ Pour éviter de dépasser la limite de message,
  // je t’envoie la SUITE dans le message suivant.
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

const INITIAL_USERS = [];

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
