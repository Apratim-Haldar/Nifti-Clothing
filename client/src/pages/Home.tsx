import type React from "react"
import { useState, useEffect } from "react"
import { CoutureHero } from "../components/home/CoutureHero"
import { RunwayCategories } from "../components/home/RunwayCategories"
import { SocialConnect } from "../components/home/SocialConnect"
import { BoutiqueNewsletter } from "../components/home/BoutiqueNewsletter"

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const fetchFeaturedCollection = async () => {
    try {
      // This functionality is now handled by FeaturedProducts component
      return Promise.resolve()
    } catch (error) {
      console.error("Error fetching featured collection:", error)
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        // Data initialization is now handled by individual components
        await fetchFeaturedCollection()
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Component lifecycle
  useEffect(() => {
    // Initialize data
    Promise.resolve()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50">
        <div className="text-center">
          <div className="fabric-sway">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border border-amber-300/50 shadow-lg mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="font-cormorant text-stone-600 text-lg">Loading your Nfiti experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <CoutureHero />
      <RunwayCategories />
      <SocialConnect />
      <BoutiqueNewsletter />
    </div>
  )
}

export default Home
