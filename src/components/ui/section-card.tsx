"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SectionCard({ children, className, onClick }: SectionCardProps) {
  if (onClick) {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "bg-card rounded-2xl shadow-sm border border-border/60 p-4 cursor-pointer",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card rounded-2xl shadow-sm border border-border/60 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
