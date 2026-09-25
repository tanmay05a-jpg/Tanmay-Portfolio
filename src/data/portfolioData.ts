export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  startingPrice: string;
  priceNote: string;
  deliverables: string[];
  idealFor: string;
  timeline: string;
}

export interface ProfileData {
  name: string;
  role: string;
  headline: string;
  subheadline: string;
  aboutBio: string;
  email: string;
  mobile: string;
  calendarUrl: string;
  primaryCTA: string;
  markets: string;
  experienceYears: number;
  timezoneSupport: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  location?: string;
  avatarUrl?: string; // Executive headshot (IMG_5592.PNG or data URL)
  onsetPhotoUrl?: string; // On-set director viewfinder (Man_holding_director_viewfinder_20260924124100.jpeg)
  chairPhotoUrl?: string; // Director chair (Man_sitting_in_director_chair_20260924124105.jpeg)
  activeHeroPhoto?: 'executive' | 'onset' | 'chair';
}

export interface VideoMetadata {
  type: 'short_ad' | 'commercial' | 'documentary';
  duration: string;
  scriptExcerpt: string;
  keyThemes: string[];
  videoStyle: string;
  highlights: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  serviceCategory: string;
  badge: 'Sample Project' | 'Illustrative Case Study' | 'Client Work' | 'Featured Project' | 'Video Production' | string;
  tagline: string;
  summary: string;
  clientContext: string;
  problem: string;
  solution: string;
  deliverables: string[];
  impactMetric: string;
  impactDetails: string;
  timeline: string;
  techStack: string[];
  projectUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  videoPoster?: string;
  videoSourceType?: 'procedural' | 'video' | 'youtube' | 'vimeo';
  aspectRatio?: '16:9' | '9:16';
  videoDetails?: VideoMetadata;
  isCustom?: boolean;
}

