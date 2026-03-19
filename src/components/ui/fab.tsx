"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAB({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-5 z-20 flex h-12 w-12 items-center justify-center",
        "rounded-full bg-primary text-primary-foreground shadow-lg",
        "border-2 border-primary-muted/30",
        className
      )}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.3 }}
    >
      <Plus size={22} strokeWidth={2.5} />
    </motion.button>
  );
}
