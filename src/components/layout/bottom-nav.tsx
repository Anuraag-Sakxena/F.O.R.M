"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CheckSquare,
  UtensilsCrossed,
  Dumbbell,
  MoreHorizontal,
  ShoppingCart,
  Sparkles,
  BookOpen,
  CalendarDays,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

const mainTabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/checklist", label: "Goals", icon: CheckSquare },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/workout", label: "Workout", icon: Dumbbell },
] as const;

const moreItems = [
  { href: "/groceries", label: "Groceries", icon: ShoppingCart },
  { href: "/skincare", label: "Skincare", icon: Sparkles },
  { href: "/recipes", label: "Recipes", icon: BookOpen },
  { href: "/history", label: "History", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = moreItems.some((t) => t.href === pathname);

  const closeMore = useCallback(() => setMoreOpen(false), []);

  useEffect(() => {
    closeMore();
  }, [pathname, closeMore]);

  return (
    <>
      {/* Bottom sheet overlay for More */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              onClick={closeMore}
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-lg"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-border" />
              </div>

              <nav className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-1">
                {moreItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMore}
                      className={cn(
                        "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-soft text-primary"
                          : "text-foreground/70 active:bg-muted"
                      )}
                    >
                      <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-lg items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {mainTabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors min-w-[56px]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-[1px] left-3 right-3 h-[2px] rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <tab.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span>{tab.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen((p) => !p)}
            className={cn(
              "relative flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors min-w-[56px]",
              isMoreActive || moreOpen
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {(isMoreActive || moreOpen) && (
              <motion.div
                layoutId="nav-pill"
                className="absolute -top-[1px] left-3 right-3 h-[2px] rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <MoreHorizontal
              size={20}
              strokeWidth={isMoreActive || moreOpen ? 2.5 : 1.8}
            />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
