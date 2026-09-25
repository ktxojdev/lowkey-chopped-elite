import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // MAL id
  const title = searchParams.get("title") || "Anime";
  const episode = searchParams.get("episode") || "1";
  const server = searchParams.get("server") || "2embed";

  if (!id) {
    return NextResponse.json({ error: "Missing anime ID" }, { status: 400 });
  }

  const cleanTitle = title.replace(/[^\w\s-]/g, "").trim();

  let targetUrl = "";
  switch (server) {
    case "autoembed":
      targetUrl = `https://autoembed.co/anime/${id}/${episode}`;
      break;
    case "vidsrc":
      targetUrl = `https://vidsrc.cc/v2/embed/anime/${encodeURIComponent(cleanTitle)}/${episode}`;
      break;
    case "multiembed":
      targetUrl = `https://multiembed.mov/?video_id=${id}&anime=1&e=${episode}`;
      break;
    case "2embed":
    default:
      targetUrl = `https://2embed.cc/embed/anime/${id}/${episode}`;
      break;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer">
  <title>LCE Anime Stream - ${cleanTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: #000; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe 
    id="anime-frame"
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
