import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { Search, Image as ImageIcon, Scale, CheckCircle2 } from "lucide-react";

export function ForClients() {
  const benefits = [
    {
      title: "Smart Planner Matching",
      description: "No more endless searching. We intelligently match your requirements with the most suitable planners based on expertise and budget.",
      icon: Search,
    },
    {
      title: "Visual-First Proposals",
      description: "Compare customized proposals enriched with AI-assisted event designs, helping you visualize the concepts before booking.",
      icon: ImageIcon,
    },
    {
      title: "Transparent Comparison",
      description: "Multiple qualified planners compete to offer you the best service, promoting transparent pricing and higher quality.",
      icon: Scale,
    },
    {
      title: "Secure Booking",
      description: "Collaborate, negotiate, and confidently book the best event management team all in one secure platform.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="clients" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              title="For Clients"
              subtitle="Organizing an event shouldn't be stressful. Discover, compare, and book with confidence."
              align="left"
            />
            
            <div className="space-y-8 mt-10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-lg bg-celebrate-cream flex items-center justify-center text-celebrate-terracotta">
                      <benefit.icon size={24} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-celebrate-navy mb-2">{benefit.title}</h4>
                    <p className="text-celebrate-navy/70">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button size="lg">Start Planning Your Event</Button>
            </div>
          </div>
          
          <div className="relative h-[600px] bg-celebrate-cream rounded-2xl flex items-center justify-center overflow-hidden border border-celebrate-sage/30 p-8">
             <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwQTI5NDciLz48L3N2Zz4=')] [background-size:24px_24px]" />
             <div className="bg-white p-8 rounded-xl shadow-lg relative z-10 w-full max-w-sm">
                <div className="h-4 w-1/3 bg-celebrate-sage/40 rounded mb-6"></div>
                <div className="h-32 w-full bg-celebrate-cream rounded-lg mb-6 flex items-center justify-center text-celebrate-sage font-medium italic">
                  [ AI Design Canvas Preview ]
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-celebrate-sage/20 rounded"></div>
                  <div className="h-4 w-5/6 bg-celebrate-sage/20 rounded"></div>
                  <div className="h-4 w-4/6 bg-celebrate-sage/20 rounded"></div>
                </div>
                <div className="mt-8 flex justify-between items-center pt-4 border-t border-celebrate-sage/20">
                  <div className="h-8 w-24 bg-celebrate-sage/30 rounded"></div>
                  <div className="h-10 w-32 bg-celebrate-navy rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
