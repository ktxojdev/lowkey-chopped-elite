import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "science fiction";
  const limit = searchParams.get("limit") || "24";

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query
    )}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,has_fulltext,ia,edition_count,subject`;

    const res = await fetch(url, {
      headers: { "User-Agent": "LCE-Books/1.0" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `OpenLibrary error: ${res.statusText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch books", details: err.message }, { status: 500 });
  }
}
