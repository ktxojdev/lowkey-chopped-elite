import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "movie";
  const id = searchParams.get("id");
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";
  const format = searchParams.get("format"); // 'json' | 'html'

  if (!id) {
    return NextResponse.json({ error: "Missing TMDB media ID" }, { status: 400 });
  }

  // Primary stream target on cinesrc.st
  const streamUrl =
    type === "tv"
      ? `https://cinesrc.st/embed/tv/${id}/${season}/${episode}`
      : `https://cinesrc.st/embed/movie/${id}`;

  if (format === "json") {
    return NextResponse.json({
      success: true,
      provider: "Cinesrc",
      streamUrl,
      type,
      id,
      season,
      episode,
      fallbacks: [
        `https://vidsrc.to/embed/${type}/${id}${type === "tv" ? `/${season}/${episode}` : ""}`,
        `https://multiembed.mov/?video_id=${id}&tmdb=1${type === "tv" ? `&s=${season}&e=${episode}` : ""}`,
      ],
    });
  }

  // Proxy embed HTML with no-referrer and fullscreen permissions
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer">
  <title>LCE Stream Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: #000; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe 
    id="stream-frame"
    src="${streamUrl}" 
    allowfullscreen="true" 
    webkitallowfullscreen="true" 
    mozallowfullscreen="true"
    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
  ></iframe>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}
