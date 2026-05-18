"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuizHistoryEntry {
  topic: string;
  score: number;
  date: string;
}

interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  completedTopics: string[];
  unlockedTopics: string[];
  formulaCardsCollected: string[];
  soundEnabled: boolean;
  quizHistory: QuizHistoryEntry[];

  // Actions
  addXP: (amount: number) => void;
  completeTopic: (topicId: string) => void;
  unlockTopic: (topicId: string) => void;
  collectFormulaCard: (cardId: string) => void;
  recordQuiz: (entry: QuizHistoryEntry) => void;
  updateStreak: () => void;
  toggleSound: () => void;
  resetProgress: () => void;
}

const XP_PER_LEVEL = 200;
const FIRST_TOPIC = "mean";

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

// Ensure the first topic is always unlocked regardless of stored state
function ensureFirstTopicUnlocked(topics: string[]): string[] {
  if (!Array.isArray(topics) || topics.length === 0) return [FIRST_TOPIC];
  if (!topics.includes(FIRST_TOPIC)) return [FIRST_TOPIC, ...topics];
  return topics;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: "",
      completedTopics: [],
      unlockedTopics: [FIRST_TOPIC],
      formulaCardsCollected: [],
      soundEnabled: false,
      quizHistory: [],

      addXP: (amount) => {
        const newXP = get().xp + amount;
        set({ xp: newXP, level: calculateLevel(newXP) });
      },

      completeTopic: (topicId) => {
        const { completedTopics } = get();
        if (!completedTopics.includes(topicId)) {
          set({ completedTopics: [...completedTopics, topicId] });
        }
      },

      unlockTopic: (topicId) => {
        const { unlockedTopics } = get();
        if (!unlockedTopics.includes(topicId)) {
          set({ unlockedTopics: [...unlockedTopics, topicId] });
        }
      },

      collectFormulaCard: (cardId) => {
        const { formulaCardsCollected } = get();
        if (!formulaCardsCollected.includes(cardId)) {
          set({ formulaCardsCollected: [...formulaCardsCollected, cardId] });
        }
      },

      recordQuiz: (entry) => {
        const { quizHistory } = get();
        set({ quizHistory: [...quizHistory, entry] });
      },

      updateStreak: () => {
        const { lastStudyDate, streak } = get();
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        if (lastStudyDate === today) return;
        if (lastStudyDate === yesterday) {
          set({ streak: streak + 1, lastStudyDate: today });
        } else {
          set({ streak: 1, lastStudyDate: today });
        }
      },

      toggleSound: () => {
        set({ soundEnabled: !get().soundEnabled });
      },

      resetProgress: () => {
        set({
          xp: 0,
          level: 1,
          streak: 0,
          lastStudyDate: "",
          completedTopics: [],
          unlockedTopics: [FIRST_TOPIC],
          formulaCardsCollected: [],
          quizHistory: [],
        });
      },
    }),
    {
      name: "statquest-game-storage",
      // Merge stored state with defaults; guards against corrupted/partial storage
      merge: (persisted, current) => {
        const stored = persisted as Partial<GameState>;
        return {
          ...current,
          ...stored,
          // Always ensure first topic is unlocked, even if storage is corrupted
          unlockedTopics: ensureFirstTopicUnlocked(
            Array.isArray(stored.unlockedTopics) ? stored.unlockedTopics : []
          ),
          // Ensure arrays are never undefined from corrupted storage
          completedTopics: Array.isArray(stored.completedTopics) ? stored.completedTopics : [],
          formulaCardsCollected: Array.isArray(stored.formulaCardsCollected) ? stored.formulaCardsCollected : [],
          quizHistory: Array.isArray(stored.quizHistory) ? stored.quizHistory : [],
        };
      },
    }
  )
);
