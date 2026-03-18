"use client";

import { cn } from "@/lib/utils";

type ChipVariant = "default" | "success" | "warning" | "info" | "muted";
type ChipSize = "sm" | "md";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
}

const variantClasses: Record<ChipVariant, string> = {
  default: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-accent-sky-soft text-accent-sky",
  muted: "bg-muted text-muted-foreground",
};

const sizeClasses: Record<ChipSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
};

export function Chip({
  label,
  variant = "default",
  size = "md",
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {label}
    </span>
  );
}
