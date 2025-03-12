import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";
import { userAuthStore } from "./userAuth";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users");

      set({ users: res.data });
    } catch (error) {

      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  setSelectUser: async (user) => {
    set({ selectedUser: user })
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/${userId}`);
      set({ messages: res.data });

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {

      const res = await axiosInstance.post(`send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  Listener: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = userAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  NotListener: () => {
    const socket = userAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));