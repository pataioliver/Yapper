import { ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isSidebarOpen, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-quaternary/20 h-16 flex items-center bg-base-100/10 backdrop-blur-2xl rounded-tl-none rounded-tr-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 animate-glassMorph">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {selectedUser && !isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 bg-quaternary/15 backdrop-blur-2xl text-quaternary-content rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-quaternary/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
              aria-label="Show sidebar"
            >
              <ChevronRight className="size-7 text-quaternary-content" />
            </button>
          )}
          <div className="avatar relative">
            <div className="size-12 rounded-full border-2 border-quaternary/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="rounded-full" />
            </div>
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100/50 animate-pulseGlow" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-base-content animate-glassMorph">{selectedUser.fullName}</h3>
            <p className="text-base text-quaternary-content/80 animate-glassMorph">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2.5 bg-tertiary/15 backdrop-blur-2xl text-tertiary-content rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-tertiary/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
          aria-label="Close chat"
        >
          <X className="size-7 text-tertiary-content" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;