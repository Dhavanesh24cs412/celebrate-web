import { SectionHeader } from "../ui/SectionHeader";
import { EventChromaGrid } from "../marketing/EventChromaGrid";

export function EventTypes() {
  const events = [
    { image: "/images/chroma-grid/wedding.webp", title: "Weddings", subtitle: "Complete planning, decor, and execution." },
    { image: "/images/chroma-grid/corporate-.webp", title: "Corporate Events", subtitle: "Conferences, product launches, and retreats." },
    { image: "/images/chroma-grid/private.webp", title: "Private Celebrations", subtitle: "Birthdays, anniversaries, and milestone events." },
    { image: "/images/chroma-grid/culturals.webp", title: "Cultural Programs", subtitle: "Festivals, community gatherings, and exhibitions." },
    { image: "/images/chroma-grid/reception.webp", title: "Receptions", subtitle: "Elegant evenings designed to perfection." },
    { image: "/images/chroma-grid/engagement.webp", title: "Engagements", subtitle: "Intimate ceremonies to grand celebrations." },
  ];

  return (
    <section id="event-types" className="py-24 bg-white flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <SectionHeader
          title="Every Celebration Supported"
          subtitle="Our marketplace connects you with specialists for any event category."
        />
        
        <EventChromaGrid categories={events} />
      </div>
    </section>
  );
}
