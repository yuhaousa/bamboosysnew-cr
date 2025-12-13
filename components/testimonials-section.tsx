import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Learnify has completely transformed how we approach employee development. The AI-powered recommendations have increased our course completion rates by 340%.",
    author: "Sarah Chen",
    role: "Chief Learning Officer",
    company: "TechCorp Global",
    image: "/professional-woman-headshot.png",
  },
  {
    quote:
      "The platform's ability to create personalized learning paths at scale has been a game-changer. Our team is more engaged than ever before.",
    author: "Marcus Rodriguez",
    role: "VP of People Operations",
    company: "InnovateCo",
    image: "/professional-man-headshot.png",
  },
  {
    quote:
      "We evaluated 15 different LMS platforms. Learnify's AI capabilities and enterprise features made it the clear winner for our organization.",
    author: "Emily Watson",
    role: "Director of L&D",
    company: "Global Finance Inc",
    image: "/professional-woman-executive-headshot.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Testimonials</p>
          <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl text-balance">
            Trusted by learning leaders worldwide
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background/5 backdrop-blur border border-background/10 rounded-xl p-8 hover:bg-background/10 transition-colors"
            >
              <Quote className="h-8 w-8 text-primary mb-4" />
              <p className="text-background/90 leading-relaxed mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-background">{testimonial.author}</p>
                  <p className="text-sm text-background/60">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
