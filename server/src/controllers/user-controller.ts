import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { signupSchema, signinSchema } from "../validators/user-validator"
import User from "../models/User"
import { generateToken } from '../utils/generateToken'

export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body)
    
    if (!parsed.success) {
      const parsedMessage = JSON.parse(parsed.error.message)
      
      const firstMessage = parsedMessage[0]?.message
    
      res.status(400).json({ message: firstMessage })
      return
    }

    const { name, email, password } = parsed.data

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: "User already exists" })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    generateToken(user._id, res)

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}

export const signin = async (req: Request, res: Response) => {
  try {
    const parsed = signinSchema.safeParse(req.body)

    if (!parsed.success) {
      const parsedMessage = JSON.parse(parsed.error.message)
      
      const firstMessage = parsedMessage[0]?.message
    
      res.status(400).json({ message: firstMessage })
      return
    }

    const { email, password } = parsed.data

    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" })
      return
    }

    generateToken(user._id, res)

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
}

export const checkAuth = async (req: Request, res: Response) => {
  try {   
    res.status(200).json({
      user: req.user
    })
  } catch (error) {
      console.error("Error while checking auth")
      res.status(500).json({
          msg: "Error while checking auth"
      })
      return
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error while logging out", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}