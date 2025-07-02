"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

interface ReferredUser {
  name: string
  email: string
}

const AffiliateDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<{
    affiliateCode: string
    count: number
    referred: ReferredUser[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/affiliate/stats`, {
        withCredentials: true,
      })
      .then((res) => {
        setStats(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Affiliate fetch failed:", err)
        setLoading(false)
      })
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center px-6">
        {/* Geometric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-teal-500/5 transform rotate-45 rounded-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-teal-400/5 transform -rotate-12 rounded-3xl"></div>
        </div>

        <div className="relative max-w-md w-full text-center bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl p-12 shadow-2xl">
          <img src="logo.png" alt="Nifti" className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-light text-slate-900 mb-6">Access Restricted</h2>
          <p className="text-slate-600 font-light text-lg mb-8">Please log in to view your affiliate dashboard.</p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
          >
            Login Now
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
            <img src="/logo.png" alt="Loading" className="absolute inset-0 w-12 h-12 m-auto animate-pulse" />
          </div>
          <p className="text-slate-600 font-light text-lg">Loading affiliate stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl p-12 shadow-2xl">
          <img src="/logo.png" alt="Nifti" className="w-16 h-16 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-light text-slate-900 mb-6">No Data Available</h2>
          <p className="text-slate-600 font-light text-lg">Unable to load affiliate statistics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-teal-600/5 transform rotate-45 rounded-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-teal-400/5 to-teal-500/5 transform -rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-gradient-to-br from-teal-600/5 to-teal-700/5 transform rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-gradient-to-br from-teal-500/5 to-teal-600/5 transform -rotate-45 rounded-3xl"></div>
      </div>

      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-teal-500"></div>
              <img src="/logo.png" alt="Nifti" className="w-12 h-12 mx-6" />
              <div className="w-16 h-px bg-teal-500"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">
              Affiliate Dashboard
            </h1>
            <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
              Track your referrals, grow your network, and earn rewards with every successful referral
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Referral Code Card */}
            <div className="group bg-white/80 backdrop-blur-xl border border-teal-100 p-10 shadow-2xl text-center rounded-3xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                </div>
                <img src="/logo.png" alt="Nifti" className="absolute top-0 right-0 w-6 h-6 opacity-20" />
              </div>
              <h3 className="text-2xl font-light text-slate-900 mb-6 tracking-wide">Your Referral Code</h3>
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 border-2 border-teal-200 p-6 mb-6 rounded-2xl">
                <code className="text-3xl font-mono text-teal-800 font-bold tracking-wider">{stats.affiliateCode}</code>
              </div>
              <p className="text-slate-600 font-light">Share this code with friends and family to start earning</p>
            </div>

            {/* Total Referrals Card */}
            <div className="group bg-white/80 backdrop-blur-xl border border-teal-100 p-10 shadow-2xl text-center rounded-3xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <img src="/logo.png" alt="Nifti" className="absolute top-0 right-0 w-6 h-6 opacity-20" />
              </div>
              <h3 className="text-2xl font-light text-slate-900 mb-6 tracking-wide">Total Referrals</h3>
              <div className="text-6xl font-extralight text-slate-900 mb-6 group-hover:text-teal-600 transition-colors duration-300">
                {stats.count}
              </div>
              <p className="text-slate-600 font-light">People you've successfully referred to Nifti</p>
            </div>
          </div>

          {/* Enhanced Referral Link Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-teal-100 p-10 shadow-2xl mb-16 rounded-3xl">
            <div className="flex items-center mb-8">
              <img src="/logo.png" alt="Nifti" className="w-8 h-8 mr-4" />
              <h3 className="text-3xl font-light text-slate-900">Your Referral Link</h3>
            </div>
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 p-6 mb-6 rounded-2xl">
              <code className="text-sm text-slate-700 break-all font-mono">
                {`${window.location.origin}/register?ref=${stats.affiliateCode}`}
              </code>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/register?ref=${stats.affiliateCode}`)
                  alert("Referral link copied to clipboard!")
                }}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 text-lg font-medium tracking-wide hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Link
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Join Nifti Clothing",
                      text: "Check out Nifti Clothing - premium fashion for the modern individual!",
                      url: `${window.location.origin}/register?ref=${stats.affiliateCode}`,
                    })
                  }
                }}
                className="flex-1 border-2 border-teal-500 text-teal-600 px-8 py-4 text-lg font-medium tracking-wide hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                Share Link
              </button>
            </div>
          </div>

          {/* Enhanced Referred Users Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-teal-100 p-10 shadow-2xl rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img src="/logo.png" alt="Nifti" className="w-8 h-8 mr-4" />
                <h3 className="text-3xl font-light text-slate-900">Referred Users</h3>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                {stats.referred.length} Total
              </div>
            </div>

            {stats.referred.length > 0 ? (
              <div className="space-y-6">
                {stats.referred.map((user, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-teal-50/50 border border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-medium text-lg">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 text-lg">{user.name}</h4>
                        <p className="text-slate-600 font-light">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </div>
                      <div className="text-green-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <svg
                    className="w-24 h-24 text-slate-300 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <img
                    src="../public/logo.png"
                    alt="Nifti"
                    className="absolute top-0 right-1/2 transform translate-x-1/2 w-8 h-8 opacity-20"
                  />
                </div>
                <h4 className="text-2xl font-light text-slate-900 mb-4">No referrals yet</h4>
                <p className="text-slate-600 font-light text-lg mb-8 max-w-md mx-auto">
                  Start sharing your referral link to see your network grow and earn rewards
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${stats.affiliateCode}`)
                      alert("Referral link copied!")
                    }}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Copy Referral Link
                  </button>
                  <a
                    href="/products"
                    className="border-2 border-teal-500 text-teal-600 px-8 py-3 rounded-xl font-medium hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Products
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Referral Tips Section */}
          <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-10 rounded-3xl text-white">
            <div className="text-center mb-12">
              <img src="/logo.png" alt="Nifti" className="w-12 h-12 mx-auto mb-6 filter brightness-0 invert" />
              <h3 className="text-3xl font-light mb-4">Maximize Your Referrals</h3>
              <p className="text-white/80 font-light text-lg">Tips to grow your network and earn more rewards</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  ),
                  title: "Share on Social Media",
                  description: "Post your referral link on Instagram, Facebook, and WhatsApp to reach more people",
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                      />
                    </svg>
                  ),
                  title: "Personal Recommendations",
                  description: "Share your favorite Nifti pieces with friends and explain why you love the brand",
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                  ),
                  title: "Special Occasions",
                  description: "Share during sales, new collections, or special events for higher conversion rates",
                },
              ].map((tip, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {tip.icon}
                  </div>
                  <h4 className="text-xl font-light mb-3">{tip.title}</h4>
                  <p className="text-white/80 font-light text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AffiliateDashboard
