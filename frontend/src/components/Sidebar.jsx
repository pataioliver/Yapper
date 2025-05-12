import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {
  UserPlus2,
  UserMinus2,
  UserCheck2,
  UserRoundX,
  ChevronLeft,
  UsersRound,
} from "lucide-react";

const Sidebar = () => {
  const {
    friends,
    pendingRequests,
    recommendations,
    fetchFriendshipData,
    acceptFriendRequest,
    rejectFriendRequest,
    sendFriendRequest,
    unfriend,
    setselectedChat,
    selectedChat,
    isSidebarOpen,
    setSidebarOpen,
    isUsersLoading,
    allFriendships,
    groups,
    fetchGroups,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchFriendshipData();
      await fetchGroups();
      // Automatically open the sidebar on small devices
      if (window.innerWidth < 768) {
        setSidebarOpen(true);
        setselectedChat(null); // Ensure no chat is selected initially
      }
    };
    fetchData();
  }, [fetchFriendshipData, fetchGroups, setSidebarOpen, setselectedChat]);


  const filteredFriends = useMemo(() => {
    return friends.filter((friend) => {
      const friendUser =
        friend.requester._id === authUser._id ? friend.recipient : friend.requester;

      const matchesSearch = friendUser.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOnline = !showOnlineOnly || onlineUsers.includes(friendUser._id);

      return matchesSearch && matchesOnline;
    });
  }, [friends, searchQuery, showOnlineOnly, onlineUsers, authUser._id]);

  // Memoized filtered pending requests
  // (removed duplicate filteredPendingRequests declaration)

  const filteredRecommendations = useMemo(() => {
    if (!authUser?._id) return [];
    return recommendations.filter((user) => {
      const hasAnyFriendship = allFriendships.some(
        (friendship) =>
          (friendship.requester._id === authUser._id &&
            friendship.recipient._id === user._id) ||
          (friendship.recipient._id === authUser._id &&
            friendship.requester._id === user._id)
      );
      const matchesSearch = user.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesOnline =
        !showOnlineOnly || onlineUsers.includes(user._id);
      return !hasAnyFriendship && matchesSearch && matchesOnline;
    });
  }, [recommendations, allFriendships, searchQuery, showOnlineOnly, onlineUsers, authUser?._id]);

  const filteredPendingRequests = useMemo(() => {
    if (!authUser?._id) return [];
    return pendingRequests.filter((req) => {
      // Defensive: check requester existence and filter by search/online if needed
      if (!req || !req.requester || !req.requester.fullName || !req.requester._id) return false;
      const matchesSearch = req.requester.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOnline = !showOnlineOnly || onlineUsers.includes(req.requester._id);
      return matchesSearch && matchesOnline;
    });
  }, [pendingRequests, searchQuery, showOnlineOnly, onlineUsers, authUser?._id]);

  const handleUserSelect = (user) => {
    setselectedChat(user);

    // Collapse the sidebar on small devices
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };


  const shouldShowSkeleton = !authUser?._id || isUsersLoading;

  return (
    <aside
      className={`h-full transition-all duration-500 ease-in-out fixed lg:static top-0 left-0 z-40 ${
        isSidebarOpen
          ? "w-full lg:w-80 opacity-100"
          : "w-0 lg:w-0 opacity-0 pointer-events-none"
      } flex flex-col overflow-y-auto overflow-x-hidden rounded-tl-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)] bg-base-100/70 backdrop-blur-2xl border-r border-quaternary/20 animate-glassMorph`}
      style={{
        boxShadow:
          "0 8px 32px 0 rgba(31, 38, 135, 0.12), 0 1.5px 8px 0 rgba(0,0,0,0.08)",
        transition: "width 0.5s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {shouldShowSkeleton ? (
        <SidebarSkeleton />
      ) : (
        <>
          <div className="border-b border-quaternary/20 w-full px-5 py-3 flex justify-between items-center h-20 bg-base-100/60 backdrop-blur-2xl glassmorphism-header">
            <h2 className="font-semibold text-xl tracking-tight text-base-content flex items-center gap-2 animate-bounceInScale">
              <UsersRound className="inline-block mr-1 text-secondary" />
              <span className="drop-shadow">Contacts</span>
            </h2>
            {selectedChat && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2.5 bg-tertiary text-secondary rounded-full shadow hover:scale-110 hover:bg-tertiary/70 hover:border-secondary/70 transition-all duration-300 animate-bounceInScale border-2 border-secondary"
                aria-label="Close sidebar"
              >
                <ChevronLeft className="size-7 text-secondary" />
              </button>
            )}
          </div>

          {/* Search Bar and Online Filter */}
          <div className="px-5 py-4 border-b border-quaternary/20 bg-base-100/40 backdrop-blur-2xl">
            <div className="relative animate-fadeIn">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm text-base sm:text- lg input-bordered w-full rounded-xl bg-base-100/60 border-base-300/50 shadow-[0_2px_16px_rgba(0,0,0,0.07)] focus:ring-2 focus:ring-quaternary/50 focus:bg-base-100/80 transition-all duration-300"
                style={{
                  fontSize: "1rem",
                  paddingLeft: "2.5rem",
                  fontWeight: 500,
                }}
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-quaternary-content/70">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-3.5-3.5"/></svg>
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3 animate-glassMorph">
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox checkbox-sm border-quaternary/50 accent-tertiary"
                />
                <span className="text-base text-base-content font-medium">
                  Show online only
                </span>
              </label>
              <span className="text-sm text-quaternary/80 ml-auto flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulseGlow" />
                <span className="text-tertiary font-semibold">{onlineUsers.length}</span> online
              </span>
            </div>
          </div>

          <div className="overflow-y-auto w-full py-2 flex-1 custom-scrollbar">
            {/* Pending Requests */}
            {filteredPendingRequests.length > 0 && (
              <div className="sidebar-section px-5 py-2 animate-fadeIn">
                <h3 className="font-semibold text-lg mb-2 text-quaternary-content/90 tracking-tight">
                  Pending Requests
                </h3>
                <div className="space-y-2">
                  {filteredPendingRequests.map((req, idx) => (
                    <div
                      key={req._id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-base-100/60 hover:bg-base-200/60 transition-all duration-300 shadow-[0_1px_8px_rgba(0,0,0,0.04)] animate-slideIn"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={req.requester.profilePic || "/avatar.png"}
                          alt=""
                          className="w-9 h-9 rounded-full border-2 border-quaternary/30 shadow"
                        />
                        <span className="font-medium text-base-content">
                          {req.requester.fullName}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => acceptFriendRequest(req._id)}
                          className="btn btn-xs bg-success text-success-content rounded-full shadow hover:scale-110 hover:bg-success/80 transition-transform animate-pulseGlow group"
                          aria-label="Accept"
                        >
                          <UserCheck2 size={15} className="text-success-content" />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-0.5 rounded bg-success text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                            Accept
                          </span>
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(req._id)}
                          className="btn btn-xs bg-error text-error-content rounded-full shadow hover:scale-110 hover:bg-error/80 transition-transform animate-pulseGlowDark group"
                          aria-label="Reject"
                        >
                          <UserRoundX size={15} className="text-error-content" />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-0.5 rounded bg-error text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                            Reject
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="my-4 border-t border-quaternary/20" />
              </div>
            )}

            {/* Friends */}
            <div className="sidebar-section">
              <h3 className="font-semibold text-lg">Friends</h3>
              {filteredFriends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => {
                    if (friend._id !== authUser._id) {
                      handleUserSelect(friend);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`avatar ${onlineUsers.includes(friend._id) ? "online" : ""}`}>
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={friend.profilePic || "/avatar.png"}
                          alt={friend.fullName || "Profile"}
                        />
                      </div>
                    </div>
                    <span>{friend.fullName || "Unknown"}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unfriend(friend._id);
                    }}
                    className="btn btn-sm btn-warning"
                  >
                    <UserMinus2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Groups */}
            <div className="sidebar-section">
              <h3 className="font-semibold text-lg">Groups</h3>
              {groups.length === 0 && (
                <div className="text-sm text-quaternary-content px-2 py-4">No groups found.</div>
              )}
              {groups.map(group => (
                <div
                  key={group._id}
                  className="flex items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => setselectedChat({ type: "group", group, _id: group._id })}
                >
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={group.avatar || "/group.png"}
                          alt={group.name || "Group"}
                        />
                      </div>
                    </div>
                    <span>{group.name || "Unnamed Group"}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="sidebar-section px-5 py-2 animate-fadeIn">
              <hr className="my-4 border-t border-quaternary/20" />
              <h3 className="font-semibold text-lg mb-2 text-quaternary-content/90 tracking-tight">
                Recommendations
              </h3>
              <div className="space-y-2">
                {filteredRecommendations.length === 0 && (
                  <div className="text-quaternary-content/70 italic text-sm px-2 py-4 text-center animate-glassyPulse">
                    No recommendations found.
                  </div>
                )}
                {filteredRecommendations.map((user, idx) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-base-100/60 hover:bg-tertiary/10 transition-all duration-300 shadow-[0_1px_8px_rgba(0,0,0,0.04)] animate-slideIn"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`avatar relative ${
                          onlineUsers.includes(user._id) ? "online" : ""
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full border-2 border-quaternary/30 shadow">
                          <img
                            src={user.profilePic || "/avatar.png"}
                            alt="Profile"
                            className="rounded-full"
                          />
                        </div>
                        {onlineUsers.includes(user._id) && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-tertiary rounded-full ring-2 ring-base-100/70 animate-pulseGlow" />
                        )}
                      </div>
                      <span className="font-medium text-base-content group-hover:text-tertiary transition-colors">
                        {user.fullName}
                      </span>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={() => sendFriendRequest(user._id)}
                        className="btn btn-xs bg-success text-success-content rounded-full shadow hover:scale-110 hover:bg-success/80 transition-transform animate-glassyBounce group"
                        aria-label="Add friend"
                      >
                        <UserPlus2 size={15} className="text-success-content" />
                      </button>
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-0.5 rounded bg-success text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10">
                        Add friend
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;