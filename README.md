# Bloomday
https://bloomday-one.vercel.app/login//
A gamified productivity web app where your tasks grow a living garden. Each task is a seed, focus sessions water it, and completing tasks makes flowers bloom.

Watercolor hand-painted aesthetic. Desktop-first. Built with React + TypeScript + Supabase.

## Features

**Core**
- Task management with category-based plant species (Sunflower, Fern, Herb, Rose, Lavender)
- Pomodoro timer with configurable duration (15/25/30/45/50/60 min)
- Garden journal with mood-weather system
- Full-text search across tasks and journal entries

**Garden**
- SVG plants with 3 growth stages (seed, sprout, bloom) and 3 difficulty sizes
- Real-time growth animation during pomodoro sessions
- Bloom celebration particle effects
- Weather overlay based on journal mood (stormy/rainy/cloudy/sunny/rainbow)
- Garden level progression: Windowsill → Balcony → Backyard → Garden → Estate → Botanical Garden

**V1.5**
- BGM / ambient sounds (rain, birdsong, lo-fi) with Howler.js
- Letters to future self — bury a "seed letter" that sprouts on a chosen date
- Dark / light mode toggle

## Tech Stack

- **Frontend**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS v4 + custom watercolor palette
- **State**: Zustand
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Animation**: Framer Motion
- **Audio**: Howler.js
- **Deploy**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Create `.env.local`:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

Run the SQL schema in Supabase SQL Editor. See `SPEC.md` for the full schema.

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
```

## License

MIT
