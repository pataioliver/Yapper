import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { UserPlus2, UserMinus2, UserCheck2, UserRoundX, ChevronLeft, UsersRound } from "lucide-react";

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
    setSelectedUser,
    selectedUser,
    isSidebarOpen,
    setSidebarOpen,
    isUsersLoading,
    allFriendships,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();

  // State for search query and online filter
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    fetchFriendshipData();

    // Automatically open the sidebar on small devices
    if (window.innerWidth < 768) {
      setSidebarOpen(true);
      setSelectedUser(null); // Ensure no chat is selected initially
    }
  }, [fetchFriendshipData, setSidebarOpen, setSelectedUser]);

  // Memoized filtered friends
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
  const filteredPendingRequests = useMemo(() => {
    return pendingRequests.filter((req) => {
      const matchesSearch = req.requester.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOnline = !showOnlineOnly || onlineUsers.includes(req.requester._id);

      return matchesSearch && matchesOnline;
    });
  }, [pendingRequests, searchQuery, showOnlineOnly, onlineUsers]);

  // Memoized filtered recommendations
  const filteredRecommendations = useMemo(() => {
    if (!authUser?._id) return [];
    return recommendations.filter((user) => {
      const hasAnyFriendship = allFriendships.some(
        (friendship) =>
          (friendship.requester._id === authUser._id && friendship.recipient._id === user._id) ||
          (friendship.recipient._id === authUser._id && friendship.requester._id === user._id)
      );

      const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOnline = !showOnlineOnly || onlineUsers.includes(user._id);

      return !hasAnyFriendship && matchesSearch && matchesOnline;
    });
  }, [recommendations, allFriendships, searchQuery, showOnlineOnly, onlineUsers, authUser?._id]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);

    // Collapse the sidebar on small devices
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Early return logic moved to conditional rendering
  const shouldShowSkeleton = !authUser?._id || isUsersLoading;

  return (
    <aside
      className={`h-full bg-base-100/10 backdrop-blur-2xl transition-all duration-500 ease-in-out ${isSidebarOpen ? "w-full lg:w-80 opacity-100" : "w-0 lg:w-0 opacity-0"
        } flex flex-col overflow-x-hidden rounded-tl-2xl shadow-[0_0_25px_rgba(255,255,255,0.15)]`}
    >
      {shouldShowSkeleton ? (
        <SidebarSkeleton />
      ) : (
        <>
          <div className="border-b border-quaternary/20 w-full p-3 flex justify-between items-center h-16 bg-base-200/15 backdrop-blur-2xl">
            <h2 className="font-semibold text-lg">
              <UsersRound className="inline-block mr-2" />
              Contacts
            </h2>
            {selectedUser && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2.5 bg-quaternary/15 rounded-full"
              >
                <ChevronLeft className="size-7 text-quaternary-content" />
              </button>
            )}
          </div>

          {/* Search Bar and Online Filter */}
          <div className="p-4 border-b border-quaternary/20">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full focus:ring-2 focus:ring-quaternary/50 focus:bg-base-100/15 backdrop-blur-2xl border-base-300/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-500"
            />
            <div className="mt-3 flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox checkbox-sm border-quaternary/50"
                />
                <span className="text-base text-base-content">Show online only</span>
              </label>
              <span className="text-sm text-quaternary/80">
                ({onlineUsers.length} online)
              </span>
            </div>
          </div>

          <div className="overflow-y-auto w-full py-3">
            {/* Pending Requests */}
            {filteredPendingRequests.length > 0 && (
              <div className="sidebar-section">
                <h3 className="font-semibold text-lg">Pending Requests</h3>
                {filteredPendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={req.requester.profilePic || "/avatar.png"}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{req.requester.fullName}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptFriendRequest(req._id)}
                        className="btn btn-sm btn-success"
                      >
                        <UserCheck2 size={16} />
                      </button>
                      <button
                        onClick={() => rejectFriendRequest(req._id)}
                        className="btn btn-sm btn-error"
                      >
                        <UserRoundX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <hr className="my-3 border-t border-gray-300" />
              </div>
            )}

            {/* Friends */}
            <div className="sidebar-section">
              <h3 className="font-semibold text-lg">Friends</h3>
              {filteredFriends.map((friend) => {
                const friendUser =
                  friend.requester._id === authUser._id ? friend.recipient : friend.requester;

                return (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => {
                      if (friendUser._id !== authUser._id) {
                        handleUserSelect(friendUser);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`avatar ${onlineUsers.includes(friendUser._id) ? "online" : ""
                          }`}
                      >
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={friendUser.profilePic || "/avatar.png"}
                            alt="Profile"
                          />
                        </div>
                      </div>
                      <span>{friendUser.fullName}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unfriend(friendUser._id);
                      }}
                      className="btn btn-sm btn-warning"
                    >
                      <UserMinus2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            <div className="sidebar-section">
              <hr className="my-3 border-t border-gray-300" />
              <h3 className="font-semibold text-lg">Recommendations</h3>
              {filteredRecommendations.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`avatar ${onlineUsers.includes(user._id) ? "online" : ""
                        }`}
                    >
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={user.profilePic || "/avatar.png"}
                          alt="Profile"
                        />
                      </div>
                    </div>
                    <span>{user.fullName}</span>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(user._id)}
                    className="btn btn-sm btn-primary"
                  >
                    <UserPlus2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;