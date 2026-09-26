import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const engine = searchParams.get("engine") || "piped";

  if (!id || !/^[a-zA-Z0-9_-]{10,12}$/.test(id)) {
    return new NextResponse("Invalid YouTube video ID", { status: 400 });
  }

  // Engine source mapping - completely unblocked independent mirrors (ZERO youtube.com)
  const engineMap: Record<string, string> = {
    piped: `https://piped.video/embed/${id}?autoplay=1`,
    yewtube: `https://yewtu.be/embed/${id}?autoplay=1`,
    nadeko: `https://inv.nadeko.net/embed/${id}?autoplay=1`,
    f5: `https://invidious.f5.si/embed/${id}?autoplay=1`,
  };

  const targetSrc = engineMap[engine] || engineMap.piped;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LCE Cinema Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #player-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #07050d; }
    iframe { width: 100%; height: 100%; border: none; }
    .floating-bar {
      position: absolute;
      top: 10px;
      right: 12px;
      z-index: 100;
      display: flex;
      gap: 6px;
      opacity: 0;
      transition: opacity 0.25s ease;
      background: rgba(18, 14, 36, 0.85);
      backdrop-filter: blur(12px);
      padding: 4px 8px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    #player-container:hover .floating-bar { opacity: 1; }
    .engine-btn {
      background: transparent;
      border: none;
      color: #a1a1aa;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .engine-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.1); }
    .engine-btn.active { color: #fff; background: #9333ea; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block; margin-right: 4px; }
  </style>
</head>
<body>
  <div id="player-container">
    <div class="floating-bar">
      <span style="font-size: 10px; color: #a1a1aa; display: flex; align-items: center; margin-right: 4px;">
        <span class="status-dot"></span> Engine:
      </span>
      <button class="engine-btn ${engine === 'piped' ? 'active' : ''}" onclick="switchEngine('piped')">Piped</button>
      <button class="engine-btn ${engine === 'yewtube' ? 'active' : ''}" onclick="switchEngine('yewtube')">YewTube</button>
      <button class="engine-btn ${engine === 'nadeko' ? 'active' : ''}" onclick="switchEngine('nadeko')">Nadeko</button>
      <button class="engine-btn ${engine === 'f5' ? 'active' : ''}" onclick="switchEngine('f5')">F5</button>
    </div>
    <iframe
      id="video-frame"
      src="${targetSrc}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>

  <script>
    function switchEngine(newEngine) {
      window.location.href = '/api/entertainment/youtube/embed?id=${id}&engine=' + newEngine;
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}
