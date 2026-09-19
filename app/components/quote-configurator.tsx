'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  Check,
  ArrowRight,
  Home,
  Store,
  Factory,
  Construction,
  LayoutGrid,
  Smartphone,
  Moon,
  BellRing,
  HardDrive,
  DoorOpen,
  Wrench,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react'
import {
  ADD_ON_OPTIONS,
  CAMERA_COUNT_OPTIONS,
  CAMERA_STYLE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  buildConfiguratorSummary,
  mapCameraCountToEnquiryRange,
  mapPropertyTypeToEnquiry,
  readableCameraCount,
  CAMERA_STYLE_LABELS,
  ADD_ON_LABELS,
  QUOTE_PREFILL_STORAGE_KEY,
  QUOTE_PREFILL_EVENT,
  type AddOnId,
  type CameraCount,
  type CameraStyleId,
  type PropertyType,
  type QuoteConfig,
  type QuotePrefillPayload,
} from '@/lib/quote-configurator.ts'

const PROPERTY_ICONS: Record<PropertyType, any> = {
  Residential: Home,
  'Small Business': Store,
  'Warehouse/Industrial': Factory,
  'Construction Site': Construction,
  'Mixed Use': LayoutGrid,
}

const ADD_ON_ICONS: Record<AddOnId, any> = {
  'remote-viewing': Smartphone,
  'night-vision': Moon,
  'motion-alerts': BellRing,
  'recording-storage': HardDrive,
  'video-doorbell': DoorOpen,
  'maintenance-plan': Wrench,
}

interface QuoteConfiguratorProps {
  /** When true, redirect to the homepage enquiry anchor instead of scrolling in-page. */
  redirectToContact?: boolean
}

