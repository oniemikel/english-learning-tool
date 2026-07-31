"use client";

import Link from "next/link";
import { Loader2, Clock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type MouseEvent, useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Icons, Icon } from "@/components/icons";
import { UserNav } from "./user-nav";

const SIDEBAR_NAV_ITEMS = {
  learn: [
    { label: "Dashboard", href: "/dashboard", icon: "Dashboard" as const },
    { label: "My Decks", href: "/decks", icon: "Decks" as const, badge: 0 },
    { label: "Vocabulary", href: "/words", icon: "Vocabulary" as const },
    { label: "Progress", href: "/statistics", icon: "Progress" as const },
  ],
  account: [
    { label: "Settings", href: "/settings", icon: "Settings" as const },
  ],
};

/**
 * 日付と時刻を分離して取得するヘルパー
 */
function getFormattedDateTimeParts(date: Date) {
  const pad = (num: number) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetStr = `GMT${sign}${offsetHours}`;

  return {
    dateStr: `${year}/${month}/${day}`,
    timeStr: `${hours}:${minutes}:${seconds} ${offsetStr}`,
  };
}

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // リアルタイム日時状態
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  const dateTimeParts = now ? getFormattedDateTimeParts(now) : null;

  return (
    <aside className="hidden h-screen w-60 flex-col border-r border-border bg-card text-card-foreground md:flex">
      {/* ヘッダーエリア */}
      <div className="border-b border-border p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons.Decks className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold tracking-wide">
            English-Learning-Tool
          </span>
        </Link>
      </div>

      {/* ナビゲーション & 時計バナー（サイドバー本体内部） */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-2">
        <nav className="space-y-6">
          <div>
            <h3 className="px-2 text-xs font-medium uppercase text-muted-foreground">
              Learn
            </h3>
            <ul className="mt-2 space-y-1">
              {SIDEBAR_NAV_ITEMS.learn.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={(event) => handleNavigate(event, item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.99]",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon name={item.icon} className="h-4 w-4" />
                    <span>{item.label}</span>
                    {isPending && pendingHref === item.href && (
                      <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                    )}
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge className="ml-auto bg-muted text-muted-foreground">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="px-2 text-xs font-medium uppercase text-muted-foreground">
              Account
            </h3>
            <ul className="mt-2 space-y-1">
              {SIDEBAR_NAV_ITEMS.account.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={(event) => handleNavigate(event, item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.99]",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon name={item.icon} className="h-4 w-4" />
                    <span>{item.label}</span>
                    {isPending && pendingHref === item.href && (
                      <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ユーザーバナーの上に重ねる「日時バナー」（文字大きめ・中央揃え） */}
        <div className="mt-4 rounded-lg bg-transparent p-3">
          <div className="flex flex-col items-center justify-center gap-1 text-center text-muted-foreground">
            <Clock className="h-5 w-5 shrink-0 mb-1 opacity-80" />
            <div className="font-mono leading-tight">
              {dateTimeParts ? (
                <>
                  <div className="text-base font-semibold tracking-wide text-foreground">
                    {dateTimeParts.dateStr}
                  </div>
                  <div className="mt-0.5 text-xs text-foreground/80 font-medium">
                    {dateTimeParts.timeStr}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-base font-semibold tracking-wide text-foreground">
                  ----/--/--
                  </div>
                  <div className="mt-0.5 text-xs text-foreground/80 font-medium">
                    --:--:-- GMT -
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ユーザーバナー専用コンテナ（単体で最下部に独立） */}
      <div className="border-t border-border p-4">
        <UserNav user={session?.user ?? null} variant="sidebar" />
      </div>
    </aside>
  );
};

export default Sidebar;
