"use client";

import { AnimatedPage } from "@/components/ui/animated-page";
import { DailyHeroCard } from "@/components/dashboard/daily-hero-card";
import { MoodCheckIn } from "@/components/dashboard/mood-check-in";
import { FocusCard } from "@/components/dashboard/focus-card";
import { RescuePlanCard } from "@/components/dashboard/rescue-plan";
import { TodaysPlan } from "@/components/dashboard/todays-plan";
import { FallbackPathCard } from "@/components/dashboard/fallback-path";
import { MVDBadge } from "@/components/dashboard/mvd-badge";
import { MemoryCard } from "@/components/dashboard/memory-card";
import { DailyTargetsStrip } from "@/components/dashboard/daily-targets-strip";
import { ProgressSnapshot } from "@/components/dashboard/progress-snapshot";
import { WeeklyRhythmStrip } from "@/components/dashboard/weekly-rhythm-strip";
import { WhatsNext } from "@/components/dashboard/whats-next";
import { WeeklyReflection } from "@/components/dashboard/weekly-reflection";
import { FavoriteActions } from "@/components/dashboard/favorite-actions";
import { ContinueCard } from "@/components/dashboard/continue-card";
import { QuickActionsGrid } from "@/components/dashboard/quick-actions-grid";
import { WaterCard } from "@/components/dashboard/water-card";

export default function HomePage() {
  return (
    <AnimatedPage>
      <div className="flex flex-col gap-4 pt-6 pb-4">
        {/* Identity */}
        <DailyHeroCard />

        {/* Emotional state */}
        <MoodCheckIn />

        {/* Strategic guidance — adaptive: focus OR rescue shows, not both */}
        <FocusCard />
        <RescuePlanCard />
        <TodaysPlan />
        <FallbackPathCard />
        <MVDBadge />

        {/* Memory */}
        <MemoryCard />

        {/* Reference */}
        <DailyTargetsStrip />

        {/* Water */}
        <WaterCard />

        {/* Status */}
        <ProgressSnapshot />
        <WeeklyRhythmStrip />

        {/* Tactical */}
        <WhatsNext />
        <WeeklyReflection />

        {/* Continuity */}
        <FavoriteActions />
        <ContinueCard />

        {/* Control */}
        <div className="mt-1">
          <QuickActionsGrid />
        </div>
      </div>
    </AnimatedPage>
  );
}
