import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Star, Heart, Award } from "lucide-react"
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

export function FeaturedProducts() {
  const [heroProducts, setHeroProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/hero`)
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
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border border-amber-300/50 shadow-lg mx-auto fabric-sway">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 font-cormorant text-stone-600 text-lg">Loading our featured collection...</p>
        </div>
      </section>
    )
  }

  if (heroProducts.length === 0) {
    return null // Don't render if no products
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 fabric-texture opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-stone-50/50 to-rose-50/50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-24"></div>
            <div className="mx-6 w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border border-amber-300/50 shadow-lg fabric-sway">
              <Star className="h-6 w-6 text-amber-700" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-24"></div>
          </div>
          
          <h2 className="text-5xl font-playfair font-light text-stone-900 mb-6 tracking-tight">
            Featured <span className="text-amber-700">Products</span>
          </h2>
          <p className="text-xl text-stone-600 font-inter max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium fashion pieces that define contemporary elegance 
            and sophisticated style.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {heroProducts.map((product, index) => (
            <div
              key={product._id}
              className="group relative fabric-sway"
              style={{ animationDelay: `${index * 200}ms` }}
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="boutique-card rounded-2xl overflow-hidden h-full transition-all duration-700 group-hover:scale-105 velvet-shadow group-hover:shadow-2xl">
                {/* Wishlist Button */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg"
                  >
                    <Heart className="h-4 w-4 text-stone-600 hover:text-red-500" />
                  </Button>
                </div>

                {/* Product Image */}
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={product.heroImage || product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover fashion-sketch group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/logo.jpg"
                    }}
                  />

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                    FEATURED
                  </div>

                  {/* Fabric Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent"></div>

                  {/* Product Info Overlay */}
                  {hoveredProduct === product._id && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-stone-200/50 shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-cormorant font-medium text-stone-800">Premium Quality</span>
                      </div>
                      <p className="text-xs text-stone-600 font-inter">{product.heroTagline || "Expertly crafted"}</p>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-playfair font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-stone-600 font-inter leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-playfair font-bold text-stone-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-500 font-inter">Free shipping</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-stone-700">4.8</span>
                      <span className="text-xs text-stone-500">(24)</span>
                    </div>
                  </div>

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs font-cormorant font-medium text-stone-700 mb-2 block">Available Sizes:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 4).map((size) => (
                          <span
                            key={size}
                            className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded font-medium"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link to={`/product/${product._id}`}>
                    <Button className="w-full bg-stone-800 hover:bg-stone-900 text-white font-cormorant font-medium rounded-full shadow-lg couture-shimmer">
                      {product.buttonText || "View Details"}
                    </Button>
                  </Link>
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <Link to={`/product/${product._id}`}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-cormorant font-medium rounded-full shadow-lg">
                      Quick View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-cormorant font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 couture-shimmer"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
