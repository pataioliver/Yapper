import { create } from 'zustand';
import { THEME_COLORS } from '../constants/themes';

// Available themes
const THEMES = Object.keys(THEME_COLORS);

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
  if (stored && THEMES.includes(stored)) {
    return stored;
  }
  return THEMES[0];
};

export const useThemeStore = create((set) => {
  const theme = getValidTheme();
  const fontClass = `font-${
    normalizeFontName(THEME_COLORS[theme]?.font || "Inter, sans-serif")
  }`;

  return {
    theme,
    fontClass,
    setTheme: (newTheme) => {
      if (THEMES.includes(newTheme)) {
        localStorage.setItem("chat-theme", newTheme);
        const fontClass = `font-${
          normalizeFontName(THEME_COLORS[newTheme]?.font || "Inter, sans-serif")
        }`;
        
        document.documentElement.setAttribute("data-theme", newTheme);
        document.documentElement.classList.remove(...document.documentElement.classList);
        document.documentElement.classList.add(fontClass);
        
        set({ theme: newTheme, fontClass });
      }
    }
  };
});