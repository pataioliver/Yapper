import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  groups: [],
  allFriendships: [],
  pendingRequests: [],
  recommendations: [],
  selectedChat: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSidebarOpen: window.innerWidth >= 1024,
  replyingTo: null,


  fetchFriendshipData: async () => {
    set({ isUsersLoading: true });
    try {
      // Fetch friends (friendship objects)
      const friendsRes = await axiosInstance.get("/api/friendship/friends");
      // Fetch all users for recommendations and to get full user data
      const usersRes = await axiosInstance.get("/api/messages/users");
      const allUsers = usersRes.data;

      // Get current user ID
      const authUser = useAuthStore.getState().authUser;
      const myUserId = authUser?._id;

      // Map friendships to actual friend user objects
      const friends = friendsRes.data
        .map(f => {
          // Find the friend user ID (not yourself)
          const friendId = f.requester._id === myUserId ? f.recipient._id : f.requester._id;
          // Find the full user object from allUsers
          return allUsers.find(u => u._id === friendId);
        })
        .filter(Boolean); // Remove any undefined (in case user not found)

      set({ friends });

      // Fetch all friendships
      const allFriendshipsRes = await axiosInstance.get("/api/friendship/all");
      set({ allFriendships: allFriendshipsRes.data });

      // Fetch pending requests
      const pendingRes = await axiosInstance.get("/api/friendship/pending");
      set({ pendingRequests: pendingRes.data });

      // Filter recommendations (not friends, not pending, not self)
      const friendIds = friends.map(f => f._id);
      const pendingIds = pendingRes.data.map((p) => p.requester._id);
      const recommendations = allUsers.filter(
        (u) =>
          u._id !== myUserId &&
          !friendIds.includes(u._id) &&
          !pendingIds.includes(u._id)
      );

      set({ recommendations, users: allUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      set({ isUsersLoading: false });
    }
  },


  // Accept a friend request
  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post("/api/friendship/accept", { requestId });
      toast.success("Friend request accepted!");
      get().fetchFriendshipData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  },

  // Reject a friend request
  rejectFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post("/api/friendship/reject", { requestId });
      toast.success("Friend request rejected!");
      get().fetchFriendshipData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  },

  // Send a friend request
  sendFriendRequest: async (recipientId) => {
    try {
      await axiosInstance.post("/api/friendship/request", { recipientId });
      toast.success("Friend request sent!");
      get().fetchFriendshipData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  // Unfriend a user
  unfriend: async (friendId) => {
    try {
      await axiosInstance.post("/api/friendship/unfriend", { friendId });
      toast.success("Unfriended successfully!");
      get().fetchFriendshipData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unfriend");
    }
  },

  getMessages: async () => {
    set({ isMessagesLoading: true });
    try {
      const { selectedChat } = get();
      let res;

      if (selectedChat?.type === "group") {
        // Fetch group messages
        res = await axiosInstance.get(`/api/groups/${selectedChat.group._id}/messages`);
      } else if (selectedChat?.type === "user") {
        // Fetch DM messages
        res = await axiosInstance.get(`/api/messages/${selectedChat.user._id}`);
      } else {
        set({ messages: [] });
        set({ isMessagesLoading: false });
        return;
      }

      const messagesWithReactions = res.data.map((msg) => ({
        ...msg,
        reactions: msg.reactions || [],
        replyToId: msg.replyToId || null,
      }));
      set({ messages: messagesWithReactions });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedChat, messages, replyingTo } = get();
    const socket = useAuthStore.getState().socket;
    try {
      const payload = {
        ...messageData,
        replyToId: replyingTo?._id || null,
      };

      let res;
      if (selectedChat?.type === "group") {
        // Send to group endpoint (HTTP)
        res = await axiosInstance.post(
          `/api/groups/${selectedChat.group._id}/messages`,
          payload
        );
        // Emit via socket for real-time update
        if (socket) {
          socket.emit("sendGroupMessage", {
            roomId: selectedChat.group._id,
            message: res.data,
          });
        }
      } else if (selectedChat?.type === "user") {
        // Send to DM endpoint (HTTP)
        res = await axiosInstance.post(
          `/api/messages/send/${selectedChat.user._id}`,
          payload
        );
        // Emit via socket for real-time update
        if (socket) {
          socket.emit("sendDirectMessage", {
            toUserId: selectedChat.user._id,
            message: res.data,
          });
        }
      } else {
        throw new Error("No chat selected");
      }

      set({
        messages: [...messages, { ...res.data, reactions: [], replyToId: payload.replyToId }],
        replyingTo: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedChat, unsubscribeFromMessages } = get();
    if (!selectedChat) return;

    // Unsubscribe from previous subscriptions
    unsubscribeFromMessages();

    const socket = useAuthStore.getState().socket;

    // Handler for group messages
    const handleGroupMessage = (newMessage) => {
      if (
        selectedChat.type === "group" &&
        newMessage.groupId === selectedChat.group._id
      ) {
        const currentMessages = get().messages;
        // Only add if not already present
        if (!currentMessages.some(msg => msg._id === newMessage._id)) {
          set({
            messages: [
              ...currentMessages,
              { ...newMessage, reactions: [], replyToId: newMessage.replyToId || null },
            ],
          });
        }
      }
    };

    const handleDirectMessage = (newMessage) => {
      if (
        selectedChat.type === "user" &&
        (
          newMessage.senderId === selectedChat.user._id ||
          newMessage.receiverId === selectedChat.user._id
        )
      ) {
        const currentMessages = get().messages;
        // Only add if not already present
        if (!currentMessages.some(msg => msg._id === newMessage._id)) {
          set({
            messages: [
              ...currentMessages,
              { ...newMessage, reactions: [], replyToId: newMessage.replyToId || null },
            ],
          });
        }
      }
    };

    socket.on("newGroupMessage", handleGroupMessage);
    socket.on("newDirectMessage", handleDirectMessage);

    // Save handlers for cleanup
    set({ _groupMsgHandler: handleGroupMessage, _directMsgHandler: handleDirectMessage });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { _groupMsgHandler, _directMsgHandler } = get();
    if (_groupMsgHandler) socket.off("newGroupMessage", _groupMsgHandler);
    if (_directMsgHandler) socket.off("newDirectMessage", _directMsgHandler);
    set({ _groupMsgHandler: null, _directMsgHandler: null });
  },

  addReaction: (messageId, reaction) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId
          ? {
            ...msg,
            reactions: [
              ...msg.reactions.filter(
                (r) => !(r.label === reaction.label && r.userId === reaction.userId)
              ),
              reaction,
            ],
          }
          : msg
      ),
    }));
  },

  setReplyingTo: (message) => set({ replyingTo: message }),

  setselectedChat: (chat) => {
    // If already has a type, just use it
    if (chat?.type) return set({ selectedChat: chat });

    // If it has a 'user' property, it's a DM
    if (chat?.user) {
      return set({ selectedChat: { ...chat, type: "user" } });
    }

    // If it has a 'group' property, it's a group chat
    if (chat?.group) {
      return set({ selectedChat: { ...chat, type: "group" } });
    }

    // If it's a plain user object
    if (chat?.fullName && chat?._id) {
      return set({ selectedChat: { user: chat, type: "user", _id: chat._id } });
    }

    // If it's a plain group object
    if (chat?.name && chat?.members) {
      return set({ selectedChat: { group: chat, type: "group", _id: chat._id } });
    }

    // Fallback
    set({ selectedChat: null });
  },
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  createGroup: async ({ name, members }) => {
    try {
      const res = await axiosInstance.post("/api/groups", { name, members });
      toast.success("Group created!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      throw error;
    }
  },

  fetchGroups: async () => {
    try {
      const res = await axiosInstance.get("/api/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error("Failed to fetch groups");
    }
  },
}));