"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Plus, Minus, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { formatDisplayDate } from "@/lib/day";
import { getFlowLabel, getFlowEmoji, getMomentumLabel, getMomentumColor } from "@/lib/behavior";
import { getDayModeAccent } from "@/lib/day-modes";
import { getAdaptiveTiles } from "@/lib/personalization";
import { moodOptions } from "@/lib/personalization";
import { AnimatedPage } from "@/components/ui/animated-page";
import type { SectionId } from "@/types";

const phaseEmoji: Record<string, string> = { morning: "☀️", afternoon: "🌤️", evening: "🌅", night: "🌙" };

const sectionMeta: Record<SectionId, { label: string; emoji: string; href: string }> = {
  checklist: { label: "Goals", emoji: "✅", href: "/checklist" },
  meals: { label: "Meals", emoji: "🍽️", href: "/meals" },
  workout: { label: "Workout", emoji: "💪", href: "/workout" },
  groceries: { label: "Groceries", emoji: "🛒", href: "/groceries" },
  skincare: { label: "Skincare", emoji: "✨", href: "/skincare" },
  recipes: { label: "Recipes", emoji: "📖", href: "/recipes" },
};

export default function HomePage() {
  const t = useTracker();
  const [guidanceOpen, setGuidanceOpen] = useState(false);

  const greeting = (() => { const h = new Date().getHours(); if (h >= 5 && h < 12) return "Good morning"; if (h >= 12 && h < 17) return "Good afternoon"; if (h >= 17 && h < 21) return "Good evening"; return "Hey there"; })();
  const displayDate = formatDisplayDate(t.date);
  const flowLabel = getFlowLabel(t.flowState);
  const flowEmoji = t.settings.showEmojis ? getFlowEmoji(t.flowState) : "";
  const isComplete = t.flowScore >= 100;

  // Progress data
  const skincareDone = t.skincare.reduce((a, r) => a + r.steps.filter((s) => s.done).length, 0);
  const skincareTotal = t.skincare.reduce((a, r) => a + r.steps.length, 0);
  const nrDone = t.nightRoutine.filter((i) => i.done).length;
  const nrTotal = t.nightRoutine.length;
  const waterL = (t.waterIntake.amount / 1000).toFixed(1);
  const waterDone = t.waterIntake.amount >= t.waterIntake.target;

  // Guidance content
  const hasRescue = t.rescuePlan && t.settings.showRescue;
  const guidanceTitle = hasRescue ? t.rescuePlan!.title : t.dayPlan.title;
  const guidanceMessage = hasRescue ? t.rescuePlan!.message : t.dayPlan.guidance;
  const guidanceSteps = hasRescue ? t.rescuePlan!.actions : t.dayPlan.steps;
  const showGuidance = t.settings.showPlan || (hasRescue && t.settings.showRescue);

  // Quick access: favorites + continue merged
  const quickLinks: { label: string; emoji: string; href: string }[] = [];
  if (t.lastSection && sectionMeta[t.lastSection]) {
    const m = sectionMeta[t.lastSection];
    quickLinks.push(m);
  }
  t.topFavorites.forEach((id) => {
    if (!quickLinks.find((l) => l.href === sectionMeta[id]?.href) && sectionMeta[id]) {
      quickLinks.push(sectionMeta[id]);
    }
  });

  // Adaptive tiles
  const tiles = getAdaptiveTiles(t.dayPhase, t.workoutDone, t.todayMealsDone, t.settings.adaptiveEnabled);

  return (
    <AnimatedPage>
      <div className="px-5 pt-5 pb-4 space-y-5">

        {/* ═══ SECTION 1: Hero ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left: all text content */}
            <div className="flex-1 min-w-0">
              {/* Greeting */}
              <h1 className="text-[22px] font-semibold text-foreground tracking-tight leading-tight">
                {greeting}, Pixie{t.settings.showEmojis && <span className="ml-1">{phaseEmoji[t.dayPhase]}</span>}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">{displayDate}</p>

              {/* Flow state + message */}
              <div className="mt-2.5 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-primary">{flowLabel}</span>
                  {flowEmoji && <span className="text-xs">{flowEmoji}</span>}
                  {t.currentStreak >= 2 && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold text-white bg-gradient-to-r ml-1", getMomentumColor(t.momentumLevel))}>
                      {getMomentumLabel(t.momentumLevel)} · {t.currentStreak}d
                    </span>
                  )}
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground max-w-[240px]">{t.heroMessage}</p>
                {t.closureMessage && <p className="text-[11px] text-muted-foreground/50 italic">{t.closureMessage}</p>}
              </div>
            </div>

            {/* Right: Flow Score Ring */}
            <div className="relative shrink-0 mt-1" style={{ width: 80, height: 80 }}>
              <svg width={80} height={80} viewBox="0 0 80 80" className="-rotate-90">
                <circle cx={40} cy={40} r={34} fill="none" stroke="currentColor" strokeWidth={5} className="text-muted" />
                <motion.circle
                  cx={40} cy={40} r={34} fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round"
                  className="text-primary" strokeDasharray={2 * Math.PI * 34}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - Math.min(t.flowScore, 100) / 100) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              {isComplete ? (
                <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}>
                  <Image src="/yellow-verified-sign-and-tick-18751.svg" alt="Complete" width={36} height={36} />
                </motion.div>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">{t.flowScore}%</span>
              )}
            </div>
          </div>
        </motion.section>

        {/* ═══ SECTION 2: Mood Check-in (if needed) ═══ */}
        {t.settings.checkInEnabled && !t.mood && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-2xl bg-card border border-border/60 shadow-xs p-4">
            <p className="text-sm font-medium text-foreground mb-3">How are you feeling?</p>
            <div className="flex gap-2">
              {moodOptions.map((opt) => (
                <motion.button key={opt.level} type="button" whileTap={{ scale: 0.93 }} onClick={() => t.setMood(opt.level)}
                  className="flex-1 flex flex-col items-center gap-1 rounded-xl py-3 bg-muted/40 active:bg-muted transition-colors">
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {/* ═══ SECTION 3: Focus + Progress Strip ═══ */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
          {/* Focus message */}
          {t.supportConfig.showFocusCard && !t.homeRec.showRescueOverFocus && (
            <div className={cn("rounded-2xl px-4 py-3 bg-gradient-to-r", getDayModeAccent(t.dayMode.mode))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Today&apos;s Focus</p>
                  <p className="text-[13px] font-medium text-foreground mt-1">{t.focusMessage}</p>
                </div>
                {t.settings.showEmojis && <span className="text-sm opacity-50">{t.dayMode.emoji}</span>}
              </div>
            </div>
          )}

          {/* Progress pills — compact row */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { emoji: "✅", text: `${t.checklistDone}/${t.checklistTotal}`, ok: t.checklistTotal > 0 && t.checklistDone === t.checklistTotal },
              { emoji: "🍽️", text: `${t.todayMealsDone}/3`, ok: t.todayMealsDone >= 3 },
              { emoji: "💪", text: t.workoutDone ? "Done" : "—", ok: t.workoutDone },
              { emoji: "✨", text: `${skincareDone}/${skincareTotal}`, ok: skincareTotal > 0 && skincareDone === skincareTotal },
              { emoji: "🌙", text: `${nrDone}/${nrTotal}`, ok: nrTotal > 0 && nrDone === nrTotal },
              { emoji: "💧", text: `${waterL}L`, ok: waterDone },
            ].map((p) => (
              <div key={p.emoji} className={cn("rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] font-medium whitespace-nowrap", p.ok ? "bg-success-soft text-success" : "bg-muted/50 text-foreground/70")}>
                <span>{p.emoji}</span><span>{p.text}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══ SECTION 4: Water — Compact ═══ */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className={cn("rounded-2xl border shadow-xs p-3.5", waterDone ? "bg-gradient-to-r from-accent-sky/6 to-accent-sky/2 border-accent-sky/25" : "bg-card border-border/60")}>
            <div className="flex items-center gap-3">
              <span className="text-lg">💧</span>
              {/* Progress bar — fills the middle */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">Water</span>
                  <span className={cn("text-xs font-bold tabular-nums", waterDone ? "text-accent-sky" : "text-foreground")}>{waterL}L / {(t.waterIntake.target / 1000).toFixed(1)}L</span>
                </div>
                <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", waterDone ? "bg-gradient-to-r from-accent-sky to-accent-mint" : "bg-accent-sky")}
                    animate={{ width: `${Math.min((t.waterIntake.amount / t.waterIntake.target) * 100, 100)}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
              {/* Compact +/- buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => t.setWaterAmount(Math.max(0, t.waterIntake.amount - 500))} disabled={t.waterIntake.amount === 0}
                  className={cn("flex items-center justify-center h-8 w-8 rounded-full border", t.waterIntake.amount === 0 ? "border-border/30 text-muted-foreground/20" : "border-border text-muted-foreground active:bg-muted")}>
                  <Minus size={14} strokeWidth={2.5} />
                </motion.button>
                <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => t.addWater(500)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-sky text-white active:bg-accent-sky/80">
                  <Plus size={14} strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══ SECTION 5: Smart Guidance Accordion ═══ */}
        {showGuidance && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className={cn("rounded-2xl border shadow-xs overflow-hidden", hasRescue ? "bg-gradient-to-r from-accent-lavender-soft/30 to-accent-sky-soft/20 border-accent-lavender/20" : "bg-card border-border/60")}>
              <button type="button" onClick={() => setGuidanceOpen((p) => !p)} className="flex w-full items-center gap-3 p-4 text-left">
                {hasRescue && <Heart size={14} className="text-accent-rose shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{guidanceTitle}</p>
                  <p className="text-[13px] text-foreground mt-0.5 leading-relaxed">{guidanceMessage}</p>
                </div>
                <motion.div animate={{ rotate: guidanceOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                  <ChevronDown size={16} className="text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {guidanceOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-1.5">
                      {guidanceSteps.map((step, i) => {
                        const isDone = step.toLowerCase().includes("done");
                        return (
                          <div key={i} className={cn("flex items-start gap-2 text-xs", isDone ? "text-muted-foreground/50" : "text-foreground/75")}>
                            <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full mt-0.5 text-[9px] font-bold", isDone ? "bg-success-soft text-success" : "bg-primary/10 text-primary")}>{isDone ? "✓" : i + 1}</span>
                            <span className={isDone ? "line-through" : ""}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MVD badge inline */}
            {t.settings.showMVDMessages && t.supportConfig.showMVDBadge && t.mvd.met && t.flowScore < 65 && (
              <div className="flex items-center gap-2 rounded-xl bg-accent-sky-soft/30 px-3 py-2 mt-2">
                <span className="text-sm">🫶</span>
                <p className="text-[11px] text-foreground/65 font-medium">The basics were covered. That matters.</p>
              </div>
            )}
          </motion.section>
        )}

        {/* ═══ SECTION 6: What's Next ═══ */}
        {t.nextAction ? (
          <Link href={t.nextAction.href} className="block">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
              className="rounded-2xl bg-card border border-border/60 shadow-xs p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
              <span className="text-base">{t.nextAction.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Up next</p>
                <p className="text-sm font-medium text-foreground truncate">{t.nextAction.label}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </motion.div>
          </Link>
        ) : isComplete ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-card border border-border/60 shadow-xs p-3.5">
            <span className="text-sm">✨</span>
            <p className="text-sm font-medium text-muted-foreground">All done for today</p>
          </motion.div>
        ) : null}

        {/* ═══ SECTION 7: Rhythm + Memory ═══ */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="space-y-2.5">
          {/* Weekly dots */}
          <div className="flex items-center gap-3">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 shrink-0">7 days</p>
            <div className="flex gap-1.5 flex-1">
              {t.weeklyRhythm.map((day) => (
                <div key={day.date} className="flex flex-col items-center gap-0.5 flex-1">
                  <span className="text-[8px] font-medium text-muted-foreground/50">{day.dayShort}</span>
                  <div className={cn(
                    "rounded-full",
                    day.score === null ? "w-2 h-2 bg-border" : day.score >= 60 ? "w-2.5 h-2.5 bg-success" : day.score > 0 ? "w-2.5 h-2.5 bg-accent-amber" : "w-2 h-2 bg-border",
                    day.isToday && "ring-2 ring-primary/30"
                  )} />
                </div>
              ))}
            </div>
          </div>

          {/* Memory insight + Rhythm tags — inline row */}
          <div className="flex items-start gap-3">
            {t.memoryInsights.length > 0 && t.settings.adaptiveMemoryEnabled && (
              <div className="flex-1 flex items-start gap-2 rounded-xl bg-muted/25 border border-border/25 px-3 py-2.5 min-w-0">
                <span className="text-sm shrink-0">{t.memoryInsights[0].emoji}</span>
                <p className="text-[10px] text-foreground/60 font-medium leading-relaxed">{t.memoryInsights[0].text}</p>
              </div>
            )}
          </div>

          {/* Quick access chips — "Your Rhythm" */}
          {quickLinks.length >= 2 && (
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/50 shrink-0">Rhythm</p>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                {quickLinks.slice(0, 4).map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-lg bg-muted/40 px-2.5 py-1.5 flex items-center gap-1 whitespace-nowrap active:bg-muted transition-colors">
                    <span className="text-xs">{l.emoji}</span>
                    <span className="text-[10px] font-medium text-foreground/70">{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Weekly reflection */}
          {t.weeklyReflection && (
            <div className="rounded-xl bg-gradient-to-r from-accent-lavender-soft/30 to-accent-sky-soft/20 px-3.5 py-2.5">
              <p className="text-[11px] text-foreground/65 font-medium leading-relaxed">{t.weeklyReflection.message}</p>
            </div>
          )}
        </motion.section>

        {/* ═══ SECTION 8: Quick Actions Grid ═══ */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile) => {
              const extra = tile.id === "checklist" ? { done: t.checklistDone, total: t.checklistTotal }
                : tile.id === "meals" ? { done: t.todayMealsDone, total: 3 }
                : {};
              const status = tile.id === "workout" && t.workoutDone ? "Done"
                : tile.id === "checklist" && t.checklistDone === t.checklistTotal && t.checklistTotal > 0 ? "Done"
                : tile.id === "meals" && t.todayMealsDone >= 3 ? "Done"
                : undefined;
              return (
                <Link key={tile.id} href={tile.href}>
                  <motion.div whileTap={{ scale: 0.95 }} className={cn("rounded-xl p-3 min-h-[72px] flex flex-col justify-between", tile.bgClass)}>
                    <div className="flex items-start justify-between">
                      <span className="text-lg">{tile.emoji}</span>
                      {"done" in extra && extra.total ? (
                        <span className="rounded-full bg-white/50 px-1.5 py-0.5 text-[9px] font-medium text-foreground/60">{extra.done}/{extra.total}</span>
                      ) : status ? (
                        <span className="rounded-full bg-white/50 px-1.5 py-0.5 text-[9px] font-medium text-foreground/60">{status}</span>
                      ) : null}
                    </div>
                    <span className="text-[10px] font-medium text-foreground/70 mt-auto">{tile.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

      </div>
    </AnimatedPage>
  );
}
