"use client";

import { motion } from "framer-motion";
import { useTracker } from "@/hooks/tracker-context";
import { getMVDMessage } from "@/lib/intelligence";

export function MVDBadge() {
  const { mvd, flowScore, settings, supportConfig } = useTracker();

  if (!settings.showMVDMessages) return null;
  if (!supportConfig.showMVDBadge) return null;
  if (!mvd.met) return null;
  if (flowScore >= 65) return null;

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <div className="flex items-center gap-2 rounded-xl bg-accent-sky-soft/40 px-3.5 py-2.5">
        <span className="text-sm">🫶</span>
        <p className="text-[11px] text-foreground/70 font-medium">{getMVDMessage(true)}</p>
      </div>
    </motion.div>
  );
}
