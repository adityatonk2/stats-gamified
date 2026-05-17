"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface FormulaCardProps {
  id: string;
  title: string;
  expression: string;
  rarity: "common" | "rare" | "epic";
  collected: boolean;
}

const RARITY = {
  common: {
    badge: "Common",
    badgeClass: "badge badge-muted",
    expressionColor: "var(--text-secondary)",
    border: "1px solid var(--border-default)",
    glow: "none",
    glowHover: "0 0 16px rgba(255,255,255,0.08)",
  },
  rare: {
    badge: "Rare",
    badgeClass: "badge badge-indigo",
    expressionColor: "var(--text-indigo)",
    border: "1px solid rgba(108,99,255,0.4)",
    glow: "0 0 20px var(--accent-indigo-glow)",
    glowHover: "0 0 30px var(--accent-indigo-glow)",
  },
  epic: {
    badge: "Epic",
    badgeClass: "badge badge-gold",
    expressionColor: "var(--accent-gold)",
    border: "1px solid rgba(245,158,11,0.4)",
    glow: "0 0 24px var(--accent-gold-glow)",
    glowHover: "0 0 36px var(--accent-gold-glow)",
  },
};

export default function FormulaCard({ title, expression, rarity, collected }: FormulaCardProps) {
  const cfg = RARITY[rarity];
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ height: "180px" }}
      onClick={() => collected && setFlipped((f) => !f)}
      onMouseEnter={() => collected && setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div style={{ perspective: "1000px", height: "100%" }}>
        <motion.div
          animate={{ rotateY: flipped && collected ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 rounded-2xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: collected ? "var(--bg-glass)" : "var(--bg-elevated)",
              border: collected ? cfg.border : "1px solid var(--border-subtle)",
              boxShadow: collected ? cfg.glow : "none",
              filter: !collected ? "grayscale(0.8) brightness(0.6)" : "none",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {collected ? (
              <>
                <span className={cfg.badgeClass} style={{ marginBottom: "12px" }}>
                  {cfg.badge}
                </span>
                <p
                  className="font-mono font-bold text-center leading-tight mb-2"
                  style={{
                    fontSize: "clamp(13px, 3vw, 18px)",
                    color: cfg.expressionColor,
                    textShadow: rarity !== "common" ? `0 0 16px ${cfg.expressionColor}` : "none",
                  }}
                >
                  {expression}
                </p>
                <p className="font-heading text-center" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {title}
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-3xl mb-2" style={{ color: "var(--text-muted)" }}>???</p>
                <p className="font-sans text-center" style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  Defeat the guardian<br />to unlock
                </p>
              </>
            )}
          </div>

          {/* Back */}
          {collected && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-4 rounded-2xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: "var(--bg-glass)",
                border: cfg.border,
                boxShadow: cfg.glow,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <p className="font-heading text-center mb-3" style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em" }}>
                COLLECTED
              </p>
              <p
                className="font-mono font-bold text-center"
                style={{
                  fontSize: "clamp(14px, 3vw, 20px)",
                  color: cfg.expressionColor,
                  textShadow: `0 0 20px ${cfg.expressionColor}`,
                }}
              >
                {expression}
              </p>
              <p className="font-sans text-center mt-2" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {title}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
