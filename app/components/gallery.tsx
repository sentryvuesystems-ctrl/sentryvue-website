'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { useState } from 'react'

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1765718826790-909aa08ac771?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Security camera monitoring urban cityscape at night',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: 'https://resource.fs.com/images/20241021141055od7quz.jpg',
    alt: 'Professional white dome CCTV camera installed on building exterior',
    span: '',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1749319835955-9c5293f6b1a3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Security monitoring control room with multiple camera feeds',
    span: '',
  },
  {
    src: 'https://avorliving.com/assets/res-security-dusk-home-CQ6Wo9c_.jpg',
    alt: 'Modern residential property with security cameras at dusk',
    span: '',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0504/7094/4954/files/eufycam-s3-pro-color-night-vision-3.jpg?v=1742364535',
    alt: 'ColorVu night vision camera providing full colour footage in darkness',
    span: '',
  },
  {
    src: 'https://static.professional-electrician.com/professional-electrician/uploads/2020/01/Increase-in-tester-use-by-CCTV-installers-reports-IDEAL-Networks-c.jpg',
    alt: 'Professional installer mounting a CCTV camera on building wall',
    span: 'md:col-span-2',
  },
]

export function Gallery() {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  return (
    <section id="gallery" className="relative py-20 sm:py-28 lg:py-32 bg-[#080C19]">
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
            <Camera className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Our Work
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Installation <span className="text-[#0066FF]">Gallery</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base sm:text-lg">
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
              className={`relative overflow-hidden rounded-2xl group ${img?.span ?? ''}`}
            >
              <div className="relative aspect-video bg-[#0A0F1E]">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0A0F1E]">
                    <Camera className="w-8 h-8 text-[#0066FF]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent" />
    </section>
  )
}
