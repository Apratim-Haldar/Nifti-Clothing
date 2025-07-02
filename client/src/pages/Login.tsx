"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(form.email, form.password)
      navigate("/products")
    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed.")
    } finally {
      setLoading(false)
    }
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
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded-xl text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 text-xl font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

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
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
