"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Image as ImageIcon, 
  Plus, 
  Search, 
  ChevronDown, 
  Loader2, 
  Bot, 
  User, 
  X, 
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Paperclip,
  Check,
  Lock,
  Key
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  thinking?: string;
  generatedImage?: string;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

const ACTIVE_MODEL = { 
  id: "llama-3.3", 
  name: "Llama 3.3 (70B Instruct)", 
  desc: "High-throughput open-weights reasoning by Meta",
  tag: "Active"
};

const UPCOMING_MODELS = [
  { id: "deepseek-r1", name: "DeepSeek R1 (Reasoning)", desc: "Chain-of-thought mathematical proof engine" },
  { id: "claude-3.7-sonnet", name: "Claude 3.7 Sonnet", desc: "Anthropic hybrid reasoning & coding" },
  { id: "gpt-4o", name: "GPT-4o (Omni)", desc: "OpenAI flagship multimodal intelligence" },
  { id: "grok-2", name: "Grok 2 (xAI)", desc: "Real-time discovery & conversational model" },
];

export default function AIPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchChats, setSearchChats] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history & optional API key from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lce_ai_sessions");
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      }
      const userKey = localStorage.getItem("lce_ai_api_key");
      if (userKey) {
        setSavedKey(userKey);
        setApiKeyInput(userKey);
      }
    } catch {}
  }, []);

  // Save sessions to localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    try {
      localStorage.setItem("lce_ai_sessions", JSON.stringify(updated));
    } catch {}
  };

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    setSavedKey(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem("lce_ai_api_key", trimmed);
      } else {
        localStorage.removeItem("lce_ai_api_key");
      }
    } catch {}
    setShowKeyModal(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: "New Chat",
      updatedAt: "Just now",
      messages: [],
    };
    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setCurrentSessionId(newId);
    setMessages([]);
    setInput("");
    setSelectedImage(null);
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setInput("");
    setSelectedImage(null);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    saveSessions(updated);
    if (currentSessionId === id) {
      if (updated.length > 0) {
        selectSession(updated[0]);
      } else {
        setCurrentSessionId(null);
        setMessages([]);
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || loading) return;

    const currentInput = input.trim();
    const currentImg = selectedImage;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      image: currentImg || undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          model: ACTIVE_MODEL.name,
          apiKey: savedKey || undefined,
          image: currentImg,
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "No response received.",
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);

      // Persist in sessions
      let activeId = currentSessionId;
      if (!activeId) {
        activeId = Date.now().toString();
        setCurrentSessionId(activeId);
      }

      const title =
        currentInput.length > 25
          ? `${currentInput.slice(0, 25)}...`
          : currentInput || "Discussion";

      const existingIndex = sessions.findIndex((s) => s.id === activeId);
      let updatedSessions: ChatSession[];

      if (existingIndex >= 0) {
        updatedSessions = [...sessions];
        updatedSessions[existingIndex] = {
          ...updatedSessions[existingIndex],
          title: updatedSessions[existingIndex].title === "New Chat" ? title : updatedSessions[existingIndex].title,
          updatedAt: "Just now",
          messages: finalMessages,
        };
      } else {
        updatedSessions = [
          {
            id: activeId,
            title,
            updatedAt: "Just now",
            messages: finalMessages,
          },
          ...sessions,
        ];
      }
      saveSessions(updatedSessions);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Error communicating with Llama 3.3 engine: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex w-full h-[calc(100vh-5rem)] overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 -ml-64"
        } transition-all duration-300 bg-[#0c0a15] border-r border-white/5 flex flex-col justify-between shrink-0 select-none overflow-hidden relative z-20`}
      >
        <div className="p-4 flex flex-col flex-1 min-h-0">
          {/* Top Brand & Sidebar Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-white">Llama 3.3</span>
                <span className="text-[10px] text-zinc-400">70B Instruct</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-zinc-500 hover:text-white p-1 rounded-md transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-semibold text-purple-200 hover:text-white transition-all mb-3 shadow-sm"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>New chat</span>
          </button>

          {/* Search Chats Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchChats}
              onChange={(e) => setSearchChats(e.target.value)}
              placeholder="Search chat history"
              className="w-full bg-[#141121] border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-500 outline-none focus:border-purple-500/40"
            />
          </div>

          {/* Real Chats List from localStorage */}
          <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
            <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
              Conversations
            </span>
            {sessions.length === 0 ? (
              <p className="text-xs text-zinc-600 px-2 py-4 italic">No saved conversations yet.</p>
            ) : (
              sessions
                .filter((s) =>
                  s.title.toLowerCase().includes(searchChats.toLowerCase())
                )
                .map((session) => {
                  const isCurrent = session.id === currentSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => selectSession(session)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer truncate transition-colors ${
                        isCurrent
                          ? "bg-purple-600/20 text-white border border-purple-500/30"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                      }`}
                    >
                      <span className="truncate">{session.title}</span>
                      <button
                        onClick={(e) => deleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Real Status Footer */}
        <div className="p-3 border-t border-white/5 bg-[#0e0c18] flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Llama 3.3 Online</span>
          </span>
          <span className="font-mono text-[10px]">70B</span>
        </div>
      </aside>

      {/* Main Chat Canvas */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
        {/* Toggle Sidebar Button when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 p-2 rounded-xl bg-[#141124] border border-white/10 text-zinc-400 hover:text-white shadow-xl"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          {messages.length === 0 ? (
            /* Centered Welcome Message */
            <div className="h-full flex flex-col items-center justify-center text-center select-none -mt-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-xl">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
                Llama 3.3
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md">
                Ask anything, generate clean code, analyze complex logic, and solve problems with Meta’s premier 70B model.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3.5 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-400 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                        : "bg-[#141124] border border-white/10 text-zinc-200"
                    }`}
                  >
                    {/* User Image Attachment */}
                    {m.image && (
                      <div className="mb-2 max-w-xs rounded-lg overflow-hidden border border-white/20">
                        <img src={m.image} alt="Upload preview" className="w-full h-auto" />
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {/* AI Generated Image */}
                    {m.generatedImage && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl">
                        <img
                          src={m.generatedImage}
                          alt="AI Output"
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-zinc-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-[#141124] border border-white/10 text-zinc-400 text-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Llama 3.3 thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Dock Area */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-background via-background/95 to-transparent relative z-20">
          <form
            onSubmit={handleSend}
            className="max-w-3xl mx-auto bg-[#141026] border border-white/10 focus-within:border-purple-500/50 rounded-2xl shadow-2xl p-3 flex flex-col transition-all duration-200"
          >
            {/* Selected Image Preview Pill */}
            {selectedImage && (
              <div className="flex items-center gap-2 mb-2 p-1.5 bg-black/40 rounded-lg w-max border border-white/10">
                <img src={selectedImage} alt="Attachment" className="w-8 h-8 rounded object-cover" />
                <span className="text-[11px] text-zinc-300">Image attached</span>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Textarea Input */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Ask Llama 3.3 anything, analyze code, solve equations..."
              rows={2}
              className="w-full bg-transparent resize-none border-none outline-none text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm px-2 py-1"
            />

            {/* Control Bar: Model, Thinking, Upload, Send */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1 select-none">
              <div className="flex items-center gap-2 relative">
                {/* Upload File/Image */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Upload image"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* API Key Modal Button */}
                <button
                  type="button"
                  onClick={() => setShowKeyModal(true)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    savedKey 
                      ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  }`}
                  title={savedKey ? "Custom API key configured" : "Configure optional Groq/OpenRouter key"}
                >
                  <Key className="w-4 h-4" />
                </button>

                {/* Model Selector Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-[11px] font-medium text-purple-200 transition-colors shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{ACTIVE_MODEL.name}</span>
                    <ChevronDown className="w-3 h-3 text-purple-400" />
                  </button>

                  {showModelMenu && (
                    <div className="absolute bottom-full mb-2 left-0 w-72 bg-[#17132b] border border-white/15 rounded-xl shadow-2xl p-2 z-50 divide-y divide-white/5">
                      {/* Active Model */}
                      <div className="pb-2">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
                          Active Model
                        </span>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-purple-600/20 border border-purple-500/30">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span className="text-xs font-bold text-white">{ACTIVE_MODEL.name}</span>
                            </div>
                            <span className="text-[10px] text-zinc-400 block truncate mt-0.5">{ACTIVE_MODEL.desc}</span>
                          </div>
                          <Check className="w-4 h-4 text-purple-300 shrink-0 ml-2" />
                        </div>
                      </div>

                      {/* Coming Soon Section */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between px-2 py-1 mb-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            More AI models coming soon
                          </span>
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 font-semibold px-1.5 py-0.5 rounded">
                            Soon
                          </span>
                        </div>
                        <div className="space-y-1">
                          {UPCOMING_MODELS.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 opacity-60 cursor-not-allowed select-none"
                            >
                              <div className="min-w-0">
                                <span className="text-xs font-medium text-zinc-300 block">{m.name}</span>
                                <span className="text-[10px] text-zinc-500 block truncate">{m.desc}</span>
                              </div>
                              <span className="text-[9px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.5 rounded shrink-0 ml-2 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                Coming Soon
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || (!input.trim() && !selectedImage)}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 flex items-center justify-center text-white transition-all shadow-md shadow-purple-600/30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Optional API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151226] border border-white/10 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Custom Llama 3.3 API Key (Optional)</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Lowkey Chopped Elite includes a built-in reasoning engine. You can also connect your free Groq key (<code className="text-purple-300">gsk_...</code>) or OpenRouter key for dedicated 500+ tokens/sec throughput.
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">API Key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="gsk_... or sk-or-..."
                className="w-full bg-[#0d0a1a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput("");
                  setSavedKey("");
                  try { localStorage.removeItem("lce_ai_api_key"); } catch {}
                  setShowKeyModal(false);
                }}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md shadow-purple-600/30"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
