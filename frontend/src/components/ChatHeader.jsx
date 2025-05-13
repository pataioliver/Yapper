import { ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

/**
 * ChatHeader Component
 * 
 * Displays the current chat user information and control buttons
 * Handles sidebar toggling and profile view
 * 
 * @param {Object} props - Component props
 * @param {Function} props.openProfileModal - Function to open the profile modal
 */
const ChatHeader = ({ openProfileModal }) => {
  const { selectedUser, setSelectedUser, isSidebarOpen, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  /**
   * Handle closing the current chat
   * Opens the sidebar if it's not already open
   */
  const handleCloseChat = () => {
    if (!isSidebarOpen) {
      setSidebarOpen(true);
    }
    setSelectedUser(null);
  };

  /**
   * Handle viewing the profile of the selected user
   */
  const handleViewProfile = () => {
    openProfileModal("user", selectedUser);
  };

  return (
    <div
  className={
    `p-4 border-b border-quaternary/20 h-16 flex items-center bg-base-100/70 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 animate-glassySlideIn glassmorphism-header ` +
    (isSidebarOpen
      ? "rounded-tr-2xl rounded-tl-none"
      : "rounded-tr-2xl rounded-tl-2xl")
  }
>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* Sidebar toggle button - only shown when sidebar is closed */}
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 bg-gradient-to-tl from-secondary to-quaternary text-white rounded-full shadow hover:scale-105 hover:brightness-110 transition-all duration-300 border-2 border-quaternary flex items-center justify-center animate-glassyPop"
              aria-label="Open sidebar"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
          
          {/* User profile section - clickable to view profile */}
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleViewProfile}
          >
            {/* User avatar with online indicator */}
            <div className="avatar relative ml-1 animate-glassyPop">
              <div className="size-10 rounded-full border-2 border-tertiary shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale">
                <img
                  src={selectedUser.profilePicture || "/avatar.png"}
                  alt={selectedUser.fullName}
                  className="rounded-full"
                />
              </div>
              {/* Online status indicator */}
              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 size-2.5 bg-tertiary rounded-full ring-2 ring-base-100/50 animate-pulseGlow" />
              )}
            </div>
            
            {/* User name and status */}
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
        
        {/* Close chat button */}
        <button
          onClick={handleCloseChat}
          className="p-1.5 bg-gradient-to-br from-quaternary to-secondary text-white rounded-full shadow hover:scale-105 hover:brightness-110 transition-all duration-300 border-2 border-quaternary flex items-center justify-center animate-glassyPop"
          aria-label="Close chat"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;