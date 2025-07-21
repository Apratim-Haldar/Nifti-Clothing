// src/components/Footer.tsx
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Scissors,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 fabric-texture opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* ======= GRID ======= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-black">
                  <img
                    src="/logo.jpg"
                    alt="Nifti Logo"
                    className="w-12 h-12 object-cover"
                  />
                </div>
                <div>
                  <span className="font-playfair text-2xl font-bold text-white">Nifti</span>
                  <div className="text-xs font-cormorant text-stone-300 -mt-1">Clothing</div>
                </div>
              </div>

              <p className="text-stone-300 font-cormorant text-lg leading-relaxed mb-8">
                Where timeless craftsmanship meets contemporary elegance. Each piece tells a story of artistry and passion.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=100064234023114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
                >
                  <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://www.instagram.com/nifti_officials?utm_source=qr&igsh=MXNrMGQxbm4zc2liMg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
                >
                  <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://wa.me/message/TTBCDWDUYZXHE1?src=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Client Services */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-5 w-5 text-amber-400" />
                <h3 className="font-playfair font-semibold text-lg text-white">Client Services</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link to="/profile" className="text-stone-300 hover:text-amber-400 transition-colors font-cormorant">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-stone-300 hover:text-amber-400 transition-colors font-cormorant">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-stone-300 hover:text-amber-400 transition-colors font-cormorant">
                    Personal Styling
                  </Link>
                </li>
                <li>
                  <Link to="/affiliate" className="text-stone-300 hover:text-amber-400 transition-colors font-cormorant">
                    Referral Program
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-stone-300 hover:text-amber-400 transition-colors font-cormorant">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Scissors className="h-5 w-5 text-amber-400" />
                <h3 className="font-playfair font-semibold text-lg text-white">Nifti Contact</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-stone-300 font-cormorant">Sultan Alam Road</p>
                    <p className="text-stone-300 font-cormorant">Lake Gardens, Kolkata 700033</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <a href="tel:+918100371049" className="text-stone-300 hover:text-amber-400 transition-colors font-cormorant">
                    +91 8100371049
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <a href="mailto:nifi07@gmail.com" className="text-stone-300 hover:text-amber-400 transition-colors font-cormorant">
                    nifi07@gmail.com
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <h4 className="font-cormorant font-semibold text-white mb-2">Working Hours</h4>
                <p className="text-stone-300 text-sm font-cormorant">Mon - Sat: 10:00 AM - 8:00 PM</p>
                <p className="text-stone-300 text-sm font-cormorant">Sun: 12:00 PM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Decorative Stitching Line */}
          <div className="mt-16 mb-8 flex items-center justify-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <div className="w-2 h-2 bg-amber-300 rounded-full" />
            <div className="w-2 h-2 bg-amber-200 rounded-full" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center space-x-6 text-sm text-stone-400 font-cormorant">
                <Link to="/general-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/shipping" className="hover:text-amber-400 transition-colors">
                  Shipping
                </Link>
                <Link to="/cancellations" className="hover:text-amber-400 transition-colors">
                  Cancellations & Returns
                </Link>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </div>
              <div className="text-stone-400 text-sm font-cormorant">
                <p>&copy; 5 Nifti Clothing. Handcrafted with care.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
