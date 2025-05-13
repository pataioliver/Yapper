import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { Smile } from 'lucide-react';

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MessageReactions = ({
  messageId,
  reactions = [],
  onReact,
  isOwnMessage,
  forceColor,
  show,
  displayMode = "full", // "full" or "reactionButton"
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState("right");
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const { authUser } = useAuthStore();

  // Group and count reactions
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { count: 0, users: [] };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(
      typeof reaction.userId === "object" ? reaction.userId._id : reaction.userId
    );
    return acc;
  }, {});

  // Check if user has already reacted with each emoji
  const userReactions = {};
  REACTION_EMOJIS.forEach(emoji => {
    userReactions[emoji] = groupedReactions[emoji]?.users.includes(authUser?._id) || false;
  });

  // Correctly position the picker based on message ownership
  useEffect(() => {
    if (showPicker && buttonRef.current && pickerRef.current) {
      // For own messages (right side/chat-end), picker should be on left
      // For received messages (left side/chat-start), picker should be on right
      setPickerPosition(isOwnMessage ? "left" : "right");
    }
  }, [showPicker, isOwnMessage]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReactionClick = (emoji) => {
    if (!userReactions[emoji]) {
      onReact(messageId, { emoji }); // Fix: Pass object with emoji property
      setShowPicker(false);
    }
  };

  const buttonColor = forceColor || (isOwnMessage ? "secondary" : "primary");
  
  // Adapt colors based on message ownership
  const bubbleColorBg = isOwnMessage 
    ? "bg-secondary/30 border-secondary/40" 
    : "bg-base-200/60 border-base-300/50";
  
  const buttonTextColor = isOwnMessage 
    ? "text-secondary-content" 
    : "text-base-content";

  // Reactions aligned based on message position
  const align = isOwnMessage ? "justify-end" : "justify-start";

  // If we're only showing the button, render just that
  if (displayMode === "reactionButton") {
    return (
      <div className={`flex ${align} w-full relative`}>
        <div className="animate-glassyPop">
          <button
            ref={buttonRef}
            onClick={() => setShowPicker(prev => !prev)}
            className={`text-xs px-3 py-1.5 rounded-full backdrop-blur-md border
              ${bubbleColorBg} ${buttonTextColor} hover:brightness-110 
              flex items-center transition-all`}
            style={{
              boxShadow: isOwnMessage 
                ? "0 2px 8px rgba(80,180,255,0.15)" 
                : "0 2px 8px rgba(0,0,0,0.06)"
            }}
            tabIndex={0}
          >
            <Smile size={16} className="mr-1" />
            <span className="font-semibold">React</span>
          </button>
        </div>
        
        {showPicker && (
          <div
            ref={pickerRef}
            className={`absolute bottom-full mb-2 ${pickerPosition === 'right' ? 'left-0' : 'right-0'} 
              bg-base-100/90 shadow-xl rounded-2xl p-3 z-50 backdrop-blur-xl animate-glassyPop
              border border-base-content/10`}
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div className="flex gap-3 p-1">
              {REACTION_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className={`text-2xl hover:scale-125 transition-all p-1.5 rounded-full 
                    ${userReactions[emoji] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-base-200/70'}`}
                  disabled={userReactions[emoji]}
                  title={userReactions[emoji] ? "You already used this reaction" : "React with " + emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className={`w-3 h-3 bg-base-100/90 rotate-45 absolute -bottom-1.5 
              ${pickerPosition === 'right' ? 'left-4' : 'right-4'} border-r border-b border-base-content/10`}></div>
          </div>
        )}
      </div>
    );
  }

  // Otherwise render the full component (for backward compatibility)
  return (
    <div className={`flex ${align} w-full relative`}>
      <div className="flex items-center gap-1.5 animate-glassyPop">
        {Object.entries(groupedReactions).map(([emoji, data]) => (
          <div
            key={emoji}
            className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 font-semibold 
              backdrop-blur-md ${bubbleColorBg} ${buttonTextColor} border
              ${userReactions[emoji] ? `ring-2 ring-${buttonColor}/60` : ''}
              hover:brightness-110 transition-all cursor-pointer animate-glassyPulse`}
            style={{
              boxShadow: isOwnMessage 
                ? "0 2px 8px rgba(80,180,255,0.15)" 
                : "0 2px 8px rgba(0,0,0,0.06)",
              fontWeight: userReactions[emoji] ? 700 : 500,
            }}
            title={`${data.count} reaction${data.count !== 1 ? 's' : ''}`}
            tabIndex={0}
          >
            <span className="text-lg">{emoji}</span>
            <span className="font-bold">{data.count}</span>
          </div>
        ))}
        <button
          ref={buttonRef}
          onClick={() => setShowPicker(prev => !prev)}
          className={`text-xs px-3 py-1.5 rounded-full backdrop-blur-md border
            ${bubbleColorBg} ${buttonTextColor} hover:brightness-110 
            flex items-center transition-all`}
          style={{
            boxShadow: isOwnMessage 
              ? "0 2px 8px rgba(80,180,255,0.15)" 
              : "0 2px 8px rgba(0,0,0,0.06)"
          }}
          tabIndex={0}
        >
          <Smile size={16} className="mr-1" />
          <span className="font-semibold">React</span>
        </button>
      </div>
      
      {showPicker && (
        <div
          ref={pickerRef}
          className={`absolute bottom-full mb-2 ${pickerPosition === 'right' ? 'left-0' : 'right-0'} 
            bg-base-100/90 shadow-xl rounded-2xl p-3 z-50 backdrop-blur-xl animate-glassyPop
            border border-base-content/10`}
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <div className="flex gap-3 p-1">
            {REACTION_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className={`text-2xl hover:scale-125 transition-all p-1.5 rounded-full 
                  ${userReactions[emoji] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-base-200/70'}`}
                disabled={userReactions[emoji]}
                title={userReactions[emoji] ? "You already used this reaction" : "React with " + emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className={`w-3 h-3 bg-base-100/90 rotate-45 absolute -bottom-1.5 
            ${pickerPosition === 'right' ? 'left-4' : 'right-4'} border-r border-b border-base-content/10`}></div>
        </div>
      )}
    </div>
  );
};

export default MessageReactions;