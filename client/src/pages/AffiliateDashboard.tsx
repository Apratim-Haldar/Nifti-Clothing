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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-light text-slate-900 mb-4">Access Restricted</h2>
          <p className="text-slate-600 font-light">Please log in to view your affiliate dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-light">Loading affiliate stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-light text-slate-900 mb-4">No Data Available</h2>
          <p className="text-slate-600 font-light">Unable to load affiliate statistics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extralight mb-6 text-slate-900 tracking-tight">
              Affiliate Dashboard
            </h1>
            <div className="w-16 h-px bg-slate-900 mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 font-light">Track your referrals and grow your network</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 shadow-sm text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-4 tracking-wide uppercase">Your Referral Code</h3>
              <div className="bg-slate-100 p-4 mb-4">
                <code className="text-2xl font-mono text-slate-900">{stats.affiliateCode}</code>
              </div>
              <p className="text-sm text-slate-600 font-light">Share this code with friends and family</p>
            </div>

            <div className="bg-white p-8 shadow-sm text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-4 tracking-wide uppercase">Total Referrals</h3>
              <div className="text-4xl font-extralight text-slate-900 mb-4">{stats.count}</div>
              <p className="text-sm text-slate-600 font-light">People you've referred to Nifti</p>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-white p-8 shadow-sm mb-12">
            <h3 className="text-xl font-light text-slate-900 mb-6">Your Referral Link</h3>
            <div className="bg-slate-100 p-4 mb-4">
              <code className="text-sm text-slate-700 break-all">
                {`${window.location.origin}/register?ref=${stats.affiliateCode}`}
              </code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/register?ref=${stats.affiliateCode}`)
                alert("Referral link copied to clipboard!")
              }}
              className="bg-slate-900 text-white px-6 py-2 text-sm font-medium tracking-wide uppercase hover:bg-slate-800 transition-colors"
            >
              Copy Link
            </button>
          </div>

          {/* Referred Users */}
          <div className="bg-white p-8 shadow-sm">
            <h3 className="text-xl font-light text-slate-900 mb-6">Referred Users</h3>
            {stats.referred.length > 0 ? (
              <div className="space-y-4">
                {stats.referred.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-4 border-b border-slate-200 last:border-b-0"
                  >
                    <div>
                      <h4 className="font-medium text-slate-900">{user.name}</h4>
                      <p className="text-sm text-slate-600 font-light">{user.email}</p>
                    </div>
                    <div className="text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto mb-4"
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
                <h4 className="text-lg font-light text-slate-900 mb-2">No referrals yet</h4>
                <p className="text-slate-600 font-light">Start sharing your referral link to see your network grow</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AffiliateDashboard
