export function LogoBar() {
  const logos = [
    { name: "Microsoft", width: 120 },
    { name: "Salesforce", width: 100 },
    { name: "Adobe", width: 80 },
    { name: "Spotify", width: 90 },
    { name: "Slack", width: 80 },
    { name: "Shopify", width: 100 },
    { name: "Zendesk", width: 90 },
  ]

  return (
    <section className="bg-foreground py-8 border-t border-background/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center justify-center">
              <span className="text-background/60 font-semibold text-lg tracking-wide">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
