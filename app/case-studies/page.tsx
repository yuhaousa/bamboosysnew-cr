import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import {
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Award,
  Building2,
  GraduationCap,
  ShoppingBag,
  Plane,
  Heart,
  Factory,
  Quote,
} from "lucide-react"

const featuredCaseStudies = [
  {
    company: "Global Finance Corp",
    industry: "Financial Services",
    logo: "/finance-company-logo.png",
    image: "/corporate-office-building-finance.jpg",
    quote: "Learnify transformed our compliance training. We went from 60% completion rates to 98% in just 6 months.",
    author: "Sarah Chen",
    role: "Chief Learning Officer",
    stats: [
      { label: "Completion Rate", value: "98%", change: "+38%" },
      { label: "Training Time", value: "-45%", change: "Reduced" },
      { label: "Cost Savings", value: "$2.4M", change: "Annual" },
    ],
    tags: ["Compliance", "AI Personalization", "Analytics"],
  },
  {
    company: "TechVenture Inc",
    industry: "Technology",
    logo: "/tech-company-logo.jpg",
    image: "/silicon-valley-hq.png",
    quote:
      "The AI-powered skill recommendations helped us upskill 5,000 engineers in cloud technologies within one quarter.",
    author: "Michael Torres",
    role: "VP of Engineering",
    stats: [
      { label: "Engineers Trained", value: "5,000", change: "Q1 2024" },
      { label: "Skill Acquisition", value: "3x", change: "Faster" },
      { label: "Certification Rate", value: "89%", change: "+34%" },
    ],
    tags: ["Technical Training", "Skills Gap", "AI Content"],
  },
  {
    company: "HealthFirst Medical",
    industry: "Healthcare",
    logo: "/healthcare-company-logo.png",
    image: "/modern-hospital-building-healthcare.jpg",
    quote:
      "Mobile learning allowed our nurses to complete training during shift changes, improving compliance across all facilities.",
    author: "Dr. Emily Watson",
    role: "Director of Medical Education",
    stats: [
      { label: "Facilities", value: "120+", change: "Deployed" },
      { label: "Mobile Usage", value: "78%", change: "Of learners" },
      { label: "Compliance", value: "100%", change: "Achieved" },
    ],
    tags: ["Healthcare", "Mobile Learning", "Compliance"],
  },
]

const industryCaseStudies = [
  {
    industry: "Retail",
    icon: ShoppingBag,
    company: "RetailMax Global",
    result: "Reduced onboarding time by 60%",
    learners: "45,000+",
  },
  {
    industry: "Aviation",
    icon: Plane,
    company: "SkyWays Airlines",
    result: "100% safety compliance achieved",
    learners: "12,000+",
  },
  {
    industry: "Healthcare",
    icon: Heart,
    company: "CareNetwork",
    result: "3x faster certification rates",
    learners: "28,000+",
  },
  {
    industry: "Manufacturing",
    icon: Factory,
    company: "Industrial Dynamics",
    result: "40% reduction in workplace incidents",
    learners: "35,000+",
  },
  {
    industry: "Finance",
    icon: Building2,
    company: "Capital Trust Bank",
    result: "98% regulatory compliance",
    learners: "18,000+",
  },
  {
    industry: "Education",
    icon: GraduationCap,
    company: "EduGlobal University",
    result: "2x student engagement",
    learners: "85,000+",
  },
]

const impactStats = [
  { value: "500+", label: "Enterprise Customers", icon: Building2 },
  { value: "50M+", label: "Learners Worldwide", icon: Users },
  { value: "40%", label: "Avg. Time Savings", icon: Clock },
  { value: "95%", label: "Customer Satisfaction", icon: Award },
]

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4" />
              Customer Success Stories
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              See how leading companies <span className="text-primary">transform learning</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover how organizations across industries use Learnify to drive measurable business outcomes, improve
              employee skills, and build a culture of continuous learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base">
                Explore all case studies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                Talk to our team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deep dive into how industry leaders achieved remarkable results with Learnify
            </p>
          </div>

          <div className="space-y-16">
            {featuredCaseStudies.map((study, index) => (
              <Card key={study.company} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <Image
                        src={study.image || "/placeholder.svg"}
                        alt={study.company}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-r" />
                      <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8">
                        <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {study.industry}
                        </span>
                      </div>
                    </div>

                    <div className={`p-8 lg:p-12 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <Image
                        src={study.logo || "/placeholder.svg"}
                        alt={`${study.company} logo`}
                        width={120}
                        height={60}
                        className="h-10 w-auto object-contain mb-6"
                      />

                      <div className="relative mb-6">
                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                        <p className="text-xl text-foreground italic pl-6">"{study.quote}"</p>
                      </div>

                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-semibold text-foreground">{study.author.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{study.author}</div>
                          <div className="text-sm text-muted-foreground">{study.role}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {study.stats.map((stat) => (
                          <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                            <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {study.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button variant="outline" className="group bg-transparent">
                        Read full case study
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Success Across Industries</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From healthcare to manufacturing, see how different industries leverage Learnify
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryCaseStudies.map((study) => (
              <Card
                key={study.company}
                className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <study.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{study.industry}</div>
                      <div className="font-semibold text-foreground">{study.company}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-green-600 font-medium mb-4">
                    <TrendingUp className="h-4 w-4" />
                    {study.result}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{study.learners} learners</span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto">
              Hear directly from learning leaders who transformed their organizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The ROI was evident within the first quarter. Our training costs dropped by 35% while engagement soared.",
                author: "James Miller",
                role: "L&D Director",
                company: "Fortune 500 Retailer",
              },
              {
                quote:
                  "Learnify's AI recommendations are incredibly accurate. Our employees actually want to learn now.",
                author: "Lisa Park",
                role: "HR Vice President",
                company: "Global Tech Company",
              },
              {
                quote: "Implementation was seamless. Their team understood our complex requirements from day one.",
                author: "Robert Chen",
                role: "CTO",
                company: "Healthcare Network",
              },
            ].map((testimonial) => (
              <div key={testimonial.author} className="bg-background/10 backdrop-blur-sm rounded-2xl p-8">
                <Quote className="h-10 w-10 text-primary mb-6" />
                <p className="text-lg mb-6 text-background/90">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-background/70">{testimonial.role}</div>
                  <div className="text-sm text-primary">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to write your success story?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join 500+ enterprises that have transformed their learning culture with Learnify
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base">
              Book a demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Download case study collection
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
