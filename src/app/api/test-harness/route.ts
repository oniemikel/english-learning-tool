
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Starting data migration...');
  let wordsMigratedCount = 0;
  let cardsMigratedCount = 0;

  try {
    // 1. Find words without cards and create them
    const wordsWithoutCards = await prisma.word.findMany({
      where: {
        card: null,
      },
    });

    if (wordsWithoutCards.length > 0) {
        console.log(`Found ${wordsWithoutCards.length} words without cards. Migrating...`);
        for (const word of wordsWithoutCards) {
          const card = await prisma.card.create({
            data: {
              wordId: word.id,
            },
          });

          await prisma.fSRSState.create({
            data: {
              cardId: card.id,
              state: 'NEW',
              due: new Date(),
            },
          });
          wordsMigratedCount++;
        }
        console.log(`Successfully migrated ${wordsMigratedCount} words.`);
    } else {
        console.log('No words found without cards.');
    }


    // 2. Find cards without FSRSState and create it
    const cardsWithoutFsrsState = await prisma.card.findMany({
        where: {
            fsrsState: null,
        }
    });

    if (cardsWithoutFsrsState.length > 0) {
        console.log(`Found ${cardsWithoutFsrsState.length} cards without FSRSState. Migrating...`);
        for (const card of cardsWithoutFsrsState) {
            await prisma.fSRSState.create({
                data: {
                    cardId: card.id,
                    state: 'NEW',
                    due: new Date(),
                },
            });
            cardsMigratedCount++;
        }
        console.log(`Successfully migrated ${cardsMigratedCount} cards.`);
    } else {
        console.log('No cards found without FSRSState.');
    }


    if (wordsMigratedCount === 0 && cardsMigratedCount === 0) {
      return NextResponse.json({
        status: 'success',
        message: 'Data is consistent. No migration needed.',
      });
    }

    return NextResponse.json({
      status: 'success',
      message: `Migration complete. Migrated ${wordsMigratedCount} words and ${cardsMigratedCount} cards.`,
    });
  } catch (error) {
    console.error('Data migration failed:', error);
    return NextResponse.json({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred.',
      }, { status: 500 });
  } finally {
      console.log('Data migration finished.');
  }
}
