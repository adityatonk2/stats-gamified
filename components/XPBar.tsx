"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";

const XP_PER_LEVEL = 200;

export default function XPBar() {
  const { xp, level } = useGameStore();
  const prefersReduced = useReducedMotion();

  const currentLevelXP = (level - 1) * XP_PER_LEVEL;
  const progress = Math.min(((xp - currentLevelXP) / XP_PER_LEVEL) * 100, 100);
  const xpInLevel = xp - currentLevelXP;

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Level pill */}
      <div
        className="shrink-0 flex items-center justify-center h-7 px-2.5 rounded-full font-heading text-xs font-bold tracking-wide"
        style={{
          background: "var(--accent-indigo-dim)",
          border: "1px solid rgba(108,99,255,0.4)",
          color: "var(--text-indigo)",
          minWidth: "52px",
        }}
      >
        LVL {level}
      </div>

      {/* Bar */}
      <div className="flex-1 min-w-0">
        <div
          className="relative h-2 rounded-full overflow-hidden"
          style={{ background: "var(--bg-elevated)" }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full xp-shimmer overflow-hidden"
            style={{
              background: "linear-gradient(90deg, var(--accent-indigo) 0%, #9C8FFF 100%)",
              boxShadow: "0 0 8px var(--accent-indigo-glow)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* XP text */}
      <span
        className="shrink-0 font-sans text-xs font-medium tabular-nums"
        style={{ color: "var(--text-muted)" }}
      >
        {xpInLevel}<span style={{ color: "var(--text-muted)" }}>/</span>{XP_PER_LEVEL}
      </span>
    </div>
  );
}
