'use server';

import { FSRSStateType, ReviewMode, ReviewRating } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  binaryCorrectMappingValues,
  isCorrectSubmission,
  resolveFsrsRating,
  studyFsrsRatingValues,
  studySubmittedRatingValues,
} from '@/lib/study-rating';
import { z } from 'zod';

const GetStudySessionWordsSchema = z.object({
  deckId: z.string(),
  newLimit: z.number().int().min(0),
  reviewLimit: z.number().int().min(0),
  order: z.enum(['DUE_ASC', 'RANDOM', 'CREATED_DESC']).default('DUE_ASC'),
});

const SubmitStudyReviewSchema = z.object({
  cardId: z.string().min(1),
  rating: z.enum(studySubmittedRatingValues),
  isCorrect: z.boolean().optional(),
  binaryCorrectMapping: z.enum(binaryCorrectMappingValues).optional(),
});

const DAY_MS = 24 * 60 * 60 * 1000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const ratingToReviewRating: Record<
  (typeof studyFsrsRatingValues)[number],
  ReviewRating
> = {
  again: ReviewRating.AGAIN,
  hard: ReviewRating.HARD,
  good: ReviewRating.GOOD,
  easy: ReviewRating.EASY,
};

const isReviewLogIsCorrectCompatibilityError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message;
  return (
    message.includes('isCorrect') ||
    message.includes('Unknown argument') ||
    message.includes('Unknown field') ||
    message.includes('column')
  );
};

