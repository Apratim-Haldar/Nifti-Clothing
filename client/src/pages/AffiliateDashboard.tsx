import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Copy, Users, Gift, DollarSign, Share2, Mail, MessageCircle } from "lucide-react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

interface ReferredUser {
  name: string
  email: string
}

const AffiliateDashboard = () => {
  const { user } = useAuth()
  const { addToast } = useToast()
  
  const [stats, setStats] = useState<{
    affiliateCode: string
    count: number
    referred: ReferredUser[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (user) {
      setLoading(true)
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/affiliate/stats`, {
          withCredentials: true,
        })
        .then((res) => {
          setStats(res.data)
        })
        .catch((err) => {
          console.error("Affiliate fetch failed:", err)
          addToast("Failed to load referral data", "error")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user, addToast])

  const copyReferralLink = async () => {
    if (!stats?.affiliateCode) return
    
    setCopying(true)
    const referralLink = `${window.location.origin}/register?ref=${stats.affiliateCode}`
    
    try {
      await navigator.clipboard.writeText(referralLink)
      addToast("Referral link copied to clipboard!", "success")
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = referralLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      addToast("Referral link copied to clipboard!", "success")
    } finally {
      setCopying(false)
    }
  }

  const shareOnWhatsApp = () => {
    if (!stats?.affiliateCode) return
    const referralLink = `${window.location.origin}/register?ref=${stats.affiliateCode}`
    const message = `Hey! Check out this amazing clothing brand Nifti. Use my referral link to get started: ${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const shareViaEmail = () => {
    if (!stats?.affiliateCode) return
    const referralLink = `${window.location.origin}/register?ref=${stats.affiliateCode}`
    const subject = "Join Nifti - Premium Fashion"
    const body = `I thought you'd love Nifti's premium fashion collection! Use my referral link to get started: ${referralLink}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full text-center bg-stone-50 rounded-2xl p-12">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-stone-500" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-stone-800 mb-4">Access Restricted</h2>
          <p className="text-stone-600 font-cormorant text-lg mb-8">Please log in to view your referral dashboard.</p>
          <Link
            to="/login"
            className="inline-block bg-stone-800 text-white px-8 py-3 rounded-xl font-cormorant hover:bg-stone-700 transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-cormorant text-lg">Loading referral stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full text-center bg-stone-50 rounded-2xl p-12">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-stone-500" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-stone-800 mb-4">No Data Available</h2>
          <p className="text-stone-600 font-cormorant text-lg">Unable to load referral statistics.</p>
        </div>
      </div>
    )
  }

  const referralLink = `${window.location.origin}/register?ref=${stats.affiliateCode}`

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
            <span className="text-sm font-cormorant font-medium text-stone-600 tracking-wider uppercase">
              Referral Program
            </span>
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
          </div>
          <h1 className="text-5xl font-playfair font-bold mb-4 text-stone-800">
            Your <span className="text-stone-600">Referrals</span>
          </h1>
          <p className="text-stone-600 text-xl max-w-2xl mx-auto font-cormorant">
            Share Nifti with friends and earn rewards when they join our community.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Referral Code */}
          <div className="bg-stone-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-playfair font-bold text-stone-800 mb-2">Your Referral Code</h3>
            <p className="text-3xl font-bold text-stone-800 mb-4 font-mono tracking-wide">
              {stats.affiliateCode}
            </p>
            <p className="text-stone-600 font-cormorant">Share this code with friends</p>
          </div>

          {/* Total Referrals */}
          <div className="bg-stone-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-stone-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-playfair font-bold text-stone-800 mb-2">Total Referrals</h3>
            <p className="text-3xl font-bold text-stone-800 mb-4">
              {stats.count}
            </p>
            <p className="text-stone-600 font-cormorant">Friends who joined</p>
          </div>

          {/* Potential Earnings */}
          <div className="bg-stone-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-playfair font-bold text-stone-800 mb-2">Potential Rewards</h3>
            <p className="text-3xl font-bold text-stone-800 mb-4">
              ₹{(stats.count * 10).toFixed(2)}
            </p>
            <p className="text-stone-600 font-cormorant">Based on referrals</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-stone-50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-6 text-center">
            Share Your Referral Link
          </h3>
          
          <div className="bg-white rounded-xl p-6 mb-6">
            <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-3">
              Your unique referral link:
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg bg-stone-50 font-mono text-sm"
              />
              <button
                onClick={copyReferralLink}
                disabled={copying}
                className="flex items-center space-x-2 bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span className="font-cormorant">{copying ? "Copying..." : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center space-x-3 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-cormorant">Share on WhatsApp</span>
            </button>
            
            <button
              onClick={shareViaEmail}
              className="flex items-center justify-center space-x-3 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="font-cormorant">Share via Email</span>
            </button>
            
            <button
              onClick={copyReferralLink}
              className="flex items-center justify-center space-x-3 bg-stone-600 text-white py-3 px-6 rounded-lg hover:bg-stone-700 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span className="font-cormorant">Copy Link</span>
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-stone-50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-8 text-center">
            How It Works
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="font-playfair font-bold text-lg mb-2">Share Your Link</h4>
              <p className="text-stone-600 font-cormorant">
                Share your unique referral link with friends and family.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="font-playfair font-bold text-lg mb-2">Friends Join</h4>
              <p className="text-stone-600 font-cormorant">
                When they sign up using your link, they become your referral.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="font-playfair font-bold text-lg mb-2">Earn Rewards</h4>
              <p className="text-stone-600 font-cormorant">
                Get rewards for every successful referral you make.
              </p>
            </div>
          </div>
        </div>

        {/* Referred Users */}
        {stats.referred.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-6">
              Your Referrals ({stats.referred.length})
            </h3>
            
            <div className="space-y-4">
              {stats.referred.map((referredUser, index) => (
                <div key={index} className="flex items-center justify-between py-4 px-6 bg-stone-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-stone-300 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-stone-600" />
                    </div>
                    <div>
                      <p className="font-playfair font-semibold text-stone-800">{referredUser.name}</p>
                      <p className="text-stone-600 font-cormorant text-sm">{referredUser.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-cormorant font-semibold">+$10.00</p>
                    <p className="text-stone-500 font-cormorant text-sm">Potential reward</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.referred.length === 0 && (
          <div className="text-center py-12 bg-stone-50 rounded-2xl">
            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-stone-400" />
            </div>
            <h3 className="text-xl font-playfair font-bold text-stone-800 mb-4">No Referrals Yet</h3>
            <p className="text-stone-600 font-cormorant text-lg mb-8">
              Start sharing your referral link to earn rewards!
            </p>
            <button
              onClick={copyReferralLink}
              className="bg-stone-800 text-white px-8 py-3 rounded-lg hover:bg-stone-700 transition-colors font-cormorant"
            >
              Copy Referral Link
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AffiliateDashboard
