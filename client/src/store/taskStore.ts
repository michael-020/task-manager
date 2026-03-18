import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface Task {
  _id: string
  title: string
  description: string
  status: "pending" | "completed"
  dueDate?: string
}

interface TaskState {
  tasks: Task[]
  loading: boolean
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  totalPages: number
  currentPage: number
  totalTasks: number,
  completedTasks: number,
  pendingTasks: number,

  fetchTasks: (page?: number) => Promise<void>
  createTask: (data: { title: string; description: string; dueDate?: string }) => Promise<void>
  toggleTask: (id: string, status: "pending" | "completed") => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateTask: (id: string, data: { title: string; description: string; dueDate?: string }) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  totalPages: 0,
  currentPage: 1,
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,

  fetchTasks: async (page = 1) => {
    try {
      set({ loading: true })
      const res = await axiosInstance.get(`/task?page=${page}&limit=5`)

      set({
        tasks: res.data.tasks,
        totalPages: res.data.totalPages,
        currentPage: res.data.page,
        totalTasks: res.data.totalTasks,
        completedTasks: res.data.completedTasks,
        pendingTasks: res.data.pendingTasks,
      })
    } finally {
      set({ loading: false })
    }
  },

  createTask: async (data) => {
    try {
      set({ createLoading: true })
      await axiosInstance.post("/task", data)
      await get().fetchTasks(1)
      toast.success("Task Created")
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message as string);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ createLoading: false })
    }
  },

  toggleTask: async (id, status) => {
    const res = await axiosInstance.put(`/task/${id}`, { status })
    set({
      tasks: get().tasks.map((t) =>
        t._id === id ? res.data : t
      ),
    })
  },

  deleteTask: async (id) => {
    try {
      set({ deleteLoading: true })
      await axiosInstance.delete(`/task/${id}`)
      
      const { tasks, currentPage } = get()

      if (tasks.length === 1 && currentPage > 1) {
        await get().fetchTasks(currentPage - 1)
      } else {
        await get().fetchTasks(currentPage)
      }
      toast.success("Task Deleted")
    } catch (error) { 
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message as string);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ deleteLoading: false })
    }
  },

  updateTask: async (id, data) => {
    try {
      set({ updateLoading: true })
      const res = await axiosInstance.put(`/task/${id}`, data)
      set({
        tasks: get().tasks.map((t) =>
          t._id === id ? res.data : t
        ),
      })
      toast.success("Task Updated")
    } catch (error) { 
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message as string);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ updateLoading: false })
    }
  },
}))