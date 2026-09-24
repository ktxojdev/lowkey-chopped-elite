"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Terminal as TerminalIcon, 
  Play, 
  RotateCw, 
  Maximize2, 
  Cpu, 
  HardDrive, 
  ExternalLink,
  ShieldCheck,
  Power,
  Layers,
  Settings
} from "lucide-react";

export default function VMPage() {
  const [vmActive, setVmActive] = useState(true);
  const [vmKey, setVmKey] = useState(0);
  const [selectedOS, setSelectedOS] = useState<"v86-linux" | "jslinux" | "wasm-terminal">("v86-linux");
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Terminal commands interactive state
  const [termOutput, setTermOutput] = useState<string[]>([
    "LCE WebAssembly Hypervisor v2.4 (x86_64 WASM)",
    "Initializing sandboxed WebAssembly memory segment: 512 MB...",
    "Mounting virtual rootfs (ext2 virtual disk)...",
    "Security sandbox: Enabled (Origin-isolated, No-leakage)",
    "Type 'help' to view available VM utilities.",
    "",
  ]);
  const [termInput, setTermInput] = useState("");
  const termEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [termOutput]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termInput.trim()) return;

    const cmd = termInput.trim();
    const args = cmd.split(" ");
    const base = args[0].toLowerCase();

    let reply = "";
    switch (base) {
      case "help":
        reply = "Available commands: help, uname, neofetch, ls, date, clear, echo, top, lce, whoami";
        break;
      case "uname":
        reply = "Linux lce-wasm-node 6.6.0-wasm-virt #1 SMP PREEMPT x86_64 GNU/Linux";
        break;
      case "neofetch":
        reply = `   .-.       OS: Lowkey Chopped Elite WASM Linux\n  oo|        Kernel: 6.6.0-lce-wasm\n /` + `''` + `\\       Uptime: 42 mins\n(\\   /)      Packages: 420 (wasm-pkgs)\n \`~.~'       Memory: 184MB / 512MB (WASM Isolated)\n             Architecture: x86 / RISC-V Hybrid`;
        break;
      case "ls":
        reply = "bin   dev   etc   home   lib   proc   root   sys   tmp   usr   var";
        break;
      case "whoami":
        reply = "root (lce-guest-sandbox)";
        break;
      case "date":
        reply = new Date().toUTCString();
        break;
      case "top":
        reply = "Tasks: 12 total, 1 running, 11 sleeping | CPU: 0.8% | Mem: 35.8% used";
        break;
      case "lce":
        reply = "Lowkey Chopped Elite (LCE) - Hypervisor active and proxied.";
        break;
      case "clear":
        setTermOutput([]);
        setTermInput("");
        return;
      default:
        reply = `bash: command not found: ${base}. Type 'help' for commands.`;
    }

    setTermOutput((prev) => [...prev, `$ ${cmd}`, reply, ""]);
    setTermInput("");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  // VM embed URLs
  const osFrames = {
    "v86-linux": "https://copy.sh/v86/?profile=linux26",
    "jslinux": "https://bellard.org/jslinux/vm.html?url=alpine-x86.cfg&mem=256",
    "wasm-terminal": "internal",
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
            Run an isolated WebAssembly Linux virtual machine directly in your browser.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 bg-[#130f24] border border-white/10 px-4 py-2 rounded-xl text-xs text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-white">WASM Kernel:</span>
          <span className="text-cyan-300">Active</span>
          <span className="text-zinc-600">|</span>
          <Cpu className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400">512MB RAM</span>
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
                v86 Linux WASM
              </button>
              <button
                onClick={() => setSelectedOS("jslinux")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedOS === "jslinux"
                    ? "bg-cyan-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Alpine Linux
              </button>
              <button
                onClick={() => setSelectedOS("wasm-terminal")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedOS === "wasm-terminal"
                    ? "bg-cyan-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                LCE Shell
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
          {selectedOS === "wasm-terminal" ? (
            /* Interactive WebAssembly Shell Terminal */
            <div className="w-full h-full p-4 font-mono text-xs text-green-400 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-1">
                {termOutput.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap leading-relaxed">
                    {line}
                  </div>
                ))}
                <div ref={termEndRef} />
              </div>

              <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4 pt-2 border-t border-white/10">
                <span className="text-cyan-400 font-bold">root@lce-wasm:~#</span>
                <input
                  type="text"
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  placeholder="type a command (help, neofetch, ls, whoami)..."
                  className="bg-transparent border-none outline-none text-white w-full font-mono text-xs placeholder-zinc-600"
                  autoFocus
                />
              </form>
            </div>
          ) : (
            /* Embedded x86/RISC-V WebAssembly Container */
            <iframe
              key={`${selectedOS}-${vmKey}`}
              src={osFrames[selectedOS]}
              title="LCE WebAssembly Virtual Machine"
              className="w-full h-full border-none"
              allow="autoplay; fullscreen; clipboard-read; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>
      </div>
    </div>
  );
}
