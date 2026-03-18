import { create } from "zustand"
import { axiosInstance } from '../lib/axios'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface User {
  _id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean

  signupLoading: boolean
  signinLoading: boolean
  checkAuthLoading: boolean
  logoutLoading: boolean

  signup: (data: { name: string; email: string; password: string }) => Promise<void>
  signin: (data: { email: string; password: string }) => Promise<void>
  checkAuth: () => Promise<void>
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  signupLoading: false,
  signinLoading: false,
  checkAuthLoading: true,
  logoutLoading: false,

  signup: async (data) => {
    try {
      set({ signupLoading: true })

      const res = await axiosInstance.post("/user/signup", data)

      set({
        user: res.data.user,
        isAuthenticated: true,
      })
      toast.success("Account created Successfully")
    } catch (error: any) {
      console.error(error.response?.data?.message || "Signup failed")
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message as string);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ signupLoading: false })
    }
  },

  signin: async (data) => {
    try {
      set({ signinLoading: true })

      const res = await axiosInstance.post("/user/signin", data)

      set({
        user: res.data.user,
        isAuthenticated: true,
      })
      toast.success("Signed In Successfully")
    } catch (error: any) {
      console.error(error.response?.data?.message || "Signin failed")
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message as string);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ signinLoading: false })
    }
  },

  checkAuth: async () => {
    try {
      set({ checkAuthLoading: true })

      const res = await axiosInstance.get("/user/check")

      set({
        user: res.data.user,
        isAuthenticated: true,
      })
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
      })
    } finally {
      set({ checkAuthLoading: false })
    }
  },
  
  logout: async () => {
    try {
      set({ logoutLoading: true })

      await axiosInstance.get("/user/logout")

      set({
        user: null,
        isAuthenticated: false
      })
      toast.success("Logged out successfully")
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message as string);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ logoutLoading: false })
    }
  }
}))