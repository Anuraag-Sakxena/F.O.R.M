"use client";

import { useState, useCallback } from "react";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";

const STEP = 500;

export function WaterCard() {
  const { waterIntake, addWater, setWaterAmount } = useTracker();
  const { amount, target } = waterIntake;
  const progress = Math.min((amount / target) * 100, 100);
  const overGoal = amount > target;
  const done = amount >= target;

  // Ripple flash on add
  const [ripple, setRipple] = useState(false);
  const numControls = useAnimationControls();

  const handleAdd = useCallback(() => {
    addWater(STEP);
    // Trigger ripple
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
    // Bounce the number
    numControls.start({
      scale: [1, 1.15, 1],
      transition: { duration: 0.3, ease: "easeOut" },
    });
  }, [addWater, numControls]);

  const handleMinus = useCallback(() => {
    const next = Math.max(0, amount - STEP);
    setWaterAmount(next);
    numControls.start({
      scale: [1, 0.9, 1],
      transition: { duration: 0.25, ease: "easeOut" },
    });
  }, [amount, setWaterAmount, numControls]);

  const liters = (amount / 1000).toFixed(1);
  const targetL = (target / 1000).toFixed(1);

  return (
    <div className="px-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "relative rounded-2xl overflow-hidden border shadow-xs",
          done
            ? "bg-gradient-to-br from-accent-sky/8 to-accent-sky/3 border-accent-sky/30"
            : "bg-card border-border/60"
        )}
      >
        {/* Ripple flash overlay */}
        <AnimatePresence>
          {ripple && (
            <motion.div
              key="ripple"
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-accent-sky/15 pointer-events-none z-10"
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="relative z-0 p-4">
          {/* Top row: label + amount */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">💧</span>
              <span className="text-sm font-medium text-foreground">Water</span>
            </div>
            <motion.div
              animate={numControls}
              className="flex items-baseline gap-0.5"
            >
              <span
                className={cn(
                  "text-xl font-bold tabular-nums tracking-tight",
                  done ? "text-accent-sky" : "text-foreground"
                )}
              >
                {liters}L
              </span>
              <span className="text-xs text-muted-foreground font-medium ml-0.5">
                / {targetL}L
              </span>
            </motion.div>
          </div>

          {/* Progress bar — thick, alive */}
          <div className="h-3 rounded-full bg-muted/60 overflow-hidden mb-4 relative">
            <motion.div
              className={cn(
                "h-full rounded-full",
                overGoal
                  ? "bg-gradient-to-r from-accent-sky to-accent-mint"
                  : "bg-gradient-to-r from-accent-sky/80 to-accent-sky"
              )}
              animate={{ width: `${Math.min((amount / target) * 100, 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            {/* Subtle shimmer on the bar */}
            {done && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>

          {/* Over-goal badge */}
          {overGoal && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-medium text-accent-sky text-center mb-3"
            >
              Above goal — great hydration
            </motion.p>
          )}

          {/* Action buttons: – and + */}
          <div className="flex items-center gap-3">
            {/* Minus */}
            <motion.button
              type="button"
              onClick={handleMinus}
              disabled={amount === 0}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex items-center justify-center h-12 w-12 rounded-full border-2 transition-colors shrink-0",
                amount === 0
                  ? "border-border/40 text-muted-foreground/30"
                  : "border-border text-muted-foreground active:bg-muted"
              )}
            >
              <Minus size={18} strokeWidth={2.5} />
            </motion.button>

            {/* Center label */}
            <div className="flex-1 text-center">
              <p className="text-[11px] text-muted-foreground font-medium">
                500 mL per tap
              </p>
            </div>

            {/* Plus */}
            <motion.button
              type="button"
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex items-center justify-center h-12 w-12 rounded-full transition-colors shrink-0",
                "bg-accent-sky text-white active:bg-accent-sky/80"
              )}
            >
              <Plus size={20} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
