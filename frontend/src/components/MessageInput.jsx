import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";

const MessageInput = ({ replyColor }) => {
  const { sendMessage, selectedChat, replyingTo, setReplyingTo } = useChatStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!text.trim() && !image) return;
    try {
      await sendMessage({ text, image, replyToId: replyingTo?._id || null });
      setText("");
      setImage(null);
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Use replyColor prop for reply box coloring
  const replyBg = replyColor === "primary" ? "bg-primary/10" : replyColor === "secondary" ? "bg-secondary/10" : "bg-base-200";
  const replyText = replyColor === "primary" ? "text-primary-content" : replyColor === "secondary" ? "text-secondary-content" : "text-base-content";
  const replyBorder = replyColor === "primary" ? "border-primary" : replyColor === "secondary" ? "border-secondary" : "border-base-300";

  return (
    <div className="p-4 w-full bg-base-100/60 backdrop-blur-2xl border-t border-quaternary/20 animate-glassMorphPulse glassmorphism-header">
      {replyingTo && (
        <div className={`mb-2 p-2 ${replyBg} backdrop-blur-lg rounded-lg flex items-center justify-between shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-glassMorph border-l-4 ${replyBorder}`}>
          <div>
            <p className="text-xs text-quaternary-content">
              Replying to {
                replyingTo.senderId === (selectedChat?.type === "user"
                  ? selectedChat?.user?._id
                  : selectedChat?.group?._id)
                  ? (selectedChat?.type === "user"
                    ? selectedChat?.user?.fullName
                    : selectedChat?.group?.name)
                  : "You"
              }
            </p>
            <p className="text-sm truncate max-w-[200px] text-quaternary-content">{replyingTo.text || (replyingTo.image && "Image")}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className={`p-1 ${replyBg} backdrop-blur-2xl ${replyText} rounded-full hover:bg-opacity-40 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-110 transition-all duration-500 animate-subtleScale`}
          >
            <X size={16} className={replyText} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 bg-base-100/70 backdrop-blur-2xl rounded-xl p-2 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] transition-all duration-500 animate-glassMorph glassmorphism-header">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 input input-bordered rounded-xl text-base sm:text-lg focus:ring-2 focus:ring-tertiary focus:bg-base-100/80 backdrop-blur-lg border-base-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500 animate-glassMorphPulse"
          placeholder="Type a message..."
        />
        <label className="btn btn-md btn-circle bg-tertiary/20 backdrop-blur-2xl text-tertiary-content hover:bg-tertiary/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-110 transition-all duration-500 animate-subtleScale">
          <Image size={20} className="text-tertiary-content" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
        <button
          onClick={handleSendMessage}
          className="btn btn-md btn-circle bg-tertiary/40 backdrop-blur-2xl text-tertiary-content hover:bg-tertiary/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-110 transition-all duration-500 animate-glassMorphPulse"
          disabled={!text.trim() && !image}
        >
          <Send size={20} className="text-tertiary-content" />
        </button>
      </div>
      {image && (
        <div className="mt-2 relative animate-glassMorph">
          <img
            src={image}
            alt="Preview"
            className="sm:max-w-[100px] rounded-lg border border-quaternary shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500 animate-subtleScale"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-0 right-0 p-1 bg-quaternary/20 backdrop-blur-2xl text-quaternary-content rounded-full hover:bg-quaternary/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-110 transition-all duration-500 animate-subtleScale"
          >
            <X size={16} className="text-quaternary-content" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;