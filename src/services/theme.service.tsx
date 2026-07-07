export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

function prefersDarkColorScheme(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return prefersDarkColorScheme() ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
}
