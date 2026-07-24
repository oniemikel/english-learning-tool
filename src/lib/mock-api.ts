import { dashboardSummary, mockDecks, mockHistory, mockWords, type Deck, type Word } from '@/lib/mock-data';

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardSummary() {
  await delay();
  return dashboardSummary;
}

export async function listDecks(query?: string) {
  await delay();
  if (!query) return mockDecks;
  const lowered = query.toLowerCase();
  return mockDecks.filter((deck) => deck.name.toLowerCase().includes(lowered));
}

export async function getDeckById(id: string) {
  await delay();
  return mockDecks.find((deck) => deck.id === id) ?? null;
}

export async function createDeck(data: Pick<Deck, 'name' | 'description' | 'isPublic'>) {
  await delay();
  return {
    id: `deck-${Date.now()}`,
    updatedAt: new Date().toISOString(),
    dueCount: 0,
    newCount: 0,
    wordCount: 0,
    ...data,
  } satisfies Deck;
}

export async function listWords(query?: string) {
  await delay();
  if (!query) return mockWords;
  const lowered = query.toLowerCase();
  return mockWords.filter(
    (word) => word.word.toLowerCase().includes(lowered) || word.translation.toLowerCase().includes(lowered),
  );
}

export async function getWordById(id: string) {
  await delay();
  return mockWords.find((word) => word.id === id) ?? null;
}

export async function createWord(data: Pick<Word, 'word' | 'translation' | 'partOfSpeech' | 'deckId'>) {
  await delay();
  return {
    id: `word-${Date.now()}`,
    nextReview: new Date().toISOString(),
    accuracy: 0,
    state: 'ACTIVE',
    definition: '',
    pronunciation: '',
    example: '',
    etymology: '',
    ...data,
  } satisfies Word;
}

export async function listHistory() {
  await delay();
  return mockHistory;
}

export async function getStatistics(range: '7d' | '30d' | '90d') {
  await delay();
  const multiplier = range === '7d' ? 1 : range === '30d' ? 3 : 8;
  return {
    totalReviews: 182 * multiplier,
    totalStudyMinutes: 420 * multiplier,
    accuracy: 79,
    streak: 17,
    trend: [
      { label: 'Mon', value: 22 * multiplier },
      { label: 'Tue', value: 18 * multiplier },
      { label: 'Wed', value: 26 * multiplier },
      { label: 'Thu', value: 19 * multiplier },
      { label: 'Fri', value: 27 * multiplier },
      { label: 'Sat', value: 16 * multiplier },
      { label: 'Sun', value: 29 * multiplier },
    ],
  };
}
