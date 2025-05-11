import { create } from "zustand";
import { THEMES, THEME_COLORS } from "../constants/themes";

// Helper to normalize font name for Tailwind class
const normalizeFontName = (font) => {
  return font
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

// Helper to get a valid theme, fallback to first theme if not found
const getValidTheme = () => {
  const stored = localStorage.getItem("chat-theme");
  if (stored && THEMES.includes(stored)) return stored;
  if (stored) localStorage.removeItem("chat-theme");
  return THEMES[0]; // Default to the first theme (light)
};

export const useThemeStore = create((set) => {
  const theme = getValidTheme();
  const fontClass = `font-${
    normalizeFontName(THEME_COLORS[theme]?.font || "Inter, sans-serif")
  }`;

  // Set initial theme on document
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.add(fontClass);

  return {
    theme,
    fontClass,
    setTheme: (newTheme) => {
      const validTheme = THEMES.includes(newTheme) ? newTheme : THEMES[0];
      const font = THEME_COLORS[validTheme]?.font || "Inter, sans-serif";
      const fontClass = `font-${normalizeFontName(font)}`;
      localStorage.setItem("chat-theme", validTheme);
      set({ theme: validTheme, fontClass });
      document.documentElement.setAttribute("data-theme", validTheme);
      document.documentElement.className = "";
      document.documentElement.classList.add(fontClass);
    },
  };
});