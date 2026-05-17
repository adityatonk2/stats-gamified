"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import { ToastProvider, useToast } from "@/components/EmotionalToast";
import { ScreenFlashProvider, useScreenFlash } from "@/components/ScreenFlash";
import BossHealthBar from "@/components/BossHealthBar";
import QuizOption from "@/components/QuizOption";
import { Sounds } from "@/lib/sounds";

interface BossQuestion {
  question: string;
  options: string[];
  correct: number;
  damage: number;
  explanation: string;
}

interface BossData {
  name: string;
  hp: number;
  flavor: string;
  questions: BossQuestion[];
}

interface TopicData {
  id: string;
  title: string;
  unlocks: string[];
  bossQuiz: BossData;
}

type BossState = "intro" | "fighting" | "won" | "lost";

function PlayerHP({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-heading text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
        Your Resolve
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1 }}
            animate={i >= current ? { scale: [1, 0.7, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5 rounded-full"
            style={{
              background: i < current
                ? "linear-gradient(135deg, var(--accent-indigo), #9C8FFF)"
                : "var(--bg-elevated)",
              border: `1.5px solid ${i < current ? "rgba(108,99,255,0.6)" : "var(--border-subtle)"}`,
              boxShadow: i < current ? "0 0 8px var(--accent-indigo-glow)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BossContent({ data }: { data: TopicData }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const { addXP, completeTopic, unlockTopic, soundEnabled } = useGameStore();
  const { showToast } = useToast();
  const { flash } = useScreenFlash();

  const boss = data.bossQuiz;
  const PLAYER_HP = 3;

  const [bossHP, setBossHP] = useState(boss.hp);
  const [playerHP, setPlayerHP] = useState(PLAYER_HP);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [bossState, setBossState] = useState<BossState>("intro");
  const [bossShake, setBossShake] = useState(false);

  const question = boss.questions[currentQ % boss.questions.length];

  // Dynamic background intensity based on boss HP
  const bossIntensity = bossHP / boss.hp;
  const bgGlow =
    bossIntensity > 0.66
      ? "rgba(244,63,94,0.08)"
      : bossIntensity > 0.33
      ? "rgba(249,115,22,0.07)"
      : "rgba(245,158,11,0.07)";

  function startFight() { setBossState("fighting"); }

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === question.correct;

    if (correct) {
      const newHP = bossHP - question.damage;
      setBossHP(newHP);
      setBossShake(true);
      flash("correct");
      setTimeout(() => setBossShake(false), 500);
      if (soundEnabled) Sounds.bossHit();
      if (newHP <= 0) {
        setTimeout(() => {
          setBossState("won");
          addXP(100);
          completeTopic(data.id);
          data.unlocks.forEach((id) => unlockTopic(id));
          if (soundEnabled) Sounds.bossDefeat();
          showToast("xp-gain", "+100 XP — Boss Defeated!", "You dominated the dungeon.");
        }, 800);
      }
    } else {
      const newHP = playerHP - 1;
      setPlayerHP(newHP);
      flash("wrong");
      if (soundEnabled) Sounds.wrongAnswer();
      if (newHP <= 0) setTimeout(() => setBossState("lost"), 800);
    }
  }

  function handleNext() {
    if (bossState !== "fighting") return;
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setAnswered(false);
  }

  function handleRetry() {
    setBossHP(boss.hp);
    setPlayerHP(PLAYER_HP);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setBossState("intro");
  }

  return (
    <div
      className="min-h-screen flex flex-col safe-pb"
      style={{
        background: `radial-gradient(ellipse at 50% -10%, ${bgGlow} 0%, var(--bg-base) 60%)`,
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <Link href={`/quiz/${data.id}`} className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
          ← Quiz
        </Link>
        <span className="font-heading text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
          Boss Fight
        </span>
        <div className="w-16" />
      </motion.header>

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {bossState === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-5 text-center py-8"
          >
            <motion.div
              animate={prefersReduced ? {} : { y: [0, -14, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "clamp(72px, 15vw, 110px)", lineHeight: 1, marginBottom: "28px" }}
            >
              👹
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-display font-black uppercase mb-3"
              style={{
                fontSize: "clamp(22px, 5vw, 38px)",
                letterSpacing: "0.14em",
                color: "var(--accent-rose)",
                textShadow: "0 0 40px var(--accent-rose-glow), 0 0 80px rgba(244,63,94,0.12)",
              }}
            >
              {boss.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="font-sans italic mb-8 max-w-sm"
              style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "clamp(13px, 2.5vw, 15px)" }}
            >
              {boss.flavor}
            </motion.p>

            {/* Battle stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card-elevated p-5 mb-8 w-full max-w-xs rounded-2xl"
            >
              <p className="font-heading text-center mb-4" style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Battle Briefing
              </p>
              {[
                { label: "Boss Strength", val: `${boss.hp} HP`, color: "var(--accent-rose)" },
                { label: "Your Resolve",  val: `${PLAYER_HP} HP`, color: "var(--text-indigo)" },
                { label: "Victory Reward",val: "+100 XP", color: "var(--accent-gold)" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <span className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color }}>{val}</span>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 250, damping: 20 }}
              onClick={startFight}
              whileHover={prefersReduced ? {} : { scale: 1.04, boxShadow: "0 0 50px rgba(244,63,94,0.5)" }}
              whileTap={{ scale: 0.96 }}
              className="btn-gold"
              style={{
                background: "linear-gradient(135deg, #EF4444, #DC2626)",
                borderColor: "rgba(239,68,68,0.4)",
                boxShadow: "0 0 28px rgba(239,68,68,0.4)",
                padding: "16px 44px",
                fontSize: "clamp(14px, 3vw, 17px)",
                letterSpacing: "0.06em",
                borderRadius: "14px",
              }}
            >
              <span>⚔</span>
              <span>Begin the Battle</span>
            </motion.button>
          </motion.div>
        )}

        {/* ── FIGHTING ── */}
        {bossState === "fighting" && (
          <motion.div
            key="fighting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col max-w-[600px] mx-auto w-full px-4 sm:px-6 py-5"
          >
            {/* HP area */}
            <div className="space-y-3 mb-6">
              <BossHealthBar current={bossHP} max={boss.hp} label={boss.name} type="boss" shake={bossShake} />
              <div className="flex items-center justify-between pt-1">
                <PlayerHP current={playerHP} max={PLAYER_HP} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mb-5" style={{ background: "var(--border-subtle)" }} />

            {/* Boss avatar small */}
            <motion.div
              animate={prefersReduced ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-center mb-5"
              style={{ fontSize: "40px" }}
            >
              👹
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: prefersReduced ? 0 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: prefersReduced ? 0 : -30 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              >
                <p className="font-heading mb-2.5" style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,63,94,0.6)" }}>
                  {boss.name} attacks with:
                </p>
                <h2 className="font-sans font-semibold mb-5 leading-snug"
                  style={{ fontSize: "clamp(16px, 3.5vw, 20px)", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  {question.question}
                </h2>

                <div className="space-y-2.5 mb-5">
                  {question.options.map((opt, i) => (
                    <QuizOption
                      key={i}
                      text={opt}
                      index={i}
                      selected={selected === i}
                      correct={answered ? i === question.correct : null}
                      onClick={() => handleSelect(i)}
                      disabled={answered}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl mb-5 ${selected === question.correct ? "glass-card-emerald" : "glass-card-rose"}`}
                    >
                      <p className="font-sans text-sm font-semibold mb-1"
                        style={{ color: selected === question.correct ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                        {selected === question.correct
                          ? `⚔ Boss takes ${question.damage} damage!`
                          : "You took a hit. Stay focused."}
                      </p>
                      <p className="font-sans text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>
                        {question.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {answered && bossState === "fighting" && (
                  <motion.button
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleNext}
                    whileHover={prefersReduced ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-xl font-sans font-semibold text-sm text-white"
                    style={{
                      background: "linear-gradient(135deg, #EF4444, #DC2626)",
                      boxShadow: "0 0 24px rgba(239,68,68,0.35)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    Continue Battle →
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── WON ── */}
        {bossState === "won" && (
          <motion.div
            key="won"
            initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-5 text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={prefersReduced ? { scale: 1 } : { scale: 1, rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
              style={{ fontSize: "clamp(64px, 14vw, 96px)", lineHeight: 1, marginBottom: "24px" }}
            >
              💀
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="font-display font-black mb-2"
              style={{
                fontSize: "clamp(26px, 5vw, 40px)",
                color: "var(--accent-gold)",
                textShadow: "0 0 50px var(--accent-gold-glow)",
                letterSpacing: "0.06em",
              }}
            >
              Boss Defeated
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="font-sans text-sm mb-3" style={{ color: "var(--text-muted)" }}>
              {boss.name} has been vanquished.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="font-mono font-bold mb-8"
              style={{ fontSize: "clamp(32px, 6vw, 48px)", color: "var(--accent-gold)", textShadow: "0 0 30px var(--accent-gold-glow)" }}>
              +100 XP
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={() => router.push(`/victory?topic=${data.id}`)}
              whileHover={prefersReduced ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold"
              style={{ padding: "15px 40px", borderRadius: "14px", fontSize: "clamp(14px, 3vw, 16px)" }}
            >
              <span>Claim Your Reward</span>
              <span>→</span>
            </motion.button>
          </motion.div>
        )}

        {/* ── LOST ── */}
        {bossState === "lost" && (
          <motion.div
            key="lost"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-5 text-center py-8"
          >
            <motion.div
              animate={prefersReduced ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ fontSize: "clamp(60px, 13vw, 88px)", lineHeight: 1, marginBottom: "24px" }}
            >
              👹
            </motion.div>
            <h1 className="font-display font-bold mb-3" style={{ fontSize: "clamp(24px, 5vw, 36px)", color: "var(--accent-rose)", letterSpacing: "0.06em" }}>
              Defeated
            </h1>
            <p className="font-sans mb-8 max-w-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "clamp(14px, 3vw, 16px)" }}>
              You&apos;ll get it next time. The Warden is patient.
              <br />Every attempt makes you sharper.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <motion.button
                onClick={handleRetry}
                whileHover={prefersReduced ? {} : { scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex-1"
                style={{ padding: "14px 20px", borderRadius: "12px", fontSize: "14px" }}
              >
                The Warden Respects Persistence →
              </motion.button>
              <Link href={`/learn/${data.id}`} className="flex-1">
                <button className="btn-ghost w-full" style={{ padding: "14px 20px", borderRadius: "12px", fontSize: "14px" }}>
                  Review Lesson
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BossPage() {
  const params = useParams();
  const topic = params.topic as string;
  const [data, setData] = useState<TopicData | null>(null);

  useEffect(() => {
    import(`@/content/statistics/${topic}.json`)
      .then((mod) => setData(mod.default))
      .catch(() => {});
  }, [topic]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="font-heading text-lg"
          style={{ color: "var(--accent-rose)" }}
        >
          The boss awakens...
        </motion.p>
      </div>
    );
  }

  return (
    <ScreenFlashProvider>
      <ToastProvider>
        <BossContent data={data} />
      </ToastProvider>
    </ScreenFlashProvider>
  );
}
