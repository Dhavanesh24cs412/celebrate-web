import { Button } from "../ui/Button";
import { BlurText } from "../ui/BlurText";

export function CTA() {
  return (
    <section id="cta" className="py-48 bg-white relative overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 bg-celebrate-navy/5" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-celebrate-terracotta/10 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <BlurText
          as="h2"
          text="Ready to celebrate?"
          animateBy="words"
          direction="top"
          delay={120}
          stepDuration={0.35}
          threshold={0.1}
          rootMargin="0px"
          className="text-4xl md:text-6xl font-display text-celebrate-navy mb-8 justify-center"
        />
        <p className="text-xl text-celebrate-navy/70 mb-10 max-w-2xl mx-auto">
          Whether you're planning a celebration or growing your event business, Celebrate is built for you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto px-10 shadow-lg shadow-celebrate-navy/10">
            Start Planning (Client)
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 bg-white">
            Join Platform (Planner)
          </Button>
        </div>
      </div>
    </section>
  );
}
