import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";
import { userAuthStore } from "./userAuth";

export const useChatStore = create((set, get) => ({
  messages:     [],
  users:        [],
  selectedUser: null,
  isUsersLoading:    false,
  isMessagesLoading: false,
  typingUsers: {},   // { [userId]: true }

  // ── Users ─────────────────────────────────────────────────────────
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  setSelectUser: (user) => {
    set({ selectedUser: user, typingUsers: {} });
  },

  // ── Messages ──────────────────────────────────────────────────────
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/${userId}`);
      set({ messages: res.data });
      // Mark all incoming messages from this user as read
      get().markAsRead(userId);
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
      // Update last message in users list
      get()._updateUserLastMessage(selectedUser._id, res.data, false);
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to send message");
    }
  },

  // ── Read receipts ─────────────────────────────────────────────────
  markAsRead: async (senderId) => {
    try {
      await axiosInstance.put(`/read/${senderId}`);
      // Update local message read flags
      set((state) => ({
        messages: state.messages.map((m) =>
          m.senderId === senderId ? { ...m, read: true } : m
        ),
        // Reset unread count for this sender in users list
        users: state.users.map((u) =>
          u._id === senderId ? { ...u, unreadCount: 0 } : u
        ),
      }));
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  },

  // ── Reactions ─────────────────────────────────────────────────────
  reactToMessage: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.post(`/react/${messageId}`, { emoji });
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? res.data : m
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to react");
    }
  },

  // ── Socket listeners ──────────────────────────────────────────────
  Listener: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = userAuthStore.getState().socket;

    // New incoming message
    socket.on("newMessage", (newMessage) => {
      const isFromSelected = newMessage.senderId === selectedUser._id;

      if (isFromSelected) {
        set({ messages: [...get().messages, newMessage] });
        // Auto-mark as read since the conversation is open
        get().markAsRead(selectedUser._id);
      }

      // Always update sidebar last message
      const isUnread = !isFromSelected;
      get()._updateUserLastMessage(newMessage.senderId, newMessage, isUnread);
    });

    // Sender is told their messages were read
    socket.on("messagesRead", ({ senderId, readerId }) => {
      const authUser = userAuthStore.getState().authUser;
      // If I am the sender, update my sent messages to read: true
      if (authUser._id === senderId) {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.recieverId === readerId ? { ...m, read: true } : m
          ),
        }));
      }
    });

    // Typing events
    socket.on("userTyping", ({ fromUserId }) => {
      if (fromUserId === selectedUser._id) {
        set((state) => ({ typingUsers: { ...state.typingUsers, [fromUserId]: true } }));
      }
    });

    socket.on("userStoppedTyping", ({ fromUserId }) => {
      set((state) => {
        const updated = { ...state.typingUsers };
        delete updated[fromUserId];
        return { typingUsers: updated };
      });
    });

    // Reaction updates
    socket.on("messageReacted", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m
        ),
      }));
    });
  },

  NotListener: () => {
    const socket = userAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messagesRead");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
    socket.off("messageReacted");
  },

  // ── Internal helper ───────────────────────────────────────────────
  _updateUserLastMessage: (userId, message, incrementUnread) => {
    set((state) => ({
      users: state.users.map((u) => {
        if (u._id !== userId) return u;
        return {
          ...u,
          lastMessage: message,
          unreadCount: incrementUnread
            ? (u.unreadCount || 0) + 1
            : u.unreadCount,
        };
      }),
    }));
  },
}));
