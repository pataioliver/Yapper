import { useState } from "react";
import { THEMES } from "../constants/themes.js";
import { useThemeStore } from "../store/useThemeStore";
import { Send, ChevronRight, Check, Image, Bell } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [previewTheme, setPreviewTheme] = useState(theme);

  const handleApplyTheme = () => {
    setTheme(previewTheme);
  };

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      alert("Notifications enabled!");
      // Register the service worker for push notifications
      registerServiceWorkerForPush();
    } else if (permission === "denied") {
      alert("Notifications are disabled. Please enable them in your browser settings.");
    }
  };

  const registerServiceWorkerForPush = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        console.log("Service Worker registered for push notifications:", registration);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    } else {
      console.error("Service Worker is not supported in this browser.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-base-200 to-base-300/70 animate-in fade-in duration-600 flex items-center justify-center px-4 pt-20 pb-8">
      <div className="w-full max-w-5xl bg-base-100 rounded-lg p-6 shadow-lg shadow-primary/20 transition-all duration-400 hover:shadow-xl">
        <div className="space-y-6">

          {/* Add the notification button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Notifications
            </h3>
            <button
              onClick={handleEnableNotifications}
              className="btn btn-primary btn-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-primary/20"
            >
              <Bell size={18} />
              Enable Notifications
            </button>
          </div>


          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Theme
            </h2>
            <p className="text-sm text-base-content/70 transition-opacity duration-300 hover:opacity-80">
              Choose a theme for your chat interface
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-300
                  ${previewTheme === t ? "bg-base-200 shadow-md shadow-primary/20" : "hover:bg-base-200/70 hover:shadow-md hover:shadow-primary/20"}
                `}
                onClick={() => setPreviewTheme(t)}
              >
                <div
                  className="relative h-8 w-full rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Preview
            </h3>
            <button
              onClick={handleApplyTheme}
              className="btn btn-primary btn-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:shadow-primary/20"
            >
              <Check size={18} />
              Apply Theme
            </button>
          </div>

          <div
            className="flex-1 flex flex-col overflow-auto bg-base-100 rounded-xl shadow-md shadow-primary/20"
            data-theme={previewTheme}
          >
            {/* Chat Header */}
            <div className="p-2.5 border-b border-base-300 h-14 flex items-center bg-base-100 shadow-sm">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <button
                    className="p-1 bg-base-300 rounded"
                    disabled
                    aria-hidden="true"
                  >
                    <ChevronRight className="size-6 text-primary" />
                  </button>
                  <div className="avatar">
                    <div className="size-10 rounded-full border-2 border-primary/20">
                      <img src="/avatar.png" alt="John Doe" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-base bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      John Doe
                    </h3>
                    <p className="text-sm text-base-content/70">
                      Online
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`chat ${message.isSent ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-image avatar">
                    <div className="size-10 rounded-full border-2 border-primary/20">
                      <img src="/avatar.png" alt="profile pic" />
                    </div>
                  </div>
                  <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                      12:00 PM
                    </time>
                  </div>
                  <div
                    className={`
                      chat-bubble flex flex-col
                      ${message.isSent ? "bg-primary/20" : "bg-base-200"}
                    `}
                  >
                    <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 w-full bg-base-100">
              <div className="flex items-center gap-2 bg-base-100 rounded-lg p-2 shadow-md shadow-primary/10">
                <input
                  type="text"
                  className="flex-1 input input-bordered rounded-lg input-md focus:ring-2 focus:ring-primary focus:bg-base-100/90"
                  placeholder="Type a message..."
                  value="This is a preview"
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-md btn-circle text-zinc-400"
                  disabled
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="btn btn-md btn-circle text-zinc-400"
                  disabled
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;