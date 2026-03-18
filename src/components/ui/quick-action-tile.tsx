"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickActionTileProps {
  label: string;
  emoji: string;
  href: string;
  bgClass: string;
  status?: string;
  done?: number;
  total?: number;
  className?: string;
}

export function QuickActionTile({
  label,
  emoji,
  href,
  bgClass,
  status,
  done,
  total,
  className,
}: QuickActionTileProps) {
  return (
    <Link href={href} className={cn("block", className)}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative rounded-2xl p-3.5 flex flex-col justify-between min-h-[88px]",
          bgClass
        )}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="text-2xl">{emoji}</span>

          {done !== undefined && total !== undefined && (
            <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">
              {done}/{total}
            </span>
          )}
        </div>

        {/* Bottom area */}
        <div className="mt-auto">
          <span className="text-xs font-medium text-foreground/80">
            {label}
          </span>
          {status && (
            <p className="text-[10px] text-foreground/50 mt-0.5">{status}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
