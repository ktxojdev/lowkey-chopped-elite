"use client";

import { useState, useEffect } from "react";
import { 
  Tv, 
  Play, 
  Radio, 
  Layers, 
  Volume2, 
  VolumeX, 
  Maximize2,
  ExternalLink
} from "lucide-react";
import type { LiveChannel } from "@/app/api/entertainment/livetv/route";

export default function LiveTVPage() {
  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<LiveChannel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entertainment/livetv")
      .then((res) => res.json())
      .then((data) => {
        if (data.channels) {
          setChannels(data.channels);
          setActiveChannel(data.channels[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Tv className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Live Broadcasts & TV</h1>
        </div>
        <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
          Watch 24/7 public livestreams, news, science, and esports broadcasts.
        </p>
      </div>

      {activeChannel && (
        <div className="bg-[#110d21] border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {/* Main Video Screen Container */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {activeChannel.streamUrl.endsWith(".m3u8") ? (
              <video
                key={activeChannel.id}
                src={activeChannel.streamUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-black via-zinc-950 to-zinc-900">
                <img
                  src={activeChannel.logo}
                  alt={activeChannel.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-2xl mb-4 border border-white/10"
                />
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs uppercase font-bold text-red-400 tracking-wider">LIVE NOW</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white max-w-lg">
                  {activeChannel.currentShow}
                </h2>
                <p className="text-xs text-zinc-400 max-w-md mt-2">
                  {activeChannel.description}
                </p>
                <a
                  href={activeChannel.streamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Live Stream Feed</span>
                </a>
              </div>
            )}
          </div>

          {/* Current Channel Info Bar */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161228] border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img src={activeChannel.logo} alt={activeChannel.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">{activeChannel.name}</h3>
                  <span className="px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                    {activeChannel.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{activeChannel.currentShow}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeChannel.streamUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>External Link</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Channels List */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Channel Guide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {channels.map((ch) => {
            const isSelected = activeChannel?.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => setActiveChannel(ch)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-900/30 border-purple-500/50 shadow-md shadow-purple-900/20"
                    : "bg-[#141022] border-white/5 hover:border-white/15 hover:bg-[#1b162f]"
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                  <img src={ch.logo} alt={ch.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white truncate">{ch.name}</h4>
                    <span className="text-[10px] text-zinc-500 shrink-0">{ch.category}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{ch.currentShow}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
