'use client';

import { create } from 'zustand';

type StudyMode = 'en-ja' | 'ja-en' | 'listening' | 'pronunciation';

type StudyStore = {
  deckId: string;
  mode: StudyMode;
  newLimit: number;
  reviewLimit: number;
  solved: number;
  correct: number;
  startTime: number;
  setDeckId: (deckId: string) => void;
  setMode: (mode: StudyMode) => void;
  setNewLimit: (limit: number) => void;
  setReviewLimit: (limit: number) => void;
  start: () => void;
  answer: (isCorrect: boolean) => void;
  reset: () => void;
};

const initial = {
  deckId: '',
  mode: 'en-ja' as StudyMode,
  newLimit: 20,
  reviewLimit: 100,
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
  start: () => set({ startTime: Date.now() }),
  answer: (isCorrect) =>
    set((state) => ({
      solved: state.solved + 1,
      correct: state.correct + (isCorrect ? 1 : 0),
    })),
  reset: () => set(initial),
}));
