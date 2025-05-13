import React from "react";

const MessageSkeleton = () => {
  // Create an array of 4 skeletons with different positions
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`chat ${i % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}>
          <div className="chat-image avatar">
            <div className="w-10 h-10 rounded-full bg-base-300"></div>
          </div>
          <div className="chat-header mb-1">
            <div className="h-4 bg-base-300 rounded w-24"></div>
          </div>
          <div className={`chat-bubble bg-base-200 border border-base-300 rounded-2xl p-3 ${i % 2 === 0 ? "w-52" : "w-64"}`}>
            <div className="h-4 bg-base-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-base-300 rounded w-3/4"></div>
            {i === 1 && (
              <div className="h-20 bg-base-300 rounded mt-2 w-full"></div>
            )}
          </div>
          <div className="chat-footer opacity-70 flex gap-1 mt-1">
            <div className="h-6 bg-base-300 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;