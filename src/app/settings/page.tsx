"use client";

import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Film, 
  Volume2, 
  Bot, 
  ShieldCheck, 
  Download, 
  Upload, 
  Trash2, 
  Save, 
  Check, 
  Sparkles,
  Sliders,
  Tv,
  Heart,
  Users,
  Code2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ACCENT_COLORS = [
  { name: "Violet", hex: "#a855f7" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Blue", hex: "#3b82f6" },
];

export default function SettingsPage() {
  // Theme & Visuals
  const [accent, setAccent] = useState("#a855f7");
  const [glassBlur, setGlassBlur] = useState(true);
  const [glowEffects, setGlowEffects] = useState(true);

  // Streaming & Media
  const [streamProvider, setStreamProvider] = useState("cinesrc");
  const [autoMuteStreams, setAutoMuteStreams] = useState(false);
  const [preferredResolution, setPreferredResolution] = useState("1080p");

  // AI Settings
  const [ollamaUrl, setOllamaUrl] = useState("http://127.0.0.1:11434");
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiModel, setAiModel] = useState("standard");

  // Audio Settings
  const [masterVolume, setMasterVolume] = useState(85);
  const [soundEffects, setSoundEffects] = useState(true);

  // State feedback
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [tabCloak, setTabCloak] = useState("default");

  useEffect(() => {
    try {
      const savedCloak = localStorage.getItem("lce_tab_cloak");
      if (savedCloak) setTabCloak(savedCloak);

      const saved = localStorage.getItem("lce_user_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accent) setAccent(parsed.accent);
        if (parsed.glassBlur !== undefined) setGlassBlur(parsed.glassBlur);
        if (parsed.glowEffects !== undefined) setGlowEffects(parsed.glowEffects);
        if (parsed.streamProvider) setStreamProvider(parsed.streamProvider);
        if (parsed.autoMuteStreams !== undefined) setAutoMuteStreams(parsed.autoMuteStreams);
        if (parsed.preferredResolution) setPreferredResolution(parsed.preferredResolution);
        if (parsed.ollamaUrl) setOllamaUrl(parsed.ollamaUrl);
        if (parsed.aiTemperature !== undefined) setAiTemperature(parsed.aiTemperature);
        if (parsed.aiModel) setAiModel(parsed.aiModel);
        if (parsed.masterVolume !== undefined) setMasterVolume(parsed.masterVolume);
        if (parsed.soundEffects !== undefined) setSoundEffects(parsed.soundEffects);
      }
    } catch {}
  }, []);

  const handleCloakChange = (preset: string) => {
    setTabCloak(preset);
    try {
      localStorage.setItem("lce_tab_cloak", preset);
      window.dispatchEvent(new CustomEvent("lce-cloak-change"));
    } catch {}
  };

  const handleSave = () => {
    const config = {
      accent,
      glassBlur,
      glowEffects,
      streamProvider,
      autoMuteStreams,
      preferredResolution,
      ollamaUrl,
      aiTemperature,
      aiModel,
      masterVolume,
      soundEffects,
    };
    try {
      localStorage.setItem("lce_user_settings", JSON.stringify(config));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2200);
    } catch {}
  };

  const exportData = () => {
    const data = {
      settings: localStorage.getItem("lce_user_settings"),
      bookmarks: localStorage.getItem("lce_bookmarks"),
      favorites: localStorage.getItem("lce_game_favorites"),
      ai_sessions: localStorage.getItem("lce_ai_sessions"),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lce-backup-${Date.now()}.json`;
    a.click();
  };

  const clearAllData = () => {
    if (confirm("Are you sure you want to reset all settings, chat history, and bookmarks?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Settings</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Customize visual theme, streaming proxy, AI inference, and personal preferences.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* Section 0: Tab Disguise & School Stealth */}
      <div className="bg-[#120e24] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Tab Disguise & School Stealth</h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            Innocent Mode
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Disguise this browser tab's title and favicon to look like normal school work so automated filters and screen monitors won't flag you.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
          {[
            { id: "default", name: "Clever (Default)", sub: "Clever | Portal" },
            { id: "classroom", name: "Classroom", sub: "Classes" },
            { id: "docs", name: "Google Docs", sub: "Untitled document" },
            { id: "drive", name: "Google Drive", sub: "My Drive" },
            { id: "canvas", name: "Canvas LMS", sub: "Dashboard" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleCloakChange(item.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                tabCloak === item.id
                  ? "bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-950/30"
                  : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <p className="font-semibold text-xs text-zinc-200">{item.name}</p>
              <p className="text-[10px] text-zinc-500 truncate mt-0.5">{item.sub}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500 border-t border-white/5">
          <span>Quick Panic Key: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">`</kbd> (tilde) or tap <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">Esc</kbd> 3x to instantly jump to Classroom.</span>
        </div>
      </div>

      {/* Section 1: Appearance & Accent */}
      <div className="bg-[#120e24] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <Palette className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white">Appearance & Theme</h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-2">Accent Highlight Color</label>
          <div className="flex flex-wrap items-center gap-2.5">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setAccent(c.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  accent === c.hex
                    ? "border-white text-white shadow-lg shadow-purple-900/30"
                    : "border-white/10 text-zinc-400 hover:text-white bg-white/5"
                }`}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Glassmorphism & Backdrop Blur</h4>
            <p className="text-xs text-zinc-500">Enable advanced GPU backdrop filters and glass surfaces.</p>
          </div>
          <Switch checked={glassBlur} onCheckedChange={setGlassBlur} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Atmospheric Glow Effects</h4>
            <p className="text-xs text-zinc-500">Render radiant gradient auras and button light halos.</p>
          </div>
          <Switch checked={glowEffects} onCheckedChange={setGlowEffects} />
        </div>
      </div>

      {/* Section 2: Streaming & Entertainment Proxy */}
      <div className="bg-[#120e24] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <Film className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">Streaming & Proxy Engine</h2>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-300">Primary Stream Provider</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setStreamProvider("cinesrc")}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                streamProvider === "cinesrc"
                  ? "bg-purple-950/40 border-purple-500 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">Cinesrc Proxy Engine (Primary)</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Active</span>
              </div>
              <p className="text-[11px] text-zinc-400">Ultra-fast multi-source video playback via /api/entertainment/stream.</p>
            </div>

            <div
              onClick={() => setStreamProvider("vidsrc")}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                streamProvider === "vidsrc"
                  ? "bg-purple-950/40 border-purple-500 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">Auto Fallback Mirror</span>
                <span className="text-[10px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded">Standby</span>
              </div>
              <p className="text-[11px] text-zinc-400">Automatic secondary failover if primary host experiences network rate-limits.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Auto-Mute Streams on Initial Load</h4>
            <p className="text-xs text-zinc-500">Prevent sudden loud audio when launching a movie or Live TV stream.</p>
          </div>
          <Switch checked={autoMuteStreams} onCheckedChange={setAutoMuteStreams} />
        </div>
      </div>

      {/* Section 3: Llama 3.3 Engine */}
      <div className="bg-[#120e24] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Llama 3.3 (70B Instruct) Engine</h2>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Only Active AI
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Local Ollama Host Endpoint (Optional)</label>
          <Input
            value={ollamaUrl}
            onChange={(e) => setOllamaUrl(e.target.value)}
            placeholder="http://127.0.0.1:11434"
            className="bg-[#0b0816] border-white/10 text-white"
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            If running locally on your computer, LCE routes directly to this endpoint with 0 latency.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-zinc-300">Response Creativity (Temperature)</span>
            <span className="font-mono text-purple-400 font-bold">{aiTemperature.toFixed(2)}</span>
          </div>
          <Slider
            value={[aiTemperature * 100]}
            min={0}
            max={100}
            step={5}
            onValueChange={(val) => setAiTemperature(val[0] / 100)}
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>Precise (0.0)</span>
            <span>Balanced (0.7)</span>
            <span>Creative (1.0)</span>
          </div>
        </div>
      </div>

      {/* Section 4: Audio & Master Controls */}
      <div className="bg-[#120e24] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <Volume2 className="w-5 h-5 text-pink-400" />
          <h2 className="text-base font-bold text-white">Audio & Soundboard Preferences</h2>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-zinc-300">Default Master Volume</span>
            <span className="font-mono text-pink-400 font-bold">{masterVolume}%</span>
          </div>
          <Slider
            value={[masterVolume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => setMasterVolume(val[0])}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Interactive Click Sound Effects</h4>
            <p className="text-xs text-zinc-500">Play subtle auditory haptic clicks when navigating components.</p>
          </div>
          <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
        </div>
      </div>

      {/* Section 5: Data & Privacy */}
      <div className="bg-[#120e24] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Data Management & Privacy</h2>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          All your bookmarks, chat sessions, favorites, and settings are stored locally on your device. You can export a JSON backup anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={exportData}
            className="border-white/10 text-zinc-300 hover:text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export Backup (.json)</span>
          </Button>

          <Button
            variant="outline"
            onClick={clearAllData}
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Storage</span>
          </Button>
        </div>
      </div>

      {/* Section 6: Credits & Contributors */}
      <div id="credits" className="bg-[#120e24] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white">Credits & Contributors</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Built by Humans
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Team
            </span>
          </div>
        </div>

        {/* Human Authorship Declaration Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-blue-950/20 to-purple-950/40 border border-purple-500/20 text-xs text-zinc-300 leading-relaxed">
          <p className="font-semibold text-white mb-1 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            Handcrafted with Human Engineering
          </p>
          Lowkey Chopped Elite is built from the ground up by real human developers. Every route, component, layout, and proxy engine was designed and coded with care by our team — built by humans, for students and creators.
        </div>

        {/* Contributors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* turg */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-purple-500/30 bg-black/40">
              <img src="/credits/turg.png" alt="turg" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate">turg</h3>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Founder
              </span>
            </div>
          </div>

          {/* c2x86 */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-blue-500/30 bg-black/40">
              <img src="/credits/c2x86.png" alt="c2x86" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate">c2x86</h3>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Main Dev
              </span>
            </div>
          </div>

          {/* fanu lanoue */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-pink-500/30 bg-black/40">
              <img src="/credits/fanu.png" alt="fanu lanoue" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate">fanu lanoue</h3>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/15 text-pink-400 border border-pink-500/30">
                Assistant Dev
              </span>
            </div>
          </div>

          {/* sharwie */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-purple-500/30 bg-black/40">
              <img src="/credits/sharwie.png" alt="sharwie" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate">sharwie</h3>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                Contributor
              </span>
            </div>
          </div>
        </div>

        {/* Supporting Open Source Attribution */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-500">
          <span>Special thanks to TMDB, v86, and OpenLibrary for open-source catalog assets.</span>
        </div>
      </div>
    </div>
  );
}
