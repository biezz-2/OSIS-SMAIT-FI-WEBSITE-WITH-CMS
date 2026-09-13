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

const STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.eventTheme = theme;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (_) {}
}

export function EventThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // 1. Initial sync from html.dark class or localStorage
    const readCurrentTheme = (): Theme => {
      if (typeof document !== "undefined") {
        if (document.documentElement.classList.contains("dark")) {
          return "dark";
        }
      }
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
      } catch (_) {}
      return "dark";
    };

    const current = readCurrentTheme();
    setTheme(current);
    document.documentElement.dataset.eventTheme = current;

    // 2. React to class="dark" mutation from Navbar's AnimatedThemeToggler
    const syncWithGlobalClass = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const nextTheme: Theme = isDark ? "dark" : "light";
      setTheme(nextTheme);
      document.documentElement.dataset.eventTheme = nextTheme;
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          syncWithGlobalClass();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
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
