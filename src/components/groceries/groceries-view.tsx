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
  const {
    groceries,
    toggleGroceryItem,
    setLastSection,
    addGroceryItem,
    editGroceryItem,
    deleteGroceryItem,
  } = useTracker();

  useEffect(() => {
    setLastSection("groceries");
  }, [setLastSection]);

  // ---------- Long-press ----------
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    categoryId: string;
    itemId: string;
    name: string;
  } | null>(null);

  const clearTimer = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(
    (item: { categoryId: string; itemId: string; name: string }) => {
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
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");

  const openAdd = () => {
    setFormName("");
    setFormCategoryId(groceries.length > 0 ? groceries[0].id : "");
    setAddOpen(true);
  };

  const handleAdd = () => {
    const name = formName.trim();
    if (!name || !formCategoryId) return;
    addGroceryItem(formCategoryId, name);
    setAddOpen(false);
  };

  const openEdit = () => {
    if (!selectedItem) return;
    setFormName(selectedItem.name);
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!selectedItem) return;
    const name = formName.trim();
    if (!name) return;
    editGroceryItem(selectedItem.categoryId, selectedItem.itemId, name);
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
        if (selectedItem)
          deleteGroceryItem(selectedItem.categoryId, selectedItem.itemId);
        setSelectedItem(null);
      },
    },
  ];

  // ---------- Derived ----------
  const totalItems = groceries.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = groceries.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.checked).length,
    0
  );
  const progressPercent =
    totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

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
        <motion.div variants={container} initial="hidden" animate="show">
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
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    onPointerDown={() =>
                      handlePointerDown({
                        categoryId: category.id,
                        itemId: groceryItem.id,
                        name: groceryItem.name,
                      })
                    }
                    onPointerUp={() => {
                      handlePointerUp();
                      if (!didLongPress.current) {
                        toggleGroceryItem(category.id, groceryItem.id);
                      }
                    }}
                    onPointerLeave={handlePointerUp}
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
                        <Check
                          size={12}
                          strokeWidth={3}
                          className="text-white"
                        />
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

      {/* FAB */}
      <FAB onClick={openAdd} />

      {/* Action Sheet */}
      <ActionSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem?.name}
        options={sheetOptions}
      />

      {/* Add Modal */}
      <FormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Grocery Item"
        onSubmit={handleAdd}
        submitLabel="Add"
        submitDisabled={!formName.trim() || !formCategoryId}
      >
        <div className="space-y-3">
          <FormInput
            label="Item Name"
            value={formName}
            onChange={setFormName}
            placeholder="e.g. Oat milk"
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {groceries.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormCategoryId(cat.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                    formCategoryId === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-muted/40 text-muted-foreground active:bg-muted"
                  )}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title="Edit Grocery Item"
        onSubmit={handleEdit}
        submitLabel="Save"
        submitDisabled={!formName.trim()}
      >
        <div className="space-y-3">
          <FormInput
            label="Item Name"
            value={formName}
            onChange={setFormName}
            placeholder="e.g. Oat milk"
          />
        </div>
      </FormModal>
    </AnimatedPage>
  );
}
