import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star, Award, Crown, Sparkles } from "lucide-react"

const featuredPieces = [
  {
    id: "1",
    name: "Premium Collection Item",
    price: 2899,
    originalPrice: 3299,
    badge: "PREMIUM",
    craftsman: "Nifti Nifti",
    technique: "Premium quality",
    rating: 5.0,
    reviews: 24,
  },
  {
    id: "2",
    name: "Signature Style",
    price: 1299,
    badge: "SIGNATURE",
    craftsman: "Design Team",
    technique: "Modern cut",
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "3",
    name: "Limited Edition",
    price: 1899,
    badge: "LIMITED",
    craftsman: "Nifti Studio",
    technique: "Exclusive design",
    rating: 4.8,
    reviews: 43,
  },
  {
    id: "4",
    name: "Designer Accessory",
    price: 899,
    originalPrice: 1199,
    badge: "DESIGNER",
    craftsman: "Accessory Specialist",
    technique: "Hand-finished",
    rating: 4.9,
    reviews: 89,
  },
]

export function AtelierShowcase() {
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null)

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 silk-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <ShoppingBag className="h-6 w-6 text-amber-600" />
            <span className="text-sm font-cormorant font-medium text-amber-700 tracking-wider uppercase">
              Handpicked by our Master Craftsmen
            </span>
            <ShoppingBag className="h-6 w-6 text-amber-600 scale-x-[-1]" />
          </div>
          <h2 className="text-5xl font-playfair font-bold mb-6 text-stone-800">
            Nifti <span className="text-amber-700">Masterpieces</span>
          </h2>
          <p className="text-stone-600 text-xl max-w-3xl mx-auto leading-relaxed font-cormorant">
            Each piece in our collection represents hours of meticulous craftsmanship, using only the finest materials
            and time-honored techniques.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPieces.map((piece, index) => (
            <div
              key={piece.id}
              className={`group ${index % 2 === 1 ? "lg:mt-16" : ""}`}
              onMouseEnter={() => setHoveredPiece(piece.id)}
              onMouseLeave={() => setHoveredPiece(null)}
            >
              {/* Main Card */}
              <div className="mannequin-display">
                <div className="boutique-card rounded-3xl overflow-hidden couture-hover velvet-shadow">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 text-xs font-cormorant font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {piece.badge}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full border border-stone-200/50 shadow-lg"
                    >
                      <Heart className="h-4 w-4 text-stone-600 hover:text-red-500" />
                    </Button>
                  </div>

                  {/* Product Image */}
                  <div className="aspect-[3/4] overflow-hidden relative bg-gradient-to-br from-stone-100 to-amber-50">
                    {/* Fabric texture background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-stone-200/40" />
                    
                    {/* Brand logo overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="/logo.jpg" 
                        alt="Nifti Logo"
                        className="w-24 h-24 object-contain opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                      />
                    </div>

                    {/* Fabric Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent"></div>

                    {/* Craftsman Info Overlay */}
                    {hoveredPiece === piece.id && (
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-stone-200/50 shadow-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Award className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-cormorant font-medium text-stone-800">{piece.craftsman}</span>
                        </div>
                        <p className="text-xs text-stone-600 font-inter">{piece.technique}</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Link to={`/product/${piece.id}`}>
                      <Button className="w-full bg-stone-800 hover:bg-stone-900 text-white font-cormorant font-medium rounded-full shadow-lg">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Collection
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(piece.rating) ? "text-amber-400 fill-current" : "text-stone-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-stone-600 ml-2">({piece.reviews})</span>
                  </div>
                  <Crown className="h-4 w-4 text-amber-600" />
                </div>

                <Link to={`/product/${piece.id}`}>
                  <h3 className="font-playfair font-semibold text-lg text-stone-800 hover:text-amber-700 transition-colors">
                    {piece.name}
                  </h3>
                </Link>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-stone-800">${piece.price.toLocaleString()}</span>
                  {piece.originalPrice && (
                    <span className="text-stone-500 line-through">${piece.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Decorative Stitching */}
                <div className="flex items-center space-x-2 pt-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link to="/products">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-cormorant font-medium px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Explore Full Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