export async function resolveDashboardStudyStart() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to study.');
  }

  const userId = session.user.id;
  const now = new Date();

  const studyableWordFilter = {
    deletedAt: null,
    OR: [
      {
        card: {
          is: null,
        },
      },
      {
        card: {
          is: {
            fsrsState: {
              is: null,
            },
          },
        },
      },
      {
        card: {
          is: {
            fsrsState: {
              is: {
                state: FSRSStateType.NEW,
              },
            },
          },
        },
      },
      {
        card: {
          is: {
            fsrsState: {
              is: {
                state: {
                  in: [
                    FSRSStateType.LEARNING,
                    FSRSStateType.REVIEW,
                    FSRSStateType.RELEARNING,
                  ],
                },
                due: {
                  lte: now,
                },
              },
            },
          },
        },
      },
    ],
  };

  // Prioritize decks that currently have review cards due by FSRS.
  const dueReviewCard = await prisma.fSRSState.findFirst({
    where: {
      state: {
        in: [
          FSRSStateType.LEARNING,
          FSRSStateType.REVIEW,
          FSRSStateType.RELEARNING,
        ],
      },
      due: {
        lte: now,
      },
      card: {
        word: {
          deletedAt: null,
          deck: {
            userId,
            deletedAt: null,
            isArchived: false,
          },
        },
      },
    },
    orderBy: {
      due: 'asc',
    },
    select: {
      card: {
        select: {
          word: {
            select: {
              deckId: true,
            },
          },
        },
      },
    },
  });

  if (dueReviewCard?.card.word.deckId) {
    return {
      deckId: dueReviewCard.card.word.deckId,
      reason: 'due-review' as const,
    };
  }

  // Fallback to the most recently studied deck.
  const recentStudyLog = await prisma.studyLog.findFirst({
    where: {
      userId,
      deck: {
        deletedAt: null,
        isArchived: false,
        words: {
          some: studyableWordFilter,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      deckId: true,
    },
  });

  if (recentStudyLog?.deckId) {
    return {
      deckId: recentStudyLog.deckId,
      reason: 'recent-study' as const,
    };
  }

  // Final fallback to the most recently updated deck with studyable cards.
  const recentDeck = await prisma.deck.findFirst({
    where: {
      userId,
      deletedAt: null,
      isArchived: false,
      words: {
        some: studyableWordFilter,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
    },
  });

  if (recentDeck?.id) {
    return {
      deckId: recentDeck.id,
      reason: 'recent-deck' as const,
    };
  }

  return {
    deckId: null,
    reason: 'no-deck' as const,
  };
}

export async function getStudySessionWords(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to study.');
  }
  const userId = session.user.id;

  const { deckId, newLimit, reviewLimit, order } =
    GetStudySessionWordsSchema.parse(input);

  // Self-healing: Ensure all words in the deck have cards and fsrsStates
  await prisma.$transaction(async (tx) => {
    const wordsInDeck = await tx.word.findMany({
      where: { deckId, deletedAt: null },
      include: { card: { include: { fsrsState: true } } },
    });

    for (const word of wordsInDeck) {
      if (!word.card) {
        const card = await tx.card.create({ data: { wordId: word.id } });
        await tx.fSRSState.create({
          data: {
            cardId: card.id,
            state: FSRSStateType.NEW,
            due: new Date(),
          },
        });
      } else if (!word.card.fsrsState) {
        await tx.fSRSState.create({
          data: {
            cardId: word.card.id,
            state: FSRSStateType.NEW,
            due: new Date(),
          },
        });
      }
    }
  });

  const now = new Date();

  // Fetch new cards
  const newCards =
    newLimit > 0
      ? await prisma.card.findMany({
          where: {
            word: {
              deckId,
              deck: {
                userId,
              },
              deletedAt: null,
            },
            fsrsState: {
              state: FSRSStateType.NEW,
            },
          },
          take: newLimit,
          include: {
            word: {
              include: {
                exampleSentences: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                  take: 1,
                },
              },
            },
            fsrsState: true,
          },
        })
      : [];

  // Fetch review cards that are due
  const reviewCards =
    reviewLimit > 0
      ? await prisma.card.findMany({
          where: {
            word: {
              deckId,
              deck: {
                userId,
              },
              deletedAt: null,
            },
            fsrsState: {
              state: {
                in: [
                  FSRSStateType.LEARNING,
                  FSRSStateType.REVIEW,
                  FSRSStateType.RELEARNING,
                ],
              },
              due: {
                lte: now,
              },
            },
          },
          take: reviewLimit,
          orderBy: {
            fsrsState: {
              due: 'asc',
            },
          },
          include: {
            word: {
              include: {
                exampleSentences: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                  take: 1,
                },
              },
            },
            fsrsState: true,
          },
        })
      : [];

  const combinedCards = [...newCards, ...reviewCards];

  // Fallback: if there are no due/new cards, allow early review using the
  // nearest upcoming review cards so a session can still start.
  if (combinedCards.length === 0 && reviewLimit > 0) {
    const upcomingReviewCards = await prisma.card.findMany({
      where: {
        word: {
          deckId,
          deck: {
            userId,
          },
          deletedAt: null,
        },
        fsrsState: {
          state: {
            in: [
              FSRSStateType.LEARNING,
              FSRSStateType.REVIEW,
              FSRSStateType.RELEARNING,
            ],
          },
        },
      },
      take: reviewLimit,
      orderBy: {
        fsrsState: {
          due: 'asc',
        },
      },
      include: {
        word: {
          include: {
            exampleSentences: {
              orderBy: {
                sortOrder: 'asc',
              },
              take: 1,
            },
          },
        },
        fsrsState: true,
      },
    });

    combinedCards.push(...upcomingReviewCards);
  }

  if (order === 'RANDOM') {
    for (let i = combinedCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedCards[i], combinedCards[j]] = [combinedCards[j], combinedCards[i]];
    }
  } else if (order === 'CREATED_DESC') {
    combinedCards.sort(
      (a, b) => b.word.createdAt.getTime() - a.word.createdAt.getTime(),
    );
  } else {
    combinedCards.sort(
      (a, b) => a.fsrsState!.due.getTime() - b.fsrsState!.due.getTime(),
    );
  }

  return combinedCards
    .filter((card) => card.fsrsState) // Ensure fsrsState is not null
    .map((card) => ({
      id: card.word.id, // Keep word.id as id for component compatibility
      cardId: card.id,
      deckId: card.word.deckId,
      word: card.word.word,
      translation: card.word.meaning,
      partOfSpeech: card.word.partOfSpeech,
      definition: card.word.memo ?? '',
      pronunciation: card.word.pronunciation ?? '',
      example: card.word.exampleSentences[0]?.english ?? '',
      etymology: card.word.source ?? '',
      nextReview: card.fsrsState!.due.toISOString(),
      accuracy: 0, // Placeholder for now
      state: card.fsrsState!.state, // Actual FSRS state
    }));
}

