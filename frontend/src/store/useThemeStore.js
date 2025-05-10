import { create } from "zustand";
import { THEME_COLORS } from "../constants/themes";

const normalizeFontName = (font) => {
  return font
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "iosLight",
  fontClass: `font-${
    normalizeFontName(
      THEME_COLORS[localStorage.getItem("chat-theme") || "iosLight"]?.font ||
        "-apple-system, BlinkMacSystemFont, sans-serif"
    )
  }`,
  setTheme: (theme) => {
    const font = THEME_COLORS[theme]?.font || "-apple-system, BlinkMacSystemFont, sans-serif";
    const fontClass = `font-${normalizeFontName(font)}`;
    localStorage.setItem("chat-theme", theme);
    set({ theme, fontClass });
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.remove(...document.documentElement.classList);
    document.documentElement.classList.add(fontClass);
  },
}));