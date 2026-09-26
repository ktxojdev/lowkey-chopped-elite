"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  ArrowUp, 
  Command as CommandIcon,
  Heart,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

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
      openCommandPalette();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative min-h-[calc(100vh-5rem)]">
      {/* Brand Title */}
      <div className="text-center mb-8 select-none">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-sm lowercase">
          lowkey chopped elite
        </h1>
      </div>

      {/* Main Search Input Form */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-2xl relative flex items-center group"
      >
        <div 
          className="w-full flex items-center bg-[#141022]/90 border border-white/10 group-focus-within:border-purple-500/50 rounded-full px-5 py-3.5 shadow-2xl transition-all duration-300 backdrop-blur-xl group-focus-within:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
        >
          <Search className="w-5 h-5 text-zinc-500 mr-3.5 transition-colors group-focus-within:text-purple-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
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

      {/* Footer / Human Authorship & Credits */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-xs">
        <Link 
          href="/settings#credits" 
          className="inline-flex items-center gap-2 hover:text-white transition-all py-1.5 px-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 shadow-lg backdrop-blur-md group"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-zinc-300 group-hover:text-white transition-colors">100% Built by Humans, Not AI</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 group-hover:text-purple-300 transition-colors">Team: turg, c2x86, fanu, sharwie</span>
        </Link>
      </div>
    </div>
  );
}
