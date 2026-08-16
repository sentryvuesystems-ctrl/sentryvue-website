'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.04)'
      ctx.lineWidth = 1
      const gridSize = 60
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGrid()

      particles.forEach((p: any) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 102, 255, ${p.opacity})`
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i]?.x ?? 0) - (particles[j]?.x ?? 0)
          const dy = (particles[i]?.y ?? 0) - (particles[j]?.y ?? 0)
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i]?.x ?? 0, particles[i]?.y ?? 0)
            ctx.lineTo(particles[j]?.x ?? 0, particles[j]?.y ?? 0)
            ctx.strokeStyle = `rgba(0, 102, 255, ${0.08 * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E] via-transparent to-[#0A0F1E] z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0066FF]/5 rounded-full blur-[120px] z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-[#0066FF] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            Professional CCTV Installation
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] mb-6"
        >
          See More.
          <br />
          <span className="text-[#0066FF] glow-blue-text">Stay Secure.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Premium CCTV installation across the North of England. From Huddersfield
          to Teesside, we deliver cutting-edge security solutions for homes and
          businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo('#contact')}
            className="w-full sm:w-auto px-8 py-4 bg-[#0066FF] hover:bg-[#0055DD] text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#0066FF]/25 hover:-translate-y-0.5 text-base"
          >
            Get a Free Quote
          </button>
          <button
            onClick={() => scrollTo('#services')}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5 text-base"
          >
            View Our Services
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  )
}
