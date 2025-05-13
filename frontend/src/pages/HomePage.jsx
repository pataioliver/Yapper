import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import GroupChat from "../components/GroupChat";
import ProfileModal from "../components/ProfileModal";

const HomePage = () => {
  const { selectedUser, selectedGroup, isSidebarOpen, setSidebarOpen } = useChatStore();
  const [profileModal, setProfileModal] = useState({
    open: false,
    type: null,
    user: null,
    group: null,
  });

  // On mobile, sidebar should be open by default
  useEffect(() => {
    const handleResize = () => {
      // On mobile, when no chat is selected, always show sidebar
      if (window.innerWidth < 768 && !selectedUser && !selectedGroup) {
        setSidebarOpen(true);
      } 
      // On desktop, always show sidebar
      else if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedUser, selectedGroup, setSidebarOpen]);

  // Handle back button on mobile to show sidebar instead of navigating away
  useEffect(() => {
    const handlePopState = (event) => {
      if (window.innerWidth < 768 && (selectedUser || selectedGroup)) {
        event.preventDefault();
        setSidebarOpen(true);
        history.pushState(null, document.title, window.location.href);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedUser, selectedGroup, setSidebarOpen]);

  // Centralized modal opener for Sidebar, ChatHeader, GroupChatHeader
  const openProfileModal = (type, entity) => {
    setProfileModal({
      open: true,
      type,
      user: type === "user" ? entity : null,
      group: type === "group" ? entity : null,
    });
  };

  const closeProfileModal = () => {
    setProfileModal({
      open: false,
      type: null,
      user: null,
      group: null,
    });
  };

  // Animation for horizontal centering when sidebar is open/closed
  // On desktop, shift chat right; on mobile, sidebar overlays
  return (
    <div className="min-h-screen backdrop-blur-xl animate-glassMorphPulse">
      <div className="flex items-center justify-center pt-20 px-4">
        <div
          className={`bg-base-100/85 backdrop-blur-xl rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.3)] w-full max-w-6xl h-[calc(100vh-8rem)] transition-all duration-500 animate-glassMorphPulse border border-base-content/20 relative overflow-hidden`}
        >
          <Sidebar openProfileModal={openProfileModal} />
          <div
            className={`
              flex h-full rounded-2xl overflow-hidden transition-all duration-500
              ${isSidebarOpen ? "md:ml-80" : ""}
            `}
            style={{
              transform: isSidebarOpen
                ? "translateX(0)"
                : "translateX(0)",
              transition: "margin-left 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* On mobile, hide chat when sidebar is open and no chat is selected */}
            <div className={`flex-1 h-full ${isSidebarOpen && window.innerWidth < 768 && !selectedUser && !selectedGroup ? "hidden" : "flex"} transition-all duration-500`}>
              {!selectedUser && !selectedGroup ? (
                <NoChatSelected />
              ) : selectedUser ? (
                <ChatContainer openProfileModal={openProfileModal} />
              ) : (
                <GroupChat openProfileModal={openProfileModal} />
              )}
            </div>
          </div>
        </div>
      </div>
      <ProfileModal
        open={profileModal.open}
        type={profileModal.type}
        user={profileModal.user}
        group={profileModal.group}
        onClose={closeProfileModal}
      />
    </div>
  );
};

export default HomePage;