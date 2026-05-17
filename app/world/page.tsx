"use client";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import XPBar from "@/components/XPBar";
import StreakBadge from "@/components/StreakBadge";
import SoundButton from "@/components/SoundButton";
import WorldMapNode from "@/components/WorldMapNode";
import BottomNav from "@/components/BottomNav";

interface TopicNode {
  id: string;
  title: string;
  region: string;
  emoji: string;
  xpReward: number;
  x: number;
  y: number;
  connections: string[];
}

const TOPICS: TopicNode[] = [
  { id: "mean",        title: "The Mean",      region: "Central Tendency", emoji: "🍕", xpReward: 160, x: 22, y: 28, connections: ["median"] },
  { id: "median",      title: "The Median",    region: "Central Tendency", emoji: "📏", xpReward: 160, x: 40, y: 44, connections: ["mode"] },
  { id: "mode",        title: "The Mode",      region: "Central Tendency", emoji: "👑", xpReward: 160, x: 24, y: 60, connections: ["probability"] },
  { id: "probability", title: "Probability",   region: "Probability Realm",emoji: "🎲", xpReward: 160, x: 56, y: 34, connections: ["correlation"] },
  { id: "correlation", title: "Correlation",   region: "Relationships",    emoji: "🔗", xpReward: 160, x: 73, y: 24, connections: ["regression"] },
  { id: "regression",  title: "Regression",    region: "Relationships",    emoji: "📈", xpReward: 160, x: 80, y: 46, connections: [] },
  { id: "stddev",      title: "Std Deviation", region: "Dispersion",       emoji: "📊", xpReward: 160, x: 62, y: 66, connections: [] },
];

const REGION_LABELS = [
  { name: "Central Tendency", x: 21,  y: 14 },
  { name: "Probability",      x: 54,  y: 20 },
  { name: "Relationships",    x: 75,  y: 13 },
];

// Mobile ordered path (top to bottom journey)
const MOBILE_ORDER = ["mean", "median", "mode", "probability", "correlation", "regression", "stddev"];

