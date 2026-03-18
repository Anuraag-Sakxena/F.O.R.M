"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { getDayModeAccent } from "@/lib/day-modes";

export function FocusCard() {
  const { focusMessage, dayMode, supportConfig, homeRec } = useTracker();

  // Don't show if support style says no, or if rescue is showing instead
  if (!supportConfig.showFocusCard) return null;
  if (homeRec.showRescueOverFocus) return null;

  return (
    <div className="px-5">
      <motion.div
        className={cn("rounded-2xl p-4 px-5 bg-gradient-to-r", getDayModeAccent(dayMode.mode))}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
              Today&apos;s Focus
            </p>
            <p className="text-[13px] font-medium text-foreground leading-relaxed mt-1.5">
              {focusMessage}
            </p>
          </div>
          <span className="text-sm opacity-60 shrink-0 mt-0.5">{dayMode.emoji}</span>
        </div>
      </motion.div>
    </div>
  );
}
