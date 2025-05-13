// filepath: c:\Users\patai\OneDrive\Desktop\Yapper_local\Yapper\frontend\src\main.jsx
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

/**
 * Service Worker Registration
 * Enables offline functionality and PWA capabilities
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

/**
 * Application entry point
 * Renders the App component wrapped in BrowserRouter for routing
 */
createRoot(document.getElementById("root")).render(  
  <BrowserRouter>
    <App />
  </BrowserRouter>
);