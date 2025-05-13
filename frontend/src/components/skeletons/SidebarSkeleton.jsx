import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-full md:w-80 flex flex-col bg-base-100/80 backdrop-blur-xl rounded-tl-2xl rounded-bl-2xl shadow-[0_0_25px_rgba(255,255,255,0.08)] animate-fade-in transition-opacity duration-500">
      <div className="border-b border-base-300 w-full p-5 bg-base-100/80">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-tertiary animate-highlight-glow" />
          <span className="font-medium text-base-content">Contacts</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3 flex-1">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 hover:bg-quaternary/30 animate-slide-in transition-all duration-500"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div className="relative">
              <div className="skeleton w-12 h-12 rounded-full bg-tertiary/30" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="skeleton h-4 w-28 mb-2 bg-quaternary/30" />
              <div className="skeleton h-3 w-16 bg-base-300/60" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;