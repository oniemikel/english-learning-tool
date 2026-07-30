"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const wordFormSchema = z.object({
  word: z.string().trim().min(1, "英単語は必須です").max(100),
  translation: z.string().trim().min(1, "日本語訳は必須です").max(500),
  partOfSpeech: z.string().min(1, "品詞は必須です"),
  deckIds: z.array(z.string().min(1)).min(1, "デッキは1つ以上選択してください"),
  definition: z
    .string()
    .trim()
    .max(2000, "英英定義は2000文字以内で入力してください"),
  example: z.string().trim().max(2000, "例文は2000文字以内で入力してください"),
});

export type WordFormValues = z.infer<typeof wordFormSchema>;

export type WordDeckOption = {
  id: string;
  name: string;
};

export const wordFormDefaultValues: WordFormValues = {
  word: "",
  translation: "",
  partOfSpeech: "OTHER",
  deckIds: [],
  definition: "",
  example: "",
};

const partOfSpeechOptions = [
  "NOUN",
  "VERB",
  "ADJECTIVE",
  "ADVERB",
  "OTHER",
] as const;

type WordFormProps = {
  initialData?: Partial<WordFormValues>;
  deckOptions: WordDeckOption[];
  onSubmit: (values: WordFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  cancelPending?: boolean;
  submitButtonText: string;
  title: string;
};

export function WordForm({
  initialData,
  deckOptions,
  onSubmit,
  onCancel,
  isSubmitting,
  cancelPending = false,
  submitButtonText,
  title,
}: WordFormProps) {
  // ★ defaultValues ではなく values を使用し、useEffect(+form.reset) を不要にします
  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordFormSchema),
    values: {
      ...wordFormDefaultValues,
      ...initialData,
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>英単語</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="translation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日本語訳</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partOfSpeech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品詞</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="品詞を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {partOfSpeechOptions.map((part) => (
                        <SelectItem key={part} value={part}>
                          {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deckIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>デッキ（複数選択可）</FormLabel>
                  <FormControl>
                    <div className="space-y-3 rounded-(--radius-control) border p-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {deckOptions.map((deck) => {
                          const isSelected =
                            field.value?.includes(deck.id) ?? false;

                          return (
                            <label
                              key={deck.id}
                              className="flex cursor-pointer items-center gap-2 rounded-(--radius-control) border px-3 py-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(event) => {
                                  const currentValues = field.value ?? [];
                                  if (event.target.checked) {
                                    field.onChange([...currentValues, deck.id]);
                                    return;
                                  }

                                  field.onChange(
                                    currentValues.filter(
                                      (id) => id !== deck.id,
                                    ),
                                  );
                                }}
                              />
                              <span>{deck.name}</span>
                            </label>
                          );
                        })}
                      </div>
                      {field.value && field.value.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((deckId) => {
                            const selectedDeck = deckOptions.find(
                              (deck) => deck.id === deckId,
                            );
                            if (!selectedDeck) {
                              return null;
                            }

                            return (
                              <Badge key={deckId} variant="secondary">
                                {selectedDeck.name}
                              </Badge>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <details
              className="rounded-(--radius-card) border bg-(--muted)/40 p-4"
              open={Boolean(initialData?.definition || initialData?.example)}
            >
              <summary className="cursor-pointer text-sm font-medium">
                詳細情報（任意）
              </summary>
              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="definition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>英英定義</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="example"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>例文</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </details>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={cancelPending || isSubmitting}
              >
                {cancelPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {cancelPending ? "移動中..." : "キャンセル"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : submitButtonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
