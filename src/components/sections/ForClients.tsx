import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { Search, Image as ImageIcon, Scale, CheckCircle2 } from "lucide-react";
import { ClientProposalCard } from "../marketing/ClientProposalCard";

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
    <section id="clients" className="py-24 bg-white min-h-screen flex flex-col justify-center">
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
          
          <div className="relative min-h-[600px] bg-celebrate-cream rounded-2xl flex items-center justify-center border border-celebrate-sage/30 p-6 md:p-10 lg:max-w-[540px] lg:ml-auto w-full">
             <ClientProposalCard />
          </div>
        </div>
      </div>
    </section>
  );
}
