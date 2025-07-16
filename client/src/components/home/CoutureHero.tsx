import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import axios from "axios"

interface Advertisement {
  _id: string
  title: string
  description: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  isActive: boolean
  priority: number
}

export function CoutureHero() {
  const [currentCollection, setCurrentCollection] = useState(0)
  const [heroAdvertisements, setHeroAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  
  const collections = [
    { name: "SPRING COLLECTION", season: "2024" },
    { name: "URBAN CHIC", season: "TRENDING" },
    { name: "MODERN CLASSICS", season: "TIMELESS" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCollection((prev) => (prev + 1) % collections.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Fetch hero advertisements
  useEffect(() => {
    const fetchHeroAdvertisements = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/advertisements/active`)
        const activeAds = response.data
          .filter((ad: any) => ad.isActive)
          .sort((a: any, b: any) => a.priority - b.priority)
          .slice(0, 4) // Limit to 4 advertisements
        setHeroAdvertisements(activeAds)
      } catch (error) {
        console.error("Error fetching hero advertisements:", error)
        setHeroAdvertisements([])
      } finally {
        setLoading(false)
      }
    }

    fetchHeroAdvertisements()
  }, [])

  const handleAdvertisementClick = (ad: Advertisement) => {
    if (ad.buttonLink.startsWith("http")) {
      window.open(ad.buttonLink, "_blank", "noopener,noreferrer")
    } else {
      window.location.href = ad.buttonLink
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Fabric Pattern Overlay */}
      <div className="absolute inset-0 fabric-texture opacity-20"></div>
    
      {/* Elegant Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <span className="text-sm font-cormorant font-medium text-amber-700 tracking-wider uppercase">
                Nifti Clothing - Premium Fashion Since 2024
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-playfair font-bold leading-tight text-stone-800">
                Where
                <span className="block text-amber-700">Style</span>
                Meets Innovation
              </h1>

              <div className="relative h-16 overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateY(-${currentCollection * 100}%)` }}
                >
                  {collections.map((collection, index) => (
                    <div key={index} className="h-16 flex items-center">
                      <div className="thread-animation">
                        <span className="text-2xl font-cormorant font-light text-stone-600">{collection.name}</span>
                        <span className="ml-3 text-sm font-inter font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                          {collection.season}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xl text-stone-600 max-w-lg leading-relaxed font-cormorant">
              Discover contemporary fashion that blends modern design with timeless elegance. 
              Experience premium quality pieces crafted for the modern lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/products">
                <Button
                  size="lg"
                  className="group bg-stone-800 hover:bg-stone-900 text-white font-cormorant font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Advertisements */}
          <div className="relative">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border border-amber-300/50 shadow-lg fabric-sway">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : heroAdvertisements.length > 0 ? (
              <div className="relative runway-perspective">
                <div className="grid grid-cols-2 gap-6">
                  {/* Hero Advertisements */}
                  {heroAdvertisements.slice(0, 2).map((ad, index) => (
                    <div key={ad._id} className="space-y-6 fabric-sway" style={{ animationDelay: `${index}s` }}>
                      <div className="mannequin-display group cursor-pointer" onClick={() => handleAdvertisementClick(ad)}>
                        <div className="aspect-[3/4] boutique-card rounded-2xl overflow-hidden couture-hover relative">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/logo.jpg"
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <h3 className="font-playfair font-semibold text-lg mb-2">{ad.title}</h3>
                            <p className="text-sm font-cormorant mb-3 text-white/90">{ad.description}</p>
                            <div className="mt-3 text-xs text-amber-300 font-inter">{ad.buttonText}</div>
                          </div>

                          {/* Special Badge */}
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600/90 to-amber-700/90 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                            Special Offer
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Additional advertisements */}
                  {heroAdvertisements.slice(2, 4).map((ad, index) => (
                    <div key={ad._id} className="space-y-6 fabric-sway mt-12" style={{ animationDelay: `${index + 2}s` }}>
                      <div className="mannequin-display group cursor-pointer" onClick={() => handleAdvertisementClick(ad)}>
                        <div className="aspect-square boutique-card rounded-2xl overflow-hidden couture-hover relative">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/logo.jpg"
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <h4 className="font-playfair font-medium mb-1">{ad.title}</h4>
                            <div className="text-xs text-amber-300 font-inter">{ad.buttonText}</div>
                          </div>

                          {/* Trending Badge */}
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-600/90 to-amber-700/90 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
                            Trending
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Fallback display */
              <div className="relative runway-perspective">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6 fabric-sway">
                    <div className="mannequin-display group">
                      <div className="aspect-[3/4] boutique-card rounded-2xl overflow-hidden couture-hover flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50">
                        <div className="text-center p-8">
                          <img
                            src="/logo.jpg"
                            alt="Nifti Clothing"
                            className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg"
                          />
                          <h3 className="font-playfair font-semibold text-stone-800 text-lg">Special Offers</h3>
                          <p className="text-sm text-stone-600 font-cormorant">Coming Soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 border-2 border-amber-300 rounded-full opacity-30"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 border-2 border-stone-300 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
