"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../context/ToastContext"
import { Eye, EyeOff, Mail, Lock, Timer, ArrowLeft } from "lucide-react"
import axios from "axios"

const ResetPassword = () => {
  const [step, setStep] = useState<"email" | "verify">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)

  const { showToast } = useToast()
  const navigate = useNavigate()

  // OTP Timer
  useEffect(() => {
    let interval: number
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    } else if (otpTimer === 0 && step === "verify") {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [otpTimer, step])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      showToast("Email is required", "error")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        { email }
      )

      showToast(response.data.message, "success")
      setStep("verify")
      setOtpTimer(600) // 10 minutes
      setCanResend(false)
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to send reset email", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      showToast("Please enter the OTP", "error")
      return
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long", "error")
      return
    }
    if (newPassword != confirmPassword) {
      showToast("Passwords do not match", "error")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
        {
          email,
          otp,
          newPassword
        }
      )

      showToast(response.data.message, "success")
      navigate("/login")
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to reset password", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        { email }
      )

      showToast(response.data.message, "success")
      setOtpTimer(600) // 10 minutes
      setCanResend(false)
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to resend OTP", "error")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extralight text-slate-900 mb-6 tracking-tight">Reset Password</h1>
            <div className="w-20 h-1 bg-slate-900 mx-auto mb-8"></div>
            <p className="text-slate-600 font-light text-lg">
              Enter the verification code sent to{" "}
              <span className="font-medium text-slate-900">{email}</span>
            </p>
          </div>

          {/* Reset Form */}
          <div className="bg-white p-10 shadow-xl rounded-2xl border border-slate-100">
            <form onSubmit={handleResetSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                  Verification Code
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full pl-11 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg text-center tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {otpTimer > 0 && (
                <div className="flex items-center justify-center text-slate-600 text-sm">
                  <Timer className="w-4 h-4 mr-2" />
                  Code expires in {formatTime(otpTimer)}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 text-xl font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>

            {/* Resend and Back buttons */}
            <div className="mt-10 pt-8 border-t border-slate-200 text-center space-y-4">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || loading}
                className="text-slate-900 font-medium tracking-wider uppercase hover:text-slate-700 transition-colors text-lg disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {canResend ? "Resend Code" : "Resend Available Soon"}
              </button>
              
              <div>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="flex items-center space-x-2 text-slate-600 font-light hover:text-slate-700 transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Email</span>
                </button>
              </div>
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
          <h1 className="text-5xl font-extralight text-slate-900 mb-6 tracking-tight">Forgot Password</h1>
          <div className="w-20 h-1 bg-slate-900 mx-auto mb-8"></div>
          <p className="text-slate-600 font-light text-lg">Enter your email to receive a reset code</p>
        </div>

        {/* Email Form */}
        <div className="bg-white p-10 shadow-xl rounded-2xl border border-slate-100">
          <form onSubmit={handleEmailSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 text-xl font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? "Sending Reset Code..." : "Send Reset Code"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-600 font-light mb-6 text-lg">Remember your password?</p>
            <Link
              to="/login"
              className="text-slate-900 font-medium tracking-wider uppercase hover:text-slate-700 transition-colors text-lg"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword