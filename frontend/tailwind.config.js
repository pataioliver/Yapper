import daisyui from "daisyui";
import { THEME_COLORS } from "./src/constants/themes.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tertiary: {
          DEFAULT: "var(--tertiary)",
          content: "var(--tertiary-content)",
        },
        quaternary: {
          DEFAULT: "var(--quaternary)",
          content: "var(--quaternary-content)",
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
        slideIn: "slideIn 0.7s ease-in-out",
        slideDown: "slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        pulseGlow: "pulseGlow 1.5s ease-in-out infinite",
        pulseGlowDark: "pulseGlowDark 1.5s ease-in-out infinite",
        scaleIn: "scaleIn 0.8s ease-out",
        glassMorph: "glassMorph 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        glassMorphPulse: "glassMorphPulse 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        dynamicScale: "dynamicScale 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        bounceInScale: "bounceInScale 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        gentleBounce: "gentleBounce 2s ease-in-out infinite",
        underlineGrow: "underlineGrow 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        subtleScale: "subtleScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        sleekThemeSelect: "sleekThemeSelect 1s cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)" },
        },
        pulseGlowDark: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 0, 0, 0.4)" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        glassMorph: {
          "0%": { opacity: 0, transform: "scale(0.97) translateY(8px)", filter: "blur(1.5px)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)", filter: "blur(0)" },
        },
        glassMorphPulse: {
          "0%": { opacity: 0, transform: "scale(0.98) translateY(10px)", filter: "blur(2px)", boxShadow: "0 0 15px rgba(255,255,255,0.2)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)", filter: "blur(0)", boxShadow: "0 0 25px rgba(255,255,255,0.4)" },
        },
        dynamicScale: {
          "0%": { transform: "scale(0.95)", opacity: 0.8 },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        bounceInScale: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        sleekThemeSelect: {
          "0%": { transform: "scale(1) translateY(0)", boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.3)", opacity: 0.9 },
          "50%": { transform: "scale(1.12) translateY(-4px)", boxShadow: "0 0 30px 10px rgba(255, 255, 255, 0.5)", opacity: 1 },
          "100%": { transform: "scale(1) translateY(0)", boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.3)", opacity: 1 },
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        nunito: ['Nunito', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
        georgia: ['Georgia', 'serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        lora: ['Lora', 'serif'],
        robotoMono: ['Roboto Mono', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        spaceMono: ['Space Mono', 'monospace'],
        firaCode: ['Fira Code', 'monospace'],
      },
    },
  },
  safelist: [
    "font-inter",
    "font-roboto",
    "font-poppins",
    "font-montserrat",
    "font-opensans",
    "font-lato",
    "font-nunito",
    "font-raleway",
    "font-orbitron",
    "font-georgia",
    "font-lora",
    "font-merriweather",
    "font-robotoMono",
    "font-playfair",
    "font-firaCode",
    "font-quicksand",
    "font-spaceMono",
    "font-sanfrancisco",
    // Color utilities
    "bg-tertiary",
    "bg-tertiary/25",
    "bg-tertiary/50",
    "border-tertiary",
    "border-tertiary/50",
    "text-tertiary-content",
    "bg-quaternary",
    "bg-quaternary/25",
    "bg-quaternary/50",
    "border-quaternary",
    "border-quaternary/50",
    "text-quaternary-content",
  ],
  plugins: [daisyui],
  daisyui: {
    themes: Object.keys(THEME_COLORS).map(theme => {
      const themeColors = THEME_COLORS[theme];
      const isLightTheme = themeColors["base-100"] && /^#(f|e|d)[0-9a-fA-F]{5}$/.test(themeColors["base-100"]);
      return {
        [theme]: {
          ...themeColors,
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "normal-case",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
          "--glow": isLightTheme ? "pulseGlowDark" : "pulseGlow",
        },
      };
    }),
  },
};