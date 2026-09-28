import type { Metadata } from 'next'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { SystemConfigurator } from './components/SystemConfigurator'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Build Your CCTV System | SentryVue Systems',
  description:
    'Configure your ideal CCTV system in a few taps — choose your camera count, NVR storage and fulfilment (professional installation in Huddersfield or supply & delivery), then send your enquiry for a fast, confirmed quote.',
}

export default function ConfigurePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <SystemConfigurator />
      <Footer />
    </main>
  )
}
