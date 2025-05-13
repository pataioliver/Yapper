import { useState, useEffect, memo } from "react";
import { THEMES, THEME_COLORS } from "../constants/themes";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Check, Image, Bell, Reply, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Helper: check if a hex color is light
const isLightColor = (hex) => {
  if (!hex) return true;
  const c = hex.replace("#", "");
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 180;
};

// Memoize preview components for better performance
const PreviewBubble = memo(({ message, quotedMessage, isOwnMessage }) => {
  // Bubble color logic
  const bubbleBg = isOwnMessage
    ? "bg-secondary text-secondary-content"
    : "bg-primary text-primary-content";
  const bubbleBorder = isOwnMessage
    ? "border-2 border-secondary"
    : "border-2 border-primary";
  const bubbleShadow = isOwnMessage
    ? "shadow-[0_2px_16px_rgba(80,180,255,0.15)]"
    : "shadow-[0_2px_16px_rgba(180,80,255,0.08)]";

  // Quoted reply color logic
  let quotedBg = "bg-quaternary text-quaternary-content border-l-4 border-quaternary";
  let quotedText = "text-quaternary-content";
  if (quotedMessage) {
    if (quotedMessage.senderId === "user2") {
      quotedBg = "bg-secondary text-secondary-content border-l-4 border-secondary";
      quotedText = "text-secondary-content";
    } else {
      quotedBg = "bg-primary text-primary-content border-l-4 border-primary";
      quotedText = "text-primary-content";
    }
  }

  return (
    <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-glassyPop`}>
      <div className="chat-image avatar">
        <div className="size-8 rounded-full border border-quaternary/50">
          <img
            src="/avatar.png"
            alt="profile pic"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        <time className="text-xs text-base-content">{isOwnMessage ? "You" : "Ariana Grande"}</time>
      </div>
      <div
        className={`chat-bubble flex flex-col relative group ${bubbleBg} ${bubbleBorder} ${bubbleShadow} rounded-2xl p-3 font-medium text-base animate-glassyPop`}
      >
        {quotedMessage && (
          <div className={`mb-2 p-2 rounded-lg text-sm font-medium ${quotedBg} transition-all cursor-pointer`}>
            <p className="flex items-center gap-1">
              <Reply size={14} className="opacity-80" />
              <span className="font-semibold">{quotedMessage.senderId === "user2" ? "You" : "Ariana Grande"}</span>
            </p>
            <p className={`${quotedText} line-clamp-2`}>{quotedMessage.content}</p>
          </div>
        )}
        <p className="text-content">{message.content}</p>
        {message.reactions?.length > 0 && (
          <div className="flex gap-1 mt-2">
            {message.reactions.map((reaction, rIdx) => (
              <span
                key={rIdx}
                className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 font-semibold
                  ${isOwnMessage
                    ? "bg-secondary text-secondary-content border-2 border-secondary"
                    : "bg-primary text-primary-content border-2 border-primary"
                  }
                  backdrop-blur-md animate-glassyPop`}
              >
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// Sample messages for theme preview
const PREVIEW_MESSAGES = [
  {
    id: 1,
    content: "Yo, what's good?",
    isSent: false,
    senderId: "user1",
    reactions: [{ emoji: "👍", userId: "user2" }],
    replyToId: null,
  },
  {
    id: 2,
    content: "Just geeking!",
    isSent: true,
    senderId: "user2",
    reactions: [{ emoji: "❤️", userId: "user1" }, { emoji: "😄", userId: "user1" }],
    replyToId: 1,
  },
];

const normalizeFontName = (font) => {
  return font
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const SettingsPage = () => {
  const { theme, fontClass, setTheme } = useThemeStore();
  const [previewTheme, setPreviewTheme] = useState(theme);
  const [selectedThemeAnimation, setSelectedThemeAnimation] = useState(null);
  const [previewFontClass, setPreviewFontClass] = useState(fontClass);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Keep preview in sync with current theme
  useEffect(() => {
    setPreviewTheme(theme);
    setPreviewFontClass(fontClass);
  }, [theme, fontClass]);

  const handleThemeSelect = (selectedTheme) => {
    setPreviewTheme(selectedTheme);
    setPreviewFontClass(`font-${normalizeFontName(THEME_COLORS[selectedTheme]?.font || "Inter, sans-serif")}`);
    setSelectedThemeAnimation(selectedTheme);
    setTimeout(() => setSelectedThemeAnimation(null), 700);
  };

  const handleApplyTheme = () => {
    setTheme(previewTheme);
    toast.success("Theme applied!", {
      icon: "🎨",
      className: "bg-primary/40 text-primary-content backdrop-blur-md border border-primary/80 animate-glassMorphPulse"
    });
  };

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported in this browser");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Notifications enabled!", {
          icon: "🔔",
          className: "bg-secondary/40 text-secondary-content backdrop-blur-md border border-secondary/80 animate-glassMorphPulse"
        });

        // Register service worker if notifications are granted
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.register("/service-worker.js").catch(console.error);
        }
      } else if (permission === "denied") {
        toast.error("Notifications blocked. Please enable them in your browser settings.");
      }
    } catch (error) {
      toast.error("Error enabling notifications");
      console.error("Notification error:", error);
    }
  };

  const getQuotedMessage = (replyToId) => PREVIEW_MESSAGES.find((msg) => msg.id === replyToId);

  // Use current theme colors for notifications button
  const notificationsSecondary = THEME_COLORS[theme]?.secondary || "#3b82f6";
  const notificationsSecondaryContent = THEME_COLORS[theme]?.["secondary-content"] || "#fff";
  const notificationsIsLight = isLightColor(notificationsSecondary);

  // Use preview theme colors for apply button
  const previewSecondary = THEME_COLORS[previewTheme]?.secondary || "#3b82f6";
  const previewSecondaryContent = THEME_COLORS[previewTheme]?.["secondary-content"] || "#fff";
  const previewIsLight = isLightColor(previewSecondary);

  return (
    <div className={`min-h-screen px-4 sm:px-6 pt-20 pb-8 backdrop-blur-xl ${isMounted ? 'animate-glassMorphPulse' : 'opacity-90'}`}>
      <div
        className="max-w-5xl mx-auto bg-base-100/85 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-secondary/40 shadow-[0_0_60px_10px_var(--secondary),0_0_30px_10px_rgba(80,180,255,0.15)] animate-glassMorphPulse transition-all duration-700"
        style={{
          boxShadow: isLightColor(THEME_COLORS[theme]?.secondary)
            ? "0 0 60px 10px rgba(0,0,0,0.18), 0 0 30px 10px rgba(80,180,255,0.10)"
            : "0 0 60px 10px var(--secondary), 0 0 30px 10px rgba(80,180,255,0.15)",
          borderColor: "var(--secondary)",
          animation: "pulseGlow 2.5s infinite",
        }}
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Updated header with proper centering */}
          <div className="relative mb-6">


            {/* Centered title, similar to ProfilePage */}
            <div className={`text-center ${isMounted ? 'animate-bounceInScale' : 'opacity-0'}`}>
              <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Settings</h1>
              <p className="mt-2 text-sm sm:text-base text-base-content/70">
                Customize your experience
              </p>
            </div>
          </div>

          {/* Notifications button moved below the title */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleEnableNotifications}
              className={`flex items-center gap-2 rounded-xl px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-400 shadow-lg active:scale-95 ${isMounted ? 'animate-bounceInScale' : 'opacity-0'}`}
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-content)",
                animationDelay: "0.2s",
                boxShadow: notificationsIsLight
                  ? "0 0 16px 2px rgba(0,0,0,0.18)"
                  : "0 0 16px 2px rgba(255,255,255,0.35)"
              }}
            >
              <Bell size={18} className="shrink-0" />
              <span>Enable Notifications</span>
            </button>
          </div>

          {/* Rest of the settings content remains unchanged */}
          <div className={`space-y-3 ${isMounted ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: "0.3s" }}>
            <h2 className="text-2xl font-semibold text-base-content">Theme</h2>
            <p className="text-base text-base-content">Customize your experience with a theme</p>
          </div>

          <div className="space-y-6">
            <div className={`space-y-3 ${isMounted ? 'animate-slideIn' : 'opacity-0'}`} style={{ animationDelay: "0.4s" }}>
              <h3 className="text-xl font-semibold text-base-content">Current Theme</h3>
              <div
                className={`flex flex-col items-center gap-3 p-6 sm:p-10 rounded-3xl bg-base-100/15 backdrop-blur-2xl w-full max-w-md mx-auto ring-4 ring-secondary shadow-[0_0_40px_var(--secondary)] border-2 border-secondary pointer-events-none transition-all duration-700 ${isMounted ? 'animate-glassMorph' : 'opacity-0'}`}
                data-theme={theme}
                style={{ animationDelay: "0.5s" }}
              >
                <div className="w-36 h-32 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white/10">
                  <div className="h-8" style={{ backgroundColor: THEME_COLORS[theme].primary }} />
                  <div className="h-8" style={{ backgroundColor: THEME_COLORS[theme].secondary }} />
                  <div className="h-8" style={{ backgroundColor: THEME_COLORS[theme].tertiary }} />
                  <div className="h-8" style={{ backgroundColor: THEME_COLORS[theme].quaternary }} />
                </div>
                <span className="text-lg font-semibold text-base-content">
                  {theme
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace("Ios", "iOS")
                    .replace("Oled", "OLED")}
                </span>
              </div>
            </div>

            <div className={`space-y-3 ${isMounted ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: "0.6s" }}>
              <h3 className="text-xl font-semibold text-base-content">Available Themes</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {THEMES.filter((t) => t !== theme).map((t, index) => {
                  const themeFont = THEME_COLORS[t]?.font || "-apple-system, BlinkMacSystemFont, sans-serif";
                  const themeFontClass = `font-${normalizeFontName(themeFont)}`;
                  const isAnimating = selectedThemeAnimation === t;
                  const isSelected = previewTheme === t;

                  // Add a contrasting background and a stronger border/shadow
                  const boxBg = THEME_COLORS[t]?.["base-100"] || "#fff";
                  const boxBorder = isSelected
                    ? THEME_COLORS[t].secondary
                    : "rgba(0,0,0,0.08)";
                  const boxShadow = isSelected
                    ? `0 0 35px ${THEME_COLORS[t].secondary}, 0 2px 8px rgba(0,0,0,0.08)`
                    : "0 2px 8px rgba(0,0,0,0.08)";

                  return (
                    <button
                      key={t}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 animate-glassMorph border-2 relative overflow-hidden
                        ${isSelected
                          ? "scale-110 ring-4 ring-secondary border-secondary z-20"
                          : ""
                        }
                        ${isAnimating ? "z-30" : ""}`}
                      onClick={() => handleThemeSelect(t)}
                      data-theme={t}
                      style={{
                        background: `linear-gradient(135deg, ${boxBg} 80%, ${THEME_COLORS[t].secondary}10)`,
                        borderColor: boxBorder,
                        boxShadow: boxShadow,
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      {isAnimating && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
                          <span className="absolute w-0 h-0 rounded-full bg-secondary/30 animate-themeSelectPop" />
                          <span className="absolute inset-0 rounded-2xl border-2 border-secondary/70 animate-themeSelectGlow" />
                        </span>
                      )}
                      <div className="w-16 h-14 rounded-lg overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.10)] border border-white/10 relative z-10">
                        <div className="h-3.5" style={{ backgroundColor: THEME_COLORS[t].primary }} />
                        <div className="h-3.5" style={{ backgroundColor: THEME_COLORS[t].secondary }} />
                        <div className="h-3.5" style={{ backgroundColor: THEME_COLORS[t].tertiary }} />
                        <div className="h-3.5" style={{ backgroundColor: THEME_COLORS[t].quaternary }} />
                      </div>
                      <span className={`text-xs font-medium text-base-content ${themeFontClass} truncate w-full text-center relative z-10`}>
                        {t
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .replace("Ios", "iOS")
                          .replace("Oled", "OLED")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center animate-slideIn">
              <h3 className="text-2xl font-semibold text-base-content">Preview</h3>
              <button
                onClick={handleApplyTheme}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all duration-400 shadow-lg active:scale-95 animate-bounceInScale ${previewFontClass}`}
                style={{
                  backgroundColor: previewSecondary,
                  color: previewSecondaryContent,
                  boxShadow: previewIsLight
                    ? "0 0 16px 2px rgba(0,0,0,0.18)"
                    : "0 0 16px 2px rgba(255,255,255,0.35)"
                }}
              >
                <Check size={20} className="shrink-0" />
                <span>Apply Theme</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 animate-glassMorph flex flex-col items-center">
                <div
                  className="relative w-80 h-[600px] rounded-[40px] shadow-[0_0_25px_rgba(255,255,255,0.3)] overflow-hidden border-8"
                  style={{
                    background: "transparent",
                    borderColor: THEME_COLORS[previewTheme]?.secondary || '#6b7280'
                  }}
                >
                  <div
                    className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-10"
                    style={{
                      backgroundColor: THEME_COLORS[previewTheme]?.secondary || '#6b7280'
                    }}
                  ></div>
                  <div className={`absolute inset-0 bg-base-100/15 backdrop-blur-2xl ${previewFontClass}`} data-theme={previewTheme}>
                    <div className="h-full flex flex-col pt-12 px-3 pb-3" style={{ backgroundColor: THEME_COLORS[previewTheme]?.['base-100'] || '#ffffff' }}>
                      <div className="flex-1 space-y-4 overflow-y-auto mt-2">
                        {PREVIEW_MESSAGES.map((message, idx) => {
                          const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
                          const isOwnMessage = message.senderId === "user2";
                          return (
                            <PreviewBubble
                              key={message.id}
                              message={message}
                              quotedMessage={quotedMessage}
                              isOwnMessage={isOwnMessage}
                            />
                          );
                        })}
                      </div>
                      <form className="relative flex items-end gap-1 mt-2 px-1 py-1 bg-base-100/90 rounded-b-2xl border-t border-quaternary/10">
                        <button
                          type="button"
                          className="btn btn-circle btn-xs btn-ghost bg-gradient-to-br from-tertiary to-quaternary text-white border-none shadow transition-all duration-300 flex items-center justify-center"
                          disabled
                          tabIndex={-1}
                        >
                          <Image size={16} className="opacity-80" />
                        </button>
                        <input
                          type="text"
                          className="flex-1 input input-xs input-bordered rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 bg-base-200/70 backdrop-blur-md shadow-inner placeholder:text-quaternary-content/60 transition-all duration-200"
                          placeholder="Type your message..."
                          disabled
                        />
                        <button
                          type="button"
                          className="btn btn-circle btn-xs bg-gradient-to-br from-primary to-secondary text-white border-none shadow transition-all duration-300 flex items-center justify-center"
                          disabled
                          tabIndex={-1}
                        >
                          <Send size={14} className="text-primary-content" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-base-content mt-4 animate-fadeIn">Mobile Preview</p>
              </div>

              <div className="flex-1 animate-glassMorph flex flex-col items-center">
                <div
                  className="relative w-full max-w-md rounded-t-[20px] rounded-b-[6px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                  style={{
                    background: "transparent",
                    borderTopColor: THEME_COLORS[previewTheme]?.secondary || '#9ca3af',
                    borderTopWidth: '24px'
                  }}
                >
                  <div className="absolute -top-[22px] left-0 right-0 h-6 flex items-center justify-center">
                    <div
                      className="w-3 h-3 rounded-full absolute left-4"
                      style={{ backgroundColor: THEME_COLORS[previewTheme]?.primary || '#ff0000' }}
                    ></div>
                    <div
                      className="w-3 h-3 rounded-full absolute left-8"
                      style={{ backgroundColor: THEME_COLORS[previewTheme]?.tertiary || '#ffff00' }}
                    ></div>
                    <div
                      className="w-3 h-3 rounded-full absolute left-12"
                      style={{ backgroundColor: THEME_COLORS[previewTheme]?.quaternary || '#00ff00' }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-t-[20px]"
                      style={{
                        background: `linear-gradient(to bottom, ${THEME_COLORS[previewTheme]?.tertiary || '#6b7280'}30, transparent)`
                      }}
                    ></div>
                  </div>
                  <div className={`p-6 rounded-b-[4px] ${previewFontClass}`} data-theme={previewTheme}>
                    <div className="space-y-4" style={{ backgroundColor: THEME_COLORS[previewTheme]?.['base-100'] || '#ffffff' }}>
                      {PREVIEW_MESSAGES.map((message, idx) => {
                        const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
                        const isOwnMessage = message.senderId === "user2";
                        return (
                          <PreviewBubble
                            key={message.id}
                            message={message}
                            quotedMessage={quotedMessage}
                            isOwnMessage={isOwnMessage}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-4 relative animate-fadeIn">
                      <form className="flex items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-circle btn-ghost bg-gradient-to-br from-tertiary to-quaternary text-white border-none shadow transition-all duration-300 flex items-center justify-center"
                          disabled
                          tabIndex={-1}
                        >
                          <Image size={20} className="opacity-80" />
                        </button>
                        <input
                          type="text"
                          className="flex-1 input input-bordered rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 bg-base-200/70 backdrop-blur-md shadow-inner placeholder:text-quaternary-content/60 transition-all duration-200"
                          placeholder="Type your message..."
                          disabled
                        />
                        <button
                          type="button"
                          className="btn btn-circle bg-gradient-to-br from-primary to-secondary text-white border-none shadow transition-all duration-300 flex items-center justify-center"
                          disabled
                          tabIndex={-1}
                        >
                          <Send size={18} className="text-primary-content" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-[6px] left-0 right-0 h-6 rounded-b-[6px]"
                    style={{
                      backgroundColor: THEME_COLORS[previewTheme]?.secondary || '#9ca3af'
                    }}
                  >
                    <div className="w-16 h-1 rounded-full bg-gray-500/70 mx-auto mt-2"></div>
                  </div>
                </div>
                <p className="text-center text-sm text-base-content mt-4 animate-fadeIn">Desktop Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;