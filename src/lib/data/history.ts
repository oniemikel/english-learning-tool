'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { StudyMode } from '@prisma/client';
import { z } from 'zod';

const SaveStudySessionSchema = z.object({
  deckId: z.string().min(1),
  mode: z.enum(['en-ja', 'ja-en', 'listening', 'pronunciation']),
  solved: z.number().int().min(0),
  correct: z.number().int().min(0),
  minutes: z.number().int().min(0),
});

export async function saveStudySession(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const { deckId, mode, solved, correct, minutes } = SaveStudySessionSchema.parse(input);
  const accuracy = solved > 0 ? (correct / solved) * 100 : 0;

  const studyMode = mode.toUpperCase().replace('-', '_') as StudyMode;

  try {
    await prisma.studyLog.create({
      data: {
        userId: session.user.id,
        deckId,
        mode: studyMode,
        solved,
        correct,
        accuracy,
        minutes,
      },
    });
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
  solved: number;
  correct: number;
  minutes: number;
}) {
  return saveStudySession(data);
}
