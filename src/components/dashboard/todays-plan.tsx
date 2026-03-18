"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";

export function TodaysPlan() {
  const { dayPlan, settings } = useTracker();
  const [expanded, setExpanded] = useState(false);

  if (!settings.showPlan) return null;

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.4 }}
    >
      <button
        type="button"
        className="w-full rounded-2xl bg-card border border-border/60 shadow-xs p-4 text-left"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              {dayPlan.title}
            </p>
            <p className="text-[13px] text-foreground mt-1 leading-relaxed">
              {dayPlan.guidance}
            </p>
          </div>
          <motion.div
            className="shrink-0 ml-3"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-muted-foreground" />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
                {dayPlan.steps.map((step, i) => {
                  const isDone = step.toLowerCase().includes("done");
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-2.5 text-xs",
                        isDone ? "text-muted-foreground/60" : "text-foreground/80"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full mt-0.5 text-[9px] font-bold",
                          isDone
                            ? "bg-success-soft text-success"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {isDone ? <Check size={8} strokeWidth={3} /> : i + 1}
                      </span>
                      <span className={isDone ? "line-through" : ""}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
