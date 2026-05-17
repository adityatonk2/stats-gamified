"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import FormulaCard from "@/components/FormulaCard";
import XPBar from "@/components/XPBar";
import StreakBadge from "@/components/StreakBadge";
import BottomNav from "@/components/BottomNav";

const ALL_CARDS = [
  { id: "mean-card",        title: "Arithmetic Mean",        expression: "X̄ = ΣX / N",             rarity: "common" as const },
  { id: "median-card",      title: "Median Formula",         expression: "M = [(N+1)/2]th Value",   rarity: "common" as const },
  { id: "mode-card",        title: "Mode",                   expression: "Mo = Most Frequent",      rarity: "common" as const },
  { id: "probability-card", title: "Classical Probability",  expression: "P(A) = Fav / Total",      rarity: "rare"   as const },
  { id: "variance-card",    title: "Variance",               expression: "σ² = Σ(X-X̄)² / N",       rarity: "rare"   as const },
  { id: "stddev-card",      title: "Standard Deviation",     expression: "σ = √(Σ(X-X̄)²/N)",       rarity: "rare"   as const },
  { id: "correlation-card", title: "Correlation Coefficient",expression: "r = Σxy / √(Σx²·Σy²)",   rarity: "epic"   as const },
  { id: "regression-card",  title: "Regression Line",        expression: "Ŷ = a + bX",              rarity: "epic"   as const },
];

type FilterType = "all" | "collected" | "locked";

export default function FormulaVaultPage() {
  const { formulaCardsCollected } = useGameStore();
  const prefersReduced = useReducedMotion();
  const [filter, setFilter] = useState<FilterType>("all");

  const collected = formulaCardsCollected.length;
  const total     = ALL_CARDS.length;
  const progress  = (collected / total) * 100;

  const filteredCards = ALL_CARDS.filter((card) => {
    const isCollected = formulaCardsCollected.includes(card.id);
    if (filter === "collected") return isCollected;
    if (filter === "locked")    return !isCollected;
    return true;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "all",       label: `All (${total})` },
    { key: "collected", label: `Collected (${collected})` },
    { key: "locked",    label: `Locked (${total - collected})` },
  ];

  return (
    <div className="min-h-screen safe-pb" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-30"
        style={{
          background: "rgba(12,12,16,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Link href="/world" className="font-sans text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
          ← World Map
        </Link>
        <div className="flex-1 mx-4 max-w-[220px] hidden sm:block">
          <XPBar />
        </div>
        <StreakBadge />
      </motion.header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{
              padding: "5px 14px",
              borderRadius: "100px",
              background: "var(--accent-gold-dim)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <span className="text-sm">📜</span>
            <span className="font-heading" style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent-gold)" }}>
              Formula Vault
            </span>
          </div>

          <h1
            className="font-display font-bold mb-2"
            style={{
              fontSize: "clamp(26px, 6vw, 40px)",
              color: "var(--text-primary)",
              textShadow: "0 0 40px var(--accent-gold-glow)",
            }}
          >
            The Codex of Power
          </h1>
          <p className="font-sans" style={{ fontSize: "clamp(13px, 2.5vw, 15px)", color: "var(--text-muted)" }}>
            Collected artifacts of mathematical power.
          </p>

          {/* Collection progress */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="relative h-1.5 w-36 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--accent-gold), #FBBF24)",
                  boxShadow: "0 0 8px var(--accent-gold-glow)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={prefersReduced ? { duration: 0 } : { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-sm font-bold tabular-nums" style={{ color: "var(--accent-gold)" }}>
              {collected}/{total}
            </span>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8 justify-center"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="font-sans text-sm transition-all duration-200"
              style={{
                padding: "8px 18px",
                borderRadius: "100px",
                background: filter === f.key ? "var(--accent-indigo-dim)" : "var(--bg-glass)",
                border: `1px solid ${filter === f.key ? "rgba(108,99,255,0.5)" : "var(--border-default)"}`,
                color: filter === f.key ? "var(--text-indigo)" : "var(--text-muted)",
                backdropFilter: "blur(12px)",
              }}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: prefersReduced ? 0 : 0.055, delayChildren: 0.1 } } }}
        >
          {filteredCards.map((card) => (
            <motion.div
              key={card.id}
              variants={{
                hidden:   { opacity: 0, y: 16, scale: 0.95 },
                visible:  { opacity: 1, y: 0,  scale: 1 },
              }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
            >
              <FormulaCard
                {...card}
                collected={formulaCardsCollected.includes(card.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredCards.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 font-sans"
            style={{ color: "var(--text-muted)" }}
          >
            {filter === "collected"
              ? "No cards collected yet. Enter the dungeon."
              : "All cards collected. You are unstoppable."}
          </motion.p>
        )}

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <Link href="/world">
            <motion.button
              whileHover={prefersReduced ? {} : { scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost"
              style={{ padding: "13px 28px", borderRadius: "12px", fontSize: "14px" }}
            >
              Back to the World →
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
