import { Button } from "../ui/Button";

export function HeroSection() {
  return (
    <header id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] bg-celebrate-sage/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] bg-celebrate-terracotta/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-celebrate-navy tracking-tight mb-8 leading-[1.1]">
          The Intelligent Ecosystem <br className="hidden md:block" />
          for the Event Industry.
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-celebrate-navy/80 max-w-3xl mx-auto font-sans leading-relaxed mb-10">
          Acquire clients, create AI-assisted proposals, recruit professionals, and manage your entire event business from a single platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto px-10">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-10">
            Discover How It Works
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-celebrate-navy/10 pt-10">
          {[
            { label: "Smart Planner Matching", icon: "🤝" },
            { label: "AI Design Canvas", icon: "✨" },
            { label: "Professional Marketplace", icon: "🎯" },
            { label: "Business Operations", icon: "📊" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-3xl mb-3">{feature.icon}</span>
              <span className="text-sm font-medium text-celebrate-navy">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
