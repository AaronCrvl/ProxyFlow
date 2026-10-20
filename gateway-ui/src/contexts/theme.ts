import React from "react";
import type { Theme, ThemeContextValue } from "../data/types/theme.data";

export const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");

  return ctx;
};

export const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem("themePreference");
    if (saved === "light" || saved === "dark") return saved;
  } catch (error: unknown) {
    console.warn("Could not read the saved theme preference.", error);
  }

  return "light";
};
