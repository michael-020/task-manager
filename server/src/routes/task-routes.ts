import { Router } from "express"

const router = Router()

router.post("/", (req, res) => {
  res.send("Create task")
})

router.get("/", (req, res) => {
  res.send("Get all tasks")
})

router.put("/:id", (req, res) => {
  res.send("Update task")
})

router.delete("/:id", (req, res) => {
  res.send("Delete task")
})

export default router