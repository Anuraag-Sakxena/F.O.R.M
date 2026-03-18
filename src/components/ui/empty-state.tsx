"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({
  emoji,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <span className="text-4xl mb-3">{emoji}</span>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        {description}
      </p>
    </div>
  );
}
