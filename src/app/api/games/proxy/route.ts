import { NextRequest, NextResponse } from "next/server";

const SLUG_ALIASES: Record<string, string> = {
  precision: "mc",
  fakefortnight: "1v1lol",
  geforce: "1v1lol",
  fortnite: "1v1lol",
  retrobowl: "retro-bowl",
  cookieclicker: "cookie-clicker",
  csgoclicker: "csgo-clicker",
  basketrandom: "basket-random",
  driftb: "drift-boss",
  dr3d: "death-run-3d",
  infinitec: "infinitecraft",
  zombiea: "zombocalypse",
  awesometanks2: "awesometanks2",
  "ragdoll-archers": "ragdoll-archers",
  "superstarcar": "superstarcar",
  "clash-royale": "clash-royale",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'cover' | 'lib' | 'calculra' | 'img_remote' | 'gn'
  const file = searchParams.get("file");
  const game = searchParams.get("game");
  const path = searchParams.get("path");
  const remoteUrl = searchParams.get("url");
  const id = searchParams.get("id");

  try {
    // 1. Cover Image
    if (type === "cover" && file) {
      const sanitized = file.replace(/(\.\.[\/\\])+/g, "").replace(/^\/+/, "");
      
      const candidateCovers = [
        `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahGames@main/public/${sanitized}`,
        `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahStatic@main/${sanitized}`,
        `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahNext@main/public/${sanitized}`,
        `https://raw.githubusercontent.com/PeteZah-Games/PeteZahGames/main/public/${sanitized}`,
      ];

      for (const url of candidateCovers) {
        try {
          const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (res.ok) {
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
        } catch {}
      }

      // Fallback default image
      return NextResponse.redirect(
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
      );
    }

    // 2. Remote Image
    if (type === "img_remote" && remoteUrl) {
      try {
        const res = await fetch(remoteUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (res.ok) {
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
      } catch {}
      return NextResponse.redirect(
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
      );
    }

    // 3. Lib Games (Unified Multi-Repository Resolver)
    if (type === "lib" && game) {
      let target = game.toLowerCase().trim().replace(/(\.\.[\/\\])+/g, "").replace(/^\/+/, "");
      if (SLUG_ALIASES[target]) {
        target = SLUG_ALIASES[target];
      }

      const sources = [
        {
          url: `https://cdn.jsdelivr.net/gh/PeteZah-Games/Games-lib@main/${target}/index.html`,
          base: `https://cdn.jsdelivr.net/gh/PeteZah-Games/Games-lib@main/${target}/`,
        },
        {
          url: `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahStatic@main/storage/ag/g/${target}/index.html`,
          base: `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahStatic@main/storage/ag/g/${target}/`,
        },
        {
          url: `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahNext@main/public/storage/ag/g/${target}/index.html`,
          base: `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahNext@main/public/storage/ag/g/${target}/`,
        },
        {
          url: `https://slnt.calculra.store/resources/semag/${target}/index.html`,
          base: `https://slnt.calculra.store/resources/semag/${target}/`,
        },
        {
          url: `https://raw.githubusercontent.com/PeteZah-Games/Games-lib/main/${target}/index.html`,
          base: `https://raw.githubusercontent.com/PeteZah-Games/Games-lib/main/${target}/`,
        },
      ];

      for (const src of sources) {
        try {
          const res = await fetch(src.url, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (res.ok) {
            let html = await res.text();
            html = cleanGameHtml(html, src.base);
            return new NextResponse(html, {
              headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
                "Access-Control-Allow-Origin": "*",
                "X-Frame-Options": "ALLOWALL",
              },
            });
          }
        } catch {}
      }

      return new NextResponse(`Game "${target}" could not be located in libraries.`, {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // 4. Calculra Store Games (with Fallback to Libs)
    if (type === "calculra" && path) {
      const sanitizedPath = path.replace(/(\.\.[\/\\])+/g, "").replace(/^\/+/, "");
      const primaryUrl = `https://slnt.calculra.store/resources/semag/${sanitizedPath}`;

      let res = await fetch(primaryUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
      }).catch(() => null);

      if (res && res.ok) {
        const contentType = res.headers.get("content-type") || "text/html; charset=utf-8";
        if (contentType.includes("text/html")) {
          let html = await res.text();
          const baseDir = sanitizedPath.includes("/")
            ? sanitizedPath.substring(0, sanitizedPath.lastIndexOf("/"))
            : sanitizedPath;
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

      // If primary failed, try falling back to Games-lib
      const slug = sanitizedPath.split("/")[0];
      const fallbackUrl = `https://cdn.jsdelivr.net/gh/PeteZah-Games/Games-lib@main/${slug}/index.html`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
      }).catch(() => null);

      if (fallbackRes && fallbackRes.ok) {
        let html = await fallbackRes.text();
        const baseHref = `https://cdn.jsdelivr.net/gh/PeteZah-Games/Games-lib@main/${slug}/`;
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

      return new NextResponse(`Game asset not found: ${sanitizedPath}`, {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // 5. GN Game by ID
    if (type === "gn" && id) {
      const candidates = [
        `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahGames@main/public/storage/ag/gn/${id}.html`,
        `https://cdn.jsdelivr.net/gh/PeteZah-Games/PeteZahStatic@main/storage/ag/gn/${id}.html`,
      ];
      for (const url of candidates) {
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(() => null);
        if (res && res.ok) {
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
      }
      return new NextResponse(`Game ${id} not found.`, { status: 404 });
    }

    return new NextResponse("Invalid proxy parameters", { status: 400 });
  } catch (err: any) {
    console.error("Game proxy error:", err);
    return new NextResponse(`Proxy error: ${err.message}`, { status: 500 });
  }
}

function cleanGameHtml(html: string, baseHref: string): string {
  // 1. Strip Google Tag Manager & gtag
  let cleaned = html
    .replace(/<script[^>]*googletagmanager[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script[^>]*>\s*window\.dataLayer[\s\S]*?<\/script>/gi, "")
    .replace(/https?:\/\/www\.googletagmanager\.com[^\s"']+/gi, "")
    .replace(/G-[A-Z0-9]{6,12}/g, "");

  // 2. Strip frame-busting scripts so games never break out of our LCE player
  cleaned = cleaned
    .replace(/if\s*\(\s*(?:top|window\.top|parent|window\.parent)\s*!==?\s*(?:self|window\.self)\s*\)[^;]*;/gi, "")
    .replace(/(?:top|parent)\.location\.href\s*=\s*[^;]+;/gi, "")
    .replace(/(?:top|parent)\.location\.replace\s*\([^)]*\);/gi, "");

  // 3. Strip any PeteZah branding
  cleaned = cleaned
    .replace(/petezahgames\.com/gi, "")
    .replace(/PeteZah\s*Games?/gi, "Games");

  // 4. Inject base tag so all relative assets, sounds, wasm load properly
  const baseTag = `<base href="${baseHref}">`;
  if (cleaned.includes("<head>")) {
    cleaned = cleaned.replace("<head>", `<head>\n${baseTag}`);
  } else if (cleaned.includes("<HEAD>")) {
    cleaned = cleaned.replace("<HEAD>", `<HEAD>\n${baseTag}`);
  } else {
    cleaned = `${baseTag}\n` + cleaned;
  }

  return cleaned;
}
