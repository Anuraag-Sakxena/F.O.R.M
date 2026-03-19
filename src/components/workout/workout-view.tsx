"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Check, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import {
  getTrainingWeek,
  getCardioForDay,
  TOTAL_PROGRAM_WEEKS,
  type TrainingDay,
  type TrainingBlock,
  type TrainingExercise,
} from "@/lib/data/training";

const WEEK_DISPLAY_COUNT = 10; // show weeks 1-9+

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" as const, duration: 0.3 },
  },
};

const focusEmoji: Record<string, string> = {
  lower: "🦵",
  upper: "💪",
  rest: "🧘‍♀️",
};

const blockTypeLabel: Record<string, { label: string; color: string }> = {
  warmup: { label: "Warm Up", color: "bg-accent-amber-soft/60 text-accent-amber" },
  superset: { label: "Superset", color: "bg-accent-sky-soft/60 text-accent-sky" },
  tripleset: { label: "Tripleset", color: "bg-accent-lavender-soft/60 text-accent-lavender" },
  circuit: { label: "Circuit", color: "bg-accent-pink-soft/60 text-accent-pink" },
  main: { label: "Main", color: "bg-accent-mint-soft/60 text-accent-mint" },
  cardio: { label: "Cardio", color: "bg-accent-peach-soft/60 text-accent-peach" },
  "rest-note": { label: "Rest", color: "bg-muted text-muted-foreground" },
};

