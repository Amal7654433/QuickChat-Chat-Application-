
import { create } from 'zustand'
import { axiosInstance } from '../libs/axios.js'
import toast from "react-hot-toast";
import { io } from "socket.io-client";
// const BASE_URL = "http://localhost:5001"
const BASE_URL =import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"
export const userAuthStore = create((set,get) => (
    {
        authUser: null,
        isLogged: false,
        isSignup: false,
        isUpdate: false,
        isCheckingAuth: true,
        socket: null,
        onlineUsers: [],
        checkAuth: async () => {
            try {
                const res = await axiosInstance.get('/check')
                set({ authUser: res.data })
                get().connectSocket()
            } catch (error) {
                set({ authUser: null })
                if (error.response && error.response.data) {
                    console.log(error.response.data.message); // Show backend error message
                } else {
                    console.log("Something went wrong. Please try again.");
                }
            }
            finally {
                set({ isCheckingAuth: false })
            }
        },
        signup: async (data, navigate) => {
            set({ isSignup: true })
            try {
                const res = await axiosInstance.post('/signup', data)

                set({ authUser: res.data.newUser });
                toast.success(res.data.message)
                get().connectSocket()
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message); // Show backend error message
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            }
            finally {
                set({ isSignup: false })
            }
        },
        logout: async () => {
            try {
                await axiosInstance.post("/logout");
                set({ authUser: null });
                toast.success("Logged out successfully");
                get().disconnectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        },
        login: async (data) => {
            set({ isLogged: true });
            try {
                const res = await axiosInstance.post("/login", data);
                set({ authUser: res.data.user });
                toast.success("Logged in successfully");

                get().connectSocket();
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message); // Show backend error message
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } finally {
                set({ isLogged: false });
            }
        },
        connectSocket: () => {
            try {
                const { authUser } = get();
                if (!authUser || get().socket?.connected) return;

                const socket = io(BASE_URL, {
                      query: {
                        userId: authUser._id,
                      },
                });
                socket.connect();

                set({ socket: socket });

                socket.on("getOnlineUsers", (userIds) => {
                  set({ onlineUsers: userIds });
                });

            } catch (error) {
                console.log('error happend', error)
            }

        },
        disconnectSocket: () => {
            if (get().socket?.connected) get().socket.disconnect();
          
        },
        updateProfile: async (data) => {
            set({ isUpdate: true });
            try {
                const res = await axiosInstance.put("/update", data);
                set({ authUser: res.data });
                toast.success("Profile updated successfully");
            } catch (error) {
                console.log("error in update profile:", error);
                if (error.response && error.response.data) { toast.error(error.response.data.message); }

            } finally {
                set({ isUpdate: false });
            }
        }
    }))
