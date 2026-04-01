/* eslint-disable */

import { useState, useEffect } from "react";
import { THEMES } from "./themes";
import { C } from "./palette";

export function useTheme(initial = "dark") {
  const [mode, setMode] = useState(initial);

  const theme = THEMES[mode] || THEMES.dark;

  useEffect(() => {
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
    document.body.style.transition = theme.transition;
  }, [theme]);

  const toggleTheme = () => {
    const keys = Object.keys(THEMES);
    const idx = keys.indexOf(mode);
    const next = keys[(idx + 1) % keys.length];
    setMode(next);
  };

  return {
    mode,
    theme,
    colors: C,
    toggleTheme,
    setTheme: setMode,
  };
}
