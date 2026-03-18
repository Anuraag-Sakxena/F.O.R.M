"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTracker } from "@/hooks/tracker-context";
import type { SectionId } from "@/types";

const sectionMeta: Record<SectionId, { label: string; emoji: string; href: string }> = {
  checklist: { label: "Daily Goals", emoji: "✅", href: "/checklist" },
  meals: { label: "Today's Meals", emoji: "🍽️", href: "/meals" },
  workout: { label: "Workout", emoji: "💪", href: "/workout" },
  groceries: { label: "Grocery List", emoji: "🛒", href: "/groceries" },
  skincare: { label: "Skincare", emoji: "✨", href: "/skincare" },
  recipes: { label: "Recipes", emoji: "📖", href: "/recipes" },
};

export function ContinueCard() {
  const { lastSection } = useTracker();

  if (!lastSection) return null;

  const meta = sectionMeta[lastSection];
  if (!meta) return null;

  return (
    <div className="px-5">
      <Link href={meta.href} className="block">
        <motion.div
          className="rounded-xl bg-muted/50 p-3 flex items-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Continue
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base">{meta.emoji}</span>
              <span className="text-sm font-medium text-foreground">
                {meta.label}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
        </motion.div>
      </Link>
    </div>
  );
}
