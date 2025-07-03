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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extralight text-slate-900 mb-6 tracking-tight">Forgot Password</h1>
            <div className="w-20 h-1 bg-slate-900 mx-auto mb-8"></div>
            <p className="text-slate-600 font-light text-lg">Enter your email to receive a password reset link</p>
          </div>

          {/* Forgot Password Form */}
          <div className="bg-white p-10 shadow-xl rounded-2xl border border-slate-100">
            <form onSubmit={handleForgotPassword} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-slate-900 text-white py-5 text-xl font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-10 pt-8 border-t border-slate-200 text-center">
              <button
                onClick={() => setForgotPasswordMode(false)}
                className="text-slate-900 font-medium tracking-wider uppercase hover:text-slate-700 transition-colors text-lg"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extralight text-slate-900 mb-6 tracking-tight">Welcome Back</h1>
          <div className="w-20 h-1 bg-slate-900 mx-auto mb-8"></div>
          <p className="text-slate-600 font-light text-lg">Sign in to your Nifti account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-10 shadow-xl rounded-2xl border border-slate-100">
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 text-red-700 text-sm font-light rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded-xl text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border-2 border-slate-200 px-5 py-4 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded-xl text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 text-xl font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <Link
              to="/reset-password"
              className="text-slate-600 hover:text-slate-900 font-light transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Links */}
          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-600 font-light mb-6 text-lg">Don't have an account?</p>
            <Link
              to="/register"
              className="text-slate-900 font-medium tracking-wider uppercase hover:text-slate-700 transition-colors text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-sm text-slate-500 font-light">
            Need help? Contact us at support@nifti.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
