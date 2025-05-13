import { MessageSquare } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";

const NoChatSelected = () => {
  const { isSidebarOpen } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render on mobile when sidebar is open
  if (isMobile && isSidebarOpen) {
    return null;
  }

  const leftRounding = isSidebarOpen ? 'rounded-l-none' : 'rounded-l-2xl';
  const rightRounding = 'rounded-r-2xl';

  return (
    <div className={`w-full flex flex-1 flex-col items-center justify-center p-4 sm:p-8 md:p-16 bg-base-100/40 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500 animate-glassMorph glassmorphism-header max-w-full ${leftRounding} ${rightRounding}`}>
      <div className="w-full max-w-md text-center space-y-6 relative">
        <div className="relative z-10">
          <div className="absolute inset-0 bg-gradient-radial from-tertiary/20 to-quaternary/10 rounded-full blur-2xl animate-pulseGlow opacity-50" />
          <div className="relative w-16 h-16 mx-auto rounded-2xl bg-secondary/85 backdrop-blur-2xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 animate-scaleIn" style={{ animationDelay: "0.05s" }}>
            <MessageSquare className="w-8 h-8 text-secondary-content" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-base-content hover:text-tertiary transition-all duration-500" style={{ animationDelay: "0.1s" }}>
          Welcome to Yapper!
        </h2>
        <p className="text-quaternary-content/80 animate-glassMorph" style={{ animationDelay: "0.15s" }}>
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;