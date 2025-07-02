"use client"

import type React from "react"
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
    const urlSearch = searchParams.get("search") || ""
    const urlCategory = searchParams.get("category") || ""
    const urlSize = searchParams.get("size") || ""
    const urlColor = searchParams.get("color") || ""
    const urlGender = searchParams.get("gender") || ""
    const urlInStock = searchParams.get("inStock") === "true"

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

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, { params })
      setProducts(res.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [search, selectedCategory, selectedSize, selectedColor, selectedGender, showInStockOnly])

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
      .catch((err) => console.error("Error fetching filter options:", err))
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedSize) params.set("size", selectedSize)
    if (selectedColor) params.set("color", selectedColor)
    if (selectedGender) params.set("gender", selectedGender)
    if (showInStockOnly) params.set("inStock", "true")

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-teal-600/5 transform rotate-45 rounded-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-teal-400/5 to-teal-500/5 transform -rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-gradient-to-br from-teal-600/5 to-teal-700/5 transform rotate-12 rounded-3xl"></div>
      </div>

      {/* Enhanced Header */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px bg-teal-500"></div>
            <img src="/logo.png" alt="Nifti" className="w-12 h-12 mx-6" />
            <div className="w-16 h-px bg-teal-500"></div>
          </div>
          <h1 className="text-6xl md:text-7xl font-extralight mb-8 text-slate-900 tracking-tight">Our Collection</h1>
          <p className="text-2xl text-slate-600 font-light max-w-3xl mx-auto">
            Discover premium pieces crafted for the modern individual who values sophistication and style
          </p>
        </div>
      </section>

      {/* Creative Filters Section */}
      <section className="relative py-16 border-y border-teal-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col gap-8">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for your perfect style..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  className="w-full border-2 border-teal-200 pl-14 pr-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all duration-300 rounded-2xl text-lg bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Filter Pills */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Gender Filter */}
                <div className="relative">
                  <select
                    value={selectedGender}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGender(e.target.value)}
                    className="w-full border-2 border-teal-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Genders</option>
                    {availableGenders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                    className="w-full border-2 border-teal-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Size Filter */}
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSize(e.target.value)}
                    className="w-full border-2 border-teal-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Sizes</option>
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Color Filter */}
                <div className="relative">
                  <select
                    value={selectedColor}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedColor(e.target.value)}
                    className="w-full border-2 border-teal-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Colors</option>
                    {availableColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center justify-center px-4 py-3 border-2 border-teal-200 rounded-xl bg-white/50 backdrop-blur-sm">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500 mr-3"
                  />
                  <label htmlFor="inStock" className="text-sm text-slate-900 font-medium cursor-pointer">
                    In Stock Only
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="border-2 border-slate-300 px-4 py-3 text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 rounded-xl font-medium bg-white/50 backdrop-blur-sm hover:bg-teal-50"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
                  <img
                    src="/logo.png"
                    alt="Loading"
                    className="absolute inset-0 w-12 h-12 m-auto animate-pulse"
                  />
                </div>
                <p className="text-slate-600 font-light text-lg">Discovering amazing products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl p-16 shadow-2xl max-w-2xl mx-auto">
                <div className="mb-10">
                  <svg
                    className="w-32 h-32 text-slate-300 mx-auto mb-6"
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
                  <img src="/logo.png" alt="Nifti" className="w-12 h-12 mx-auto mb-6 opacity-50" />
                </div>
                <h3 className="text-3xl font-light text-slate-900 mb-6">No products found</h3>
                <p className="text-slate-600 font-light text-lg mb-8">
                  Try adjusting your search or filter criteria to discover more amazing pieces
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 font-medium transform hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-8 flex justify-between items-center bg-white/80 backdrop-blur-xl border border-teal-100 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <img src="/logo.png" alt="Nifti" className="w-6 h-6" />
                  <p className="text-slate-600 text-lg">
                    Showing <span className="font-medium text-teal-600">{products.length}</span>{" "}
                    {products.length === 1 ? "product" : "products"}
                  </p>
                </div>
                {(search || selectedCategory || selectedSize || selectedColor || selectedGender || showInStockOnly) && (
                  <button
                    onClick={clearFilters}
                    className="text-slate-600 hover:text-teal-600 underline font-medium transition-colors"
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
