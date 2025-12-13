import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Smartphone,
  Download,
  Bell,
  Wifi,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  Play,
  Apple,
  MonitorSmartphone,
} from "lucide-react"
import Image from "next/image"

const appFeatures = [
  {
    icon: Wifi,
    title: "Offline Learning",
    description: "Download courses and learn anywhere, even without an internet connection.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get personalized reminders and updates to stay on track with your learning goals.",
  },
  {
    icon: Zap,
    title: "Quick Sessions",
    description: "Bite-sized learning modules designed for busy professionals on the go.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and SSO integration for maximum data protection.",
  },
  {
    icon: Users,
    title: "Social Learning",
    description: "Connect with peers, share insights, and collaborate directly from your phone.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your achievements and see real-time progress across all devices.",
  },
]

const appScreens = [
  {
    title: "Personalized Dashboard",
    description: "Your learning journey at a glance with AI-powered recommendations.",
    image: "/mobile-app-learning-dashboard-dark-theme.jpg",
  },
  {
    title: "Course Library",
    description: "Access thousands of courses organized by skill and topic.",
    image: "/mobile-app-course-library-grid-view.jpg",
  },
  {
    title: "Video Learning",
    description: "High-quality video lessons with interactive features.",
    image: "/mobile-app-video-player-learning-interface.jpg",
  },
  {
    title: "Progress & Badges",
    description: "Track achievements and earn recognition for your skills.",
    image: "/mobile-app-gamification-badges-progress.jpg",
  },
]

const stats = [
  { value: "4.9", label: "App Store Rating" },
  { value: "2M+", label: "Downloads" },
  { value: "50K+", label: "Daily Active Users" },
  { value: "98%", label: "User Satisfaction" },
]

export default function MobileAppsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Smartphone className="h-4 w-4" />
                Available on iOS & Android
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Learn anywhere, <span className="text-primary">anytime</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Take your learning journey mobile with our award-winning apps. Access courses, track progress, and
                connect with peers - all from the palm of your hand.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2">
                  <Apple className="h-5 w-5" />
                  Download for iOS
                </Button>
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <Play className="h-5 w-5" />
                  Get it on Android
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.9 rating from 50K+ reviews</span>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl" />
                <Image
                  src="/smartphone-showing-learning-app-home-screen-with-c.jpg"
                  alt="Learnify Mobile App"
                  width={350}
                  height={700}
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Powerful features in your pocket</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to learn effectively, designed for mobile-first experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screens Showcase */}
      <section className="py-24 bg-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-background">Beautifully designed for learning</h2>
            <p className="mt-4 text-lg text-background/70">
              An intuitive interface that makes learning a pleasure, not a chore.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {appScreens.map((screen, index) => (
              <div key={screen.title} className="text-center">
                <div className="relative mb-4 group">
                  <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={screen.image || "/placeholder.svg"}
                    alt={screen.title}
                    width={300}
                    height={600}
                    className="relative rounded-2xl shadow-xl mx-auto"
                  />
                </div>
                <h3 className="text-lg font-semibold text-background">{screen.title}</h3>
                <p className="mt-1 text-sm text-background/60">{screen.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Platform Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <MonitorSmartphone className="h-4 w-4" />
                Seamless sync
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Start on desktop, continue on mobile</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Your progress syncs instantly across all devices. Start a course on your laptop during lunch, pick up
                where you left off on your commute, and review on your tablet at home.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Real-time progress synchronization",
                  "Bookmarks and notes available everywhere",
                  "Download courses for offline access",
                  "Seamless handoff between devices",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Image
                src="/multiple-devices-laptop-tablet-phone-showing-same-.jpg"
                alt="Cross-platform learning"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <Download className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Start learning on the go today</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join millions of learners who have transformed their skills with Learnify mobile.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2">
              <Apple className="h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="secondary" className="gap-2">
              <Play className="h-5 w-5" />
              Get it on Android
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            Free to download. Premium features available with your organization's subscription.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
