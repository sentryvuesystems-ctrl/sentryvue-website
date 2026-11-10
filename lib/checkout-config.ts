// Single source of truth for checkout pricing. All amounts in pence (GBP).
// null = no confirmed price -> "Price on request" (never invent prices).

export type Placement = 'indoor' | 'outdoor' | 'both'
export type Resolution = '2MP' | '5MP' | '8MP'

export const CAMERA_COUNTS = [4, 8] as const
export const COMING_SOON_COUNTS = [2] as const
export const RESOLUTIONS: Resolution[] = ['2MP', '5MP', '8MP']

export const KIT_PRICES: Record<Resolution, Record<number, { name: string; pence: number | null }>> = {
  '2MP': { 4: { name: '4-camera 2MP kit', pence: null }, 8: { name: '8-camera 2MP kit', pence: null } },
  '5MP': { 4: { name: '4-camera Standard 5MP HD', pence: 19900 }, 8: { name: '8-camera Standard 5MP HD', pence: 34900 } },
  '8MP': { 4: { name: '4-camera Premium 4K Ultra HD (AI)', pence: 27900 }, 8: { name: '8-camera Premium 4K Ultra HD (AI)', pence: null } },
}

export const LAUNCH_DISCOUNT_PENCE = 2000
export const LAUNCH_OFFER_LIMIT = 20
// If the order database cannot be reached, treat the launch offer as active.
export const LAUNCH_OFFER_FALLBACK_ACTIVE = true

export const STORAGE_INCLUDED_TB = 1
export const STORAGE_MAX_TB = 5
export const STORAGE_PER_TB_PENCE = 5000

// Standard UK delivery cost outside the launch offer. Unknown -> null ("Delivery confirmed by us").
export const STANDARD_DELIVERY_PENCE: number | null = null

export const UK_POSTCODE_REGEX = /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|[A-HK-Y][0-9]{1,2}|[0-9][A-HJKS-UW]|[A-HK-Y][0-9][ABEHMNPRV-Y]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/i

export type Selection = {
  placement: Placement
  cameraCount: number
  indoorCount: number
  outdoorCount: number
  resolution: Resolution
  storageTb: number
}

export type Quote = {
  priced: boolean
  kitName: string
  kitPence: number | null
  storagePence: number
  discountPence: number
  deliveryPence: number | null
  subtotalPence: number | null
  totalPence: number | null
  launchOffer: boolean
}

export const formatGBP = (pence: number) => `£${(pence / 100).toFixed(2).replace(/\.00$/, '')}`

export function validateSelection(s: Partial<Selection>): string | null {
  if (!s || !['indoor', 'outdoor', 'both'].includes(s.placement as string)) return 'Please choose indoor, outdoor or both.'
  if (!CAMERA_COUNTS.includes(s.cameraCount as 4 | 8)) return 'Please choose a 4 or 8 camera kit.'
  if (!RESOLUTIONS.includes(s.resolution as Resolution)) return 'Please choose a camera resolution.'
  const tb = Number(s.storageTb)
  if (!Number.isInteger(tb) || tb < STORAGE_INCLUDED_TB || tb > STORAGE_MAX_TB) return `Storage must be between ${STORAGE_INCLUDED_TB}TB and ${STORAGE_MAX_TB}TB.`
  const i = Number(s.indoorCount), o = Number(s.outdoorCount)
  if (!Number.isInteger(i) || !Number.isInteger(o) || i < 0 || o < 0) return 'Camera split must be whole numbers.'
  if (i + o !== s.cameraCount) return `Indoor and outdoor cameras must add up to ${s.cameraCount}.`
  if (s.placement === 'both' && (i < 1 || o < 1)) return 'For both, choose at least one indoor and one outdoor camera.'
  if (s.placement === 'indoor' && o !== 0) return 'Indoor kits cannot include outdoor cameras.'
  if (s.placement === 'outdoor' && i !== 0) return 'Outdoor kits cannot include indoor cameras.'
  return null
}

export function computeQuote(s: Selection, offerActive: boolean): Quote {
  const kit = KIT_PRICES[s.resolution]?.[s.cameraCount]
  const kitPence = kit?.pence ?? null
  const storagePence = Math.max(0, s.storageTb - STORAGE_INCLUDED_TB) * STORAGE_PER_TB_PENCE
  const base = { kitName: kit?.name ?? 'Custom kit', storagePence, launchOffer: offerActive }
  if (kitPence === null) {
    return { ...base, priced: false, kitPence: null, discountPence: 0, deliveryPence: null, subtotalPence: null, totalPence: null }
  }
  const discountPence = offerActive ? LAUNCH_DISCOUNT_PENCE : 0
  const deliveryPence = offerActive ? 0 : STANDARD_DELIVERY_PENCE
  const subtotalPence = kitPence + storagePence - discountPence
  return { ...base, priced: true, kitPence, discountPence, deliveryPence, subtotalPence, totalPence: subtotalPence + (deliveryPence ?? 0) }
}
