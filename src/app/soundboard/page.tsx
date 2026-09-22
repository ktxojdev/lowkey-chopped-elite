"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Plus, 
  Sparkles, 
  Music, 
  Sliders,
  Trash2
} from "lucide-react";

interface SoundItem {
  id: string;
  name: string;
  key: string;
  category: string;
  color: string;
  frequency?: number;
  type?: OscillatorType;
  audioUrl?: string;
}

const DEFAULT_SOUNDS: SoundItem[] = [
  { id: "1", name: "Victory Fanfare", key: "1", category: "Gaming", color: "#8b5cf6", frequency: 587.33, type: "sine" },
  { id: "2", name: "8-Bit Jump", key: "2", category: "Retro", color: "#ec4899", frequency: 392.00, type: "square" },
  { id: "3", name: "Laser Blast", key: "3", category: "Effects", color: "#3b82f6", frequency: 880.00, type: "sawtooth" },
  { id: "4", name: "Level Up", key: "4", category: "Gaming", color: "#10b981", frequency: 523.25, type: "triangle" },
  { id: "5", name: "Coin Pickup", key: "5", category: "Retro", color: "#f59e0b", frequency: 987.77, type: "sine" },
  { id: "6", name: "Power Down", key: "6", category: "Effects", color: "#ef4444", frequency: 220.00, type: "sawtooth" },
  { id: "7", name: "Boss Alert", key: "Q", category: "Gaming", color: "#a855f7", frequency: 311.13, type: "square" },
  { id: "8", name: "Airhorn Pulse", key: "W", category: "Memes", color: "#06b6d4", frequency: 466.16, type: "sawtooth" },
  { id: "9", name: "Teleport Warp", key: "E", category: "Effects", color: "#14b8a6", frequency: 739.99, type: "sine" },
  { id: "10", name: "Critical Hit", key: "R", category: "Gaming", color: "#f43f5e", frequency: 659.25, type: "square" },
  { id: "11", name: "Game Over", key: "T", category: "Retro", color: "#64748b", frequency: 196.00, type: "sawtooth" },
  { id: "12", name: "Success Chime", key: "Y", category: "Memes", color: "#84cc16", frequency: 1046.50, type: "sine" },
];

const CATEGORIES = ["All", "Gaming", "Retro", "Effects", "Memes", "Custom"];

export default function SoundboardPage() {
  const [sounds, setSounds] = useState<SoundItem[]>(DEFAULT_SOUNDS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSynthSound = (sound: SoundItem) => {
    if (muted) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = sound.type || "sine";
    const baseFreq = sound.frequency || 440;
    osc.frequency.setValueAtTime(baseFreq, now);

    // Dynamic pitch envelope based on sound name
    if (sound.name.includes("Jump")) {
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.15);
    } else if (sound.name.includes("Laser")) {
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.2, now + 0.2);
    } else if (sound.name.includes("Coin")) {
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.08);
    } else if (sound.name.includes("Level")) {
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.setValueAtTime(baseFreq * 1.25, now + 0.1);
      osc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.2);
    }

    // Volume Envelope
    const effectiveVol = volume;
    gain.gain.setValueAtTime(effectiveVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);

    setActivePlayingId(sound.id);
    setTimeout(() => setActivePlayingId((cur) => (cur === sound.id ? null : cur)), 450);
  };

  const playSound = (sound: SoundItem) => {
    if (sound.audioUrl) {
      if (muted) return;
      const audio = new Audio(sound.audioUrl);
      audio.volume = volume;
      audio.play();
      setActivePlayingId(sound.id);
      audio.onended = () => setActivePlayingId(null);
    } else {
      playSynthSound(sound);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["input", "textarea"].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      const pressedKey = e.key.toUpperCase();
      const match = sounds.find((s) => s.key.toUpperCase() === pressedKey);
      if (match) {
        playSound(match);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sounds, volume, muted]);

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const soundUrl = URL.createObjectURL(file);
    const newSound: SoundItem = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      key: (sounds.length + 1).toString().slice(-1),
      category: "Custom",
      color: "#ec4899",
      audioUrl: soundUrl,
    };
    setSounds((prev) => [...prev, newSound]);
  };

  const filteredSounds = sounds.filter((s) => {
    if (activeCategory === "All") return true;
    return s.category === activeCategory;
  });

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header & Volume Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-7 h-7 text-purple-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white">LCE Soundboard</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            Trigger studio effects, game audio and memes instantly. Press highlighted keyboard keys or click.
          </p>
        </div>

        {/* Master Audio Controller */}
        <div className="flex items-center gap-3 bg-[#130f24] border border-white/10 rounded-full px-4 py-2 shadow-xl">
          <button
            onClick={() => setMuted(!muted)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (muted) setMuted(false);
            }}
            className="w-24 accent-purple-500 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">
            {muted ? "0%" : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* Category Pills & Upload */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-[#161226] text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomAudioUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white whitespace-nowrap transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Sound</span>
          </button>
        </div>
      </div>

      {/* Soundboard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredSounds.map((s) => {
          const isPlaying = activePlayingId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => playSound(s)}
              className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 text-left group overflow-hidden ${
                isPlaying
                  ? "bg-purple-600/30 border-purple-400 scale-[0.98] shadow-lg shadow-purple-600/40"
                  : "bg-[#130f24] border-white/5 hover:border-purple-500/40 hover:bg-[#1b1532]"
              }`}
            >
              {/* Keyboard Hotkey Badge */}
              <div className="flex items-center justify-between w-full mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-mono font-bold text-zinc-300 group-hover:text-purple-300">
                  {s.key}
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-zinc-200 group-hover:text-white truncate">
                  {s.name}
                </h3>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 block">
                  {s.category}
                </span>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-end gap-1 h-4 mt-3 w-full opacity-60 group-hover:opacity-100">
                <span
                  className={`w-1 bg-purple-400 rounded-full transition-all ${
                    isPlaying ? "h-4 animate-pulse" : "h-1"
                  }`}
                />
                <span
                  className={`w-1 bg-purple-400 rounded-full transition-all ${
                    isPlaying ? "h-3 animate-bounce" : "h-2"
                  }`}
                />
                <span
                  className={`w-1 bg-purple-400 rounded-full transition-all ${
                    isPlaying ? "h-4 animate-pulse" : "h-1.5"
                  }`}
                />
                <span
                  className={`w-1 bg-purple-400 rounded-full transition-all ${
                    isPlaying ? "h-2 animate-bounce" : "h-1"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
