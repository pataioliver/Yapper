import { useState, useEffect } from "react";
import { THEMES, THEME_COLORS } from "../constants/themes.js";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Check, Image, Bell } from "lucide-react";
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
    replyToId: "1",
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
  const [previewFontClass, setPreviewFontClass] = useState(fontClass);
  const [selectedThemeAnimation, setSelectedThemeAnimation] = useState(null);

  useEffect(() => {
    setPreviewTheme(theme);
    setPreviewFontClass(fontClass);
  }, [theme, fontClass]);

  const handleThemeSelect = (selectedTheme) => {
    setSelectedThemeAnimation(selectedTheme);
    setPreviewTheme(selectedTheme);
    const font = THEME_COLORS[selectedTheme]?.font || "-apple-system, BlinkMacSystemFont, sans-serif";
    setPreviewFontClass(`font-${normalizeFontName(font)}`);

    setTimeout(() => setSelectedThemeAnimation(null), 1000);
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

  const authUser = { _id: "user2", fullName: "You" };
  const selectedUser = { _id: "user1", fullName: "Ariana Grande" };

  const getQuotedMessage = (replyToId) => PREVIEW_MESSAGES.find((msg) => msg.id === replyToId);

  return (
    <div className={`min-h-screen px-4 pt-20 pb-8 animate-glassMorphPulse bg-transparent ${fontClass}`}>
      <div className="max-w-5xl mx-auto bg-base-100/85 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-700 animate-glassMorph border border-base-content/20">
        <div className="space-y-8">
          <div className="flex justify-between items-center animate-slideIn">
            <h3 className="text-2xl font-semibold text-base-content">Notifications</h3>
            <button
              onClick={handleEnableNotifications}
              className="flex items-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-opacity-90 transition-all duration-400 shadow-lg hover:shadow-xl active:scale-95 animate-bounceInScale"
              style={{
                backgroundColor: THEME_COLORS[previewTheme]?.secondary || '#3b82f6',
                color: THEME_COLORS[previewTheme]?.['secondary-content'] || '#ffffff',
              }}
            >
              <Bell size={20} className="shrink-0" />
              <span>Enable Notifications</span>
            </button>
          </div>

          <div className="space-y-3 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-base-content">Theme</h2>
            <p className="text-base text-quaternary-content">Customize your experience with a theme</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3 animate-slideIn">
              <h3 className="text-xl font-semibold text-base-content">Current Theme</h3>
              <div
                className="flex flex-col items-center gap-3 p-10 rounded-3xl bg-base-100/15 backdrop-blur-2xl w-full max-w-lg mx-auto ring-2 ring-primary/50 animate-pulseGlow transition-all duration-700 border border-white/10 pointer-events-none"
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

                  return (
                    <button
                      key={t}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-500 animate-glassMorph border border-white/10 ${previewTheme === t
                          ? "scale-110 ring-2 ring-primary/80 shadow-[0_0_25px_var(--primary)] animate-bounceInScale z-10"
                          : "hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        } ${isAnimating ? "animate-modernThemeSelect scale-110 z-20" : ""}`}
                      onClick={() => handleThemeSelect(t)}
                      data-theme={t}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${THEME_COLORS[t].primary}15, ${THEME_COLORS[t].secondary}15)`,
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      {isAnimating && (
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 animate-pulseGlow"></div>
                          <div className="absolute inset-0 backdrop-blur-lg"></div>
                          <div className="absolute inset-0 bg-primary/30 scale-0 rounded-full animate-[ripple_0.8s_ease-out]" style={{ animationDelay: '0.2s' }}></div>
                        </div>
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
          </div>

          <div className="flex justify-between items-center animate-slideIn">
            <h3 className="text-2xl font-semibold text-base-content">Preview</h3>
            <button
              onClick={handleApplyTheme}
              className="flex items-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-opacity-90 transition-all duration-400 shadow-lg hover:shadow-xl active:scale-95 animate-bounceInScale"
              style={{
                backgroundColor: THEME_COLORS[previewTheme]?.secondary || '#3b82f6',
                color: THEME_COLORS[previewTheme]?.['secondary-content'] || '#ffffff',
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
                className="relative w-80 h-[600px] bg-gradient-to-b from-gray-900/50 to-black/50 rounded-[40px] shadow-[0_0_25px_rgba(255,255,255,0.3)] overflow-hidden"
                style={{
                  borderColor: THEME_COLORS[previewTheme]?.secondary || '#6b7280',
                  borderWidth: '12px'
                }}
              >
                {/* Dynamic Island */}
                <div
                  className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-10"
                  style={{
                    backgroundColor: THEME_COLORS[previewTheme]?.secondary || '#6b7280'
                  }}
                >
                </div>

                {/* Screen Content */}
                <div className={`absolute inset-0 bg-base-100/15 backdrop-blur-2xl ${previewFontClass}`} data-theme={previewTheme}>
                  <div className="h-full flex flex-col pt-12 px-3 pb-3" style={{ backgroundColor: THEME_COLORS[previewTheme]?.['base-100'] || '#ffffff' }}>
                    <div className="flex-1 space-y-4 overflow-y-auto mt-2">
                      {PREVIEW_MESSAGES.map((message, idx) => {
                        const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
                        const isOwnMessage = message.senderId === authUser._id;
                        return (
                          <div
                            key={message.id}
                            className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-slideIn`}
                            style={{ animationDelay: `${idx * 0.12}s` }}
                          >
                            <div className="chat-image avatar">
                              <div className="size-8 rounded-full border border-quaternary/50">
                                <img
                                  src={isOwnMessage ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                                  alt="profile pic"
                                  className="rounded-full"
                                />
                              </div>
                            </div>
                            <div className="chat-header mb-1">
                              <time className="text-xs text-quaternary-content">{isOwnMessage ? "You" : selectedUser.fullName}</time>
                            </div>
                            <div
                              className={`chat-bubble flex flex-col relative group ${isOwnMessage ? "bg-base-300/20 text-base-content" : "bg-secondary/30 text-secondary-content"
                                } backdrop-blur-2xl max-w-[75%] rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-800 animate-glassMorphPulse font-medium text-base border border-base-content/10`}
                            >
                              {quotedMessage && (
                                <div className="mb-1 p-1.5 bg-quaternary/15 rounded-lg border-l-2 border-quaternary/50">
                                  <p className="text-xs text-quaternary-content">
                                    {quotedMessage.senderId === authUser._id ? "You" : selectedUser.fullName}
                                  </p>
                                  <p className="text-xs truncate max-w-[120px] text-quaternary-content">{quotedMessage.content}</p>
                                </div>
                              )}
                              <p className="text-sm">{message.content}</p>
                              {message.reactions?.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {message.reactions.map((reaction, rIdx) => (
                                    <span key={rIdx} className="text-xs text-tertiary-content">
                                      {reaction.emoji}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 relative animate-fadeIn">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="input w-full pl-8 pr-10 bg-base-100/15 backdrop-blur-lg border-base-content/10 text-sm shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        disabled
                      />
                      <Image className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-quaternary-content" />
                      <Send className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-content" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-quaternary-content mt-4 animate-fadeIn">Mobile Preview</p>
            </div>

            {/* Desktop Preview - Macintosh Style */}
            <div className="flex-1 animate-glassMorph flex flex-col items-center">
              <div
                className="relative w-full max-w-md bg-gray-300/90 backdrop-blur-xl rounded-t-[20px] rounded-b-[6px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                style={{
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
                        <div
                          key={message.id}
                          className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-slideIn`}
                          style={{ animationDelay: `${idx * 0.12}s` }}
                        >
                          <div className="chat-image avatar">
                            <div className="size-10 rounded-full border border-quaternary/50">
                              <img
                                src={isOwnMessage ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                                alt="profile pic"
                                className="rounded-full"
                              />
                            </div>
                          </div>
                          <div className="chat-header mb-1">
                            <time className="text-xs text-quaternary-content">{isOwnMessage ? "You" : selectedUser.fullName}</time>
                          </div>
                          <div
                            className={`chat-bubble flex flex-col relative group ${isOwnMessage ? "bg-base-300/20 text-base-content" : "bg-secondary/30 text-secondary-content"
                              } backdrop-blur-2xl max-w-[75%] rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-800 animate-glassMorphPulse font-medium text-base border border-base-content/10`}
                          >
                            {quotedMessage && (
                              <div className="mb-1 p-1.5 bg-quaternary/15 rounded-lg border-l-2 border-quaternary/50">
                                <p className="text-xs text-quaternary-content">
                                  {quotedMessage.senderId === authUser._id ? "You" : selectedUser.fullName}
                                </p>
                                <p className="text-xs truncate max-w-[150px] text-quaternary-content">{quotedMessage.content}</p>
                              </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                            {message.reactions?.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {message.reactions.map((reaction, rIdx) => (
                                  <span key={rIdx} className="text-xs text-tertiary-content">
                                    {reaction.emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 relative animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="input  w-full pl-10 pr-12 bg-base-100/15 backdrop-blur-lg border-base-content/10 text-sm shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                      disabled
                    />
                    <Image className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 text-quaternary-content" />
                    <Send className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-secondary-content" />
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
              <p className="text-center text-sm text-quaternary-content mt-4 animate-fadeIn">Desktop Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;