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
  FileCode,
  Paperclip
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

const MODELS = [
  { id: "standard", name: "ChoppedAI Standard (Fast)" },
  { id: "deepseek-r1", name: "DeepSeek R1 (Reasoning)" },
  { id: "llama-3.3", name: "Llama 3.3 (General)" },
];

export default function AIPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchChats, setSearchChats] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
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
    } catch {}
  }, []);

  // Save sessions to localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    try {
      localStorage.setItem("lce_ai_sessions", JSON.stringify(updated));
    } catch {}
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
          model: model.name,
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
          content: `Error communicating with AI engine: ${err.message}`,
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
              <span className="font-bold text-sm tracking-wide text-white">ChoppedAI</span>
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
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Adaptive Engine Online</span>
          </span>
          <span className="font-mono text-[10px]">LCE v2.0</span>
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
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
                What’s on your mind?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md">
                Chat with ChoppedAI, analyze multimodal files, explore code, and synthesize insights.
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
                          alt="AI Generated Output"
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
                    <span>Thinking...</span>
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
              placeholder="Ask anything, analyze data, brainstorm code..."
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
                  title="Upload image or document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Model Selector Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-purple-300 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>{model.name}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>

                  {showModelMenu && (
                    <div className="absolute bottom-full mb-2 left-0 w-60 bg-[#17132b] border border-white/15 rounded-xl shadow-2xl p-1 z-50">
                      {MODELS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setModel(m);
                            setShowModelMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            model.id === m.id
                              ? "bg-purple-600 text-white"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
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
    </div>
  );
}
