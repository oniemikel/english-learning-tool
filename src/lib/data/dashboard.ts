'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

type StatisticsRange = '7d' | '30d' | '90d';

function getRangeStart(range: StatisticsRange) {
  const now = new Date();
  const start = new Date(now);
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  start.setDate(now.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return start;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getActivity(range: StatisticsRange = '90d') {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view activity.');
  }

  const start = getRangeStart(range);
  const logs = await prisma.studyLog.findMany({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: start,
      },
    },
    select: {
      createdAt: true,
      solved: true,
    },
  });

  const byDay = new Map<string, number>();
  for (const log of logs) {
    const key = toDateKey(log.createdAt);
    byDay.set(key, (byDay.get(key) ?? 0) + log.solved);
  }

  const today = new Date();
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);
    return {
      date: key,
      count: byDay.get(key) ?? 0,
    };
  }).filter((item) => item.date <= toDateKey(today));
}

export async function getStatistics(range: StatisticsRange) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view statistics.');
  }

  const userId = session.user.id;
  const start = getRangeStart(range);

  const logs = await prisma.studyLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: start,
      },
    },
    select: {
      solved: true,
      correct: true,
      minutes: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const totalReviews = logs.reduce((sum, log) => sum + log.solved, 0);
  const totalCorrect = logs.reduce((sum, log) => sum + log.correct, 0);
  const totalStudyMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);
  const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  const activityDays = await prisma.studyLog.groupBy({
    by: ['createdAt'],
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  let streak = 0;
  const distinctDayKeys = new Set(activityDays.map((entry) => toDateKey(entry.createdAt)));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (distinctDayKeys.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const trendByDay = new Map<string, number>();
  for (const log of logs) {
    const key = toDateKey(log.createdAt);
    trendByDay.set(key, (trendByDay.get(key) ?? 0) + log.solved);
  }

  const dayCount = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const trend = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);
    const label = new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(date);
    return {
      label,
      value: trendByDay.get(key) ?? 0,
    };
  });

  return {
    totalReviews,
    totalStudyMinutes,
    accuracy,
    streak,
    trend,
  };
}

export async function getDashboardSummary() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view dashboard data.');
  }

  const userId = session.user.id;

  const [totalDecks, totalWords, dueCount, newCount, activity] = await Promise.all([
    prisma.deck.count({
      where: {
        userId,
        deletedAt: null,
      },
    }),
    prisma.word.count({
      where: {
        decks: {
          some: {
            userId,
            deletedAt: null,
          },
        },
        deletedAt: null,
      },
    }),
    prisma.fSRSState.count({
      where: {
        due: {
          lte: new Date(),
        },
        card: {
          word: {
            decks: {
              some: {
                userId,
                deletedAt: null,
              },
            },
            deletedAt: null,
          },
        },
      },
    }),
    prisma.fSRSState.count({
      where: {
        state: 'NEW',
        card: {
          word: {
            decks: {
              some: {
                userId,
                deletedAt: null,
              },
            },
            deletedAt: null,
          },
        },
      },
    }),
    getActivity('90d'),
  ]);

  return {
    totalDecks,
    totalWords,
    dueCount,
    newCount,
    activity,
  };
}
