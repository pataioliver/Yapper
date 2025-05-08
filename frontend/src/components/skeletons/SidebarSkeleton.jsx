import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col bg-base-100 shadow-lg animate-fade-in transition-opacity duration-800 ease-in-out">
      <div className="border-b border-base-300 w-full p-5 bg-base-100">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-tertiary animate-highlight-glow" />
          <span className="font-medium hidden lg:block text-base-content">
            Contacts
          </span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 hover:bg-quaternary/30 animate-slide-in transition-all duration-700 ease-in-out"
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full bg-tertiary animate-highlight-glow" />
            </div>
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2 bg-quaternary animate-highlight-glow" />
              <div className="skeleton h-3 w-16 bg-base-300 animate-highlight-glow" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;