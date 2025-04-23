import { ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isSidebarOpen, setSidebarOpen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300 h-14 flex items-center animate-in fade-in duration-300">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {selectedUser && !isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-base-300 rounded transition-transform hover:scale-110 active:scale-95"
              aria-label="Show sidebar"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          <div className="avatar">
            <div className="size-10 rounded-full relative transition-transform hover:scale-105">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-base">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="p-1 hover:bg-base-300 rounded transition-transform hover:scale-110 active:scale-95"
          aria-label="Close chat"
        >
          <X className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;