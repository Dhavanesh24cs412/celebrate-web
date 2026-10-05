export interface EventConfig {
  services: string[];
  styles: { name: string; description: string }[];
  specificQuestions: {
    id: string;
    label: string;
    type: 'select' | 'boolean' | 'text';
    options?: string[];
  }[];
}

export const EVENT_WIZARD_CONFIG: Record<string, EventConfig> = {
  'Wedding': {
    services: ['Stage Decor', 'Entrance Decor', 'Mandapam', 'Full Venue Decor', 'Photography', 'Videography', 'DJ', 'Live Music', 'Host / Emcee', 'Dance Troupe'],
    styles: [
      { name: 'Traditional', description: 'Classic and cultural, featuring rich colors, heavy drapes, and heritage motifs.' },
      { name: 'Modern', description: 'Sleek, chic, and contemporary design with clean lines and premium lighting.' },
      { name: 'Luxury', description: 'Grand and opulent, characterized by extravagant floral installations and crystal elements.' },
      { name: 'Simple', description: 'Minimalist and elegant, focusing on intimate details without being overwhelming.' },
      { name: 'Boho', description: 'Earthy, relaxed vibes with pampas grass, macrame, and natural textures.' }
    ],
    specificQuestions: [
      { id: 'ceremonyType', label: 'Ceremony Type', type: 'select', options: ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Other'] },
      { id: 'foodRequired', label: 'Catering / Food', type: 'boolean' }
    ]
  },
  'Reception': {
    services: ['Stage / Backdrop', 'Entrance Decor', 'Lighting', 'Food & Beverages', 'DJ / Music', 'Photography', 'Videography'],
    styles: [
      { name: 'Elegant', description: 'Graceful and sophisticated decor with timeless arrangements and subtle tones.' },
      { name: 'Luxury', description: 'High-end, lavish setups emphasizing grandeur, heavy chandeliers, and premium seating.' },
      { name: 'Modern', description: 'Avant-garde styling focusing on sharp LED visuals and geometric aesthetic elements.' },
      { name: 'Traditional', description: 'Rich in cultural roots with heavy fabrics, classic seating, and warm ambient lighting.' },
      { name: 'Minimal', description: 'Clean, understated decor with strategic focal points and airy, breathable space.' }
    ],
    specificQuestions: []
  },
  'Engagement': {
    services: ['Ring Ceremony Setup', 'Stage / Backdrop', 'Floral Decor', 'Food', 'Photography', 'Music / DJ'],
    styles: [
      { name: 'Simple', description: 'Sweet, intimate decor perfect for close gatherings and soft photography.' },
      { name: 'Elegant', description: 'Refined and classy, using pastel palettes and delicate floral structures.' },
      { name: 'Traditional', description: 'Classic cultural elements with vibrant, deeply rooted aesthetic choices.' },
      { name: 'Modern', description: 'Trendy, unique, and fresh decor styles reflecting current visual aesthetics.' },
      { name: 'Luxury', description: 'High-budget, extravagant setup for a grand announcement of the union.' }
    ],
    specificQuestions: []
  },
  'Corporate': {
    services: ['Stage / Backdrop', 'Branding / Company Branding', 'Audio / Mic / AV', 'LED / Display', 'Lighting', 'Food & Beverages', 'Event Host / Emcee', 'Photography', 'Videography'],
    styles: [
      { name: 'Professional', description: 'Clean, brand-focused, and highly organized setup optimized for attention.' },
      { name: 'Modern', description: 'Tech-forward, sharp aesthetic suitable for high-end product launches and summits.' },
      { name: 'Creative', description: 'Out-of-the-box, vibrant decor designed to inspire and energize team members.' },
      { name: 'Minimalist', description: 'Zero-distraction, highly functional environment maximizing focus and clarity.' }
    ],
    specificQuestions: [
      { id: 'companyName', label: 'Company / Organization Name', type: 'text' },
      { id: 'corporateEventType', label: 'Event Type', type: 'select', options: ['Conference', 'Product Launch', 'Annual Meet', 'Team Event', 'Other'] },
      { id: 'seatingStyle', label: 'Seating Arrangement', type: 'select', options: ['Theatre', 'Classroom', 'Boardroom', 'Mixed'] }
    ]
  },
  'Haldi': {
    services: ['Floral Decor', 'Backdrop', 'Photo Area', 'Food', 'Music / DJ', 'Fun Games'],
    styles: [
      { name: 'Traditional', description: 'Classic floral mandap setup with authentic brass props and yellow draping.' },
      { name: 'Modern', description: 'A neat, creative layout focusing on aesthetic minimalism and subtle floral touches.' }
    ],
    specificQuestions: [
      { id: 'venueType', label: 'Venue Setup', type: 'select', options: ['Home', 'Hall', 'Outdoor', 'Other'] }
    ]
  },
  'Mehandi': {
    services: ['Stage / Backdrop', 'Floral Decor', 'Photo Area', 'Food', 'Music / DJ', 'Fun Activities / Games'],
    styles: [
      { name: 'Traditional', description: 'Rich, culturally vibrant decor featuring marigolds and classic seating.' },
      { name: 'Boho', description: 'Earthy, relaxed vibes with pampas grass, macrame, and low floor seating.' },
      { name: 'Modern', description: 'Chic, clean lines with contemporary pastel floral arrangements.' }
    ],
    specificQuestions: [
      { id: 'venueType', label: 'Venue Setup', type: 'select', options: ['Home', 'Hall', 'Outdoor', 'Other'] }
    ]
  },
  'Sangeet': {
    services: ['Stage / Performance Area', 'LED Screen', 'Lighting', 'Dance Floor', 'DJ / Music', 'Event Host', 'Sound System', 'Food', 'Photography', 'Videography'],
    styles: [
      { name: 'Luxury', description: 'Grand stage, premium lighting, and opulent decor for a high-end experience.' },
      { name: 'Modern', description: 'Sleek, tech-forward setups with sharp LED screens and contemporary styling.' },
      { name: 'Traditional', description: 'Culturally rich aesthetics with heavy drapes, classic motifs, and warm lighting.' }
    ],
    specificQuestions: []
  },
  'Birthday': {
    services: ['Cake Table / Cake Setup', 'Backdrop', 'Balloons / Decor', 'Food', 'Music / DJ', 'Games', 'Photography'],
    styles: [
      { name: 'Themed', description: 'Custom-built immersive environment based on your chosen specific theme.' },
      { name: 'Minimal', description: 'Clean, elegant decor focusing on a beautiful cake setup and subtle balloons.' },
      { name: 'Luxury', description: 'High-end, extravagant decor with premium florals and statement backdrops.' }
    ],
    specificQuestions: [
      { id: 'birthdayPerson', label: 'Birthday Person / Age', type: 'text' },
      { id: 'venueType', label: 'Venue Setup', type: 'select', options: ['Home', 'Hall', 'Outdoor', 'Restaurant', 'Other'] }
    ]
  },
  'Private Parties': {
    services: ['Decor', 'Lighting', 'Food & Beverages', 'DJ / Music', 'Dance Floor', 'Event Host', 'Fun Games', 'Photography'],
    styles: [
      { name: 'Casual', description: 'Relaxed, comfortable setup perfect for intimate mingling and good times.' },
      { name: 'Themed', description: 'Creative, cohesive styling tailored entirely to your specific party concept.' },
      { name: 'Vibeful', description: 'High-energy aesthetic with dynamic lighting, neon accents, and immersive audio.' }
    ],
    specificQuestions: [
      { id: 'partyType', label: 'Party Type', type: 'select', options: ['House Party', 'Anniversary', 'Get-together', 'Farewell', 'Celebration', 'Other'] }
    ]
  }
};
