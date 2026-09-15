import { SectionHeader } from "../ui/SectionHeader";

export function EventTypes() {
  const events = [
    { name: "Weddings", desc: "Complete planning, decor, and execution." },
    { name: "Corporate Events", desc: "Conferences, product launches, and retreats." },
    { name: "Private Celebrations", desc: "Birthdays, anniversaries, and milestone events." },
    { name: "Cultural Programs", desc: "Festivals, community gatherings, and exhibitions." },
    { name: "Receptions", desc: "Elegant evenings designed to perfection." },
    { name: "Engagements", desc: "Intimate ceremonies to grand celebrations." },
  ];

  return (
    <section id="event-types" className="py-24 bg-white min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title="Every Celebration Supported"
          subtitle="Our marketplace connects you with specialists for any event category."
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-2xl border border-celebrate-sage/30 hover:border-celebrate-terracotta/50 transition-colors bg-celebrate-cream/20 hover:bg-celebrate-cream/40"
            >
              <h4 className="text-xl font-bold text-celebrate-navy mb-3 group-hover:text-celebrate-terracotta transition-colors">
                {event.name}
              </h4>
              <p className="text-celebrate-navy/70 text-sm">
                {event.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
