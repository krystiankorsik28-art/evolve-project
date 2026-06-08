import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

const ThemeCtx = createContext<Ctx>({ theme: "dark", setTheme: () => {}, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // hydrate from storage / system
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("edunex.theme") as Theme | null;
    const initial: Theme = stored ?? "dark";
    setTheme(initial);
  }, []);

  // apply to <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    try { window.localStorage.setItem("edunex.theme", theme); } catch { /* noop */ }
  }, [theme]);

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return <ThemeCtx.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
