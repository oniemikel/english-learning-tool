'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const GetStudySessionWordsSchema = z.object({
  deckId: z.string(),
  newLimit: z.number().int().min(0),
  reviewLimit: z.number().int().min(0),
});

export async function getStudySessionWords(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to study.');
  }
  const userId = session.user.id;

  const { deckId, newLimit, reviewLimit } =
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
            state: 'NEW',
            due: new Date(),
          },
        });
      } else if (!word.card.fsrsState) {
        await tx.fSRSState.create({
          data: {
            cardId: word.card.id,
            state: 'NEW',
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
              state: 'NEW',
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
                in: ['REVIEW', 'RELEARNING'],
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

  // Shuffle the combined cards for a better learning experience
  for (let i = combinedCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combinedCards[i], combinedCards[j]] = [combinedCards[j], combinedCards[i]];
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