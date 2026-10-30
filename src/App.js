/* eslint-disable */
import { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebase";
import { collection, onSnapshot, query, where, setDoc, doc } from "firebase/firestore";

import Dashboard   from "./components/Dashboard";
import EventEditor from "./components/EventEditor/EventEditor";
import LoginScreen from "./components/LoginScreen";
import { useI18n } from "./i18n";
import GuestJoinPage from "./components/GuestJoinPage";

const SUPERADMIN_EMAIL = "rousseau.damien.91@gmail.com";

export default function App() {
  const [fbUser,          setFbUser]          = useState(undefined);
  const [user,            setUser]            = useState(null);
  const [events,          setEvents]          = useState([]);
  const [eventsLoaded,    setEventsLoaded]    = useState(false);
  const [view,            setView]            = useState("dashboard");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [guestMode,       setGuestMode]       = useState(false);
  const [lightMode,       setLightMode]       = useState(false);

  const { t, lang, setLang } = useI18n();

  // ── Route publique /join/:eventId ──────────────────────
  // Détectée AVANT auth — l'invité n'a pas besoin de compte
  var _path = typeof window !== "undefined" ? window.location.pathname : "";
  var _joinMatch = _path.match(/^\/join\/(.+)$/);
  var _joinEventId = _joinMatch ? _joinMatch[1] : null;

  // ── Auth Firebase ──
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (fu) => {
      if (fu) {
        setFbUser(fu);
        setUser({
          id:       fu.uid,
          name:     fu.displayName || fu.email,
          email:    fu.email,
          photoURL: fu.photoURL || null,
          avatar:   (fu.displayName || fu.email || "U")[0].toUpperCase(),
          role:     fu.email === SUPERADMIN_EMAIL ? "superadmin" : "admin",
          plan:     "free",
          subscriptionStatus: "active",
        });
      } else {
        setFbUser(null);
        setUser(null);
        setEvents([]);
        setEventsLoaded(false);
      }
    });
    return unsub;
  }, []);

  // ── Chargement Firestore ──
  useEffect(() => {
    if (!fbUser || guestMode) return;
    const q = query(collection(db, "events"), where("ownerId", "==", fbUser.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setEventsLoaded(true);
      },
      (err) => {
        console.warn("Firestore:", err.code, err.message);
        setEventsLoaded(true); // débloquer même en cas d'erreur
      }
    );
    return unsub;
  }, [fbUser, guestMode]);

  async function saveEvent(ev) {
    if (!fbUser || guestMode) return;
    try { await setDoc(doc(db, "events", String(ev.id)), ev); }
    catch(e) { console.error("Save error:", e); }
  }

  async function handleGoogleLogin() {
    try { await signInWithPopup(getAuth(), new GoogleAuthProvider()); }
    catch(e) { console.error("Login:", e); }
  }

  function handleGuestLogin() {
    const gev = {
      id: "guest-demo", ownerId: "guest", name: "Mon événement démo",
      date: new Date().toISOString().slice(0,10), type: "mariage", plan: "guest",
      roomShape: [{x:60,y:60},{x:740,y:60},{x:740,y:520},{x:60,y:520}],
      tables: [{id:"t1",number:1,capacity:5,shape:"round",label:"Table 1",x:300,y:280,guests:[]}],
      guests: [], constraints: [], menu: null,
    };
    setUser({ id:"guest", name:"Visiteur", email:"", photoURL:null, avatar:"👤", role:"guest", plan:"guest", subscriptionStatus:"guest" });
    setFbUser({ uid:"guest" });
    setEvents([gev]);
    setEventsLoaded(true);
    setGuestMode(true);
  }

  async function handleLogout() {
    if (guestMode) {
      setGuestMode(false); setFbUser(null); setUser(null);
      setEvents([]); setEventsLoaded(false);
      setView("dashboard"); setSelectedEventId(null);
      return;
    }
    await signOut(getAuth());
    setView("dashboard"); setSelectedEventId(null);
  }

  function handleUpdateEvent(updatedEv) {
    setEvents(prev => prev.map(e => e.id === updatedEv.id ? updatedEv : e));
    if (fbUser && !guestMode) saveEvent(updatedEv);
  }

  function handleOpenEvent(id) { setSelectedEventId(id); setView("event"); }

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // ── Route publique invité ──
  if (_joinEventId) return (
    <GuestJoinPage eventId={_joinEventId} />
  );

  // ── États ──
  if (fbUser === undefined) return (
    <div style={{minHeight:"100vh",background:"#120C08",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>⏳ Chargement...</div>
    </div>
  );

  if (!fbUser) return (
    <LoginScreen onLogin={handleGoogleLogin} onGuestLogin={handleGuestLogin} />
  );

  if (!eventsLoaded && !guestMode) return (
    <div style={{minHeight:"100vh",background:"#120C08",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>⏳ Chargement des événements...</div>
    </div>
  );

  if (view === "event" && selectedEvent) return (
    <EventEditor
      ev={selectedEvent} onUpdate={handleUpdateEvent}
      onBack={() => setView("dashboard")}
      user={user} t={t} guestMode={guestMode}
    />
  );

  return (
    <Dashboard
      user={user} events={events} setEvents={setEvents}
      onLogout={handleLogout} onOpenEvent={handleOpenEvent}
      lightMode={lightMode} onToggleTheme={() => setLightMode(m => !m)}
      t={t} lang={lang} setLang={setLang} guestMode={guestMode}
    />
  );
}
