import Link from "next/link"

const footerLinks = {
  Platform: [
    { name: "Features", href: "#" },
    { name: "Integrations", href: "#" },
    { name: "AI Capabilities", href: "#" },
    { name: "Mobile App", href: "#" },
    { name: "Security", href: "#" },
  ],
  Solutions: [
    { name: "Enterprise", href: "#" },
    { name: "Small Business", href: "#" },
    { name: "Education", href: "#" },
    { name: "Government", href: "#" },
    { name: "Healthcare", href: "#" },
  ],
  Resources: [
    { name: "Blog", href: "#" },
    { name: "Case Studies", href: "#" },
    { name: "Webinars", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Contact", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-xl text-background">Learnify</span>
            </Link>
            <p className="mt-4 text-sm text-background/60 max-w-xs">
              The #1 AI-powered learning platform for enterprises worldwide.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-background">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/60 hover:text-background transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-background/60">© 2025 Learnify AI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-background/60 hover:text-background">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-background/60 hover:text-background">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-background/60 hover:text-background">
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
