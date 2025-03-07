
import { create } from 'zustand'
import { axiosInstance } from '../libs/axios.js'
import toast from "react-hot-toast";

export const userAuthStore = create((set) => (
    {
        authUser: null,
        isLogged: false,
        isSignup: false,
        isUpdate: false,
        isCheckingAuth: true,
        checkAuth: async () => {
            try {
                const res = await axiosInstance.get('/check')
                console.log('checked')
                set({ authUser: res.data })
            } catch (error) {
                set({ authUser: null })
                console.log(error.response.data.message)
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
                // setTimeout(() => {
                //     navigate("/", { replace: true });

                // }, 1000)


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
                // get().disconnectSocket();
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

                //   get().connectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                set({ isLogged: false });
            }
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
