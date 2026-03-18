"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTracker } from "@/hooks/tracker-context";
import type { SectionId } from "@/types";

const sectionMeta: Record<SectionId, { label: string; emoji: string; href: string }> = {
  checklist: { label: "Goals", emoji: "✅", href: "/checklist" },
  meals: { label: "Meals", emoji: "🍽️", href: "/meals" },
  workout: { label: "Workout", emoji: "💪", href: "/workout" },
  groceries: { label: "Groceries", emoji: "🛒", href: "/groceries" },
  skincare: { label: "Skincare", emoji: "✨", href: "/skincare" },
  recipes: { label: "Recipes", emoji: "📖", href: "/recipes" },
};

export function FavoriteActions() {
  const { topFavorites } = useTracker();

  if (!topFavorites || topFavorites.length < 2) return null;

  return (
    <div className="px-5">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" as const }}
      >
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">
          Your rhythm
        </p>
        <div className="flex gap-2">
          {topFavorites.map((id) => {
            const meta = sectionMeta[id];
            if (!meta) return null;

            return (
              <Link
                key={id}
                href={meta.href}
                className="rounded-xl bg-muted/50 px-3 py-2 flex items-center gap-1.5"
              >
                <span className="text-sm">{meta.emoji}</span>
                <span className="text-xs font-medium text-foreground">
                  {meta.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
