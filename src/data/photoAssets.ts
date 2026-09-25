/**
 * High-fidelity vector illustrations and metadata for Tanmay Agrawal's portfolio photos:
 * 1. IMG_5592.PNG - Executive Corporate Headshot
 * 2. Man_holding_director_viewfinder_20260924124100.jpeg - On-Set Director with Optical Viewfinder
 * 3. Man_sitting_in_director_chair_20260924124105.jpeg - Director Seated in Soundstage Production Chair
 */

export interface PortfolioPhotoItem {
  id: 'executive' | 'onset' | 'chair';
  title: string;
  subtitle: string;
  role: string;
  tag: string;
  fileName: string;
  description: string;
  cameraSetup?: string;
  lighting?: string;
  highlights: string[];
}

export const PORTFOLIO_PHOTOS: PortfolioPhotoItem[] = [
  {
    id: 'executive',
    title: 'Executive Portrait',
    subtitle: 'Enterprise AI & Healthcare Platform Leader',
    role: 'Ex-Global Health Tech AI Product Manager',
    tag: 'Executive Headshot',
    fileName: 'IMG_5592.PNG',
    description:
      'Professional executive studio headshot of Tanmay Agrawal in a sharp tailored navy blazer, capturing 18 years of disciplined enterprise leadership across regulated healthcare and AI systems.',
    cameraSetup: '85mm f/1.4 Portrait Lens, Clean Editorial Studio Backdrop',
    lighting: 'Soft diffused key light with subtle rim accent',
    highlights: [
      '18 years enterprise product management & healthcare AI governance',
      'Transatlantic client execution across United States & United Kingdom',
      'Disciplined product discovery without agency overhead',
    ],
  },
  {
    id: 'onset',
    title: 'On-Set Director with Viewfinder',
    subtitle: 'Hands-on Commercial Cinema Directing',
    role: 'Commercial Film Director & Visual Storyteller',
    tag: 'Production Soundstage',
    fileName: 'Man_holding_director_viewfinder_20260924124100.jpeg',
    description:
      'Tanmay Agrawal on a broadcast commercial soundstage, framing dynamic angles through a director’s optical viewfinder with studio cinema lights and camera rigs in the background.',
    cameraSetup: 'Optical Director’s Viewfinder, Cinema Rigging & Prime Optics',
    lighting: 'Warm tungsten rim lighting with cinematic atmospheric haze',
    highlights: [
      'Hands-on multicam directing and frame composition',
      'Directing actors, food artisans, and cultural commercial narratives',
      'Bridging AI script generation with high-end live cinema execution',
    ],
  },
  {
    id: 'chair',
    title: 'Director’s Chair on Soundstage',
    subtitle: 'Studio Creative Direction & Narrative Strategy',
    role: 'Campaign Architect & Creative Lead',
    tag: 'Director’s Chair',
    fileName: 'Man_sitting_in_director_chair_20260924124105.jpeg',
    description:
      'Tanmay Agrawal seated in the classic black canvas Director’s Chair on set, overseeing commercial video production, script pacing, and broadcast commercial delivery.',
    cameraSetup: 'Wide 35mm Cinema Perspective, Soundstage Floor',
    lighting: 'Contrasty dramatic studio fill with stage spotlights',
    highlights: [
      'End-to-end creative direction from concept storyboard to final cut',
      'Directing regional culinary campaigns and high-retention viral ads',
      'Balancing hard business conversion metrics with authentic human emotion',
    ],
  },
];

/**
 * Clean, recognizable SVG illustration for Tanmay's executive headshot (IMG_5592.PNG)
 * Renders an Indian male executive with sharp black hair, tailored navy suit, warm confident expression.
 */
export const EXECUTIVE_PORTRAIT_SVG = `
<svg viewBox="0 0 400 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="400" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <linearGradient id="suitGrad" x1="120" y1="300" x2="280" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="lapelGrad" x1="160" y1="320" x2="240" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="skinGrad" x1="160" y1="100" x2="240" y2="280" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#d49a75" />
      <stop offset="60%" stop-color="#b67a54" />
      <stop offset="100%" stop-color="#9a5f3a" />
    </linearGradient>
    <linearGradient id="hairGrad" x1="150" y1="60" x2="250" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="40%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Studio Neutral Background -->
  <rect width="400" height="480" fill="url(#bgGrad)" />
  <circle cx="200" cy="190" r="140" fill="#ffffff" opacity="0.6" filter="url(#softGlow)" />
  
  <!-- Subtle Architectural Grid Background -->
  <path d="M0 120 H400 M0 240 H400 M0 360 H400 M100 0 V480 M200 0 V480 M300 0 V480" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.3" />

  <!-- Suited Shoulders & Body -->
  <path d="M50 480 C 60 380, 110 330, 160 320 L 200 350 L 240 320 C 290 330, 340 380, 350 480 Z" fill="url(#suitGrad)" />
  
  <!-- White Crisp Shirt Collar -->
  <path d="M165 315 L 200 365 L 235 315 L 215 310 L 200 335 L 185 310 Z" fill="#ffffff" />
  <path d="M185 330 L 200 365 L 215 330 Z" fill="#e2e8f0" />
  
  <!-- Navy Suit Lapels -->
  <path d="M145 325 L 185 410 L 195 480 L 150 480 L 110 400 Z" fill="url(#lapelGrad)" />
  <path d="M255 325 L 215 410 L 205 480 L 250 480 L 290 400 Z" fill="url(#lapelGrad)" />
  <line x1="200" y1="365" x2="200" y2="480" stroke="#0f172a" stroke-width="3" />
  
  <!-- Executive Silk Pocket Square Accent -->
  <rect x="120" y="380" width="30" height="4" rx="2" fill="#ffffff" opacity="0.9" />

  <!-- Neck -->
  <path d="M178 240 C 178 280, 222 280, 222 240 Z" fill="#9a5f3a" />
  <path d="M180 230 L 180 305 C 190 312, 210 312, 220 305 L 220 230 Z" fill="url(#skinGrad)" />

  <!-- Head / Face -->
  <ellipse cx="200" cy="180" rx="60" ry="72" fill="url(#skinGrad)" />
  <path d="M145 180 C 145 235, 170 252, 200 252 C 230 252, 255 235, 255 180 Z" fill="url(#skinGrad)" />

  <!-- Ears -->
  <ellipse cx="138" cy="185" rx="7" ry="14" fill="#b67a54" />
  <ellipse cx="262" cy="185" rx="7" ry="14" fill="#b67a54" />

  <!-- Groomed Short Professional Hair -->
  <path d="M138 170 C 135 125, 155 95, 200 95 C 245 95, 265 125, 262 170 C 255 130, 240 115, 200 115 C 160 115, 145 130, 138 170 Z" fill="url(#hairGrad)" />
  <path d="M140 160 C 148 110, 180 100, 210 102 C 240 104, 260 120, 262 165 C 255 140, 240 128, 215 128 C 185 128, 155 140, 140 160 Z" fill="#090d16" />

  <!-- Eyebrows -->
  <path d="M162 155 Q 178 150 190 156" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <path d="M210 156 Q 222 150 238 155" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none" />

  <!-- Eyes - Confident, Warm Strategic Focus -->
  <ellipse cx="177" cy="168" rx="8" ry="4.5" fill="#ffffff" />
  <ellipse cx="223" cy="168" rx="8" ry="4.5" fill="#ffffff" />
  <circle cx="177" cy="168" r="4" fill="#1e293b" />
  <circle cx="223" cy="168" r="4" fill="#1e293b" />
  <circle cx="175.5" cy="166.5" r="1.2" fill="#ffffff" />
  <circle cx="221.5" cy="166.5" r="1.2" fill="#ffffff" />

  <!-- Nose -->
  <path d="M200 165 L 197 195 L 204 198" stroke="#8b4d27" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />

  <!-- Subtle Trimmed Mustache / Goatee Shadow & Smile -->
  <path d="M184 216 Q 200 224 216 216" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <path d="M188 220 Q 200 226 212 220" stroke="#8b4d27" stroke-width="1.5" stroke-linecap="round" fill="none" />
  
  <!-- Professional studio badge tag -->
  <g transform="translate(20, 20)">
    <rect width="112" height="24" rx="6" fill="#0f172a" fill-opacity="0.85" />
    <circle cx="14" cy="12" r="4" fill="#3b82f6" />
    <text x="24" y="16" fill="#ffffff" font-family="system-ui, sans-serif" font-size="10" font-weight="600" letter-spacing="0.5">IMG_5592.PNG</text>
  </g>

  <!-- Watermark badge -->
  <g transform="translate(260, 436)">
    <rect width="120" height="24" rx="6" fill="#ffffff" fill-opacity="0.9" />
    <text x="10" y="16" fill="#0f172a" font-family="system-ui, sans-serif" font-size="9" font-weight="700">TANMAY AGRAWAL</text>
  </g>
</svg>
`;

