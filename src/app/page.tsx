"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Plus, Minus, Heart, Droplets } from "lucide-react";
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
import { dailyTargets } from "@/lib/data/targets";
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

// Staggered container + children for smooth coordinated entrance
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const RING_R = 36;
const RING_C = 2 * Math.PI * RING_R;

export default function HomePage() {
  const t = useTracker();
  const [guidanceOpen, setGuidanceOpen] = useState(false);

  // ── Safe derived values ──────────────────────────────────
  const greeting = useMemo(() => { const h = new Date().getHours(); if (h >= 5 && h < 12) return "Good morning"; if (h >= 12 && h < 17) return "Good afternoon"; if (h >= 17 && h < 21) return "Good evening"; return "Hey there"; }, []);
  const displayDate = formatDisplayDate(t.date ?? "");
  const flowScore = t.flowScore ?? 0;
  const flowLabel = getFlowLabel(t.flowState ?? "starting");
  const flowEmoji = t.settings?.showEmojis ? getFlowEmoji(t.flowState ?? "starting") : "";
  const isComplete = flowScore >= 100;

  const skincareDone = (t.skincare ?? []).reduce((a, r) => a + r.steps.filter((s) => s.done).length, 0);
  const skincareTotal = (t.skincare ?? []).reduce((a, r) => a + r.steps.length, 0);
  const nrDone = (t.nightRoutine ?? []).filter((i) => i.done).length;
  const nrTotal = (t.nightRoutine ?? []).length;
  const waterAmount = t.waterIntake?.amount ?? 0;
  const waterTarget = t.waterIntake?.target ?? 3000;
  const waterL = (waterAmount / 1000).toFixed(1);
  const waterTargetL = (waterTarget / 1000).toFixed(1);
  const waterDone = waterAmount >= waterTarget;
  const waterPct = Math.min((waterAmount / waterTarget) * 100, 100);

  const hasRescue = !!(t.rescuePlan && t.settings?.showRescue);
  const guidanceTitle = hasRescue ? t.rescuePlan!.title : (t.dayPlan?.title ?? "");
  const guidanceMessage = hasRescue ? t.rescuePlan!.message : (t.dayPlan?.guidance ?? "");
  const guidanceSteps = hasRescue ? t.rescuePlan!.actions : (t.dayPlan?.steps ?? []);
  const showGuidance = t.settings?.showPlan || hasRescue;

  const quickLinks = useMemo(() => {
    const links: { label: string; emoji: string; href: string }[] = [];
    if (t.lastSection && sectionMeta[t.lastSection]) links.push(sectionMeta[t.lastSection]);
    (t.topFavorites ?? []).forEach((id) => { if (!links.find((l) => l.href === sectionMeta[id]?.href) && sectionMeta[id]) links.push(sectionMeta[id]); });
    return links;
  }, [t.lastSection, t.topFavorites]);

  const tiles = getAdaptiveTiles(t.dayPhase ?? "morning", t.workoutDone ?? false, t.todayMealsDone ?? 0, t.settings?.adaptiveEnabled ?? true);

  const progressItems = [
    { emoji: "✅", text: `${t.checklistDone ?? 0}/${t.checklistTotal ?? 0}`, ok: (t.checklistTotal ?? 0) > 0 && (t.checklistDone ?? 0) === (t.checklistTotal ?? 0) },
    { emoji: "🍽️", text: `${t.todayMealsDone ?? 0}/3`, ok: (t.todayMealsDone ?? 0) >= 3 },
    { emoji: "🏋🏻", text: t.workoutDone ? "Done" : "—", ok: !!t.workoutDone },
    { emoji: "✨", text: `${skincareDone}/${skincareTotal}`, ok: skincareTotal > 0 && skincareDone === skincareTotal },
    { emoji: "🌙", text: `${nrDone}/${nrTotal}`, ok: nrTotal > 0 && nrDone === nrTotal },
    { emoji: "💧", text: `${waterL}L`, ok: waterDone },
  ];

  const ringOffset = RING_C * (1 - Math.min(flowScore, 100) / 100);

  return (
    <AnimatedPage>
      <motion.div
        className="px-4 pt-4 pb-4 space-y-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >

        {/* ═══ 1. HERO CARD ═══ */}
        <motion.section variants={fadeUp}
          className="rounded-3xl bg-gradient-to-br from-primary/[0.08] via-accent-lavender-soft/40 to-accent-sky-soft/30 p-5 shadow-sm relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/[0.04]" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground tracking-tight leading-tight">
                {greeting}, Pixie
                {t.settings?.showEmojis && <span className="ml-1.5">{phaseEmoji[t.dayPhase] ?? ""}</span>}
              </h1>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5 font-medium">{displayDate}</p>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-primary">{flowLabel}</span>
                  {flowEmoji && <span className="text-[11px]">{flowEmoji}</span>}
                  {(t.currentStreak ?? 0) >= 2 && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[8px] font-bold text-white bg-gradient-to-r", getMomentumColor(t.momentumLevel ?? "starting"))}>
                      {getMomentumLabel(t.momentumLevel ?? "starting")} · {t.currentStreak}d
                    </span>
                  )}
                </div>
                <p className="text-[12px] leading-relaxed text-muted-foreground/80 max-w-[220px]">{t.heroMessage ?? ""}</p>
                {t.closureMessage && <p className="text-[10px] text-muted-foreground/50 italic">{t.closureMessage}</p>}
              </div>
            </div>

            {/* Flow Score Ring */}
            <div className="relative shrink-0" style={{ width: 84, height: 84 }}>
              <svg width={84} height={84} viewBox="0 0 84 84" className="-rotate-90">
                <circle cx={42} cy={42} r={RING_R} fill="none" stroke="currentColor" strokeWidth={5} className="text-white/60" />
                <motion.circle cx={42} cy={42} r={RING_R} fill="none" stroke="currentColor" strokeWidth={5.5} strokeLinecap="round"
                  className="text-primary" strokeDasharray={RING_C}
                  initial={{ strokeDashoffset: RING_C }}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              {isComplete ? (
                <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.4 }}>
                  <Image src="/yellow-verified-sign-and-tick-18751.svg" alt="Complete" width={38} height={38} />
                </motion.div>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">{flowScore}%</span>
              )}
            </div>
          </div>

          {/* Mood inline */}
          {t.settings?.checkInEnabled && !t.mood && (
            <div className="mt-4 pt-3 border-t border-foreground/[0.06]">
              <p className="text-[11px] font-medium text-muted-foreground mb-2">How are you feeling?</p>
              <div className="flex gap-2">
                {moodOptions.map((opt) => (
                  <motion.button key={opt.level} type="button" whileTap={{ scale: 0.92 }} onClick={() => t.setMood(opt.level)}
                    className="flex-1 flex flex-col items-center gap-0.5 rounded-xl py-2 bg-white/50 active:bg-white/70 backdrop-blur-sm transition-colors">
                    <span className="text-lg">{opt.emoji}</span>
                    <span className="text-[9px] font-medium text-muted-foreground">{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* ═══ 2. QUICK STATS ═══ */}
        <motion.section variants={fadeUp}>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "🥩", label: "Protein", value: `${dailyTargets.protein.min}–${dailyTargets.protein.max}g`, color: "from-accent-peach-soft/60 to-accent-peach-soft/30" },
              { icon: "🔥", label: "Calories", value: `${dailyTargets.calories.min}–${dailyTargets.calories.max}`, color: "from-accent-rose-soft/50 to-accent-rose-soft/25" },
              { icon: "👟", label: "Steps", value: `${(dailyTargets.steps.min / 1000).toFixed(0)}–${(dailyTargets.steps.max / 1000).toFixed(0)}K`, color: "from-accent-mint-soft/60 to-accent-mint-soft/30" },
              { icon: "🥗", label: "Meals", value: `${dailyTargets.meals}/day`, color: "from-accent-sky-soft/60 to-accent-sky-soft/30" },
            ].map((s, i) => (
              <div key={i} className={cn("rounded-2xl bg-gradient-to-b p-2.5 text-center", s.color)}>
                <span className="text-sm">{s.icon}</span>
                <p className="text-[10px] font-bold text-foreground tabular-nums mt-0.5">{s.value}</p>
                <p className="text-[8px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══ 3. FOCUS + PROGRESS ═══ */}
        <motion.section variants={fadeUp} className="space-y-2.5">
          {t.supportConfig?.showFocusCard && !t.homeRec?.showRescueOverFocus && (
            <div className={cn("rounded-2xl px-4 py-3 bg-gradient-to-r", getDayModeAccent(t.dayMode?.mode ?? "balanced"))}>
              <p className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground/60">Focus</p>
              <p className="text-[13px] font-medium text-foreground mt-0.5">{t.focusMessage ?? ""}</p>
            </div>
          )}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {progressItems.map((p) => (
              <div key={p.emoji} className={cn("rounded-full px-2.5 py-1 flex items-center gap-1 text-[10px] font-semibold whitespace-nowrap shadow-xs", p.ok ? "bg-success-soft text-success" : "bg-card text-foreground/60 border border-border/50")}>
                <span className="text-[11px]">{p.emoji}</span><span>{p.text}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══ 4. WATER ═══ */}
        <motion.section variants={fadeUp}>
          <div className={cn("rounded-2xl shadow-sm overflow-hidden", waterDone ? "bg-gradient-to-r from-accent-sky/10 via-accent-sky/5 to-accent-mint/5" : "bg-card border border-border/50")}>
            <div className="p-3.5 flex items-center gap-3">
              <div className={cn("flex items-center justify-center h-10 w-10 rounded-xl shrink-0", waterDone ? "bg-accent-sky/15" : "bg-accent-sky/8")}>
                <Droplets size={18} className="text-accent-sky" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-foreground">Water</span>
                  <span className={cn("text-[12px] font-bold tabular-nums", waterDone ? "text-accent-sky" : "text-foreground")}>{waterL}<span className="text-muted-foreground/50 font-medium">/{waterTargetL}L</span></span>
                </div>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div className={cn("h-full rounded-full", waterDone ? "bg-gradient-to-r from-accent-sky to-accent-mint" : "bg-accent-sky/80")}
                    initial={{ width: 0 }}
                    animate={{ width: `${waterPct}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 18 }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => t.setWaterAmount(Math.max(0, waterAmount - 500))} disabled={waterAmount === 0}
                  className={cn("flex items-center justify-center h-8 w-8 rounded-full", waterAmount === 0 ? "bg-muted/30 text-muted-foreground/20" : "bg-muted/50 text-muted-foreground active:bg-muted")}>
                  <Minus size={14} strokeWidth={2.5} />
                </motion.button>
                <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => t.addWater(500)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-sky text-white shadow-sm active:bg-accent-sky/80">
                  <Plus size={14} strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══ 5. GUIDANCE ACCORDION ═══ */}
        {showGuidance && (
          <motion.section variants={fadeUp}>
            <div className={cn("rounded-2xl shadow-sm overflow-hidden", hasRescue ? "bg-gradient-to-br from-accent-lavender-soft/30 to-accent-rose-soft/15 border border-accent-lavender/15" : "bg-card border border-border/50")}>
              <button type="button" onClick={() => setGuidanceOpen((p) => !p)} className="flex w-full items-center gap-3 p-4 text-left">
                {hasRescue && <Heart size={14} className="text-accent-rose shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/50">{guidanceTitle}</p>
                  <p className="text-[13px] text-foreground mt-0.5 leading-relaxed">{guidanceMessage}</p>
                </div>
                <motion.div animate={{ rotate: guidanceOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 p-1 rounded-full bg-muted/40">
                  <ChevronDown size={14} className="text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {guidanceOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-1.5">
                      {guidanceSteps.map((step, i) => {
                        const isDone = step.toLowerCase().includes("done");
                        return (
                          <div key={i} className={cn("flex items-start gap-2 text-xs", isDone ? "text-muted-foreground/40" : "text-foreground/70")}>
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
            {t.settings?.showMVDMessages && t.supportConfig?.showMVDBadge && t.mvd?.met && flowScore < 65 && (
              <div className="flex items-center gap-2 rounded-xl bg-accent-sky-soft/25 px-3 py-2 mt-2">
                <span className="text-sm">🫶</span>
                <p className="text-[10px] text-foreground/60 font-medium">The basics were covered. That matters.</p>
              </div>
            )}
          </motion.section>
        )}

        {/* ═══ 6. UP NEXT ═══ */}
        {t.nextAction ? (
          <motion.div variants={fadeUp}>
            <Link href={t.nextAction.href} className="block">
              <div className="rounded-2xl bg-card border border-border/50 shadow-sm p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary-soft/50 shrink-0">
                  <span className="text-base">{t.nextAction.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-bold">Up next</p>
                  <p className="text-[13px] font-semibold text-foreground truncate">{t.nextAction.label}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/40 shrink-0" />
              </div>
            </Link>
          </motion.div>
        ) : isComplete ? (
          <motion.div variants={fadeUp}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-success-soft/40 to-accent-mint-soft/30 p-4 shadow-sm">
            <span className="text-base">✨</span>
            <p className="text-sm font-semibold text-success">All done for today</p>
          </motion.div>
        ) : null}

        {/* ═══ 7. RHYTHM SECTION ═══ */}
        <motion.section variants={fadeUp}
          className="rounded-2xl bg-card border border-border/50 shadow-sm p-4 space-y-3">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/40 mb-2">Your week</p>
            <div className="flex gap-1">
              {(t.weeklyRhythm ?? []).map((day) => (
                <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[8px] font-semibold text-muted-foreground/40">{day.dayShort}</span>
                  <div className={cn(
                    "rounded-full transition-all",
                    day.score === null ? "w-2.5 h-2.5 bg-muted/50" : day.score >= 60 ? "w-3 h-3 bg-success shadow-sm" : day.score > 0 ? "w-3 h-3 bg-accent-amber shadow-sm" : "w-2.5 h-2.5 bg-muted/50",
                    day.isToday && "ring-2 ring-primary/30 ring-offset-1 ring-offset-card"
                  )} />
                </div>
              ))}
            </div>
          </div>
          {(t.memoryInsights ?? []).length > 0 && t.settings?.adaptiveMemoryEnabled && (
            <div className="flex items-start gap-2 pt-2 border-t border-border/30">
              <span className="text-sm shrink-0 mt-0.5">{t.memoryInsights[0].emoji}</span>
              <p className="text-[10px] text-muted-foreground/60 font-medium leading-relaxed">{t.memoryInsights[0].text}</p>
            </div>
          )}
          {quickLinks.length >= 2 && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pt-1">
              {quickLinks.slice(0, 4).map((l) => (
                <Link key={l.href} href={l.href}>
                  <motion.div whileTap={{ scale: 0.95 }} className="rounded-xl bg-muted/30 px-3 py-1.5 flex items-center gap-1.5 whitespace-nowrap active:bg-muted/50 transition-colors">
                    <span className="text-[11px]">{l.emoji}</span>
                    <span className="text-[10px] font-semibold text-foreground/60">{l.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
          {t.weeklyReflection && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-[10px] text-muted-foreground/55 font-medium leading-relaxed">{t.weeklyReflection.message}</p>
            </div>
          )}
        </motion.section>

        {/* ═══ 8. ACTION GRID ═══ */}
        <motion.section variants={fadeUp}>
          <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/40 mb-2 px-0.5">Quick actions</p>
          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile) => {
              const extra = tile.id === "checklist" ? { done: t.checklistDone ?? 0, total: t.checklistTotal ?? 0 }
                : tile.id === "meals" ? { done: t.todayMealsDone ?? 0, total: 3 } : {};
              const status = (tile.id === "workout" && t.workoutDone) || (tile.id === "checklist" && (t.checklistDone ?? 0) === (t.checklistTotal ?? 0) && (t.checklistTotal ?? 0) > 0) || (tile.id === "meals" && (t.todayMealsDone ?? 0) >= 3) ? "Done" : undefined;
              return (
                <Link key={tile.id} href={tile.href}>
                  <motion.div whileTap={{ scale: 0.94 }} className={cn("rounded-2xl p-3 min-h-[76px] flex flex-col justify-between shadow-xs", tile.bgClass)}>
                    <div className="flex items-start justify-between">
                      <span className="text-xl">{tile.emoji}</span>
                      {"done" in extra && extra.total ? (
                        <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[9px] font-bold text-foreground/50 backdrop-blur-sm">{extra.done}/{extra.total}</span>
                      ) : status ? (
                        <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[9px] font-bold text-success backdrop-blur-sm">{status}</span>
                      ) : null}
                    </div>
                    <span className="text-[10px] font-semibold text-foreground/65 mt-auto">{tile.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

      </motion.div>
    </AnimatedPage>
  );
}
