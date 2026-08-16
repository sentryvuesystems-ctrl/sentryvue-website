'use client'

import { motion } from 'framer-motion'
import { Home, Building2, Factory, Camera, Check, ArrowRight } from 'lucide-react'

const packages = [
  {
    name: 'Starter',
    subtitle: 'Residential',
    description: 'Perfect for homeowners looking to secure their property with professional-grade CCTV.',
    cameras: '2–4 Cameras',
    icon: Home,
    features: ['HD ColorVu Cameras', 'Remote App Access', 'Motion Detection Alerts', 'Professional Installation', '2-Year Warranty'],
    popular: false,
  },
  {
    name: 'Pro',
    subtitle: 'Small Business',
    description: 'Comprehensive coverage for shops, offices, and small commercial properties.',
    cameras: '4–8 Cameras',
    icon: Building2,
    features: ['4K Ultra HD Cameras', 'Remote App Access', 'Night Vision (ColorVu)', 'Vandal-Proof Housing', 'Free Site Survey', '2-Year Warranty'],
    popular: true,
  },
  {
    name: 'Elite',
    subtitle: 'Commercial',
    description: 'Enterprise-level security for warehouses, car parks, and large-scale operations.',
    cameras: '8+ Cameras',
    icon: Factory,
    features: ['4K Ultra HD + PTZ Cameras', 'AI Analytics & Alerts', 'Multi-Site Management', 'License Plate Recognition', 'Dedicated Support', '2-Year Warranty'],
    popular: false,
  },
]

export function Services() {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="services" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-[#0066FF] text-sm font-medium mb-4">
            <Camera className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Our Packages
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Security Solutions for <span className="text-[#0066FF]">Every Need</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base sm:text-lg">
            Whether you need a few cameras for your home or a full commercial setup, we have the right package.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages?.map((pkg: any, index: number) => {
            const Icon = pkg?.icon ?? Camera
            return (
              <motion.div
                key={pkg?.name ?? index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative group rounded-2xl p-[1px] transition-all duration-500 ${
                  pkg?.popular
                    ? 'bg-gradient-to-b from-[#0066FF]/50 to-[#0066FF]/10'
                    : 'bg-white/10 hover:bg-gradient-to-b hover:from-[#0066FF]/30 hover:to-transparent'
                }`}
              >
                {pkg?.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0066FF] text-white text-xs font-semibold rounded-full z-10">
                    Most Popular
                  </div>
                )}
                <div className="relative bg-[#0A0F1E] rounded-2xl p-6 sm:p-8 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center mb-5 group-hover:bg-[#0066FF]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#0066FF]" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">{pkg?.name ?? ''}</h3>
                  <p className="text-[#0066FF] text-sm font-medium mb-2">{pkg?.subtitle ?? ''}</p>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">{pkg?.description ?? ''}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium mb-6 w-fit">
                    <Camera className="w-4 h-4 text-[#0066FF]" />
                    {pkg?.cameras ?? ''}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {(pkg?.features ?? [])?.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                        <Check className="w-4 h-4 text-[#0066FF] mt-0.5 flex-shrink-0" />
                        {feature ?? ''}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={scrollToContact}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 group/btn ${
                      pkg?.popular
                        ? 'bg-[#0066FF] hover:bg-[#0055DD] text-white hover:shadow-lg hover:shadow-[#0066FF]/25'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    Get a Quote
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
