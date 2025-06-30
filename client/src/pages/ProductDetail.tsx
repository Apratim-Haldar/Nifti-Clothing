import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Define the Product interface with new fields
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  sizes: string[];
  colors?: string[];
  colorImages?: Array<{ color: string; imageUrl: string }>;

  imageUrl: string;
  stock: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  gender: "Men" | "Women" | "Unisex";
  categories?: string[];
}

// Define the cart item interface for type safety
interface CartItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  size: string;
  quantity: number;
  color?: string;
}

interface Review {
  _id: string;
  name: string;
  userId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface NewReview {
  rating: number;
  comment: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart, isLoading: cartLoading } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<NewReview>({ rating: 5, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editedReview, setEditedReview] = useState<NewReview>({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get<Product>(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        const productData = response.data;
        setProduct(productData);

        // Set initial image
        setCurrentImage(productData.imageUrl);

        // Set default size if available
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }

        // Set default color if available
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);

          // Check if there's a color-specific image
          if (productData.colorImages) {
            const colorImage = productData.colorImages.find((img) => img.color === productData.colors![0]);
            if (colorImage) {
              setCurrentImage(colorImage.imageUrl);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
        addToast("Failed to load product details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    if (id) {
      axios
        .get<Review[]>(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => {
          console.error("Failed to fetch reviews:", err);
          addToast("Failed to load reviews", "error");
        });
    }
  }, [id, addToast]);

  // Handle color change and update image
  useEffect(() => {
    if (product && selectedColor && product.colorImages) {
      const colorImage = product.colorImages.find((img) => img.color === selectedColor);
      if (colorImage) {
        setCurrentImage(colorImage.imageUrl);
      } else {
        // Fallback to main product image
        setCurrentImage(product.imageUrl);
      }
    }
  }, [selectedColor, product]);

  const handleAdd = async (): Promise<void> => {
    if (!product) return;

    if (!selectedSize) {
      addToast("Please select a size!", "warning");
      return;
    }

    if (product.stockStatus === "Out of Stock") {
      addToast("This product is out of stock", "error");
      return;
    }

    if (quantity > product.stock) {
      addToast(`Only ${product.stock} items available in stock`, "warning");
      return;
    }

    setIsAdding(true);
    try {
      const cartItem: CartItem = {
        productId: product._id,
        title: product.title,
        imageUrl: currentImage,
        price: product.price,
        size: selectedSize,
        quantity: quantity,
        color: selectedColor || undefined,
      };

      await addToCart(cartItem);
      addToast(`${product.title} added to cart!`, "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      addToast("Failed to add item to cart", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSizeSelect = (size: string): void => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      addToast("Cannot exceed available stock", "warning");
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-600";
      case "Low Stock":
        return "text-yellow-600";
      case "Out of Stock":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleSubmitReview = async (): Promise<void> => {
    if (!newReview.comment) {
      addToast("Please write a comment!", "warning");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reviews`,
        {
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        { withCredentials: true }
      );

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`);
      setReviews(res.data);
      setNewReview({ rating: 5, comment: "" });
      addToast("Review submitted successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to submit review", "error");
    }
  };

  const handleDeleteReview = async (reviewId: string): Promise<void> => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/reviews/${reviewId}`, { withCredentials: true });
      setReviews(reviews.filter((r) => r._id !== reviewId));
      addToast("Review deleted successfully", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete review", "error");
    }
  };

  const handleUpdateReview = async (): Promise<void> => {
    if (!editingReviewId) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/reviews/${editingReviewId}`, editedReview, {
        withCredentials: true,
      });
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`);
      setReviews(res.data);
      setEditingReviewId(null);
      addToast("Review updated successfully", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update review", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-slate-600 font-light">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-light">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 text-lg font-light">Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="relative">
            <img
              src={currentImage || product.imageUrl}
              alt={product.title}
              className="w-full h-auto object-cover rounded-lg"
            />

            {/* Color Images Thumbnails */}
            {product.colorImages && product.colorImages.length > 0 && (
              <div className="flex mt-4 space-x-2 overflow-x-auto">
                <button
                  onClick={() => setCurrentImage(product.imageUrl)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded ${
                    currentImage === product.imageUrl ? "border-slate-900" : "border-slate-300"
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt="Main"
                    className="w-full h-full object-cover rounded"
                  />
                </button>
                {product.colorImages.map((colorImage, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(colorImage.imageUrl)}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded ${
                      currentImage === colorImage.imageUrl ? "border-slate-900" : "border-slate-300"
                    }`}
                  >
                    <img
                      src={colorImage.imageUrl}
                      alt={colorImage.color}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-slate-100 text-slate-800 px-3 py-1 text-sm font-medium rounded">
                  {product.gender}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${getStockStatusColor(product.stockStatus)}`}
                >
                  {product.stockStatus}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extralight mb-4 text-slate-900 tracking-tight">
                {product.title}
              </h1>
              <div className="w-16 h-px bg-slate-900 mb-6"></div>
              <p className="text-3xl font-light text-slate-900 mb-6">₹{product.price}</p>
              <p className="text-lg text-slate-600 leading-relaxed font-light mb-8">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium tracking-wide uppercase text-slate-900 mb-4">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`px-4 py-2 border-2 text-sm font-medium tracking-wide transition-all duration-300 rounded ${
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
            <div className="mb-8">
              <label className="block text-sm font-medium tracking-wide uppercase text-slate-900 mb-4">
                Select Size
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`w-12 h-12 border-2 flex items-center justify-center text-sm font-medium tracking-wide transition-all duration-300 ${
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
            <div className="mb-8">
              <label className="block text-sm font-medium tracking-wide uppercase text-slate-900 mb-4">
                Quantity
              </label>
              <div className="flex items-center border-2 border-slate-300 w-fit rounded">
                <button
                  onClick={decrementQuantity}
                  disabled={isAdding || cartLoading}
                  className="w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <span className="w-16 h-12 flex items-center justify-center text-lg font-medium bg-slate-50 border-x border-slate-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={isAdding || cartLoading || quantity >= product.stock}
                  className="w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-sm text-yellow-600 mt-2">Only {product.stock} items left in stock!</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={product.stockStatus === "Out of Stock" || isAdding || cartLoading}
              className={`w-full py-4 text-lg font-medium tracking-wide uppercase transition-all duration-500 flex items-center justify-center rounded ${
                product.stockStatus !== "Out of Stock" && !isAdding && !cartLoading
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <h4 className="font-medium tracking-wide uppercase text-slate-900 mb-2">Shipping</h4>
                  <p className="text-slate-600 font-light">Free shipping on orders over ₹2000</p>
                </div>
                <div>
                  <h4 className="font-medium tracking-wide uppercase text-slate-900 mb-2">Returns</h4>
                  <p className="text-slate-600 font-light">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 pt-16 border-t border-slate-200">
          <h2 className="text-3xl font-extralight mb-12 text-slate-900 tracking-tight">Customer Reviews</h2>

          {reviews.length > 0 ? (
            <>
              <div className="mb-12 p-8 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
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
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <span className="text-slate-600 font-light">({reviews.length} reviews)</span>
                </div>
              </div>

              <div className="space-y-8 mb-16">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-slate-200 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? "text-yellow-400" : "text-slate-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-medium text-slate-900">{r.name}</span>
                      <span className="text-sm text-slate-500 font-light">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-light mb-4">{r.comment}</p>

                    {(user?.isAdmin || r.userId === user?._id) && (
                      <div className="flex gap-4 text-sm">
                        <button
                          onClick={() => {
                            setEditingReviewId(r._id);
                            setEditedReview({ rating: r.rating, comment: r.comment });
                          }}
                          className="text-slate-600 hover:text-slate-900 font-light"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          className="text-red-600 hover:text-red-800 font-light"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {editingReviewId === r._id && (
                      <div className="mt-6 p-6 bg-slate-50 rounded-lg">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-900 mb-2">Rating</label>
                          <select
                            value={editedReview.rating}
                            onChange={(e) => setEditedReview({ ...editedReview, rating: Number(e.target.value) })}
                            className="border border-slate-300 px-3 py-2 focus:outline-none focus:border-slate-900 rounded"
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>
                                {n} Stars
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-900 mb-2">Comment</label>
                          <textarea
                            value={editedReview.comment}
                            onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
                            className="w-full border border-slate-300 px-4 py-3 focus:outline-none focus:border-slate-900 rounded"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={handleUpdateReview}
                            className="bg-slate-900 text-white px-6 py-2 text-sm font-medium tracking-wide uppercase hover:bg-slate-800 transition-colors rounded"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="border border-slate-300 text-slate-700 px-6 py-2 text-sm font-medium tracking-wide uppercase hover:bg-slate-50 transition-colors rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-600 font-light mb-16">No reviews yet. Be the first to review this product!</p>
          )}

          {/* Write Review */}
          {user ? (
            <div className="bg-slate-50 p-8 rounded-lg">
              <h3 className="text-2xl font-light mb-6 text-slate-900 tracking-tight">Write a Review</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-2">Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="border border-slate-300 px-3 py-2 focus:outline-none focus:border-slate-900 rounded"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Stars
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-2">Your Review</label>
                <textarea
                  placeholder="Share your thoughts about this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full border border-slate-300 px-4 py-3 focus:outline-none focus:border-slate-900 rounded"
                  rows={5}
                />
              </div>
              <button
                onClick={handleSubmitReview}
                className="bg-slate-900 text-white px-8 py-3 font-medium tracking-wide uppercase hover:bg-slate-800 transition-colors rounded"
              >
                Submit Review
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 p-8 text-center rounded-lg">
              <p className="text-slate-600 font-light">Please log in to leave a review.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
