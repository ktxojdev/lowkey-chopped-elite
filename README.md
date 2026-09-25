# lowkey chopped elite (LCE)

Next.js 15 Web Platform with proxied entertainment, games, AI assistant, soundboard, and WebAssembly virtual machines.

---

## Quick Start (How to Run)

### Requirements
- [Node.js](https://nodejs.org) (v18.18+ or v20+ recommended)

### 1. Install Dependencies
Open a terminal in this folder and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## Windows 1-Click Launch
If you are on Windows, simply double-click **`start.bat`**. It will automatically install packages (if needed) and boot the local server.

---

## Project Structure
- `src/app/` — Next.js App Router pages and serverless API proxy routes
  - `page.tsx` — Minimalist search and homepage
  - `games/` — 800+ playable games with full proxy bypass
  - `entertainment/` — Movies, TV, Anime, Books, and Live TV
  - `ai/` — ChoppedAI Assistant
  - `soundboard/` — Instant soundboard player
  - `vm/` — WebAssembly x86 Linux & DOS virtual machines
  - `settings/` — Tab cloaking, theme accents, and team credits
- `public/` — Static assets, icons, and avatars
- `.env.local` — Environment secrets and TMDB API keys
