// Shared types + helpers for the CCTV Quote Configurator.
// Keeping these in `lib/` mirrors the existing convention (see lib/types.ts, lib/utils.ts)
// so the configurator UI and the enquiry form can share a single source of truth.

export type CameraCount = '2' | '4' | '6' | '8' | '10' | '12' | '12+'

export type CameraStyleId = 'white-dome' | 'black-dome' | 'white-turret' | 'black-turret'

export type PropertyType =
  | 'Residential'
  | 'Small Business'
  | 'Warehouse/Industrial'
  | 'Construction Site'
  | 'Mixed Use'

export type AddOnId =
  | 'remote-viewing'
  | 'night-vision'
  | 'motion-alerts'
  | 'recording-storage'
  | 'video-doorbell'
  | 'maintenance-plan'

export interface QuoteConfig {
  cameraCount: CameraCount | ''
  cameraStyle: CameraStyleId | ''
  propertyType: PropertyType | ''
  addOns: AddOnId[]
}

export const CAMERA_COUNT_OPTIONS: { value: CameraCount; label: string }[] = [
  { value: '2', label: '2' },
  { value: '4', label: '4' },
  { value: '6', label: '6' },
  { value: '8', label: '8' },
  { value: '10', label: '10' },
  { value: '12', label: '12' },
  { value: '12+', label: '12+ (large site)' },
]

export const CAMERA_STYLE_OPTIONS: {
  value: CameraStyleId
  label: string
  swatch: string // hex used for the visual swatch
  ring: string // border colour for the swatch
}[] = [
  { value: 'white-dome', label: 'White Dome', swatch: '#F5F7FA', ring: 'rgba(255,255,255,0.4)' },
  { value: 'black-dome', label: 'Black Dome', swatch: '#111827', ring: 'rgba(255,255,255,0.25)' },
  { value: 'white-turret', label: 'White Turret', swatch: '#F5F7FA', ring: 'rgba(255,255,255,0.4)' },
  { value: 'black-turret', label: 'Black Turret', swatch: '#111827', ring: 'rgba(255,255,255,0.25)' },
]

export const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Small Business', label: 'Small Business' },
  { value: 'Warehouse/Industrial', label: 'Warehouse / Industrial' },
  { value: 'Construction Site', label: 'Construction Site' },
  { value: 'Mixed Use', label: 'Mixed Use' },
]

export const ADD_ON_OPTIONS: { value: AddOnId; label: string; description: string }[] = [
  { value: 'remote-viewing', label: 'Remote / Phone Viewing', description: 'Live view from anywhere on your phone or tablet.' },
  { value: 'night-vision', label: 'Night Vision (IR)', description: 'Clear footage in low-light and total darkness.' },
  { value: 'motion-alerts', label: 'Motion Detection Alerts', description: 'Instant notifications when movement is detected.' },
  { value: 'recording-storage', label: 'CCTV Recording & Storage (NVR/DVR)', description: 'Secure on-site recording with configurable retention.' },
  { value: 'video-doorbell', label: 'Video Doorbell / Intercom', description: 'See and speak to visitors at your door.' },
  { value: 'maintenance-plan', label: 'Annual Maintenance Plan', description: 'Yearly health checks to keep your system reliable.' },
]

// Map friendly labels for use in summaries / emails.
export const CAMERA_STYLE_LABELS: Record<CameraStyleId, string> = {
  'white-dome': 'White Dome',
  'black-dome': 'Black Dome',
  'white-turret': 'White Turret',
  'black-turret': 'Black Turret',
}

export const ADD_ON_LABELS: Record<AddOnId, string> = {
  'remote-viewing': 'Remote / Phone Viewing',
  'night-vision': 'Night Vision (IR)',
  'motion-alerts': 'Motion Detection Alerts',
  'recording-storage': 'CCTV Recording & Storage (NVR/DVR)',
  'video-doorbell': 'Video Doorbell / Intercom',
  'maintenance-plan': 'Annual Maintenance Plan',
}

export const QUOTE_PREFILL_STORAGE_KEY = 'sentryvue:quote-config'
export const QUOTE_PREFILL_EVENT = 'sentryvue:prefill-quote'

export interface QuotePrefillPayload {
  configuratorSummary: string
  cameraCount: string // mapped to the existing enquiry select range
  propertyType: string // mapped to the existing enquiry select value
}

// The existing enquiry <select> uses coarse ranges — map the precise count to the nearest.
export function mapCameraCountToEnquiryRange(count: CameraCount | ''): string {
  switch (count) {
    case '2':
    case '4':
      return '1-4'
    case '6':
    case '8':
      return '4-8'
    case '10':
    case '12':
    case '12+':
      return '8+'
    default:
      return ''
  }
}

// The existing enquiry <select> only offers Residential / Small Business / Commercial.
export function mapPropertyTypeToEnquiry(propertyType: PropertyType | ''): string {
  switch (propertyType) {
    case 'Residential':
      return 'Residential'
    case 'Small Business':
      return 'Small Business'
    case 'Warehouse/Industrial':
    case 'Construction Site':
    case 'Mixed Use':
      return 'Commercial'
    default:
      return ''
  }
}

export function readableCameraCount(count: CameraCount | ''): string {
  if (!count) return 'Not selected'
  return count === '12+' ? '12+ (large site)' : count
}

// Build a clean, human-readable summary block that is appended to the enquiry
// message and included in the notification email body.
export function buildConfiguratorSummary(config: QuoteConfig): string {
  const lines: string[] = []
  lines.push('----- CCTV Quote Configurator -----')
  lines.push(`Number of cameras: ${readableCameraCount(config.cameraCount)}`)
  lines.push(`Camera style / colour: ${config.cameraStyle ? CAMERA_STYLE_LABELS[config.cameraStyle] : 'Not selected'}`)
  lines.push(`Property type: ${config.propertyType || 'Not selected'}`)
  const addOns = (config.addOns ?? []).map((id) => ADD_ON_LABELS[id]).filter(Boolean)
  lines.push(`Add-ons: ${addOns.length ? addOns.join(', ') : 'None selected'}`)
  lines.push('-----------------------------------')
  lines.push('This is a quote request, not a binding offer. A SentryVue engineer will')
  lines.push('review your configuration and contact you with a tailored recommendation.')
  lines.push('Final pricing is subject to a free site survey.')
  return lines.join('\n')
}
