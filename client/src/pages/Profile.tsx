"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { User, Mail, Phone, Edit3, Save, X, Eye, EyeOff, Shield, Settings } from "lucide-react"
import axios from "axios"

const Profile = () => {
  const { user, checkAuth } = useAuth()
  const { addToast } = useToast()
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
    let interval: any
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

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
      addToast("Profile updated successfully!", "success")
      await checkAuth()
      setIsEditing(false)
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to update profile", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/request-email-change`,
        { newEmail: emailChangeData.newEmail },
        { withCredentials: true }
      )
      addToast("Verification code sent to your new email!", "success")
      setShowEmailVerification(true)
      setOtpTimer(600) // 10 minutes
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to send verification code", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email-change`,
        { newEmail: emailChangeData.newEmail, otp: emailChangeData.otp },
        { withCredentials: true }
      )
      addToast("Email updated successfully!", "success")
      await checkAuth()
      setShowEmailChangeForm(false)
      setShowEmailVerification(false)
      setEmailChangeData({ newEmail: "", otp: "" })
    } catch (error: any) {
      addToast(error.response?.data?.message || "Invalid verification code", "error")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("New passwords don't match", "error")
      return
    }

    if (passwordData.newPassword.length < 6) {
      addToast("New password must be at least 6 characters long", "error")
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
      addToast("Password changed successfully!", "success")
      setShowPasswordForm(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to change password", "error")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      })
    }
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-cormorant text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
            <span className="text-sm font-cormorant font-medium text-stone-600 tracking-wider uppercase">
              Account Settings
            </span>
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
          </div>
          <h1 className="text-5xl font-playfair font-bold mb-4 text-stone-800">
            My <span className="text-stone-600">Profile</span>
          </h1>
          <p className="text-stone-600 text-xl max-w-2xl mx-auto font-cormorant">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-stone-50 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-stone-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-stone-600" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-stone-800 mb-2">{user.name}</h3>
              <p className="text-stone-600 font-cormorant mb-6">{user.email}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-stone-600">
                  <Mail className="h-4 w-4" />
                  <span className="font-cormorant text-sm">Email Verified</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-stone-600">
                  <Shield className="h-4 w-4" />
                  <span className="font-cormorant text-sm">Account Secure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-playfair font-bold text-stone-800">Basic Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="font-cormorant">Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span className="font-cormorant">Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors font-cormorant flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-stone-400" />
                    <div>
                      <p className="text-sm font-cormorant font-semibold text-stone-700">Full Name</p>
                      <p className="text-stone-800 font-cormorant">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-stone-400" />
                    <div>
                      <p className="text-sm font-cormorant font-semibold text-stone-700">Phone Number</p>
                      <p className="text-stone-800 font-cormorant">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Email Management */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-playfair font-bold text-stone-800">Email Address</h3>
                <button
                  onClick={() => setShowEmailChangeForm(!showEmailChangeForm)}
                  className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="font-cormorant">Change Email</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <Mail className="h-5 w-5 text-stone-400" />
                <div>
                  <p className="text-sm font-cormorant font-semibold text-stone-700">Current Email</p>
                  <p className="text-stone-800 font-cormorant">{user.email}</p>
                </div>
              </div>

              {showEmailChangeForm && (
                <div className="border-t border-stone-200 pt-6">
                  {!showEmailVerification ? (
                    <form onSubmit={handleEmailChangeSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          New Email Address
                        </label>
                        <input
                          type="email"
                          name="newEmail"
                          value={emailChangeData.newEmail}
                          onChange={handleEmailChange}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors font-cormorant"
                      >
                        {loading ? "Sending..." : "Send Verification Code"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleEmailVerification} className="space-y-4">
                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          name="otp"
                          value={emailChangeData.otp}
                          onChange={handleEmailChange}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          placeholder="Enter 6-digit code"
                          required
                        />
                        {otpTimer > 0 && (
                          <p className="text-sm text-stone-600 mt-2 font-cormorant">
                            Code expires in {formatTime(otpTimer)}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors font-cormorant"
                      >
                        {loading ? "Verifying..." : "Verify Email"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Password Management */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-playfair font-bold text-stone-800">Password & Security</h3>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-cormorant">Change Password</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-cormorant font-semibold text-stone-700">Password Status</p>
                  <p className="text-stone-800 font-cormorant">Secure and up to date</p>
                </div>
              </div>

              {showPasswordForm && (
                <div className="border-t border-stone-200 pt-6">
                  <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5 text-stone-400" /> : <Eye className="h-5 w-5 text-stone-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5 text-stone-400" /> : <Eye className="h-5 w-5 text-stone-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5 text-stone-400" /> : <Eye className="h-5 w-5 text-stone-400" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors font-cormorant"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile