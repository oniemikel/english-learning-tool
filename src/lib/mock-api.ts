import { dashboardSummary, mockDecks, mockHistory, mockWords, type Deck, type Word } from '@/lib/mock-data';

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

function generateActivityData() {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 15),
    });
  }
  return data;
}
dashboardSummary.activity = generateActivityData();

export async function getDashboardSummary() {
  await delay();
  return dashboardSummary;
}

export async function listDecks(options: { query?: string; limit?: number } = {}) {
  await delay();
  let result = mockDecks;
  if (options.query) {
    const lowered = options.query.toLowerCase();
    result = mockDecks.filter((deck) => deck.name.toLowerCase().includes(lowered));
  }
  if (options.limit) {
    result = result.slice(0, options.limit);
  }
  return result;
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
    progress: 0,
    ...data,
  } satisfies Deck;
}

export async function listWords(options: { query?: string; deckId?: string; limit?: number } = {}) {
  await delay();
  let result = mockWords;

  if (options.deckId) {
    result = result.filter((word) => word.deckId === options.deckId);
  }

  if (options.query) {
    const lowered = options.query.toLowerCase();
    result = result.filter(
      (word) => word.word.toLowerCase().includes(lowered) || word.translation.toLowerCase().includes(lowered),
    );
  }

  if (options.limit) {
    result = result.slice(0, options.limit);
  }

  return result;
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

export async function listHistory(options: { limit?: number } = {}) {
  await delay();
  let result = mockHistory;
  if (options.limit) {
    result = result.slice(0, options.limit);
  }
  return result;
}

export async function getActivity() {
  await delay();
  return generateActivityData();
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
