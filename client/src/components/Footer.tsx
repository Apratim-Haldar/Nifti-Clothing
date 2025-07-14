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
              <a
                href="https://www.instagram.com/nifti_officials?utm_source=qr&igsh=MXNrMGQxbm4zc2liMg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/message/TTBCDWDUYZXHE1?src=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
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
                <Link to="/orders" className="text-white/70 hover:text-white font-light transition-colors">
                  My Orders
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
                <Link to="/affiliate" className="text-white/70 hover:text-white font-light transition-colors">
                  Referral Program
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-white/70 hover:text-white font-light transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/cancellations" className="text-white/70 hover:text-white font-light transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white font-light transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-light tracking-wide uppercase mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/70">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:nifti07@gmail.com"
                  className="font-light hover:text-white transition-colors cursor-pointer"
                >
                  nifti07@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+918100371049"
                  className="font-light hover:text-white transition-colors cursor-pointer"
                >
                  +91 8100371049
                </a>
              </div>
              <div className="flex items-start space-x-3 text-white/70">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="font-light">
                  Sultan Alam Road, Lake Gardens
                  <br />
                  Kolkata, India
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
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link to="/general-policy" className="text-white/60 hover:text-white font-light transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/60 hover:text-white font-light transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping-policy" className="text-white/60 hover:text-white font-light transition-colors">
                Shipping Policy
              </Link>
              <Link to="/cancellations" className="text-white/60 hover:text-white font-light transition-colors">
                Cancellation & Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
