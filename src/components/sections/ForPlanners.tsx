import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { Users, Briefcase, Calendar, Star } from "lucide-react";
import { PlannerDashboardMockup } from "../marketing/PlannerDashboardMockup";

export function ForPlanners() {
  const features = [
    {
      title: "Qualified Client Leads",
      description: "Discover event opportunities that match your expertise, services, location, and budget—so you spend less time chasing leads and more time pursuing the right ones.",
      icon: Users,
    },
    {
      title: "AI-Assisted Proposals",
      description: "Show clients what you can create. Bring your decor, design ideas, and event vision into your proposal so they can see the possibilities before they choose.",
      icon: Briefcase,
    },
    {
      title: "Stand Out for the Right Events",
      description: "When an event matches your expertise, your proposal is considered alongside other suitable planners—giving you a clear opportunity to stand out through your ideas, experience, and value.",
      icon: Star,
    },
    {
      title: "Centralized Operations",
      description: "Manage client relationships, events, payments, schedules, and ongoing work from one connected planner workspace.",
      icon: Calendar,
    },
  ];

  return (
    <section id="planners" className="py-24 bg-celebrate-navy text-white min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative w-full flex justify-center items-center">
             <PlannerDashboardMockup />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader
              title="For Planners"
              subtitle="Grow your event business with relevant opportunities, stronger proposals, and everything you need to manage your work in one place."
              align="left"
              className="text-white"
            />
            {/* Override text colors for dark mode since SectionHeader hardcodes them */}
            <style>{`
              #planners h2 { color: white; }
              #planners p { color: rgba(255, 255, 255, 0.7); }
            `}</style>
            
            <div className="space-y-8 mt-10">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-celebrate-cream">
                      <feature.icon size={24} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button size="lg" className="bg-celebrate-cream text-celebrate-navy hover:bg-white">
                Join the Network
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
