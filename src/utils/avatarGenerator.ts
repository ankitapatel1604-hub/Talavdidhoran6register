/**
 * Generates an SVG data URL for a student portrait in Gujarat school uniform
 * based on gender, skin tone variation, hair style, and glasses.
 */
export function generateStudentAvatar(seed: number, gender: 'boy' | 'girl', name: string): string {
  const boyHairStyles = [
    // neat side-part
    `<path d="M26 42 C26 24, 40 16, 64 16 C88 16, 102 24, 102 42 C102 32, 90 22, 64 22 C38 22, 26 32, 26 42 Z" fill="#1e1e24"/>`,
    // crop cut
    `<path d="M28 44 C28 20, 42 14, 64 14 C86 14, 100 20, 100 44 C96 28, 80 20, 64 20 C48 20, 32 28, 28 44 Z" fill="#111827"/>`,
    // spikes / combed back
    `<path d="M26 42 C24 22, 45 12, 64 12 C83 12, 104 22, 102 42 C92 26, 78 18, 64 18 C50 18, 36 26, 26 42 Z" fill="#1f2937"/>`
  ];

  const girlHairStyles = [
    // Two plaits / ribbons (typical Gujarat primary school uniform style)
    `<path d="M24 45 C24 20, 42 14, 64 14 C86 14, 104 20, 104 45 C108 65, 106 82, 108 95 C106 97, 100 97, 100 90 C100 75, 102 55, 100 46 C94 26, 80 20, 64 20 C48 20, 34 26, 28 46 C26 55, 28 75, 28 90 C28 97, 22 97, 20 95 C22 82, 20 65, 24 45 Z" fill="#111827"/>
     <circle cx="24" cy="88" r="4" fill="#dc2626"/>
     <circle cx="104" cy="88" r="4" fill="#dc2626"/>`,
    // Ponytail with hairband
    `<path d="M26 45 C26 22, 42 15, 64 15 C86 15, 102 22, 102 45 C98 30, 82 22, 64 22 C46 22, 30 30, 26 45 Z" fill="#111827"/>
     <path d="M26 38 C40 28, 88 28, 102 38" stroke="#dc2626" stroke-width="4" fill="none" stroke-linecap="round"/>
     <path d="M96 42 C108 48, 114 62, 112 78 C110 82, 104 80, 102 75 C104 64, 100 52, 94 45 Z" fill="#111827"/>`,
    // Neat bob/school cut
    `<path d="M24 48 C24 20, 42 14, 64 14 C86 14, 104 20, 104 48 C104 68, 100 78, 96 82 C94 80, 92 68, 96 52 C94 28, 80 20, 64 20 C48 20, 34 28, 32 52 C36 68, 34 80, 32 82 C28 78, 24 68, 24 48 Z" fill="#1f2937"/>
     <circle cx="34" cy="38" r="3" fill="#2563eb"/>`
  ];

  const skinTones = ['#e0a97c', '#d69666', '#c68453', '#f0bf93', '#bc7a49'];
  const backgroundTones = [
    ['#e0f2fe', '#bae6fd'], // light sky
    ['#dcfce7', '#bbf7d0'], // mint
    ['#fef3c7', '#fde68a'], // warm sand
    ['#f3e8ff', '#e9d5ff'], // lavender
    ['#ffedd5', '#fed7aa'], // peach
  ];

  const skin = skinTones[seed % skinTones.length];
  const bg = backgroundTones[seed % backgroundTones.length];
  const hair = gender === 'boy'
    ? boyHairStyles[seed % boyHairStyles.length]
    : girlHairStyles[seed % girlHairStyles.length];

  // Primary school uniform: White/Sky shirt with collar & navy necktie or pinafore
  const uniformColor = seed % 2 === 0 ? '#1d4ed8' : '#047857'; // navy or dark green collar
  const shirtColor = '#ffffff';

  const initial = name.trim().charAt(0) || 'વિ';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
    <defs>
      <linearGradient id="bg-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg[0]}"/>
        <stop offset="100%" stop-color="${bg[1]}"/>
      </linearGradient>
    </defs>
    <!-- Background Circle -->
    <circle cx="64" cy="64" r="64" fill="url(#bg-${seed})"/>
    
    <!-- Body & School Uniform -->
    <path d="M22 128 C22 102, 42 94, 64 94 C86 94, 106 102, 106 128 Z" fill="${shirtColor}"/>
    <!-- Collar & Necktie -->
    <path d="M48 94 L64 116 L80 94" fill="none" stroke="${uniformColor}" stroke-width="4"/>
    <polygon points="61,96 67,96 69,114 64,124 59,114" fill="${uniformColor}"/>
    
    <!-- Neck -->
    <rect x="54" y="78" width="20" height="20" rx="4" fill="${skin}"/>
    
    <!-- Ears -->
    <circle cx="34" cy="58" r="8" fill="${skin}"/>
    <circle cx="94" cy="58" r="8" fill="${skin}"/>
    ${gender === 'girl' ? `<circle cx="34" cy="64" r="2.5" fill="#f59e0b"/><circle cx="94" cy="64" r="2.5" fill="#f59e0b"/>` : ''}

    <!-- Face Base -->
    <ellipse cx="64" cy="56" rx="28" ry="32" fill="${skin}"/>
    
    <!-- Cheeks -->
    <ellipse cx="46" cy="64" rx="4" ry="2.5" fill="#e11d48" opacity="0.25"/>
    <ellipse cx="82" cy="64" rx="4" ry="2.5" fill="#e11d48" opacity="0.25"/>
    
    <!-- Eyes -->
    <circle cx="50" cy="54" r="3.5" fill="#111827"/>
    <circle cx="78" cy="54" r="3.5" fill="#111827"/>
    <!-- Eye highlights -->
    <circle cx="51.5" cy="52.5" r="1.2" fill="#ffffff"/>
    <circle cx="79.5" cy="52.5" r="1.2" fill="#ffffff"/>
    
    <!-- Eyebrows -->
    <path d="M44 47 Q51 45 57 47" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M71 47 Q77 45 84 47" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/>
    
    <!-- Nose -->
    <path d="M63 56 Q64 62 66 62" stroke="#9a5a30" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    
    <!-- Friendly Smile -->
    <path d="M54 68 Q64 76 74 68" stroke="#78350f" stroke-width="2.4" fill="none" stroke-linecap="round"/>

    <!-- Gujarati Chandlo/Tilak or Bindi if girl -->
    ${gender === 'girl' ? `<circle cx="64" cy="46" r="1.8" fill="#dc2626"/>` : ''}

    <!-- Hair -->
    ${hair}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
