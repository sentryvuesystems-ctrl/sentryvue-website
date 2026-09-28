'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  HardDrive,
  Wrench,
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Send,
  AlertCircle,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Configuration options                                               */
/* ------------------------------------------------------------------ */

type FulfilmentType = 'installation' | 'delivery' | ''

interface CameraOption {
  value: string
  label: string
  blurb: string
}

interface StorageOption {
  value: string
  label: string
  footage: string
}

const CAMERA_OPTIONS: CameraOption[] = [
  { value: '2', label: '2 Cameras', blurb: 'Front & back door cover for smaller homes' },
  { value: '4', label: '4 Cameras', blurb: 'Full perimeter for a typical home' },
  { value: '6', label: '6 Cameras', blurb: 'Larger homes & small businesses' },
  { value: '8', label: '8 Cameras', blurb: 'Comprehensive business coverage' },
  { value: '12', label: '12 Cameras', blurb: 'Large sites & multi-unit premises' },
]

const STORAGE_OPTIONS: StorageOption[] = [
  { value: '1TB', label: '1TB', footage: 'approx. up to ~1 week of footage' },
  { value: '2TB', label: '2TB', footage: 'approx. up to ~2 weeks of footage' },
  { value: '4TB', label: '4TB', footage: 'approx. up to ~1 month of footage' },
  { value: '8TB', label: '8TB', footage: 'approx. up to ~2 months of footage' },
]

const STEP_IMAGES: Record<number, { src: string; alt: string }> = {
  1: { src: '/gallery/install-dualcam-brick.jpg', alt: 'Dual CCTV cameras installed on a brick wall by SentryVue' },
  2: { src: '/gallery/install-dome-rendered.jpg', alt: 'Dome CCTV camera fitted to a rendered wall' },
  3: { src: '/gallery/install-modern-driveway.jpg', alt: 'CCTV camera covering a modern driveway' },
  4: { src: '/gallery/install-bullet-brick.jpg', alt: 'Bullet CCTV camera installed on brickwork' },
}

