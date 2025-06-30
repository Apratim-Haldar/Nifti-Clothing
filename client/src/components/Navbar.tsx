import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ShoppingBag, User, Menu, X } from "lucide-react"
import { useState } from "react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className=" border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extralight tracking-[0.2em] text-slate-900 hover:text-slate-700 transition-colors"
          >
            NIFTI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              to="/products"
              className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors relative group"
            >
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/cart"
              className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors relative group flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Cart
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/affiliate"
              className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors relative group"
            >
              Referrals
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user && user.isAdmin && (
              <Link
                to="/admin"
                className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-700">
                  <User className="w-4 h-4" />
                  <span className="font-light">Hi, {user.name.split(" ")[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 text-white px-6 py-2 font-light tracking-wide uppercase text-sm hover:bg-slate-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-6">
            <div className="flex flex-col space-y-6">
              <Link
                to="/products"
                className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/cart"
                className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-4 h-4" />
                Cart
              </Link>
              <Link
                to="/affiliate"
                className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Referrals
              </Link>
              {user && user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="pt-6 border-t border-slate-200">
                {user ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <User className="w-4 h-4" />
                      <span className="font-light">Hi, {user.name.split(" ")[0]}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link
                      to="/login"
                      className="text-slate-700 hover:text-slate-900 font-light tracking-wide transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-slate-900 text-white px-6 py-3 font-light tracking-wide uppercase text-sm hover:bg-slate-800 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
