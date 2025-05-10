import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, ChevronLeft } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    isSidebarOpen,
    setSidebarOpen,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const filteredAndSearchedUsers = filteredUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(!selectedUser);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen, selectedUser]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        h-full bg-base-100/10 backdrop-blur-2xl transition-all duration-500 ease-in-out
        ${isSidebarOpen ? "w-full lg:w-80 opacity-100" : "w-0 lg:w-0 opacity-0"}
        ${
          isSidebarOpen && window.innerWidth < 1024
            ? "flex flex-col h-[calc(100%-4rem)]"
            : "relative border-r border-quaternary/20 h-full"
        }
        flex flex-col overflow-x-hidden rounded-tl-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-glassMorph
      `}
    >
      <div className="border-b border-quaternary/20 w-full p-3 flex justify-between items-center h-16 bg-base-200/15 backdrop-blur-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] animate-glassMorph">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-quaternary/15 backdrop-blur-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale">
            <Users className="size-7 text-tertiary" />
          </div>
          <span className="font-semibold text-lg text-base-content animate-glassMorph">
            Contacts
          </span>
        </div>
        {selectedUser && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2.5 bg-quaternary/15 backdrop-blur-2xl text-quaternary-content rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-quaternary/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="size-7 text-quaternary-content" />
          </button>
        )}
      </div>

      {isSidebarOpen && (
        <div className="p-4 border-b border-quaternary/20 animate-glassMorph">
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full focus:ring-2 focus:ring-quaternary/50 focus:bg-base-100/15 backdrop-blur-2xl border-base-300/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-500 animate-glassMorph"
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm border-quaternary/50 animate-glassMorph"
              />
              <span className="text-base text-base-content animate-glassMorph">
                Show online only
              </span>
            </label>
            <span className="text-sm text-quaternary/80 animate-glassMorph">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>
      )}

      <div className="overflow-y-auto w-full py-3">
        {filteredAndSearchedUsers.map((user, idx) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={`
              w-full p-3 flex items-center gap-4 transition-all duration-500 animate-glassMorph
              backdrop-blur-xl border border-white/10 hover:border-white/20
              ${
                selectedUser?._id === user._id
                  ? "bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)] ring-2 ring-primary/40"
                  : "hover:bg-white/5"
              }
            `}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full border-2 border-quaternary/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500 animate-subtleScale"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100/50 animate-pulseGlow" />
              )}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <div className="font-semibold text-lg text-base-content animate-glassMorph">
                {user.fullName}
              </div>
              <div className="text-base text-quaternary/80 animate-glassMorph">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredAndSearchedUsers.length === 0 && (
          <div className="text-center text-quaternary/80 py-5 animate-glassMorph">
            No users found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