export function QuoteConfigurator({ redirectToContact = false }: QuoteConfiguratorProps) {
  const [config, setConfig] = useState<QuoteConfig>({
    cameraCount: '',
    cameraStyle: '',
    propertyType: '',
    addOns: [],
  })

  const selectCameraCount = (value: CameraCount) =>
    setConfig((prev) => ({ ...prev, cameraCount: value }))

  const selectCameraStyle = (value: CameraStyleId) =>
    setConfig((prev) => ({ ...prev, cameraStyle: value }))

  const selectPropertyType = (value: PropertyType) =>
    setConfig((prev) => ({ ...prev, propertyType: value }))

  const toggleAddOn = (value: AddOnId) =>
    setConfig((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(value)
        ? prev.addOns.filter((id) => id !== value)
        : [...prev.addOns, value],
    }))

  const summary = useMemo(() => buildConfiguratorSummary(config), [config])

  const handleRequestQuote = () => {
    const payload: QuotePrefillPayload = {
      configuratorSummary: summary,
      cameraCount: mapCameraCountToEnquiryRange(config.cameraCount),
      propertyType: mapPropertyTypeToEnquiry(config.propertyType),
    }

    try {
      // Persist so the standalone /quote page can hand off to the homepage enquiry form.
      window.sessionStorage.setItem(QUOTE_PREFILL_STORAGE_KEY, JSON.stringify(payload))
    } catch (_) {
      // sessionStorage may be unavailable (private mode) — the event below still works in-page.
    }

    if (redirectToContact) {
      window.location.href = '/#contact'
      return
    }

    // Notify the on-page enquiry form to pre-populate, then scroll to it.
    window.dispatchEvent(new CustomEvent(QUOTE_PREFILL_EVENT, { detail: payload }))
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const cardBase =
    'relative rounded-xl border text-left transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#0066FF]/40'
  const cardIdle = 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
  const cardActive = 'bg-[#0066FF]/10 border-[#0066FF]/50 glow-blue-border'

  return (
    <section id="quote-configurator" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-[#0066FF] text-sm font-medium mb-4">
            <Camera className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Quote Configurator
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Build Your <span className="text-[#0066FF]">CCTV Quote</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base sm:text-lg">
            Customise your system below and we&apos;ll put together a free, no-obligation
            recommendation after a site survey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Configurator options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Step 1: Number of cameras */}
            <div>
              <StepHeading step={1} title="Number of cameras" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CAMERA_COUNT_OPTIONS.map((opt) => {
                  const active = config.cameraCount === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectCameraCount(opt.value)}
                      aria-pressed={active}
                      className={`${cardBase} ${active ? cardActive : cardIdle} p-4 flex flex-col items-center justify-center gap-1.5 min-h-[92px]`}
                    >
                      <Camera className={`w-5 h-5 ${active ? 'text-[#0066FF]' : 'text-white/40'}`} />
                      <span className="font-display text-lg font-bold text-white leading-none">
                        {opt.value === '12+' ? '12+' : opt.value}
                      </span>
                      <span className="text-[11px] text-white/50 text-center leading-tight">
                        {opt.value === '12+' ? 'Large site' : 'Cameras'}
                      </span>
                      {active && <ActiveTick />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Camera style / colour */}
            <div>
              <StepHeading step={2} title="Camera style & colour" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CAMERA_STYLE_OPTIONS.map((opt) => {
                  const active = config.cameraStyle === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectCameraStyle(opt.value)}
                      aria-pressed={active}
                      className={`${cardBase} ${active ? cardActive : cardIdle} p-4 flex flex-col items-center justify-center gap-2 min-h-[104px]`}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: opt.swatch, boxShadow: `0 0 0 2px ${opt.ring}` }}
                      >
                        <Camera
                          className="w-4 h-4"
                          style={{ color: opt.value.startsWith('white') ? '#111827' : '#F5F7FA' }}
                        />
                      </span>
                      <span className="text-xs font-medium text-white text-center leading-tight">
                        {opt.label}
                      </span>
                      {active && <ActiveTick />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Property type */}
            <div>
              <StepHeading step={3} title="Property type" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROPERTY_TYPE_OPTIONS.map((opt) => {
                  const active = config.propertyType === opt.value
                  const Icon = PROPERTY_ICONS[opt.value] ?? Home
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectPropertyType(opt.value)}
                      aria-pressed={active}
                      className={`${cardBase} ${active ? cardActive : cardIdle} p-4 flex items-center gap-3 min-h-[72px]`}
                    >
                      <span
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                          active
                            ? 'bg-[#0066FF]/20 border-[#0066FF]/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-[#0066FF]' : 'text-white/40'}`} />
                      </span>
                      <span className="text-sm font-medium text-white leading-tight">{opt.label}</span>
                      {active && <ActiveTick />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 4: Optional add-ons */}
            <div>
              <StepHeading step={4} title="Optional add-ons" subtitle="Select any that apply" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADD_ON_OPTIONS.map((opt) => {
                  const active = config.addOns.includes(opt.value)
                  const Icon = ADD_ON_ICONS[opt.value] ?? ShieldCheck
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleAddOn(opt.value)}
                      aria-pressed={active}
                      className={`${cardBase} ${active ? cardActive : cardIdle} p-4 flex items-start gap-3`}
                    >
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                          active
                            ? 'bg-[#0066FF]/20 border-[#0066FF]/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-[#0066FF]' : 'text-white/40'}`} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-white leading-tight">
                          {opt.label}
                        </span>
                        <span className="block text-xs text-white/45 mt-0.5 leading-snug">
                          {opt.description}
                        </span>
                      </span>
                      <span
                        className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          active ? 'bg-[#0066FF] border-[#0066FF]' : 'border-white/20'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 text-white" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Live summary panel */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24 rounded-2xl bg-white/[0.03] border border-[#0066FF]/20 glow-blue-border p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardList className="w-5 h-5 text-[#0066FF]" />
                <h3 className="font-display text-xl font-bold text-white">Your Configuration Summary</h3>
              </div>

              <dl className="space-y-4">
                <SummaryRow label="Cameras" value={readableCameraCount(config.cameraCount)} filled={!!config.cameraCount} />
                <SummaryRow
                  label="Style & colour"
                  value={config.cameraStyle ? CAMERA_STYLE_LABELS[config.cameraStyle] : 'Not selected'}
                  filled={!!config.cameraStyle}
                />
                <SummaryRow
                  label="Property type"
                  value={config.propertyType || 'Not selected'}
                  filled={!!config.propertyType}
                />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-white/40 mb-2">Add-ons</dt>
                  {config.addOns.length === 0 ? (
                    <dd className="text-sm text-white/40">None selected</dd>
                  ) : (
                    <dd className="flex flex-wrap gap-2">
                      {config.addOns.map((id) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/25 text-[#0066FF] text-xs font-medium"
                        >
                          <Check className="w-3 h-3" />
                          {ADD_ON_LABELS[id]}
                        </span>
                      ))}
                    </dd>
                  )}
                </div>
              </dl>

              <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/50 leading-relaxed">
                  Final pricing is subject to a free site survey. This is a quote request, not a
                  binding offer. A SentryVue engineer will review your configuration and contact you
                  with a tailored recommendation.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRequestQuote}
                className="mt-5 w-full py-4 bg-[#0066FF] hover:bg-[#0055DD] text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#0066FF]/25 flex items-center justify-center gap-2 text-base"
              >
                <ShieldCheck className="w-5 h-5" />
                Request My Free Quote
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="mt-3 text-center text-xs text-white/30">
                No obligation. Free site survey included.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}

function StepHeading({ step, title, subtitle }: { step: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF] text-sm font-bold flex items-center justify-center flex-shrink-0">
        {step}
      </span>
      <div>
        <h3 className="font-display text-lg font-bold text-white leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-white/40 leading-tight">{subtitle}</p>}
      </div>
    </div>
  )
}

function SummaryRow({ label, value, filled }: { label: string; value: string; filled: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs uppercase tracking-wide text-white/40 pt-0.5">{label}</dt>
      <dd className={`text-sm font-medium text-right ${filled ? 'text-white' : 'text-white/40'}`}>
        {value}
      </dd>
    </div>
  )
}

function ActiveTick() {
  return (
    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0066FF] flex items-center justify-center">
      <Check className="w-3 h-3 text-white" />
    </span>
  )
}
