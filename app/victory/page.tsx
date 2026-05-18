"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import BottomNav from "@/components/BottomNav";

interface TopicData {
  id: string;
  title: string;
  unlocks: string[];
  formulaCard: {
    id: string;
    rarity: string;
    title: string;
    expression: string;
  };
}

function VictoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicId = searchParams.get("topic");
  const prefersReduced = useReducedMotion();
  const { xp, level, completedTopics, formulaCardsCollected } = useGameStore();

  const [data, setData] = useState<TopicData | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    // No topic param = direct URL access with no context → go to world map
    if (!topicId) {
      router.replace("/world");
      return;
    }
    import(`@/content/statistics/${topicId}.json`)
      .then((mod) => setData(mod.default))
      .catch(() => router.replace("/world"));
  }, [topicId, router]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    import("canvas-confetti").then((c) => {
      const fire = () => c.default({
        particleCount: 75,
        spread: 65,
        origin: { x: 0.5, y: 0.55 },
        colors: ["#6C63FF", "#F59E0B", "#10B981", "#A5A1FF", "#FBBF24"],
        gravity: 0.85,
        scalar: 1.05,
        disableForReducedMotion: true,
      });
      fire();
      interval = setInterval(fire, 2800);
    });
    return () => clearInterval(interval);
  }, []);

  const motivationalLine =
    completedTopics.length >= 4
      ? "Vani didn't just pass. She dominated."
      : completedTopics.length >= 2
      ? "Solid, Vani. The numbers respect you now."
      : "You showed up, Vani. That's already rare.";

  const cardCollected = data ? formulaCardsCollected.includes(data.formulaCard.id) : false;

  const itemAnim = (delay: number) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: prefersReduced ? 0 : delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 text-center overflow-hidden safe-pb"
      style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(245,158,11,0.08), var(--bg-base) 60%)" }}
    >
      <div className="relative z-10 w-full max-w-md mx-auto py-12">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: prefersReduced ? 0 : -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 14 }}
          style={{ fontSize: "clamp(60px, 14vw, 88px)", lineHeight: 1, marginBottom: "20px" }}
        >
          🏆
        </motion.div>

        {/* XP reward */}
        <motion.div {...itemAnim(0.2)} className="mb-2">
          <p className="font-heading mb-2" style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Reward Earned
          </p>
          <h1
            className="font-display font-black"
            style={{
              fontSize: "clamp(44px, 10vw, 72px)",
              color: "var(--accent-gold)",
              textShadow: "0 0 60px var(--accent-gold-glow), 0 0 120px rgba(245,158,11,0.12)",
              letterSpacing: "0.04em",
            }}
          >
            +100 XP
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Total: {xp} XP · Level {level}
          </p>
        </motion.div>

        {/* Motivational line */}
        <motion.p
          {...itemAnim(0.45)}
          className="font-heading mb-8"
          style={{ fontSize: "clamp(16px, 3.5vw, 22px)", color: "var(--text-secondary)", lineHeight: 1.5 }}
        >
          {motivationalLine}
        </motion.p>

        {/* Formula card */}
        {data && cardCollected && (
          <motion.div {...itemAnim(0.65)} className="mb-8">
            <p className="font-heading mb-3" style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Formula Card Collected
            </p>
            <div
              className="mx-auto cursor-pointer"
              style={{ width: "220px", height: "130px", perspective: "1000px" }}
              onClick={() => setCardFlipped((f) => !f)}
            >
              <motion.div
                animate={{ rotateY: cardFlipped ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", position: "relative" }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-4"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    background: "var(--bg-glass)",
                    border: "1px solid rgba(245,158,11,0.35)",
                    boxShadow: "0 0 24px var(--accent-gold-glow)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <span className="badge badge-gold mb-2">{data.formulaCard.rarity}</span>
                  <p className="font-mono font-bold text-center"
                    style={{ fontSize: "clamp(14px, 3.5vw, 18px)", color: "var(--accent-gold)", textShadow: "0 0 12px var(--accent-gold-glow)" }}>
                    {data.formulaCard.expression}
                  </p>
                  <p className="font-heading mt-1.5 text-center" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    {data.formulaCard.title}
                  </p>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center p-4"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--accent-indigo-dim)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>Tap to flip</p>
                </div>
              </motion.div>
            </div>
            <p className="font-sans mt-2" style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tap to flip</p>
          </motion.div>
        )}

        {/* Unlocked topics */}
        {data && data.unlocks.length > 0 && (
          <motion.div {...itemAnim(0.8)} className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-sm"
              style={{
                background: "var(--accent-emerald-dim)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "var(--accent-emerald)",
              }}
            >
              🔓 Unlocked: <strong>{data.unlocks.join(", ")}</strong>
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div {...itemAnim(0.95)} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/world">
            <motion.button
              whileHover={prefersReduced ? {} : { scale: 1.03, boxShadow: "0 0 50px rgba(108,99,255,0.55)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full sm:w-auto"
              style={{ padding: "15px 36px", borderRadius: "14px", fontSize: "clamp(14px, 3vw, 16px)" }}
            >
              ← Back to World Map
            </motion.button>
          </Link>
          <Link href="/formula-vault">
            <motion.button
              whileHover={prefersReduced ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost w-full sm:w-auto"
              style={{ padding: "15px 28px", borderRadius: "14px", fontSize: "clamp(13px, 2.5vw, 15px)" }}
            >
              📜 Formula Vault
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function VictoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="font-heading text-lg"
            style={{ color: "var(--accent-gold)" }}
          >
            Calculating your glory...
          </motion.p>
        </div>
      }
    >
      <VictoryContent />
    </Suspense>
  );
}
