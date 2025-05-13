import { ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = ({ openProfileModal }) => {
  const { selectedUser, setSelectedUser, isSidebarOpen, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleCloseChat = () => {
    // If sidebar is not open, open it first
    if (!isSidebarOpen) {
      setSidebarOpen(true);
    }
    setSelectedUser(null);
  };

  const handleViewProfile = () => {
    openProfileModal("user", selectedUser);
  };

  return (
    <div className="p-4 border-b border-quaternary/20 h-16 flex items-center bg-base-100/70 backdrop-blur-2xl rounded-tl-none rounded-tr-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 animate-glassySlideIn glassmorphism-header">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 bg-gradient-to-br from-secondary to-primary text-white rounded-full shadow hover:scale-105 hover:brightness-110 transition-all duration-300 border-2 border-primary flex items-center justify-center animate-glassyPop"
              aria-label="Open sidebar"
              style={{ minWidth: 32, minHeight: 32 }}
            >
              <ChevronRight className="size-5" />
            </button>
          )}
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleViewProfile}
          >
            <div className="avatar relative ml-1 animate-glassyPop">
              <div className="size-10 rounded-full border-2 border-tertiary shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale">
                <img
                  src={selectedUser.profilePicture || "/avatar.png"}
                  alt={selectedUser.fullName}
                  className="rounded-full"
                />
              </div>
              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 size-2.5 bg-tertiary rounded-full ring-2 ring-base-100/50 animate-pulseGlow" />
              )}
            </div>
            <div className="ml-2">
              <h3 className="font-semibold text-base text-base-content animate-glassMorph">
                {selectedUser.fullName}
              </h3>
              <p className="text-xs text-quaternary-content/80 animate-glassMorph">
                {onlineUsers.includes(selectedUser._id) ? (
                  <span className="text-green-500 font-semibold animate-pulseGlow">Online</span>
                ) : (
                  <span className="text-gray-400">Offline</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleCloseChat}
          className="p-1.5 bg-gradient-to-br from-quaternary to-secondary text-white rounded-full shadow hover:scale-105 hover:brightness-110 transition-all duration-300 border-2 border-quaternary flex items-center justify-center animate-glassyPop"
          aria-label="Close chat"
          style={{ minWidth: 32, minHeight: 32 }}
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;