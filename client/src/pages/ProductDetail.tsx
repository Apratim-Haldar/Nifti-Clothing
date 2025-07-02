"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

// Define the Product interface with new fields
interface Product {
  _id: string
  title: string
  description: string
  price: number
  sizes: string[]
  colors?: string[]
  colorImages?: Array<{ color: string; imageUrl: string }>

  imageUrl: string
  stock: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  gender: "Men" | "Women" | "Unisex"
  categories?: string[]
}

// Define the cart item interface for type safety
interface CartItem {
  productId: string
  title: string
  imageUrl: string
  price: number
  size: string
  quantity: number
  color?: string
}

interface Review {
  _id: string
  name: string
  userId?: string
  rating: number
  comment: string
  createdAt: string
}

interface NewReview {
  rating: number
  comment: string
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { addToCart, loading: cartLoading } = useCart()
  const { addToast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [currentImage, setCurrentImage] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState<NewReview>({ rating: 5, comment: "" })
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editedReview, setEditedReview] = useState<NewReview>({ rating: 5, comment: "" })

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await axios.get<Product>(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`)
        const productData = response.data
        setProduct(productData)

        // Set initial image
        setCurrentImage(productData.imageUrl)

        // Set default size if available
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }

        // Set default color if available
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])

          // Check if there's a color-specific image
          if (productData.colorImages) {
            const colorImage = productData.colorImages.find((img) => img.color === productData.colors![0])
            if (colorImage) {
              setCurrentImage(colorImage.imageUrl)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details.")
        addToast("Failed to load product details", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()

    if (id) {
      axios
        .get<Review[]>(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => {
          console.error("Failed to fetch reviews:", err)
          addToast("Failed to load reviews", "error")
        })
    }
  }, [id, addToast])

  // Handle color change and update image
  useEffect(() => {
    if (product && selectedColor && product.colorImages) {
      const colorImage = product.colorImages.find((img) => img.color === selectedColor)
      if (colorImage) {
        setCurrentImage(colorImage.imageUrl)
      } else {
        // Fallback to main product image
        setCurrentImage(product.imageUrl)
      }
    }
  }, [selectedColor, product])

  const handleAdd = async (): Promise<void> => {
    if (!product) return

    if (!selectedSize) {
      addToast("Please select a size!", "warning")
      return
    }

    if (product.stockStatus === "Out of Stock") {
      addToast("This product is out of stock", "error")
      return
    }

    if (quantity > product.stock) {
      addToast(`Only ${product.stock} items available in stock`, "warning")
      return
    }

    setIsAdding(true)
    try {
      const cartItem: CartItem = {
        productId: product._id,
        title: product.title,
        imageUrl: currentImage,
        price: product.price,
        size: selectedSize,
        quantity: quantity,
        color: selectedColor || undefined,
      }

      await addToCart(cartItem)
      addToast(`${product.title} added to cart!`, "success")
    } catch (error) {
      console.error("Error adding to cart:", error)
      addToast("Failed to add item to cart", "error")
    } finally {
      setIsAdding(false)
    }
  }

  const handleSizeSelect = (size: string): void => {
    setSelectedSize(size)
  }

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color)
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    } else {
      addToast("Cannot exceed available stock", "warning")
    }
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-600"
      case "Low Stock":
        return "text-yellow-600"
      case "Out of Stock":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleSubmitReview = async (): Promise<void> => {
    if (!newReview.comment) {
      addToast("Please write a comment!", "warning")
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reviews`,
        {
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        { withCredentials: true },
      )

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`)
      setReviews(res.data)
      setNewReview({ rating: 5, comment: "" })
      addToast("Review submitted successfully!", "success")
    } catch (err) {
      console.error(err)
      addToast("Failed to submit review", "error")
    }
  }

  const handleDeleteReview = async (reviewId: string): Promise<void> => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/reviews/${reviewId}`, { withCredentials: true })
      setReviews(reviews.filter((r) => r._id !== reviewId))
      addToast("Review deleted successfully", "success")
    } catch (err) {
      console.error(err)
      addToast("Failed to delete review", "error")
    }
  }

  const handleUpdateReview = async (): Promise<void> => {
    if (!editingReviewId) return
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/reviews/${editingReviewId}`, editedReview, {
        withCredentials: true,
      })
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`)
      setReviews(res.data)
      setEditingReviewId(null)
      addToast("Review updated successfully", "success")
    } catch (err) {
      console.error(err)
      addToast("Failed to update review", "error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-6"></div>
          </div>
          <p className="text-slate-600 font-light text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <p className="text-red-600 text-xl font-light">{error}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <p className="text-slate-600 text-xl font-light">Product not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Enhanced Product Image */}
          <div className="relative">
            <img
              src={currentImage || product.imageUrl}
              alt={product.title}
              className="w-full h-auto object-cover rounded-2xl shadow-xl"
            />

            {/* Color Images Thumbnails */}
            {product.colorImages && product.colorImages.length > 0 && (
              <div className="flex mt-6 space-x-4 overflow-x-auto">
                <button
                  onClick={() => setCurrentImage(product.imageUrl)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl ${
                    currentImage === product.imageUrl ? "border-slate-900" : "border-slate-300"
                  }`}
                >
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt="Main"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
                {product.colorImages.map((colorImage, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(colorImage.imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl ${
                      currentImage === colorImage.imageUrl ? "border-slate-900" : "border-slate-300"
                    }`}
                  >
                    <img
                      src={colorImage.imageUrl || "/placeholder.svg"}
                      alt={colorImage.color}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Product Details */}
          <div className="flex flex-col justify-center">
            <div className="mb-10">
              <div className="flex items-center gap-6 mb-6">
                <span className="bg-slate-100 text-slate-800 px-4 py-2 font-medium rounded-xl">{product.gender}</span>
                <span className={`px-4 py-2 font-medium rounded-xl ${getStockStatusColor(product.stockStatus)}`}>
                  {product.stockStatus}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extralight mb-6 text-slate-900 tracking-tight">
                {product.title}
              </h1>
              <div className="w-20 h-1 bg-slate-900 mb-8"></div>
              <p className="text-4xl font-light text-slate-900 mb-8">₹{product.price}</p>
              <p className="text-xl text-slate-600 leading-relaxed font-light mb-10">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-10">
                <label className="block text-sm font-medium tracking-wider uppercase text-slate-900 mb-6">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`px-6 py-3 border-2 font-medium tracking-wide transition-all duration-300 rounded-xl ${
                        selectedColor === color
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 text-slate-700 hover:border-slate-900"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-10">
              <label className="block text-sm font-medium tracking-wider uppercase text-slate-900 mb-6">
                Select Size
              </label>
              <div className="flex flex-wrap gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`w-16 h-16 border-2 flex items-center justify-center font-medium tracking-wide transition-all duration-300 rounded-xl ${
                      selectedSize === size
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 text-slate-700 hover:border-slate-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-10">
              <label className="block text-sm font-medium tracking-wider uppercase text-slate-900 mb-6">Quantity</label>
              <div className="flex items-center border-2 border-slate-300 w-fit rounded-xl">
                <button
                  onClick={decrementQuantity}
                  disabled={isAdding || cartLoading}
                  className="w-16 h-16 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-xl"
                >
                  −
                </button>
                <span className="w-20 h-16 flex items-center justify-center text-xl font-medium bg-slate-50 border-x border-slate-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={isAdding || cartLoading || quantity >= product.stock}
                  className="w-16 h-16 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-xl"
                >
                  +
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-yellow-600 mt-3">Only {product.stock} items left in stock!</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={product.stockStatus === "Out of Stock" || isAdding || cartLoading}
              className={`w-full py-6 text-xl font-medium tracking-wider uppercase transition-all duration-500 flex items-center justify-center rounded-xl ${
                product.stockStatus !== "Out of Stock" && !isAdding && !cartLoading
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
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
                  Adding to Cart...
                </>
              ) : product.stockStatus === "Out of Stock" ? (
                "Out of Stock"
              ) : (
                `Add ${quantity} to Cart`
              )}
            </button>

            {/* Product Info */}
            <div className="mt-16 pt-10 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h4 className="font-medium tracking-wider uppercase text-slate-900 mb-3">Shipping</h4>
                  <p className="text-slate-600 font-light">Free shipping on orders over ₹2000</p>
                </div>
                <div>
                  <h4 className="font-medium tracking-wider uppercase text-slate-900 mb-3">Returns</h4>
                  <p className="text-slate-600 font-light">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Reviews Section */}
        <div className="mt-32 pt-20 border-t border-slate-200">
          <h2 className="text-4xl font-extralight mb-16 text-slate-900 tracking-tight">Customer Reviews</h2>

          {reviews.length > 0 ? (
            <>
              <div className="mb-16 p-10 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-2xl font-light text-slate-900">
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} out of 5
                  </span>
                  <span className="text-slate-600">({reviews.length} reviews)</span>
                </div>
              </div>

              <div className="space-y-8 mb-16">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white p-8 border border-slate-200 rounded-2xl">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <h4 className="font-medium text-slate-900 text-lg">{review.name}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-slate-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      {user && review.userId === user._id && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditingReviewId(review._id)
                              setEditedReview({ rating: review.rating, comment: review.comment })
                            }}
                            className="text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editingReviewId === review._id ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-3">Rating</label>
                          <select
                            value={editedReview.rating}
                            onChange={(e) => setEditedReview({ ...editedReview, rating: Number(e.target.value) })}
                            className="border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:border-slate-900"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num} Star{num > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-3">Comment</label>
                          <textarea
                            value={editedReview.comment}
                            onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
                            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:border-slate-900"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={handleUpdateReview}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="border border-slate-300 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 leading-relaxed text-lg">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl mb-16">
              <p className="text-slate-600 text-xl font-light">No reviews yet. Be the first to review this product!</p>
            </div>
          )}

          {/* Add Review Form */}
          {user && (
            <div className="bg-white p-10 border border-slate-200 rounded-2xl">
              <h3 className="text-2xl font-light mb-8 text-slate-900">Write a Review</h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium tracking-wider uppercase text-slate-900 mb-4">
                    Rating
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="border-2 border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-slate-900 transition-all duration-300"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wider uppercase text-slate-900 mb-4">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this product..."
                    className="w-full border-2 border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-slate-900 transition-all duration-300 text-lg"
                    rows={6}
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  className="bg-slate-900 text-white px-10 py-4 font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <p className="text-slate-600 text-xl font-light mb-6">Please log in to write a review</p>
              <a
                href="/login"
                className="inline-block bg-slate-900 text-white px-8 py-3 font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 rounded-xl"
              >
                Log In
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
