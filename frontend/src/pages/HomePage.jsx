import { useEffect, useState, lazy, Suspense } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader2 } from "lucide-react";

// Lazy load components for better performance
const Sidebar = lazy(() => import("../components/Sidebar"));
const NoChatSelected = lazy(() => import("../components/NoChatSelected"));
const ChatContainer = lazy(() => import("../components/ChatContainer"));
const GroupChat = lazy(() => import("../components/GroupChat"));
const ProfileModal = lazy(() => import("../components/ProfileModal"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Loader2 className="size-10 animate-spin text-tertiary" />
  </div>
);

const HomePage = () => {
  const { selectedUser, selectedGroup, isSidebarOpen, setSidebarOpen } = useChatStore();
  const [profileModal, setProfileModal] = useState({
    open: false,
    type: null,
    user: null,
    group: null,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Animation sequence control
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Mobile responsive layout logic
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

  // Handle back button on mobile
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

  return (
    <div className="min-h-screen backdrop-blur-xl animate-glassMorphPulse">
      <div className="flex items-center justify-center pt-20 px-4">
        <div
          className={`bg-base-100/85 backdrop-blur-xl rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.3)] w-full max-w-6xl h-[calc(100vh-8rem)] transition-all duration-500 ${isMounted ? 'animate-glassMorphPulse' : 'opacity-90'} border border-base-content/20 relative overflow-hidden animation-gpu`}
        >
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </div>
      </div>
      <Suspense fallback={null}>
        <ProfileModal
          open={profileModal.open}
          type={profileModal.type}
          user={profileModal.user}
          group={profileModal.group}
          onClose={closeProfileModal}
        />
      </Suspense>
    </div>
  );
};

export default HomePage;