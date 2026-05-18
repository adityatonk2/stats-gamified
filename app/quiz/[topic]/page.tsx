"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import { ToastProvider, useToast } from "@/components/EmotionalToast";
import { ScreenFlashProvider, useScreenFlash } from "@/components/ScreenFlash";
import QuizOption from "@/components/QuizOption";
import { Sounds } from "@/lib/sounds";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TopicData {
  id: string;
  title: string;
  quiz: QuizQuestion[];
}

function XPFloat({ show }: { show: boolean }) {
  const prefersReduced = useReducedMotion();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          animate={{ opacity: 0, y: prefersReduced ? 0 : -70, scale: 1.2 }}
          exit={{}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed left-1/2 font-mono font-bold pointer-events-none z-[100]"
          style={{
            top: "45%",
            fontSize: "clamp(24px, 5vw, 36px)",
            color: "var(--accent-gold)",
            textShadow: "0 0 24px var(--accent-gold-glow)",
          }}
        >
          +15 XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuizContent({ data }: { data: TopicData }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const { addXP, recordQuiz, soundEnabled } = useGameStore();
  const { showToast } = useToast();
  const { flash } = useScreenFlash();

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showXP, setShowXP] = useState(false);
  // Prevents double-click on the last question's "Enter Boss Fight" button
  const [navigating, setNavigating] = useState(false);

  // Guard: empty quiz
  useEffect(() => {
    if (!data.quiz || data.quiz.length === 0) {
      router.replace("/world");
    }
  }, [data.quiz, router]);

  if (!data.quiz || data.quiz.length === 0) return null;

  const question = data.quiz[currentQ];
  // Guard: question index out of bounds (shouldn't happen but be safe)
  if (!question) {
    router.replace(`/boss/${data.id}`);
    return null;
  }

  // Normalize correct to a number in case JSON has a string
  const correctIndex =
    typeof question.correct === "number"
      ? question.correct
      : parseInt(String(question.correct), 10);

  const progress = ((currentQ + (answered ? 1 : 0)) / data.quiz.length) * 100;
  const isCorrect = selected !== null && selected === correctIndex;
  const isLast = currentQ === data.quiz.length - 1;

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === correctIndex;
    if (correct) {
      addXP(15);
      setScore((s) => s + 1);
      setShowXP(true);
      flash("correct");
      if (soundEnabled) Sounds.correctAnswer();
      setTimeout(() => setShowXP(false), 1200);
    } else {
      flash("wrong");
      if (soundEnabled) Sounds.wrongAnswer();
    }
  }

  function handleNext() {
    if (navigating) return; // block double-clicks
    if (currentQ < data.quiz.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      // Last question — lock button immediately, then navigate
      setNavigating(true);
      // Use functional updater to capture the latest score
      setScore((latestScore) => {
        recordQuiz({ topic: data.id, score: latestScore, date: new Date().toISOString() });
        showToast("xp-gain", "You just leveled up your brain.", `${latestScore}/${data.quiz.length} correct`);
        return latestScore;
      });
      setTimeout(() => router.push(`/boss/${data.id}`), 1000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col safe-pb" style={{ background: "var(--bg-base)" }}>
      <XPFloat show={showXP} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          background: "rgba(12,12,16,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Link href={`/learn/${data.id}`} className="font-sans text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}>
          ← Lesson
        </Link>
        <span className="font-heading text-sm tabular-nums" style={{ color: "var(--text-muted)" }}>
          {currentQ + 1}{" "}
          <span style={{ color: "var(--text-muted)", opacity: 0.4 }}>/ {data.quiz.length}</span>
        </span>
      </motion.header>

      {/* Progress bar */}
      <div className="h-0.5" style={{ background: "var(--bg-elevated)" }}>
        <motion.div
          className="h-full"
          style={{
            background: "linear-gradient(90deg, var(--accent-indigo), #9C8FFF)",
            boxShadow: "0 0 6px var(--accent-indigo-glow)",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-[640px] mx-auto w-full px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: prefersReduced ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReduced ? 0 : -50 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Question */}
            <div className="mb-7">
              <p
                className="font-heading mb-3"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent-indigo)",
                }}
              >
                Question {currentQ + 1}
              </p>
              <h2
                className="font-sans font-semibold leading-snug"
                style={{
                  fontSize: "clamp(17px, 4vw, 22px)",
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                }}
              >
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-5">
              {question.options.map((opt, i) => (
                <QuizOption
                  key={i}
                  text={opt}
                  index={i}
                  selected={selected === i}
                  correct={answered ? i === correctIndex : null}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                />
              ))}
            </div>

            {/* Feedback + Next button */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`p-4 rounded-xl mb-5 ${isCorrect ? "glass-card-emerald" : "glass-card-rose"}`}
                >
                  <p
                    className="font-sans font-semibold text-sm mb-1.5"
                    style={{ color: isCorrect ? "var(--accent-emerald)" : "var(--accent-rose)" }}
                  >
                    {isCorrect ? "Exactly right." : "Almost. Here's the trick:"}
                  </p>
                  <p
                    className="font-sans text-sm"
                    style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}
                  >
                    {question.explanation}
                  </p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    onClick={handleNext}
                    disabled={navigating}
                    whileHover={prefersReduced || navigating ? {} : { scale: 1.02 }}
                    whileTap={navigating ? {} : { scale: 0.97 }}
                    className="w-full mt-4 py-3.5 rounded-xl font-sans font-semibold text-sm text-white transition-opacity"
                    style={{
                      background: isLast
                        ? "linear-gradient(135deg, #F59E0B, #D97706)"
                        : "linear-gradient(135deg, var(--accent-indigo), #5048E5)",
                      boxShadow: isLast
                        ? "0 0 24px var(--accent-gold-glow)"
                        : "0 0 24px var(--accent-indigo-glow)",
                      letterSpacing: "0.03em",
                      opacity: navigating ? 0.5 : 1,
                      cursor: navigating ? "not-allowed" : "pointer",
                    }}
                  >
                    {navigating
                      ? "Entering the dungeon..."
                      : isLast
                      ? "⚔ Enter the Boss Fight"
                      : "Next Question →"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const topic = params.topic as string;
  const [data, setData] = useState<TopicData | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    import(`@/content/statistics/${topic}.json`)
      .then((mod) => setData(mod.default))
      .catch(() => setLoadError(true));
  }, [topic]);

  // Redirect to world map if topic doesn't exist
  useEffect(() => {
    if (loadError) router.replace("/world");
  }, [loadError, router]);

  if (loadError) return null;

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
    <ScreenFlashProvider>
      <ToastProvider>
        <QuizContent data={data} />
      </ToastProvider>
    </ScreenFlashProvider>
  );
}
