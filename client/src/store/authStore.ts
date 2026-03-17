import { create } from "zustand"
import { axiosInstance } from '../lib/axios'

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

  signup: (data: { name: string; email: string; password: string }) => Promise<void>
  signin: (data: { email: string; password: string }) => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  signupLoading: false,
  signinLoading: false,
  checkAuthLoading: false,

  signup: async (data) => {
    try {
      set({ signupLoading: true })

      const res = await axiosInstance.post("/user/signup", data)

      set({
        user: res.data.user,
        isAuthenticated: true,
      })
    } catch (error: any) {
      console.error(error.response?.data?.message || "Signup failed")
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
    } catch (error: any) {
      console.error(error.response?.data?.message || "Signin failed")
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
}))