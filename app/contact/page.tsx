"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  Headphones,
  Building2,
  Send,
  CheckCircle2,
} from "lucide-react"

const contactMethods = [
  {
    icon: MessageSquare,
    title: "Sales Inquiries",
    description: "Talk to our sales team about your learning needs",
    contact: "sales@learnify.ai",
    action: "Contact Sales",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Get help with your existing account",
    contact: "support@learnify.ai",
    action: "Get Support",
  },
  {
    icon: Users,
    title: "Partnerships",
    description: "Explore partnership opportunities",
    contact: "partners@learnify.ai",
    action: "Partner with Us",
  },
  {
    icon: Building2,
    title: "Enterprise",
    description: "Custom solutions for large organizations",
    contact: "enterprise@learnify.ai",
    action: "Contact Enterprise",
  },
]

const offices = [
  {
    city: "San Francisco",
    address: "116 /Changi Road , WIS@Changi "#02-03,
    region: "419718, Singapore",
    phone: "+1 (415) 555-0123",
  },
  {
    city: "Hong Kong",
    address: "25 Old Broad Street",
    region: "EC2N 1HN, UK",
    phone: "+44 20 7123 4567",
  },
  {
    city: "Shengyang China",
    address: "1 Raffles Place, Tower 1",
    region: "Singapore 048616",
    phone: "+65 6123 4567",
  },
]

const faqs = [
  {
    question: "How quickly can we get started?",
    answer:
      "Most organizations are up and running within 2-4 weeks. Our implementation team will guide you through the entire process.",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer 24/7 support via chat, email, and phone. Enterprise customers get a dedicated success manager.",
  },
  {
    question: "Can Learnify integrate with our existing systems?",
    answer: "Absolutely. We integrate with 200+ tools including Salesforce, Workday, Microsoft 365, Slack, and more.",
  },
]

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    employees: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Mail className="h-4 w-4" />
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            We&apos;d love to hear
            <span className="text-primary"> from you</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you have a question about features, pricing, or anything else, our team is ready to answer all your
            questions.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <method.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                <a href={`mailto:${method.contact}`} className="text-sm font-medium text-primary hover:underline">
                  {method.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Thank you!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your message has been received. Our team will get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setFormSubmitted(false)}>Send another message</Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Send us a message</h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and we&apos;ll get back to you shortly.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          placeholder="L&D Manager"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employees">Company Size</Label>
                      <select
                        id="employees"
                        name="employees"
                        value={formData.employees}
                        onChange={handleChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Select company size</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1,000 employees</option>
                        <option value="1001-5000">1,001-5,000 employees</option>
                        <option value="5000+">5,000+ employees</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">How can we help? *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your learning needs..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By submitting, you agree to our Privacy Policy and Terms of Service.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href="mailto:info@bamboosys.com" className="text-muted-foreground hover:text-primary">
                        hello@learnify.ai
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a href="tel:+65 69061224" className="text-muted-foreground hover:text-primary">
                        +1 (800) 555-0123
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Support Hours</p>
                      <p className="text-muted-foreground">24/7 for Enterprise customers</p>
                      <p className="text-muted-foreground">Mon-Fri, 9am-6pm ET for others</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offices */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Our Offices</h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">{office.city}</p>
                          <p className="text-sm text-muted-foreground">{office.address}</p>
                          <p className="text-sm text-muted-foreground">{office.region}</p>
                          <p className="text-sm text-primary mt-1">{office.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Reach out to our team.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to transform your learning?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of organizations already using Learnify to upskill their workforce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base">
              Book a Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
