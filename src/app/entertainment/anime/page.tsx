"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  PlaySquare, 
  Star, 
  Loader2, 
  X, 
  Play, 
  ExternalLink 
} from "lucide-react";

interface AnimeItem {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    webp?: {
      large_image_url?: string;
      image_url?: string;
    };
    jpg?: {
      large_image_url?: string;
    };
  };
  score?: number;
  episodes?: number;
  synopsis?: string;
  year?: number;
  genres?: { name: string }[];
  trailer?: {
    embed_url?: string;
    url?: string;
  };
}

export default function AnimePage() {
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);

  const fetchAnime = async (action: string, query?: string) => {
    setLoading(true);
    try {
      let url = `/api/entertainment/anime?action=${action}`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.data) {
        setItems(data.data);
      }
    } catch (err) {
      console.error("Anime fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime("top");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    fetchAnime("search", search);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PlaySquare className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Anime Catalog</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Discover popular and trending anime series via server-side Jikan/AniList proxy.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anime..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Fetching anime catalog...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-base font-medium text-zinc-300">No anime found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((anime) => {
            const img =
              anime.images?.webp?.large_image_url ||
              anime.images?.jpg?.large_image_url ||
              anime.images?.webp?.image_url;

            return (
              <div
                key={anime.mal_id}
                onClick={() => setSelectedAnime(anime)}
                className="group relative bg-[#130f22] border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
              >
                <div className="relative w-full aspect-[2/3] bg-[#0b0814] overflow-hidden">
                  <img
                    src={img}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {anime.score ? (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-amber-300 border border-white/10 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {anime.score.toFixed(2)}
                    </span>
                  ) : null}
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                      {anime.title_english || anime.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {anime.episodes ? `${anime.episodes} eps` : "Ongoing"} •{" "}
                      {anime.year || "TV"}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-400 font-medium">
                    <span>Details</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details & Trailer Modal */}
      {selectedAnime && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#130f24] border border-white/10 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAnime(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={
                  selectedAnime.images?.webp?.large_image_url ||
                  selectedAnime.images?.jpg?.large_image_url
                }
                alt={selectedAnime.title}
                className="w-32 sm:w-44 aspect-[2/3] object-cover rounded-xl shadow-xl shrink-0 self-center sm:self-start"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {selectedAnime.title_english || selectedAnime.title}
                </h2>
                <p className="text-xs text-zinc-400 italic mt-0.5">{selectedAnime.title}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedAnime.score && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-1 font-medium">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {selectedAnime.score}
                    </span>
                  )}
                  {selectedAnime.episodes && (
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 text-xs">
                      {selectedAnime.episodes} Episodes
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed line-clamp-6">
                  {selectedAnime.synopsis || "No synopsis available."}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <a
                    href={`https://myanimelist.net/anime/${selectedAnime.mal_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>MyAnimeList Profile</span>
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
