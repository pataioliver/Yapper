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

      if (isOwnMessage) {
        setPickerPosition("right");
      } else {
        setPickerPosition("left");
      }

      if (pickerPosition === "right" && rect.right > viewportWidth) {
        setPickerPosition("left");
      } else if (pickerPosition === "left" && rect.left < 0) {
        setPickerPosition("right");
      }

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
          className={`absolute z-20 p-2 bg-base-100 rounded-lg shadow-md shadow-tertiary/20 ${pickerPosition === "right" ? "right-0" : "left-0"} bottom-full mb-2 animate-slide-in transition-opacity duration-700 ease-in-out`}
        >
          <div className="flex gap-2">
            {reactions.map((reaction, idx) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReaction(reaction)}
                className="p-1 hover:bg-gradient-primary hover:shadow-lg hover:shadow-quaternary/50 rounded-full tooltip transition-all duration-700 ease-in-out"
                data-tip={reaction.emoji}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {reaction.icon}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-1.5 bg-base-100 rounded-full shadow-md hover:bg-gradient-primary hover:shadow-lg hover:shadow-tertiary/50 transition-all duration-700 ease-in-out"
      >
        <SmilePlus size={16} className="text-quaternary" />
      </button>
    </div>
  );
};

export default MessageReactions;