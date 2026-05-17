"use client";
import { motion, useReducedMotion } from "framer-motion";

interface QuizOptionProps {
  text: string;
  index: number;
  selected: boolean;
  correct: boolean | null;
  onClick: () => void;
  disabled: boolean;
}

const LABELS = ["A", "B", "C", "D"];

export default function QuizOption({ text, index, selected, correct, onClick, disabled }: QuizOptionProps) {
  const prefersReduced = useReducedMotion();

  const isCorrect = selected && correct === true;
  const isWrong   = selected && correct === false;
  const isReveal  = !selected && correct === true;

  const shakeAnim = prefersReduced ? { opacity: 1 } : { x: [0, -10, 10, -7, 7, -4, 4, 0], opacity: 1 };
  const idleAnim  = { opacity: 1, x: 0 };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 8 }}
      animate={isWrong ? shakeAnim : idleAnim}
      transition={
        isWrong
          ? { duration: 0.4, ease: "easeOut" }
          : { delay: index * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }
      whileHover={
        !disabled && !prefersReduced
          ? { y: -2, scale: 1.005, transition: { type: "spring", stiffness: 500, damping: 30 } }
          : {}
      }
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className="w-full flex items-center gap-3 text-left rounded-xl border transition-colors duration-150"
      style={{
        minHeight: "56px",
        padding: "14px 18px",
        background: isCorrect
          ? "rgba(16, 185, 129, 0.10)"
          : isWrong
          ? "rgba(244, 63, 94, 0.08)"
          : isReveal
          ? "rgba(16, 185, 129, 0.05)"
          : "var(--bg-glass)",
        borderColor: isCorrect
          ? "var(--accent-emerald)"
          : isWrong
          ? "var(--accent-rose)"
          : isReveal
          ? "rgba(16, 185, 129, 0.35)"
          : "var(--border-default)",
        boxShadow: isCorrect
          ? "0 0 16px var(--accent-emerald-glow)"
          : isWrong
          ? "0 0 12px var(--accent-rose-glow)"
          : "none",
        backdropFilter: "blur(12px)",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {/* Letter badge */}
      <div
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-sm"
        style={{
          background: isCorrect
            ? "rgba(16,185,129,0.2)"
            : isWrong
            ? "rgba(244,63,94,0.15)"
            : "rgba(255,255,255,0.07)",
          color: isCorrect
            ? "var(--accent-emerald)"
            : isWrong
            ? "var(--accent-rose)"
            : "var(--text-muted)",
          border: "1px solid",
          borderColor: isCorrect
            ? "rgba(16,185,129,0.3)"
            : isWrong
            ? "rgba(244,63,94,0.25)"
            : "var(--border-subtle)",
        }}
      >
        {LABELS[index]}
      </div>

      {/* Text */}
      <span
        className="flex-1 font-sans text-sm leading-snug"
        style={{ color: isCorrect || isReveal ? "var(--text-primary)" : isWrong ? "rgba(255,255,255,0.6)" : "var(--text-secondary)" }}
      >
        {text}
      </span>

      {/* State icon */}
      {isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="shrink-0 text-base"
          style={{ color: "var(--accent-emerald)" }}
        >
          ✓
        </motion.div>
      )}
      {isWrong && (
        <span className="shrink-0 text-base" style={{ color: "var(--accent-rose)" }}>✗</span>
      )}
    </motion.button>
  );
}
