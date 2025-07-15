import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, Star, Eye } from "lucide-react"
import { useCart } from "../context/CartContext"

interface Product {
  _id: string
  title: string
  description: string
  price: number
  sizes: string[]
  imageUrl: string
  inStock: boolean
  stockStatus?: string
  categories?: string[]
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = "grid" }) => {
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const selectedSize = product.sizes?.[0] || "M"

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAdding(true)
    try {
      await addToCart({
        productId: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        size: selectedSize,
        quantity: 1,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  if (viewMode === "list") {
    return (
      <Link to={`/products/${product._id}`} className="block">
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="flex">
            {/* Image */}
            <div className="w-48 h-48 relative overflow-hidden bg-stone-100 flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.jpg"
                }}
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-cormorant font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-playfair font-bold text-stone-800 mb-2 group-hover:text-stone-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-stone-600 font-cormorant mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-stone-800">₹{product.price}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                    <span className="ml-2 text-stone-500 text-sm font-cormorant">4.8 (24)</span>
                  </div>
                </div>
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.slice(0, 4).map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-cormorant rounded"
                      >
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-cormorant rounded">
                        +{product.sizes.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 mt-4">
                <button
                  onClick={handleQuickAdd}
                  disabled={!product.inStock || isAdding}
                  className="flex-1 bg-stone-800 text-white py-2 px-4 rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-cormorant"
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
                <button className="p-2 border border-stone-300 rounded-lg hover:border-stone-500 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 border border-stone-300 rounded-lg hover:border-stone-500 transition-colors">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid view (default)
  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div
        className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.jpg"
            }}
          />
          
          {/* Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-cormorant font-semibold">Out of Stock</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
              <Heart className="h-4 w-4 text-stone-600" />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
              <Eye className="h-4 w-4 text-stone-600" />
            </button>
          </div>

          {/* Quick Add Button */}
          <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock || isAdding}
              className="w-full bg-stone-800/90 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-cormorant font-medium"
            >
              {isAdding ? "Adding..." : "Quick Add"}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-lg font-playfair font-bold text-stone-800 mb-2 group-hover:text-stone-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
          
          <p className="text-stone-600 font-cormorant mb-3 line-clamp-2 text-sm">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-stone-800">₹{product.price}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
              ))}
            </div>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-cormorant rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-cormorant rounded">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
