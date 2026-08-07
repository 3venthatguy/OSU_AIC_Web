import { Officer, ClubEvent, ProjectItem } from './types';

// Officer headshots are bundled assets, not remote URLs: hotlinked CDN images
// (LinkedIn in particular) carry signed expiry params and go dead without warning.
// Drop a square crop into assets/profiles/, import it here, and set `photo`.
import evanMengesPhoto from '../assets/profiles/evan-menges.webp';

export const CLUB_EMAIL = "osuaiclub@gmail.com";
export const CLUB_DISCORD_URL = "https://discord.com/invite/GPCmTECWRu";
export const CLUB_INSTAGRAM_URL = "http://www.instagram.com/ohiostateaiclub";
export const CLUB_LINKEDIN_URL = "https://www.linkedin.com/company/artificial-intelligence-club/about/";
export const NEWSLETTER_URL = "https://go.osu.edu/aiclub";

/** Shared Google Form backing both project-team and HackAI signups. */
export const PROJECT_APPLICATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd3Aj_10MRloCjjvdpF_HnvoOI8poBr6LveJTUvKTZkrhiDuA/viewform?usp=header";
export const HACKAI_REGISTRATION_URL = PROJECT_APPLICATION_URL;

export const MEETING_LOCATION = "Enarson 258";
export const MEETING_DAY = "Wednesdays";
export const MEETING_TIME = "7:00 PM";
export const MEETING_SCHEDULE = `${MEETING_DAY} ${MEETING_TIME}`;

export const HACKAI_NAME = "HACKAI 2027";
export const HACKAI_DATE_BADGE = "FEB 20–21, 2027";
export const HACKAI_DATE_FULL = "Feb 20–21, 2027";
export const HACKAI_LOCATION_BADGE = "FONTANA LAB";
export const HACKAI_LOCATION_FULL = "Fontana Lab";
export const HACKAI_DATE_SHORT = "FEB 20–21";
export const HACKAI_BANNER_BADGE = `✦ ${HACKAI_DATE_BADGE} — ${HACKAI_LOCATION_BADGE}`;

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
    role: 'Communications Officer',
    major: 'Electrical & Computer Engineering',
    minor: 'Robotics & Autonomous Systems',
    year: '2nd Year',
    initials: 'HL',
    bio: 'Manages industry partnerships, sponsorships, and speaker invitations.',
    socials: {}
  },
  {
    id: 'cynthia-lm',
    name: 'Cynthia Lm',
    role: 'Technology Officer',
    major: 'Data Analytics',
    minor: 'Cognitive Science',
    year: '3rd Year',
    initials: 'CL',
    bio: 'Co-leads the club\'s technical programming, workshop curriculum, and semester project teams.',
    socials: {}
  },
  {
    id: 'evan-menges',
    name: 'Evan Menges',
    role: 'Technology Officer',
    major: 'Electrical Engineering + Economics',
    minor: 'Nuclear Engineering',
    year: '4th Year',
    initials: 'EM',
    bio: 'Co-leads the club\'s technical programming, maintains this website, and manages the club\'s developer tooling.',
    photo: evanMengesPhoto,
    socials: {
      linkedin: 'https://www.linkedin.com/in/evan-menges/',
      github: 'https://github.com/3venthatguy'
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
  },
  {
    id: 'mustafa-elshikh',
    name: 'Mustafa Elshikh',
    role: 'Marketing Officer',
    major: 'Information Systems',
    minor: 'Economics',
    year: '3rd Year',
    initials: 'ME',
    bio: 'Runs the club\'s social channels, event promotion, and recruitment campaigns.',
    socials: {}
  }
];

