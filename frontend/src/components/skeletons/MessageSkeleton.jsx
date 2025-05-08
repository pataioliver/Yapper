const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"} animate-slide-in transition-opacity duration-700 ease-in-out`}
          style={{ animationDelay: `${idx * 0.2}s` }}
        >
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full bg-base-300 animate-highlight-glow" />
            </div>
          </div>
          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16 bg-tertiary animate-highlight-glow" />
          </div>
          <div className="chat-bubble bg-transparent p-0">
            <div
              className="skeleton h-16 w-[200px] bg-quaternary rounded-lg animate-highlight-glow hover:shadow-lg hover:shadow-tertiary/30 transition-shadow duration-700 ease-in-out"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;