'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { SentryVueLogo } from './sentryvue-logo'

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why SentryVue', href: '#why-sentryvue' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Build a Quote', href: '#quote-configurator' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-[#E3E9F2] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <button onClick={() => handleNav('#hero')} className="flex items-center group">
            <SentryVueLogo size={36} showText showTagline={false} />
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems?.map((item: any) => (
              <button
                key={item?.href}
                onClick={() => handleNav(item?.href)}
                className="px-4 py-2 text-sm text-[#55607A] hover:text-[#0A0F1E] transition-colors rounded-lg hover:bg-[#0A0F1E]/[0.04]"
              >
                {item?.label ?? ''}
              </button>
            ))}
            <button
              onClick={() => handleNav('#contact')}
              className="ml-2 px-5 py-2.5 bg-[#0066FF] hover:bg-[#0055DD] text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-[#0066FF]/25"
            >
              Get a Quote
            </button>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#0A0F1E]/70 hover:text-[#0A0F1E]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/[0.98] backdrop-blur-xl pt-20 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navItems?.map((item: any) => (
                <button
                  key={item?.href}
                  onClick={() => handleNav(item?.href)}
                  className="py-3 px-4 text-lg text-[#55607A] hover:text-[#0A0F1E] hover:bg-[#F4F7FB] rounded-lg text-left transition-colors"
                >
                  {item?.label ?? ''}
                </button>
              ))}
              <button
                onClick={() => handleNav('#contact')}
                className="mt-4 py-3 px-4 bg-[#0066FF] hover:bg-[#0055DD] text-white text-lg font-semibold rounded-lg text-center transition-all"
              >
                Get a Quote
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
