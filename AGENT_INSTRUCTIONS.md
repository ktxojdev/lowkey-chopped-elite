# Antigravity Agent Briefing: Lowkey Chopped Elite (LCE)

This document gives any incoming Antigravity agent or developer 100% full context on the architecture, conventions, and rules of this project.

---

## 1. Project Overview
- **App Name**: `lowkey-chopped-elite` (LCE)
- **Live Production URL**: [https://lce-turg-app.vercel.app](https://lce-turg-app.vercel.app)
- **GitHub Repository**: [https://github.com/ktxojdev/lowkey-chopped-elite](https://github.com/ktxojdev/lowkey-chopped-elite)
- **Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI.
- **Font**: Geist font family across the entire site.

---

## 2. Core Architecture & Pages
- `src/app/page.tsx` — Minimalist homepage with search input (Ctrl+K palette), auto-routing to categories, and bold lowercase `lowkey chopped elite` title.
- `src/app/games/` — **Activities**: 800+ games catalog fetched from gn-math assets, proxied through `/api/games/proxy` with full-viewport responsive play frame.
- `src/app/entertainment/` — Entertainment hub with a 4-column responsive mobile subnav:
  - `movies/`: TMDB catalog + Cinesrc stream player (`/api/entertainment/stream`).
  - `anime/`: Jikan/MAL catalog + episode stream scraper.
  - `books/`: OpenLibrary API reader and book catalog.
  - `live/`: 25+ verified live television channels with HLS player.
- `src/app/ai/` — **ChoppedAI**: Real, grounded assistant without fake reasoning traces or fake models. Connected to Wikipedia + DuckDuckGo knowledge engine.
- `src/app/soundboard/` — 36+ trending meme & sound clips via MyInstants proxy.
- `src/app/vm/` — WebAssembly Virtual Machines running real x86 Linux (v86), Alpine Linux (JSLinux), and FreeDOS.
- `src/app/settings/` — Tab Cloaking (Google Classroom, Docs, Drive, Canvas + Panic Escape key), appearance controls, and Team Credits.

---

## 3. Team & Credits Rules (CRITICAL)
- **Team Roster**:
  - `turg`: Founder (pixel runner avatar `/credits/turg.png`)
  - `c2x86`: Main Dev (3D lightning avatar `/credits/c2x86.png`)
  - `fanu lanoue`: Assistant Dev (pink avatar `/credits/fanu.png`)
  - `sharwie`: Contributor (shark fin avatar `/credits/sharwie.png`)
- **STRICT ANONYMITY RULE**: Marko MUST ALWAYS be named **sharwie**. NEVER refer to him by his real name anywhere.
- **CREDITS STYLE**: Keep credits cards minimal with avatar, name, and badge. NO long descriptive paragraphs or fluff.

---

## 4. School Stealth & Safety Guidelines
- Default document title is innocent: `Portal | Workspace`.
- Built-in Tab Cloaker in `src/components/layout/TabCloakProvider.tsx`.
- Pressing backtick (`` ` ``) or tapping `Esc` 3 times immediately escapes to `classroom.google.com`.

---

## 5. Deployment Commands
- **Local Dev**: `npm run dev` (runs on `http://localhost:3000`).
- **Production Build**: `npm run build`.
- **Git Push**: Pushing to `origin main` auto-updates the live Vercel deployment.
