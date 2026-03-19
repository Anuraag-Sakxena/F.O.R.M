"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { FAB } from "@/components/ui/fab";
import { ActionSheet, type ActionSheetOption } from "@/components/ui/action-sheet";
import { FormModal, FormInput } from "@/components/ui/form-modal";

const listContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
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

export function ChecklistView() {
  const {
    checklist,
    toggleChecklist,
    setLastSection,
    addChecklistItem,
    editChecklistItem,
    deleteChecklistItem,
  } = useTracker();

  useEffect(() => {
    setLastSection("checklist");
  }, [setLastSection]);

  // ---------- Long-press ----------
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    label: string;
    emoji: string;
  } | null>(null);

  const clearTimer = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(
    (item: { id: string; label: string; emoji: string }) => {
      didLongPress.current = false;
      pressTimer.current = setTimeout(() => {
        didLongPress.current = true;
        setSelectedItem(item);
        setSheetOpen(true);
      }, 500);
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  // ---------- Form modals ----------
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formLabel, setFormLabel] = useState("");
  const [formEmoji, setFormEmoji] = useState("");

  const openAdd = () => {
    setFormLabel("");
    setFormEmoji("");
    setAddOpen(true);
  };

  const handleAdd = () => {
    const label = formLabel.trim();
    const emoji = formEmoji.trim() || "🎯";
    if (!label) return;
    addChecklistItem(label, emoji);
    setAddOpen(false);
  };

  const openEdit = () => {
    if (!selectedItem) return;
    setFormLabel(selectedItem.label);
    setFormEmoji(selectedItem.emoji);
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!selectedItem) return;
    const label = formLabel.trim();
    const emoji = formEmoji.trim() || "🎯";
    if (!label) return;
    editChecklistItem(selectedItem.id, label, emoji);
    setEditOpen(false);
    setSelectedItem(null);
  };

  // ---------- Action sheet options ----------
  const sheetOptions: ActionSheetOption[] = [
    {
      label: "Edit",
      icon: <Pencil size={16} />,
      onPress: openEdit,
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      destructive: true,
      onPress: () => {
        if (selectedItem) deleteChecklistItem(selectedItem.id);
        setSelectedItem(null);
      },
    },
  ];

  // ---------- Derived ----------
  const doneCount = checklist.filter((item) => item.completed).length;
  const total = checklist.length;
  const allDone = total > 0 && doneCount === total;
  const progressPercent = total > 0 ? (doneCount / total) * 100 : 0;

  return (
    <AnimatedPage>
      <PageHeader title="Daily Goals" emoji="✅" backHref="/" />

      <div className="px-5 pb-8">
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">
              {doneCount} of {total} complete
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Checklist items */}
        <motion.div
          className="space-y-2.5"
          variants={listContainer}
          initial="hidden"
          animate="show"
        >
          {checklist.map((item) => (
            <motion.div key={item.id} variants={listItem}>
              <motion.button
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl bg-card border border-border/60 shadow-xs p-4 text-left transition-colors"
                )}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onPointerDown={() =>
                  handlePointerDown({
                    id: item.id,
                    label: item.label,
                    emoji: item.emoji,
                  })
                }
                onPointerUp={() => {
                  handlePointerUp();
                  if (!didLongPress.current) {
                    toggleChecklist(item.id);
                  }
                }}
                onPointerLeave={handlePointerUp}
              >
                <span
                  className={cn(
                    "text-xl transition-opacity",
                    item.completed && "opacity-50"
                  )}
                >
                  {item.emoji}
                </span>

                <span
                  className={cn(
                    "flex-1 text-sm font-medium text-foreground transition-all",
                    item.completed &&
                      "line-through text-muted-foreground opacity-60"
                  )}
                >
                  {item.label}
                </span>

                <div
                  className={cn(
                    "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    item.completed
                      ? "border-primary bg-primary"
                      : "border-border bg-transparent"
                  )}
                >
                  <motion.div
                    variants={checkScale}
                    initial={false}
                    animate={item.completed ? "checked" : "unchecked"}
                  >
                    {item.completed && (
                      <Check
                        size={12}
                        strokeWidth={3}
                        className="text-white"
                      />
                    )}
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Celebration card */}
        {allDone && (
          <motion.div
            className="mt-5 rounded-2xl bg-gradient-to-r from-primary-soft to-accent-pink-soft p-5 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-2xl mb-1">&#10024;</p>
            <p className="text-sm font-semibold text-foreground">
              All done for today!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You crushed every single goal. Time to relax.
            </p>
          </motion.div>
        )}
      </div>

      {/* FAB */}
      <FAB onClick={openAdd} />

      {/* Action Sheet */}
      <ActionSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem?.label}
        options={sheetOptions}
      />

      {/* Add Modal */}
      <FormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New Goal"
        onSubmit={handleAdd}
        submitLabel="Add"
        submitDisabled={!formLabel.trim()}
      >
        <div className="space-y-3">
          <FormInput
            label="Label"
            value={formLabel}
            onChange={setFormLabel}
            placeholder="e.g. Drink 2L water"
          />
          <FormInput
            label="Emoji"
            value={formEmoji}
            onChange={setFormEmoji}
            placeholder="🎯"
          />
        </div>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title="Edit Goal"
        onSubmit={handleEdit}
        submitLabel="Save"
        submitDisabled={!formLabel.trim()}
      >
        <div className="space-y-3">
          <FormInput
            label="Label"
            value={formLabel}
            onChange={setFormLabel}
            placeholder="e.g. Drink 2L water"
          />
          <FormInput
            label="Emoji"
            value={formEmoji}
            onChange={setFormEmoji}
            placeholder="🎯"
          />
        </div>
      </FormModal>
    </AnimatedPage>
  );
}
