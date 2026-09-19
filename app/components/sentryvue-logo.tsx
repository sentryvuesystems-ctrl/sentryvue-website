'use client'

import Image from 'next/image'

interface SentryVueLogoProps {
  /** Overall height in px */
  size?: number
  /** Show text beside icon */
  showText?: boolean
  /** Show tagline below (footer mode) */
  showTagline?: boolean
  /** Colour variant: 'light' for light backgrounds, 'dark' for dark backgrounds */
  variant?: 'light' | 'dark'
  className?: string
}

export function SentryVueLogo({ size = 40, showText = true, showTagline = false, variant = 'light', className = '' }: SentryVueLogoProps) {
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#0A0F1E]'
  const subColor = variant === 'dark' ? 'text-white/40' : 'text-[#55607A]'
  const subColorAlt = variant === 'dark' ? 'text-white/50' : 'text-[#6b7488]'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Shield icon */}
      <div
        className="relative flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/sentryvue-shield.png"
          alt="SentryVue Systems shield logo"
          fill
          sizes="48px"
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-display font-bold ${textColor} tracking-tight leading-tight`} style={{ fontSize: size * 0.42 }}>
            Sentry<span className="text-[#0066FF]">Vue</span>
          </span>
          {showTagline ? (
            <span className={`${subColor} tracking-[0.15em] uppercase leading-tight`} style={{ fontSize: size * 0.18 }}>
              See More. Stay Secure.
            </span>
          ) : (
            <span className={`${subColorAlt} tracking-[0.2em] uppercase leading-tight`} style={{ fontSize: size * 0.2 }}>
              Systems
            </span>
          )}
        </div>
      )}
    </div>
  )
}
