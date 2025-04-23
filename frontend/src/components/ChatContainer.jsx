import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-base-100 to-base-200/30">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-base-100 to-base-200/30">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`
              chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}
              animate-in fade-in slide-in-from-${
                message.senderId === authUser._id ? "right" : "left"
              }-2 duration-400 delay-${index * 50}
            `}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div
                className="size-10 rounded-full border-2 border-primary/20 transition-transform duration-300 hover:scale-110"
              >
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1 transition-opacity duration-300 hover:opacity-100">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`
                chat-bubble flex flex-col transition-all duration-300
                hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/05
                ${message.senderId === authUser._id ? "bg-primary/20" : "bg-base-200"}
              `}
            >
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
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;