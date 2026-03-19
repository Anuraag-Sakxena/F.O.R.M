"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";

const entrance: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.35 },
  },
};

export function WaterCard() {
  const { waterIntake, addWater } = useTracker();

  const { amount, target } = waterIntake;
  const progress = Math.min((amount / target) * 100, 100);
  const done = amount >= target;

  return (
    <div className="px-5">
      <motion.div
        variants={entrance}
        initial="hidden"
        animate="show"
        className={cn(
          "rounded-2xl bg-card border border-border/60 shadow-xs p-3.5",
          done && "border-accent-sky/40 bg-accent-sky/5"
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">💧</span>
            <span className="text-xs font-medium text-muted-foreground">
              Water
            </span>
          </div>
          <span
            className={cn(
              "text-xs font-semibold tabular-nums",
              done ? "text-accent-sky" : "text-foreground"
            )}
          >
            {(amount / 1000).toFixed(1)}L / {(target / 1000).toFixed(1)}L
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2.5">
          <motion.div
            className="h-full rounded-full bg-accent-sky"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Quick-add buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => addWater(250)}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              "bg-accent-sky/10 text-accent-sky active:bg-accent-sky/20"
            )}
          >
            +250 mL
          </button>
          <button
            type="button"
            onClick={() => addWater(500)}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              "bg-accent-sky/10 text-accent-sky active:bg-accent-sky/20"
            )}
          >
            +500 mL
          </button>
        </div>
      </motion.div>
    </div>
  );
}
