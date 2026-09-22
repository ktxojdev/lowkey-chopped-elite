import { NextRequest, NextResponse } from "next/server";

const POPULAR_FALLBACK = [
  {
    mal_id: 52991,
    title: "Sousou no Frieren",
    title_english: "Frieren: Beyond Journey's End",
    images: {
      webp: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
      },
    },
    score: 9.26,
    episodes: 28,
    synopsis: "During their decade-long quest to defeat the Demon King, the members of the hero's party—Himmel himself, the priest Heiter, the dwarf warrior Eisen, and the elven mage Frieren—forge bonds through adventures and battles, creating unforgettable precious memories for most of them.",
    year: 2023,
  },
  {
    mal_id: 5114,
    title: "Fullmetal Alchemist: Brotherhood",
    title_english: "Fullmetal Alchemist: Brotherhood",
    images: {
      webp: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
      },
    },
    score: 9.10,
    episodes: 64,
    synopsis: "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. Ignoring the alchemical principle of equivalent exchange, the boys attempted the forbidden act of human transmutation.",
    year: 2009,
  },
  {
    mal_id: 9253,
    title: "Steins;Gate",
    title_english: "Steins;Gate",
    images: {
      webp: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg",
      },
    },
    score: 9.07,
    episodes: 24,
    synopsis: "Self-proclaimed mad scientist Rintarou Okabe rents out a room in a rickety old building in Akihabara, where he indulges in his hobby of inventing prospective future gadgets with fellow lab members.",
    year: 2011,
  },
  {
    mal_id: 38000,
    title: "Kimetsu no Yaiba",
    title_english: "Demon Slayer: Kimetsu no Yaiba",
    images: {
      webp: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
      },
    },
    score: 8.48,
    episodes: 26,
    synopsis: "Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life.",
    year: 2019,
  },
  {
    mal_id: 40748,
    title: "Jujutsu Kaisen",
    title_english: "Jujutsu Kaisen",
    images: {
      webp: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
      },
    },
    score: 8.60,
    episodes: 24,
    synopsis: "Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital, where he visits his bedridden grandfather.",
    year: 2020,
  },
  {
    mal_id: 16498,
    title: "Shingeki no Kyojin",
    title_english: "Attack on Titan",
    images: {
      webp: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
      },
    },
    score: 8.55,
    episodes: 25,
    synopsis: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls.",
    year: 2013,
  },
];

let memoryAnimeCache: any = null;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "top";
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id");

  try {
    let url = "";
    if (action === "search" && query) {
      url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24&sfw=true`;
    } else if (action === "details" && id) {
      url = `https://api.jikan.moe/v4/anime/${id}/full`;
    } else {
      url = `https://api.jikan.moe/v4/top/anime?limit=24&filter=bypopularity`;
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "LCE-Entertainment/1.0" },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = await res.json();
      if (action === "top" && data.data?.length) {
        memoryAnimeCache = data;
      }
      return NextResponse.json(data);
    }

    // Fallback if upstream times out
    if (memoryAnimeCache) {
      return NextResponse.json(memoryAnimeCache);
    }

    return NextResponse.json({ data: POPULAR_FALLBACK, source: "fallback" });
  } catch {
    if (memoryAnimeCache) {
      return NextResponse.json(memoryAnimeCache);
    }
    return NextResponse.json({ data: POPULAR_FALLBACK, source: "fallback" });
  }
}
