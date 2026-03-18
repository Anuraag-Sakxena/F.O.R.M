"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const categoryItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.3 },
  },
};

export function GroceriesView() {
  const { groceries, toggleGroceryItem, setLastSection } = useTracker();

  useEffect(() => {
    setLastSection("groceries");
  }, [setLastSection]);

  const totalItems = groceries.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = groceries.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.checked).length,
    0
  );
  const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <AnimatedPage>
      <PageHeader title="Grocery List" emoji="🛒" backHref="/" />

      <div className="px-5 pb-8">
        {/* Progress */}
        <div className="mb-5">
          <span className="text-xs text-muted-foreground">
            {checkedItems} of {totalItems} items
          </span>
          <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Categories */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {groceries.map((category, catIndex) => (
            <motion.div key={category.id} variants={categoryItem}>
              {catIndex > 0 && (
                <div className="border-t border-border/40 my-1" />
              )}

              <h3 className="text-sm font-semibold text-foreground mt-3 mb-1.5">
                <span className="mr-1.5">{category.emoji}</span>
                {category.name}
              </h3>

              <div>
                {category.items.map((groceryItem) => (
                  <motion.button
                    key={groceryItem.id}
                    type="button"
                    className="flex w-full items-center gap-3 py-2.5 text-left"
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() =>
                      toggleGroceryItem(category.id, groceryItem.id)
                    }
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        groceryItem.checked
                          ? "border-primary bg-primary"
                          : "border-border bg-transparent"
                      )}
                    >
                      {groceryItem.checked && (
                        <Check size={12} strokeWidth={3} className="text-white" />
                      )}
                    </div>

                    <span
                      className={cn(
                        "text-sm text-foreground transition-all",
                        groceryItem.checked &&
                          "line-through text-muted-foreground"
                      )}
                    >
                      {groceryItem.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
