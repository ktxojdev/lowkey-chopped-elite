import { NextRequest, NextResponse } from "next/server";

export interface YouTubeVideoItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  published: string;
  thumbnail: string;
}

// Fallback high-quality curated videos if network times out
const FALLBACK_VIDEOS: Record<string, YouTubeVideoItem[]> = {
  default: [
    {
      id: "JeFiVma1HmI",
      title: "I Survived 100 Days in Minecraft’s HARSHEST Winter",
      channel: "Luke TheNotable",
      duration: "34:12",
      views: "12,410,000 views",
      published: "1 year ago",
      thumbnail: "/api/entertainment/youtube/thumb?id=JeFiVma1HmI",
    },
    {
      id: "jfKfPfyJRdk",
      title: "lofi hip hop radio - beats to relax/study to",
      channel: "Lofi Girl",
      duration: "LIVE",
      views: "68,230 watching",
      published: "Live",
      thumbnail: "/api/entertainment/youtube/thumb?id=jfKfPfyJRdk",
    },
    {
      id: "kJu5VMN3yow",
      title: "I Survived 100 Days on One Block in Hardcore Minecraft",
      channel: "MrBeast Gaming",
      duration: "30:35",
      views: "51,417,000 views",
      published: "2 weeks ago",
      thumbnail: "/api/entertainment/youtube/thumb?id=kJu5VMN3yow",
    },
    {
      id: "dp8PhLsUcFE",
      title: "NASA Live: Official Stream of Earth from the Space Station",
      channel: "NASA",
      duration: "LIVE",
      views: "14,500 watching",
      published: "Live",
      thumbnail: "/api/entertainment/youtube/thumb?id=dp8PhLsUcFE",
    },
    {
      id: "bNyUyrR0PHo",
      title: "Relaxing Jazz Music - Warm Coffee Shop Ambience",
      channel: "Cafe Music BGM",
      duration: "3:45:00",
      views: "2,350,000 views",
      published: "4 months ago",
      thumbnail: "/api/entertainment/youtube/thumb?id=bNyUyrR0PHo",
    },
    {
      id: "qEnINYWIHQQ",
      title: "Top 10 NEW October Games of 2026",
      channel: "gameranx",
      duration: "13:08",
      views: "812,703 views",
      published: "3 days ago",
      thumbnail: "/api/entertainment/youtube/thumb?id=qEnINYWIHQQ",
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "trending videos";

    // 1. Query YouTube InnerTube API
    try {
      const response = await fetch("https://www.youtube.com/youtubei/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20240101.00.00",
              hl: "en",
              gl: "US",
            },
          },
          query,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        const sectionList =
          data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

        const videos: YouTubeVideoItem[] = [];
        const seenIds = new Set<string>();

        for (const section of sectionList) {
          const items = section.itemSectionRenderer?.contents || [];
          for (const item of items) {
            // Direct video
            if (item.videoRenderer?.videoId) {
              const v = item.videoRenderer;
              if (!seenIds.has(v.videoId)) {
                seenIds.add(v.videoId);
                videos.push({
                  id: v.videoId,
                  title: v.title?.runs?.[0]?.text || "Untitled Video",
                  channel:
                    v.ownerText?.runs?.[0]?.text ||
                    v.shortBylineText?.runs?.[0]?.text ||
                    "Creator",
                  duration: v.lengthText?.simpleText || (v.badges?.some((b: any) => b.metadataBadgeRenderer?.style?.includes("LIVE")) ? "LIVE" : "Video"),
                  views: v.viewCountText?.simpleText || "Trending",
                  published: v.publishedTimeText?.simpleText || "Recently",
                  thumbnail: `/api/entertainment/youtube/thumb?id=${v.videoId}`,
                });
              }
            }

            // Shelf list (e.g. popular videos shelf)
            const shelfItems = item.shelfRenderer?.content?.verticalListRenderer?.items || [];
            for (const sub of shelfItems) {
              if (sub.videoRenderer?.videoId) {
                const v = sub.videoRenderer;
                if (!seenIds.has(v.videoId)) {
                  seenIds.add(v.videoId);
                  videos.push({
                    id: v.videoId,
                    title: v.title?.runs?.[0]?.text || "Untitled Video",
                    channel:
                      v.ownerText?.runs?.[0]?.text ||
                      v.shortBylineText?.runs?.[0]?.text ||
                      "Creator",
                    duration: v.lengthText?.simpleText || "Video",
                    views: v.viewCountText?.simpleText || "Trending",
                    published: v.publishedTimeText?.simpleText || "Recently",
                    thumbnail: `/api/entertainment/youtube/thumb?id=${v.videoId}`,
                  });
                }
              }
            }
          }
        }

        if (videos.length > 0) {
          return NextResponse.json({
            status: "success",
            source: "innertube",
            query,
            count: videos.length,
            videos,
          });
        }
      }
    } catch (err) {
      console.warn("InnerTube search failed, using fallback:", err);
    }

    // 2. Fallback curated data
    return NextResponse.json({
      status: "fallback",
      source: "curated",
      query,
      count: FALLBACK_VIDEOS.default.length,
      videos: FALLBACK_VIDEOS.default,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error fetching YouTube videos", details: error.message },
      { status: 500 }
    );
  }
}
