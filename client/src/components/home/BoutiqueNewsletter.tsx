import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Scissors, Crown, Heart } from "lucide-react"
import axios from "axios"

export function BoutiqueNewsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/newsletter/subscribe`, {
        email: email.trim()
      })

      if (response.status === 200) {
        setIsSubscribed(true)
        setEmail("")
        setTimeout(() => setIsSubscribed(false), 5000)
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error)
      const errorMessage = error.response?.data?.message || "Subscription failed. Please try again."
      setError(errorMessage)
      setTimeout(() => setError(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-32 px-4 sm:px-6 lg:px-8">
      {/* base fabric dots */}
      <div className="absolute inset-0 fabric-texture opacity-10" />
      {/* diagonal stripes for depth */}
      <div className="absolute inset-0 diagonal-stripes opacity-5" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="boutique-card rounded-3xl p-12 velvet-shadow">
          {/* Decorative Elements */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border border-amber-300/50 shadow-lg fabric-sway">
              <Mail className="h-6 w-6 text-amber-700" />
            </div>
          </div>

          <div className="absolute -top-4 -left-4">
            <div
              className="w-8 h-8 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center fabric-sway"
              style={{ animationDelay: "1s" }}
            >
              <Heart className="h-4 w-4 text-rose-600" />
            </div>
          </div>

          <div className="absolute -top-4 -right-4">
            <div
              className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center fabric-sway"
              style={{ animationDelay: "2s" }}
            >
              <Crown className="h-4 w-4 text-purple-600" />
            </div>
          </div>

          <div className="mb-8 mt-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Scissors className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-cormorant font-medium text-amber-700 tracking-wider uppercase">
                Join The Nifti Community
              </span>
              <Scissors className="h-5 w-5 text-amber-600 scale-x-[-1]" />
            </div>

            <h2 className="text-4xl font-playfair font-bold mb-6 text-stone-800">
              Stay Updated with <span className="text-amber-700">Fashion</span>
            </h2>
            <p className="text-stone-600 text-xl max-w-2xl mx-auto leading-relaxed font-cormorant">
              Be the first to discover our latest collections, exclusive offers, and styling tips. 
              Join thousands of fashion enthusiasts who trust Nifti for their style inspiration.
            </p>
          </div>

          {!isSubscribed ? (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-white border-stone-300 text-stone-800 placeholder:text-stone-500 focus:border-amber-500 rounded-full px-6 py-3 font-cormorant shadow-sm disabled:opacity-50"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="group bg-stone-800 hover:bg-stone-900 text-white font-cormorant font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-full p-3 shadow-sm">
                  <p className="text-red-800 text-sm font-cormorant text-center">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full p-4 shadow-sm">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-cormorant font-semibold text-green-800">Welcome to our Nifti Family!</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl font-playfair font-bold text-stone-800">10K+</div>
              <div className="text-sm text-stone-600 font-cormorant">Satisfied Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-playfair font-bold text-stone-800">100+</div>
              <div className="text-sm text-stone-600 font-cormorant">Years of Heritage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-playfair font-bold text-stone-800">24/7</div>
              <div className="text-sm text-stone-600 font-cormorant">Personal Service</div>
            </div>
          </div>

          {/* Decorative Stitching */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-200 rounded-full"></div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          </div>

          <p className="text-xs text-stone-500 mt-6 font-cormorant">
            By subscribing, you agree to our Privacy Policy and Terms of Service. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
