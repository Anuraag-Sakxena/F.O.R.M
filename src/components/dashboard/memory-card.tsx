"use client";

import { motion } from "framer-motion";
import { useTracker } from "@/hooks/tracker-context";

export function MemoryCard() {
  const { memoryInsights, settings } = useTracker();

  if (!settings.adaptiveMemoryEnabled) return null;
  if (memoryInsights.length === 0) return null;

  // Show only the first (most relevant) insight on Home
  const insight = memoryInsights[0];

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.38, duration: 0.4 }}
    >
      <div className="flex items-start gap-2.5 rounded-xl bg-muted/30 border border-border/30 px-3.5 py-3">
        <span className="text-sm shrink-0 mt-0.5">{insight.emoji}</span>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 mb-0.5">
            What usually helps
          </p>
          <p className="text-[11px] text-foreground/65 font-medium leading-relaxed">
            {insight.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
