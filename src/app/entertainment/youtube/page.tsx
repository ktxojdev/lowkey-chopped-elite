"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Play, 
  Sparkles, 
  TrendingUp, 
  Gamepad2, 
  Music, 
  Coffee, 
  Code2, 
  Clapperboard, 
  Atom, 
  X, 
  Maximize2, 
  Share2, 
  Check, 
  Loader2,
  Tv,
  Flame,
  Radio
} from "lucide-react";

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  published: string;
  thumbnail: string;
}

const CATEGORIES = [
  { name: "Trending", query: "trending videos", icon: Flame },
  { name: "Gaming", query: "gaming minecraft gameplay", icon: Gamepad2 },
  { name: "Music", query: "popular music songs hits", icon: Music },
  { name: "Lo-Fi & Chill", query: "lofi hip hop radio beats to relax", icon: Coffee },
  { name: "Tech & Code", query: "software programming tech review", icon: Code2 },
  { name: "Trailers", query: "official movie trailers", icon: Clapperboard },
  { name: "Science", query: "science documentary discoveries", icon: Atom },
];

const ENGINES = [
  { id: "piped", name: "Piped HTML5", desc: "Ultra-fast privacy proxy" },
  { id: "yewtube", name: "YewTube", desc: "Clean Invidious mirror" },
  { id: "nadeko", name: "Nadeko", desc: "High-throughput cluster" },
  { id: "f5", name: "F5 Mirror", desc: "Global edge failover" },
];

export default function YouTubePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [activeEngine, setActiveEngine] = useState("piped");
  const [copied, setCopied] = useState(false);

  // Fetch videos for category or search
  const fetchVideos = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entertainment/youtube/search?q=${encodeURIComponent(searchTerm)}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos("trending videos");

    // Close modal on Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check URL query parameter for direct video loading (?v=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get("v");
      if (videoId && !selectedVideo) {
        setSelectedVideo({
          id: videoId,
          title: "Shared Video",
          channel: "YouTube",
          duration: "Video",
          views: "Streaming",
          published: "Now",
          thumbnail: `/api/entertainment/youtube/thumb?id=${videoId}`,
        });
      }
    }
  }, []);

  const handleCategorySelect = (cat: typeof CATEGORIES[0]) => {
    setActiveCategory(cat.name);
    setQuery("");
    fetchVideos(cat.query);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setActiveCategory("");
    fetchVideos(query.trim());
  };

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/entertainment/youtube?v=${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <Play className="w-4 h-4 fill-red-400" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              YouTube Unblocked
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Stream videos, music, and gameplay via our private InnerTube server proxy with zero cookies and no tracking.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any video, music, or channel..."
            className="w-full bg-[#120e24] border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Category Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30"
                  : "bg-white/[0.03] text-zinc-400 hover:text-white border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl bg-[#120e24] border border-white/5 p-3 space-y-3 animate-pulse">
              <div className="w-full aspect-video rounded-xl bg-white/5" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="py-16 text-center text-zinc-500">
          <Play className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No videos found. Try a different search query!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer rounded-2xl bg-[#120e24] border border-white/10 hover:border-red-500/50 p-2.5 sm:p-3 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail with duration badge */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 mb-3 border border-white/5">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                  {/* Play Button Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <span className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    video.duration === "LIVE" 
                      ? "bg-red-600 text-white animate-pulse" 
                      : "bg-black/80 text-white backdrop-blur-md"
                  }`}>
                    {video.duration}
                  </span>
                </div>

                {/* Video Info */}
                <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors mb-1.5">
                  {video.title}
                </h3>
              </div>

              <div>
                <p className="text-xs text-zinc-400 font-medium truncate mb-1">
                  {video.channel}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <span>{video.views}</span>
                  <span>•</span>
                  <span>{video.published}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cinema Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-[#120e24] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0e0a1e]">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <span className="p-1 rounded-md bg-red-600/20 text-red-400">
                  <Play className="w-3.5 h-3.5 fill-red-400" />
                </span>
                <span className="font-bold text-xs sm:text-sm text-white truncate">
                  {selectedVideo.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Engine Selector Dropdown */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
                  {ENGINES.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setActiveEngine(e.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        activeEngine === e.id
                          ? "bg-red-600 text-white"
                          : "text-zinc-400 hover:text-white"
                      }`}
                      title={e.desc}
                    >
                      {e.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Share Link */}
                <button
                  onClick={() => copyShareLink(selectedVideo.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/5"
                  title="Copy video link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/5"
                  title="Close cinema"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Player Viewport */}
            <div className="w-full aspect-video bg-black relative">
              <iframe
                src={`/api/entertainment/youtube/embed?id=${selectedVideo.id}&engine=${activeEngine}`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Bottom Meta & Details */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e0a1e]">
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-white mb-1">
                  {selectedVideo.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span className="font-semibold text-purple-400">{selectedVideo.channel}</span>
                  <span>•</span>
                  <span>{selectedVideo.views}</span>
                  <span>•</span>
                  <span>{selectedVideo.published}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-zinc-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Proxy Engine: {ENGINES.find((e) => e.id === activeEngine)?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
