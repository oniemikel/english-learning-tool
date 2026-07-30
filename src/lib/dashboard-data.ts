import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const DASHBOARD_TIME_ZONE = 'Asia/Tokyo';

type CalendarDateParts = {
  year: number;
  month: number;
  day: number;
};

type WeeklyStatPoint = {
  reviewCount: number;
  weekdayLabel: string;
  weekdayInitial: string;
};

function toDateKey(parts: CalendarDateParts) {
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

function getDatePartsInTimeZone(date: Date, timeZone: string): CalendarDateParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const day = Number(parts.find((part) => part.type === 'day')?.value);

  if (!year || !month || !day) {
    throw new Error(`Failed to resolve date parts for time zone: ${timeZone}`);
  }

  return { year, month, day };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const timeZoneName = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value;

  const match = timeZoneName?.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) {
    return 0;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? '0');

  return sign * ((hours * 60 + minutes) * 60 * 1000);
}

function getStartOfDayUtc(parts: CalendarDateParts, timeZone: string) {
  const utcMidnight = Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0, 0);
  const offsetMs = getTimeZoneOffsetMs(new Date(utcMidnight), timeZone);
  return new Date(utcMidnight - offsetMs);
}

function addDays(parts: CalendarDateParts, days: number): CalendarDateParts {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  date.setUTCDate(date.getUTCDate() + days);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function getDayRangeUtc(date: Date, timeZone: string) {
  const parts = getDatePartsInTimeZone(date, timeZone);
  const nextParts = addDays(parts, 1);
  return {
    start: getStartOfDayUtc(parts, timeZone),
    end: getStartOfDayUtc(nextParts, timeZone),
  };
}

function getRecentDayParts(timeZone: string, days: number) {
  const todayParts = getDatePartsInTimeZone(new Date(), timeZone);
  const startParts = addDays(todayParts, -(days - 1));

  return Array.from({ length: days }, (_, index) => addDays(startParts, index));
}

export async function getDashboardPageData() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const now = new Date();
  const todayRange = getDayRangeUtc(now, DASHBOARD_TIME_ZONE);

  const [
    totalDecks,
    totalWords,
    wordsToReview,
    newWords,
    todayReviewCount,
    userSettings,
    newWordsStudiedToday,
    weeklyStats,
    allDecks,
    recentHistory,
    reviewsWidget,
  ] = await Promise.all([
    prisma.deck.count({ where: { userId, deletedAt: null } }),
    prisma.word.count({
      where: {
        deletedAt: null,
        decks: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
    }),
    prisma.fSRSState.count({
      where: {
        card: {
          word: {
            deletedAt: null,
            decks: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        },
        due: { lte: now },
        state: { not: 'NEW' },
      },
    }),
    prisma.fSRSState.count({
      where: {
        card: {
          word: {
            deletedAt: null,
            decks: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        },
        state: 'NEW',
      },
    }),
    prisma.reviewLog.count({
      where: {
        userId,
        reviewedAt: {
          gte: todayRange.start,
          lt: todayRange.end,
        },
      },
    }),
    prisma.userSetting.findUnique({ where: { userId } }),
    prisma.reviewLog.count({
      where: {
        userId,
        reviewedAt: { gte: todayRange.start, lt: todayRange.end },
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

  const recentDecks = allDecks.slice(0, 5).map((deck) => ({
    id: deck.id,
    title: deck.title,
    wordCount: deck._count.words,
  }));

  const deckQuickView = allDecks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    wordCount: deck._count.words,
  }));

  const formattedRecentHistory = recentHistory.map((log) => ({
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
      reviews: todayReviewCount,
      target: userSettings?.dailyNewCards || 100,
    },
    studyGoals: weeklyStats.map((stat) => ({
      day: stat.weekdayLabel+".",
      // day: stat.weekdayInitial,
      progress: stat.reviewCount,
    })),
    recentDecks,
    weeklyActivity: {
      labels: weeklyStats.map((stat) => stat.weekdayLabel),
      series: [weeklyStats.map((stat) => stat.reviewCount)],
    },
    deckQuickView,
    recentHistory: formattedRecentHistory,
    reviewsWidget,
  };
}

async function getReviewsWidgetData(userId: string) {
  const now = new Date();
  const todayRange = getDayRangeUtc(now, DASHBOARD_TIME_ZONE);

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const [dueToday, dueSoon, overdue] = await Promise.all([
    prisma.fSRSState.count({
      where: {
        card: {
          word: {
            deletedAt: null,
            decks: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        },
        due: { lte: now },
      },
    }),
    prisma.fSRSState.count({
      where: {
        card: {
          word: {
            deletedAt: null,
            decks: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        },
        due: {
          gt: now,
          lte: sevenDaysFromNow,
        },
      },
    }),
    prisma.fSRSState.count({
      where: {
        card: {
          word: {
            deletedAt: null,
            decks: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        },
        due: { lt: todayRange.start },
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
  const dayParts = getRecentDayParts(DASHBOARD_TIME_ZONE, 7);
  const start = getStartOfDayUtc(dayParts[0], DASHBOARD_TIME_ZONE);
  const end = getStartOfDayUtc(
    addDays(dayParts[dayParts.length - 1], 1),
    DASHBOARD_TIME_ZONE,
  );

  const logs = await prisma.reviewLog.findMany({
    where: {
      userId,
      reviewedAt: {
        gte: start,
        lt: end,
      },
    },
    select: {
      reviewedAt: true,
    },
  });

  const countByDateKey = new Map<string, number>();
  for (const log of logs) {
    const key = toDateKey(
      getDatePartsInTimeZone(log.reviewedAt, DASHBOARD_TIME_ZONE),
    );
    countByDateKey.set(key, (countByDateKey.get(key) ?? 0) + 1);
  }

  return dayParts.map((parts): WeeklyStatPoint => {
    const date = getStartOfDayUtc(parts, DASHBOARD_TIME_ZONE);
    const weekdayLabel = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: DASHBOARD_TIME_ZONE,
    }).format(date);

    return {
      reviewCount: countByDateKey.get(toDateKey(parts)) ?? 0,
      weekdayLabel,
      weekdayInitial: weekdayLabel[0],
    };
  });
}


