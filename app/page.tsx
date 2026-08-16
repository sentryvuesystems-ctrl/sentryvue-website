import { Header } from './components/header'
import { Hero } from './components/hero'
import { Services } from './components/services'
import { HowItWorks } from './components/how-it-works'
import { WhySentryVue } from './components/why-sentryvue'
import { Gallery } from './components/gallery'
import { ContactForm } from './components/contact-form'
import { Footer } from './components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <WhySentryVue />
      <Gallery />
      <ContactForm />
      <Footer />
    </main>
  )
}
