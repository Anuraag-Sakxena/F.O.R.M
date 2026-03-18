"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Check, ChevronDown, Flame, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { weeklyMealPlan, type DayMealPlan, type MealPlan } from "@/lib/data/meals-v5";
import { lazyMeals, lazyDayRule, lazyNote } from "@/lib/data/meals-v6";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.3 },
  },
};

const mealColors: Record<string, string> = {
  breakfast: "bg-accent-peach-soft/50",
  lunch: "bg-accent-mint-soft/50",
  dinner: "bg-accent-sky-soft/50",
};

const mealEmojis: Record<string, string> = {
  breakfast: "☀️",
  lunch: "🌤️",
  dinner: "🌙",
};

export function MealsView() {
  const { mealsDone, toggleMealDone, lazyMode, toggleLazyMode, todayDayName, setLastSection, mealStrategy } =
    useTracker();

  useEffect(() => {
    setLastSection("meals");
  }, [setLastSection]);

  const todayIndex = DAY_FULL.indexOf(todayDayName);
  const [selectedIndex, setSelectedIndex] = useState(todayIndex >= 0 ? todayIndex : 0);
  const selectedDayName = DAY_FULL[selectedIndex];

  const dayPlan: DayMealPlan | undefined = weeklyMealPlan[selectedIndex];

  const dayMealsDone = mealsDone[selectedDayName] ?? {
    breakfast: false,
    lunch: false,
    dinner: false,
  };

  return (
    <AnimatedPage>
      <PageHeader title="Meals" emoji="🍽️" backHref="/" />

      <div className="px-5 pb-8">
        {/* Day selector */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-none -mx-1 px-1">
          {DAYS.map((d, i) => {
            const isToday = i === todayIndex;
            const isSelected = i === selectedIndex;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "flex flex-col items-center min-w-[42px] rounded-xl py-2 px-1.5 text-center transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground"
                )}
              >
                <span className="text-[10px] font-medium">{d}</span>
                {isToday && !isSelected && (
                  <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Cook / Lazy toggle */}
        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => lazyMode && toggleLazyMode()}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              !lazyMode
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <UtensilsCrossed size={12} />
            Cook
          </button>
          <button
            type="button"
            onClick={() => !lazyMode && toggleLazyMode()}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              lazyMode
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Flame size={12} />
            Lazy Day
          </button>
        </div>

        {/* Meal strategy suggestion */}
        {mealStrategy && (
          <motion.div
            className="mb-4 rounded-xl bg-primary-soft/40 px-3.5 py-2.5 flex items-start gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs mt-0.5">💡</span>
            <p className="text-[11px] text-foreground/70 font-medium leading-relaxed">
              {mealStrategy.text}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {lazyMode ? (
            <motion.div
              key="lazy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Lazy day rule */}
              <div className="rounded-2xl bg-accent-amber-soft/50 p-3.5">
                <p className="text-xs font-semibold text-foreground mb-0.5">
                  Lazy Day Rule
                </p>
                <p className="text-xs text-muted-foreground">{lazyDayRule}</p>
              </div>

              {/* Lazy meal categories */}
              {lazyMeals.map((cat) => (
                <div key={cat.meal} className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>{cat.emoji}</span>
                    {cat.meal}
                  </h3>
                  <div className="space-y-1.5">
                    {cat.options.map((opt, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-card border border-border/60 p-3"
                      >
                        <p className="text-xs font-semibold text-foreground">
                          {opt.place}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {opt.order}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Note */}
              <p className="text-[11px] text-muted-foreground italic text-center pt-2">
                {lazyNote}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`cook-${selectedIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {dayPlan &&
                (["breakfast", "lunch", "dinner"] as const).map((mealType) => {
                  const meal = dayPlan[mealType];
                  const done = dayMealsDone[mealType];
                  return (
                    <MealCard
                      key={mealType}
                      meal={meal}
                      mealType={mealType}
                      done={done}
                      onToggle={() => toggleMealDone(selectedDayName, mealType)}
                    />
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}

function MealCard({
  meal,
  mealType,
  done,
  onToggle,
}: {
  meal: MealPlan;
  mealType: string;
  done: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const bg = mealColors[mealType] ?? "bg-muted/30";
  const phaseEmoji = mealEmojis[mealType] ?? "🍽️";

  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="show"
      className={cn("rounded-2xl overflow-hidden", bg, done && "opacity-60")}
    >
      {/* Header — always visible */}
      <button
        type="button"
        className="flex w-full items-center gap-3 p-4 text-left"
        onClick={() => setExpanded((p) => !p)}
      >
        <span className="text-xl">{meal.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
              {phaseEmoji} {mealType}
            </span>
            {meal.protein && (
              <span className="text-[10px] font-medium text-primary bg-primary-soft rounded-full px-1.5 py-0.5">
                {meal.protein} protein
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            {meal.name}
          </p>
          {meal.calories && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ~{meal.calories} cal
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
              done
                ? "border-success bg-success-soft"
                : "border-border bg-transparent"
            )}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {done && <Check size={14} strokeWidth={3} className="text-success" />}
          </motion.button>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Ingredients */}
              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  Ingredients
                </h4>
                <ul className="space-y-1">
                  {meal.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-foreground/80"
                    >
                      <span className="text-muted-foreground/60 mt-0.5 shrink-0">
                        &bull;
                      </span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recipe */}
              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  Recipe
                </h4>
                <ol className="space-y-1.5">
                  {meal.recipe.map((step, i) => (
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
    </motion.div>
  );
}
