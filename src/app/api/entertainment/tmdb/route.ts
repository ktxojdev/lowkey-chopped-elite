import { NextRequest, NextResponse } from "next/server";

const TMDB_READ_TOKEN =
  process.env.TMDB_READ_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTY5ODA2YjFkNzdhYjZkOGJkMTBmOTdiMDE4NDNjZSIsIm5iZiI6MTc4NjQ4Mjc4Ny4yNDg5OTk4LCJzdWIiOiI2YTdiOTA2MzFlNGFkYWQ1ZmJhZTBjNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HW7mSMgEq9hYhKSyNVNspwT--aZdcCrdUHA3d0ROn-0";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "trending";
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id");
  const mediaType = searchParams.get("mediaType") || "movie"; // 'movie' | 'tv'

  try {
    let endpoint = "";

    if (action === "search" && query) {
      endpoint = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`;
    } else if (action === "details" && id) {
      endpoint = `https://api.themoviedb.org/3/${mediaType}/${id}?append_to_response=videos,credits,similar&language=en-US`;
    } else if (action === "popular_movies") {
      endpoint = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
    } else if (action === "popular_tv") {
      endpoint = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1`;
    } else {
      // Default: trending movies and tv
      endpoint = `https://api.themoviedb.org/3/trending/all/day?language=en-US`;
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${TMDB_READ_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `TMDB API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch from TMDB", details: error.message },
      { status: 500 }
    );
  }
}
