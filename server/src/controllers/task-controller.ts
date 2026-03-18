import { Request, Response } from "express"
import Task from "../models/Task"
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task-validator"

export const createTask = async (req: Request, res: Response) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body)

    if (!parsed.success) {
      console.log("error: ", parsed.error)
      return res.status(400).json({ message: "Invalid Inputs" })
    }

    const { title, description, dueDate } = parsed.data

    const task = await Task.create({
      user: req.user?._id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 5
    const skip = (page - 1) * limit
    const status = req.query.status as string
    const search = req.query.search as string

    const baseQuery: any = { user: req.user?._id }

    if (status && status !== "all") {
      baseQuery.status = status
    }

    if (search && search.trim()) {
      baseQuery.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ]
    }

    const tasks = await Task.find(baseQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalTasks = await Task.countDocuments({ user: req.user?._id })
    const completedTasks = await Task.countDocuments({ user: req.user?._id, status: "completed" })
    const pendingTasks = await Task.countDocuments({ user: req.user?._id, status: "pending" })
    const filteredTotal = await Task.countDocuments(baseQuery)

    res.json({
      tasks,
      page,
      totalPages: Math.ceil(filteredTotal / limit),
      totalTasks,
      completedTasks,
      pendingTasks,
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid Inputs" })
    }

    const { id } = req.params

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user?._id },
      parsed.data,
      { returnDocument: 'after' }
    )

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user?._id,
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({ message: "Task deleted" })
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}