import { Button } from "../ui/Button";
import DriftWall from "../marketing/DriftWall/DriftWall";
import { AnimatedWord } from "../ui/AnimatedWord";

const heroAdjectives = [
  "beautiful",
  "elegant",
  "joyful",
  "meaningful",
  "memorable",
  "magical"
];

export function HeroSection() {
  return (
    <header id="hero" className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden bg-celebrate-cream">
      {/* DriftWall Background Container */}
      {/* Mobile: Full screen behind text. Desktop: Right half only with a soft gradient fade on the left edge */}
      <div className="absolute inset-0 z-0 lg:left-1/2 lg:w-1/2">
        <DriftWall dim={0.9} />
        {/* Soft edge gradient to blend the wall into the cream background on desktop */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-celebrate-cream to-transparent pointer-events-none" />
      </div>

      {/* Mobile-only text readability overlay */}
      <div className="absolute inset-0 bg-celebrate-cream/45 lg:hidden z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        {/* Text Container: Centers on mobile, aligns left and takes 50% width on desktop */}
        <div className="lg:w-[55%] text-center lg:text-left lg:pr-12">
          <h1 className="text-5xl md:text-7xl lg:text-5xl font-display text-celebrate-navy tracking-tight mb-8 leading-[1.1]">
            Your celebration deserves to feel <AnimatedWord words={heroAdjectives} />
          </h1>
          <p className="mt-6 text-xl md:text-1.5xl text-celebrate-navy/80 max-w-3xl mx-auto lg:mx-0 font-sans leading-relaxed mb-10">
            We make planning feel effortless, so the <br/>excitement can come first.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a href="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full px-10">
                Start Planning
              </Button>
            </a>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full px-10 bg-white/50 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
                How It Works
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
