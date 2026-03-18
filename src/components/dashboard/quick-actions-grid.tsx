"use client";

import { motion } from "framer-motion";
import { useTracker } from "@/hooks/tracker-context";
import { QuickActionTile } from "@/components/ui/quick-action-tile";
import { getAdaptiveTiles } from "@/lib/personalization";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut" as const, duration: 0.3 } },
};

export function QuickActionsGrid() {
  const {
    checklistDone, checklistTotal, todayMealsDone, workoutDone,
    dayPhase, settings,
  } = useTracker();

  const tiles = getAdaptiveTiles(dayPhase, workoutDone, todayMealsDone, settings.adaptiveEnabled);

  const getExtra = (id: string) => {
    switch (id) {
      case "checklist":
        return { done: checklistDone, total: checklistTotal, status: checklistDone === checklistTotal && checklistTotal > 0 ? "Done" : undefined };
      case "meals":
        return { done: todayMealsDone, total: 3, status: todayMealsDone >= 3 ? "Done" : undefined };
      case "workout":
        return { status: workoutDone ? "Done" : undefined };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 px-5"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {tiles.map((tile) => {
        const extra = getExtra(tile.id);
        return (
          <motion.div key={tile.id} variants={item}>
            <QuickActionTile
              label={tile.label}
              emoji={tile.emoji}
              href={tile.href}
              bgClass={tile.bgClass}
              done={extra.done}
              total={extra.total}
              status={extra.status}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
