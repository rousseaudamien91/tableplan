/* eslint-disable */
// ═══════════════════════════════════════════════════════════════
// FIREBASE — Config et initialisation partagée
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyAtDeOELj6om9-9mEdKVRbXMPG-i13szSo",
  authDomain: "tableplan-c4a6b.firebaseapp.com",
  projectId: "tableplan-c4a6b",
  storageBucket: "tableplan-c4a6b.firebasestorage.app",
  messagingSenderId: "659977410619",
  appId: "1:659977410619:web:ae761fbf149f923990641e",
};

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


export { getFirebase };
