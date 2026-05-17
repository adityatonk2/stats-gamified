"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, createContext, useContext, useCallback } from "react";

export type ToastVariant = "xp-gain" | "level-up" | "unlock" | "streak" | "formula";

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
  subtext?: string;
}

interface ToastContextType {
  showToast: (variant: ToastVariant, message: string, subtext?: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: string; cardClass: string; titleColor: string; size: "normal" | "large" }
> = {
  "xp-gain":  { icon: "✦",  cardClass: "glass-card-gold",   titleColor: "var(--accent-gold)",    size: "normal" },
  "level-up": { icon: "▲",  cardClass: "glass-card-indigo", titleColor: "var(--text-indigo)",    size: "large"  },
  "unlock":   { icon: "🔓", cardClass: "glass-card-emerald",titleColor: "var(--accent-emerald)", size: "normal" },
  "streak":   { icon: "🔥", cardClass: "glass-card-gold",   titleColor: "var(--accent-gold)",    size: "normal" },
  "formula":  { icon: "📜", cardClass: "glass-card-indigo", titleColor: "var(--text-indigo)",    size: "normal" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const cfg = VARIANT_CONFIG[toast.variant];
  const prefersReduced = useReducedMotion();
  const isLarge = cfg.size === "large";

  return (
    <motion.div
      layout
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 80, scale: 0.9 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onClick={onDismiss}
      className={`${cfg.cardClass} cursor-pointer select-none`}
      style={{ width: isLarge ? "320px" : "280px" }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border-default)",
          }}
        >
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-sans font-semibold leading-snug ${isLarge ? "text-base" : "text-sm"}`}
            style={{ color: cfg.titleColor }}
          >
            {toast.message}
          </p>
          {toast.subtext && (
            <p className="font-sans text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {toast.subtext}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((variant: ToastVariant, message: string, subtext?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-2), { id, variant, message, subtext }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed z-[60] flex flex-col gap-2 pointer-events-none"
        style={{
          bottom: "max(80px, calc(64px + env(safe-area-inset-bottom)))",
          right: "16px",
          left: "auto",
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem
                toast={toast}
                onDismiss={() => setToasts((p) => p.filter((t) => t.id !== toast.id))}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
