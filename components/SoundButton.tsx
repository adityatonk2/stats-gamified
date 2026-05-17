"use client";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";

export default function SoundButton() {
  const { soundEnabled, toggleSound } = useGameStore();

  return (
    <motion.button
      onClick={toggleSound}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors duration-200"
      style={{
        background: "var(--bg-glass)",
        border: "1px solid var(--border-default)",
        color: soundEnabled ? "var(--text-indigo)" : "var(--text-muted)",
        backdropFilter: "blur(12px)",
      }}
      title={soundEnabled ? "Mute sounds" : "Enable sounds"}
    >
      <motion.span
        key={soundEnabled ? "on" : "off"}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {soundEnabled ? "🔊" : "🔇"}
      </motion.span>
    </motion.button>
  );
}
