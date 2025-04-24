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
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //console.log({ authUser });

  // dynamic manifest change
  useEffect(() => {

    document.querySelector('html').setAttribute('data-theme', theme);

    const currentThemeColors = THEME_COLORS[theme] || THEME_COLORS.dark;

    let manifest = {
      name: "Yapper",
      short_name: "Yapper",
      icons: [
        {
          src: `${baseUrl}icons/icon-48x48.webp`,
          sizes: "48x48",
          type: "image/webp",
          purpose: "any"
        },
        {
          src: `${baseUrl}icons/icon-96x96.webp`,
          sizes: "96x96",
          type: "image/webp",
          purpose: "any"
        },
        {
          src: `${baseUrl}icons/icon-144x144.webp`,
          sizes: "144x144",
          type: "image/webp",
          purpose: "any"
        },
        {
          src: `${baseUrl}icons/icon-192x192.webp`,
          sizes: "192x192",
          type: "image/webp",
          purpose: "any"
        },
        {
          src: `${baseUrl}icons/icon-512x512.webp`,
          sizes: "512x512",
          type: "image/webp",
          purpose: "maskable"
        }
      ],
      theme_color: "#000000",
      background_color: "#000000",
      display: "standalone",
      start_url: baseUrl,
      scope: baseUrl,
    };

    manifest = {
      ...manifest,
      theme_color: currentThemeColors.theme_color,
      background_color: currentThemeColors.background_color
    };

    const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    const manifestURL = URL.createObjectURL(blob);

    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute("href", manifestURL);
    } else {
      console.error("Manifest link not found.");
    }

    let themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMetaTag) {
        themeColorMetaTag = document.createElement('meta');
        themeColorMetaTag.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMetaTag);
    }
    themeColorMetaTag.setAttribute('content', currentThemeColors.theme_color);
    console.log("Generated manifest URL:", manifestURL);
    console.log("Manifest link updated:", manifestLink);
  }, [theme]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/verify-email" element={!authUser ? <VerifyEmailPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;