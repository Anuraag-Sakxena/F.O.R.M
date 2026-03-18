"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import {
  nightRoutine as nightRoutineData,
  nightRoutineTitle,
  nightRoutineSubtitle,
} from "@/lib/data/night-routine";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const stepItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { ease: "easeOut" as const, duration: 0.3 },
  },
};

const checkScale: Variants = {
  unchecked: { scale: 0, opacity: 0 },
  checked: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 25 },
  },
};

const routineMeta: Record<string, { label: string; emoji: string }> = {
  morning: { label: "Morning Routine", emoji: "☀️" },
  night: { label: "Night Routine", emoji: "🌙" },
};

export function SkincareView() {
  const { skincare, toggleSkincareStep, nightRoutine, toggleNightRoutine, setLastSection } =
    useTracker();

  useEffect(() => {
    setLastSection("skincare");
  }, [setLastSection]);

  return (
    <AnimatedPage>
      <PageHeader title="Skincare & Night" emoji="✨" backHref="/" />

      <div className="px-5 space-y-5 pb-8">
        {/* Skincare routines */}
        {skincare.map((routine) => {
          const meta = routineMeta[routine.time] ?? {
            label: routine.time,
            emoji: "🧴",
          };

          return (
            <SectionCard key={routine.time}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                <span className="mr-1.5">{meta.emoji}</span>
                {meta.label}
              </h3>

              <motion.div
                className="space-y-1"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {routine.steps.map((step) => (
                  <motion.button
                    key={step.id}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/50",
                      step.done && "opacity-60"
                    )}
                    variants={stepItem}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSkincareStep(routine.time, step.id)}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                      {step.step}
                    </span>
                    <span className={cn("text-base", step.done && "opacity-50")}>
                      {step.emoji}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-sm text-foreground transition-all",
                        step.done && "line-through text-muted-foreground"
                      )}
                    >
                      {step.product}
                    </span>
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        step.done
                          ? "border-primary bg-primary"
                          : "border-border bg-transparent"
                      )}
                    >
                      <motion.div
                        variants={checkScale}
                        initial={false}
                        animate={step.done ? "checked" : "unchecked"}
                      >
                        {step.done && (
                          <Check size={10} strokeWidth={3} className="text-white" />
                        )}
                      </motion.div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </SectionCard>
          );
        })}

        {/* Night routine — waist + core */}
        <SectionCard>
          <h3 className="text-sm font-semibold text-foreground mb-0.5">
            <span className="mr-1.5">🏋️‍♀️</span>
            {nightRoutineTitle}
          </h3>
          <p className="text-[11px] text-muted-foreground mb-3">
            {nightRoutineSubtitle}
          </p>

          <motion.div
            className="space-y-1"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {nightRoutineData.map((exercise) => {
              const tracked = nightRoutine.find((i) => i.id === exercise.id);
              const done = tracked?.done ?? false;
              return (
                <motion.button
                  key={exercise.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/50",
                    done && "opacity-60"
                  )}
                  variants={stepItem}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleNightRoutine(exercise.id)}
                >
                  <span className="text-lg">{exercise.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium text-foreground",
                        done && "line-through text-muted-foreground"
                      )}
                    >
                      {exercise.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {exercise.reps}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      done
                        ? "border-primary bg-primary"
                        : "border-border bg-transparent"
                    )}
                  >
                    <motion.div
                      variants={checkScale}
                      initial={false}
                      animate={done ? "checked" : "unchecked"}
                    >
                      {done && (
                        <Check size={10} strokeWidth={3} className="text-white" />
                      )}
                    </motion.div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </SectionCard>
      </div>
    </AnimatedPage>
  );
}
