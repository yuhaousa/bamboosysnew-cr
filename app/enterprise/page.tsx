import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Shield,
  Users,
  Globe,
  Lock,
  Server,
  HeadphonesIcon,
  CheckCircle2,
  Building2,
  Award,
  Clock,
  BarChart3,
  Zap,
  FileCheck,
  Network,
  Database,
  UserCheck,
} from "lucide-react"
import Image from "next/image"

const enterpriseFeatures = [
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "SOC 2 Type II, GDPR, and ISO 27001 certified with end-to-end encryption and advanced threat protection.",
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description: "Deploy across 200+ countries with multi-region hosting, CDN acceleration, and 99.99% uptime SLA.",
  },
  {
    icon: Users,
    title: "Unlimited Users",
    description:
      "Scale to millions of learners with enterprise licensing and volume-based pricing for large organizations.",
  },
  {
    icon: Lock,
    title: "SSO & Identity Management",
    description: "Seamless integration with SAML 2.0, OAuth, Azure AD, Okta, and all major identity providers.",
  },
  {
    icon: Server,
    title: "Dedicated Infrastructure",
    description: "Private cloud deployment options with dedicated resources, custom SLAs, and data residency controls.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Premium Support",
    description: "Dedicated customer success manager, priority support queue, and guaranteed response times.",
  },
]

const complianceBadges = [
  { name: "SOC 2 Type II", icon: FileCheck },
  { name: "GDPR Compliant", icon: Shield },
  { name: "ISO 27001", icon: Award },
  { name: "HIPAA Ready", icon: Lock },
  { name: "CCPA Compliant", icon: UserCheck },
  { name: "FedRAMP", icon: Building2 },
]

const enterpriseStats = [
  { value: "500+", label: "Enterprise Customers" },
  { value: "50M+", label: "Learners Worldwide" },
  { value: "99.99%", label: "Uptime Guarantee" },
  { value: "24/7", label: "Global Support" },
]

const successStories = [
  {
    company: "Global Financial Services",
    industry: "Finance",
    employees: "150,000+",
    results: [
      "85% reduction in compliance training time",
      "40% improvement in knowledge retention",
      "$12M annual savings in training costs",
    ],
    image: "/corporate-office-building-finance.jpg",
  },
  {
    company: "Healthcare Network",
    industry: "Healthcare",
    employees: "80,000+",
    results: [
      "100% regulatory compliance achieved",
      "60% faster onboarding process",
      "92% employee satisfaction score",
    ],
    image: "/modern-hospital-building-healthcare.jpg",
  },
  {
    company: "Tech Enterprise",
    industry: "Technology",
    employees: "200,000+",
    results: ["3x increase in skills development", "50% reduction in turnover", "ROI achieved in 6 months"],
    image: "/silicon-valley-hq.png",
  },
]

const deploymentOptions = [
  {
    icon: Globe,
    title: "Multi-Tenant Cloud",
    description: "Secure, scalable cloud infrastructure with automatic updates and maintenance.",
    features: ["Auto-scaling", "Global CDN", "Regular updates", "Shared infrastructure"],
  },
  {
    icon: Server,
    title: "Dedicated Cloud",
    description: "Isolated cloud environment with dedicated resources and enhanced security.",
    features: ["Isolated environment", "Custom SLA", "Enhanced security", "Dedicated support"],
  },
  {
    icon: Database,
    title: "Private Cloud",
    description: "Deploy on your own infrastructure with full control and data sovereignty.",
    features: ["On-premises option", "Data residency", "Full control", "Custom integrations"],
  },
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                Enterprise Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Learning at <span className="text-primary">Enterprise Scale</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Trusted by Fortune 500 companies worldwide. Deploy AI-powered learning across your entire organization
                with enterprise-grade security, unlimited scalability, and dedicated support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base px-8">
                  Contact Sales
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
                  View Case Studies
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 pt-10 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Trusted by industry leaders</p>
                <div className="flex flex-wrap gap-8 items-center opacity-60">
                  {["Fortune", "Deloitte", "Accenture", "PWC", "McKinsey"].map((company) => (
                    <span key={company} className="text-foreground font-semibold text-lg">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/enterprise-dashboard-analytics-corporate-learning.jpg"
                  alt="Enterprise Dashboard"
                  width={600}
                  height={500}
                  className="w-full"
                />
              </div>
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-background rounded-xl shadow-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">98%</p>
                    <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {enterpriseStats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Enterprise Requirements</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to deploy learning at scale, with the security and compliance your organization
              demands.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Security & Compliance</h2>
            <p className="text-lg opacity-80">
              Meet the strictest regulatory requirements with our comprehensive security certifications and compliance
              frameworks.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {complianceBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center p-6 rounded-xl bg-background/10 backdrop-blur-sm">
                <badge.icon className="h-10 w-10 mb-3 text-primary" />
                <p className="text-sm font-medium text-center">{badge.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-background/5 border border-background/20">
              <Lock className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Encryption</h3>
              <p className="opacity-80">AES-256 encryption at rest and TLS 1.3 in transit for all data.</p>
            </div>
            <div className="p-6 rounded-xl bg-background/5 border border-background/20">
              <Network className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Network Security</h3>
              <p className="opacity-80">WAF, DDoS protection, and intrusion detection systems.</p>
            </div>
            <div className="p-6 rounded-xl bg-background/5 border border-background/20">
              <UserCheck className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access Control</h3>
              <p className="opacity-80">Role-based access, audit logs, and multi-factor authentication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Flexible Deployment Options</h2>
            <p className="text-lg text-muted-foreground">
              Choose the deployment model that fits your organization's security, compliance, and operational
              requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {deploymentOptions.map((option, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <option.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{option.title}</h3>
                <p className="text-muted-foreground mb-6">{option.description}</p>
                <ul className="space-y-3">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Enterprise Success Stories</h2>
            <p className="text-lg text-muted-foreground">
              See how leading organizations transform their learning with Learnify.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image src={story.image || "/placeholder.svg"} alt={story.company} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      {story.industry}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{story.company}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{story.employees} employees</p>
                  <ul className="space-y-2">
                    {story.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Enterprise-Grade SLA & Support</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get the reliability and support your organization needs with our comprehensive enterprise service level
                agreements.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">99.99% Uptime SLA</h3>
                    <p className="text-muted-foreground text-sm">
                      Guaranteed availability with financial credits for any downtime.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">1-Hour Response Time</h3>
                    <p className="text-muted-foreground text-sm">
                      Priority support with guaranteed response times for critical issues.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HeadphonesIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Dedicated Success Team</h3>
                    <p className="text-muted-foreground text-sm">
                      Named customer success manager and technical account manager.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">What's Included in Enterprise</h3>
              <ul className="space-y-4">
                {[
                  "Unlimited users and content",
                  "Custom branding and white-labeling",
                  "Advanced analytics and reporting",
                  "API access with premium rate limits",
                  "Custom integrations support",
                  "Dedicated training and onboarding",
                  "Quarterly business reviews",
                  "Early access to new features",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Enterprise Learning?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join 500+ enterprise customers who trust Learnify for their learning and development needs. Get a
            personalized demo today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Contact Sales
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Download Enterprise Guide
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
