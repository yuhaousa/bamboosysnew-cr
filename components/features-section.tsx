import { Brain, Users, BarChart3, Sparkles, Shield, Zap } from "lucide-react"

const features = [
  {
    name: "AI-Powered Personalization",
    description:
      "Deliver personalized learning paths that adapt to each learner's needs, preferences, and goals in real-time.",
    icon: Brain,
  },
  {
    name: "Social Learning",
    description:
      "Foster collaboration and knowledge sharing with integrated social features, peer learning, and community building.",
    icon: Users,
  },
  {
    name: "Advanced Analytics",
    description: "Gain actionable insights with comprehensive dashboards, predictive analytics, and custom reporting.",
    icon: BarChart3,
  },
  {
    name: "Content Generation",
    description:
      "Create engaging courses in minutes with AI-assisted content generation, translation, and optimization.",
    icon: Sparkles,
  },
  {
    name: "Enterprise Security",
    description:
      "Rest easy with SOC 2 compliance, SSO integration, and enterprise-grade security for your learning data.",
    icon: Shield,
  },
  {
    name: "Seamless Integrations",
    description:
      "Connect with 400+ business tools including HRIS, CRM, and collaboration platforms via native integrations.",
    icon: Zap,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Capabilities</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Everything you need to transform learning
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our comprehensive platform combines cutting-edge AI with proven learning science to deliver results that
            matter.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
