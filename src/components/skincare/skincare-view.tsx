"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { FAB } from "@/components/ui/fab";
import { ActionSheet, type ActionSheetOption } from "@/components/ui/action-sheet";
import { FormModal, FormInput } from "@/components/ui/form-modal";
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
  const {
    skincare,
    toggleSkincareStep,
    nightRoutine,
    toggleNightRoutine,
    setLastSection,
    addSkincareStep,
    editSkincareStep,
    deleteSkincareStep,
  } = useTracker();

  useEffect(() => {
    setLastSection("skincare");
  }, [setLastSection]);

  // ── Add modal state ────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [addProduct, setAddProduct] = useState("");
  const [addEmoji, setAddEmoji] = useState("🧴");
  const [addTime, setAddTime] = useState<"morning" | "night">("morning");

  const handleAdd = () => {
    if (!addProduct.trim()) return;
    addSkincareStep(addTime, addProduct.trim(), addEmoji.trim() || "🧴");
    setAddProduct("");
    setAddEmoji("🧴");
    setAddOpen(false);
  };

  // ── Edit modal state ───────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editStepId, setEditStepId] = useState("");
  const [editTime, setEditTime] = useState<"morning" | "night">("morning");

  const handleEdit = () => {
    if (!editProduct.trim()) return;
    editSkincareStep(editTime, editStepId, editProduct.trim(), editEmoji.trim() || "🧴");
    setEditOpen(false);
  };

  // ── Action sheet state ─────────────────────────────────────
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetStepId, setSheetStepId] = useState("");
  const [sheetTime, setSheetTime] = useState<"morning" | "night">("morning");
  const [sheetProduct, setSheetProduct] = useState("");
  const [sheetEmoji, setSheetEmoji] = useState("");

  // ── Long press ─────────────────────────────────────────────
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const startLongPress = useCallback(
    (time: "morning" | "night", stepId: string, product: string, emoji: string) => {
      longPressTriggered.current = false;
      longPressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        setSheetTime(time);
        setSheetStepId(stepId);
        setSheetProduct(product);
        setSheetEmoji(emoji);
        setSheetOpen(true);
      }, 500);
    },
    []
  );

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  const sheetOptions: ActionSheetOption[] = [
    {
      label: "Edit",
      icon: <Pencil size={16} />,
      onPress: () => {
        setEditTime(sheetTime);
        setEditStepId(sheetStepId);
        setEditProduct(sheetProduct);
        setEditEmoji(sheetEmoji);
        setEditOpen(true);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      destructive: true,
      onPress: () => {
        deleteSkincareStep(sheetTime, sheetStepId);
      },
    },
  ];

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
                    onClick={() => {
                      if (longPressTriggered.current) return;
                      toggleSkincareStep(routine.time, step.id);
                    }}
                    onPointerDown={() =>
                      startLongPress(routine.time, step.id, step.product, step.emoji)
                    }
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
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

      {/* FAB */}
      <FAB onClick={() => setAddOpen(true)} />

      {/* Add skincare step modal */}
      <FormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Skincare Step"
        onSubmit={handleAdd}
        submitLabel="Add"
        submitDisabled={!addProduct.trim()}
      >
        <div className="space-y-4">
          <FormInput
            label="Product"
            value={addProduct}
            onChange={setAddProduct}
            placeholder="e.g. Vitamin C serum"
          />
          <FormInput
            label="Emoji"
            value={addEmoji}
            onChange={setAddEmoji}
            placeholder="🧴"
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Routine
            </label>
            <div className="flex gap-2">
              {(["morning", "night"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAddTime(t)}
                  className={cn(
                    "flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors",
                    addTime === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {t === "morning" ? "☀️ Morning" : "🌙 Night"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormModal>

      {/* Edit skincare step modal */}
      <FormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Skincare Step"
        onSubmit={handleEdit}
        submitLabel="Save"
        submitDisabled={!editProduct.trim()}
      >
        <div className="space-y-4">
          <FormInput
            label="Product"
            value={editProduct}
            onChange={setEditProduct}
            placeholder="e.g. Vitamin C serum"
          />
          <FormInput
            label="Emoji"
            value={editEmoji}
            onChange={setEditEmoji}
            placeholder="🧴"
          />
        </div>
      </FormModal>

      {/* Action sheet */}
      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={sheetProduct}
        options={sheetOptions}
      />
    </AnimatedPage>
  );
}
