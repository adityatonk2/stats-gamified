"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import { ToastProvider, useToast } from "@/components/EmotionalToast";
import SoundButton from "@/components/SoundButton";
import XPBar from "@/components/XPBar";
import { Sounds } from "@/lib/sounds";

interface TopicData {
  id: string;
  title: string;
  region: string;
  difficulty: number;
  emoji: string;
  lore: string;
  explanation: string;
  formula: {
    label: string;
    expression: string;
    breakdown: { symbol: string; meaning: string }[];
  };
  example: {
    question: string;
    steps: string[];
    answer: string;
  };
  formulaCard: {
    id: string;
    rarity: string;
    title: string;
    expression: string;
  };
}

const PAGE_EASE = [0.16, 1, 0.3, 1] as const;

function LessonContent({ data }: { data: TopicData }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const { addXP, collectFormulaCard, formulaCardsCollected, soundEnabled } = useGameStore();
  const { showToast } = useToast();
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);
  const [cardCollected, setCardCollected] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    if (!formulaCardsCollected.includes(data.formulaCard.id)) {
      const t = setTimeout(() => {
        collectFormulaCard(data.formulaCard.id);
        setCardCollected(true);
        showToast("formula", "Formula Card Unlocked!", data.formulaCard.title);
        if (soundEnabled) Sounds.unlock();
      }, 2200);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRevealStep(i: number) {
    setRevealedSteps((prev) => prev.includes(i) ? prev : [...prev, i]);
  }

  function handleContinue() {
    if (!xpAwarded) {
      addXP(30);
      setXpAwarded(true);
      showToast("xp-gain", "+30 XP — Fear reduced.", "Lesson complete");
      if (soundEnabled) Sounds.xpGain();
    }
    setTimeout(() => router.push(`/quiz/${data.id}`), 500);
  }

  const sectionAnim = (delay: number) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: prefersReduced ? 0 : delay, duration: 0.55, ease: PAGE_EASE },
  });

  const formulaChars = data.formula.expression.split("").map((char, i) => ({ char, i }));

  return (
    <div className="min-h-screen safe-pb" style={{ background: "var(--bg-base)" }}>
      {/* Sticky header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-30"
        style={{
          background: "rgba(12,12,16,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Link href="/world" className="font-sans text-sm transition-colors duration-150"
          style={{ color: "var(--text-muted)" }}
        >
          ← World
        </Link>
        <div className="flex-1 mx-4 max-w-[220px] hidden sm:block">
          <XPBar />
        </div>
        <SoundButton />
      </motion.header>

      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ─── SECTION 1: LORE ─── */}
        <motion.div {...sectionAnim(0)} className="glass-card-gold relative overflow-hidden rounded-2xl p-6 sm:p-8">
          {/* Left accent bar */}
          <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full" style={{ background: "var(--accent-gold)" }} />

          <div className="flex items-center justify-between mb-4 pl-4">
            <span className="badge badge-gold">⚔ Lore</span>
            <span className="text-2xl">{data.emoji}</span>
          </div>

          <h1
            className="font-heading pl-4 mb-1.5"
            style={{ fontSize: "clamp(22px, 5vw, 30px)", color: "var(--text-primary)", lineHeight: 1.25 }}
          >
            {data.title}
          </h1>
          <p className="font-heading pl-4 mb-4"
            style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-gold)", opacity: 0.65 }}>
            {data.region}
          </p>
          <p className="font-sans pl-4 italic leading-relaxed" style={{ fontSize: "clamp(14px, 2.5vw, 16px)", color: "var(--text-secondary)", lineHeight: 1.75 }}>
            {data.lore}
          </p>
        </motion.div>

        {/* ─── SECTION 2: EXPLANATION ─── */}
        <motion.div {...sectionAnim(0.12)} className="glass-card-elevated rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-5">
            <div
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "var(--accent-indigo-dim)", border: "1px solid rgba(108,99,255,0.3)" }}
            >
              {data.emoji}
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: "clamp(16px, 3vw, 20px)", color: "var(--text-primary)" }}>
                What is it?
              </h2>
              <p className="font-sans text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Plain language. No textbook jargon.
              </p>
            </div>
          </div>
          <p className="font-sans leading-relaxed" style={{ fontSize: "clamp(14px, 2.5vw, 16px)", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            {data.explanation}
          </p>
        </motion.div>

        {/* ─── SECTION 3: FORMULA ─── */}
        <motion.div {...sectionAnim(0.24)} className="glass-card-indigo rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge badge-indigo">The Formula</span>
            <div className="flex-1 h-px" style={{ background: "var(--accent-indigo-dim)" }} />
          </div>

          {/* Formula display */}
          <div className="text-center mb-7">
            <p className="font-heading mb-3" style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {data.formula.label}
            </p>
            <div
              className="inline-flex flex-wrap justify-center items-baseline gap-0 px-6 py-4 rounded-xl"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-subtle)" }}
            >
              {formulaChars.map(({ char, i }) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prefersReduced ? 0 : 0.3 + i * 0.035, duration: 0.3 }}
                  className="font-mono font-bold"
                  style={{
                    fontSize: "clamp(20px, 5vw, 32px)",
                    color: "var(--accent-gold)",
                    textShadow: "0 0 20px var(--accent-gold-glow)",
                    lineHeight: 1.2,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Formula card badge */}
            {cardCollected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="inline-flex items-center gap-1.5 mt-4 badge badge-indigo"
              >
                📜 Formula Card Unlocked
              </motion.div>
            )}
          </div>

          {/* Breakdown table */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
            {data.formula.breakdown.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: prefersReduced ? 0 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: prefersReduced ? 0 : 0.55 + i * 0.08 }}
                className="flex items-center gap-5 px-4 py-3"
                style={{
                  background: i % 2 === 0 ? "rgba(0,0,0,0.2)" : "transparent",
                  borderBottom: i < data.formula.breakdown.length - 1 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <span
                  className="font-mono font-bold shrink-0"
                  style={{ width: "72px", fontSize: "14px", color: "var(--accent-indigo)" }}
                >
                  {item.symbol}
                </span>
                <span className="font-sans text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {item.meaning}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── SECTION 4: WORKED EXAMPLE ─── */}
        <motion.div {...sectionAnim(0.36)} className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="badge badge-muted">Worked Example</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
          </div>

          <div
            className="p-4 rounded-xl mb-5 font-sans"
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              fontSize: "clamp(14px, 2.5vw, 15px)",
              lineHeight: 1.65,
            }}
          >
            {data.example.question}
          </div>

          <div className="space-y-2.5">
            {data.example.steps.map((step, i) => (
              <div key={i}>
                <AnimatePresence mode="wait">
                  {revealedSteps.includes(i) ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3 p-3.5 rounded-xl"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                    >
                      <div
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold"
                        style={{ background: "var(--accent-indigo-dim)", color: "var(--text-indigo)", border: "1px solid rgba(108,99,255,0.3)", marginTop: "1px" }}
                      >
                        {i + 1}
                      </div>
                      <p className="font-sans text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>{step}</p>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="hidden"
                      onClick={() => handleRevealStep(i)}
                      whileHover={{ borderColor: "rgba(108,99,255,0.4)", color: "var(--text-secondary)" }}
                      className="w-full p-3.5 rounded-xl font-sans text-sm text-left transition-colors duration-150"
                      style={{
                        background: "transparent",
                        border: "1px dashed var(--border-subtle)",
                        color: "var(--text-muted)",
                        minHeight: "48px",
                      }}
                    >
                      Tap to reveal step {i + 1} →
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {revealedSteps.length === data.example.steps.length && (
              <motion.div
                initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-5 p-5 rounded-xl text-center"
                style={{
                  background: "var(--accent-gold-dim)",
                  border: "1px solid rgba(245,158,11,0.35)",
                  boxShadow: "0 0 24px var(--accent-gold-glow)",
                }}
              >
                <p className="font-heading mb-2" style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,158,11,0.6)" }}>
                  Answer
                </p>
                <p className="font-mono font-bold" style={{ fontSize: "clamp(22px, 5vw, 30px)", color: "var(--accent-gold)", textShadow: "0 0 24px var(--accent-gold-glow)" }}>
                  {data.example.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── STICKY CTA ─── */}
        <motion.div {...sectionAnim(0.48)} className="pb-6 sm:pb-10 text-center">
          <motion.button
            onClick={handleContinue}
            whileHover={prefersReduced ? {} : { scale: 1.03, boxShadow: "0 0 50px rgba(108,99,255,0.55), 0 4px 20px rgba(0,0,0,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ padding: "16px 44px", borderRadius: "14px", fontSize: "clamp(14px, 3vw, 16px)", letterSpacing: "0.05em" }}
          >
            <span>I&apos;m Ready</span>
            <span>→</span>
            <span style={{ opacity: 0.6, fontSize: "13px", fontWeight: 400 }}>Take the Quiz</span>
          </motion.button>
          <p className="font-sans mt-3" style={{ fontSize: "12px", color: "var(--text-muted)" }}>+30 XP on completion</p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  const params = useParams();
  const topic = params.topic as string;
  const [data, setData] = useState<TopicData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    import(`@/content/statistics/${topic}.json`)
      .then((mod) => setData(mod.default))
      .catch(() => setError(true));
  }, [topic]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="text-center">
          <p className="font-heading text-xl mb-4" style={{ color: "var(--text-muted)" }}>Topic not found</p>
          <Link href="/world" className="font-sans text-sm" style={{ color: "var(--accent-indigo)" }}>← Return to World Map</Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="font-heading text-lg"
          style={{ color: "var(--accent-indigo)" }}
        >
          Preparing your challenge...
        </motion.p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <LessonContent data={data} />
    </ToastProvider>
  );
}
