"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Gamepad2, 
  Sparkles, 
  Settings, 
  Clapperboard, 
  Volume2,
  Terminal,
  Search,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Activities", href: "/games", icon: Gamepad2 },
    { name: "Entertainment", href: "/entertainment", icon: Clapperboard },
    { name: "ChoppedAI", href: "/ai", icon: Sparkles },
    { name: "Soundboard", href: "/soundboard", icon: Volume2 },
    { name: "VM", href: "/vm", icon: Terminal },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleOpenSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-lce-command"));
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      <nav className="flex items-center gap-1 px-2.5 py-1.5 rounded-full glass-pill shadow-2xl border border-white/10 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            item.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white bg-white/10 shadow-[0_0_12px_rgba(168,85,247,0.3)] border border-purple-500/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-purple-400" : "text-zinc-400"}`} />
              <span className="hidden sm:inline">{item.name}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-purple-400 rounded-full shadow-[0_0_6px_#a855f7]" />
              )}
            </Link>
          );
        })}

        <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        <button
          onClick={handleOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all border border-white/5"
          title="Search (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700/50">
            <span>⌘</span>K
          </kbd>
        </button>
      </nav>
    </header>
  );
}
