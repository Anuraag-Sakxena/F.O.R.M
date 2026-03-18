"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { formatDisplayDate } from "@/lib/day";
import { getFlowLabel, getFlowEmoji, getMomentumLabel, getMomentumColor } from "@/lib/behavior";
import { ProgressRing } from "@/components/ui/progress-ring";

const phaseEmoji: Record<string, string> = {
  morning: "☀️",
  afternoon: "🌤️",
  evening: "🌅",
  night: "🌙",
};

export function DailyHeroCard() {
  const {
    date, dayPhase, flowScore, flowState, currentStreak, momentumLevel,
    settings, closureMessage, heroMessage,
  } = useTracker();

  const displayDate = formatDisplayDate(date);
  const flowLabel = getFlowLabel(flowState);
  const flowEmoji = settings.showEmojis ? getFlowEmoji(flowState) : "";

  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    if (h >= 17 && h < 21) return "Good evening";
    return "Hey there";
  })();

  return (
    <motion.div
      className="px-5 pt-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <motion.h2
            className="text-[22px] font-semibold text-foreground tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            {greeting}, Pixie
            {settings.showEmojis && <span className="ml-1">{phaseEmoji[dayPhase]}</span>}
          </motion.h2>
          <motion.p
            className="text-[11px] text-muted-foreground mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {displayDate}
          </motion.p>
        </div>

        {currentStreak >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold text-white bg-gradient-to-r",
              getMomentumColor(momentumLevel)
            )}
          >
            {getMomentumLabel(momentumLevel)} · {currentStreak}d
          </motion.div>
        )}
      </div>

      <motion.div
        className="flex items-center gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
      >
        <div className="shrink-0">
          <ProgressRing percent={flowScore} size={84} strokeWidth={6} />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-primary">{flowLabel}</span>
            {flowEmoji && <span className="text-xs">{flowEmoji}</span>}
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {heroMessage}
          </p>
          {closureMessage && (
            <p className="text-[11px] text-muted-foreground/60 italic">
              {closureMessage}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
