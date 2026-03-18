import { Router } from "express"
import { checkAuth, logout, signin, signup } from '../controllers/user-controller'
import { authMiddleware } from '../middleware/auth-middleware'

const router = Router()

router.post("/signup", signup)

router.post("/signin", signin)

router.get("/check", authMiddleware, checkAuth)
router.get("/logout", authMiddleware, logout)

export default router