/* eslint-disable */
// Formules et codes promo — source unique côté application.
// La sécurité ne repose PAS sur ce fichier : les limites et les codes sont vérifiés par les règles
// Firestore (firestore.rules). Les codes promo ne sont jamais présents dans le code du site :
// ils vivent dans la collection « vouchers », illisible pour les utilisateurs.
import { useEffect, useState } from "react";
import { doc, onSnapshot, writeBatch, increment, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Doit rester aligné avec maxGuests() dans firestore.rules
export const OFFRES = {
  free:   { label: "Gratuit",   price: 0,  maxGuests: 10,   description: "Jusqu'à 10 invités" },
  medium: { label: "Essentiel", price: 20, maxGuests: 50,   description: "Jusqu'à 50 invités" },
  full:   { label: "Complet",   price: 39, maxGuests: 2000, description: "Jusqu'à 2 000 invités" },
};

export function offreDe(plan) {
  return OFFRES[plan] || OFFRES.free;
}

// Droits du compte : document entitlements/{uid}, écrit uniquement via un code promo valide
// (vérifié par les règles) ou par l'administrateur.
export function useEntitlement(uid) {
  const [ent, setEnt] = useState({ plan: "free", loaded: false });
  useEffect(() => {
    if (!uid || uid === "guest") { setEnt({ plan: "free", loaded: true }); return; }
    return onSnapshot(
      doc(db, "entitlements", uid),
      snap => setEnt(snap.exists() ? { ...snap.data(), loaded: true } : { plan: "free", loaded: true }),
      ()   => setEnt({ plan: "free", loaded: true })
    );
  }, [uid]);
  return ent;
}

export function normaliserCode(code) {
  return String(code || "").trim().toUpperCase().replace(/\s+/g, "");
}

// Utilise un code promo. Les règles Firestore n'acceptent l'écriture groupée que si le code existe,
// est actif, n'a pas atteint son nombre d'utilisations et donne bien la formule demandée.
// Le plan visé est inconnu du client : on essaie du plus élevé au plus bas.
export async function utiliserCode(uid, code) {
  const c = normaliserCode(code);
  if (!/^[A-Z0-9-]{6,40}$/.test(c)) throw new Error("invalide");
  for (const plan of ["full", "medium"]) {
    const batch = writeBatch(db);
    batch.update(doc(db, "vouchers", c), { uses: increment(1) });
    batch.set(doc(db, "entitlements", uid), { plan, code: c, source: "voucher", at: serverTimestamp() });
    try {
      await batch.commit();
      return plan;
    } catch (e) {
      if (e.code !== "permission-denied" && e.code !== "not-found") throw e;
    }
  }
  throw new Error("invalide");
}
