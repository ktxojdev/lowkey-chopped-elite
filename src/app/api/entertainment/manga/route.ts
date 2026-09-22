import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "popular";
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id");

  try {
    if (action === "chapters" && id) {
      const res = await fetch(
        `https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=50`,
        { headers: { "User-Agent": "LCE-Manga/1.0" } }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    let url = "";
    if (action === "search" && query) {
      url = `https://api.mangadex.org/manga?title=${encodeURIComponent(
        query
      )}&limit=24&includes[]=cover_art&includes[]=author&contentRating[]=safe&contentRating[]=suggestive`;
    } else {
      url = `https://api.mangadex.org/manga?limit=24&order[followedCount]=desc&includes[]=cover_art&includes[]=author&contentRating[]=safe&contentRating[]=suggestive`;
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "LCE-Manga/1.0" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `MangaDex error: ${res.statusText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch manga", details: err.message }, { status: 500 });
  }
}
