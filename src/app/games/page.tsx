"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Gamepad2, 
  Maximize2, 
  RotateCw, 
  X, 
  Heart, 
  ExternalLink,
  Sparkles,
  Loader2
} from "lucide-react";
import type { GameItem } from "@/app/api/games/catalog/route";

const CATEGORIES = ["All", "Action", "Platformer", "Racing", "Puzzle", "Sandbox", "Arcade", "Favorites"];

export default function GamesPage() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [iframeKey, setIframeKey] = useState(0);

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
      .catch((err) => console.error("Error loading games:", err))
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
    // Save last session
    try {
      localStorage.setItem(
        "lce_last_visited",
        JSON.stringify({ title: `Playing ${game.title}`, href: `/games` })
      );
    } catch {}
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-purple-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white">Games Catalog</h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Browse and play hundreds of web games directly inside LCE.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all"
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

      {/* Games Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Fetching GN Math games catalog...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-24 text-zinc-500">
          <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-medium text-zinc-300">No games found</p>
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
                {/* Cover Image Container */}
                <div className="relative w-full aspect-square bg-[#0b0814] overflow-hidden">
                  <img
                    src={game.cover}
                    alt={game.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  {/* Category Tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-zinc-300 border border-white/10">
                    {game.category}
                  </span>
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Info Container */}
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {game.author}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-400 font-medium">
                    <span>Play Now</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Playable Game Modal Runner */}
      {activeGame && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-5xl h-[88vh] bg-[#0f0c1c] border border-purple-500/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#171329] border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-sm text-white">{activeGame.title}</span>
                <span className="text-xs text-zinc-500 hidden sm:inline">({activeGame.category})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  title="Reload Game"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.open(activeGame.playUrl, "_blank")}
                  title="Open In New Tab"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  title="Close Game"
                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Game Iframe */}
            <div className="flex-1 w-full bg-black relative">
              <iframe
                key={iframeKey}
                src={activeGame.playUrl}
                title={activeGame.title}
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; keyboard; gamepad"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
