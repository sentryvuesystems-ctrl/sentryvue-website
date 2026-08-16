'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, Wrench, Smartphone } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Free Site Survey',
    description: 'We visit your property, assess your security needs, and provide a detailed quote — completely free of charge.',
    icon: ClipboardCheck,
  },
  {
    number: '02',
    title: 'Professional Installation',
    description: 'Our qualified engineers install your cameras with precision. Clean cable management, optimal positioning, and thorough testing.',
    icon: Wrench,
  },
  {
    number: '03',
    title: 'Remote Access Setup',
    description: 'We configure your system so you can view live feeds and recordings from your phone, anywhere in the world.',
    icon: Smartphone,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 lg:py-32 bg-[#080C19]">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-[#0066FF] text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            How It <span className="text-[#0066FF]">Works</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base sm:text-lg">
            From survey to setup, we handle everything so you can focus on what matters.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps?.map((step: any, index: number) => {
              const Icon = step?.icon ?? ClipboardCheck
              return (
                <motion.div
                  key={step?.number ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative text-center group"
                >
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center group-hover:bg-[#0066FF]/20 group-hover:border-[#0066FF]/40 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#0066FF]/10">
                      <Icon className="w-8 h-8 text-[#0066FF]" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0066FF] text-white text-xs font-bold flex items-center justify-center">
                      {step?.number ?? ''}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{step?.title ?? ''}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">{step?.description ?? ''}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent" />
    </section>
  )
}
