import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

interface Task {
  _id: string
  title: string
  description?: string
  status: "pending" | "completed",
  dueDate?: string
}

interface TaskState {
  tasks: Task[]
  loading: boolean

  fetchTasks: () => Promise<void>
  createTask: (data: { title: string; description?: string }) => Promise<void>
  toggleTask: (id: string, status: "pending" | "completed") => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    try {
      set({ loading: true })
      const res = await axiosInstance.get("/task")
      set({ tasks: res.data })
    } finally {
      set({ loading: false })
    }
  },

  createTask: async (data) => {
    const res = await axiosInstance.post("/task", data)
    set({ tasks: [res.data, ...get().tasks] })
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
    await axiosInstance.delete(`/task/${id}`)
    set({
      tasks: get().tasks.filter((t) => t._id !== id),
    })
  },
}))