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
  Clock,
  Users,
  ChevronRight,
  Maximize2,
  RotateCw,
  ArrowLeft
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
  media_type?: "movie" | "tv";
  genre_ids?: number[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string | null;
}

interface MediaDetails extends MediaItem {
  tagline?: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast?: CastMember[];
  };
  videos?: {
    results?: {
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

export default function MoviesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("trending"); // 'trending' | 'popular_movies' | 'popular_tv'
  const [search, setSearch] = useState("");
  
  // Selection & Details state
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Streaming Player state
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedServer, setSelectedServer] = useState("cinesrc");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [playerKey, setPlayerKey] = useState(0);

  // Trailer Modal state
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

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

  const openDetails = async (item: MediaItem) => {
    setSelectedItem(item);
    setIsStreaming(false);
    setSeason(1);
    setEpisode(1);
    setLoadingDetails(true);

    const mediaType = item.media_type || (item.name ? "tv" : "movie");

    try {
      const res = await fetch(
        `/api/entertainment/tmdb?action=details&id=${item.id}&mediaType=${mediaType}`
      );
      const data: MediaDetails = await res.json();
      setDetails({
        ...item,
        ...data,
        media_type: mediaType as "movie" | "tv",
      });
    } catch (err) {
      console.error("Failed to load details:", err);
      setDetails({ ...item, media_type: mediaType as "movie" | "tv" });
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedItem(null);
    setDetails(null);
    setIsStreaming(false);
    setTrailerKey(null);
  };

  // Find trailer from details
  const officialTrailer = details?.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const mediaType = details?.media_type || (details?.name ? "tv" : "movie");
  const streamUrl = `/api/entertainment/stream?server=${selectedServer}&type=${mediaType}&id=${details?.id || selectedItem?.id}&season=${season}&episode=${episode}`;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl md:text-3xl font-black text-white">Movies & TV</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Stream movies and TV shows securely proxied through LCE backend.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies, TV shows..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40"
                  : "bg-[#161226] text-zinc-400 hover:text-white border border-white/5"
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
                onClick={() => openDetails(item)}
                className="group relative bg-[#130f22] border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
              >
                <div className="relative w-full aspect-[2/3] bg-[#0b0814] overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-[2px]"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-11 h-11 rounded-full bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.7)] flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {item.vote_average ? (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-amber-300 border border-white/10 flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {item.vote_average.toFixed(1)}
                    </span>
                  ) : null}
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-purple-300 truncate transition-colors">
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Movie / TV Show Details & Streaming Modal (Full Page When Streaming) */}
      {selectedItem && (
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
                : "bg-[#120e24] border border-purple-500/30 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative my-auto"
            }
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-[#16122c] border-b border-white/10 shrink-0 z-20">
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
                  {details?.title || details?.name || selectedItem.title || selectedItem.name}
                </span>
                <span className="text-xs text-purple-400 uppercase font-semibold hidden md:inline">
                  [{mediaType}]
                </span>
              </div>

              {/* Streaming server selection & controls */}
              <div className="flex items-center gap-2">
                {isStreaming && (
                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                    {[
                      { id: "cinesrc", name: "CineSrc" },
                      { id: "vidlink", name: "VidLink" },
                      { id: "vidsrc", name: "VidSrc" },
                      { id: "autoembed", name: "AutoEmbed" },
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

            {/* Modal Body */}
            {isStreaming ? (
              /* Dedicated Server-Side Proxied Video Stream Player (Full Screen, High Fidelity) */
              <div className="flex-1 w-full h-full flex flex-col bg-black overflow-hidden relative">
                {/* TV Episode Selector if TV show */}
                {mediaType === "tv" && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-[#120e24] border-b border-white/10 text-xs text-zinc-300 shrink-0">
                    <span className="font-semibold text-purple-300">Episode Selection:</span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-zinc-500">Season:</label>
                      <input
                        type="number"
                        min="1"
                        max={details?.number_of_seasons || 30}
                        value={season}
                        onChange={(e) => setSeason(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 bg-black/60 border border-white/10 rounded px-2 py-0.5 text-center text-white text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-zinc-500">Episode:</label>
                      <input
                        type="number"
                        min="1"
                        max={50}
                        value={episode}
                        onChange={(e) => setEpisode(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 bg-black/60 border border-white/10 rounded px-2 py-0.5 text-center text-white text-xs"
                      />
                    </div>
                    <span className="text-zinc-500 text-[11px] ml-auto hidden sm:inline font-mono">
                      Server: {selectedServer} • Proxied via Vercel
                    </span>
                  </div>
                )}

                {/* Proxied Embed Iframe taking 100% of remaining screen */}
                <iframe
                  key={`${selectedServer}-${playerKey}-${season}-${episode}`}
                  src={streamUrl}
                  title="LCE Stream Player"
                  className="w-full flex-1 h-full border-none bg-black"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; display-capture"
                />
              </div>
            ) : (
              /* Full Movie/TV Details View */
              <div className="flex-1 overflow-y-auto">
                {/* Backdrop Image Banner */}
                {(details?.backdrop_path || selectedItem.backdrop_path) && (
                  <div className="relative w-full h-56 sm:h-72 bg-black overflow-hidden shrink-0">
                    <img
                      src={`https://image.tmdb.org/t/p/w1280${
                        details?.backdrop_path || selectedItem.backdrop_path
                      }`}
                      alt="Backdrop"
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120e24] via-[#120e24]/60 to-transparent" />
                  </div>
                )}

                {/* Details Content Container */}
                <div className="p-6 md:p-8 relative -mt-16 sm:-mt-24 z-10 flex flex-col md:flex-row gap-6">
                  {/* Poster */}
                  <div className="shrink-0 self-center md:self-start">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${
                        details?.poster_path || selectedItem.poster_path
                      }`}
                      alt={details?.title || selectedItem.title || "Poster"}
                      className="w-36 sm:w-48 aspect-[2/3] object-cover rounded-xl shadow-2xl border border-white/15"
                    />
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 flex flex-col justify-start">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                      {details?.title || details?.name || selectedItem.title || selectedItem.name}
                    </h2>

                    {details?.tagline && (
                      <p className="text-xs sm:text-sm text-purple-300 italic mt-1 font-medium">
                        "{details.tagline}"
                      </p>
                    )}

                    {/* Meta stats pills */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 mt-3 font-medium">
                      {(details?.release_date || details?.first_air_date) && (
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {details.release_date || details.first_air_date}
                        </span>
                      )}

                      {details?.vote_average ? (
                        <span className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/20">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {details.vote_average.toFixed(1)} / 10
                        </span>
                      ) : null}

                      {details?.runtime ? (
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {details.runtime} mins
                        </span>
                      ) : null}

                      {details?.number_of_seasons ? (
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                          <Tv className="w-3.5 h-3.5 text-zinc-400" />
                          {details.number_of_seasons} Seasons ({details.number_of_episodes} Episodes)
                        </span>
                      ) : null}
                    </div>

                    {/* Genres */}
                    {details?.genres && details.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {details.genres.map((g) => (
                          <span
                            key={g.id}
                            className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-medium text-purple-300"
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons: Watch and See Trailer */}
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                      <button
                        onClick={() => setIsStreaming(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-lg shadow-purple-600/40 transition-all hover:scale-105 active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch Now</span>
                      </button>

                      {officialTrailer ? (
                        <button
                          onClick={() => setTrailerKey(officialTrailer.key)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 hover:text-white text-sm font-semibold border border-white/15 transition-all"
                        >
                          <Film className="w-4 h-4" />
                          <span>See Trailer</span>
                        </button>
                      ) : (
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                            (details?.title || details?.name || "") + " trailer"
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

                    {/* Overview Synopsis */}
                    <div className="mt-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Synopsis
                      </h4>
                      <p className="text-sm text-zinc-300 mt-1.5 leading-relaxed">
                        {details?.overview || selectedItem.overview || "No synopsis available."}
                      </p>
                    </div>

                    {/* Real Cast / Actors Section (No Placeholders!) */}
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                          Top Cast & Actors
                        </h4>
                      </div>

                      {loadingDetails ? (
                        <div className="flex items-center gap-2 text-xs text-zinc-500 py-3">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                          <span>Loading actors...</span>
                        </div>
                      ) : details?.credits?.cast && details.credits.cast.length > 0 ? (
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                          {details.credits.cast.slice(0, 12).map((actor) => (
                            <div
                              key={actor.id}
                              className="shrink-0 flex flex-col items-center w-20 text-center group"
                            >
                              <div className="w-14 h-14 rounded-full bg-zinc-800 border border-white/10 overflow-hidden mb-1.5 group-hover:border-purple-400 transition-colors shadow-md">
                                {actor.profile_path ? (
                                  <img
                                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                    alt={actor.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                                    {actor.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="text-[11px] font-semibold text-zinc-200 truncate w-full group-hover:text-purple-300">
                                {actor.name}
                              </span>
                              <span className="text-[9px] text-zinc-500 truncate w-full">
                                {actor.character}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500">Cast data not available for this title.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded YouTube Trailer Modal */}
      {trailerKey && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-black border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[#120e24] border-b border-white/10">
              <span className="text-xs font-bold text-zinc-200">Official Trailer</span>
              <button
                onClick={() => setTrailerKey(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Trailer"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
