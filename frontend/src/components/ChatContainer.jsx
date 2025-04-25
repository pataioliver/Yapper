import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageReactions from "./MessageReactions";
import { formatMessageTime } from "../lib/utils";
import { Reply } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    addReaction,
    setReplyingTo,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    // Only scroll on initial load or when new messages arrive (not reactions)
    if (messageEndRef.current && messages && !initialScrollDone) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setInitialScrollDone(true);
    } else if (messageEndRef.current && messages) {
      const lastMessage = messages[messages.length - 1];
      const isNewMessage = !lastMessage.reactions || lastMessage.reactions.length === 0;
      if (isNewMessage) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, initialScrollDone]);

  const handleReaction = (messageId, reaction) => {
    addReaction(messageId, reaction);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const getQuotedMessage = (replyToId) => {
    return messages.find((msg) => msg._id === replyToId);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-base-100 to-base-200/30 w-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-base-100 to-base-200/30 w-full">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 w-full">
        {messages.map((message, index) => {
          const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
          const isOwnMessage = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`
                chat ${isOwnMessage ? "chat-end" : "chat-start"}
                animate-in fade-in slide-in-from-${
                  isOwnMessage ? "right" : "left"
                }-10 duration-500 delay-${index * 100} max-w-full
              `}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border-2 border-primary/20 transition-transform duration-300 hover:scale-110">
                  <img
                    src={
                      isOwnMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1 transition-opacity duration-300 hover:opacity-100 tooltip" data-tip={new Date(message.createdAt).toLocaleString()}>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div
                className={`
                  chat-bubble flex flex-col transition-all duration-300 relative group
                  hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/05
                  ${isOwnMessage ? "bg-primary/20" : "bg-base-200"} max-w-[80%]
                  hover:scale-105 hover:shadow-md
                `}
              >
                {quotedMessage && (
                  <div className="mb-2 p-2 bg-base-300/50 rounded-lg border-l-4 border-primary/50">
                    <p className="text-xs text-base-content/70">
                      {quotedMessage.senderId === authUser._id ? "You" : selectedUser.fullName}
                    </p>
                    <p className="text-sm truncate max-w-[200px] bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      {quotedMessage.text || (quotedMessage.image && "Image")}
                    </p>
                  </div>
                )}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 transition-transform duration-300 hover:scale-105 hover:shadow-md"
                  />
                )}
                {message.text && (
                  <p className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {message.text}
                  </p>
                )}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {message.reactions.map((reaction, idx) => (
                      <span key={idx} className="text-sm text-primary animate-pulse">
                        {reaction.emoji}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  className={`
                    absolute top-1/2 -translate-y-1/2
                    ${isOwnMessage ? "left-[-70px]" : "right-[-70px]"}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    flex flex-row gap-1
                  `}
                >
                  <button
                    onClick={() => handleReply(message)}
                    className="p-1.5 bg-base-100 rounded-full shadow-md hover:bg-primary/20 hover:scale-110 transition-all duration-300 animate-pulse"
                  >
                    <Reply size={16} className="text-base-content/70 hover:text-primary" />
                  </button>
                  <MessageReactions messageId={message._id} onReact={handleReaction} isOwnMessage={isOwnMessage} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;