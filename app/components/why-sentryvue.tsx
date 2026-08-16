'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, ShieldCheck, MapPin, Clock, Eye, Award } from 'lucide-react'

const stats = [
  { value: 500, suffix: '+', label: 'Cameras Installed', icon: Eye },
  { value: 150, suffix: '+', label: 'Happy Customers', icon: Star },
  { value: 5, suffix: '', label: 'Star Rating', icon: Award },
  { value: 2, suffix: ' Year', label: 'Warranty', icon: Clock },
]

const features = [
  {
    icon: Star,
    title: '5-Star Rated',
    description: 'Consistently rated 5 stars by our customers across all platforms.',
  },
  {
    icon: ShieldCheck,
    title: 'Fully Insured',
    description: 'Complete public liability insurance for your peace of mind.',
  },
  {
    icon: MapPin,
    title: 'North of England Coverage',
    description: 'Serving from Sheffield to Teesside, with Huddersfield as our base.',
  },
  {
    icon: Clock,
    title: '2-Year Warranty',
    description: 'Every installation comes with a comprehensive 2-year warranty.',
  },
  {
    icon: Eye,
    title: 'ColorVu Night Vision',
    description: '24/7 full-colour footage, even in complete darkness.',
  },
  {
    icon: Award,
    title: 'Certified Installers',
    description: 'Professional, qualified engineers with extensive CCTV experience.',
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, value])

  return (
    <div ref={ref} className="font-display text-4xl sm:text-5xl font-bold text-white">
      {count}{suffix}
    </div>
  )
}

export function WhySentryVue() {
  return (
    <section id="why-sentryvue" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-[#0066FF] text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Trusted Across the <span className="text-[#0066FF]">North</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base sm:text-lg">
            We combine premium equipment with expert installation to keep your property safe.
          </p>
        </motion.div>

        {/* Stats counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats?.map((stat: any, index: number) => {
            const Icon = stat?.icon ?? Star
            return (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <Icon className="w-6 h-6 text-[#0066FF] mx-auto mb-3" />
                <AnimatedCounter value={stat?.value ?? 0} suffix={stat?.suffix ?? ''} />
                <p className="text-white/50 text-sm mt-2">{stat?.label ?? ''}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features?.map((feature: any, index: number) => {
            const Icon = feature?.icon ?? Star
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#0066FF]/20 transition-all duration-500 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#0066FF]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#0066FF]" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{feature?.title ?? ''}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature?.description ?? ''}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
