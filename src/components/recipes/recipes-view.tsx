"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { Chip } from "@/components/ui/chip";
import { weeklyMealPlan, type MealPlan } from "@/lib/data/meals-v5";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.35 },
  },
};

const softColors = [
  "bg-accent-peach-soft/50",
  "bg-accent-mint-soft/50",
  "bg-accent-sky-soft/50",
  "bg-accent-pink-soft/50",
  "bg-accent-lavender-soft/50",
  "bg-accent-amber-soft/50",
];

interface RecipeEntry {
  id: string;
  name: string;
  emoji: string;
  mealType: string;
  day: string;
  protein?: string;
  calories?: string;
  ingredients: string[];
  recipe: string[];
}

export function RecipesView() {
  const { setLastSection } = useTracker();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLastSection("recipes");
  }, [setLastSection]);

  const allRecipes = useMemo((): RecipeEntry[] => {
    const seen = new Set<string>();
    const recipes: RecipeEntry[] = [];
    for (const day of weeklyMealPlan) {
      for (const mealType of ["breakfast", "lunch", "dinner"] as const) {
        const meal: MealPlan = day[mealType];
        if (seen.has(meal.name)) continue;
        seen.add(meal.name);
        recipes.push({
          id: `${day.short}-${mealType}`,
          name: meal.name,
          emoji: meal.emoji,
          mealType,
          day: day.day,
          protein: meal.protein,
          calories: meal.calories,
          ingredients: meal.ingredients,
          recipe: meal.recipe,
        });
      }
    }
    return recipes;
  }, []);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <AnimatedPage>
      <PageHeader title="Recipes" emoji="📖" backHref="/" />

      <div className="px-5 pb-8">
        <p className="text-xs text-muted-foreground mb-4">
          All unique recipes from your weekly meal plan
        </p>

        <motion.div
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {allRecipes.map((recipe, index) => {
            const isExpanded = expandedId === recipe.id;
            return (
              <motion.div key={recipe.id} variants={cardVariant}>
                <div
                  className={cn(
                    "rounded-2xl overflow-hidden border border-border/40",
                    softColors[index % softColors.length]
                  )}
                >
                  {/* Header */}
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 p-4 text-left"
                    onClick={() => toggle(recipe.id)}
                  >
                    <span className="text-2xl">{recipe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {recipe.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Chip label={recipe.mealType} />
                        {recipe.protein && (
                          <span className="text-[10px] text-muted-foreground">
                            {recipe.protein} protein
                          </span>
                        )}
                        {recipe.calories && (
                          <span className="text-[10px] text-muted-foreground">
                            ~{recipe.calories} cal
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                              Ingredients
                            </h4>
                            <ul className="space-y-1">
                              {recipe.ingredients.map((ing, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-foreground/80"
                                >
                                  <span className="text-muted-foreground/60 mt-0.5">
                                    &bull;
                                  </span>
                                  <span>{ing}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                              Steps
                            </h4>
                            <ol className="space-y-1.5">
                              {recipe.recipe.map((step, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-foreground/80"
                                >
                                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
