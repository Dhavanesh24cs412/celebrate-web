import { SectionHeader } from "../ui/SectionHeader";
import { CheckCircle2 } from "lucide-react";

export function WhyCelebrate() {
  const points = [
    "No more blind inquiries or generic directory listings.",
    "Intelligent semantic matching based on your real budget and needs.",
    "AI-assisted design concepts attached directly to proposals.",
    "A protected marketplace that respects your privacy until booking.",
    "Unified management for planners—from lead to final payment.",
    "Verified professionals, transparent processes, and confident decisions."
  ];

  return (
    <section id="why-celebrate" className="py-24 bg-celebrate-cream min-h-screen flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <SectionHeader
          title="Why Choose Celebrate?"
          subtitle="We didn't just build a directory. We built an operating system that respects the complexity of the event industry."
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-left">
          {points.map((point, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle2 className="text-celebrate-terracotta shrink-0 mt-1" size={20} />
              <p className="text-celebrate-navy/80 font-medium">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
