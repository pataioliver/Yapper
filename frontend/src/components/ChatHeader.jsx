import { X, ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isSidebarOpen, setSidebarOpen } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-quaternary/20 h-20 flex items-center bg-base-100/60 backdrop-blur-2xl rounded-tl-none rounded-tr-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 animate-glassMorph glassmorphism-header">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* Show ChevronRight only if sidebar is closed */}
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 bg-tertiary text-tertiary-content rounded-full shadow hover:opacity-80 transition-all duration-300 animate-bounceInScale border-2 border-tertiary-content"
              aria-label="Open sidebar"
            >
              <ChevronRight className="size-7 text-tertiary-content" />
            </button>
          )}
          <div className="avatar relative ml-1 animate-glassyPop">
            <div className="size-12 rounded-full border-2 border-tertiary shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="rounded-full"
              />
            </div>
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute bottom-0 right-0 size-3.5 bg-tertiary rounded-full ring-2 ring-base-100/50 animate-pulseGlow" />
            )}
          </div>
          <div className="ml-2">
            <h3 className="font-semibold text-lg text-base-content animate-glassMorph">
              {selectedUser.fullName}
            </h3>
            <p className="text-base text-quaternary-content/80 animate-glassMorph">
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="text-tertiary font-semibold animate-pulseGlow">Online</span>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setSidebarOpen(true); // Open the sidebar
          }}
          className="p-2.5 bg-quaternary text-secondary rounded-full shadow hover:opacity-80 transition-all duration-300 animate-subtleScale border-2 border-quaternary"
          aria-label="Close chat"
        >
          <X className="size-7 text-quaternary-content" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;