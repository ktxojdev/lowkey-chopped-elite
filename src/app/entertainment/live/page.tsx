"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Tv, 
  Play, 
  Search, 
  Maximize2, 
  ExternalLink,
  Radio,
  Sparkles,
  Volume2,
  RefreshCw,
  Globe,
  Loader2
} from "lucide-react";
import type { LiveChannel } from "@/app/api/entertainment/livetv/route";

export default function LiveTVPage() {
  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeChannel, setActiveChannel] = useState<LiveChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerKey, setPlayerKey] = useState(0);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/entertainment/livetv")
      .then((res) => res.json())
      .then((data) => {
        if (data.channels) {
          setChannels(data.channels);
          setActiveChannel(data.channels[0]);
        }
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      const matchSearch =
        ch.name.toLowerCase().includes(search.toLowerCase()) ||
        ch.currentShow.toLowerCase().includes(search.toLowerCase()) ||
        ch.category.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (activeCategory === "All") return true;
      return ch.category === activeCategory;
    });
  }, [channels, search, activeCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Tv className="w-7 h-7 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-black text-white">Live Broadcasts & TV</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Stream 25+ real worldwide live channels across News, Sports, Tech, Music, and Nature.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 25+ live channels..."
            className="w-full bg-[#141024] border border-white/10 focus:border-amber-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Main Live Player View */}
      {activeChannel && (
        <div 
          ref={playerContainerRef}
          className="bg-[#110d21] border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Stream Screen */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {activeChannel.embedType === "youtube" || activeChannel.embedType === "iframe" ? (
              <iframe
                key={`${activeChannel.id}-${playerKey}`}
                src={activeChannel.streamUrl}
                title={activeChannel.name}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                key={`${activeChannel.id}-${playerKey}`}
                src={activeChannel.streamUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Active Channel Details & Control Bar */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161228] border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                <img src={activeChannel.logo} alt={activeChannel.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h3 className="font-bold text-sm sm:text-base text-white">{activeChannel.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                    {activeChannel.category}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 text-[9px] uppercase border border-white/5">
                    {activeChannel.country}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1 font-medium">{activeChannel.currentShow}</p>
                <p className="text-[11px] text-zinc-500 line-clamp-1">{activeChannel.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPlayerKey((k) => k + 1)}
                title="Reload Stream"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reload</span>
              </button>

              <button
                onClick={toggleFullscreen}
                title="Fullscreen"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/30 border border-amber-400"
                  : "bg-[#161226] text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Channels Grid / Channel Guide */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-sm">Loading 25+ live channels...</p>
        </div>
      ) : filteredChannels.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-sm text-zinc-400">No channels found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredChannels.map((ch) => {
            const isSelected = activeChannel?.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => {
                  setActiveChannel(ch);
                  setPlayerKey(0);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${
                  isSelected
                    ? "bg-amber-950/25 border-amber-500/50 shadow-lg shadow-amber-950/30"
                    : "bg-[#141022] border-white/5 hover:border-white/15 hover:bg-[#1b162f]"
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black/40 border border-white/10 relative">
                  <img src={ch.logo} alt={ch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-xs sm:text-sm text-zinc-200 group-hover:text-white truncate">
                      {ch.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {ch.currentShow}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-amber-400 font-medium">
                      {ch.category}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {ch.country}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