export function WorkoutView() {
  const {
    workoutDone,
    toggleWorkoutDone,
    todayDayName,
    setLastSection,
    workoutFraming,
    nightRoutineFraming,
    settings,
    updateSettings,
  } = useTracker();

  useEffect(() => {
    setLastSection("workout");
  }, [setLastSection]);

  const currentTrainingWeek = settings.currentTrainingWeek;
  const [selectedWeek, setSelectedWeek] = useState(currentTrainingWeek);

  // Today's day of week: 1-7 (Mon=1)
  const todayDow = useMemo(() => {
    const d = new Date().getDay();
    return d === 0 ? 7 : d; // Convert Sunday=0 to 7
  }, []);

  const weekData = useMemo(() => getTrainingWeek(selectedWeek), [selectedWeek]);

  const [expandedDay, setExpandedDay] = useState<number>(todayDow);

  // Reset expanded day when week changes
  useEffect(() => {
    setExpandedDay(selectedWeek === currentTrainingWeek ? todayDow : 1);
  }, [selectedWeek, currentTrainingWeek, todayDow]);

  const weekNumbers = useMemo(() => {
    const nums: number[] = [];
    for (let i = 1; i <= WEEK_DISPLAY_COUNT; i++) nums.push(i);
    return nums;
  }, []);

  return (
    <AnimatedPage>
      <PageHeader title="Workout" emoji="💪" backHref="/" />

      <div className="px-5 pb-8">
        {/* Mark complete + framing */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-medium">
              Week {selectedWeek}
              {selectedWeek > TOTAL_PROGRAM_WEEKS ? " (Cycling Phase 2)" : selectedWeek >= 5 ? " (Phase 2)" : " (Phase 1)"}
            </p>
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

        {/* General note */}
        {weekData.generalNote && (
          <motion.div
            className="mb-4 rounded-xl bg-accent-amber-soft/40 px-3.5 py-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-[11px] text-foreground/70 font-medium leading-relaxed">
              🌅 {weekData.generalNote}
            </p>
          </motion.div>
        )}

        {/* Week selector */}
        <div className="mb-4">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
            {weekNumbers.map((w) => {
              const isCurrent = w === currentTrainingWeek;
              const isSelected = w === selectedWeek;
              const label = w >= 9 ? "9+" : `${w}`;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWeek(w)}
                  className={cn(
                    "flex flex-col items-center min-w-[38px] rounded-xl py-2 px-1.5 text-center transition-colors relative",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground"
                  )}
                >
                  <span className="text-[10px] font-medium">Wk</span>
                  <span className="text-xs font-bold">{label}</span>
                  {isCurrent && !isSelected && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Set as current week */}
          {selectedWeek !== currentTrainingWeek && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-[11px] font-medium text-primary underline underline-offset-2"
              onClick={() => updateSettings({ currentTrainingWeek: selectedWeek })}
            >
              Set Week {selectedWeek} as current
            </motion.button>
          )}
        </div>

        {/* Day cards */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={selectedWeek}
        >
          {weekData.days.map((day) => {
            const isToday =
              selectedWeek === currentTrainingWeek && day.dayNumber === todayDow;
            const isExpanded = expandedDay === day.dayNumber;
            const emoji = focusEmoji[day.focus] ?? "🏋️";
            const cardio = getCardioForDay(selectedWeek, day.focus);

            return (
              <motion.div key={day.dayNumber} variants={itemVariants}>
                <div
                  className={cn(
                    "rounded-2xl overflow-hidden border transition-all",
                    day.isRest
                      ? "bg-muted/30 border-border/40"
                      : "bg-card border-border/60",
                    isToday && "ring-2 ring-primary/40"
                  )}
                >
                  {/* Day header */}
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex w-full items-center gap-3 p-4 text-left cursor-pointer"
                    onClick={() =>
                      setExpandedDay((p) =>
                        p === day.dayNumber ? -1 : day.dayNumber
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedDay((p) =>
                          p === day.dayNumber ? -1 : day.dayNumber
                        );
                      }
                    }}
                  >
                    <span className="text-xl">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                          Day {day.dayNumber}
                        </span>
                        {isToday && (
                          <span className="text-[10px] font-bold text-primary bg-primary-soft rounded-full px-1.5 py-0.5">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {day.title}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* Expandable content */}
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
                          {day.isRest ? (
                            <div className="text-center py-4 space-y-2">
                              <span className="text-3xl">🧘‍♀️</span>
                              <p className="text-sm font-semibold text-foreground">
                                Recovery Day
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Get plenty of water, sleep, and rest. Your muscles
                                grow during recovery.
                              </p>
                            </div>
                          ) : (
                            <>
                              {day.blocks.map((block, bi) => (
                                <BlockSection
                                  key={bi}
                                  block={block}
                                />
                              ))}

                              {/* Cardio */}
                              <div className="rounded-xl bg-accent-peach-soft/30 border border-accent-peach-soft/50 p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs">🏃‍♀️</span>
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-[9px] font-bold",
                                      blockTypeLabel.cardio.color
                                    )}
                                  >
                                    Cardio
                                  </span>
                                </div>
                                <p className="text-xs font-medium text-foreground">
                                  {cardio}
                                </p>
                              </div>
                            </>
                          )}
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

function BlockSection({ block }: { block: TrainingBlock }) {
  const typeInfo = blockTypeLabel[block.type] ?? blockTypeLabel.main;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        {block.title && (
          <p className="text-xs font-semibold text-foreground">{block.title}</p>
        )}
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[9px] font-bold",
            typeInfo.color
          )}
        >
          {typeInfo.label}
        </span>
      </div>

      {block.circuitNote && (
        <p className="text-[10px] text-muted-foreground italic leading-snug">
          {block.circuitNote}
        </p>
      )}

      <div className="space-y-1">
        {block.exercises.map((ex, ei) => (
          <ExerciseRow key={ei} exercise={ex} />
        ))}
      </div>
    </div>
  );
}

function ExerciseRow({ exercise }: { exercise: TrainingExercise }) {
  const isRest = exercise.name === "REST";

  if (isRest) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-1.5">
        <span className="text-[10px]">⏸️</span>
        <span className="text-[11px] text-muted-foreground font-medium">
          Rest {exercise.notes}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/20 px-2.5 py-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-foreground">{exercise.name}</p>
          {exercise.link && (
            <a
              href={exercise.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-primary shrink-0"
            >
              <ExternalLink size={10} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {exercise.sets && exercise.reps && (
            <span className="text-[10px] text-muted-foreground font-medium">
              {exercise.sets} x {exercise.reps}
            </span>
          )}
          {!exercise.sets && exercise.reps && (
            <span className="text-[10px] text-muted-foreground font-medium">
              {exercise.reps}
            </span>
          )}
          {exercise.weight && (
            <span className="text-[10px] text-primary font-medium">
              {exercise.weight}
            </span>
          )}
        </div>
        {exercise.notes && (
          <p className="text-[10px] text-muted-foreground/80 mt-0.5 leading-snug">
            {exercise.notes}
          </p>
        )}
      </div>
    </div>
  );
}
