# F.O.R.M.

**Focus. Optimize. Repeat. Master.**

A private adaptive daily companion — an intelligent personal system for tracking workouts, meals, daily goals, skincare, routines, and wellness with behavioral intelligence that learns from your patterns over time.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS v4** (inline theme)
- **Framer Motion** for animations
- **Lucide React** for icons
- **Supabase** for persistence (optional — works locally without it)
- **PWA** installable on home screen

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — use mobile dev tools for the intended experience.

## Architecture

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── dashboard/          # Home screen modules (14 components)
│   ├── layout/             # App shell, navigation, install prompt
│   ├── ui/                 # Reusable design system (13 components)
│   ├── checklist/          # Daily goals
│   ├── meals/              # Weekly meal planner
│   ├── workout/            # Workout tracking
│   ├── groceries/          # Grocery list
│   ├── skincare/           # Skincare + night routine
│   ├── recipes/            # Recipe browser
│   ├── history/            # Past days + insights
│   └── settings/           # Preferences + data
├── hooks/                  # State management (tracker store + context)
├── lib/
│   ├── intelligence/       # Adaptive intelligence engine (14 modules)
│   ├── persistence/        # Local-first + sync layer
│   ├── supabase/           # Database client, types, mappers, queries
│   ├── data/               # Content (meals, groceries, routines, targets)
│   ├── behavior.ts         # Flow score, momentum, recovery
│   ├── copy.ts             # Emotional copy system
│   ├── day-modes.ts        # Inferred day modes
│   ├── personalization.ts  # Adaptive ordering, favorites, mood
│   └── day.ts              # Date/time utilities
├── types/                  # Domain types + recommendation profile
└── providers/              # (reserved for future providers)
```

### Intelligence Engine (`lib/intelligence/`)

Pure-function modules — no side effects, fully testable, AI-replaceable:

| Module | Purpose |
|--------|---------|
| `adaptive-memory.ts` | Builds recommendation profile from history |
| `confidence.ts` | Confidence thresholds for insights |
| `recency.ts` | Time-weighted pattern analysis |
| `memory-insights.ts` | User-facing reflective insights |
| `planning.ts` | Day plan variants (full, simplified, rescue, etc.) |
| `rescue.ts` | Rescue plan detection and generation |
| `content-recommendations.ts` | Home emphasis + fallback paths |
| `adaptive-framing.ts` | Screen-specific contextual messaging |
| `support-style.ts` | UX density based on planner style |
| `meal-strategy.ts` | Cook/Lazy mode recommendations |
| `day-quality.ts` | Day quality assessment (In Flow → Rest Day) |
| `minimum-day.ts` | Minimum Viable Day evaluation |
| `pattern-insights.ts` | Legacy pattern analysis |

### Persistence Strategy

**Local-first with optional cloud sync:**

1. localStorage is always the fast read/write layer
2. If Supabase is configured, writes mirror asynchronously
3. On startup, local loads instantly; remote reconciles if newer
4. If Supabase is unavailable, the app works identically

An auto-generated `instance_id` (UUID) provides device identity without authentication.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Daily Flow dashboard (control center) |
| `/checklist` | Daily goals with completion tracking |
| `/meals` | Weekly meals with Cook/Lazy toggle |
| `/workout` | Workout + weekly schedule |
| `/groceries` | Grocery list by category |
| `/skincare` | Skincare + 10-min night routine |
| `/recipes` | All recipes from meal plan |
| `/history` | Past days, streaks, learned insights |
| `/settings` | Preferences, intelligence, data, privacy |

## Key Features

- **Flow Score** — weighted daily score (not flat %)
- **Momentum System** — 5 streak tiers (Starting → Unstoppable)
- **Day Modes** — Strong Start, Catch-Up, Recovery, Wind-Down, Balanced, Fresh
- **Today's Plan** — adaptive daily guidance with step-by-step actions
- **Rescue Plans** — supportive recovery for off days
- **Minimum Viable Day** — "good enough" recognition
- **Fallback Paths** — simpler alternative when ideal isn't realistic
- **Adaptive Memory** — learns from patterns with recency weighting
- **Recommendation Profile** — consistency anchors, weak points, trends
- **Smart Meal Guidance** — Cook/Lazy mode suggestions by context
- **Mood Check-in** — influences daily guidance tone
- **Pattern Insights** — gentle reflective observations
- **Support Styles** — Minimal, Balanced, or Supportive guidance
- **7 AM Daily Reset** — day boundary at 7 AM, not midnight
- **PWA Installable** — add to home screen

## Supabase Setup (Optional)

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the migration
In the Supabase SQL Editor, paste and run:
```
supabase/migrations/0001_initial_schema.sql
```

Creates: `app_instances`, `daily_records`, `mood_checkins`, `app_preferences`, `behavior_memory`.

### 3. Set environment variables
```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Restart
```bash
npm run dev
```

Data syncs automatically in the background.

## Deploy to Vercel

### Prerequisites
- Push repo to GitHub
- Create a Vercel project linked to the repo

### Environment Variables (in Vercel dashboard)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both are optional — the app works without them in local-only mode.

### Build
```bash
npm run build
```

Or let Vercel build automatically on push.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App shows "Local only" | Supabase env vars not set — app works fine locally |
| Sync shows error | Check Supabase URL/key; app continues safely with local data |
| Data not appearing after reinstall | Data is device-local by default; set up Supabase for cross-device persistence |
| Flow Score seems wrong | Score is weighted (gym 35%, workout 20%, meals 20%, etc.), not a flat count |
| Empty history/insights | Need 5+ days of data before insights appear |

## Future AI Integration

The architecture is designed for future AI:
- Replace `buildRecommendationProfile()` with API call for ML-powered profiles
- Replace `generateMemoryInsights()` with LLM-generated insights
- Replace `buildDayPlan()` with AI-generated plans
- All intelligence modules use stable typed interfaces
- UI never knows whether intelligence is local or remote

## Privacy

- No authentication required
- No user accounts
- Data stored locally by default
- Optional Supabase sync is private to your instance
- Adaptive memory is computed locally from your own history
- No third-party analytics or tracking
