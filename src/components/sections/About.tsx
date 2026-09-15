import { SectionHeader } from "../ui/SectionHeader";

export function About() {
  return (
    <section id="about" className="py-24 bg-white min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title="Beyond a Marketplace."
          subtitle="The event industry is fragmented. Celebrate is the unified solution."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-16">
          <div className="order-2 md:order-1 relative h-96 bg-celebrate-cream rounded-2xl flex items-center justify-center overflow-hidden border border-celebrate-sage/30">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-celebrate-terracotta via-celebrate-cream to-celebrate-cream" />
             <p className="text-celebrate-sage font-medium italic z-10 text-center px-6">
               [ Placeholder: Image depicting seamless event planning / celebration ]
             </p>
          </div>
          
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-display text-celebrate-navy mb-6">
              Replacing disconnected tools with a seamless ecosystem.
            </h3>
            <div className="space-y-6 text-lg text-celebrate-navy/70">
              <p>
                From a client's perspective, discovering and evaluating suitable event management teams remains challenging. Clients often face uncertainty regarding event quality, design expectations, budgets, and overall service transparency.
              </p>
              <p>
                Event management teams face a broader challenge: managing inquiries, preparing proposals, visualizing event concepts, coordinating vendors, and recruiting professionals using disconnected tools and manual processes.
              </p>
              <p className="text-celebrate-navy font-medium">
                Celebrate transforms the event management process by integrating client acquisition, AI-assisted proposal creation, workforce management, and business operations into one connected platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