export const EVENTS: ClubEvent[] = [
  {
    id: 'pytorch-intro',
    category: 'Workshop',
    title: 'Intro to PyTorch & Neural Networks',
    description: 'Learn the fundamentals of deep learning libraries. We will build, train, and test our first simple multi-layer perceptron from scratch.',
    dateString: 'Oct 6, 2026',
    day: '06',
    month: 'OCT',
    time: MEETING_TIME,
    location: MEETING_LOCATION,
    rsvpUrl: 'https://example.com/rsvp-pytorch',
    isPast: false
  },
  {
    id: 'google-industry-night',
    category: 'Speaker',
    title: 'AI Industry Night: Google Researchers',
    description: 'Join us for a fireside chat with ML research engineers from Google DeepMind and Google Cloud to discuss agentic setups and TPU computing.',
    dateString: 'Oct 13, 2026',
    day: '13',
    month: 'OCT',
    time: MEETING_TIME,
    location: MEETING_LOCATION,
    rsvpUrl: 'https://example.com/rsvp-google',
    isPast: false
  },
  {
    id: 'hackai-opens',
    category: 'HackAI',
    title: `${HACKAI_NAME} Registration Kickoff`,
    description: 'Learn everything about the HackAI prompt challenges, developer themes, and $12K team prizes. Grab early tickets and find team partners!',
    dateString: 'Nov 3, 2026',
    day: '03',
    month: 'NOV',
    time: MEETING_TIME,
    location: MEETING_LOCATION,
    rsvpUrl: 'https://example.com/rsvp-hackai-registration',
    isPast: false
  },
  {
    id: 'llm-tuning',
    category: 'Workshop',
    title: 'Fine-Tuning LLMs on Custom Data',
    description: 'Practical guide to LoRA, QLoRA, and parameter-efficient fine-tuning (PEFT). Bring your laptop for a step-by-step Google Colab walk.',
    dateString: 'Nov 10, 2026',
    day: '10',
    month: 'NOV',
    time: MEETING_TIME,
    location: MEETING_LOCATION,
    rsvpUrl: 'https://example.com/rsvp-llmtuning',
    isPast: false
  },
  {
    id: 'semester-mixer',
    category: 'Social',
    title: 'End of Semester Mixer & Showcase',
    description: 'Hang out, eat free pizza, talk shop, and watch live demonstrations of the project team prototypes developed during this academic period.',
    dateString: 'Dec 1, 2026',
    day: '01',
    month: 'DEC',
    time: MEETING_TIME,
    location: MEETING_LOCATION,
    rsvpUrl: 'https://example.com/rsvp-mixer',
    isPast: false
  },
  // Past events
  {
    id: 'past-transformer-hack',
    category: 'HackAI',
    title: 'HackAI 2025: Generative Frontiers',
    description: 'Our annual 36-hour hackathon bringing together over 300 designers and developers to create novel Generative AI systems.',
    dateString: 'Feb 15, 2025',
    day: '15',
    month: 'FEB',
    time: 'Weekend-long',
    location: 'Ohio Union Ballroom',
    rsvpUrl: '#',
    recapUrl: 'https://example.com/recap-hackai-2025',
    isPast: true
  },
  {
    id: 'past-mlops',
    category: 'Workshop',
    title: 'MLOps: Deploying Models to Cloud Run',
    description: 'How to containerize PyTorch runtimes with Docker and deploy them onto scalable serverless clusters with automatic API scaling.',
    dateString: 'Mar 11, 2025',
    day: '11',
    month: 'MAR',
    time: MEETING_TIME,
    location: MEETING_LOCATION,
    rsvpUrl: '#',
    recapUrl: 'https://example.com/recap-mlops',
    isPast: true
  },
  {
    id: 'past-rl-gaming',
    category: 'Workshop',
    title: 'Reinforcement Learning in Gamified Environments',
    description: 'Deep diving into Q-learning and Policy Gradient methods as applied to simulated Atari and custom Gym visual playgrounds.',
    dateString: 'Apr 1, 2025',
    day: '01',
    month: 'APR',
    time: MEETING_TIME,
    location: MEETING_LOCATION,
    rsvpUrl: '#',
    recapUrl: 'https://example.com/recap-rl',
    isPast: true
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'buckeye-chatbot',
    title: 'O-S-U NavBot NLP Engine',
    category: 'Natural Language Processing',
    description: 'A customized, retrieval-augmented generation (RAG) assistant indexing Ohio State course schedules, building layout directories, and advising options.',
    tags: ['LLM', 'RAG', 'VectorDB', 'TypeScript'],
    stats: '500+ Daily Searches',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd50a?q=80&w=600&auto=format&fit=crop',
    applyUrl: PROJECT_APPLICATION_URL
  },
  {
    id: 'traffic-analysis',
    title: 'Buckeye Vision Traffic AI',
    category: 'Computer Vision',
    description: 'An edge-deployed real-time neural analyzer assessing vehicle counts, safety bottlenecks, and pedestrian lanes around Lane Avenue.',
    tags: ['PyTorch', 'YOLOnas', 'OpenCV', 'Docker'],
    stats: '94.2% Real-time Precision',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
    applyUrl: PROJECT_APPLICATION_URL
  },
  {
    id: 'rl-quadcopter',
    title: 'Self-Stabilizing Quadcopter Agent',
    category: 'Robotics & Control',
    description: 'Developing reinforcement learning guidance equations in Pybullet to achieve high-tolerance flight resilience under severe sudden wind gusts.',
    tags: ['Reinforcement Learning', 'PyBullet', 'JAX'],
    stats: '2.4x Recovery Stabilization',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600&auto=format&fit=crop',
    applyUrl: PROJECT_APPLICATION_URL
  },
  {
    id: 'bio-dna',
    title: 'BioBuckeye DNA Sequence Aligning',
    category: 'Bioinformatics Research',
    description: 'Applying generative sequence models to inspect micro-evolution patterns and classify transcription binding spots with state-of-the-art accuracy.',
    tags: ['DNA-seq', 'Keras', 'Transformers', 'BioPython'],
    stats: 'SOTA Validation Bounds',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop',
    applyUrl: PROJECT_APPLICATION_URL
  }
];

