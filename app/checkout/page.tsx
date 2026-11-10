import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutForm } from './checkout-form'

export const metadata: Metadata = { title: 'Buy a CCTV kit | SentryVue Systems' }

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#0A2342]">
      <header className="bg-white border-b border-[#E3E9F2]">
        <div className="max-w-[1100px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-[#0A2342]">SentryVue Systems</Link>
          <Link href="/#contact" className="text-sm text-[#0A2342] hover:underline">Need help? Get a quote</Link>
        </div>
      </header>
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Build your CCTV kit</h1>
        <p className="text-[#55607A] mb-6">Kit only (supply). UK delivery only.</p>
        <CheckoutForm />
      </div>
    </main>
  )
}
