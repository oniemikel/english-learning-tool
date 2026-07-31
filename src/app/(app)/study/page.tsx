'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import {
  getEffectiveInputMethod,
  type StudyInputMethod,
  useStudyStore,
} from "@/stores/study-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedContainer } from "@/components/animated-container";

const STUDY_ORDER_STORAGE_KEY = "settings.studyOrder";

const studyStartSchema = z.object({
  mode: z.enum(["en-ja", "ja-en", "listening", "pronunciation"]),
  inputMethod: z.enum(["SELF_EVALUATION", "TYPING"]),
  newLimit: z.number().int().min(0).max(100),
  reviewLimit: z.number().int().min(0).max(200),
});

type StudyStartValues = z.infer<typeof studyStartSchema>;

const modePathMap: Record<StudyStartValues["mode"], string> = {
  "en-ja": "/study/en-ja",
  "ja-en": "/study/ja-en",
  listening: "/study/listening",
  pronunciation: "/study/pronunciation",
};

const createStudyUrl = (
  mode: StudyStartValues["mode"],
  inputMethod: StudyStartValues["inputMethod"],
  deckId: string | null,
  newLimit: number,
  reviewLimit: number,
) => {
  const url = new URL(modePathMap[mode], "http://localhost"); // Base URL is dummy, only pathname and search are used
  if (deckId) {
    url.searchParams.set("deckId", deckId);
  }
  url.searchParams.set("newLimit", newLimit.toString());
  url.searchParams.set("reviewLimit", reviewLimit.toString());
  url.searchParams.set("inputMethod", getEffectiveInputMethod(mode, inputMethod));
  return url.pathname + url.search;
};

const isInputMethodValue = (value: string | null): value is StudyInputMethod => {
  return value === "SELF_EVALUATION" || value === "TYPING";
};

export default function StudyStartPage() {
  const searchParams = useSearchParams();

  const deckId = searchParams.get("deck") ?? searchParams.get("deckId");
  const source = searchParams.get('source');
  const newLimitFromQuery = searchParams.get('newLimit');
  const reviewLimitFromQuery = searchParams.get('reviewLimit');
  const inputMethodFromQuery = searchParams.get('inputMethod');

  const deckIdInStore = useStudyStore((s) => s.deckId);
  const modeStore = useStudyStore((s) => s.mode);
  const inputMethodStore = useStudyStore((s) => s.inputMethod);
  const newLimitStore = useStudyStore((s) => s.newLimit);
  const reviewLimitStore = useStudyStore((s) => s.reviewLimit);
  const setOrder = useStudyStore((s) => s.setOrder);

  const setDeckId = useStudyStore((s) => s.setDeckId);
  const setMode = useStudyStore((s) => s.setMode);
  const setInputMethod = useStudyStore((s) => s.setInputMethod);
  const setNewLimit = useStudyStore((s) => s.setNewLimit);
  const setReviewLimit = useStudyStore((s) => s.setReviewLimit);

  const currentDeckId = deckId ?? deckIdInStore;

  const parsedNewLimit = newLimitFromQuery !== null ? Number.parseInt(newLimitFromQuery, 10) : NaN;
  const parsedReviewLimit = reviewLimitFromQuery !== null ? Number.parseInt(reviewLimitFromQuery, 10) : NaN;

  const initialNewLimit = Number.isInteger(parsedNewLimit)
    ? Math.min(100, Math.max(0, parsedNewLimit))
    : newLimitStore;
  const initialReviewLimit = Number.isInteger(parsedReviewLimit)
    ? Math.min(200, Math.max(0, parsedReviewLimit))
    : reviewLimitStore;

  const resolvedInitialNewLimit =
    source === 'dashboard' && initialNewLimit === 0 && initialReviewLimit === 0
      ? 20
      : initialNewLimit;
  const resolvedInitialReviewLimit =
    source === 'dashboard' && initialNewLimit === 0 && initialReviewLimit === 0
      ? 100
      : initialReviewLimit;

  const initialInputMethod = getEffectiveInputMethod(
    modeStore,
    isInputMethodValue(inputMethodFromQuery) ? inputMethodFromQuery : inputMethodStore,
  );

  const form = useForm<StudyStartValues>({
    resolver: zodResolver(studyStartSchema),
    defaultValues: {
      mode: modeStore,
      inputMethod: initialInputMethod,
      newLimit: resolvedInitialNewLimit,
      reviewLimit: resolvedInitialReviewLimit,
    },
  });

  const mode = form.watch("mode");
  const inputMethod = form.watch("inputMethod");
  const newLimit = form.watch("newLimit");
  const reviewLimit = form.watch("reviewLimit");
  const hasAnyCardLimit = newLimit > 0 || reviewLimit > 0;
  const effectiveInputMethod = getEffectiveInputMethod(mode, inputMethod);
  const isEnToJp = mode === "en-ja";

  useEffect(() => {
    setDeckId(currentDeckId);
  }, [currentDeckId, setDeckId]);

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  useEffect(() => {
    if (inputMethod !== effectiveInputMethod) {
      form.setValue("inputMethod", effectiveInputMethod, { shouldDirty: true });
    }
    setInputMethod(effectiveInputMethod);
  }, [inputMethod, effectiveInputMethod, form, setInputMethod]);

  useEffect(() => {
    setNewLimit(newLimit);
  }, [newLimit, setNewLimit]);

  useEffect(() => {
    setReviewLimit(reviewLimit);
  }, [reviewLimit, setReviewLimit]);

  useEffect(() => {
    const order = localStorage.getItem(STUDY_ORDER_STORAGE_KEY);
    if (order === "DUE_ASC" || order === "RANDOM" || order === "CREATED_DESC") {
      setOrder(order);
    }
  }, [setOrder]);

  return (
    <section>
      <PageTitle
        title="Start Study Session"
        description="Choose your deck and mode to begin."
      />

      <Form {...form}>
        <form>
          <AnimatedContainer delay={0.05}>
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>Session Settings</CardTitle>

                <CardDescription>
                  {currentDeckId ? (
                    <>
                      You are studying deck:
                      <span className="ml-1 font-semibold">{currentDeckId}</span>
                    </>
                  ) : (
                    "Please select a deck to start studying."
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Mode</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="en-ja">
                          English → Japanese
                        </SelectItem>

                        <SelectItem value="ja-en">
                          Japanese → English
                        </SelectItem>

                        <SelectItem value="listening">Listening</SelectItem>

                        <SelectItem value="pronunciation">
                          Pronunciation
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inputMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Method</FormLabel>

                    {isEnToJp ? (
                      <>
                        <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                          Self-Evaluation (Flashcard)
                        </div>
                        <p className="text-xs text-muted-foreground">
                          English → Japanese defaults to self-evaluation to avoid false misses caused by Japanese wording variations.
                        </p>
                      </>
                    ) : (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="TYPING">Typing Input</SelectItem>
                          <SelectItem value="SELF_EVALUATION">Self-Evaluation</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

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
                      <FormLabel>New Cards</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
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
                      <FormLabel>Review Cards</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href={createStudyUrl(
                    mode,
                    effectiveInputMethod,
                    currentDeckId,
                    newLimit,
                    reviewLimit,
                  )}
                  passHref
                >
                  <Button size="lg" disabled={!currentDeckId || !hasAnyCardLimit}>
                    Start Session
                  </Button>
                </Link>
              </div>

                {!hasAnyCardLimit ? (
                  <p className="text-sm text-muted-foreground">
                    Set at least one of New Cards or Review Cards above 0 to start a session.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </AnimatedContainer>
        </form>
      </Form>
    </section>
  );
}
