"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

// Define interfaces for type safety
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
}

const Home: React.FC = () => {
  const [heroProducts, setHeroProducts] = useState<Product[]>([])
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get<Product[]>(`${import.meta.env.VITE_API_BASE_URL}/products`, {
          params: { isHero: true },
        })
        setHeroProducts(response.data)
      } catch (err) {
        console.error("Error fetching hero products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHeroProducts()
  }, [])

  // Auto-rotate hero products
  useEffect(() => {
    if (heroProducts.length > 1) {
      const timer = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroProducts.length)
      }, 6000)
      return () => clearInterval(timer)
    }
  }, [heroProducts.length])

  const currentHeroProduct = heroProducts[currentHeroIndex]

  return (
    <div className="bg-white overflow-hidden">
      {/* Dynamic Hero Section */}
      {loading ? (
        <section className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-slate-600 rounded-full animate-spin mx-auto mt-2 ml-2"></div>
            </div>
            <h2 className="text-2xl font-light text-slate-800 mb-2">NIFTI CLOTHING</h2>
            <p className="text-slate-600 font-light tracking-wide">Curating your perfect style...</p>
          </div>
        </section>
      ) : heroProducts.length > 0 ? (
        <section className="relative h-screen overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={currentHeroProduct.heroImage || currentHeroProduct.imageUrl}
              alt={currentHeroProduct.title}
              className="w-full h-full object-cover transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-4xl">
                {/* Brand Badge */}
                <div className="mb-8">
                  <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
                    <span className="text-white font-light tracking-[0.2em] text-sm uppercase">Nifti Collection</span>
                  </div>
                </div>

                {/* Main Headline */}
                <h1 className="text-6xl md:text-8xl font-extralight text-white mb-8 leading-[0.9] tracking-tight">
                  {currentHeroProduct.heroTagline || currentHeroProduct.title}
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl font-light">
                  {currentHeroProduct.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 mb-12">
                  <Link
                    to={`/products/${currentHeroProduct._id}`}
                    className="group relative overflow-hidden bg-white text-black px-10 py-5 text-lg font-medium tracking-wide uppercase transition-all duration-500 hover:bg-black hover:text-white border-2 border-transparent hover:border-white"
                  >
                    <span className="relative z-10">Shop Now - ₹{currentHeroProduct.price}</span>
                    <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </Link>
                  <Link
                    to="/products"
                    className="group border-2 border-white text-white px-10 py-5 text-lg font-medium tracking-wide uppercase transition-all duration-500 hover:bg-white hover:text-black relative overflow-hidden"
                  >
                    <span className="relative z-10">View Collection</span>
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex items-center space-x-8 text-white/80">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-light tracking-wide uppercase">Available Sizes:</span>
                    <div className="flex space-x-2">
                      {currentHeroProduct.sizes.map((size) => (
                        <span
                          key={size}
                          className="bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-wide border border-white/30"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Elements */}
          {heroProducts.length > 1 && (
            <>
              {/* Navigation Dots */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
                {heroProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroIndex(index)}
                    className={`w-12 h-1 transition-all duration-500 ${index === currentHeroIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
                      }`}
                  />
                ))}
              </div>

              {/* Side Navigation */}
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === 0 ? heroProducts.length - 1 : prev - 1))}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % heroProducts.length)}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </section>
      ) : (
        // Fallback Static Hero
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          <div className="text-center text-white px-6 max-w-4xl">
            <h1 className="text-7xl md:text-9xl font-extralight mb-8 tracking-tight">NIFTI</h1>
            <p className="text-2xl md:text-3xl mb-12 font-light tracking-wide opacity-90">
              Where Style Meets Sophistication
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-black px-12 py-6 text-lg font-medium tracking-wide uppercase transition-all duration-500 hover:bg-transparent hover:text-white border-2 border-white"
            >
              Explore Collection
            </Link>
          </div>
        </section>
      )}

      {/* Featured Collection Grid */}
      {heroProducts.length > 1 && (
        <section className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-extralight mb-6 text-slate-900 tracking-tight">
                Featured Collection
              </h2>
              <div className="w-24 h-px bg-slate-900 mx-auto mb-8"></div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
                Discover our handpicked selection of premium pieces, each meticulously crafted to elevate your wardrobe
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {heroProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group block bg-white overflow-hidden transition-all duration-700 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.heroImage || product.imageUrl}
                      alt={product.title}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-light mb-3 text-slate-900 tracking-wide">{product.title}</h3>
                    <p className="text-slate-600 mb-6 font-light leading-relaxed">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-light text-slate-900">₹{product.price}</span>
                      <span className="text-sm font-medium tracking-wide uppercase text-slate-600 group-hover:text-slate-900 transition-colors">
                        Shop Now →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Values Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extralight mb-6 text-slate-900 tracking-tight">
              The Nifti Promise
            </h2>
            <div className="w-24 h-px bg-slate-900 mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Every piece embodies our commitment to exceptional quality, timeless design, and sustainable fashion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-32 h-32 bg-slate-100 flex items-center justify-center mx-auto mb-8 group-hover:bg-slate-900 transition-all duration-500">
                <svg
                  className="w-16 h-16 text-slate-900 group-hover:text-white transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.5 2.5L16 4.5 14.5 3 12 5.5 10.5 4 9 5.5 7.5 4 6 5.5L4.5 4 3 5.5M7.5 12L15 4.5 19.5 9 12 16.5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light mb-6 tracking-wide">Premium Craftsmanship</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Meticulously crafted from the finest materials, each piece is designed to stand the test of time while
                maintaining exceptional comfort and style.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-32 h-32 bg-slate-100 flex items-center justify-center mx-auto mb-8 group-hover:bg-slate-900 transition-all duration-500">
                <svg
                  className="w-16 h-16 text-slate-900 group-hover:text-white transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light mb-6 tracking-wide">Express Delivery</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Swift, secure shipping with premium packaging ensures your order arrives in perfect condition, ready to
                elevate your wardrobe.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-32 h-32 bg-slate-100 flex items-center justify-center mx-auto mb-8 group-hover:bg-slate-900 transition-all duration-500">
                <svg
                  className="w-16 h-16 text-slate-900 group-hover:text-white transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light mb-6 tracking-wide">Customer Excellence</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Our dedicated team provides personalized service and seamless returns, because your satisfaction is our
                highest priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Community Section */}
      <section className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight">Join the Nifti Community</h2>
            <div className="w-24 h-px bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
              Connect with us across all platforms and be part of the style revolution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Instagram */}
            <div className="text-center group">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">@nifticlothing</h3>
              <img
                src="instagramQR.jpg"
                alt="Instagram QR Code"
                className="w-48 h-48 object-cover mx-auto mb-4 bg-white/10 border border-white/20"
              />
              <p className="text-white/70 text-sm font-light">Follow for daily style inspiration</p>
            </div>

            {/* Facebook */}
            <div className="text-center group">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">Nifti Clothing</h3>
              <img
                src="/placeholder.svg?height=120&width=120"
                alt="Facebook QR Code"
                className="w-24 h-24 mx-auto mb-4 bg-white/10 border border-white/20"
              />
              <p className="text-white/70 text-sm font-light">Join our community</p>
            </div>

            {/* Twitter */}
            <div className="text-center group">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">@nifticlothing</h3>
              <img
                src="/placeholder.svg?height=120&width=120"
                alt="Twitter QR Code"
                className="w-24 h-24 mx-auto mb-4 bg-white/10 border border-white/20"
              />
              <p className="text-white/70 text-sm font-light">Latest updates & trends</p>
            </div>

            {/* WhatsApp */}
            <div className="text-center group">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide">Nifti Clothing</h3>
              <img
                src="whatsappQR.jpg"
                alt="WhatsApp QR Code"
                className="w-48 h-48 object-cover mx-auto mb-4 bg-white/10 border border-white/20"
              />
              <p className="text-white/70 text-sm font-light">Direct support & updates</p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-light mb-6 tracking-wide">Stay in Style</h3>
            <p className="text-white/80 mb-8 font-light">
              Subscribe to receive exclusive offers, style tips, and early access to new collections
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all duration-300"
              />
              <button className="px-8 py-4 bg-white text-slate-900 font-medium tracking-wide uppercase hover:bg-white/90 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 bg-gradient-to-r from-slate-100 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">
            Ready to Redefine Your Style?
          </h2>
          <p className="text-xl mb-12 text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            Join thousands of fashion-forward individuals who have discovered their signature look with Nifti Clothing
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link
              to="/products"
              className="group relative overflow-hidden bg-slate-900 text-white px-12 py-6 text-lg font-medium tracking-wide uppercase transition-all duration-500 hover:bg-white hover:text-slate-900 border-2 border-slate-900"
            >
              <span className="relative z-10">Explore Collection</span>
            </Link>
            <Link
              to="/register"
              className="group border-2 border-slate-900 text-slate-900 px-12 py-6 text-lg font-medium tracking-wide uppercase transition-all duration-500 hover:bg-slate-900 hover:text-white"
            >
              <span className="relative z-10">Join Nifti</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-4xl font-extralight mb-3 text-slate-900">15k+</div>
              <div className="text-slate-600 font-light tracking-wide uppercase text-sm">Style Enthusiasts</div>
            </div>
            <div>
              <div className="text-4xl font-extralight mb-3 text-slate-900">800+</div>
              <div className="text-slate-600 font-light tracking-wide uppercase text-sm">Premium Pieces</div>
            </div>
            <div>
              <div className="text-4xl font-extralight mb-3 text-slate-900">100+</div>
              <div className="text-slate-600 font-light tracking-wide uppercase text-sm">Cities Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-extralight mb-3 text-slate-900">4.9★</div>
              <div className="text-slate-600 font-light tracking-wide uppercase text-sm">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
