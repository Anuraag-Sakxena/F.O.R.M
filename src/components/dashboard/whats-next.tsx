"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";

export function WhatsNext() {
  const { nextAction, completionPercent } = useTracker();

  if (!nextAction && completionPercent === 100) {
    return (
      <motion.div
        className="px-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-card border border-border/60 shadow-sm p-4">
          <span className="text-base">✨</span>
          <p className="text-sm font-medium text-muted-foreground">
            All done for today
          </p>
        </div>
      </motion.div>
    );
  }

  if (!nextAction) return null;

  return (
    <div className="px-5">
      <Link href={nextAction.href} className="block">
        <motion.div
          className={cn(
            "rounded-2xl bg-card border border-border/60 shadow-sm p-4",
            "flex items-center gap-3"
          )}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Up next
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base">{nextAction.emoji}</span>
              <span className="text-sm font-medium text-foreground truncate">
                {nextAction.label}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
        </motion.div>
      </Link>
    </div>
  );
}
