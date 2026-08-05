export interface Officer {
  id: string;
  name: string;
  role: string;
  major: string;
  minor?: string;
  year: string;
  bio: string;
  /** Resolved URL of a bundled headshot imported in data.ts. Omit to render `initials` instead. */
  photo?: string;
  initials: string;
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export interface ClubEvent {
  id: string;
  category: 'Workshop' | 'Speaker' | 'HackAI' | 'Social';
  title: string;
  description: string;
  dateString: string; // Full readable date e.g. "Sept 12, 2025"
  day: string; // Day number e.g. "12"
  month: string; // Month initials e.g. "SEPT"
  time: string; // "6:00 PM"
  location: string; // "Dreese Lab 260"
  rsvpUrl: string;
  recapUrl?: string;
  isPast?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  stats: string;
  image: string;
  applyUrl?: string;
}
