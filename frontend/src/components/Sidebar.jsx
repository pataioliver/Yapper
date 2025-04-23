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
        setSidebarOpen(true); // Open on desktop
      } else {
        setSidebarOpen(!selectedUser); // Open on mobile if no user is selected
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
        h-full bg-base-100 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-full lg:w-72" : "w-0 lg:w-0"}
        ${
          isSidebarOpen && window.innerWidth < 1024
            ? "flex flex-col h-[calc(100%-4rem)]"
            : "relative border-r border-base-300 h-full"
        }
        flex flex-col overflow-x-hidden
      `}
    >
      <div
        className="border-b border-base-300 w-full p-2.5 flex justify-between items-center h-14"
      >
        <div className="flex items-center gap-2">
          <Users className="size-6 transition-transform hover:scale-110" />
          <span className="font-medium text-base">Contacts</span>
        </div>
        {selectedUser && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-base-300 rounded transition-transform hover:scale-110 active:scale-95"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}
      </div>

      {isSidebarOpen && (
        <div className="p-3 border-b border-base-300 animate-in fade-in duration-300">
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm transition-transform hover:scale-110"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
          </div>
        </div>
      )}

      <div className="overflow-y-auto w-full py-2">
        {filteredAndSearchedUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={`
              w-full p-2 flex items-center gap-3
              hover:bg-base-300 transition-colors duration-200
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              animate-in fade-in slide-in-from-left-3 duration-300
            `}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-10 object-cover rounded-full transition-transform hover:scale-105"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-2.5 bg-green-500 
                  rounded-full ring-1.5 ring-zinc-900 animate-pulse"
                />
              )}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredAndSearchedUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 animate-in fade-in duration-300">
            No users found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;