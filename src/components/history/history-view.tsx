"use client";

import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Flame, Trophy, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { formatShortDate, calculateBestStreak, getWeekCompletedCount } from "@/lib/day";
import { calculateFlowScore, getMomentumLabel } from "@/lib/behavior";
import { assessDayQuality } from "@/lib/intelligence/day-quality";

type Filter = "all" | "in-flow" | "held" | "partial";

const listContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut" as const, duration: 0.3 } },
};

export function HistoryView() {
  const { historySummaries, date, currentStreak, momentumLevel, memoryInsights, profile } = useTracker();
  const [filter, setFilter] = useState<Filter>("all");

  const bestStreak = useMemo(() => calculateBestStreak(historySummaries, 60), [historySummaries]);
  const weekCount = useMemo(() => getWeekCompletedCount(historySummaries, 60), [historySummaries]);

  const filtered = useMemo(() => {
    const past = historySummaries.filter((s) => s.date !== date);
    switch (filter) {
      case "in-flow": return past.filter((s) => { const q = assessDayQuality(s); return q.quality === "in-flow" || q.quality === "strong"; });
      case "held": return past.filter((s) => assessDayQuality(s).quality === "held-together");
      case "partial": return past.filter((s) => { const q = assessDayQuality(s); return q.quality === "partial" || q.quality === "reset" || q.quality === "missed"; });
      default: return past;
    }
  }, [historySummaries, filter, date]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "in-flow", label: "In Flow" },
    { key: "held", label: "Held Together" },
    { key: "partial", label: "Other" },
  ];

  return (
    <AnimatedPage>
      <PageHeader title="History" emoji="📅" backHref="/" />

      <div className="px-5 pb-8">
        {/* Streak stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="rounded-2xl bg-accent-peach-soft/60 p-3 text-center">
            <Flame size={18} className="mx-auto text-accent-peach mb-1" />
            <p className="text-lg font-bold text-foreground">{currentStreak}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{getMomentumLabel(momentumLevel)}</p>
          </div>
          <div className="rounded-2xl bg-accent-amber-soft/60 p-3 text-center">
            <Trophy size={18} className="mx-auto text-accent-amber mb-1" />
            <p className="text-lg font-bold text-foreground">{bestStreak}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Best streak</p>
          </div>
          <div className="rounded-2xl bg-accent-sky-soft/60 p-3 text-center">
            <CalendarDays size={18} className="mx-auto text-accent-sky mb-1" />
            <p className="text-lg font-bold text-foreground">{weekCount}</p>
            <p className="text-[10px] text-muted-foreground font-medium">This week</p>
          </div>
        </div>

        {/* Memory insights */}
        {memoryInsights.length > 0 && (
          <div className="mb-5 space-y-2">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 px-1 mb-1">
              What F.O.R.M. has learned
            </p>
            {memoryInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl bg-muted/30 border border-border/30 px-3.5 py-2.5">
                <span className="text-sm shrink-0">{insight.emoji}</span>
                <p className="text-[11px] text-foreground/65 font-medium leading-relaxed">{insight.text}</p>
              </div>
            ))}
            {profile.recentTrend !== "insufficient" && profile.strongestAnchor && (
              <div className="flex items-center gap-2 px-1 pt-1">
                <span className="text-[10px] text-muted-foreground/50">
                  Based on {profile.dataPoints} days · Confidence: {profile.overallConfidence}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm text-muted-foreground">No days to show yet</p>
          </div>
        ) : (
          <motion.div className="space-y-2.5" variants={listContainer} initial="hidden" animate="show" key={filter}>
            {filtered.map((day) => {
              const score = calculateFlowScore(day);
              const quality = assessDayQuality(day);
              return (
                <motion.div key={day.date} variants={listItem} className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{formatShortDate(day.date)}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-bold rounded-full px-2 py-0.5", quality.bgColor, quality.color)}>
                        {quality.label}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {score}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground">
                    <span>✅ {day.checklistDone}/{day.checklistTotal}</span>
                    <span>🍽️ {day.mealsDone}/{day.mealsTotal}</span>
                    <span>💪 {day.workoutDone ? "Done" : "—"}</span>
                    <span>✨ {day.skincareMorningDone + day.skincareNightDone}/{day.skincareMorningTotal + day.skincareNightTotal}</span>
                    <span>🌙 {day.nightRoutineDone}/{day.nightRoutineTotal}</span>
                  </div>

                  <div className="mt-2.5 h-1 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", score >= 60 ? "bg-success" : score > 15 ? "bg-accent-amber" : "bg-muted-foreground/30")} style={{ width: `${score}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
}
