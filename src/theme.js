/* eslint-disable */

// -----------------------------------------------------------------------------
// THEME — Palette couleurs (importée depuis constants.js)
// -----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { C } from "./constants";

// -----------------------------------------------------------------------------
// HOOK DE THEME (optionnel)
// -----------------------------------------------------------------------------

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
