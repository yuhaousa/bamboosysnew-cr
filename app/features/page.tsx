import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Users,
  BarChart3,
  Sparkles,
  Shield,
  Zap,
  BookOpen,
  Target,
  Globe,
  Smartphone,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

const mainFeatures = [
  {
    name: "AI-Powered Personalization",
    description:
      "Deliver personalized learning paths that adapt to each learner's needs, preferences, and goals in real-time. Our AI analyzes learning patterns and adjusts content difficulty, pacing, and format automatically.",
    icon: Brain,
    benefits: [
      "Adaptive learning paths",
      "Smart content recommendations",
      "Real-time progress adjustment",
      "Skill gap analysis",
    ],
    image: "/ai-personalized-learning-dashboard-interface.jpg",
  },
  {
    name: "Social Learning",
    description:
      "Foster collaboration and knowledge sharing with integrated social features, peer learning, and community building. Create vibrant learning communities that enhance engagement and retention.",
    icon: Users,
    benefits: ["Discussion forums", "Peer-to-peer mentoring", "Group projects", "Knowledge sharing"],
    image: "/social-learning-collaboration-platform-interface.jpg",
  },
  {
    name: "Advanced Analytics",
    description:
      "Gain actionable insights with comprehensive dashboards, predictive analytics, and custom reporting. Make data-driven decisions to improve learning outcomes across your organization.",
    icon: BarChart3,
    benefits: ["Custom dashboards", "Predictive insights", "ROI tracking", "Completion analytics"],
    image: "/learning-analytics-dashboard-with-charts-and-graph.jpg",
  },
  {
    name: "AI Content Generation",
    description:
      "Create engaging courses in minutes with AI-assisted content generation, translation, and optimization. Transform existing materials into interactive learning experiences effortlessly.",
    icon: Sparkles,
    benefits: ["Auto-generate quizzes", "Content translation", "Video transcription", "Course templates"],
    image: "/ai-content-tool-interface.png",
  },
]

const additionalFeatures = [
  {
    name: "Enterprise Security",
    description: "SOC 2 compliance, SSO integration, and enterprise-grade security.",
    icon: Shield,
  },
  {
    name: "Seamless Integrations",
    description: "Connect with 400+ business tools via native integrations.",
    icon: Zap,
  },
  {
    name: "Mobile Learning",
    description: "Native iOS and Android apps for learning on the go.",
    icon: Smartphone,
  },
  {
    name: "Course Authoring",
    description: "Intuitive drag-and-drop course builder for rapid content creation.",
    icon: BookOpen,
  },
  {
    name: "Certifications",
    description: "Issue verifiable certificates and track compliance training.",
    icon: Award,
  },
  {
    name: "Gamification",
    description: "Boost engagement with points, badges, and leaderboards.",
    icon: Target,
  },
  {
    name: "Multi-language",
    description: "Support for 40+ languages with auto-translation.",
    icon: Globe,
  },
  {
    name: "Microlearning",
    description: "Bite-sized content modules for busy learners.",
    icon: Clock,
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Platform Features</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Powerful features for <span className="text-primary">modern learning</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, deliver, and measure impactful learning experiences. Powered by AI,
              designed for scale.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="text-base">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                Watch demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features - Alternating Layout */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-32">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className={`flex flex-col gap-12 lg:gap-16 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">{feature.name}</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                  <ul className="grid grid-cols-2 gap-3 pt-4">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Button variant="outline" className="group bg-transparent">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-1 w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
                    <img src={feature.image || "/placeholder.svg"} alt={feature.name} className="w-full h-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">And so much more</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore the full suite of capabilities designed to power your learning programs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.name}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why choose Learnify?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how we compare to traditional learning management systems.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-primary">Learnify</th>
                  <th className="text-center py-4 px-6 font-semibold text-muted-foreground">Traditional LMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feature: "AI-Powered Personalization", learnify: true, traditional: false },
                  { feature: "Real-time Analytics", learnify: true, traditional: false },
                  { feature: "Auto Content Generation", learnify: true, traditional: false },
                  { feature: "Mobile Native Apps", learnify: true, traditional: true },
                  { feature: "Social Learning", learnify: true, traditional: false },
                  { feature: "400+ Integrations", learnify: true, traditional: false },
                  { feature: "24/7 Support", learnify: true, traditional: true },
                ].map((row) => (
                  <tr key={row.feature} className="bg-card hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6 text-foreground">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {row.learnify ? (
                        <CheckCircle className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.traditional ? (
                        <CheckCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
              Ready to transform your learning programs?
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
              Join thousands of organizations delivering impactful learning experiences with Learnify.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" variant="secondary" className="text-base">
                Start free trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
