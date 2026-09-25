"use client";

import { useState, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  RotateCw, 
  Maximize2, 
  Cpu, 
  ExternalLink,
  ShieldCheck,
  Power
} from "lucide-react";

export default function VMPage() {
  const [vmKey, setVmKey] = useState(0);
  const [selectedOS, setSelectedOS] = useState<"v86-linux" | "jslinux" | "freedos">("v86-linux");
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Real WebAssembly VMs proxied through serverside backend
  const osFrames = {
    "v86-linux": "/api/vm/proxy?profile=linux26",
    "jslinux": "https://bellard.org/jslinux/vm.html?url=alpine-x86.cfg&mem=256",
    "freedos": "/api/vm/proxy?profile=freedos",
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <TerminalIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Cloud VM</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Run real WebAssembly Linux and FreeDOS virtual machines with full root access in your browser.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 bg-[#130f24] border border-white/10 px-4 py-2 rounded-xl text-xs text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-white">WASM Emulator:</span>
          <span className="text-cyan-300">Online</span>
          <span className="text-zinc-600">|</span>
          <Cpu className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400">Isolated Sandbox</span>
        </div>
      </div>

      {/* Main VM Container */}
      <div
        ref={containerRef}
        className="bg-[#0f0c1c] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[75vh]"
      >
        {/* Top Machine Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#141026] border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* OS Selector Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
              <button
                onClick={() => setSelectedOS("v86-linux")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedOS === "v86-linux"
                    ? "bg-cyan-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                v86 Linux (x86)
              </button>
              <button
                onClick={() => setSelectedOS("jslinux")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedOS === "jslinux"
                    ? "bg-cyan-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Alpine Linux (JSLinux)
              </button>
              <button
                onClick={() => setSelectedOS("freedos")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedOS === "freedos"
                    ? "bg-cyan-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                FreeDOS (x86)
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVmKey((k) => k + 1)}
              title="Reboot VM"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reboot</span>
            </button>

            <button
              onClick={toggleFullscreen}
              title="Fullscreen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* VM Sandbox Display */}
        <div className="flex-1 w-full h-full bg-black relative overflow-hidden">
          <iframe
            key={`${selectedOS}-${vmKey}`}
            src={osFrames[selectedOS]}
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; clipboard-read; clipboard-write; keyboard-map"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-downloads"
            title="Real WebAssembly Virtual Machine"
          />
        </div>
      </div>

      {/* Info & Specs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#120e24] border border-white/10 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">Client-Side Isolation</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Code and filesystem execute entirely in a WebAssembly sandbox inside your browser with zero leakage.
            </p>
          </div>
        </div>

        <div className="bg-[#120e24] border border-white/10 rounded-xl p-4 flex items-start gap-3">
          <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">Real x86 Instruction Set</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Accurately emulates an x86 processor running authentic Linux kernels, compilers, and utilities.
            </p>
          </div>
        </div>

        <div className="bg-[#120e24] border border-white/10 rounded-xl p-4 flex items-start gap-3">
          <Power className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">Proxied Backend Assets</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              All BIOS, WASM runtimes, and disk images are fetched through the LCE server-side proxy on Vercel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
