import { ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isSidebarOpen, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div
      className="p-2.5 border-b border-base-300 h-14 flex items-center bg-base-100/95 animate-in fade-in duration-400 shadow-sm"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {selectedUser && !isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-base-300 rounded transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-primary/20"
              aria-label="Show sidebar"
            >
              <ChevronRight className="size-6 text-primary" />
            </button>
          )}

          <div className="avatar">
            <div
              className="size-10 rounded-full relative transition-transform duration-300 hover:scale-110 border-2 border-primary/20"
            >
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-base bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {selectedUser.fullName}
            </h3>
            <p className="text-sm text-base-content/70 transition-opacity duration-300 hover:opacity-80">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="p-1 hover:bg-base-300 rounded transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-primary/20"
          aria-label="Close chat"
        >
          <X className="size-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;