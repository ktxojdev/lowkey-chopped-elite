import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const mode = searchParams.get("mode") || "trending"; // 'trending' | 'best' | 'search'

  try {
    let targetUrl = "";
    if (search.trim()) {
      targetUrl = `https://myinstants-api.vercel.app/search?q=${encodeURIComponent(search.trim())}`;
    } else if (mode === "best") {
      targetUrl = `https://myinstants-api.vercel.app/best?q=us`;
    } else {
      targetUrl = `https://myinstants-api.vercel.app/trending?q=us`;
    }

    const res = await fetch(targetUrl, {
      headers: { "User-Agent": "LCE-Soundboard/1.0" },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      throw new Error(`MyInstants upstream error: ${res.statusText}`);
    }

    const data = await res.json();
    const sounds = Array.isArray(data.data) ? data.data : [];

    return NextResponse.json({
      success: true,
      sounds,
      total: sounds.length,
      source: "myinstants-api",
    });
  } catch (error: any) {
    console.error("MyInstants Proxy Error:", error);
    // Return curated high-energy fallback sounds if upstream has an outage
    return NextResponse.json({
      success: false,
      sounds: [
        {
          id: "vine-boom",
          title: "Vine Boom Bass Boost",
          mp3: "https://www.myinstants.com/media/sounds/vine-boom-bass-boost-sound-effect.mp3",
        },
        {
          id: "bruh",
          title: "BRUH Sound Effect",
          mp3: "https://www.myinstants.com/media/sounds/bruh-sound-effect_WstdzdM.mp3",
        },
        {
          id: "fah",
          title: "FAHHHHHHHHHHHHHH",
          mp3: "https://www.myinstants.com/media/sounds/fahhhhhhhhhhhhhh.mp3",
        },
        {
          id: "what-da-dog-doin",
          title: "What da dog doin?",
          mp3: "https://www.myinstants.com/media/sounds/what-the-dog-doing-vine.mp3",
        },
        {
          id: "bing-chilling",
          title: "Bing Chilling",
          mp3: "https://www.myinstants.com/media/sounds/bing-chilling_fcdGgUc.mp3",
        },
      ],
      total: 5,
      fallback: true,
    });
  }
}
