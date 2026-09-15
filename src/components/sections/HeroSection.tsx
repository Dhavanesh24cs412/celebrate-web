import { Button } from "../ui/Button";

export function HeroSection() {
  return (
    <header id="hero" className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] bg-celebrate-sage/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] bg-celebrate-terracotta/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl lg:text-6xl font-display text-celebrate-navy tracking-tight mb-8 leading-[1.1]">
          Your celebration deserves to feel special.
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-celebrate-navy/80 max-w-3xl mx-auto font-sans leading-relaxed mb-10">
          We make planning feel effortless, so the excitement can come first.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto px-10">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-10">
            Discover How It Works
          </Button>
        </div>

      </div>
    </header>
  );
}
