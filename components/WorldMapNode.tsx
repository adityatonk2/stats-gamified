"use client";
import { motion, useReducedMotion } from "framer-motion";

interface WorldMapNodeProps {
  id: string;
  title: string;
  region: string;
  status: "locked" | "unlocked" | "completed";
  emoji: string;
  xpReward: number;
  onClick: () => void;
  x: number;
  y: number;
}

export default function WorldMapNode({ title, region, status, emoji, xpReward, onClick, x, y }: WorldMapNodeProps) {
  const prefersReduced = useReducedMotion();
  const isLocked    = status === "locked";
  const isCompleted = status === "completed";
  const isUnlocked  = status === "unlocked";

  const nodeSize = 64;

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 22, delay: 0.1 }}
    >
      <div className="relative group">
        {/* Unlocked pulse rings */}
        {isUnlocked && !prefersReduced && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                margin: `-${nodeSize * 0.14}px`,
                background: "rgba(108,99,255,0.2)",
              }}
              animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                margin: `-${nodeSize * 0.28}px`,
                background: "rgba(108,99,255,0.1)",
              }}
              animate={{ scale: [1, 1.9, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
            />
          </>
        )}

        {/* Completed steady glow */}
        {isCompleted && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              margin: "-6px",
              boxShadow: "0 0 24px var(--accent-gold-glow), 0 0 48px rgba(245,158,11,0.15)",
              borderRadius: "50%",
            }}
          />
        )}

        {/* Node button */}
        <motion.button
          onClick={isLocked ? undefined : onClick}
          disabled={isLocked}
          whileHover={!isLocked && !prefersReduced ? { scale: 1.12 } : {}}
          whileTap={!isLocked ? { scale: 0.93 } : {}}
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: `${nodeSize}px`,
            height: `${nodeSize}px`,
            fontSize: "24px",
            background: isLocked
              ? "var(--bg-elevated)"
              : isCompleted
              ? "var(--accent-gold-dim)"
              : "var(--accent-indigo-dim)",
            border: `2px solid ${
              isLocked    ? "var(--border-subtle)"
              : isCompleted ? "rgba(245,158,11,0.7)"
              : "rgba(108,99,255,0.7)"
            }`,
            boxShadow: isCompleted
              ? "0 0 20px var(--accent-gold-glow)"
              : isUnlocked
              ? "0 0 20px var(--accent-indigo-glow)"
              : "none",
            opacity:    isLocked ? 0.4 : 1,
            cursor:     isLocked ? "not-allowed" : "pointer",
            filter:     isLocked ? "grayscale(1)" : "none",
          }}
        >
          <span style={{ filter: isLocked ? "grayscale(1) opacity(0.5)" : "none" }}>
            {isLocked ? "🔒" : emoji}
          </span>

          {/* Checkmark badge */}
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "var(--accent-gold)",
                color: "#0C0C10",
                border: "2px solid var(--bg-base)",
              }}
            >
              ✓
            </motion.div>
          )}
        </motion.button>

        {/* Label below */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center pointer-events-none whitespace-nowrap">
          <p
            className="font-sans font-medium"
            style={{
              fontSize: "11px",
              color: isCompleted ? "var(--accent-gold)" : isUnlocked ? "var(--text-secondary)" : "var(--text-muted)",
              maxWidth: "80px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </p>
        </div>

        {/* Hover tooltip (desktop) */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden md:block"
        >
          <div
            className="px-3 py-2 rounded-xl text-center"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <p className="font-heading text-xs" style={{ color: "var(--text-primary)" }}>{title}</p>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{region}</p>
            {!isLocked && (
              <p className="font-sans text-xs mt-1" style={{ color: "var(--accent-gold)" }}>
                +{xpReward} XP on conquest
              </p>
            )}
            {isLocked && (
              <p className="font-sans text-xs mt-1" style={{ color: "var(--accent-rose)" }}>
                Defeat the previous guardian
              </p>
            )}
          </div>
          <div className="w-2 h-2 mx-auto -mt-1 rotate-45" style={{ background: "var(--bg-elevated)", border: "0 0 1px 1px solid var(--border-default)" }} />
        </div>
      </div>
    </motion.div>
  );
}
