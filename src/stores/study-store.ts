'use client';

import { create } from 'zustand';
import {
  type StudyFsrsRating,
  type BinaryCorrectMapping,
  DEFAULT_ASSESSMENT_MODE,
  DEFAULT_BINARY_CORRECT_MAPPING,
  type StudyAssessmentMode,
} from '@/lib/study-rating';

export type StudyMode = 'en-ja' | 'ja-en' | 'listening' | 'pronunciation';
export type StudyOrder = 'DUE_ASC' | 'RANDOM' | 'CREATED_DESC';
export type StudyInputMethod = 'SELF_EVALUATION' | 'TYPING';
export type StudyRatingCounts = Record<StudyFsrsRating, number>;

const initialRatingCounts: StudyRatingCounts = {
  again: 0,
  hard: 0,
  good: 0,
  easy: 0,
};

export function getEffectiveInputMethod(mode: StudyMode, requested: StudyInputMethod): StudyInputMethod {
  if (mode === 'en-ja') {
    return 'SELF_EVALUATION';
  }

  if (mode === 'ja-en') {
    return requested;
  }

  return 'SELF_EVALUATION';
}

type StudyStore = {
  deckId: string;
  mode: StudyMode;
  inputMethod: StudyInputMethod;
  assessmentMode: StudyAssessmentMode;
  binaryCorrectMapping: BinaryCorrectMapping;
  newLimit: number;
  reviewLimit: number;
  order: StudyOrder;
  solved: number;
  correct: number;
  ratingCounts: StudyRatingCounts;
  startTime: number;
  setDeckId: (deckId: string) => void;
  setMode: (mode: StudyMode) => void;
  setInputMethod: (inputMethod: StudyInputMethod) => void;
  setAssessmentMode: (assessmentMode: StudyAssessmentMode) => void;
  setBinaryCorrectMapping: (mapping: BinaryCorrectMapping) => void;
  setNewLimit: (limit: number) => void;
  setReviewLimit: (limit: number) => void;
  setOrder: (order: StudyOrder) => void;
  start: () => void;
  answer: (isCorrect: boolean, rating: StudyFsrsRating) => void;
  resetProgress: () => void;
  reset: () => void;
};

const initial = {
  deckId: '',
  mode: 'en-ja' as StudyMode,
  inputMethod: 'SELF_EVALUATION' as StudyInputMethod,
  assessmentMode: DEFAULT_ASSESSMENT_MODE,
  binaryCorrectMapping: DEFAULT_BINARY_CORRECT_MAPPING,
  newLimit: 20,
  reviewLimit: 100,
  order: 'DUE_ASC' as StudyOrder,
  solved: 0,
  correct: 0,
  ratingCounts: initialRatingCounts,
  startTime: 0,
};

export const useStudyStore = create<StudyStore>((set) => ({
  ...initial,
  setDeckId: (deckId) => set({ deckId }),
  setMode: (mode) =>
    set((state) => ({
      mode,
      inputMethod: getEffectiveInputMethod(mode, state.inputMethod),
    })),
  setInputMethod: (inputMethod) =>
    set((state) => ({
      inputMethod: getEffectiveInputMethod(state.mode, inputMethod),
    })),
  setAssessmentMode: (assessmentMode) => set({ assessmentMode }),
  setBinaryCorrectMapping: (binaryCorrectMapping) =>
    set({ binaryCorrectMapping }),
  setNewLimit: (newLimit) => set({ newLimit }),
  setReviewLimit: (reviewLimit) => set({ reviewLimit }),
  setOrder: (order) => set({ order }),
  // Start a fresh session while preserving deck/mode/limits.
  start: () =>
    set({
      solved: 0,
      correct: 0,
      ratingCounts: { ...initialRatingCounts },
      startTime: Date.now(),
    }),
  answer: (isCorrect, rating) =>
    set((state) => ({
      solved: state.solved + 1,
      correct: state.correct + (isCorrect ? 1 : 0),
      ratingCounts: {
        ...state.ratingCounts,
        [rating]: state.ratingCounts[rating] + 1,
      },
    })),
  resetProgress: () =>
    set({
      solved: 0,
      correct: 0,
      ratingCounts: { ...initialRatingCounts },
      startTime: 0,
    }),
  reset: () => set(initial),
}));
