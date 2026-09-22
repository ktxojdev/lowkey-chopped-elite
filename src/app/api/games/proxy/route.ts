import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'cover' | 'html'
  const file = searchParams.get("file");

  if (!file) {
    return new NextResponse("Missing file parameter", { status: 400 });
  }

  // Prevent path traversal
  const sanitizedFile = file.replace(/(\.\.[\/\\])+/g, "").replace(/^\/+/, "");

  try {
    let targetUrl = "";
    if (type === "cover") {
      targetUrl = `https://raw.githubusercontent.com/gn-math/covers/main/${sanitizedFile}`;
    } else {
      targetUrl = `https://raw.githubusercontent.com/gn-math/html/main/${sanitizedFile}`;
    }

    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "LCE-Proxy/1.0",
      },
    });

    if (!upstream.ok) {
      // Fallback placeholder if cover missing
      if (type === "cover") {
        return NextResponse.redirect(
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
        );
      }
      return new NextResponse(`File not found: ${sanitizedFile}`, {
        status: upstream.status,
      });
    }

    const contentType =
      type === "cover"
        ? upstream.headers.get("content-type") || "image/png"
        : "text/html; charset=utf-8";

    const data = await upstream.arrayBuffer();

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (err: any) {
    return new NextResponse(`Proxy error: ${err.message}`, { status: 500 });
  }
}
