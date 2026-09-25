import { NextResponse } from "next/server";
import { CHANNEL_LOGOS } from "@/lib/channel-logos";

export interface LiveChannel {
  id: string;
  name: string;
  category: "News" | "Sports" | "Tech & Space" | "Entertainment" | "Music" | "Nature & Chill" | "Gaming";
  logo: string;
  streamUrl: string;
  embedType: "hls" | "youtube" | "iframe";
  currentShow: string;
  country: string;
  description: string;
}

const CHANNELS: LiveChannel[] = [
  // 1. TECH & SPACE (Verified, rock solid 24/7 streams)
  {
    id: "nasa-tv",
    name: "NASA TV HD",
    category: "Tech & Space",
    logo: CHANNEL_LOGOS.nasa,
    streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
    embedType: "hls",
    currentShow: "Live Earth Views from ISS & Space Missions",
    country: "US",
    description: "Official 24/7 NASA broadcast with live high-definition views from the International Space Station and Artemis mission preparations.",
  },
  {
    id: "spacex-live",
    name: "SpaceX Starbase Live",
    category: "Tech & Space",
    logo: CHANNEL_LOGOS.spacex,
    streamUrl: "https://www.youtube-nocookie.com/embed/mhJRzQsLZGg?autoplay=1",
    embedType: "youtube",
    currentShow: "Starship Orbital Launch Pad & Megabay",
    country: "US",
    description: "24/7 high-definition multi-cam tracking of the Starship orbital launch complex at Starbase in Boca Chica, Texas.",
  },

  // 2. NEWS & GLOBAL (Verified live streams)
  {
    id: "al-jazeera",
    name: "Al Jazeera English",
    category: "News",
    logo: CHANNEL_LOGOS.aljazeera,
    streamUrl: "https://www.youtube-nocookie.com/embed/bNyUyrR0PHo?autoplay=1",
    embedType: "youtube",
    currentShow: "Newshour Live & World Dispatches",
    country: "QA",
    description: "Independent global reporting from the Middle East, Americas, Europe, Africa, and Asia.",
  },
  {
    id: "dw-news",
    name: "DW News (Deutsche Welle)",
    category: "News",
    logo: CHANNEL_LOGOS.dw,
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    embedType: "hls",
    currentShow: "Journal Live: European Perspective",
    country: "DE",
    description: "Germany's international broadcaster providing independent world journalism and analysis.",
  },
  {
    id: "bloomberg-tv",
    name: "Bloomberg Financial",
    category: "News",
    logo: CHANNEL_LOGOS.bloomberg,
    streamUrl: "https://www.youtube-nocookie.com/embed/dp8PhLsUcFE?autoplay=1",
    embedType: "youtube",
    currentShow: "Global Market Pulse & Wall Street Live",
    country: "US",
    description: "Real-time stock ticker, macroeconomic analysis, central bank decisions, and global business intelligence.",
  },
  {
    id: "reuters-tv",
    name: "Reuters World News",
    category: "News",
    logo: CHANNEL_LOGOS.reuters,
    streamUrl: "https://amg00453-reuters-amg00453c1-rakuten-uk-2110.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-rakutenuk/playlist.m3u8",
    embedType: "hls",
    currentShow: "Reuters Global Wire & Market Recap",
    country: "US",
    description: "The trusted global news leader delivering unbiased financial data and geopolitical reporting.",
  },
  {
    id: "abc-news-live",
    name: "ABC News Live",
    category: "News",
    logo: CHANNEL_LOGOS.abcnews,
    streamUrl: "https://www.youtube-nocookie.com/embed/w_Ma8oQLmSM?autoplay=1",
    embedType: "youtube",
    currentShow: "ABC News Live Prime & World Headlines",
    country: "US",
    description: "Round-the-clock streaming news channel featuring in-depth reports and special investigations.",
  },
  {
    id: "nbc-news-now",
    name: "NBC News NOW",
    category: "News",
    logo: CHANNEL_LOGOS.nbcnews,
    streamUrl: "https://www.youtube-nocookie.com/embed/21X5lGlDOfg?autoplay=1",
    embedType: "youtube",
    currentShow: "Morning News NOW & Top Stories",
    country: "US",
    description: "NBC News round-the-clock live stream with live breaking coverage and investigative journalism.",
  },
  {
    id: "sky-news",
    name: "Sky News International",
    category: "News",
    logo: CHANNEL_LOGOS.skynews,
    streamUrl: "https://www.youtube-nocookie.com/embed/9Auq9mYxFEE?autoplay=1",
    embedType: "youtube",
    currentShow: "Sky World News Live & Breaking Reports",
    country: "UK",
    description: "Global breaking news, political debates, and round-the-clock international correspondent reports.",
  },

  // 3. SPORTS
  {
    id: "redbull-tv",
    name: "Red Bull TV Live",
    category: "Sports",
    logo: CHANNEL_LOGOS.redbull,
    streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    embedType: "hls",
    currentShow: "Red Bull Rampage & Extreme Action",
    country: "AT",
    description: "World-class downhill mountain biking, extreme motocross, surfing, and high-adrenaline action sports.",
  },

  // 4. GAMING & ENTERTAINMENT
  {
    id: "ign-gaming",
    name: "IGN Live",
    category: "Gaming",
    logo: CHANNEL_LOGOS.ign,
    streamUrl: "https://www.youtube-nocookie.com/embed/5qap5aO4i9A?autoplay=1",
    embedType: "youtube",
    currentShow: "IGN Daily Fix & Esports Highlights",
    country: "US",
    description: "Leading video game reviews, gameplay walkthroughs, trailers, and gaming entertainment.",
  },

  // 5. MUSIC & NATURE
  {
    id: "lofi-girl",
    name: "Lofi Girl 24/7 Radio",
    category: "Music",
    logo: CHANNEL_LOGOS.lofigirl,
    streamUrl: "https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1",
    embedType: "youtube",
    currentShow: "Beats to Relax / Study to",
    country: "FR",
    description: "The iconic round-the-clock chilled hip hop radio broadcast beloved by millions of listeners.",
  },
  {
    id: "synthwave-radio",
    name: "Lofi Synthwave 24/7",
    category: "Music",
    logo: CHANNEL_LOGOS.lofigirl,
    streamUrl: "https://www.youtube-nocookie.com/embed/4xDzrJKXOOY?autoplay=1",
    embedType: "youtube",
    currentShow: "Chill Synthwave Beats to Chill / Game to",
    country: "FR",
    description: "Retro-futuristic synthwave radio with ambient neon visuals for late-night gaming and coding.",
  },
  {
    id: "weather-nation",
    name: "WeatherNation TV",
    category: "Nature & Chill",
    logo: CHANNEL_LOGOS.weathernation,
    streamUrl: "https://weather-samsung.amagi.tv/playlist.m3u8",
    embedType: "hls",
    currentShow: "National Radar Live & Severe Alerts",
    country: "US",
    description: "Real-time satellite radar, meteorological forecasts, and severe storm tracking across North America.",
  },
  {
    id: "earth-relaxation",
    name: "Nature 4K Relaxation Live",
    category: "Nature & Chill",
    logo: CHANNEL_LOGOS.relaxnature,
    streamUrl: "https://www.youtube-nocookie.com/embed/lxRPbV0zL3k?autoplay=1",
    embedType: "youtube",
    currentShow: "Alpine Waterfalls & Forest Ambience in 4K",
    country: "INT",
    description: "Ultra high definition nature scenery, ambient natural soundscapes, and calming world vistas.",
  }
];

export async function GET() {
  const categories = Array.from(new Set(CHANNELS.map((c) => c.category)));
  return NextResponse.json({
    channels: CHANNELS,
    categories: ["All", ...categories],
  });
}
