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
      return res.status(400).json({ message: "Invalid Inputs" })
    }

    const { title, description, dueDate } = parsed.data

    const task = await Task.create({
      user: req.user?._id,
      title,
      description,
      dueDate,
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status } = req.query

    const filter: any = { user: req.user?._id }

    if (status && (status === "pending" || status === "completed")) {
      filter.status = status
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
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
      { new: true }
    )

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
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
    res.status(500).json({ message: "Server error" })
  }
}