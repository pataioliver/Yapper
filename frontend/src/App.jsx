import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { THEME_COLORS } from "./constants/themes.js";

const baseUrl = `${import.meta.env.VITE_FRONTEND_URL}/` || "/";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme, fontClass } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.classList.remove(...html.classList);
    html.classList.add(fontClass);

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

    const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    const manifestURL = URL.createObjectURL(blob);
    const manifestLink = document.querySelector('link[rel="manifest"]') || document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = manifestURL;
    document.head.appendChild(manifestLink);

    const themeColorMeta = document.querySelector('meta[name="theme-color"]') || document.createElement("meta");
    themeColorMeta.setAttribute("name", "theme-color");
    themeColorMeta.setAttribute("content", colors.theme_color);
    document.head.appendChild(themeColorMeta);

    return () => {
      URL.revokeObjectURL(manifestURL);
    };
  }, [theme, fontClass]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100 animate-glassMorphPulse border border-base-content/20">
        <Loader className="size-14 animate-spin text-tertiary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background gradient - fixed and non-scrolling */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-base-200 via-secondary/20 to-primary/10 opacity-95" />
      
      {/* Content area - scrollable */}
      <div className="relative min-h-screen w-full backdrop-blur-lg">
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={!authUser ? <VerifyEmailPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
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