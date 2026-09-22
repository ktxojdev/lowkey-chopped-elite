"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ScrollText, 
  Loader2, 
  X, 
  ExternalLink, 
  BookOpen 
} from "lucide-react";

interface MangaItem {
  id: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    status: string;
    year?: number;
    tags: { attributes: { name: { en: string } } }[];
  };
  relationships: {
    id: string;
    type: string;
    attributes?: { fileName?: string };
  }[];
}

export default function MangaPage() {
  const [items, setItems] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedManga, setSelectedManga] = useState<MangaItem | null>(null);

  const fetchManga = async (action: string, query?: string) => {
    setLoading(true);
    try {
      let url = `/api/entertainment/manga?action=${action}`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.data) {
        setItems(data.data);
      }
    } catch (err) {
      console.error("Manga fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManga("popular");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    fetchManga("search", search);
  };

  const getCoverUrl = (manga: MangaItem) => {
    const coverRel = manga.relationships.find((r) => r.type === "cover_art");
    if (coverRel && coverRel.attributes?.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`;
    }
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";
  };

  const getTitle = (manga: MangaItem) => {
    const t = manga.attributes.title;
    return t.en || t["ja-ro"] || Object.values(t)[0] || "Untitled Manga";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Manga Catalog</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Explore manga series via server-side MangaDex API proxy.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search manga titles..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Fetching MangaDex catalog...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-base font-medium text-zinc-300">No manga found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((manga) => {
            const title = getTitle(manga);
            const cover = getCoverUrl(manga);

            return (
              <div
                key={manga.id}
                onClick={() => setSelectedManga(manga)}
                className="group relative bg-[#130f22] border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
              >
                <div className="relative w-full aspect-[2/3] bg-[#0b0814] overflow-hidden">
                  <img
                    src={cover}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-zinc-300 border border-white/10 capitalize">
                    {manga.attributes.status}
                  </span>
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                      {title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1 capitalize">
                      {manga.attributes.tags?.[0]?.attributes?.name?.en || "Manga"}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-400 font-medium">
                    <span>Read Info</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manga Details Modal */}
      {selectedManga && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#130f24] border border-white/10 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedManga(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={getCoverUrl(selectedManga)}
                alt={getTitle(selectedManga)}
                className="w-32 sm:w-44 aspect-[2/3] object-cover rounded-xl shadow-xl shrink-0 self-center sm:self-start"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {getTitle(selectedManga)}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] uppercase font-semibold">
                    {selectedManga.attributes.status}
                  </span>
                  {selectedManga.attributes.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 text-[10px]"
                    >
                      {tag.attributes.name.en}
                    </span>
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed line-clamp-6">
                  {selectedManga.attributes.description?.en ||
                    Object.values(selectedManga.attributes.description || {})[0] ||
                    "No description provided."}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <a
                    href={`https://mangadex.org/title/${selectedManga.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read on MangaDex</span>
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
