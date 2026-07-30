import type {
    FSRSStateType,
    Prisma,
    PrismaClient,
    ReviewRating,
    ReviewMode,
    StudyMode,
    SyncStatus,
  } from '@prisma/client';
  
  export const DEMO_USER_EMAIL = 'demo@example.com';
  export const DEMO_USER_NAME = 'Demo User';
  export const DEMO_PROVIDER_ACCOUNT_ID = 'demo-user';
  
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DEMO_AVATAR_URL = 'https://api.dicebear.com/9.x/identicon/svg?seed=demo-user';
  
  // 🚀 増強パラメータ
  const DEMO_DECK_COUNT = 12;            // 8 -> 12 デッキ
  const DEMO_WORDS_PER_DECK = 100;       // 45 -> 100 単語/デッキ（合計 1200語）
  const DEMO_HISTORY_DAYS = 365;         // 1年分
  const CREATE_MANY_BATCH_SIZE = 1000;
  
  type DbClient = PrismaClient | Prisma.TransactionClient;
  
  type DemoWordSeed = {
    word: string;
    meaning: string;
    pronunciation?: string;
    partOfSpeech?: string;
    sentence: string;
  };
  
  type DemoDeckSeed = {
    title: string;
    description: string;
    color: string;
    icon: string;
    words: DemoWordSeed[];
  };
  
  const DEMO_DECK_BLUEPRINTS = [
    {
      title: 'Daily Conversation Lab',
      description: 'Practical words for real-life communication.',
      color: '#0EA5E9',
      icon: 'MessageCircle',
    },
    {
      title: 'Business Mail Sprint',
      description: 'Vocabulary for concise and polite business writing.',
      color: '#22C55E',
      icon: 'Briefcase',
    },
    {
      title: 'Travel and Culture',
      description: 'Words for airports, hotels, sightseeing, and local life.',
      color: '#F97316',
      icon: 'Plane',
    },
    {
      title: 'Tech Product English',
      description: 'Terms used in product development and software teams.',
      color: '#8B5CF6',
      icon: 'Cpu',
    },
    {
      title: 'Academic Reading Kit',
      description: 'High-frequency words from articles and lecture material.',
      color: '#EF4444',
      icon: 'BookOpen',
    },
    {
      title: 'News and Society',
      description: 'Useful vocabulary for current events and discussions.',
      color: '#EAB308',
      icon: 'Newspaper',
    },
    {
      title: 'Interview and Career',
      description: 'Language for interviews, resumes, and career growth.',
      color: '#14B8A6',
      icon: 'UserRoundSearch',
    },
    {
      title: 'Presentation Booster',
      description: 'Expressions for structured and persuasive presentations.',
      color: '#6366F1',
      icon: 'Presentation',
    },
    {
      title: 'Advanced Science & Tech',
      description: 'Specialized terms for modern engineering and research.',
      color: '#EC4899',
      icon: 'FlaskConical',
    },
    {
      title: 'Finance & Global Markets',
      description: 'Essential terms for economics, trading, and fintech.',
      color: '#10B981',
      icon: 'TrendingUp',
    },
    {
      title: 'Idioms & Natural Phrases',
      description: 'Native-like expressions to level up conversational fluency.',
      color: '#F59E0B',
      icon: 'Sparkles',
    },
    {
      title: 'TOEIC / IELTS High Tier',
      description: 'Targeted vocabulary for standard proficiency exams.',
      color: '#3B82F6',
      icon: 'GraduationCap',
    },
  ] as const;
  
  const POS_LABELS = ['noun', 'verb', 'adjective', 'adverb'];
  const WORD_PREFIXES = [
    'meta', 'ultra', 'quick', 'smart', 'future', 'clear', 'global', 'steady',
    'active', 'bright', 'rapid', 'secure', 'modern', 'simple', 'direct', 'broad',
    'solid', 'daily', 'vivid', 'prime', 'vocal', 'sharp', 'total', 'fresh',
    'deep', 'light', 'bold', 'wise', 'brisk', 'grand', 'hyper', 'cyber',
  ];
  const WORD_STEMS = [
    'scope', 'frame', 'signal', 'bridge', 'cluster', 'focus', 'thread', 'vision',
    'rhythm', 'vector', 'stream', 'pulse', 'anchor', 'canvas', 'path', 'launch',
    'shift', 'spark', 'sample', 'trend', 'trace', 'target', 'driver', 'kernel',
    'dialog', 'format', 'module', 'filter', 'query', 'ledger', 'sector', 'domain',
    'matrix', 'factor', 'climate', 'context', 'intent', 'remark', 'option', 'story',
    'result', 'memory', 'concept', 'insight', 'metric', 'network',
  ];
  const EXAMPLE_CONTEXTS = [
    'team meeting', 'project kickoff', 'language lesson', 'customer support call',
    'study plan', 'weekly review', 'presentation draft', 'product roadmap',
    'travel schedule', 'job interview', 'group discussion', 'class report',
    'feedback session', 'daily routine', 'research summary', 'sprint planning',
    'code review', 'executive briefing', 'market analysis',
  ];
  
  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function pickOne<T>(values: readonly T[]): T {
    return values[randomInt(0, values.length - 1)];
  }
  
  function makeWordToken(deckIndex: number, wordIndex: number) {
    const prefix = pickOne(WORD_PREFIXES);
    const stem = pickOne(WORD_STEMS);
    const serial = String(deckIndex * DEMO_WORDS_PER_DECK + wordIndex + 1).padStart(4, '0');
    return `${prefix}${stem}${serial}`;
  }
  
  function makePronunciation(token: string) {
    const normalized = token.toLowerCase().replace(/[^a-z]/g, '');
    return `/${normalized}/`;
  }
  
  function createDemoWords(deckTitle: string, deckIndex: number): DemoWordSeed[] {
    const words: DemoWordSeed[] = [];
    const used = new Set<string>();
  
    for (let i = 0; i < DEMO_WORDS_PER_DECK; i += 1) {
      let token = makeWordToken(deckIndex, i);
      while (used.has(token)) {
        token = `${makeWordToken(deckIndex, i)}x${randomInt(10, 99)}`;
      }
      used.add(token);
  
      const partOfSpeech = pickOne(POS_LABELS);
      const context = pickOne(EXAMPLE_CONTEXTS);
      const themeWord = deckTitle.split(' ')[0].toLowerCase();
  
      words.push({
        word: token,
        meaning: `A demo ${partOfSpeech} used in ${themeWord} contexts around ${context}.`,
        pronunciation: makePronunciation(token),
        partOfSpeech,
        sentence: `During the ${context}, we used "${token}" to explain a ${themeWord} idea clearly.`,
      });
    }
  
    return words;
  }
  
  function createDemoDecks(): DemoDeckSeed[] {
    return DEMO_DECK_BLUEPRINTS.slice(0, DEMO_DECK_COUNT).map((deck, deckIndex) => ({
      ...deck,
      words: createDemoWords(deck.title, deckIndex),
    }));
  }
  
  function getRandomFsrsState(now: Date): {
    state: FSRSStateType;
    due: Date;
    stability: number;
    difficulty: number;
    reps: number;
    lapses: number;
    lastReview: Date | null;
  } {
    const roll = Math.random();
    const nowMs = now.getTime();
  
    if (roll < 0.5) {
      const reps = randomInt(12, 60);
      const lapses = randomInt(0, 6);
      const lastReviewOffset = randomInt(1, 30) * DAY_MS;
      return {
        state: 'REVIEW',
        due: new Date(nowMs + randomInt(-18, 18) * DAY_MS),
        stability: Number((8 + Math.random() * 42).toFixed(2)),
        difficulty: Number((2.5 + Math.random() * 4.5).toFixed(2)),
        reps,
        lapses,
        lastReview: new Date(nowMs - lastReviewOffset),
      };
    }
  
    if (roll < 0.75) {
      const reps = randomInt(3, 14);
      const lapses = randomInt(0, 3);
      const lastReviewOffset = randomInt(1, 6) * DAY_MS;
      return {
        state: 'LEARNING',
        due: new Date(nowMs + randomInt(-2, 8) * DAY_MS),
        stability: Number((1.2 + Math.random() * 6.3).toFixed(2)),
        difficulty: Number((4.2 + Math.random() * 3.5).toFixed(2)),
        reps,
        lapses,
        lastReview: new Date(nowMs - lastReviewOffset),
      };
    }
  
    if (roll < 0.85) {
      const reps = randomInt(8, 30);
      const lapses = randomInt(1, 8);
      const lastReviewOffset = randomInt(1, 14) * DAY_MS;
      return {
        state: 'RELEARNING',
        due: new Date(nowMs + randomInt(-5, 4) * DAY_MS),
        stability: Number((1.5 + Math.random() * 10).toFixed(2)),
        difficulty: Number((5 + Math.random() * 3).toFixed(2)),
        reps,
        lapses,
        lastReview: new Date(nowMs - lastReviewOffset),
      };
    }
  
    return {
      state: 'NEW',
      due: new Date(nowMs + randomInt(0, 25) * DAY_MS),
      stability: 0,
      difficulty: 0,
      reps: 0,
      lapses: 0,
      lastReview: null,
    };
  }
  
  function getRatingByState(state: FSRSStateType): ReviewRating {
    const roll = Math.random();
  
    if (state === 'NEW') {
      if (roll < 0.22) return 'AGAIN';
      if (roll < 0.47) return 'HARD';
      if (roll < 0.9) return 'GOOD';
      return 'EASY';
    }
  
    if (state === 'LEARNING' || state === 'RELEARNING') {
      if (roll < 0.28) return 'AGAIN';
      if (roll < 0.54) return 'HARD';
      if (roll < 0.93) return 'GOOD';
      return 'EASY';
    }
  
    if (roll < 0.1) return 'HARD';
    if (roll < 0.72) return 'GOOD';
    return 'EASY';
  }
  
  function getRandomStudyMode(): StudyMode {
    const roll = Math.random();
    if (roll < 0.4) return 'EN_JA';
    if (roll < 0.75) return 'JA_EN';
    if (roll < 0.9) return 'LISTENING';
    return 'PRONUNCIATION';
  }
  
  async function createManyInChunks<T extends object>(
    createChunk: (chunk: T[]) => Promise<unknown>,
    rows: T[],
  ) {
    for (let i = 0; i < rows.length; i += CREATE_MANY_BATCH_SIZE) {
      const chunk = rows.slice(i, i + CREATE_MANY_BATCH_SIZE);
      await createChunk(chunk);
    }
  }
  
  async function clearDemoUserData(prisma: DbClient, userId: string) {
    await prisma.reviewLog.deleteMany({ where: { userId } });
    await prisma.dailyStatistic.deleteMany({ where: { userId } });
    await prisma.studyLog.deleteMany({ where: { userId } });
    await prisma.deck.deleteMany({ where: { userId } });
  }
  
  async function seedDemoData(prisma: DbClient, userId: string) {
    const now = new Date();
    const demoDecks = createDemoDecks();
    const createdDecks: { id: string }[] = [];
    const cardStates: Array<{ cardId: string; state: FSRSStateType }> = [];
  
    for (let deckIndex = 0; deckIndex < demoDecks.length; deckIndex += 1) {
      const deckSeed = demoDecks[deckIndex];
      const deck = await prisma.deck.create({
        data: {
          userId,
          title: deckSeed.title,
          description: deckSeed.description,
          color: deckSeed.color,
          icon: deckSeed.icon,
          sortOrder: deckIndex,
          updatedAt: new Date(now.getTime() - randomInt(0, 42) * DAY_MS),
        },
      });
  
      createdDecks.push({ id: deck.id });
  
      for (let localIndex = 0; localIndex < deckSeed.words.length; localIndex += 1) {
        const wordSeed = deckSeed.words[localIndex];
        const stateSeed = getRandomFsrsState(now);
  
        const word = await prisma.word.create({
          data: {
            word: wordSeed.word,
            meaning: wordSeed.meaning,
            pronunciation: wordSeed.pronunciation,
            partOfSpeech: wordSeed.partOfSpeech,
            source: 'demo-seed',
            decks: {
              connect: {
                id: deck.id,
              },
            },
            exampleSentences: {
              create: {
                english: wordSeed.sentence,
                japanese: 'デモ文のため和訳は省略',
                sortOrder: 0,
              },
            },
          },
        });
  
        const card = await prisma.card.create({
          data: {
            wordId: word.id,
            lastStudiedAt: stateSeed.lastReview,
          },
        });
  
        await prisma.fSRSState.create({
          data: {
            cardId: card.id,
            state: stateSeed.state,
            due: stateSeed.due,
            stability: stateSeed.stability,
            difficulty: stateSeed.difficulty,
            reps: stateSeed.reps,
            lapses: stateSeed.lapses,
            lastReview: stateSeed.lastReview,
          },
        });
  
        cardStates.push({ cardId: card.id, state: stateSeed.state });
      }
    }
  
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
  
    const reviewLogs: Prisma.ReviewLogCreateManyInput[] = [];
    const studyLogs: Prisma.StudyLogCreateManyInput[] = [];
    const dailyStats: Prisma.DailyStatisticCreateManyInput[] = [];
  
    // 365日分の履歴を生成
    for (let dayOffset = 0; dayOffset < DEMO_HISTORY_DAYS; dayOffset += 1) {
      const date = new Date(startOfToday.getTime() - dayOffset * DAY_MS);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      // デッキ数・単語数増強に伴い、1日の復習数も現実的なボリューム（20〜80回）へアップ
      const reviewCount = isWeekend ? randomInt(15, 45) : randomInt(25, 80);
  
      let againCount = 0;
      let hardCount = 0;
      let goodOrEasyCount = 0;
  
      for (let i = 0; i < reviewCount; i += 1) {
        const cardState = cardStates[randomInt(0, cardStates.length - 1)];
        const rating = getRatingByState(cardState.state);
        const reviewedAt = new Date(
          date.getTime() +
            randomInt(5, 22) * 60 * 60 * 1000 +
            randomInt(0, 59) * 60 * 1000 +
            randomInt(0, 59) * 1000,
        );
  
        reviewLogs.push({
          userId,
          cardId: cardState.cardId,
          rating,
          reviewMode:
            Math.random() < 0.75
              ? ('NORMAL' satisfies ReviewMode)
              : Math.random() < 0.6
              ? ('RANDOM' satisfies ReviewMode)
              : ('CUSTOM' satisfies ReviewMode),
          responseTime: randomInt(650, 5200),
          reviewedAt,
          syncStatus: 'SYNCED' satisfies SyncStatus,
        });
  
        if (rating === 'AGAIN') {
          againCount += 1;
        } else if (rating === 'HARD') {
          hardCount += 1;
        } else {
          goodOrEasyCount += 1;
        }
      }
  
      const incorrectCount = againCount + Math.floor(hardCount * 0.5);
      const correctCount = Math.max(0, reviewCount - incorrectCount);
      const studyTime = Math.max(10, Math.round(reviewCount * randomInt(45, 95) * 0.01));
  
      dailyStats.push({
        userId,
        date,
        reviewCount,
        studyTime,
        correctCount,
        incorrectCount,
        accuracyRate: Number(((correctCount / reviewCount) * 100).toFixed(2)),
        syncStatus: 'SYNCED',
      });
  
      const sessionCount = reviewCount < 25 ? 1 : reviewCount < 50 ? 2 : 3;
      for (let sessionIndex = 0; sessionIndex < sessionCount; sessionIndex += 1) {
        const solved = Math.max(8, Math.round(reviewCount / sessionCount + randomInt(-3, 8)));
        const correct = Math.max(0, Math.min(solved, solved - randomInt(0, Math.min(5, solved - 1))));
        const createdAt = new Date(
          date.getTime() + randomInt(6, 23) * 60 * 60 * 1000 + randomInt(0, 59) * 60 * 1000,
        );
  
        studyLogs.push({
          userId,
          deckId: createdDecks[randomInt(0, createdDecks.length - 1)].id,
          mode: getRandomStudyMode(),
          solved,
          correct,
          accuracy: Number(((correct / solved) * 100).toFixed(2)),
          minutes: randomInt(10, 50),
          createdAt,
        });
      }
    }
  
    // チャンク分割してDBへ高速挿入
    await createManyInChunks(
      (chunk) => prisma.reviewLog.createMany({ data: chunk }),
      reviewLogs,
    );
    await createManyInChunks(
      (chunk) => prisma.studyLog.createMany({ data: chunk }),
      studyLogs,
    );
    await createManyInChunks(
      (chunk) => prisma.dailyStatistic.createMany({ data: chunk, skipDuplicates: true }),
      dailyStats,
    );
  }
  
  export async function ensureDemoUserData(prisma: DbClient) {
    const user = await prisma.user.upsert({
      where: { email: DEMO_USER_EMAIL },
      update: {
        displayName: DEMO_USER_NAME,
        avatarUrl: DEMO_AVATAR_URL,
        deletedAt: null,
        authProvider: 'GOOGLE',
        providerAccountId: DEMO_PROVIDER_ACCOUNT_ID,
      },
      create: {
        email: DEMO_USER_EMAIL,
        displayName: DEMO_USER_NAME,
        avatarUrl: DEMO_AVATAR_URL,
        authProvider: 'GOOGLE',
        providerAccountId: DEMO_PROVIDER_ACCOUNT_ID,
      },
    });
  
    await prisma.userSetting.upsert({
      where: { userId: user.id },
      update: {
        dailyNewCards: 30,
        maximumReviews: 300,
        enableSound: true,
        enableSpeech: true,
        language: 'JA',
        theme: 'SYSTEM',
      },
      create: {
        userId: user.id,
        dailyNewCards: 30,
        maximumReviews: 300,
        enableSound: true,
        enableSpeech: true,
        language: 'JA',
        theme: 'SYSTEM',
      },
    });
  
    const [deckCount, wordCount, historyCount] = await Promise.all([
      prisma.deck.count({ where: { userId: user.id } }),
      prisma.word.count({
        where: {
          decks: {
            some: {
              userId: user.id,
            },
          },
        },
      }),
      prisma.dailyStatistic.count({ where: { userId: user.id } }),
    ]);
  
    // 新しい閾値（10デッキ以上、1000語以上、300日分以上のデータ）
    const hasMinimumDemoDataset =
      deckCount >= 10 &&
      wordCount >= 1000 &&
      historyCount >= 300;
  
    if (!hasMinimumDemoDataset) {
      await clearDemoUserData(prisma, user.id);
      await seedDemoData(prisma, user.id);
    }
  
    return user;
  }
  
  export async function reseedDemoUserData(prisma: DbClient) {
    const user = await ensureDemoUserData(prisma);
    await clearDemoUserData(prisma, user.id);
    await seedDemoData(prisma, user.id);
    return user;
  }