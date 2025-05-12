import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  allFriendships: [],
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
      const friendsRes = await axiosInstance.get("/api/friendship/friends");
      set({ friends: friendsRes.data });

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
      const res = await axiosInstance.get(`api/messages/${userId}`);
      const messagesWithReactions = res.data.map((msg) => ({
        ...msg,
        reactions: msg.reactions || [],
        replyToId: msg.replyToId || null,
      }));
      // Fetch all users for reaction tooltips
      const usersRes = await axiosInstance.get("/api/messages/users");
      set({ messages: messagesWithReactions, users: usersRes.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const payload = {
        ...messageData,
      };
      const res = await axiosInstance.post(`api/messages/send/${selectedUser._id}`, payload);
      set({
        messages: [...messages, { ...res.data, reactions: res.data.reactions || [], replyToId: res.data.replyToId || null }],
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
      // Only add if the message is for the current chat
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set({
          messages: [...get().messages, { ...newMessage, reactions: newMessage.reactions || [], replyToId: newMessage.replyToId || null }],
        });
      }
    });

    socket.on("messageReaction", ({ messageId, emoji, userId }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                reactions: [
                  ...msg.reactions.filter((r) => r.userId !== userId),
                  { emoji, userId },
                ],
              }
            : msg
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageReaction");
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

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));