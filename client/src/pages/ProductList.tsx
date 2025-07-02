"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import ProductCard from "../components/ProductCard"

interface Product {
  _id: string
  title: string
  description: string
  price: number
  sizes: string[]
  colors: string[]
  colorImages: { color: string; imageUrl: string }[]
  imageUrl: string
  stock: number
  gender: "Men" | "Women" | "Unisex"
  inStock: boolean
  stockStatus: string
  categories?: string[]
}

interface Category {
  _id: string
  name: string
}

interface FetchParams {
  search?: string
  category?: string
  size?: string
  color?: string
  gender?: string
  inStock?: string
}

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [availableGenders, setAvailableGenders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false)

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    const urlCategory = searchParams.get('category') || ''
    const urlSize = searchParams.get('size') || ''
    const urlColor = searchParams.get('color') || ''
    const urlGender = searchParams.get('gender') || ''
    const urlInStock = searchParams.get('inStock') === 'true'

    console.log('URL params:', { urlSearch, urlCategory, urlSize, urlColor, urlGender, urlInStock });

    setSearch(urlSearch)
    setSelectedCategory(urlCategory)
    setSelectedSize(urlSize)
    setSelectedColor(urlColor)
    setSelectedGender(urlGender)
    setShowInStockOnly(urlInStock)
  }, [searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    const params: FetchParams = {}
    if (search) params.search = search
    if (selectedCategory) params.category = selectedCategory
    if (selectedSize) params.size = selectedSize
    if (selectedColor) params.color = selectedColor
    if (selectedGender) params.gender = selectedGender
    if (showInStockOnly) params.inStock = "true"

    console.log('Fetching products with params:', params);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        { params }
      )
      console.log(`Fetched ${res.data.length} products`);
      setProducts(res.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [
    search,
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedGender,
    showInStockOnly,
  ])

  useEffect(() => {
    // Fetch categories and filter options
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/filters/options`),
    ])
      .then(([categoriesRes, filtersRes]) => {
        setCategories(categoriesRes.data)
        setAvailableColors(filtersRes.data.colors || [])
        setAvailableSizes(filtersRes.data.sizes || [])
        setAvailableGenders(filtersRes.data.genders || [])
      })
      .catch((err) => console.error('Error fetching filter options:', err))
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedSize) params.set('size', selectedSize)
    if (selectedColor) params.set('color', selectedColor)
    if (selectedGender) params.set('gender', selectedGender)
    if (showInStockOnly) params.set('inStock', 'true')
    
    setSearchParams(params)
  }, [search, selectedCategory, selectedSize, selectedColor, selectedGender, showInStockOnly, setSearchParams])

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setSelectedSize("")
    setSelectedColor("")
    setSelectedGender("")
    setShowInStockOnly(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extralight mb-6 text-slate-900 tracking-tight">
            Our Collection
          </h1>
          <div className="w-24 h-px bg-slate-900 mx-auto mb-8"></div>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Discover premium pieces crafted for the modern individual
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Gender Filter */}
              <select
                value={selectedGender}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedGender(e.target.value)
                }
                className="border-2 border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-all duration-300"
              >
                <option value="">All Genders</option>
                {availableGenders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCategory(e.target.value)
                }
                className="border-2 border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-all duration-300"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Size Filter */}
              <select
                value={selectedSize}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedSize(e.target.value)
                }
                className="border-2 border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-all duration-300"
              >
                <option value="">All Sizes</option>
                {availableSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              {/* Color Filter */}
              <select
                value={selectedColor}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedColor(e.target.value)
                }
                className="border-2 border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-all duration-300"
              >
                <option value="">All Colors</option>
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <div className="flex items-center space-x-2 px-4 py-3">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                />
                <label htmlFor="inStock" className="text-sm text-slate-900">
                  In Stock Only
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="border-2 border-slate-200 px-4 py-3 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all duration-300"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-light">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-8">
                <svg
                  className="w-24 h-24 text-slate-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-slate-900 mb-4">
                No products found
              </h3>
              <p className="text-slate-600 font-light">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-slate-600">
                  Showing {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </p>
                {(search ||
                  selectedCategory ||
                  selectedSize ||
                  selectedColor ||
                  selectedGender ||
                  showInStockOnly) && (
                  <button
                    onClick={clearFilters}
                    className="text-slate-600 hover:text-slate-900 text-sm underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductList
