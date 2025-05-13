import { ChevronRight, X, ChevronLeft, Reply } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const GroupChatHeader = ({ openProfileModal }) => {
  const { selectedGroup, setSelectedGroup, isSidebarOpen, setSidebarOpen } = useChatStore();

  const handleCloseGroupChat = () => {
    // If sidebar is not open, open it first
    if (!isSidebarOpen) {
      setSidebarOpen(true);
    }
    setSelectedGroup(null);
  };

  const handleViewGroupProfile = () => {
    openProfileModal("group", selectedGroup);
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
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 bg-gradient-to-tl from-secondary to-quaternary text-white rounded-full shadow hover:scale-105 hover:brightness-110 transition-all duration-300 border-2 border-quaternary flex items-center justify-center animate-glassyPop"
              aria-label="Open sidebar"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleViewGroupProfile}
          >
            <div className="avatar relative ml-1 animate-glassyPop">
              <div className="size-10 rounded-full border-2 border-tertiary shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale">
                {selectedGroup?.avatar ? (
                  <img
                    src={selectedGroup.avatar}
                    alt={selectedGroup.name}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-lg font-semibold rounded-full">
                    {selectedGroup?.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-2">
              <h3 className="font-semibold text-base text-base-content animate-glassMorph">
                {selectedGroup?.name}
              </h3>
              <p className="text-xs text-quaternary-content/80 animate-glassMorph">
                {selectedGroup?.members?.length || 0} members
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleCloseGroupChat}
          className="p-1.5 bg-gradient-to-br from-quaternary to-secondary text-white rounded-full shadow hover:scale-105 hover:brightness-110 transition-all duration-300 border-2 border-quaternary flex items-center justify-center animate-glassyPop"
          aria-label="Close group chat"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default GroupChatHeader;