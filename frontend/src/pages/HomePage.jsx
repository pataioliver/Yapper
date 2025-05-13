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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Animation sequence control
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Track screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile responsive layout logic
  useEffect(() => {
    if (isMobile && !selectedUser && !selectedGroup) {
      setSidebarOpen(true);
    } else if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, [selectedUser, selectedGroup, setSidebarOpen, isMobile]);

  // Handle back button on mobile
  useEffect(() => {
    const handlePopState = (event) => {
      if (isMobile && (selectedUser || selectedGroup)) {
        event.preventDefault();
        setSidebarOpen(true);
        history.pushState(null, document.title, window.location.href);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedUser, selectedGroup, setSidebarOpen, isMobile]);

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

  // Determine what content to render
  let content;
  if (selectedUser) {
    content = <ChatContainer openProfileModal={openProfileModal} />;
  } else if (selectedGroup) {
    content = <GroupChat openProfileModal={openProfileModal} />;
  } else {
    // Only show NoChatSelected on desktop or when sidebar is not open on mobile
    content = (!isMobile || !isSidebarOpen) ? <NoChatSelected /> : null;
  }

  return (
    <div className="min-h-screen backdrop-blur-xl animate-glassMorphPulse">
      <div className="flex items-center justify-center pt-20 px-4">
        <div
          className={`bg-base-100/85 backdrop-blur-xl rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.3)] w-full max-w-6xl h-[calc(100vh-8rem)] transition-all duration-500 ${isMounted ? 'animate-glassMorphPulse' : 'opacity-90'} border border-base-content/20 relative overflow-hidden animation-gpu`}
        >
          <Suspense fallback={<LoadingFallback />}>
            <div className="flex h-full">
              <Sidebar openProfileModal={openProfileModal} />
              
              {/* Right panel with content */}
              <div
                className={`flex-1 h-full transition-all duration-500 ${isSidebarOpen ? "md:ml-80" : ""} ${isMobile && isSidebarOpen && !selectedUser && !selectedGroup ? "hidden" : "flex"}`}
              >
                {content}
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