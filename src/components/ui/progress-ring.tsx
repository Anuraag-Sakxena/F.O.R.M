"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  percent,
  size = 96,
  strokeWidth = 6,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const isComplete = percent >= 100;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Foreground arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-primary"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset:
              circumference - (circumference * Math.min(percent, 100)) / 100,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>

      {/* Center: number for <100%, verified badge for 100% */}
      {isComplete ? (
        <motion.div
          className="absolute"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
        >
          <Image
            src="/yellow-verified-sign-and-tick-18751.svg"
            alt="Complete"
            width={Math.round(size * 0.45)}
            height={Math.round(size * 0.45)}
          />
        </motion.div>
      ) : (
        <span className="absolute text-lg font-bold text-foreground">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
