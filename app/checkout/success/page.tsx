import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function SuccessPage({ searchParams }: { searchParams: { ref?: string; method?: string; paid?: string } }) {
  const ref = (searchParams?.ref ?? '').replace(/[^A-Z0-9-]/gi, '').slice(0, 40)
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#0A2342] flex items-center justify-center px-4">
      <div className="bg-white border border-[#E3E9F2] rounded-2xl p-8 max-w-lg w-full text-center shadow-sm">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#4FC3E8]/20 flex items-center justify-center text-2xl">✓</div>
        <h1 className="text-2xl font-bold mb-2">Thank you for your order</h1>
        {ref ? <p className="mb-4">Your order reference is <strong>{ref}</strong>.</p> : <p className="mb-4">Your order has been received.</p>}
        {searchParams?.method === 'bank' && <p className="mb-4 text-[#55607A]">Bank details will be sent by email.</p>}
        {searchParams?.paid !== '1' && searchParams?.method !== 'bank' && <p className="mb-4 text-[#55607A]">Your order is pending. We will be in touch to confirm payment and delivery.</p>}
        <p className="text-sm text-[#55607A] mb-6">Questions? Call 07512 621107 or email info@sentryvue.co.uk.</p>
        <Link href="/" className="inline-block px-6 py-3 rounded-lg bg-[#0A2342] text-white font-semibold">Back to home</Link>
      </div>
    </main>
  )
}
