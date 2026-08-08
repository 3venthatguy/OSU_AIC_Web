import { Officer } from '../types';

// Officer headshots are bundled assets, not remote URLs: hotlinked CDN images
// (LinkedIn in particular) carry signed expiry params and go dead without warning.
//
// To add a photo for an officer: drop a square crop into assets/profiles/
// named exactly `<officer-id>.webp` (or .png/.jpg/.jpeg) — e.g. the officer
// with id 'jane-doe' below needs assets/profiles/jane-doe.webp. That's it;
// no import or `photo:` field to wire up by hand. Vite's `import.meta.glob`
// below scans the folder at build time and matches files to officers by id.
// An officer with no matching file just falls back to rendering `initials`.
const profilePhotos = import.meta.glob('../../assets/profiles/*.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function photoForOfficer(id: string): string | undefined {
  const match = Object.keys(profilePhotos).find((path) => path.match(new RegExp(`/${id}\\.(webp|png|jpe?g)$`)));
  return match ? profilePhotos[match] : undefined;
}

// NOTE: bios below are neutral role descriptions. Replace them with copy each
// officer has written and approved — do not invent internships, labs or research
// interests for a named person.
export const OFFICERS: Officer[] = [
  {
    id: 'anirudh-chinthagunta',
    name: 'Anirudh Chinthagunta',
    role: 'President',
    major: 'Computer Science & Engineering',
    year: '3rd Year',
    initials: 'AC',
    bio: 'Leads the club\'s strategic direction and coordinates between all officer teams.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/anirudh-chinthagunta/',
    }
  },
  {
    id: 'aayush-paul',
    name: 'Aayush Paul',
    role: 'Vice President',
    major: 'TBD',
    year: 'TBD',
    initials: 'AP',
    bio: 'Oversees member onboarding and workshop programming. This seat is open — see the Events page for how to get involved.',
    socials: {}
  },
  {
    id: 'maanov-jajodia',
    name: 'Maanov Jajodia',
    role: 'Treasurer',
    major: 'CSE + Math',
    year: '3rd Year',
    initials: 'MJ',
    bio: 'Manages the club budget, sponsor funding, and reimbursements for events and project teams.',
    socials: {}
  },
  {
    id: 'harker-lecroy',
    name: 'Harker LeCroy',
    role: 'Chief Communications Officer',
    major: 'Electrical & Computer Engineering',
    minor: 'Robotics & Autonomous Systems',
    year: '2nd Year',
    initials: 'HL',
    bio: 'Manages industry partnerships, sponsorships, and speaker invitations.',
    socials: {}
  },
  {
    id: 'cynthia-song',
    name: 'Cynthia Song',
    role: 'Technology Director',
    major: 'Data Analytics',
    minor: 'Cognitive Science',
    year: '3rd Year',
    initials: 'CS',
    bio: 'Co-leads the club\'s technical programming, workshop curriculum, and semester project teams.',
    socials: {}
  },
  {
    id: 'evan-menges',
    name: 'Evan Menges',
    role: 'Technology Director',
    major: 'Electrical Engineering + Economics',
    minor: 'Nuclear Engineering',
    year: '4th Year',
    initials: 'EM',
    bio: 'Co-leads the club\'s technical programming, maintains this website, and manages the club\'s developer tooling.',
    photo: photoForOfficer('evan-menges'),
    socials: {
      linkedin: 'https://www.linkedin.com/in/evan-menges/',
      github: 'https://github.com/3venthatguy'
    }
  },
  {
    id: 'mustafa-elshikh',
    name: 'Mustafa Elshikh',
    role: 'Marketing Officer',
    major: 'Computer Science',
    minor: 'Mathematics',
    year: '2nd Year',
    initials: 'ME',
    bio: 'Runs the club\'s social channels, event promotion, and recruitment campaigns.',
    photo: photoForOfficer('mustafa-elshikh'),
    socials: {
      linkedin: 'https://www.linkedin.com/in/melshikh/',
      github: 'https://github.com/mustafa1821'
    }
  },
  {
    id: 'sushmita-sudhan',
    name: 'Sushmita Sudhan',
    role: 'Marketing Officer',
    major: 'Information Systems',
    minor: 'Economics',
    year: '3rd Year',
    initials: 'SS',
    bio: 'Runs the club\'s social channels, event promotion, and recruitment campaigns.',
    socials: {}
  }
];
