// src/lib/mock-data.ts
import { type Icon } from '@/components/icons';

export const DUMMY_USER = {
  name: 'Emma Larson',
  email: 'emma@mail.com',
  avatar: 'EL',
  streak: 14,
  personalBest: 21,
};

export const SIDEBAR_NAV_ITEMS: {
  learn: { label: string; href: string; icon: Icon; badge?: number }[];
  account: { label: string; href: string; icon: Icon }[];
} = {
  learn: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'Dashboard',
    },
    {
      label: 'My Decks',
      href: '/decks',
      icon: 'Decks',
      badge: 4,
    },
    {
      label: 'Vocabulary',
      href: '/words',
      icon: 'Vocabulary',
    },
    {
      label: 'Progress',
      href: '/statistics',
      icon: 'Progress',
    },
    {
      label: 'Goals',
      href: '/goals',
      icon: 'Goals',
    },
    {
      label: 'Bookmarks',
      href: '/bookmarks',
      icon: 'Bookmarks',
    },
  ],
  account: [
    {
      label: 'Settings',
      href: '/settings',
      icon: 'Settings',
    },
  ],
};

export const DASHBOARD_DATA = {
  welcome: {
    name: 'Emma',
    cardsDue: 44,
  },
  todayProgress: {
    wordsLearned: 47,
    totalWords: 60,
    reviewed: 112,
    correct: 91,
    new: 12,
  },
  studyGoals: {
    dailyWords: { current: 47, goal: 60 },
    weeklyStreak: { current: 7, goal: 7 },
    deckMastery: { current: 3, goal: 4 },
  },
  stats: {
    wordsLearned: { value: '1,284', change: '+47 today' },
    accuracy: { value: '91.3%', change: '+2.1% this week' },
    studyTime: { value: '38h', change: 'This month' },
    streak: { value: '14 days', change: 'Personal best: 21' },
  },
  recentDecks: [
    {
      id: '1',
      emoji: '📚',
      title: 'Academic Vocabulary',
      subtitle: 'IELTS Preparation',
      tag: 'IELTS',
      mastered: 87,
      total: 120,
      due: 24,
    },
    {
      id: '2',
      emoji: '💼',
      title: 'Business English',
      subtitle: 'Workplace & Meetings',
      tag: 'Professional',
      mastered: 54,
      total: 80,
      due: 12,
    },
    {
      id: '3',
      emoji: '🗣️',
      title: 'Phrasal Verbs',
      subtitle: 'Everyday Conversational',
      tag: 'Conversational',
      mastered: 41,
      total: 60,
      due: 8,
    },
    {
      id: '4',
      emoji: '✍️',
      title: 'Literary Terms',
      subtitle: 'SAT / AP English',
      tag: 'Academic',
      mastered: 45,
      total: 45,
      due: 0,
    },
  ],
  weeklyActivity: {
    totalWords: 287,
    change: '+18%',
    data: [
      { day: 'Mon', words: 30 },
      { day: 'Tue', words: 45 },
      { day: 'Wed', words: 25 },
      { day: 'Thu', words: 60 },
      { day: 'Fri', words: 40 },
      { day: 'Sat', words: 75 },
      { day: 'Sun', words: 20 },
    ],
  },
};
