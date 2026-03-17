import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "../store/authStore"

export default function Signin() {
  const { signin, signinLoading } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    await signin({ email, password })
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={signinLoading}
          className="bg-black text-white p-3 rounded-lg hover:opacity-90 transition"
        >
          {signinLoading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}