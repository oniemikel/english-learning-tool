'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const deckSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  isPublic: z.boolean().default(false),
});

export type DeckFormValues = z.infer<typeof deckSchema>;

type DeckFormProps = {
  initialData?: DeckFormValues;
  onSubmit: (values: DeckFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  cancelPending?: boolean;
};

export function DeckForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = 'Save',
  cancelPending = false,
}: DeckFormProps) {
  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      isPublic: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{initialData ? 'Edit Deck' : 'Create a New Deck'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Business English, Travel Phrases" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is this deck about?"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Public Deck</FormLabel>
                    <FormDescription>
                      Allow other users to find and clone this deck.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={cancelPending || isSubmitting}>
                {cancelPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {cancelPending ? 'Canceling...' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : submitButtonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
