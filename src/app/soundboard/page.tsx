"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Search,
  Sparkles, 
  Flame,
  Star,
  Loader2,
  RefreshCw,
  Sliders,
  Music
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MyInstantSound {
  id: string;
  title: string;
  url?: string;
  mp3: string;
}

const PRESET_TAGS = ["Trending", "Meme", "Anime", "Gaming", "Vine", "Discord", "Movie", "Loud"];

export default function SoundboardPage() {
  const [sounds, setSounds] = useState<MyInstantSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("Trending");
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchSounds = async (query = "", tag = "Trending") => {
    setLoading(true);
    try {
      let endpoint = "/api/soundboard/myinstants";
      if (query.trim()) {
        endpoint += `?search=${encodeURIComponent(query.trim())}`;
      } else if (tag === "Trending") {
        endpoint += `?mode=trending`;
      } else {
        endpoint += `?search=${encodeURIComponent(tag.toLowerCase())}`;
      }

      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.sounds) {
        setSounds(data.sounds);
      }
    } catch (err) {
      console.error("Failed to load sounds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load favorites from localstorage
    try {
      const saved = localStorage.getItem("lce_sound_favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}

    fetchSounds("", "Trending");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setActiveTag("");
    fetchSounds(search.trim());
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    setSearch("");
    fetchSounds("", tag);
  };

  const playSound = (sound: MyInstantSound) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (currentlyPlaying === sound.id) {
      setCurrentlyPlaying(null);
      return;
    }

    const audio = new Audio(sound.mp3);
    audio.volume = muted ? 0 : volume;
    audioRef.current = audio;
    setCurrentlyPlaying(sound.id);

    audio.play().catch((err) => {
      console.error("Playback error:", err);
      setCurrentlyPlaying(null);
    });

    audio.onended = () => {
      setCurrentlyPlaying(null);
    };
  };

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentlyPlaying(null);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem("lce_sound_favorites", JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-8 h-8 text-pink-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Soundboard</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Stream and play thousands of trending sound effects powered by MyInstants API.
          </p>
        </div>

        {/* Master Controls & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Master Volume */}
          <div className="flex items-center gap-2 bg-[#130f24] border border-white/10 px-3.5 py-1.5 rounded-full shadow-inner">
            <button
              onClick={() => setMuted(!muted)}
              className="text-zinc-400 hover:text-white transition-colors"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-purple-400" />
              )}
            </button>
            <div className="w-20">
              <Slider
                value={[muted ? 0 : volume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => {
                  setVolume(val[0] / 100);
                  if (muted) setMuted(false);
                }}
              />
            </div>
            <span className="text-[11px] font-mono text-zinc-400 w-7 text-right">
              {muted ? "0%" : `${Math.round(volume * 100)}%`}
            </span>
          </div>

          {/* Stop All Button */}
          <button
            onClick={stopAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-red-400" />
            <span>Stop Audio</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Chips */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search thousands of sounds..."
            className="w-full bg-[#141024] border border-white/10 focus:border-pink-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
        </form>

        {/* Preset Category Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_TAGS.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-pink-600 text-white shadow-md shadow-pink-600/30 border border-pink-400/40"
                    : "bg-[#141024] text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sounds Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-pink-400 mb-3" />
          <p className="text-sm">Fetching real sounds via MyInstants proxy...</p>
        </div>
      ) : sounds.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <Music className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-medium text-zinc-300">No sounds found</p>
          <p className="text-xs text-zinc-500 mt-1">Try another search term or click Trending.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {sounds.map((sound, idx) => {
            const isPlaying = currentlyPlaying === sound.id;
            const isFav = favorites.includes(sound.id);

            // Generate deterministic pleasant button gradient
            const hue = (idx * 37) % 360;

            return (
              <div
                key={sound.id || idx}
                onClick={() => playSound(sound)}
                className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-between text-center select-none ${
                  isPlaying
                    ? "bg-pink-950/40 border-pink-500 shadow-xl shadow-pink-500/20 scale-105"
                    : "bg-[#130f24] border-white/5 hover:border-pink-500/40 hover:bg-[#1c1633] hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {/* Favorite Star Button */}
                <button
                  onClick={(e) => toggleFavorite(sound.id, e)}
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-zinc-500 hover:text-amber-400 transition-colors z-10"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isFav ? "fill-amber-400 text-amber-400" : ""
                    }`}
                  />
                </button>

                {/* Big Instant Button Pad */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-lg transition-all duration-300 ${
                    isPlaying
                      ? "ring-4 ring-pink-400 ring-offset-2 ring-offset-[#130f24] scale-110 animate-pulse"
                      : "group-hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: `hsl(${hue}, 70%, 45%)`,
                    boxShadow: isPlaying
                      ? `0 0 25px hsl(${hue}, 80%, 60%)`
                      : `0 4px 15px rgba(0,0,0,0.5)`,
                  }}
                >
                  {isPlaying ? (
                    <Square className="w-5 h-5 fill-white text-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                  )}
                </div>

                {/* Sound Title */}
                <div className="w-full">
                  <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white line-clamp-2 leading-tight">
                    {sound.title}
                  </h3>
                </div>

                {/* Status indicator bar */}
                <div className="w-full mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{isPlaying ? "PLAYING" : "READY"}</span>
                  <span className="text-pink-400">MP3</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
