import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { User, Mail, Phone, Edit3, Save, X, Eye, EyeOff } from "lucide-react"
import axios from "axios"

const Profile = () => {
  const { user, checkAuth } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(
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
        email: user.email || "",
        phone: user.phone || "",
      })
    }
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

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-11 pr-4 py-4 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg disabled:bg-slate-50 disabled:cursor-not-allowed"
                        placeholder="Enter your email"
                        required
                      />
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
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
                  >
                    Change Password
                  </button>
                ) : (
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