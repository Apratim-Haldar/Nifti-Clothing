import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const refCodeFromURL = searchParams.get("ref") || ""

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    referredBy: refCodeFromURL,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await register(form)
      navigate("/products")
    } catch (err: any) {
      setError(err.response?.data?.msg || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extralight text-slate-900 mb-4 tracking-tight">Join Nifti</h1>
          <div className="w-16 h-px bg-slate-900 mx-auto mb-6"></div>
          <p className="text-slate-600 font-light">Create your account and discover premium fashion</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-light">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referredBy"
                placeholder="Enter referral code"
                value={form.referredBy}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 text-lg font-medium tracking-wide uppercase hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600 font-light mb-4">Already have an account?</p>
            <Link
              to="/login"
              className="text-slate-900 font-medium tracking-wide uppercase hover:text-slate-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 font-light">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
