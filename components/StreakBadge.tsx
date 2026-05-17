"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";

export default function StreakBadge() {
  const { streak } = useGameStore();
  const prefersReduced = useReducedMotion();

  if (streak === 0) return null;

  const isHot = streak >= 3;

  return (
    <motion.div
      className="relative group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 22 }}
    >
      {/* Outer pulse ring */}
      {isHot && !prefersReduced && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ margin: "-4px", background: "var(--accent-gold-glow)" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <motion.div
        whileHover={prefersReduced ? {} : {
          rotate: [0, -8, 8, -4, 0],
          transition: { duration: 0.4 },
        }}
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-sm cursor-default select-none"
        style={{
          background: "var(--accent-gold-dim)",
          border: "1px solid rgba(245,158,11,0.3)",
          color: "var(--accent-gold)",
        }}
      >
        <span className="leading-none">{isHot ? "🔥" : "⚡"}</span>
        <span className="font-medium text-xs tabular-nums">{streak}d</span>
      </motion.div>

      {/* Tooltip */}
      <div
        className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg font-sans text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          color: "var(--text-secondary)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        {isHot
          ? `${streak}-day streak 🔥 The numbers fear you.`
          : "Keep going. Momentum is the real weapon."}
      </div>
    </motion.div>
  );
}
