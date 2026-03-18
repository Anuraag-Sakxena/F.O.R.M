"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  backHref?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  emoji,
  backHref,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start gap-2 pt-4 pb-3 px-5", className)}>
      {backHref && (
        <Link
          href={backHref}
          className="mt-0.5 -ml-1 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground active:bg-muted transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold text-foreground">
          {emoji && <span className="mr-1.5">{emoji}</span>}
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
