"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Film,
  Tv,
  BookOpen,
  Bot,
  Volume2,
  Settings,
  Terminal,
  Home,
  Search,
  Sparkles,
  ExternalLink,
  Heart,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    document.addEventListener("keydown", down);
    window.addEventListener("open-lce-command", handleCustomOpen);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-lce-command", handleCustomOpen);
    };
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command, page, activity, or movie..." />
      <CommandList className="max-h-[380px] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
            className="cursor-pointer"
          >
            <Home className="mr-2 h-4 w-4 text-purple-400" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/games"))}
            className="cursor-pointer"
          >
            <Gamepad2 className="mr-2 h-4 w-4 text-emerald-400" />
            <span>Activities & Games</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/entertainment/movies"))}
            className="cursor-pointer"
          >
            <Film className="mr-2 h-4 w-4 text-rose-400" />
            <span>Movies & TV Shows</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/entertainment/live"))}
            className="cursor-pointer"
          >
            <Tv className="mr-2 h-4 w-4 text-amber-400" />
            <span>Live TV Streams (25+ Channels)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/entertainment/books"))}
            className="cursor-pointer"
          >
            <BookOpen className="mr-2 h-4 w-4 text-blue-400" />
            <span>Books & Literature</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/ai"))}
            className="cursor-pointer"
          >
            <Bot className="mr-2 h-4 w-4 text-indigo-400" />
            <span>ChoppedAI Studio</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/soundboard"))}
            className="cursor-pointer"
          >
            <Volume2 className="mr-2 h-4 w-4 text-pink-400" />
            <span>Soundboard & FX</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/vm"))}
            className="cursor-pointer"
          >
            <Terminal className="mr-2 h-4 w-4 text-cyan-400" />
            <span>WebAssembly Cloud VM</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Settings & Preferences</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings#credits"))}
            className="cursor-pointer"
          >
            <Heart className="mr-2 h-4 w-4 text-rose-400" />
            <span>Credits & Contributors (turg, c2x86, fanu, sharwie)</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Popular Activities">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/games?search=minecraft"))}
            className="cursor-pointer"
          >
            <Gamepad2 className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Play Minecraft / Eaglercraft</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/games?search=retro+bowl"))}
            className="cursor-pointer"
          >
            <Gamepad2 className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Play Retro Bowl</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/games?search=slope"))}
            className="cursor-pointer"
          >
            <Gamepad2 className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Play Slope 3D</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/games?search=cookie+clicker"))}
            className="cursor-pointer"
          >
            <Gamepad2 className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Play Cookie Clicker</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/games?search=subway"))}
            className="cursor-pointer"
          >
            <Gamepad2 className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Play Subway Surfers</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/ai?new=true"))}
            className="cursor-pointer"
          >
            <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
            <span>Start Fresh ChoppedAI Chat</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/soundboard?filter=trending"))}
            className="cursor-pointer"
          >
            <Volume2 className="mr-2 h-4 w-4 text-pink-400" />
            <span>Play Trending Memes & FX</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Switch Theme Accent Color</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
