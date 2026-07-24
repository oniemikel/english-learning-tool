'use client';

import { create } from 'zustand';

type StudyMode = 'en-ja' | 'ja-en' | 'listening' | 'pronunciation';

type StudyStore = {
  deckId: string;
  mode: StudyMode;
  solved: number;
  correct: number;
  setDeckId: (deckId: string) => void;
  setMode: (mode: StudyMode) => void;
  answer: (isCorrect: boolean) => void;
  reset: () => void;
};

const initial = {
  deckId: 'deck-1',
  mode: 'en-ja' as StudyMode,
  solved: 0,
  correct: 0,
};

export const useStudyStore = create<StudyStore>((set) => ({
  ...initial,
  setDeckId: (deckId) => set({ deckId }),
  setMode: (mode) => set({ mode }),
  answer: (isCorrect) =>
    set((state) => ({
      solved: state.solved + 1,
      correct: state.correct + (isCorrect ? 1 : 0),
    })),
  reset: () => set(initial),
}));
