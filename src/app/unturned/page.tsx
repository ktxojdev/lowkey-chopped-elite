"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  Gamepad2, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ArrowLeft, 
  ShieldAlert, 
  Crosshair, 
  Compass, 
  Car,
  Volume2
} from "lucide-react";

export default function UnturnedPage() {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handlePanic = () => {
    window.location.href = "https://classroom.google.com";
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col w-full h-[100dvh] bg-black text-white overflow-hidden select-none"
    >
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#0f0c1b] border-b border-white/10 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Games</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-black text-xs">
              U
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-sky-400">
              UNTURNED WEB
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-950 text-green-300 border border-green-800">
              3D SURVIVAL
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Controls</span>
          </button>

          <button
            onClick={() => setIframeKey((k) => k + 1)}
            title="Reload Unturned"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Reload</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span className="hidden md:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>

          <button
            onClick={handlePanic}
            title="Panic Button (Escape to Classroom)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-xs font-bold text-red-300 hover:text-red-100 border border-red-800/60 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Panic (Esc)</span>
          </button>
        </div>
      </header>

      {/* Main Game Frame */}
      <main className="relative flex-1 w-full h-full bg-black">
        <iframe
          key={iframeKey}
          src="/unturned/index.html"
          className="w-full h-full border-0"
          allow="fullscreen; gamepad; autoplay"
          title="Unturned Web Game"
        />

        {/* Controls Overlay Helper */}
        {showControls && (
          <div className="absolute top-4 right-4 z-30 max-w-sm p-4 rounded-xl bg-[#0f0c1b]/95 border border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold text-zinc-200 border-b border-white/10 pb-1.5">
              <span>Unturned Controls Reference</span>
              <button
                onClick={() => setShowControls(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-zinc-300 pt-1">
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">WASD</kbd> Move / Drive</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">Shift</kbd> Sprint</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">Space</kbd> Jump / Handbrake</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">L-Click</kbd> Attack / Shoot</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">R-Click</kbd> Aim Down Sights</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">R</kbd> Reload Gun</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">F / E</kbd> Interact / Drive</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">Tab / G</kbd> Backpack / Craft</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">V</kbd> 1st / 3rd Person</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">L</kbd> Lights / Flashlight</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">H</kbd> Car Horn</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">1-5</kbd> Select Hotbar</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
