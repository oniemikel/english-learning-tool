'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { StudyMode } from '@prisma/client';
import { studyFsrsRatingValues } from '@/lib/study-rating';
import { z } from 'zod';

const SaveStudySessionSchema = z.object({
  deckId: z.string().min(1),
  mode: z.enum(['en-ja', 'ja-en', 'listening', 'pronunciation']),
  totalReviewed: z.number().int().min(0).optional(),
  correctCount: z.number().int().min(0).optional(),
  incorrectCount: z.number().int().min(0).optional(),
  accuracyRate: z.number().min(0).max(100).optional(),
  fsrsBreakdown: z
    .object({
      again: z.number().int().min(0),
      hard: z.number().int().min(0),
      good: z.number().int().min(0),
      easy: z.number().int().min(0),
    })
    .optional(),
  // Backward compatibility with existing callers.
  solved: z.number().int().min(0).optional(),
  correct: z.number().int().min(0).optional(),
  minutes: z.number().int().min(0),
});

const startOfDay = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const calculateAccuracy = (correctCount: number, totalReviewed: number) =>
  totalReviewed > 0 ? (correctCount / totalReviewed) * 100 : 0;

export async function saveStudySession(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const parsed = SaveStudySessionSchema.parse(input);

  const totalReviewed = parsed.totalReviewed ?? parsed.solved ?? 0;
  const correctCount = parsed.correctCount ?? parsed.correct ?? 0;
  const incorrectCount = parsed.incorrectCount ?? Math.max(0, totalReviewed - correctCount);
  const accuracy =
    parsed.accuracyRate ?? calculateAccuracy(correctCount, totalReviewed);
  const minutes = parsed.minutes;
  const { deckId, mode } = parsed;

  const studyMode = mode.toUpperCase().replace('-', '_') as StudyMode;
  const today = startOfDay(new Date());

  try {
    await prisma.$transaction(async (tx) => {
      await tx.studyLog.create({
        data: {
          userId: session.user.id,
          deckId,
          mode: studyMode,
          solved: totalReviewed,
          correct: correctCount,
          accuracy,
          minutes,
        },
      });

      const existingDaily = await tx.dailyStatistic.findUnique({
        where: {
          userId_date: {
            userId: session.user.id,
            date: today,
          },
        },
      });

      if (!existingDaily) {
        await tx.dailyStatistic.create({
          data: {
            userId: session.user.id,
            date: today,
            reviewCount: totalReviewed,
            studyTime: minutes,
            correctCount,
            incorrectCount,
            accuracyRate: accuracy,
          },
        });
        return;
      }

      const nextReviewCount = existingDaily.reviewCount + totalReviewed;
      const nextCorrectCount = existingDaily.correctCount + correctCount;
      const nextIncorrectCount = existingDaily.incorrectCount + incorrectCount;
      const nextStudyTime = existingDaily.studyTime + minutes;
      const nextAccuracy = calculateAccuracy(nextCorrectCount, nextReviewCount);

      await tx.dailyStatistic.update({
        where: {
          userId_date: {
            userId: session.user.id,
            date: today,
          },
        },
        data: {
          reviewCount: nextReviewCount,
          studyTime: nextStudyTime,
          correctCount: nextCorrectCount,
          incorrectCount: nextIncorrectCount,
          accuracyRate: nextAccuracy,
        },
      });
    });

    return {
      deckId,
      mode,
      totalReviewed,
      correctCount,
      incorrectCount,
      accuracyRate: accuracy,
      fsrsBreakdown: parsed.fsrsBreakdown ?? Object.fromEntries(studyFsrsRatingValues.map((rating) => [rating, 0])),
      minutes,
    };
  } catch (error) {
    console.error('Failed to save study log:', error);
    // Depending on requirements, you might want to re-throw the error
    // or handle it gracefully.
    throw new Error('Failed to save study log.');
  }
}

export async function getStudyHistory() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const history = await prisma.studyLog.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      deck: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return history.map((log) => ({
    id: log.id,
    deckName: log.deck.title,
    mode: log.mode.toLowerCase().replace('_', '-'),
    solved: log.solved,
    accuracy: log.accuracy,
    minutes: log.minutes,
    createdAt: log.createdAt.toISOString(),
  }));
}

export async function saveStudyLog(data: {
  deckId: string;
  mode: 'en-ja' | 'ja-en' | 'listening' | 'pronunciation';
  solved?: number;
  correct?: number;
  totalReviewed?: number;
  correctCount?: number;
  incorrectCount?: number;
  accuracyRate?: number;
  fsrsBreakdown?: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
  minutes: number;
}) {
  return saveStudySession(data);
}
