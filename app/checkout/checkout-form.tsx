'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CAMERA_COUNTS, COMING_SOON_COUNTS, RESOLUTIONS, STORAGE_INCLUDED_TB, STORAGE_MAX_TB, STORAGE_PER_TB_PENCE,
  LAUNCH_DISCOUNT_PENCE, UK_POSTCODE_REGEX, computeQuote, formatGBP, validateSelection, type Placement, type Resolution,
} from '@/lib/checkout-config'

const opt = (active: boolean) => `px-4 py-3 rounded-xl border text-sm font-semibold transition ${active ? 'border-[#0A2342] bg-[#0A2342] text-white' : 'border-[#E3E9F2] bg-white text-[#0A2342] hover:border-[#4FC3E8]'}`
const input = 'w-full rounded-lg border border-[#E3E9F2] bg-white px-3 py-2 text-[#0A2342] focus:outline-none focus:ring-2 focus:ring-[#4FC3E8]'

export function CheckoutForm() {
  const [placement, setPlacement] = useState<Placement>('outdoor')
  const [cameraCount, setCameraCount] = useState(4)
  const [indoor, setIndoor] = useState(2)
  const [resolution, setResolution] = useState<Resolution>('5MP')
  const [storageTb, setStorageTb] = useState(STORAGE_INCLUDED_TB)
  const [offer, setOffer] = useState<{ active: boolean; remaining: number | null } | null>(null)
  const [payment, setPayment] = useState<'card' | 'bank_transfer'>('card')
  const [customer, setCustomer] = useState({ fullName: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', county: '', postcode: '', notes: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetch('/api/checkout/offer').then(r => r.json()).then(setOffer).catch(() => setOffer({ active: true, remaining: null })) }, [])

  const indoorCount = placement === 'indoor' ? cameraCount : placement === 'outdoor' ? 0 : indoor
  const outdoorCount = placement === 'both' ? Math.max(0, cameraCount - indoor) : placement === 'outdoor' ? cameraCount : 0
  const selection = { placement, cameraCount, indoorCount, outdoorCount, resolution, storageTb }
  const selectionError = validateSelection(selection)
  const offerActive = offer?.active ?? true
  const quote = useMemo(() => computeQuote(selection, offerActive), [placement, cameraCount, indoorCount, outdoorCount, resolution, storageTb, offerActive]) // eslint-disable-line react-hooks/exhaustive-deps
  const set = (k: keyof typeof customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCustomer({ ...customer, [k]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (selectionError) return setError(selectionError)
    if (!UK_POSTCODE_REGEX.test(customer.postcode.trim())) return setError('We currently deliver to UK addresses only. Please enter a valid UK postcode.')
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...selection, paymentMethod: payment, customer }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.redirectUrl) throw new Error(data?.error || 'Sorry, something went wrong. Please try again or call 07512 621107.')
      window.location.href = data.redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sorry, something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-[#E3E9F2] p-5">
          <h2 className="font-bold mb-3">1. Where will the cameras go?</h2>
          <div className="grid grid-cols-3 gap-2">
            {(['indoor', 'outdoor', 'both'] as Placement[]).map(p => <button type="button" key={p} onClick={() => setPlacement(p)} className={opt(placement === p)}>{p === 'both' ? 'Both' : p[0].toUpperCase() + p.slice(1)}</button>)}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E3E9F2] p-5">
          <h2 className="font-bold mb-3">2. How many cameras?</h2>
          <div className="grid grid-cols-3 gap-2">
            {COMING_SOON_COUNTS.map(n => <button type="button" key={n} disabled className="px-4 py-3 rounded-xl border border-dashed border-[#E3E9F2] text-sm text-[#55607A] bg-[#F4F7FB] cursor-not-allowed">{n} cameras<br /><span className="text-xs">Coming soon</span></button>)}
            {CAMERA_COUNTS.map(n => <button type="button" key={n} onClick={() => { setCameraCount(n); setIndoor(Math.floor(n / 2)) }} className={opt(cameraCount === n)}>{n} cameras</button>)}
          </div>
          {placement === 'both' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-sm">Indoor cameras
                <input type="number" min={1} max={cameraCount - 1} value={indoor} onChange={e => setIndoor(Number(e.target.value))} className={input} />
              </label>
              <label className="text-sm">Outdoor cameras
                <input type="number" min={1} max={cameraCount - 1} value={outdoorCount} onChange={e => setIndoor(cameraCount - Number(e.target.value))} className={input} />
              </label>
              {selectionError && <p className="col-span-2 text-sm text-red-600">{selectionError}</p>}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-[#E3E9F2] p-5">
          <h2 className="font-bold mb-3">3. Camera resolution</h2>
          <div className="grid grid-cols-3 gap-2">
            {RESOLUTIONS.map(r => <button type="button" key={r} onClick={() => setResolution(r)} className={opt(resolution === r)}>{r}</button>)}
          </div>
          <p className="mt-2 text-sm text-[#55607A]">{quote.kitName}</p>
        </section>

        <section className="bg-white rounded-2xl border border-[#E3E9F2] p-5">
          <h2 className="font-bold mb-3">4. Storage</h2>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: STORAGE_MAX_TB }, (_, i) => i + 1).map(tb => <button type="button" key={tb} onClick={() => setStorageTb(tb)} className={opt(storageTb === tb)}>{tb}TB</button>)}
          </div>
          <p className="mt-2 text-sm text-[#55607A]">{STORAGE_INCLUDED_TB}TB included. Each extra TB adds {formatGBP(STORAGE_PER_TB_PENCE)}.</p>
        </section>

        {quote.priced ? (
          <>
            <section className="bg-white rounded-2xl border border-[#E3E9F2] p-5">
              <h2 className="font-bold mb-3">5. Your details and UK delivery address</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <label>Full name *<input required value={customer.fullName} onChange={set('fullName')} className={input} /></label>
                <label>Email *<input required type="email" value={customer.email} onChange={set('email')} className={input} /></label>
                <label>Phone *<input required type="tel" value={customer.phone} onChange={set('phone')} className={input} /></label>
                <label>Postcode *<input required value={customer.postcode} onChange={set('postcode')} className={input} /></label>
                <label className="sm:col-span-2">Address line 1 *<input required value={customer.addressLine1} onChange={set('addressLine1')} className={input} /></label>
                <label className="sm:col-span-2">Address line 2<input value={customer.addressLine2} onChange={set('addressLine2')} className={input} /></label>
                <label>Town or city *<input required value={customer.city} onChange={set('city')} className={input} /></label>
                <label>County<input value={customer.county} onChange={set('county')} className={input} /></label>
                <label className="sm:col-span-2">Notes<textarea rows={3} value={customer.notes} onChange={set('notes')} className={input} /></label>
              </div>
            </section>
            <section className="bg-white rounded-2xl border border-[#E3E9F2] p-5">
              <h2 className="font-bold mb-3">6. Payment</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                <button type="button" onClick={() => setPayment('card')} className={opt(payment === 'card')}>Card (secure checkout)</button>
                <button type="button" onClick={() => setPayment('bank_transfer')} className={opt(payment === 'bank_transfer')}>Bank transfer</button>
              </div>
              {payment === 'bank_transfer' && <p className="mt-2 text-sm text-[#55607A]">Bank details will be sent by email.</p>}
            </section>
          </>
        ) : (
          <section className="bg-white rounded-2xl border border-[#4FC3E8] p-5">
            <h2 className="font-bold mb-2">Price on request</h2>
            <p className="text-sm text-[#55607A] mb-4">We don&apos;t have a fixed price for this combination yet. Send us an enquiry and we&apos;ll get back to you with a quote.</p>
            <Link href="/#contact" className="inline-block px-6 py-3 rounded-lg bg-[#0A2342] text-white font-semibold">Request a quote</Link>
          </section>
        )}
      </div>

      <aside className="bg-white rounded-2xl border border-[#E3E9F2] p-5 h-fit lg:sticky lg:top-6">
        <h2 className="font-bold mb-3">Order summary</h2>
        {offerActive && <div className="mb-3 rounded-lg bg-[#4FC3E8]/15 text-[#0A2342] text-sm p-3">Launch offer: {formatGBP(LAUNCH_DISCOUNT_PENCE)} off + free UK delivery{offer?.remaining != null ? ` (${offer.remaining} left)` : ''}</div>}
        <dl className="text-sm space-y-2">
          <div className="flex justify-between gap-2"><dt>Kit</dt><dd className="text-right">{quote.kitName}</dd></div>
          <div className="flex justify-between"><dt>Split</dt><dd>{indoorCount} indoor / {outdoorCount} outdoor</dd></div>
          <div className="flex justify-between"><dt>Resolution</dt><dd>{resolution}</dd></div>
          <div className="flex justify-between"><dt>Kit price</dt><dd>{quote.kitPence !== null ? formatGBP(quote.kitPence) : 'Price on request'}</dd></div>
          <div className="flex justify-between"><dt>Storage ({storageTb}TB)</dt><dd>{quote.storagePence ? `+${formatGBP(quote.storagePence)}` : 'Included'}</dd></div>
          {quote.priced && quote.discountPence > 0 && <div className="flex justify-between text-green-700"><dt>Launch discount</dt><dd>-{formatGBP(quote.discountPence)}</dd></div>}
          <div className="flex justify-between"><dt>Delivery (UK)</dt><dd>{!quote.priced ? '—' : quote.deliveryPence === null ? 'Delivery confirmed by us' : quote.deliveryPence === 0 ? 'Free' : formatGBP(quote.deliveryPence)}</dd></div>
          <div className="border-t border-[#E3E9F2] pt-2 flex justify-between font-bold text-base">
            <dt>Total</dt>
            <dd>{quote.totalPence !== null ? <>{quote.discountPence > 0 && <span className="line-through text-[#55607A] font-normal mr-2">{formatGBP(quote.totalPence + quote.discountPence)}</span>}{formatGBP(quote.totalPence)}</> : 'Price on request'}</dd>
          </div>
          <p className="text-xs text-[#55607A]">VAT TBC</p>
        </dl>
        {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
        {quote.priced && <button type="submit" disabled={submitting || !!selectionError} className="mt-4 w-full py-3 rounded-lg bg-[#0A2342] hover:bg-[#123462] text-white font-semibold disabled:opacity-60">{submitting ? 'Placing order…' : payment === 'card' ? 'Continue to payment' : 'Place order'}</button>}
      </aside>
    </form>
  )
}
