import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get("/", (req, res) => {
  res.send("API running")
})

const PORT = process.env.PORT!

app.listen(PORT)