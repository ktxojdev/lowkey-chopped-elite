"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  PlaySquare, 
  Star, 
  Loader2, 
  X, 
  Play, 
  ArrowLeft,
  RotateCw,
  Film,
  Calendar,
  Layers
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
  status?: string;
  genres?: { name: string }[];
  studios?: { name: string }[];
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
  
  // Streaming Player State
  const [isStreaming, setIsStreaming] = useState(false);
  const [episode, setEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState("2embed");
  const [playerKey, setPlayerKey] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

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

  const closeDetails = () => {
    setSelectedAnime(null);
    setIsStreaming(false);
    setShowTrailer(false);
    setEpisode(1);
  };

  const title = selectedAnime?.title_english || selectedAnime?.title || "Anime";
  const streamUrl = selectedAnime
    ? `/api/entertainment/anime/stream?server=${selectedServer}&id=${selectedAnime.mal_id}&title=${encodeURIComponent(
        selectedAnime.title
      )}&episode=${episode}`
    : "";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PlaySquare className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Anime Catalog</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Stream popular and trending anime series with multi-source server-side fallback.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anime..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Fetching anime catalog via server-side proxy...</p>
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
                onClick={() => {
                  setSelectedAnime(anime);
                  setIsStreaming(false);
                  setShowTrailer(false);
                  setEpisode(1);
                }}
                className="group relative bg-[#130f22] border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
              >
                <div className="relative w-full aspect-[2/3] bg-[#0b0814] overflow-hidden">
                  <img
                    src={img}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-[2px]"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-11 h-11 rounded-full bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.7)] flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {anime.score ? (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-amber-300 border border-white/10 flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {anime.score.toFixed(2)}
                    </span>
                  ) : null}
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-purple-300 truncate transition-colors">
                      {anime.title_english || anime.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {anime.episodes ? `${anime.episodes} eps` : "Ongoing"} • {anime.year || "TV"}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-400 font-semibold">
                    <span>Watch Series</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details & Streaming Modal (Full Page When Streaming) */}
      {selectedAnime && (
        <div
          className={
            isStreaming
              ? "fixed inset-0 z-50 bg-black w-screen h-screen flex flex-col overflow-hidden"
              : "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 overflow-y-auto"
          }
        >
          <div
            className={
              isStreaming
                ? "w-full h-full flex flex-col bg-black overflow-hidden"
                : "bg-[#130f24] border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative my-auto"
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-[#17122e] border-b border-white/10 shrink-0 z-20">
              <div className="flex items-center gap-3">
                {isStreaming && (
                  <button
                    onClick={() => setIsStreaming(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 hover:text-white transition-all border border-white/10"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Back to Details</span>
                  </button>
                )}
                <span className="font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-md">
                  {title}
                </span>
                <span className="text-xs text-purple-400 uppercase font-semibold hidden md:inline">
                  [ANIME]
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isStreaming && (
                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                    {[
                      { id: "2embed", name: "2Embed" },
                      { id: "autoembed", name: "AutoEmbed" },
                      { id: "vidsrc", name: "VidSrc" },
                      { id: "multiembed", name: "MultiEmbed" },
                    ].map((srv) => (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedServer(srv.id)}
                        className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                          selectedServer === srv.id
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {srv.name}
                      </button>
                    ))}
                  </div>
                )}

                {isStreaming && (
                  <button
                    onClick={() => setPlayerKey((k) => k + 1)}
                    title="Reload Stream"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors border border-white/5"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={closeDetails}
                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors border border-red-500/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            {isStreaming ? (
              /* Full Page Stream Player */
              <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden relative">
                {/* Episode Bar */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#120e24] border-b border-white/10 text-xs text-zinc-300 shrink-0">
                  <span className="font-semibold text-purple-300">Episode:</span>
                  <input
                    type="number"
                    min="1"
                    max={selectedAnime.episodes || 1000}
                    value={episode}
                    onChange={(e) => setEpisode(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-black/60 border border-white/10 rounded px-2 py-0.5 text-center text-white text-xs font-mono"
                  />
                  <span className="text-zinc-500 text-[11px] ml-auto hidden sm:inline font-mono">
                    Provider: {selectedServer} • Proxied via Vercel
                  </span>
                </div>

                <iframe
                  key={`${selectedServer}-${playerKey}-${episode}`}
                  src={streamUrl}
                  title="LCE Anime Stream"
                  className="w-full flex-1 h-full border-none bg-black"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; display-capture"
                />
              </div>
            ) : (
              /* Rich Anime Details View */
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={
                      selectedAnime.images?.webp?.large_image_url ||
                      selectedAnime.images?.jpg?.large_image_url
                    }
                    alt={selectedAnime.title}
                    className="w-40 sm:w-48 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0 self-center sm:self-start border border-white/10"
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-2xl font-black text-white">{title}</h2>
                      {selectedAnime.title !== title && (
                        <p className="text-xs text-zinc-400 italic mt-0.5">{selectedAnime.title}</p>
                      )}
                    </div>

                    {/* Metadata pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {selectedAnime.score && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-1 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {selectedAnime.score.toFixed(2)}
                        </span>
                      )}
                      {selectedAnime.episodes && (
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 font-medium">
                          {selectedAnime.episodes} Episodes
                        </span>
                      )}
                      {selectedAnime.year && (
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          {selectedAnime.year}
                        </span>
                      )}
                    </div>

                    {/* Genres */}
                    {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAnime.genres.map((g, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-[11px] font-semibold text-purple-300"
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons: Watch Now & See Trailer */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setIsStreaming(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-lg shadow-purple-600/40 transition-all hover:scale-105 active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch Now</span>
                      </button>

                      {selectedAnime.trailer?.embed_url ? (
                        <button
                          onClick={() => setShowTrailer(true)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 hover:text-white text-sm font-semibold border border-white/15 transition-all"
                        >
                          <Film className="w-4 h-4" />
                          <span>See Trailer</span>
                        </button>
                      ) : (
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                            title + " trailer"
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 hover:text-white text-sm font-semibold border border-white/15 transition-all"
                        >
                          <Film className="w-4 h-4" />
                          <span>See Trailer</span>
                        </a>
                      )}
                    </div>

                    {/* Synopsis */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        Synopsis
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-h-48 overflow-y-auto">
                        {selectedAnime.synopsis || "No synopsis available."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trailer Embed if active */}
                {showTrailer && selectedAnime.trailer?.embed_url && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Official Anime Trailer
                      </h4>
                      <button
                        onClick={() => setShowTrailer(false)}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        Close Trailer
                      </button>
                    </div>
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
                      <iframe
                        src={selectedAnime.trailer.embed_url}
                        title="Trailer"
                        className="w-full h-full border-none"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
