"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";

const NAV_ITEMS = [
  { href: "/",              icon: "⚔",  label: "Home"   },
  { href: "/world",         icon: "🗺",  label: "World"  },
  { href: "/formula-vault", icon: "📜",  label: "Vault"  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { soundEnabled, toggleSound } = useGameStore();

  // Hide on boss/quiz/learn to not distract during gameplay on mobile
  const hidden = ["/boss/", "/quiz/", "/learn/"].some((p) => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="mx-3 mb-3 rounded-2xl flex items-center justify-around px-2 py-2"
        style={{
          background: "rgba(19, 19, 26, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "var(--accent-indigo-dim)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative text-lg leading-none">{item.icon}</span>
                <span
                  className="relative font-sans text-[10px] font-medium leading-none"
                  style={{ color: isActive ? "var(--text-indigo)" : "var(--text-muted)" }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}

        {/* Sound toggle as 4th tab */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSound}
          className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl"
        >
          <span className="text-lg leading-none">{soundEnabled ? "🔊" : "🔇"}</span>
          <span className="font-sans text-[10px] font-medium leading-none" style={{ color: "var(--text-muted)" }}>
            Sound
          </span>
        </motion.button>
      </div>
    </nav>
  );
}
