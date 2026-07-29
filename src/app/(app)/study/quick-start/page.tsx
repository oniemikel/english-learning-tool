import { redirect } from 'next/navigation';
import { resolveDashboardStudyStart } from '@/lib/data/study';

export default async function StudyQuickStartPage() {
  const result = await resolveDashboardStudyStart();

  if (!result.deckId) {
    redirect('/decks?notice=select-deck-to-study');
  }

  const params = new URLSearchParams({
    deckId: result.deckId,
    source: 'dashboard',
    newLimit: '20',
    reviewLimit: '100',
  });

  redirect(`/study?${params.toString()}`);
}
