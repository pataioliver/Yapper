import { useState, useEffect, useRef } from "react";
import { ThumbsUp, Heart, Smile, Frown, Zap, SmilePlus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const MessageReactions = ({ messageId, onReact, isOwnMessage, forceColor }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState("right");
  const pickerRef = useRef(null);
  const { authUser } = useAuthStore();

  // Use forceColor if provided, otherwise fallback to secondary
  const colorClass = forceColor || "secondary";

  const reactions = [
    { icon: <ThumbsUp size={16} className={`text-${colorClass}`} />, emoji: "👍" },
    { icon: <Heart size={16} className={`text-${colorClass}`} />, emoji: "❤️" },
    { icon: <Smile size={16} className={`text-${colorClass}`} />, emoji: "😄" },
    { icon: <Frown size={16} className={`text-${colorClass}`} />, emoji: "😢" },
    { icon: <Zap size={16} className={`text-${colorClass}`} />, emoji: "😮" },
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
    onReact(messageId, { emoji: reaction.emoji, userId: authUser._id });
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {showPicker && (
        <div
          ref={pickerRef}
          className={`absolute z-20 p-2 bg-base-100/95 rounded-2xl shadow-xl border-2 border-${colorClass} glassmorphism-header ${
            pickerPosition === "right" ? "right-0" : "left-0"
          } bottom-full mb-2 animate-bounceInScale transition-opacity duration-700 ease-in-out`}
        >
          <div className="flex gap-2">
            {reactions.map((reaction, idx) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReaction(reaction)}
                className={`p-2 rounded-full border-2 shadow-sm transition-all duration-300
                  border-${colorClass} bg-${colorClass}/10 hover:bg-${colorClass}/30
                  hover:scale-110 focus:outline-none animate-glassyPulse
                `}
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
        className={`p-1.5 rounded-full border-2 border-${colorClass} bg-${colorClass}/10 shadow-md hover:bg-${colorClass}/30 transition-all duration-300 animate-glassyPop`}
        aria-label="React"
      >
        <SmilePlus size={16} className={`text-${colorClass}`} />
      </button>
    </div>
  );
};

export default MessageReactions;