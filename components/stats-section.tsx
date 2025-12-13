const stats = [
  { value: "40M+", label: "Active learners" },
  { value: "3,800+", label: "Enterprise customers" },
  { value: "180+", label: "Countries served" },
  { value: "99.9%", label: "Platform uptime" },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-primary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-primary-foreground sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
