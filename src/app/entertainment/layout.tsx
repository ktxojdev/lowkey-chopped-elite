"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Tv, PlaySquare, BookOpen, ScrollText } from "lucide-react";

export default function EntertainmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Movies & TV", href: "/entertainment/movies", icon: Film },
    { name: "Anime", href: "/entertainment/anime", icon: PlaySquare },
    { name: "Manga", href: "/entertainment/manga", icon: ScrollText },
    { name: "Books", href: "/entertainment/books", icon: BookOpen },
    { name: "Live TV", href: "/entertainment/live", icon: Tv },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#130f22] border border-white/10 shadow-lg overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}
