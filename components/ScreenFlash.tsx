"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, createContext, useContext, useCallback } from "react";

type FlashType = "correct" | "wrong" | "levelup";

interface ScreenFlashContextType {
  flash: (type: FlashType) => void;
}

const ScreenFlashContext = createContext<ScreenFlashContextType>({ flash: () => {} });

export function useScreenFlash() {
  return useContext(ScreenFlashContext);
}

const FLASH_CONFIG: Record<FlashType, { color: string; duration: number }> = {
  correct: { color: "rgba(16, 185, 129, 0.08)",  duration: 120 },
  wrong:   { color: "rgba(244, 63, 94, 0.10)",   duration: 150 },
  levelup: { color: "rgba(245, 158, 11, 0.15)",  duration: 500 },
};

export function ScreenFlashProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<{ type: FlashType; key: number } | null>(null);

  const flash = useCallback((type: FlashType) => {
    const key = Date.now();
    setActive({ type, key });
    setTimeout(() => setActive(null), FLASH_CONFIG[type].duration + 100);
  }, []);

  return (
    <ScreenFlashContext.Provider value={{ flash }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.key}
            className="screen-flash"
            style={{ background: FLASH_CONFIG[active.type].color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FLASH_CONFIG[active.type].duration / 1000 / 2 }}
          />
        )}
      </AnimatePresence>
    </ScreenFlashContext.Provider>
  );
}
