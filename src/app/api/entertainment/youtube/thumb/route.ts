import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !/^[a-zA-Z0-9_-]{10,12}$/.test(id)) {
      return new NextResponse("Invalid video id", { status: 400 });
    }

    // Try high quality first, then medium quality
    const qualities = ["hqdefault", "mqdefault", "default"];
    for (const q of qualities) {
      try {
        const imgRes = await fetch(`https://i.ytimg.com/vi/${id}/${q}.jpg`, {
          signal: AbortSignal.timeout(3500),
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
            },
          });
        }
      } catch {}
    }

    // Fallback SVG if image could not be retrieved
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" fill="#120e24">
      <rect width="480" height="360" fill="#120e24"/>
      <path d="M210 150 L270 180 L210 210 Z" fill="#a855f7"/>
      <text x="240" y="250" text-anchor="middle" fill="#71717a" font-family="system-ui" font-size="14">Video Thumbnail</text>
    </svg>`;

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse("Failed to fetch thumbnail", { status: 500 });
  }
}
