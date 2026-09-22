"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Gamepad2, 
  Sparkles, 
  Settings, 
  Clapperboard, 
  Volume2 
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Entertainment", href: "/entertainment", icon: Clapperboard },
    { name: "AI", href: "/ai", icon: Sparkles },
    { name: "Soundboard", href: "/soundboard", icon: Volume2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 px-3 py-1.5 rounded-full glass-pill shadow-2xl border border-white/10">
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
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white bg-white/10 shadow-[0_0_12px_rgba(168,85,247,0.3)] border border-purple-500/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-purple-400" : "text-zinc-400"}`} />
              <span>{item.name}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-purple-400 rounded-full shadow-[0_0_6px_#a855f7]" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
