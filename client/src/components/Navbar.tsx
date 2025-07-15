import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ShoppingBag, User, Menu, X, Search, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { cart } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Nifti" },
    { href: "/products", label: "Collections" },
    { href: "/profile", label: "Profile" },
    { href: "/orders", label: "Orders" },
    { href: "/affiliate", label: "Referrals" },
  ]

  const isActive = (path: string) => location.pathname === path

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center border border-amber-300/50 group-hover:shadow-lg transition-all duration-300">
                <Scissors className="h-6 w-6 text-amber-800 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
            </div>
            <div>
              <span className="font-playfair text-2xl font-bold text-stone-800">Nfiti</span>
              <div className="text-xs font-cormorant text-stone-600 -mt-1">Clothing</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative py-2 px-4 font-cormorant font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-amber-700"
                    : "text-stone-700 hover:text-amber-700"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search (Hidden on mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-stone-100 rounded-full"
            >
              <Search className="h-5 w-5 text-stone-600" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-stone-100 rounded-full"
              >
                <ShoppingBag className="h-5 w-5 text-stone-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-stone-100 rounded-full"
                >
                  <User className="h-5 w-5 text-stone-600" />
                </Button>
                <div className="absolute right-0 top-full mt-6 bg-white rounded-xl shadow-lg border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 border-b border-stone-100">
                    <p className="font-cormorant font-semibold text-stone-800">{user.name}</p>
                    <p className="text-sm text-stone-600">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-stone-700 hover:bg-stone-50 font-cormorant"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-stone-700 hover:bg-stone-50 font-cormorant"
                    >
                      Orders
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-stone-700 hover:bg-stone-50 font-cormorant"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-cormorant"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="font-cormorant font-medium text-stone-700 hover:text-amber-700"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-stone-800 hover:bg-stone-900 text-white font-cormorant font-medium px-6 rounded-full">
                    Join Nifti
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-stone-100 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-stone-600" />
              ) : (
                <Menu className="h-6 w-6 text-stone-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-6 space-y-1 bg-white/95 backdrop-blur-xl border-t border-stone-200">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg font-cormorant font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-amber-50 text-amber-700"
                      : "text-stone-700 hover:bg-stone-50 hover:text-amber-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {!user && (
                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-stone-700 hover:bg-stone-50 hover:text-amber-700 rounded-lg font-cormorant font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-stone-800 text-white hover:bg-stone-900 rounded-lg font-cormorant font-medium text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Nifti
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Elegant Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
    </nav>
  )
}
