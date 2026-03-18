"use client";

import { motion } from "framer-motion";
import { ArrowDown, Check, X } from "lucide-react";
import { useTracker } from "@/hooks/tracker-context";

export function FallbackPathCard() {
  const { fallbackPath, settings } = useTracker();

  if (!fallbackPath || settings.plannerStyle === "minimal") return null;

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.4 }}
    >
      <div className="rounded-2xl bg-muted/40 border border-border/40 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <ArrowDown size={13} className="text-muted-foreground" />
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Simpler version
          </p>
        </div>
        <p className="text-[12px] text-foreground/70 mb-3 leading-relaxed">
          {fallbackPath.message}
        </p>

        <div className="space-y-1.5">
          {fallbackPath.keep.map((item, i) => (
            <div key={`k-${i}`} className="flex items-start gap-2 text-[11px] text-foreground/70">
              <Check size={11} className="text-success mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
          {fallbackPath.drop.map((item, i) => (
            <div key={`d-${i}`} className="flex items-start gap-2 text-[11px] text-muted-foreground/60">
              <X size={11} className="mt-0.5 shrink-0" />
              <span className="line-through">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
