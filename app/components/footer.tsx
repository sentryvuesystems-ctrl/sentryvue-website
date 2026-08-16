'use client'

import { Shield, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#060912]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#0066FF]/20 border border-[#0066FF]/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0066FF]" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Sentry<span className="text-[#0066FF]">Vue</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              See More. Stay Secure. Professional CCTV installation across the North of England.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="tel:07XXXXXXXXX" className="flex items-center gap-3 text-white/50 hover:text-[#0066FF] transition-colors text-sm group">
                <Phone className="w-4 h-4 group-hover:text-[#0066FF]" />
                <span suppressHydrationWarning>07XXX XXXXXX</span>
              </a>
              <a href="mailto:info@sentryvue.co.uk" className="flex items-center gap-3 text-white/50 hover:text-[#0066FF] transition-colors text-sm group">
                <Mail className="w-4 h-4 group-hover:text-[#0066FF]" />
                <span suppressHydrationWarning>info@sentryvue.co.uk</span>
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#0066FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/30 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#0066FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/30 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#0066FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-white/30 text-xs">
            © 2025 SentryVue Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
