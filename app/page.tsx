"use client";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import BottomNav from "@/components/BottomNav";

const TITLE_LETTERS = "STATQUEST".split("");

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${(i * 6 + 5) % 100}%`,
            width:  `${2 + (i % 2)}px`,
            height: `${2 + (i % 2)}px`,
            background: i % 3 === 0
              ? "var(--accent-indigo)"
              : i % 3 === 1
              ? "var(--accent-gold)"
              : "var(--accent-emerald)",
            opacity: 0.35,
            animationDuration: `${12 + (i % 9)}s, ${3 + (i % 4)}s`,
            animationDelay:    `${-(i * 0.8)}s, ${-(i * 0.35)}s`,
          }}
        />
      ))}
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      animate={{ opacity: [0.4, 0.8, 0.4], y: [0, 4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="font-sans text-xs tracking-widest" style={{ color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.2em" }}>SCROLL</span>
      <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
        <path d="M1 1L7 7L13 1" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

export default function LandingPage() {
  const { xp, level, streak, completedTopics, updateStreak } = useGameStore();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const stats = [
    {
      label: "Current XP",
      value: `${xp}`,
      unit: "XP",
      color: "var(--accent-gold)",
      emptyColor: "var(--text-muted)",
      isEmpty: xp === 0,
      icon: "✦",
    },
    {
      label: "Day Streak",
      value: streak > 0 ? `${streak}` : "—",
      unit: streak > 0 ? (streak >= 3 ? "🔥" : "⚡") : "",
      color: "var(--accent-gold)",
      emptyColor: "var(--text-muted)",
      isEmpty: streak === 0,
      icon: "◈",
    },
    {
      label: "Mastered",
      value: `${completedTopics.length}`,
      unit: "/ 7",
      color: "var(--accent-emerald)",
      emptyColor: "var(--text-muted)",
      isEmpty: completedTopics.length === 0,
      icon: "◉",
    },
  ];

  const letterVariants = {
    hidden:  { opacity: 0, y: 32, rotateX: -70 },
    visible: { opacity: 1, y: 0,  rotateX: 0   },
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden safe-pb">
      <Particles />

      {/* Hero content */}
      <div className="relative z-10 text-center px-5 max-w-2xl mx-auto w-full">

        {/* Title */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            className="flex justify-center"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: prefersReduced ? 0 : 0.07, delayChildren: 0.1 } } }}
            style={{ perspective: "800px" }}
          >
            {TITLE_LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                variants={prefersReduced ? {} : letterVariants}
                transition={{ type: "spring", stiffness: 160, damping: 13 }}
                className="font-display font-black leading-none"
                style={{
                  fontSize: "clamp(2.6rem, 11vw, 6.5rem)",
                  letterSpacing: "0.04em",
                  color: i < 4 ? "var(--accent-indigo)" : "var(--accent-gold)",
                  textShadow: i < 4
                    ? "0 0 50px var(--accent-indigo-glow), 0 0 100px rgba(108,99,255,0.15)"
                    : "0 0 50px var(--accent-gold-glow), 0 0 100px rgba(245,158,11,0.12)",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReduced ? 0 : 0.82, duration: 0.6 }}
            className="font-heading mt-3 sm:mt-4 tracking-[0.3em]"
            style={{ fontSize: "clamp(9px, 2vw, 12px)", color: "var(--text-muted)", textTransform: "uppercase" }}
          >
            Statistics · Gamified · Mastered
          </motion.p>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReduced ? 0 : 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans mb-10 sm:mb-12 mx-auto"
          style={{
            fontSize: "clamp(15px, 3.5vw, 19px)",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth: "420px",
          }}
        >
          Hey <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>Vani</span> — turn your biggest weakness into your{" "}
          <span style={{ color: "var(--text-indigo)", fontWeight: 600 }}>strongest skill.</span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: prefersReduced ? 0 : 1.25, type: "spring", stiffness: 220, damping: 18 }}
        >
          <Link href="/world">
            <motion.button
              whileHover={prefersReduced ? {} : { scale: 1.03, boxShadow: "0 0 50px rgba(108,99,255,0.65), 0 4px 20px rgba(0,0,0,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              style={{ padding: "15px 40px", borderRadius: "14px", fontSize: "clamp(14px, 3vw, 17px)", letterSpacing: "0.04em" }}
            >
              <span>⚔</span>
              <span>Enter the World</span>
              <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: "2px" }}>→</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReduced ? 0 : 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-sm mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={prefersReduced ? {} : { y: -4, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="glass-card p-3 sm:p-4 text-center"
            >
              <div className="mb-1.5" style={{ color: "var(--text-muted)", fontSize: "13px" }}>{stat.icon}</div>
              <div className="font-sans font-bold tabular-nums" style={{ color: stat.isEmpty ? stat.emptyColor : stat.color, fontSize: "clamp(13px, 3vw, 16px)" }}>
                {stat.value}
                {stat.unit && <span className="ml-1 font-normal" style={{ fontSize: "11px", color: "var(--text-muted)" }}>{stat.unit}</span>}
              </div>
              <div className="font-sans mt-0.5" style={{ fontSize: "10px", color: "var(--text-muted)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Level line */}
        {level > 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReduced ? 0 : 2 }}
            className="mt-5 font-sans"
            style={{ fontSize: "12px", color: "var(--text-muted)" }}
          >
            Level {level} Scholar — The numbers already respect you.
          </motion.p>
        )}
      </div>

      <ScrollIndicator />
      <BottomNav />
    </main>
  );
}
