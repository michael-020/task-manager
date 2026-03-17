import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"
import taskRoutes from "./routes/task-routes"
import userRoutes from "./routes/user-routes"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())

connectDB()

app.use("/api/user", userRoutes)
app.use("/api/task", taskRoutes)

const PORT = process.env.PORT!

app.listen(PORT)