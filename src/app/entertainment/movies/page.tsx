"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Film, 
  Tv, 
  Star, 
  TrendingUp, 
  X, 
  Play, 
  Loader2,
  Calendar,
  Info
} from "lucide-react";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
}

export default function MoviesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("trending"); // 'trending' | 'popular_movies' | 'popular_tv'
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const fetchContent = async (action: string, query?: string) => {
    setLoading(true);
    try {
      let url = `/api/entertainment/tmdb?action=${action}`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        setItems(data.results.filter((i: MediaItem) => i.poster_path));
      }
    } catch (err) {
      console.error("TMDB fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(filter);
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    fetchContent("search", search);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Movies & TV</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Powered by server-side TMDB API proxy.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies or series..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: "trending", label: "Trending Today", icon: TrendingUp },
          { id: "popular_movies", label: "Popular Movies", icon: Film },
          { id: "popular_tv", label: "TV Shows", icon: Tv },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filter === tab.id && !search;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSearch("");
                setFilter(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-[#161226] text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Loading media via TMDB proxy...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-base font-medium text-zinc-300">No media found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => {
            const title = item.title || item.name || "Untitled";
            const date = item.release_date || item.first_air_date || "";
            const year = date ? new Date(date).getFullYear() : "";

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-[#130f22] border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
              >
                <div className="relative w-full aspect-[2/3] bg-[#0b0814] overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.vote_average ? (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-amber-300 border border-white/10 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {item.vote_average.toFixed(1)}
                    </span>
                  ) : null}
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                      {year && <span>{year}</span>}
                      {item.media_type && (
                        <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/5">
                          {item.media_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-400 font-medium">
                    <span>View Details</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#130f24] border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Backdrop Image */}
            {selectedItem.backdrop_path && (
              <div className="relative w-full h-48 sm:h-64 bg-black">
                <img
                  src={`https://image.tmdb.org/t/p/w780${selectedItem.backdrop_path}`}
                  alt="Backdrop"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#130f24] via-[#130f24]/40 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-6 relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row gap-6">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`}
                alt={selectedItem.title || selectedItem.name}
                className="w-28 sm:w-36 aspect-[2/3] object-cover rounded-xl shadow-2xl border border-white/10 shrink-0 self-center sm:self-start"
              />

              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedItem.title || selectedItem.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                  {(selectedItem.release_date || selectedItem.first_air_date) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      {selectedItem.release_date || selectedItem.first_air_date}
                    </span>
                  )}
                  {selectedItem.vote_average && (
                    <span className="flex items-center gap-1 text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {selectedItem.vote_average.toFixed(1)} / 10
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed line-clamp-4">
                  {selectedItem.overview || "No description provided."}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      (selectedItem.title || selectedItem.name || "") + " trailer"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Trailer</span>
                  </a>
                  <a
                    href={`https://www.themoviedb.org/${
                      selectedItem.media_type === "tv" ? "tv" : "movie"
                    }/${selectedItem.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 transition-all"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>TMDB Page</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
