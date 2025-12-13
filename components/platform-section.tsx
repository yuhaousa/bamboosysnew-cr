import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function PlatformSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Platform Dashboard Mockup */}
          <div className="relative">
            <div className="bg-card border border-border rounded-xl shadow-2xl p-6 space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Completions rate</p>
                  <p className="text-2xl font-bold text-primary">43.6%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">First Access to Completion</p>
                  <p className="text-2xl font-bold text-foreground">24 minutes</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Avg. Learning Time</p>
                  <p className="text-2xl font-bold text-foreground">4 hours</p>
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm">Skills</span>
                  <span className="text-xs text-primary">+ Suggested skills</span>
                </div>
                <div className="space-y-2">
                  {["Client relationship management", "Leadership", "Content Analytics"].map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Enrollments Status", value: "80.85k", color: "bg-primary" },
                  { label: "Completion Breakdown", value: "34.97%", color: "bg-chart-2" },
                  { label: "Self-Enrollments", value: "80.85k", color: "bg-chart-3" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-muted"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="75, 100"
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold">{item.value}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Our Platform</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Discover the limitless power of learning
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Learning programs are only as good as the platform they're built on. Without a solid foundation, you can't
              engage your learners, deliver business value, grow your programs, simplify content management, or
              streamline your workflows and tech stack.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              The Learnify learning platform provides the foundation you need to help your people and business learn,
              grow, and succeed, today and into the future.
            </p>
            <Link
              href="#platform"
              className="inline-flex items-center gap-2 mt-8 text-primary font-medium hover:underline"
            >
              Discover the Learnify learning platform
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
