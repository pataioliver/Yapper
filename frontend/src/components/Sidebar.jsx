import { useState, useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  UsersRound,
  MessageCircle,
  Users,
  ChevronLeft,
  UserPlus2,
  Wifi,
  WifiOff,
  Plus,
  Search,
  UserRound,
  Sparkles,
  X,
  Check,
  UserMinus
} from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = ({ openProfileModal }) => {
  const {
    users,
    friends,
    recommendations,
    pendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    unfriend,
    selectedUser,
    setSelectedUser,
    selectedGroup,
    setSelectedGroup,
    groups,
    isSidebarOpen,
    setSidebarOpen,
    fetchFriendshipData,
    fetchGroups,
    sendFriendRequest,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();
  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    fetchFriendshipData();
    fetchGroups();

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchFriendshipData, fetchGroups, setSidebarOpen]);

  // Get all friend IDs to exclude from recommendations
  const friendIds = useMemo(() => {
    return friends.map(friendship => {
      return friendship.requester._id === authUser?._id
        ? friendship.recipient._id
        : friendship.requester._id;
    });
  }, [friends, authUser]);

  // Filter chats
  const filteredChats = useMemo(() => {
    return friends
      .map(friendship => {
        const friend = friendship.requester._id === authUser?._id
          ? friendship.recipient
          : friendship.requester;
        return friend;
      })
      .filter(friend => {
        if (!friend) return false;
        const nameMatches = friend?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        const onlineMatches = showOnlineOnly ? onlineUsers.includes(friend._id) : true;
        return nameMatches && onlineMatches;
      })
      .sort((a, b) => {
        const isAOnline = onlineUsers.includes(a._id);
        const isBOnline = onlineUsers.includes(b._id);
        if (isAOnline && !isBOnline) return -1;
        if (!isAOnline && isBOnline) return 1;
        return 0;
      });
  }, [friends, searchQuery, authUser, onlineUsers, showOnlineOnly]);

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter(group =>
      group?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  // Filter recommendations for "Users you may know"
  const filteredRecommendations = useMemo(() => {
    if (!users) return [];
    return users
      .filter(user =>
        user._id !== authUser?._id &&
        !friendIds.includes(user._id) &&
        user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [users, authUser, friendIds, searchQuery]);

  const handleSidebarClose = () => {
    if (selectedUser || selectedGroup) {
      setSidebarOpen(false);
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Helper to get the friendship object for a friend
  const getFriendshipByUserId = (userId) => {
    return friends.find(f =>
      (f.requester._id === userId && f.recipient._id === authUser?._id) ||
      (f.recipient._id === userId && f.requester._id === authUser?._id)
    );
  };

  return (
    <aside
      className={`w-full md:w-80 flex-shrink-0 border-r border-quaternary/10 overflow-hidden flex flex-col bg-base-100/80 backdrop-blur-xl rounded-tl-2xl rounded-bl-2xl shadow-[0_0_25px_rgba(255,255,255,0.08)] transition-transform duration-500 fixed z-30 top-0 left-0 h-full
        ${isSidebarOpen ? "translate-x-0 animate-glassySlideIn" : "-translate-x-full"}
      `}
      style={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08), 0 1.5px 8px 0 rgba(0,0,0,0.05)",
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        overflowX: "hidden", // <-- Prevent horizontal scroll
      }}
    >
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: (selectedUser || selectedGroup) ? '3.5rem' : '0',
          opacity: (selectedUser || selectedGroup) ? '1' : '0',
        }}
      >
        <div className="flex items-center justify-between p-3.5 border-b border-quaternary/20">
          <button
            onClick={handleSidebarClose}
            className="p-1.5 ml-0.5 bg-gradient-to-br from-quaternary to-secondary text-white rounded-full shadow hover:scale-105 hover:brightness-110 transition-all duration-300 border-2 border-quaternary flex items-center justify-center animate-glassyPop"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>
      </div>

      {/* Header & Search with Online Toggle */}
      <div className="p-4 border-b border-quaternary/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2 animate-bounceInScale">
            <UsersRound className="inline-block text-secondary" size={24} />
            <span className="drop-shadow">Chats</span>
          </h2>
          <div className="flex items-center">
            <button
              onClick={() => setShowOnlineOnly(prev => !prev)}
              className={`relative flex items-center rounded-full transition-all duration-300 ${showOnlineOnly
                ? "bg-tertiary text-tertiary-content"
                : "bg-base-200/80 text-base-content/60"
                } px-3 py-1 border border-quaternary/10 backdrop-blur-md animate-glassyPop`}
              style={{
                boxShadow: showOnlineOnly
                  ? "0 2px 10px rgba(100,200,150,0.2)"
                  : "0 2px 10px rgba(0,0,0,0.05)"
              }}
            >
              <span className={`${showOnlineOnly ? "text-tertiary-content" : "text-base-content/60"} text-xs font-medium mr-2`}>
                Online
              </span>
              <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${showOnlineOnly ? "bg-tertiary-content/30" : "bg-base-300/70"
                }`}>
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform duration-300 ${showOnlineOnly
                  ? "transform translate-x-4 bg-tertiary-content"
                  : "bg-base-content/40"
                  }`}></div>
              </div>
              <div className={`relative ml-2 size-2 rounded-full ${showOnlineOnly ? "bg-tertiary-content animate-pulse" : "hidden"
                }`}></div>
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quaternary-content/50" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-base-200/60 rounded-xl focus:outline-none animate-glassyPop input input-bordered shadow-[0_2px_16px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-quaternary/30 focus:bg-base-100/70 transition-all duration-300"
            style={{
              paddingLeft: "2.5rem",
              fontWeight: 500,
              borderColor: "rgba(255,255,255,0.15)",
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2.5 gap-2 border-b border-quaternary/10">
        <button
          className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2
            ${activeTab === "chats"
              ? "bg-secondary/20 text-secondary shadow-md"
              : "text-secondary-content/60 hover:bg-secondary/15 bg-secondary/10 hover:text-secondary"
            } backdrop-blur-md animate-glassyPop`}
          onClick={() => setActiveTab("chats")}
          style={{
            boxShadow: activeTab === "chats" ? "0 4px 12px rgba(80,120,200,0.15)" : "none",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <MessageCircle size={18} className={activeTab === "chats" ? "text-secondary" : "text-secondary-content/60"} />
          <span>Chats</span>
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 ml-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
            {filteredChats.length}
          </span>
        </button>
        <button
          className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2
            ${activeTab === "groups"
              ? "bg-secondary/20 text-secondary shadow-md"
              : "text-secondary-content/60 hover:bg-secondary/15 bg-secondary/10 hover:text-secondary"
            } backdrop-blur-md animate-glassyPop`}
          onClick={() => setActiveTab("groups")}
          style={{
            boxShadow: activeTab === "groups" ? "0 4px 12px rgba(80,120,200,0.15)" : "none",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <Users size={18} className={activeTab === "groups" ? "text-secondary" : "text-secondary-content/60"} />
          <span>Groups</span>
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 ml-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
            {filteredGroups.length}
          </span>
        </button>
      </div>

      {/* Content area */}
      <div className="overflow-y-auto flex-1 custom-scrollbar p-3" style={{ overflowX: "hidden" }}>
        {activeTab === "chats" && (
          <>
            {/* Pending Friend Requests */}
            {pendingRequests && pendingRequests.some(request => request.recipient._id === authUser?._id) && (
              <div className="mb-4">
                <div className="text-xs text-quaternary-content/80 px-1 flex items-center gap-1 mb-2">
                  <UserPlus2 size={14} className="opacity-70" />
                  <span>Pending Friend Requests</span>
                </div>
                <div className="space-y-2">
                  {pendingRequests
                    .filter(request => request.recipient._id === authUser?._id)
                    .map(request => (
                      <div
                        key={request._id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-base-200/60 border border-quaternary/10 animate-glassyPop"
                      >
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-base-300">
                            <img
                              src={request.requester.profilePicture || "/avatar.png"}
                              alt={request.requester.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <span className="flex-1 truncate text-xs font-medium">{request.requester.fullName}</span>
                        <button
                          className="btn btn-xs btn-success rounded-full px-2 py-1 flex items-center"
                          title="Accept"
                          onClick={() => acceptFriendRequest(request._id)}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="btn btn-xs btn-error rounded-full px-2 py-1 flex items-center"
                          title="Reject"
                          onClick={() => rejectFriendRequest(request._id)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Friends/Chats list */}
            <div className="mt-2 mb-2 text-xs text-quaternary-content/80 px-1 flex items-center gap-1">
              <MessageCircle size={14} className="opacity-70" />
              <span>Your Conversations</span>
            </div>
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 text-quaternary-content/60 mb-4">
                <UsersRound size={32} className="mb-2 opacity-60" />
                <p>{searchQuery ? "No chats match your search" : (showOnlineOnly ? "No friends online" : "No chats yet")}</p>
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {filteredChats.map(chat => (
                  <div
                    key={chat._id}
                    className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${selectedUser && selectedUser._id === chat._id
                      ? "bg-secondary/30 shadow-lg border-secondary/40"
                      : "hover:bg-base-200/60 bg-base-200/30"
                      } animate-glassyPop backdrop-blur-md border border-quaternary/10 flex items-center`}
                    style={{
                      boxShadow: selectedUser && selectedUser._id === chat._id
                        ? "0 8px 20px rgba(0,100,255,0.12)"
                        : "0 4px 12px rgba(0,0,0,0.05)",
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                  >
                    <div
                      className="flex items-center gap-3 flex-1"
                      onClick={() => handleUserSelect(chat)}
                    >
                      <div className="avatar relative">
                        <div className="w-12 h-12 rounded-full border-2 border-quaternary/20 shadow-md overflow-hidden bg-base-300">
                          {chat.profilePicture || chat.profilePic ? (
                            <img
                              src={chat.profilePicture || chat.profilePic}
                              alt={chat.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="/avatar.png"
                              alt={chat.fullName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {onlineUsers.includes(chat._id) && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary rounded-full border-2 border-base-100 shadow-md animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base-content">{chat.fullName}</h4>
                        <p className="text-xs flex items-center gap-1">
                          {onlineUsers.includes(chat._id) ? (
                            <>
                              <Wifi className="inline-block text-green-500" size={12} />
                              <span className="text-green-500">Online</span>
                            </>
                          ) : (
                            <>
                              <WifiOff className="inline-block text-gray-400" size={12} />
                              <span className="text-gray-400">Offline</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {/* Unfriend button with tooltip */}
                    <div className="relative group ml-2">
                      <button
                        className="btn btn-xs btn-outline btn-error rounded-full px-2 py-1 flex items-center"
                        title="Remove Friend"
                        onClick={e => {
                          e.stopPropagation();
                          const friendship = getFriendshipByUserId(chat._id);
                          if (friendship) unfriend(friendship._id);
                        }}
                        tabIndex={0}
                        type="button"
                      >
                        <UserMinus size={16} />
                      </button>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                        <span className="bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                          Remove friend
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users you may know section with toggle */}
            <div className="mt-4 border-t border-quaternary/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center text-quaternary">
                  <Sparkles size={16} className="mr-2 text-quaternary" />
                  <span>Users you may know</span>
                </h3>
                <button
                  onClick={() => setShowRecommendations(prev => !prev)}
                  className={`text-xs px-2 py-1 rounded-full transition-all duration-200 
                    ${showRecommendations
                      ? "bg-secondary/20 text-secondary border border-secondary/30"
                      : "bg-base-200/80 text-base-content/60 border border-base-content/10"}`}
                >
                  {showRecommendations ? "Hide" : "Show"}
                </button>
              </div>

              {showRecommendations && filteredRecommendations.length > 0 && (
                <div className="flex gap-2 pb-2 overflow-x-auto custom-scrollbar">
                  {filteredRecommendations.slice(0, 6).map(user => (
                    <div
                      key={user._id}
                      className="flex flex-col items-center min-w-[100px] p-2 rounded-xl bg-base-200/30 border border-quaternary/10 animate-glassyPop hover:bg-base-200/50 hover:scale-105 transition-all"
                      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}
                    >
                      <div className="avatar mb-2">
                        <div className="w-12 h-12 rounded-full border-2 border-quaternary/20 overflow-hidden bg-base-300">
                          {/* Fixed profile picture display - check both profilePicture and profilePic properties */}
                          {user.profilePicture || user.profilePic ? (
                            <img
                              src={user.profilePicture || user.profilePic}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="/avatar.png"
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      <div className="text-center mb-2">
                        <div className="text-xs font-medium truncate max-w-[90px]">
                          {user.fullName}
                        </div>
                        <p className="text-xs text-quaternary-content/70 flex items-center gap-1 mt-0.5">
                          {onlineUsers.includes(user._id) ? (
                            <span className="text-green-500 text-[10px]">Online</span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">Offline</span>
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() => sendFriendRequest(user._id)}
                        className="p-1.5 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-secondary transition-all w-full text-xs flex items-center justify-center gap-1"
                      >
                        <UserPlus2 size={12} />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "groups" && (
          <>
            {/* Create Group Button */}
            <div
              className="mb-3 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] bg-secondary/20 border border-secondary/30 flex items-center gap-3 animate-glassyPop backdrop-blur-md"
              onClick={() => openProfileModal("group")}
              style={{
                boxShadow: "0 4px 12px rgba(0,100,255,0.1)",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary/30 text-secondary border-2 border-secondary/20">
                <Plus size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-secondary">Create New Group</h4>
                <p className="text-xs text-secondary-content/70">Start a conversation with friends</p>
              </div>
            </div>

            {/* Groups List */}
            {filteredGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-quaternary-content/60">
                <Users size={36} className="mb-2 opacity-60" />
                <p>{searchQuery ? "No groups match your search" : "No groups yet"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGroups.map(group => (
                  <div
                    key={group._id}
                    className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${selectedGroup && selectedGroup._id === group._id
                      ? "bg-secondary/30 shadow-lg border-secondary/40"
                      : "hover:bg-base-200/60 bg-base-200/30"
                      } animate-glassyPop backdrop-blur-md border border-quaternary/10`}
                    style={{
                      boxShadow: selectedGroup && selectedGroup._id === group._id
                        ? "0 8px 20px rgba(0,100,255,0.12)"
                        : "0 4px 12px rgba(0,0,0,0.05)",
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                    onClick={() => handleGroupSelect(group)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full border-2 border-quaternary/20 shadow-md overflow-hidden bg-base-300">
                          {/* Fixed avatar display for groups */}
                          {group.avatar ? (
                            <img
                              src={group.avatar}
                              alt={group.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-semibold bg-gradient-to-br from-tertiary to-quaternary text-white rounded-full">
                              {group.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base-content">{group.name}</h4>
                        <p className="text-xs text-quaternary-content/80 flex items-center gap-1">
                          <Users size={12} className="opacity-70" />
                          <span>{group.members?.length || 0} members</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* User profile footer */}
      {authUser && (
        <div className="p-5 border-t border-quaternary/10 bg-base-200/100 backdrop-blur-md">
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full border-2 border-quaternary/20 overflow-hidden bg-base-300">
                {/* Fixed profile picture display for current user */}
                {authUser.profilePicture || authUser.profilePic ? (
                  <img
                    src={authUser.profilePicture || authUser.profilePic}
                    alt={authUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/avatar.png"
                    alt={authUser.fullName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <h4 className="font-medium text-base-content truncate max-w-[180px]">
                {authUser.fullName}
              </h4>
              <p className="text-xs flex items-center gap-0.5">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-green-500">Online</span>
              </p>
            </div>
            <button
              onClick={() => openProfileModal("user", authUser)}
              className="size-8 flex items-center justify-center rounded-full text-base-content/70 hover:bg-base-200 transition-all hover:text-secondary"
            >
              <UserRound size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;