import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import RequestResetPasswordPage from "./pages/RequestResetPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { THEME_COLORS } from "./constants/themes.js";

/**
 * Base URL determination with fallback
 * Used for PWA manifest and resource references
 */
const baseUrl = `${import.meta.env.VITE_FRONTEND_URL}/` || "/";

/**
 * App Component - Main application container
 * Handles routing, authentication checks, and theme application
 */
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme, fontClass } = useThemeStore();

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply theme and generate dynamic PWA manifest
  useEffect(() => {
    // Apply theme and font to HTML element
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.classList.remove(...html.classList);
    html.classList.add(fontClass);

    // Generate dynamic PWA manifest based on current theme colors
    const colors = THEME_COLORS[theme] || THEME_COLORS.iosLight;
    const manifest = {
      name: "Yapper",
      short_name: "Yapper",
      icons: [
        { src: `${baseUrl}icons/icon-48x48.webp`, sizes: "48x48", type: "image/webp", purpose: "any" },
        { src: `${baseUrl}icons/icon-96x96.webp`, sizes: "96x96", type: "image/webp", purpose: "any" },
        { src: `${baseUrl}icons/icon-144x144.webp`, sizes: "144x144", type: "image/webp", purpose: "any" },
        { src: `${baseUrl}icons/icon-192x192.webp`, sizes: "192x192", type: "image/webp", purpose: "any" },
        { src: `${baseUrl}icons/icon-512x512.webp`, sizes: "512x512", type: "image/webp", purpose: "maskable" },
      ],
      theme_color: colors.theme_color,
      background_color: colors.background_color,
      display: "standalone",
      start_url: baseUrl,
      scope: baseUrl,
    };

    // Remove any existing manifest links
    document.querySelectorAll('link[rel="manifest"]').forEach(link => link.remove());

    // Create and apply dynamic manifest
    const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    const manifestURL = URL.createObjectURL(blob);
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = manifestURL;
    manifestLink.crossOrigin = "use-credentials"; // Optional, but recommended for PWA icons
    document.head.appendChild(manifestLink);

    // Apply theme color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute("content", colors.theme_color);

    // Clean up created object URLs and manifest link
    return () => {
      URL.revokeObjectURL(manifestURL);
      manifestLink.remove();
    };
  }, [theme, fontClass]);

  // Get theme colors for gradient
  const colors = THEME_COLORS[theme] || THEME_COLORS.iosLight;
  const gradPrimary = colors.primary || "#1e293b";
  const gradSecondary = colors.secondary || "#334155";
  const gradTertiary = colors.tertiary || "#0f172a";
  const gradQuaternary = colors.quaternary || "#18181b";
  const gradAccent = colors.accent || "#64748b";

  // Show loading screen while checking authentication
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100 animate-glassMorphPulse border border-base-content/20">
        <Loader className="size-14 animate-spin text-tertiary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Modern, multi-directional glassy gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            linear-gradient(120deg, ${gradPrimary} 0%, ${gradTertiary} 50%, ${gradSecondary} 100%),
            radial-gradient(circle at 70% 30%, ${gradAccent}88 0%, transparent 60%),
            radial-gradient(ellipse at 30% 70%, ${gradQuaternary}77 0%, transparent 70%),
            linear-gradient(90deg, #0008 0%, #0000 40%, #0000 60%, #0008 100%)
          `,
          backgroundBlendMode: "multiply, lighten, overlay",
          opacity: 0.98,
          WebkitBackdropFilter: "blur(32px) saturate(120%)",
          backdropFilter: "blur(32px) saturate(120%)",
          transition: "background 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      {/* Main content area with glassmorphism effect */}
      <div className="relative min-h-screen w-full backdrop-blur-lg">
        <Navbar />
        <Routes>
          {/* Protected routes */}
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          
          {/* Public routes */}
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={!authUser ? <VerifyEmailPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          
          {/* Mixed access routes */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/forgot-password" element={<RequestResetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>

        {/* Global toast notifications */}
        <Toaster
          position="top-center"
          containerStyle={{
            position: "fixed",
            top: "20px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          toastOptions={{
            style: {
              maxWidth: "400px",
              width: "fit-content",
              padding: "16px 24px",
              borderRadius: "12px",
              background: "hsl(var(--b1))",
              color: "hsl(var(--bc))",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: "1px solid hsl(var(--bc) / 0.1)",
              fontSize: "16px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
            },
            success: {
              icon: "✅",
              style: {
                background: "hsl(var(--su))",
                color: "hsl(var(--suc))",
              },
            },
            error: {
              icon: "❌",
              style: {
                background: "hsl(var(--er))",
                color: "hsl(var(--erc))",
              },
            },
            loading: {
              icon: "⏳",
              style: {
                background: "hsl(var(--wa))",
                color: "hsl(var(--wac))",
              },
            },
            duration: 5000,
          }}
        />
      </div>
    </div>
  );
};

export default App;