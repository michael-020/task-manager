import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"

interface JwtPayload {
  userId: string
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      res.status(401).json({ message: "Not authorized" })
      return
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    if (!decoded) {
      res.status(401).json({ message: "Not authorized" })
      return
    }

    const user = await User.findById(decoded.userId).select("-password")

    if(!user){
      res.status(400).json({
          msg: "user not found"
      })
      return
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}