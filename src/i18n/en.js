/* eslint-disable */
const en = {
  // ─────────────────────────────────────────────
  // APP GÉNÉRAL
  // ─────────────────────────────────────────────
  appName: 'TableMaître',
  logout: 'Sign out',
  lightMode: 'Switch to light mode',
  darkMode: 'Switch to dark mode',
  codePromo: '🎟️ Promo code',
  loading: 'Loading…',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  back: '← Back',
  next: 'Next →',
  skip: 'Skip',
  finish: '🚀 Create',
  close: 'Close',
  search: 'Search a guest…',
  skipToMain: 'Skip to main content',
  // ─────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────
  myEvents: 'My events',
  welcome: 'Welcome',
  searchPlaceholder: 'Search an event or guest…',
  newEvent: '+ New event',
  noEvents: 'No events yet',
  createFirst: 'Create my first event',
  savedCloud: 'Cloud saving',
  savedAuto: 'Your data is automatically saved online.',
  settingDate: 'Date',
  eventName: 'Event name',
  eventType: 'Event type',
  createEvent: 'Create event',
  duplicateEvent: 'Duplicate this event',
  today: 'Today!',
  past: 'past',
  // ─────────────────────────────────────────────
  // TYPES D'ÉVÉNEMENTS
  // ─────────────────────────────────────────────
  mariage: 'Wedding',
  gala: 'Gala / Evening',
  anniversaire: 'Birthday',
  conference: 'Conference',
  autre: 'Other',
  // ─────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────
  tables: 'tables',
  guests: 'guests',
  unseated: 'unseated',
  placement: 'Seating',
  inDays: 'in',
  days: 'd',
  exportCSV: '⬇ Export CSV',
  importCSV: '⬆ Import CSV',
  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  loginSubtitle: 'Organize. Place. Impress.',
  loginHero: 'The next-gen seating chart',
  loginSub: 'The pro platform for event management.',
  loginCta: 'Get started for free',
  loginGoogle: 'Sign in with Google',
  loginDemo: 'Try as guest',
  loginDemoWarning: 'Guest mode: your data will not be saved.',
  loginFree: '100% free to start',
  loginF1: 'Smart floor plan',
  loginF1d: 'Draw your room, place your tables and organize your space in seconds.',
  loginF2: 'Elegant invitations',
  loginF2d: 'Send personalized invitations and track responses automatically.',
  loginF3: 'PDF Export / Print',
  loginF3d: 'Generate a clear, professional plan ready to print or share.',
  loginF4: 'Automatic seating',
  loginF4d: 'AI optimizes guest placement according to your constraints.',
  trustedFor: 'Used for',
  loginTrust1: 'Weddings',
  loginTrust2: 'Birthdays',
  loginTrust3: 'Corporate events',
  loginTrust4: 'Private dinners',
  loginFooterTitle: 'Reviews coming soon',
  loginReviewsSoon: 'The reviews section will be available soon.',
  // ─────────────────────────────────────────────
  // VOUCHER
  // ─────────────────────────────────────────────
  voucherTitle: 'Promo codes',
  voucherApplied: 'Promo code applied successfully.',
  voucherCode: 'Promo code',
  voucherInvalid: 'Invalid or expired code.',
  voucherApply: 'Apply',
  // ─────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────
  onboardingTitle: 'Create an event',
  onboardingName: 'Event name',
  onboardingPlaceholder: 'Ex: Smith Wedding',
  onboardingDate: 'Date',
  onboardingType: 'Event type',
  onboardingShape: 'Room shape',
  shapeRectangle: 'Rectangle',
  shapeSquare: 'Square',
  shapeRound: 'Round',
  shapeU: 'U-shape',
  // ─────────────────────────────────────────────
  // FLOOR PLAN
  // ─────────────────────────────────────────────
  roomShapeTitle: 'Room shape',
  roomShapeCancelDraw: 'Cancel',
  roomShapeDraw: 'Draw',
  roomShapeDoneEdit: 'Done',
  roomShapeEditPoints: 'Edit points',
  roomShapePresets: 'Presets',
  roomShapeDrawHelp: 'Click to add points, double-click to finish',
  roomShapeEditHelp: 'Drag points to modify the shape',
  // ─────────────────────────────────────────────
  // REVIEWS
  // ─────────────────────────────────────────────
  reviewsSubtitle: 'What they think',
  reviewsTitle: 'User reviews',
  reviewsEmptyTitle: 'No reviews yet',
  reviewsEmptySubtitle: 'First reviews will appear soon.',
  reviewsAvg: 'Average rating',
  reviewsNps: 'NPS Score',
  reviewsRecommend: 'Recommend',
  reviewPromoter: 'Promoter',
  reviewNeutral: 'Neutral',
  reviewDetractor: 'Detractor',
  reviewNoComment: 'No comment',
  npsAnonymousUser: 'Anonymous user',
  // ─────────────────────────────────────────────
  // PRICING
  // ─────────────────────────────────────────────
  pricingTitle: 'Choose your plan',
  pricingFree: 'Free',
  pricingPro: 'Pro',
  pricingPerEvent: 'per event',
  pricingIncluded: 'Included',
  pricingNotIncluded: 'Not included',
  // ─────────────────────────────────────────────
  // INVITÉS
  // ─────────────────────────────────────────────
  guestName: 'Guest name',
  guestEmail: 'Email',
  guestTable: 'Table',
  guestDiet: 'Dietary requirements',
  guestNotes: 'Notes',
  guestRsvp: 'RSVP status',
  rsvpConfirmed: 'Confirmed',
  rsvpDeclined: 'Declined',
  rsvpPending: 'Pending',
  addGuest: 'Add a guest',
  saveGuest: 'Save',
  // ─────────────────────────────────────────────
  // FONCTIONS
  // ─────────────────────────────────────────────
  floorPlanAria: ev => `Floor plan — ${ev.name}`,
  floorPlanTableTitle: (tbl, seated) => `Table ${tbl.number} — ${seated}/${tbl.capacity} seated`,
  reviewsCount: n => `${n} review${n>1?'s':''}`,

  // ─────────────────────────────────────────────
  // LOGIN & NPS
  // ─────────────────────────────────────────────
  loginOr: '— or —',
  faqQ1: 'Is my data secure?',
  faqA1: 'Yes. Your data is encrypted and stored via Firebase (Google). You can export it at any time.',
  faqQ2: 'How do promo codes work?',
  faqA2: 'Enter your code in the field. A 10%, 20% or 100% discount will be applied automatically.',
  faqQ3: 'Can I use the app without signing up?',
  faqA3: 'Yes, in demo mode with up to 5 guests. No data will be saved.',
  faqQ4: 'How do I export my seating plan?',
  faqA4: 'From the Plan tab, click Print to generate a printable PDF.',
  npsQuestion: 'Would you recommend TableMaître?',
  npsScale: '0 = Not at all · 10 = Definitely',
  npsSend: 'Send my review →',
  npsThanks: 'Thank you for your feedback!',
  npsHelps: 'Your feedback helps us improve TableMaître.',
  npsCommentPlaceholder: 'What could we improve? (optional)',
  npsDisclaimer: 'Anonymized · Moderated before publication',

  // ─────────────────────────────────────────────
  fieldName: 'NAME',
  fieldEmail: 'EMAIL',
  fieldCapacity: 'CAPACITY',
  fieldNumber: 'NUMBER',
  fieldShape: 'SHAPE',
  fieldLabel: 'LABEL',
  fieldColor: 'COLOR',
  phone: 'PHONE',
  guestRole: 'ROLE / FUNCTION',
  addGuestBtn: 'Add guest',
  autoPlace: 'Auto place',
  tabList: 'Table list',
  tabConstraints: 'Constraints',
  unseatedList: 'Unseated',
  placementDone: 'All seated!',
  budgetSpent: 'Spent',
  budgetRemaining: 'Remaining',
  budgetPerGuest: 'Per guest',
  paid: 'Paid',
  notPaid: 'Unpaid',
  category: 'Category',
  rsvpRate: 'Response rate',
  rsvpStatus: 'RSVP status',
  rsvpLink: 'RSVP link',
  venueName: 'Venue',
  venueNotes: 'Notes',
  eventNotes: 'Event notes',
  settingName: 'Name',
  settingType: 'Type',
  newTask: 'New task',
  taskLabel: 'Task',
  tasksDone: 'Done',
  tasksRemaining: 'Remaining',
  undo: 'Undo',
  statTables: 'tables',
  statGuests: 'guests',
  statSeated: 'seated',
  dietSummary: 'Dietary needs',
  placeCards: 'Place cards',
  newConstraint: 'New constraint',
  separated: 'Separate',
  // EVENT EDITOR
  // ─────────────────────────────────────────────
  tabPlan: 'Plan',
  tabGuests: 'Guests',
  tabBudget: 'Budget',
  tabSettings: 'Settings',
  addTable: 'Table',
  noGuests: 'No guests yet',
  seeAvailable: 'Free seats',
  tabPlanDetail: 'Floor plan',
  tabRoom: 'Room shape',
  eventSettings: 'Settings',
  tabMenu: "Menu",
  tabTodo: "Checklist",
};

export default en;