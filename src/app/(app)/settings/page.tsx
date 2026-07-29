"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
import { PageTitle } from "@/components/ui/page-title";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserSettings, updateUserSettings } from "@/lib/data/settings";
import { useStudyStore } from "@/stores/study-store";

const settingsSchema = z.object({
  newLimit: z.number().min(0).max(200),
  reviewLimit: z.number().min(0).max(500),
  order: z.enum(["DUE_ASC", "RANDOM", "CREATED_DESC"]),
  theme: z.enum(["light", "dark", "system"]),
});

type SettingsValues = z.infer<typeof settingsSchema>;
const STUDY_ORDER_STORAGE_KEY = "settings.studyOrder";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();
  const setStudyOrder = useStudyStore((state) => state.setOrder);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      newLimit: 20,
      reviewLimit: 100,
      order: "DUE_ASC",
      theme: "system",
    },
  });

  const settingsQuery = useQuery({
    queryKey: ["user-settings"],
    queryFn: getUserSettings,
  });

  // データ取得成功時にフォームへ値をセットする
  useEffect(() => {
    if (!settingsQuery.data) return;

    const persistedOrder = localStorage.getItem(STUDY_ORDER_STORAGE_KEY);
    const order =
      persistedOrder &&
      ["DUE_ASC", "RANDOM", "CREATED_DESC"].includes(persistedOrder)
        ? (persistedOrder as SettingsValues["order"])
        : settingsQuery.data.order;

    form.reset({
      newLimit: settingsQuery.data.newLimit,
      reviewLimit: settingsQuery.data.reviewLimit,
      theme: settingsQuery.data.theme,
      order,
    });
  }, [settingsQuery.data, form]);

  const saveMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(["user-settings"], saved);
      setTheme(saved.theme);
      localStorage.setItem(STUDY_ORDER_STORAGE_KEY, saved.order);
      setStudyOrder(saved.order);
      alert("設定を保存しました");
    },
  });

  const onSubmit = async (values: SettingsValues) => {
    localStorage.setItem(STUDY_ORDER_STORAGE_KEY, values.order);
    setStudyOrder(values.order);
    setTheme(values.theme);
    await saveMutation.mutateAsync(values);
  };

  if (settingsQuery.isLoading) {
    return (
      <section className="space-y-5">
        <PageTitle
          title="設定"
          description="学習上限と表示設定を管理します。"
        />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="animate-[ui-fade-in_240ms_ease-out]">
      <PageTitle title="設定" description="学習上限と表示設定を管理します。" />

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>学習設定</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="newLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新規上限</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            Number.isNaN(e.target.valueAsNumber)
                              ? 0
                              : e.target.valueAsNumber,
                          )
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
                    <FormLabel>レビュー上限</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            Number.isNaN(e.target.valueAsNumber)
                              ? 0
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>学習順序</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="学習順序を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DUE_ASC">
                          Due Date (Earliest First)
                        </SelectItem>
                        <SelectItem value="RANDOM">Random</SelectItem>
                        <SelectItem value="CREATED_DESC">
                          Newest Words First
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>表示設定</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>テーマ</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setTheme(val); // UIの見た目のみ即時更新
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="テーマを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "保存中..." : "保存"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              サインアウト
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
