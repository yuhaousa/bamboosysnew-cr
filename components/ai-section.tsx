import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function AISection() {
  return (
    <section className="py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              The Future of Learning
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Driven by innovation.
              <br />
              Powered by AI.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We're more than an LMS. We're the foundation on which the future of learning is built. Which is why
              innovation is the driving force behind our platform—and AI is at its core.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              We harness the power of AI to accelerate content production, automate workflows and improve the learner
              experience. It's like doubling the size of your team, without adding headcount. Bigger impact, greater
              results.
            </p>
            <Link href="#ai" className="inline-flex items-center gap-2 mt-8 text-primary font-medium hover:underline">
              Learn more about Learnify AI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* AI Interface Mockup */}
          <div className="relative">
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url('/diverse-team-collaborating-in-modern-office-with-l.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-gradient-to-t from-background/80 to-transparent p-8 pt-48">
                {/* AI Form Card */}
                <div className="bg-card border border-border rounded-lg p-4 max-w-xs ml-auto shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">✦</span>
                    </div>
                    <span className="text-xs text-muted-foreground">AI Assistant</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Number of activities</label>
                      <div className="mt-1 bg-muted rounded px-3 py-2 text-sm">8</div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Activity types</label>
                      <div className="mt-1 bg-muted rounded px-3 py-2 text-sm flex items-center justify-between">
                        Multiple choice
                        <span className="text-primary">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
