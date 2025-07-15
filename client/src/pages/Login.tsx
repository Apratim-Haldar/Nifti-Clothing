"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { Eye, EyeOff, Mail } from "lucide-react"
import axios from "axios"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(form.email, form.password)
      showToast("Login successful! Welcome back.", "success")
      navigate("/products")
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || "Login failed."
      setError(errorMsg)
      showToast(errorMsg, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail.trim()) {
      showToast("Please enter your email address", "error")
      return
    }

    setForgotLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        { email: forgotEmail }
      )
      
      showToast(response.data.message, "success")
      setForgotPasswordMode(false)
      setForgotEmail("")
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to send reset email", "error")
    } finally {
      setForgotLoading(false)
    }
  }

  if (forgotPasswordMode) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-20 pb-8 relative overflow-hidden">
        {/* Fabric Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.03) 2px,
              rgba(139, 69, 19, 0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.03) 2px,
              rgba(139, 69, 19, 0.03) 4px
            )`
          }}></div>
        </div>

        {/* Elegant Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-100/20 to-stone-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-stone-200/20 to-amber-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          {/* Brand Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/logo.jpg" 
                alt="Nifti Clothing"
                className="w-12 h-12 object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs font-cormorant font-medium text-amber-700 tracking-wider uppercase">
                Handcrafted Excellence
              </span>
            </div>
            <h1 className="text-3xl font-playfair font-light text-stone-900 mb-3 tracking-tight">Reset Password</h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-4"></div>
            <p className="text-stone-600 font-cormorant">Enter your email to receive a password reset link</p>
          </div>

          {/* Forgot Password Form */}
          <div className="bg-white/80 backdrop-blur-lg border border-stone-200/50 rounded-xl p-6 shadow-xl">
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-cormorant font-medium text-stone-900 mb-2 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border-2 border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 bg-white/50 backdrop-blur-sm font-inter"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 font-cormorant font-medium tracking-wide hover:from-amber-700 hover:to-amber-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 pt-4 border-t border-stone-200 text-center">
              <button
                onClick={() => setForgotPasswordMode(false)}
                className="text-amber-700 font-cormorant font-medium tracking-wide hover:text-amber-800 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-20 pb-8 relative overflow-hidden">
      {/* Fabric Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.03) 2px,
            rgba(139, 69, 19, 0.03) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.03) 2px,
            rgba(139, 69, 19, 0.03) 4px
          )`
        }}></div>
      </div>

      {/* Elegant Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-100/20 to-stone-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-stone-200/20 to-amber-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.jpg" 
              alt="Nifti Clothing"
              className="w-12 h-12 object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <span className="text-xs font-cormorant font-medium text-amber-700 tracking-wider uppercase">
              Handcrafted Excellence
            </span>
          </div>
          <h1 className="text-3xl font-playfair font-light text-stone-900 mb-3 tracking-tight">Welcome Back</h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-4"></div>
          <p className="text-stone-600 font-cormorant">Sign in to your Nifti account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg border border-stone-200/50 rounded-xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-cormorant rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-2 tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-2 border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-lg bg-white/50 backdrop-blur-sm font-inter"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-2 tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border-2 border-stone-200 px-4 py-3 pr-10 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-lg bg-white/50 backdrop-blur-sm font-inter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 font-cormorant font-medium tracking-wide hover:from-amber-700 hover:to-amber-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setForgotPasswordMode(true)}
              className="text-stone-600 hover:text-amber-700 font-cormorant transition-colors text-sm"
            >
              Forgot your password?
            </button>
          </div>

          {/* Links */}
          <div className="mt-6 pt-4 border-t border-stone-200 text-center">
            <p className="text-stone-600 font-cormorant mb-3">Don't have an account?</p>
            <Link
              to="/register"
              className="text-amber-700 font-cormorant font-medium tracking-wide hover:text-amber-800 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-stone-500 font-cormorant">
            Need help? Contact us at support@nifti.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
