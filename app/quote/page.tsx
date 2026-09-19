import type { Metadata } from 'next'
import { Header } from '../components/header'
import { QuoteConfigurator } from '../components/quote-configurator'
import { Footer } from '../components/footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Build Your CCTV Quote | SentryVue Systems',
  description:
    'Configure your ideal CCTV system — number of cameras, style, property type and add-ons — and request a free, no-obligation quote from SentryVue Systems.',
}

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Spacer so the fixed header does not overlap the first section. */}
      <div className="pt-16 sm:pt-20" />
      {/* On the standalone page the enquiry form lives on the homepage, so the
          configurator hands off to /#contact after building the summary. */}
      <QuoteConfigurator redirectToContact />
      <Footer />
    </main>
  )
}
