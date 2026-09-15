export interface DriftWallItem {
  image: string;
  title: string;
  category: string;
  source: "unsplash" | "pexels" | "local" | "other";
  photographer?: string;
  sourceUrl?: string;
  photographerUrl?: string;
}

export const driftWallItems: DriftWallItem[] = [
  // Weddings
  {
    image: "/images/driftwall/wedding-1.webp",
    title: "Wedding Celebration",
    category: "Wedding",
    source: "local"
  },
  {
    image: "/images/driftwall/wedding-2.webp",
    title: "Bridal Party",
    category: "Wedding",
    source: "local"
  },
  {
    image: "/images/driftwall/wedding-3.webp",
    title: "Wedding Details",
    category: "Wedding",
    source: "local"
  },
  {
    image: "/images/driftwall/wedding-4.webp",
    title: "Wedding Arch",
    category: "Wedding",
    source: "local"
  },
  
  // Engagements
  {
    image: "/images/driftwall/engagement-1.webp",
    title: "Engagement Ring",
    category: "Engagement",
    source: "local"
  },
  {
    image: "/images/driftwall/engagement-2.webp",
    title: "Couple Hugging",
    category: "Engagement",
    source: "local"
  },

  // Receptions
  {
    image: "/images/driftwall/reception-1.webp",
    title: "Party Cheers",
    category: "Reception",
    source: "local"
  },
  {
    image: "/images/driftwall/reception-2.webp",
    title: "Reception Table",
    category: "Reception",
    source: "local"
  },

  // Birthdays
  {
    image: "/images/driftwall/birthday-1.webp",
    title: "Birthday Cake",
    category: "Birthday",
    source: "local"
  },
  {
    image: "/images/driftwall/birthday-2.webp",
    title: "Balloons",
    category: "Birthday",
    source: "local"
  },
  {
    image: "/images/driftwall/birthday-3.webp",
    title: "Party Hats",
    category: "Birthday",
    source: "local"
  },

  // Anniversaries
  {
    image: "/images/driftwall/anniversary-1.webp",
    title: "Toast",
    category: "Anniversary",
    source: "local"
  },
  {
    image: "/images/driftwall/anniversary-2.webp",
    title: "Anniversary Dinner",
    category: "Anniversary",
    source: "local"
  },

  // Corporate Events
  {
    image: "/images/driftwall/corporate-1.webp",
    title: "Conference",
    category: "Corporate",
    source: "local"
  },
  {
    image: "/images/driftwall/corporate-2.webp",
    title: "Corporate Crowd",
    category: "Corporate",
    source: "local"
  },
  {
    image: "/images/driftwall/corporate-3.webp",
    title: "Auditorium",
    category: "Corporate",
    source: "local"
  },

  // Private Dinners
  {
    image: "/images/driftwall/dinner-1.webp",
    title: "Restaurant Table",
    category: "Private Dinner",
    source: "local"
  },
  {
    image: "/images/driftwall/dinner-2.webp",
    title: "Dinner Setup",
    category: "Private Dinner",
    source: "local"
  },
  {
    image: "/images/driftwall/dinner-3.webp",
    title: "Outdoor Dinner",
    category: "Private Dinner",
    source: "local"
  },

  // Other
  {
    image: "/images/driftwall/other-1.webp",
    title: "Event Crowd",
    category: "Other",
    source: "local"
  }
];
