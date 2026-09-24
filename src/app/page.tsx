"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ArrowUp, 
  Plus, 
  Sparkles,
  Command as CommandIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Bookmark {
  id: string;
  name: string;
  url: string;
  color?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "1", name: "Activities", url: "/games", color: "#a855f7" },
    { id: "2", name: "Movies & TV", url: "/entertainment/movies", color: "#3b82f6" },
    { id: "3", name: "Live TV", url: "/entertainment/live", color: "#f59e0b" },
    { id: "4", name: "ChoppedAI", url: "/ai", color: "#ec4899" },
    { id: "5", name: "Soundboard", url: "/soundboard", color: "#10b981" },
    { id: "6", name: "Cloud VM", url: "/vm", color: "#06b6d4" },
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
    } catch {
      // Ignore localstorage errors
    }
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-lce-command"));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      openCommandPalette();
      return;
    }

    const trimmed = query.trim().toLowerCase();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      window.open(trimmed, "_blank");
      return;
    }

    // Direct routing for key terms
    if (trimmed.includes("game") || trimmed.includes("activit") || trimmed.includes("play")) {
      router.push(`/games?q=${encodeURIComponent(query.trim())}`);
    } else if (trimmed.includes("movie") || trimmed.includes("show") || trimmed.includes("stream")) {
      router.push(`/entertainment/movies?q=${encodeURIComponent(query.trim())}`);
    } else if (trimmed.includes("live") || trimmed.includes("tv") || trimmed.includes("channel")) {
      router.push(`/entertainment/live`);
    } else if (trimmed.includes("book") || trimmed.includes("read")) {
      router.push(`/entertainment/books?q=${encodeURIComponent(query.trim())}`);
    } else if (trimmed.includes("ai") || trimmed.includes("chat") || trimmed.includes("gpt")) {
      router.push(`/ai`);
    } else if (trimmed.includes("sound") || trimmed.includes("meme") || trimmed.includes("audio")) {
      router.push(`/soundboard?q=${encodeURIComponent(query.trim())}`);
    } else if (trimmed.includes("vm") || trimmed.includes("linux") || trimmed.includes("wasm")) {
      router.push(`/vm`);
    } else {
      // Open command menu with query or duckduckgo
      openCommandPalette();
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
        color: "#a855f7",
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
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative min-h-[calc(100vh-5rem)]">
      {/* Brand Title */}
      <div className="text-center mb-8 select-none">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-sm">
          LCE
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm mt-2 tracking-widest uppercase font-medium">
          Lowkey Chopped Elite
        </p>
      </div>

      {/* Main Search Input Form with Command Trigger */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-2xl relative flex items-center group"
      >
        <div 
          onClick={() => {
            // When user clicks the search input or bar, they can also press Ctrl+K
          }}
          className="w-full flex items-center bg-[#141022]/90 border border-white/10 group-focus-within:border-purple-500/50 rounded-full px-5 py-3.5 shadow-2xl transition-all duration-300 backdrop-blur-xl group-focus-within:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
        >
          <Search className="w-5 h-5 text-zinc-500 mr-3.5 transition-colors group-focus-within:text-purple-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities, movies, TV, AI, pages, or web..."
            className="bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-base md:text-lg w-full"
          />
          
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-400 text-xs hover:text-white transition-colors mr-2 shrink-0"
            title="Press Ctrl+K or Cmd+K"
          >
            <CommandIcon className="w-3 h-3" />
            <span>K</span>
          </button>

          <button
            type="submit"
            aria-label="Search"
            className="w-9 h-9 rounded-full bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 hover:border-purple-400 flex items-center justify-center transition-all duration-200 shrink-0 group/btn shadow-md"
          >
            <ArrowUp className="w-4 h-4 text-purple-300 group-hover/btn:text-white transition-colors" />
          </button>
        </div>
      </form>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-2xl">
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
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181328]/80 hover:bg-[#231b3a] border border-white/5 hover:border-purple-500/30 text-xs md:text-sm text-zinc-300 hover:text-white cursor-pointer transition-all duration-200 shadow-md hover:shadow-purple-900/20"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: b.color || "#a855f7" }}
            />
            <span>{b.name}</span>
            <button
              onClick={(e) => removeBookmark(b.id, e)}
              className="opacity-0 group-hover:opacity-60 hover:!opacity-100 ml-1 text-zinc-400 text-xs hover:text-red-400"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-xs md:text-sm text-zinc-400 hover:text-zinc-200 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add bookmark</span>
        </button>
      </div>

      {/* Add Bookmark Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-[#151125] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Add Custom Shortcut</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Title</label>
              <Input
                placeholder="e.g. YouTube or My Activity"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-[#0d0a17] border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">URL or Route</label>
              <Input
                placeholder="https://... or /games"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="bg-[#0d0a17] border-white/10 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="border-white/10 text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={addBookmark}
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
            >
              Save Shortcut
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
