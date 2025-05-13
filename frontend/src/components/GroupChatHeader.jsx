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
    <div className="p-4 border-b border-quaternary/20 h-16 flex items-center bg-base-100/70 backdrop-blur-2xl rounded-tl-none rounded-tr-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 animate-glassySlideIn glassmorphism-header">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="glassmorphic-btn"
              aria-label="Open sidebar"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
            >
              <ChevronRight size={20} className="text-base-content" />
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
          className="glassmorphic-btn"
          aria-label="Close group chat"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(255,255,255,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          }}
        >
          <X size={20} className="text-base-content" />
        </button>
      </div>
    </div>
  );
};

export default GroupChatHeader;