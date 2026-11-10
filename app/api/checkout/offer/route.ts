import { NextResponse } from 'next/server'
import { getLaunchOffer } from '@/lib/launch-offer'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getLaunchOffer())
}
