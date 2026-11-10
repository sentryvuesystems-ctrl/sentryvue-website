import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { computeQuote, validateSelection, UK_POSTCODE_REGEX, type Selection } from '@/lib/checkout-config'
import { getLaunchOffer } from '@/lib/launch-offer'
import { sendOrderNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  let body: any
  try { body = await request.json() } catch { return bad('Invalid request.') }

  const selection: Selection = {
    placement: body?.placement, cameraCount: Number(body?.cameraCount), indoorCount: Number(body?.indoorCount),
    outdoorCount: Number(body?.outdoorCount), resolution: body?.resolution, storageTb: Number(body?.storageTb),
  }
  const selectionError = validateSelection(selection)
  if (selectionError) return bad(selectionError)

  const c = body?.customer ?? {}
  const customer = {
    fullName: str(c.fullName), email: str(c.email), phone: str(c.phone, 40), addressLine1: str(c.addressLine1),
    addressLine2: str(c.addressLine2) || null, city: str(c.city, 100), county: str(c.county, 100) || null,
    postcode: str(c.postcode, 10).toUpperCase(), notes: str(c.notes, 2000) || null,
  }
  if (!customer.fullName || !customer.phone || !customer.addressLine1 || !customer.city) return bad('Please complete all required fields.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return bad('Please enter a valid email address.')
  if (!UK_POSTCODE_REGEX.test(customer.postcode)) return bad('We currently deliver to UK addresses only. Please enter a valid UK postcode.')
  const paymentMethod = body?.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'card'

  // Server recomputes the price; client-supplied totals are ignored.
  const offer = await getLaunchOffer()
  const quote = computeQuote(selection, offer.active)
  if (!quote.priced || quote.totalPence === null || quote.kitPence === null || quote.subtotalPence === null) {
    return bad('This combination is price on request. Please send us an enquiry for a quote.')
  }

  const reference = `SV-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`
  let order
  try {
    order = await prisma.order.create({
      data: {
        reference, status: 'pending', ...selection, kitName: quote.kitName, kitPence: quote.kitPence,
        storagePence: quote.storagePence, discountPence: quote.discountPence, subtotalPence: quote.subtotalPence,
        deliveryPence: quote.deliveryPence, totalPence: quote.totalPence, launchOffer: quote.launchOffer,
        paymentMethod, ...customer,
      },
    })
  } catch (error) {
    console.error('Order could not be saved.', error instanceof Error ? error.message : '')
    return bad('Sorry, we could not save your order right now. Please try again, or call 07512 621107 / email info@sentryvue.co.uk.', 503)
  }

  try { await sendOrderNotification(order) } catch (error) { console.error(error instanceof Error ? error.message : 'Order email failed') }

  const origin = new URL(request.url).origin
  const successUrl = `${origin}/checkout/success?ref=${encodeURIComponent(reference)}`
  const secret = process.env.STRIPE_SECRET_KEY

  if (paymentMethod === 'card' && secret) {
    if (secret.startsWith('sk_live')) return bad('Card payments are not enabled yet. Please choose bank transfer.', 503)
    try {
      const form = new URLSearchParams({
        mode: 'payment', success_url: `${successUrl}&paid=1`, cancel_url: `${origin}/checkout?cancelled=1`,
        customer_email: customer.email, client_reference_id: reference, 'metadata[reference]': reference,
        'shipping_address_collection[allowed_countries][0]': 'GB',
        'line_items[0][quantity]': '1', 'line_items[0][price_data][currency]': 'gbp',
        'line_items[0][price_data][unit_amount]': String(quote.totalPence),
        'line_items[0][price_data][product_data][name]': `${quote.kitName}, ${selection.storageTb}TB storage`,
      })
      const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: form,
      })
      const session = await res.json()
      if (!res.ok || !session?.url) throw new Error(`Stripe session failed: ${res.status}`)
      await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } }).catch(() => undefined)
      return NextResponse.json({ reference, redirectUrl: session.url }, { status: 201 })
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Stripe error')
      return bad(`Your order ${reference} was saved but card payment could not be started. We will contact you to complete payment.`, 502)
    }
  }

  // Mock/test flow (no Stripe keys) or bank transfer: order recorded as pending.
  return NextResponse.json({ reference, redirectUrl: `/checkout/success?ref=${encodeURIComponent(reference)}${paymentMethod === 'bank_transfer' ? '&method=bank' : ''}` }, { status: 201 })
}
