import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, Image, X, Reply } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ({ isGroup = false, groupId }) => {
  const {
    sendMessage,
    selectedUser,
    replyingTo,
    setReplyingTo,
    sendGroupMessage,
    users,
    selectedGroup,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  const effectiveGroupId = isGroup ? (groupId || selectedGroup?._id) : null;

  const handleChange = (e) => setText(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match("image.*")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // base64 string
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;
    if (!text.trim() && !image) {
      toast.error("Please enter a message or select an image");
      return;
    }
    const recipient = isGroup ? effectiveGroupId : selectedUser?._id;
    if (!recipient) {
      toast.error(isGroup ? "No group selected" : "No recipient selected");
      return;
    }
    setIsSending(true);
    try {
      const payload = { text, image, replyToId: replyingTo?._id || null };
      let result = null;
      if (isGroup) {
        result = await sendGroupMessage(effectiveGroupId, payload);
      } else {
        result = await sendMessage(payload);
      }
      if (result) {
        setText("");
        setImage(null);
        setImagePreview("");
      }
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getReplyingToName = () => {
    if (!replyingTo) return "";
    if (replyingTo.senderId === authUser._id) return "yourself";
    const user = users.find((u) => u._id === replyingTo.senderId);
    return user ? user.fullName : "someone";
  };

  // Color logic for reply block
  let replyBg = "bg-primary/10 border-l-4 border-primary";
  let replyText = "text-primary";
  if (replyingTo && replyingTo.senderId === authUser._id) {
    replyBg = "bg-base-200/80 border-l-4 border-secondary";
    replyText = "text-secondary";
  } else if (replyingTo && replyingTo.senderId && users.find(u => u._id === replyingTo.senderId)) {
    // Optionally, you could add more color logic for group members here
  }

  return (
    <div className="p-4 border-t border-quaternary/10 bg-base-100/80 backdrop-blur-xl shadow-[0_-2px_20px_rgba(0,0,0,0.05)]">
      {replyingTo && (
        <div
          className={`flex items-center justify-between mb-2 p-2 rounded-lg ${replyBg} animate-highlight-quoted`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs font-semibold mb-0.5">
              <Reply size={14} className="text-quaternary" />
              <span>
                Replying to{" "}
                <span className={replyText}>
                  {getReplyingToName()}
                </span>
              </span>
            </div>
            <div className={`truncate ${replyText} text-sm`}>
              {replyingTo.text}
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-2 btn btn-circle btn-xs bg-gradient-to-br from-quaternary to-secondary text-white border-none shadow hover:scale-105 hover:brightness-110 transition-all duration-300 flex items-center justify-center"
            aria-label="Cancel reply"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {imagePreview && (
        <div className="relative mb-2 animate-fadeIn">
          <img
            src={imagePreview}
            alt="Selected"
            className="h-40 object-contain rounded-lg border border-base-300"
          />
          <button
            onClick={() => {
              setImage(null);
              setImagePreview("");
            }}
            className="btn btn-circle btn-xs btn-error absolute top-2 right-2"
            aria-label="Remove image"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-circle btn-ghost bg-gradient-to-br from-tertiary to-quaternary text-white border-none shadow hover:scale-105 hover:brightness-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Attach image"
        >
          <Image size={20} className="opacity-80" />
        </button>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          className="flex-1 input input-bordered rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 bg-base-200/70 backdrop-blur-md shadow-inner placeholder:text-quaternary-content/60 transition-all duration-200"
          placeholder="Type your message..."
          disabled={isSending}
        />
        <button
          type="submit"
          className={`btn btn-circle bg-gradient-to-br from-primary to-secondary text-white border-none shadow hover:scale-105 hover:brightness-110 transition-all duration-300 flex items-center justify-center ${isSending ? "loading" : ""}`}
          disabled={(!text.trim() && !image) || isSending}
          aria-label="Send message"
        >
          {!isSending && <Send size={18} className="text-primary-content" />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;