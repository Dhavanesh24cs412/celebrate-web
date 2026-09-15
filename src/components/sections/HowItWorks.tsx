import { SectionHeader } from "../ui/SectionHeader";

export function HowItWorks() {
  const steps = [
    {
      title: "Tell us about your event",
      description: "Specify the event type, budget, location, and guest count. Add venue details and inspiration.",
      state: "Draft",
    },
    {
      title: "Discover suitable planners",
      description: "Our Smart Matching Engine identifies the most relevant event management teams for your exact needs.",
      state: "Matching",
    },
    {
      title: "Compare AI proposals",
      description: "Receive customized proposals enriched with AI-assisted visual concepts of the event setup.",
      state: "Proposals Available",
    },
    {
      title: "Choose with confidence",
      description: "Collaborate on revisions and securely book the right planner when you're ready.",
      state: "Proposal Accepted",
    },
    {
      title: "Celebrate effortlessly",
      description: "Manage execution and enjoy your event while the professionals handle the details.",
      state: "Active / Completed",
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-celebrate-cream min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title="How Celebrate Works"
          subtitle="From concept to completion, the marketplace designed for clarity and confidence."
        />

        <div className="mt-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-celebrate-sage before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-16 last:pb-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-celebrate-cream bg-celebrate-terracotta text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                {index + 1}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-celebrate-sage/20 shadow-sm transition-transform hover:-translate-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-celebrate-terracotta mb-2 block">
                  Workflow State: {step.state}
                </span>
                <h4 className="text-2xl font-display text-celebrate-navy mb-2">{step.title}</h4>
                <p className="text-celebrate-navy/70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
