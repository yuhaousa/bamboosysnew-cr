import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Search,
  Check,
  Zap,
  Shield,
  RefreshCw,
  Code,
  Plug,
  Database,
  MessageSquare,
  Calendar,
  Users,
  FileText,
  Video,
  BarChart3,
  Cloud,
  Lock,
  Workflow,
} from "lucide-react"
import Image from "next/image"

const integrationCategories = [
  { name: "All", count: 200 },
  { name: "HR & HCM", count: 45 },
  { name: "Communication", count: 32 },
  { name: "Content", count: 28 },
  { name: "Analytics", count: 24 },
  { name: "Authentication", count: 18 },
  { name: "CRM", count: 22 },
  { name: "Productivity", count: 31 },
]

const featuredIntegrations = [
  {
    name: "Microsoft 365",
    description: "Seamlessly integrate with Teams, SharePoint, and the entire Microsoft ecosystem.",
    icon: "/microsoft-365-logo.png",
    category: "Productivity",
    popular: true,
  },
  {
    name: "Salesforce",
    description: "Connect learning data with your CRM to drive sales enablement.",
    icon: "/salesforce-blue-cloud.png",
    category: "CRM",
    popular: true,
  },
  {
    name: "Workday",
    description: "Sync employee data and automate learning assignments based on HR events.",
    icon: "/workday-logo-orange.jpg",
    category: "HR & HCM",
    popular: true,
  },
  {
    name: "Slack",
    description: "Deliver learning notifications and enable social learning in Slack channels.",
    icon: "/slack-logo.png",
    category: "Communication",
    popular: true,
  },
  {
    name: "Zoom",
    description: "Launch and track virtual instructor-led training sessions.",
    icon: "/zoom-logo-blue.png",
    category: "Communication",
    popular: true,
  },
  {
    name: "SAP SuccessFactors",
    description: "Bi-directional sync with SAP for comprehensive talent management.",
    icon: "/sap-logo-blue.jpg",
    category: "HR & HCM",
    popular: true,
  },
  {
    name: "Google Workspace",
    description: "Integrate with Google Drive, Calendar, and Meet for seamless workflows.",
    icon: "/google-workspace-logo-colorful.jpg",
    category: "Productivity",
    popular: false,
  },
  {
    name: "BambooHR",
    description: "Automate onboarding workflows with HR data synchronization.",
    icon: "/bamboohr-logo-green.jpg",
    category: "HR & HCM",
    popular: false,
  },
  {
    name: "Okta",
    description: "Enterprise-grade SSO and user provisioning with SCIM support.",
    icon: "/okta-logo-blue.jpg",
    category: "Authentication",
    popular: false,
  },
  {
    name: "Power BI",
    description: "Export learning data to create custom dashboards and reports.",
    icon: "/power-bi-logo-yellow.jpg",
    category: "Analytics",
    popular: false,
  },
  {
    name: "LinkedIn Learning",
    description: "Access thousands of courses and sync completion data.",
    icon: "/linkedin-learning-logo-blue.jpg",
    category: "Content",
    popular: false,
  },
  {
    name: "Cornerstone",
    description: "Migrate content and data from legacy LMS platforms.",
    icon: "/cornerstone-logo-orange.jpg",
    category: "Content",
    popular: false,
  },
]

const integrationBenefits = [
  {
    icon: Zap,
    title: "Pre-built Connectors",
    description: "200+ ready-to-use integrations that work out of the box with zero coding required.",
  },
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    description: "Bi-directional data synchronization ensures your systems are always up to date.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with encryption in transit and at rest for all data.",
  },
  {
    icon: Code,
    title: "Open API",
    description: "RESTful APIs and webhooks for custom integrations and workflow automation.",
  },
]

