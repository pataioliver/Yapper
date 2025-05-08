import { useState, useEffect, useRef } from "react";
import { THEMES, THEME_COLORS } from "../constants/themes.js";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Check, Image, Bell, ThumbsUp, Heart, Smile, Frown, Zap, SmilePlus } from "lucide-react";
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

const MessageReactions = ({ messageId, onReact, isOwnMessage }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState("right");
  const pickerRef = useRef(null);
  const { authUser } = useThemeStore();

  const reactions = [
    { icon: <ThumbsUp size={16} />, emoji: "👍" },
    { icon: <Heart size={16} />, emoji: "❤️" },
    { icon: <Smile size={16} />, emoji: "😄" },
    { icon: <Frown size={16} />, emoji: "😢" },
    { icon: <Zap size={16} />, emoji: "😮" },
  ];

  useEffect(() => {
    if (showPicker && pickerRef.current) {
      const picker = pickerRef.current;
      const rect = picker.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (isOwnMessage) {
        setPickerPosition("right");
      } else {
        setPickerPosition("left");
      }

      if (pickerPosition === "right" && rect.right > viewportWidth) {
        setPickerPosition("left");
      } else if (pickerPosition === "left" && rect.left < 0) {
        setPickerPosition("right");
      }

      const viewportHeight = window.innerHeight;
      if (rect.bottom > viewportHeight) {
        picker.classList.add("top-full", "mt-2");
        picker.classList.remove("bottom-full", "mb-2");
      } else {
        picker.classList.add("bottom-full", "mb-2");
        picker.classList.remove("top-full", "mt-2");
      }
    }
  }, [showPicker, isOwnMessage, pickerPosition]);

  const handleReaction = (reaction) => {
    const reactionWithUser = {
      emoji: reaction.emoji,
      userId: authUser._id,
    };
    onReact(messageId, reactionWithUser);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {showPicker && (
        <div
          ref={pickerRef}
          className={`absolute z-20 p-2 bg-base-100/30 backdrop-blur-xl rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] ${pickerPosition === "right" ? "right-0" : "left-0"} bottom-full mb-2 animate-fadeIn transition-opacity duration-700 ease-in-out`}
        >
          <div className="flex gap-2">
            {reactions.map((reaction, idx) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReaction(reaction)}
                className="p-1 bg-base-100/50 backdrop-blur-lg hover:bg-gradient-primary hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full tooltip transition-all duration-700 ease-in-out animate-scaleIn"
                data-tip={reaction.emoji}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {reaction.icon}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-1.5 bg-base-100/50 backdrop-blur-lg rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:bg-gradient-primary hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-700 ease-in-out animate-scaleIn"
      >
        <SmilePlus size={16} className="text-quaternary" />
      </button>
    </div>
  );
};

const SettingsPage = () => {
  const { theme, fontClass, setTheme } = useThemeStore();
  const [previewTheme, setPreviewTheme] = useState(theme);
  const [previewFontClass, setPreviewFontClass] = useState(fontClass);

  useEffect(() => {
    setPreviewTheme(theme);
    setPreviewFontClass(fontClass);
  }, [theme, fontClass]);

  const handleThemeSelect = (selectedTheme) => {
    setPreviewTheme(selectedTheme);
    const font = THEME_COLORS[selectedTheme]?.font || "-apple-system, BlinkMacSystemFont, sans-serif";
    setPreviewFontClass(`font-${normalizeFontName(font)}`);
  };

  const handleApplyTheme = () => {
    setTheme(previewTheme);
    toast.success("Theme applied!", { icon: "🎨" });
  };

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Notifications enabled!", { icon: "🔔" });
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js").catch(console.error);
      }
    } else if (permission === "denied") {
      toast.error("Notifications blocked. Enable in browser settings.");
    }
  };

  const handleReact = (messageId, reaction) => {
    console.log("Reaction added:", reaction, "to message:", messageId);
  };

  const authUser = { _id: "user2", fullName: "You" };
  const selectedUser = { _id: "user1", fullName: "Ariana Grande" };

  const getQuotedMessage = (replyToId) => PREVIEW_MESSAGES.find((msg) => msg.id === replyToId);

  return (
    <div className={`min-h-screen bg-base-100 flex items-center justify-center px-4 pt-24 pb-8 animate-glassMorphPulse ${fontClass}`} data-theme={theme}>
      <div className="w-full max-w-5xl bg-base-100/85 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_25px_rgba(255,255,255,0.3)] border border-base-content/20 transition-all duration-500 animate-fadeIn">
        <div className="space-y-8">
          <div className="flex justify-between items-center animate-slideIn">
            <h3 className="text-xl font-medium text-base-content">Notifications</h3>
            <button
              onClick={handleEnableNotifications}
              className="bg-secondary/85 backdrop-blur-sm text-secondary-content rounded-lg px-4 py-2 font-medium hover:bg-secondary/90 hover:scale-105 transition-all duration-500 animate-scaleIn border border-base-content/20"
            >
              <Bell size={18} className="inline-block mr-2" />
              Enable Notifications
            </button>
          </div>
          <div className="space-y-2 animate-fadeIn">
            <h2 className="text-xl font-medium text-base-content">Theme</h2>
            <p className="text-sm text-quaternary-content">Choose a theme to customize your experience</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2 animate-slideIn">
              <h3 className="text-lg font-medium text-base-content">Current Theme</h3>
              <div
                className="flex flex-col items-center gap-2 p-8 rounded-2xl bg-base-100/90 backdrop-blur-xl w-full max-w-md mx-auto ring-2 ring-primary animate-pulseGlow transition-all duration-500 animate-scaleIn border border-base-content/20 pointer-events-none"
                data-theme={theme}
              >
                <div className="w-28 h-24 rounded-md overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  <div className="h-6" style={{ backgroundColor: THEME_COLORS[theme].primary }} />
                  <div className="h-6" style={{ backgroundColor: THEME_COLORS[theme].secondary }} />
                  <div className="h-6" style={{ backgroundColor: THEME_COLORS[theme].tertiary }} />
                  <div className="h-6" style={{ backgroundColor: THEME_COLORS[theme].quaternary }} />
                </div>
                <span className="text-base font-medium text-base-content">
                  {theme.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).replace("Ios", "iOS").replace("Oled", "OLED")}
                </span>
              </div>
            </div>
            <div className="space-y-2 animate-fadeIn">
              <h3 className="text-lg font-medium text-base-content">Available Themes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {THEMES.filter((t) => t !== theme).map((t, index) => (
                  <button
                    key={t}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-apy backdrop-blur-xl ${fontClass} ${
                      previewTheme === t ? "ring-2 ring-primary animate-pulseGlow" : "hover:scale-105"
                    } transition-all duration-500 animate-fadeIn border border-base-content/20`}
                    onClick={() => handleThemeSelect(t)}
                    data-theme={t}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-20 h-16 rounded-md overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      <div className="h-4" style={{ backgroundColor: THEME_COLORS[t].primary }} />
                      <div className="h-4" style={{ backgroundColor: THEME_COLORS[t].secondary }} />
                      <div className="h-4" style={{ backgroundColor: THEME_COLORS[t].tertiary }} />
                      <div className="h-4" style={{ backgroundColor: THEME_COLORS[t].quaternary }} />
                    </div>
                    <span className="text-sm font-medium text-base-content">
                      {t.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).replace("Ios", "iOS").replace("Oled", "OLED")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center animate-slideIn">
            <h3 className="text-xl font-medium text-base-content">Preview</h3>
            <button
              onClick={handleApplyTheme}
              className="bg-secondary/85 backdrop-blur-sm text-secondary-content rounded-lg px-4 py-2 font-medium hover:bg-secondary/90 hover:scale-105 transition-all duration-500 animate-scaleIn border border-base-content/20"
              style={{ backgroundColor: THEME_COLORS[previewTheme].secondary }}
            >
              <Check size={18} className="inline-block mr-2" />
              Apply Theme
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 animate-fadeIn">
              <div
                className="relative mx-auto w-72 h-[560px] bg-gradient-to-b from-gray-900/80 to-black/80 rounded-[48px] shadow-[0_0_25px_rgba(255,255,255,0.3)] overflow-hidden border border-base-content/20"
                style={{
                  boxShadow: `0 0 12px 2px ${THEME_COLORS[previewTheme].primary}80, inset 0 0 8px ${THEME_COLORS[previewTheme].secondary}50`,
                  background: `linear-gradient(135deg, ${THEME_COLORS[previewTheme].primary}20, ${THEME_COLORS[previewTheme].secondary}20)`,
                }}
              >
                <div
                  className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${THEME_COLORS[previewTheme].primary}40, ${THEME_COLORS[previewTheme].secondary}40)`,
                    boxShadow: `0 0 8px ${THEME_COLORS[previewTheme].secondary}80`,
                    backdropFilter: "blur(4px)",
                  }}
                />
                <div className={`absolute inset-2.5 bg-base-100/85 backdrop-blur-xl rounded-[44px] overflow-hidden ${previewFontClass}`} data-theme={previewTheme}>
                  <div className="h-full flex flex-col p-4">
                    <div className="flex-1 space-y-4 overflow-y-auto">
                      {PREVIEW_MESSAGES.map((message, idx) => {
                        const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
                        const isOwnMessage = message.senderId === authUser._id;
                        return (
                          <div key={message.id} className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-slideIn`} style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="chat-image avatar">
                              <div className="size-8 rounded-full border border-quaternary">
                                <img src={isOwnMessage ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="profile pic" className="rounded-full" />
                              </div>
                            </div>
                            <div className="chat-header mb-1">
                              <time className="text-xs text-quaternary-content">{isOwnMessage ? "You" : selectedUser.fullName}</time>
                            </div>
                            <div className={`chat-bubble flex flex-col relative group ${
                              isOwnMessage
                                ? "bg-base-300 text-base-content"
                                : "bg-secondary text-secondary-content"
                            } backdrop-blur-2xl max-w-[75%] rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 animate-glassMorph font-medium text-base`}>
                              {quotedMessage && (
                                <div className="mb-1 p-1 bg-quaternary/20 rounded border-l-2 border-quaternary">
                                  <p className="text-xs text-quaternary-content">{quotedMessage.senderId === authUser._id ? "You" : selectedUser.fullName}</p>
                                  <p className="text-xs truncate max-w-[120px] text-quaternary-content">{quotedMessage.content}</p>
                                </div>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <div className="absolute -bottom-6 right-2">
                                <MessageReactions messageId={message.id} onReact={handleReact} isOwnMessage={isOwnMessage} />
                              </div>
                              {message.reactions?.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {message.reactions.map((reaction, idx) => (
                                    <span key={idx} className="text-xs text-tertiary-content">{reaction.emoji}</span>
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
                        className="input input-bordered w-full pl-8 pr-10 bg-base-100/85 backdrop-blur-sm border-base-content/20 text-sm"
                        disabled
                      />
                      <Image className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-quaternary-content" />
                      <Send className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-content" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-quaternary-content mt-2 animate-fadeIn">Mobile Preview</p>
            </div>
            <div className="flex-1 animate-fadeIn">
              <div
                className="relative mx-auto w-full max-w-md bg-base-100/85 backdrop-blur-xl rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.3)] border border-base-content/20"
                style={{ boxShadow: `0 0 8px ${THEME_COLORS[previewTheme].primary}80` }}
              >
                <div
                  className="h-8 flex items-center px-4"
                  style={{ backgroundColor: THEME_COLORS[previewTheme].primary }}
                >
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className={`p-4 ${previewFontClass}`} data-theme={previewTheme}>
                  <div className="space-y-4">
                    {PREVIEW_MESSAGES.map((message, idx) => {
                      const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
                      const isOwnMessage = message.senderId === authUser._id;
                      return (
                        <div key={message.id} className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-slideIn`} style={{ animationDelay: `${idx * 0.1}s` }}>
                          <div className="chat-image avatar">
                            <div className="size-10 rounded-full border border-quaternary">
                              <img src={isOwnMessage ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="profile pic" className="rounded-full" />
                            </div>
                          </div>
                          <div className="chat-header mb-1">
                            <time className="text-xs text-quaternary-content">{isOwnMessage ? "You" : selectedUser.fullName}</time>
                          </div>
                          <div className={`chat-bubble flex flex-col relative group ${
                            isOwnMessage
                              ? "bg-base-300 text-base-content"
                              : "bg-secondary text-secondary-content"
                          } backdrop-blur-2xl max-w-[75%] rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 animate-glassMorph font-medium text-base`}>
                            {quotedMessage && (
                              <div className="mb-1 p-1 bg-quaternary/20 rounded border-l-2 border-quaternary">
                                <p className="text-xs text-quaternary-content">{quotedMessage.senderId === authUser._id ? "You" : selectedUser.fullName}</p>
                                <p className="text-xs truncate max-w-[150px] text-quaternary-content">{quotedMessage.content}</p>
                              </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <div className="absolute -bottom-6 right-2">
                              <MessageReactions messageId={message.id} onReact={handleReact} isOwnMessage={isOwnMessage} />
                            </div>
                            {message.reactions?.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {message.reactions.map((reaction, idx) => (
                                  <span key={idx} className="text-xs text-tertiary-content">{reaction.emoji}</span>
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
                      className="input input-bordered w-full pl-10 pr-12 bg-base-100/85 backdrop-blur-sm border-base-content/20 text-sm"
                      disabled
                    />
                    <Image className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 text-quaternary-content" />
                    <Send className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-secondary-content" />
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-quaternary-content mt-2 animate-fadeIn">Desktop Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;