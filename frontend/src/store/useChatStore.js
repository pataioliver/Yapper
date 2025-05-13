import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// Add these at the top-level (outside the store) to keep references for cleanup:
const groupMessageHandlers = {};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  allFriendships: [],
  pendingRequests: [],
  recommendations: [],
  selectedUser: null,
  selectedGroup: null,
  groups: [],
  groupMessages: {},
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupsLoading: false,
  isSidebarOpen: true, // Sidebar open by default on all screens
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
      console.error("Error fetching friendship data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post("/api/friendship/accept", { requestId });
      await get().fetchFriendshipData();
      toast.success("Friend request accepted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post("/api/friendship/reject", { requestId });
      await get().fetchFriendshipData();
      toast.success("Friend request rejected");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  },

  sendFriendRequest: async (recipientId) => {
    try {
      await axiosInstance.post("/api/friendship/request", { recipientId });
      await get().fetchFriendshipData();
      toast.success("Friend request sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  unfriend: async (friendshipId) => {
    try {
      await axiosInstance.post("/api/friendship/unfriend", { friendshipId });
      toast.success("Friend removed");
      await get().fetchFriendshipData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    const requestedUserId = userId; // Store current request userId
    
    try {
      const res = await axiosInstance.get(`/api/messages/${userId}`);
      // Only update if the requested user is still the selected user
      if (requestedUserId === get().selectedUser?._id) {
        set({ messages: res.data });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      // Only update loading state if this is still the current user
      if (requestedUserId === get().selectedUser?._id) {
        set({ isMessagesLoading: false });
      }
    }
  },

  // FIXED: Fixed incorrect endpoint in sendMessage function
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser?._id) {
      toast.error("No recipient selected");
      return null;
    }

    try {
      // Fixed API endpoint to match backend route
      const res = await axiosInstance.post(
        `/api/messages/${selectedUser._id}`,
        messageData
      );
      
      set({
        messages: [...get().messages, res.data],
        replyingTo: null,
      });
      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
      return null;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { messages, selectedUser } = get();
      // Only update if the message is from the currently selected user
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.recipientId === selectedUser._id
      ) {
        set({ messages: [...messages, newMessage] });
      }
    });

    socket.on("messageReaction", ({ messageId, emoji, userId }) => {
      const { messages } = get();
      const updatedMessages = messages.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, userId }],
            }
          : msg
      );
      set({ messages: updatedMessages });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageReaction");
  },

  addReaction: async (messageId, reaction) => {
    try {
      // FIXED: Corrected API endpoint for reactions
      await axiosInstance.post(`/api/messages/${messageId}/reactions`, {
        emoji: reaction.emoji,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reaction");
    }
  },

  // Group-related functions
  fetchGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/api/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
      await axiosInstance.post("/api/groups", groupData);
      await get().fetchGroups();
      toast.success("Group created successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      return false;
    }
  },

  removeGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/api/groups/${groupId}`);
      await get().fetchGroups();
      toast.success("Group deleted");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete group");
      return false;
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    const requestedGroupId = groupId; // Store current request groupId
    
    try {
      const res = await axiosInstance.get(`/api/groups/${groupId}/messages`);
      // Only update if the requested group is still the selected group
      if (requestedGroupId === get().selectedGroup?._id) {
        const updatedGroupMessages = {
          ...get().groupMessages,
          [groupId]: res.data,
        };
        set({ groupMessages: updatedGroupMessages });
      }
    } catch (error) {
      console.error("Error fetching group messages:", error);
      toast.error(error.response?.data?.message || "Failed to fetch group messages");
    } finally {
      // Only update loading state if this is still the current group
      if (requestedGroupId === get().selectedGroup?._id) {
        set({ isMessagesLoading: false });
      }
    }
  },

  // FIXED: Corrected sendGroupMessage function
  sendGroupMessage: async (groupId, messageData) => {
    if (!groupId) {
      toast.error("No group selected");
      return null;
    }

    try {
      const res = await axiosInstance.post(
        `/api/groups/${groupId}/messages`,
        messageData
      );
      
      const currentMessages = get().groupMessages[groupId] || [];
      
      // Add an "isFromCurrentUser" flag to identify messages sent by this client
      // This will help us avoid duplication with socket events
      const messageWithFlag = {
        ...res.data,
        _isFromCurrentClient: true
      };
      
      set({
        groupMessages: {
          ...get().groupMessages,
          [groupId]: [...currentMessages, messageWithFlag],
        },
        replyingTo: null,
      });
      
      return res.data;
    } catch (error) {
      console.error("Error sending group message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
      return null;
    }
  },

  // FIXED: Corrected API endpoint for group reactions
  addGroupReaction: async (messageId, reaction) => {
    try {
      await axiosInstance.post(`/api/groups/messages/${messageId}/reactions`, {
        emoji: reaction.emoji,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reaction");
    }
  },

  subscribeToGroupMessages: (groupId) => {
    if (!groupId) return;
    
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    
    // Join the group room
    socket.emit("join", { roomId: groupId });
    
    // If we already have handlers for this group, clean them up first
    if (groupMessageHandlers[groupId]) {
      socket.off("newGroupMessage", groupMessageHandlers[groupId].newGroupMessage);
      socket.off("groupMessageReaction", groupMessageHandlers[groupId].groupMessageReaction);
    }
    
    // Create new handlers
    const newGroupMessageHandler = (message) => {
      if (message.groupId !== groupId) return;
      
      const currentMessages = get().groupMessages[groupId] || [];
      
      // Enhanced duplicate detection
      const isDuplicate = currentMessages.some(msg => 
        msg._id === message._id || 
        (msg.senderId._id === message.senderId._id && 
         msg.text === message.text && 
         Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 5000)
      );
      
      if (isDuplicate) return;
      
      set({
        groupMessages: {
          ...get().groupMessages,
          [groupId]: [...currentMessages, message],
        },
      });
    };
    
    const groupMessageReactionHandler = ({ messageId, emoji, userId }) => {
      const currentMessages = get().groupMessages[groupId] || [];
      const updatedMessages = currentMessages.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, userId }],
            }
          : msg
      );
      set({
        groupMessages: {
          ...get().groupMessages,
          [groupId]: updatedMessages,
        },
      });
    };

    // Store handlers for cleanup
    groupMessageHandlers[groupId] = {
      newGroupMessage: newGroupMessageHandler,
      groupMessageReaction: groupMessageReactionHandler,
    };

    socket.on("newGroupMessage", newGroupMessageHandler);
    socket.on("groupMessageReaction", groupMessageReactionHandler);
    socket.emit("join", { roomId: groupId });
  },

  unsubscribeFromGroupMessages: (groupId) => {
    if (!groupId) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    
    // Ensure we leave the room
    socket.emit("leave", { roomId: groupId });

    // Remove handlers for this specific group
    if (groupMessageHandlers[groupId]) {
      socket.off("newGroupMessage", groupMessageHandlers[groupId].newGroupMessage);
      socket.off("groupMessageReaction", groupMessageHandlers[groupId].groupMessageReaction);
      delete groupMessageHandlers[groupId];
      
      console.log(`Unsubscribed from group: ${groupId}`);
    }
  },

  setReplyingTo: (message) => set({ replyingTo: message }),

  // FIXED: Corrected user and group selection functions
  setSelectedUser: (user) => {
    if (!user) {
      set({ selectedUser: null });
      return;
    }
    
    // Get the actual user object from friendship
    const actualUser = user.requester && user.recipient 
      ? (user.requester._id === useAuthStore.getState().authUser._id ? user.recipient : user.requester)
      : user;
    
    // Clear messages when changing users to avoid showing stale data
    set({ 
      selectedUser: actualUser, 
      selectedGroup: null, // Clear any selected group
      messages: [] // Clear messages to avoid showing previous messages during loading
    });
    
    // If user is valid, fetch their messages right away
    if (actualUser && actualUser._id) {
      get().getMessages(actualUser._id);
    }
  },

  setSelectedGroup: (group) => {
    if (!group) {
      set({ selectedGroup: null });
      return;
    }
    
    // Clear when changing groups to avoid showing stale data 
    set({ 
      selectedGroup: group, 
      selectedUser: null, // Clear any selected user
    });
    
    // If group is valid, fetch messages right away
    if (group && group._id) {
      get().getGroupMessages(group._id);
    }
  },
  
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  refreshGroupData: async (groupId) => {
    try {
      const res = await axiosInstance.get(`/api/groups/${groupId}`);
      
      // Update the group in the groups array
      const updatedGroups = get().groups.map(g => 
        g._id === groupId ? res.data : g
      );
      
      set({ groups: updatedGroups });
      
      // If this is the currently selected group, update that too
      if (get().selectedGroup?._id === groupId) {
        set({ selectedGroup: res.data });
      }
      
      return res.data;
    } catch (error) {
      console.error("Failed to refresh group data:", error);
      toast.error("Failed to update group information");
      return null;
    }
  }
}));