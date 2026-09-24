"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  Gamepad2, 
  Maximize2, 
  RotateCw, 
  X, 
  Heart, 
  ExternalLink,
  Play,
  Loader2,
  Minimize2
} from "lucide-react";
import type { GameItem } from "@/app/api/games/catalog/route";

const CATEGORIES = ["All", "Action", "Platformer", "Racing", "Puzzle", "Sandbox", "Arcade", "Favorites"];

export default function ActivitiesPage() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load favorites from localstorage
    try {
      const favs = localStorage.getItem("lce_game_favorites");
      if (favs) setFavorites(JSON.parse(favs));
    } catch {}

    // Fetch catalog
    fetch("/api/games/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data.games) setGames(data.games);
      })
      .catch((err) => console.error("Error loading activities:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem("lce_game_favorites", JSON.stringify(updated));
    } catch {}
  };

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (category === "All") return true;
      if (category === "Favorites") return favorites.includes(g.id);
      return g.category === category;
    });
  }, [games, search, category, favorites]);

  const launchGame = (game: GameItem) => {
    setActiveGame(game);
    try {
      localStorage.setItem(
        "lce_last_visited",
        JSON.stringify({ title: `Playing ${game.title}`, href: `/games` })
      );
    } catch {}
  };

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Activities</h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Explore and play hundreds of web games and interactive activities directly in LCE.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40"
                  : "bg-[#161226] text-zinc-400 hover:text-zinc-200 hover:bg-[#201a35] border border-white/5"
              }`}
            >
              {cat === "Favorites" ? `Favorites (${favorites.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Fetching GN Math activities catalog...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-24 text-zinc-500">
          <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-medium text-zinc-300">No activities found</p>
          <p className="text-xs text-zinc-500 mt-1">Try a different search query or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredGames.map((game) => {
            const isFav = favorites.includes(game.id);
            return (
              <div
                key={game.id}
                onClick={() => launchGame(game)}
                className="group relative bg-[#130f22] border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
              >
                {/* Cover Image Container with Blur-on-hover & Centered Play Button */}
                <div className="relative w-full aspect-square bg-[#0b0814] overflow-hidden">
                  <img
                    src={game.cover}
                    alt={game.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80";
                    }}
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Centered Glowing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-purple-600/95 shadow-[0_0_25px_rgba(168,85,247,0.7)] flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300 border border-purple-400">
                      <Play className="w-5 h-5 ml-0.5 fill-white text-white" />
                    </div>
                  </div>

                  {/* Category Tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-zinc-300 border border-white/10 z-10">
                    {game.category}
                  </span>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors z-10"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Info Container (Clean, no 'Play Now' button) */}
                <div className="p-3 flex flex-col flex-1 justify-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-purple-300 truncate transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {game.author || "GN Math"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-Window Activity Frame with Custom Matching Top Bar */}
      {activeGame && (
        <div 
          ref={gameContainerRef}
          className="fixed inset-0 z-[100] bg-black flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200"
        >
          {/* Top Bar - Styled in theme colors (matches screenshot layout with title + author on left, control buttons on right) */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#110d22] border-b border-white/10 select-none shrink-0 shadow-lg">
            {/* Left: Title + Author */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-wide">
                  {activeGame.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-medium border border-purple-500/30 hidden sm:inline">
                  {activeGame.category}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">
                by {activeGame.author || "GN Math"}
              </span>
            </div>

            {/* Right: Controls (Reload, Open in New Tab, Fullscreen, Close) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                title="Reload Activity"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reload</span>
              </button>

              <button
                onClick={() => window.open(activeGame.playUrl, "_blank")}
                title="Open In New Tab"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">New Tab</span>
              </button>

              <button
                onClick={toggleNativeFullscreen}
                title="Toggle Fullscreen"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Fullscreen</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen?.();
                  }
                  setActiveGame(null);
                }}
                title="Close Activity"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-xs font-medium text-purple-200 hover:text-white border border-purple-500/40 transition-all shadow-md ml-1"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Full Game / Activity Frame */}
          <div className="flex-1 w-full h-full bg-black relative">
            <iframe
              key={iframeKey}
              src={activeGame.playUrl}
              title={activeGame.title}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen; keyboard; gamepad; clipboard-read; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}