/**
 * Clean, recognizable SVG illustration for Tanmay holding a director's viewfinder on set
 * (Man_holding_director_viewfinder_20260924124100.jpeg)
 */
export const VIEW_FINDER_PORTRAIT_SVG = `
<svg viewBox="0 0 400 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
  <defs>
    <linearGradient id="setBg" x1="0" y1="0" x2="400" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="60%" stop-color="#09090b" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="lensGrad" x1="160" y1="130" x2="240" y2="210" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <radialGradient id="stageSpotlight" cx="300" cy="100" r="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#b45309" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Dark Film Studio Soundstage -->
  <rect width="400" height="480" fill="url(#setBg)" />
  <circle cx="300" cy="100" r="160" fill="url(#stageSpotlight)" />

  <!-- Studio Ceiling Light Rig Truss -->
  <line x1="20" y1="40" x2="380" y2="40" stroke="#52525b" stroke-width="4" />
  <line x1="60" y1="40" x2="100" y2="80" stroke="#71717a" stroke-width="2" />
  <line x1="140" y1="40" x2="180" y2="80" stroke="#71717a" stroke-width="2" />
  <line x1="260" y1="40" x2="300" y2="80" stroke="#71717a" stroke-width="2" />
  <!-- Studio Spotlights -->
  <rect x="280" y="45" width="40" height="30" rx="4" fill="#27272a" stroke="#d97706" stroke-width="2" />
  <polygon points="270,75 330,75 370,180 230,180" fill="#f59e0b" fill-opacity="0.15" />

  <!-- Director Figure in Crew Attire -->
  <path d="M70 480 C 80 390, 120 340, 170 330 L 230 330 C 280 340, 320 390, 330 480 Z" fill="#27272a" />
  <!-- Dark Studio Henley Collar -->
  <path d="M185 330 L 200 370 L 215 330 Z" fill="#18181b" />
  <circle cx="200" cy="350" r="2" fill="#71717a" />
  <circle cx="200" cy="360" r="2" fill="#71717a" />

  <!-- Director Lanyard around neck -->
  <path d="M175 330 C 185 380, 200 420, 200 440" stroke="#3b82f6" stroke-width="3" fill="none" />
  <path d="M225 330 C 215 380, 200 420, 200 440" stroke="#3b82f6" stroke-width="3" fill="none" />
  <rect x="188" y="435" width="24" height="32" rx="3" fill="#ffffff" stroke="#94a3b8" />
  <rect x="192" y="440" width="16" height="8" fill="#ef4444" />
  <line x1="192" y1="454" x2="208" y2="454" stroke="#0f172a" stroke-width="1.5" />
  <line x1="192" y1="459" x2="204" y2="459" stroke="#64748b" stroke-width="1" />

  <!-- Neck -->
  <path d="M182 250 L 182 330 L 218 330 L 218 250 Z" fill="#b67a54" />

  <!-- Head / Face with Warm Rim Lighting -->
  <ellipse cx="200" cy="200" rx="55" ry="68" fill="#b67a54" />
  
  <!-- Hair & Beard -->
  <path d="M145 190 C 142 140, 160 115, 200 115 C 240 115, 258 140, 255 190 C 248 150, 235 135, 200 135 C 165 135, 152 150, 145 190 Z" fill="#090d16" />
  <!-- Warm Amber Edge Highlight from Spotlight -->
  <path d="M245 130 C 255 155, 255 185, 252 210" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" fill="none" />

  <!-- Left Eye open & looking through finder -->
  <ellipse cx="175" cy="190" rx="7" ry="4" fill="#ffffff" />
  <circle cx="175" cy="190" r="3.5" fill="#18181b" />
  <path d="M165 178 Q 175 174 185 178" stroke="#18181b" stroke-width="3" stroke-linecap="round" fill="none" />

  <!-- The Director's Hand holding the Viewfinder up to the Right Eye -->
  <!-- Hand & Wrist -->
  <path d="M250 310 Q 230 250 220 200" stroke="#a36640" stroke-width="26" stroke-linecap="round" fill="none" />
  <!-- Fingers wrapped around the barrel -->
  <ellipse cx="218" cy="190" rx="7" ry="12" fill="#b67a54" />
  <ellipse cx="224" cy="194" rx="6" ry="10" fill="#b67a54" />
  <ellipse cx="228" cy="200" rx="6" ry="9" fill="#b67a54" />

  <!-- Director's Optical Viewfinder Hardware (Metal Cylindrical Barrel & Lens) -->
  <g transform="translate(195, 170)">
    <!-- Eye Cup on Right Eye -->
    <rect x="-8" y="5" width="16" height="24" rx="8" fill="#18181b" stroke="#3f3f46" stroke-width="2" />
    
    <!-- Metal Barrel Body -->
    <rect x="8" y="0" width="48" height="34" rx="4" fill="#27272a" stroke="#71717a" stroke-width="1.5" />
    <!-- Focal ring ridges -->
    <line x1="20" y1="2" x2="20" y2="32" stroke="#e4e4e7" stroke-width="2" />
    <line x1="26" y1="2" x2="26" y2="32" stroke="#a1a1aa" stroke-width="1.5" />
    <line x1="32" y1="2" x2="32" y2="32" stroke="#a1a1aa" stroke-width="1.5" />
    <line x1="38" y1="2" x2="38" y2="32" stroke="#e4e4e7" stroke-width="2" />
    
    <!-- Viewfinder Front Lens with Blue Optical Glass Coating -->
    <ellipse cx="56" cy="17" rx="6" ry="16" fill="url(#lensGrad)" stroke="#38bdf8" stroke-width="1.5" />
    <ellipse cx="55" cy="14" rx="2" ry="6" fill="#ffffff" opacity="0.8" />
    
    <!-- Viewfinder Lanyard cord -->
    <path d="M24 34 Q 10 70 0 120" stroke="#f59e0b" stroke-width="2" fill="none" />
  </g>

  <!-- Cinema Camera Framing Overlay HUD -->
  <g opacity="0.6">
    <!-- Corner Framing brackets -->
    <path d="M30 60 H 60 M 30 60 V 90" stroke="#ffffff" stroke-width="2" fill="none" />
    <path d="M370 60 H 340 M 370 60 V 90" stroke="#ffffff" stroke-width="2" fill="none" />
    <path d="M30 420 H 60 M 30 420 V 390" stroke="#ffffff" stroke-width="2" fill="none" />
    <path d="M370 420 H 340 M 370 420 V 390" stroke="#ffffff" stroke-width="2" fill="none" />
    <!-- Crosshairs -->
    <line x1="200" y1="230" x2="200" y2="250" stroke="#ffffff" stroke-width="1" />
    <line x1="190" y1="240" x2="210" y2="240" stroke="#ffffff" stroke-width="1" />
  </g>

  <!-- Header metadata badge -->
  <g transform="translate(20, 20)">
    <rect width="168" height="24" rx="6" fill="#09090b" fill-opacity="0.9" stroke="#27272a" />
    <circle cx="14" cy="12" r="4" fill="#ef4444" />
    <text x="24" y="16" fill="#ffffff" font-family="system-ui, sans-serif" font-size="10" font-weight="600" letter-spacing="0.5">ON-SET DIRECTOR</text>
  </g>
  
  <!-- Production label -->
  <g transform="translate(240, 436)">
    <rect width="140" height="24" rx="6" fill="#09090b" fill-opacity="0.9" stroke="#27272a" />
    <text x="12" y="16" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="9" font-weight="700">CINEMA SOUNDSTAGE</text>
  </g>
</svg>
`;

