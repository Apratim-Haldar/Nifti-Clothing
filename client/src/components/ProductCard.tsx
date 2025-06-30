import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

interface Product {
  _id: string
  title: string
  description: string
  price: number
  sizes: string[]
  imageUrl: string
  inStock: boolean
  categories?: string[]
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart()
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState("M")
  const [isAdding, setIsAdding] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const handleQuickAdd = async () => {
    setIsAdding(true)
    try {
      await addToCart({
        productId: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        size: selectedSize,
        quantity: qty,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
      setShowQuickAdd(false)
    }
  }

  const incrementQty = () => setQty((prev) => prev + 1)
  const decrementQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1))

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const availableSizes = product.sizes || sizes

  return (
    <div className="group relative bg-white border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Quick Add Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
            showQuickAdd ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-white">
            {/* Size Selection */}
            <div className="mb-4 w-full">
              <label className="block text-xs font-medium mb-2 text-center uppercase tracking-wide">
                Select Size
              </label>
              <div className="flex justify-center gap-2 flex-wrap">
                {availableSizes.slice(0, 4).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-8 h-8 text-xs border transition-all duration-200 ${
                      selectedSize === size
                        ? "border-white bg-white text-black"
                        : "border-white/50 text-white hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wide">
                Qty:
              </span>
              <div className="flex items-center border border-white/50 rounded">
                <button
                  onClick={decrementQty}
                  disabled={isAdding || isLoading}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  −
                </button>
                <span className="w-10 h-8 flex items-center justify-center text-sm font-medium bg-white/10">
                  {qty}
                </span>
                <button
                  onClick={incrementQty}
                  disabled={isAdding || isLoading}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleQuickAdd}
              disabled={isAdding || isLoading}
              className="w-full py-2 bg-white text-black text-sm font-medium uppercase tracking-wide hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isAdding ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowQuickAdd(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Quick Add Trigger */}
        <button
          onClick={() => setShowQuickAdd(true)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-lg font-light mb-2 text-slate-900 tracking-wide hover:text-slate-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-slate-600 text-sm mb-3 line-clamp-2 font-light">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-light text-slate-900">₹{product.price}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              View Details →
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
