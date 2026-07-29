'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useState, useTransition } from 'react';
import { mobileNavigation } from './navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-(--border) bg-(--card) px-2 py-2 md:hidden">
      <ul className="mx-auto grid max-w-160 grid-cols-5 gap-1">
        {mobileNavigation.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(event) => handleNavigate(event, item.href)}
                className={cn(
                  'flex flex-col items-center rounded-(--radius-control) px-1 py-2 text-[11px] font-medium transition-all duration-200 ease-in-out active:scale-[0.97]',
                  active
                    ? 'bg-(--accent) text-(--accent-foreground)'
                    : 'text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)',
                )}
              >
                {isPending && pendingHref === item.href ? (
                  <Loader2 className="mb-1 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Icon className="mb-1 h-4 w-4" />
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
