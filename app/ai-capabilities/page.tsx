import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Brain,
  Sparkles,
  Target,
  MessageSquare,
  FileText,
  BarChart3,
  Zap,
  Shield,
  Users,
  Lightbulb,
  Cpu,
  Network,
  Bot,
  Workflow,
  Search,
  Globe,
} from "lucide-react"

const aiFeatures = [
  {
    icon: Brain,
    title: "Adaptive Learning Paths",
    description:
      "AI analyzes each learner's performance, preferences, and goals to create personalized learning journeys that evolve in real-time.",
  },
  {
    icon: Sparkles,
    title: "AI Content Generation",
    description:
      "Generate quizzes, summaries, flashcards, and assessments automatically from your existing content using advanced language models.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description:
      "Identify knowledge gaps across your organization and receive AI-powered recommendations for targeted training interventions.",
  },
  {
    icon: MessageSquare,
    title: "AI Learning Assistant",
    description:
      "24/7 intelligent chatbot that answers questions, provides explanations, and guides learners through complex topics.",
  },
  {
    icon: FileText,
    title: "Smart Content Curation",
    description:
      "AI automatically tags, categorizes, and recommends relevant content based on learner profiles and organizational needs.",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description:
      "Forecast learning outcomes, identify at-risk learners, and optimize training ROI with machine learning insights.",
  },
]

const advancedCapabilities = [
  {
    icon: Bot,
    title: "Natural Language Processing",
    description: "Understand and process learner queries in natural language for intuitive interactions.",
  },
  {
    icon: Workflow,
    title: "Automated Workflows",
    description: "AI-triggered actions for enrollment, notifications, and content delivery.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find relevant content instantly with AI-powered semantic understanding.",
  },
  {
    icon: Globe,
    title: "Auto Translation",
    description: "Instantly translate content into 50+ languages while preserving context.",
  },
  {
    icon: Cpu,
    title: "Real-time Processing",
    description: "Process millions of learning events in real-time for instant insights.",
  },
  {
    icon: Network,
    title: "Knowledge Graphs",
    description: "Map relationships between skills, roles, and content for intelligent recommendations.",
  },
]

const useCases = [
  {
    title: "Onboarding Acceleration",
    stat: "60%",
    description: "Faster time-to-productivity with AI-personalized onboarding paths",
    image: "/employee-onboarding-dashboard-interface.jpg",
  },
  {
    title: "Compliance Training",
    stat: "95%",
    description: "Completion rates with AI-driven reminders and adaptive assessments",
    image: "/compliance-training-progress-dashboard.jpg",
  },
  {
    title: "Skill Development",
    stat: "3x",
    description: "Faster skill acquisition with personalized learning recommendations",
    image: "/skills-development-tracking-interface.jpg",
  },
]

export default function AICapabilitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Brain className="h-4 w-4" />
              Powered by Advanced AI
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              AI That Understands <span className="text-primary">How People Learn</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our proprietary AI engine combines deep learning, natural language processing, and predictive analytics to
              deliver truly personalized learning experiences at scale.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                See AI in Action
              </Button>
              <Button size="lg" variant="outline">
                Read the Whitepaper
              </Button>
            </div>
          </div>

          {/* AI Visualization */}
          <div className="mt-16 relative">
            <div className="mx-auto max-w-4xl">
              <div className="relative rounded-2xl bg-card border border-border p-8 shadow-2xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  <Zap className="h-4 w-4" />
                  AI Engine Active
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">2.5M+</div>
                    <div className="text-sm text-muted-foreground">Learner Profiles Analyzed</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">50M+</div>
                    <div className="text-sm text-muted-foreground">Recommendations Made</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Features */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Core AI Capabilities</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Six powerful AI features that transform how your organization learns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How Our AI Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A continuous learning loop that gets smarter with every interaction
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Data Collection",
                description: "Gather learning behaviors, preferences, and performance data securely.",
              },
              {
                step: "02",
                title: "Pattern Analysis",
                description: "AI identifies learning patterns, strengths, and areas for improvement.",
              },
              {
                step: "03",
                title: "Personalization",
                description: "Generate tailored content, paths, and recommendations in real-time.",
              },
              {
                step: "04",
                title: "Continuous Learning",
                description: "Models improve continuously based on outcomes and feedback.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < 3 && <div className="hidden lg:block absolute top-8 right-0 w-8 h-0.5 bg-primary/30" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="py-24 bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Advanced AI Technologies</h2>
            <p className="mt-4 text-lg text-background/70">Built on cutting-edge machine learning infrastructure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedCapabilities.map((cap, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl bg-background/5 border border-background/10 hover:bg-background/10 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <cap.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-background mb-1">{cap.title}</h3>
                  <p className="text-sm text-background/70">{cap.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">AI-Powered Results</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how organizations achieve measurable outcomes with our AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={useCase.image || "/placeholder.svg"}
                    alt={useCase.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-4xl font-bold text-background">{useCase.stat}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Experience AI-Powered Learning?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of organizations using our AI to transform their learning programs and drive real business
            results.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Button size="lg" variant="secondary" className="gap-2">
              <Brain className="h-4 w-4" />
              Request AI Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Talk to an Expert
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
