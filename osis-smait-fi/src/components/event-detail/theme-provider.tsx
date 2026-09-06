"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Theme } from "./theme";

type EventThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const EventThemeContext = createContext<EventThemeContextValue | null>(null);

const STORAGE_KEY = "agoraacta-event-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.eventTheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (_) {}
}

export function EventThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initial: Theme =
        stored === "light" || stored === "dark" ? stored : "dark";
      setTheme(initial);
      applyTheme(initial);
    } catch (_) {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <EventThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </EventThemeContext.Provider>
  );
}

export function useEventTheme() {
  const context = useContext(EventThemeContext);
  if (!context) {
    throw new Error("useEventTheme must be used within EventThemeProvider");
  }
  return context;
}