const apiFeatures = [
  {
    icon: Database,
    title: "RESTful API",
    description: "Full CRUD operations on all learning data with comprehensive documentation.",
  },
  {
    icon: Workflow,
    title: "Webhooks",
    description: "Real-time event notifications for course completions, enrollments, and more.",
  },
  {
    icon: Lock,
    title: "OAuth 2.0",
    description: "Secure authentication with granular permission scopes.",
  },
  {
    icon: Cloud,
    title: "GraphQL",
    description: "Flexible queries to fetch exactly the data you need.",
  },
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Plug className="h-4 w-4" />
            200+ Integrations
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Connect your entire
            <span className="text-primary"> tech stack</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Seamlessly integrate Learnify with your existing tools and workflows. From HR systems to communication
            platforms, we connect with everything your organization uses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-base px-8">
              Explore integrations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
              View API docs
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search integrations..."
              className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Integrations Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Integrations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with the tools your team already uses and loves.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {integrationCategories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
                }`}
              >
                {category.name}
                <span className="ml-1 opacity-70">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIntegrations.map((integration, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Image
                      src={integration.icon || "/placeholder.svg"}
                      alt={integration.name}
                      width={48}
                      height={48}
                      className="rounded-xl"
                    />
                    {integration.popular && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Zap className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {integration.name}
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {integration.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{integration.description}</p>
                <div className="mt-4 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View all 200+ integrations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Types */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Integration types for every need</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you need simple plug-and-play connectors or custom API integrations, we have you covered.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">HR & HCM Systems</h3>
                    <p className="text-muted-foreground">
                      Sync user data, automate onboarding, and trigger learning based on HR events.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Communication Tools</h3>
                    <p className="text-muted-foreground">
                      Deliver learning where your team works with Slack, Teams, and email integrations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Content Providers</h3>
                    <p className="text-muted-foreground">
                      Access premium content libraries and track completions in one place.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Analytics & BI</h3>
                    <p className="text-muted-foreground">
                      Export learning data to your BI tools for custom reporting and insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-muted/50 rounded-3xl p-8 border border-border">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Users, label: "HR" },
                    { icon: MessageSquare, label: "Chat" },
                    { icon: Video, label: "Video" },
                    { icon: Calendar, label: "Calendar" },
                    { icon: FileText, label: "Docs" },
                    { icon: BarChart3, label: "Analytics" },
                    { icon: Lock, label: "SSO" },
                    { icon: Database, label: "Data" },
                    { icon: Cloud, label: "Cloud" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-background rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-border hover:border-primary/50 transition-colors"
                    >
                      <item.icon className="h-6 w-6 text-primary" />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-3">
                    <span className="font-bold text-xl">L</span>
                  </div>
                  <p className="text-sm text-muted-foreground">All connected to Learnify</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-background/10 text-background px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Code className="h-4 w-4" />
              Developer Friendly
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Build custom integrations with our API</h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto">
              Full REST API access with comprehensive documentation, SDKs, and sandbox environments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {apiFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border border-background/20"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-background mb-2">{feature.title}</h3>
                <p className="text-sm text-background/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Code Preview */}
          <div className="bg-background/5 backdrop-blur-sm rounded-2xl p-6 border border-background/20 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-background/50">api-example.js</span>
            </div>
            <pre className="text-sm text-background/90 overflow-x-auto">
              <code>{`// Fetch user learning progress
const response = await fetch(
  'https://api.learnify.com/v1/users/123/progress',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.completedCourses); // [{ id: 1, ... }]`}</code>
            </pre>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Read API documentation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Enterprise-grade integration</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for security, reliability, and scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 border border-border">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Security & Compliance</h3>
              <ul className="space-y-3">
                {[
                  "SOC 2 Type II certified",
                  "GDPR compliant",
                  "Data encryption (AES-256)",
                  "Regular security audits",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-2xl p-8 border border-border">
              <RefreshCw className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Reliability</h3>
              <ul className="space-y-3">
                {["99.9% uptime SLA", "Automatic failover", "Real-time monitoring", "24/7 support"].map(
                  (item, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="bg-background rounded-2xl p-8 border border-border">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Performance</h3>
              <ul className="space-y-3">
                {[
                  "Sub-second sync times",
                  "Handles millions of records",
                  "Rate limiting controls",
                  "Batch processing",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to connect your tech stack?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            See how Learnify integrates with your existing tools in a personalized demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Book a demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              View all integrations
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
