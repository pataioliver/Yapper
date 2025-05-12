import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageReactions from "./MessageReactions";
import ProfileModal from "./ProfileModal";
import { formatMessageTime } from "../lib/utils";
import { Reply } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedChat,
    subscribeToMessages,
    unsubscribeFromMessages,
    setReplyingTo,
    isSidebarOpen,
    addReaction,
    users,
    replyingTo,
  } = useChatStore();
  const { authUser, joinRoom, leaveRoom } = useAuthStore();
  const messageEndRef = useRef(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const hasLoadedMessages = useRef(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);


  useEffect(() => {
    if (selectedChat?._id && !hasLoadedMessages.current) {
      getMessages(selectedChat._id);
      hasLoadedMessages.current = true;
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
      if (selectedChat?._id) hasLoadedMessages.current = false;
    };
  }, [selectedChat?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (selectedChat?.type === "group" && selectedChat.group?._id) {
      joinRoom(selectedChat.group._id);
      return () => leaveRoom(selectedChat.group._id);
    }
  }, [selectedChat?.type, selectedChat?.group?._id]);

  useEffect(() => {
    if (messageEndRef.current && messages && !initialScrollDone) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setInitialScrollDone(true);
    } else if (messageEndRef.current && messages) {
      const lastMessage = messages[messages.length - 1];
      const isNewMessage = !lastMessage.reactions || lastMessage.reactions.length === 0;
      if (isNewMessage) messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, initialScrollDone]);

  const handleReaction = (messageId, reaction) => addReaction(messageId, reaction);
  const handleReply = (message) => setReplyingTo(message);
  const getQuotedMessage = (replyToId) => messages.find((msg) => msg._id === replyToId);

  // Helper to get user display name by id
  const getUserName = (userId) => {
    if (userId === authUser._id) return "You";
    const user = users.find((u) => u._id === userId);
    return user ? user.fullName : "Unknown";
  };

  // Helper to determine reply color for MessageInput
  const getReplyColor = () => {
    if (!replyingTo) return undefined;
    if (replyingTo.senderId === authUser._id) return "secondary";
    return "primary";
  };

  if (isMessagesLoading) {
    return (
      <div className={`flex-1 flex flex-col overflow-auto bg-base-100/40 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassMorph glassmorphism-header`}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col overflow-auto bg-base-100/40 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassMorph glassmorphism-header`}>
      <ChatHeader onProfileClick={() => setProfileModalOpen(true)} />
      <ProfileModal
        type={selectedChat?.type}
        user={selectedChat?.user}
        group={selectedChat?.group}
        open={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 w-full custom-scrollbar">
        {messages.map((message, idx) => {
          const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
          const isOwnMessage =
            typeof message.senderId === "object"
              ? message.senderId._id === authUser._id
              : message.senderId === authUser._id;

          const getSenderProfilePic = (message) => {
            if (isOwnMessage) return authUser.profilePic || "/avatar.png";
            if (selectedChat?.type === "user") {
              return selectedChat?.user?.profilePic || "/avatar.png";
            }
            if (selectedChat?.type === "group") {
              // senderId may be an object or string
              const senderId = typeof message.senderId === "object" ? message.senderId._id : message.senderId;
              // Try to find the sender in group members (if you have them), or fallback to just the sender object
              if (typeof message.senderId === "object" && message.senderId.profilePic) {
                return message.senderId.profilePic;
              }
              // fallback
              return "/avatar.png";
            }
            return "/avatar.png";
          };


          // For reply/reaction coloring: secondary if own message, primary if from other user
          const actionColor = isOwnMessage ? "secondary" : "primary";

          // DaisyUI chat bubble style: sender = bg-secondary text-secondary-content, receiver = bg-base-200 text-base-content
          const bubbleBg = isOwnMessage
            ? "bg-secondary text-secondary-content"
            : "bg-base-200 text-base-content";
          const bubbleBorder = isOwnMessage
            ? "border-2 border-secondary/70"
            : "border border-base-300";
          const bubbleShadow = isOwnMessage
            ? "shadow-[0_4px_24px_0_rgba(80,180,255,0.13)]"
            : "shadow-[0_4px_24px_0_rgba(180,80,255,0.07)]";

          // Quoted message coloring: secondary if sender is me, primary if sender is other
          let quotedBg = "bg-primary text-primary-content border-primary";
          let quotedText = "text-primary-content";
          if (quotedMessage && quotedMessage.senderId === authUser._id) {
            quotedBg = "bg-secondary text-secondary-content border-secondary";
            quotedText = "text-secondary-content";
          }

          return (
            <div key={message._id} className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-glassMorph`} style={{ animationDelay: `${idx * 0.05}s` }} ref={idx === messages.length - 1 ? messageEndRef : null}>
              <div className="chat-image avatar">
                <div className={`size-10 rounded-full border-2 ${isOwnMessage ? "border-secondary/40" : "border-base-300"} hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 animate-subtleScale`}>
                  <img
                    src={getSenderProfilePic(message)}
                    alt="profile pic"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs text-quaternary-content/80 ml-1 tooltip" data-tip={new Date(message.createdAt).toLocaleString()}>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className={`chat-bubble flex flex-col relative group ${isOwnMessage
                ? "bg-base-300 text-base-content"
                : "bg-secondary text-secondary-content"
                } backdrop-blur-2xl max-w-[80%] rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 animate-glassMorph font-medium text-base`}>
                {quotedMessage && (
                  <div className="mb-2 p-2 bg-base-300/15 backdrop-blur-lg rounded-lg border-l-4 border-quaternary/50 animate-glassMorph">
                    <p className="text-xs text-quaternary-content/80">
                      {quotedMessage.senderId === authUser._id
                        ? "You"
                        : selectedChat?.type === "user"
                          ? selectedChat?.user?.fullName
                          : selectedChat?.group?.name
                      }
                    </p>
                    <p className="text-sm truncate max-w-[200px] text-quaternary-content/80">{quotedMessage.text || (quotedMessage.image && "Image")}</p>
                  </div>
                )}
                {message.image && (
                  <img src={message.image} alt="Attachment" className={`sm:max-w-[200px] rounded-lg mb-2 border ${isOwnMessage ? "border-secondary/40" : "border-base-300"} hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 animate-subtleScale`} />
                )}
                {message.text && <p className="font-medium text-base">{message.text}</p>}
                {message.reactions?.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {[...new Set(message.reactions.map((r) => r.emoji))].map((emoji, idx) => {
                      const usersForEmoji = message.reactions.filter((r) => r.emoji === emoji);
                      const isReactedByMe = usersForEmoji.some((r) => r.userId === authUser._id);
                      const tooltipText = usersForEmoji.map((r) => getUserName(r.userId)).join(", ");
                      return (
                        <span
                          key={emoji}
                          className={`text-sm px-2 py-1 rounded-full border ${isOwnMessage ? "border-secondary/30" : "border-base-300"} bg-base-100/40 cursor-pointer tooltip ${isReactedByMe ? "ring-2 ring-secondary" : ""} animate-glassyPulse`}
                          data-tip={tooltipText}
                        >
                          {emoji} <span className={`text-xs ${isOwnMessage ? "text-secondary-content/80" : "text-base-content/80"}`}>{usersForEmoji.length}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className={`absolute top-1/2 -translate-y-1/2 ${isOwnMessage ? "left-[-40px]" : "right-[-40px]"} opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col gap-2`}>
                  <button
                    onClick={() => handleReply(message)}
                    className={`p-1.5 rounded-full border-2 shadow-md transition-all duration-300 animate-glassyPop border-${actionColor} bg-${actionColor}/10 hover:bg-${actionColor}/30 text-${actionColor}`}
                    aria-label="Reply"
                  >
                    <Reply size={16} className={`text-${actionColor}`} />
                  </button>
                  <MessageReactions
                    messageId={message._id}
                    onReact={handleReaction}
                    isOwnMessage={isOwnMessage}
                    forceColor={actionColor}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput replyColor={getReplyColor()} />
    </div>
  );
};

export default ChatContainer;