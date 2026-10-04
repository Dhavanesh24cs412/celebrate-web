export interface EventConfig {
  services: string[];
  styles: string[];
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
    styles: ['Traditional', 'Modern', 'Luxury', 'Simple', 'Boho'],
    specificQuestions: [
      { id: 'ceremonyType', label: 'Ceremony Type', type: 'select', options: ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Other'] },
      { id: 'functionsIncluded', label: 'Functions Included', type: 'select', options: ['Wedding only', 'Multiple functions'] },
      { id: 'foodRequired', label: 'Catering / Food', type: 'boolean' }
    ]
  },
  'Reception': {
    services: ['Stage / Backdrop', 'Entrance Decor', 'Lighting', 'Food & Beverages', 'DJ / Music', 'Photography', 'Videography'],
    styles: ['Elegant', 'Luxury', 'Modern', 'Traditional', 'Minimal'],
    specificQuestions: []
  },
  'Engagement': {
    services: ['Ring Ceremony Setup', 'Stage / Backdrop', 'Floral Decor', 'Food', 'Photography', 'Music / DJ'],
    styles: ['Simple', 'Elegant', 'Traditional', 'Modern', 'Luxury'],
    specificQuestions: []
  },
  'Corporate': {
    services: ['Stage / Backdrop', 'Branding / Company Branding', 'Audio / Mic / AV', 'LED / Display', 'Lighting', 'Food & Beverages', 'Event Host / Emcee', 'Photography', 'Videography'],
    styles: ['Professional', 'Modern', 'Creative', 'Minimalist'],
    specificQuestions: [
      { id: 'companyName', label: 'Company / Organization Name', type: 'text' },
      { id: 'corporateEventType', label: 'Event Type', type: 'select', options: ['Conference', 'Product Launch', 'Annual Meet', 'Team Event', 'Other'] },
      { id: 'seatingStyle', label: 'Seating Arrangement', type: 'select', options: ['Theatre', 'Classroom', 'Boardroom', 'Mixed'] }
    ]
  },
  'Haldi': {
    services: ['Floral Decor', 'Backdrop', 'Photo Area', 'Food', 'Music / DJ', 'Fun Games'],
    styles: ['Traditional', 'Floral', 'Colorful', 'Modern'],
    specificQuestions: [
      { id: 'venueType', label: 'Venue Setup', type: 'select', options: ['Home', 'Hall', 'Outdoor', 'Other'] }
    ]
  },
  'Mehandi': {
    services: ['Stage / Backdrop', 'Floral Decor', 'Photo Area', 'Food', 'Music / DJ', 'Fun Activities / Games'],
    styles: ['Traditional', 'Boho', 'Floral', 'Colorful', 'Modern'],
    specificQuestions: [
      { id: 'venueType', label: 'Venue Setup', type: 'select', options: ['Home', 'Hall', 'Outdoor', 'Other'] }
    ]
  },
  'Sangeet': {
    services: ['Stage / Performance Area', 'LED Screen', 'Lighting', 'Dance Floor', 'DJ / Music', 'Event Host', 'Sound System', 'Food', 'Photography', 'Videography'],
    styles: ['Traditional', 'Glamorous', 'Modern', 'Luxury'],
    specificQuestions: []
  },
  'Birthday': {
    services: ['Cake Table / Cake Setup', 'Backdrop', 'Balloons / Decor', 'Food', 'Music / DJ', 'Games', 'Photography'],
    styles: ['Themed', 'Colorful', 'Elegant', 'Minimal'],
    specificQuestions: [
      { id: 'birthdayPerson', label: 'Birthday Person / Age', type: 'text' },
      { id: 'venueType', label: 'Venue Setup', type: 'select', options: ['Home', 'Hall', 'Outdoor', 'Restaurant', 'Other'] }
    ]
  },
  'Private Parties': {
    services: ['Decor', 'Lighting', 'Food & Beverages', 'DJ / Music', 'Dance Floor', 'Event Host', 'Fun Games', 'Photography'],
    styles: ['Elegant', 'Casual', 'Luxury', 'Themed', 'Minimal'],
    specificQuestions: [
      { id: 'partyType', label: 'Party Type', type: 'select', options: ['House Party', 'Anniversary', 'Get-together', 'Farewell', 'Celebration', 'Other'] }
    ]
  }
};
