import daisyui from "daisyui";
import { THEME_COLORS } from "./src/constants/themes.js";

/** 
 * @type {import('tailwindcss').Config} 
 * Tailwind CSS configuration with custom animation system
 * and theme integration with DaisyUI
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Custom color configuration for tertiary and quaternary colors
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
      // Unified animation system with consistent naming and timing
      animation: {
        // Basic UI animations
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
        slideIn: "slideIn 0.5s ease-in-out forwards",
        slideDown: "slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        scaleIn: "scaleIn 0.3s ease-out forwards",
        
        // Glow and pulse effects
        pulseGlow: "pulseGlow 2s infinite",
        pulseGlowDark: "pulseGlowDark 1.5s ease-in-out infinite",
        subtlePulse: "subtlePulse 2s ease-in-out infinite",
        
        // Interactive animations
        dynamicScale: "dynamicScale 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        bounceInScale: "bounceInScale 0.5s ease-out forwards",
        gentleBounce: "gentleBounce 2s ease-in-out infinite",
        underlineGrow: "underlineGrow 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        subtleScale: "subtleScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        sleekThemeSelect: "sleekThemeSelect 1s cubic-bezier(0.22, 1, 0.36, 1)",
        
        // Modern glassy animations - consistent naming
        glassyPop: "glassyPop 0.3s ease-out forwards",
        glassySlideIn: "glassySlideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        glassyFadeIn: "glassyFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        glassyBounce: "glassyBounce 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        glassyPulse: "glassyPulse 2s ease-in-out infinite",
        glassyReveal: "glassyReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        
        // Highlight animations
        highlight: "highlight 2s ease-in-out",
        highlightGlow: "highlightGlow 1.5s ease-in-out infinite",
        'highlight-quoted': "highlightQuoted 1.5s ease-in-out",
      },
      // Keyframes for all animations with consistent timing
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
        // Modern glassy keyframes with consistent timing
        glassyPop: {
          "0%": { opacity: 0, transform: "scale(0.95) translateY(10px)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
        glassySlideIn: {
          "0%": { opacity: 0, transform: "translateX(-40px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        glassyFadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        glassyBounce: {
          "0%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        glassyPulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        highlight: {
          "0%, 100%": { backgroundColor: "rgba(255, 255, 0, 0.3)" },
          "50%": { backgroundColor: "rgba(255, 255, 0, 0.6)" },
        },
        highlightGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255, 255, 0, 0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 255, 0, 0.6)" },
        },
        glassyReveal: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
        highlightQuoted: {
          "0%": { backgroundColor: "rgba(var(--tertiary-rgb), 0)" },
          "30%": { backgroundColor: "rgba(var(--tertiary-rgb), 0.2)" },
          "70%": { backgroundColor: "rgba(var(--tertiary-rgb), 0.2)" },
          "100%": { backgroundColor: "rgba(var(--tertiary-rgb), 0)" },
        },
      },
      // Font family definitions for consistent typography
      fontFamily: {
        arial: ["Arial", "Helvetica", "sans-serif"],
        verdana: ["Verdana", "Geneva", "sans-serif"],
        tahoma: ["Tahoma", "Geneva", "sans-serif"],
        georgia: ["Georgia", "serif"],
        palatino: ["Palatino", "Palatino Linotype", "serif"],
        courier: ["Courier New", "Courier", "monospace"],
        times: ["Times New Roman", "Times", "serif"],
        impact: ["Impact", "Charcoal", "sans-serif"],
        trebuchet: ["Trebuchet MS", "Geneva", "sans-serif"],
        lucida: ["Lucida Sans Unicode", "Lucida Grande", "sans-serif"],
        garamond: ["Garamond", "serif"],
        consolas: ["Consolas", "monospace"],
        system: [
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  // Safelist ensures these classes are always generated even if not found in templates
  safelist: [
    // Font families
    "font-arial",
    "font-verdana",
    "font-tahoma",
    "font-georgia",
    "font-palatino",
    "font-courier",
    "font-times",
    "font-impact",
    "font-trebuchet",
    "font-lucida",
    "font-garamond",
    "font-consolas",
    "font-system",
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
  // DaisyUI theme configuration
  daisyui: {
    themes: Object.keys(THEME_COLORS).map(theme => {
      const themeColors = THEME_COLORS[theme];
      // Detect light themes based on base-100 color
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