const TOTAL_STEPS = 4
const STEP_LABELS = ['Cameras', 'Storage', 'Fulfilment', 'Your details']

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function SystemConfigurator() {
  const [step, setStep] = useState(1)
  const [cameraCount, setCameraCount] = useState('')
  const [storageCapacity, setStorageCapacity] = useState('')
  const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>('')
  const [address, setAddress] = useState({ line1: '', city: '', postcode: '' })
  const [contact, setContact] = useState({ fullName: '', email: '', phone: '', notes: '' })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isDelivery = fulfilmentType === 'delivery'

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(cameraCount)
    if (step === 2) return Boolean(storageCapacity)
    if (step === 3) {
      if (!fulfilmentType) return false
      if (isDelivery) return Boolean(address.line1 && address.city && address.postcode)
      return true
    }
    return true
  }, [step, cameraCount, storageCapacity, fulfilmentType, isDelivery, address])

  const contactValid = Boolean(contact.fullName && contact.email && contact.phone)

  const goNext = () => {
    if (!canContinue) return
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }
  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    if (!contactValid) {
      setStatus('error')
      setErrorMessage('Please enter your name, email and phone number.')
      return
    }
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/configure-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: contact.fullName,
          email: contact.email,
          phone: contact.phone,
          notes: contact.notes,
          cameraCount,
          storageCapacity,
          fulfilmentType,
          deliveryAddress: isDelivery ? address : null,
        }),
      })
      if (!res?.ok) {
        const data = (await res?.json?.().catch(() => ({}))) as any
        throw new Error(data?.error ?? 'Failed to submit your enquiry.')
      }
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err?.message ?? 'Something went wrong. Please try again.')
      console.error('Configure submission error:', err)
    }
  }

  const resetAll = () => {
    setStep(1)
    setCameraCount('')
    setStorageCapacity('')
    setFulfilmentType('')
    setAddress({ line1: '', city: '', postcode: '' })
    setContact({ fullName: '', email: '', phone: '', notes: '' })
    setStatus('idle')
    setErrorMessage('')
  }

  /* ---------------------------------------------------------------- */
  /* Success screen                                                   */
  /* ---------------------------------------------------------------- */
  if (status === 'success') {
    return (
      <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 bg-white">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 sm:p-12 rounded-3xl bg-[#F4F7FB] border border-[#0066FF]/20 glow-blue-border"
          >
            <CheckCircle2 className="w-16 h-16 text-[#0066FF] mx-auto mb-6" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0A0F1E] mb-4">
              Configuration Received
            </h1>
            <p className="text-[#55607A] text-base leading-relaxed mb-6">
              Thanks{contact.fullName ? `, ${contact.fullName.split(' ')[0]}` : ''}! Your CCTV configuration has
              been sent to our team. We&apos;ll confirm your exact quote
              {isDelivery ? ', delivery cost and timescale' : ' and arrange your free site survey'} — typically
              within 2 hours during business hours.
            </p>
            <div className="text-left inline-block mx-auto mb-8 text-sm text-[#55607A] bg-white rounded-xl border border-[#E3E9F2] px-5 py-4">
              <p className="mb-1"><span className="font-semibold text-[#0A0F1E]">Cameras:</span> {cameraCount}</p>
              <p className="mb-1"><span className="font-semibold text-[#0A0F1E]">Storage:</span> {storageCapacity}</p>
              <p><span className="font-semibold text-[#0A0F1E]">Fulfilment:</span> {isDelivery ? 'Supply & Delivery Only' : 'Professional Installation'}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={resetAll}
                className="w-full sm:w-auto px-6 py-3 bg-[#0066FF] hover:bg-[#0055DD] text-white font-semibold rounded-xl transition-all"
              >
                Build Another System
              </button>
              <a
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-white border border-[#E3E9F2] hover:border-[#0066FF]/40 text-[#0A0F1E] font-semibold rounded-xl transition-all"
              >
                Back to Home
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  /* ---------------------------------------------------------------- */
  /* Main configurator                                                */
  /* ---------------------------------------------------------------- */
  return (
    <section className="relative pt-24 sm:pt-28 pb-32 lg:pb-24 bg-white">
      {/* Intro */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/20 bg-[#0066FF]/[0.08] text-[#0066FF] text-sm font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Build Your System
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A0F1E] tracking-tight mb-4">
            Configure your <span className="text-[#0066FF]">CCTV system</span>
          </h1>
          <p className="text-[#55607A] text-base sm:text-lg">
            Pick your cameras, storage and how you&apos;d like it fulfilled. It takes under a minute — then we&apos;ll
            confirm your exact quote.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1
              const done = n < step
              const active = n === step
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        done
                          ? 'bg-[#0066FF] text-white'
                          : active
                            ? 'bg-[#0066FF] text-white ring-4 ring-[#0066FF]/15'
                            : 'bg-[#F4F7FB] text-[#98A1B3] border border-[#E3E9F2]'
                      }`}
                      aria-current={active ? 'step' : undefined}
                    >
                      {done ? <Check className="w-4 h-4" /> : n}
                    </div>
                    <span
                      className={`mt-2 text-[11px] sm:text-xs font-medium whitespace-nowrap ${
                        active || done ? 'text-[#0A0F1E]' : 'text-[#98A1B3]'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {n < TOTAL_STEPS && (
                    <div
                      className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-colors ${
                        done ? 'bg-[#0066FF]' : 'bg-[#E3E9F2]'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Grid: steps + summary */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
          {/* Steps panel */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {step === 1 && (
                  <StepShell
                    icon={<Camera className="w-5 h-5" />}
                    title="How many cameras?"
                    subtitle="Choose the coverage that suits your property. Not sure? We'll advise on your free survey."
                    image={STEP_IMAGES[1]}
                  >
                    <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Number of cameras">
                      {CAMERA_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.value}
                          selected={cameraCount === opt.value}
                          onClick={() => setCameraCount(opt.value)}
                          title={opt.label}
                          subtitle={opt.blurb}
                        />
                      ))}
                    </div>
                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell
                    icon={<HardDrive className="w-5 h-5" />}
                    title="How much storage?"
                    subtitle="Your NVR keeps recordings so you can look back. More storage means more days of footage."
                    image={STEP_IMAGES[2]}
                  >
                    <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="NVR storage capacity">
                      {STORAGE_OPTIONS.map((opt) => (
                        <SelectCard
                          key={opt.value}
                          selected={storageCapacity === opt.value}
                          onClick={() => setStorageCapacity(opt.value)}
                          title={opt.label}
                          subtitle={opt.footage}
                        />
                      ))}
                    </div>
                    <p className="mt-4 flex items-start gap-2 text-xs text-[#98A1B3]">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      Footage estimates are approximate and vary with the number of cameras, resolution and whether
                      you record continuously or on motion.
                    </p>
                  </StepShell>
                )}

                {step === 3 && (
                  <StepShell
                    icon={<Wrench className="w-5 h-5" />}
                    title="How would you like it fulfilled?"
                    subtitle="Choose professional installation in our local area, or supply & delivery of the kit."
                    image={STEP_IMAGES[3]}
                  >
                    <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Fulfilment type">
                      <SelectCard
                        selected={fulfilmentType === 'installation'}
                        onClick={() => setFulfilmentType('installation')}
                        icon={<Wrench className="w-5 h-5" />}
                        title="Professional Installation"
                        subtitle="Huddersfield & surrounding area. Fully fitted and set up."
                      />
                      <SelectCard
                        selected={fulfilmentType === 'delivery'}
                        onClick={() => setFulfilmentType('delivery')}
                        icon={<Truck className="w-5 h-5" />}
                        title="Supply & Delivery Only"
                        subtitle="We send the kit to your address for self-installation."
                      />
                    </div>

                    <AnimatePresence>
                      {isDelivery && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 p-5 rounded-2xl bg-[#F4F7FB] border border-[#E3E9F2]">
                            <h3 className="text-sm font-semibold text-[#0A0F1E] mb-4">Delivery address</h3>
                            <div className="grid gap-4">
                              <Field
                                label="Address Line 1"
                                icon={<MapPin className="w-4 h-4" />}
                                value={address.line1}
                                onChange={(v) => setAddress((a) => ({ ...a, line1: v }))}
                                placeholder="12 Example Street"
                                autoComplete="address-line1"
                                required
                              />
                              <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                  label="Town / City"
                                  value={address.city}
                                  onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
                                  placeholder="Huddersfield"
                                  autoComplete="address-level2"
                                  required
                                />
                                <Field
                                  label="Postcode"
                                  value={address.postcode}
                                  onChange={(v) => setAddress((a) => ({ ...a, postcode: v }))}
                                  placeholder="HD1 2AB"
                                  autoComplete="postal-code"
                                  required
                                />
                              </div>
                            </div>
                            <p className="mt-4 flex items-start gap-2 text-xs text-[#55607A]">
                              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#0066FF]" />
                              Delivery timescale and cost will be confirmed by our team — typically 3–5 working days.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </StepShell>
                )}

                {step === 4 && (
                  <StepShell
                    icon={<User className="w-5 h-5" />}
                    title="Your details"
                    subtitle="Where should we send your confirmed quote? We'll reply quickly — no obligation."
                    image={STEP_IMAGES[4]}
                  >
                    <form onSubmit={handleSubmit} className="grid gap-4">
                      <Field
                        label="Full Name *"
                        icon={<User className="w-4 h-4" />}
                        value={contact.fullName}
                        onChange={(v) => setContact((c) => ({ ...c, fullName: v }))}
                        placeholder="John Smith"
                        autoComplete="name"
                        required
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                          label="Email Address *"
                          type="email"
                          icon={<Mail className="w-4 h-4" />}
                          value={contact.email}
                          onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                          placeholder="john@example.com"
                          autoComplete="email"
                          required
                        />
                        <Field
                          label="Phone Number *"
                          type="tel"
                          icon={<Phone className="w-4 h-4" />}
                          value={contact.phone}
                          onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                          placeholder="07XXX XXXXXX"
                          autoComplete="tel"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">Notes (optional)</label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-[#98A1B3]" />
                          <textarea
                            value={contact.notes}
                            onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                            rows={3}
                            placeholder="Anything else we should know? Access, timescales, specific areas to cover..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] placeholder:text-[#98A1B3] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm resize-none"
                          />
                        </div>
                      </div>

                      {status === 'error' && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errorMessage || 'Something went wrong.'}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading' || !contactValid}
                        className="mt-1 w-full py-4 bg-[#0066FF] hover:bg-[#0055DD] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#0066FF]/25 flex items-center justify-center gap-2 text-base"
                      >
                        {status === 'loading' ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send My Configuration Enquiry
                          </>
                        )}
                      </button>
                      <p className="text-center text-xs text-[#98A1B3]">
                        Your information is stored securely and only used to contact you about your enquiry.
                      </p>
                    </form>
                  </StepShell>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons (hidden on final step where the form has its own submit) */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={goBack}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-[#55607A] hover:text-[#0A0F1E] hover:bg-[#F4F7FB] disabled:opacity-0 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={goNext}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold bg-[#0066FF] hover:bg-[#0055DD] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-[#0066FF]/25"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            {step === 4 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-[#55607A] hover:text-[#0A0F1E] hover:bg-[#F4F7FB] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            )}
          </div>

          {/* Summary sidebar (desktop) */}
          <aside className="hidden lg:block sticky top-24">
            <SummaryCard
              cameraCount={cameraCount}
              storageCapacity={storageCapacity}
              fulfilmentType={fulfilmentType}
              step={step}
            />
          </aside>
        </div>
      </div>

      {/* Mobile summary bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E3E9F2] px-4 py-3 shadow-[0_-4px_20px_rgba(10,15,30,0.06)]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-[#98A1B3] font-medium">Indicative estimate</p>
            <p className="text-sm font-semibold text-[#0A0F1E] truncate">
              {fulfilmentType === 'delivery' ? 'Price on Application' : 'From £299 fully installed'}
            </p>
          </div>
          {step < 4 ? (
            <button
              onClick={goNext}
              disabled={!canContinue}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#0066FF] hover:bg-[#0055DD] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="flex-shrink-0 text-xs text-[#98A1B3] max-w-[45%] text-right">
              Complete your details to send
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function StepShell({
  icon,
  title,
  subtitle,
  image,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  image: { src: string; alt: string }
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-[#E3E9F2] bg-white overflow-hidden shadow-sm">
      <div className="relative h-40 sm:h-52 w-full">
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/70 via-[#0A0F1E]/10 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2 text-white">
          <span className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center shadow-lg">{icon}</span>
          <h2 className="font-display text-xl sm:text-2xl font-bold drop-shadow">{title}</h2>
        </div>
      </div>
      <div className="p-5 sm:p-7">
        <p className="text-[#55607A] text-sm sm:text-base mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

function SelectCard({
  selected,
  onClick,
  title,
  subtitle,
  icon,
}: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle: string
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`relative text-left w-full min-h-[64px] rounded-2xl border p-4 sm:p-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/50 ${
        selected
          ? 'border-[#0066FF] bg-[#0066FF]/[0.06] shadow-sm'
          : 'border-[#E3E9F2] bg-white hover:border-[#0066FF]/40 hover:bg-[#F4F7FB]'
      }`}
    >
      <div className="flex items-start gap-3 pr-7">
        {icon && (
          <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              selected ? 'bg-[#0066FF] text-white' : 'bg-[#F4F7FB] text-[#0066FF]'
            }`}
          >
            {icon}
          </span>
        )}
        <div>
          <p className="font-semibold text-[#0A0F1E] text-[15px] sm:text-base">{title}</p>
          <p className="text-[#55607A] text-xs sm:text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      <span
        className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
          selected ? 'bg-[#0066FF] text-white scale-100' : 'bg-[#F4F7FB] border border-[#E3E9F2] scale-90'
        }`}
        aria-hidden="true"
      >
        {selected && <Check className="w-3 h-3" />}
      </span>
    </button>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  required,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  icon?: React.ReactNode
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div>
      <label className="block text-sm text-[#0A0F1E]/70 mb-2 font-medium">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A1B3]">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-label={label.replace(' *', '')}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border border-[#E3E9F2] rounded-xl text-[#0A0F1E] placeholder:text-[#98A1B3] focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm`}
        />
      </div>
    </div>
  )
}

function SummaryCard({
  cameraCount,
  storageCapacity,
  fulfilmentType,
  step,
}: {
  cameraCount: string
  storageCapacity: string
  fulfilmentType: FulfilmentType
  step: number
}) {
  const isDelivery = fulfilmentType === 'delivery'
  const fulfilmentLabel = isDelivery
    ? 'Supply & Delivery Only'
    : fulfilmentType === 'installation'
      ? 'Professional Installation'
      : ''

  const filled = [Boolean(cameraCount), Boolean(storageCapacity), Boolean(fulfilmentType)].filter(Boolean).length
  const progress = Math.round((filled / 3) * 100)

  return (
    <div className="rounded-3xl border border-[#E3E9F2] bg-[#F4F7FB] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="w-5 h-5 text-[#0066FF]" />
        <h2 className="font-display text-lg font-bold text-[#0A0F1E]">Your configuration</h2>
      </div>

      {/* progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-[#98A1B3] mb-1.5">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white overflow-hidden">
          <div className="h-full bg-[#0066FF] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <dl className="space-y-3 text-sm">
        <SummaryRow label="Cameras" value={cameraCount ? `${cameraCount} cameras` : '—'} active={step === 1} />
        <SummaryRow label="Storage" value={storageCapacity || '—'} active={step === 2} />
        <SummaryRow label="Fulfilment" value={fulfilmentLabel || '—'} active={step === 3} />
      </dl>

      <div className="my-5 h-px bg-[#E3E9F2]" />

      <div>
        <p className="text-[11px] uppercase tracking-wide text-[#98A1B3] font-semibold mb-1">
          {isDelivery ? 'Price' : 'Indicative estimate'}
        </p>
        {isDelivery ? (
          <p className="text-xl font-bold text-[#0A0F1E]">Price on Application</p>
        ) : (
          <p className="text-2xl font-bold text-[#0A0F1E]">
            From £299 <span className="text-sm font-medium text-[#55607A]">fully installed</span>
          </p>
        )}
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[#55607A] leading-relaxed">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#0066FF]" />
          {isDelivery
            ? 'We will confirm cost and delivery details with you before anything is charged.'
            : 'Indicative — subject to confirmation. Your exact quote will be confirmed within 2 hours of enquiry.'}
        </p>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 -mx-1 transition-colors ${active ? 'bg-white' : ''}`}>
      <dt className="text-[#55607A]">{label}</dt>
      <dd className="font-semibold text-[#0A0F1E] text-right">{value}</dd>
    </div>
  )
}
