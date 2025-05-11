import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  pendingRequests: [],
  recommendations: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSidebarOpen: window.innerWidth >= 1024,
  replyingTo: null,

  fetchFriendshipData: async () => {
    set({ isUsersLoading: true });
    try {
      // Fetch friends
      const friendsRes = await axiosInstance.get("/api/friendship/friends");
      set({ friends: friendsRes.data });

      // Fetch pending requests
      const pendingRes = await axiosInstance.get("/api/friendship/pending");
      set({ pendingRequests: pendingRes.data });

      // Fetch all users for recommendations
      const usersRes = await axiosInstance.get("/api/messages/users");
      const myUserId = get().selectedUser?._id;

      // Filter recommendations (not friends, not pending, not self)
      const friendIds = friendsRes.data.map((f) =>
        f.requester._id === myUserId ? f.recipient._id : f.requester._id
      );
      const pendingIds = pendingRes.data.map((p) => p.requester._id);
      const recommendations = usersRes.data.filter(
        (u) =>
          u._id !== myUserId &&
          !friendIds.includes(u._id) &&
          !pendingIds.includes(u._id)
      );

      set({ recommendations, users: usersRes.data });
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

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`api/messages/${userId}`);
      const messagesWithReactions = res.data.map((msg) => ({
        ...msg,
        reactions: msg.reactions || [],
        replyToId: msg.replyToId || null,
      }));
      set({ messages: messagesWithReactions });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, replyingTo } = get();
    try {
      const payload = {
        ...messageData,
        replyToId: replyingTo?._id || null,
      };
      const res = await axiosInstance.post(`api/messages/send/${selectedUser._id}`, payload);
      set({
        messages: [...messages, { ...res.data, reactions: [], replyToId: payload.replyToId }],
        replyingTo: null,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, { ...newMessage, reactions: [], replyToId: newMessage.replyToId || null }],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
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

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));