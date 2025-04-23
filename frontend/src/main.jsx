import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

createRoot(document.getElementById("root")).render(  
  <BrowserRouter>
    <App />
  </BrowserRouter>
);