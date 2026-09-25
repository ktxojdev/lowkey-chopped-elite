import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "movie";
  const id = searchParams.get("id");
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";
  const server = searchParams.get("server") || "cinesrc";
  const format = searchParams.get("format"); // 'json' | 'html'

  if (!id) {
    return NextResponse.json({ error: "Missing TMDB media ID" }, { status: 400 });
  }

  // Calculate provider targets
  let targetUrl = "";
  switch (server) {
    case "vidlink":
      targetUrl =
        type === "tv"
          ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
          : `https://vidlink.pro/movie/${id}`;
      break;
    case "vidsrc":
      targetUrl =
        type === "tv"
          ? `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`
          : `https://vidsrc.cc/v2/embed/movie/${id}`;
      break;
    case "autoembed":
      targetUrl =
        type === "tv"
          ? `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`
          : `https://autoembed.co/movie/tmdb/${id}`;
      break;
    case "multiembed":
      targetUrl = `https://multiembed.mov/?video_id=${id}&tmdb=1${
        type === "tv" ? `&s=${season}&e=${episode}` : ""
      }`;
      break;
    case "cinesrc":
    default:
      targetUrl =
        type === "tv"
          ? `https://cinesrc.st/embed/tv/${id}/${season}/${episode}`
          : `https://cinesrc.st/embed/movie/${id}`;
      break;
  }

  if (format === "json") {
    return NextResponse.json({
      success: true,
      provider: server,
      streamUrl: targetUrl,
      type,
      id,
      season,
      episode,
      servers: [
        { id: "cinesrc", name: "CineSrc (Fast HD)" },
        { id: "vidlink", name: "VidLink (Multi-Audio)" },
        { id: "vidsrc", name: "VidSrc v2" },
        { id: "autoembed", name: "AutoEmbed Stream" },
        { id: "multiembed", name: "MultiEmbed Mirror" },
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
    src="${targetUrl}" 
    allowfullscreen="true" 
    webkitallowfullscreen="true" 
    mozallowfullscreen="true"
    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; display-capture"
  ></iframe>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}
