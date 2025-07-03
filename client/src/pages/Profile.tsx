"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { User, Mail, Phone, Edit3, Save, X, Eye, EyeOff, Timer } from "lucide-react"
import axios from "axios"

const Profile = () => {
  const { user, checkAuth } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showEmailChangeForm, setShowEmailChangeForm] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)


  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })

  const [emailChangeData, setEmailChangeData] = useState({
    newEmail: "",
    otp: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // OTP Timer
  useEffect(() => {
    let interval: number
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    } else if (otpTimer === 0 && showEmailVerification) {
      
      
    }
    return () => clearInterval(interval)
  }, [otpTimer, showEmailVerification])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailChangeData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        formData,
        { withCredentials: true }
      )

      showToast("Profile updated successfully!", "success")
      setIsEditing(false)
      await checkAuth() // Refresh user data
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update profile", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailChangeData.newEmail.trim()) {
      showToast("Please enter a new email address", "error")
      return
    }

    if (!emailChangeData.newEmail.includes("@")) {
      showToast("Please enter a valid email address", "error")
      return
    }

    if (emailChangeData.newEmail === user?.email) {
      showToast("New email must be different from current email", "error")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/request-email-change`,
        { newEmail: emailChangeData.newEmail },
        { withCredentials: true }
      )

      showToast(response.data.message, "success")
      setShowEmailChangeForm(false)
      setShowEmailVerification(true)
      setOtpTimer(600) // 10 minutes
     
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to request email change", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailChangeData.otp.trim()) {
      showToast("Please enter the OTP", "error")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email-change`,
        { otp: emailChangeData.otp },
        { withCredentials: true }
      )

      showToast(response.data.message, "success")
      setShowEmailVerification(false)
      setEmailChangeData({ newEmail: "", otp: "" })
      await checkAuth() // Refresh user data
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to verify email change", "error")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error")
      return
    }

    if (passwordData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters long", "error")
      return
    }

    setLoading(true)

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      )

      showToast("Password updated successfully!", "success")
      setShowPasswordForm(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update password", "error")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      })
    }
  }

  const cancelEmailChange = () => {
    setShowEmailChangeForm(false)
    setShowEmailVerification(false)
    setEmailChangeData({ newEmail: "", otp: "" })
    setOtpTimer(0)

  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
        <div className="relative max-w-md w-full text-center bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-12 shadow-2xl">
          <img src="/logo.jpg" alt="Nifti" className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-extralight text-slate-900 mb-6">Access Restricted</h2>
          <p className="text-slate-600 font-light text-lg mb-8">Please log in to view your profile.</p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:from-slate-900 hover:to-black transition-all duration-300 transform hover:scale-105"
          >
            Login Now
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-slate-500/5 to-slate-600/5 transform rotate-45 rounded-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-slate-400/5 to-slate-500/5 transform -rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-gradient-to-br from-slate-600/5 to-slate-700/5 transform rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-gradient-to-br from-slate-500/5 to-slate-600/5 transform -rotate-45 rounded-3xl"></div>
      </div>

      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extralight text-slate-900 mb-6 tracking-tight">My Profile</h1>
            <div className="w-20 h-1 bg-slate-900 mx-auto mb-8"></div>
            <p className="text-slate-600 font-light text-lg">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-light text-slate-900">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={cancelEdit}
                        className="flex items-center space-x-2 bg-slate-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-600 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? "Saving..." : "Save"}</span>
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg disabled:bg-slate-50 disabled:cursor-not-allowed"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field (Read-only with change option) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-11 pr-24 py-4 border-2 border-slate-200 rounded-xl text-slate-900 bg-slate-50 cursor-not-allowed text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmailChangeForm(true)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-800 text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Phone Number <span className="text-slate-500 normal-case text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg disabled:bg-slate-50 disabled:cursor-not-allowed"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Email Change Form */}
              {showEmailChangeForm && (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-2xl mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-light text-slate-900">Change Email Address</h3>
                    <button
                      onClick={cancelEmailChange}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleEmailChangeRequest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        name="newEmail"
                        value={emailChangeData.newEmail}
                        onChange={handleEmailChange}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-all duration-300"
                        placeholder="Enter new email address"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </form>
                </div>
              )}

              {/* Email Verification Form */}
              {showEmailVerification && (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-2xl mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-light text-slate-900">Verify New Email</h3>
                    <button
                      onClick={cancelEmailChange}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-slate-600 mb-4">
                    We've sent a verification code to{" "}
                    <span className="font-medium">{emailChangeData.newEmail}</span>
                  </p>

                  <form onSubmit={handleEmailVerification} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        name="otp"
                        value={emailChangeData.otp}
                        onChange={(e) => setEmailChangeData(prev => ({ 
                          ...prev, 
                          otp: e.target.value.replace(/\D/g, "").slice(0, 6) 
                        }))}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-all duration-300 text-center tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>

                    {otpTimer > 0 && (
                      <div className="flex items-center justify-center text-slate-600 text-sm">
                        <Timer className="w-4 h-4 mr-2" />
                        Code expires in {formatTime(otpTimer)}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying..." : "Verify Email"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Account Details Sidebar */}
            <div className="space-y-6">
              {/* Account Info */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mb-4 mx-auto">
                    <span className="text-white font-bold text-2xl">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500 uppercase tracking-wider">Member Since</p>
                    <p className="text-slate-900 font-medium">Premium Member</p>
                  </div>
                  {user.affiliateCode && (
                    <div className="text-center pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-500 uppercase tracking-wider">Affiliate Code</p>
                      <p className="text-slate-900 font-mono text-sm bg-slate-100 px-3 py-1 rounded-lg inline-block">
                        {user.affiliateCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Security</h3>
                </div>
                
                {!showPasswordForm ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Password</h4>
                        <p className="text-sm text-slate-500">Last updated recently</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-amber-800">
                            Make sure your new password is strong and unique.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full pr-10 pl-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-all duration-300"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full pr-10 pl-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-all duration-300"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full pr-10 pl-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-all duration-300"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false)
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            })
                          }}
                          className="flex-1 bg-slate-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-600 transition-all duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile