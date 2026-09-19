'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { useState } from 'react'

const galleryImages = [
  {
    src: '/gallery/install-bullet-brick.jpg',
    alt: 'White bullet CCTV camera neatly installed on the brick exterior corner of a house',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: '/gallery/install-dome-rendered.jpg',
    alt: 'White dome security camera mounted on the rendered exterior wall of a modern home',
    span: '',
  },
  {
    src: '/gallery/install-bullet-greenery.jpg',
    alt: 'Professional white bullet camera installed on a house exterior in daylight',
    span: '',
  },
  {
    src: '/gallery/install-camera-brick-door.jpg',
    alt: 'Compact security camera fitted beside the front door on a brick house exterior',
    span: '',
  },
  {
    src: '/gallery/install-dualcam-brick.jpg',
    alt: 'Dual-lens security camera installed under the eaves on a brick house exterior',
    span: '',
  },
  {
    src: '/gallery/install-modern-driveway.jpg',
    alt: 'Exterior security camera covering the driveway of a modern detached home',
    span: 'md:col-span-2',
  },
]

export function Gallery() {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  return (
    <section id="gallery" className="relative py-20 sm:py-28 lg:py-32 bg-[#F4F7FB]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/15 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/20 bg-[#0066FF]/[0.08] text-[#0066FF] text-sm font-medium mb-4">
            <Camera className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Our Work
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A0F1E] tracking-tight mb-4">
            Installation <span className="text-[#0066FF]">Gallery</span>
          </h2>
          <p className="text-[#55607A] max-w-xl mx-auto text-base sm:text-lg">
            A glimpse of our professional installations across the North of England.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages?.map((img: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group shadow-sm ${img?.span ?? ''}`}
            >
              <div className="relative aspect-video bg-[#E3E9F2]">
                {!imgErrors?.[index] ? (
                  <Image
                    src={img?.src ?? ''}
                    alt={img?.alt ?? 'Security installation'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => setImgErrors((prev: any) => ({ ...(prev ?? {}), [index]: true }))}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#F4F7FB]">
                    <Camera className="w-8 h-8 text-[#0066FF]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/15 to-transparent" />
    </section>
  )
}