export interface PersonaPhoto {
  id: string;
  photoKey: 'executive' | 'onset' | 'chair';
  title: string;
  role: string;
  context: string;
  tag: string;
  fileName: string;
  photoUrl?: string;
  highlights: string[];
  theme: 'corporate' | 'onset' | 'bw_director';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const PROFILE_DATA: ProfileData = {
  name: 'Tanmay Agrawal',
  role: 'AI Freelancer & Product Consultant',
  headline: 'I help businesses turn AI into results.',
  subheadline:
    '18 years of enterprise product management, now applied to content, websites, ad campaigns, and AI-powered workflow automation — for founders who need execution, not just advice.',
  aboutBio:
    "For 18 years I built products at the intersection of AI, healthcare, and enterprise platforms — most recently as an AI Product Manager at a global healthcare technology company. I'm now bringing that same product discipline to freelance work, helping small businesses and startups actually use AI, not just talk about it. My approach: understand the business goal first, then apply the right AI-powered execution — content, a website, an ad campaign, or an automated workflow — to get there.",
  email: 'tanmay.05.a@gmail.com',
  mobile: '+91-9963557573',
  calendarUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=AI+Strategy+Consultation+with+Tanmay+Agrawal&details=30-minute+strategic+consultation+call+with+Tanmay+Agrawal.+Focus+on+AI+roadmaps,+video+commercials,+content+engines,+and+workflows.&add=tanmay.05.a@gmail.com',
  primaryCTA: 'Book a free consultation',
  markets: 'Global Clients & High-Growth Startups',
  experienceYears: 18,
  timezoneSupport: ['Eastern Time (EST)', 'Pacific Time (PST)', 'Greenwich Mean Time (GMT)', 'Central European (CET)'],
  linkedinUrl: 'https://www.linkedin.com/in/tanmay-productmanager-ai/',
  twitterUrl: '',
  location: 'Hyderabad, India · Remote & Global Client Support',
  avatarUrl: '', // Default uses high-fidelity SVG or user uploaded image
  onsetPhotoUrl: '',
  chairPhotoUrl: '',
  activeHeroPhoto: 'executive',
};

export const PERSONA_PHOTOS: PersonaPhoto[] = [
  {
    id: 'executive-lead',
    photoKey: 'executive',
    title: 'Enterprise Product Leader',
    role: 'Ex-Global Health Tech AI Product Manager',
    context: 'Corporate Leadership & Strategy',
    tag: '18 Yrs Experience',
    fileName: 'IMG_5592.PNG',
    highlights: [
      'Led mission-critical AI platform initiatives in regulated healthcare environments',
      'Architected zero-hallucination evaluation frameworks and customer data security',
      'Global leadership bridging cross-functional enterprise stakeholders',
    ],
    theme: 'corporate',
  },
  {
    id: 'director-on-set',
    photoKey: 'onset',
    title: 'Commercial Film Director',
    role: 'On-Set Director & Visual Storyteller',
    context: 'Commercial Video & Film Direction',
    tag: 'Hands-on Production',
    fileName: 'Man_holding_director_viewfinder_20260924124100.jpeg',
    highlights: [
      'Directing commercial video ads with high-concept visual pacing and cinematic lighting',
      'Overseeing multicam setups, actor coaching, and optical camera framing on soundstages',
      'Combining AI-assisted script generation with broadcast-grade live cinema execution',
    ],
    theme: 'onset',
  },
  {
    id: 'director-chair-portrait',
    photoKey: 'chair',
    title: 'Creative Campaign Director',
    role: 'Campaign Architect & Narrative Strategist',
    context: 'Editorial & Brand Architecture',
    tag: 'Soundstage Set',
    fileName: 'Man_sitting_in_director_chair_20260924124105.jpeg',
    highlights: [
      'Crafting timeless narratives that turn brand values into cultural moments',
      'Balancing analytical business KPIs with cinematic emotional resonance',
      'Delivering end-to-end creative campaigns from storyboard to final cut',
    ],
    theme: 'bw_director',
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'ai-strategy',
    number: '01',
    title: 'AI Product Strategy Consulting',
    shortDesc:
      'AI strategy roadmaps, architecture evaluations, and vendor assessments for founders who need a straight answer on what to adopt.',
    startingPrice: 'From $250',
    priceNote: 'Strategy roadmap session',
    deliverables: [
      'Comprehensive 2-hour AI readiness assessment',
      'Prioritized 90-day tool & automation roadmap',
      'Vendor vs. build evaluation with cost projections',
      'Data privacy, security & compliance review',
    ],
    idealFor: 'Founders and agency owners paralyzed by AI hype who need clear ROI before investing.',
    timeline: '2–4 business days',
  },
  {
    id: 'ai-automation',
    number: '02',
    title: 'AI Workflow / Automation Builder',
    shortDesc:
      'Designing and documenting AI-powered internal workflows (support triage, content pipelines, reporting) that save real hours.',
    startingPrice: 'From $500',
    priceNote: 'Single end-to-end production workflow',
    deliverables: [
      'Workflow architectural map & process diagrams',
      'Production automation build (Zapier / Make / Webhooks / LLM API)',
      'Human-in-the-loop exception handling & quality checks',
      'Complete SOP documentation and Loom video handoff',
    ],
    idealFor: 'Growing teams losing 15+ hours weekly to repetitive manual triage, copy pasting, and sorting.',
    timeline: '3–7 business days',
  },
  {
    id: 'content-generation',
    number: '03',
    title: 'Content Generation',
    shortDesc:
      'AI-assisted blog posts, LinkedIn ghostwriting, email sequences, and product copy, mapped to your funnel.',
    startingPrice: 'From $400/mo',
    priceNote: 'Monthly structured content sprint',
    deliverables: [
      '8 SEO-informed blog articles mapped to buyer intent',
      'Founder/executive LinkedIn ghostwriting packages',
      'Nurture & onboarding email drip sequences',
      'Custom brand voice prompt system your team keeps',
    ],
    idealFor: 'B2B startups and professional services needing consistent inbound authority without agency bloat.',
    timeline: 'Weekly delivery cadence',
  },
  {
    id: 'website-creation',
    number: '04',
    title: 'Website Creation',
    shortDesc:
      'Fast, credible websites built with AI + no-code tools, launched in days not months.',
    startingPrice: 'From $600',
    priceNote: 'Fixed project complete launch',
    deliverables: [
      '5-page conversion-focused responsive website',
      'Persuasive AI-assisted copy tailored to your audience',
      'Calendar booking & lead capture integrations',
      'Domain setup, lightning CDN hosting, and baseline SEO',
    ],
    idealFor: 'Consultants, boutique agencies, and early startups needing a credible live presence this week.',
    timeline: '5 business days',
  },
  {
    id: 'ad-creative',
    number: '05',
    title: 'Advertisement / Commercial Video Creative',
    shortDesc:
      'AI-generated, A/B-tested ad copy and cinematic video campaigns for Meta, YouTube, and Google.',
    startingPrice: 'From $350',
    priceNote: 'Targeted test sprint or commercial concept',
    deliverables: [
      '10 to 20 angle-diverse ad copy hooks & headlines',
      'High-converting static visual concepts and video storyboards',
      'Commercial video scripts & pacing matrices',
      'Post-sprint performance review & iteration recommendations',
    ],
    idealFor: 'D2C brands and service businesses seeking breakout ad creative or cinematic commercials.',
    timeline: '5 business days',
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [];

export const PRICING_SNAPSHOT = [
  { service: 'Commercial Video & Ad Creative', price: 'From $350', model: 'Test sprint / Commercial cut', highlight: 'Viral hooks, storyboards & multicam direction' },
  { service: 'Content Generation', price: 'From $400 / month', model: 'Monthly sprint cadence', highlight: '8 posts + LinkedIn + email' },
  { service: 'Website Creation', price: 'From $600', model: 'Fixed project', highlight: '5 pages, live in 5 days' },
  { service: 'AI Workflow Automation', price: 'From $500', model: 'Single workflow', highlight: 'Full build & SOP handoff' },
  { service: 'AI Strategy Consulting', price: 'From $250', model: 'Strategy roadmap', highlight: '2-hr session + 90-day roadmap' },
];

export const FAQS: FAQItem[] = [
  {
    question: 'How do you combine 18 years of enterprise product management with commercial video direction?',
    answer:
      'Most video directors lack product and business strategy, while most enterprise PMs lack visual storytelling chops. Having spent 18 years leading platforms and AI in healthcare, I understand conversion funnels, buyer psychology, and technical deliverables — and bring broadcast-level cinematic storytelling to every video campaign, landing page, and automation pipeline.',
  },
  {
    question: 'Why work with an independent consultant instead of a conventional agency?',
    answer:
      'Traditional agencies charge heavy retainers and pass your project to junior staffers. When you work with me, you get direct senior execution by Tanmay Agrawal. Every system, website, video, or content pipeline is delivered with full client ownership, recorded SOPs, and zero vendor lock-in.',
  },
  {
    question: 'How do we collaborate seamlessly across different time zones?',
    answer:
      'I operate seamlessly across global schedules with flexible overlap windows for live discovery sessions and milestone reviews. Day-to-day execution runs asynchronously via Slack, Loom walkthroughs, and direct phone/WhatsApp at +91-9963557573.',
  },
  {
    question: 'How does calendar booking work?',
    answer:
      'You can schedule directly via the consultation booking tool, which syncs directly with my calendar at tanmay.05.a@gmail.com and generates a Google Meet invite instantly. You can also reach out directly via call or WhatsApp at +91-9963557573.',
  },
  {
    question: 'Will my team be able to maintain these systems once the project finishes?',
    answer:
      'Yes, absolutely. A core principle of my work is zero client lock-in. Every workflow, website, or video asset comes with clear source files, Standard Operating Procedures (SOPs), prompt templates, and recorded video handoffs.',
  },
];
