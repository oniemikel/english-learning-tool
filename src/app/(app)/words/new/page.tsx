"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { WordForm, wordFormDefaultValues, type WordFormValues } from "@/components/words/word-form";
import { PageTitle } from "@/components/ui/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { listDecks } from "@/lib/data/decks";
import { createWord } from "@/lib/data/words";
import { AnimatedContainer } from "@/components/animated-container";

export default function WordCreatePage() {
  const router = useRouter();
  const [isPendingNavigation, startNavigation] = useTransition();
  const params = useSearchParams();
  const decksQuery = useQuery({
    queryKey: ["decks"],
    queryFn: () => listDecks({}),
  });

  const mutation = useMutation({
    mutationFn: (values: WordFormValues) => createWord(values),
    onSuccess: (word) => startNavigation(() => router.push(`/words/${word.id}`)),
  });

  if (decksQuery.isLoading) {
    return (
      <section>
        <PageTitle
          title="単語作成"
          description="単語の基本情報と詳細情報をまとめて登録できます。"
        />
        <AnimatedContainer delay={0.05}>
          <Skeleton className="mx-auto h-96 w-full max-w-2xl" />
        </AnimatedContainer>
      </section>
    );
  }

  return (
    <section>
      <PageTitle
        title="単語作成"
        description="単語の基本情報と詳細情報をまとめて登録できます。"
      />
      <AnimatedContainer delay={0.05}>
        <WordForm
          title="単語情報"
          deckOptions={decksQuery.data ?? []}
          initialData={{
            ...wordFormDefaultValues,
            deckIds: params.get("deckId") ? [params.get("deckId")!] : [],
          }}
          onSubmit={(values) => mutation.mutate(values)}
          onCancel={() => startNavigation(() => router.push("/words"))}
          isSubmitting={mutation.isPending || isPendingNavigation}
          submitButtonText="作成"
          cancelPending={isPendingNavigation}
        />
      </AnimatedContainer>
    </section>
  );
}
