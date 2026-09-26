import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'cover' | 'lib' | 'calculra' | 'img_remote' | 'gn'
  const file = searchParams.get("file");
  const game = searchParams.get("game");
  const path = searchParams.get("path");
  const remoteUrl = searchParams.get("url");
  const id = searchParams.get("id");

  try {
    // 1. Cover / Image
    if (type === "cover" && file) {
      const sanitized = file.replace(/(\.\.[\/\\])+/g, "").replace(/^\/+/, "");
      const cdnUrl = `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahGames@main/public/${sanitized}`;
      const rawUrl = `https://raw.githubusercontent.com/PeteZah-Games/PeteZahGames/main/public/${sanitized}`;

      let res = await fetch(cdnUrl, {
        headers: { "User-Agent": "LCE-Games/1.0" },
      });

      if (!res.ok) {
        res = await fetch(rawUrl, {
          headers: { "User-Agent": "LCE-Games/1.0" },
        });
      }

      if (!res.ok) {
        // Fallback default game placeholder
        return NextResponse.redirect(
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
        );
      }

      const contentType = res.headers.get("content-type") || "image/jpeg";
      const buffer = await res.arrayBuffer();

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=604800, s-maxage=604800, immutable",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 2. Remote Image
    if (type === "img_remote" && remoteUrl) {
      const res = await fetch(remoteUrl, {
        headers: { "User-Agent": "LCE-Games/1.0" },
      });
      if (!res.ok) {
        return NextResponse.redirect(
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
        );
      }
      const contentType = res.headers.get("content-type") || "image/png";
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=604800, s-maxage=604800",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 3. Games-Lib (Self-hosted GitHub library games)
    if (type === "lib" && game) {
      const sanitizedGame = game.replace(/(\.\.[\/\\])+/g, "").replace(/^\/+/, "");
      const cdnUrl = `https://cdn.jsdelivr.net/gh/PeteZah-Games/Games-lib@main/${sanitizedGame}/index.html`;
      const rawUrl = `https://raw.githubusercontent.com/PeteZah-Games/Games-lib@main/${sanitizedGame}/index.html`;

      let res = await fetch(cdnUrl, {
        headers: { "User-Agent": "LCE-Games/1.0" },
      });

      if (!res.ok) {
        res = await fetch(rawUrl, {
          headers: { "User-Agent": "LCE-Games/1.0" },
        });
      }

      if (!res.ok) {
        return new NextResponse(`Game "${sanitizedGame}" not found in library.`, {
          status: 404,
          headers: { "Content-Type": "text/plain" },
        });
      }

      let html = await res.text();
      const baseHref = `https://cdn.jsdelivr.net/gh/PeteZah-Games/Games-lib@main/${sanitizedGame}/`;

      // Clean trackers, gtag, ads, and petezah branding
      html = cleanGameHtml(html, baseHref);

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          "Access-Control-Allow-Origin": "*",
          "X-Frame-Options": "ALLOWALL",
        },
      });
    }

    // 4. Calculra store games
    if (type === "calculra" && path) {
      const sanitizedPath = path.replace(/(\.\.[\/\\])+/g, "").replace(/^\/+/, "");
      const targetUrl = `https://slnt.calculra.store/resources/semag/${sanitizedPath}`;

      const res = await fetch(targetUrl, {
        headers: { "User-Agent": "LCE-Games/1.0" },
      });

      if (!res.ok) {
        return new NextResponse(`Game asset not found: ${sanitizedPath}`, {
          status: res.status,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const contentType = res.headers.get("content-type") || "text/html; charset=utf-8";

      // If HTML, sanitize and inject base tag
      if (contentType.includes("text/html")) {
        let html = await res.text();
        const baseDir = sanitizedPath.substring(0, sanitizedPath.lastIndexOf("/"));
        const baseHref = `https://slnt.calculra.store/resources/semag/${baseDir}/`;

        html = cleanGameHtml(html, baseHref);

        return new NextResponse(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
            "Access-Control-Allow-Origin": "*",
            "X-Frame-Options": "ALLOWALL",
          },
        });
      } else {
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    // 5. GN game by ID
    if (type === "gn" && id) {
      const targetUrl = `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahGames@main/public/storage/ag/gn/${id}.html`;
      const res = await fetch(targetUrl, {
        headers: { "User-Agent": "LCE-Games/1.0" },
      });

      if (!res.ok) {
        return new NextResponse(`Game ${id} not found.`, { status: 404 });
      }

      let html = await res.text();
      const baseHref = `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahGames@main/public/storage/ag/gn/`;
      html = cleanGameHtml(html, baseHref);

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          "Access-Control-Allow-Origin": "*",
          "X-Frame-Options": "ALLOWALL",
        },
      });
    }

    return new NextResponse("Invalid proxy parameters", { status: 400 });
  } catch (err: any) {
    console.error("Game proxy error:", err);
    return new NextResponse(`Proxy error: ${err.message}`, { status: 500 });
  }
}

function cleanGameHtml(html: string, baseHref: string): string {
  // Strip Google Tag Manager & gtag
  let cleaned = html
    .replace(/<script[^>]*googletagmanager[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script[^>]*>\s*window\.dataLayer[\s\S]*?<\/script>/gi, "")
    .replace(/https?:\/\/www\.googletagmanager\.com[^\s"']+/gi, "")
    .replace(/G-[A-Z0-9]{6,12}/g, "");

  // Strip PeteZah brandings or banner elements if present
  cleaned = cleaned
    .replace(/petezahgames\.com/gi, "")
    .replace(/PeteZah\s*Games?/gi, "Games");

  // Inject <base> tag to ensure all relative scripts, wasm, and images resolve to baseHref
  if (cleaned.includes("<head>")) {
    cleaned = cleaned.replace("<head>", `<head>\n<base href="${baseHref}">`);
  } else if (cleaned.includes("<HEAD>")) {
    cleaned = cleaned.replace("<HEAD>", `<HEAD>\n<base href="${baseHref}">`);
  } else {
    cleaned = `<base href="${baseHref}">\n` + cleaned;
  }

  return cleaned;
}
