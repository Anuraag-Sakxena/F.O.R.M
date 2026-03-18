"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";

export function WeeklyRhythmStrip() {
  const { weeklyRhythm } = useTracker();

  return (
    <div className="px-5">
      <motion.div
        className="flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        {weeklyRhythm.map((day) => {
          const dotClass =
            day.score === null || day.score === undefined
              ? "w-2 h-2 rounded-full bg-border"
              : day.score >= 60
                ? "w-2.5 h-2.5 rounded-full bg-success"
                : day.score > 0
                  ? "w-2.5 h-2.5 rounded-full bg-accent-amber"
                  : "w-2 h-2 rounded-full bg-border";

          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-[9px] font-medium text-muted-foreground">
                {day.dayShort}
              </span>
              <div
                className={cn(
                  dotClass,
                  day.isToday && "ring-2 ring-primary/30"
                )}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
