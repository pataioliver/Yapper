import { ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = ({ onProfileClick }) => {
  const { selectedChat, setselectedChat, isSidebarOpen, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-quaternary/20 h-16 flex items-center bg-base-100/10 backdrop-blur-2xl rounded-tl-none rounded-tr-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 animate-glassMorph">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {selectedChat && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 bg-quaternary/15 backdrop-blur-2xl text-quaternary-content rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-quaternary/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
              aria-label="Show sidebar"
            >
              <ChevronRight className="size-7 text-quaternary-content" />
            </button>
          )}
          {/* Clickable profile section */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={onProfileClick}
          >
            <div className="avatar relative">
              <div className="size-12 rounded-full border-2 border-quaternary/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale">
                <img
                  src={
                    selectedChat?.type === "user"
                      ? selectedChat?.user?.profilePicture || "/avatar.png"
                      : selectedChat?.group?.avatar || "/group.png"
                  }
                  alt={
                    selectedChat?.type === "user"
                      ? selectedChat?.user?.fullName
                      : selectedChat?.group?.name
                  }
                  className="rounded-full"
                />
              </div>
              {selectedChat?.type === "user" && onlineUsers.includes(selectedChat?.user?._id) && (
                <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100/50 animate-pulseGlow"></span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-base-content animate-gla</p>ssMorph">
                {selectedChat?.type === "user"
                  ? selectedChat?.user?.fullName
                  : selectedChat?.group?.name}
              </h3>
              <p className="text-base text-quaternary-content/80 animate-glassMorph">
                {selectedChat?.type === "user"
                  ? onlineUsers.includes(selectedChat?.user?._id)
                    ? "Online"
                    : "Offline"
                  : ""
                }
              </p>
            </div>
          </div>


          <button
            onClick={() => {
              setselectedChat(null);
              setSidebarOpen(true); // Open the sidebar
            }}
            className="p-2.5 bg-tertiary/15 backdrop-blur-2xl text-tertiary-content rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-tertiary/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
            aria-label="Close chat"
          >
            <X className="size-7 text-tertiary-content" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;