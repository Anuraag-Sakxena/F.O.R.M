"use client";

import { motion } from "framer-motion";
import { useTracker } from "@/hooks/tracker-context";
import { moodOptions } from "@/lib/personalization";
import type { MoodLevel } from "@/lib/personalization";

export function MoodCheckIn() {
  const { mood, setMood, settings } = useTracker();

  if (!settings.checkInEnabled || mood !== null) return null;

  return (
    <div className="px-5">
      <motion.div
        className="rounded-2xl bg-card border border-border/60 shadow-xs p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        <p className="text-sm font-medium text-foreground mb-3">
          How are you feeling?
        </p>
        <div className="flex gap-2">
          {moodOptions.map((option) => (
            <motion.button
              key={option.level}
              type="button"
              className="flex-1 rounded-xl py-3 text-center transition-colors hover:bg-muted/60"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMood(option.level as MoodLevel)}
            >
              <div className="text-xl mb-0.5">{option.emoji}</div>
              <div className="text-[10px] font-medium text-muted-foreground">
                {option.label}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
