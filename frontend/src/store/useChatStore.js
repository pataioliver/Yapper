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
      set({ friends: friendsRes.data });

      // Fetch all friendships
      const allFriendshipsRes = await axiosInstance.get("/api/friendship/all");
      set({ allFriendships: allFriendshipsRes.data });

      const pendingRes = await axiosInstance.get("/api/friendship/pending");
      set({ pendingRequests: pendingRes.data });

      const usersRes = await axiosInstance.get("/api/messages/users");

      const authUser = useAuthStore.getState().authUser;
      const myUserId = authUser?._id;

      const friendIds = friendsRes.data.map((f) =>
        f.requester._id === myUserId ? f.recipient._id : f.requester._id
      );
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

  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post("/api/friendship/accept", { requestId });
      toast.success("Friend request accepted!");
      get().fetchFriendshipData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post("/api/friendship/reject", { requestId });
      toast.success("Friend request rejected!");
      get().fetchFriendshipData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  },

  sendFriendRequest: async (recipientId) => {
    try {
      await axiosInstance.post("/api/friendship/request", { recipientId });
      toast.success("Friend request sent!");
      get().fetchFriendshipData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  unfriend: async (friendId) => {
    try {
      await axiosInstance.post("/api/friendship/unfriend", { friendId });
      toast.success("Unfriended successfully!");
      get().fetchFriendshipData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unfriend");
    }
  },

   getMessages: async (userId) => {
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
      // Fetch all users for reaction tooltips
      const usersRes = await axiosInstance.get("/api/messages/users");
      set({ messages: messagesWithReactions, users: usersRes.data });
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
        messages: [...messages, { ...res.data, reactions: res.data.reactions || [], replyToId: res.data.replyToId || null }],
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

  addReaction: async (messageId, reaction) => {
    try {
      await axiosInstance.post(`/api/messages/${messageId}/reactions`, { emoji: reaction.emoji });
      // The socket event will update the UI in real time
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add reaction");
    }
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