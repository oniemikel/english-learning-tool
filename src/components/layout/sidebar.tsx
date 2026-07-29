// src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { type MouseEvent, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Icons, Icon } from '@/components/icons';
import { UserNav } from './user-nav';

const SIDEBAR_NAV_ITEMS = {
  learn: [
    { label: 'Dashboard', href: '/dashboard', icon: 'Dashboard' as const },
    { label: 'My Decks', href: '/decks', icon: 'Decks' as const, badge: 0 },
    { label: 'Vocabulary', href: '/words', icon: 'Vocabulary' as const },
    { label: 'Progress', href: '/statistics', icon: 'Progress' as const },
  ],
  account: [{ label: 'Settings', href: '/settings', icon: 'Settings' as const }],
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
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
    <aside className="hidden h-screen w-60 flex-col border-r border-border bg-card text-card-foreground md:flex">
      <div className="border-b border-border p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons.Decks className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold tracking-wide">English-Learning-Tool</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-6 p-2">
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
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.99]',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.99]',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
      <div className="border-t border-border p-4">
        <UserNav user={session?.user ?? null} variant="sidebar" />
      </div>
    </aside>
  );
};

export default Sidebar;
