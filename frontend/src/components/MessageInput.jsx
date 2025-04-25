import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";

const MessageInput = () => {
  const { sendMessage, selectedUser, replyingTo, setReplyingTo } = useChatStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!text.trim() && !image) return;

    try {
      await sendMessage({ text, image });
      setText("");
      setImage(null);
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

  return (
    <div className="p-4 w-full bg-base-100 border-t border-base-300">
      {replyingTo && (
        <div className="mb-2 p-2 bg-base-200 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/70">
              Replying to {replyingTo.senderId === selectedUser._id ? selectedUser.fullName : "You"}
            </p>
            <p className="text-sm truncate max-w-[200px]">
              {replyingTo.text || (replyingTo.image && "Image")}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 hover:bg-base-300 rounded-full"
          >
            <X size={16} className="text-base-content/70" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 bg-base-100 rounded-lg p-2 shadow-md shadow-primary/10">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 input input-bordered rounded-lg input-md focus:ring-2 focus:ring-primary focus:bg-base-100/90"
          placeholder="Type a message..."
        />
        <label className="btn btn-md btn-circle">
          <Image size={20} className="text-base-content/70" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
        <button
          onClick={handleSendMessage}
          className="btn btn-md btn-circle"
          disabled={!text.trim() && !image}
        >
          <Send size={20} className="text-base-content/70" />
        </button>
      </div>
      {image && (
        <div className="mt-2 relative">
          <img src={image} alt="Preview" className="sm:max-w-[100px] rounded-md" />
          <button
            onClick={() => setImage(null)}
            className="absolute top-0 right-0 p-1 bg-base-300 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;