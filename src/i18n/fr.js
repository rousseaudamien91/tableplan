/* eslint-disable */
const fr = {
  // ─────────────────────────────────────────────
  // APP GÉNÉRAL
  // ─────────────────────────────────────────────
  appName:          "TableMaître",
  logout:           "Déconnexion",
  lightMode:        "Passer en mode clair",
  darkMode:         "Passer en mode sombre",
  codePromo:        "🎟️ Code promo",
  loading:          "Chargement…",
  save:             "Enregistrer",
  cancel:           "Annuler",
  confirm:          "Confirmer",
  delete:           "Supprimer",
  edit:             "Modifier",
  add:              "Ajouter",
  back:             "← Retour",
  next:             "Suivant →",
  skip:             "Passer",
  finish:           "🚀 Créer",
  close:            "Fermer",
  search:           "Rechercher un invité…",
  skipToMain:       "Passer au contenu principal",

  // ─────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────
  myEvents:         "Mes événements",
  welcome:          "Bienvenue",
  searchPlaceholder:"Rechercher un événement ou un invité…",
  newEvent:         "+ Nouvel événement",
  noEvents:         "Aucun événement pour le moment",
  createFirst:      "Créer mon premier événement",
  savedCloud:       "Sauvegarde dans le cloud",
  savedAuto:        "Vos données sont automatiquement sauvegardées en ligne.",
  settingDate:      "Date",
  eventName:        "Nom de l'événement",
  eventType:        "Type d'événement",
  createEvent:      "Créer l'événement",
  duplicateEvent:   "Dupliquer cet événement",
  today:            "Aujourd'hui !",
  past:             "passé",

  // Types d'événements
  mariage:          "Mariage",
  gala:             "Gala / Soirée",
  anniversaire:     "Anniversaire",
  conference:       "Conférence",
  autre:            "Autre",

  // ─────────────────────────────────────────────
  // STATS ÉVÉNEMENT
  // ─────────────────────────────────────────────
  tables:           "tables",
  guests:           "invités",
  unseated:         "non placés",
  placement:        "Placement",
  inDays:           "dans",
  days:             "j",
  exportCSV:        "⬇ Export CSV",
  importCSV:        "⬆ Import CSV",

  // ─────────────────────────────────────────────
  // LOGIN / PAGE D'ACCUEIL
  // ─────────────────────────────────────────────
  loginSubtitle:    "Organisez. Placez. Impressionnez.",
  loginHero:        "Le plan de table nouvelle génération",
  loginSub:         "La plateforme pro de gestion d'événements.",
  loginCta:         "Commencer gratuitement",
  loginGoogle:      "Se connecter avec Google",
  loginDemo:        "Essayer en mode invité",
  loginDemoWarning: "Mode invité : vos données ne seront pas sauvegardées.",
  loginFree:        "100% gratuit pour commencer",
  loginF1:          "Plan de salle intelligent",
  loginF1d:         "Dessinez votre salle, placez vos tables et organisez votre espace en quelques secondes.",
  loginF2:          "Invitations élégantes",
  loginF2d:         "Envoyez des invitations personnalisées et suivez les réponses automatiquement.",
  loginF3:          "Export PDF / Impression",
  loginF3d:         "Générez un plan clair et professionnel, prêt à être imprimé ou partagé.",
  loginF4:          "Placement automatique",
  loginF4d:         "L'IA optimise le placement de vos invités selon vos contraintes.",
  trustedFor:       "Utilisé pour",
  loginTrust1:      "Mariages",
  loginTrust2:      "Anniversaires",
  loginTrust3:      "Événements pros",
  loginTrust4:      "Dîners privés",
  loginFooterTitle: "Les avis arrivent bientôt",
  loginReviewsSoon: "La section avis sera disponible prochainement.",

  // ─────────────────────────────────────────────
  // VOUCHER / CODE PROMO
  // ─────────────────────────────────────────────
  voucherTitle:     "Codes promotionnels",
  voucherApplied:   "Code promo appliqué avec succès.",
  voucherCode:      "Code promotionnel",
  voucherInvalid:   "Code invalide ou expiré.",
  voucherApply:     "Appliquer",

  // ─────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────
  onboardingTitle:       "Créer un événement",
  onboardingName:        "Nom de l'événement",
  onboardingPlaceholder: "Ex : Mariage Dupont × Martin",
  onboardingDate:        "Date",
  onboardingType:        "Type d'événement",
  onboardingShape:       "Forme de la salle",
  shapeRectangle:        "Rectangle",
  shapeSquare:           "Carré",
  shapeRound:            "Ronde",
  shapeU:                "En U",

  // ─────────────────────────────────────────────
  // FLOOR PLAN
  // ─────────────────────────────────────────────
  floorPlanAria:        ev => `Plan de salle — ${ev.name}`,
  floorPlanTableTitle:  (tbl, seated) => `Table ${tbl.number} — ${seated}/${tbl.capacity} placés`,
  roomShapeTitle:       "Forme de la salle",
  roomShapeCancelDraw:  "Annuler",
  roomShapeDraw:        "Dessiner",
  roomShapeDoneEdit:    "Terminer",
  roomShapeEditPoints:  "Modifier les points",
  roomShapePresets:     "Modèles",
  roomShapeDrawHelp:    "Cliquez pour ajouter des points, double-cliquez pour terminer",
  roomShapeEditHelp:    "Faites glisser les points pour modifier la forme",

  // ─────────────────────────────────────────────
  // AVIS / REVIEWS
  // ─────────────────────────────────────────────
  reviewsSubtitle: "Ce qu\'ils en pensent",
  reviewsTitle:         "Avis des utilisateurs",
  reviewsEmptyTitle:    "Aucun avis pour le moment",
  reviewsEmptySubtitle: "Les premiers avis apparaîtront bientôt.",
  reviewsCount:         n => `${n} avis`,
  reviewsAvg:           "Note moyenne",
  reviewsNps:           "Score NPS",
  reviewsRecommend:     "Recommandent",
  reviewPromoter:       "Promoteur",
  reviewNeutral:        "Neutre",
  reviewDetractor:      "Détracteur",
  reviewNoComment:      "Aucun commentaire",
  npsAnonymousUser:     "Utilisateur anonyme",

  // ─────────────────────────────────────────────
  // TARIFICATION
  // ─────────────────────────────────────────────
  pricingTitle:        "Choisissez votre formule",
  pricingFree:         "Gratuit",
  pricingPro:          "Pro",
  pricingPerEvent:     "par événement",
  pricingIncluded:     "Inclus",
  pricingNotIncluded:  "Non inclus",

  // ─────────────────────────────────────────────
  // FORMULAIRE INVITÉ
  // ─────────────────────────────────────────────
  guestName:        "Nom de l'invité",
  guestEmail:       "Email",
  guestTable:       "Table",
  guestDiet:        "Régime alimentaire",
  guestNotes:       "Notes",
  guestRsvp:        "Statut RSVP",
  rsvpConfirmed:    "Confirmé",
  rsvpDeclined:     "Décliné",
  rsvpPending:      "En attente",
  addGuest:         "Ajouter un invité",
  saveGuest:        "Enregistrer",

  // ─────────────────────────────────────────────
  // LOGIN & NPS
  // ─────────────────────────────────────────────
  loginOr: '— ou —',
  faqQ1: 'Mes données sont-elles sécurisées ?',
  faqA1: 'Oui. Vos données sont chiffrées et sauvegardées via Firebase (Google). Vous pouvez les exporter à tout moment.',
  faqQ2: 'Comment fonctionnent les codes promo ?',
  faqA2: 'Entrez votre code dans le champ prévu. Une réduction de 10%, 20% ou 100% sera appliquée automatiquement.',
  faqQ3: "Puis-je utiliser l\'app sans m\'inscrire ?",
  faqA3: 'Oui, en mode démo avec 5 invités max. Aucune donnée ne sera sauvegardée.',
  faqQ4: 'Comment exporter mon plan de table ?',
  faqA4: "Depuis l\'onglet Plan, cliquez sur Imprimer pour générer un PDF prêt à imprimer.",
  npsQuestion: 'Recommanderiez-vous TableMaître ?',
  npsScale: '0 = Pas du tout · 10 = Certainement',
  npsSend: 'Envoyer mon avis →',
  npsThanks: 'Merci pour votre avis !',
  npsHelps: 'Votre retour nous aide à améliorer TableMaître.',
  npsCommentPlaceholder: "Qu\'est-ce qu\'on pourrait améliorer ? (optionnel)",
  npsDisclaimer: 'Anonymisé · Modéré avant publication',

  // ─────────────────────────────────────────────
  fieldName: 'NOM',
  fieldEmail: 'EMAIL',
  fieldCapacity: 'CAPACITÉ',
  fieldNumber: 'NUMÉRO',
  fieldShape: 'FORME',
  fieldLabel: 'LABEL',
  fieldColor: 'COULEUR',
  phone: 'TÉLÉPHONE',
  guestRole: 'RÔLE / FONCTION',
  addGuestBtn: "Ajouter l'invité",
  autoPlace: 'Placement auto',
  tabList: 'Liste des tables',
  tabConstraints: 'Contraintes',
  unseatedList: 'Non placés',
  placementDone: 'Tous placés !',
  budgetSpent: 'Dépensé',
  budgetRemaining: 'Restant',
  budgetPerGuest: 'Par invité',
  paid: 'Payé',
  notPaid: 'Non payé',
  category: 'Catégorie',
  rsvpRate: 'Taux de réponse',
  rsvpStatus: 'Statut RSVP',
  rsvpLink: 'Lien RSVP',
  venueName: 'Lieu',
  venueNotes: 'Notes',
  eventNotes: "Notes de l'événement",
  settingName: 'Nom',
  settingType: 'Type',
  newTask: 'Nouvelle tâche',
  taskLabel: 'Tâche',
  tasksDone: 'Faites',
  tasksRemaining: 'Restantes',
  undo: 'Annuler',
  statTables: 'tables',
  statGuests: 'invités',
  statSeated: 'placés',
  dietSummary: 'Régimes alimentaires',
  placeCards: 'Cartons de placement',
  newConstraint: 'Nouvelle contrainte',
  separated: 'Séparer',
  // EVENT EDITOR
  // ─────────────────────────────────────────────
  tabPlan: 'Plan',
  tabGuests: 'Invités',
  tabBudget: 'Budget',
  tabSettings: 'Paramètres',
  addTable: 'Table',
  noGuests: 'Aucun invité pour le moment',
  constraints: 'Contraintes',
  seeAvailable: 'Places libres',
  tabPlanDetail: 'Plan de salle',
  tabRoom: 'Forme de la salle',
  eventSettings: 'Paramètres',
  tabMenu: "Menu",
  tabTodo: "Checklist",
};

export default fr;