export const FAQS = [
  {
    q: "Who is eligible to join the club?",
    a: "Any student enrolled at The Ohio State University (undergraduate, graduate, or PhD) is welcome to join immediately! There are no GPA hurdles or application filters for base membership."
  },
  {
    q: "What if I have zero coding or AI database experience?",
    a: "No problem at all! Most of our members started right where you are. We offer structured, beginner-friendly workshops (starting with Python basics and Intro to PyTorch) designed specifically to get you up to speed."
  },
  {
    q: "Does it cost anything to be a member?",
    a: "No, general membership is entirely free of charge. Thanks to our corporate sponsors and engineering department funding, all workshops, resources, events, and pizzas are fully covered!"
  },
  {
    q: "How do I join a semester project team?",
    a: "Project teams form throughout the semester. Attend the Projects Kickoff, hear project pitches from team leads, or pitch your own idea, and sign up directly."
  },
  {
    q: "How can I participate in HackAI?",
    a: `HackAI is open to all university students. Registration typically opens about 2 months before the event (${HACKAI_DATE_FULL}). Check out our HackAI page for up-to-the-minute updates and prize structures.`
  }
];

export const HACKAI_FAQS = [
  {
    q: "Who is eligible to participate in HackAI?",
    a: "All currently enrolled undergraduate, graduate, and PhD university students (including students from Ohio State and other institutions) are welcome. No prior experience or club admission is required. Any degree branch or background can join!"
  },
    {
    q: "Does registrations or attendance cost anything?",
    a: "Absolutely not! HackAI is 100% free for all admitted hackers. We provide complete catered meals, beverages, snacks, official event shirts, specialized computing credits, and premium swag throughout the weekend."
  },
  {
    q: "What is the team size limit?",
    a: "You can collaborate in teams of 1 to 4 individuals. We will host a dedicated team-formation channel on Discord and a live matchmaking session right after the opening ceremony if you need to find partners."
  },
    {
    q: "What if I don't have a team?",
    a: `At the end of our weekly ${MEETING_TIME} ${MEETING_DAY} meetings at ${MEETING_LOCATION} we will have a team formation session for anyone looking for teammates. You can also ask around in the Artificial Intelligence Club Discord or ${HACKAI_NAME} Discord.`
  },
  {
    q: "Can I participate virtually?",
    a: "Yes! We are using Discord as our online platform. You will be able to work with your team, connect with mentors and get judged through Discord. All events will be hybrid and Zoom links will be posted in the Discord."
  },
  {
    q: "What should I bring to the hackathon?",
    a: "Bring your laptop, power adapter/chargers, any hardware accessories/devices you want to develop on, and your BuckID/student identification card. Sleeping bags, eye masks, and earplugs are recommended if you plan to nap at the venue. Meals will be provided."
  },
  {
    q: "Are beginner-friendly tutorials or workshops provided?",
    a: "Yes! We run specialized intro workshops, cloud deployment tutorials, and API starter guides early in the weekend. Plus, we have professional industry mentors and graduate teaching assistants on-site to assist with debugging."
  },
  {
    q: "How is submission judging structured?",
    a: "Projects are exhibited in a high-energy, interactive science-fair demo layout. Teams pitch their software live to judges from experts, research sponsors, and faculty members who grade based on creativity, technical capability, and product design."
  }
];

