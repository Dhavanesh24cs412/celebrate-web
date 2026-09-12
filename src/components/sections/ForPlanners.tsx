import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";

export function ForPlanners() {
  const features = [
    {
      title: "Qualified Client Leads",
      description: "Receive event opportunities that match your expertise, service areas, and budget criteria.",
      icon: Users,
    },
    {
      title: "AI-Assisted Proposals",
      description: "Stand out by submitting compelling proposals featuring AI-generated event design concepts.",
      icon: Briefcase,
    },
    {
      title: "Centralized Operations",
      description: "Manage client relationships, events, payments, and schedules from a single Planner OS workspace.",
      icon: Calendar,
    },
    {
      title: "Professional Recruitment",
      description: "Easily discover and recruit verified photographers, decorators, and other event professionals.",
      icon: TrendingUp,
    },
  ];

  return (
    <section id="planners" className="py-24 bg-celebrate-navy text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative h-[600px] bg-celebrate-navy/50 rounded-2xl flex items-center justify-center overflow-hidden border border-celebrate-sage/20 p-8">
             <div className="absolute inset-0 bg-gradient-to-br from-celebrate-navy via-celebrate-navy to-celebrate-terracotta/20" />
             
             {/* Abstract Dashboard Representation */}
             <div className="w-full h-full flex flex-col gap-4 relative z-10">
               {/* Top Bar */}
               <div className="h-12 w-full bg-white/5 rounded-lg border border-white/10 flex items-center px-4 justify-between">
                 <div className="h-4 w-24 bg-white/20 rounded"></div>
                 <div className="h-8 w-8 rounded-full bg-white/20"></div>
               </div>
               
               <div className="flex gap-4 flex-1">
                 {/* Sidebar */}
                 <div className="w-16 md:w-48 bg-white/5 rounded-lg border border-white/10 flex flex-col gap-4 p-4">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="h-8 w-full bg-white/10 rounded"></div>
                   ))}
                 </div>
                 
                 {/* Main Content Area */}
                 <div className="flex-1 bg-white/5 rounded-lg border border-white/10 p-6 flex flex-col gap-4">
                   <div className="h-6 w-48 bg-white/20 rounded mb-4"></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="h-24 bg-celebrate-terracotta/20 border border-celebrate-terracotta/30 rounded-lg p-4">
                        <div className="h-4 w-1/2 bg-celebrate-terracotta/50 rounded mb-2"></div>
                        <div className="h-8 w-1/3 bg-white/60 rounded"></div>
                     </div>
                     <div className="h-24 bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="h-4 w-1/2 bg-white/20 rounded mb-2"></div>
                        <div className="h-8 w-1/3 bg-white/40 rounded"></div>
                     </div>
                   </div>
                   <div className="flex-1 bg-white/5 border border-white/10 rounded-lg mt-2 flex items-center justify-center">
                     <p className="text-white/30 text-sm font-medium italic">
                        [ Planner Dashboard Preview ]
                     </p>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader
              title="For Planners"
              subtitle="Grow your event business. Stop chasing disconnected leads and start managing everything in one place."
              align="left"
              className="text-white"
            />
            {/* Override subtitle color for dark mode since SectionHeader hardcodes it */}
            <style>{`#planners p { color: rgba(255, 255, 255, 0.7); }`}</style>
            
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
