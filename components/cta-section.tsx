import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Ready to transform your learning experience?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join thousands of organizations already using Learnify to create impactful learning experiences. Book a demo
            today and see the difference AI-powered learning can make.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8">
              Book a demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 bg-transparent">
              Contact sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
