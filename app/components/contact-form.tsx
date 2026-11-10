'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, User, Mail, Phone, MapPin, Building2, Camera, Calendar, FileText, ClipboardCheck, MessageCircle } from 'lucide-react'
import {
  QUOTE_PREFILL_STORAGE_KEY,
  QUOTE_PREFILL_EVENT,
  type QuotePrefillPayload,
} from '@/lib/quote-configurator.ts'

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
    configuratorSummary: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [prefilledFromConfigurator, setPrefilledFromConfigurator] = useState(false)

  const applyPrefill = (payload: QuotePrefillPayload | null | undefined) => {
    if (!payload?.configuratorSummary) return
    setFormData((prev: any) => ({
      ...(prev ?? {}),
      configuratorSummary: payload.configuratorSummary ?? '',
      propertyType: prev?.propertyType || payload.propertyType || '',
      cameraCount: prev?.cameraCount || payload.cameraCount || '',
      notes: prev?.notes ? `${payload.configuratorSummary}\n\n${prev.notes}` : payload.configuratorSummary,
    }))
    setPrefilledFromConfigurator(true)
  }

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(QUOTE_PREFILL_STORAGE_KEY)
      if (raw) {
        applyPrefill(JSON.parse(raw) as QuotePrefillPayload)
        window.sessionStorage.removeItem(QUOTE_PREFILL_STORAGE_KEY)
      }
    } catch (_) {}
    const onPrefill = (e: Event) => applyPrefill((e as CustomEvent<QuotePrefillPayload>)?.detail)
    window.addEventListener(QUOTE_PREFILL_EVENT, onPrefill as EventListener)
    return () => window.removeEventListener(QUOTE_PREFILL_EVENT, onPrefill as EventListener)
  }, [])

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
      setPrefilledFromConfigurator(false)
      setFormData({ fullName: '', email: '', phone: '', postcode: '', propertyType: '', cameraCount: '', installationDate: '', notes: '', configuratorSummary: '' })
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err?.message ?? 'Something went wrong. Please try again.')
      console.error('Form submission error:', err)
    }
  }

  if (status === 'success') {
    return (
      <section id="contact" className="relative py-20 sm:py-28 lg:py-32 bg-white">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 sm:p-12 rounded-2xl bg-[#F4F7FB] border border-[#0066FF]/20 glow-blue-border"
          >
            <CheckCircle2 className="w-16 h-16 text-[#0066FF] mx-auto mb-6" />
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A0F1E] mb-4">Thank You!</h3>
            <p className="text-[#55607A] text-base leading-relaxed mb-6">
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
    <section id="contact" className="relative py-20 sm:py-28 lg:py-32 bg-white">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/20 bg-[#0066FF]/[0.08] text-[#0066FF] text-sm font-medium mb-4">
            <Send className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Get in Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A0F1E] tracking-tight mb-4">
            Request a Free <span className="text-[#0066FF]">Quote</span>
          </h2>
          <p className="text-[#55607A] max-w-lg mx-auto text-base sm:text-lg">
            Tell us about your property and we will provide a free, no-obligation quote.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href="tel:+447512621107"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#0066FF] text-white font-medium text-sm hover:bg-[#0052cc] transition-colors w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4" />
              <span suppressHydrationWarning>Call 07512 621107</span>
            </a>
            <a
              href="https://wa.me/447512621107"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#25D366] text-white font-medium text-sm hover:bg-[#1eb955] transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
          <p className="text-[#98A1B3] text-xs mt-3">Prefer to talk? Call or message us directly.</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 sm:p-10 rounded-2xl bg-[#F4F7FB] border border-[#E3E9F2] shadow-sm"
        >
          {prefilledFromConfigurator && (
            <div className="mb-6 p-4 rounded-xl bg-[#0066FF]/[0.08] border border-[#0066FF]/20 flex items-start gap-3">
              <ClipboardCheck className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#55607A] leading-relaxed">We&apos;ve added your CCTV configuration to the message below. Add your contact details and we&apos;ll be in touch.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="relative">
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A1B3]" />
                <input
                  type="text"
                  name="fullName"
                  value={formData?.fullName ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] placeholder:text-[#98A1B3] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A1B3]" />
                <input
                  type="email"
                  name="email"
                  value={formData?.email ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] placeholder:text-[#98A1B3] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A1B3]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="07XXX XXXXXX"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] placeholder:text-[#98A1B3] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Postcode */}
            <div className="relative">
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Postcode *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A1B3]" />
                <input
                  type="text"
                  name="postcode"
                  value={formData?.postcode ?? ''}
                  onChange={handleChange}
                  required
                  placeholder="HD1 2AB"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] placeholder:text-[#98A1B3] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="relative">
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Property Type *</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A1B3] pointer-events-none" />
                <select
                  name="propertyType"
                  value={formData?.propertyType ?? ''}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm appearance-none cursor-pointer"
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
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Number of Cameras *</label>
              <div className="relative">
                <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A1B3] pointer-events-none" />
                <select
                  name="cameraCount"
                  value={formData?.cameraCount ?? ''}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm appearance-none cursor-pointer"
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
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Preferred Installation Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A1B3] pointer-events-none" />
                <input
                  type="date"
                  name="installationDate"
                  value={formData?.installationDate ?? ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm [color-scheme:light]"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Additional Notes</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-[#98A1B3]" />
                <textarea
                  name="notes"
                  value={formData?.notes ?? ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your security requirements..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] placeholder:text-[#98A1B3] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
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

          <p className="mt-4 text-center text-xs text-[#98A1B3]">
            Your information is stored securely and will only be used to contact you about your enquiry.
          </p>
        </motion.form>
      </div>
    </section>
  )
}
