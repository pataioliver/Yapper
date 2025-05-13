import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageReactions from "./MessageReactions";
import { Reply } from "lucide-react";

const ChatContainer = ({ openProfileModal }) => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    setReplyingTo,
    isSidebarOpen,
    addReaction,
    users,
    replyingTo,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const hasLoadedMessages = useRef(false);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      hasLoadedMessages.current = true;
      subscribeToMessages();
      setInitialScrollDone(false);
    }
    return () => {
      unsubscribeFromMessages();
      hasLoadedMessages.current = false;
    };
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length && !initialScrollDone) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setInitialScrollDone(true);
    } else if (messageEndRef.current && messages.length && initialScrollDone) {
      const isAtBottom =
        messageEndRef.current.getBoundingClientRect().bottom <= window.innerHeight + 100;
      if (isAtBottom) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, initialScrollDone]);

  // Scroll to bottom when messages change or when typing
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Also scroll when typing a new message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []); // Add the state variable for your input text here, e.g. messageInputText

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
    if (!replyingTo) return "primary";
    if (replyingTo.senderId === authUser._id) return "secondary";
    return "primary";
  };

  if (isMessagesLoading) {
    return (
      <div className={`flex-1 flex flex-col overflow-auto bg-base-100/40 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassMorph glassmorphism-header`}>
        <ChatHeader openProfileModal={openProfileModal} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col overflow-auto bg-base-100/40 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassMorph glassmorphism-header`}>
      <ChatHeader openProfileModal={openProfileModal} />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 w-full custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-quaternary-content/60">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message, idx) => {
            const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
            const isOwnMessage = message.senderId === authUser._id;
            const actionColor = isOwnMessage ? "secondary" : "primary";
            const bubbleBg = isOwnMessage
              ? "bg-secondary text-secondary-content"
              : "bg-primary text-primary-content";
            const bubbleBorder = isOwnMessage
              ? "border-2 border-secondary"
              : "border-2 border-primary";
            const bubbleShadow = isOwnMessage
              ? "shadow-[0_2px_16px_rgba(80,180,255,0.15)]"
              : "shadow-[0_2px_16px_rgba(180,80,255,0.08)]";

            // Improved quoted reply coloring
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
                id={`msg-${message._id}`}
                key={message._id}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} group animate-fadeIn`}
                style={{ animationDelay: "0.01s", animationFillMode: 'both' }}
                onMouseEnter={() => setHoveredMsgId(message._id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                <div className="chat-image avatar">
                  <div className="w-10 h-10 rounded-full border border-base-300/50 overflow-hidden">
                    <img
                      src={
                        isOwnMessage
                          ? (authUser.profilePicture || authUser.profilePic || "/avatar.png")
                          : (selectedUser.profilePicture || selectedUser.profilePic || "/avatar.png")
                      }
                      alt={isOwnMessage ? authUser.fullName : selectedUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1 opacity-75 text-sm">
                  {isOwnMessage ? "You" : selectedUser.fullName}
                  <time className="text-xs opacity-75 ml-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <div
                  className={`chat-bubble rounded-2xl p-3 will-change-transform animation-gpu will-change-opacity animate-glassyPop overflow-hidden ${bubbleBg} ${bubbleBorder} ${bubbleShadow}`}
                  style={{ animationDelay: "0.01s", animationFillMode: 'both' }}
                >
                  {/* Quoted message */}
                  {quotedMessage && (
                    <div
                      className={`mb-3 p-2 rounded-lg text-sm font-medium ${quotedBg} hover:brightness-110 transition-all cursor-pointer`}
                      onClick={() => {
                        // Find and scroll to the original message
                        const originalMsg = document.getElementById(`msg-${quotedMessage._id}`);
                        if (originalMsg) {
                          originalMsg.scrollIntoView({ behavior: "smooth", block: "center" });
                          originalMsg.classList.add("highlight-quoted");
                          setTimeout(() => originalMsg.classList.remove("highlight-quoted"), 2000);
                        }
                      }}
                      title="Click to find original message"
                    >
                      <p className="flex items-center gap-1">
                        <Reply size={14} className="opacity-80" />
                        <span className="font-semibold">{quotedMessage.senderId === authUser._id ? "You" : selectedUser.fullName}</span>
                      </p>
                      <p className={`${quotedText} line-clamp-2`}>{quotedMessage.text}</p>
                    </div>
                  )}

                  {/* Message text */}
                  <div>{message.text}</div>

                  {/* Message image */}
                  {message.image && (
                    <div className="mt-2">
                      <img
                        src={message.image}
                        alt="Message"
                        className="rounded-lg max-w-full max-h-60 object-contain"
                      />
                    </div>
                  )}

                  {/* Reactions display at the bottom of the bubble - always visible */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 justify-start">
                      {Object.entries(
                        message.reactions.reduce((acc, reaction) => {
                          acc[reaction.emoji] = acc[reaction.emoji] || { count: 0, users: [] };
                          acc[reaction.emoji].count++;
                          acc[reaction.emoji].users.push(
                            typeof reaction.userId === "object" ? reaction.userId._id : reaction.userId
                          );
                          return acc;
                        }, {})
                      ).map(([emoji, data]) => (
                        <div
                          key={emoji}
                          className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 font-semibold
                            ${isOwnMessage
                              ? "bg-secondary text-secondary-content border-2 border-secondary"
                              : "bg-primary text-primary-content border-2 border-primary"
                            }
                            backdrop-blur-md animate-glassyPop`}
                          style={{
                            boxShadow: isOwnMessage
                              ? "0 2px 8px rgba(80,180,255,0.1)"
                              : "0 2px 8px rgba(0,0,0,0.04)",
                            animationFillMode: 'both'
                          }}
                          title={`${data.count} ${data.users.includes(authUser._id) ? '(including you)' : ''}`}
                        >
                          <span>{emoji}</span>
                          <span className="font-bold">{data.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chat footer for actions */}
                <div className="chat-footer opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 mt-1">
                  <MessageReactions
                    messageId={message._id}
                    reactions={message.reactions}
                    onReact={handleReaction}
                    isOwnMessage={isOwnMessage}
                    forceColor={isOwnMessage ? "secondary" : "primary"}
                    show={hoveredMsgId === message._id}
                    displayMode="reactionButton"
                  />
                  <button
                    onClick={() => handleReply(message)}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5
                      ${isOwnMessage
                        ? "bg-secondary text-secondary-content border-2 border-secondary"
                        : "bg-primary text-primary-content border-2 border-primary"
                      } 
                      backdrop-blur-md hover:brightness-110 transition-all animate-glassyPop`}
                    style={{
                      boxShadow: isOwnMessage
                        ? "0 2px 8px rgba(80,180,255,0.15)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                      animationFillMode: 'both'
                    }}
                  >
                    <Reply size={14} />
                    Reply
                  </button>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>
      <MessageInput replyColor={getReplyColor()} />
    </div>
  );
};

export default ChatContainer;