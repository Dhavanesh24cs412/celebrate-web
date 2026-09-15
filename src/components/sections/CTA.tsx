import { Button } from "../ui/Button";

export function CTA() {
  return (
    <section id="cta" className="py-24 bg-white relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="absolute inset-0 bg-celebrate-navy/5" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-celebrate-terracotta/10 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-display text-celebrate-navy mb-8">
          Ready to experience the future of event management?
        </h2>
        <p className="text-xl text-celebrate-navy/70 mb-10 max-w-2xl mx-auto">
          Whether you're a client planning a celebration or a planner growing a business, Celebrate is built for you.
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
