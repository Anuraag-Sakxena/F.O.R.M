"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, Search, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/ui/page-header";
import { Chip } from "@/components/ui/chip";
import { FAB } from "@/components/ui/fab";
import { ActionSheet, type ActionSheetOption } from "@/components/ui/action-sheet";
import { FormModal, FormInput } from "@/components/ui/form-modal";
import { weeklyMealPlan, type MealPlan } from "@/lib/data/meals-v5";
import type { Recipe } from "@/types";

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

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

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
  isCustom?: boolean;
  prepTime?: string;
}

export function RecipesView() {
  const {
    setLastSection,
    customRecipes,
    addCustomRecipe,
    editCustomRecipe,
    deleteCustomRecipe,
  } = useTracker();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLastSection("recipes");
  }, [setLastSection]);

  // ── Derive default recipes from meal plan ──────────────────
  const defaultRecipes = useMemo((): RecipeEntry[] => {
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
          isCustom: false,
        });
      }
    }
    return recipes;
  }, []);

  // ── Merge default + custom ─────────────────────────────────
  const allRecipes = useMemo((): RecipeEntry[] => {
    const custom: RecipeEntry[] = customRecipes.map((r) => ({
      id: r.id,
      name: r.title,
      emoji: r.emoji,
      mealType: r.mealType,
      day: "",
      ingredients: r.ingredients,
      recipe: r.steps,
      isCustom: true,
      prepTime: r.prepTime,
    }));
    return [...defaultRecipes, ...custom];
  }, [defaultRecipes, customRecipes]);

  // ── Filter by search ───────────────────────────────────────
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return allRecipes;
    const q = searchQuery.toLowerCase();
    return allRecipes.filter((r) => r.name.toLowerCase().includes(q));
  }, [allRecipes, searchQuery]);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── Add modal state ────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addEmoji, setAddEmoji] = useState("🍽️");
  const [addMealType, setAddMealType] = useState<Recipe["mealType"]>("lunch");
  const [addPrepTime, setAddPrepTime] = useState("");
  const [addIngredients, setAddIngredients] = useState("");
  const [addSteps, setAddSteps] = useState("");

  const resetAdd = () => {
    setAddTitle("");
    setAddEmoji("🍽️");
    setAddMealType("lunch");
    setAddPrepTime("");
    setAddIngredients("");
    setAddSteps("");
  };

  const handleAdd = () => {
    if (!addTitle.trim()) return;
    addCustomRecipe({
      title: addTitle.trim(),
      emoji: addEmoji.trim() || "🍽️",
      mealType: addMealType,
      prepTime: addPrepTime.trim(),
      ingredients: addIngredients
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      steps: addSteps
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    resetAdd();
    setAddOpen(false);
  };

  // ── Edit modal state ───────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editMealType, setEditMealType] = useState<Recipe["mealType"]>("lunch");
  const [editPrepTime, setEditPrepTime] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editSteps, setEditSteps] = useState("");

  const handleEdit = () => {
    if (!editTitle.trim()) return;
    editCustomRecipe(editId, {
      title: editTitle.trim(),
      emoji: editEmoji.trim() || "🍽️",
      mealType: editMealType,
      prepTime: editPrepTime.trim(),
      ingredients: editIngredients
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      steps: editSteps
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setEditOpen(false);
  };

  // ── Action sheet state ─────────────────────────────────────
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetRecipeId, setSheetRecipeId] = useState("");
  const [sheetRecipeName, setSheetRecipeName] = useState("");

  // ── Long press ─────────────────────────────────────────────
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const startLongPress = useCallback(
    (recipe: RecipeEntry) => {
      if (!recipe.isCustom) return;
      longPressTriggered.current = false;
      longPressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        setSheetRecipeId(recipe.id);
        setSheetRecipeName(recipe.name);
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
        const cr = customRecipes.find((r) => r.id === sheetRecipeId);
        if (!cr) return;
        setEditId(cr.id);
        setEditTitle(cr.title);
        setEditEmoji(cr.emoji);
        setEditMealType(cr.mealType);
        setEditPrepTime(cr.prepTime);
        setEditIngredients(cr.ingredients.join("\n"));
        setEditSteps(cr.steps.join("\n"));
        setEditOpen(true);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      destructive: true,
      onPress: () => {
        deleteCustomRecipe(sheetRecipeId);
      },
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader title="Recipes" emoji="📖" backHref="/" />

      <div className="px-5 pb-8">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full rounded-xl bg-muted/50 border border-border/40 pl-9 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""}
          {searchQuery && " found"}
        </p>

        <motion.div
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
          key={searchQuery}
        >
          {filteredRecipes.map((recipe, index) => {
            const isExpanded = expandedId === recipe.id;
            return (
              <motion.div key={recipe.id} variants={cardVariant}>
                <div
                  className={cn(
                    "rounded-2xl overflow-hidden border border-border/40",
                    softColors[index % softColors.length]
                  )}
                  onPointerDown={() => startLongPress(recipe)}
                  onPointerUp={cancelLongPress}
                  onPointerLeave={cancelLongPress}
                >
                  {/* Header */}
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 p-4 text-left"
                    onClick={() => {
                      if (longPressTriggered.current) return;
                      toggle(recipe.id);
                    }}
                  >
                    <span className="text-2xl">{recipe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {recipe.name}
                        </p>
                        {recipe.isCustom && (
                          <span className="shrink-0 rounded-full bg-accent-lavender-soft px-1.5 py-0.5 text-[9px] font-bold text-accent-lavender">
                            Custom
                          </span>
                        )}
                      </div>
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
                        {recipe.prepTime && (
                          <span className="text-[10px] text-muted-foreground">
                            {recipe.prepTime}
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
                          {recipe.ingredients.length > 0 && (
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
                          )}

                          {recipe.recipe.length > 0 && (
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

      {/* FAB */}
      <FAB onClick={() => setAddOpen(true)} />

      {/* Add recipe modal */}
      <FormModal
        open={addOpen}
        onClose={() => {
          resetAdd();
          setAddOpen(false);
        }}
        title="Add Recipe"
        onSubmit={handleAdd}
        submitLabel="Add"
        submitDisabled={!addTitle.trim()}
      >
        <div className="space-y-4">
          <FormInput
            label="Title"
            value={addTitle}
            onChange={setAddTitle}
            placeholder="e.g. Protein Pancakes"
          />
          <FormInput
            label="Emoji"
            value={addEmoji}
            onChange={setAddEmoji}
            placeholder="🍽️"
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Meal Type
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {MEAL_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAddMealType(t)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                    addMealType === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <FormInput
            label="Prep Time"
            value={addPrepTime}
            onChange={setAddPrepTime}
            placeholder="e.g. 15 min"
          />
          <FormInput
            label="Ingredients (one per line)"
            value={addIngredients}
            onChange={setAddIngredients}
            placeholder="1 scoop protein powder&#10;2 eggs&#10;1/4 cup oats"
            multiline
          />
          <FormInput
            label="Steps (one per line)"
            value={addSteps}
            onChange={setAddSteps}
            placeholder="Mix all ingredients&#10;Cook on medium heat&#10;Serve with toppings"
            multiline
          />
        </div>
      </FormModal>

      {/* Edit recipe modal */}
      <FormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Recipe"
        onSubmit={handleEdit}
        submitLabel="Save"
        submitDisabled={!editTitle.trim()}
      >
        <div className="space-y-4">
          <FormInput
            label="Title"
            value={editTitle}
            onChange={setEditTitle}
            placeholder="e.g. Protein Pancakes"
          />
          <FormInput
            label="Emoji"
            value={editEmoji}
            onChange={setEditEmoji}
            placeholder="🍽️"
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Meal Type
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {MEAL_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEditMealType(t)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                    editMealType === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <FormInput
            label="Prep Time"
            value={editPrepTime}
            onChange={setEditPrepTime}
            placeholder="e.g. 15 min"
          />
          <FormInput
            label="Ingredients (one per line)"
            value={editIngredients}
            onChange={setEditIngredients}
            placeholder="1 scoop protein powder&#10;2 eggs"
            multiline
          />
          <FormInput
            label="Steps (one per line)"
            value={editSteps}
            onChange={setEditSteps}
            placeholder="Mix all ingredients&#10;Cook on medium heat"
            multiline
          />
        </div>
      </FormModal>

      {/* Action sheet for custom recipes */}
      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={sheetRecipeName}
        options={sheetOptions}
      />
    </AnimatedPage>
  );
}
