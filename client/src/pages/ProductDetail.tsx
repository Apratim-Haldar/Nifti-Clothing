import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Share2, ArrowRight, Star, Truck, Shield, RotateCcw, Minus, Plus, ArrowLeft, Copy, Facebook, Twitter, MessageCircle } from "lucide-react"
import axios from "axios"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

// Define interfaces
interface Product {
  _id: string
  title: string
  description: string
  price: number
  sizes: string[]
  colors?: string[]
  colorImages?: Array<{ color: string; imageUrl: string }>
  imageUrl: string
  additionalImages?: string[]
  stock: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  gender: "Men" | "Women" | "Unisex"
  categories?: string[]
}

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
  const { addToCart } = useCart()
  const { addToast } = useToast()
  
  // Product state
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [currentImage, setCurrentImage] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState<NewReview>({ rating: 5, comment: "" })
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editedReview, setEditedReview] = useState<NewReview>({ rating: 5, comment: "" })
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details')

  // Share menu state
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await axios.get<Product>(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`)
        const productData = response.data
        setProduct(productData)
        setCurrentImage(productData.imageUrl)

        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }

        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])
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

    // Fetch reviews
    if (id) {
      axios
        .get<Review[]>(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Failed to fetch reviews:", err))
    }
  }, [id, addToast])

  // Handle color change
  useEffect(() => {
    if (product && selectedColor && product.colorImages) {
      const colorImage = product.colorImages.find((img) => img.color === selectedColor)
      if (colorImage) {
        setCurrentImage(colorImage.imageUrl)
      } else {
        setCurrentImage(product.imageUrl)
      }
    }
  }, [selectedColor, product])

  const handleAddToCart = async (): Promise<void> => {
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

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "text-green-600"
      case "Low Stock": return "text-yellow-600"
      case "Out of Stock": return "text-red-600"
      default: return "text-stone-600"
    }
  }

  const handleSubmitReview = async (): Promise<void> => {
    if (!newReview.comment.trim()) {
      addToast("Please enter a comment", "error")
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reviews`,
        { productId: id, ...newReview },
        { withCredentials: true }
      )
      setReviews([response.data, ...reviews])
      setNewReview({ rating: 5, comment: "" })
      addToast("Review submitted successfully!", "success")
    } catch (err) {
      addToast("Failed to submit review", "error")
    }
  }

  const handleDeleteReview = async (reviewId: string): Promise<void> => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/reviews/${reviewId}`, {
        withCredentials: true,
      })
      setReviews(reviews.filter(r => r._id !== reviewId))
      addToast("Review deleted successfully", "success")
    } catch (err) {
      addToast("Failed to delete review", "error")
    }
  }

  const handleUpdateReview = async (): Promise<void> => {
    if (!editingReviewId) return
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/reviews/${editingReviewId}`,
        editedReview,
        { withCredentials: true }
      )
      setReviews(reviews.map(r => r._id === editingReviewId ? response.data : r))
      setEditingReviewId(null)
      addToast("Review updated successfully", "success")
    } catch (err) {
      addToast("Failed to update review", "error")
    }
  }

  // Add share functionality
  const handleShare = async () => {
    const shareData = {
      title: product?.title || 'Check out this product',
      text: product?.description || 'Amazing product from Nifti',
      url: window.location.href,
    }

    // Check if native sharing is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        addToast('Product shared successfully!', 'success')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
          setShowShareMenu(true) // Fallback to custom share menu
        }
      }
    } else {
      setShowShareMenu(true) // Show custom share menu
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      addToast('Link copied to clipboard!', 'success')
      setShowShareMenu(false)
    } catch (error) {
      console.error('Failed to copy:', error)
      addToast('Failed to copy link', 'error')
    }
  }

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(product?.title || 'Check out this product')
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-cormorant text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair font-bold text-stone-800 mb-4">Product Not Found</h2>
          <p className="text-stone-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/products" className="inline-flex items-center bg-stone-800 text-white px-6 py-3 rounded-xl hover:bg-stone-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const productImages = [
    product.imageUrl,
    ...(product.additionalImages || []),
    ...(product.colorImages?.map(img => img.imageUrl) || [])
  ].filter((url, index, arr) => arr.indexOf(url) === index) // Remove duplicates



  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-stone-800">Products</Link>
          <span>/</span>
          <span className="text-stone-800">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Images */}
           <div className="space-y-4">
             <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
               {/* Main image */}
               <img
                 src={productImages[selectedImageIndex]}
                 alt={`${product.title} ${selectedImageIndex  + 1}`}
                 className="w-full h-full object-contain transition-transform duration-500"
                 onError={(e) => {
                   const target = e.target as HTMLImageElement
                   target.src = "/placeholder.jpg"
                 }}
               />
 
               {/* Prev arrow */}
               {selectedImageIndex > 0 && (
                 <button
                   onClick={() => setSelectedImageIndex(i => i - 1)}
                   className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-stone-100 transition"
                 >
                   <ArrowLeft className="w-5 h-5 text-stone-800" />
                 </button>
               )}
 
               {/* Next arrow */}
               {selectedImageIndex < productImages.length - 1 && (
                 <button
                   onClick={() => setSelectedImageIndex(i => i  + 1)}
                   className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-stone-100 transition"
                 >
                   <ArrowRight className="w-5 h-5 text-stone-800" />
                 </button>
               )}
             </div>
 
             {/* Thumbnail strip: 4 per view, scrollable */}
             {productImages.length > 1 && (
               <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory">
                 {productImages.map((image, index) => (
                   <button
                     key={index}
                     onClick={() => setSelectedImageIndex(index)}
                     className={`
                       snap-start
                       flex-shrink-0 w-1/4 aspect-square
                       rounded-lg overflow-hidden
                       transition-opacity duration-200
                       ${selectedImageIndex === index
                         ? "ring-2 ring-stone-800"
                         : "opacity-70 hover:opacity-100"}
                     `}
                   >
                     <img
                       src={image}
                       alt={`${product.title} thumb ${index +  1}`}
                       className="w-full h-full object-cover"
                     />
                   </button>
                 ))}
               </div>
             )}
           </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-playfair font-bold text-stone-800 mb-4">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                  <span className="ml-2 text-stone-600">
                    {reviews.length > 0 
                      ? `${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} (${reviews.length} reviews)`
                      : "No reviews yet"
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-stone-800">₹{product.price}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(product.stockStatus)} bg-stone-100`}>
                  {product.stockStatus}
                </span>
              </div>
            </div>

            <p className="text-stone-600 text-lg leading-relaxed font-cormorant">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-playfair font-semibold text-lg mb-4">Color</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors font-cormorant ${
                        selectedColor === color
                          ? "border-stone-800 bg-stone-800 text-white"
                          : "border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-playfair font-semibold text-lg mb-4">Size</h3>
                <div className="grid grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg border-2 transition-colors font-cormorant ${
                        selectedSize === size
                          ? "border-stone-800 bg-stone-800 text-white"
                          : "border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-playfair font-semibold text-lg mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-stone-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-stone-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-cormorant text-lg">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-stone-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-stone-600 font-cormorant">
                  {product.stock} items available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stockStatus === "Out of Stock"}
                className="flex-1 bg-stone-800 text-white py-4 rounded-xl font-cormorant text-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className="p-4 border-2 border-stone-300 rounded-xl hover:border-stone-500 transition-colors"
                >
                  <Share2 className="h-6 w-6" />
                </button>

                {/* Custom Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg p-4 min-w-48 z-50">
                    <div className="text-sm font-semibold text-stone-800 mb-3">Share this product</div>
                    
                    {/* Copy Link */}
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-stone-50 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4 text-stone-600" />
                      <span className="text-stone-700">Copy Link</span>
                    </button>
                    
                    {/* Social Media Options */}
                    <button
                      onClick={() => shareToSocial('facebook')}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-stone-50 rounded-lg transition-colors"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span className="text-stone-700">Facebook</span>
                    </button>
                    
                    <button
                      onClick={() => shareToSocial('twitter')}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-stone-50 rounded-lg transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span className="text-stone-700">Twitter</span>
                    </button>
                    
                    <button
                      onClick={() => shareToSocial('whatsapp')}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-stone-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="text-stone-700">WhatsApp</span>
                    </button>
                    
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="w-full mt-2 pt-2 border-t border-stone-200 text-stone-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-200">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-stone-600" />
                <span className="text-stone-600 font-cormorant">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-stone-600" />
                <span className="text-stone-600 font-cormorant">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-6 w-6 text-stone-600" />
                <span className="text-stone-600 font-cormorant">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <div className="border-b border-stone-200">
            <nav className="flex space-x-8">
              {(['details', 'reviews', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-cormorant text-lg capitalize transition-colors ${
                    activeTab === tab
                      ? "border-stone-800 text-stone-800"
                      : "border-transparent text-stone-600 hover:text-stone-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'details' && (
              <div className="bg-stone-50 rounded-2xl p-8">
                <h3 className="text-2xl font-playfair font-bold mb-6">Product Details</h3>
                <div className="prose prose-stone max-w-none">
                  <p className="text-stone-700 leading-relaxed font-cormorant text-lg mb-6">{product.description}</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-playfair font-semibold text-lg mb-4">Specifications</h4>
                      <ul className="space-y-2 font-cormorant">
                        <li className="flex gap-2">
                          <span>Gender:</span>
                          <span>{product.gender}</span>
                        </li>
                        <li className="flex gap-2">
                          <span>Available Sizes:</span>
                          <span>{product.sizes.join(", ")}</span>
                        </li>
                        {product.colors && (
                          <li className="flex gap-2">
                            <span>Colors:</span>
                            <span>{product.colors.join(", ")}</span>
                          </li>
                        )}
                        <li className="flex gap-2">
                          <span>Stock:</span>
                          <span>{product.stock} units</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-playfair font-semibold text-lg mb-4">Care Instructions</h4>
                      <ul className="space-y-2 font-cormorant text-stone-600">
                        <li>• Machine wash cold with like colors</li>
                        <li>• Do not bleach</li>
                        <li>• Tumble dry low</li>
                        <li>• Iron on low heat if needed</li>
                        <li>• Do not dry clean</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {reviews.length > 0 ? (
                  <>
                    {/* Reviews Summary */}
                    <div className="bg-stone-50 rounded-2xl p-8">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-6 w-6 ${
                                i < Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                                  ? "text-amber-400 fill-current"
                                  : "text-stone-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-2xl font-playfair font-bold">
                          {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} out of 5
                        </span>
                        <span className="text-stone-600 font-cormorant">({reviews.length} reviews)</span>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="bg-white border border-stone-200 rounded-2xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-4 mb-2">
                                <h4 className="font-playfair font-semibold">{review.name}</h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? "text-amber-400 fill-current" : "text-stone-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-stone-500 text-sm font-cormorant">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            {user && review.userId === user._id && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingReviewId(review._id)
                                    setEditedReview({ rating: review.rating, comment: review.comment })
                                  }}
                                  className="text-stone-600 hover:text-stone-800 font-cormorant"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="text-red-600 hover:text-red-800 font-cormorant"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {editingReviewId === review._id ? (
                            <div className="space-y-4">
                              <select
                                value={editedReview.rating}
                                onChange={(e) => setEditedReview({ ...editedReview, rating: Number(e.target.value) })}
                                className="border border-stone-300 px-3 py-2 rounded-lg font-cormorant"
                              >
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
                                ))}
                              </select>
                              <textarea
                                value={editedReview.comment}
                                onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
                                className="w-full border border-stone-300 px-3 py-2 rounded-lg font-cormorant"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={handleUpdateReview}
                                  className="bg-stone-800 text-white px-4 py-2 rounded-lg font-cormorant"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => setEditingReviewId(null)}
                                  className="border border-stone-300 px-4 py-2 rounded-lg font-cormorant"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-stone-700 font-cormorant leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl">
                    <p className="text-stone-600 font-cormorant text-lg">No reviews yet. Be the first to review!</p>
                  </div>
                )}

                {/* Add Review Form */}
                {user ? (
                  <div className="bg-stone-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-playfair font-bold mb-6">Write a Review</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block font-cormorant font-semibold mb-2">Rating</label>
                        <select
                          value={newReview.rating}
                          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                          className="border border-stone-300 px-4 py-3 rounded-lg font-cormorant"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-cormorant font-semibold mb-2">Your Review</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Share your thoughts about this product..."
                          className="w-full border border-stone-300 px-4 py-3 rounded-lg font-cormorant"
                          rows={4}
                        />
                      </div>
                      <button
                        onClick={handleSubmitReview}
                        className="bg-stone-800 text-white px-8 py-3 rounded-lg font-cormorant hover:bg-stone-700 transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl">
                    <p className="text-stone-600 font-cormorant text-lg mb-4">Please log in to write a review</p>
                    <Link
                      to="/login"
                      className="inline-block bg-stone-800 text-white px-6 py-3 rounded-lg font-cormorant hover:bg-stone-700 transition-colors"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="bg-stone-50 rounded-2xl p-8">
                <h3 className="text-2xl font-playfair font-bold mb-6">Shipping Information</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-playfair font-semibold text-lg mb-4">Delivery Options</h4>
                    <ul className="space-y-3 font-cormorant">
                      <li className="flex justify-between">
                        <span>Standard Delivery:</span>
                        <span>5-7 business days (Free)</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Express Delivery:</span>
                        <span>2-3 business days (₹9.99)</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Next Day Delivery:</span>
                        <span>1 business day (₹19.99)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-playfair font-semibold text-lg mb-4">Return Policy</h4>
                    <ul className="space-y-2 font-cormorant text-stone-600">
                      <li>• 30-day return window</li>
                      <li>• Free returns for defective items</li>
                      <li>• Items must be in original condition</li>
                      <li>• Original packaging required</li>
                      <li>• Refund processed within 5-7 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
