import { useState, useEffect, useRef } from "react";
import { ThumbsUp, Heart, Smile, Frown, Zap, SmilePlus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const MessageReactions = ({ messageId, onReact, isOwnMessage }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState("right");
  const pickerRef = useRef(null);
  const { authUser } = useAuthStore();

  const reactions = [
    { icon: <ThumbsUp size={16} />, emoji: "👍" },
    { icon: <Heart size={16} />, emoji: "❤️" },
    { icon: <Smile size={16} />, emoji: "😄" },
    { icon: <Frown size={16} />, emoji: "😢" },
    { icon: <Zap size={16} />, emoji: "😮" },
  ];

  useEffect(() => {
    if (showPicker && pickerRef.current) {
      const picker = pickerRef.current;
      const rect = picker.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Adjust horizontal position: for own messages, show on the right; for others, show on the left
      if (isOwnMessage) {
        setPickerPosition("right");
      } else {
        setPickerPosition("left");
      }

      // Prevent overflow by adjusting if necessary
      if (pickerPosition === "right" && rect.right > viewportWidth) {
        setPickerPosition("left");
      } else if (pickerPosition === "left" && rect.left < 0) {
        setPickerPosition("right");
      }

      // Adjust vertical position: if there's no space at the bottom, move to the top
      const viewportHeight = window.innerHeight;
      if (rect.bottom > viewportHeight) {
        picker.classList.add("top-full", "mt-2");
        picker.classList.remove("bottom-full", "mb-2");
      } else {
        picker.classList.add("bottom-full", "mb-2");
        picker.classList.remove("top-full", "mt-2");
      }
    }
  }, [showPicker, isOwnMessage, pickerPosition]);

  const handleReaction = (reaction) => {
    const reactionWithUser = {
      emoji: reaction.emoji,
      userId: authUser._id,
    };
    onReact(messageId, reactionWithUser);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {showPicker && (
        <div
          ref={pickerRef}
          className={`
            absolute z-20 p-2 bg-base-100 rounded-lg shadow-md shadow-primary/20 animate-in zoom-in-95 duration-300
            ${pickerPosition === "right" ? "right-0" : "left-0"}
            bottom-full mb-2
          `}
          onMouseLeave={() => setShowPicker(false)}
        >
          <div className="flex gap-2">
            {reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReaction(reaction)}
                className="p-1 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20 tooltip"
                data-tip={reaction.emoji}
              >
                {reaction.icon}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-1.5 bg-base-100 rounded-full shadow-md hover:bg-primary/20 hover:scale-110 transition-all duration-300 animate-pulse"
      >
        <SmilePlus size={16} className="text-base-content/70 hover:text-primary" />
      </button>
    </div>
  );
};

export default MessageReactions;