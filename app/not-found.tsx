"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F0F13] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-7xl mb-6"
      >
        🗺
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display text-3xl text-white mb-3"
      >
        Uncharted Territory
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-sans text-white/40 mb-8 max-w-sm"
      >
        This part of the realm hasn&apos;t been discovered yet. Return to the known world.
      </motion.p>
      <Link href="/">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.04 }}
          className="px-8 py-3 rounded-xl font-display text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6C63FF, #9C8FFF)" }}
        >
          ← Return to StatQuest
        </motion.button>
      </Link>
    </div>
  );
}
