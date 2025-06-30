import { Link } from "react-router-dom"
import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="text-3xl font-extralight tracking-[0.2em] text-white hover:text-white/80 transition-colors"
            >
              NIFTI
            </Link>
            <p className="mt-6 text-white/70 font-light leading-relaxed">
              Where style meets sophistication. Discover premium pieces crafted for the modern individual.
            </p>
            <div className="mt-8 flex space-x-6">
              <a
                href="https://www.facebook.com/profile.php?id=100064234023114"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-light tracking-wide uppercase mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-white/70 hover:text-white font-light transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white/70 hover:text-white font-light transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/affiliate" className="text-white/70 hover:text-white font-light transition-colors">
                  Referral Program
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/70 hover:text-white font-light transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-light tracking-wide uppercase mb-6">Customer Care</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-white/70 hover:text-white font-light transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white font-light transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white font-light transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white font-light transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-light tracking-wide uppercase mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/70">
                <Mail className="w-4 h-4" />
                <span className="font-light">hello@nifti.in</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Phone className="w-4 h-4" />
                <span className="font-light">+91 XXX XXX XXXX</span>
              </div>
              <div className="flex items-start space-x-3 text-white/70">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="font-light">
                  Fashion District
                  <br />
                  Mumbai, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 font-light text-sm">
              &copy; {new Date().getFullYear()} Nifti Clothing. All rights reserved.
            </p>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-white/60 hover:text-white font-light transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white font-light transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-white font-light transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
