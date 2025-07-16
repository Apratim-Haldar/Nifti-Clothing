import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Crown, Scissors, Sparkles, Heart, Star, Award } from "lucide-react"
import { Button } from "../ui/button"
import axios from "axios"

interface Product {
  _id: string
  title: string
  description: string
  price: number
  imageUrl: string
  isHero: boolean
  heroImage?: string
  heroTagline?: string
  sizes: string[]
  colors?: string[]
  buttonText?: string
}

// Icon array to cycle through for products
const productIcons = [Crown, Scissors, Heart, Sparkles, Star, Award]

// Updated color schemes - more vibrant and premium looking
const colorSchemes = [
  "from-amber-50/90 to-amber-100/90",
  "from-emerald-50/90 to-emerald-100/90", 
  "from-blue-50/90 to-blue-100/90",
  "from-purple-50/90 to-purple-100/90",
  "from-rose-50/90 to-rose-100/90",
  "from-indigo-50/90 to-indigo-100/90"
]

export function RunwayCategories() {
  const [heroProducts, setHeroProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
          params: { isHero: true },
        })
        setHeroProducts(response.data.slice(0, 4)) // Limit to 4 products
      } catch (error) {
        console.error("Error fetching hero products:", error)
        setHeroProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchHeroProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4 text-stone-800">
              Our <span className="text-stone-700">Collections</span>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed font-cormorant">
              Loading our curated collection of premium fashion pieces...
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="flex justify-center">
            <div className="animate-pulse bg-stone-200 rounded-2xl w-80 h-96"></div>
          </div>
        </div>
      </section>
    )
  }

  // Dynamic grid classes based on number of products
  const getGridClasses = () => {
    if (heroProducts.length === 1) return "flex justify-center"
    if (heroProducts.length === 2) return "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
    if (heroProducts.length === 3) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
  }

  const getCardClasses = () => {
    if (heroProducts.length === 1) return "w-96 h-[500px]" // Compact single card
    return "w-full max-w-sm mx-auto h-96" // Standard card size for multiple
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold mb-4 text-stone-800">
            Our <span className="text-stone-700">Collections</span>
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed font-cormorant">
            Discover our curated range of modern fashion pieces, from contemporary streetwear to
            sophisticated formal attire, designed for every lifestyle and occasion.
          </p>
        </div>

        {/* Hero Products Grid */}
        <div className={`${getGridClasses()} mb-12`}>
          {heroProducts.map((product, index) => {
            const IconComponent = productIcons[index % productIcons.length]
            const colorScheme = colorSchemes[index % colorSchemes.length]
            
            return (
              <Link key={product._id} to={`/products/${product._id}`}>
                <div
                  className={`group relative overflow-hidden rounded-2xl ${getCardClasses()} couture-hover`}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Image Background */}
                  <div className="absolute inset-0">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.jpg"
                      }}
                    />
                  </div>

                  {/* Subtle Overlay - reduced opacity */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorScheme} opacity-30 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-lg">
                        <IconComponent className="h-6 w-6 text-stone-700" />
                      </div>
                      {/* Updated star ratings - golden amber color */}
                      <div className="flex items-center space-x-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                      </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-xl">
                      <h3 className="text-xl font-playfair font-bold text-stone-800 mb-1 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-stone-600 font-cormorant text-sm line-clamp-2 mb-3">
                        {product.heroTagline || product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-stone-800">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-medium">
                          {product.sizes?.[0] || 'In Stock'}
                        </span>
                      </div>

                      {/* Decorative Stitching Line */}
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                        <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect - Quick View Button */}
                  <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                    hoveredProduct === product._id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <Button 
                      className="bg-stone-800 hover:bg-stone-700 text-white border-0 shadow-lg backdrop-blur-sm text-sm px-6 py-2 font-cormorant"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Show More Products Button */}
        {heroProducts.length > 0 && (
          <div className="text-center">
            <Link to="/products">
              <Button 
                size="lg" 
                className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-3 text-base font-cormorant"
              >
                Explore All Collections
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
