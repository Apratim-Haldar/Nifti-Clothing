import type React from "react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import NewsletterSignup from "../components/NewsletterSignup"

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
  buttonText?: string
}

interface Advertisement {
  _id: string
  title: string
  description: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  isActive: boolean
  priority: number
}

interface HeroItem {
  _id: string
  title: string
  description: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  type: "product" | "advertisement"
  price?: number
  sizes?: string[]
  heroTagline?: string
}

const Home: React.FC = () => {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([])
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [featuredCollection, setFeaturedCollection] = useState<Product[]>([])

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true)

        // Fetch hero products and active advertisements in parallel
        const [productsResponse, adsResponse] = await Promise.all([
          axios.get<Product[]>(`${import.meta.env.VITE_API_BASE_URL}/products`, {
            params: { isHero: true },
          }),
          axios.get<Advertisement[]>(`${import.meta.env.VITE_API_BASE_URL}/admin/advertisements/active`),
        ])

        // Transform products to hero items
        const productHeroItems: HeroItem[] = productsResponse.data.map((product) => ({
          _id: product._id,
          title: product.heroTagline || product.title,
          description: product.description,
          imageUrl: product.heroImage || product.imageUrl,
          buttonText: `Shop Now - ₹${product.price}`,
          buttonLink: `/products/${product._id}`,
          type: "product",
          price: product.price,
          sizes: product.sizes,
          heroTagline: product.heroTagline,
        }))

        // Transform advertisements to hero items
        const adHeroItems: HeroItem[] = adsResponse.data.map((ad) => ({
          _id: ad._id,
          title: ad.title,
          description: ad.description,
          imageUrl: ad.imageUrl,
          buttonText: ad.buttonText,
          buttonLink: ad.buttonLink,
          type: "advertisement",
        }))

        // Combine and sort by priority (advertisements first, then products)
        const allHeroItems = [
          ...adHeroItems.sort(
            (a, b) =>
              (adsResponse.data.find((ad) => ad._id === b._id)?.priority || 0) -
              (adsResponse.data.find((ad) => ad._id === a._id)?.priority || 0),
          ),
          ...productHeroItems,
        ]

        setFeaturedCollection(productsResponse.data.filter((product) => !product.buttonText))
        setHeroItems(allHeroItems)
      } catch (err) {
        console.error("Error fetching hero content:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroContent()
  }, [])

  // Auto-rotate hero items
  useEffect(() => {
    if (heroItems.length > 1) {
      const timer = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroItems.length)
      }, 6000)
      return () => clearInterval(timer)
    }
  }, [heroItems.length])

  const currentHeroItem = heroItems[currentHeroIndex]

  return (
    <div className="bg-white overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-teal-600/5 transform rotate-45 rounded-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-teal-400/5 to-teal-500/5 transform -rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-gradient-to-br from-teal-600/5 to-teal-700/5 transform rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-gradient-to-br from-teal-500/5 to-teal-600/5 transform -rotate-45 rounded-3xl"></div>
      </div>

      {/* Enhanced Hero Section */}
      {loading ? (
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
              <img src="/logo.jpg" alt="Loading" className="absolute inset-0 w-12 h-12 m-auto animate-pulse" />
            </div>
            <h2 className="text-4xl font-light text-slate-800 mb-4 tracking-wider animate-pulse">NIFTI CLOTHING</h2>
            <p className="text-slate-600 font-light tracking-wide animate-pulse">Curating your perfect style...</p>
          </div>
        </section>
      ) : heroItems.length > 0 ? (
        <section className="relative h-screen overflow-hidden">
          {/* Dynamic Background with Parallax */}
          <div className="absolute inset-0">
            <img
              src={currentHeroItem.imageUrl || "/placeholder.svg"}
              alt={currentHeroItem.title}
              className="w-full h-full object-cover transition-all duration-1000 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Floating Logo Element */}
          <div className="absolute top-8 right-8 z-20">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
              <img src="/logo.jpg" alt="Nifti" className="w-8 h-8 opacity-80" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-4xl">
                {/* Brand Badge */}
                <div className="mb-8 animate-fade-in-up">
                  <div className="inline-flex items-center bg-white/15 backdrop-blur-xl border border-white/30 rounded-full px-8 py-3 shadow-2xl">
                    <img src="/logo.jpg" alt="Nifti" className="w-6 h-6 mr-3" />
                    <span className="text-white font-medium tracking-[0.3em] text-sm uppercase">
                      {currentHeroItem.type === "advertisement" ? "Featured Collection" : "Nifti Premium"}
                    </span>
                  </div>
                </div>

                {/* Main Headline */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight text-white mb-8 leading-[0.8] tracking-tighter animate-fade-in-up animation-delay-200">
                  {currentHeroItem.title}
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-white/95 mb-12 leading-relaxed max-w-3xl font-light animate-fade-in-up animation-delay-400">
                  {currentHeroItem.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 mb-12 animate-fade-in-up animation-delay-600">
                  <Link
                    to={currentHeroItem.buttonLink}
                    className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-600 text-white px-12 py-5 text-lg font-semibold tracking-wider uppercase transition-all duration-700 hover:from-teal-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 rounded-xl"
                  >
                    <span className="relative z-10">{currentHeroItem.buttonText}</span>
                  </Link>
                  <Link
                    to="/products"
                    className="group border-2 border-white text-white px-12 py-5 text-lg font-semibold tracking-wider uppercase transition-all duration-700 hover:bg-white hover:text-slate-900 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 rounded-xl"
                  >
                    <span className="relative z-10">Explore Collection</span>
                  </Link>
                </div>

                {/* Product Details */}
                {currentHeroItem.type === "product" && currentHeroItem.sizes && (
                  <div className="flex items-center space-x-8 text-white/95 animate-fade-in-up animation-delay-800">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium tracking-wider uppercase">Available Sizes:</span>
                      <div className="flex space-x-3">
                        {currentHeroItem.sizes.map((size) => (
                          <span
                            key={size}
                            className="bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold tracking-wide border border-white/40 rounded-lg transition-all duration-300 hover:bg-white/30"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Elements */}
          {heroItems.length > 1 && (
            <>
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
                {heroItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroIndex(index)}
                    className={`w-12 h-3 rounded-full transition-all duration-700 ${
                      index === currentHeroIndex ? "bg-teal-500 shadow-2xl scale-110" : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1))}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/15 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center transition-all duration-500 hover:bg-white/25 hover:scale-125 z-10 rounded-full shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % heroItems.length)}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/15 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center transition-all duration-500 hover:bg-white/25 hover:scale-125 z-10 rounded-full shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </section>
      ) : (
        // Fallback Static Hero
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-slate-800 to-black">
          <div className="text-center text-white px-6 max-w-5xl">
            <div className="mb-8">
              <img src="/logo.jpg" alt="Nifti" className="w-24 h-24 mx-auto mb-6 animate-pulse" />
            </div>
            <h1 className="text-7xl md:text-9xl font-extralight mb-10 tracking-tighter animate-fade-in-up">NIFTI</h1>
            <p className="text-2xl md:text-3xl mb-16 font-light tracking-wide opacity-95 animate-fade-in-up animation-delay-200">
              The Fit That Fits You
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-12 py-6 text-xl font-semibold tracking-wider uppercase transition-all duration-700 hover:from-teal-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-400 rounded-xl"
            >
              Discover Collection
            </Link>
          </div>
        </section>
      )}

      {/* Creative Featured Collection */}
      {featuredCollection.length > 0 && (
        <section className="relative py-32 px-6">
          {/* Section Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/30"></div>

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-px bg-teal-500"></div>
                <img src="/logo.jpg" alt="Nifti" className="w-8 h-8 mx-6" />
                <div className="w-16 h-px bg-teal-500"></div>
              </div>
              <h2 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">
                Featured Collection
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
                Discover our handpicked selection of premium pieces, each meticulously crafted to elevate your wardrobe
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredCollection.map((product, index) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group block bg-white overflow-hidden transition-all duration-700 hover:shadow-2xl rounded-3xl border border-slate-100 hover:border-teal-200 transform hover:-translate-y-6 hover:scale-105"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={product.heroImage || product.imageUrl}
                      alt={product.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                    {/* Floating Logo */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <img src="/logo.jpg" alt="Nifti" className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-light mb-4 text-slate-900 tracking-wide group-hover:text-teal-700 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-slate-600 mb-6 font-light leading-relaxed text-sm line-clamp-3">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-light text-slate-900">₹{product.price}</span>
                      <div className="flex items-center text-sm font-medium tracking-wider uppercase text-slate-600 group-hover:text-teal-600 transition-colors">
                        Shop Now
                        <svg
                          className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Creative Brand Values Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
        {/* Geometric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-teal-500/10 transform rotate-45 rounded-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-teal-400/10 transform -rotate-12 rounded-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-teal-400"></div>
              <img src="logo.jpg" alt="Nifti" className="w-8 h-8 mx-6 filter" />
              <div className="w-16 h-px bg-teal-400"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-extralight mb-8 text-white tracking-tight">The Nifti Promise</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
              Every piece embodies our unwavering commitment to exceptional quality and timeless design
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                icon: (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.5 2.5L16 4.5 14.5 3 12 5.5 10.5 4 9 5.5 7.5 4 6 5.5L4.5 4 3 5.5M7.5 12L15 4.5 19.5 9 12 16.5z"
                    />
                  </svg>
                ),
                title: "Premium Craftsmanship",
                description:
                  "Meticulously crafted from the finest materials, each piece is designed to stand the test of time.",
              },
              {
                icon: (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Express Delivery",
                description:
                  "Swift, secure shipping with premium packaging ensures your order arrives in perfect condition.",
              },
              {
                icon: (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                ),
                title: "Customer Excellence",
                description:
                  "Our dedicated team provides personalized service because your satisfaction is our priority.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative w-32 h-32 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-8 group-hover:bg-teal-500 transition-all duration-700 rounded-3xl shadow-2xl group-hover:shadow-3xl transform group-hover:-translate-y-2 group-hover:scale-110">
                  <div className="text-white group-hover:text-white transition-colors duration-700">{item.icon}</div>
                  {/* Logo overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                    <img src="/logo.jpg" alt="Nifti" className="w-12 h-12 filter brightness-0 invert" />
                  </div>
                </div>
                <h3 className="text-2xl font-light mb-6 tracking-wide text-white">{item.title}</h3>
                <p className="text-white/80 leading-relaxed font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Social Media Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-teal-50 via-white to-slate-50">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-teal-500"></div>
              <img src="/logo.jpg" alt="Nifti" className="w-8 h-8 mx-6" />
              <div className="w-16 h-px bg-teal-500"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">
              Join the Nifti Community
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Connect with us and be part of the style revolution
            </p>
          </div>

          {/* Centered Social Media Grid */}
          <div className="flex justify-center mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-4xl">
              {[
                {
                  platform: "Instagram",
                  handle: "@nifticlothing",
                  description: "Follow for daily style inspiration",
                  link: "https://www.instagram.com/nifti_officials?utm_source=qr&igsh=MXNrMGQxbm4zc2liMg==", // Placeholder dummy link
                  icon: (
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                  qrImage: "instagramQR.jpg",
                },
                {
                  platform: "Facebook",
                  handle: "Nifti Clothing",
                  description: "Join our community",
                  link: "https://www.facebook.com/profile.php?id=100064234023114",
                  icon: (
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                  qrImage: "facebookQR.png",
                },
                {
                  platform: "WhatsApp",
                  handle: "Nifti Clothing",
                  description: "Direct support & updates",
                  link: "https://wa.me/message/TTBCDWDUYZXHE1?src=qr",
                  icon: (
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                  ),
                  qrImage: "whatsappQR.jpg",
                },
              ].map((social, index) => (
                <div key={index} className="text-center group" style={{ animationDelay: `${index * 150}ms` }}>
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer"
                  >
                    <div className="relative w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-6 group-hover:from-teal-600 group-hover:to-teal-700 transition-all duration-700 rounded-3xl shadow-2xl group-hover:shadow-3xl transform group-hover:-translate-y-2 group-hover:scale-110">
                      <div className="text-white">{social.icon}</div>
                      {/* Logo overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                        <img src="/logo.jpg" alt="Nifti" className="w-12 h-12 filter brightness-0 invert" />
                      </div>
                    </div>
                  </a>
                  <h3 className="text-xl font-light mb-4 tracking-wide text-slate-900">{social.handle}</h3>
                  <img
                    src={social.qrImage || "/placeholder.svg"}
                    alt={`${social.platform} QR Code`}
                    className="w-24 h-24 object-cover mx-auto mb-4 bg-white border-2 border-teal-200 rounded-2xl shadow-lg"
                  />
                  <p className="text-slate-600 text-sm font-light">{social.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto text-center bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl p-12 shadow-2xl">
            <div className="mb-8">
              <img src="/logo.jpg" alt="Nifti" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-light mb-4 tracking-wide text-slate-900">Stay in Style</h3>
              <p className="text-slate-600 mb-8 font-light text-lg">
                Subscribe for exclusive offers and early access to new collections
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
        {/* Geometric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-teal-500/10 transform rotate-45 rounded-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-400/10 transform -rotate-12 rounded-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <img src="logo.jpg" alt="Nifti" className="w-16 h-16 mx-auto mb-6 filter" />
          </div>
          <h2 className="text-5xl md:text-6xl font-extralight mb-8 text-white tracking-tight">
            Ready to Redefine Your Style?
          </h2>
          <p className="text-xl mb-12 text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
            Join thousands who have discovered their signature look with Nifti's premium collection
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link
              to="/products"
              className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-600 text-white px-12 py-5 text-lg font-semibold tracking-wider uppercase transition-all duration-700 hover:from-teal-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 rounded-xl"
            >
              <span className="relative z-10">Explore Collection</span>
            </Link>
            <Link
              to="/register"
              className="group border-2 border-white text-white px-12 py-5 text-lg font-semibold tracking-wider uppercase transition-all duration-700 hover:bg-white hover:text-slate-900 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 rounded-xl"
            >
              <span className="relative z-10">Join Nifti</span>
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "25k+", label: "Style Enthusiasts" },
              { number: "1200+", label: "Premium Pieces" },
              { number: "150+", label: "Cities Worldwide" },
              { number: "4.9★", label: "Customer Rating" },
            ].map((stat, index) => (
              <div key={index} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl font-extralight mb-3 text-white group-hover:text-teal-400 transition-colors">
                  {stat.number}
                </div>
                <div className="text-white/80 font-light tracking-wider uppercase text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home