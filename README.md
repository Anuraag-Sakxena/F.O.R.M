# F.O.R.M.

**Focus. Optimize. Repeat. Master.**

A personal adaptive daily companion — track workouts, meals, daily goals, skincare, and routines in one beautiful, intelligent app.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for animations
- **Lucide React** for icons
- **Supabase** for persistence (optional — works locally without it)
- **PWA** for home screen installation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in mobile dev tools.

## Supabase Setup (Optional)

The app works fully without Supabase using localStorage. To enable cloud persistence:

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the migration
In the Supabase SQL Editor, paste and run:
```
supabase/migrations/0001_initial_schema.sql
```

This creates tables for: `app_instances`, `daily_records`, `mood_checkins`, `app_preferences`, `behavior_memory`.

### 3. Set environment variables
```bash
cp .env.local.example .env.local
```

Add your Supabase URL and anon key:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Restart the dev server
```bash
npm run dev
```

The app will hydrate from localStorage instantly and sync to Supabase in the background.

## How Persistence Works

F.O.R.M. uses a **local-first** persistence strategy:

1. **localStorage** is always the fast read/write layer
2. If Supabase is configured, writes are mirrored asynchronously
3. On startup, local data loads immediately; remote data reconciles if newer
4. If Supabase is unavailable, the app continues working identically

### Sync behavior
- State changes are saved to localStorage immediately (feels instant)
- Background sync to Supabase happens on each write
- On startup, if remote data is newer than local, remote wins
- If local is newer, local pushes to remote
- An `instance_id` (auto-generated UUID) acts as the ownership key

### No authentication
The app is designed for a single private user. No login required. The instance ID in localStorage provides continuity.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Daily Flow dashboard |
| `/checklist` | Daily goals |
| `/meals` | Weekly meals with Cook/Lazy toggle |
| `/workout` | Workout + weekly schedule |
| `/groceries` | Grocery list |
| `/skincare` | Skincare + night routine |
| `/recipes` | Recipe browser |
| `/history` | Past days + streaks |
| `/settings` | App preferences |

## Features

- **Daily reset at 7:00 AM** local time
- **Flow Score** — weighted daily score (not flat %)
- **Momentum system** — 5 streak tiers
- **Day modes** — Strong Start, Catch-Up, Recovery, Wind-Down, Balanced, Fresh
- **Today's Plan** — adaptive daily guidance
- **Rescue Plans** — supportive off-day recovery
- **Minimum Viable Day** — "good enough" recognition
- **Adaptive ordering** — surfaces most relevant sections
- **Mood check-in** — influences guidance tone
- **Pattern insights** — gentle reflective observations
- **Smart meal guidance** — Cook/Lazy mode recommendations
- **PWA installable** — add to home screen

## Deploy to Vercel

```bash
npm run build
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.
