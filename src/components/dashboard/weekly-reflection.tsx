"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTracker } from "@/hooks/tracker-context";

export function WeeklyReflection() {
  const { weeklyReflection } = useTracker();
  const [dismissed, setDismissed] = useState(false);

  if (!weeklyReflection || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="px-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="relative rounded-2xl bg-gradient-to-r from-accent-lavender-soft to-accent-sky-soft p-4">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 p-1 text-muted-foreground/60"
          >
            <X size={14} />
          </button>
          <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">
            Weekly Check-in
          </p>
          <p className="text-sm text-foreground font-medium leading-relaxed pr-6">
            {weeklyReflection.message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
