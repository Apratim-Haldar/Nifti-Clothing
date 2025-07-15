import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../context/ToastContext"
import { Eye, EyeOff,Timer } from "lucide-react"
import axios from "axios"

const Register: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const refCodeFromURL = searchParams.get("ref") || ""

  const [step, setStep] = useState<"register" | "verify">("register")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referredBy: refCodeFromURL,
  })
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate() 

  // OTP Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    } else if (otpTimer === 0 && step === "verify") {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [otpTimer, step])

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast("Name is required", "error")
      return false
    }
    if (!formData.email.trim()) {
      showToast("Email is required", "error")
      return false
    }
    if (!formData.email.includes("@")) {
      showToast("Please enter a valid email address", "error")
      return false
    }
    // Phone validation only if provided
    if (formData.phone.trim() && !/^[6-9]\d{9}$/.test(formData.phone)) {
      showToast("Please enter a valid 10-digit phone number or leave it empty", "error")
      return false
    }
    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters long", "error")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error")
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone.trim() || undefined,
          password: formData.password,
          referredBy: formData.referredBy || undefined,
        }
      )

      showToast(response.data.message, "success")
      setStep("verify")
      setOtpTimer(60) // 10 minutes
      setCanResend(false)
    } catch (error: any) {
      showToast(error.response?.data?.message || "Registration failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      showToast("Please enter the OTP", "error")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`,
        {
          email: formData.email,
          otp: otp,
        },
        { withCredentials: true }
      )

      showToast(response.data.message, "success")
      
      // Set auth context
   
      
      // Navigate to products
      navigate("/products")
    } catch (error: any) {
      showToast(error.response?.data?.message || "OTP verification failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/resend-otp`,
        { email: formData.email }
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0 fabric-texture opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-stone-50/50 to-rose-50/50"></div>
        
        <div className="max-w-lg w-full relative z-10">
          {/* Brand Logo */}
          <div className="text-center mb-8">
            <img 
              src="/logo.jpg" 
              alt="Nifti Clothing"
              className="w-16 h-16 object-contain mx-auto mb-6 rounded-lg shadow-lg"
            />
            <h1 className="text-4xl font-playfair font-light text-stone-900 mb-4 tracking-tight">Verify Your Email</h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-6"></div>
            <p className="text-stone-600 font-inter text-lg">
              We've sent a verification code to{" "}
              <span className="font-medium text-stone-900">{formData.email}</span>
            </p>
          </div>

          {/* Verification Form */}
          <div className="boutique-card rounded-2xl p-8 velvet-shadow">
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-cormorant font-medium text-stone-900 mb-3 tracking-wide">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full border-2 border-stone-200 px-5 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-xl text-lg text-center tracking-widest font-mono bg-white/80 backdrop-blur-sm"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {otpTimer > 0 && (
                <div className="flex items-center justify-center text-stone-600 text-sm font-inter">
                  <Timer className="w-4 h-4 mr-2 text-amber-600" />
                  Code expires in {formatTime(otpTimer)}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 text-lg font-cormorant font-medium tracking-wide hover:from-amber-700 hover:to-amber-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 couture-shimmer"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            {/* Resend and Back buttons */}
            <div className="mt-8 pt-6 border-t border-stone-200 text-center space-y-4">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || loading}
                className="text-amber-700 font-cormorant font-medium tracking-wide hover:text-amber-800 transition-colors text-lg disabled:text-stone-400 disabled:cursor-not-allowed"
              >
                {canResend ? "Resend Code" : "Resend Available Soon"}
              </button>
              
              <div>
                <button
                  type="button"
                  onClick={() => setStep("register")}
                  className="text-stone-600 font-inter hover:text-stone-700 transition-colors"
                >
                  ← Back to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 fabric-texture opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-stone-50/50 to-rose-50/50"></div>
      
      <div className="max-w-lg w-full relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <img 
            src="/logo.jpg" 
            alt="Nifti Clothing"
            className="w-16 h-16 object-contain mx-auto mb-6 rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-playfair font-light text-stone-900 mb-4 tracking-tight">Join Nifti</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 mx-auto mb-6"></div>
          <p className="text-stone-600 font-inter text-lg">Create your account and discover premium fashion</p>
        </div>

        {/* Registration Form */}
        <div className="boutique-card rounded-2xl p-8 velvet-shadow">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-3 tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-2 border-stone-200 px-5 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-xl text-lg bg-white/80 backdrop-blur-sm font-inter"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-3 tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-stone-200 px-5 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-xl text-lg bg-white/80 backdrop-blur-sm font-inter"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-3 tracking-wide">
                Phone Number <span className="text-stone-500 font-inter text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="w-full border-2 border-stone-200 px-5 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-xl text-lg bg-white/80 backdrop-blur-sm font-inter"
              />
            </div>

            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-3 tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border-2 border-stone-200 px-5 py-4 pr-12 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-xl text-lg bg-white/80 backdrop-blur-sm font-inter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-3 tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full border-2 border-stone-200 px-5 py-4 pr-12 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-xl text-lg bg-white/80 backdrop-blur-sm font-inter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-cormorant font-medium text-stone-900 mb-3 tracking-wide">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referredBy"
                placeholder="Enter referral code"
                value={formData.referredBy}
                onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                className="w-full border-2 border-stone-200 px-5 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-300 rounded-xl text-lg bg-white/80 backdrop-blur-sm font-inter"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 text-lg font-cormorant font-medium tracking-wide hover:from-amber-700 hover:to-amber-800 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 couture-shimmer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <p className="text-stone-600 font-inter text-lg mb-4">Already have an account?</p>
            <Link
              to="/login"
              className="text-amber-700 font-cormorant font-medium tracking-wide hover:text-amber-800 transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-stone-500 font-inter">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
