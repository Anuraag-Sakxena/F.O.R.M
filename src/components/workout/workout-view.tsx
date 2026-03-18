"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { weeklyStructure, weekSummary, type DayType } from "@/lib/data/weekly-structure";
import { dailyTargets } from "@/lib/data/targets";

const sectionContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const sectionItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.35 },
  },
};

const dayTypeStyle: Record<DayType, { bg: string; text: string }> = {
  gym: { bg: "bg-accent-sky-soft", text: "text-accent-sky" },
  dance: { bg: "bg-accent-pink-soft", text: "text-accent-pink" },
  "gym+dance": { bg: "bg-accent-lavender-soft", text: "text-accent-lavender" },
  rest: { bg: "bg-muted", text: "text-muted-foreground" },
};

export function WorkoutView() {
  const { workoutDone, toggleWorkoutDone, todayDayName, setLastSection, workoutFraming, nightRoutineFraming } = useTracker();

  useEffect(() => {
    setLastSection("workout");
  }, [setLastSection]);

  const todaySchedule = weeklyStructure.find((d) => d.day === todayDayName);

  return (
    <AnimatedPage>
      <PageHeader title="Workout" emoji="💪" backHref="/" />

      <div className="px-5 pb-8">
        {/* Mark complete + today info */}
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex-1">
            {todaySchedule && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold",
                    dayTypeStyle[todaySchedule.type].bg,
                    dayTypeStyle[todaySchedule.type].text
                  )}
                >
                  Today: {todaySchedule.label}
                </span>
              </div>
            )}
          </div>

          <motion.button
            type="button"
            className={cn(
              "rounded-full px-4 py-2 text-xs font-medium transition-colors flex items-center gap-1.5",
              workoutDone
                ? "bg-success-soft text-success"
                : "bg-primary text-primary-foreground"
            )}
            whileTap={{ scale: 0.93 }}
            onClick={() => toggleWorkoutDone()}
          >
            {workoutDone && <Check size={14} strokeWidth={3} />}
            {workoutDone ? "Completed" : "Mark Complete"}
          </motion.button>
        </motion.div>

        {/* Adaptive framing */}
        {(workoutFraming || nightRoutineFraming) && (
          <motion.div
            className="mb-4 rounded-xl bg-primary-soft/30 px-3.5 py-2.5 flex items-start gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className="text-xs mt-0.5">💡</span>
            <p className="text-[11px] text-foreground/70 font-medium leading-relaxed">
              {workoutFraming ?? nightRoutineFraming}
            </p>
          </motion.div>
        )}

        {/* Weekly schedule strip */}
        <motion.div variants={sectionContainer} initial="hidden" animate="show">
          <motion.div variants={sectionItem}>
            <SectionCard className="mb-4">
              <h3 className="text-xs font-semibold text-foreground mb-3">
                Weekly Schedule
              </h3>
              <div className="flex gap-1.5">
                {weeklyStructure.map((wd) => {
                  const isToday = wd.day === todayDayName;
                  const style = dayTypeStyle[wd.type];
                  return (
                    <div
                      key={wd.short}
                      className={cn(
                        "flex-1 flex flex-col items-center rounded-lg py-2 text-center transition-all",
                        style.bg,
                        isToday && "ring-2 ring-primary/30"
                      )}
                    >
                      <span className="text-[9px] font-medium text-muted-foreground">
                        {wd.short}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-bold mt-0.5",
                          style.text
                        )}
                      >
                        {wd.type === "gym+dance" ? "G+D" : wd.type === "gym" ? "Gym" : wd.type === "dance" ? "Dance" : "Rest"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
                <span>Gym: {weekSummary.gym}</span>
                <span>Dance: {weekSummary.dance}</span>
                <span>Rest: {weekSummary.rest}</span>
              </div>
            </SectionCard>
          </motion.div>

          {/* Daily targets reminder */}
          <motion.div variants={sectionItem}>
            <SectionCard className="mb-4">
              <h3 className="text-xs font-semibold text-foreground mb-2">
                Daily Targets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-accent-peach-soft/50 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Protein</p>
                  <p className="text-xs font-bold text-foreground">
                    {dailyTargets.protein.min}–{dailyTargets.protein.max}g
                  </p>
                </div>
                <div className="rounded-lg bg-accent-mint-soft/50 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Calories</p>
                  <p className="text-xs font-bold text-foreground">
                    ~{dailyTargets.calories.min}–{dailyTargets.calories.max}
                  </p>
                </div>
                <div className="rounded-lg bg-accent-sky-soft/50 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Steps</p>
                  <p className="text-xs font-bold text-foreground">
                    {(dailyTargets.steps.min / 1000).toFixed(0)}–{(dailyTargets.steps.max / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="rounded-lg bg-accent-lavender-soft/50 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Meals</p>
                  <p className="text-xs font-bold text-foreground">
                    {dailyTargets.meals}/day
                  </p>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Goal reminder */}
          <motion.div variants={sectionItem}>
            <div className="rounded-2xl bg-gradient-to-r from-primary-soft to-accent-pink-soft p-4 text-center">
              <p className="text-xs font-semibold text-foreground">Your Goal</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Lose fat (belly &amp; arms), build glutes, and achieve a slim-thick body.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
