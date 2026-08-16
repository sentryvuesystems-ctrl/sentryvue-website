'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, User, Mail, Phone, MapPin, Building2, Camera, Calendar, FileText } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    postcode: '',
    propertyType: '',
    cameraCount: '',
    installationDate: '',
    notes: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...(prev ?? {}), [e?.target?.name ?? '']: e?.target?.value ?? '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData ?? {}),
      })
      if (!res?.ok) {
        const data = await res?.json?.().catch(() => ({})) as any
        throw new Error(data?.error ?? 'Failed to submit')
      }
      setStatus('success')
      setFormData({ fullName: '', email: '', phone: '', postcode: '', propertyType: '', cameraCount: '', installationDate: '', notes: '' })
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err?.message ?? 'Something went wrong. Please try again.')
      console.error('Form submission error:', err)
    }
  }

  if (status === 'success') {
    return (
      <section id="contact" className="relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 sm:p-12 rounded-2xl bg-white/[0.03] border border-[#0066FF]/20 glow-blue-border"
          >
            <CheckCircle2 className="w-16 h-16 text-[#0066FF] mx-auto mb-6" />
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">Thank You!</h3>
            <p className="text-white/60 text-base leading-relaxed mb-6">
              Your quote request has been received. We will be in touch within 24 hours to arrange your free site survey.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-3 bg-[#0066FF] hover:bg-[#0055DD] text-white font-semibold rounded-xl transition-all"
            >
              Submit Another Request
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-[#0066FF] text-sm font-medium mb-4">
            <Send className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Get in Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Request a Free <span className="text-[#0066FF]">Quote</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-base sm:text-lg">
            Tell us about your property and we will provide a free, no-obligation quote.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 sm:p-10 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="relative">
              <label className="block text-sm text-white/70 mb-2 font-medium">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  name="fullName"
                  value={formData?.fullName ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm text-white/70 mb-2 font-medium">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  name="email"
                  value={formData?.email ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm text-white/70 mb-2 font-medium">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="07XXX XXXXXX"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Postcode */}
            <div className="relative">
              <label className="block text-sm text-white/70 mb-2 font-medium">Postcode *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  name="postcode"
                  value={formData?.postcode ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="HD1 2AB"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="relative">
              <label className="block text-sm text-white/70 mb-2 font-medium">Property Type *</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <select
                  name="propertyType"
                  value={formData?.propertyType ?? ''}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm appearance-none cursor-pointer [&>option]:bg-[#0A0F1E] [&>option]:text-white"
                >
                  <option value="" disabled>Select property type</option>
                  <option value="Residential">Residential</option>
                  <option value="Small Business">Small Business</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Camera Count */}
            <div className="relative">
              <label className="block text-sm text-white/70 mb-2 font-medium">Number of Cameras *</label>
              <div className="relative">
                <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <select
                  name="cameraCount"
                  value={formData?.cameraCount ?? ''}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm appearance-none cursor-pointer [&>option]:bg-[#0A0F1E] [&>option]:text-white"
                >
                  <option value="" disabled>Select camera count</option>
                  <option value="1-4">1–4 Cameras</option>
                  <option value="4-8">4–8 Cameras</option>
                  <option value="8+">8+ Cameras</option>
                </select>
              </div>
            </div>

            {/* Installation Date */}
            <div className="relative">
              <label className="block text-sm text-white/70 mb-2 font-medium">Preferred Installation Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="date"
                  name="installationDate"
                  value={formData?.installationDate ?? ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-sm text-white/70 mb-2 font-medium">Additional Notes</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
                <textarea
                  name="notes"
                  value={formData?.notes ?? ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your security requirements..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMessage ?? 'Something went wrong.'}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-6 w-full py-4 bg-[#0066FF] hover:bg-[#0055DD] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#0066FF]/25 flex items-center justify-center gap-2 text-base"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Quote Request
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-white/30">
            Your information is stored securely and will only be used to contact you about your enquiry.
          </p>
        </motion.form>
      </div>
    </section>
  )
}
