import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file");
    const profile = searchParams.get("profile");

    // 1. If a specific backend or CDN asset is requested, proxy it directly
    if (file) {
      // Prevent directory traversal
      const cleanPath = file.replace(/\.\./g, "").replace(/^\/+/, "");
      const targetUrl = `https://copy.sh/v86/${cleanPath}`;

      const res = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 LCE-VM-Proxy/2.0",
        },
      });

      if (!res.ok) {
        return new NextResponse(`Asset not found: ${cleanPath}`, { status: res.status });
      }

      const buffer = await res.arrayBuffer();

      let contentType = "application/octet-stream";
      if (cleanPath.endsWith(".wasm")) contentType = "application/wasm";
      else if (cleanPath.endsWith(".js")) contentType = "application/javascript; charset=utf-8";
      else if (cleanPath.endsWith(".css")) contentType = "text/css; charset=utf-8";
      else if (cleanPath.endsWith(".html")) contentType = "text/html; charset=utf-8";
      else if (cleanPath.endsWith(".png")) contentType = "image/png";
      else if (cleanPath.endsWith(".json")) contentType = "application/json";

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 2. Otherwise, fetch the base v86 environment and rewrite all asset paths to our proxy
    const baseUrl = profile ? `https://copy.sh/v86/?profile=${encodeURIComponent(profile)}` : "https://copy.sh/v86/";
    const res = await fetch(baseUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 LCE-VM-Proxy/2.0",
      },
    });

    if (!res.ok) {
      return new NextResponse("Failed to load VM kernel from backend", { status: 502 });
    }

    let html = await res.text();

    // Rewrite relative script and stylesheet tags
    html = html.replace(/src="build\//g, 'src="/api/vm/proxy?file=build/');
    html = html.replace(/href="v86\.css"/g, 'href="/api/vm/proxy?file=v86.css"');
    html = html.replace(/href="manifest\.json"/g, 'href="/api/vm/proxy?file=manifest.json"');
    html = html.replace(/href="192\.png"/g, 'href="/api/vm/proxy?file=192.png"');

    // Inject interceptor script so all fetch and XHR calls to WASM/BIOS/images route through our proxy
    const proxyInterceptor = `
<script>
(function() {
  const origFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string') {
      if (!input.startsWith('http://') && !input.startsWith('https://') && !input.startsWith('/api/')) {
        var clean = input.replace(/^\\.?\\//, '');
        input = '/api/vm/proxy?file=' + encodeURIComponent(clean);
      }
    }
    return origFetch.call(this, input, init);
  };

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string') {
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/api/')) {
        var clean = url.replace(/^\\.?\\//, '');
        url = '/api/vm/proxy?file=' + encodeURIComponent(clean);
      }
    }
    return origOpen.call(this, method, url, ...rest);
  };
})();
</script>
<style>
  body {
    background-color: #0b0813 !important;
    color: #e4e4e7 !important;
    font-family: inherit !important;
  }
  #screen_container {
    background-color: #000 !important;
  }
  #boot_options {
    background: rgba(20, 16, 36, 0.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #d4d4d8 !important;
    border-radius: 8px !important;
  }
</style>
`;

    html = html.replace("</head>", `${proxyInterceptor}</head>`);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, must-revalidate",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error: any) {
    console.error("VM Proxy Error:", error);
    return new NextResponse(`VM Proxy Server Error: ${error.message}`, { status: 500 });
  }
}
