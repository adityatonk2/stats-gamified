"use client";
import { motion, useReducedMotion } from "framer-motion";

interface BossHealthBarProps {
  current: number;
  max: number;
  label: string;
  type?: "boss" | "player";
  shake?: boolean;
}

export default function BossHealthBar({ current, max, label, type = "boss", shake = false }: BossHealthBarProps) {
  const prefersReduced = useReducedMotion();
  const pct = Math.max(0, (current / max) * 100);

  const bossGradient =
    pct > 66
      ? "linear-gradient(90deg, #EF4444, #FB7185)"
      : pct > 33
      ? "linear-gradient(90deg, #F97316, #FB923C)"
      : "linear-gradient(90deg, #F59E0B, #FBBF24)";

  const playerGradient = "linear-gradient(90deg, var(--accent-indigo), #9C8FFF)";
  const bossShadow     = pct > 66 ? "var(--accent-rose-glow)" : pct > 33 ? "rgba(249,115,22,0.35)" : "var(--accent-gold-glow)";
  const playerShadow   = "var(--accent-indigo-glow)";

  const bossHPLabel = pct > 66 ? "var(--accent-rose)" : pct > 33 ? "#F97316" : "var(--accent-gold)";

  const shakeAnim = prefersReduced ? {} : { x: [0, -10, 10, -7, 7, -4, 4, 0] };

  return (
    <motion.div
      animate={shake ? shakeAnim : {}}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="font-heading text-xs tracking-[0.12em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <span
          className="font-mono text-sm font-bold tabular-nums"
          style={{ color: type === "boss" ? bossHPLabel : "var(--text-indigo)" }}
        >
          {current}<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/{max}</span>
        </span>
      </div>

      <div
        className="relative h-3 rounded-full overflow-hidden"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: type === "boss" ? bossGradient : playerGradient,
            boxShadow: `0 0 12px ${type === "boss" ? bossShadow : playerShadow}`,
          }}
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Gloss line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-30"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
        />
      </div>
    </motion.div>
  );
}
