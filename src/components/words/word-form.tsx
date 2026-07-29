"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  deckId: z.string().min(1, "デッキは必須です"),
  definition: z.string().trim().max(2000, "英英定義は2000文字以内で入力してください"),
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
  deckId: "",
  definition: "",
  example: "",
};

const partOfSpeechOptions = ["NOUN", "VERB", "ADJECTIVE", "ADVERB", "OTHER"] as const;

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
  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordFormSchema),
    defaultValues: {
      ...wordFormDefaultValues,
      ...initialData,
    },
  });

  useEffect(() => {
    form.reset({
      ...wordFormDefaultValues,
      ...initialData,
    });
  }, [initialData, form]);

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
              name="deckId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>デッキ</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="デッキを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deckOptions.map((deck) => (
                        <SelectItem key={deck.id} value={deck.id}>
                          {deck.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <details className="rounded-(--radius-card) border bg-(--muted)/40 p-4" open={Boolean(initialData?.definition || initialData?.example)}>
              <summary className="cursor-pointer text-sm font-medium">詳細情報（任意）</summary>
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
              <Button type="button" variant="outline" onClick={onCancel} disabled={cancelPending || isSubmitting}>
                {cancelPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
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
