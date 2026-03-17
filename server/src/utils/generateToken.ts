import { Response } from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

export const generateToken = (userId: mongoose.Types.ObjectId, res: Response) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    )
  
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    })
}