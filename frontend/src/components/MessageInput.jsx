import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-gradient-to-t from-base-200/30 to-base-100">
      {imagePreview && (
        <div
          className="mb-3 flex items-center gap-2 animate-in fade-in duration-400"
        >
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-primary/20 transition-transform duration-300 hover:scale-105 hover:shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20"
              type="button"
            >
              <X className="size-3 text-primary" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 bg-base-100 rounded-lg p-2 shadow-md shadow-primary/10"
      >
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-md transition-all duration-300 focus:ring-2 focus:ring-primary focus:bg-base-100/90 hover:shadow-md hover:shadow-primary/20"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-md btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            } transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-primary/20`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-md btn-circle transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-primary/20"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} className="text-primary" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;