import { prisma } from '@/lib/prisma'
import { LAUNCH_OFFER_FALLBACK_ACTIVE, LAUNCH_OFFER_LIMIT } from '@/lib/checkout-config'

// Counts paid/placed orders server-side. Falls back to the config flag if the DB is unavailable.
export async function getLaunchOffer(): Promise<{ active: boolean; remaining: number | null; source: 'database' | 'fallback' }> {
  try {
    const used = await prisma.order.count({ where: { status: { in: ['paid', 'placed'] } } })
    const remaining = Math.max(0, LAUNCH_OFFER_LIMIT - used)
    return { active: remaining > 0, remaining, source: 'database' }
  } catch (error) {
    console.error('Launch offer count unavailable; using fallback flag.', error instanceof Error ? error.message : '')
    return { active: LAUNCH_OFFER_FALLBACK_ACTIVE, remaining: null, source: 'fallback' }
  }
}
