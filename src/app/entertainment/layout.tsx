"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Tv, PlaySquare, BookOpen, Play } from "lucide-react";

export default function EntertainmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Movies", href: "/entertainment/movies", icon: Film },
    { name: "YouTube", href: "/entertainment/youtube", icon: Play },
    { name: "Anime", href: "/entertainment/anime", icon: PlaySquare },
    { name: "Live TV", href: "/entertainment/live", icon: Tv },
    { name: "Books", href: "/entertainment/books", icon: BookOpen },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24">
      {/* Sub-Navigation Tabs: Fully responsive 5-tab grid */}
      <div className="flex items-center justify-center mb-6 sm:mb-8 px-2">
        <div className="w-full max-w-xl grid grid-cols-5 gap-1 p-1 rounded-xl sm:rounded-full bg-[#130f22] border border-white/10 shadow-lg overflow-hidden select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2.5 rounded-lg sm:rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 text-center ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/30 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}
