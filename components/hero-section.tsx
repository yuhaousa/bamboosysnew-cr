"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useState, useEffect } from "react"

const slides = [
  {
    image: "/professional-business-people-walking-in-modern-off.jpg",
    title: "The #1",
    highlight: "AI-powered",
    subtitle: "learning platform",
    description:
      "Transform how your organization learns with intelligent personalization, AI-generated content, and insights that drive real business impact.",
  },
  {
    image: "/diverse-employees-learning-on-laptops-in-corporate.jpg",
    title: "Embrace",
    highlight: "AI & Future",
    subtitle: "of learning",
    description:
      "Stay ahead of the curve with cutting-edge AI technology that adapts to emerging skills, predicts learning needs, and prepares your workforce for tomorrow's challenges.",
  },
  {
    image: "/futuristic-ai-technology-interface-with-people-wor.jpg",
    title: "We make every",
    highlight: "workplace",
    subtitle: "a learning place",
    description:
      "Seamlessly integrate learning into daily workflows. Empower employees to grow, collaborate, and excel—right where they work, when they need it most.",
  },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const currentSlide = slides[currentIndex]

  return (
    <section className="relative min-h-[90vh] flex items-center bg-foreground overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${slide.image}')`,
              opacity: currentIndex === index ? 0.7 : 0,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-primary w-6" : "bg-background/50 hover:bg-background/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-8">
        <div className="max-w-2xl">
          <h1
            key={`title-${currentIndex}`}
            className="text-4xl font-bold tracking-tight text-background sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <span className="text-balance">{currentSlide.title} </span>
            <span className="text-primary text-balance">{currentSlide.highlight}</span>
            <span className="text-balance block">{currentSlide.subtitle}</span>
          </h1>

          <p
            key={`desc-${currentIndex}`}
            className="mt-6 text-lg leading-8 text-background/80 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
          >
            {currentSlide.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" className="text-base px-6">
              Book a demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-background hover:text-background hover:bg-background/10 text-base"
            >
              <Play className="mr-2 h-4 w-4" />
              Take a tour
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
