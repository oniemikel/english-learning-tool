
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function getDashboardPageData() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalDecks,
    totalWords,
    wordsToReview,
    newWords,
    todayStats,
    userSettings,
    newWordsStudiedToday,
    weeklyStats,
    allDecks,
    recentHistory,
    reviewsWidget,
    ] = await Promise.all([
    prisma.deck.count({ where: { userId, deletedAt: null } }),
    prisma.word.count({ where: { deck: { userId }, deletedAt: null } }),
    prisma.fSRSState.count({
      where: {
        card: { word: { deck: { userId } } },
        due: { lte: now },
        state: { not: 'NEW' },
      },
    }),
    prisma.fSRSState.count({
      where: {
        card: { word: { deck: { userId } } },
        state: 'NEW',
      },
    }),
    prisma.dailyStatistic.findUnique({
      where: { userId_date: { userId, date: today } },
    }),
    prisma.userSetting.findUnique({ where: { userId } }),
    prisma.reviewLog.count({
      where: {
        userId,
        reviewedAt: { gte: today, lt: tomorrow },
        card: { fsrsState: { state: 'NEW' } },
      },
    }),
    getWeeklyStats(userId),
    prisma.deck.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        _count: {
          select: { words: true },
        },
      },
    }),
    prisma.reviewLog.findMany({
      where: { userId },
      orderBy: { reviewedAt: 'desc' },
      take: 5,
      select: {
        card: {
          select: {
            word: {
              select: {
                word: true,
              },
            },
          },
        },
        rating: true,
        reviewedAt: true,
      },
    }),
    getReviewsWidgetData(userId),
    ]);

    const recentDecks = allDecks.slice(0, 5).map(deck => ({
    id: deck.id,
    title: deck.title,
    wordCount: deck._count.words,
    }));

    const deckQuickView = allDecks.map(deck => ({
    id: deck.id,
    title: deck.title,
    wordCount: deck._count.words,
    }));

    const formattedRecentHistory = recentHistory.map(log => ({
    word: log.card.word.word,
    rating: log.rating,
    reviewedAt: log.reviewedAt,
    }));

    return {
    user: {
      name: session.user.name || 'User',
    },
    stats: {
      totalDecks,
      totalWords,
      wordsToReview,
      newWords,
    },
    todayProgress: {
      newWords: newWordsStudiedToday,
      reviews: todayStats?.reviewCount || 0,
      target: userSettings?.dailyNewCards || 100,
    },
    studyGoals: weeklyStats.map(stat => ({
      day: new Date(stat.date).toLocaleString('en-US', { weekday: 'short' })[0],
      progress: stat.reviewCount,
    })),
    recentDecks,
    weeklyActivity: {
      labels: weeklyStats.map(stat =>
        new Date(stat.date).toLocaleString('en-US', { weekday: 'short' })
      ),
      series: [weeklyStats.map(stat => stat.reviewCount)],
    },
    deckQuickView,
    recentHistory: formattedRecentHistory,
    reviewsWidget,
    };
    }

    async function getReviewsWidgetData(userId: string) {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const [dueToday, dueSoon, overdue] = await Promise.all([
    prisma.fSRSState.count({
      where: {
        card: { word: { deck: { userId } } },
        due: { lte: now },
      },
    }),
    prisma.fSRSState.count({
      where: {
        card: { word: { deck: { userId } } },
        due: {
          gt: now,
          lte: sevenDaysFromNow,
        },
      },
    }),
    prisma.fSRSState.count({
      where: {
        card: { word: { deck: { userId } } },
        due: { lt: today },
      },
    }),
    ]);

    return {
    dueToday,
    dueSoon,
    overdue,
    };
    }

    async function getWeeklyStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyStats = await prisma.dailyStatistic.findMany({
    where: {
      userId,
      date: {
        gte: sevenDaysAgo,
        lte: today,
      },
    },
    orderBy: {
      date: 'asc',
    },
    });

    const statsMap = new Map(weeklyStats.map(stat => [new Date(stat.date).toISOString().split('T')[0], stat]));
    const result = [];

    for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    if (statsMap.has(dateString)) {
      result.push(statsMap.get(dateString)!);
    } else {
      result.push({
        id: '',
        userId,
        date,
        reviewCount: 0,
        studyTime: 0,
        correctCount: 0,
        incorrectCount: 0,
        accuracyRate: 0,
        syncStatus: 'SYNCED',
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    }

    return result;
    }


