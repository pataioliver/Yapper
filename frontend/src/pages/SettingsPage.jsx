import { useState, useEffect } from "react";
import { THEMES, THEME_COLORS } from "../constants/themes";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Check, Image, Bell, Reply } from "lucide-react";
import toast from "react-hot-toast";

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
    content: "Just gooning!",
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

  // Only for preview, not for the whole page
  const [previewFontClass, setPreviewFontClass] = useState(fontClass);

  useEffect(() => {
    setPreviewTheme(theme);
    setPreviewFontClass(fontClass);
  }, [theme, fontClass]);

  const handleThemeSelect = (selectedTheme) => {
    setSelectedThemeAnimation(selectedTheme);
    setPreviewTheme(selectedTheme);
    const font = THEME_COLORS[selectedTheme]?.font || "-apple-system, BlinkMacSystemFont, sans-serif";
    setPreviewFontClass(`font-${normalizeFontName(font)}`);

    setTimeout(() => setSelectedThemeAnimation(null), 400); // shorter animation
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
      toast.error("Notifications not supported.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Notifications enabled!", {
        icon: "🔔",
        className: "bg-secondary/40 text-secondary-content backdrop-blur-md border border-secondary/80 animate-glassMorphPulse"
      });
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js").catch(console.error);
      }
    } else if (permission === "denied") {
      toast.error("Notifications blocked. Enable in browser settings.");
    }
  };

  // Demo users for preview
  const authUser = { _id: "user2", fullName: "You", profilePicture: "/avatar.png" };
  const selectedChat = { _id: "user1", fullName: "Ariana Grande", profilePicture: "/avatar.png" };

  const getQuotedMessage = (replyToId) => PREVIEW_MESSAGES.find((msg) => msg.id === replyToId);

  // Notifications button should always use the *currently applied* theme's secondary color
  const notificationsSecondary = THEME_COLORS[theme]?.secondary || "#3b82f6";
  const notificationsSecondaryContent = THEME_COLORS[theme]?.["secondary-content"] || "#fff";
  // Use preview theme's secondary for apply theme button
  const previewSecondary = THEME_COLORS[previewTheme]?.secondary || "#3b82f6";
  const previewSecondaryContent = THEME_COLORS[previewTheme]?.["secondary-content"] || "#fff";

  // Helper for preview chat bubble
  const PreviewBubble = ({ message, quotedMessage, isOwnMessage }) => {
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
      if (quotedMessage.senderId === authUser._id) {
        quotedBg = "bg-secondary text-secondary-content border-l-4 border-secondary";
        quotedText = "text-secondary-content";
      } else {
        quotedBg = "bg-primary text-primary-content border-l-4 border-primary";
        quotedText = "text-primary-content";
      }
    }

    return (
      <div
        className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-glassyPop`}
      >
        <div className="chat-image avatar">
          <div className="size-8 rounded-full border border-quaternary/50">
            <img
              src={isOwnMessage ? authUser.profilePicture : selectedChat.profilePicture}
              alt="profile pic"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="chat-header mb-1">
          <time className="text-xs text-quaternary-content">{isOwnMessage ? "You" : selectedChat.fullName}</time>
        </div>
        <div
          className={`chat-bubble flex flex-col relative group ${bubbleBg} ${bubbleBorder} ${bubbleShadow} rounded-2xl p-3 font-medium text-base animate-glassyPop`}
        >
          {quotedMessage && (
            <div className={`mb-2 p-2 rounded-lg text-sm font-medium ${quotedBg} transition-all cursor-pointer`}>
              <p className="flex items-center gap-1">
                <Reply size={14} className="opacity-80" />
                <span className="font-semibold">{quotedMessage.senderId === authUser._id ? "You" : selectedChat.fullName}</span>
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
  };

  return (
    <div className={`min-h-screen px-4 pt-20 pb-8 animate-glassMorphPulse bg-transparent`}>
      <svg style={{ display: "none" }}>
        <symbol id="icon-image" viewBox="0 0 24 24">
          <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-2 0H5V5h14zm-7-3l2.03 2.71a1 1 0 0 0 1.54 0L19 13l-4.5-6-3.5 4.67L7 11z" />
        </symbol>
        <symbol id="icon-send" viewBox="0 0 24 24">
          <path d="M3.4 20.29a1 1 0 0 0 1.09.21l16-7a1 1 0 0 0 0-1.8l-16-7A1 1 0 0 0 3 5v14a1 1 0 0 0 .4.79zM5 6.62L17.15 12 5 17.38z" />
        </symbol>
        <symbol id="icon-reply" viewBox="0 0 24 24">
          <path d="M10 9V5l-7 7 7 7v-4.1c5.05 0 8.13 1.67 10 5.1-1-5-4-10-10-10z" />
        </symbol>
      </svg>
      <div className="max-w-5xl mx-auto bg-base-100/85 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-700 animate-glassMorph border border-base-content/20">
        <div className="space-y-8">
          <div className="flex justify-between items-center animate-slideIn">
            <h3 className="text-2xl font-semibold text-base-content">Notifications</h3>
            <button
              onClick={handleEnableNotifications}
              className="flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all duration-400 shadow-lg active:scale-95 animate-bounceInScale"
              style={{
                backgroundColor: notificationsSecondary,
                color: notificationsSecondaryContent,
              }}
            >
              <Bell size={20} className="shrink-0" />
              <span>Enable Notifications</span>
            </button>
          </div>

          <div className="space-y-3 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-base-content">Theme</h2>
            <p className="text-base text-base-content">Customize your experience with a theme</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3 animate-slideIn">
              <h3 className="text-xl font-semibold text-base-content">Current Theme</h3>
              <div
                className="flex flex-col items-center gap-3 p-10 rounded-3xl bg-base-100/15 backdrop-blur-2xl w-full max-w-lg mx-auto ring-4 ring-secondary shadow-[0_0_40px_var(--secondary)] border-2 border-secondary pointer-events-none transition-all duration-700 animate-glassMorph"
                data-theme={theme}
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

            <div className="space-y-3 animate-fadeIn">
              <h3 className="text-xl font-semibold text-base-content">Available Themes</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {THEMES.filter((t) => t !== theme).map((t, index) => {
                  const themeFont = THEME_COLORS[t]?.font || "-apple-system, BlinkMacSystemFont, sans-serif";
                  const themeFontClass = `font-${normalizeFontName(themeFont)}`;
                  const isAnimating = selectedThemeAnimation === t;
                  const isSelected = previewTheme === t;

                  return (
                    <button
                      key={t}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 animate-glassMorph border-2 relative overflow-hidden
            ${isSelected
                          ? "scale-110 ring-4 ring-secondary shadow-[0_0_35px_var(--secondary)] border-secondary z-20"
                          : "border-white/10"
                        }
            ${isAnimating ? "z-30" : ""}
          `}
                      onClick={() => handleThemeSelect(t)}
                      data-theme={t}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${THEME_COLORS[t].primary}15, ${THEME_COLORS[t].secondary}15)`,
                        animationDelay: `${index * 0.05}s`,
                        borderColor: isSelected
                          ? THEME_COLORS[t].secondary
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {/* Modern animation: expanding radial highlight and subtle glow */}
                      {isAnimating && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
                          <span className="absolute w-0 h-0 rounded-full bg-secondary/30 animate-themeSelectPop" />
                          <span className="absolute inset-0 rounded-2xl border-2 border-secondary/70 animate-themeSelectGlow" />
                        </span>
                      )}
                      <div className="w-16 h-14 rounded-lg overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.2)] border border-white/10 relative z-10">
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
                }}
              >
                <Check size={20} className="shrink-0" />
                <span>Apply Theme</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Preview */}
              <div className="flex-1 animate-glassMorph flex flex-col items-center">
                <div
                  className="relative w-80 h-[600px] rounded-[40px] shadow-[0_0_25px_rgba(255,255,255,0.3)] overflow-hidden border-8 border-secondary"
                  style={{
                    background: THEME_COLORS[previewTheme]?.['base-100']
                      ? `linear-gradient(to bottom, ${THEME_COLORS[previewTheme]['base-100']} 0%, ${THEME_COLORS[previewTheme]['base-100']} 100%)`
                      : 'linear-gradient(to bottom, #fff 0%, #fff 100%)',
                  }}
                >
                  {/* Dynamic Island */}
                  <div
                    className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-10"
                    style={{
                      backgroundColor: THEME_COLORS[previewTheme]?.secondary || '#6b7280'
                    }}
                  ></div>
                  {/* Screen Content */}
                  <div className={`absolute inset-0 bg-base-100/15 backdrop-blur-2xl ${previewFontClass}`} data-theme={previewTheme}>
                    <div className="h-full flex flex-col pt-12 px-3 pb-3" style={{ backgroundColor: THEME_COLORS[previewTheme]?.['base-100'] || '#ffffff' }}>
                      {/* Chat bubbles */}
                      <div className="flex-1 space-y-4 overflow-y-auto mt-2">
                        {/* Example: Own message with reply and reaction */}
                        <div className="chat chat-end animate-glassyPop">
                          <div className="chat-image avatar">
                            <div className="size-8 rounded-full border border-quaternary/50">
                              <img
                                src="/avatar.png"
                                alt="profile pic"
                                className="rounded-full"
                              />
                            </div>
                          </div>
                          <div className="chat-header mb-1 text-xs font-semibold text-quaternary-content/80">
                            You
                          </div>
                          <div className="chat-bubble bg-secondary text-secondary-content border-2 border-secondary shadow-[0_2px_16px_rgba(80,180,255,0.15)] rounded-2xl p-3 font-medium text-base animate-glassyPop">
                            <div className="mb-2 p-2 rounded-lg text-sm font-medium bg-primary text-primary-content border-l-4 border-primary transition-all cursor-pointer">
                              <p className="flex items-center gap-1">
                                <svg width="14" height="14" className="opacity-80"><use href="#icon-reply" /></svg>
                                <span className="font-semibold">Ariana Grande</span>
                              </p>
                              <p className="text-primary-content line-clamp-2">Hey, are you coming to the party?</p>
                            </div>
                            Yes, I’ll be there! 🎉
                            <div className="flex gap-1 mt-2">
                              <span className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 font-semibold bg-secondary text-secondary-content border-2 border-secondary backdrop-blur-md animate-glassyPop">👍</span>
                              <span className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 font-semibold bg-secondary text-secondary-content border-2 border-secondary backdrop-blur-md animate-glassyPop">❤️</span>
                            </div>
                          </div>
                        </div>
                        {/* Example: Other's message with reply and reaction */}
                        <div className="chat chat-start animate-glassyPop">
                          <div className="chat-image avatar">
                            <div className="size-8 rounded-full border border-quaternary/50">
                              <img
                                src="/avatar.png"
                                alt="profile pic"
                                className="rounded-full"
                              />
                            </div>
                          </div>
                          <div className="chat-header mb-1 text-xs font-semibold text-quaternary-content/80">
                            Ariana Grande
                          </div>
                          <div className="chat-bubble bg-primary text-primary-content border-2 border-primary shadow-[0_2px_16px_rgba(180,80,255,0.08)] rounded-2xl p-3 font-medium text-base animate-glassyPop">
                            <div className="mb-2 p-2 rounded-lg text-sm font-medium bg-secondary text-secondary-content border-l-4 border-secondary transition-all cursor-pointer">
                              <p className="flex items-center gap-1">
                                <svg width="14" height="14" className="opacity-80"><use href="#icon-reply" /></svg>
                                <span className="font-semibold">You</span>
                              </p>
                              <p className="text-secondary-content line-clamp-2">See you soon!</p>
                            </div>
                            Hey, are you coming to the party?
                            <div className="flex gap-1 mt-2">
                              <span className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 font-semibold bg-primary text-primary-content border-2 border-primary backdrop-blur-md animate-glassyPop">😂</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* MessageInput Preview (Mobile) */}
                      <form className="relative flex items-end gap-1 mt-2 px-1 py-1 bg-base-100/90 rounded-b-2xl border-t border-quaternary/10">
                        <button
                          type="button"
                          className="btn btn-circle btn-xs btn-ghost bg-gradient-to-br from-tertiary to-quaternary text-white border-none shadow transition-all duration-300 flex items-center justify-center"
                          disabled
                          tabIndex={-1}
                        >
                          <svg width="16" height="16" fill="currentColor" className="opacity-80">
                            <use href="#icon-image" />
                          </svg>
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
                          <svg width="14" height="14" fill="currentColor">
                            <use href="#icon-send" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-base-content mt-4 animate-fadeIn">Mobile Preview</p>
              </div>

              {/* Desktop Preview - Macintosh Style */}
              <div className="flex-1 animate-glassMorph flex flex-col items-center">
                <div
                  className="relative w-full max-w-md rounded-t-[20px] rounded-b-[6px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                  style={{
                    background: THEME_COLORS[previewTheme]?.['base-100']
                      ? `linear-gradient(to bottom, ${THEME_COLORS[previewTheme]['base-100']} 0%, ${THEME_COLORS[previewTheme]['base-100']} 100%)`
                      : 'linear-gradient(to bottom, #fff 0%, #fff 100%)',
                    borderTopColor: THEME_COLORS[previewTheme]?.secondary || '#9ca3af',
                    borderTopWidth: '24px'
                  }}
                >
                  {/* Macintosh Bezel */}
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

                  {/* Macintosh Screen */}
                  <div className={`p-6 rounded-b-[4px] ${previewFontClass}`} data-theme={previewTheme}>
                    <div className="space-y-4" style={{ backgroundColor: THEME_COLORS[previewTheme]?.['base-100'] || '#ffffff' }}>
                      {PREVIEW_MESSAGES.map((message, idx) => {
                        const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
                        const isOwnMessage = message.senderId === authUser._id;
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
                    {/* MessageInput Preview (Desktop) */}
                    <div className="mt-4 relative animate-fadeIn">
                      <form className="flex items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-circle btn-ghost bg-gradient-to-br from-tertiary to-quaternary text-white border-none shadow transition-all duration-300 flex items-center justify-center"
                          disabled
                          tabIndex={-1}
                        >
                          <svg width="20" height="20" fill="currentColor" className="opacity-80">
                            <use href="#icon-image" />
                          </svg>
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
                          <svg width="18" height="18" fill="currentColor">
                            <use href="#icon-send" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Macintosh Chin */}
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