export default function WorldPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const { unlockedTopics, completedTopics } = useGameStore();

  function getStatus(id: string): "locked" | "unlocked" | "completed" {
    if (completedTopics.includes(id)) return "completed";
    if (unlockedTopics.includes(id)) return "unlocked";
    return "locked";
  }

  const connections: Array<{ from: TopicNode; to: TopicNode }> = [];
  TOPICS.forEach((t) => {
    t.connections.forEach((tid) => {
      const target = TOPICS.find((x) => x.id === tid);
      if (target) connections.push({ from: t, to: target });
    });
  });

  return (
    <div className="min-h-screen flex flex-col safe-pb" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-30"
        style={{
          background: "rgba(12,12,16,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Link href="/" className="font-display text-sm font-bold tracking-wide transition-colors duration-150"
          style={{ color: "var(--accent-indigo)" }}
        >
          ← STATQUEST
        </Link>
        <span className="hidden sm:block font-sans text-xs ml-3" style={{ color: "var(--text-muted)" }}>
          Vani&apos;s World
        </span>
        <div className="flex-1 mx-5 max-w-[260px] hidden sm:block">
          <XPBar />
        </div>
        <div className="flex items-center gap-2.5">
          <StreakBadge />
          <SoundButton />
          <Link
            href="/formula-vault"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs transition-colors duration-150"
            style={{
              background: "var(--bg-glass)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            📜 Vault
          </Link>
        </div>
      </motion.header>

      {/* ─── DESKTOP MAP ─── */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        {/* Star-field dots */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {Array.from({ length: 70 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left:       `${(i * 13.7 + 3) % 100}%`,
                top:        `${(i * 7.3  + 5) % 100}%`,
                width:      `${1 + (i % 2)}px`,
                height:     `${1 + (i % 2)}px`,
                background: "white",
                opacity:    0.08 + (i % 4) * 0.04,
              }}
            />
          ))}
        </div>

        {/* Region ambient glows */}
        <div className="absolute pointer-events-none" style={{ top: "20%", left: "20%", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="absolute pointer-events-none" style={{ top: "25%", left: "50%", width: "220px", height: "220px", background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="absolute pointer-events-none" style={{ top: "15%", left: "68%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)", borderRadius: "50%" }} />

        {/* Region labels */}
        {REGION_LABELS.map((r) => (
          <div
            key={r.name}
            className="absolute font-heading pointer-events-none"
            style={{
              left: `${r.x}%`,
              top:  `${r.y}%`,
              transform: "translateX(-50%)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {r.name}
          </div>
        ))}

        {/* SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} preserveAspectRatio="none">
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <circle cx="3" cy="3" r="1.5" fill="rgba(108,99,255,0.4)" />
            </marker>
          </defs>
          {connections.map(({ from, to }) => {
            const fromStatus = getStatus(from.id);
            const active = fromStatus !== "locked";
            const done   = fromStatus === "completed";
            return (
              <motion.line
                key={`${from.id}-${to.id}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={done ? "var(--accent-gold)" : active ? "var(--accent-indigo)" : "rgba(255,255,255,0.07)"}
                strokeWidth={active ? "1.5" : "1"}
                strokeDasharray="5 5"
                strokeOpacity={active ? 0.45 : 0.2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={prefersReduced ? { duration: 0 } : { duration: 1.2, delay: 0.4, ease: "easeInOut" }}
              />
            );
          })}
        </svg>

        {/* Map nodes */}
        <div className="relative w-full" style={{ height: "calc(100vh - 60px)", zIndex: 2 }}>
          {TOPICS.map((topic) => (
            <WorldMapNode
              key={topic.id}
              {...topic}
              status={getStatus(topic.id)}
              onClick={() => router.push(`/learn/${topic.id}`)}
            />
          ))}
        </div>
      </div>

      {/* ─── MOBILE MAP (vertical path) ─── */}
      <div className="flex md:hidden flex-1 flex-col">
        <div className="flex-1 px-5 py-6 overflow-y-auto">
          <div className="relative max-w-xs mx-auto">
            {/* Center line */}
            <div
              className="absolute left-7 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(180deg, var(--accent-indigo-dim), var(--border-subtle))" }}
            />

            <div className="space-y-0">
              {MOBILE_ORDER.map((id, i) => {
                const topic = TOPICS.find((t) => t.id === id)!;
                const status = getStatus(id);
                const isLocked = status === "locked";
                const isCompleted = status === "completed";
                const isUnlocked = status === "unlocked";

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={prefersReduced ? { duration: 0 } : { delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4 py-4"
                  >
                    {/* Node */}
                    <div className="relative shrink-0 z-10">
                      {isUnlocked && !prefersReduced && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ margin: "-4px", background: "rgba(108,99,255,0.2)" }}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <motion.button
                        onClick={isLocked ? undefined : () => router.push(`/learn/${id}`)}
                        disabled={isLocked}
                        whileTap={!isLocked ? { scale: 0.9 } : {}}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
                        style={{
                          background: isLocked ? "var(--bg-elevated)" : isCompleted ? "var(--accent-gold-dim)" : "var(--accent-indigo-dim)",
                          border: `2px solid ${isLocked ? "var(--border-subtle)" : isCompleted ? "rgba(245,158,11,0.6)" : "rgba(108,99,255,0.6)"}`,
                          boxShadow: isCompleted ? "0 0 16px var(--accent-gold-glow)" : isUnlocked ? "0 0 16px var(--accent-indigo-glow)" : "none",
                          opacity: isLocked ? 0.4 : 1,
                          filter: isLocked ? "grayscale(1)" : "none",
                          cursor: isLocked ? "not-allowed" : "pointer",
                        }}
                      >
                        {isLocked ? "🔒" : topic.emoji}
                      </motion.button>
                      {isCompleted && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ background: "var(--accent-gold)", color: "#0C0C10", border: "1.5px solid var(--bg-base)" }}>
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-semibold"
                        style={{ color: isCompleted ? "var(--accent-gold)" : isUnlocked ? "var(--text-primary)" : "var(--text-muted)" }}>
                        {topic.title}
                      </p>
                      <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{topic.region}</p>
                      {!isLocked && (
                        <p className="font-sans text-xs mt-0.5" style={{ color: isCompleted ? "var(--accent-gold)" : "var(--text-muted)" }}>
                          {isCompleted ? "Conquered" : `+${topic.xpReward} XP`}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    {!isLocked && (
                      <motion.button
                        onClick={() => router.push(`/learn/${id}`)}
                        whileHover={{ x: 2 }}
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-sans text-sm"
                        style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}
                      >
                        →
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="hidden md:flex items-center gap-5 px-6 py-3 border-t font-sans text-xs"
        style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-gold)", opacity: 0.7 }} />
          Conquered
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-indigo)", opacity: 0.7 }} />
          Unlocked
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--border-strong)" }} />
          Locked
        </div>
        <span className="ml-auto" style={{ color: "var(--text-muted)", fontSize: "11px" }}>Click a node to enter the dungeon</span>
      </motion.div>

      <BottomNav />
    </div>
  );
}
