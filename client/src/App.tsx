import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuthStore } from "./store/authStore"

import Signin from "./components/signin"
import Signup from "./components/signup"
import Home from "./components/home"
import { Loader2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

export default function App() {
  const { isAuthenticated, checkAuth, checkAuthLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (checkAuthLoading) {
    return (
      <div className="h-screen flex justify-center items-center ">
        <Loader2 className='size-12 animate-spin' />
      </div>
    )
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/home" />}
          />
    
          <Route
            path="/signin"
            element={!isAuthenticated ? <Signin /> : <Navigate to="/home" />}
          />
    
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/signin" />}
          />
    
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/home" : "/signin"} />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  )
}