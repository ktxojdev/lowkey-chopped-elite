import { NextResponse } from "next/server";

export interface LiveChannel {
  id: string;
  name: string;
  category: string;
  logo: string;
  streamUrl: string;
  currentShow: string;
  description: string;
}

const CHANNELS: LiveChannel[] = [
  {
    id: "nasa-tv",
    name: "NASA TV HD",
    category: "Science & Space",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
    streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
    currentShow: "Live Earth Views from ISS & Deep Space Exploration",
    description: "24/7 official NASA broadcast and space coverage.",
  },
  {
    id: "bloomberg",
    name: "Bloomberg Quicktake",
    category: "News & Markets",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80",
    streamUrl: "https://bloomberg.com",
    currentShow: "Global Market Pulse & Tech Trends",
    description: "Financial news, business analytics, and global market updates.",
  },
  {
    id: "redbull-tv",
    name: "Red Bull TV",
    category: "Action Sports",
    logo: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80",
    streamUrl: "https://www.redbull.com/us-en/live-events",
    currentShow: "Downhill Extreme & Motor Racing Highlights",
    description: "Live action sports, downhill racing, and extreme documentary films.",
  },
  {
    id: "france24",
    name: "France 24 English",
    category: "World News",
    logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80",
    streamUrl: "https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8",
    currentShow: "International Headlines & In-depth Reporting",
    description: "International breaking news and analysis from around the globe.",
  },
  {
    id: "retro-gaming",
    name: "Speedrun & Esports Live",
    category: "Gaming",
    logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80",
    streamUrl: "https://twitch.tv",
    currentShow: "World Record Marathon & Competitive Highlights",
    description: "Top speedruns, tournaments, and retro game marathons.",
  },
  {
    id: "relax-nature",
    name: "EarthCam Nature & Wildlife",
    category: "Nature",
    logo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    streamUrl: "https://earthcam.com",
    currentShow: "Coral Reefs & Oceanic Marine Sanctuary",
    description: "Live relaxing wildlife cameras from around planet Earth.",
  },
];

export async function GET() {
  return NextResponse.json({
    channels: CHANNELS,
    total: CHANNELS.length,
    updatedAt: new Date().toISOString(),
  });
}
