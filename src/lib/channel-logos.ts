// High-fidelity SVG Data URI logos for Live TV Channels
// Guaranteed to load instantly with zero external network requests, zero rate-limits, and zero broken links

function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const CHANNEL_LOGOS = {
  nasa: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#0B3D91" stroke="#ffffff" stroke-width="2"/>
      <path d="M15 50 Q 50 15 85 50 Q 50 85 15 50" fill="none" stroke="#E03C31" stroke-width="5"/>
      <circle cx="35" cy="30" r="2.5" fill="#ffffff"/>
      <circle cx="68" cy="25" r="2" fill="#ffffff"/>
      <circle cx="75" cy="65" r="1.5" fill="#ffffff"/>
      <circle cx="28" cy="70" r="2" fill="#ffffff"/>
      <text x="50" y="56" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle" letter-spacing="1">NASA</text>
    </svg>
  `),

  spacex: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#0a0a0c" stroke="#222" stroke-width="2"/>
      <text x="50" y="55" font-family="'Geist', system-ui, sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle" letter-spacing="2">SPACE</text>
      <path d="M72 43 C 78 40, 85 48, 88 54 C 84 52, 78 51, 74 53" fill="none" stroke="#0070f3" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="72" r="3" fill="#0070f3"/>
    </svg>
  `),

  aljazeera: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#0F172A" stroke="#E38800" stroke-width="2"/>
      <circle cx="50" cy="40" r="18" fill="none" stroke="#E38800" stroke-width="4"/>
      <path d="M50 25 C 45 35, 55 45, 50 55" fill="none" stroke="#E38800" stroke-width="3"/>
      <text x="50" y="74" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#E38800" text-anchor="middle" letter-spacing="0.5">AL JAZEERA</text>
    </svg>
  `),

  bloomberg: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#18181b" stroke="#333" stroke-width="2"/>
      <text x="50" y="46" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">Bloomberg</text>
      <rect x="25" y="56" width="50" height="14" rx="4" fill="#00A3E0"/>
      <text x="50" y="66" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">TELEVISION</text>
    </svg>
  `),

  reuters: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#1e1e24" stroke="#ff8000" stroke-width="1.5"/>
      <circle cx="36" cy="38" r="4" fill="#ff8000"/>
      <circle cx="50" cy="33" r="4" fill="#ff8000"/>
      <circle cx="64" cy="38" r="4" fill="#ff8000"/>
      <circle cx="64" cy="52" r="4" fill="#ff8000"/>
      <circle cx="50" cy="57" r="4" fill="#ff8000"/>
      <circle cx="36" cy="52" r="4" fill="#ff8000"/>
      <circle cx="50" cy="45" r="3.5" fill="#ffffff"/>
      <text x="50" y="76" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">REUTERS</text>
    </svg>
  `),

  skynews: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#d61a21" stroke="#ff4d4f" stroke-width="2"/>
      <text x="50" y="47" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">sky</text>
      <text x="50" y="68" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="1">NEWS</text>
    </svg>
  `),

  dw: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#002D5A" stroke="#005A9E" stroke-width="2"/>
      <text x="50" y="56" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">DW</text>
      <text x="50" y="74" font-family="system-ui, sans-serif" font-weight="700" font-size="8" fill="#00A3E0" text-anchor="middle" letter-spacing="1">NEWS</text>
    </svg>
  `),

  abcnews: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#111111" stroke="#f59e0b" stroke-width="3"/>
      <text x="50" y="47" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">abc</text>
      <rect x="26" y="55" width="48" height="13" rx="3" fill="#f59e0b"/>
      <text x="50" y="65" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#000000" text-anchor="middle">NEWS</text>
    </svg>
  `),

  nbcnews: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#0b0f19" stroke="#3b82f6" stroke-width="2"/>
      <path d="M50 20 L58 35 L50 42 L42 35 Z" fill="#eab308"/>
      <path d="M58 35 L70 42 L64 50 L52 44 Z" fill="#ec4899"/>
      <path d="M42 35 L30 42 L36 50 L48 44 Z" fill="#3b82f6"/>
      <text x="50" y="68" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#ffffff" text-anchor="middle">NBC NEWS</text>
      <text x="50" y="80" font-family="system-ui, sans-serif" font-weight="800" font-size="8" fill="#eab308" text-anchor="middle">NOW</text>
    </svg>
  `),

  redbull: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#001844" stroke="#e11d48" stroke-width="2"/>
      <circle cx="50" cy="42" r="16" fill="#F59E0B"/>
      <path d="M35 48 C 42 40, 58 40, 65 48" fill="none" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>
      <text x="50" y="70" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">RedBull</text>
      <text x="50" y="82" font-family="system-ui, sans-serif" font-weight="900" font-size="8" fill="#F59E0B" text-anchor="middle" letter-spacing="2">TV</text>
    </svg>
  `),

  ign: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#BF1313" stroke="#ff4d4f" stroke-width="2"/>
      <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle" letter-spacing="1">IGN</text>
      <text x="50" y="76" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#fecaca" text-anchor="middle" letter-spacing="2">LIVE</text>
    </svg>
  `),

  lofigirl: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#2E1B4E" stroke="#c084fc" stroke-width="2"/>
      <circle cx="50" cy="42" r="16" fill="#a855f7" opacity="0.4"/>
      <path d="M36 44 C 36 32, 64 32, 64 44" fill="none" stroke="#e9d5ff" stroke-width="4" stroke-linecap="round"/>
      <rect x="32" y="42" width="8" height="14" rx="3" fill="#e9d5ff"/>
      <rect x="60" y="42" width="8" height="14" rx="3" fill="#e9d5ff"/>
      <text x="50" y="72" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">LOFI GIRL</text>
      <text x="50" y="83" font-family="system-ui, sans-serif" font-weight="700" font-size="8" fill="#c084fc" text-anchor="middle">24/7 RADIO</text>
    </svg>
  `),

  weathernation: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="42" cy="38" r="10" fill="#facc15"/>
      <ellipse cx="58" cy="46" rx="16" ry="10" fill="#ffffff"/>
      <ellipse cx="46" cy="48" rx="10" ry="8" fill="#e0f2fe"/>
      <text x="50" y="73" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">WEATHER</text>
      <text x="50" y="83" font-family="system-ui, sans-serif" font-weight="700" font-size="8" fill="#bae6fd" text-anchor="middle">NATION</text>
    </svg>
  `),

  relaxnature: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
      <path d="M50 20 L68 55 L32 55 Z" fill="#10b981"/>
      <path d="M50 35 L74 72 L26 72 Z" fill="#059669"/>
      <rect x="47" y="72" width="6" height="12" fill="#d97706"/>
      <circle cx="75" cy="28" r="8" fill="#fef08a"/>
    </svg>
  `)
};
