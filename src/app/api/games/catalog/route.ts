import { NextResponse } from "next/server";

interface RawGame {
  id: number;
  name: string;
  cover: string;
  url: string;
  author?: string;
  authorLink?: string;
}

export interface GameItem {
  id: number;
  title: string;
  cover: string;
  playUrl: string;
  author?: string;
  authorLink?: string;
  category?: string;
}

let cachedGames: GameItem[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (cachedGames && now - lastFetch < CACHE_TTL) {
      return NextResponse.json({ games: cachedGames, cached: true });
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/gn-math/assets/main/zones.json",
      {
        next: { revalidate: 900 },
        headers: {
          "User-Agent": "LCE-Games-Hub/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.statusText}`);
    }

    const rawList: RawGame[] = await response.json();

    // Clean, filter, and normalize
    const normalized: GameItem[] = rawList
      .filter((g) => g.id >= 0 && g.name && !g.name.includes("[!]"))
      .map((g) => {
        // Extract raw filenames
        const coverFilename = g.cover.replace("{COVER_URL}/", "").trim();
        const htmlFilename = g.url.replace("{HTML_URL}/", "").trim();

        const isDirectUrl = g.url.startsWith("http://") || g.url.startsWith("https://");

        return {
          id: g.id,
          title: g.name,
          cover: `/api/games/proxy?type=cover&file=${encodeURIComponent(coverFilename)}`,
          playUrl: isDirectUrl
            ? g.url
            : `/api/games/proxy?type=html&file=${encodeURIComponent(htmlFilename)}`,
          author: g.author || "Community",
          authorLink: g.authorLink,
          category: categorizeGame(g.name),
        };
      });

    cachedGames = normalized;
    lastFetch = now;

    return NextResponse.json({ games: normalized, total: normalized.length });
  } catch (error: any) {
    console.error("Games catalog fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load games catalog", details: error.message },
      { status: 500 }
    );
  }
}

function categorizeGame(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("moto") || n.includes("car") || n.includes("drift") || n.includes("race")) return "Racing";
  if (n.includes("craft") || n.includes("block") || n.includes("mine") || n.includes("build")) return "Sandbox";
  if (n.includes("run") || n.includes("jump") || n.includes("dash") || n.includes("ovo") || n.includes("vex")) return "Platformer";
  if (n.includes("chess") || n.includes("puzzle") || n.includes("2048") || n.includes("word") || n.includes("math")) return "Puzzle";
  if (n.includes("shoot") || n.includes("sniper") || n.includes("battle") || n.includes("war")) return "Action";
  return "Arcade";
}
