import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import GroupChatHeader from "./GroupChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageReactions from "./MessageReactions";
import { Reply } from "lucide-react";

const GroupChat = ({ openProfileModal }) => {
  const {
    groupMessages,
    getGroupMessages,
    isMessagesLoading,
    selectedGroup,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    setReplyingTo,
    isSidebarOpen,
    addGroupReaction,
    users,
    replyingTo,
    refreshGroupData,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  const currentGroupMessages =
    selectedGroup && groupMessages[selectedGroup._id]
      ? groupMessages[selectedGroup._id]
      : [];

  useEffect(() => {
    if (selectedGroup?._id) {
      getGroupMessages(selectedGroup._id);
      subscribeToGroupMessages(selectedGroup._id);
      setInitialScrollDone(false);
      refreshGroupData(selectedGroup._id);
    }
    
    return () => {
      if (selectedGroup?._id) {
        unsubscribeFromGroupMessages(selectedGroup?._id);
      }
    };
  }, [
    selectedGroup?._id,
    getGroupMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    refreshGroupData,
  ]);

  useEffect(() => {
    if (messageEndRef.current && currentGroupMessages.length && !initialScrollDone) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setInitialScrollDone(true);
    } else if (messageEndRef.current && currentGroupMessages.length && initialScrollDone) {
      const isAtBottom =
        messageEndRef.current.getBoundingClientRect().bottom <= window.innerHeight + 100;
      if (isAtBottom) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentGroupMessages, initialScrollDone]);

  const handleReaction = (messageId, reaction) => addGroupReaction(messageId, reaction);
  const handleReply = (message) => setReplyingTo(message);

  const getQuotedMessage = (replyToId) =>
    currentGroupMessages.find((msg) => msg._id === replyToId);

  const getUserName = (userId) => {
    if (userId === authUser._id) return "You";
    const member = selectedGroup.members.find((m) => m._id === userId);
    if (member) return member.fullName;
    const user = users.find((u) => u._id === userId);
    return user ? user.fullName : "Unknown";
  };

  const getReplyColor = () => {
    if (!replyingTo) return "primary";
    if (replyingTo.senderId === authUser._id) return "secondary";
    return "primary";
  };

  if (isMessagesLoading) {
    return (
      <div className={`flex-1 flex flex-col overflow-auto bg-base-100/40 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassySlideIn glassmorphism-header`}>
        <GroupChatHeader openProfileModal={openProfileModal} />
        <MessageSkeleton />
        <MessageInput replyColor={getReplyColor()} isGroup={true} groupId={selectedGroup?._id} />
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col overflow-auto bg-base-100/40 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassySlideIn glassmorphism-header`}>
      <GroupChatHeader openProfileModal={openProfileModal} />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 w-full custom-scrollbar">
        {currentGroupMessages.length === 0 ? (
          <div className="text-center py-8 text-quaternary-content/60 animate-fadeIn">
            No messages yet in this group. Be the first to send a message!
          </div>
        ) : (
          currentGroupMessages.map((message, idx) => {
            const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
            const isOwnMessage =
              message.senderId._id === authUser._id || message.senderId === authUser._id;
            const sender =
              typeof message.senderId === "object"
                ? message.senderId
                : users.find((u) => u._id === message.senderId) ||
                selectedGroup.members.find((m) => m._id === message.senderId) ||
                { fullName: "Unknown", profilePicture: "" };
            const actionColor = isOwnMessage ? "secondary" : "primary";
            const bubbleBg = isOwnMessage
              ? "bg-secondary/90 text-secondary-content backdrop-blur-md"
              : "bg-base-200/90 text-base-content backdrop-blur-md";
            const bubbleBorder = isOwnMessage
              ? "border border-secondary/30"
              : "border border-base-300/50";
            const bubbleShadow = isOwnMessage
              ? "shadow-[0_2px_16px_rgba(80,180,255,0.15)]"
              : "shadow-[0_2px_16px_rgba(180,80,255,0.08)]";
            let quotedBg = "bg-primary/10 text-primary border-primary";
            let quotedText = "text-primary";
            if (quotedMessage) {
              const quotedSenderId =
                typeof quotedMessage.senderId === "object"
                  ? quotedMessage.senderId._id
                  : quotedMessage.senderId;
              if (quotedSenderId === authUser._id) {
                quotedBg = "bg-secondary/10 text-secondary border-secondary";
                quotedText = "text-secondary";
              }
            }
            return (
              <div
                id={`group-msg-${message._id}`}
                key={message._id}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} group animate-fadeIn`}
                style={{ animationDelay: "0.01s", animationFillMode: 'both' }}
                onMouseEnter={() => setHoveredMsgId(message._id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                <div className="chat-image avatar">
                  <div className="w-10 h-10 rounded-full border border-base-300/50 overflow-hidden">
                    {(sender.profilePicture || sender.profilePic) ? (
                      <img
                        src={sender.profilePicture || sender.profilePic}
                        alt={sender.fullName || "Unknown User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/avatar.png"
                        alt={sender.fullName || "Unknown User"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="chat-header mb-1 opacity-75 text-sm">
                  {isOwnMessage ? "You" : sender?.fullName || "Unknown User"}
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
                  {quotedMessage && (
                    <div
                      className={`mb-3 p-2 rounded-lg text-sm border-l-4 ${quotedBg} hover:brightness-110 transition-all cursor-pointer`}
                      onClick={() => {
                        // Find and scroll to the original message
                        const originalMsg = document.getElementById(`group-msg-${quotedMessage._id}`);
                        if (originalMsg) {
                          originalMsg.scrollIntoView({ behavior: "smooth", block: "center" });
                          originalMsg.classList.add("highlight-quoted");
                          setTimeout(() => originalMsg.classList.remove("highlight-quoted"), 2000);
                        }
                      }}
                      title="Click to find original message"
                    >
                      <p className="font-medium flex items-center gap-1">
                        <Reply size={14} className="text-base-content/60" />
                        {getUserName(
                          typeof quotedMessage.senderId === "object"
                            ? quotedMessage.senderId._id
                            : quotedMessage.senderId
                        )}
                      </p>
                      <p className={`${quotedText} line-clamp-2`}>{quotedMessage.text}</p>
                    </div>
                  )}
                  <div>{message.text}</div>
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
                          className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${isOwnMessage
                            ? "bg-secondary/40 text-secondary-content border border-secondary/30"
                            : "bg-base-100/60 text-base-content border border-base-300/40"
                            } backdrop-blur-md animate-glassyPop`}
                          style={{
                            boxShadow: isOwnMessage
                              ? "0 2px 8px rgba(80,180,255,0.1)"
                              : "0 2px 8px rgba(0,0,0,0.04)",
                            animationFillMode: 'both'
                          }}
                          title={`${data.count} ${data.users.includes(authUser._id) ? '(including you)' : ''}`}
                        >
                          <span>{emoji}</span>
                          <span className="font-medium">{data.count}</span>
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
                    forceColor={actionColor}
                    show={hoveredMsgId === message._id}
                    displayMode="reactionButton"
                  />
                  <button
                    onClick={() => handleReply(message)}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5
                      ${isOwnMessage
                        ? "bg-secondary/30 text-secondary-content border border-secondary/40"
                        : "bg-base-200/60 text-base-content border border-base-300/50"
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
      <MessageInput
        replyColor={getReplyColor()}
        isGroup={true}
        groupId={selectedGroup?._id}
      />
    </div>
  );
};

export default GroupChat;