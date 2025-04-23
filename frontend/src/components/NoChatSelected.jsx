import { MessageSquare } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatSelected = () => {
  const { isSidebarOpen } = useChatStore();

  if (window.innerWidth < 1024 && isSidebarOpen) {
    return null;
  }

  return (
    <div
      className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-gradient-to-b from-base-100 to-base-200/30 animate-in fade-in duration-400"
    >
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20"
            >
              <MessageSquare
                className="w-8 h-8 text-primary transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>

        <h2
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-in slide-in-from-bottom-2 duration-400"
        >
          Welcome to Yapper!
        </h2>
        <p
          className="text-base-content/60 transition-opacity duration-300 hover:opacity-80 animate-in slide-in-from-bottom-2 duration-400 delay-50"
        >
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;