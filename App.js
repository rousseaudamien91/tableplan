/* eslint-disable */
import { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, onSnapshot, query, where } from "firebase/firestore";

import Dashboard     from "./components/Dashboard";
import EventEditor   from "./components/EventEditor/EventEditor";
import LoginScreen   from "./components/LoginScreen";
import { useI18n }  from "./theme";

// ═══════════════════════════════════════════════════════════════
// APP — Gestion Auth Firebase + routing simple (pas de react-router)
// ═══════════════════════════════════════════════════════════════

const SUPERADMIN_EMAIL = "rousseau.damien.91@gmail.com";

export default function App() {
  const [fbUser,         setFbUser]         = useState(undefined); // undefined = loading, null = non connecté
  const [user,           setUser]           = useState(null);
  const [events,         setEvents]         = useState([]);
  const [eventsLoaded,   setEventsLoaded]   = useState(false);
  const [view,           setView]           = useState("dashboard");
  const [selectedEventId,setSelectedEventId] = useState(null);
  const [guestMode,      setGuestMode]      = useState(false);
  const [lightMode,      setLightMode]      = useState(false);

  const { t, lang, setLang } = useI18n(fbUser?.uid);

  // ── Auth state ──────────────────────────────────────────────
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const role = firebaseUser.email === SUPERADMIN_EMAIL ? "superadmin" : "admin";
        const userObj = {
          id:          firebaseUser.uid,
          name:        firebaseUser.displayName || firebaseUser.email,
          email:       firebaseUser.email,
          photoURL:    firebaseUser.photoURL || null,
          avatar:      (firebaseUser.displayName || "U")[0].toUpperCase(),
          role,
          plan:        "free",
          subscriptionStatus: "active",
        };
        setFbUser(firebaseUser);
        setUser(userObj);
      } else {
        setFbUser(null);
        setUser(null);
        setEvents([]);
        setEventsLoaded(false);
      }
    });
    return unsub;
  }, []);

  // ── Charger les événements Firestore ────────────────────────
  useEffect(() => {
    if (!fbUser || guestMode) return;
    const q = query(collection(db, "events"), where("ownerId", "==", fbUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const evs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(evs);
      setEventsLoaded(true);
    });
    return unsub;
  }, [fbUser, guestMode]);

  // ── Sauvegarder un événement ─────────────────────────────────
  async function saveEvent(ev) {
    if (!fbUser || guestMode) return;
    try {
      await setDoc(doc(db, "events", String(ev.id)), ev);
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
    }
  }

  // ── Login Google ──────────────────────────────────────────────
  async function handleGoogleLogin() {
    const auth     = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login error:", e);
    }
  }

  // ── Login Guest (démo) ────────────────────────────────────────
  function handleGuestLogin() {
    const guestEvent = {
      id:         "guest-demo",
      ownerId:    "guest",
      name:       "Mon événement démo",
      date:       new Date().toISOString().slice(0, 10),
      type:       "mariage",
      plan:       "guest",
      roomShape:  [{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables:     [{id:"t1",number:1,capacity:5,shape:"round",label:"Table 1",x:300,y:280,guests:[]}],
      guests:     [],
      constraints:[],
      menu:       null,
    };
    const guestUser = {
      id:       "guest",
      name:     "Visiteur",
      email:    "",
      photoURL: null,
      avatar:   "👤",
      role:     "guest",
      plan:     "guest",
      subscriptionStatus: "guest",
    };
    setEvents([guestEvent]);
    setEventsLoaded(true);
    setGuestMode(true);
    setUser(guestUser);
    setFbUser({ uid: "guest" });
  }

  // ── Déconnexion ───────────────────────────────────────────────
  async function handleLogout() {
    if (guestMode) {
      setGuestMode(false);
      setFbUser(null);
      setUser(null);
      setEvents([]);
      setEventsLoaded(false);
      setView("dashboard");
      setSelectedEventId(null);
      return;
    }
    const auth = getAuth();
    await signOut(auth);
    setView("dashboard");
    setSelectedEventId(null);
  }

  // ── Mise à jour événement ─────────────────────────────────────
  function handleUpdateEvent(updatedEv) {
    setEvents(prev => prev.map(e => e.id === updatedEv.id ? updatedEv : e));
    if (fbUser && !guestMode) saveEvent(updatedEv);
  }

  // ── Navigation ────────────────────────────────────────────────
  function handleOpenEvent(id) {
    setSelectedEventId(id);
    setView("event");
  }

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // ── États de chargement ───────────────────────────────────────
  if (fbUser === undefined) {
    return (
      <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>⏳ Chargement...</div>
      </div>
    );
  }

  // ── Non connecté ──────────────────────────────────────────────
  if (!fbUser) {
    return (
      <LoginScreen
        onLogin={handleGoogleLogin}
        onGuestLogin={handleGuestLogin}
      />
    );
  }

  // ── Chargement events ─────────────────────────────────────────
  if (!eventsLoaded && !guestMode) {
    return (
      <div style={{ minHeight:"100vh", background:"#120C08", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>⏳ Chargement des événements...</div>
      </div>
    );
  }

  // ── EventEditor ───────────────────────────────────────────────
  if (view === "event" && selectedEvent) {
    return (
      <EventEditor
        ev={selectedEvent}
        onUpdate={handleUpdateEvent}
        onBack={() => setView("dashboard")}
        user={user}
        t={t}
        guestMode={guestMode}
      />
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────
  return (
    <Dashboard
      user={user}
      events={events}
      setEvents={setEvents}
      onLogout={handleLogout}
      onOpenEvent={handleOpenEvent}
      lightMode={lightMode}
      onToggleTheme={() => setLightMode(m => !m)}
      t={t}
      lang={lang}
      setLang={setLang}
      guestMode={guestMode}
    />
  );
}
