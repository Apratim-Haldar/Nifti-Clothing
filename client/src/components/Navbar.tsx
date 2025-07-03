import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { ShoppingBag, Menu, X, Package, User } from "lucide-react"
import { useState } from "react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="relative z-50">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-slate-500/5 transform rotate-45"></div>
        <div className="absolute top-8 right-16 w-24 h-24 bg-slate-600/5 transform rotate-12"></div>
        <div className="absolute -top-2 left-1/3 w-16 h-16 bg-slate-400/5 transform -rotate-12"></div>
      </div>

      <nav className="relative bg-white/95 backdrop-blur-xl border-b border-slate-100/50 shadow-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <img src="logo.jpg" className="text-white font-bold text-xl"/>
                </div>
                <div className="absolute inset-0 bg-slate-500/20 rounded-lg scale-0 group-hover:scale-150 transition-transform duration-500"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl mt-3 font-light tracking-wider text-slate-900 group-hover:text-slate-700 transition-colors">
                  NIFTI
                </span>
                <span className="text-xs text-slate-600 font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Premium Fashion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              <Link
                to="/products"
                className={`relative text-lg font-medium transition-all duration-300 ${
                  isActive("/products") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Shop
                {isActive("/products") && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                )}
              </Link>

              <Link
                to="/cart"
                className={`relative flex items-center space-x-2 text-lg font-medium transition-all duration-300 ${
                  isActive("/cart") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
                {isActive("/cart") && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                )}
              </Link>

              {user && (
                <>
                  <Link
                    to="/orders"
                    className={`relative flex items-center space-x-2 text-lg font-medium transition-all duration-300 ${
                      isActive("/orders") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                    {isActive("/orders") && (
                      <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    className={`relative flex items-center space-x-2 text-lg font-medium transition-all duration-300 ${
                      isActive("/profile") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                    {isActive("/profile") && (
                      <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                    )}
                  </Link>

                  <Link
                    to="/affiliate"
                    className={`relative text-lg font-medium transition-all duration-300 ${
                      isActive("/affiliate") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    Referrals
                    {isActive("/affiliate") && (
                      <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                    )}
                  </Link>
                </>
              )}

              {user && user.isAdmin && (
                <Link
                  to="/admin"
                  className={`relative text-lg font-medium transition-all duration-300 ${
                    isActive("/admin") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  Admin
                  {isActive("/admin") && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                  )}
                </Link>
              )}
            </div>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">Hi, {user.name.split(" ")[0]}</span>
                      <span className="text-xs text-slate-500">Welcome back</span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-slate-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-slate-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Join Nifti
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-6 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col space-y-6">
                <Link
                  to="/products"
                  className={`flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
                    isActive("/products") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Shop</span>
                  {isActive("/products") && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                </Link>

                <Link
                  to="/cart"
                  className={`flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
                    isActive("/cart") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="relative flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Cart</span>
                    {cart.length > 0 && (
                      <span className="bg-slate-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  {isActive("/cart") && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                </Link>

                {user && (
                  <>
                    <Link
                      to="/orders"
                      className={`flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
                        isActive("/orders") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </div>
                      {isActive("/orders") && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                    </Link>

                    <Link
                      to="/profile"
                      className={`flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
                        isActive("/profile") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </div>
                      {isActive("/profile") && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                    </Link>

                    <Link
                      to="/affiliate"
                      className={`flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
                        isActive("/affiliate") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Referrals</span>
                      {isActive("/affiliate") && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                    </Link>
                  </>
                )}

                {user && user.isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
                      isActive("/admin") ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Admin</span>
                    {isActive("/admin") && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                  </Link>
                )}

                {user ? (
                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Hi, {user.name.split(" ")[0]}</p>
                        <p className="text-xs text-slate-500">Welcome back</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 rounded-xl font-medium hover:from-slate-900 hover:to-black transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <Link
                      to="/login"
                      className="block text-center text-slate-700 hover:text-slate-900 font-medium transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white py-3 rounded-xl text-center font-medium hover:from-slate-800 hover:to-black transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Join Nifti
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
