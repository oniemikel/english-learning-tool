'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';
import { useStudyStore } from '@/stores/study-store';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const studyStartSchema = z.object({
  mode: z.enum(['en-ja', 'ja-en', 'listening', 'pronunciation']),
  newLimit: z.coerce.number().int().min(0).max(100),
  reviewLimit: z.coerce.number().int().min(0).max(200),
});

type StudyStartValues = z.infer<typeof studyStartSchema>;

const modePathMap: Record<StudyStartValues['mode'], string> = {
  'en-ja': '/study/en-ja',
  'ja-en': '/study/ja-en',
  listening: '/study/listening',
  pronunciation: '/study/pronunciation',
};

export default function StudyStartPage() {
  const searchParams = useSearchParams();
  const store = useStudyStore();
  const deckId = searchParams.get('deckId') ?? store.deckId;

  const form = useForm<StudyStartValues>({
    resolver: zodResolver(studyStartSchema),
    defaultValues: {
      mode: store.mode,
      newLimit: store.newLimit,
      reviewLimit: store.reviewLimit,
    },
  });

  const mode = form.watch('mode');
  const { newLimit, reviewLimit } = form.watch();

  // Update store on form change
  store.setDeckId(deckId);
  store.setMode(mode);
  store.setNewLimit(newLimit);
  store.setReviewLimit(reviewLimit);

  return (
    <section>
      <PageTitle title="Start Study Session" description="Choose your deck and mode to begin." />
      <Form {...form}>
        <form>
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
              <CardDescription>
                You are studying deck: <span className="font-semibold">{deckId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a study mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en-ja">English to Japanese</SelectItem>
                        <SelectItem value="ja-en">Japanese to English</SelectItem>
                        <SelectItem value="listening">Listening Practice</SelectItem>
                        <SelectItem value="pronunciation">Pronunciation Practice</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Cards Limit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Cards Limit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Link href={modePathMap[mode]}>
                  <Button size="lg">Start Session</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
}
