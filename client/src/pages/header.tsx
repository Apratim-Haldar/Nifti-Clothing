"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="relative z-50">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-teal-500/5 transform rotate-45"></div>
        <div className="absolute top-8 right-16 w-24 h-24 bg-teal-600/5 transform rotate-12"></div>
        <div className="absolute -top-2 left-1/3 w-16 h-16 bg-teal-400/5 transform -rotate-12"></div>
      </div>

      <nav className="relative bg-white/95 backdrop-blur-xl border-b border-teal-100/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <img
                  src="logo.png"
                  alt="Nifti Logo"
                  className="w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                />
                <div className="absolute inset-0 bg-teal-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-light tracking-wider text-slate-900 group-hover:text-teal-700 transition-colors">
                  NIFTI
                </span>
                <span className="text-xs text-teal-600 font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Premium Fashion
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              <Link
                to="/products"
                className={`relative text-lg font-medium transition-all duration-300 ${
                  isActive("/products") ? "text-teal-600" : "text-slate-700 hover:text-teal-600"
                }`}
              >
                Shop
                {isActive("/products") && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600"></div>
                )}
              </Link>

              <Link
                to="/cart"
                className={`relative flex items-center space-x-2 text-lg font-medium transition-all duration-300 ${
                  isActive("/cart") ? "text-teal-600" : "text-slate-700 hover:text-teal-600"
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
                {isActive("/cart") && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600"></div>
                )}
              </Link>

              {user && (
                <Link
                  to="/affiliate"
                  className={`relative text-lg font-medium transition-all duration-300 ${
                    isActive("/affiliate") ? "text-teal-600" : "text-slate-700 hover:text-teal-600"
                  }`}
                >
                  Referrals
                  {isActive("/affiliate") && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600"></div>
                  )}
                </Link>
              )}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">Hi, {user.name}</span>
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
                    className="text-slate-700 hover:text-teal-600 font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Join Nifti
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
