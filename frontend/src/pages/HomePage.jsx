import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200/85 to-quaternary/20 backdrop-blur-xl animate-glassMorphPulse">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100/85 backdrop-blur-xl rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.3)] w-full max-w-6xl h-[calc(100vh-8rem)] transition-all duration-500 animate-glassMorphPulse border border-base-content/20">
          <div className="flex h-full rounded-2xl overflow-hidden animate-popIn" style={{ animationDelay: "0.2s" }}>
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;