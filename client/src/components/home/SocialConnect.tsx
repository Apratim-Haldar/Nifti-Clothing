import type React from "react"
import { useState } from "react"
import { ExternalLink, MessageCircle, Camera, Users, QrCode } from "lucide-react"

interface SocialPlatform {
  id: string
  name: string
  handle: string
  description: string
  qrCode: string
  link: string
  icon: React.ComponentType<any>
  color: string
  followers?: string
}

export function SocialConnect() {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)
  const [showQR, setShowQR] = useState<string | null>(null)

  const socialPlatforms: SocialPlatform[] = [
    {
      id: "instagram",
      name: "Instagram",
      handle: "@nifticlothing",
      description: "Daily fashion inspiration & behind-the-scenes content",
      qrCode: "/instagramQR.jpg",
      link: "https://www.instagram.com/nifti_officials?utm_source=qr&igsh=MXNrMGQxbm4zc2liMg==",
      icon: Camera,
      color: "from-pink-500 to-purple-600",
      followers: "25.8K"
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "Nifti Clothing",
      description: "Join our community for exclusive updates & collections",
      qrCode: "/facebookQR.png",
      link: "https://www.facebook.com/profile.php?id=100064234023114",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      followers: "18.5K"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      handle: "Customer Support",
      description: "Quick support & personalized styling assistance",
      qrCode: "/whatsappQR.jpg",
      link: "https://wa.me/message/TTBCDWDUYZXHE1?src=qr",
      icon: MessageCircle,
      color: "from-green-500 to-green-600",
      followers: "24/7"
    }
  ]

  const handlePlatformClick = (platform: SocialPlatform) => {
    window.open(platform.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      {/* Premium background elements */}
      <div className="absolute inset-0 fabric-texture opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-stone-50/50 to-rose-50/50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-24"></div>
            <div className="mx-6 w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border border-amber-300/50 shadow-lg fabric-sway">
              <Users className="h-6 w-6 text-amber-700" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-24"></div>
          </div>
          
          <h2 className="text-5xl font-playfair font-light text-stone-900 mb-6 tracking-tight">
            Connect With <span className="text-amber-700">Nifti</span>
          </h2>
          <p className="text-xl text-stone-600 font-inter max-w-3xl mx-auto leading-relaxed">
            Join our vibrant community of fashion enthusiasts. Follow us for daily inspiration, 
            exclusive previews, and personalized styling tips.
          </p>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {socialPlatforms.map((platform) => {
            const IconComponent = platform.icon
            return (
              <div
                key={platform.id}
                className="group relative"
                onMouseEnter={() => setHoveredPlatform(platform.id)}
                onMouseLeave={() => setHoveredPlatform(null)}
              >
                <div className="boutique-card rounded-2xl p-8 h-full transition-all duration-700 group-hover:scale-105 velvet-shadow group-hover:shadow-2xl cursor-pointer"
                     onClick={() => handlePlatformClick(platform)}>
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Platform Info */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-playfair font-medium text-stone-900 mb-2">{platform.name}</h3>
                    <p className="text-amber-700 font-cormorant font-medium text-lg mb-3">{platform.handle}</p>
                    <p className="text-stone-600 font-inter text-sm leading-relaxed">{platform.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlatformClick(platform)
                      }}
                      className="flex-1 bg-gradient-to-r from-stone-800 to-stone-900 text-white py-3 px-4 rounded-xl font-cormorant font-medium hover:from-stone-900 hover:to-black transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Follow</span>
                      <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowQR(showQR === platform.id ? null : platform.id)
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center"
                    >
                      <QrCode className="h-5 w-5" />
                    </button>
                  </div>

                  {/* QR Code Overlay */}
                  {showQR === platform.id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center p-8 border border-stone-200/50 shadow-xl">
                      <div className="text-center">
                        <img 
                          src={platform.qrCode} 
                          alt={`${platform.name} QR Code`}
                          className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                        />
                        <h4 className="font-playfair text-xl text-stone-900 mb-2">Scan to Follow</h4>
                        <p className="text-stone-600 font-inter text-sm">{platform.handle}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowQR(null)
                          }}
                          className="mt-4 text-amber-700 hover:text-amber-800 font-cormorant font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hover Effects */}
                  {hoveredPlatform === platform.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-r from-amber-600/10 via-stone-100/50 to-amber-600/10 rounded-3xl p-12 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-playfair font-light text-stone-900 mb-2">68K+</div>
              <div className="text-stone-600 font-cormorant">Total Followers</div>
            </div>
            <div>
              <div className="text-4xl font-playfair font-light text-stone-900 mb-2">2.5K+</div>
              <div className="text-stone-600 font-cormorant">Monthly Engagement</div>
            </div>
            <div>
              <div className="text-4xl font-playfair font-light text-stone-900 mb-2">24/7</div>
              <div className="text-stone-600 font-cormorant">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
