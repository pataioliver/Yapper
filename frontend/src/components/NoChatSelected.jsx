import { MessageSquare } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatSelected = () => {
  const { isSidebarOpen } = useChatStore();

  if (window.innerWidth < 1024 && isSidebarOpen) {
    return null;
  }

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 animate-in fade-in duration-500">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
              justify-center animate-pulse transition-transform hover:scale-110"
            >
              <MessageSquare className="w-8 h-8 text-primary transition-transform duration-300" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold animate-in slide-in-from-bottom-3 duration-300">
          Welcome to Yapper!
        </h2>
        <p className="text-base-content/60 animate-in slide-in-from-bottom-3 duration-300 delay-100">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;