/**
 * Clean, recognizable SVG illustration for Tanmay sitting in the director's chair on set
 * (Man_sitting_in_director_chair_20260924124105.jpeg)
 */
export const DIRECTOR_CHAIR_PORTRAIT_SVG = `
<svg viewBox="0 0 400 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
  <defs>
    <linearGradient id="studioWall" x1="0" y1="0" x2="400" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="70%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="chairWood" x1="100" y1="200" x2="300" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <radialGradient id="overheadLight" cx="200" cy="50" r="220" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="70%" stop-color="#0f172a" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Studio Floor & Stage Wall -->
  <rect width="400" height="480" fill="url(#studioWall)" />
  <circle cx="200" cy="140" r="220" fill="url(#overheadLight)" />
  <!-- Concrete Soundstage Floor line -->
  <line x1="0" y1="380" x2="400" y2="380" stroke="#334155" stroke-width="1.5" />
  
  <!-- Director's Chair - Back Frame & Canvas -->
  <!-- Wooden Backrest Uprights -->
  <rect x="105" y="140" width="12" height="240" rx="3" fill="#334155" stroke="#1e293b" />
  <rect x="283" y="140" width="12" height="240" rx="3" fill="#334155" stroke="#1e293b" />
  
  <!-- Black Canvas Backrest Banner with bold "DIRECTOR" print -->
  <rect x="115" y="155" width="170" height="70" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="2" />
  <text x="200" y="198" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="18" font-weight="900" letter-spacing="4" text-anchor="middle">
    DIRECTOR
  </text>
  <text x="200" y="214" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="8" font-weight="600" letter-spacing="2" text-anchor="middle">
    TANMAY AGRAWAL
  </text>

  <!-- Director Seated in Chair -->
  <!-- Torso & Shoulders -->
  <path d="M125 330 C 135 245, 160 225, 200 225 C 240 225, 265 245, 275 330 Z" fill="#1e293b" />
  
  <!-- Arms Resting on Chair Armrests -->
  <!-- Left Armrest -->
  <rect x="85" y="270" width="60" height="10" rx="3" fill="#475569" />
  <rect x="85" y="280" width="8" height="90" fill="#334155" />
  <!-- Right Armrest -->
  <rect x="255" y="270" width="60" height="10" rx="3" fill="#475569" />
  <rect x="307" y="280" width="8" height="90" fill="#334155" />

  <!-- Crossed Wooden Legs of Director's Chair below seat -->
  <line x1="110" y1="340" x2="285" y2="475" stroke="#475569" stroke-width="8" stroke-linecap="round" />
  <line x1="290" y1="340" x2="115" y2="475" stroke="#334155" stroke-width="8" stroke-linecap="round" />
  <circle cx="200" cy="407" r="6" fill="#cbd5e1" />

  <!-- Footrest bar -->
  <rect x="125" y="440" width="150" height="8" rx="2" fill="#475569" />

  <!-- Seated Legs in tailored dark trousers -->
  <path d="M140 330 L 155 450 L 195 450 L 180 330 Z" fill="#0f172a" />
  <path d="M220 330 L 205 450 L 245 450 L 260 330 Z" fill="#0f172a" />

  <!-- Arms resting relaxed -->
  <path d="M140 250 Q 110 270 100 270" stroke="#b67a54" stroke-width="14" stroke-linecap="round" fill="none" />
  <path d="M260 250 Q 290 270 300 270" stroke="#b67a54" stroke-width="14" stroke-linecap="round" fill="none" />

  <!-- Head & Confident Demeanor -->
  <ellipse cx="200" cy="140" rx="46" ry="56" fill="#b67a54" />
  
  <!-- Hair & Groomed Look -->
  <path d="M154 135 C 150 95, 170 75, 200 75 C 230 75, 250 95, 246 135 C 240 105, 225 90, 200 90 C 175 90, 160 105, 154 135 Z" fill="#020617" />
  
  <!-- Confident Eyes & Smile -->
  <circle cx="182" cy="132" r="3" fill="#0f172a" />
  <circle cx="218" cy="132" r="3" fill="#0f172a" />
  <path d="M188 162 Q 200 170 212 162" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />

  <!-- Studio Gaffer Tape & Slate on Floor -->
  <g transform="translate(40, 430)">
    <rect width="40" height="30" rx="3" fill="#090d16" stroke="#f8fafc" stroke-width="1" />
    <path d="M0 8 L 40 8" stroke="#ffffff" stroke-width="1" />
    <text x="20" y="24" fill="#38bdf8" font-family="monospace" font-size="7" font-weight="700" text-anchor="middle">SCENE 01</text>
  </g>

  <!-- Tag badge -->
  <g transform="translate(20, 20)">
    <rect width="144" height="24" rx="6" fill="#090d16" fill-opacity="0.9" stroke="#334155" />
    <circle cx="14" cy="12" r="4" fill="#10b981" />
    <text x="24" y="16" fill="#ffffff" font-family="system-ui, sans-serif" font-size="10" font-weight="600" letter-spacing="0.5">DIRECTOR’S CHAIR</text>
  </g>

  <!-- Soundstage watermark -->
  <g transform="translate(260, 436)">
    <rect width="120" height="24" rx="6" fill="#090d16" fill-opacity="0.9" stroke="#334155" />
    <text x="12" y="16" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="9" font-weight="700">STUDIO STAGE 4</text>
  </g>
</svg>
`;

/**
 * Helper to get the default SVG content for a given photo ID
 */
export function getPhotoSvg(id: 'executive' | 'onset' | 'chair'): string {
  switch (id) {
    case 'executive':
      return EXECUTIVE_PORTRAIT_SVG;
    case 'onset':
      return VIEW_FINDER_PORTRAIT_SVG;
    case 'chair':
      return DIRECTOR_CHAIR_PORTRAIT_SVG;
  }
}
