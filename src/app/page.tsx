"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ArrowUp, 
  Plus, 
  ExternalLink, 
  Gamepad2, 
  Sparkles, 
  Film, 
  Volume2, 
  BookOpen, 
  Layers 
} from "lucide-react";

interface Bookmark {
  id: string;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentTab, setRecentTab] = useState<{ title: string; href: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "1", name: "Games Catalog", url: "/games", color: "#ec4899" },
    { id: "2", name: "Movies & TV", url: "/entertainment/movies", color: "#3b82f6" },
    { id: "3", name: "AI Studio", url: "/ai", color: "#a855f7" },
    { id: "4", name: "Soundboard", url: "/soundboard", color: "#10b981" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("lce_bookmarks");
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
      const lastSession = localStorage.getItem("lce_last_visited");
      if (lastSession) {
        setRecentTab(JSON.parse(lastSession));
      } else {
        setRecentTab({ title: "Featured Games in GN Catalog", href: "/games" });
      }
    } catch {
      // Ignore localstorage errors
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if query is URL or search
    const trimmed = query.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      window.open(trimmed, "_blank");
    } else {
      // Navigate to games/entertainment or search duckduckgo
      if (trimmed.toLowerCase().includes("game")) {
        router.push(`/games?q=${encodeURIComponent(trimmed)}`);
      } else if (trimmed.toLowerCase().includes("movie") || trimmed.toLowerCase().includes("show")) {
        router.push(`/entertainment/movies?q=${encodeURIComponent(trimmed)}`);
      } else if (trimmed.toLowerCase().includes("book")) {
        router.push(`/entertainment/books?q=${encodeURIComponent(trimmed)}`);
      } else {
        window.open(`https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`, "_blank");
      }
    }
  };

  const addBookmark = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const updated = [
      ...bookmarks,
      {
        id: Date.now().toString(),
        name: newTitle.trim(),
        url: newUrl.trim(),
        color: "#8b5cf6",
      },
    ];
    setBookmarks(updated);
    try {
      localStorage.setItem("lce_bookmarks", JSON.stringify(updated));
    } catch {}
    setNewTitle("");
    setNewUrl("");
    setShowAddModal(false);
  };

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    try {
      localStorage.setItem("lce_bookmarks", JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative min-h-[calc(100vh-5rem)] pb-24">
      {/* Brand Title */}
      <div className="text-center mb-8 select-none">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
          LCE
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm mt-1 tracking-wider uppercase font-medium">
          Lowkey Chopped Elite
        </p>
      </div>

      {/* Main Search Input Form */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-2xl relative flex items-center group"
      >
        <div className="w-full flex items-center bg-[#141022]/90 border border-white/10 group-focus-within:border-purple-500/50 rounded-full px-5 py-3.5 shadow-2xl transition-all duration-300 backdrop-blur-xl group-focus-within:shadow-[0_0_25px_rgba(168,85,247,0.2)]">
          <Search className="w-5 h-5 text-zinc-500 mr-3.5 transition-colors group-focus-within:text-purple-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything!"
            className="bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-base md:text-lg w-full"
          />
          <button
            type="submit"
            aria-label="Search"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-600/80 border border-white/10 hover:border-purple-400 flex items-center justify-center transition-all duration-200 shrink-0 ml-2 group/btn"
          >
            <ArrowUp className="w-4 h-4 text-zinc-400 group-hover/btn:text-white transition-colors" />
          </button>
        </div>
      </form>

      {/* Bookmarks / Quick Action Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 max-w-2xl">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            onClick={() => {
              if (b.url.startsWith("/")) {
                router.push(b.url);
              } else {
                window.open(b.url, "_blank");
              }
            }}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#181328]/80 hover:bg-[#231b3a] border border-white/5 hover:border-purple-500/30 text-xs md:text-sm text-zinc-300 hover:text-white cursor-pointer transition-all duration-200 shadow-md hover:shadow-purple-900/20"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: b.color || "#a855f7" }}
            />
            <span>{b.name}</span>
            <button
              onClick={(e) => removeBookmark(b.id, e)}
              className="opacity-0 group-hover:opacity-60 hover:!opacity-100 ml-1 text-zinc-400 text-xs"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-xs md:text-sm text-zinc-400 hover:text-zinc-200 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add bookmark</span>
        </button>
      </div>

      {/* Quick Launch Cards Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-3xl">
        <div 
          onClick={() => router.push("/games")}
          className="p-4 rounded-2xl bg-[#131021]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#1c1730]/90 transition-all duration-200 cursor-pointer group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-200 mb-2.5">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white">Games</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">GN Math Catalog</p>
        </div>

        <div 
          onClick={() => router.push("/entertainment/movies")}
          className="p-4 rounded-2xl bg-[#131021]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#1c1730]/90 transition-all duration-200 cursor-pointer group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-200 mb-2.5">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white">Entertainment</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Movies, Anime & Live</p>
        </div>

        <div 
          onClick={() => router.push("/ai")}
          className="p-4 rounded-2xl bg-[#131021]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#1c1730]/90 transition-all duration-200 cursor-pointer group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-200 mb-2.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white">AI Studio</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Chat, Vision & Tools</p>
        </div>

        <div 
          onClick={() => router.push("/soundboard")}
          className="p-4 rounded-2xl bg-[#131021]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#1c1730]/90 transition-all duration-200 cursor-pointer group flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-200 mb-2.5">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white">Soundboard</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Audio & FX Player</p>
        </div>
      </div>

      {/* Floating Bottom Resume Pill (Matches Image 1) */}
      {recentTab && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div
            onClick={() => router.push(recentTab.href)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#161225]/90 hover:bg-[#201a35] border border-white/10 hover:border-purple-500/40 shadow-2xl backdrop-blur-xl cursor-pointer transition-all duration-200 group"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-purple-400 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Resume open session
              </span>
              <span className="text-xs text-zinc-200 font-medium group-hover:text-white">
                {recentTab.title}
              </span>
            </div>
            <span className="text-zinc-500 group-hover:text-zinc-300 ml-2 text-sm font-bold">
              ›
            </span>
          </div>
        </div>
      )}

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151125] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Add Custom Bookmark</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. YouTube or My Link"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0d0a17] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">URL or Internal Path</label>
                <input
                  type="text"
                  placeholder="https://... or /games"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#0d0a17] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2.5 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addBookmark}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-medium text-white shadow-lg shadow-purple-600/30 transition-colors"
              >
                Add Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
