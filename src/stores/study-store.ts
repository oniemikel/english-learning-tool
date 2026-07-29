'use client';

import { create } from 'zustand';

type StudyMode = 'en-ja' | 'ja-en' | 'listening' | 'pronunciation';
type StudyOrder = 'DUE_ASC' | 'RANDOM' | 'CREATED_DESC';

type StudyStore = {
  deckId: string;
  mode: StudyMode;
  newLimit: number;
  reviewLimit: number;
  order: StudyOrder;
  solved: number;
  correct: number;
  startTime: number;
  setDeckId: (deckId: string) => void;
  setMode: (mode: StudyMode) => void;
  setNewLimit: (limit: number) => void;
  setReviewLimit: (limit: number) => void;
  setOrder: (order: StudyOrder) => void;
  start: () => void;
  answer: (isCorrect: boolean) => void;
  resetProgress: () => void;
  reset: () => void;
};

const initial = {
  deckId: '',
  mode: 'en-ja' as StudyMode,
  newLimit: 20,
  reviewLimit: 100,
  order: 'DUE_ASC' as StudyOrder,
  solved: 0,
  correct: 0,
  startTime: 0,
};

export const useStudyStore = create<StudyStore>((set) => ({
  ...initial,
  setDeckId: (deckId) => set({ deckId }),
  setMode: (mode) => set({ mode }),
  setNewLimit: (newLimit) => set({ newLimit }),
  setReviewLimit: (reviewLimit) => set({ reviewLimit }),
  setOrder: (order) => set({ order }),
  // Start a fresh session while preserving deck/mode/limits.
  start: () => set({ solved: 0, correct: 0, startTime: Date.now() }),
  answer: (isCorrect) =>
    set((state) => ({
      solved: state.solved + 1,
      correct: state.correct + (isCorrect ? 1 : 0),
    })),
  resetProgress: () => set({ solved: 0, correct: 0, startTime: 0 }),
  reset: () => set(initial),
}));
