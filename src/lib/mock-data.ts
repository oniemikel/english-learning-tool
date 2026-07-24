export type Deck = {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  dueCount: number;
  newCount: number;
  isPublic: boolean;
  updatedAt: string;
};

export type Word = {
  id: string;
  deckId: string;
  word: string;
  translation: string;
  partOfSpeech: string;
  nextReview: string;
  accuracy: number;
  state: 'ACTIVE' | 'EXCLUDED';
  definition: string;
  pronunciation: string;
  example: string;
  etymology: string;
};

export type History = {
  id: string;
  deckName: string;
  mode: 'EN_JA' | 'JA_EN' | 'LISTENING' | 'PRONUNCIATION';
  solved: number;
  accuracy: number;
  minutes: number;
  createdAt: string;
};

export const mockDecks: Deck[] = [
  {
    id: 'deck-1',
    name: 'TOEIC 600 Core',
    description: '頻出語を短時間で反復するデッキ。',
    wordCount: 180,
    dueCount: 28,
    newCount: 15,
    isPublic: true,
    updatedAt: '2026-07-24T20:10:00+09:00',
  },
  {
    id: 'deck-2',
    name: 'Business Collocations',
    description: '会議・報告で使う連語表現。',
    wordCount: 96,
    dueCount: 9,
    newCount: 7,
    isPublic: false,
    updatedAt: '2026-07-24T09:30:00+09:00',
  },
  {
    id: 'deck-3',
    name: 'Daily Conversation',
    description: '日常会話向けの語彙と例文。',
    wordCount: 132,
    dueCount: 21,
    newCount: 11,
    isPublic: true,
    updatedAt: '2026-07-23T18:05:00+09:00',
  },
];

export const mockWords: Word[] = [
  {
    id: 'word-1',
    deckId: 'deck-1',
    word: 'allocate',
    translation: '割り当てる',
    partOfSpeech: 'VERB',
    nextReview: '2026-07-26T09:00:00+09:00',
    accuracy: 74,
    state: 'ACTIVE',
    definition: 'to officially give something to someone',
    pronunciation: '/ˈæləkeɪt/',
    example: 'We need to allocate time for review.',
    etymology: 'from Latin allocare',
  },
  {
    id: 'word-2',
    deckId: 'deck-2',
    word: 'feasible',
    translation: '実現可能な',
    partOfSpeech: 'ADJECTIVE',
    nextReview: '2026-07-25T19:30:00+09:00',
    accuracy: 68,
    state: 'ACTIVE',
    definition: 'possible and practical to do',
    pronunciation: '/ˈfiːzəbəl/',
    example: 'The timeline is feasible with two engineers.',
    etymology: 'from French faisable',
  },
  {
    id: 'word-3',
    deckId: 'deck-3',
    word: 'commute',
    translation: '通勤する',
    partOfSpeech: 'VERB',
    nextReview: '2026-07-26T07:45:00+09:00',
    accuracy: 84,
    state: 'EXCLUDED',
    definition: 'to travel regularly between work and home',
    pronunciation: '/kəˈmjuːt/',
    example: 'I commute by train every morning.',
    etymology: 'from Latin commutare',
  },
];

export const mockHistory: History[] = [
  {
    id: 'history-1',
    deckName: 'TOEIC 600 Core',
    mode: 'EN_JA',
    solved: 34,
    accuracy: 82,
    minutes: 22,
    createdAt: '2026-07-24T21:40:00+09:00',
  },
  {
    id: 'history-2',
    deckName: 'Business Collocations',
    mode: 'JA_EN',
    solved: 18,
    accuracy: 66,
    minutes: 15,
    createdAt: '2026-07-24T08:20:00+09:00',
  },
  {
    id: 'history-3',
    deckName: 'Daily Conversation',
    mode: 'LISTENING',
    solved: 20,
    accuracy: 75,
    minutes: 17,
    createdAt: '2026-07-23T22:05:00+09:00',
  },
];

export const dashboardSummary = {
  dueCount: 58,
  newCount: 33,
  learnedToday: 52,
  streakDays: 17,
  reviewAccuracy: 79,
};