export async function submitStudyReview(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to review cards.');
  }

  const { cardId, rating, isCorrect, binaryCorrectMapping } = SubmitStudyReviewSchema.parse(input);
  const fsrsRating = resolveFsrsRating(rating, binaryCorrectMapping);
  const resolvedIsCorrect = typeof isCorrect === 'boolean' ? isCorrect : isCorrectSubmission(rating);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const fsrsState = await tx.fSRSState.findFirst({
      where: {
        cardId,
        card: {
          word: {
            deck: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        card: true,
      },
    });

    if (!fsrsState) {
      throw new Error('Card not found for current user.');
    }

    const previousStability = Math.max(0.1, fsrsState.stability || 0.1);
    const previousDifficulty = fsrsState.difficulty || 5;
    const elapsedDays = fsrsState.lastReview
      ? Math.max(0, (now.getTime() - fsrsState.lastReview.getTime()) / DAY_MS)
      : 0;
    const retrievability = Math.exp(-elapsedDays / previousStability);

    let nextDifficulty = previousDifficulty;
    let nextStability = previousStability;
    let intervalDays = 1;
    let nextState: FSRSStateType = FSRSStateType.REVIEW;

    if (fsrsRating === 'again') {
      nextDifficulty = clamp(previousDifficulty + 0.6, 1, 10);
      nextStability = clamp(previousStability * 0.5, 0.1, 36500);
      intervalDays = 1 / 32; // 45 minutes
      nextState = FSRSStateType.RELEARNING;
    }

    if (fsrsRating === 'hard') {
      nextDifficulty = clamp(previousDifficulty + 0.2, 1, 10);
      nextStability = clamp(
        previousStability * (1.1 + (1 - retrievability) * 0.2),
        0.1,
        36500,
      );
      intervalDays = Math.max(1, Math.round(nextStability * 0.6));
      nextState = FSRSStateType.REVIEW;
    }

    if (fsrsRating === 'good') {
      nextDifficulty = clamp(previousDifficulty - 0.15, 1, 10);
      nextStability = clamp(
        previousStability * (1.4 + (1 - retrievability) * 0.4),
        0.1,
        36500,
      );
      intervalDays = Math.max(1, Math.round(nextStability));
      nextState = FSRSStateType.REVIEW;
    }

    if (fsrsRating === 'easy') {
      nextDifficulty = clamp(previousDifficulty - 0.35, 1, 10);
      nextStability = clamp(
        previousStability * (1.9 + (1 - retrievability) * 0.7),
        0.1,
        36500,
      );
      intervalDays = Math.max(2, Math.round(nextStability * 1.5));
      nextState = FSRSStateType.REVIEW;
    }

    const due = new Date(now.getTime() + intervalDays * DAY_MS);

    const updatedFsrs = await tx.fSRSState.update({
      where: { cardId },
      data: {
        state: nextState,
        difficulty: nextDifficulty,
        stability: nextStability,
        due,
        lastReview: now,
        reps: {
          increment: 1,
        },
        lapses: fsrsRating === 'again' ? { increment: 1 } : undefined,
      },
    });

    await tx.card.update({
      where: { id: cardId },
      data: {
        lastStudiedAt: now,
      },
    });

    try {
      await tx.reviewLog.create({
        data: {
          userId: session.user.id,
          cardId,
          isCorrect: resolvedIsCorrect,
          rating: ratingToReviewRating[fsrsRating],
          reviewMode: ReviewMode.NORMAL,
          reviewedAt: now,
        },
      });
    } catch (error) {
      if (!isReviewLogIsCorrectCompatibilityError(error)) {
        throw error;
      }

      // Backward compatibility for environments where the DB/client is not
      // yet migrated with ReviewLog.isCorrect.
      await tx.reviewLog.create({
        data: {
          userId: session.user.id,
          cardId,
          rating: ratingToReviewRating[fsrsRating],
          reviewMode: ReviewMode.NORMAL,
          reviewedAt: now,
        },
      });
    }

    return {
      retrievability,
      stability: updatedFsrs.stability,
      difficulty: updatedFsrs.difficulty,
      due: updatedFsrs.due.toISOString(),
      state: updatedFsrs.state,
    };
  });

  revalidatePath('/dashboard');

  return result;
}