import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LogoBar } from "@/components/logo-bar"
import { PlatformSection } from "@/components/platform-section"
import { AISection } from "@/components/ai-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StatsSection } from "@/components/stats-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <LogoBar />
      <PlatformSection />
      <AISection />
      <FeaturesSection />
      <TestimonialsSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
