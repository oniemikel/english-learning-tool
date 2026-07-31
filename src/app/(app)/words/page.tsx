"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/components/ui/page-title";
import { listWords } from "@/lib/data/words";
import { formatDate } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AnimatedContainer } from "@/components/animated-container";

const PAGE_SIZE = 10;

export default function WordsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pendingWordId, setPendingWordId] = useState<string | null>(null);
  const [isNavigating, startNavigation] = useTransition();
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const wordsQuery = useQuery({
    queryKey: ["words", debouncedQuery, page],
    queryFn: () =>
      listWords({ query: debouncedQuery, page, pageSize: PAGE_SIZE }),
  });

  const totalPages = wordsQuery.data?.totalPages ?? 1;
  const totalCount = wordsQuery.data?.totalCount ?? 0;

  return (
    <section>
      <PageTitle
        title="All Words"
        description="Search and manage all words across your decks."
        actions={
          <Link href="/words/new">
            <Button>Add Word</Button>
          </Link>
        }
      />

      <AnimatedContainer>
        <div className="mb-5 flex items-center justify-between gap-4">
          <Input
            placeholder="Search by word or translation..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="max-w-sm"
          />
          {wordsQuery.data ? (
            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              words
            </p>
          ) : null}
        </div>
      </AnimatedContainer>
      {totalPages > 1 ? (
        // <AnimatedContainer delay={0.1}>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || wordsQuery.isLoading}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || wordsQuery.isLoading}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : // </AnimatedContainer>
      null}

      <AnimatedContainer delay={0.05}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Translation</TableHead>
              <TableHead>Decks</TableHead>
              <TableHead>Part of Speech</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Next Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wordsQuery.isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                </TableRow>
              ))
            ) : wordsQuery.isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive">
                  Could not load words.
                </TableCell>
              </TableRow>
            ) : wordsQuery.data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <p className="font-semibold">No words found.</p>
                  {query ? (
                    <p className="text-muted-foreground">
                      Try a different search term.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Get started by creating your first word.
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              wordsQuery.data?.items.map((word) => (
                <TableRow
                  key={word.id}
                  onClick={() => {
                    setPendingWordId(word.id);
                    startNavigation(() => router.push(`/words/${word.id}`));
                  }}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      {word.word}
                      {isNavigating && pendingWordId === word.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell>{word.translation}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {word.decks.map((deck) => (
                        <Link
                          key={deck.id}
                          href={`/decks/${deck.id}`}
                          className="hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Badge variant="outline">{deck.name}</Badge>
                        </Link>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{word.partOfSpeech}</Badge>
                  </TableCell>
                  <TableCell>{word.accuracy}%</TableCell>
                  <TableCell>{formatDate(word.nextReview)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AnimatedContainer>

      {isNavigating ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Opening word details...
        </p>
      ) : null}
    </section>
  );
}
