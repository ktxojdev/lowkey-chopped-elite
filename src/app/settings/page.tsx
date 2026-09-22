"use client";

import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Key, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Check, 
  Copy, 
  Trash2, 
  Download, 
  Sparkles,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const [readToken, setReadToken] = useState(
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTY5ODA2YjFkNzdhYjZkOGJkMTBmOTdiMDE4NDNjZSIsIm5iZiI6MTc4NjQ4Mjc4Ny4yNDg5OTk4LCJzdWIiOiI2YTdiOTA2MzFlNGFkYWQ1ZmJhZTBjNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HW7mSMgEq9hYhKSyNVNspwT--aZdcCrdUHA3d0ROn-0"
  );
  const [apiKey, setApiKey] = useState("7569806b1d77ab6d8bd10f97b01843ce");
  const [ollamaUrl, setOllamaUrl] = useState("http://127.0.0.1:11434");
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [defaultModel, setDefaultModel] = useState("deepseek-v4");
  const [copiedToken, setCopiedToken] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("lce_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.readToken) setReadToken(parsed.readToken);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.ollamaUrl) setOllamaUrl(parsed.ollamaUrl);
        if (parsed.proxyEnabled !== undefined) setProxyEnabled(parsed.proxyEnabled);
        if (parsed.defaultModel) setDefaultModel(parsed.defaultModel);
      }
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        "lce_settings",
        JSON.stringify({
          readToken,
          apiKey,
          ollamaUrl,
          proxyEnabled,
          defaultModel,
        })
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {}
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all local bookmarks, favorites, and settings?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const exportConfig = () => {
    const data = {
      bookmarks: localStorage.getItem("lce_bookmarks"),
      favorites: localStorage.getItem("lce_game_favorites"),
      settings: localStorage.getItem("lce_settings"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lce-backup-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-purple-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            Configure server proxies, API credentials, local AI hosts, and personal data.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? "Saved!" : "Save Changes"}</span>
        </button>
      </div>

      {/* Section 1: TMDB API Credentials (Matches Screenshot 2) */}
      <div className="bg-[#120e22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-semibold text-white">API Credentials & Tokens</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active</span>
          </span>
        </div>

        {/* API Read Access Token (Matches Screenshot 2) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-zinc-300">API Read Access Token</label>
            <button
              onClick={() => copyToClipboard(readToken)}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
            >
              {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedToken ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={readToken}
            onChange={(e) => setReadToken(e.target.value)}
            className="w-full bg-[#0a0814] border border-white/10 rounded-xl p-3 text-xs font-mono text-zinc-300 focus:border-purple-500/50 outline-none leading-relaxed select-all"
          />
        </div>

        {/* API Key (Matches Screenshot 2) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-[#0a0814] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-300 focus:border-purple-500/50 outline-none"
          />
        </div>
      </div>

      {/* Section 2: AI & Server-Side Proxy Configuration */}
      <div className="bg-[#120e22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-semibold text-white">AI Engine & Local Host</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Ollama Local Endpoint
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://127.0.0.1:11434"
              className="w-full bg-[#0a0814] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-300 focus:border-purple-500/50 outline-none"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Routes local llama/ollama models on your PC via server-side proxy.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Default Chat Model
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full bg-[#0a0814] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:border-purple-500/50 outline-none cursor-pointer"
            >
              <option value="deepseek-v4">DeepSeek V4 (Reasoning Core)</option>
              <option value="llama-3.3">Llama 3.3 (Host Ollama)</option>
              <option value="vision-pro">LCE Vision Multimodal</option>
              <option value="image-gen">Media Image Generator</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-xs font-semibold text-white">Server-Side Proxy Security</h4>
            <p className="text-[11px] text-zinc-400">
              Route all TMDB, Jikan, MangaDex, and game assets through secure server handlers.
            </p>
          </div>
          <button
            onClick={() => setProxyEnabled(!proxyEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              proxyEnabled ? "bg-purple-600" : "bg-zinc-700"
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                proxyEnabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 3: Data Management */}
      <div className="bg-[#120e22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-semibold text-white">Data Management & Backup</h2>
        <p className="text-xs text-zinc-400">
          Manage saved bookmarks, favorited games, and chat history.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportConfig}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={clearAllData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-400 hover:text-red-300 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
