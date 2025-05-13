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
  const { messages, getMessages, isMessagesLoading, selectedChat, subscribeToMessages, unsubscribeFromMessages, addReaction, setReplyingTo, isSidebarOpen } = useChatStore();
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

  if (isMessagesLoading) {
    return (
      <div className={`flex-1 flex flex-col overflow-auto bg-base-100/10 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassMorph`}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col overflow-auto bg-base-100/10 backdrop-blur-2xl w-full shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 ${isSidebarOpen ? 'rounded-l-none rounded-r-2xl' : 'rounded-2xl'} animate-glassMorph`}>
      <ChatHeader onProfileClick={() => setProfileModalOpen(true)} />
      <ProfileModal
        type={selectedChat?.type}
        user={selectedChat?.user}
        group={selectedChat?.group}
        open={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 w-full">
        {messages.map((message, idx) => {
          const quotedMessage = message.replyToId ? getQuotedMessage(message.replyToId) : null;
          const isOwnMessage =
            typeof message.senderId === "object"
              ? message.senderId._id === authUser._id
              : message.senderId === authUser._id;

          const getSenderprofilePicture = (message) => {
            if (isOwnMessage) return authUser.profilePicture || "/avatar.png";
            if (selectedChat?.type === "user") {
              return selectedChat?.user?.profilePicture || "/avatar.png";
            }
            if (selectedChat?.type === "group") {
              // senderId may be an object or string
              const senderId = typeof message.senderId === "object" ? message.senderId._id : message.senderId;
              // Try to find the sender in group members (if you have them), or fallback to just the sender object
              if (typeof message.senderId === "object" && message.senderId.profilePicture) {
                return message.senderId.profilePicture;
              }
              // fallback
              return "/avatar.png";
            }
            return "/avatar.png";
          };

          return (
            <div key={message._id} className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} max-w-full animate-glassMorph`} style={{ animationDelay: `${idx * 0.05}s` }} ref={idx === messages.length - 1 ? messageEndRef : null}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border-2 border-quaternary/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 animate-subtleScale">
                  <img
                    src={getSenderprofilePicture(message)}
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
                  <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-lg mb-2 border border-quaternary/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 animate-subtleScale" />
                )}
                {message.text && <p className="font-medium text-base">{message.text}</p>}
                {message.reactions?.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {message.reactions.map((reaction, idx) => (
                      <span key={idx} className="text-sm text-tertiary-content/80 animate-glassMorph">{reaction.emoji}</span>
                    ))}
                  </div>
                )}
                <div className={`absolute top-1/2 -translate-y-1/2 ${isOwnMessage ? "left-[-40px]" : "right-[-40px]"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <button
                    onClick={() => handleReply(message)}
                    className="p-1.5 bg-tertiary/15 backdrop-blur-2xl text-tertiary-content rounded-lg font-medium text-base shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-quaternary/30 hover:bg-tertiary/25 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
                  >
                    <Reply size={16} className="text-tertiary-content" />
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