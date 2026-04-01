/* eslint-disable */

// -----------------------------------------------------------------------------
// THEME — Palette couleurs (importée depuis constants.js)
// -----------------------------------------------------------------------------

// IMPORTANT : C n’est plus défini ici.
// Il est désormais défini dans constants.js et doit être importé depuis là.
// Ce fichier ne doit plus contenir de couleurs, ni de logique i18n.


// -----------------------------------------------------------------------------
// HOOK DE THEME (optionnel)
// -----------------------------------------------------------------------------
// Si tu veux gérer un mode clair/sombre, tu peux laisser un hook ici.
// Sinon, ce fichier peut rester minimal.

import { useState, useEffect } from "react";
import { C } from "./constants"; // couleurs centralisées

export function useTheme() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    document.body.style.background = lightMode ? "#ffffff" : C.dark;
  }, [lightMode]);

  return { lightMode, setLightMode, C };
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export { C };
