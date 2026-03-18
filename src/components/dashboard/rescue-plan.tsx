"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTracker } from "@/hooks/tracker-context";

export function RescuePlanCard() {
  const { rescuePlan, settings } = useTracker();

  if (!rescuePlan || !settings.showRescue) return null;

  const accentMap = {
    gentle: "from-accent-lavender-soft/40 to-accent-sky-soft/30",
    reset: "from-accent-amber-soft/40 to-accent-peach-soft/30",
    light: "from-accent-mint-soft/40 to-accent-sky-soft/30",
  };

  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.4 }}
    >
      <div
        className={`rounded-2xl bg-gradient-to-r ${accentMap[rescuePlan.level]} p-4`}
      >
        <div className="flex items-start gap-2.5 mb-2.5">
          <Heart size={14} className="text-accent-rose mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              {rescuePlan.title}
            </p>
            <p className="text-[13px] text-foreground mt-1 leading-relaxed">
              {rescuePlan.message}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 ml-6">
          {rescuePlan.actions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-foreground/70"
            >
              <span className="text-muted-foreground/50 mt-0.5 shrink-0">
                &bull;
              </span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
