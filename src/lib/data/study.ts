
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

  const { deckId, newLimit, reviewLimit } = GetStudySessionWordsSchema.parse(input);
  const totalLimit = newLimit + reviewLimit;

  // This is a simplified implementation. A real implementation would differentiate
  // between new and review cards.
  const words = await prisma.word.findMany({
    where: {
      deckId,
      deck: {
        userId,
      },
      deletedAt: null,
    },
    take: totalLimit,
    // A real implementation would have better ordering, e.g., by due date.
  });

  return words.map((word) => ({
    id: word.id,
    deckId: word.deckId,
    word: word.word,
    translation: word.meaning,
    partOfSpeech: word.partOfSpeech,
    definition: word.memo ?? '',
    pronunciation: word.pronunciation,
    example: '', // Placeholder
    etymology: word.source, // Placeholder, source is not etymology
    nextReview: new Date().toISOString(), // Placeholder
    accuracy: 0, // Placeholder
    state: 'ACTIVE', // Placeholder
  }));
}
