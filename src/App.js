/* eslint-disable */
import { useState, useEffect } from "react";
import { C, useI18n } from "./theme";
import { INITIAL_EVENTS } from "./constants";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import EventEditor from "./components/EventEditor";
import SuperAdminPanel from "./components/SuperAdmin";
import GuestJoinPage from "./components/GuestJoinPage";

// ═══════════════════════════════════════════════════════════════
// FIREBASE CONFIG
// ═══════════════════════════════════════════════════════════════

import { getFirebase } from "./firebase";

// ═══════════════════════════════════════════════════════════════
// FIREBASE AUTH HOOK
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

// ═══════════════════════════════════════════════════════════════
// APP — Composant racine
// ═══════════════════════════════════════════════════════════════

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
  const { t, lang, setLang } = useI18n(fbUser?.uid);

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
    // Utiliser window.firebase directement (SDK CDN déjà chargé)
    const trySubscribe = () => {
      if (!window.firebase || !window.firebase.firestore) {
        setTimeout(trySubscribe, 200);
        return;
      }
      const db = window.firebase.firestore();
      const unsub = db
        .collection("users").doc(fbUser.uid).collection("events")
        .onSnapshot(function(snap) {
          const evs = snap.docs.map(function(d){ return d.data(); });
          setEvents(evs);
          setEventsLoaded(true);
        }, function(err) {
          console.error("Snapshot error:", err);
          setEventsLoaded(true);
        });
      window.__eventsUnsub = unsub;
    };
    trySubscribe();
    return function(){ if (window.__eventsUnsub) { window.__eventsUnsub(); window.__eventsUnsub = null; } };
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
