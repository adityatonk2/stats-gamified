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

const DEFAULT_UNLOCKED = ["mean"];

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: "",
      completedTopics: [],
      unlockedTopics: DEFAULT_UNLOCKED,
      formulaCardsCollected: [],
      soundEnabled: false,
      quizHistory: [],

      addXP: (amount) => {
        const newXP = get().xp + amount;
        const newLevel = calculateLevel(newXP);
        set({ xp: newXP, level: newLevel });
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
          unlockedTopics: DEFAULT_UNLOCKED,
          formulaCardsCollected: [],
          quizHistory: [],
        });
      },
    }),
    {
      name: "statquest-game-storage",
    }
  )
);
